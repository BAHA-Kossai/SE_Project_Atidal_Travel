import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal} from "lucide-react";
import {useState} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";

export const TabPayers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <WhiteContainer>
            <div className="flex flex-col">
                {/* Search / Sort / Filter */}
                <div className="flex flex-row justify-between items-center mb-3">
                    <SearchBar
                        searchQuery={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        placeholder={"Search for a payer"}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                    </div>
                </div>
                <PayersTable
                    searchQuery={searchQuery}
                />
            </div>
        </WhiteContainer>
    )
}

const PayersTable = ({searchQuery}) => {
    const [payers, setPayers] = useState([
        {
            traveler_id: "#CR000123",
            booking_id: "#CR000123",
            first_name: "Mohammed",
            last_name: "Hamid",
            phone: "0544444444",
            confirmed_at: "2025-02-14T13:45:30.123+00:00",
            cancelled_at: "2025-02-14T13:45:30.123+00:00",
            booking_notes: "placeholder text",
            created_at: "2025-02-14T13:45:30.123+00:00",
        },
    ]);
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const handleDelete = (id) => {
        setPayers(payers.filter(payer => payer["booking_id"] !== id));
        setIsDeleteModalOpen(false);
    };

    const filteredPayers = payers.filter(payer => {
        const query = searchQuery.toLowerCase();
        return (
            payer.first_name.toLowerCase().includes(query) ||
            payer.last_name.toLowerCase().includes(query) ||
            payer.phone.toLowerCase().includes(query)
        )
    })

    return (
        <>
            <Table
                onDelete={
                    (payer) =>
                    {
                        setSelectedPayer(payer);
                        setIsDeleteModalOpen(true);
                    }
                }
                onEdit={(payer) =>
                    {
                        setSelectedPayer(payer);
                        setIsEditModalOpen(true);
                    }
            }
                columns={
                    [
                        {
                            title: 'Payer ID',
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
                            title: 'Phone Number',
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["phone"]}
                                </td>
                            )
                        },
                    ]
                }
                data={filteredPayers}
            />

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the payer with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedPayer?.["booking_id"]}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill onClick={() => handleDelete(selectedPayer?.["booking_id"])}>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>

            {/* Delete Modal */}
            <ModalDialog
                open={isEditModalOpen}
            >
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>
        </>
    );
}
