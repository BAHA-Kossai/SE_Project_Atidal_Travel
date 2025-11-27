import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal} from "lucide-react";
import {useEffect, useState} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";
import InputField from "../InputField.jsx";

export const TabBookings = () => {
    return (
        <WhiteContainer>
            <div className="flex flex-col">
                {/* Search / Sort / Filter */}
                <div className="flex flex-row justify-between items-center mb-3">
                    <SearchBar placeholder={"Search for an employee"}/>
                    <div className="grid grid-cols-2 gap-2">
                        <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                    </div>
                </div>
                <BookingsTable/>
            </div>
        </WhiteContainer>
    )
}
const BookingsTable = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditBookingModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteBookingModalOpen, setIsDeleteModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const handleDelete = (id) => {
        setBookings(bookings.filter(booking => booking["booking_id"] !== id));
        setIsDeleteModalOpen(false);
    };
    const [formData, setFormData] = useState({
        branch: '',
        payment_status: ''
    })
    useEffect(() => {
        if (selectedBooking) {
            setFormData({
                branch: selectedBooking["branch"],
                payment_status: selectedBooking["payment_status"],
            });
        }
    }, [selectedBooking, isEditBookingModalOpen]);


    const handleEdit = () => {
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            const updateBookings = bookings.map((booking) =>
                booking["booking_id"] === selectedBooking["booking_id"]
                    ? {...booking, ...formData} : booking
            )

            setBookings(updateBookings);
            setIsEditModalOpen(false);
        }
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.branch.trim()) {
            errors.branch = 'Branch is required';
        }

        return errors;
    };

    const [bookings, setBookings] = useState([
        {
            "booking_id": "01KB1E794CXVKGYF6G2B2AKCGQ",
            "username": "Perrine",
            "destination": {
                "country": "Egypt",
                "city": "Al Qanāyāt"
            },
            "date": "19-09-2025",
            "phone_number": "7644115704",
            "branch": "Terrell",
            "payment_status": "Delivered"
        }, {
            "booking_id": "01KB1E794DJXNN5GDDTZC542PC",
            "username": "Heddie",
            "destination": {
                "country": "Indonesia",
                "city": "Bancak Wetan"
            },
            "date": "10-11-2025",
            "phone_number": "4863746258",
            "branch": "Siward",
            "payment_status": "Sent"
        }, {
            "booking_id": "01KB1E794E36CYYWCD84J2ZZWK",
            "username": "Elysia",
            "destination": {
                "country": "United States",
                "city": "Minneapolis"
            },
            "date": "28-09-2025",
            "phone_number": "6125025358",
            "branch": "Ruggiero",
            "payment_status": "Returned"
        }, {
            "booking_id": "01KB1E794F3VZWP3889SEAFJSK",
            "username": "Bertrando",
            "destination": {
                "country": "China",
                "city": "Zhifang"
            },
            "date": "20-08-2025",
            "phone_number": "9995796892",
            "branch": "Derby",
            "payment_status": "Cancelled"
        }, {
            "booking_id": "01KB1E794GCZT7Y6BNFHGEJEM6",
            "username": "Consalve",
            "destination": {
                "country": "Tunisia",
                "city": "Al ‘Āliyah"
            },
            "date": "31-01-2025",
            "phone_number": "9676380182",
            "branch": "Gram",
            "payment_status": "Pending"
        }, {
            "booking_id": "01KB1E794JTV87ZW06SZQ49R5X",
            "username": "Mycah",
            "destination": {
                "country": "Portugal",
                "city": "Malhou"
            },
            "date": "12-10-2025",
            "phone_number": "6098765518",
            "branch": "Kahaleel",
            "payment_status": "Confirmed"
        }, {
            "booking_id": "01KB1E794JZS449HK46CB35ERE",
            "username": "Amitie",
            "destination": {
                "country": "Serbia",
                "city": "Boljevci"
            },
            "date": "10-11-2025",
            "phone_number": "5581824171",
            "branch": "Currie",
            "payment_status": "Delivered"
        }
    ]);

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
                                    {item["username"]}
                                </td>
                            )
                        },
                        {
                            title: 'Destination',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["destination"]["country"]}, {item["destination"]["city"]}
                                </td>
                            )
                        },
                        {
                            title: 'Date',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["date"]}
                                </td>
                            )
                        },
                        {
                            title: 'Phone Number',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["phone_number"]}
                                </td>
                            )
                        },
                        {
                            title: 'Branch',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["branch"]}
                                </td>
                            )
                        },
                        {
                            title: 'Payment Status',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {paymentStatusWidget(item["payment_status"])}
                                </td>
                            )
                        },
                    ]
                }
                data={bookings}
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
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch:e.target.value})}
                        error={errors.branch}
                    />
                    <InputField
                        label={"Payment Status"}
                        disabled={false}
                        value={formData.payment_status}
                        type={"select"}
                        options={["Delivered", "Confirmed", "Pending", "Sent", "Cancelled", "Returned"]}
                        onChange={(e) => setFormData({...formData, payment_status:e.target.value})}
                    />
                    <ButtonFill onClick={() => handleEdit()}>Edit Booking</ButtonFill>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)}>Cancel</ButtonOutline>
                </div>
            </ModalDialog>
        </>
    );
}


const paymentStatusWidget = (status) => {
    let textColor = ""
    let backgroundColor = ""
    let dotColor = ""
    switch (status) {
        case "Delivered":
            textColor = "text-green-600"
            backgroundColor = "bg-green-100"
            dotColor = "bg-green-600"
            break
        case "Confirmed":
            textColor = "text-orange-600"
            backgroundColor = "bg-orange-100"
            dotColor = "bg-orange-600"
            break
        case "Pending":
            textColor = "text-gray-600"
            backgroundColor = "bg-gray-100"
            dotColor = "bg-gray-600"
            break
        case "Sent":
            textColor = "text-amber-600"
            backgroundColor = "bg-amber-100"
            dotColor = "bg-amber-600"
            break
        case "Cancelled":
            textColor = "text-red-600"
            backgroundColor = "bg-red-100"
            dotColor = "bg-red-600"
            break
        case "Returned":
            textColor = "text-yellow-500"
            backgroundColor = "bg-yellow-50"
            dotColor = "bg-yellow-500"
            break
    }
    return (
        <div className={`
            flex flex-row px-4 justify-center items-center
            h-10 text-sm 
            ${textColor} ${backgroundColor}
            rounded-full
       `}>
            <div className={`rounded-xl w-2 h-2 ${dotColor} mr-2`}></div>
            {status}
        </div>
    )
}