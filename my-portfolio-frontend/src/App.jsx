// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetail from './pages/PortfolioDetail';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage'; // New: Login Page
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Context & Protected Route Component
import { AuthProvider } from './context/AuthContext'; // New: AuthProvider
import PrivateRoute from './components/PrivateRoute'; // We'll create this next
import AdminDashboard from './pages/AdminDashboard'; // New: Admin Dashboard
import PortfolioManage from './pages/PortfolioManage'; // New: Portfolio Management
import BlogManage from './pages/BlogManage'; // New: Blog Management


function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the entire app with AuthProvider */}
        <Navbar />
        <main className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} /> {/* New: Login route */}

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<PrivateRoute isAdminRoute={true} />}>
              <Route index element={<AdminDashboard />} /> {/* /admin will render Dashboard */}
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="portfolio" element={<PortfolioManage />} />
              <Route path="blog" element={<BlogManage />} />
              {/* Add routes for create/edit specific pages if needed here later */}
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;