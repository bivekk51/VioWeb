import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-6 bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="font-semibold text-white">SecureVision</span>
            </div>
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-white transition duration-300">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-white transition duration-300">
              Privacy
            </Link>
            <Link to="/contact" className="hover:text-white transition duration-300">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-center">
          <p>
            Copyright © {new Date().getFullYear()} SecureVision. All rights reserved.
          </p>
          <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
            This is an AI-based system and should be used as an aid, not a definitive security measure.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
