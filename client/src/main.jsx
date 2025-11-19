import React from 'react';
import { createRoot } from 'react-dom/client';
import {AdminDashboard} from './Pages/admin_dashboard/admin_dashboard';
import "./styles/admin_dashboard/admin_dashboard.css";

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <AdminDashboard/>
);