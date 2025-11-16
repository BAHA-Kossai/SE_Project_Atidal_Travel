/**
 * File: admin_dashboard.jsx
 * Description: Handles the admin dashboard UI functionality.
 *
 * Created By: Kossai Baha
 * Created On: 16-Nov-2025
 * Version: 1.0.0
 * Last Modified By: Kossai Baha
 * Last Modified On: 16-Nov-2025
 *
 * Notes:
 * - Initial creation of admin dashboard interface.
 * - Includes user management and analytics widgets.
 * - Refactored to use semantic CSS classes for better maintainability.
 */

import React, { useState, useEffect } from "react";
import AppSideBar, {
  AppBarSideBarWithContent,
} from "../commons/components/appBarSideBar.jsx";
import Dashboard from "./components/adminDashboardComponents.jsx";

// AdminDashboard main component
// export const AdminDashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <div style={{ width: isSidebarOpen ? 250 : 80, transition: 'width 0.3s' }}>
//         <AppSideBar
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />
//       </div>

//       {/* Main content */}
//       <div style={{ flex: 1, marginTop: 64, transition: 'margin-left 0.3s' }}>
//         <Dashboard />
//       </div>
//     </div>
//   );
// };

export const AdminDashboard = ({ children }) => {
  return <AppBarSideBarWithContent>
    <Dashboard />
  </AppBarSideBarWithContent>;
};
