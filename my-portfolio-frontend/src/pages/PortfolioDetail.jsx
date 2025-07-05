// src/pages/PortfolioDetail.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PageStyles.css'; // For basic page specific styling

function PortfolioDetail() {
  const { id } = useParams(); // Get the ID from the URL parameter
  const [portfolioItem, setPortfolioItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolio/${id}`);
        setPortfolioItem(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio item:', err);
        if (err.response && err.response.status === 404) {
            setError('Portfolio item not found.');
        } else {
            setError('Failed to load portfolio item. Please try again later.');
        }
        setLoading(false);
      }
    };
    fetchPortfolioItem();
  }, [id]); // Re-run effect if ID changes

  if (loading) {
    return <div className="loading-message">Loading project details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!portfolioItem) {
    return <div className="error-message">No portfolio item found with this ID.</div>;
  }

  return (
    <div className="page-section detail-page">
      <h1 className="detail-title">{portfolioItem.title}</h1>
      <img src={portfolioItem.imageUrl} alt={portfolioItem.title} className="detail-image" />
      <p className="detail-description">{portfolioItem.description}</p>

      {portfolioItem.technologies && portfolioItem.technologies.length > 0 && (
        <div className="detail-section">
          <h3>Technologies Used:</h3>
          <div className="tags-container">
            {portfolioItem.technologies.map((tech, index) => (
              <span key={index} className="tag">{tech}</span>
            ))}
          </div>
        </div>
      )}

      <div className="detail-actions">
        {portfolioItem.projectUrl && (
          <a href={portfolioItem.projectUrl} target="_blank" rel="noopener noreferrer" className="button primary-button">
            View Live Project
          </a>
        )}
        {portfolioItem.githubUrl && (
          <a href={portfolioItem.githubUrl} target="_blank" rel="noopener noreferrer" className="button secondary-button">
            View Code on GitHub
          </a>
        )}
      </div>
      <Link to="/portfolio" className="back-link">← Back to Portfolio</Link>
    </div>
  );
}

export default PortfolioDetail;