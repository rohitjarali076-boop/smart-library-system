import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-library-system-9i87.onrender.com';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const [userRes, borrowsRes, reservationsRes, booksRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/auth/me`, config).catch(() => ({ data: { user: JSON.parse(localStorage.getItem('user')) } })),
          axios.get(`${API_BASE_URL}/api/v1/borrow/my-books`, config).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/v1/borrow/reservations`, config).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/v1/books`, config).catch(() => ({ data: [] }))
        ]);

        setUser(userRes.data.user || userRes.data.data || JSON.parse(localStorage.getItem('user')));
        setBorrowedBooks(borrowsRes.data.data || borrowsRes.data || []);
        setReservations(reservationsRes.data.data || reservationsRes.data || []);
        setAllBooks(booksRes.data.data || booksRes.data || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Student Library Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, {user?.name || 'Student'} <span className="text-slate-500">(Member ID: {user?.memberId || user?._id?.substring(0, 8) || 'N/A'})</span>
          </p>
        </div>
        <button className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-sky-600/20 flex items-center space-x-2">
          <span>🤖</span>
          <span>Open AI Library Assistant</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Books Borrowed</p>
            <p className="text-3xl font-black text-white mt-2">{borrowedBooks.length} / 5</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">📖</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Reservations</p>
            <p className="text-3xl font-black text-sky-400 mt-2">{reservations.length} Title</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">🔖</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue Books</p>
            <p className="text-3xl font-black text-rose-400 mt-2">0 Book</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">⚠️</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unpaid Fine</p>
            <p className="text-3xl font-black text-amber-400 mt-2">₹0</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">₹</div>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-xl font-bold text-white">Currently Borrowed Books</h2>
        {borrowedBooks.length === 0 ? (
          <p className="text-sm text-slate-400">You have no active book loans.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {borrowedBooks.map((item) => (
              <div key={item._id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl space-y-2">
                <p className="font-bold text-white">{item.book?.title}</p>
                <p className="text-xs text-slate-400">Author: {item.book?.author}</p>
                <p className="text-xs text-sky-400">Due Date: {new Date(item.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catalog Search & Browse */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Browse Library Catalog</h2>
            <p className="text-xs text-slate-400">Search books and reserve titles for counter collection</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white p-3 rounded-xl focus:outline-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Fiction">Fiction</option>
            </select>
            <input
              type="text"
              placeholder="Search by Title or Author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white p-3 rounded-xl focus:outline-none w-full sm:w-64"
            />
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-8">Loading catalog...</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No books found in catalog.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <div key={book._id} className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md uppercase">
                    {book.category || 'General'}
                  </span>
                  <h3 className="font-bold text-white mt-2 text-base">{book.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">By {book.author}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Available: <strong className="text-emerald-400">{book.availableCopies ?? book.copies ?? 1}</strong>
                  </span>
                  <button className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs py-1.5 px-3 rounded-lg font-semibold transition">
                    Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;