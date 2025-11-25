import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings.jsx';
import AdminDestinations from "./pages/admin_destinations.jsx";
import AdminEmployees from "./pages/admin_employees.jsx";
<<<<<<< HEAD
import {AdminDashboard} from "./pages/admin_dashboard/admin_dashboard.jsx";
import Login from "./pages/authentication/login.jsx";
import ForgotPassword from './Pages/Authentication/ForgotPassword.jsx';
import ResetPassword from './Pages/Authentication/ResetPassword.jsx';
=======
import { AdminDashboard } from "./pages/admin_dashboard/admin_dashboard.jsx";
import BookingPage from "./Pages/BookingForm.jsx";
import HomePage from "./Pages/Homepage.jsx";
import UmrahPage from "./Pages/UmrahPage.jsx";
import Destinations from "./Pages/Destinations.jsx";
import NotFound from "./Pages/NotFound.jsx";
import { StrictMode } from "react";
>>>>>>> 2a51f528887ff772e69306095b2b359c7186f795


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
<<<<<<< HEAD
    <BrowserRouter>
        <Routes>
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
            <Route path="/admin-settings" element={<AdminSettings/>} />
            <Route path="/admin-destinations" element={<AdminDestinations/>} />
            <Route path="/admin-employees" element={<AdminEmployees/>} />
        </Routes>
    </BrowserRouter>
=======
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/* User Side */}
                <Route path="/" element={<HomePage/>} />
                <Route path="/umrah" element={<UmrahPage/>} />
                <Route path="/bookings" element={<BookingPage/>} />
                <Route path="/destinations" element={<Destinations/>} />
                <Route path="*" element={<NotFound/>} />
                {/* Admin Side */}
                <Route path="/admin-dashboard" element={<AdminDashboard/>} />
                <Route path="/admin-settings" element={<AdminSettings/>} />
                <Route path="/admin-destinations" element={<AdminDestinations/>} />
                <Route path="/admin-employees" element={<AdminEmployees/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
>>>>>>> 2a51f528887ff772e69306095b2b359c7186f795
);