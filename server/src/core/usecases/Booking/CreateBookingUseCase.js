/**
 * @file        CreateBookingUseCase.js
 * @description Use case for creating bookings with payer and travelers information.
 */

class CreateBookingUseCase {
  constructor(bookingsRepository, payerRepository, travelersRepository) {
    this.bookingsRepository = bookingsRepository;
    this.payerRepository = payerRepository;
    this.travelersRepository = travelersRepository;
  }

  async execute(bookingData) {
    // Validate required fields
    if (!bookingData.type) {
      throw new Error('Booking type is required for all bookings');
    }
    if (!bookingData.destination_country) {
      throw new Error('Destination country is required');
    }

    // Validate booking types
    const validTypes = ['normal', 'guided_trip', 'umrah_trip'];
    if (!validTypes.includes(bookingData.type)) {
      throw new Error('Invalid booking type. Must be: normal, guided_trip, or umrah_trip');
    }

    // Validate payer information
    if (!bookingData.payer_info) {
      throw new Error('Payer information is required');
    }

    const { payer_info, travelers_info = [] } = bookingData;

    // Validate payer required fields
    if (!payer_info.first_name || !payer_info.last_name || !payer_info.phone) {
      throw new Error('Payer first name, last name, and phone number are required');
    }

    // Validate travelers if provided
    travelers_info.forEach((traveler, index) => {
      if (!traveler.first_name || !traveler.last_name || !traveler.age || !traveler.identity_number || !traveler.travler_contact) {
        throw new Error(`Traveler ${index + 1} is missing required fields (first name, last name, age, identity number, traveler contact)`);
      }
    });

    try {
      // Step 1: Create the booking
      const bookingToCreate = {
        created_at: new Date().toISOString(),
        user_id: bookingData.user_id || null,
        booking_status: bookingData.booking_status || 'pending',
        type: bookingData.type,
        destination_country: bookingData.destination_country,
        price: bookingData.price,
        trip_date: bookingData.trip_date,
        departure_time: bookingData.departure_time,
        returning_time: bookingData.returning_time,
        updated_at: new Date().toISOString(),
        duration_days: bookingData.duration_days,
        branch_id: bookingData.branch_id || null,
        guide_id: bookingData.guide_id || null,
        destination_city: bookingData.destination_city || null,
        hotel_stars: bookingData.hotel_stars || null,
        no_hotel_needed: bookingData.no_hotel_needed || false,
        needs_visa_assistance: bookingData.needs_visa_assistance || false,
      };

      const newBooking = await this.bookingsRepository.createBooking(bookingToCreate);

      // Step 2: Create the payer using booking_id as primary key
      const payerToCreate = {
        booking_id: newBooking.booking_id, // Primary key
        first_name: payer_info.first_name,
        last_name: payer_info.last_name,
        phone: payer_info.phone, // Note: field name is 'phone' not 'phone_number'
        confirmed_at: payer_info.confirmed_at || null,
        canceled_at: payer_info.canceled_at || null,
        created_at: new Date().toISOString(),
        booking_notes: payer_info.booking_notes || null      
      };

      const newPayer = await this.payerRepository.createPayer(payerToCreate);

      // Step 3: Create travelers if any
      let createdTravelers = [];
      if (travelers_info.length > 0) {
        const travelersToCreate = travelers_info.map(traveler => ({
          created_at: new Date().toISOString(),
          payer_id: newPayer.booking_id, // Use booking_id as payer_id since it's the primary key
          first_name: traveler.first_name,
          last_name: traveler.last_name,
          age: traveler.age,
          identity_number: traveler.identity_number,
          travler_contact: traveler.travler_contact, // Note: typo in field name 'travler_contact'
          passport_number: traveler.passport_number || null,
          gender: traveler.gender || null,
        }));

        createdTravelers = await this.travelersRepository.createTravelersBatch(travelersToCreate);
      }

      // If payer is traveler, add them to travelers table as well
      if (payer_info.is_traveler) {
        const payerAsTraveler = {
          created_at: new Date().toISOString(),
          payer_id: newPayer.booking_id, // Use booking_id as payer_id
          first_name: payer_info.first_name,
          last_name: payer_info.last_name,
          age: payer_info.age || 18,
          identity_number: payer_info.identity_number || 111,
          travler_contact: payer_info.phone, 
          passport_number: payer_info.passport_number || 111,
          gender: payer_info.gender || 'male',
        };

        await this.travelersRepository.createTraveler(payerAsTraveler);
        createdTravelers.push(payerAsTraveler);
      }

      return {
        booking: newBooking,
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