import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Article from '../models/Article.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Job from '../models/Job.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(isAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get comprehensive admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalProducts,
      totalOrders,
      totalArticles,
      totalCategories,
      totalJobs,
      activeUsers,
      activeFarmers,
      recentUsers,
      recentOrders,
      recentProducts,
      topCategories,
      monthlyStats,
      orderStatusStats,
      revenueStats
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'farmer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Article.countDocuments(),
      Category.countDocuments(),
      Job.countDocuments(),
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({ role: 'farmer', isActive: true }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt isActive'),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('buyer', 'name email').populate('items.product', 'name'),
      Product.find().sort({ createdAt: -1 }).limit(5).populate('farmer', 'name').populate('category', 'name'),
      Category.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products'
          }
        },
        {
          $project: {
            name: 1,
            productCount: { $size: '$products' }
          }
        },
        { $sort: { productCount: -1 } },
        { $limit: 5 }
      ]),
      getMonthlyStats(),
      getOrderStatusStats(),
      getRevenueStats()
    ]);

    // Calculate growth percentages
    const growthStats = await calculateGrowthStats();

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalFarmers,
          totalProducts,
          totalOrders,
          totalArticles,
          totalCategories,
          totalJobs,
          activeUsers,
          activeFarmers,
          userGrowth: growthStats.userGrowth,
          farmerGrowth: growthStats.farmerGrowth,
          productGrowth: growthStats.productGrowth,
          orderGrowth: growthStats.orderGrowth
        },
        recentActivity: {
          recentUsers,
          recentOrders,
          recentProducts
        },
        analytics: {
          topCategories,
          monthlyStats,
          orderStatusStats,
          revenueStats
        },
        systemHealth: {
          databaseStatus: 'connected',
          serverUptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          lastUpdated: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get monthly statistics
async function getMonthlyStats() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$orderSummary.total' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
}

// Helper function to get order status statistics
async function getOrderStatusStats() {
  return await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    }
  ]);
}

// Helper function to get revenue statistics
async function getRevenueStats() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  const [currentMonth, lastMonth, totalRevenue] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderSummary.total' }
        }
      }
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderSummary.total' }
        }
      }
    ]),
    Order.aggregate([
      {
        $match: {
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderSummary.total' }
        }
      }
    ])
  ]);

  return {
    currentMonth: currentMonth[0]?.total || 0,
    lastMonth: lastMonth[0]?.total || 0,
    totalRevenue: totalRevenue[0]?.total || 0
  };
}

// Helper function to calculate growth statistics
async function calculateGrowthStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [
    currentPeriodUsers,
    previousPeriodUsers,
    currentPeriodFarmers,
    previousPeriodFarmers,
    currentPeriodProducts,
    previousPeriodProducts,
    currentPeriodOrders,
    previousPeriodOrders
  ] = await Promise.all([
    User.countDocuments({ role: 'user', createdAt: { $gte: thirtyDaysAgo } }),
    User.countDocuments({ role: 'user', createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    User.countDocuments({ role: 'farmer', createdAt: { $gte: thirtyDaysAgo } }),
    User.countDocuments({ role: 'farmer', createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Product.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Order.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })
  ]);

  return {
    userGrowth: calculatePercentageGrowth(currentPeriodUsers, previousPeriodUsers),
    farmerGrowth: calculatePercentageGrowth(currentPeriodFarmers, previousPeriodFarmers),
    productGrowth: calculatePercentageGrowth(currentPeriodProducts, previousPeriodProducts),
    orderGrowth: calculatePercentageGrowth(currentPeriodOrders, previousPeriodOrders)
  };
}

// Helper function to calculate percentage growth
function calculatePercentageGrowth(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// ==================== USER MANAGEMENT ====================

// @route   GET /api/admin/users
// @desc    Get all users with advanced filtering and analytics
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { role, search, status, sortBy, sortOrder, dateFrom, dateTo } = req.query;

    // Build query
    const query = {};
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.isActive = status === 'active';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Build sort
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const [users, total, analytics] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
      User.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            activeCount: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    // Add user statistics
    const userStats = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();

        if (user.role === 'farmer') {
          const [productCount, orderCount] = await Promise.all([
            Product.countDocuments({ farmer: user._id }),
            Order.countDocuments({ 'items.farmer': user._id })
          ]);
          userObj.statistics = { productCount, orderCount };
        } else if (user.role === 'user') {
          const orderCount = await Order.countDocuments({ buyer: user._id });
          userObj.statistics = { orderCount };
        }

        return userObj;
      })
    );

    res.json({
      success: true,
      data: {
        users: userStats,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        },
        analytics: analytics.reduce((acc, item) => {
          acc[item._id] = {
            total: item.count,
            active: item.activeCount,
            inactive: item.count - item.activeCount
          };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get detailed user information
// @access  Private (Admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let additionalData = {};

    if (user.role === 'farmer') {
      const [products, jobs, orders] = await Promise.all([
        Product.find({ farmer: user._id }).populate('category', 'name').limit(5),
        Job.find({ farmer: user._id }).limit(5),
        Order.find({ 'items.farmer': user._id }).populate('buyer', 'name email').limit(5)
      ]);
      additionalData = { products, jobs, orders };
    } else if (user.role === 'user') {
      const orders = await Order.find({ buyer: user._id })
        .populate('items.product', 'name')
        .populate('items.farmer', 'name')
        .limit(5);
      additionalData = { orders };
    }

    res.json({
      success: true,
      data: {
        user: user.toObject(),
        ...additionalData
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user account
// @access  Private (Admin only)
router.post('/users', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['admin', 'farmer', 'user']).withMessage('Role must be admin, farmer, or user'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
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

    const { name, email, password, role, phone, farmName, farmLocation } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user object
    const userData = { name, email, password, role, phone };

    // Add farmer-specific fields
    if (role === 'farmer') {
      userData.farmName = farmName;
      userData.farmLocation = farmLocation;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user information
// @access  Private (Admin only)
router.put('/users/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('role').optional().isIn(['admin', 'farmer', 'user']).withMessage('Role must be admin, farmer, or user')
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

    const allowedUpdates = ['name', 'email', 'phone', 'role', 'isActive', 'farmName', 'farmLocation', 'address'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if email is being changed and if it already exists
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/bulk-action
// @desc    Perform bulk actions on users
// @access  Private (Admin only)
router.put('/users/bulk-action', async (req, res) => {
  try {
    const { userIds, action, value } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        message = 'Users activated successfully';
        break;
      case 'deactivate':
        updateData = { isActive: false };
        message = 'Users deactivated successfully';
        break;
      case 'delete':
        await User.deleteMany({ _id: { $in: userIds } });
        return res.json({
          success: true,
          message: 'Users deleted successfully'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updateData
    );

    res.json({
      success: true,
      message,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user account
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ==================== FARMER MANAGEMENT ====================

// @route   GET /api/admin/farmers
// @desc    Get all farmers with comprehensive statistics and analytics
// @access  Private (Admin only)
router.get('/farmers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, status, sortBy, sortOrder, location, experience } = req.query;

    // Build query
    const query = { role: 'farmer' };
    if (status && status !== 'all') query.isActive = status === 'active';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { farmName: { $regex: search, $options: 'i' } },
        { farmLocation: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) {
      query.farmLocation = { $regex: location, $options: 'i' };
    }
    if (experience) {
      query.farmingExperience = { $gte: parseInt(experience) };
    }

    // Build sort
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const farmers = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get comprehensive statistics for each farmer
    const farmersWithStats = await Promise.all(
      farmers.map(async (farmer) => {
        const [
          productCount,
          activeProductCount,
          jobCount,
          orderCount,
          totalRevenue,
          avgRating,
          recentProducts
        ] = await Promise.all([
          Product.countDocuments({ farmer: farmer._id }),
          Product.countDocuments({ farmer: farmer._id, 'availability.status': 'available' }),
          Job.countDocuments({ farmer: farmer._id }),
          Order.countDocuments({ 'items.farmer': farmer._id }),
          Order.aggregate([
            { $match: { 'items.farmer': farmer._id, orderStatus: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$orderSummary.total' } } }
          ]),
          Product.aggregate([
            { $match: { farmer: farmer._id } },
            { $group: { _id: null, avgRating: { $avg: '$ratings.average' } } }
          ]),
          Product.find({ farmer: farmer._id })
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(3)
            .select('name price images createdAt')
        ]);

        return {
          ...farmer.toObject(),
          statistics: {
            productCount,
            activeProductCount,
            inactiveProductCount: productCount - activeProductCount,
            jobCount,
            orderCount,
            totalRevenue: totalRevenue[0]?.total || 0,
            averageRating: avgRating[0]?.avgRating || 0,
            joinedDaysAgo: Math.floor((new Date() - farmer.createdAt) / (1000 * 60 * 60 * 24))
          },
          recentProducts
        };
      })
    );

    const total = await User.countDocuments(query);

    // Get farmer analytics
    const analytics = await User.aggregate([
      { $match: { role: 'farmer' } },
      {
        $group: {
          _id: null,
          totalFarmers: { $sum: 1 },
          activeFarmers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          avgExperience: { $avg: '$farmingExperience' },
          locationStats: { $push: '$farmLocation' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        farmers: farmersWithStats,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        },
        analytics: analytics[0] || {
          totalFarmers: 0,
          activeFarmers: 0,
          avgExperience: 0,
          locationStats: []
        }
      }
    });
  } catch (error) {
    console.error('Get farmers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/farmers/:id
// @desc    Get detailed farmer information with full analytics
// @access  Private (Admin only)
router.get('/farmers/:id', async (req, res) => {
  try {
    const farmer = await User.findOne({ _id: req.params.id, role: 'farmer' })
      .select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    const [
      products,
      jobs,
      orders,
      monthlyStats,
      topProducts,
      recentActivity
    ] = await Promise.all([
      Product.find({ farmer: farmer._id })
        .populate('category', 'name')
        .sort({ createdAt: -1 }),
      Job.find({ farmer: farmer._id })
        .sort({ createdAt: -1 }),
      Order.find({ 'items.farmer': farmer._id })
        .populate('buyer', 'name email')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 }),
      getMonthlyFarmerStats(farmer._id),
      Product.find({ farmer: farmer._id })
        .sort({ 'ratings.average': -1, 'ratings.count': -1 })
        .limit(5)
        .populate('category', 'name'),
      getRecentFarmerActivity(farmer._id)
    ]);

    res.json({
      success: true,
      data: {
        farmer: farmer.toObject(),
        products,
        jobs,
        orders,
        analytics: {
          monthlyStats,
          topProducts,
          recentActivity
        }
      }
    });
  } catch (error) {
    console.error('Get farmer details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/farmers/:id/verify
// @desc    Verify or unverify farmer account
// @access  Private (Admin only)
router.put('/farmers/:id/verify', async (req, res) => {
  try {
    const { isVerified, verificationNotes } = req.body;

    const farmer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'farmer' },
      {
        isVerified,
        verificationNotes,
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: isVerified ? req.user._id : null
      },
      { new: true }
    ).select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      message: `Farmer ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: { farmer }
    });
  } catch (error) {
    console.error('Verify farmer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get monthly farmer statistics
async function getMonthlyFarmerStats(farmerId) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return await Order.aggregate([
    {
      $match: {
        'items.farmer': farmerId,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$orderSummary.total' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
}

// Helper function to get recent farmer activity
async function getRecentFarmerActivity(farmerId) {
  const [recentProducts, recentJobs, recentOrders] = await Promise.all([
    Product.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt'),
    Job.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title createdAt'),
    Order.find({ 'items.farmer': farmerId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('orderNumber createdAt orderStatus')
  ]);

  return {
    recentProducts,
    recentJobs,
    recentOrders
  };
}

// ==================== CATEGORY MANAGEMENT ====================

// @route   GET /api/admin/categories
// @desc    Get all categories with comprehensive analytics
// @access  Private (Admin only)
router.get('/categories', async (req, res) => {
  try {
    const { search, status, parentCategory, sortBy, sortOrder } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    if (parentCategory && parentCategory !== 'all') {
      if (parentCategory === 'root') {
        query.parentCategory = { $exists: false };
      } else {
        query.parentCategory = parentCategory;
      }
    }

    // Build sort
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.sortOrder = 1;
      sort.name = 1;
    }

    const categories = await Category.find(query)
      .sort(sort)
      .populate('parentCategory', 'name');

    // Get product counts and analytics for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const [
          productCount,
          activeProductCount,
          subcategoryCount,
          avgProductPrice,
          topProducts
        ] = await Promise.all([
          Product.countDocuments({ category: category._id }),
          Product.countDocuments({
            category: category._id,
            'availability.status': 'available'
          }),
          Category.countDocuments({ parentCategory: category._id }),
          Product.aggregate([
            { $match: { category: category._id } },
            { $group: { _id: null, avgPrice: { $avg: '$price' } } }
          ]),
          Product.find({ category: category._id })
            .sort({ 'ratings.average': -1, 'ratings.count': -1 })
            .limit(3)
            .select('name price ratings')
            .populate('farmer', 'name')
        ]);

        return {
          ...category.toObject(),
          statistics: {
            productCount,
            activeProductCount,
            inactiveProductCount: productCount - activeProductCount,
            subcategoryCount,
            averageProductPrice: avgProductPrice[0]?.avgPrice || 0,
            popularityScore: productCount * 0.6 + activeProductCount * 0.4
          },
          topProducts
        };
      })
    );

    // Get category analytics
    const analytics = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $group: {
          _id: null,
          totalCategories: { $sum: 1 },
          activeCategories: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalProducts: { $sum: { $size: '$products' } },
          avgProductsPerCategory: { $avg: { $size: '$products' } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories: categoriesWithStats,
        analytics: analytics[0] || {
          totalCategories: 0,
          activeCategories: 0,
          totalProducts: 0,
          avgProductsPerCategory: 0
        }
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/categories/:id
// @desc    Get detailed category information
// @access  Private (Admin only)
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const [
      products,
      subcategories,
      monthlyStats,
      topFarmers
    ] = await Promise.all([
      Product.find({ category: category._id })
        .populate('farmer', 'name farmName')
        .sort({ createdAt: -1 }),
      Category.find({ parentCategory: category._id }),
      getMonthlyProductStats(category._id),
      Product.aggregate([
        { $match: { category: category._id } },
        {
          $group: {
            _id: '$farmer',
            productCount: { $sum: 1 },
            avgRating: { $avg: '$ratings.average' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'farmer'
          }
        },
        { $unwind: '$farmer' },
        { $sort: { productCount: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        category: category.toObject(),
        products,
        subcategories,
        analytics: {
          monthlyStats,
          topFarmers
        }
      }
    });
  } catch (error) {
    console.error('Get category details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get monthly product statistics for a category
async function getMonthlyProductStats(categoryId) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return await Product.aggregate([
    {
      $match: {
        category: categoryId,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        productCount: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
}

// @route   POST /api/admin/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/categories', [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Category name is required'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required')
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

    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/categories/:id', async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ==================== ARTICLE MANAGEMENT ====================

// @route   GET /api/admin/articles
// @desc    Get all articles with comprehensive analytics and filtering
// @access  Private (Admin only)
router.get('/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, category, search, author, sortBy, sortOrder, dateFrom, dateTo } = req.query;

    // Build query
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (author && author !== 'all') query.author = author;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Build sort
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const [articles, total, analytics] = await Promise.all([
      Article.find(query)
        .populate('author', 'name email role')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Article.countDocuments(query),
      Article.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            avgViews: { $avg: '$views' },
            avgLikes: { $avg: '$likes' }
          }
        }
      ])
    ]);

    // Add engagement statistics for each article
    const articlesWithStats = articles.map(article => {
      const articleObj = article.toObject();
      articleObj.statistics = {
        engagementRate: article.views > 0 ? (article.likes / article.views * 100).toFixed(2) : 0,
        daysOld: Math.floor((new Date() - article.createdAt) / (1000 * 60 * 60 * 24)),
        wordCount: article.content ? article.content.split(' ').length : 0,
        readingTime: article.content ? Math.ceil(article.content.split(' ').length / 200) : 0
      };
      return articleObj;
    });

    // Get category analytics
    const categoryStats = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgViews: { $avg: '$views' },
          totalLikes: { $sum: '$likes' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        articles: articlesWithStats,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        },
        analytics: {
          statusStats: analytics.reduce((acc, item) => {
            acc[item._id] = {
              count: item.count,
              avgViews: Math.round(item.avgViews || 0),
              avgLikes: Math.round(item.avgLikes || 0)
            };
            return acc;
          }, {}),
          categoryStats
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

// @route   GET /api/admin/articles/:id
// @desc    Get detailed article information with analytics
// @access  Private (Admin only)
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email role');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Get related articles
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      $or: [
        { category: article.category },
        { tags: { $in: article.tags } }
      ]
    })
    .limit(5)
    .select('title category createdAt views likes')
    .populate('author', 'name');

    // Get engagement analytics
    const engagementStats = {
      viewsToday: 0, // This would need view tracking implementation
      likesToday: 0,  // This would need like tracking implementation
      sharesTotal: article.shares || 0,
      commentsTotal: article.comments ? article.comments.length : 0,
      engagementRate: article.views > 0 ? (article.likes / article.views * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: {
        article: article.toObject(),
        relatedArticles,
        analytics: {
          engagement: engagementStats,
          performance: {
            wordCount: article.content ? article.content.split(' ').length : 0,
            readingTime: article.content ? Math.ceil(article.content.split(' ').length / 200) : 0,
            daysOld: Math.floor((new Date() - article.createdAt) / (1000 * 60 * 60 * 24))
          }
        }
      }
    });
  } catch (error) {
    console.error('Get article details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/articles
// @desc    Create new article with enhanced features
// @access  Private (Admin only)
router.post('/articles', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('category').isIn(['farming-tips', 'market-trends', 'technology', 'sustainability', 'news', 'guides', 'seasonal']).withMessage('Invalid category'),
  body('excerpt').optional().trim().isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('featuredImage').optional().isURL().withMessage('Featured image must be a valid URL'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status')
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

    // Generate excerpt if not provided
    let excerpt = req.body.excerpt;
    if (!excerpt && req.body.content) {
      excerpt = req.body.content.substring(0, 200) + '...';
    }

    // Generate slug from title
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const articleData = {
      ...req.body,
      excerpt,
      slug,
      author: req.user._id,
      publishedAt: req.body.status === 'published' ? new Date() : null
    };

    const article = new Article(articleData);
    await article.save();
    await article.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: { article }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Article with this title already exists'
      });
    }

    console.error('Create article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/articles/bulk-action
// @desc    Perform bulk actions on articles
// @access  Private (Admin only)
router.put('/articles/bulk-action', async (req, res) => {
  try {
    const { articleIds, action, value } = req.body;

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Article IDs array is required'
      });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'publish':
        updateData = {
          status: 'published',
          publishedAt: new Date()
        };
        message = 'Articles published successfully';
        break;
      case 'draft':
        updateData = {
          status: 'draft',
          publishedAt: null
        };
        message = 'Articles moved to draft successfully';
        break;
      case 'archive':
        updateData = {
          status: 'archived',
          archivedAt: new Date()
        };
        message = 'Articles archived successfully';
        break;
      case 'delete':
        await Article.deleteMany({ _id: { $in: articleIds } });
        return res.json({
          success: true,
          message: 'Articles deleted successfully'
        });
      case 'feature':
        updateData = { isFeatured: value === 'true' };
        message = `Articles ${value === 'true' ? 'featured' : 'unfeatured'} successfully`;
        break;
      case 'category':
        if (!value) {
          return res.status(400).json({
            success: false,
            message: 'Category value is required'
          });
        }
        updateData = { category: value };
        message = 'Articles category updated successfully';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const result = await Article.updateMany(
      { _id: { $in: articleIds } },
      updateData
    );

    res.json({
      success: true,
      message,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/articles/:id
// @desc    Update article
// @access  Private (Admin only)
router.put('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: { article }
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/articles/:id
// @desc    Delete article
// @access  Private (Admin only)
router.delete('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
