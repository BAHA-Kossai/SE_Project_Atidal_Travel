import '../styles/admin_settings.css'
import {useState} from "react";
import TabAccount from "../components/admin-settings/account/TabAccount.jsx";
import TabNotifications from "../components/admin-settings/notifications/TabNotifications.jsx";
import TabSecurity from "../components/admin-settings/security/TabSecurity.jsx";
import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";
import Tabs from "../components/Tabs.jsx";

export default function AdminSettings() {

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