// src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PageStyles.css'; // For basic page specific styling

function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blog'); // Your backend API URL
        setBlogPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-section">
      <h1>My Blog</h1>
      {blogPosts.length === 0 ? (
        <p>No blog posts to display yet. Check back soon!</p>
      ) : (
        <div className="grid-container blog-grid">
          {blogPosts.map((post) => (
            <div key={post._id} className="grid-item blog-item">
              {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="item-image" />}
              <h3>{post.title}</h3>
              <p className="blog-excerpt">{post.content.substring(0, 150)}...</p> {/* Show first 150 chars */}
              <p className="blog-meta">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
              <Link to={`/blog/${post.slug}`} className="button">Read More</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogPage;