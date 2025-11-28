export const buildBookingResponse = ({
  booking,
  payer,
  travelers = [],
  history = [],
  trip,
  tripInfo
}) => {
  if (!booking) {
    return null;
  }

  return {
    ...booking,
    payer: payer
      ? {
          booking_id: payer.booking_id,
          first_name: payer.first_name,
          last_name: payer.last_name,
          phone: payer.phone,
          confirmed_at: payer.confirmed_at,
          cancelled_at: payer.cancelled_at,
          booking_notes: payer.booking_notes,
          created_at: payer.created_at
        }
      : null,
    travelers,
    trip: trip || null,
    trip_info: tripInfo || null,
    status_history: history
  };
};

