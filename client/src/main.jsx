import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings';
import AdminDestinations from "./pages/admin_destinations.jsx";
import AdminAddDestination from "./pages/admin_add_destination.jsx";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/admin-settings" element={<AdminSettings/>} />
            <Route path="/admin-destinations" element={<AdminDestinations/>} />
            <Route path="/admin-destinations/add-destination" element={<AdminAddDestination/>} />
        </Routes>
    </BrowserRouter>
);