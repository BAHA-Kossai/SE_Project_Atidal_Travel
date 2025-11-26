import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import WhiteContainer from "../components/WhiteContainer.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Table from "../components/Table.jsx";
import {ArrowUpDown, Plus, SlidersHorizontal, UploadCloud, UploadIcon} from "lucide-react";
import mock_destinations from '../mock-destinations.json'
import {useState} from "react";
import BranchTable from "./Table.jsx";

export default function AdminBranches() {
    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Destinations
                </h1>
        </div>
            <BranchTable />
        </AppBarSideBarWithContent>
    );
}