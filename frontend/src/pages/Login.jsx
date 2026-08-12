import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-library-system-9i87.onrender.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const performLogin = async (loginEmail, loginPassword) => {
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        email: loginEmail,
        password: loginPassword
      });

      const user = res.data.user;
      const token = res.data.token;

      // Save user session
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Case-insensitive role evaluation
      const role = user?.role?.toUpperCase();

      if (role === 'ADMIN' || role === 'LIBRARIAN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleAdminDemo = () => {
    setEmail('admin@smartlib.edu');
    setPassword('AdminPassword123');
    performLogin('admin@smartlib.edu', 'AdminPassword123');
  };

  const handleStudentDemo = () => {
    setEmail('alex@smartlib.edu');
    setPassword('StudentPassword123');
    performLogin('alex@smartlib.edu', 'StudentPassword123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">Sign In to Account</h2>
          <p className="text-xs text-slate-400">Access your library dashboard and catalog</p>
        </div>

        {/* Instant Demo Login Buttons */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Instant Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdminDemo}
              disabled={loading}
              className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs py-2 px-3 rounded-lg font-semibold transition flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <span>🛡️</span>
              <span>Admin Dashboard</span>
            </button>
            <button
              type="button"
              onClick={handleStudentDemo}
              disabled={loading}
              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs py-2 px-3 rounded-lg font-semibold transition flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <span>🎓</span>
              <span>Student Dashboard</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. admin@smartlib.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-sky-600/20 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-400 font-semibold hover:underline">
            Register Student Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;