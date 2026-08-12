import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-library-system-9i87.onrender.com';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        password: formData.password
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-xs text-slate-400">Join the Smart Library network</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">FULL NAME</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Admin User"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@smartlib.edu"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">DEPARTMENT / MAJOR</label>
            <input
              type="text"
              name="department"
              required
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">PASSWORD</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-sky-600/20 mt-2"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-sky-400 font-semibold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;