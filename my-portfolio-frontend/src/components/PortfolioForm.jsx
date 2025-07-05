// src/components/PortfolioForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../pages/Forms.css'; // For form styling

function PortfolioForm({ itemData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    githubUrl: '',
    technologies: '', // Comma-separated string for input
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (itemData && itemData._id) { // If editing an existing item
      setFormData({
        title: itemData.title || '',
        description: itemData.description || '',
        imageUrl: itemData.imageUrl || '',
        projectUrl: itemData.projectUrl || '',
        githubUrl: itemData.githubUrl || '',
        technologies: itemData.technologies ? itemData.technologies.join(', ') : '', // Convert array to string
        isFeatured: itemData.isFeatured || false,
      });
    } else { // If creating a new item, reset form
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        projectUrl: '',
        githubUrl: '',
        technologies: '',
        isFeatured: false,
      });
    }
  }, [itemData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Convert technologies string back to array
      const technologiesArray = formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech !== '');

      const dataToSend = { ...formData, technologies: technologiesArray };

      if (itemData && itemData._id) {
        // Update existing item
        await axios.put(`http://localhost:5000/api/portfolio/${itemData._id}`, dataToSend, config);
        alert('Portfolio item updated successfully!');
      } else {
        // Create new item
        await axios.post('http://localhost:5000/api/portfolio', dataToSend, config);
        alert('Portfolio item created successfully!');
      }
      onSuccess(); // Callback to refresh list and close form
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="basic-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="projectUrl">Project URL (Optional)</label>
        <input type="text" id="projectUrl" name="projectUrl" value={formData.projectUrl} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="githubUrl">GitHub URL (Optional)</label>
        <input type="text" id="githubUrl" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="technologies">Technologies (Comma-separated, e.g., React, Node.js)</label>
        <input type="text" id="technologies" name="technologies" value={formData.technologies} onChange={handleChange} />
      </div>

      <div className="form-group checkbox-label">
        <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
        <label htmlFor="isFeatured">Featured Item</label>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
        <button type="submit" className="button primary-button" disabled={loading}>
          {loading ? 'Saving...' : (itemData && itemData._id ? 'Update Item' : 'Create Item')}
        </button>
        <button type="button" className="button secondary-button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PortfolioForm;