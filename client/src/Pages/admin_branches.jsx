import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import {useEffect, useState} from "react";
import PagePath from "../components/PagePath.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import ButtonFill from "../components/ButtonFill.jsx";
import Table from "../components/Table.jsx";
import TableEntryModal from "../components/TableEntryModal.jsx";
import ModalDialog from "../components/ModalDialog.jsx";
import InputField from "../components/InputField.jsx";
import { useBranches } from "../../hooks/useBranches.js";
import Swal from "sweetalert2";

export default function Admin_branches() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setselectedBranch] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Use the API hook
    const { branches, loading, error, create, update, remove, refetch } = useBranches();

    // Modals
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Filter branches based on search query
    const filteredBranches = branches.filter((branch) => {
        const query = searchQuery.toLowerCase();
        return (
            (branch.branch_city || '').toLowerCase().includes(query) ||
            (branch.email || '').toLowerCase().includes(query) ||
            (branch.branch_address || '').toLowerCase().includes(query) ||
            (branch.phone || '').includes(query) ||
            (branch.branch_name || '').toLowerCase().includes(query)
        );
    });

    const [formData, setFormData] = useState({
        branch_name: '',
        branch_city: '',
        branch_address: '',
        phone: '',
        email: '',
        opening_time: '',
        closing_time: '',
        working_days: [],
        is_active: true,
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isAddModalOpen && !isEditModalOpen) {
            setFormData({
                branch_name: '',
                branch_city: '',
                branch_address: '',
                phone: '',
                email: '',
                opening_time: '',
                closing_time: '',
                working_days: [],
                is_active: true,
            });
            setErrorMessage('');
        }
    }, [isAddModalOpen, isEditModalOpen]);

    // Populate form when editing
    useEffect(() => {
        if (selectedBranch && selectedBranch.branch_id && isEditModalOpen) {
            setFormData({
                branch_name: selectedBranch.branch_name || '',
                branch_city: selectedBranch.branch_city || '',
                branch_address: selectedBranch.branch_address || '',
                phone: selectedBranch.phone || '',
                email: selectedBranch.email || '',
                opening_time: selectedBranch.opening_time || '',
                closing_time: selectedBranch.closing_time || '',
                working_days: selectedBranch.working_days || [],
                is_active: selectedBranch.is_active !== undefined ? selectedBranch.is_active : true,
            });
        }
    }, [selectedBranch, isEditModalOpen]);

    const validateForm = () => {
        const errors = {};
        if (!formData.branch_name?.trim()) errors.branch_name = 'Branch name is required';
        if (!formData.branch_address?.trim()) errors.branch_address = 'Branch address is required';
        if (!formData.branch_city?.trim()) errors.branch_city = 'Branch city is required';
        if (!formData.phone?.trim()) errors.phone = 'Phone is required';
        if (!formData.email?.trim()) errors.email = 'Email is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }
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
            await create(formData);
            setIsAddModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Branch created successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            setErrorMessage(err.message || 'Failed to create branch');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to create branch'
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
            await update(selectedBranch.branch_id, formData);
            setIsEditModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Branch updated successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            setErrorMessage(err.message || 'Failed to update branch');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to update branch'
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
                text: 'Branch deleted successfully',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Failed to delete branch'
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Branches
                </h1>

                <PagePath pathItems={["Admin", "Branches"]}/>
            </div>



            <WhiteContainer>
                {/* Search / Sort / Filter/ New Branch */}
                <div className="flex flex-row justify-between items-center mb-5">
                    <SearchBar
                        placeholder={"Search for a branch"}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        searchQuery={searchQuery}
                    />
                    <div className="flex flex-row justify-between w-100">
                        <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                        <ButtonFill onClick={() => setIsAddModalOpen(true)}>
                            New Branch
                            <Plus size={22} className={"ml-2"}/></ButtonFill>
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
                        <p className="text-gray-500">Loading branches...</p>
                    </div>
                ) : (
                    /* Table */
                    <Table
                    onSelect={ (branch) => {
                        setselectedBranch(branch)
                        setIsEntryModalOpen(true)
                    }
                    }
                    onEdit={ (branch) => {
                        setselectedBranch(branch)
                        setIsEditModalOpen(true)
                    }
                    }
                    onDelete={ (branch) => {
                        setselectedBranch(branch)
                        setIsDeleteModalOpen(true)
                    }}
                    columns={[
                        {
                            title: 'Branch ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary)"}>
                                    {item.branch_id}
                                </td>
                            )
                        },
                        {
                            title: 'Branch Name',
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{item.branch_name || 'N/A'}</td>
                            )
                        },
                        {
                            title: 'City',
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{item.branch_city}</td>
                            )
                        },
                        {
                            title: 'Email',
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{item.email}</td>
                            )
                        },
                        {
                            title: 'Phone Number',
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{item.phone}</td>
                            )
                        },
                        {
                            title: 'Admin ID',
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary)"}>
                                    {item.admin_id}
                                </td>
                            )
                        },
                        {
                            title: 'Status',
                            format: (item) => (
                                <td className={"text-gray-400 text-left"}>{statusWidget(item.is_active)}</td>
                            )
                        },
                    ]}
                    data={filteredBranches}
                />
                )}
            </WhiteContainer>

            {/* Entry Modal */}
            <TableEntryModal
                title={"Branch Information"}
                open={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                properties={[
                    {
                        name: 'Branch ID',
                        value: selectedBranch?.branch_id,
                    },
                    {
                        name: 'Branch Name',
                        value: selectedBranch?.branch_name,
                    },
                    {
                        name: 'Branch Address',
                        value: selectedBranch?.branch_address,
                    },
                    {
                        name: 'Branch City',
                        value: selectedBranch?.branch_city,
                    },
                    {
                        name: 'Phone Number',
                        value: selectedBranch?.phone,
                    },
                    {
                        name: 'Email',
                        value: selectedBranch?.email,
                    },
                    {
                        name: 'Admin ID',
                        value: selectedBranch?.admin_id,
                    },
                    {
                        name: 'Opening Time',
                        value: selectedBranch?.opening_time,
                    },
                    {
                        name: 'Closing Time',
                        value: selectedBranch?.closing_time,
                    },
                    {
                        name: 'Creation Date',
                        value: new Date(selectedBranch?.created_at).toLocaleDateString(),
                    },
                    {
                        name: 'Creation Time',
                        value: new Date(selectedBranch?.created_at).toLocaleTimeString(),
                    },
                    {
                        name: 'Status',
                        value: selectedBranch?.is_active ? "Active" : "Inactive",
                    }
                ]}
                />

            {/* Add Modal */}
            <ModalDialog
                title={"Add branch"}
                description={"Add a new branch to the agency"}
                open={isAddModalOpen}
            >
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {errorMessage}
                    </div>
                )}
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"Branch Name *"}
                        disabled={false}
                        value={formData.branch_name}
                        onChange={(e) => setFormData({...formData, branch_name: e.target.value})}
                    />
                    <InputField
                        label={"Branch City *"}
                        disabled={false}
                        value={formData.branch_city}
                        onChange={(e) => setFormData({...formData, branch_city: e.target.value})}
                    />
                    <InputField
                        label={"Branch Address *"}
                        disabled={false}
                        value={formData.branch_address}
                        onChange={(e) => setFormData({...formData, branch_address: e.target.value})}
                    />
                    <InputField
                        label={"Phone number *"}
                        disabled={false}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <InputField
                        label={"Email *"}
                        disabled={false}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <InputField
                        label={"Opening Time"}
                        type="time"
                        value={formData.opening_time}
                        onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                    />
                    <InputField
                        label={"Closing Time"}
                        type="time"
                        value={formData.closing_time}
                        onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                    />
                    <InputField
                        label={"Status"}
                        type={"select"}
                        value={formData.is_active ? "Active" : "Inactive"}
                        options={["Active", "Inactive"]}
                        onChange={(e) => setFormData({...formData, is_active: e.target.value === "Active"})}
                    />
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-5"}>
                    <ButtonOutline onClick={() => setIsAddModalOpen(false)} disabled={submitLoading}>
                        Cancel
                    </ButtonOutline>
                    <ButtonFill onClick={handleAdd} disabled={submitLoading}>
                        {submitLoading ? 'Adding...' : 'Add Branch'}
                    </ButtonFill>
                </div>
            </ModalDialog>


            {/* Edit Modal */}
            <ModalDialog
                title={`Edit Branch ${selectedBranch?.branch_id || ''}`}
                open={isEditModalOpen}
            >
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {errorMessage}
                    </div>
                )}
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"Branch Name *"}
                        disabled={false}
                        value={formData.branch_name}
                        onChange={(e) => setFormData({...formData, branch_name: e.target.value})}
                    />
                    <InputField
                        label={"Branch City *"}
                        disabled={false}
                        value={formData.branch_city}
                        onChange={(e) => setFormData({...formData, branch_city: e.target.value})}
                    />
                    <InputField
                        label={"Branch Address *"}
                        disabled={false}
                        value={formData.branch_address}
                        onChange={(e) => setFormData({...formData, branch_address: e.target.value})}
                    />
                    <InputField
                        label={"Phone number *"}
                        disabled={false}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <InputField
                        label={"Email *"}
                        disabled={false}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <InputField
                        label={"Opening Time"}
                        type="time"
                        value={formData.opening_time}
                        onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                    />
                    <InputField
                        label={"Closing Time"}
                        type="time"
                        value={formData.closing_time}
                        onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                    />
                    <InputField
                        label={"Status"}
                        value={formData.is_active ? "Active" : "Inactive"}
                        type={"select"}
                        options={["Active", "Inactive"]}
                        onChange={(e) => setFormData({...formData, is_active: e.target.value === "Active"})}
                    />
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-4"}>
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)} disabled={submitLoading}>
                        Cancel
                    </ButtonOutline>
                    <ButtonFill onClick={handleEdit} disabled={submitLoading}>
                        {submitLoading ? 'Updating...' : 'Edit Branch'}
                    </ButtonFill>
                </div>
            </ModalDialog>

            {/* Delete Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the branch with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedBranch?.branch_id}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill onClick={() => handleDelete(selectedBranch.branch_id)} disabled={submitLoading}>
                        {submitLoading ? 'Deleting...' : 'Yes'}
                    </ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)} disabled={submitLoading}>
                        No
                    </ButtonOutline>
                </div>
            </ModalDialog>

        </AppBarSideBarWithContent>
    );
}

const statusWidget = (isActive) => {
    return (
        <div className={`
            flex flex-row px-4 justify-center items-center
            h-10 text-sm
            text-${isActive ? "green-600" : "red-600"}
            bg-${isActive ? "green-100" : "red-100"}
            rounded-full
       `}>
            <div className={`rounded-xl w-2 h-2 bg-${isActive ? "green-600" : "red-600"} mr-2`}></div>
            {isActive ? "Active" : "Inactive"}
        </div>
    )
}