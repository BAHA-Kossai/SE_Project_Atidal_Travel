import {AppBarSideBarWithContent} from "../../components/appBarSideBar.jsx";
import WhiteContainer from "../../components/WhiteContainer.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import ButtonOutline from "../../components/ButtonOutline.jsx";
import ButtonFill from "../../components/ButtonFill.jsx";
import Table from "../../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal} from "lucide-react";
import mock_destinations from '../../mock-destinations.json'
import {useNavigate} from "react-router-dom";
import PagePath from "../../components/PagePath.jsx";

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
                        <div className="flex flex-row justify-between w-100">
                            <ButtonOutline>Sort<ArrowUpDown size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonOutline>Filter<SlidersHorizontal size={18} className={"ml-2"}/></ButtonOutline>
                            <ButtonFill onClick={() => navigate("/admin-destinations/add-destination")}>New Destination<Plus size={22} className={"ml-2"}/></ButtonFill>
                        </div>
                    </div>
                    <Table
                        columns={[
                            {
                                title : "Destination Country & City",
                                format: (item) =>
                                <>
                                    <td className={"text-gray-400 text-center"}>
                                        <div className="flex items-center gap-3">

                                            {/* Avatar / Image placeholder */}
                                            <div className="w-10 h-10 bg-gray-100 rounded">
                                                <img src={item["imageURL"]} width={40} alt="img"/>
                                            </div>

                                            <div className={"flex flex-col items-start gap-3"}>
                                                <div className="text-gray-700 font-medium">{item["destination"]["country"]}</div>
                                                <div className="text-(--color-text-secondary) text-sm cursor-pointer">{item["destination"]["city"]}</div>
                                            </div>

                                        </div>
                                    </td>
                                </>
                            },
                            {
                                title : "Created By",
                                format: (item) =>
                                <>
                                    {/* Created By */}
                                    <td className={"text-gray-400 text-left"}>{item["created_by"]}</td>
                                </>
                            },
                            {
                                title : "Created At",
                                format: (item) =>
                                <>
                                    {/* Created At */}
                                    <td className={"text-gray-400 text-left"}>{item["created_at"]["date"]} at {item["created_at"]["time"]}</td>
                                </>
                            },
                        ]}
                        data={mock_destinations}
                    />
                </div>
            </WhiteContainer>
        </AppBarSideBarWithContent>
    )
}