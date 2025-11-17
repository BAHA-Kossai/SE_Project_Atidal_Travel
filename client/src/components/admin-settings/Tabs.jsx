import {Edit} from "lucide-react";
import "../../styles/admin_settings.css";
import {useState} from "react";
import ProfileInfo from "./account/ProfileInfo.jsx";
import AccountTab from "./account/AccountTab.jsx";


export default function Tabs() {
    const [activeTab, setActiveTab] = useState("Account");

    const tabs = ["Account", "Notifications", "Security"]

    return (
        <main className="main-content">
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
            <AccountTab/>
        </main>
    )
}
