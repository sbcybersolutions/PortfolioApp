// server.js
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors

// Import your routes
const portfolioRoutes = require('./routes/portfolioRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware configuration
// IMPORTANT: Make sure this list includes all origins your frontend might be running on
const corsOptions = {
    origin: [
        'http://localhost:3000',    // Common for Create React App
        'http://localhost:5173',    // Common for Vite
        'http://127.0.0.1:5173',    // Sometimes localhost resolves to 127.0.0.1
        // 'https://your-frontend-deployed-url.com' // Add this when you deploy your frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions)); // Apply CORS middleware

// Middleware to parse JSON bodies (MUST be after cors if credentials are used, but generally ok here)
app.use(express.json());

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to the Portfolio CMS Backend!');
});

// Mount your routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/users', userRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
});