// src/pages/AdminDashboard.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Outlet for nested routes
import './PageStyles.css';
import './Forms.css'; // For button styles

function AdminDashboard() {
  return (
    <div className="page-section">
      <h1>Admin Dashboard</h1>
      <p>Welcome to your content management system. From here, you can manage your portfolio items and blog posts.</p>

      <nav className="admin-nav">
        <Link to="/admin/portfolio" className="button primary-button">Manage Portfolio</Link>
        <Link to="/admin/blog" className="button primary-button">Manage Blog</Link>
        {/* Add other admin links here if needed */}
      </nav>

      {/* Outlet will render child routes like PortfolioManage or BlogManage */}
      <Outlet />
    </div>
  );
}

export default AdminDashboard;