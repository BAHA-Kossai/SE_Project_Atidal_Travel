import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GroupTrip from "./Pages/group_trips.jsx";
import Branches from "./Pages/branches.jsx";
import AdminSettingsPage from './Pages/admin_settings.jsx';
import AdminDestinationsPage from "./pages/admin_destinations.jsx";
import AdminEmployeesPage from "./pages/admin_employees.jsx";
import { AdminDashboardPage } from "./pages/admin_dashboard.jsx";
import BookingsPage from "./Pages/bookings.jsx";
import HomePage from "./Pages/homepage.jsx";
import UmrahPage from "./Pages/umrah.jsx";
import Login from "./Pages/Authentication/Login.jsx";
import Signup from './Pages/Authentication/Signup.jsx'; 
import Profile from './Pages/Profile.jsx'; 
import AdminBranchesPage from './pages/admin_branches.jsx';
import AdminBookingsPage from "./pages/admin_bookings.jsx";
import FillInformation from "./Pages/Authentication/FillInformation.jsx";
import ResetPassword from "./Pages/Authentication/ResetPassword.jsx"
import ForgotPassword from './Pages/Authentication/ForgotPassword.jsx';
import DestinationsPage from "./Pages/destinations.jsx";
import NotFoundPage from "./Pages/not_found.jsx";
import { StrictMode } from "react";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/* User Side */}
                <Route path="/" element={<HomePage/>} />
                <Route path="/umrah" element={<UmrahPage/>} />
                <Route path="/group-trip" element={<GroupTrip/>} />
                <Route path="/branches" element={<Branches/>} />
                <Route path="*" element={<NotFoundPage/>} />
                <Route path="/bookings" element={<BookingsPage/>} />
                <Route path="/destinations" element={<DestinationsPage/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/reset-password" element={<ResetPassword/>} />
                <Route path="/fill-information" element={<FillInformation/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="*" element={<NotFoundPage/>} />
                {/* Admin Side */}
                <Route path="/admin/" element={<AdminDashboardPage/>} />
                <Route path="/admin/settings" element={<AdminSettingsPage/>} />
                <Route path="/admin/bookings" element={<AdminBookingsPage/>} />
                <Route path="/admin/destinations" element={<AdminDestinationsPage/>} />
                <Route path="/admin/employees" element={<AdminEmployeesPage/>} />
                <Route path="/admin/branches" element={<AdminBranchesPage/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);