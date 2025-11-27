import '../styles/admin_settings.css'
import {useState} from "react";
import TabAccount from "../components/admin-settings/TabAccount.jsx";
import TabNotifications from "../components/admin-settings/TabNotifications.jsx";
import TabSecurity from "../components/admin-settings/TabSecurity.jsx";
import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import Tabs from "../components/Tabs.jsx";

export default function AdminSettingsPage() {

    // Change Active Tab
    const [activeTab, setActiveTab] = useState("Account");
    const tabs = ["Account", "Notifications", "Security"]

    return (
        <AppBarSideBarWithContent>
            <Tabs items={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* Switch Between Tabs */}
            {activeTab === "Account" && <TabAccount/>}
            {activeTab === "Notifications" && <TabNotifications/>}
            {activeTab === "Security" && <TabSecurity/>}
        </AppBarSideBarWithContent>
    );
}