import React, { useState ,useEffect } from 'react';
import { Menu, X, Bell, Search, Home, Calendar, Users, UserCheck, Plane, Building2 } from 'lucide-react';
import '../styles/appbar.css';


// AppBar Component
const AppBar = ({ onMenuClick }) => {
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
                <div className="dashboard-layout">
                    {children}
                </div>
            </div>
        </div>
    );
};