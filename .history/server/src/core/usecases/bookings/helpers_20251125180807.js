export const buildBookingResponse = ({
  booking,
  payer,
  travelers = [],
  history = [],
  trip,
  destination,
  tripInfo
}) => {
  if (!booking) {
    return null;
  }

  const responsibleTraveler = travelers.find(
    (traveler) => traveler.responsible_booking_id === booking.booking_id
  );

  const otherTravelers = travelers.filter(
    (traveler) =>
      responsibleTraveler &&
      traveler.responsible_id === responsibleTraveler.travler_id
  );

  return {
    ...booking,
    payer: payer
      ? {
          payer_id: payer.payer_id,
          booking_id: payer.booking_id,
          first_name: payer.first_name,
          last_name: payer.last_name,
          email: payer.email,
          phone: payer.phone,
          created_at: payer.created_at
        }
      : null,
    responsible_traveler: responsibleTraveler || null,
    other_travelers: otherTravelers,
    trip: trip || null,
    destination: destination || null,
    trip_info: tripInfo || null,
    status_history: history
  };
};

