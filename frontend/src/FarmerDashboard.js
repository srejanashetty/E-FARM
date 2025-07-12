import React, { useState, useEffect } from 'react';

const FarmerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [data, setData] = useState({
    products: [],
    orders: [],
    payments: [],
    jobs: [],
    analytics: {}
  });

  // Mock API call function
  const fetchData = async (endpoint) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        products: [
          { 
            _id: '1', 
            name: 'Organic Tomatoes', 
            category: 'Vegetables', 
            price: 120, 
            stock: 50, 
            unit: 'kg',
            description: 'Fresh organic tomatoes grown without pesticides',
            image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400',
            status: 'active',
            createdAt: new Date('2024-01-15'),
            sales: 25,
            revenue: 3000
          },
          { 
            _id: '2', 
            name: 'Fresh Carrots', 
            category: 'Vegetables', 
            price: 80, 
            stock: 30, 
            unit: 'kg',
            description: 'Crisp and sweet carrots perfect for cooking',
            image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
            status: 'active',
            createdAt: new Date('2024-02-01'),
            sales: 18,
            revenue: 1440
          },
          { 
            _id: '3', 
            name: 'Wheat Flour', 
            category: 'Grains', 
            price: 45, 
            stock: 0, 
            unit: 'kg',
            description: 'Premium quality wheat flour',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
            status: 'out_of_stock',
            createdAt: new Date('2024-01-20'),
            sales: 40,
            revenue: 1800
          }
        ],
        orders: [
          {
            _id: '1',
            orderNumber: 'ORD-001',
            customer: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 9876543210' },
            items: [
              { productId: '1', productName: 'Organic Tomatoes', quantity: 5, price: 120, total: 600 }
            ],
            totalAmount: 600,
            status: 'pending',
            paymentStatus: 'pending',
            orderDate: new Date('2024-03-15'),
            deliveryAddress: 'Mumbai, Maharashtra',
            deliveryDate: new Date('2024-03-18')
          },
          {
            _id: '2',
            orderNumber: 'ORD-002',
            customer: { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543211' },
            items: [
              { productId: '2', productName: 'Fresh Carrots', quantity: 10, price: 80, total: 800 }
            ],
            totalAmount: 800,
            status: 'completed',
            paymentStatus: 'paid',
            orderDate: new Date('2024-03-10'),
            deliveryAddress: 'Delhi, India',
            deliveryDate: new Date('2024-03-12')
          }
        ],
        payments: [
          {
            _id: '1',
            orderId: 'ORD-002',
            amount: 800,
            method: 'UPI',
            status: 'completed',
            transactionId: 'TXN123456789',
            date: new Date('2024-03-12'),
            customer: 'Priya Sharma'
          },
          {
            _id: '2',
            orderId: 'ORD-001',
            amount: 600,
            method: 'Bank Transfer',
            status: 'pending',
            transactionId: 'TXN123456790',
            date: new Date('2024-03-15'),
            customer: 'Rajesh Kumar'
          }
        ],
        jobs: [
          {
            _id: '1',
            title: 'Farm Helper Needed',
            description: 'Looking for experienced farm helper for seasonal work',
            location: 'Punjab, India',
            salary: 15000,
            type: 'Part-time',
            duration: '3 months',
            requirements: 'Experience in farming, physical fitness',
            status: 'active',
            applicants: 5,
            postedDate: new Date('2024-03-01')
          }
        ]
      };
      
      setData(prev => ({ ...prev, [endpoint]: mockData[endpoint] || [] }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // Product management functions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (productId) => {
    const product = data.products.find(p => p._id === productId);
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setData(prev => ({
        ...prev,
        products: prev.products.filter(p => p._id !== productId)
      }));
      alert('Product deleted successfully!');
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setData(prev => ({
        ...prev,
        products: prev.products.map(p => 
          p._id === editingProduct._id ? { ...p, ...productData } : p
        )
      }));
      alert('Product updated successfully!');
    } else {
      const newProduct = {
        _id: Date.now().toString(),
        ...productData,
        createdAt: new Date(),
        sales: 0,
        revenue: 0,
        status: 'active'
      };
      setData(prev => ({
        ...prev,
        products: [...prev.products, newProduct]
      }));
      alert('Product added successfully!');
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Order management functions
  const handleViewOrder = (orderId) => {
    const order = data.orders.find(o => o._id === orderId);
    setViewingOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o =>
        o._id === orderId ? { ...o, status: newStatus } : o
      )
    }));
    alert(`Order status updated to ${newStatus}!`);
  };

  // Job management functions
  const handleAddJob = () => {
    setEditingJob(null);
    setShowJobModal(true);
  };

  const handleEditJob = (jobId) => {
    const job = data.jobs.find(j => j._id === jobId);
    setEditingJob(job);
    setShowJobModal(true);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setData(prev => ({
        ...prev,
        jobs: prev.jobs.filter(j => j._id !== jobId)
      }));
      alert('Job posting deleted successfully!');
    }
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      setData(prev => ({
        ...prev,
        jobs: prev.jobs.map(j =>
          j._id === editingJob._id ? { ...j, ...jobData } : j
        )
      }));
      alert('Job posting updated successfully!');
    } else {
      const newJob = {
        _id: Date.now().toString(),
        ...jobData,
        postedDate: new Date(),
        applicants: 0,
        status: 'active'
      };
      setData(prev => ({
        ...prev,
        jobs: [...prev.jobs, newJob]
      }));
      alert('Job posting created successfully!');
    }
    setShowJobModal(false);
    setEditingJob(null);
  };

  const renderProducts = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>📦 My Products</h2>
        <button
          onClick={handleAddProduct}
          style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          ➕ Add Product
        </button>
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Product</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Stock</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Sales</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Loading products...</td>
              </tr>
            ) : data.products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No products found. Add your first product!
                </td>
              </tr>
            ) : (
              data.products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{product.description?.substring(0, 30)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{product.category}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '500' }}>₹{product.price}/{product.unit}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      color: product.stock > 10 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ef4444',
                      fontWeight: '500'
                    }}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '500' }}>{product.sales}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>₹{product.revenue}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: product.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: product.status === 'active' ? '#065f46' : '#991b1b'
                    }}>
                      {product.status === 'active' ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>🛒 Customer Orders</h2>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Order</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</td>
              </tr>
            ) : data.orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              data.orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '500' }}>{order.orderNumber}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.items.length} items</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '500' }}>{order.customer.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.customer.phone}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '500' }}>₹{order.totalAmount}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: order.status === 'completed' ? '#d1fae5' : order.status === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: order.status === 'completed' ? '#065f46' : order.status === 'pending' ? '#92400e' : '#991b1b'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        👁️ View
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                          style={{ padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          ✅ Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );



  const renderPayments = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>💰 Payment History</h2>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Transaction</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Method</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading payments...</td>
              </tr>
            ) : data.payments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No payments found.
                </td>
              </tr>
            ) : (
              data.payments.map((payment) => (
                <tr key={payment._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '500' }}>{payment.transactionId}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Order: {payment.orderId}</div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{payment.customer}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '500' }}>₹{payment.amount}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{payment.method}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: payment.status === 'completed' ? '#d1fae5' : '#fef3c7',
                      color: payment.status === 'completed' ? '#065f46' : '#92400e'
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>💼 Job Posts</h2>
        <button
          onClick={handleAddJob}
          style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          ➕ Post Job
        </button>
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading jobs...</div>
        ) : data.jobs.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            No job posts found. Create your first job posting!
          </div>
        ) : (
          data.jobs.map((job) => (
            <div key={job._id} style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>{job.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>{job.description}</p>
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: job.status === 'active' ? '#d1fae5' : '#fee2e2',
                  color: job.status === 'active' ? '#065f46' : '#991b1b'
                }}>
                  {job.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                <div>
                  <strong>📍 Location:</strong> {job.location}
                </div>
                <div>
                  <strong>💰 Salary:</strong> ₹{job.salary}/month
                </div>
                <div>
                  <strong>⏰ Type:</strong> {job.type}
                </div>
                <div>
                  <strong>📅 Duration:</strong> {job.duration}
                </div>
                <div>
                  <strong>👥 Applicants:</strong> {job.applicants}
                </div>
                <div>
                  <strong>📅 Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Requirements:</strong> {job.requirements}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => alert(`View applicants for ${job.title} - ${job.applicants} applicants`)}
                  style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  👥 View Applicants ({job.applicants})
                </button>
                <button
                  onClick={() => handleEditJob(job._id)}
                  style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      fontFamily: 'Arial, sans-serif',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        padding: '20px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🌾</span>
            <h1 style={{ margin: '0', color: '#1f2937', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>E-FARM Farmer</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#1f2937', fontWeight: '500' }}>Welcome, {user?.name || 'Farmer'}!</span>
            <button 
              onClick={onLogout}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#dc2626', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <nav style={{ 
          width: '250px', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          minHeight: 'calc(100vh - 80px)', 
          padding: '20px', 
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {[
            { id: 'products', name: '📦 My Products', icon: '📦' },
            { id: 'orders', name: '🛒 Orders', icon: '🛒' },
            { id: 'payments', name: '💰 Payments', icon: '💰' },
            { id: 'jobs', name: '💼 Job Posts', icon: '💼' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                backgroundColor: activeTab === item.id ? 'rgba(22, 163, 74, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                color: activeTab === item.id ? 'white' : '#374151',
                border: activeTab === item.id ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(5px)',
                boxShadow: activeTab === item.id ? '0 2px 8px rgba(22, 163, 74, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main style={{ 
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            margin: '20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minHeight: 'calc(100vh - 120px)',
            overflow: 'hidden'
          }}>
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'jobs' && renderJobs()}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            padding: '30px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>
              {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const productData = {
                name: formData.get('name'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                unit: formData.get('unit'),
                description: formData.get('description'),
                image: formData.get('image') || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
              };
              handleSaveProduct(productData);
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct?.name || ''}
                    required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'Vegetables'}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Organic">Organic</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingProduct?.price || ''}
                    required
                    min="0"
                    step="0.01"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editingProduct?.stock || ''}
                    required
                    min="0"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Unit</label>
                  <select
                    name="unit"
                    defaultValue={editingProduct?.unit || 'kg'}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  >
                    <option value="kg">kg</option>
                    <option value="grams">grams</option>
                    <option value="pieces">pieces</option>
                    <option value="liters">liters</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description || ''}
                  rows="3"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Image URL</label>
                <input
                  type="url"
                  name="image"
                  defaultValue={editingProduct?.image || ''}
                  placeholder="https://example.com/image.jpg"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && viewingOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            padding: '30px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>🛒 Order Details</h2>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setViewingOrder(null);
                }}
                style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Order Information</h3>
                <p><strong>Order Number:</strong> {viewingOrder.orderNumber}</p>
                <p><strong>Order Date:</strong> {new Date(viewingOrder.orderDate).toLocaleDateString()}</p>
                <p><strong>Delivery Date:</strong> {new Date(viewingOrder.deliveryDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong>
                  <span style={{
                    marginLeft: '8px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: viewingOrder.status === 'completed' ? '#d1fae5' : '#fef3c7',
                    color: viewingOrder.status === 'completed' ? '#065f46' : '#92400e'
                  }}>
                    {viewingOrder.status}
                  </span>
                </p>
              </div>

              <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Customer Information</h3>
                <p><strong>Name:</strong> {viewingOrder.customer.name}</p>
                <p><strong>Email:</strong> {viewingOrder.customer.email}</p>
                <p><strong>Phone:</strong> {viewingOrder.customer.phone}</p>
                <p><strong>Address:</strong> {viewingOrder.deliveryAddress}</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>Order Items</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Product</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Quantity</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Price</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingOrder.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '8px', fontWeight: '500' }}>{item.productName}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.price}</td>
                      <td style={{ padding: '8px', textAlign: 'center', fontWeight: '500' }}>₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '15px', textAlign: 'right' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                  Total Amount: ₹{viewingOrder.totalAmount}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {viewingOrder.status === 'pending' && (
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(viewingOrder._id, 'completed');
                    setShowOrderModal(false);
                    setViewingOrder(null);
                  }}
                  style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  ✅ Mark as Completed
                </button>
              )}
              <button
                onClick={() => alert(`Print invoice for order ${viewingOrder.orderNumber}`)}
                style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                🖨️ Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Posting Modal */}
      {showJobModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            padding: '30px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>
              {editingJob ? '✏️ Edit Job Posting' : '➕ Post New Job'}
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const jobData = {
                title: formData.get('title'),
                description: formData.get('description'),
                location: formData.get('location'),
                salary: parseInt(formData.get('salary')),
                type: formData.get('type'),
                duration: formData.get('duration'),
                requirements: formData.get('requirements')
              };
              handleSaveJob(jobData);
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingJob?.title || ''}
                  required
                  placeholder="e.g., Farm Helper, Harvest Worker"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Job Description *</label>
                <textarea
                  name="description"
                  defaultValue={editingJob?.description || ''}
                  required
                  rows="3"
                  placeholder="Describe the job responsibilities and duties"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Location *</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={editingJob?.location || ''}
                    required
                    placeholder="e.g., Punjab, India"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Monthly Salary (₹) *</label>
                  <input
                    type="number"
                    name="salary"
                    defaultValue={editingJob?.salary || ''}
                    required
                    min="0"
                    placeholder="15000"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Job Type</label>
                  <select
                    name="type"
                    defaultValue={editingJob?.type || 'Full-time'}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    defaultValue={editingJob?.duration || ''}
                    placeholder="e.g., 3 months, 1 year"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Requirements</label>
                <textarea
                  name="requirements"
                  defaultValue={editingJob?.requirements || ''}
                  rows="3"
                  placeholder="List the required skills, experience, and qualifications"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowJobModal(false);
                    setEditingJob(null);
                  }}
                  style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {editingJob ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
