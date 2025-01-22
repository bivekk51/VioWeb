import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">Violence Detector</h1>
      </div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-blue-400">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-blue-400">About</Link>
        </li>
        <li>
          <Link to="/upload" className="hover:text-blue-400">Upload Video</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
