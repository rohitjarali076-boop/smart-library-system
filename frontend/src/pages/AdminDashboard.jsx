import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-library-system-9i87.onrender.com';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
  });
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'users' | 'addBook'
  const [loading, setLoading] = useState(true);

  // Form state for adding a new book
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    copies: 1,
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [booksRes, usersRes, borrowsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/books`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/v1/users`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/v1/borrow/all`, config).catch(() => ({ data: [] })),
      ]);

      const bookList = booksRes.data.data || booksRes.data || [];
      const userList = usersRes.data.data || usersRes.data || [];
      const borrowList = borrowsRes.data.data || borrowsRes.data || [];

      setBooks(bookList);
      setUsers(userList);

      setStats({
        totalBooks: bookList.length,
        totalMembers: userList.length,
        activeBorrows: borrowList.filter((b) => b.status === 'BORROWED' || !b.returnedAt).length,
        overdueBorrows: borrowList.filter((b) => b.status === 'OVERDUE').length,
      });
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/books`,
        {
          title: newBook.title,
          author: newBook.author,
          isbn: newBook.isbn || `ISBN-${Date.now()}`,
          category: newBook.category,
          copies: Number(newBook.copies) || 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setMessage('✅ Book saved permanently to MongoDB database!');
        setNewBook({
          title: '',
          author: '',
          isbn: '',
          category: 'Computer Science',
          copies: 1,
        });
        fetchAdminData();
      }
    } catch (err) {
      setMessage(`❌ Failed to save book: ${err.response?.data?.message || 'Server error occurred'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this book from the catalog?')) return;
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData();
    } catch (err) {
      alert(`Failed to delete book: ${err.response?.data?.message || 'Error occurred'}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
              Admin Portal
            </span>
            <h1 className="text-3xl font-extrabold text-white">System Administration</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage library catalog, member accounts, and issuing operations
          </p>
        </div>
        <button
          onClick={() => {
            setMessage('');
            setActiveTab('addBook');
          }}
          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-sky-600/20 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add New Book</span>
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Catalog Titles</p>
            <p className="text-3xl font-black text-white mt-2">{stats.totalBooks}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">📚</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Members</p>
            <p className="text-3xl font-black text-emerald-400 mt-2">{stats.totalMembers}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">👥</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Book Loans</p>
            <p className="text-3xl font-black text-sky-400 mt-2">{stats.activeBorrows}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">🔄</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue Alerts</p>
            <p className="text-3xl font-black text-amber-400 mt-2">{stats.overdueBorrows}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">🔔</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 ${
            activeTab === 'books'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📖 Manage Catalog ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 ${
            activeTab === 'users'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          👥 Registered Users ({users.length})
        </button>
        <button
          onClick={() => {
            setMessage('');
            setActiveTab('addBook');
          }}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 ${
            activeTab === 'addBook'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          ➕ Add Catalog Item
        </button>
      </div>

      {/* TAB 1: MANAGE CATALOG */}
      {activeTab === 'books' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Library Catalog Management</h2>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading book catalog from database...</p>
          ) : books.length === 0 ? (
            <p className="text-slate-400 text-sm">No books registered in system database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Copies Available</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-semibold text-white">{book.title}</td>
                      <td className="p-3">{book.author}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-sky-400 font-semibold">
                          {book.category || 'General'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-emerald-400">
                          {book.availableCopies ?? book.copies ?? 1}
                        </span>{' '}
                        / {book.copies || 1}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Registered System Users</h2>
          {users.length === 0 ? (
            <p className="text-slate-400 text-sm">No user records fetched from database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-semibold text-white">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.department || 'N/A'}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase border ${
                            u.role?.toUpperCase() === 'ADMIN'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {u.role || 'STUDENT'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADD NEW BOOK FORM */}
      {activeTab === 'addBook' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Add Book to Catalog</h2>
            <p className="text-xs text-slate-400">Items added here will persist permanently in MongoDB Atlas</p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold ${
                message.startsWith('✅')
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleAddBook} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Book Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Operating System Concepts"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Author *</label>
              <input
                type="text"
                required
                placeholder="e.g. Abraham Silberschatz"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Total Copies</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newBook.copies}
                  onChange={(e) => setNewBook({ ...newBook, copies: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">ISBN Code (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 978-1118063330"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-sky-600/20"
            >
              {submitting ? 'Saving to Database...' : 'Save Book to Catalog'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;