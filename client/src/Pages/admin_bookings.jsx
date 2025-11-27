import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import PagePath from "../components/PagePath.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import { useState } from "react";
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
const TabPayer = () => {}
const TabTraveler = () => {}

const BookingsTable = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
    const [isDeleteBookingModalOpen, setIsDeleteBookingModalOpen] = useState(false);

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
                                    {item["Destination"]["country"]}, {item["Destination"]["city"]}
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
                            title: 'Payment',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["payment"]}
                                </td>
                            )
                        },
                    ]
                }
                data={mock_bookings}
            />

            {DeleteBookingModal(isDeleteBookingModalOpen, setIsDeleteBookingModalOpen, selectedBooking)}
            {EditBookingModal(isEditBookingModalOpen, setIsDeleteBookingModalOpen, selectedBooking)}
        </>
    );
}


const DeleteBookingModal = (isModalOpen, setIsModalOpen, selectedBooking) => {
    return (
        <ModalDialog
            open={isModalOpen}
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
                <ButtonFill>Yes</ButtonFill>
                <ButtonOutline onClick={() => setIsModalOpen(false)}>No</ButtonOutline>
            </div>
        </ModalDialog>
    )
}

const EditBookingModal = (isModalOpen, setIsModalOpen, selectedBooking) => {
    return (
        <ModalDialog
            title={`Edit Employee ${selectedBooking?.id ?? ""}`}
            open={isModalOpen}
        >
            <div className={"grid grid-cols-2 gap-4"}>
                <InputField
                    label={"First name"}
                    disabled={false}
                    value={selectedBooking?.["first_name"]}
                />
                <InputField
                    label={"Last name"}
                    disabled={false}
                    value={selectedBooking?.["last_name"]}
                />
                <InputField
                    label={"Phone number"}
                    disabled={false}
                    value={selectedBooking?.["phone_number"]}
                />
                <InputField
                    label={"Role"}
                    disabled={false}
                    value={selectedBooking?.["role"]}
                />
                <InputField
                    label={"Hire date"}
                    disabled={false}
                    value={selectedBooking?.["hire_date"]}
                />
                <InputField
                    label={"Availability"}
                    disabled={false}
                    value={selectedBooking?.["availability"]}
                />
            </div>
            <ButtonOutline onClick={() => setIsModalOpen(false)}>Cancel</ButtonOutline>
        </ModalDialog>
    )
}