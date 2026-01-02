import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import Table from "../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import {useState, useEffect} from "react";
import PagePath from "../components/PagePath.jsx";
import ModalDialog from "../components/ModalDialog.jsx";
import InputField from "../components/InputField.jsx";
import FileDropzone from "../components/FileDropzone.jsx";
import TableEntryModal from "../components/TableEntryModal.jsx";
import { useDestinations } from "../../hooks/useDestinations.js";
import Swal from "sweetalert2";
import { API_BASE } from "../../config/env.js";

export default function AdminDestinationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Use the API hook
    const { destinations, loading, error, create, update, remove, fetchAllDestinations } = useDestinations();

    // Modals
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch destinations on mount
    useEffect(() => {
        fetchAllDestinations();
    }, [fetchAllDestinations]);

    const [formData, setFormData] = useState({
        destination_country: "",
        destination_city: "",
        description: "",
        created_by: ""
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isAddModalOpen && !isEditModalOpen) {
            setFormData({
                destination_country: "",
                destination_city: "",
                description: "",
                created_by: ""
            });
            setSelectedImage(null);
            setErrorMessage('');
        }
    }, [isAddModalOpen, isEditModalOpen]);

    // Populate form when editing
    useEffect(() => {
        if (selectedDestination && selectedDestination.destination_id && isEditModalOpen) {
            setFormData({
                destination_country: selectedDestination.destination_country || "",
                destination_city: selectedDestination.destination_city || "",
                description: selectedDestination.description || "",
                created_by: selectedDestination.created_by || ""
            });
        }
    }, [selectedDestination, isEditModalOpen]);

    // Helper to get image URL
    const getImageUrl = (destination) => {
        if (destination.picture_path) {
            return destination.picture_path.startsWith('http') 
                ? destination.picture_path 
                : `${API_BASE}${destination.picture_path}`;
        }
        return destination.imageURL || '';
    };

    const filteredDestinations = destinations.filter(dest => {
        const query = searchQuery.toLowerCase();
        return (
            (dest.destination_city || '').toLowerCase().includes(query) ||
            (dest.destination_country || '').toLowerCase().includes(query) ||
            (dest.created_by || '').toLowerCase().includes(query)
        );
    });

    const validateForm = () => {
        const errors = {};
        if (!formData.destination_country?.trim()) errors.destination_country = 'Country is required';
        if (!formData.destination_city?.trim()) errors.destination_city = 'City is required';
        return errors;
    };

    const handleAdd = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrorMessage(Object.values(errors).join(', '));
            return;
        }

        try {
            setSubmitLoading(true);
            setErrorMessage('');
            await create(formData, selectedImage);
            setIsAddModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Destination created successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            setErrorMessage(err.message || 'Failed to create destination');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to create destination'
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrorMessage(Object.values(errors).join(', '));
            return;
        }

        try {
            setSubmitLoading(true);
            setErrorMessage('');
            await update(selectedDestination.destination_id, formData, selectedImage);
            setIsEditModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Destination updated successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            setErrorMessage(err.message || 'Failed to update destination');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to update destination'
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setSubmitLoading(true);
            await remove(id);
            setIsDeleteModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Destination deleted successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to delete destination'
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Destinations
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Destinations"]}/>
            </div>

            <WhiteContainer>
                <div className="flex flex-col">
                    {/* Search / Sort / Filter/ New Destination */}
                    <div className="flex flex-row justify-between items-center mb-5">
                        <SearchBar
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery('')}
                            searchQuery={searchQuery}
                            placeholder={"Search for a destination"}/>
                        <div className="flex flex-row justify-between w-100">
                            <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonFill onClick={() => setIsAddModalOpen(true)}>New Destination<Plus size={22} className={"ml-2"}/></ButtonFill>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Loading destinations...</p>
                        </div>
                    ) : (
                        <Table
                        onSelect={
                            (destination) => {
                                setSelectedDestination(destination)
                                setIsEntryModalOpen(true)
                            }
                        }
                        onEdit={
                            (destination) => {
                                setSelectedDestination(destination)

                                setFormData({
                                    country: destination.destination_country,
                                    city: destination.destination_city,
                                    created_by: destination.created_by,
                                    image: destination.imageURL
                                })
                                setIsEditModalOpen(true)
                            }
                        }
                        onDelete={
                            (destination) => {
                                setSelectedDestination(destination)
                                setIsDeleteModalOpen(true)
                            }
                        }
                        columns={[
                            {
                                title : "Destination Country & City",
                                format: (item) =>
                                    <td className={"text-gray-400 text-center"}>
                                        <div className="flex items-center gap-3">

                                            {/* Avatar / Image placeholder */}
                                            <div className="w-10 h-10 bg-gray-100 rounded">
                                                <img src={getImageUrl(item)} width={40} height={40} alt="destination" className="object-cover rounded"/>
                                            </div>

                                            <div className={"flex flex-col items-start gap-3"}>
                                                <div className="text-gray-700 font-medium">{item.destination_country || item.country}</div>
                                                <div className="text-(--color-text-secondary) text-sm cursor-pointer">{item.destination_city || item.city}</div>
                                            </div>

                                        </div>
                                    </td>
                            },
                            {
                                title : "Created By",
                                format: (item) =>
                                    <td className={"text-gray-400 text-left"}>{item.created_by}</td>
                            },
                            {
                                title : "Created At",
                                format: (item) => {
                                    const date = item.created_at ? new Date(item.created_at) : null;
                                    return (
                                        <td className={"text-gray-400 text-left"}>
                                            {date ? `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}` : 'N/A'}
                                        </td>
                                    );
                                }
                            },
                        ]}
                        data={filteredDestinations}
                    />
                    )}
                </div>
            </WhiteContainer>


            {/* Entry Modal */}
            <TableEntryModal
                title={"Destination Information"}
                open={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                properties={
                [
                    {
                        name: "ID",
                        value: selectedDestination?.destination_id
                    },
                    {
                        name: "Description",
                        value: selectedDestination?.description
                    },
                    {
                        name: "Country",
                        value: selectedDestination?.destination_country
                    },
                    {
                        name: "City",
                        value: selectedDestination?.destination_city
                    },
                    {
                        name: "Creation Date",
                        value: selectedDestination?.created_at ? new Date(selectedDestination.created_at).toLocaleDateString() : 'N/A'
                    },
                    {
                        name: "Creation Time",
                        value: selectedDestination?.created_at ? new Date(selectedDestination.created_at).toLocaleTimeString() : 'N/A'
                    },
                ]
                }
            />

            {/* Add Modal */}
            <ModalDialog
                title={"New Destination"}
                description={"Add a new destination to the agency"}
                open={isAddModalOpen}
                className={"overflow-y-scroll"}
            >
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {errorMessage}
                    </div>
                )}
                <div className={"flex flex-col justify-center p-5"}>
                    {/* Upload Image */}
                    <FileDropzone
                        accept={"image/*"}
                        height={"150"}
                        selectedFile={selectedImage}
                        setSelectedFile={setSelectedImage}
                        placeholderText={"Drop an image, or browse"}
                    />

                    <div className={"w-full flex flex-col justify-between mt-5"}>
                        <div className={"w-full grid grid-cols-2 gap-y-3 gap-x-6  justify-between items-center"}>
                            {/* Input Fields */}
                            <InputField 
                                label={"Destination Country *"}
                                value={formData.destination_country}
                                onChange={(e) => setFormData({...formData, destination_country: e.target.value})}
                            />
                            <InputField 
                                label={"Destination City *"}
                                value={formData.destination_city}
                                onChange={(e) => setFormData({...formData, destination_city: e.target.value})}
                            />
                            <InputField 
                                className={"col-span-2 mb-4"} 
                                label={"Description"}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                            <InputField 
                                label={"Created By"}
                                value={formData.created_by}
                                onChange={(e) => setFormData({...formData, created_by: e.target.value})}
                            />
                            {/* Action Buttons */}
                            <ButtonOutline 
                                onClick={() => {
                                    setIsAddModalOpen(false); 
                                    setSelectedImage(null);
                                }} 
                                disabled={submitLoading}
                            >
                                Cancel
                            </ButtonOutline>
                            <ButtonFill onClick={handleAdd} disabled={submitLoading}>
                                {submitLoading ? 'Adding...' : 'Add Destination'}
                            </ButtonFill>
                        </div>
                    </div>
                </div>
            </ModalDialog>


            {/* Edit Modal */}
            <ModalDialog
                title={`Edit Destination ${selectedDestination?.destination_id || ''}`}
                open={isEditModalOpen}
                className={"overflow-y-scroll"}
            >
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {errorMessage}
                    </div>
                )}
                <div className={"grid grid-cols-2 gap-4 mb-5"}>
                    <InputField
                        label={"Destination Country *"}
                        value={formData.destination_country}
                        onChange={(e) => setFormData({...formData, destination_country: e.target.value})}
                    />
                    <InputField
                        label={"Destination City *"}
                        value={formData.destination_city}
                        onChange={(e) => setFormData({...formData, destination_city: e.target.value})}
                    />
                    <InputField
                        label={"Description"}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    <InputField
                        label={"Created By"}
                        value={formData.created_by}
                        onChange={(e) => setFormData({...formData, created_by: e.target.value})}
                    />
                </div>
                <FileDropzone
                    accept={"image/*"}
                    height={"150"}
                    selectedFile={selectedImage}
                    setSelectedFile={setSelectedImage}
                    placeholderText={"Drop an image, or browse"}
                />

                <div className={"grid grid-cols-2 gap-4 mt-4"}>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)} disabled={submitLoading}>
                        Cancel
                    </ButtonOutline>
                    <ButtonFill onClick={handleEdit} disabled={submitLoading}>
                        {submitLoading ? 'Updating...' : 'Edit destination'}
                    </ButtonFill>
                </div>
            </ModalDialog>

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the destination with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                        {selectedDestination?.destination_id}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill 
                        onClick={() => handleDelete(selectedDestination?.destination_id)} 
                        disabled={submitLoading}
                    >
                        {submitLoading ? 'Deleting...' : 'Yes'}
                    </ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)} disabled={submitLoading}>
                        No
                    </ButtonOutline>
                </div>
            </ModalDialog>
        </AppBarSideBarWithContent>
    )
}