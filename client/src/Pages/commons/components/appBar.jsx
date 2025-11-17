
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
import { Menu, X, Bell, Search, Home, Calendar, Users, UserCheck, Plane, Building2 } from 'lucide-react';
import '../../../styles/appbar.css';


// AppBar Component 
export const AppBar = ({ onMenuClick }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchBar, setSearchBar] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(prev => !prev);
  };

  const notifications = [
  { 
    id: "001", 
    avatar: "/avatars/user1.png", 
    name: "John Doe", 
    action: "booked a flight", 
  },
  { 
    id: "002", 
    avatar: "/avatars/user2.png", 
    name: "Jane Smith", 
    action: "registered an account", 
  },
  { 
    id: "003", 
    avatar: "/avatars/user3.png", 
    name: "Ali Ahmed", 
    action: "updated booking", 
  },
];

  return (
    <header className="appbar-container">
      <div className="appbar-content">
        {/* Left Section */}
        <div className="appbar-left">
          <button
            onClick={onMenuClick}
            className="menu-toggle-btn"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="logo">LOGO</div>
        </div>

        {/* Center Section - Desktop Search */}
        <div className="appbar-search-wrapper">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search in the dashboard"
              className="search-input"
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
            />
            <button className="search-clear-btn" onClick={() => setSearchBar('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="appbar-right">
          {/* Mobile Search Icon */}
          <button
            className="notification-btn sm:hidden"
            onClick={toggleMobileSearch}
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Bell / Notifications */}
      {/* Bell / Notifications */}
<div className="relative">
  <button className="notification-btn" onClick={toggleNotifications}>
    <Bell className="w-6 h-6" />
  </button>

  {notificationsOpen && (
  <div className="notifications-dropdown-floating">
    {notifications.map((note) => (
      <div key={note.id} className="notification-item-row">
        <img src={note.avatar} alt={note.name} className="notification-avatar" />
        <div className="notification-content">
          <div className="notification-main">
            <span className="notification-name">{note.name}</span>
            <span className="notification-action">{note.action}</span>
          </div>
          <div className="notification-id">ID: {note.id}</div>
        </div>
      </div>
    ))} 
  </div>
)}

</div>


          <div className="profile-avatar">K</div>
        </div>
      </div>

      {/* Mobile Search Input */}
      {isMobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search in the dashboard"
              className="search-input"
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              autoFocus
            />
            <button
              className="search-clear-btn"
              onClick={() => {setIsMobileSearchOpen(false); setSearchBar('');}}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
