import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings.jsx';
import AdminDestinations from "./pages/admin_destinations.jsx";
import AdminEmployees from "./pages/admin_employees.jsx";
import {AdminDashboard} from "./pages/admin_dashboard/admin_dashboard.jsx";
import Login from "./pages/authentication/Login.jsx";
import ForgotPassword from './Pages/Authentication/ForgotPassword.jsx';
import ResetPassword from './Pages/Authentication/ResetPassword.jsx';
import Signup from './Pages/Authentication/Signup.jsx';
import FillInformation from './Pages/Authentication/FillInformation.jsx';
import Profile from './Pages/Profile.jsx';


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
            <Route path="/admin-settings" element={<AdminSettings/>} />
            <Route path="/admin-destinations" element={<AdminDestinations/>} />
            <Route path="/admin-employees" element={<AdminEmployees/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/fill-information" element={<FillInformation/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/profile" element={<Profile/>} />
        </Routes>
    </BrowserRouter>
);