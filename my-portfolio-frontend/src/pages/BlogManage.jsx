// src/pages/BlogManage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PageStyles.css';
import './Forms.css';

// We'll create this form component later
import BlogForm from '../components/BlogForm';

function BlogManage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const { token } = useContext(AuthContext);

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Fetch from the admin endpoint to get all posts (published or not)
      const response = await axios.get('http://localhost:5000/api/blog/admin', config);
      setBlogPosts(response.data);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err.response?.data?.message || 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBlogPosts();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/blog/${id}`, config);
        setBlogPosts(blogPosts.filter((post) => post._id !== id));
        alert('Blog post deleted successfully!');
      } catch (err) {
        console.error('Error deleting blog post:', err);
        setError(err.response?.data?.message || 'Failed to delete blog post.');
      }
    }
  };

  const handleFormSuccess = () => {
    setEditingPost(null);
    fetchBlogPosts();
  };

  if (!token) {
      return <div className="error-message">You need to be logged in to manage content.</div>;
  }

  if (loading) {
    return <div className="loading-message">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-section">
      <h2>Manage Blog Posts</h2>
      <button onClick={() => setEditingPost({})} className="button primary-button" style={{ marginBottom: '20px' }}>
        Add New Blog Post
      </button>

      {editingPost && (
        <div className="form-container">
          <h3>{editingPost._id ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
          <BlogForm
            postData={editingPost}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingPost(null)}
          />
        </div>
      )}

      {blogPosts.length === 0 ? (
        <p>No blog posts found. Start by adding one!</p>
      ) : (
        <ul className="admin-list">
          {blogPosts.map((post) => (
            <li key={post._id} className="admin-list-item">
              <div className="admin-list-item-content">
                <h3>{post.title} {post.published ? '' : '(Draft)'}</h3>
                <p>{post.content.substring(0, 70)}...</p>
              </div>
              <div className="admin-list-item-actions">
                <button onClick={() => setEditingPost(post)} className="action-button edit">Edit</button>
                <button onClick={() => handleDelete(post._id)} className="action-button delete">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BlogManage;