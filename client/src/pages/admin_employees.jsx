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

export default function AdminEmployees() {
    // Employee Modal
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    // Employee Credentials
    const [employeeFirstName, setEmployeeFirstName] = useState("");
    const [employeeLastName, setEmployeeLastName] = useState("");
    const [employeeEmail, setEmployeeEmail] = useState("");
    const [employeePhoneNumber, setEmployeePhoneNumber] = useState("");
    const [employeeDateOfBirth, setEmployeeDateOfBirth] = useState("");
    const [employeeRole, setEmployeeRole] = useState("");
    const [employeeHireDate, setEmployeeHireDate] = useState("");
    const [employeeBranchName, setEmployeeBranchName] = useState("");
    const [employeeStatus, setEmployeeStatus] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    // Errors
    const [errors, setErrors] = useState({});


    const AddEmployee = (first_name, last_name, phone_number, date_of_birth, role, hire_date, branch_name, status) => {
        console.log("Employee Added Successfully!");
        console.log(first_name, last_name, phone_number, date_of_birth, role, hire_date, branch_name, status);
    }


    const validateSubmission = () => {
        const errors = {}

        const firstNameLastNameRegex = /^[A-Za-z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        // First name
        if (!employeeFirstName) {
            errors["first_name"] = "First name is required";
        }
        else if (!firstNameLastNameRegex.test(employeeFirstName)) {
            errors["first_name"] = "First name should not contain any digits or special characters";
        }

        // Last name
        if (!employeeLastName) {
            errors["last_name"] = "Last name is required";
        }
        else if (!firstNameLastNameRegex.test(employeeLastName)) {
            errors["last_name"] = "Last name should not contain any digits or special characters";
        }

        // Email
        if (!employeeEmail) {
            errors["email"] = "Email name is required";
        }
        else if (!emailRegex.test(employeeEmail)) {
            errors["email"] = "Invalid Email";
        }

        return errors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(validateSubmission());
        setIsSubmit(true);

        if (Object.keys(errors).length === 0 && isSubmit) {
            // Add employee entry and close modal
            AddEmployee()
            setIsAddEmployeeModalOpen(false)
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

            <ModalDialog
                title={"New Employee"}
                description={"Add an employee to the team"}
                open={isAddEmployeeModalOpen}
            >

                {/* Employee Modal Form */}
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <h1 className={"text-xl"}>
                        Personal Information
                    </h1>
                    <div className={"grid grid-cols-2 gap-4 mb-7"}>
                        <InputField error={errors["first_name"]} label={"First name"} type="text" onChange={e => setEmployeeFirstName(e.target.value)}/>
                        <InputField error={errors["last_name"]} label={"Last name"} type="text" onChange={e => setEmployeeLastName(e.target.value)}/>
                        <InputField error={errors["email"]} label={"Email"} type="text" onChange={e => setEmployeeEmail(e.target.value)}/>
                        <InputField error={errors["phone_number"]} label={"Phone number"} type="text" onChange={e => setEmployeePhoneNumber(e.target.value)}/>
                        <InputField error={errors["date_of_birth"]} label={"Date of birth"} type="date" onChange={e => setEmployeeDateOfBirth(e.target.value)}/>
                    </div>


                    {/* Employment Details */}
                    <h1 className={"text-xl"}>
                        Employment Details
                    </h1>
                    <div className={"grid grid-cols-2 gap-4 mb-7"}>
                        <InputField error={errors["role"]} label={"Role"} type="text" onChange={(e) => setEmployeeRole(e.target.value)}/>
                        <InputField error={errors["hire_date"]} label={"Hire date"} type="date" onChange={e => setEmployeeHireDate(e.target.value)}/>
                        <InputField error={errors["branch_name"]} label={"Branch name"} type="text" onChange={e => setEmployeeBranchName(e.target.value)}/>
                        <InputField
                            label={"Status"}
                            type="select"
                            options={[
                                {name: "Available", value: true},
                                {name: "Not Available", value: false}
                            ]}
                            onChange={e => setEmployeeStatus(e.target.value)}/>
                    </div>


                    {/* Add/Cancel Buttons */}
                    <div className={"flex flex-row justify-center w-full"}>
                        <ButtonOutline
                            width="full"
                            onClick={() => setIsAddEmployeeModalOpen(false)}
                        >
                            Cancel
                        </ButtonOutline>
                        <ButtonFill
                            width="full"
                            onClick={
                                () => AddEmployee(
                                    employeeFirstName, employeeLastName, employeePhoneNumber, employeeDateOfBirth,
                                    employeeRole, employeeHireDate, employeeBranchName, employeeStatus
                                )
                            }
                        >Add Employee</ButtonFill>
                    </div>
                </form>
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