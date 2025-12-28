import WhiteContainer from "../WhiteContainer.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import {ArrowUpDown, SlidersHorizontal, X} from "lucide-react";
import {useState, useEffect} from "react";
import Table from "../Table.jsx";
import ModalDialog from "../ModalDialog.jsx";
import ButtonFill from "../ButtonFill.jsx";
import TableEntryModal from "../TableEntryModal.jsx";
import { useTravelers } from "../../../hooks/useTravelers.js";
import Swal from "sweetalert2";

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
    // Use API hook to fetch travelers from backend
    const { travelers, loading, error, remove, refetch } = useTravelers();
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Show loading state
    if (loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Loading travelers...</p>
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
                text: 'Traveler deleted successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to delete traveler'
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredTravelers = travelers.filter((traveler) => {
        const query = searchQuery.toLowerCase();
        return (
            (traveler.first_name || '').toLowerCase().includes(query) ||
            (traveler.last_name || '').toLowerCase().includes(query) ||
            (traveler.age || '').toString().includes(query) ||
            (traveler.identity_number || '').toString().toLowerCase().includes(query) ||
            (traveler.passport_number || '').toLowerCase().includes(query)
        )
    });

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
                    <ButtonFill onClick={() => handleDelete(selectedTraveler?.["traveler_id"])} disabled={deleteLoading}>
                        {deleteLoading ? 'Deleting...' : 'Yes'}
                    </ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)} disabled={deleteLoading}>No</ButtonOutline>
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