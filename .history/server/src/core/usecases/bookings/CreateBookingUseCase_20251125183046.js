import bcrypt from 'bcryptjs';
import { validateBookingInput } from '../../../api/validators/bookingValidator.js';
import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';
import { buildBookingResponse } from './helpers.js';

const DEFAULT_STATUS = 'pending';

export class CreateBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    tripInfoRepository,
    destinationsRepository,
    branchesRepository,
    guideRepository,
    guidedTripsRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.tripInfoRepository = tripInfoRepository;
    this.destinationsRepository = destinationsRepository;
    this.branchesRepository = branchesRepository;
    this.guideRepository = guideRepository;
    this.guidedTripsRepository = guidedTripsRepository;
  }

  async execute(input) {
    try {
      const { valid, errors } = validateBookingInput(input);
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
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

      const tripInfoResult = await this.resolveTripInfo(input);
      if (!tripInfoResult.success) {
        return tripInfoResult;
      }
      let tripInfo = tripInfoResult.tripInfo;
      const createdTripInfo =
        tripInfoResult.createdTripInfo === true &&
        tripInfo?.trip_info_id !== undefined;

      if (
        typeof tripInfo.available_seats === 'number' &&
        tripInfo.available_seats < travelerCount
      ) {
        return {
          success: false,
          error: 'Not enough available seats for this departure',
          status: 400
        };
      }

      const destination = tripInfo.destination_id
        ? await this.destinationsRepository.getDestinationById(
            tripInfo.destination_id
          )
        : null;

      let guidedTrip = null;
      if (tripInfo.guided_trip_id) {
        guidedTrip = await this.guidedTripsRepository.getTripById(
          tripInfo.guided_trip_id
        );
      }

      const now = new Date().toISOString();
      const bookingRecord = {
        trip_info_id: tripInfo.trip_info_id,
        branch_id: tripInfo.branch_id,
        guide_id: tripInfo.guide_id || guidedTrip?.guide_id || input.guide_id || null,
        user_id: input.user_id || null,
        booking_status: input.booking_status || DEFAULT_STATUS,
        visa_assistance: Boolean(input.visa_assistance),
        created_by: input.created_by || null,
        created_at: now,
        updated_at: now
      };

      const createdEntities = {
        booking: null,
        payer: null,
        responsible: null,
        travelers: [],
        tripInfoId: tripInfo.trip_info_id,
        lockedSeats: travelerCount,
        seatsLocked: false,
        tripInfoCreated: createdTripInfo
      };

      try {
        await this.tripInfoRepository.adjustAvailableSeats(
          tripInfo.trip_info_id,
          -travelerCount
        );
        createdEntities.seatsLocked = true;
        tripInfo = await this.tripInfoRepository.getTripInfoById(
          tripInfo.trip_info_id
        );

        const booking = await this.bookingRepository.createBooking(
          bookingRecord
        );
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
          trip: guidedTrip,
          destination: destination || null,
          tripInfo
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

  async resolveTripInfo(input) {
    if (input.trip_info_id) {
      const tripInfo = await this.tripInfoRepository.getTripInfoById(
        input.trip_info_id
      );
      if (!tripInfo) {
        return {
          success: false,
          error: 'Referenced trip info not found',
          status: 404
        };
      }
      return { success: true, tripInfo, createdTripInfo: false };
    }

    if (!input.trip_info) {
      return {
        success: false,
        error: 'trip_info details are required for custom bookings',
        status: 400
      };
    }

    const { valid, errors, payload } = validateTripInfoPayload(
      input.trip_info,
      { isUpdate: false }
    );
    if (!valid) {
      return { success: false, error: errors.join(', '), status: 400 };
    }

    const destination = await this.destinationsRepository.getDestinationById(
      payload.destination_id
    );
    if (!destination) {
      return { success: false, error: 'Destination not found', status: 404 };
    }

    const branchId = payload.branch_id ?? input.branch_id;
    if (!branchId) {
      return {
        success: false,
        error: 'branch_id is required when creating a custom departure',
        status: 400
      };
    }

    const branch = await this.branchesRepository.getBranchById(branchId);
    if (!branch) {
      return { success: false, error: 'Branch not found', status: 404 };
    }

    if (payload.guide_id) {
      const guide = await this.guideRepository.getGuideById(payload.guide_id);
      if (!guide) {
        return { success: false, error: 'Guide not found', status: 404 };
      }
    }

    const now = new Date().toISOString();
    const tripInfo = await this.tripInfoRepository.createTripInfo({
      ...payload,
      branch_id: branchId,
      created_at: now,
      updated_at: now
    });

    return { success: true, tripInfo, createdTripInfo: true };
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

      if (entities.seatsLocked && entities.tripInfoId) {
        await this.tripInfoRepository.adjustAvailableSeats(
          entities.tripInfoId,
          entities.lockedSeats
        );
      }

      if (entities.tripInfoCreated && entities.tripInfoId) {
        await this.tripInfoRepository.deleteTripInfo(entities.tripInfoId);
      }
    } catch (cleanupError) {
      // eslint-disable-next-line no-console
      console.error('Rollback failed', cleanupError);
    }
  }
}

export default CreateBookingUseCase;
