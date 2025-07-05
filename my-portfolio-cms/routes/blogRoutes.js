// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/authMiddleware'); // Import auth middleware if needed

// @desc    Get all published blog posts (public view)
// @route   GET /api/blog
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ published: true }).sort({ createdAt: -1 }); // Newest first
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all blog posts (for admin view, includes unpublished)
// @route   GET /api/blog/admin
// @access  Admin (will add authentication later)
router.get('/admin', protect, admin, async (req, res) => {
    // NOTE: This route is now protected.
    try {
        const blogPosts = await BlogPost.find({}).sort({ createdAt: -1 });
        res.json(blogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get single blog post by ID or Slug (public view)
// @route   GET /api/blog/:identifier
// @access  Public
router.get('/:identifier', async (req, res) => {
  try {
    let blogPost;
    // Check if the identifier looks like a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.identifier)) {
        blogPost = await BlogPost.findById(req.params.identifier);
    } else {
        // Assume it's a slug
        blogPost = await BlogPost.findOne({ slug: req.params.identifier, published: true });
    }

    if (!blogPost || !blogPost.published) { // Ensure it's found and published
      return res.status(404).json({ message: 'Blog post not found or not published' });
    }
    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Create a new blog post
// @route   POST /api/blog
// @access  Admin (will add authentication later)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content, author, tags, imageUrl, published, slug } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please include title and content for your blog post' });
    }

    const blogPost = new BlogPost({
      title,
      slug, // If provided, use it, otherwise the pre-save hook will generate
      content,
      author,
      tags,
      imageUrl,
      published,
    });

    const createdPost = await blogPost.save();
    res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) { // Duplicate key error (for unique slug)
        return res.status(400).json({ message: 'A blog post with this slug already exists.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Admin (will add authentication later)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, content, author, tags, imageUrl, published, slug } = req.body;

    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Update fields if they are provided
    blogPost.title = title !== undefined ? title : blogPost.title;
    blogPost.content = content !== undefined ? content : blogPost.content;
    blogPost.author = author !== undefined ? author : blogPost.author;
    blogPost.tags = tags !== undefined ? tags : blogPost.tags;
    blogPost.imageUrl = imageUrl !== undefined ? imageUrl : blogPost.imageUrl;
    blogPost.published = published !== undefined ? published : blogPost.published;
    blogPost.slug = slug !== undefined ? slug : blogPost.slug; // Allow explicit slug update

    const updatedPost = await blogPost.save();
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Blog Post ID' });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) { // Duplicate key error (for unique slug)
        return res.status(400).json({ message: 'A blog post with this slug already exists.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Admin (will add authentication later)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog post removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Blog Post ID' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;