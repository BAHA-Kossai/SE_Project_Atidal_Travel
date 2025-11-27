import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings.jsx';
import AdminDestinations from "./pages/admin_destinations.jsx";
import AdminEmployees from "./pages/admin_employees.jsx";
import { AdminDashboard } from "./pages/admin_dashboard/admin_dashboard.jsx";
import BookingPage from "./Pages/BookingForm.jsx";
import HomePage from "./Pages/Homepage.jsx";
import GroupTrip from "./Pages/GroupTrip.jsx";
import Branches from "./Pages/Branches.jsx";
import UmrahPage from "./Pages/UmrahPage.jsx";
import Destinations from "./Pages/Destinations.jsx";
import NotFound from "./Pages/NotFound.jsx";
import { StrictMode } from "react";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/* User Side */}
                <Route path="/" element={<HomePage/>} />
                <Route path="/umrah" element={<UmrahPage/>} />
                <Route path="/booking" element={<BookingPage/>} />
                <Route path="/group-trip" element={<GroupTrip/>} />
                <Route path="/destinations" element={<Destinations/>} />
                <Route path="/branches" element={<Branches/>} />
                <Route path="*" element={<NotFound/>} />
                {/* Admin Side */}
                <Route path="/admin-dashboard" element={<AdminDashboard/>} />
                <Route path="/admin-settings" element={<AdminSettings/>} />
                <Route path="/admin-destinations" element={<AdminDestinations/>} />
                <Route path="/admin-employees" element={<AdminEmployees/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);