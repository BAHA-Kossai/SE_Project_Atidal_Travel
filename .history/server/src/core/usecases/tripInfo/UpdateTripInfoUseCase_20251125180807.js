import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class UpdateTripInfoUseCase {
  constructor({
    tripInfoRepository,
    destinationsRepository,
    branchesRepository,
    guideRepository
  }) {
    this.tripInfoRepository = tripInfoRepository;
    this.destinationsRepository = destinationsRepository;
    this.branchesRepository = branchesRepository;
    this.guideRepository = guideRepository;
  }

  async execute({ tripInfoId, updates }) {
    try {
      const existing = await this.tripInfoRepository.getTripInfoById(tripInfoId);
      if (!existing) {
        return { success: false, error: 'Trip info not found', status: 404 };
      }

      const { valid, errors, payload } = validateTripInfoPayload(updates, {
        isUpdate: true
      });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      const effective = { ...payload };
      const usedSeats =
        (existing.max_seats || 0) - (existing.available_seats || 0);

      if (
        effective.max_seats !== undefined &&
        effective.max_seats < usedSeats
      ) {
        return {
          success: false,
          error: 'max_seats cannot be less than seats already booked',
          status: 409
        };
      }

      if (
        effective.available_seats !== undefined &&
        effective.max_seats !== undefined &&
        effective.available_seats > effective.max_seats
      ) {
        return {
          success: false,
          error: 'available_seats cannot exceed max_seats',
          status: 400
        };
      }

      if (
        effective.available_seats !== undefined &&
        effective.available_seats < usedSeats
      ) {
        return {
          success: false,
          error:
            'available_seats cannot be less than seats already consumed by bookings',
          status: 409
        };
      }

      if (effective.destination_id) {
        const destination =
          await this.destinationsRepository.getDestinationById(
            effective.destination_id
          );
        if (!destination) {
          return { success: false, error: 'Destination not found', status: 404 };
        }
      }

      if (effective.branch_id) {
        const branch = await this.branchesRepository.getBranchById(
          effective.branch_id
        );
        if (!branch) {
          return { success: false, error: 'Branch not found', status: 404 };
        }
      }

      if (effective.guide_id) {
        const guide = await this.guideRepository.getGuideById(
          effective.guide_id
        );
        if (!guide) {
          return { success: false, error: 'Guide not found', status: 404 };
        }
      }

      const updated = await this.tripInfoRepository.updateTripInfo(
        tripInfoId,
        effective
      );
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateTripInfoUseCase;

