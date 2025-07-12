import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [showFarmerDetailsModal, setShowFarmerDetailsModal] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [viewingFarmer, setViewingFarmer] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCategoryDetailsModal, setShowCategoryDetailsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showArticleDetailsModal, setShowArticleDetailsModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [viewingArticle, setViewingArticle] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [data, setData] = useState({
    users: [],
    farmers: [],
    categories: [],
    articles: [],
    analytics: {}
  });

  // Mock API call function
  const fetchData = async (endpoint) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on endpoint
      const mockData = {
        users: [
          { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', isActive: true, createdAt: new Date('2024-01-15'), phone: '+1234567890' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'farmer', isActive: true, createdAt: new Date('2024-02-10'), phone: '+1234567891' },
          { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', isActive: false, createdAt: new Date('2024-03-05'), phone: '+1234567892' },
          { _id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'farmer', isActive: true, createdAt: new Date('2024-03-20'), phone: '+1234567893' },
          { _id: '5', name: 'Admin User', email: 'admin@efarm.com', role: 'admin', isActive: true, createdAt: new Date('2024-01-01'), phone: '+1234567894' }
        ],
        farmers: [
          {
            _id: '1',
            name: 'John Farmer',
            email: 'john.farmer@example.com',
            farmName: 'Green Valley Farm',
            farmLocation: 'California, USA',
            phone: '+1234567890',
            isVerified: true,
            isActive: true,
            createdAt: new Date('2024-01-15'),
            farmingExperience: 10,
            farmSize: '50 acres',
            specialization: 'Organic Vegetables',
            statistics: { productCount: 15, orderCount: 45, totalRevenue: 1050000, averageRating: 4.5 }
          },
          {
            _id: '2',
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            farmName: 'Sunshine Orchards',
            farmLocation: 'Florida, USA',
            phone: '+1234567891',
            isVerified: false,
            isActive: true,
            createdAt: new Date('2024-02-20'),
            farmingExperience: 5,
            farmSize: '25 acres',
            specialization: 'Citrus Fruits',
            statistics: { productCount: 8, orderCount: 23, totalRevenue: 690000, averageRating: 4.2 }
          },
          {
            _id: '3',
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            farmName: 'Prairie Grains Co.',
            farmLocation: 'Iowa, USA',
            phone: '+1234567892',
            isVerified: true,
            isActive: false,
            createdAt: new Date('2024-03-10'),
            farmingExperience: 15,
            farmSize: '200 acres',
            specialization: 'Grains & Cereals',
            statistics: { productCount: 12, orderCount: 67, totalRevenue: 2100000, averageRating: 4.8 }
          }
        ],
        categories: [
          {
            _id: '1',
            name: 'Vegetables',
            description: 'Fresh organic and conventional vegetables',
            parentCategory: null,
            isActive: true,
            createdAt: new Date('2024-01-10'),
            image: 'https://example.com/vegetables.jpg',
            statistics: {
              productCount: 25,
              activeProductCount: 20,
              totalSales: 1260000,
              averagePrice: 1050,
              topFarmers: ['John Farmer', 'Sarah Wilson']
            }
          },
          {
            _id: '2',
            name: 'Fruits',
            description: 'Fresh seasonal fruits and citrus',
            parentCategory: null,
            isActive: true,
            createdAt: new Date('2024-01-15'),
            image: 'https://example.com/fruits.jpg',
            statistics: {
              productCount: 18,
              activeProductCount: 16,
              totalSales: 1008000,
              averagePrice: 735,
              topFarmers: ['Sarah Wilson', 'Mike Johnson']
            }
          },
          {
            _id: '3',
            name: 'Grains',
            description: 'Wheat, rice, corn and other grains',
            parentCategory: null,
            isActive: true,
            createdAt: new Date('2024-02-01'),
            image: 'https://example.com/grains.jpg',
            statistics: {
              productCount: 12,
              activeProductCount: 10,
              totalSales: 2100000,
              averagePrice: 3780,
              topFarmers: ['Mike Johnson']
            }
          },
          {
            _id: '4',
            name: 'Organic Vegetables',
            description: 'Certified organic vegetables',
            parentCategory: '1',
            isActive: true,
            createdAt: new Date('2024-02-10'),
            image: 'https://example.com/organic-vegetables.jpg',
            statistics: {
              productCount: 8,
              activeProductCount: 7,
              totalSales: 714000,
              averagePrice: 1512,
              topFarmers: ['John Farmer']
            }
          },
          {
            _id: '5',
            name: 'Dairy Products',
            description: 'Fresh milk, cheese, and dairy products',
            parentCategory: null,
            isActive: false,
            createdAt: new Date('2024-03-01'),
            image: 'https://example.com/dairy.jpg',
            statistics: {
              productCount: 5,
              activeProductCount: 0,
              totalSales: 168000,
              averagePrice: 546,
              topFarmers: []
            }
          }
        ],
        articles: [
          {
            _id: '1',
            title: 'Modern Farming Techniques for Better Yield',
            excerpt: 'Discover the latest farming techniques that can help increase your crop yield and improve soil health.',
            content: 'Modern farming has evolved significantly with the introduction of new technologies and sustainable practices. This comprehensive guide covers various techniques including precision agriculture, crop rotation, and integrated pest management. These methods not only increase productivity but also ensure environmental sustainability.',
            category: 'farming-tips',
            status: 'published',
            author: { _id: '1', name: 'John Admin', email: 'admin@efarm.com' },
            createdAt: new Date('2024-01-15'),
            publishedAt: new Date('2024-01-15'),
            tags: ['farming', 'techniques', 'yield', 'sustainability'],
            featuredImage: 'https://example.com/farming-techniques.jpg',
            views: 1250,
            likes: 89,
            isFeatured: true,
            readingTime: 8
          },
          {
            _id: '2',
            title: 'Organic Vegetable Farming: A Complete Guide',
            excerpt: 'Learn how to grow organic vegetables without harmful chemicals while maintaining high quality and yield.',
            content: 'Organic farming is becoming increasingly popular as consumers demand healthier food options. This guide provides step-by-step instructions for setting up an organic vegetable farm, including soil preparation, seed selection, natural pest control, and harvesting techniques.',
            category: 'sustainability',
            status: 'published',
            author: { _id: '2', name: 'Sarah Green', email: 'sarah@efarm.com' },
            createdAt: new Date('2024-02-01'),
            publishedAt: new Date('2024-02-01'),
            tags: ['organic', 'vegetables', 'sustainable', 'health'],
            featuredImage: 'https://example.com/organic-farming.jpg',
            views: 890,
            likes: 67,
            isFeatured: false,
            readingTime: 12
          },
          {
            _id: '3',
            title: 'Smart Irrigation Systems for Water Conservation',
            excerpt: 'Explore modern irrigation technologies that help conserve water while ensuring optimal crop growth.',
            content: 'Water scarcity is a growing concern in agriculture. Smart irrigation systems use sensors, weather data, and automation to deliver the right amount of water at the right time. This article explores different types of smart irrigation systems and their benefits.',
            category: 'technology',
            status: 'draft',
            author: { _id: '3', name: 'Mike Tech', email: 'mike@efarm.com' },
            createdAt: new Date('2024-02-15'),
            publishedAt: null,
            tags: ['irrigation', 'technology', 'water', 'conservation'],
            featuredImage: 'https://example.com/irrigation.jpg',
            views: 0,
            likes: 0,
            isFeatured: false,
            readingTime: 6
          },
          {
            _id: '4',
            title: 'Market Trends in Agricultural Products 2024',
            excerpt: 'Stay updated with the latest market trends and pricing information for various agricultural products.',
            content: 'Understanding market trends is crucial for farmers to make informed decisions about what to grow and when to sell. This comprehensive analysis covers price trends, demand patterns, and market forecasts for major agricultural commodities.',
            category: 'market-trends',
            status: 'published',
            author: { _id: '1', name: 'John Admin', email: 'admin@efarm.com' },
            createdAt: new Date('2024-03-01'),
            publishedAt: new Date('2024-03-01'),
            tags: ['market', 'trends', 'pricing', 'analysis'],
            featuredImage: 'https://example.com/market-trends.jpg',
            views: 2100,
            likes: 156,
            isFeatured: true,
            readingTime: 15
          },
          {
            _id: '5',
            title: 'Seasonal Crop Planning and Management',
            excerpt: 'Plan your crops according to seasons for maximum productivity and profit.',
            content: 'Seasonal planning is essential for successful farming. This guide helps farmers understand which crops to plant in different seasons, how to prepare the soil, and manage resources effectively throughout the year.',
            category: 'seasonal',
            status: 'archived',
            author: { _id: '2', name: 'Sarah Green', email: 'sarah@efarm.com' },
            createdAt: new Date('2023-12-01'),
            publishedAt: new Date('2023-12-01'),
            archivedAt: new Date('2024-03-15'),
            tags: ['seasonal', 'planning', 'crops', 'management'],
            featuredImage: 'https://example.com/seasonal-planning.jpg',
            views: 750,
            likes: 45,
            isFeatured: false,
            readingTime: 10
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

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleEditUser = (userId) => {
    const userToEdit = data.users.find(u => u._id === userId);
    setEditingUser(userToEdit);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Remove user from the data
      setData(prev => ({
        ...prev,
        users: prev.users.filter(u => u._id !== userId)
      }));
      alert('User deleted successfully!');
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} selected users?`)) {
      switch (action) {
        case 'delete':
          setData(prev => ({
            ...prev,
            users: prev.users.filter(u => !selectedUsers.includes(u._id))
          }));
          setSelectedUsers([]);
          alert(`${selectedUsers.length} users deleted successfully!`);
          break;
        case 'activate':
          setData(prev => ({
            ...prev,
            users: prev.users.map(u =>
              selectedUsers.includes(u._id) ? { ...u, isActive: true } : u
            )
          }));
          setSelectedUsers([]);
          alert(`${selectedUsers.length} users activated successfully!`);
          break;
        case 'deactivate':
          setData(prev => ({
            ...prev,
            users: prev.users.map(u =>
              selectedUsers.includes(u._id) ? { ...u, isActive: false } : u
            )
          }));
          setSelectedUsers([]);
          alert(`${selectedUsers.length} users deactivated successfully!`);
          break;
        default:
          alert(`Bulk ${action} completed for ${selectedUsers.length} users`);
      }
    }
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Update existing user
      setData(prev => ({
        ...prev,
        users: prev.users.map(u =>
          u._id === editingUser._id ? { ...u, ...userData } : u
        )
      }));
      alert('User updated successfully!');
    } else {
      // Add new user
      const newUser = {
        _id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
        isActive: true
      };
      setData(prev => ({
        ...prev,
        users: [...prev.users, newUser]
      }));
      alert('User created successfully!');
    }
    setShowAddUserModal(false);
    setEditingUser(null);
  };

  const handleUserSelection = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Farmer management functions
  const handleVerifyFarmer = (farmerId) => {
    const farmer = data.farmers.find(f => f._id === farmerId);
    const newVerificationStatus = !farmer.isVerified;

    if (window.confirm(`Are you sure you want to ${newVerificationStatus ? 'verify' : 'unverify'} this farmer?`)) {
      setData(prev => ({
        ...prev,
        farmers: prev.farmers.map(f =>
          f._id === farmerId ? { ...f, isVerified: newVerificationStatus } : f
        )
      }));
      alert(`Farmer ${newVerificationStatus ? 'verified' : 'unverified'} successfully!`);
    }
  };

  const handleViewFarmer = (farmerId) => {
    const farmer = data.farmers.find(f => f._id === farmerId);
    setViewingFarmer(farmer);
    setShowFarmerDetailsModal(true);
  };

  const handleEditFarmer = (farmerId) => {
    const farmer = data.farmers.find(f => f._id === farmerId);
    setEditingFarmer(farmer);
    setShowFarmerModal(true);
  };

  const handleSaveFarmer = (farmerData) => {
    if (editingFarmer) {
      // Update existing farmer
      setData(prev => ({
        ...prev,
        farmers: prev.farmers.map(f =>
          f._id === editingFarmer._id ? { ...f, ...farmerData } : f
        )
      }));
      alert('Farmer updated successfully!');
    }
    setShowFarmerModal(false);
    setEditingFarmer(null);
  };

  // Category management functions
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleViewCategory = (categoryId) => {
    const category = data.categories.find(c => c._id === categoryId);
    setViewingCategory(category);
    setShowCategoryDetailsModal(true);
  };

  const handleEditCategory = (categoryId) => {
    const category = data.categories.find(c => c._id === categoryId);
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    const category = data.categories.find(c => c._id === categoryId);

    // Check if category has subcategories
    const hasSubcategories = data.categories.some(c => c.parentCategory === categoryId);
    if (hasSubcategories) {
      alert('Cannot delete category that has subcategories. Please delete or move subcategories first.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      setData(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c._id !== categoryId)
      }));
      alert('Category deleted successfully!');
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      // Update existing category
      setData(prev => ({
        ...prev,
        categories: prev.categories.map(c =>
          c._id === editingCategory._id ? { ...c, ...categoryData } : c
        )
      }));
      alert('Category updated successfully!');
    } else {
      // Add new category
      const newCategory = {
        _id: Date.now().toString(),
        ...categoryData,
        createdAt: new Date(),
        statistics: {
          productCount: 0,
          activeProductCount: 0,
          totalSales: 0,
          averagePrice: 0,
          topFarmers: []
        }
      };
      setData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      alert('Category created successfully!');
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleToggleCategoryStatus = (categoryId) => {
    const category = data.categories.find(c => c._id === categoryId);
    const newStatus = !category.isActive;

    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this category?`)) {
      setData(prev => ({
        ...prev,
        categories: prev.categories.map(c =>
          c._id === categoryId ? { ...c, isActive: newStatus } : c
        )
      }));
      alert(`Category ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    }
  };

  // Article management functions
  const handleCreateArticle = () => {
    setEditingArticle(null);
    setShowArticleModal(true);
  };

  const handleViewArticle = (articleId) => {
    const article = data.articles.find(a => a._id === articleId);
    setViewingArticle(article);
    setShowArticleDetailsModal(true);
  };

  const handleEditArticle = (articleId) => {
    const article = data.articles.find(a => a._id === articleId);
    setEditingArticle(article);
    setShowArticleModal(true);
  };

  const handleDeleteArticle = (articleId) => {
    const article = data.articles.find(a => a._id === articleId);

    if (window.confirm(`Are you sure you want to delete the article "${article.title}"? This action cannot be undone.`)) {
      setData(prev => ({
        ...prev,
        articles: prev.articles.filter(a => a._id !== articleId)
      }));
      alert('Article deleted successfully!');
    }
  };

  const handleSaveArticle = (articleData) => {
    if (editingArticle) {
      // Update existing article
      setData(prev => ({
        ...prev,
        articles: prev.articles.map(a =>
          a._id === editingArticle._id ? {
            ...a,
            ...articleData,
            publishedAt: articleData.status === 'published' && !a.publishedAt ? new Date() : a.publishedAt
          } : a
        )
      }));
      alert('Article updated successfully!');
    } else {
      // Add new article
      const newArticle = {
        _id: Date.now().toString(),
        ...articleData,
        author: { _id: user._id, name: user.name, email: user.email },
        createdAt: new Date(),
        publishedAt: articleData.status === 'published' ? new Date() : null,
        views: 0,
        likes: 0,
        readingTime: Math.ceil((articleData.content || '').split(' ').length / 200)
      };
      setData(prev => ({
        ...prev,
        articles: [...prev.articles, newArticle]
      }));
      alert('Article created successfully!');
    }
    setShowArticleModal(false);
    setEditingArticle(null);
  };

  const handleBulkArticleAction = (action) => {
    if (selectedArticles.length === 0) {
      alert('Please select articles first');
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} ${selectedArticles.length} selected articles?`)) {
      switch (action) {
        case 'publish':
          setData(prev => ({
            ...prev,
            articles: prev.articles.map(a =>
              selectedArticles.includes(a._id) ? {
                ...a,
                status: 'published',
                publishedAt: a.publishedAt || new Date()
              } : a
            )
          }));
          break;
        case 'draft':
          setData(prev => ({
            ...prev,
            articles: prev.articles.map(a =>
              selectedArticles.includes(a._id) ? { ...a, status: 'draft' } : a
            )
          }));
          break;
        case 'archive':
          setData(prev => ({
            ...prev,
            articles: prev.articles.map(a =>
              selectedArticles.includes(a._id) ? {
                ...a,
                status: 'archived',
                archivedAt: new Date()
              } : a
            )
          }));
          break;
        case 'delete':
          setData(prev => ({
            ...prev,
            articles: prev.articles.filter(a => !selectedArticles.includes(a._id))
          }));
          break;
        case 'feature':
          setData(prev => ({
            ...prev,
            articles: prev.articles.map(a =>
              selectedArticles.includes(a._id) ? { ...a, isFeatured: true } : a
            )
          }));
          break;
        case 'unfeature':
          setData(prev => ({
            ...prev,
            articles: prev.articles.map(a =>
              selectedArticles.includes(a._id) ? { ...a, isFeatured: false } : a
            )
          }));
          break;
        default:
          alert(`Bulk ${action} completed for ${selectedArticles.length} articles`);
      }
      setSelectedArticles([]);
      alert(`${selectedArticles.length} articles ${action}ed successfully!`);
    }
  };

  const handleArticleSelection = (articleId, checked) => {
    if (checked) {
      setSelectedArticles(prev => [...prev, articleId]);
    } else {
      setSelectedArticles(prev => prev.filter(id => id !== articleId));
    }
  };

  const handleSelectAllArticles = (checked) => {
    if (checked) {
      setSelectedArticles(data.articles.map(a => a._id));
    } else {
      setSelectedArticles([]);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = data.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const ArticleDetailsModal = () => {
    if (!showArticleDetailsModal || !viewingArticle) return null;

    return (
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
            <h2 style={{ margin: 0 }}>Article Details</h2>
            <button
              onClick={() => setShowArticleDetailsModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Article Information</h3>
              <p><strong>Title:</strong> {viewingArticle.title}</p>
              <p><strong>Category:</strong> {viewingArticle.category}</p>
              <p><strong>Author:</strong> {viewingArticle.author?.name}</p>
              <p><strong>Status:</strong>
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: viewingArticle.status === 'published' ? '#d1fae5' :
                                  viewingArticle.status === 'draft' ? '#fef3c7' : '#fee2e2',
                  color: viewingArticle.status === 'published' ? '#065f46' :
                         viewingArticle.status === 'draft' ? '#92400e' : '#991b1b'
                }}>
                  {viewingArticle.status}
                </span>
              </p>
              <p><strong>Created:</strong> {new Date(viewingArticle.createdAt).toLocaleDateString()}</p>
              {viewingArticle.publishedAt && (
                <p><strong>Published:</strong> {new Date(viewingArticle.publishedAt).toLocaleDateString()}</p>
              )}
              <p><strong>Reading Time:</strong> {viewingArticle.readingTime} minutes</p>
              <p><strong>Featured:</strong>
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: viewingArticle.isFeatured ? '#dbeafe' : '#f3f4f6',
                  color: viewingArticle.isFeatured ? '#1e40af' : '#6b7280'
                }}>
                  {viewingArticle.isFeatured ? 'Yes' : 'No'}
                </span>
              </p>
            </div>

            <div>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Performance</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {viewingArticle.views}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Views</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                    {viewingArticle.likes}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Likes</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {viewingArticle.views > 0 ? ((viewingArticle.likes / viewingArticle.views) * 100).toFixed(1) : 0}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Engagement</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1f2937' }}>Excerpt</h3>
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>{viewingArticle.excerpt}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1f2937' }}>Content Preview</h3>
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              padding: '15px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {viewingArticle.content}
            </div>
          </div>

          {viewingArticle.tags && viewingArticle.tags.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#1f2937' }}>Tags</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {viewingArticle.tags.map((tag, index) => (
                  <span key={index} style={{
                    padding: '4px 12px',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowArticleDetailsModal(false);
                handleEditArticle(viewingArticle._id);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✏️ Edit Article
            </button>
            <button
              onClick={() => setShowArticleDetailsModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ArticleEditModal = () => {
    const [formData, setFormData] = useState({
      title: editingArticle?.title || '',
      excerpt: editingArticle?.excerpt || '',
      content: editingArticle?.content || '',
      category: editingArticle?.category || 'farming-tips',
      status: editingArticle?.status || 'draft',
      tags: editingArticle?.tags ? editingArticle.tags.join(', ') : '',
      featuredImage: editingArticle?.featuredImage || '',
      isFeatured: editingArticle?.isFeatured || false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title || !formData.content) {
        alert('Title and content are required');
        return;
      }

      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      handleSaveArticle(articleData);
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!showArticleModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
            {editingArticle ? 'Edit Article' : 'Create New Article'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
                    placeholder="Enter article title..."
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '60px',
                      resize: 'vertical'
                    }}
                    placeholder="Brief description of the article..."
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '200px',
                      resize: 'vertical'
                    }}
                    required
                    placeholder="Write your article content here..."
                  />
                </div>
              </div>

              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="farming-tips">Farming Tips</option>
                    <option value="market-trends">Market Trends</option>
                    <option value="technology">Technology</option>
                    <option value="sustainability">Sustainability</option>
                    <option value="news">News</option>
                    <option value="guides">Guides</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="farming, tips, organic (comma separated)"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => handleChange('featuredImage', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleChange('isFeatured', e.target.checked)}
                    />
                    <span style={{ fontWeight: 'bold' }}>Featured Article</span>
                  </label>
                  <small style={{ color: '#6b7280', marginLeft: '24px' }}>
                    Featured articles appear prominently on the homepage
                  </small>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowArticleModal(false);
                  setEditingArticle(null);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingArticle ? 'Update Article' : 'Create Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CategoryDetailsModal = () => {
    if (!showCategoryDetailsModal || !viewingCategory) return null;

    const parentCategoryName = viewingCategory.parentCategory
      ? data.categories.find(c => c._id === viewingCategory.parentCategory)?.name
      : 'None';

    const subcategories = data.categories.filter(c => c.parentCategory === viewingCategory._id);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Category Details</h2>
            <button
              onClick={() => setShowCategoryDetailsModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Basic Information</h3>
              <p><strong>Name:</strong> {viewingCategory.name}</p>
              <p><strong>Description:</strong> {viewingCategory.description}</p>
              <p><strong>Parent Category:</strong> {parentCategoryName}</p>
              <p><strong>Created:</strong> {new Date(viewingCategory.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong>
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: viewingCategory.isActive ? '#d1fae5' : '#fee2e2',
                  color: viewingCategory.isActive ? '#065f46' : '#991b1b'
                }}>
                  {viewingCategory.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>

            <div>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Category Hierarchy</h3>
              <p><strong>Subcategories:</strong> {subcategories.length}</p>
              {subcategories.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Subcategories:</strong>
                  <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                    {subcategories.map(sub => (
                      <li key={sub._id} style={{ marginBottom: '2px' }}>
                        {sub.name}
                        <span style={{
                          marginLeft: '8px',
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500',
                          backgroundColor: sub.isActive ? '#d1fae5' : '#fee2e2',
                          color: sub.isActive ? '#065f46' : '#991b1b'
                        }}>
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1f2937' }}>Performance Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {viewingCategory.statistics.productCount}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Products</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {viewingCategory.statistics.activeProductCount}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Active Products</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  ₹{viewingCategory.statistics.totalSales.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Sales</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                  ₹{viewingCategory.statistics.averagePrice.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Price</div>
              </div>
            </div>
          </div>

          {viewingCategory.statistics.topFarmers.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#1f2937' }}>Top Farmers</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {viewingCategory.statistics.topFarmers.map((farmer, index) => (
                  <span key={index} style={{
                    padding: '4px 12px',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {farmer}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowCategoryDetailsModal(false);
                handleEditCategory(viewingCategory._id);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✏️ Edit Category
            </button>
            <button
              onClick={() => setShowCategoryDetailsModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CategoryEditModal = () => {
    const [formData, setFormData] = useState({
      name: editingCategory?.name || '',
      description: editingCategory?.description || '',
      parentCategory: editingCategory?.parentCategory || '',
      isActive: editingCategory?.isActive !== undefined ? editingCategory.isActive : true,
      image: editingCategory?.image || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.description) {
        alert('Name and description are required');
        return;
      }

      // Convert parentCategory empty string to null
      const categoryData = {
        ...formData,
        parentCategory: formData.parentCategory || null
      };

      handleSaveCategory(categoryData);
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!showCategoryModal) return null;

    // Get available parent categories (excluding current category and its descendants)
    const availableParentCategories = data.categories.filter(c =>
      c._id !== editingCategory?._id && c.parentCategory !== editingCategory?._id
    );

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
                placeholder="e.g., Vegetables, Fruits"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                required
                placeholder="Describe this category..."
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Parent Category
              </label>
              <select
                value={formData.parentCategory}
                onChange={(e) => handleChange('parentCategory', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">None (Top Level Category)</option>
                {availableParentCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                />
                <span style={{ fontWeight: 'bold' }}>Active Category</span>
              </label>
              <small style={{ color: '#6b7280', marginLeft: '24px' }}>
                Inactive categories won't be visible to users
              </small>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const FarmerDetailsModal = () => {
    if (!showFarmerDetailsModal || !viewingFarmer) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Farmer Details</h2>
            <button
              onClick={() => setShowFarmerDetailsModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Personal Information</h3>
              <p><strong>Name:</strong> {viewingFarmer.name}</p>
              <p><strong>Email:</strong> {viewingFarmer.email}</p>
              <p><strong>Phone:</strong> {viewingFarmer.phone}</p>
              <p><strong>Experience:</strong> {viewingFarmer.farmingExperience} years</p>
              <p><strong>Status:</strong>
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: viewingFarmer.isActive ? '#d1fae5' : '#fee2e2',
                  color: viewingFarmer.isActive ? '#065f46' : '#991b1b'
                }}>
                  {viewingFarmer.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p><strong>Verification:</strong>
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: viewingFarmer.isVerified ? '#d1fae5' : '#fef3c7',
                  color: viewingFarmer.isVerified ? '#065f46' : '#92400e'
                }}>
                  {viewingFarmer.isVerified ? 'Verified' : 'Pending'}
                </span>
              </p>
            </div>

            <div>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Farm Information</h3>
              <p><strong>Farm Name:</strong> {viewingFarmer.farmName}</p>
              <p><strong>Location:</strong> {viewingFarmer.farmLocation}</p>
              <p><strong>Farm Size:</strong> {viewingFarmer.farmSize}</p>
              <p><strong>Specialization:</strong> {viewingFarmer.specialization}</p>
              <p><strong>Joined:</strong> {new Date(viewingFarmer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1f2937' }}>Performance Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {viewingFarmer.statistics.productCount}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Products</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                  {viewingFarmer.statistics.orderCount}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Orders</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                  ₹{viewingFarmer.statistics.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Revenue</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                  {viewingFarmer.statistics.averageRating}⭐
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Rating</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowFarmerDetailsModal(false);
                handleEditFarmer(viewingFarmer._id);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✏️ Edit Farmer
            </button>
            <button
              onClick={() => setShowFarmerDetailsModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FarmerEditModal = () => {
    const [formData, setFormData] = useState({
      name: editingFarmer?.name || '',
      email: editingFarmer?.email || '',
      phone: editingFarmer?.phone || '',
      farmName: editingFarmer?.farmName || '',
      farmLocation: editingFarmer?.farmLocation || '',
      farmSize: editingFarmer?.farmSize || '',
      specialization: editingFarmer?.specialization || '',
      farmingExperience: editingFarmer?.farmingExperience || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.email || !formData.farmName) {
        alert('Name, email, and farm name are required');
        return;
      }
      handleSaveFarmer(formData);
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!showFarmerModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Edit Farmer</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Farm Name *
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => handleChange('farmName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Farm Location
                </label>
                <input
                  type="text"
                  value={formData.farmLocation}
                  onChange={(e) => handleChange('farmLocation', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Farm Size
                </label>
                <input
                  type="text"
                  value={formData.farmSize}
                  onChange={(e) => handleChange('farmSize', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., 50 acres"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., Organic Vegetables"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.farmingExperience}
                  onChange={(e) => handleChange('farmingExperience', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  min="0"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowFarmerModal(false);
                  setEditingFarmer(null);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Update Farmer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const UserModal = () => {
    const [formData, setFormData] = useState({
      name: editingUser?.name || '',
      email: editingUser?.email || '',
      role: editingUser?.role || 'user',
      phone: editingUser?.phone || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.email) {
        alert('Name and email are required');
        return;
      }
      handleSaveUser(formData);
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!showAddUserModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="user">User</option>
                <option value="farmer">Farmer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>👥 User Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleAddUser}
            style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ➕ Add User
          </button>
          <button
            onClick={() => handleBulkAction('export')}
            style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            📊 Export Data
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ padding: '15px', borderBottom: '1px solid rgba(229, 231, 235, 0.5)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', flex: 1 }}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="farmer">Farmer</option>
              <option value="user">User</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {selectedUsers.length > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {selectedUsers.length} users selected
              </span>
              <button
                onClick={() => handleBulkAction('activate')}
                style={{ padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                ✅ Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                style={{ padding: '4px 8px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                ⏸️ Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'No users found matching your criteria'
                    : 'No users found'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={(e) => handleUserSelection(user._id, e.target.checked)}
                    />
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.role === 'admin' ? '#dbeafe' : user.role === 'farmer' ? '#d1fae5' : '#e0e7ff',
                      color: user.role === 'admin' ? '#1e40af' : user.role === 'farmer' ? '#065f46' : '#3730a3'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.isActive ? '#d1fae5' : '#fee2e2',
                      color: user.isActive ? '#065f46' : '#991b1b'
                    }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEditUser(user._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
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

      <UserModal />
    </div>
  );

  const renderFarmers = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>👨‍🌾 Farmer Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert('Bulk verification interface - Would allow verifying multiple farmers')}
            style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ✅ Bulk Verify
          </button>
          <button
            onClick={() => alert('Export Farmer Data')}
            style={{ padding: '8px 16px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            📊 Export Data
          </button>
        </div>
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
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Farmer Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Farm Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Products</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Orders</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading farmers...</td>
              </tr>
            ) : (
              data.farmers.map((farmer) => (
                <tr key={farmer._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{farmer.name}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{farmer.farmName}</td>
                  <td style={{ padding: '12px' }}>{farmer.statistics?.productCount || 0}</td>
                  <td style={{ padding: '12px' }}>{farmer.statistics?.orderCount || 0}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: farmer.isVerified ? '#d1fae5' : '#fef3c7',
                        color: farmer.isVerified ? '#065f46' : '#92400e'
                      }}>
                        {farmer.isVerified ? 'Verified' : 'Pending'}
                      </span>
                      <button
                        onClick={() => handleVerifyFarmer(farmer._id)}
                        style={{
                          padding: '2px 6px',
                          backgroundColor: farmer.isVerified ? '#f59e0b' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        {farmer.isVerified ? 'Unverify' : 'Verify'}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleViewFarmer(farmer._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEditFarmer(farmer._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <FarmerDetailsModal />
      <FarmerEditModal />
    </div>
  );

  const renderCategories = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>📁 Category Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleAddCategory}
            style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ➕ Add Category
          </button>
          <button
            onClick={() => alert('Category hierarchy manager - Would show tree view of categories')}
            style={{ padding: '8px 16px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🗂️ Organize
          </button>
        </div>
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
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Category Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Products / Sales</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Active / Avg Price</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading categories...</td>
              </tr>
            ) : (
              data.categories.map((category) => {
                const parentCategoryName = category.parentCategory
                  ? data.categories.find(c => c._id === category.parentCategory)?.name
                  : 'None';

                return (
                  <tr key={category._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '500' }}>{category.name}</span>
                        {category.parentCategory && (
                          <span style={{
                            padding: '2px 6px',
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}>
                            Sub
                          </span>
                        )}
                      </div>
                      {category.parentCategory && (
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                          Parent: {parentCategoryName}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', maxWidth: '200px' }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {category.description}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontWeight: '500' }}>{category.statistics?.productCount || 0}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        ₹{(category.statistics?.totalSales || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontWeight: '500' }}>{category.statistics?.activeProductCount || 0}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        ₹{(category.statistics?.averagePrice || 0).toLocaleString('en-IN')} avg
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: category.isActive ? '#d1fae5' : '#fee2e2',
                          color: category.isActive ? '#065f46' : '#991b1b'
                        }}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleCategoryStatus(category._id)}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: category.isActive ? '#f59e0b' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '10px'
                          }}
                        >
                          {category.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleViewCategory(category._id)}
                          style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleEditCategory(category._id)}
                          style={{ padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <CategoryDetailsModal />
      <CategoryEditModal />
    </div>
  );

  const renderArticles = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>📝 Article Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCreateArticle}
            style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ➕ Create Article
          </button>
          <button
            onClick={() => alert('Bulk Actions - Select articles below to see bulk action options')}
            style={{ padding: '8px 16px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            📋 Bulk Actions
          </button>
        </div>
      </div>

      {selectedArticles.length > 0 && (
        <div style={{
          marginBottom: '15px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              {selectedArticles.length} articles selected
            </span>
            <button
              onClick={() => handleBulkArticleAction('publish')}
              style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              📢 Publish
            </button>
            <button
              onClick={() => handleBulkArticleAction('draft')}
              style={{ padding: '6px 12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              📝 Move to Draft
            </button>
            <button
              onClick={() => handleBulkArticleAction('archive')}
              style={{ padding: '6px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              📦 Archive
            </button>
            <button
              onClick={() => handleBulkArticleAction('feature')}
              style={{ padding: '6px 12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              ⭐ Feature
            </button>
            <button
              onClick={() => handleBulkArticleAction('unfeature')}
              style={{ padding: '6px 12px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              ⭐ Unfeature
            </button>
            <button
              onClick={() => handleBulkArticleAction('delete')}
              style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

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
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                <input
                  type="checkbox"
                  checked={selectedArticles.length === data.articles.length && data.articles.length > 0}
                  onChange={(e) => handleSelectAllArticles(e.target.checked)}
                />
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Title</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Author</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading articles...</td>
              </tr>
            ) : data.articles.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No articles found. Create your first article!
                </td>
              </tr>
            ) : (
              data.articles.map((article) => (
                <tr key={article._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article._id)}
                      onChange={(e) => handleArticleSelection(article._id, e.target.checked)}
                    />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '500', marginBottom: '2px' }}>{article.title}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {article.views} views • {article.likes} likes
                      {article.isFeatured && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '1px 6px',
                          backgroundColor: '#fbbf24',
                          color: '#92400e',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>
                    <div style={{ textTransform: 'capitalize' }}>{article.category.replace('-', ' ')}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {article.readingTime} min read
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>
                    <div>{article.author?.name}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: article.status === 'published' ? '#d1fae5' :
                                      article.status === 'draft' ? '#fef3c7' : '#fee2e2',
                      color: article.status === 'published' ? '#065f46' :
                             article.status === 'draft' ? '#92400e' : '#991b1b'
                    }}>
                      {article.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleViewArticle(article._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEditArticle(article._id)}
                        style={{ padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article._id)}
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

      <ArticleDetailsModal />
      <ArticleEditModal />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users': return renderUsers();
      case 'farmers': return renderFarmers();
      case 'categories': return renderCategories();
      case 'articles': return renderArticles();
      default: return renderUsers();
    }
  };

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
            <h1 style={{ margin: '0', color: '#1f2937', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>E-FARM Admin</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#1f2937', fontWeight: '500' }}>Welcome, {user?.name || 'Admin'}!</span>
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
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#b91c1c';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.3)';
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
            { id: 'users', name: '👥 Users', icon: '👥' },
            { id: 'farmers', name: '👨‍🌾 Farmers', icon: '👨‍🌾' },
            { id: 'categories', name: '📁 Categories', icon: '📁' },
            { id: 'articles', name: '📝 Articles', icon: '📝' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                backgroundColor: activeTab === item.id ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                color: activeTab === item.id ? 'white' : '#374151',
                border: activeTab === item.id ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(5px)',
                boxShadow: activeTab === item.id ? '0 2px 8px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateX(0)';
                }
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
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
