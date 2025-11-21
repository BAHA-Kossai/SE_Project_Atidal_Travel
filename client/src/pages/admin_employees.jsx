import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";
import PagePath from "../components/PagePath.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import {useNavigate} from "react-router-dom";
import Table from "../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import mock_employees from "../mock-employees.json"

export default function AdminEmployees() {
    const navigate = useNavigate();
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
                                <ButtonFill onClick={() => navigate("/admin-employees/add-employee")}>
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
                                <td className={"text-center text-(--color-text-secondary)"}>
                                    {item["id"]}
                                </td>
                            )
                        },
                        {
                            title: "Name",
                            format: (item) => (
                                <td className={"text-center text-gray-400"}>
                                    {item["name"]}
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
                                    {isAvailable(item["availability"])}
                                </td>
                            )
                        },
                    ]}
                    data={mock_employees}
                />
            </WhiteContainer>
        </AppBarSideBarWithContent>
    )
}


const isAvailable = (isAvailable) => {
    return (
        <div className={`flex flex-row px-4 h-10 text-sm ${ isAvailable ? "text-green-600" : "text-red-600"} justify-center items-center  rounded-full ${ isAvailable ? "bg-green-100" : "bg-red-100"}`}>
            <div className={`rounded-xl w-2 h-2 ${ isAvailable ? "bg-green-600" : "bg-red-600"}  mr-2`}></div>
            { isAvailable ? "Available" : "Not Available" }
        </div>
    )
}