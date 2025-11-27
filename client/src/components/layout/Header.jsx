
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Umrah', href: '/umrah' },
    { name: 'Group trip', href: '/group-trip' },
    { name: 'Branches', href: '/branches' },
  ];

  const isActive = (href) => location.pathname === href;

const handleBookNow = () => {
    // default is destination booking; BookingForm will allow switching
    navigate('/booking');
  };



  return (
    
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center items-center h-16">
          {/* Logo */}
          <Link to="/" className="absolute left-4 text-2xl font-bold text-gray-800">
            Logo
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`transition-colors duration-200 text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-[#117BB8]'
                    : 'text-gray-700 hover:text-[#117BB8]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="/Login"
              className="text-gray-700 hover:text-[#117BB8] transition-colors duration-200 text-sm font-medium"
            >
              Sign in
            </a>
          </div>

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            className="absolute right-4 bg-[#117BB8] text-white px-8 py-3 rounded-full hover:bg-[#0f6da4] transition-colors duration-200 text-sm font-medium hidden md:block"
          >
            Book now
          </button>
     

          {/* Mobile Menu Button */}
          <div className="md:hidden absolute right-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#117BB8] focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

     {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`transition-colors duration-200 text-sm font-medium py-2 ${
                    isActive(link.href)
                      ? 'text-[#117BB8]'
                      : 'text-gray-700 hover:text-[#117BB8]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="#signin"
                className="text-gray-700 hover:text-cyan-600 transition-colors duration-200 text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </a>
              <a
                href="#book"
                className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition-colors duration-200 text-sm font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
