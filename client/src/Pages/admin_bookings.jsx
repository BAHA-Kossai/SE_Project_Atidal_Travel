import {AppBarSideBarWithContent} from "../components/AppBarSideBarWithContent.jsx";
import PagePath from "../components/PagePath.jsx";
import {useState} from "react";
import Tabs from "../components/Tabs.jsx";
import {TabBookings} from "../components/admin-bookings/TabBookings.jsx";
import {TabPayers} from "../components/admin-bookings/TabPayers.jsx";
import {TabTravelers} from "../components/admin-bookings/TabTravelers.jsx";

export default function AdminBookingsPage() {
    // Change Active Tab
    const [activeTab, setActiveTab] = useState("Bookings");
    const tabs = ["Bookings", "Payers", "Travelers"]

    return (
        <AppBarSideBarWithContent>
            <div className={"mb-4"}>
                <h1 className={"text-3xl"}>
                    Employees
                </h1>

                {/* Page Path */}
                <PagePath pathItems={["Dashboard", "Bookings"]} />
            </div>

            {/* Booking / Payer / Traveler Tabs */}
            <div className={"mb-4"}>
                <Tabs items={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
                { activeTab === "Bookings" && <TabBookings/> }
                { activeTab === "Payers" && <TabPayers/> }
                { activeTab === "Travelers" && <TabTravelers/> }

        </AppBarSideBarWithContent>
    )
}