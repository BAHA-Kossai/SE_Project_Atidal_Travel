import '../styles/admin_settings.css'
import {useState} from "react";
import AppBar from "../components/AppBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Tabs from "../components/admin-settings/Tabs.jsx";
import AccountTab from "../components/admin-settings/account/AccountTab.jsx";


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

    return (
        <div className="dashboard-layout">
            <Tabs/>
            <AppBar onMenuClick={handleMenuClick} />
            <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        </div>
    );
}