/**
 * @file TripInfo.js
 * @description Shared departure entity between guided trips and bookings.
 */

class TripInfo {
  constructor({
    infoId = null,
    price,
    tripDate,
    returningDate,
    departureTime,
    returningTime,
    destinationCountry,
    destinationCity,
    noHotelNeeded = false,
    hotelStars = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.infoId = infoId;
    this.price = Number(price);
    this.tripDate = tripDate;
    this.returningDate = returningDate;
    this.departureTime = departureTime;
    this.returningTime = returningTime;
    this.destinationCountry = destinationCountry;
    this.destinationCity = destinationCity;
    this.noHotelNeeded = Boolean(noHotelNeeded);
    this.hotelStars =
      hotelStars !== undefined && hotelStars !== null ? Number(hotelStars) : null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new TripInfo({
      infoId: record.info_id,
      price: record.price,
      tripDate: record.trip_date,
      returningDate: record.returning_date,
      departureTime: record.departure_time,
      returningTime: record.returning_time,
      destinationCountry: record.destination_country,
      destinationCity: record.destination_city,
      noHotelNeeded: record.no_hotel_needed,
      hotelStars: record.hotel_stars,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      info_id: this.infoId,
      price: this.price,
      trip_date: this.tripDate,
      returning_date: this.returningDate,
      departure_time: this.departureTime,
      returning_time: this.returningTime,
      destination_country: this.destinationCountry,
      destination_city: this.destinationCity,
      no_hotel_needed: this.noHotelNeeded,
      hotel_stars: this.hotelStars,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

export default TripInfo;
