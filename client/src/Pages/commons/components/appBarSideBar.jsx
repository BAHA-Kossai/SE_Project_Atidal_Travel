
/**
 * File: appBarSideBar.jsx
 * Description: Handles the app bar and sidebar UI components.
 * 
 * Created By: Kossai Baha
 * Created On: 16-Nov-2025
 * Version: 1.0.0
 * Last Modified By: Kossai Baha
 * Last Modified On: 16-Nov-2025
 * 
 * Notes:
 * - Initial creation of app bar and sidebar components.
 * - Includes menu toggle, search functionality, and notifications.
 * - Refactored to use semantic CSS classes for better maintainability.
 */

import React, { useState ,useEffect} from 'react';
import '../../../styles/appBar.css';
import {AppBar} from  './appBar.jsx';
import { Sidebar } from './sideBar.jsx';


// Main AppbarSidebar Component
function AppSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar
  const handleMenuClick = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <AppBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
    </div>
  );
}

export const AppBarSideBarWithContent = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  // Update isLargeScreen on window resize
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar style only for large screens
  const sidebarStyle = isLargeScreen
    ? { width: isSidebarOpen ? 250 : 80, transition: 'width 0.3s' }
    : {};

  return (
    <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <AppSideBar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginTop: 64, transition: 'margin-left 0.3s' }}>
        {children}
      </div>
    </div>
  );
};