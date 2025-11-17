import '../styles/admin_settings.css'
import {useState} from "react";
import AppBar from "../components/AppBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TabAccount from "../components/admin-settings/account/TabAccount.jsx";
import TabNotifications from "../components/admin-settings/notifications/TabNotifications.jsx";
import TabSecurity from "../components/admin-settings/security/TabSecurity.jsx";

export default function AdminSettings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Toggle sidebar
    const handleMenuClick = () => {
        setIsSidebarOpen(prev => !prev);
    };
    // Close sidebar
    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Change Between Tabs
    const [activeTab, setActiveTab] = useState("Account");
    const tabs = ["Account", "Notifications", "Security"]

    return (
        <div className="dashboard-layout">
            <div className="main-content">
                {/* AppBar and Sidebar */}
                <AppBar onMenuClick={handleMenuClick} />
                <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

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
    );
}