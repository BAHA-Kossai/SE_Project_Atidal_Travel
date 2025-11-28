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
    tripInfoRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ bookingId, updates, currentUserId }) {
    try {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found', status: 404 };
      }

      const { valid, errors, payload } = validateBookingInput(updates, {
        isUpdate: true
      });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      if (payload.info_id && payload.info_id !== booking.info_id) {
        return {
          success: false,
          error: 'info_id cannot be changed after booking creation',
          status: 400
        };
      }

      if (payload.trip_info) {
        return {
          success: false,
          error: 'trip_info cannot be modified through this endpoint',
          status: 400
        };
      }

      const patch = {};
      let statusChanged = false;

      if (
        payload.booking_status &&
        payload.booking_status !== booking.booking_status
      ) {
        if (!ALLOWED_STATUSES.includes(payload.booking_status)) {
          return {
            success: false,
            error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
            status: 400
          };
        }
        patch.booking_status = payload.booking_status;
        statusChanged = true;
      }

      if (payload.needs_visa_assistance !== undefined) {
        patch.needs_visa_assistance = Boolean(payload.needs_visa_assistance);
      }

      if (payload.branch_id !== undefined) {
        patch.branch_id = payload.branch_id;
      }

      if (payload.guide_id !== undefined) {
        patch.guide_id = payload.guide_id;
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
          status: updatedBooking.booking_status,
          changed_at: new Date().toISOString(),
          changed_by: currentUserId || booking.user_id || null
        });
      }

      if (payload.payer) {
        await this.updatePayer(bookingId, payload.payer);
      }

      if (payload.travelers) {
        if (booking.booking_status !== 'pending') {
          return {
            success: false,
            error: 'Traveler details can only be updated while booking is pending',
            status: 409
          };
        }
        await this.replaceTravelers(bookingId, payload.travelers);
      }

      const [payer, travelers, history, tripInfo] = await Promise.all([
        this.payerRepository.getByBookingId(bookingId),
        this.travelerRepository.getTravlersByPayer(booking.booking_id),
        this.statusHistoryRepository.getHistoryForBooking(bookingId),
        updatedBooking.info_id
          ? this.tripInfoRepository.getTripInfoById(updatedBooking.info_id)
          : Promise.resolve(null)
      ]);

      const trip = tripInfo
        ? await this.guidedTripsRepository.getTripByInfoId(updatedBooking.info_id)
        : null;

      const aggregated = buildBookingResponse({
        booking: updatedBooking,
        payer,
        travelers,
        history,
        trip,
        tripInfo
      });

      return { success: true, data: aggregated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updatePayer(bookingId, payerUpdates) {
    const patch = {};
    [
      'first_name',
      'last_name',
      'phone',
      'confirmed_at',
      'cancelled_at',
      'booking_notes'
    ].forEach((field) => {
      if (payerUpdates[field] !== undefined) {
        patch[field] = payerUpdates[field];
      }
    });

    if (Object.keys(patch).length > 0) {
      await this.payerRepository.updatePayer(bookingId, patch);
    }
  }

  async replaceTravelers(bookingId, travelers = []) {
    const existing = await this.travelerRepository.getTravlersByPayer(
      bookingId
    );
    for (const traveler of existing) {
      await this.travelerRepository.deleteTravler(
        traveler.traveler_id ?? traveler.travler_id
      );
    }

    const now = new Date().toISOString();
    for (const travelerInput of travelers) {
      await this.travelerRepository.createTravler({
        payer_id: bookingId,
        first_name: travelerInput.first_name,
        last_name: travelerInput.last_name,
        age: travelerInput.age,
        email: travelerInput.email,
        identity_number: travelerInput.identity_number,
        traveler_contact: travelerInput.traveler_contact,
        passport_number: travelerInput.passport_number,
        gender: travelerInput.gender,
        created_at: now
      });
    }
  }
}

export default UpdateBookingUseCase;

