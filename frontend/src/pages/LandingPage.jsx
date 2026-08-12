import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Main Hero & Features Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center">
        {/* Main Title & Subtitle */}
        <div className="text-center max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Library Management System
          </h1>
          <p className="text-slate-400 text-base md:text-lg mt-4 leading-relaxed">
            A comprehensive platform designed to streamline physical book circulations, track loans, manage digital holds, and provide instant academic assistance.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-sky-600/20"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold px-6 py-3 rounded-xl text-sm transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Feature 1 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl w-fit text-sky-400 text-2xl mb-4">
              📚
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Live Catalog Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Browse the physical library collection in real time, check exact shelf locations, and verify book copy availability instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit text-emerald-400 text-2xl mb-4">
              🔖
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Self-Service Holds</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Reserve books ahead of time directly from your student portal for fast counter pickup without waiting in queues.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl w-fit text-purple-400 text-2xl mb-4">
              🤖
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Library Assistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get intelligent reading recommendations, syllabus references, and exam preparation book suggestions built directly into your dashboard.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit text-amber-400 text-2xl mb-4">
              ⏰
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Easy Loan Renewals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitor active loan due dates and extend return deadlines by 7 days with a single click before overdue fees occur.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl w-fit text-rose-400 text-2xl mb-4">
              💳
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fine Management</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              View transparent real-time overdue fine calculations and clear outstanding balances through our digital payment simulator.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl w-fit text-indigo-400 text-2xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Department Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Administrative tools with department-wise circulation logging, stock management, and issue tracking across all departments.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;