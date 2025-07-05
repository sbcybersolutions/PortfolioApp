// src/pages/ContactPage.jsx
import React from 'react';

function ContactPage() {
  return (
    <div>
      <h1>Contact Me</h1>
      <p>Feel free to reach out to me via email at <a href="mailto:your.email@example.com">your.email@example.com</a>.</p>
      <p>You can also find me on social media (links will be in the footer).</p>
      {/* You could add a contact form here later, which would require backend integration for sending emails */}
    </div>
  );
}

export default ContactPage;