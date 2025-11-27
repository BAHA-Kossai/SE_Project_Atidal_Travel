import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import PagePath from "../components/PagePath.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import {useEffect, useState} from "react";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import Tabs from "../components/Tabs.jsx";
import Table from "../components/Table.jsx";
import mock_bookings from "../mock-bookings.json";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import ModalDialog from "../components/ModalDialog.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import InputField from "../components/InputField.jsx";

export default function AdminBookingsPage() {
    // Change Active Tab
    const [activeTab, setActiveTab] = useState("Bookings");
    const tabs = ["Bookings", "Payer", "Traveler"]

    

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Employees
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Bookings"]} />
            </div>

            {/* Booking / Payer / Traveler Tabs */}
            <div className={"mb-4"}>
                <Tabs items={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
                { activeTab === "Bookings" && <TabBookings/> }
                { activeTab === "Payer" && <TabPayer/> }
                { activeTab === "Traveler" && <TabTraveler/> }

        </AppBarSideBarWithContent>
    )
}

// Tabs
const TabBookings = () => {
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
const TabPayer = () => {
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
                <PayersTable/>
            </div>
        </WhiteContainer>
    )
}
const TabTraveler = () => {
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
                <TravelersTable/>
            </div>
        </WhiteContainer>
    )
}

// Tables
const BookingsTable = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
    const [isDeleteBookingModalOpen, setIsDeleteBookingModalOpen] = useState(false);
    const handleDelete = (id) => {
        setBookings(bookings.filter(booking => booking["booking_id"] !== id));
        setIsDeleteBookingModalOpen(false);
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
            "payment_status": true
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
            "payment_status": false
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
            "payment_status": false
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
            "payment_status": false
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
            "payment_status": false
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
            "payment_status": true
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
            "payment_status": false
        }
    ]);

    return (
        <>
            <Table
                onEdit={
                    (booking) =>
                    {
                        setSelectedBooking(booking);
                        setIsEditBookingModalOpen(true);
                    }
                }
                onDelete={
                    (booking) =>
                    {
                        setSelectedBooking(booking);
                        setIsDeleteBookingModalOpen(true);
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
                            title: 'Payment status',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["payment_status"]}
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
                    <ButtonOutline onClick={() => setIsDeleteBookingModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>
            <EditModal
                isModalOpen={isEditBookingModalOpen}
                setIsModalOpen={setIsEditBookingModalOpen}
                selectedBooking={selectedBooking}
            />
        </>
    );
}

const EditModal = ({isModalOpen, setIsModalOpen, selectedBooking}) => {
    useEffect(() => {
        if (selectedBooking) {
            setFormData({
                username: selectedBooking["username"],
                destinationCity: selectedBooking["destination"]["city"],
                destinationCountry: selectedBooking["destination"]["country"],
                date: selectedBooking["date"],
                phoneNumber: selectedBooking["phone_number"],
                branch: selectedBooking["branch"],
                payment: selectedBooking["payment"],
            });
        }
    }, [selectedBooking, isModalOpen]);
    const [formData, setFormData] = useState({
        username: '',
        destinationCity: '',
        destinationCountry: '',
        date: '',
        phoneNumber: '',
        branch: '',
        payment: ''
    })
    return (
        <ModalDialog
            title={`Edit Booking ${selectedBooking?.["booking_id"] ?? ""}`}
            open={isModalOpen}
        >
            <div className={"grid grid-cols-2 gap-4"}>
                <InputField
                    label={"Username"}
                    disabled={false}
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username:e.target.value})}
                />
                <InputField
                    label={"Branch"}
                    disabled={false}
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch:e.target.value})}
                />
                <InputField
                    label={"Destination City"}
                    disabled={false}
                    value={formData.destinationCity}
                    onChange={(e) => setFormData({...formData, destinationCity:e.target.value})}
                />
                <InputField
                    label={"Destination Country"}
                    disabled={false}
                    value={formData.destinationCountry}
                    onChange={(e) => setFormData({...formData, destinationCountry:e.target.value})}
                />
                <InputField
                    label={"Phone number"}
                    disabled={false}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber:e.target.value})}
                />
                <InputField
                    label={"Payment"}
                    disabled={false}
                    type={"select"}
                    options={["Delivered", "Confirmed", "Pending", "Sent", "Cancelled", "Returned"]}
                    onChange={(e) => setFormData({...formData, payment:e.target.value})}
                />
                <InputField
                    className={"col-span-2"}
                    label={"Date"}
                    disabled={false}
                    value={formData.date}
                    type={"date"}
                    onChange={(e) => setFormData({...formData, date:e.target.value})}
                />
            </div>
            <ButtonOutline onClick={() => setIsModalOpen(false)}>Cancel</ButtonOutline>
        </ModalDialog>
    )
}

const PayersTable = () => {
    const [selectedPayer, setSelectedPayer] = useState(null);
    // const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
    // const [isDeleteBookingModalOpen, setIsDeleteBookingModalOpen] = useState(false);

    return (
        <>
            <Table
                onEdit={
                    (payer) =>
                    {
                        setSelectedPayer(payer);
                        // setIsEditBookingModalOpen(true);
                    }
                }
                onDelete={
                    (payer) =>
                    {
                        setSelectedPayer(payer);
                        // setIsDeleteBookingModalOpen(true);
                    }
                }
                columns={
                    [
                        {
                            title: 'Payer ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["payer_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'Booking ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["booking_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'User ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["user_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'Payer Name',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["payer_name"]}
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
                    ]
                }
                data={[
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                    {
                        payer_id: "#CR000123",
                        booking_id: "#CR000123",
                        user_id: "#CR000123",
                        payer_name: "Mohammed",
                        phone_number: "0544444444",
                    },
                ]}
            />
        </>
    );
}
const TravelersTable = () => {
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const travelers_data = [
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            payer_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
    ]
    // const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
    // const [isDeleteBookingModalOpen, setIsDeleteBookingModalOpen] = useState(false);

    return (
        <>
            <Table
                onEdit={
                    (traveler) =>
                    {
                        setSelectedTraveler(traveler);
                        // setIsEditBookingModalOpen(true);
                    }
                }
                onDelete={
                    (traveler) =>
                    {
                        setSelectedTraveler(traveler);
                        // setIsDeleteBookingModalOpen(true);
                    }
                }
                columns={
                    [
                        {
                            title: 'Traveler ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["payer_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'Booking ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["booking_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'User ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["user_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'Payer Name',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["payer_name"]}
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
                    ]
                }
                data={travelers_data}
            />
        </>
    );
}
