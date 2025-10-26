import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold hover:text-indigo-200 transition-colors flex items-center">
              <FaUser className="mr-2" />
              Social Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FaHome className="mr-1" />
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FaChartBar className="mr-1" />
              Analytics
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors flex items-center"
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
