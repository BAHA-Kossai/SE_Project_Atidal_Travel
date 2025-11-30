import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal, X} from "lucide-react";
import {useState} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";
import TableEntryModal from "../TableEntryModal.jsx";

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
            payer_id: "#CR000123",
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
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
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
                onSelect={(payer) =>
                {
                    setSelectedPayer(payer)
                    setIsEntryModalOpen(true)
                }
                }
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

            {/* Row Entry Modal */}
            <TableEntryModal
                title={"Payer Information"}
                open={isEntryModalOpen}
                properties={[
                    {
                        name: "Payer ID",
                        value: selectedPayer?.["payer_id"],
                    },
                    {
                        name: "Booking ID",
                        value: selectedPayer?.["booking_id"],
                    },
                    {
                        name: "Traveler ID",
                        value: selectedPayer?.["traveler_id"],
                    },
                    {
                        name: "First Name",
                        value: selectedPayer?.["first_name"],
                    },
                    {
                        name: "Last Name",
                        value: selectedPayer?.["last_name"],
                    },
                    {
                        name: "Phone Number",
                        value: selectedPayer?.["phone"],
                    },
                    {
                        name: "Creation Date",
                        value: new Date(selectedPayer?.["created_at"]).toLocaleDateString(),
                    },
                    {
                        name: "Creation Time",
                        value: new Date(selectedPayer?.["created_at"]).toLocaleTimeString(),
                    },
                    {
                        name: "Confirmation Date",
                        value: new Date(selectedPayer?.["confirmed_at"]).toLocaleDateString(),
                    },
                    {
                        name: "Confirmation Time",
                        value: new Date(selectedPayer?.["confirmed_at"]).toLocaleTimeString(),
                    },
                    {
                        name: "Cancellation Date",
                        value: new Date(selectedPayer?.["cancelled_at"]).toLocaleDateString(),
                    },
                    {
                        name: "Cancellation Time",
                        value: new Date(selectedPayer?.["cancelled_at"]).toLocaleTimeString(),
                    },
                    {
                        name: "Booking Notes",
                        value: selectedPayer?.["booking_notes"],
                    }

                ]}
                >
                <X
                    size={25}
                    className={`
                absolute top-5 right-5
                cursor-pointer 
                text-gray-400 hover:text-gray-600
                `}
                    onClick={() => setIsEntryModalOpen(false)}
                />
            </TableEntryModal>

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

            {/* Edit Modal */}
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
