import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Article from '../models/Article.js';
import Job from '../models/Job.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Article.deleteMany({});
    await Job.deleteMany({});

    console.log('Cleared existing data...');

    // Create Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@efarm.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890',
        isActive: true,
        isVerified: true
      },
      {
        name: 'John Farmer',
        email: 'farmer@efarm.com',
        password: 'farmer123',
        role: 'farmer',
        phone: '+1234567891',
        farmName: 'Green Valley Farm',
        farmLocation: 'California, USA',
        farmSize: 50,
        farmingExperience: 10,
        specialization: ['Organic Vegetables', 'Fruits'],
        isActive: true,
        isVerified: true
      },
      {
        name: 'Jane User',
        email: 'user@efarm.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567892',
        address: {
          street: '123 Main St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        isActive: true,
        isVerified: true
      },
      {
        name: 'Mary Johnson',
        email: 'mary@farm.com',
        password: 'farmer123',
        role: 'farmer',
        phone: '+1234567893',
        farmName: 'Sunshine Organic Farm',
        farmLocation: 'Texas, USA',
        farmSize: 75,
        farmingExperience: 15,
        specialization: ['Organic Fruits', 'Dairy'],
        isActive: true,
        isVerified: true
      },
      {
        name: 'Bob Wilson',
        email: 'bob@farm.com',
        password: 'farmer123',
        role: 'farmer',
        phone: '+1234567894',
        farmName: 'Golden Harvest Farm',
        farmLocation: 'Iowa, USA',
        farmSize: 100,
        farmingExperience: 20,
        specialization: ['Grains', 'Livestock'],
        isActive: true,
        isVerified: true
      }
    ]);

    console.log('Created users...');

    // Create Categories
    const categories = await Category.create([
      {
        name: 'Vegetables',
        description: 'Fresh vegetables and greens',
        icon: '🥬',
        sortOrder: 1
      },
      {
        name: 'Fruits',
        description: 'Seasonal fruits',
        icon: '🍎',
        sortOrder: 2
      },
      {
        name: 'Grains',
        description: 'Rice, wheat, and other grains',
        icon: '🌾',
        sortOrder: 3
      },
      {
        name: 'Dairy',
        description: 'Fresh dairy products',
        icon: '🥛',
        sortOrder: 4
      },
      {
        name: 'Herbs',
        description: 'Fresh herbs and spices',
        icon: '🌿',
        sortOrder: 5
      }
    ]);

    console.log('Created categories...');

    // Create Products
    const farmer1 = users.find(u => u.email === 'farmer@efarm.com');
    const farmer2 = users.find(u => u.email === 'mary@farm.com');
    const farmer3 = users.find(u => u.email === 'bob@farm.com');

    const vegetableCategory = categories.find(c => c.name === 'Vegetables');
    const fruitCategory = categories.find(c => c.name === 'Fruits');
    const grainCategory = categories.find(c => c.name === 'Grains');
    const dairyCategory = categories.find(c => c.name === 'Dairy');

    const products = await Product.create([
      {
        name: 'Organic Tomatoes',
        description: 'Fresh, juicy organic tomatoes grown without pesticides',
        category: vegetableCategory._id,
        farmer: farmer1._id,
        price: 5.99,
        unit: 'kg',
        stock: 50,
        images: [{ url: '/images/tomatoes.jpg', alt: 'Organic Tomatoes' }],
        specifications: {
          organic: true,
          freshness: 'fresh',
          harvestDate: new Date(),
          origin: 'California'
        },
        featured: true,
        tags: ['organic', 'fresh', 'local']
      },
      {
        name: 'Fresh Apples',
        description: 'Crisp and sweet apples, perfect for snacking',
        category: fruitCategory._id,
        farmer: farmer2._id,
        price: 3.49,
        unit: 'kg',
        stock: 30,
        images: [{ url: '/images/apples.jpg', alt: 'Fresh Apples' }],
        specifications: {
          organic: false,
          freshness: 'fresh',
          harvestDate: new Date(),
          origin: 'Texas'
        },
        featured: true,
        tags: ['fresh', 'sweet', 'local']
      },
      {
        name: 'Brown Rice',
        description: 'Nutritious whole grain brown rice',
        category: grainCategory._id,
        farmer: farmer3._id,
        price: 12.99,
        unit: 'kg',
        stock: 100,
        images: [{ url: '/images/rice.jpg', alt: 'Brown Rice' }],
        specifications: {
          organic: true,
          freshness: 'dried',
          origin: 'Iowa'
        },
        tags: ['organic', 'whole-grain', 'nutritious']
      },
      {
        name: 'Fresh Milk',
        description: 'Pure, fresh milk from grass-fed cows',
        category: dairyCategory._id,
        farmer: farmer2._id,
        price: 4.99,
        unit: 'liter',
        stock: 25,
        images: [{ url: '/images/milk.jpg', alt: 'Fresh Milk' }],
        specifications: {
          organic: true,
          freshness: 'fresh',
          origin: 'Texas'
        },
        featured: true,
        tags: ['organic', 'fresh', 'grass-fed']
      }
    ]);

    console.log('Created products...');

    // Create Articles
    const admin = users.find(u => u.role === 'admin');

    const articles = await Article.create([
      {
        title: 'Best Farming Practices 2024',
        content: 'Comprehensive guide to modern farming practices that increase yield while maintaining sustainability...',
        excerpt: 'Learn about the latest farming techniques that are revolutionizing agriculture.',
        author: admin._id,
        category: 'farming-tips',
        status: 'published',
        publishedAt: new Date(),
        isFeatured: true,
        tags: ['farming', 'sustainability', 'modern-agriculture']
      },
      {
        title: 'Organic Farming Benefits',
        content: 'Discover the numerous benefits of organic farming for both farmers and consumers...',
        excerpt: 'Explore why organic farming is becoming increasingly popular worldwide.',
        author: admin._id,
        category: 'sustainability',
        status: 'published',
        publishedAt: new Date(),
        tags: ['organic', 'health', 'environment']
      }
    ]);

    console.log('Created articles...');

    // Create Jobs
    const jobs = await Job.create([
      {
        title: 'Harvest Helper Needed',
        description: 'Looking for experienced workers to help with tomato harvest season. Must be able to work in outdoor conditions.',
        farmer: farmer1._id,
        jobType: 'seasonal',
        category: 'harvesting',
        location: {
          city: 'Los Angeles',
          state: 'California',
          address: 'Green Valley Farm, 123 Farm Road'
        },
        salary: {
          type: 'hourly',
          amount: 15,
          currency: 'USD'
        },
        workSchedule: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
          hoursPerDay: 8,
          daysPerWeek: 6
        },
        requirements: {
          experience: 'entry-level',
          skills: ['Physical stamina', 'Attention to detail'],
          physicalRequirements: ['Ability to lift 50 lbs', 'Work in outdoor conditions']
        },
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        status: 'active',
        isUrgent: true
      },
      {
        title: 'Tractor Operator',
        description: 'Experienced tractor operator needed for large-scale farming operations.',
        farmer: farmer2._id,
        jobType: 'full-time',
        category: 'equipment-operation',
        location: {
          city: 'Austin',
          state: 'Texas',
          address: 'Sunshine Organic Farm, 456 Ranch Road'
        },
        salary: {
          type: 'hourly',
          amount: 25,
          currency: 'USD'
        },
        workSchedule: {
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          hoursPerDay: 8,
          daysPerWeek: 5
        },
        requirements: {
          experience: '3-5-years',
          skills: ['Tractor operation', 'Equipment maintenance'],
          certifications: ['Commercial Driver License']
        },
        applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        status: 'active'
      }
    ]);

    console.log('Created jobs...');

    console.log('✅ Seed data created successfully!');
    console.log(`
📊 Summary:
- Users: ${users.length}
- Categories: ${categories.length}
- Products: ${products.length}
- Articles: ${articles.length}
- Jobs: ${jobs.length}

🔐 Login Credentials:
- Admin: admin@efarm.com / admin123
- Farmer: farmer@efarm.com / farmer123
- User: user@efarm.com / user123
    `);

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

runSeed();
