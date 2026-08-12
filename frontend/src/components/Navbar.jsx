import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'LIBRARIAN') return '/librarian/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-sky-600 rounded-lg text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              SmartLib
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Home
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardRoute()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-sky-700 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}