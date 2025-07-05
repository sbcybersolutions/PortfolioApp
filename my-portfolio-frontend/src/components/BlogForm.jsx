// src/components/BlogForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../pages/Forms.css';

function BlogForm({ postData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '', // Allow manual slug entry
    content: '',
    author: 'Admin', // Default author
    tags: '', // Comma-separated string
    imageUrl: '',
    published: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (postData && postData._id) { // If editing an existing post
      setFormData({
        title: postData.title || '',
        slug: postData.slug || '',
        content: postData.content || '',
        author: postData.author || 'Admin',
        tags: postData.tags ? postData.tags.join(', ') : '',
        imageUrl: postData.imageUrl || '',
        published: postData.published || false,
      });
    } else { // If creating a new post, reset form
      setFormData({
        title: '',
        slug: '',
        content: '',
        author: 'Admin',
        tags: '',
        imageUrl: '',
        published: true,
      });
    }
  }, [postData]);

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

      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const dataToSend = { ...formData, tags: tagsArray };

      if (postData && postData._id) {
        // Update existing post
        await axios.put(`http://localhost:5000/api/blog/${postData._id}`, dataToSend, config);
        alert('Blog post updated successfully!');
      } else {
        // Create new post
        await axios.post('http://localhost:5000/api/blog', dataToSend, config);
        alert('Blog post created successfully!');
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
        <label htmlFor="slug">Slug (URL-friendly; optional, will generate from title if empty)</label>
        <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        {/* For a real CMS, you'd integrate a rich text editor here (e.g., TinyMCE, Draft.js, Quill) */}
        <textarea id="content" name="content" value={formData.content} onChange={handleChange} required></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL (Optional)</label>
        <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (Comma-separated, e.g., Web Dev, Tutorials)</label>
        <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} />
      </div>

      <div className="form-group checkbox-label">
        <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleChange} />
        <label htmlFor="published">Published</label>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
        <button type="submit" className="button primary-button" disabled={loading}>
          {loading ? 'Saving...' : (postData && postData._id ? 'Update Post' : 'Create Post')}
        </button>
        <button type="button" className="button secondary-button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BlogForm;