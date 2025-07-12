import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all active categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .populate('parentCategory', 'name slug');

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/tree
// @desc    Get category tree structure
// @access  Public
router.get('/tree', async (req, res) => {
  try {
    const categoryTree = await Category.getCategoryTree();

    res.json({
      success: true,
      data: { categories: categoryTree }
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug description');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get product count for this category
    const productCount = await Product.countDocuments({
      category: category._id,
      'availability.status': 'available',
      isActive: true
    });

    res.json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          productCount
        }
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug description');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get product count for this category
    const productCount = await Product.countDocuments({
      category: category._id,
      'availability.status': 'available',
      isActive: true
    });

    res.json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          productCount
        }
      }
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/:id/hierarchy
// @desc    Get category hierarchy (breadcrumb)
// @access  Public
router.get('/:id/hierarchy', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const hierarchy = await category.getHierarchy();

    res.json({
      success: true,
      data: { hierarchy }
    });
  } catch (error) {
    console.error('Get category hierarchy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/:id/subcategories
// @desc    Get all subcategories of a category
// @access  Public
router.get('/:id/subcategories', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subcategories = await category.getAllSubcategories();

    res.json({
      success: true,
      data: { subcategories }
    });
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/popular/list
// @desc    Get popular categories (with most products)
// @access  Public
router.get('/popular/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const popularCategories = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: {
            $size: {
              $filter: {
                input: '$products',
                cond: {
                  $and: [
                    { $eq: ['$$this.isActive', true] },
                    { $eq: ['$$this.availability.status', 'available'] }
                  ]
                }
              }
            }
          }
        }
      },
      { $match: { productCount: { $gt: 0 } } },
      { $sort: { productCount: -1 } },
      { $limit: limit },
      {
        $project: {
          name: 1,
          description: 1,
          slug: 1,
          image: 1,
          icon: 1,
          productCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: { categories: popularCategories }
    });
  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
