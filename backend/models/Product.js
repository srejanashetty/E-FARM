import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'lb', 'piece', 'dozen', 'liter', 'gallon', 'bunch', 'bag']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order quantity must be at least 1']
  },
  images: [{
    url: String,
    alt: String
  }],
  specifications: {
    organic: { type: Boolean, default: false },
    freshness: {
      type: String,
      enum: ['fresh', 'frozen', 'dried'],
      default: 'fresh'
    },
    harvestDate: Date,
    expiryDate: Date,
    origin: String,
    certifications: [String]
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'out_of_stock', 'discontinued'],
      default: 'available'
    },
    seasonalAvailability: {
      startMonth: { type: Number, min: 1, max: 12 },
      endMonth: { type: Number, min: 1, max: 12 }
    }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingCost: { type: Number, default: 0 },
    freeShippingThreshold: Number
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ farmer: 1 });
productSchema.index({ category: 1 });
productSchema.index({ 'availability.status': 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: -1 });

// Text search index
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual for calculating discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.discount.percentage > 0) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Method to update stock after purchase
productSchema.methods.updateStock = function(quantity) {
  this.stock -= quantity;
  this.totalSold += quantity;
  return this.save();
};

// Method to add review
productSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({
    user: userId,
    rating,
    comment
  });
  
  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.ratings.average = totalRating / this.reviews.length;
  this.ratings.count = this.reviews.length;
  
  return this.save();
};

// Method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('Product', productSchema);
