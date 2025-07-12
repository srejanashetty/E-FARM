import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Job from '../models/Job.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import { authenticate, isFarmer } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication and farmer authorization to all routes
router.use(authenticate);
router.use(isFarmer);

// @route   GET /api/farmer/dashboard
// @desc    Get farmer dashboard statistics
// @access  Private (Farmer only)
router.get('/dashboard', async (req, res) => {
  try {
    const farmerId = req.user._id;

    const [
      totalProducts,
      activeProducts,
      totalJobs,
      totalOrders,
      recentOrders,
      salesAnalytics
    ] = await Promise.all([
      Product.countDocuments({ farmer: farmerId }),
      Product.countDocuments({ farmer: farmerId, 'availability.status': 'available' }),
      Job.countDocuments({ farmer: farmerId }),
      Order.countDocuments({ 'items.farmer': farmerId }),
      Order.getOrdersByFarmer(farmerId).limit(5),
      Order.getSalesAnalytics(farmerId, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
    ]);

    const analytics = salesAnalytics[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      totalQuantitySold: 0
    };

    res.json({
      success: true,
      data: {
        statistics: {
          totalProducts,
          activeProducts,
          totalJobs,
          totalOrders,
          monthlyRevenue: analytics.totalRevenue,
          averageOrderValue: analytics.averageOrderValue
        },
        recentOrders,
        salesAnalytics: analytics
      }
    });
  } catch (error) {
    console.error('Farmer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// PRODUCT MANAGEMENT
// @route   GET /api/farmer/products
// @desc    Get farmer's products
// @access  Private (Farmer only)
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, category, search } = req.query;

    const query = { farmer: req.user._id };
    if (status) query['availability.status'] = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/farmer/products
// @desc    Create new product
// @access  Private (Farmer only)
router.post('/products', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Product name is required'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required'),
  body('category').isMongoId().withMessage('Valid category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('unit').isIn(['kg', 'lb', 'piece', 'dozen', 'liter', 'gallon', 'bunch', 'bag']).withMessage('Invalid unit')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const productData = {
      ...req.body,
      farmer: req.user._id
    };

    const product = new Product(productData);
    await product.save();
    await product.populate('category', 'name');

    // Update category product count
    await category.updateProductCount();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/farmer/products/:id
// @desc    Update product
// @access  Private (Farmer only)
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    Object.assign(product, req.body);
    await product.save();
    await product.populate('category', 'name');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/farmer/products/:id
// @desc    Delete product
// @access  Private (Farmer only)
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update category product count
    const category = await Category.findById(product.category);
    if (category) {
      await category.updateProductCount();
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// JOB MANAGEMENT
// @route   GET /api/farmer/jobs
// @desc    Get farmer's job posts
// @access  Private (Farmer only)
router.get('/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { farmer: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get farmer jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/farmer/jobs
// @desc    Create new job post
// @access  Private (Farmer only)
router.post('/jobs', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Job title is required'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required'),
  body('jobType').isIn(['full-time', 'part-time', 'seasonal', 'contract', 'temporary']).withMessage('Invalid job type'),
  body('category').isIn(['harvesting', 'planting', 'maintenance', 'equipment-operation', 'livestock', 'general-labor', 'management', 'technical']).withMessage('Invalid category'),
  body('salary.amount').isFloat({ min: 0 }).withMessage('Salary amount must be positive'),
  body('applicationDeadline').isISO8601().withMessage('Valid application deadline is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const jobData = {
      ...req.body,
      farmer: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
