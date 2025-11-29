import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import BranchesTable from "../components/admin-branches/BranchesTable.jsx";

export default function Admin_branches() {
    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Destinations
                </h1>
        </div>
            <BranchesTable />
        </AppBarSideBarWithContent>
    );
}