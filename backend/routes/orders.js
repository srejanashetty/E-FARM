import express from 'express';
import Order from '../models/Order.js';
import { authenticate, isAdmin, isFarmerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/orders
// @desc    Get orders (admin sees all, farmers see their orders)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    let query = {};
    
    // If farmer, only show orders containing their products
    if (req.user.role === 'farmer') {
      query['items.farmer'] = req.user._id;
    }
    
    if (status) query.orderStatus = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('buyer', 'name email phone')
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
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // If not admin, restrict access
    if (req.user.role === 'farmer') {
      query['items.farmer'] = req.user._id;
    } else if (req.user.role === 'user') {
      query.buyer = req.user._id;
    }

    const order = await Order.findOne(query)
      .populate('buyer', 'name email phone address')
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
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin or Farmer)
router.put('/:id/status', isFarmerOrAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;

    let query = { _id: req.params.id };
    
    // If farmer, only allow updating orders with their products
    if (req.user.role === 'farmer') {
      query['items.farmer'] = req.user._id;
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status, note, req.user._id);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
