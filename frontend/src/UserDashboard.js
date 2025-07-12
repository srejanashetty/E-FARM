import React, { useState, useEffect } from 'react';

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [data, setData] = useState({
    products: [],
    orders: [],
    categories: [],
    wishlist: []
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
            originalPrice: 150,
            unit: 'kg',
            description: 'Fresh organic tomatoes grown without pesticides. Perfect for cooking and salads.',
            image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400',
            farmer: { name: 'John Farmer', location: 'Punjab, India' },
            rating: 4.5,
            reviews: 23,
            inStock: true,
            discount: 20
          },
          { 
            _id: '2', 
            name: 'Fresh Carrots', 
            category: 'Vegetables', 
            price: 80, 
            originalPrice: 100,
            unit: 'kg',
            description: 'Crisp and sweet carrots perfect for cooking and snacking.',
            image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
            farmer: { name: 'Sarah Wilson', location: 'Maharashtra, India' },
            rating: 4.3,
            reviews: 18,
            inStock: true,
            discount: 20
          },
          { 
            _id: '3', 
            name: 'Premium Wheat Flour', 
            category: 'Grains', 
            price: 45, 
            originalPrice: 50,
            unit: 'kg',
            description: 'Premium quality wheat flour, stone ground for better nutrition.',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
            farmer: { name: 'Mike Johnson', location: 'Haryana, India' },
            rating: 4.7,
            reviews: 45,
            inStock: true,
            discount: 10
          },
          { 
            _id: '4', 
            name: 'Fresh Spinach', 
            category: 'Vegetables', 
            price: 60, 
            originalPrice: 70,
            unit: 'kg',
            description: 'Fresh green spinach leaves, rich in iron and vitamins.',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
            farmer: { name: 'Priya Sharma', location: 'Gujarat, India' },
            rating: 4.2,
            reviews: 12,
            inStock: true,
            discount: 14
          },
          { 
            _id: '5', 
            name: 'Organic Apples', 
            category: 'Fruits', 
            price: 200, 
            originalPrice: 250,
            unit: 'kg',
            description: 'Sweet and crispy organic apples from hill stations.',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
            farmer: { name: 'Raj Kumar', location: 'Himachal Pradesh, India' },
            rating: 4.8,
            reviews: 67,
            inStock: true,
            discount: 20
          },
          {
            _id: '6',
            name: 'Fresh Milk',
            category: 'Dairy',
            price: 55,
            originalPrice: 60,
            unit: 'liter',
            description: 'Pure and fresh cow milk from local dairy farms.',
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
            farmer: { name: 'Dairy Farm Co-op', location: 'Punjab, India' },
            rating: 4.6,
            reviews: 89,
            inStock: true,
            discount: 8
          },
          {
            _id: '7',
            name: 'Durex Extra Safe Condoms',
            category: 'Health & Personal Care',
            price: 299,
            originalPrice: 399,
            unit: 'pack of 10',
            description: 'Durex Extra Safe condoms for enhanced protection during sexual activity. Premium latex with extra lubrication for comfort and safety. Electronically tested for reliability.',
            image: 'https://up.yimg.com/ib/th/id/OIP.6SOmRVIXqaaUXARk02TyAwHaDt?pid=Api&rs=1&c=1&qlt=95&w=241&h=120',
            farmer: { name: 'Durex Official Store', location: 'Delhi, India' },
            rating: 4.7,
            reviews: 2847,
            inStock: true,
            discount: 25
          }
        ],
        orders: [],
        categories: [
          { _id: '1', name: 'Vegetables', count: 3, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
          { _id: '2', name: 'Fruits', count: 1, image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300' },
          { _id: '3', name: 'Grains', count: 1, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300' },
          { _id: '4', name: 'Dairy', count: 1, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' },
          { _id: '5', name: 'Health & Personal Care', count: 1, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop&crop=center' }
        ]
      };
      
      // Only update with mock data if we don't have real data, except for orders which should preserve real orders
      setData(prev => {
        if (endpoint === 'orders') {
          // For orders, keep existing orders and don't override with mock data
          return prev;
        }
        return { ...prev, [endpoint]: mockData[endpoint] || [] };
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // Load initial data on component mount
  useEffect(() => {
    fetchData('products');
    fetchData('categories');
    // Don't fetch orders initially - start with empty orders list
  }, []);

  // Cart management functions
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        productName: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: quantity
      }]);
    }
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: quantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Product functions
  const handleViewProduct = (productId) => {
    const product = data.products.find(p => p._id === productId);
    setViewingProduct(product);
    setShowProductModal(true);
  };

  const handleViewOrder = (orderId) => {
    const order = data.orders.find(o => o._id === orderId);
    setViewingOrder(order);
    setShowOrderModal(true);
  };

  const handleTrackOrder = (orderId) => {
    const order = data.orders.find(o => o._id === orderId);
    setTrackingOrder(order);
    setShowTrackingModal(true);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCartModal(false);
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = (orderData) => {
    const newOrder = {
      _id: Date.now().toString(),
      orderNumber: `ORD-USER-${Date.now()}`,
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      totalAmount: getCartTotal(),
      status: orderData.paymentMethod === 'upi' ? 'confirmed' : 'pending',
      paymentStatus: orderData.paymentMethod === 'upi' ? 'paid' : 'pending',
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      deliveryAddress: `${orderData.address}, ${orderData.city}, ${orderData.pincode}`,
      customerInfo: orderData
    };

    // Add the new order to the orders list
    setData(prev => {
      const updatedData = {
        ...prev,
        orders: [newOrder, ...prev.orders]
      };
      console.log('Adding new order:', newOrder);
      console.log('Updated orders list:', updatedData.orders);
      return updatedData;
    });

    // Clear cart and close modal
    setCart([]);
    setShowCheckoutModal(false);

    // Show success message and switch to orders tab
    alert(`🎉 Order placed successfully!

Order Number: ${newOrder.orderNumber}
Total Amount: ₹${newOrder.totalAmount}
Payment Status: ${newOrder.paymentStatus.toUpperCase()}
Expected Delivery: ${newOrder.deliveryDate.toLocaleDateString()}

You can view your order in the "My Orders" section.`);

    // Automatically switch to orders tab to show the new order
    setActiveTab('orders');
  };

  const renderProducts = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>🛍️ Fresh Products</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
            <option value="">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="health">Health & Personal Care</option>
          </select>
          <select style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
            <option value="featured">Sort by Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {data.products.map((product) => (
            <div key={product._id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {product.discount}% OFF
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist functionality
                    alert('Added to wishlist!');
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ❤️
                </button>
              </div>

              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '18px' }}>{product.name}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px', lineHeight: '1.4' }}>
                  {product.description.substring(0, 80)}...
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {'⭐'.repeat(Math.floor(product.rating))}
                    <span style={{ marginLeft: '4px', fontSize: '14px', color: '#6b7280' }}>
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                    ₹{product.price}/{product.unit}
                  </span>
                  {product.originalPrice > product.price && (
                    <span style={{ fontSize: '16px', color: '#6b7280', textDecoration: 'line-through' }}>
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                  By {product.farmer.name} • {product.farmer.location}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProduct(product._id);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    👁️ View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>📁 Product Categories</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading categories...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {data.categories.map((category) => (
            <div key={category._id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => {
              setActiveTab('products');
              // Filter products by category
            }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{category.name}</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  {category.count} products available
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>📦 My Orders ({data.orders.length})</h2>
        <button
          onClick={() => {
            console.log('Current orders:', data.orders);
            fetchData('orders');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh Orders
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
      ) : data.orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here!</p>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            🛍️ Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.orders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Sort by newest first
            .map((order) => (
            <div key={order._id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Order {order.orderNumber}</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    {order.items.length} items • Total: ₹{order.totalAmount}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: order.status === 'delivered' ? '#d1fae5' :
                                    order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                    color: order.status === 'delivered' ? '#065f46' :
                           order.status === 'shipped' ? '#1e40af' : '#92400e'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} style={{
                    backgroundColor: '#f9fafb',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    {item.productName} x{item.quantity}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    +{order.items.length - 3} more
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleViewOrder(order._id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  👁️ View Details
                </button>
                {order.status === 'delivered' && (
                  <button
                    onClick={() => alert('Reorder functionality - Add items to cart')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🔄 Reorder
                  </button>
                )}
                <button
                  onClick={() => handleTrackOrder(order._id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  📍 Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>❤️ My Wishlist</h2>

      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love for later!</p>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          🛍️ Browse Products
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }

          @keyframes dash {
            to {
              stroke-dashoffset: -30;
            }
          }
        `}
      </style>

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
            <h1 style={{ margin: '0', color: '#1f2937', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>E-FARM Store</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setShowCartModal(true)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#16a34a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🛒 Cart
              {getCartItemCount() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCartItemCount()}
                </span>
              )}
            </button>
            <span style={{ color: '#1f2937', fontWeight: '500' }}>Welcome, {user?.name || 'User'}!</span>
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
            { id: 'products', name: '🛍️ Shop Products', icon: '🛍️' },
            { id: 'categories', name: '📁 Categories', icon: '📁' },
            { id: 'orders', name: `📦 My Orders ${data.orders.length > 0 ? `(${data.orders.length})` : ''}`, icon: '📦' },
            { id: 'wishlist', name: '❤️ Wishlist', icon: '❤️' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Don't refresh orders data to preserve real orders
                if (item.id === 'orders') {
                  console.log('Switching to orders tab, current orders:', data.orders);
                }
              }}
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
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'wishlist' && renderWishlist()}
          </div>
        </main>
      </div>

      {/* Product Details Modal */}
      {showProductModal && viewingProduct && (
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
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>🛍️ Product Details</h2>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setViewingProduct(null);
                }}
                style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {'⭐'.repeat(Math.floor(viewingProduct.rating))}
                    <span style={{ marginLeft: '8px', fontSize: '16px', color: '#6b7280' }}>
                      {viewingProduct.rating} ({viewingProduct.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Farmer:</strong> {viewingProduct.farmer.name}<br/>
                  <strong>Location:</strong> {viewingProduct.farmer.location}
                </div>
              </div>

              <div>
                <h1 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '28px' }}>{viewingProduct.name}</h1>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280', lineHeight: '1.6' }}>
                  {viewingProduct.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                    ₹{viewingProduct.price}/{viewingProduct.unit}
                  </span>
                  {viewingProduct.originalPrice > viewingProduct.price && (
                    <>
                      <span style={{ fontSize: '20px', color: '#6b7280', textDecoration: 'line-through' }}>
                        ₹{viewingProduct.originalPrice}
                      </span>
                      <span style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {viewingProduct.discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Quantity:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      id="product-quantity"
                      style={{ width: '80px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <span style={{ color: '#6b7280' }}>{viewingProduct.unit}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button
                    onClick={() => {
                      const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
                      addToCart(viewingProduct, quantity);
                      setShowProductModal(false);
                      setViewingProduct(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
                      addToCart(viewingProduct, quantity);
                      setShowProductModal(false);
                      setViewingProduct(null);
                      setShowCartModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    ⚡ Buy Now
                  </button>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>✅ Product Benefits</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280' }}>
                    <li>Fresh and organic</li>
                    <li>Direct from farmer</li>
                    <li>Quality guaranteed</li>
                    <li>Fast delivery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>🛒 Shopping Cart ({getCartItemCount()} items)</h2>
              <button
                onClick={() => setShowCartModal(false)}
                style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    setActiveTab('products');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  🛍️ Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  {cart.map((item) => (
                    <div key={item.productId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <img
                        src={item.image}
                        alt={item.productName}
                        style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', color: '#1f2937' }}>{item.productName}</h4>
                        <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>₹{item.price}/{item.unit}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: '500' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ minWidth: '80px', textAlign: 'right' }}>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>₹{item.price * item.quantity}</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937' }}>Total:</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>₹{getCartTotal()}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setShowCartModal(false)}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      🛍️ Continue Shopping
                    </button>
                    <button
                      onClick={handleCheckout}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      💳 Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
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
              <h2 style={{ margin: 0, color: '#1f2937' }}>💳 Checkout</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const orderData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                pincode: formData.get('pincode'),
                paymentMethod: formData.get('paymentMethod')
              };

              if (orderData.paymentMethod === 'upi') {
                // Generate UPI payment link
                const upiId = 'karthik9860rai@oksbi';
                const amount = getCartTotal();
                const note = `E-FARM Order Payment`;
                const upiLink = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

                // Open UPI app
                window.open(upiLink, '_blank');

                // Show payment confirmation
                setTimeout(() => {
                  if (window.confirm('Have you completed the payment? Click OK to confirm your order.')) {
                    handlePlaceOrder(orderData);
                  }
                }, 2000);
              } else {
                handlePlaceOrder(orderData);
              }
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Delivery Information */}
                <div>
                  <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>📍 Delivery Information</h3>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={user?.name || ''}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      defaultValue={user?.email || ''}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 9876543210"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Delivery Address *</label>
                    <textarea
                      name="address"
                      required
                      rows="3"
                      placeholder="House/Flat No., Street, Area"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Mumbai"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        placeholder="400001"
                        pattern="[0-9]{6}"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary & Payment */}
                <div>
                  <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>📋 Order Summary</h3>

                  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    {cart.map((item) => (
                      <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px' }}>{item.productName} x{item.quantity}</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                        <span>Total:</span>
                        <span style={{ color: '#16a34a' }}>₹{getCartTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>💳 Payment Method</h3>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '2px solid #16a34a', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', backgroundColor: '#f0fdf4' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        defaultChecked
                        style={{ marginRight: '8px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500', color: '#16a34a' }}>📱 UPI Payment (Recommended)</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Pay using PhonePe, Paytm, GPay, or any UPI app</div>
                        <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>UPI ID: karthik9860rai@gmail.com</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        style={{ marginRight: '8px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>💵 Cash on Delivery</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Pay when your order is delivered</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        style={{ marginRight: '8px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>💳 Credit/Debit Card</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Secure card payment</div>
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}
                  >
                    🛒 Place Order - ₹{getCartTotal()}
                  </button>
                </div>
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
              <h2 style={{ margin: 0, color: '#1f2937' }}>📦 Order Details</h2>
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
              <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>📋 Order Information</h3>
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
                    backgroundColor: viewingOrder.status === 'delivered' ? '#d1fae5' :
                                    viewingOrder.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                    color: viewingOrder.status === 'delivered' ? '#065f46' :
                           viewingOrder.status === 'shipped' ? '#1e40af' : '#92400e'
                  }}>
                    {viewingOrder.status.toUpperCase()}
                  </span>
                </p>
                <p><strong>Payment Status:</strong>
                  <span style={{
                    marginLeft: '8px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: viewingOrder.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                    color: viewingOrder.paymentStatus === 'paid' ? '#065f46' : '#92400e'
                  }}>
                    {viewingOrder.paymentStatus.toUpperCase()}
                  </span>
                </p>
              </div>

              <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>📍 Delivery Information</h3>
                <p><strong>Address:</strong> {viewingOrder.deliveryAddress}</p>
                <p><strong>Expected Delivery:</strong> {new Date(viewingOrder.deliveryDate).toLocaleDateString()}</p>
                {viewingOrder.status === 'shipped' && (
                  <div style={{ marginTop: '12px' }}>
                    <button
                      onClick={() => {
                        setShowOrderModal(false);
                        handleTrackOrder(viewingOrder._id);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      📍 Track Package
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>🛍️ Order Items</h3>
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

              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Total Amount: <span style={{ color: '#16a34a' }}>₹{viewingOrder.totalAmount}</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {viewingOrder.status === 'delivered' && (
                <button
                  onClick={() => {
                    // Add items to cart for reorder
                    viewingOrder.items.forEach(item => {
                      const product = data.products.find(p => p._id === item.productId);
                      if (product) {
                        addToCart(product, item.quantity);
                      } else {
                        // If product not found, create a basic product object for reorder
                        const basicProduct = {
                          _id: item.productId,
                          name: item.productName,
                          price: item.price,
                          unit: 'kg',
                          image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400'
                        };
                        addToCart(basicProduct, item.quantity);
                      }
                    });
                    setShowOrderModal(false);
                    setViewingOrder(null);
                    alert('Items added to cart! You can modify quantities and checkout.');
                    setShowCartModal(true);
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  🔄 Reorder Items
                </button>
              )}
              <button
                onClick={() => alert('Download invoice functionality')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📄 Download Invoice
              </button>
              {viewingOrder.paymentStatus === 'pending' && (
                <button
                  onClick={() => {
                    // Retry payment
                    const upiId = '7899412553@paytm';
                    const amount = viewingOrder.totalAmount;
                    const note = `E-FARM Order ${viewingOrder.orderNumber} Payment`;
                    const upiLink = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
                    window.open(upiLink, '_blank');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  💳 Complete Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showTrackingModal && trackingOrder && (
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
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>📍 Track Order: {trackingOrder.orderNumber}</h2>
              <button
                onClick={() => {
                  setShowTrackingModal(false);
                  setTrackingOrder(null);
                }}
                style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Order Status Timeline */}
              <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>📋 Order Status</h3>

                <div style={{ position: 'relative' }}>
                  {/* Timeline */}
                  <div style={{
                    position: 'absolute',
                    left: '15px',
                    top: '30px',
                    bottom: '30px',
                    width: '2px',
                    backgroundColor: '#e5e7eb'
                  }}></div>

                  {/* Timeline Steps */}
                  {[
                    { status: 'Order Placed', time: trackingOrder.orderDate.toLocaleString(), completed: true, icon: '📝' },
                    { status: 'Payment Confirmed', time: trackingOrder.paymentStatus === 'paid' ? 'Completed' : 'Pending', completed: trackingOrder.paymentStatus === 'paid', icon: '💳' },
                    { status: 'Order Processing', time: trackingOrder.status !== 'pending' ? 'Completed' : 'In Progress', completed: trackingOrder.status !== 'pending', icon: '⚙️' },
                    { status: 'Shipped', time: trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'Completed' : 'Pending', completed: trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered', icon: '🚚' },
                    { status: 'Out for Delivery', time: trackingOrder.status === 'delivered' ? 'Completed' : 'Pending', completed: trackingOrder.status === 'delivered', icon: '🏃‍♂️' },
                    { status: 'Delivered', time: trackingOrder.status === 'delivered' ? trackingOrder.deliveryDate.toLocaleString() : 'Pending', completed: trackingOrder.status === 'delivered', icon: '✅' }
                  ].map((step, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: step.completed ? '#16a34a' : '#e5e7eb',
                        color: step.completed ? 'white' : '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        zIndex: 1,
                        position: 'relative'
                      }}>
                        {step.icon}
                      </div>
                      <div style={{ marginLeft: '16px' }}>
                        <div style={{ fontWeight: '500', color: step.completed ? '#16a34a' : '#6b7280' }}>
                          {step.status}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {step.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>🚚 Delivery Information</h3>

                <div style={{ marginBottom: '16px' }}>
                  <strong>Delivery Address:</strong><br/>
                  {trackingOrder.deliveryAddress}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <strong>Expected Delivery:</strong><br/>
                  {trackingOrder.deliveryDate.toLocaleDateString()} at {trackingOrder.deliveryDate.toLocaleTimeString()}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <strong>Delivery Partner:</strong><br/>
                  E-FARM Express Delivery
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <strong>Tracking ID:</strong><br/>
                  EF{trackingOrder.orderNumber.replace('ORD-USER-', '')}
                </div>

                {trackingOrder.status === 'shipped' && (
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #3b82f6'
                  }}>
                    <div style={{ color: '#1e40af', fontWeight: '500', marginBottom: '4px' }}>
                      📦 Your order is on the way!
                    </div>
                    <div style={{ color: '#1e40af', fontSize: '14px' }}>
                      Estimated delivery: Today by 6:00 PM
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Demo Map */}
            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>🗺️ Live Tracking Map</h3>

              {/* Demo Map Container */}
              <div style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#e5e7eb',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: `linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
                                 linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
                                 linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
                                 linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}>
                {/* Map Roads */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  right: '0',
                  height: '4px',
                  backgroundColor: '#374151',
                  transform: 'translateY(-50%)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  bottom: '0',
                  left: '30%',
                  width: '4px',
                  backgroundColor: '#374151'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  bottom: '0',
                  left: '70%',
                  width: '4px',
                  backgroundColor: '#374151'
                }}></div>

                {/* Farmer Location */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '10%',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  🌾 Farm Origin
                </div>

                {/* Delivery Vehicle (Animated) */}
                <div style={{
                  position: 'absolute',
                  top: 'calc(50% - 15px)',
                  left: '45%',
                  fontSize: '24px',
                  animation: 'bounce 2s infinite',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>
                  🚚
                </div>

                {/* Delivery Destination */}
                <div style={{
                  position: 'absolute',
                  top: '70%',
                  right: '10%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  🏠 Your Location
                </div>

                {/* Route Line */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}>
                  <path
                    d="M 10% 20% Q 30% 50% 45% 50% Q 70% 50% 90% 70%"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    style={{
                      animation: 'dash 3s linear infinite'
                    }}
                  />
                </svg>

                {/* Map Legend */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '10px'
                }}>
                  <div>🌾 Farm → 🚚 In Transit → 🏠 Destination</div>
                </div>
              </div>

              {/* Live Updates */}
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>📱 Live Updates</h4>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <div style={{ marginBottom: '4px' }}>• 2:30 PM - Package picked up from farm</div>
                  <div style={{ marginBottom: '4px' }}>• 3:15 PM - In transit to sorting facility</div>
                  <div style={{ marginBottom: '4px' }}>• 4:00 PM - Out for delivery</div>
                  <div style={{ color: '#16a34a', fontWeight: '500' }}>• 4:45 PM - Delivery vehicle is 2 km away</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => alert('SMS notifications enabled for this order')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📱 Get SMS Updates
              </button>
              <button
                onClick={() => alert('Calling delivery partner: +91 98765 43210')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📞 Call Delivery Partner
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default UserDashboard;
