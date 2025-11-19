import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ButtonOutline from "../components/ButtonOutline.jsx";
import ButtonFill from "../components/ButtonFill.jsx";
import Table from "../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import mock_data from '../mock-data.json'
import {useNavigate} from "react-router-dom";
import PagePath from "../components/PagePath.jsx";

export default function AdminDestinations() {
    const navigate = useNavigate();

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
                        <SearchBar placeholder={"Search for an order"}/>
                        <div className="flex flex-row justify-between">
                            <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonFill onClick={() => navigate("/admin-destinations/add-destination")}>New Destination<Plus size={22} className={"ml-2"}/></ButtonFill>
                        </div>
                    </div>
                    <Table
                        columns={["Destination Country & City", "Created By", "Created At", "Actions"]}
                        data={mock_data}
                    />
                </div>
            </WhiteContainer>
        </AppBarSideBarWithContent>
    )
}