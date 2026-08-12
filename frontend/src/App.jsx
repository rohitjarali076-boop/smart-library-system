import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import BookCatalog from './pages/BookCatalog';
import AdminDashboard from './pages/AdminDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import StudentDashboard from './pages/StudentDashboard';
import MemberDashboard from './pages/MemberDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books" element={<BookCatalog />} />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Librarian Route */}
            <Route
              path="/librarian"
              element={
                <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
                  <LibrarianDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'MEMBER', 'ADMIN', 'LIBRARIAN']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Member Dashboard Route */}
            <Route
              path="/member"
              element={
                <ProtectedRoute allowedRoles={['MEMBER', 'STUDENT', 'ADMIN', 'LIBRARIAN']}>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-All Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;