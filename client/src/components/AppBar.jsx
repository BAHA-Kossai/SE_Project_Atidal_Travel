import React, {useState} from "react";
import {Bell, Menu, Search, X} from "lucide-react";
import '../styles/app_bar.css'

export default function AppBar({ onMenuClick }) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchBar, setSearchBar] = useState('');

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
    };
//
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