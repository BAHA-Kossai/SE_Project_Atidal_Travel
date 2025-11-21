import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings';
import AdminDestinations from "./pages/admin-destinations/admin_destinations.jsx";
import AdminAddDestination from "./pages/admin-destinations/admin_add_destination.jsx";
import AdminEmployees from "./pages/admin_employees.jsx";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/admin-settings" element={<AdminSettings/>} />
            <Route path="/admin-destinations" element={<AdminDestinations/>} />
            <Route path="/admin-destinations/add-destination" element={<AdminAddDestination/>} />
            <Route path="/admin-employees" element={<AdminEmployees/>} />
        </Routes>
    </BrowserRouter>
);