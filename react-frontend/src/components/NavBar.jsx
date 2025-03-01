import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Video Recorder', path: '/videorecorder' },
    { name: 'Video Uploader', path: '/videouploader' },
    { name: 'About', path: '/about' },
    { name: 'Technical Details', path: '/technicaldetails' },

  ];
  
  return (
    <nav className="bg-gradient-to-r from-gray-800 to-blue-900 shadow-lg border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="ml-2 text-gray-50 font-bold text-xl">Violence Detection</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const isHovered = hovered === link.name;
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-3 py-2 text-md font-medium relative transition-all duration-300 ease-in-out
                      ${isActive ? 'text-blue-400' : 'text-gray-100'}`}
                    onMouseEnter={() => setHovered(link.name)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300 ease-in-out
                        ${isActive ? 'bg-blue-400 scale-x-100' : isHovered ? 'bg-blue-400 scale-x-100' : 'scale-x-0'}`}
                    />
                    {isHovered && !isActive && (
                      <span className="absolute inset-0 bg-blue-700 opacity-20 rounded-md"></span>
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-blue-400 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-gray-800 to-blue-900">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-blue-800 bg-opacity-30 text-blue-400'
                  : 'text-gray-100 hover:bg-blue-800 hover:bg-opacity-20 hover:text-blue-400'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;