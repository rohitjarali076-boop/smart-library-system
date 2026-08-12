import React, { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  AlertCircle, 
  Bot, 
  Calendar,
  DollarSign
} from 'lucide-react';

const BORROWED_BOOKS = [
  {
    id: '101',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    status: 'ACTIVE',
    fine: 0,
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '102',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell',
    issueDate: '2026-07-20',
    dueDate: '2026-08-03',
    status: 'OVERDUE',
    fine: 50,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop'
  }
];

export default function MemberDashboard() {
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Library Assistant. How can I help you find books or check your due dates today?' }
  ]);

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userMsg = aiQuery;
    setAiChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiQuery('');

    setTimeout(() => {
      let reply = "Based on our library catalog, you can check 'Clean Code' in Shelf CS-102 or 'Data Structures' in Shelf DS-201.";
      if (userMsg.toLowerCase().includes('due') || userMsg.toLowerCase().includes('return')) {
        reply = "You currently have 1 overdue book: 'Artificial Intelligence' was due on Aug 3. Total fine accumulated is ₹50.";
      } else if (userMsg.toLowerCase().includes('python')) {
        reply = "We have 3 books available for Python: 'Automate the Boring Stuff', 'Fluent Python', and 'Python Crash Course'.";
      }
      setAiChat(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Library Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Welcome back, Alex Johnson (Member ID: LIB-2026-0042)</p>
          </div>
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <Bot className="w-4 h-4" />
            <span>Open AI Library Assistant</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Books Borrowed</p>
              <p className="text-2xl font-extrabold text-white mt-1">2 / 5</p>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Active Reservations</p>
              <p className="text-2xl font-extrabold text-white mt-1">1 Title</p>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <Bookmark className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Overdue Books</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">1 Book</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Unpaid Fine</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">₹50</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Currently Borrowed Books</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BORROWED_BOOKS.map((book) => (
              <div key={book.id} className="flex gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <img src={book.cover} alt={book.title} className="w-20 h-28 object-cover rounded-lg shrink-0" />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        book.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {book.status}
                      </span>
                      {book.fine > 0 && <span className="text-xs font-bold text-amber-400">Fine: ₹{book.fine}</span>}
                    </div>
                    <h3 className="font-bold text-white text-sm mt-2 line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-slate-400">{book.author}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      Due: {book.dueDate}
                    </span>
                    <button className="text-sky-400 font-semibold hover:underline">
                      Request Renewal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-sm">AI Library Assistant</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕ Close
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[80%] text-xs ${
                    msg.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about books, shelf locations, due dates..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
              />
              <button type="submit" className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}