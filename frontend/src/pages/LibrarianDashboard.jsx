import React, { useState } from 'react';
import { Check, RefreshCw, ArrowRightLeft } from 'lucide-react';

export default function LibrarianDashboard() {
  const [memberId, setMemberId] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [message, setMessage] = useState(null);

  const handleIssueBook = (e) => {
    e.preventDefault();
    if (!memberId || !bookIsbn) return;

    setMessage({
      type: 'success',
      text: `Book (ISBN: ${bookIsbn}) successfully issued to Member ID: ${memberId}. Due date set to 14 days from today.`
    });
    setMemberId('');
    setBookIsbn('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Librarian Desk Operations</h1>
          <p className="text-xs text-slate-400 mt-1">Issue books, register returns, calculate fines, and approve renewals.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <Check className="w-5 h-5 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <ArrowRightLeft className="w-5 h-5" />
              <span>Issue New Book</span>
            </div>

            <form onSubmit={handleIssueBook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Member ID or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LIB-2026-0042"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Book ISBN / Barcode
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 978-0132350884"
                  value={bookIsbn}
                  onChange={(e) => setBookIsbn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-sky-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-sky-500/20"
              >
                Confirm Book Issue
              </button>
            </form>
          </div>

          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <RefreshCw className="w-5 h-5" />
              <span>Return & Fine Calculation Rules</span>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <p>• <strong className="text-white">Daily Fine Rate:</strong> ₹10 per overdue day.</p>
              <p>• <strong className="text-white">Max Renewal Count:</strong> 2 times per loan period.</p>
              <p>• <strong className="text-white">Borrow Duration:</strong> 14 standard calendar days.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}