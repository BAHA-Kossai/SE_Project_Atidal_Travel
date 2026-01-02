import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal} from "lucide-react";
import {useEffect, useState} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";
import InputField from "../InputField.jsx";
import { useAllBookings } from "../../../hooks/useBookings.js";
import { useBranches } from "../../../hooks/useBranches.js";
import { assignBranchToBooking, updateBookingStatus } from "../../../api/bookings.js";
import BookingPaymentStatus from "../BookingPaymentStatus.jsx";
import Swal from "sweetalert2";

const bookingStatus = Object.freeze({
    DRAFT: "draft",
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    REJECTED: "rejected"
})

export const TabBookings = () => {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <WhiteContainer>
            <div className="flex flex-col">
                {/* Search / Sort / Filter */}
                <div className="flex flex-row justify-between items-center mb-3">
                    <SearchBar
                        searchQuery={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        placeholder={"Search for a booking"}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                    </div>
                </div>
                <BookingsTable
                    searchQuery={searchQuery}
                />
            </div>
        </WhiteContainer>
    )
}
const BookingsTable = ({searchQuery}) => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditBookingModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteBookingModalOpen, setIsDeleteModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Use API hooks
    const { bookings, loading, error, refetch } = useAllBookings();
    const { branches } = useBranches();

    const [formData, setFormData] = useState({
        branch_id: '',
        booking_status: ''
    });

    useEffect(() => {
        if (selectedBooking && isEditBookingModalOpen) {
            setFormData({
                branch_id: selectedBooking.branch_id || '',
                booking_status: selectedBooking.booking_status || '',
            });
        }
    }, [selectedBooking, isEditBookingModalOpen]);

    const validateForm = () => {
        const errors = {};
        if (!formData.booking_status) {
            errors.booking_status = 'Booking status is required';
        }
        return errors;
    };

    const handleEdit = async () => {
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setSubmitLoading(true);
            setErrorMessage('');

            // Update booking status if changed
            if (formData.booking_status && formData.booking_status !== selectedBooking.booking_status) {
                await updateBookingStatus(selectedBooking.booking_id, formData.booking_status);
            }

            // Assign branch if changed
            if (formData.branch_id && formData.branch_id !== selectedBooking.branch_id) {
                await assignBranchToBooking(selectedBooking.booking_id, formData.branch_id);
            }

            await refetch();
            setIsEditModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Booking updated successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            setErrorMessage(err.message || 'Failed to update booking');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to update booking'
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    // Helper to get user info
    const getUserInfo = (booking) => {
        // API might return user info differently
        if (booking.Users) return booking.Users;
        if (booking.user) return booking.user;
        return { first_name: 'N/A', last_name: '', phone: '' };
    };

    // Helper to get branch info
    const getBranchInfo = (booking) => {
        if (booking.Branches) return booking.Branches;
        if (booking.branch) return booking.branch;
        const branch = branches.find(b => b.branch_id === booking.branch_id);
        return branch ? { branch_name: branch.branch_name } : { branch_name: 'N/A' };
    };

    // Helper to get trip info
    const getTripInfo = (booking) => {
        if (booking.TripInfo) return booking.TripInfo;
        if (booking.trip_info) return booking.trip_info;
        return { destination_country: 'N/A', destination_city: 'N/A', trip_date: 'N/A' };
    };

    const filteredBookings = bookings.filter((booking) => {
        const query = searchQuery.toLowerCase();
        const userInfo = getUserInfo(booking);
        const branchInfo = getBranchInfo(booking);
        const tripInfo = getTripInfo(booking);
        
        return (
            (userInfo.first_name || '').toLowerCase().includes(query) ||
            (userInfo.last_name || '').toLowerCase().includes(query) ||
            (userInfo.phone || '').toLowerCase().includes(query) ||
            (tripInfo.destination_city || '').toLowerCase().includes(query) ||
            (tripInfo.destination_country || '').toLowerCase().includes(query) ||
            (branchInfo.branch_name || '').toLowerCase().includes(query) ||
            (booking.booking_status || '').toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Loading bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
            </div>
        );
    }

    const columns = [
        {
            title: 'Booking ID',
            format: (item) => (
                <td className={"text-center text-gray-400 cursor-pointer hover:underline"}>
                    {item["booking_id"]}
                </td>
            )
        },
        {
            title: 'Username',
            format: (item) => {
                const userInfo = getUserInfo(item);
                return (
                    <td className={"text-center text-gray-400"}>
                        {userInfo.first_name} {userInfo.last_name}
                    </td>
                );
            }
        },
        {
            title: 'Destination',
            format: (item) => {
                const tripInfo = getTripInfo(item);
                return (
                    <td className={"text-center text-gray-400"}>
                        {tripInfo.destination_country}, {tripInfo.destination_city}
                    </td>
                );
            }
        },
        {
            title: 'Date',
            format: (item) => {
                const tripInfo = getTripInfo(item);
                return (
                    <td className={"text-center text-gray-400"}>
                        {tripInfo.trip_date ? new Date(tripInfo.trip_date).toLocaleDateString() : 'N/A'}
                    </td>
                );
            }
        },
        {
            title: 'Phone Number',
            format: (item) => {
                const userInfo = getUserInfo(item);
                return (
                    <td className={"text-center text-gray-400"}>
                        {userInfo.phone || 'N/A'}
                    </td>
                );
            }
        },
        {
            title: 'Branch',
            format: (item) => {
                const branchInfo = getBranchInfo(item);
                return (
                    <td className={"text-center text-gray-400"}>
                        {branchInfo.branch_name || 'N/A'}
                    </td>
                );
            }
        },
        {
            title: 'Booking Status',
            format: (item) => (
                <td className={"text-center text-gray-400"}>
                    {bookingStatusWidget(item.booking_status)}
                </td>
            )
        },
        {
            title: 'Payment Status',
            format: (item) => (
                <BookingPaymentStatus 
                    booking={item} 
                    onStatusChange={(bookingId, status) => {
                        // Optionally refetch or update local state
                        refetch();
                    }}
                />
            )
        },
    ];

    return (
        <>
            <Table
                onEdit={
                    (booking) =>
                    {
                        setSelectedBooking(booking);
                        setIsEditModalOpen(true);
                    }
                }
                onDelete={
                    (booking) =>
                    {
                        setSelectedBooking(booking);
                        setIsDeleteModalOpen(true);
                    }
                }
                columns={columns}
                data={filteredBookings}
            />

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteBookingModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Note: Booking deletion is not available through this interface.
                    </h1>
                    <h1>
                        Please contact system administrator for booking deletion.
                    </h1>
                </div>
                <div className={"grid grid-cols-1 gap-4 mt-8"}>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>Close</ButtonOutline>
                </div>
            </ModalDialog>

            {/* Edit Modal */}
            <ModalDialog
                title={`Edit Booking ${selectedBooking?.["booking_id"] ?? ""}`}
                open={isEditBookingModalOpen}
            >
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {errorMessage}
                    </div>
                )}
                <div className={"grid grid-cols-2 gap-4"}>
                    <div className="flex flex-col">
                        <label className="mb-2 text-gray-700">Branch</label>
                        <select
                            value={formData.branch_id || ''}
                            onChange={(e) => setFormData({...formData, branch_id: e.target.value ? parseInt(e.target.value) : ''})}
                            className="border-1 py-3 px-3 border-gray-500 rounded-lg"
                        >
                            <option value="">Select a branch</option>
                            {branches.map((branch) => (
                                <option key={branch.branch_id} value={branch.branch_id}>
                                    {branch.branch_name} ({branch.branch_city})
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.branch_id}</p>
                        )}
                    </div>
                    <InputField
                        label={"Booking Status *"}
                        disabled={false}
                        value={formData.booking_status}
                        type={"select"}
                        options={Object.values(bookingStatus)}
                        onChange={(e) => setFormData({...formData, booking_status: e.target.value})}
                        error={errors.booking_status}
                    />
                    <ButtonFill onClick={handleEdit} disabled={submitLoading}>
                        {submitLoading ? 'Updating...' : 'Edit Booking'}
                    </ButtonFill>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)} disabled={submitLoading}>
                        Cancel
                    </ButtonOutline>
                </div>
            </ModalDialog>
        </>
    );
}


const bookingStatusWidget = (status) => {
    let textColor = ""
    let backgroundColor = ""
    switch (status) {
        case bookingStatus.DRAFT:
            textColor = "cyan-600"
            backgroundColor = "cyan-100"
            break
        case bookingStatus.PENDING:
            textColor = "amber-600"
            backgroundColor = "amber-100"
            break
        case bookingStatus.CONFIRMED:
            textColor = "green-600"
            backgroundColor = "green-100"
            break
        case bookingStatus.CANCELLED:
            textColor = "gray-600"
            backgroundColor = "gray-100"
            break
        case bookingStatus.COMPLETED:
            textColor = "blue-600"
            backgroundColor = "blue-100"
            break
        case bookingStatus.REJECTED:
            textColor = "red-500"
            backgroundColor = "red-100"
            break
    }
    return (
        <div className={`
            flex flex-row px-4 justify-center items-center
            h-10 text-sm
            text-${textColor}
            bg-${backgroundColor}
            rounded-full
       `}>
            <div className={`rounded-xl w-2 h-2 bg-${textColor} mr-2`}></div>
            {status}
        </div>
    )
}