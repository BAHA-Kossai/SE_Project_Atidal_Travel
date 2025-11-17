
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

// Sidebar Component
export const Sidebar = ({ isOpen, onClose }) => {
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