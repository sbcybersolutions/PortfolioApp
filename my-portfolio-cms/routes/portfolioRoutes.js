// routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const PortfolioItem = require('../models/PortfolioItem'); // Import the PortfolioItem model
const { protect, admin } = require('../middleware/authMiddleware'); // Import auth middleware if needed

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
router.get('/', async (req, res) => {
  try {
    const portfolioItems = await PortfolioItem.find({});
    res.json(portfolioItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single portfolio item by ID
// @route   GET /api/portfolio/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const portfolioItem = await PortfolioItem.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(portfolioItem);
  } catch (error) {
    console.error(error);
    // Check for invalid MongoDB ID format
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Portfolio Item ID' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new portfolio item
// @route   POST /api/portfolio
// @access  Admin (will add authentication later)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, imageUrl, projectUrl, githubUrl, technologies, isFeatured } = req.body;

    // Basic validation (more comprehensive validation can be added)
    if (!title || !description || !imageUrl) {
      return res.status(400).json({ message: 'Please include title, description, and imageUrl' });
    }

    const portfolioItem = new PortfolioItem({
      title,
      description,
      imageUrl,
      projectUrl,
      githubUrl,
      technologies,
      isFeatured,
    });

    const createdItem = await portfolioItem.save();
    res.status(201).json(createdItem); // 201 status for successful creation
  } catch (error) {
    console.error(error);
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a portfolio item
// @route   PUT /api/portfolio/:id
// @access  Admin (will add authentication later)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, description, imageUrl, projectUrl, githubUrl, technologies, isFeatured } = req.body;

    const portfolioItem = await PortfolioItem.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Update fields if they are provided in the request body
    portfolioItem.title = title || portfolioItem.title;
    portfolioItem.description = description || portfolioItem.description;
    portfolioItem.imageUrl = imageUrl || portfolioItem.imageUrl;
    portfolioItem.projectUrl = projectUrl !== undefined ? projectUrl : portfolioItem.projectUrl;
    portfolioItem.githubUrl = githubUrl !== undefined ? githubUrl : portfolioItem.githubUrl;
    portfolioItem.technologies = technologies !== undefined ? technologies : portfolioItem.technologies;
    portfolioItem.isFeatured = isFeatured !== undefined ? isFeatured : portfolioItem.isFeatured;

    const updatedItem = await portfolioItem.save(); // .save() will run validations
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Portfolio Item ID' });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Admin (will add authentication later)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const portfolioItem = await PortfolioItem.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await PortfolioItem.deleteOne({ _id: req.params.id }); // Use deleteOne on the model

    res.json({ message: 'Portfolio item removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Portfolio Item ID' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;