/**
 * @file        CreateBookingUseCase.js
 * @description Use case for creating bookings with payer, travelers, and trip information.
 *              Orchestrates the creation of booking, trip info, payer, and traveler records.
 *              Handles validation and maintains data integrity across related entities.
 *
 * @requires    CreateBookingValidator - Validation for booking data
 * @requires    BookingsRepository     - Access to booking database operations
 * @requires    PayerRepository        - Access to payer database operations
 * @requires    TravelersRepository    - Access to travelers database operations
 * @requires    TripInfoRepository     - Access to trip info database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import { CreateBookingValidator } from '../../../api/validators/Booking/CreateBookingValidator.js';

class CreateBookingUseCase {
  constructor(bookingsRepository, payerRepository, travelersRepository, tripInfoRepository) {
    this.bookingsRepository = bookingsRepository;
    this.payerRepository = payerRepository;
    this.travelersRepository = travelersRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute(bookingData) {
    const validationErrors = CreateBookingValidator.validate(bookingData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(' '));
    }

    const { payer_info, travelers_info = [] } = bookingData;

    try {
      const tripInfoToCreate = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        price: bookingData.price || 0,
        trip_date: bookingData.trip_date,
        returning_date: bookingData.returning_date || bookingData.trip_date,
        departure_time: bookingData.departure_time,
        returning_time: bookingData.returning_time,
        destination_country: bookingData.destination_country,
        destination_city: bookingData.destination_city || 'none',
        no_hotel_needed: bookingData.no_hotel_needed || false,
        hotel_stars: bookingData.hotel_stars || null,
        duration: bookingData.duration_days || 7
      };

      const newTripInfo = await this.tripInfoRepository.createTripInfo(tripInfoToCreate);

      const bookingToCreate = {
        created_at: new Date().toISOString(),
        user_id: bookingData.user_id || null,
        booking_status: bookingData.booking_status || 'pending',
        type: bookingData.type,
        info_id: newTripInfo.info_id, 
        branch_id: bookingData.branch_id || null,
        guide_id: bookingData.guide_id || null,
        needs_visa_assistance: bookingData.needs_visa_assistance || false,
        updated_at: new Date().toISOString()
      };

      const newBooking = await this.bookingsRepository.createBooking(bookingToCreate);

      const payerToCreate = {
        booking_id: newBooking.booking_id, 
        first_name: payer_info.first_name,
        last_name: payer_info.last_name,
        phone: payer_info.phone,
        confirmed_at: payer_info.confirmed_at || null,
        canceled_at: payer_info.canceled_at || null,
        created_at: new Date().toISOString(),
        booking_notes: payer_info.booking_notes || null      
      };

      const newPayer = await this.payerRepository.createPayer(payerToCreate);

      let createdTravelers = [];
      if (travelers_info.length > 0) {
        const travelersToCreate = travelers_info.map(traveler => ({
          created_at: new Date().toISOString(),
          payer_id: newPayer.booking_id, 
          first_name: traveler.first_name,
          last_name: traveler.last_name,
          age: traveler.age,
          identity_number: traveler.identity_number,
          travler_contact: traveler.travler_contact,
          passport_number: traveler.passport_number,
          gender: traveler.gender,
        }));

        createdTravelers = await this.travelersRepository.createTravelersBatch(travelersToCreate);
      }

      if (payer_info.is_traveler) {
        const payerAsTraveler = {
          created_at: new Date().toISOString(),
          payer_id: newPayer.booking_id,
          first_name: payer_info.first_name,
          last_name: payer_info.last_name,
          age: payer_info.age, 
          identity_number: payer_info.identity_number, 
          travler_contact: payer_info.phone, 
          passport_number: payer_info.passport_number,
          gender: payer_info.gender,
        };

        const payerTraveler = await this.travelersRepository.createTraveler(payerAsTraveler);
        createdTravelers.push(payerTraveler);
      }

      return {
        booking: newBooking,
        trip_info: newTripInfo,
        payer: newPayer,
        travelers: createdTravelers,
        total_travelers: createdTravelers.length
      };

    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }
}

export default CreateBookingUseCase;