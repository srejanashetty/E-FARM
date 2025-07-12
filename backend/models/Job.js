import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer is required']
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'seasonal', 'contract', 'temporary']
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    enum: ['harvesting', 'planting', 'maintenance', 'equipment-operation', 'livestock', 'general-labor', 'management', 'technical']
  },
  location: {
    address: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  salary: {
    type: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'fixed'],
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Salary amount is required'],
      min: [0, 'Salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  workSchedule: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: Date,
    hoursPerDay: Number,
    daysPerWeek: Number,
    flexibleSchedule: {
      type: Boolean,
      default: false
    }
  },
  requirements: {
    experience: {
      type: String,
      enum: ['none', 'entry-level', '1-3-years', '3-5-years', '5+-years'],
      default: 'none'
    },
    skills: [String],
    education: {
      type: String,
      enum: ['none', 'high-school', 'associate', 'bachelor', 'master', 'phd'],
      default: 'none'
    },
    certifications: [String],
    physicalRequirements: [String],
    equipmentProvided: {
      type: Boolean,
      default: true
    }
  },
  benefits: {
    healthInsurance: { type: Boolean, default: false },
    paidTimeOff: { type: Boolean, default: false },
    housing: { type: Boolean, default: false },
    meals: { type: Boolean, default: false },
    transportation: { type: Boolean, default: false },
    other: [String]
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  maxApplicants: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'filled', 'expired', 'cancelled'],
    default: 'active'
  },
  applications: [{
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'hired', 'rejected'],
      default: 'pending'
    },
    coverLetter: String,
    resume: String,
    notes: String
  }],
  views: {
    type: Number,
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  contactInfo: {
    email: String,
    phone: String,
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'both'],
      default: 'email'
    }
  }
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ farmer: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ 'location.city': 1 });
jobSchema.index({ 'location.state': 1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ isUrgent: -1 });

// Text search index
jobSchema.index({
  title: 'text',
  description: 'text',
  'requirements.skills': 'text'
});

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Virtual for days remaining
jobSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Method to check if job is expired
jobSchema.methods.isExpired = function() {
  return new Date() > this.applicationDeadline;
};

// Method to add application
jobSchema.methods.addApplication = function(applicantId, coverLetter, resume) {
  // Check if user already applied
  const existingApplication = this.applications.find(
    app => app.applicant.toString() === applicantId.toString()
  );
  
  if (existingApplication) {
    throw new Error('You have already applied for this job');
  }
  
  // Check if job is still accepting applications
  if (this.isExpired() || this.status !== 'active') {
    throw new Error('This job is no longer accepting applications');
  }
  
  // Check max applicants limit
  if (this.maxApplicants && this.applications.length >= this.maxApplicants) {
    throw new Error('Maximum number of applications reached');
  }
  
  this.applications.push({
    applicant: applicantId,
    coverLetter,
    resume
  });
  
  return this.save();
};

// Method to update application status
jobSchema.methods.updateApplicationStatus = function(applicantId, status, notes) {
  const application = this.applications.find(
    app => app.applicant.toString() === applicantId.toString()
  );
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  application.status = status;
  if (notes) application.notes = notes;
  
  return this.save();
};

// Method to increment views
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static method to get active jobs
jobSchema.statics.getActiveJobs = function(filters = {}) {
  const query = { 
    status: 'active',
    applicationDeadline: { $gt: new Date() }
  };
  
  if (filters.jobType) query.jobType = filters.jobType;
  if (filters.category) query.category = filters.category;
  if (filters.location) {
    query.$or = [
      { 'location.city': new RegExp(filters.location, 'i') },
      { 'location.state': new RegExp(filters.location, 'i') }
    ];
  }
  
  return this.find(query)
    .populate('farmer', 'name farmName farmLocation profileImage')
    .sort({ isUrgent: -1, createdAt: -1 });
};

export default mongoose.model('Job', jobSchema);
