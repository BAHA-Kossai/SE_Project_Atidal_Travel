import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";
import PagePath from "../components/PagePath.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import {useState} from "react";
import Table from "../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import mock_employees from "../mock-employees.json"
import ModalDialog from "../components/ModalDialog.jsx";
import InputField from "../components/InputField.jsx";
import ButtonSwitch from "../components/ButtonSwitch.jsx";

export default function AdminEmployees() {
    // New/Edit/Delete Employee Modals
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
    const [isDeleteEmployeeModalOpen, setIsDeleteEmployeeModalOpen] = useState(false);
    // Employee Form Credentials
    const [employeeForm, setEmployeeForm] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        role: "",
        hire_date: "",
        availability: false,
    });

    const handleFormChange = e => {
        setEmployeeForm({
            ...employeeForm,
            [e.target.name]: e.target.value,
        })
    }
    const [isSubmit, setIsSubmit] = useState(false);

    // Admin/Guide Buttons
    const [adminSelectedButton, setAdminSelectedButton] = useState(true)
    // Errors
    const [errors, setErrors] = useState({});


    const AddEmployee = (employee) => {
        console.log("Employee Added Successfully!");
        console.log(employee);
    }


    // const validateSubmission = () => {
    //     const errors = {}
    //
    //     const firstNameLastNameRegex = /^[A-Za-z]+$/;
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    //
    //     // First name
    //     if (!employeeFirstName) {
    //         errors["first_name"] = "First name is required";
    //     }
    //     else if (!firstNameLastNameRegex.test(employeeFirstName)) {
    //         errors["first_name"] = "First name should not contain any digits or special characters";
    //     }
    //
    //     // Last name
    //     if (!employeeLastName) {
    //         errors["last_name"] = "Last name is required";
    //     }
    //     else if (!firstNameLastNameRegex.test(employeeLastName)) {
    //         errors["last_name"] = "Last name should not contain any digits or special characters";
    //     }
    //
    //     // Email
    //     if (!employeeEmail) {
    //         errors["email"] = "Email name is required";
    //     }
    //     else if (!emailRegex.test(employeeEmail)) {
    //         errors["email"] = "Invalid Email";
    //     }
    //
    //     return errors;
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        // setErrors(validateSubmission());
        setIsSubmit(true);

        if (Object.keys(errors).length === 0 && isSubmit) {
            // Add employee entry and close modal
            AddEmployee()
            setIsDeleteEmployeeModalOpen(false)
        }
    }


    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Employees
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Employees"]} />
            </div>

            <WhiteContainer>
                    <div className="flex flex-col">
                        {/* Search / Sort / Filter/ New Destination */}
                        <div className="flex flex-row justify-between items-center mb-5">
                            <SearchBar placeholder={"Search for an employee"}/>
                            <div className="flex flex-row justify-between w-100">
                                <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                                <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                                <ButtonFill onClick={() => setIsAddEmployeeModalOpen(true)}>
                                    New Employee
                                    <Plus size={22} className={"ml-2"}/></ButtonFill>
                            </div>
                        </div>
                    </div>
                <Table
                    onEdit={
                        (employee) => // employee gets sent by the Table component
                        {
                            setSelectedEmployee(employee)
                            setIsEditEmployeeModalOpen(true)
                        }
                    }
                    onDelete={
                        (employee) => // employee gets sent by the Table component
                        {
                            setSelectedEmployee(employee)
                            setIsDeleteEmployeeModalOpen(true)
                        }
                    }
                    columns={[
                        {
                            title: "ID",
                            format: (item) => (
                                <td className={"text-center text-(--color-text-secondary) cursor-pointer hover:underline"}>
                                    {item["id"]}
                                </td>
                            )
                        },
                        {
                            title: "Name",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["first_name"]}
                                </td>
                            )
                        },
                        {
                            title: "Phone Number",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["phone_number"]}
                                </td>
                            )
                        },
                        {
                            title: "Role",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["role"]}
                                </td>
                            )
                        },
                        {
                            title: "Hire Date",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["hire_date"]}
                                </td>
                            )
                        },
                        {
                            title: "Availability",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {isAvailableWidget(item["availability"])}
                                </td>
                            )
                        },
                    ]}
                    data={mock_employees}
                />
            </WhiteContainer>

            {/* New Employee Modal */}
            <ModalDialog
                title={"New Employee"}
                description={"Add an employee to the team"}
                open={isAddEmployeeModalOpen}
            >

                <div className={"grid grid-cols-2 gap-4 mb-5"}>
                    <ButtonSwitch isSelected={adminSelectedButton} onClick={() => setAdminSelectedButton(true)}>Admin</ButtonSwitch>
                    <ButtonSwitch isSelected={!adminSelectedButton} onClick={() => setAdminSelectedButton(false)}>Guide</ButtonSwitch>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <h1 className={"text-xl"}>
                        Personal Information
                    </h1>
                    <div className={"grid grid-cols-2 gap-4 mb-7"}>
                        <InputField name={"first_name"} error={errors["first_name"]} label={"First name"} type="text" onChange={handleFormChange}/>
                        <InputField name={"last_name"} error={errors["last_name"]} label={"Last name"} type="text" onChange={handleFormChange}/>
                        <InputField name={"phone_number"} error={errors["phone_number"]} label={"Phone number"} type="text" onChange={handleFormChange}/>
                        <InputField name={"date_of_birth"} error={errors["date_of_birth"]} label={"Date of birth"} type="date" onChange={handleFormChange}/>
                        {
                            adminSelectedButton ?
                            <>
                                <InputField error={errors["email"]} label={"Email"} type="text"/>
                                <InputField error={errors["password"]} label={"Password"} type="password"/>
                            </>
                                :
                                <InputField className={"col-span-2"} error={errors["date_of_birth"]} label={"Experience"} type="text area" onChange={handleFormChange}/>
                        }
                    </div>


                    {/* Employment Details */}
                    <h1 className={"text-xl"}>
                        Employment Details
                    </h1>
                    <div className={"grid grid-cols-2 gap-4 mb-7"}>
                        <InputField error={errors["hire_date"]} label={"Hire date"} type="date" onChange={handleFormChange}/>
                        <InputField error={errors["branch_name"]} label={"Branch name"} type="text" onChange={handleFormChange}/>
                        <InputField
                            label={"Status"}
                            type="select"
                            options={[
                                {name: "Available", value: true},
                                {name: "Not Available", value: false}
                            ]}
                            onChange={handleFormChange}/>
                    </div>


                    {/* Add/Cancel Buttons */}
                    <div className={"grid grid-cols-2 gap-4"}>
                        <ButtonFill
                            width="full"
                            onClick={
                                () => AddEmployee(employeeForm)
                            }
                        >
                            Add Employee</ButtonFill>
                        <ButtonOutline
                            width="full"
                            onClick={() => setIsDeleteEmployeeModalOpen(false)}
                        >
                            Cancel</ButtonOutline>
                    </div>
                </form>
            </ModalDialog>

            {/* Edit Employee Modal */}
            <ModalDialog
                title={`Edit Employee ${selectedEmployee?.id ?? ""}`}
                open={isEditEmployeeModalOpen}
            >
                <div className={"grid grid-cols-2 gap-4"}>
                    <InputField
                        label={"First name"}
                        disabled={false}
                        value={selectedEmployee?.["first_name"]}
                        />
                    <InputField
                        label={"Last name"}
                        disabled={false}
                        value={selectedEmployee?.["last_name"]}
                    />
                    <InputField
                        label={"Phone number"}
                        disabled={false}
                        value={selectedEmployee?.["phone_number"]}
                    />
                    <InputField
                        label={"Role"}
                        disabled={false}
                        value={selectedEmployee?.["role"]}
                    />
                    <InputField
                        label={"Hire date"}
                        disabled={false}
                        value={selectedEmployee?.["hire_date"]}
                    />
                    <InputField
                        label={"Availability"}
                        disabled={false}
                        value={selectedEmployee?.["availability"]}
                    />
                </div>
                <ButtonOutline onClick={() => setIsEditEmployeeModalOpen(false)}>Cancel</ButtonOutline>
            </ModalDialog>

            {/* Delete Employee Modal */}
            <ModalDialog
                open={isDeleteEmployeeModalOpen}
            >
                <div className={"text-center text-xl"}>
                    <h1>
                        Are you sure that you want to delete the employee with ID
                    </h1>
                    <span className={"text-(--color-text-secondary)"}>
                    {selectedEmployee?.id}
                    </span>
                    <h1>
                        This action cannot be undone
                    </h1>
                </div>
                <div className={"grid grid-cols-2 gap-4 mt-8"}>
                    <ButtonFill>Yes</ButtonFill>
                    <ButtonOutline onClick={() => setIsDeleteEmployeeModalOpen(false)}>No</ButtonOutline>
                </div>
            </ModalDialog>
        </AppBarSideBarWithContent>
    )
}


const isAvailableWidget = (isAvailable) => {
    return (
        <div className={`flex flex-row px-4 h-10 text-sm ${ isAvailable ? "text-green-600" : "text-red-600"} justify-center items-center  rounded-full ${ isAvailable ? "bg-green-100" : "bg-red-100"}`}>
            <div className={`rounded-xl w-2 h-2 ${ isAvailable ? "bg-green-600" : "bg-red-600"}  mr-2`}></div>
            { isAvailable ? "Available" : "Not Available" }
        </div>
    )
}