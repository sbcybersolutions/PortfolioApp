// models/BlogPost.js
const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for your blog post'],
      trim: true,
    },
    slug: { // Unique URL-friendly identifier (e.g., "my-first-blog-post")
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    content: { // The main body of the blog post
      type: String,
      required: [true, 'Please add content for your blog post'],
    },
    author: {
      type: String,
      default: 'Admin', // For now, we'll default this. Later, we can link to a User model.
    },
    tags: {
      type: [String], // Array of strings (e.g., ['Web Dev', 'Tutorials', 'React'])
      required: false,
    },
    imageUrl: { // Optional: for a featured image/thumbnail
        type: String,
        required: false,
    },
    published: { // To easily toggle visibility
        type: Boolean,
        default: true,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Optional: Add a pre-save hook to generate a slug if not provided
blogPostSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
            .replace(/\s+/g, '-');     // Replace spaces with hyphens
    }
    next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);