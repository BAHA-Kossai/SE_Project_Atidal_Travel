import '../styles/admin_settings.css'
import {useState} from "react";
import TabAccount from "../components/admin-settings/account/TabAccount.jsx";
import TabNotifications from "../components/admin-settings/notifications/TabNotifications.jsx";
import TabSecurity from "../components/admin-settings/security/TabSecurity.jsx";
import {AppBarSideBarWithContent} from "../components/appBarSideBar.jsx";

export default function AdminSettings() {

    // Change Between Tabs
    const [activeTab, setActiveTab] = useState("Account");
    const tabs = ["Account", "Notifications", "Security"]

    return (
        <AppBarSideBarWithContent>
            <div className="dashboard-layout">
                <div className={"px-8 pt-10"}>
                    {/* Iterate through tabs to render them */}
                    <div className="tabs">
                        {tabs.map((tab, index) => (
                            <button key={index}
                                    onClick={() => setActiveTab(tab)}
                                    className={`tab ${activeTab  === tab ? 'tab-active' : ''}`}
                            >{tab}
                            </button>
                        ))}
                    </div>

                    {/* Switch Between Tabs */}
                    {activeTab === "Account" && <TabAccount/>}
                    {activeTab === "Notifications" && <TabNotifications/>}
                    {activeTab === "Security" && <TabSecurity/>}
                </div>
            </div>
        </AppBarSideBarWithContent>
    );
}