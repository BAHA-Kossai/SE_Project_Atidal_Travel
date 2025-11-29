import {useState} from "react";
import WhiteContainer from "../WhiteContainer.jsx";
import ModalDialog from "../ModalDialog.jsx";
import SearchBar from "../SearchBar.jsx";
import ButtonOutline from "../ButtonOutline.jsx";
import ButtonFill from "../ButtonFill.jsx";
import Table from "../Table.jsx"
import {ArrowUpDown, Plus, SlidersHorizontal, X} from "lucide-react";
import InputField from "../InputField.jsx";
import TableEntryModal from "../TableEntryModal.jsx";

export default function TabAdmins() {
    const [admins, setAdmins] = useState([
        {
            user_id: 5,
            created_at: "2021-05-01T00:00:00.000Z",
            email: "example@gmail.com",
            first_name: "Yacine",
            last_name: "Yahyawi",
            phone: "30532050",
            date_of_birth: "2025-11-9",
            updated_at: "2021-05-01T00:00:00.000Z",
        },
        {
            user_id: 6,
            created_at: "2021-06-12T00:00:00.000Z",
            email: "sara.benali@gmail.com",
            first_name: "Sara",
            last_name: "Benali",
            phone: "0551283092",
            date_of_birth: "1998-03-14",
            updated_at: "2021-06-12T00:00:00.000Z",
        },
        {
            user_id: 7,
            created_at: "2021-07-20T00:00:00.000Z",
            email: "karim.mansour@gmail.com",
            first_name: "Karim",
            last_name: "Mansour",
            phone: "0770032145",
            date_of_birth: "1994-11-02",
            updated_at: "2021-07-20T00:00:00.000Z",
        },
        {
            user_id: 8,
            created_at: "2021-08-03T00:00:00.000Z",
            email: "amina.hachani@gmail.com",
            first_name: "Amina",
            last_name: "Hachani",
            phone: "0669281100",
            date_of_birth: "1995-07-22",
            updated_at: "2021-08-03T00:00:00.000Z",
        },
        {
            user_id: 9,
            created_at: "2021-08-17T00:00:00.000Z",
            email: "samir.cherif@gmail.com",
            first_name: "Samir",
            last_name: "Cherif",
            phone: "0794528193",
            date_of_birth: "1992-01-09",
            updated_at: "2021-08-17T00:00:00.000Z",
        },
        {
            user_id: 10,
            created_at: "2021-09-11T00:00:00.000Z",
            email: "nadia.boukhalfa@gmail.com",
            first_name: "Nadia",
            last_name: "Boukhalfa",
            phone: "0540739122",
            date_of_birth: "1999-09-30",
            updated_at: "2021-09-11T00:00:00.000Z",
        },
        {
            user_id: 11,
            created_at: "2021-10-04T00:00:00.000Z",
            email: "amine.djellal@gmail.com",
            first_name: "Amine",
            last_name: "Djellal",
            phone: "0691103342",
            date_of_birth: "1993-04-11",
            updated_at: "2021-10-04T00:00:00.000Z",
        },
        {
            user_id: 12,
            created_at: "2021-10-19T00:00:00.000Z",
            email: "rim.saadi@gmail.com",
            first_name: "Rim",
            last_name: "Saadi",
            phone: "0654028831",
            date_of_birth: "2000-12-15",
            updated_at: "2021-10-19T00:00:00.000Z",
        },
        {
            user_id: 13,
            created_at: "2021-11-28T00:00:00.000Z",
            email: "mohamed.senhadji@gmail.com",
            first_name: "Mohamed",
            last_name: "Senhadji",
            phone: "0558893104",
            date_of_birth: "1991-06-09",
            updated_at: "2021-11-28T00:00:00.000Z",
        },
        {
            user_id: 14,
            created_at: "2021-12-07T00:00:00.000Z",
            email: "ikram.meftah@gmail.com",
            first_name: "Ikram",
            last_name: "Meftah",
            phone: "0674912300",
            date_of_birth: "1997-05-26",
            updated_at: "2021-12-07T00:00:00.000Z",
        },
        {
            user_id: 15,
            created_at: "2022-01-13T00:00:00.000Z",
            email: "yacine.bahri@gmail.com",
            first_name: "Yacine",
            last_name: "Bahri",
            phone: "0774419033",
            date_of_birth: "1996-10-18",
            updated_at: "2022-01-13T00:00:00.000Z",
        }

    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredAdmins = admins.filter(admin => {
        return (
            admin.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.phone.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    // New/Edit/Delete/Select Employee Modals
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Employee Form Credentials
    const [formData, setFormData] = useState({
        created_at: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        date_of_birth: "",
        updated_at: "",
        branch_name: ""
    });

    const handleFormChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
    const [isSubmit, setIsSubmit] = useState(false);

    // Errors
    const [errors, setErrors] = useState({});


    const AddEmployee = (employee) => {
        console.log("Employee Added Successfully!");
        console.log(employee);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // setErrors(validateSubmission());
        setIsSubmit(true);

        if (Object.keys(errors).length === 0 && isSubmit) {
            // Add employee entry and close modal
            AddEmployee()
            setIsDeleteModalOpen(false)
        }
    }


    return (
        <>
            <WhiteContainer>
                <div className="flex flex-col">
                    {/* Search / Sort / Filter/ New Employee */}
                    <div className="flex flex-row justify-between items-center mb-5">
                        <SearchBar
                            placeholder={"Search for an employee"}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery('')}
                            searchQuery={searchQuery}
                        />
                        <div className="flex flex-row justify-between w-100">
                            <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonFill onClick={() => setIsAddModalOpen(true)}>
                                New Employee
                                <Plus size={22} className={"ml-2"}/></ButtonFill>
                        </div>
                    </div>
                </div>

                {/* Admins Table */}
                <Table
                    onSelect={
                        (admin) => // employee gets sent by the Table component
                        {
                            setSelectedAdmin(admin)
                            setIsEntryModalOpen(true)
                        }
                    }
                    onEdit={
                        (admin) => // employee gets sent by the Table component
                        {
                            setSelectedAdmin(admin)
                            setIsEditModalOpen(true)
                        }
                    }
                    onDelete={
                        (admin) => // employee gets sent by the Table component
                        {
                            setSelectedAdmin(admin)
                            setIsDeleteModalOpen(true)
                        }
                    }
                    columns={[
                        {
                            title: "ID",
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item.user_id}
                                </td>
                            )
                        },
                        {
                            title: "First Name",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.first_name}
                                </td>
                            )
                        },
                        {
                            title: "Last Name",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.last_name}
                                </td>
                            )
                        },
                        {
                            title: "Phone Number",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item.phone}
                                </td>
                            )
                        },
                        {
                            title: "Hire Date",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                            )
                        },
                    ]}
                    data={filteredAdmins}
                />
            </WhiteContainer>


            <TableEntryModal
                title={"Admin Information"}
                open={isEntryModalOpen}
                properties={[
                    {
                        name: "Admin ID",
                        value: selectedAdmin?.user_id,
                    },
                    {
                        name: "First Name",
                        value: selectedAdmin?.first_name,
                    },
                    {
                        name: "Last Name",
                        value: selectedAdmin?.last_name,
                    },
                    {
                        name: "Phone Number",
                        value: selectedAdmin?.phone,
                    },
                    {
                        name: "Email",
                        value: selectedAdmin?.email,
                    },
                    {
                        name: "Date of Birth",
                        value: selectedAdmin?.date_of_birth,
                    },
                    {
                        name: "Hire Date",
                        value: new Date(selectedAdmin?.created_at).toLocaleDateString(),
                    },
                    {
                        name: "Updated At",
                        value: `${new Date(selectedAdmin?.updated_at).toLocaleDateString()} at ${new Date(selectedAdmin?.updated_at).toLocaleTimeString()}`,
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

            {/* New Employee Modal */}
            <ModalDialog
                title={"New Employee"}
                description={"Add an employee to the team"}
                open={isAddModalOpen}
            >

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <h1 className={"text-xl"}>
                        Personal Information
                    </h1>
                    <div className={"grid grid-cols-2 gap-4 mb-7"}>
                        <InputField name={"first_name"} error={errors["first_name"]} label={"First name"} type="text" onChange={handleFormChange}/>
                        <InputField name={"last_name"} error={errors["last_name"]} label={"Last name"} type="text" onChange={handleFormChange}/>
                        <InputField name={"phone"} error={errors["phone"]} label={"Phone number"} type="text" onChange={handleFormChange}/>
                        <InputField name={"date_of_birth"} error={errors["date_of_birth"]} label={"Date of birth"} type="date" onChange={handleFormChange}/>
                        <InputField error={errors["email"]} label={"Email"} type="text"/>
                        <InputField error={errors["password"]} label={"Password"} type="password"/>
                    </div>


                    {/* Employment Details */}
                    <h1 className={"text-xl"}>
                        Employment Details
                    </h1>
                    <div className={"grid grid-cols-2 gap-4 mb-7"}>
                        <InputField error={errors.hire_date} label={"Hire date"} type="date" onChange={handleFormChange}/>
                        <InputField error={errors.branch_name} label={"Branch name"} type="text" onChange={handleFormChange}/>
                    </div>


                    {/* Add/Cancel Buttons */}
                    <div className={"grid grid-cols-2 gap-4"}>
                        <ButtonFill
                            width="full"
                            onClick={
                                () => AddEmployee(formData)
                            }
                        >
                            Add Admin</ButtonFill>
                        <ButtonOutline
                            width="full"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel</ButtonOutline>
                    </div>
                </form>
            </ModalDialog>

            {/* Edit Employee Modal */}
            <ModalDialog
                title={`Edit Employee ${selectedAdmin?.id ?? ""}`}
                open={isEditModalOpen}
            >
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"First name"}
                        disabled={false}
                        value={selectedAdmin?.["first_name"]}
                    />
                    <InputField
                        label={"Last name"}
                        disabled={false}
                        value={selectedAdmin?.["last_name"]}
                    />
                    <InputField
                        label={"Phone number"}
                        disabled={false}
                        value={selectedAdmin?.["phone"]}
                    />
                    <InputField
                        label={"Role"}
                        disabled={false}
                        value={selectedAdmin?.["role"]}
                    />
                    <InputField
                        label={"Hire date"}
                        disabled={false}
                        value={selectedAdmin?.["hire_date"]}
                    />
                    <InputField
                        label={"Availability"}
                        disabled={false}
                        value={selectedAdmin?.["availability"]}
                    />
                </div>
                <ButtonOutline onClick={() => setIsEditModalOpen(false)}>Cancel</ButtonOutline>
            </ModalDialog>

            {/* Delete Employee Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the employee with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedAdmin?.id}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>
        </>
    )
}