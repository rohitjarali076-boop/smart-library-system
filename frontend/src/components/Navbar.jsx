import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safe check for active path using optional chaining
  const currentPath = location?.pathname || '';
  const isActive = (path) => currentPath.startsWith(path);

  const userRole = user?.role?.toUpperCase();

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-sky-600 p-2 rounded-xl text-white font-bold text-lg">
            📖
          </div>
          <span className="text-lg font-bold text-white tracking-wide">
            SmartLib
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition ${
              isActive('/') && currentPath === '/'
                ? 'text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </Link>

          <Link
            to="/books"
            className={`transition ${
              isActive('/books')
                ? 'text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Catalog
          </Link>

          {user && (
            <Link
              to={userRole === 'ADMIN' || userRole === 'LIBRARIAN' ? '/admin' : '/dashboard'}
              className={`transition ${
                isActive('/admin') || isActive('/dashboard')
                  ? 'text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* User Auth Status */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-3 py-2 rounded-xl transition font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white text-xs px-3 py-2 rounded-xl transition font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-4 py-2 rounded-xl transition font-bold shadow-md shadow-sky-600/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;