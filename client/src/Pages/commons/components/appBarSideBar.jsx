import React, { useState } from 'react';
import { Menu, X, Bell, Search, Home, Calendar, Users, UserCheck, Plane, Building2 } from 'lucide-react';
import '../../../styles/appbar.css';

const AppBar = ({ onMenuClick }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

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
            />
            <button className="search-clear-btn">
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

          <button className="notification-btn">
            <Bell className="w-6 h-6" />
          </button>

          <div className="profile-avatar">K</div>
        </div>
      </div>

      {/* Mobile Search Input (toggleable) */}
      {isMobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search in the dashboard"
              className="search-input"
              autoFocus
            />
            <button
              className="search-clear-btn"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


// Sidebar Component
const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Bookings' },
    { icon: Users, label: 'Users' },
    { icon: UserCheck, label: 'Employees' },
    { icon: Calendar, label: 'Umrah' },
    { icon: Plane, label: 'Destinations' },
    { icon: Building2, label: 'Branches' }
  ];

  return (
    <>
      {/* Sidebar Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <div className="sidebar-content">
          {/* Close Button (Mobile only) */}
          <button
            onClick={onClose}
            className="sidebar-close-btn"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Menu Items */}
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`sidebar-item ${item.active ? 'sidebar-item-active' : ''}`}
              >
                <item.icon className="sidebar-item-icon" />
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

// Main App Component
export default function AppSideBar() {
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