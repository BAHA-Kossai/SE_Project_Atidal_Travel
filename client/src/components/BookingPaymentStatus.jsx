import { useState } from "react";
import Swal from "sweetalert2";
import { updateBookingStatus } from "../../api/bookings.js";
import { createPayer } from "../../api/payers.js";

const paymentStatus = Object.freeze({
    PAID: "paid",
    UNPAID: "unpaid"
});

/**
 * Status dropdown component for inline booking status updates
 */
export const BookingPaymentStatus = ({ booking, onStatusChange, isDisabled = false }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(booking.payment_status || paymentStatus.UNPAID);

    const handleStatusChange = async (newStatus) => {
        try {
            setLoading(true);
            
            // Update booking payment status
            await updateBookingStatus(booking.booking_id, newStatus);
            
            // If status changed to 'paid', create a payer record
            if (newStatus === paymentStatus.PAID && status !== paymentStatus.PAID) {
                try {
                    // Get user info
                    const userInfo = booking.Users || booking.user || {};
                    
                    // Create payer record
                    await createPayer({
                        booking_id: booking.booking_id,
                        traveler_id: booking.traveler_id || null,
                        first_name: userInfo.first_name || 'Unknown',
                        last_name: userInfo.last_name || '',
                        phone: userInfo.phone || '',
                        email: userInfo.email || '',
                        booking_notes: `Payment received on ${new Date().toLocaleDateString()}`
                    });
                } catch (payerError) {
                    console.warn('Payer record creation warning:', payerError.message);
                    // Don't fail the status update if payer creation fails
                }
            }
            
            setStatus(newStatus);
            
            if (onStatusChange) {
                onStatusChange(booking.booking_id, newStatus);
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Payment status updated to ${newStatus}`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error('Status update error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to update payment status'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <td className="text-center">
            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={loading || isDisabled}
                className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm font-medium hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value={paymentStatus.UNPAID}>Unpaid</option>
                <option value={paymentStatus.PAID}>Paid</option>
            </select>
            {loading && <p className="text-xs text-gray-500 mt-1">Updating...</p>}
        </td>
    );
};

export default BookingPaymentStatus;
