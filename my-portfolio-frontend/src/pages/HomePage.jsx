// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to My Portfolio</h1>
      <p>Hello! I'm Chris, a full-stack developer passionate about building engaging web experiences.</p>
      <p>Check out my <Link to="/portfolio">projects</Link> or read my latest <Link to="/blog">blog posts</Link>.</p>
      <p>Learn more <Link to="/about">about me</Link> or <Link to="/contact">get in touch</Link>.</p>
    </div>
  );
}

export default HomePage;