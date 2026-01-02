import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal, X} from "lucide-react";
import {useState, useEffect} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";
import TableEntryModal from "../TableEntryModal.jsx";
import { usePayers } from "../../../hooks/usePayers.js";
import Swal from "sweetalert2";

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
    // Use API hook to fetch payers from backend
    const { payers, loading, error, remove, refetch } = usePayers();
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Show loading state
    if (loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Loading payers...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
            </div>
        );
    }

    const handleDelete = async (id) => {
        try {
            setDeleteLoading(true);
            await remove(id);
            setIsDeleteModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Payer deleted successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to delete payer'
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredPayers = payers.filter(payer => {
        const query = searchQuery.toLowerCase();
        return (
            payer.first_name?.toLowerCase().includes(query) ||
            payer.last_name?.toLowerCase().includes(query) ||
            (payer.phone?.toLowerCase() || '').includes(query)  // ← SAFE
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
                onClose={() => setIsEntryModalOpen(false)}
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
                    {selectedPayer?.["payer_id"]}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill onClick={() => handleDelete(selectedPayer?.["payer_id"])} disabled={deleteLoading}>
                        {deleteLoading ? 'Deleting...' : 'Yes'}
                    </ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)} disabled={deleteLoading}>No</ButtonOutline>
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
