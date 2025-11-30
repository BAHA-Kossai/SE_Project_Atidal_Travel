import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import BranchesTable from "../components/admin-branches/BranchesTable.jsx";
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

export default function Admin_branches() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setselectedBranch] = useState({});

    // Modals
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const [branches, setBranches] = useState([
        {
            branch_id: '#CR000123',
            branch_city: 'Algiers',
            branch_address: 'Algiers',
            email: 'email@gmail.com',
            phone: '+213 541 234 456',
            admin_id: '#CR000123',
            opening_time: "14:30:00",
            closing_time: "20:30:00",
            working_days: ["Sunday", "Monday"],
            is_active: false,
            created_at: "2025-02-14T13:45:30.123+00:00"
        },
    ]);

    const filteredBranches = branches.filter((branch) => {
        const query = searchQuery.toLowerCase();
        return (
            branch.branch_city.toLowerCase().includes(query) ||
            branch.email.toLowerCase().includes(query) ||
            branch.branch_address.toLowerCase().includes(query) ||
            branch.phone.includes(query)
        );
    })


    const [formData, setFormData] = useState({
        branch_city: '',
        branch_address: '',
        phone: '',
        email: '',
        opening_time: '',
        closing_time: '',
        is_active: false,
        created_at: '',
    })
    useEffect(() => {
        if (selectedBranch && selectedBranch.branch_id) {
            setFormData({
                branch_city: selectedBranch.branch_city,
                branch_address: selectedBranch.branch_address,
                phone: selectedBranch.phone,
                email: selectedBranch.email,
                opening_time: selectedBranch.opening_time,
                closing_time: selectedBranch.closing_time,
                is_active: false,
                created_at: selectedBranch.created_at,
            });
        }
    }, [selectedBranch, isEditModalOpen]);


    const handleEdit = () => {
        const updateBranches = branches.map((branch) =>
            branch.branch_id === selectedBranch.branch_id
                ? {...branch,
                    branch_city: formData.branch_city,
                    branch_address: formData.branch_address,
                    phone: formData.phone,
                    email: formData.email,
                    opening_time: formData.opening_time,
                    closing_time: formData.closing_time,
                    is_active: formData.is_active,
                    created_at: formData.created_at,
                } : branch
        )

        setBranches(updateBranches);
        setIsEditModalOpen(false);
    }

    const handleDelete = (id) => {
        setBranches(branches.filter(branch => branch.branch_id !== id));
        setIsDeleteModalOpen(false);
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

                {/* Table */}
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
                        value: selectedBranch?.status ? "Active" : "Inactive",
                    }
                ]}
                />

            {/* Add Modal */}
            <ModalDialog
                title={"Add branch"}
                description={"Add a new branch to the agency"}
                open={isAddModalOpen}
            >
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"Branch City"}
                        disabled={false}
                        onChange={(e) => setFormData({...formData, branch_city: e.target.value})}
                    />
                    <InputField
                        label={"Branch Address"}
                        disabled={false}
                        onChange={(e) => setFormData({...formData, branch_address: e.target.value})}
                    />
                    <InputField
                        label={"Phone number"}
                        disabled={false}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <InputField
                        label={"Email"}
                        disabled={false}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <InputField
                        label={"Opening Time"}
                        onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                    />
                    <InputField
                        label={"Closing Time"}
                        onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                    />
                    <InputField
                        label={"Status"}
                        type={"select"}
                        options={["Active", "Inactive"]}
                        onChange={(e) => setFormData({...formData, status: e.target.value === "Active"})}
                    />
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-5"}>
                    <ButtonOutline onClick={() => setIsAddModalOpen(false)}>Cancel</ButtonOutline>
                    <ButtonFill>Add Branch</ButtonFill>
                </div>
            </ModalDialog>


            {/* Edit Modal */}
            <ModalDialog
                title={`Edit Guide ${selectedBranch?.branch_id}`}
                open={isEditModalOpen}
            >
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"Branch City"}
                        disabled={false}
                        value={formData.branch_city}
                        onChange={(e) => setFormData({...formData, branch_city: e.target.value})}
                    />
                    <InputField
                        label={"Branch Address"}
                        disabled={false}
                        value={formData.branch_address}
                        onChange={(e) => setFormData({...formData, branch_address: e.target.value})}
                    />
                    <InputField
                        label={"Phone number"}
                        disabled={false}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <InputField
                        label={"Email"}
                        disabled={false}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <InputField
                        label={"Opening Time"}
                        value={formData.opening_time}
                        onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                    />
                    <InputField
                        label={"Closing Time"}
                        value={formData.closing_time}
                        onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                    />
                    <InputField
                        label={"Status"}
                        value={formData.status ? "Active" : "Inactive"}
                        type={"select"}
                        options={["Active", "Inactive"]}
                        onChange={(e) => setFormData({...formData, status: e.target.value === "Active"})}
                    />
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-4"}
                >
                    <ButtonOutline onClick={() => setIsEditModalOpen(false)}>Cancel</ButtonOutline>
                    <ButtonFill onClick={() => handleEdit()}>Edit Branch</ButtonFill>
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
                    <ButtonFill onClick={() => handleDelete(selectedBranch.branch_id)}>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
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