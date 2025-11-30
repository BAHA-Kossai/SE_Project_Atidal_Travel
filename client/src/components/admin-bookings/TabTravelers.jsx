import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal, X} from "lucide-react";
import {useState} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";
import TableEntryModal from "../TableEntryModal.jsx";

export const TabTravelers = () => {
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
                        placeholder={"Search for a traveler"}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                    </div>
                </div>
                <TravelersTable
                    searchQuery={searchQuery}
                />
            </div>
        </WhiteContainer>
    )
}


const TravelersTable = ({searchQuery}) => {
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [travelers, setTravelers] = useState([
        {
            traveler_id: "#CR000123",
            payer_id: "#CR000123",
            payer: {
                first_name: "Younes",
                last_name: "Toufiq",
            },
            booking_id: "#CR000123",
            created_at: "2025-02-14T13:45:30.123+00:00",
            first_name: "Mohamed",
            last_name: "Mahmoudi",
            age: 23,
            identity_number: 20323424,
            traveler_contact: "2032342340",
            passport_number: "40654630343",
            gender: "Male"
        },
    ]);

    const filteredTravelers = travelers.filter((traveler) => {
        const query = searchQuery.toLowerCase();
        return (
            traveler.first_name.toLowerCase().includes(query) ||
            traveler.last_name.toLowerCase().includes(query) ||
            traveler.age.toString().includes(query) ||
            traveler.identity_number.toString().toLowerCase().includes(query) ||
            traveler.passport_number.toLowerCase().includes(query)
        )
    })

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDelete = (id) => {
        setTravelers(travelers.filter(traveler => traveler["traveler_id"] !== id));
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <Table
                onSelect={(traveler) =>
                {
                    setSelectedTraveler(traveler)
                    setIsEntryModalOpen(true)
                }
                }
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
                                <td className={"text-center text-(--color-text-secondary)"}>
                                    {item["traveler_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'Payer ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary)"}>
                                    {item["payer_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'Booking ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary)"}>
                                    {item["booking_id"]}
                                </td>
                            )
                        },
                        {
                            title: 'First Name',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["first_name"]}
                                </td>
                            )
                        },
                        {
                            title: 'Last Name',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["last_name"]}
                                </td>
                            )
                        },
                        {
                            title: 'Age',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["age"]}
                                </td>
                            )
                        },
                        {
                            title: 'Payer Full Name',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["payer"]["first_name"]} {item["payer"]["last_name"]}
                                </td>
                            )
                        },
                        {
                            title: 'Passport Number',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["passport_number"]}
                                </td>
                            )
                        },
                    ]
                }
                data={filteredTravelers}
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

            {/* Row Entry Modal */}
            <TableEntryModal
                open={isEntryModalOpen}
                title={"Traveler Information"}
                onClose={() => setIsEntryModalOpen(false)}
                properties={
                    [
                        {
                            name: "Traveler ID",
                            value: selectedTraveler?.["traveler_id"]
                        },
                        {
                            name: "Payer ID",
                            value: selectedTraveler?.["payer_id"]
                        },
                        {
                            name: "Booking ID",
                            value: selectedTraveler?.["booking_id"]
                        },
                        {
                            name: "Payer Full Name",
                            value: `${selectedTraveler?.["payer"]["first_name"]}  ${selectedTraveler?.["payer"]["last_name"]}`
                        },
                        {
                            name: "Creation Date",
                            value: new Date(selectedTraveler?.["created_at"]).toLocaleDateString()
                        },
                        {
                            name: "Creation Time",
                            value: new Date(selectedTraveler?.["created_at"]).toLocaleTimeString()
                        },
                        {
                            name: "Age",
                            value: selectedTraveler?.["age"]
                        },
                        {
                            name: "Gender",
                            value: selectedTraveler?.["gender"]
                        },
                        {
                            name: "Traveler Contact",
                            value: selectedTraveler?.["traveler_contact"]
                        },
                        {
                            name: "Identity Number",
                            value: selectedTraveler?.["identity_number"]
                        },
                        {
                            name: "Passport Number",
                            value: selectedTraveler?.["passport_number"]
                        },
                    ]
                }
            />
        </>
    );
}