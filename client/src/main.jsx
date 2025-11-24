import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings.jsx';
import AdminDestinations from "./pages/admin_destinations.jsx";
import AdminEmployees from "./pages/admin_employees.jsx";
import {AdminDashboard} from "./pages/admin_dashboard/admin_dashboard.jsx";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
            <Route path="/admin-settings" element={<AdminSettings/>} />
            <Route path="/admin-destinations" element={<AdminDestinations/>} />
            <Route path="/admin-employees" element={<AdminEmployees/>} />
        </Routes>
    </BrowserRouter>
);