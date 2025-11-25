import React from 'react';
import { Facebook, Instagram, MessageCircle, QrCode, Mail } from 'lucide-react';
import { FOOTER_SECTIONS } from "../../data/constants";


const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-cyan-600 font-bold text-base mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-800 font-semibold hover:text-cyan-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Column 1: QR Code and Social Icons */}
            <div className="flex gap-6 items-start">
              <div className="bg-white p-3 rounded-lg border-2 border-gray-300">
                <QrCode size={100} className="text-gray-800" />
              </div>

              {/* Social Media Icons - Vertical */}
              <div className="flex flex-col gap-4 pt-2">
                <a
                  href="#instagram"
                  className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram size={32} />
                </a>
                <a
                  href="#facebook"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook size={32} />
                </a>
                <a
                  href="#whatsapp"
                  className="text-green-600 hover:text-green-700 transition-colors duration-200"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={32} />
                </a>
              </div>
            </div>

            {/* Column 2-4: Additional info sections */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-100 bg-white">
                  <Mail size={20} className="text-red-500" />
                  <span className="text-gray-600 text-sm font-medium">Reach out for collaborations!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Travel Booking. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
