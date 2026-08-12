import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, borrowRes, reserveRes, catalogRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/auth/me', { headers }),
        axios.get('http://localhost:5000/api/v1/borrows/my-books', { headers }),
        axios.get('http://localhost:5000/api/v1/student/reservations', { headers }),
        axios.get('http://localhost:5000/api/v1/books', { headers })
      ]);

      setUser(userRes.data.user);
      setBorrows(borrowRes.data.data || []);
      setReservations(reserveRes.data.data || []);
      setCatalog(catalogRes.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRenew = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/v1/borrows/renew/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActionMsg('✅ Due date extended by 7 days!');
      fetchDashboardData();
    } catch (err) {
      setActionMsg('❌ Extension failed.');
    }
  };

  const handleReserve = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/v1/student/reserve', 
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMsg(`✅ ${res.data.message}`);
      fetchDashboardData();
    } catch (err) {
      setActionMsg(`❌ ${err.response?.data?.message || 'Reservation failed'}`);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/student/reserve/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActionMsg('✅ Reservation cancelled.');
      fetchDashboardData();
    } catch (err) {
      setActionMsg('❌ Failed to cancel reservation.');
    }
  };

  const handlePayFine = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/student/pay-fine', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActionMsg('✅ Outstanding fine cleared successfully!');
      setShowPaymentModal(false);
      fetchDashboardData();
    } catch (err) {
      setActionMsg('❌ Payment processing failed.');
    }
  };

  const handleAiAsk = (e) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setAiResponse(`SmartLib AI Assistant: Recommended reference for "${aiPrompt}" in ${user?.department || 'Computer Science'} is available on Shelf CS-201 or AI-105.`);
  };

  const activeBorrows = borrows.filter(b => b.status === 'ISSUED' || b.status === 'OVERDUE');
  const totalFines = borrows.reduce((sum, b) => sum + (b.fineAmount || 0), 0);
  
  const categories = ['ALL', ...new Set(catalog.map(b => b.category || 'General'))];

  const filteredCatalog = catalog.filter(b => {
    const matchesQuery = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  if (loading) {
    return <div className="p-8 text-center text-sky-400 font-semibold">Loading Student Portal...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Library Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back, <span className="text-sky-300 font-semibold">{user?.name}</span> (Member ID: {user?.memberId})
          </p>
        </div>
        <button
          onClick={() => setShowAiModal(true)}
          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center space-x-2 shadow-lg shadow-sky-600/20 transition"
        >
          <span>🤖</span>
          <span>Open AI Library Assistant</span>
        </button>
      </div>

      {actionMsg && (
        <div className="bg-slate-800 border border-sky-500/40 text-sky-300 p-3 rounded-lg text-sm font-medium">
          {actionMsg}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Books Borrowed</p>
            <p className="text-3xl font-extrabold text-white mt-1">{activeBorrows.length} / {user?.maxAllowedBooks || 5}</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg text-sky-400 text-xl">📖</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Active Reservations</p>
            <p className="text-3xl font-extrabold text-sky-400 mt-1">{reservations.length} Title</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg text-sky-400 text-xl">🔖</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Overdue Books</p>
            <p className="text-3xl font-extrabold text-rose-400 mt-1">
              {borrows.filter(b => b.status === 'OVERDUE').length} Book
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg text-rose-400 text-xl">⚠️</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Unpaid Fine</p>
            <p className="text-3xl font-extrabold text-amber-400 mt-1">₹{totalFines}</p>
          </div>
          {totalFines > 0 ? (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded transition"
            >
              Pay Now
            </button>
          ) : (
            <div className="p-3 bg-slate-800 rounded-lg text-emerald-400 text-xl">₹</div>
          )}
        </div>
      </div>

      {/* Currently Borrowed Books */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Currently Borrowed Books</h2>
        {activeBorrows.length === 0 ? (
          <p className="text-slate-400 text-sm">You have no active book loans.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBorrows.map((item) => (
              <div key={item._id} className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl flex space-x-4">
                <img 
                  src={item.book?.coverImage || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300'} 
                  alt={item.book?.title} 
                  className="w-20 h-28 object-cover rounded-md border border-slate-700"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.status}
                      </span>
                      {item.fineAmount > 0 && (
                        <span className="text-xs font-bold text-amber-400">Fine: ₹{item.fineAmount}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-sm mt-1 line-clamp-1">{item.book?.title}</h3>
                    <p className="text-xs text-slate-400">{item.book?.author}</p>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-700/50">
                    <span className="text-xs text-slate-400">
                      📅 Due: <strong className="text-slate-200">{new Date(item.dueDate).toLocaleDateString()}</strong>
                    </span>
                    <button 
                      onClick={() => handleRenew(item._id)}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
                    >
                      Request Renewal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Reservations */}
      {reservations.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Hold Reservations (Pending Counter Collection)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res) => (
              <div key={res._id} className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-sm">{res.book?.title}</h3>
                  <p className="text-xs text-slate-400">Shelf: <span className="text-sky-300 font-mono">{res.book?.shelfNumber}</span></p>
                  <p className="text-[10px] text-emerald-400 mt-1">Status: {res.status}</p>
                </div>
                <button
                  onClick={() => handleCancelReservation(res._id)}
                  className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded transition"
                >
                  Cancel Hold
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse Library Catalog */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Browse Library Catalog</h2>
            <p className="text-xs text-slate-400">Search books and reserve titles for counter collection</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-sky-400 p-2.5 rounded-lg font-semibold focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search by Title or Author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm text-white w-full sm:w-64 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCatalog.map((book) => (
            <div key={book._id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex justify-between flex-col">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700">
                    Shelf {book.shelfNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{book.category}</span>
                </div>
                <h3 className="font-bold text-white text-sm mt-2 line-clamp-1">{book.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs text-emerald-400 font-medium">
                  {book.availableCopies} Copies Available
                </span>
                <button
                  onClick={() => handleReserve(book._id)}
                  disabled={book.availableCopies <= 0}
                  className="bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-xs px-3 py-1.5 rounded font-semibold text-white transition"
                >
                  Place Reservation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white">Clear Outstanding Fine</h3>
            <p className="text-xs text-slate-400 mt-1">Total Outstanding Balance: <strong className="text-amber-400 font-mono text-sm">₹{totalFines}</strong></p>

            <form onSubmit={handlePayFine} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Select Payment Method</label>
                <select className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-sm text-white focus:outline-none">
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="COUNTER">Cash at Circulation Counter</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold p-3 rounded-lg text-sm text-white transition">
                Confirm & Pay ₹{totalFines}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>🤖</span>
              <span>SmartLib AI Assistant</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Ask for book recommendations or subject syllabus references.</p>

            <form onSubmit={handleAiAsk} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="e.g. Best books for Data Structures exam?"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 font-bold p-2.5 rounded-lg text-sm text-white">
                Ask AI
              </button>
            </form>

            {aiResponse && (
              <div className="mt-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs text-sky-200">
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;