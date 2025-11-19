import React from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Plane ,TrendingUp,} from "lucide-react";
import { DecoratedCard, StatusCard } from './Pages/admin_dashboard/components/status_cards';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {AdminDashboard} from './Pages/admin_dashboard/admin_dashboard';
import AdminSettings from './pages/admin_settings';
import "./styles/admin_dashboard/admin_dashboard.css";



const rootElement = document.getElementById('root') ;

createRoot(rootElement).render(

    <BrowserRouter>
        <Routes>
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
    </BrowserRouter>


);