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

import  {AppBarSideBarWithContent} from "../commons/components/appBarSideBar.jsx";
import Dashboard from './components/adminDashboardCompoents.jsx';



//main admin dashboard + apbar + side bar component
export const AdminDashboard = ({ children }) => {
  return <AppBarSideBarWithContent>
    <Dashboard />
  </AppBarSideBarWithContent>;
};
