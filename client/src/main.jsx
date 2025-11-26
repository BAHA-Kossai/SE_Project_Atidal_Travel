import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings.jsx';
import AdminDestinations from "./pages/admin_destinations.jsx";
import AdminEmployees from "./pages/admin_employees.jsx";
import { AdminDashboard } from "./pages/admin_dashboard.jsx";
import BookingPage from "./pages/bookings.jsx";
import Homepage from "./pages/homepage.jsx";
import Umrah from "./pages/umrah.jsx";
import Destinations from "./pages/destinations.jsx";
import Not_found from "./pages/not_found.jsx";
import { StrictMode } from "react";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/* User Side */}
                <Route path="/" element={<Homepage/>} />
                <Route path="/umrah" element={<Umrah/>} />
                <Route path="/bookings" element={<BookingPage/>} />
                <Route path="/destinations" element={<Destinations/>} />
                <Route path="*" element={<Not_found/>} />
                {/* Admin Side */}
                <Route path="/admin/" element={<AdminDashboard/>} />
                <Route path="/admin/settings" element={<AdminSettings/>} />
                <Route path="/admin/destinations" element={<AdminDestinations/>} />
                <Route path="/admin/employees" element={<AdminEmployees/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);