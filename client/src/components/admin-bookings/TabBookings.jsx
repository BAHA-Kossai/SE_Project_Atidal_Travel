import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal} from "lucide-react";
import {useEffect, useState} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";
import InputField from "../InputField.jsx";

const bookingStatus = Object.freeze({
    DRAFT: "draft",
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    REJECTED: "rejected"
})

const bookingType = Object.freeze({
    NORMAL: "normal",
    UMRAH: "umrah",
    GUIDED_TRIP: "guided_trip"
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
    const handleDelete = (id) => {
        setBookings(bookings.filter(booking => booking["booking_id"] !== id));
        setIsDeleteModalOpen(false);
    };
    const [formData, setFormData] = useState({
        branch_name: '',
        booking_status: ''
    })
    useEffect(() => {
        if (selectedBooking) {
            setFormData({
                branch_name: selectedBooking.Branches.branch_name,
                booking_status: selectedBooking.booking_status,
            });
        }
    }, [selectedBooking, isEditBookingModalOpen]);


    const handleEdit = () => {
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            const updateBookings = bookings.map((booking) =>
                booking["booking_id"] === selectedBooking["booking_id"]
                    ? {...booking,
                        booking_status: formData.booking_status,
                        Branches: {
                            ...booking.Branches,
                            branch_name: formData.branch_name,
                        }
                    } : booking
            )

            setBookings(updateBookings);
            setIsEditModalOpen(false);
        }
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.branch_name.trim()) {
            errors.branch_name = 'Branch is required';
        }

        return errors;
    };

    const [bookings, setBookings] = useState([
            {
                booking_id: 12014,
                created_at: "2025-02-14T13:45:30.123+00:00",
                user_id: 230,
                Users: { first_name: "Mohamed", last_name: "Salhi", phone: "320413202" },
                branch_id: 30241,
                Branches: { branch_name: "Guelma" },
                guide_id: 6954,
                booking_status: bookingStatus.DRAFT,
                needs_visa_assistance: false,
                info_id: 4203,
                TripInfo: {
                    trip_date: "2025-11-29",
                    destination_city: "Algiers",
                    destination_country: "Algeria"
                },
                updated_at: "2025-02-14T13:45:30.123+00:00",
                type: bookingType.NORMAL
            },

            {
                booking_id: 12015,
                created_at: "2025-02-16T09:18:10.551+00:00",
                user_id: 231,
                Users: { first_name: "Sara", last_name: "Benali", phone: "0559123498" },
                branch_id: 30242,
                Branches: { branch_name: "Constantine" },
                guide_id: 6955,
                booking_status: bookingStatus.PENDING,
                needs_visa_assistance: true,
                info_id: 4204,
                TripInfo: {
                    trip_date: "2025-10-12",
                    destination_city: "Oran",
                    destination_country: "Algeria"
                },
                updated_at: "2025-02-16T09:18:10.551+00:00",
                type: bookingType.NORMAL
            },

            {
                booking_id: 12016,
                created_at: "2025-02-18T17:30:45.789+00:00",
                user_id: 232,
                Users: { first_name: "Yacine", last_name: "Larbi", phone: "0660192837" },
                branch_id: 30243,
                Branches: { branch_name: "Algiers" },
                guide_id: 6956,
                booking_status: bookingStatus.CONFIRMED,
                needs_visa_assistance: false,
                info_id: 4205,
                TripInfo: {
                    trip_date: "2025-09-01",
                    destination_city: "Tunis",
                    destination_country: "Tunisia"
                },
                updated_at: "2025-02-18T17:30:45.789+00:00",
                type: bookingType.NORMAL
            },

            {
                booking_id: 12017,
                created_at: "2025-02-20T11:05:20.230+00:00",
                user_id: 233,
                Users: { first_name: "Leila", last_name: "Khaldi", phone: "0771234567" },
                branch_id: 30244,
                Branches: { branch_name: "Annaba" },
                guide_id: 6957,
                booking_status: bookingStatus.CANCELLED,
                needs_visa_assistance: false,
                info_id: 4206,
                TripInfo: {
                    trip_date: "2025-12-20",
                    destination_city: "Paris",
                    destination_country: "France"
                },
                updated_at: "2025-02-21T11:05:20.230+00:00",
                type: bookingType.NORMAL
            },

            {
                booking_id: 12018,
                created_at: "2025-02-21T14:22:11.600+00:00",
                user_id: 234,
                Users: { first_name: "Karim", last_name: "Mansouri", phone: "0690021122" },
                branch_id: 30242,
                Branches: { branch_name: "Constantine" },
                guide_id: 6958,
                booking_status: bookingStatus.COMPLETED,
                needs_visa_assistance: false,
                info_id: 4207,
                TripInfo: {
                    trip_date: "2025-08-05",
                    destination_city: "Madrid",
                    destination_country: "Spain"
                },
                updated_at: "2025-02-21T14:22:11.600+00:00",
                type: bookingType.UMRAH
            },

            {
                booking_id: 12019,
                created_at: "2025-02-23T08:45:55.901+00:00",
                user_id: 235,
                Users: { first_name: "Nadia", last_name: "Boukhalfa", phone: "0548789923" },
                branch_id: 30241,
                Branches: { branch_name: "Guelma" },
                guide_id: 6959,
                booking_status: bookingStatus.REJECTED,
                needs_visa_assistance: true,
                info_id: 4208,
                TripInfo: {
                    trip_date: "2025-07-14",
                    destination_city: "London",
                    destination_country: "UK"
                },
                updated_at: "2025-02-23T08:45:55.901+00:00",
                type: bookingType.NORMAL
            },

            {
                booking_id: 12020,
                created_at: "2025-02-25T16:10:44.300+00:00",
                user_id: 236,
                Users: { first_name: "Amine", last_name: "Djebbar", phone: "0791123344" },
                branch_id: 30245,
                Branches: { branch_name: "Blida" },
                guide_id: 6960,
                booking_status: bookingStatus.PENDING,
                needs_visa_assistance: false,
                info_id: 4209,
                TripInfo: {
                    trip_date: "2025-11-02",
                    destination_city: "Cairo",
                    destination_country: "Egypt"
                },
                updated_at: "2025-02-25T16:10:44.300+00:00",
                type: bookingType.NORMAL
            },

            {
                booking_id: 12021,
                created_at: "2025-02-26T10:22:19.100+00:00",
                user_id: 237,
                Users: { first_name: "Samir", last_name: "Cherif", phone: "0677001133" },
                branch_id: 30246,
                Branches: { branch_name: "Tlemcen" },
                guide_id: 6961,
                booking_status: bookingStatus.CONFIRMED,
                needs_visa_assistance: true,
                info_id: 4210,
                TripInfo: {
                    trip_date: "2025-06-11",
                    destination_city: "Dubai",
                    destination_country: "UAE"
                },
                updated_at: "2025-02-26T10:22:19.100+00:00",
                type: bookingType.UMRAH
            },

            {
                booking_id: 12022,
                created_at: "2025-02-28T12:32:55.777+00:00",
                user_id: 238,
                Users: { first_name: "Ikram", last_name: "Saadi", phone: "0654019283" },
                branch_id: 30241,
                Branches: { branch_name: "Guelma" },
                guide_id: 6962,
                booking_status: bookingStatus.DRAFT,
                needs_visa_assistance: false,
                info_id: 4211,
                TripInfo: {
                    trip_date: "2025-12-01",
                    destination_city: "Rome",
                    destination_country: "Italy"
                },
                updated_at: "2025-02-28T12:32:55.777+00:00",
                type: bookingType.GUIDED_TRIP
            },

            {
                booking_id: 12023,
                created_at: "2025-03-01T18:40:12.450+00:00",
                user_id: 239,
                Users: { first_name: "Rania", last_name: "Haddad", phone: "0765412288" },
                branch_id: 30243,
                Branches: { branch_name: "Algiers" },
                guide_id: 6963,
                booking_status: bookingStatus.COMPLETED,
                needs_visa_assistance: true,
                info_id: 4212,
                TripInfo: {
                    trip_date: "2025-09-20",
                    destination_city: "Istanbul",
                    destination_country: "Turkey"
                },
                updated_at: "2025-03-01T18:40:12.450+00:00",
                type: bookingType.GUIDED_TRIP
            }
    ]);

    const filteredBookings = bookings.filter((booking) => {
        const query = searchQuery.toLowerCase();
        return (
            booking.Users.first_name.toLowerCase().includes(query) ||
            booking.Users.last_name.toLowerCase().includes(query) ||
            booking.Users.phone.toLowerCase().includes(query) ||
            booking.TripInfo.destination_city.toLowerCase().includes(query) ||
            booking.TripInfo.destination_country.toLowerCase().includes(query) ||
            booking.Branches.branch_name.toLowerCase().includes(query) ||
            booking.booking_status.toLowerCase().includes(query)
        );
    })

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
                columns={
                    [
                        {
                            title: 'Booking ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["booking_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'Username',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.Users.first_name} {item.Users.last_name}
                                </td>
                            )
                        },
                        {
                            title: 'Destination',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.TripInfo.destination_country}, {item.TripInfo.destination_city}
                                </td>
                            )
                        },
                        {
                            title: 'Date',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.TripInfo.trip_date}
                                </td>
                            )
                        },
                        {
                            title: 'Phone Number',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.Users.phone}
                                </td>
                            )
                        },
                        {
                            title: 'Branch',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.Branches.branch_name}
                                </td>
                            )
                        },
                        {
                            title: 'Status',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {bookingStatusWidget(item.booking_status)}
                                </td>
                            )
                        },
                    ]
                }
                data={filteredBookings}
            />

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteBookingModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the booking with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedBooking?.["booking_id"]}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill onClick={() => handleDelete(selectedBooking?.["booking_id"])}>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>

            {/* Edit Modal */}
            <ModalDialog
                title={`Edit Booking ${selectedBooking?.["booking_id"] ?? ""}`}
                open={isEditBookingModalOpen}
            >
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"Branch"}
                        disabled={false}
                        value={formData.branch_name}
                        onChange={(e) => setFormData({...formData, branch_name:e.target.value})}
                        error={errors.branch_name}
                    />
                    <InputField
                        label={"Booking Status"}
                        disabled={false}
                        value={formData.booking_status}
                        type={"select"}
                        options={Object.values(bookingStatus)}
                        onChange={(e) => setFormData({...formData, booking_status:e.target.value})}
                    />
                    <ButtonFill onClick={() => handleEdit()}>Edit Booking</ButtonFill>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)}>Cancel</ButtonOutline>
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