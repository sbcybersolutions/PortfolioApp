// src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { Link } from 'react-router-dom';
import './PageStyles.css'; // For basic page specific styling

function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/portfolio'); // Your backend API URL
        setPortfolioItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
        setError('Failed to load portfolio items. Please try again later.');
        setLoading(false);
      }
    };
    fetchPortfolioItems();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="loading-message">Loading portfolio...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-section">
      <h1>My Portfolio</h1>
      {portfolioItems.length === 0 ? (
        <p>No portfolio items to display yet. Check back soon!</p>
      ) : (
        <div className="grid-container">
          {portfolioItems.map((item) => (
            <div key={item._id} className="grid-item">
              <img src={item.imageUrl} alt={item.title} className="item-image" />
              <h3>{item.title}</h3>
              <p>{item.description.substring(0, 100)}...</p> {/* Show first 100 chars */}
              <Link to={`/portfolio/${item._id}`} className="button">View Project</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PortfolioPage;