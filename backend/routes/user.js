import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Job from '../models/Job.js';
import { authenticate, isUser } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalOrders,
      pendingOrders,
      recentOrders,
      favoriteProducts
    ] = await Promise.all([
      Order.countDocuments({ buyer: userId }),
      Order.countDocuments({ buyer: userId, orderStatus: { $in: ['pending', 'confirmed', 'processing'] } }),
      Order.find({ buyer: userId })
        .populate('items.product', 'name images')
        .populate('items.farmer', 'name farmName')
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find({ 'reviews.user': userId })
        .populate('category', 'name')
        .populate('farmer', 'name farmName')
        .limit(5)
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalOrders,
          pendingOrders,
          completedOrders: totalOrders - pendingOrders
        },
        recentOrders,
        favoriteProducts
      }
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/orders
// @desc    Get user's orders
// @access  Private
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const query = { buyer: req.user._id };
    if (status) query.orderStatus = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.product', 'name images')
        .populate('items.farmer', 'name farmName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/orders/:id
// @desc    Get single order details
// @access  Private
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id
    })
      .populate('items.product', 'name images')
      .populate('items.farmer', 'name farmName farmLocation phone email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/user/orders
// @desc    Create new order
// @access  Private
router.post('/orders', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    // Validate and calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        farmer: product.farmer,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product stock
      await product.updateStock(item.quantity);
    }

    // Calculate totals (simplified - you can add tax, shipping logic)
    const shippingCost = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    const orderData = {
      buyer: req.user._id,
      items: orderItems,
      orderSummary: {
        subtotal,
        shippingCost,
        tax,
        total
      },
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: 'pending'
      },
      specialInstructions
    };

    const order = new Order(orderData);
    await order.save();
    await order.populate('items.product', 'name images');
    await order.populate('items.farmer', 'name farmName');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/orders/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.totalSold -= item.quantity;
        await product.save();
      }
    }

    order.cancellation.reason = reason;
    await order.updateStatus('cancelled', 'Order cancelled by customer', req.user._id);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/job-applications
// @desc    Get user's job applications
// @access  Private
router.get('/job-applications', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({
      'applications.applicant': req.user._id
    })
      .populate('farmer', 'name farmName farmLocation')
      .sort({ 'applications.appliedAt': -1 })
      .skip(skip)
      .limit(limit);

    // Extract application details
    const applications = jobs.map(job => {
      const application = job.applications.find(
        app => app.applicant.toString() === req.user._id.toString()
      );
      
      return {
        job: {
          _id: job._id,
          title: job.title,
          jobType: job.jobType,
          location: job.location,
          salary: job.salary,
          farmer: job.farmer
        },
        application: {
          status: application.status,
          appliedAt: application.appliedAt,
          coverLetter: application.coverLetter,
          notes: application.notes
        }
      };
    });

    const total = await Job.countDocuments({
      'applications.applicant': req.user._id
    });

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
