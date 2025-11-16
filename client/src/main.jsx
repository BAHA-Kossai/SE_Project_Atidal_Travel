import React from 'react';
import { createRoot } from 'react-dom/client';

import AdminDashboard from './Pages/admin_dashboard/admin_dashboard.jsx';

const rootElement = document.getElementById('root') ;

createRoot(rootElement).render(
   
    <AdminDashboard />
);