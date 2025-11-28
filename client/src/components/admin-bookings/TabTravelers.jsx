import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal} from "lucide-react";
import {useState} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";

export const TabTravelers = () => {
    return (
        <WhiteContainer>
            <div className="flex flex-col">
                {/* Search / Sort / Filter */}
                <div className="flex flex-row justify-between items-center mb-3">
                    <SearchBar placeholder={"Search for a traveler"}/>
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


const TravelersTable = () => {
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [travelers, setTravelers] = useState([
        {
            traveler_id: "#CR000123",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000124",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000125",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000126",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000127",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000128",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000129",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000130",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000131",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000132",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000133",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000134",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000135",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000136",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000137",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000138",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000139",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000140",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000141",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
        {
            traveler_id: "#CR000142",
            booking_id: "#CR000123",
            user_id: "#CR000123",
            payer_name: "Mohammed",
            phone_number: "0544444444",
        },
    ]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDelete = (id) => {
        setTravelers(travelers.filter(traveler => traveler["traveler_id"] !== id));
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <Table
                onDelete={
                    (traveler) =>
                    {
                        setSelectedTraveler(traveler);
                        setIsDeleteModalOpen(true);
                    }
                }
                columns={
                    [
                        {
                            title: 'Traveler ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["traveler_id"]}
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
                data={travelers}
            />

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the traveler with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedTraveler?.["traveler_id"]}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill onClick={() => handleDelete(selectedTraveler?.["traveler_id"])}>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>
        </>
    );
}
