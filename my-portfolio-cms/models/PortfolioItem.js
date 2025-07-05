// models/PortfolioItem.js
const mongoose = require('mongoose');

const portfolioItemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for your portfolio item'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description for your portfolio item'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL for your portfolio item'],
    },
    projectUrl: {
      type: String,
      required: false, // Optional: Link to live demo
    },
    githubUrl: {
      type: String,
      required: false, // Optional: Link to GitHub repo
    },
    technologies: {
      type: [String], // Array of strings (e.g., ['React', 'Node.js', 'MongoDB'])
      required: false,
    },
    isFeatured: {
      type: Boolean,
      default: false, // For highlighting specific projects on the homepage
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);