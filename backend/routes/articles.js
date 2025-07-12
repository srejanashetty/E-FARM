import express from 'express';
import Article from '../models/Article.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/articles
// @desc    Get published articles with pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, search, featured } = req.query;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate('author', 'name profileImage')
        .select('-content')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/articles/:id
// @desc    Get single article by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name profileImage')
      .populate('comments.user', 'name profileImage');

    if (!article || article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment views
    await article.incrementViews();

    res.json({
      success: true,
      data: { article }
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/articles/featured/list
// @desc    Get featured articles
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const articles = await Article.find({
      status: 'published',
      isFeatured: true
    })
      .populate('author', 'name profileImage')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { articles }
    });
  } catch (error) {
    console.error('Get featured articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/articles/popular/list
// @desc    Get popular articles
// @access  Public
router.get('/popular/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const articles = await Article.getPopular(limit);

    res.json({
      success: true,
      data: { articles }
    });
  } catch (error) {
    console.error('Get popular articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/articles/recent/list
// @desc    Get recent articles
// @access  Public
router.get('/recent/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const articles = await Article.getRecent(limit);

    res.json({
      success: true,
      data: { articles }
    });
  } catch (error) {
    console.error('Get recent articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
