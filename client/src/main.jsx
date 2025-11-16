import React from 'react';
import { createRoot } from 'react-dom/client';
import "./styles/admin_dashboard/admin_dashboard.css";
import { Camera, Plane ,TrendingUp,} from "lucide-react";
import { DecoratedCard, StatusCard } from './Pages/admin_dashboard/components/status_cards';
import Dashboard from './Pages/admin_dashboard/components/claude_1';
import {AdminDashboard} from './Pages/admin_dashboard/admin_dashboard';


const rootElement = document.getElementById('root') ;

createRoot(rootElement).render(
   <AdminDashboard />


);