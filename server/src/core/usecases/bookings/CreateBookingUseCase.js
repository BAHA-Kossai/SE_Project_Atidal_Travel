import { validateBookingInput } from "../../../api/validators/bookingValidator.js";
import { validateTripInfoPayload } from "../../../api/validators/tripInfoValidator.js";
import { buildBookingResponse } from "./helpers.js";

const DEFAULT_STATUS = "pending";

export class CreateBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    tripInfoRepository,
    guidedTripsRepository,
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.tripInfoRepository = tripInfoRepository;
    this.guidedTripsRepository = guidedTripsRepository;
  }

  async execute(input) {
    try {
      const { valid, errors, payload } = validateBookingInput(input);
      if (!valid) {
        return { success: false, error: errors.join(", "), status: 400 };
      }

      const travelers = Array.isArray(payload.travelers)
        ? payload.travelers
        : [];
      const travelerCount = travelers.length;

      const now = new Date().toISOString();
      const { tripInfo, infoId, created } = await this.resolveTripInfo(
        payload,
        now
      );

      const guidedTrip = await this.guidedTripsRepository.getTripByInfoId(
        infoId
      );
      if (
        guidedTrip &&
        Number(guidedTrip.available_seats ?? 0) < travelerCount
      ) {
        return {
          success: false,
          error: "Not enough available seats for this guided trip",
          status: 400,
        };
      }

      const rollbackState = {
        booking: null,
        travelerIds: [],
        payerCreated: false,
        guidedTrip,
        seatsDelta: 0,
        customTripInfoId: created ? infoId : null,
      };

      try {
        const booking = await this.bookingRepository.createBooking({
          info_id: infoId,
          user_id: payload.user_id || null,
          branch_id: payload.branch_id || null,
          guide_id: payload.guide_id || guidedTrip?.guide_id || null,
          booking_status: payload.booking_status || DEFAULT_STATUS,
          needs_visa_assistance: Boolean(payload.needs_visa_assistance),
          created_at: now,
          updated_at: now,
        });
        rollbackState.booking = booking;

        if (guidedTrip) {
          await this.guidedTripsRepository.adjustAvailableSeats(
            guidedTrip.trip_id,
            -travelerCount
          );
          rollbackState.seatsDelta = travelerCount;
        }

        const payer = await this.payerRepository.createPayer({
          booking_id: booking.booking_id,
          first_name: payload.payer.first_name,
          last_name: payload.payer.last_name,
          phone: payload.payer.phone,
          confirmed_at: payload.payer.confirmed_at || null,
          cancelled_at: payload.payer.cancelled_at || null,
          booking_notes: payload.payer.booking_notes || null,
          created_at: payload.payer.created_at || now,
        });
        rollbackState.payerCreated = true;

        const travelerRecords = [];
        for (const travelerInput of travelers) {
          const traveler = await this.travelerRepository.createTravler({
            payer_id: booking.booking_id,
            first_name: travelerInput.first_name,
            last_name: travelerInput.last_name,
            age: travelerInput.age,
            email: travelerInput.email,
            identity_number: travelerInput.identity_number,
            traveler_contact: travelerInput.traveler_contact,
            passport_number: travelerInput.passport_number,
            gender: travelerInput.gender,
            created_at: now,
          });
          rollbackState.travelerIds.push(
            traveler.traveler_id ?? traveler.travler_id
          );
          travelerRecords.push(traveler);
        }

        await this.statusHistoryRepository.addHistory({
          booking_id: booking.booking_id,
          status: booking.booking_status,
          changed_at: now,
          changed_by: payload.user_id || null,
        });

        const history = await this.statusHistoryRepository.getHistoryForBooking(
          booking.booking_id
        );

        const response = buildBookingResponse({
          booking,
          payer,
          travelers: travelerRecords,
          history,
          trip: guidedTrip,
          tripInfo,
        });

        return { success: true, data: response, status: 201 };
      } catch (creationError) {
        await this.rollback(rollbackState);
        throw creationError;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async resolveTripInfo(payload, timestamp) {
    if (payload.info_id) {
      const existing = await this.tripInfoRepository.getTripInfoById(
        payload.info_id
      );
      if (!existing) {
        throw new Error("Referenced trip info not found");
      }
      return {
        tripInfo: existing,
        infoId: existing.info_id ?? existing.infoId,
        created: false,
      };
    }

    if (!payload.trip_info) {
      throw new Error("trip_info payload is required for custom bookings");
    }

    const {
      payload: tripInfoPayload,
      valid,
      errors,
    } = validateTripInfoPayload(payload.trip_info, { isUpdate: false });
    if (!valid) {
      throw new Error(errors.join(", "));
    }

    const created = await this.tripInfoRepository.createTripInfo({
      ...tripInfoPayload,
      created_at: timestamp,
      updated_at: timestamp,
    });

    return {
      tripInfo: created,
      infoId: created.info_id ?? created.infoId,
      created: true,
    };
  }

  async rollback({
    booking,
    travelerIds = [],
    payerCreated,
    guidedTrip,
    seatsDelta,
    customTripInfoId,
  }) {
    try {
      for (const travelerId of travelerIds) {
        if (travelerId) {
          await this.travelerRepository.deleteTravler(travelerId);
        }
      }

      if (payerCreated && booking) {
        await this.payerRepository.deletePayer(booking.booking_id);
      }

      if (booking) {
        await this.bookingRepository.deleteBooking(booking.booking_id);
      }

      if (guidedTrip && seatsDelta) {
        await this.guidedTripsRepository.adjustAvailableSeats(
          guidedTrip.trip_id,
          seatsDelta
        );
      }

      if (customTripInfoId) {
        await this.tripInfoRepository.deleteTripInfo(customTripInfoId);
      }
    } catch (rollbackError) {
      // eslint-disable-next-line no-console
      console.error("Booking rollback failed", rollbackError);
    }
  }
}

export default CreateBookingUseCase;
