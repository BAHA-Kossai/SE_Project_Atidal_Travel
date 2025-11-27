import bcrypt from 'bcryptjs';
import { validateBookingInput } from '../../../api/validators/bookingValidator.js';
import { buildBookingResponse } from './helpers.js';

const ALLOWED_TYPES = ['guided_trip', 'umrah', 'custom_destination'];

export class CreateBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    guidedTripsRepository,
    destinationsRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
  }

  async execute(input) {
    try {
      const { valid, errors } = validateBookingInput(input);
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      if (!ALLOWED_TYPES.includes(input.booking_type)) {
        return { success: false, error: 'Unsupported booking type', status: 400 };
      }

      const payerExists = await this.payerRepository.findByEmail(
        input.payer.email
      );
      if (payerExists) {
        return {
          success: false,
          error: 'A payer with this email already exists',
          status: 409
        };
      }

      const otherTravelers = Array.isArray(input.other_travelers)
        ? input.other_travelers
        : [];
      const travelerCount = 1 + otherTravelers.length;

      let trip = null;
      if (input.booking_type === 'guided_trip' || input.booking_type === 'umrah') {
        if (!input.trip_id) {
          return {
            success: false,
            error: 'trip_id is required for guided trips and umrah bookings',
            status: 400
          };
        }
        trip = await this.guidedTripsRepository.getTripById(input.trip_id);
        if (!trip) {
          return {
            success: false,
            error: 'Referenced guided trip was not found',
            status: 404
          };
        }
        if (
          typeof trip.available_seats === 'number' &&
          trip.available_seats < travelerCount
        ) {
          return {
            success: false,
            error: 'Not enough available seats for this trip',
            status: 400
          };
        }
      }

      let destination = null;
      if (input.destination_id) {
        destination = await this.destinationsRepository.getDestinationById(
          input.destination_id
        );
        if (!destination) {
          return { success: false, error: 'Destination not found', status: 404 };
        }
      } else if (
        input.booking_type === 'custom_destination' &&
        !input.destination_info
      ) {
        return {
          success: false,
          error: 'destination_info is required for custom destinations',
          status: 400
        };
      }

      const now = new Date().toISOString();
      const bookingRecord = {
        booking_type: input.booking_type,
        trip_id: input.trip_id || null,
        destination_id: input.destination_id || null,
        destination_info: input.destination_info || null,
        booking_status: input.booking_status || 'pending',
        total_price:
          input.total_price ||
          trip?.price ||
          input.destination_info?.estimated_price ||
          0,
        created_by: input.created_by || null,
        booking_date: input.booking_date || now,
        created_at: now
      };

      const createdEntities = {
        booking: null,
        payer: null,
        responsible: null,
        travelers: [],
        tripSnapshot: trip
          ? { trip_id: trip.trip_id, available_seats: trip.available_seats }
          : null
      };

      try {
        const booking = await this.bookingRepository.createBooking(bookingRecord);
        createdEntities.booking = booking;

        const password_hash = await bcrypt.hash(input.payer.password, 10);
        const payer = await this.payerRepository.createPayer({
          booking_id: booking.booking_id,
          first_name: input.payer.first_name,
          last_name: input.payer.last_name,
          email: input.payer.email,
          phone: input.payer.phone,
          password_hash,
          created_at: now
        });
        createdEntities.payer = payer;

        const responsibleTraveler =
          await this.travelerRepository.createTravler({
            booking_id: booking.booking_id,
            responsible_booking_id: booking.booking_id,
            first_name: input.responsible_traveler.first_name,
            last_name: input.responsible_traveler.last_name,
            email: input.responsible_traveler.email,
            phone: input.responsible_traveler.phone,
            passport_number: input.responsible_traveler.passport_number,
            gender: input.responsible_traveler.gender,
            created_at: now
          });
        createdEntities.responsible = responsibleTraveler;

        for (const travelerInput of otherTravelers) {
          const traveler = await this.travelerRepository.createTravler({
            booking_id: booking.booking_id,
            responsible_id: responsibleTraveler.travler_id,
            first_name: travelerInput.first_name,
            last_name: travelerInput.last_name,
            email: travelerInput.email,
            phone: travelerInput.phone,
            passport_number: travelerInput.passport_number,
            gender: travelerInput.gender,
            created_at: now
          });
          createdEntities.travelers.push(traveler);
        }

        await this.statusHistoryRepository.addHistory({
          booking_id: booking.booking_id,
          status: booking.booking_status,
          changed_at: now,
          changed_by: input.created_by || null
        });

        if (trip) {
          await this.guidedTripsRepository.updateTrip(trip.trip_id, {
            available_seats: trip.available_seats - travelerCount
          });
        }

        const aggregated = buildBookingResponse({
          booking,
          payer,
          travelers: [
            responsibleTraveler,
            ...createdEntities.travelers
          ],
          history: await this.statusHistoryRepository.getHistoryForBooking(
            booking.booking_id
          ),
          trip,
          destination: destination || null
        });

        return { success: true, data: aggregated, status: 201 };
      } catch (innerError) {
        await this.rollback(createdEntities);
        throw innerError;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async rollback(entities) {
    try {
      for (const traveler of entities.travelers || []) {
        await this.travelerRepository.deleteTravler(traveler.travler_id);
      }

      if (entities.responsible) {
        await this.travelerRepository.deleteTravler(
          entities.responsible.travler_id
        );
      }

      if (entities.payer) {
        await this.payerRepository.deletePayer(entities.payer.payer_id);
      }

      if (entities.booking) {
        await this.bookingRepository.deleteBooking(entities.booking.booking_id);
      }

      if (entities.tripSnapshot) {
        await this.guidedTripsRepository.updateTrip(
          entities.tripSnapshot.trip_id,
          { available_seats: entities.tripSnapshot.available_seats }
        );
      }
    } catch (cleanupError) {
      // eslint-disable-next-line no-console
      console.error('Rollback failed', cleanupError);
    }
  }
}

export default CreateBookingUseCase;

