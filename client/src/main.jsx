import React from 'react';
import { createRoot } from 'react-dom/client';
import AppSideBar from './Pages/commons/components/appBarSideBar.jsx';

const rootElement = document.getElementById('root') ;

createRoot(rootElement).render(
   
    <AppSideBar />
);