import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required']
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    total: {
      type: Number,
      required: true
    }
  }],
  orderSummary: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    }
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  billingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
    sameAsShipping: { type: Boolean, default: true }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'pickup'],
      default: 'standard'
    },
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippedAt: Date
  },
  specialInstructions: String,
  notes: [{
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false }
  }],
  cancellation: {
    reason: String,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['not_applicable', 'pending', 'processed', 'failed']
    }
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ buyer: 1 });
orderSchema.index({ 'items.farmer': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `EF${Date.now()}${String(count + 1).padStart(4, '0')}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.orderStatus,
      note: 'Order created'
    });
  }
  next();
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy
  });
  
  // Update specific timestamps based on status
  switch (newStatus) {
    case 'shipped':
      this.shipping.shippedAt = new Date();
      break;
    case 'delivered':
      this.shipping.actualDelivery = new Date();
      break;
    case 'cancelled':
      this.cancellation.cancelledAt = new Date();
      this.cancellation.cancelledBy = updatedBy;
      break;
  }
  
  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function(status, transactionId) {
  this.paymentInfo.status = status;
  if (transactionId) this.paymentInfo.transactionId = transactionId;
  
  if (status === 'completed') {
    this.paymentInfo.paidAt = new Date();
  } else if (status === 'refunded') {
    this.paymentInfo.refundedAt = new Date();
  }
  
  return this.save();
};

// Method to add note
orderSchema.methods.addNote = function(content, author, isInternal = false) {
  this.notes.push({
    content,
    author,
    isInternal
  });
  return this.save();
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  const subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.orderSummary.subtotal = subtotal;
  this.orderSummary.total = subtotal + this.orderSummary.shippingCost + this.orderSummary.tax - this.orderSummary.discount;
  return this;
};

// Static method to get orders by farmer
orderSchema.statics.getOrdersByFarmer = function(farmerId, status = null) {
  const query = { 'items.farmer': farmerId };
  if (status) query.orderStatus = status;
  
  return this.find(query)
    .populate('buyer', 'name email phone')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });
};

// Static method to get sales analytics
orderSchema.statics.getSalesAnalytics = function(farmerId, startDate, endDate) {
  const matchStage = {
    'items.farmer': new mongoose.Types.ObjectId(farmerId),
    orderStatus: { $in: ['delivered', 'completed'] },
    createdAt: { $gte: startDate, $lte: endDate }
  };
  
  return this.aggregate([
    { $match: matchStage },
    { $unwind: '$items' },
    { $match: { 'items.farmer': new mongoose.Types.ObjectId(farmerId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$items.total' },
        averageOrderValue: { $avg: '$items.total' },
        totalQuantitySold: { $sum: '$items.quantity' }
      }
    }
  ]);
};

export default mongoose.model('Order', orderSchema);
