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
  const [borrows, setBorrows] = useState([]);
  const [activeTab, setActiveTab] = useState('issue'); // 'borrows' | 'issue' | 'books' | 'users' | 'addBook'
  const [loading, setLoading] = useState(true);

  // Form states: Text input for Student Name & Full fields for Add Book
  const [issueForm, setIssueForm] = useState({ studentName: '', bookId: '', days: 10 });
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: 'Computer Science', copies: 5 });
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
      setBorrows(borrowList);

      setStats({
        totalBooks: bookList.length,
        totalMembers: userList.length,
        activeBorrows: borrowList.filter((b) => b.status === 'BORROWED' || !b.returnDate).length,
        overdueBorrows: borrowList.filter((b) => b.status === 'OVERDUE').length,
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/borrow/issue`, issueForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(`✅ ${res.data.message || 'Book issued successfully!'}`);
      setIssueForm({ studentName: '', bookId: '', days: 10 });
      fetchAdminData();
    } catch (err) {
      setMessage(`❌ Failed to issue book: ${err.response?.data?.message || 'Error occurred'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    const token = localStorage.getItem('token');

    const bookPayload = {
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn || `ISBN-${Date.now()}`,
      category: newBook.category,
      copies: Number(newBook.copies) || 1,
      availableCopies: Number(newBook.copies) || 1
    };

    try {
      await axios.post(`${API_BASE_URL}/api/v1/books`, bookPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Book saved permanently to catalog!');
      setNewBook({ title: '', author: '', isbn: '', category: 'Computer Science', copies: 5 });
      fetchAdminData();
    } catch (err) {
      setMessage(`❌ Failed: ${err.response?.data?.message || 'Error occurred'}`);
    } finally {
      setSubmitting(false);
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
            <h1 className="text-3xl font-extrabold text-white">Library Issuing & Management</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">Record which student borrowed which book and manage catalog</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setMessage(''); setActiveTab('issue'); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-1"
          >
            <span>📖</span>
            <span>Issue Book</span>
          </button>
          <button
            onClick={() => { setMessage(''); setActiveTab('addBook'); }}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-1"
          >
            <span>➕</span>
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Book Loans</p>
            <p className="text-3xl font-black text-sky-400 mt-2">{stats.activeBorrows}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">🔄</div>
        </div>
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
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue Alerts</p>
            <p className="text-3xl font-black text-amber-400 mt-2">{stats.overdueBorrows}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-xl">🔔</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('borrows')}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 whitespace-nowrap ${
            activeTab === 'borrows' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📋 Active Loans ({borrows.length})
        </button>
        <button
          onClick={() => { setMessage(''); setActiveTab('issue'); }}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 whitespace-nowrap ${
            activeTab === 'issue' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          ✍️ Issue Book to Student
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 whitespace-nowrap ${
            activeTab === 'books' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📖 Catalog ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 whitespace-nowrap ${
            activeTab === 'users' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          👥 Users ({users.length})
        </button>
        <button
          onClick={() => { setMessage(''); setActiveTab('addBook'); }}
          className={`pb-3 px-2 font-semibold text-sm transition border-b-2 whitespace-nowrap ${
            activeTab === 'addBook' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          ➕ Add New Book
        </button>
      </div>

      {/* TAB 1: ACTIVE BORROW RECORDS */}
      {activeTab === 'borrows' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Student Borrowing Records</h2>
          {borrows.length === 0 ? (
            <p className="text-slate-400 text-sm">No books currently issued.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Book Title</th>
                    <th className="p-3">Issued Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {borrows.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-semibold text-white">{b.studentName || b.user?.name || 'N/A'}</td>
                      <td className="p-3 text-sky-300 font-semibold">{b.book?.title || b.bookTitle || 'N/A'}</td>
                      <td className="p-3">{new Date(b.borrowDate || b.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 text-amber-400">{new Date(b.dueDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-sky-500/10 border border-sky-500/30 text-sky-400 px-2 py-0.5 rounded font-bold uppercase">
                          {b.status || 'BORROWED'}
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

      {/* TAB 2: ISSUE BOOK FORM (TEXT INPUT FOR STUDENT NAME) */}
      {activeTab === 'issue' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Issue Book to Student</h2>
            <p className="text-xs text-slate-400">Type student name manually and select a book from the catalog</p>
          </div>

          {message && <div className="p-3 bg-slate-800 text-xs font-semibold rounded-xl">{message}</div>}

          <form onSubmit={handleIssueBook} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Student Name *</label>
              <input
                type="text"
                required
                placeholder="Type student name manually..."
                value={issueForm.studentName}
                onChange={(e) => setIssueForm({ ...issueForm, studentName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Select Book from Catalog *</label>
              <select
                required
                value={issueForm.bookId}
                onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
              >
                <option value="">-- Choose Book ({books.length} saved in library) --</option>
                {books.map((b) => {
                  const available = b.availableCopies !== undefined ? b.availableCopies : (b.copies !== undefined ? b.copies : 1);
                  return (
                    <option key={b._id} value={b._id} disabled={available <= 0}>
                      {b.title} ({available} available)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Loan Duration (Days)</label>
              <input
                type="number"
                min="1"
                required
                value={issueForm.days}
                onChange={(e) => setIssueForm({ ...issueForm, days: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-600/20"
            >
              {submitting ? 'Issuing Book...' : 'Confirm Book Issue'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MANAGE CATALOG */}
      {activeTab === 'books' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Library Catalog</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Total Copies</th>
                  <th className="p-3">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{b.title}</td>
                    <td className="p-3">{b.author}</td>
                    <td className="p-3"><span className="text-[10px] bg-slate-800 text-sky-400 p-1 rounded">{b.category || 'General'}</span></td>
                    <td className="p-3 font-bold text-white">{b.copies ?? 1}</td>
                    <td className="p-3 font-bold text-emerald-400">{b.availableCopies ?? b.copies ?? 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3"><span className="text-[10px] bg-emerald-500/10 text-emerald-400 p-1 rounded font-bold">{u.role || 'STUDENT'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ADD NEW BOOK FORM WITH COPIES INPUT */}
      {activeTab === 'addBook' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl space-y-4">
          <h2 className="text-xl font-bold text-white">Add New Book to Catalog</h2>
          {message && <div className="p-3 bg-slate-800 text-xs font-semibold rounded-xl">{message}</div>}
          <form onSubmit={handleAddBook} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Book Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Clean Code"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Author *</label>
              <input
                type="text"
                required
                placeholder="e.g. Robert C. Martin"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Number of Copies *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newBook.copies}
                  onChange={(e) => setNewBook({ ...newBook, copies: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl text-sm transition">
              {submitting ? 'Saving...' : 'Add Book to System'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;