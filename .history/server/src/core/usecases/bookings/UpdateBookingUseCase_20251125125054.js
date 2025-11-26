import { validateBookingInput } from '../../../api/validators/bookingValidator.js';
import { buildBookingResponse } from './helpers.js';

const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export class UpdateBookingUseCase {
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

  async execute({ bookingId, updates, currentUserId }) {
    try {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found', status: 404 };
      }

      const mergedInput = { ...updates, booking_type: booking.booking_type };
      const { valid, errors } = validateBookingInput(mergedInput, {
        isUpdate: true
      });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      if (
        updates.trip_id &&
        updates.trip_id !== booking.trip_id
      ) {
        return {
          success: false,
          error: 'Trip cannot be changed after booking creation',
          status: 400
        };
      }

      if (
        updates.destination_id &&
        updates.destination_id !== booking.destination_id
      ) {
        return {
          success: false,
          error: 'Destination cannot be changed after booking creation',
          status: 400
        };
      }

      const patch = {};
      let statusChanged = false;
      if (
        updates.booking_status &&
        updates.booking_status !== booking.booking_status
      ) {
        if (!ALLOWED_STATUSES.includes(updates.booking_status)) {
          return {
            success: false,
            error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
            status: 400
          };
        }
        patch.booking_status = updates.booking_status;
        statusChanged = true;
      }

      if (updates.total_price && updates.total_price !== booking.total_price) {
        patch.total_price = updates.total_price;
      }

      let updatedBooking = booking;
      if (Object.keys(patch).length > 0) {
        updatedBooking = await this.bookingRepository.updateBooking(
          bookingId,
          patch
        );
      }

      if (statusChanged) {
        await this.statusHistoryRepository.addHistory({
          booking_id: bookingId,
          status: patch.booking_status,
          changed_at: new Date().toISOString(),
          changed_by: currentUserId || booking.created_by || null
        });
      }

      if (
        (updates.responsible_traveler || updates.other_travelers) &&
        booking.booking_status !== 'pending'
      ) {
        return {
          success: false,
          error: 'Traveler details can only be updated while booking is pending',
          status: 409
        };
      }

      let travelers = await this.travelerRepository.getTravlersByBooking(
        bookingId
      );
      const responsibleTraveler = travelers.find(
        (traveler) => traveler.responsible_booking_id === booking.booking_id
      );

      if (updates.responsible_traveler && responsibleTraveler) {
        await this.travelerRepository.updateTravler(
          responsibleTraveler.travler_id,
          {
            first_name: updates.responsible_traveler.first_name,
            last_name: updates.responsible_traveler.last_name,
            email: updates.responsible_traveler.email,
            phone: updates.responsible_traveler.phone,
            passport_number: updates.responsible_traveler.passport_number,
            gender: updates.responsible_traveler.gender
          }
        );
      }

      if (Array.isArray(updates.other_travelers)) {
        for (const travelerUpdate of updates.other_travelers) {
          if (!travelerUpdate.travler_id) {
            return {
              success: false,
              error: 'travler_id is required when updating other travelers',
              status: 400
            };
          }
          await this.travelerRepository.updateTravler(
            travelerUpdate.travler_id,
            {
              first_name: travelerUpdate.first_name,
              last_name: travelerUpdate.last_name,
              email: travelerUpdate.email,
              phone: travelerUpdate.phone,
              passport_number: travelerUpdate.passport_number,
              gender: travelerUpdate.gender
            }
          );
        }
      }

      travelers = await this.travelerRepository.getTravlersByBooking(bookingId);
      const payer = await this.payerRepository.getByBookingId(bookingId);
      const history = await this.statusHistoryRepository.getHistoryForBooking(
        bookingId
      );

      const trip = updatedBooking.trip_id
        ? await this.guidedTripsRepository.getTripById(updatedBooking.trip_id)
        : null;
      const destination = updatedBooking.destination_id
        ? await this.destinationsRepository.getDestinationById(
            updatedBooking.destination_id
          )
        : null;

      const aggregated = buildBookingResponse({
        booking: updatedBooking,
        payer,
        travelers,
        history,
        trip,
        destination
      });

      return { success: true, data: aggregated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateBookingUseCase;

