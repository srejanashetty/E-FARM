import express from 'express';
import { body, validationResult } from 'express-validator';
import Job from '../models/Job.js';
import { authenticate, isFarmer, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all active jobs with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { jobType, category, location, search } = req.query;

    const filters = {};
    if (jobType) filters.jobType = jobType;
    if (category) filters.category = category;
    if (location) filters.location = location;

    let query = Job.getActiveJobs(filters);

    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    const [jobs, total] = await Promise.all([
      query.skip(skip).limit(limit),
      Job.countDocuments({
        status: 'active',
        applicationDeadline: { $gt: new Date() },
        ...filters
      })
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
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('farmer', 'name farmName farmLocation profileImage phone email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    await job.incrementViews();

    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/:id/apply', authenticate, [
  body('coverLetter').optional().trim().isLength({ max: 1000 }).withMessage('Cover letter cannot exceed 1000 characters')
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

    const { coverLetter, resume } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    try {
      await job.addApplication(req.user._id, coverLetter, resume);
      
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/jobs/farmer/:farmerId
// @desc    Get jobs posted by a farmer
// @access  Public
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { farmer: req.params.farmerId };
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

// @route   GET /api/jobs/urgent/list
// @desc    Get urgent jobs
// @access  Public
router.get('/urgent/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const jobs = await Job.find({
      status: 'active',
      isUrgent: true,
      applicationDeadline: { $gt: new Date() }
    })
      .populate('farmer', 'name farmName farmLocation profileImage')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { jobs }
    });
  } catch (error) {
    console.error('Get urgent jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
