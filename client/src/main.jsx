import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettingsPage from './pages/admin_settings.jsx';
import AdminDestinationsPage from "./pages/admin_destinations.jsx";
import AdminEmployeesPage from "./pages/admin_employees.jsx";
import { AdminDashboardPage } from "./pages/admin_dashboard.jsx";
import BookingsPage from "./pages/bookings.jsx";
import HomePage from "./pages/homepage.jsx";
import UmrahPage from "./pages/umrah.jsx";
import Login from "./Pages/Authentication/Login.jsx";
import Signup from './Pages/Authentication/Signup.jsx'; 
import Profile from './Pages/Profile.jsx'; 
import FillInformation from "./Pages/Authentication/FillInformation.jsx";
import ResetPassword from "./Pages/Authentication/ResetPassword.jsx"
import ForgotPassword from './Pages/Authentication/ForgotPassword.jsx';
import DestinationsPage from "./pages/destinations.jsx";
import NotFoundPage from "./pages/not_found.jsx";
import { StrictMode } from "react";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/* User Side */}
                <Route path="/" element={<HomePage/>} />
                <Route path="/umrah" element={<UmrahPage/>} />
                <Route path="/bookings" element={<BookingsPage/>} />
                <Route path="/destinations" element={<DestinationsPage/>} />
                <Route path="*" element={<NotFoundPage/>} />
                <Route path="/Login" element={<Login/>} />
                <Route path="/reset-password" element={<ResetPassword/>} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/Signup" element={<Signup/>} />
                <Route path="/fill-information" element={<FillInformation/>} />
                <Route path="/profile" element={<Profile/>} />
                {/* Admin Side */}
                <Route path="/admin/" element={<AdminDashboardPage/>} />
                <Route path="/admin/settings" element={<AdminSettingsPage/>} />
                <Route path="/admin/destinations" element={<AdminDestinationsPage/>} />
                <Route path="/admin/employees" element={<AdminEmployeesPage/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);