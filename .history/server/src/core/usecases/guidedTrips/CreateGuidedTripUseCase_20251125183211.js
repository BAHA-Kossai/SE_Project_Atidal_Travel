import { validateGuidedTripInput } from '../../../api/validators/guidedTripValidator.js';
import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class CreateGuidedTripUseCase {
  constructor({
    guidedTripsRepository,
    destinationsRepository,
    guideRepository,
    branchesRepository,
    tripInfoRepository
  }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
    this.guideRepository = guideRepository;
    this.branchesRepository = branchesRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute(input) {
    try {
      const existingTrips = await this.guidedTripsRepository.getAllTrips();
      const { valid, errors } = validateGuidedTripInput(input, {
        existingTrips,
        currentDestinationId: input.destination_id
      });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      const destination = await this.destinationsRepository.getDestinationById(
        input.destination_id
      );
      if (!destination) {
        return { success: false, error: 'Destination not found', status: 404 };
      }

      const branch = await this.branchesRepository.getBranchById(
        input.branch_id
      );
      if (!branch) {
        return { success: false, error: 'Branch not found', status: 404 };
      }

      const guide = await this.guideRepository.getGuideById(input.guide_id);
      if (!guide) {
        return { success: false, error: 'Guide not found', status: 404 };
      }

      const now = new Date().toISOString();
      const tripRecord = await this.guidedTripsRepository.createTrip({
        trip_name: input.trip_name,
        trip_type: input.trip_type,
        destination_id: input.destination_id,
        branch_id: input.branch_id,
        guide_id: input.guide_id,
        description: input.description,
        highlights: input.highlights || null,
        cover_image_path: input.cover_image_path || null,
        agenda_pdf_path: input.agenda_pdf_path || null,
        created_at: now,
        updated_at: now
      });

      const { payload: tripInfoPayload } = validateTripInfoPayload(
        input.trip_info,
        { isUpdate: false }
      );
      const tripInfo = await this.tripInfoRepository.createTripInfo({
        ...tripInfoPayload,
        guided_trip_id: tripRecord.trip_id,
        branch_id: tripInfoPayload.branch_id ?? tripRecord.branch_id,
        destination_id:
          tripInfoPayload.destination_id ?? tripRecord.destination_id,
        guide_id: tripInfoPayload.guide_id ?? tripRecord.guide_id,
        created_at: now,
        updated_at: now
      });

      return {
        success: true,
        data: {
          ...tripRecord,
          departures: [tripInfo]
        },
        status: 201
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateGuidedTripUseCase;

