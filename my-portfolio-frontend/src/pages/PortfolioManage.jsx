// src/pages/PortfolioManage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PageStyles.css';
import './Forms.css'; // For button and list styles

// We'll create this form component later
import PortfolioForm from '../components/PortfolioForm';

function PortfolioManage() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // State to hold item being edited
  const { token } = useContext(AuthContext); // Get token from context

  const fetchPortfolioItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/portfolio', config); // Get all (even if not strictly admin endpoint, use token)
      setPortfolioItems(response.data);
    } catch (err) {
      console.error('Error fetching portfolio items:', err);
      setError(err.response?.data?.message || 'Failed to load portfolio items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortfolioItems();
    }
  }, [token]); // Refetch when token changes (e.g., after login)

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/portfolio/${id}`, config);
        // After successful deletion, refetch the list or remove from state
        setPortfolioItems(portfolioItems.filter((item) => item._id !== id));
        alert('Portfolio item deleted successfully!');
      } catch (err) {
        console.error('Error deleting portfolio item:', err);
        setError(err.response?.data?.message || 'Failed to delete portfolio item.');
      }
    }
  };

  const handleFormSuccess = () => {
    setEditingItem(null); // Clear editing state
    fetchPortfolioItems(); // Refetch items to show new/updated content
  };

  if (!token) {
      return <div className="error-message">You need to be logged in to manage content.</div>;
  }

  if (loading) {
    return <div className="loading-message">Loading portfolio items...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-section">
      <h2>Manage Portfolio Items</h2>
      <button onClick={() => setEditingItem({})} className="button primary-button" style={{ marginBottom: '20px' }}>
        Add New Portfolio Item
      </button>

      {editingItem && (
        <div className="form-container">
          <h3>{editingItem._id ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}</h3>
          <PortfolioForm
            itemData={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      )}

      {portfolioItems.length === 0 ? (
        <p>No portfolio items found. Start by adding one!</p>
      ) : (
        <ul className="admin-list">
          {portfolioItems.map((item) => (
            <li key={item._id} className="admin-list-item">
              <div className="admin-list-item-content">
                <h3>{item.title}</h3>
                <p>{item.description.substring(0, 70)}...</p>
              </div>
              <div className="admin-list-item-actions">
                <button onClick={() => setEditingItem(item)} className="action-button edit">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="action-button delete">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PortfolioManage;