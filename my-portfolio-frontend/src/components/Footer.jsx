// src/components/Footer.jsx
import React from 'react';
import './Footer.css'; // Create this CSS file next

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Chris. All rights reserved.</p>
      <div className="footer-links">
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">GitHub</a>
        {/* Add other social links as needed */}
      </div>
    </footer>
  );
}

export default Footer;