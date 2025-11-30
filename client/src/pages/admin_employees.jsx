import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import PagePath from "../components/PagePath.jsx";
import {useState} from "react";
import Tabs from "../components/Tabs.jsx";
import TabAdmins from "../components/admin-employees/TabAdmins.jsx";
import TabGuides from "../components/admin-employees/TabGuides.jsx";

export default function AdminEmployeesPage() {

    // Change Active Tab
    const [activeTab, setActiveTab] = useState("Admins");
    const tabs = ["Admins", "Guides"]

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Employees
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Employees"]} />
            </div>

            {/* Admins / Guides Tabs */}
            <div className={"mb-4"}>
                <Tabs items={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
            { activeTab === "Admins" && <TabAdmins/> }
            { activeTab === "Guides" && <TabGuides/> }

        </AppBarSideBarWithContent>
    )

}

