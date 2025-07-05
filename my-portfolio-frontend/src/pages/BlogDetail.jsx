// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PageStyles.css'; // For basic page specific styling

function BlogDetail() {
  const { slug } = useParams(); // Get the slug from the URL parameter
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Fetch by slug for public-facing route
        const response = await axios.get(`http://localhost:5000/api/blog/${slug}`);
        setBlogPost(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        if (err.response && err.response.status === 404) {
            setError('Blog post not found or not published.');
        } else {
            setError('Failed to load blog post. Please try again later.');
        }
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, [slug]); // Re-run effect if slug changes

  if (loading) {
    return <div className="loading-message">Loading blog post...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!blogPost) {
    return <div className="error-message">No blog post found.</div>;
  }

  return (
    <div className="page-section detail-page blog-detail">
      <h1 className="detail-title">{blogPost.title}</h1>
      <p className="blog-meta">By {blogPost.author} on {new Date(blogPost.createdAt).toLocaleDateString()}</p>
      {blogPost.imageUrl && <img src={blogPost.imageUrl} alt={blogPost.title} className="detail-image" />}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: blogPost.content }} /> {/* Render HTML content */}

      {blogPost.tags && blogPost.tags.length > 0 && (
        <div className="detail-section">
          <h3>Tags:</h3>
          <div className="tags-container">
            {blogPost.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
      <Link to="/blog" className="back-link">← Back to Blog</Link>
    </div>
  );
}

export default BlogDetail;