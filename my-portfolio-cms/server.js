// server.js
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Import the DB connection function
const PortfolioRoutes = require('./routes/PortfolioRoutes'); // Import portfolio routes
const blogRoutes = require('./routes/blogRoutes'); // Import blog routes (if needed)
const userRoutes = require('./routes/userRoutes'); // Import user routes (if needed)


// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Welcome to the Portfolio CMS Backend!');
});

// Mount portfolio routes
app.use('/api/portfolio', PortfolioRoutes);
// Mount blog routes
app.use('/api/blog', blogRoutes);
// Mount user routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
});