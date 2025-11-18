import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from './pages/admin_settings';
import AdminDestinations from "./pages/admin_destinations.jsx";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/admin-settings" element={<AdminSettings/>} />
            <Route path="/admin-destinations" element={<AdminDestinations/>} />
        </Routes>
    </BrowserRouter>
);