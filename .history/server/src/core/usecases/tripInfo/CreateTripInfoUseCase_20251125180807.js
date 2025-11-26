import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class CreateTripInfoUseCase {
  constructor({
    tripInfoRepository,
    guidedTripsRepository,
    destinationsRepository,
    branchesRepository,
    guideRepository
  }) {
    this.tripInfoRepository = tripInfoRepository;
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
    this.branchesRepository = branchesRepository;
    this.guideRepository = guideRepository;
  }

  async execute(input) {
    try {
      const { valid, errors, payload } = validateTripInfoPayload(input);
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      if (payload.guided_trip_id) {
        const trip = await this.guidedTripsRepository.getTripById(
          payload.guided_trip_id
        );
        if (!trip) {
          return {
            success: false,
            error: 'Referenced guided trip does not exist',
            status: 404
          };
        }
        // default guide/branch from trip if not provided
        payload.branch_id = payload.branch_id ?? trip.branch_id ?? null;
        payload.guide_id = payload.guide_id ?? trip.guide_id ?? null;
        payload.destination_id = payload.destination_id ?? trip.destination_id ?? null;
      }

      if (payload.destination_id) {
        const destination = await this.destinationsRepository.getDestinationById(
          payload.destination_id
        );
        if (!destination) {
          return { success: false, error: 'Destination not found', status: 404 };
        }
      }

      if (payload.branch_id) {
        const branch = await this.branchesRepository.getBranchById(payload.branch_id);
        if (!branch) {
          return { success: false, error: 'Branch not found', status: 404 };
        }
      }

      if (payload.guide_id) {
        const guide = await this.guideRepository.getGuideById(payload.guide_id);
        if (!guide) {
          return { success: false, error: 'Guide not found', status: 404 };
        }
      }

      const now = new Date().toISOString();
      const created = await this.tripInfoRepository.createTripInfo({
        ...payload,
        created_at: now,
        updated_at: now
      });

      return { success: true, data: created, status: 201 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateTripInfoUseCase;

