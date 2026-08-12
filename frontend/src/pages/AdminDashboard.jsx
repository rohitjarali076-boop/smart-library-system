import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [memberId, setMemberId] = useState('');
  const [bookId, setBookId] = useState('');
  const [issueMsg, setIssueMsg] = useState('');

  const [selectedDept, setSelectedDept] = useState('ALL');

  const [showBookModal, setShowBookModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    shelfNumber: 'CS-101',
    totalCopies: 5,
    coverImage: '',
    description: ''
  });
  const [bookMsg, setBookMsg] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchBorrowsByDept(selectedDept);
  }, [selectedDept]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, booksRes, borrowsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/admin/stats', { headers }),
        axios.get('http://localhost:5000/api/v1/books', { headers }),
        axios.get('http://localhost:5000/api/v1/borrows/all', { headers })
      ]);

      setStats(statsRes.data.data);
      setBooks(booksRes.data.data || []);
      setBorrows(borrowsRes.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchBorrowsByDept = async (dept) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/v1/borrows/all?department=${dept}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBorrows(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/v1/borrows/issue',
        { memberId, bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssueMsg('✅ Book issued successfully!');
      setMemberId('');
      setBookId('');
      fetchDashboardData();
    } catch (err) {
      setIssueMsg(`❌ ${err.response?.data?.message || 'Failed to issue book'}`);
    }
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    setBookMsg('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...bookForm, totalCopies: Number(bookForm.totalCopies) || 1 };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/v1/books/${currentBookId}`, payload, { headers });
        setBookMsg('✅ Book details updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/v1/books', payload, { headers });
        setBookMsg('✅ Book added to library catalog!');
      }

      fetchDashboardData();
      setTimeout(() => {
        setShowBookModal(false);
        setBookMsg('');
      }, 1500);
    } catch (err) {
      setBookMsg(`❌ ${err.response?.data?.message || 'Operation failed'}`);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentBookId(null);
    setBookForm({
      title: '',
      author: '',
      isbn: '',
      category: 'Computer Science',
      shelfNumber: 'CS-101',
      totalCopies: 5,
      coverImage: '',
      description: ''
    });
    setBookMsg('');
    setShowBookModal(true);
  };

  const openEditModal = (book) => {
    setIsEditing(true);
    setCurrentBookId(book._id);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || 'Computer Science',
      shelfNumber: book.shelfNumber || 'CS-101',
      totalCopies: book.totalCopies || 5,
      coverImage: book.coverImage || '',
      description: book.description || ''
    });
    setBookMsg('');
    setShowBookModal(true);
  };

  const handleReturnBook = async (borrowId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/v1/borrows/return/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssueMsg('✅ Book marked as returned!');
      fetchDashboardData();
    } catch (err) {
      setIssueMsg(`❌ ${err.response?.data?.message || 'Failed to return book'}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sky-400 font-semibold">Loading Admin Console...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg gap-4">
        <div>
          <h1 className="text-2xl font-bold">Library Administration Console</h1>
          <p className="text-slate-400 text-sm">
            Circulation counter, student borrows, and catalog monitoring
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-500 font-bold px-4 py-2.5 rounded-lg text-sm text-white transition flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add New Book</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-bold mb-4">Quick Circulation: Issue Book to Student</h2>
        {issueMsg && <p className="mb-4 text-sm p-3 rounded bg-slate-800 font-medium">{issueMsg}</p>}
        <form onSubmit={handleIssueBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Student Member ID (e.g. LIB-2026-0001)"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
            required
          />
          <input
            type="text"
            placeholder="Book Mongo ID (Select from table below)"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
            required
          />
          <button type="submit" className="bg-sky-600 hover:bg-sky-500 font-bold p-3 rounded-lg text-sm text-white transition">
            Issue Book
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-xs uppercase font-semibold">Registered Users</p>
          <p className="text-3xl font-extrabold text-white mt-1">{stats?.users?.total}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-xs uppercase font-semibold">Unique Book Titles</p>
          <p className="text-3xl font-extrabold text-sky-400 mt-1">{stats?.catalog?.uniqueTitles}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-xs uppercase font-semibold">Total Copies</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{stats?.catalog?.totalCopies}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-xs uppercase font-semibold">Books Out of Stock</p>
          <p className="text-3xl font-extrabold text-rose-400 mt-1">{stats?.catalog?.outOfStockCount}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Book Circulation History</h2>
            <p className="text-xs text-slate-400">Track who borrowed books, issue dates, and returns</p>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-semibold">Filter Department:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-sky-400 p-2 rounded-lg font-semibold focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Web Development">Web Development</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Member ID</th>
                <th className="p-3">Department</th>
                <th className="p-3">Book Borrowed</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {borrows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-slate-400 text-xs">
                    No borrowing records found for this department filter.
                  </td>
                </tr>
              ) : (
                borrows.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-white">{record.user?.name || 'N/A'}</td>
                    <td className="p-3 font-mono text-xs text-slate-400">{record.user?.memberId || 'N/A'}</td>
                    <td className="p-3">
                      <span className="bg-slate-800 text-sky-300 border border-slate-700 text-xs px-2 py-0.5 rounded font-mono">
                        {record.user?.department || 'General'}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-200">{record.book?.title || 'Book Removed'}</td>
                    <td className="p-3 text-xs text-slate-400">{new Date(record.issueDate).toLocaleDateString()}</td>
                    <td className="p-3 text-xs text-slate-400">{new Date(record.dueDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        record.status === 'ISSUED' ? 'bg-sky-500/20 text-sky-400' :
                        record.status === 'RETURNED' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {record.status !== 'RETURNED' && (
                        <button
                          onClick={() => handleReturnBook(record._id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-xs px-3 py-1 rounded font-semibold text-white transition"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Library Catalog & Book Details</h2>
          <span className="text-xs bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full font-semibold">
            Manage or edit book details anytime
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Title & Author</th>
                <th className="p-3">ISBN</th>
                <th className="p-3">Shelf</th>
                <th className="p-3">Copies Available</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-semibold text-white">
                    {book.title}
                    <span className="block text-xs font-normal text-slate-400">{book.author}</span>
                  </td>
                  <td className="p-3 font-mono text-xs text-slate-400">{book.isbn}</td>
                  <td className="p-3 font-mono text-xs">{book.shelfNumber}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      book.availableCopies > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {book.availableCopies} / {book.totalCopies} Available
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(book)}
                      className="bg-amber-600/80 hover:bg-amber-500 text-xs px-3 py-1.5 rounded font-semibold text-white transition"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => setBookId(book._id)}
                      disabled={book.availableCopies <= 0}
                      className="bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-xs px-3 py-1.5 rounded font-semibold text-white transition"
                    >
                      Select for Issue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showBookModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBookModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-2">
              {isEditing ? 'Edit Book Details' : 'Add New Book to Library Catalog'}
            </h3>
            {bookMsg && <p className="text-xs p-2.5 rounded bg-slate-800 mb-3 font-medium">{bookMsg}</p>}

            <form onSubmit={handleSaveBook} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">ISBN Number *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Shelf Number</label>
                  <input
                    type="text"
                    value={bookForm.shelfNumber}
                    onChange={(e) => setBookForm({ ...bookForm, shelfNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={bookForm.coverImage}
                  onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Book Description / Details</label>
                <textarea
                  rows="3"
                  placeholder="Enter detailed synopsis or chapters..."
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold p-3 rounded-lg text-sm text-white mt-2 transition"
              >
                {isEditing ? 'Save Changes' : 'Add Book to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;