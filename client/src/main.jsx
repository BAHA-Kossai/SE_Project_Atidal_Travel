import { createRoot } from 'react-dom/client';
import AdminSettings from './pages/admin_settings';
import { BrowserRouter, Routes, Route } from "react-router-dom";


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/admin-settings" element={<AdminSettings />} />
        </Routes>
    </BrowserRouter>
);