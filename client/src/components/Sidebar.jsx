import {Building2, Calendar, Home, Plane, UserCheck, Users, X} from "lucide-react";
import React from "react";

export default function Sidebar({ isOpen, onClose }) {
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
