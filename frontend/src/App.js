import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import FarmerDashboard from './FarmerDashboard';
import UserDashboard from './UserDashboard';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showEcommerceStore, setShowEcommerceStore] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simple authentication logic
    if (email === 'admin@efarm.com' && password === 'admin123') {
      setUser({ role: 'admin', name: 'Admin User', email });
    } else if (email === 'farmer@efarm.com' && password === 'farmer123') {
      setUser({ role: 'farmer', name: 'John Farmer', email });
    } else if (email === 'user@efarm.com' && password === 'user123') {
      setUser({ role: 'user', name: 'Jane User', email });
    } else {
      setError('Invalid email or password. Please use the demo credentials.');
      return;
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  // If user is logged in, show dashboard
  if (user) {
    // For admin users, show the AdminDashboard component directly (it has its own header)
    if (user.role === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    // For farmer users, show the FarmerDashboard component directly (it has its own header)
    if (user.role === 'farmer') {
      return <FarmerDashboard user={user} onLogout={handleLogout} />;
    }

    // For regular users, show the UserDashboard component directly (full e-commerce functionality)
    return <UserDashboard user={user} onLogout={handleLogout} />;

  }

  // Login page
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f9ff',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌾</div>
        <h1 style={{ color: '#1f2937', fontSize: '32px', margin: '0 0 10px 0' }}>E-FARM</h1>
        <p style={{ color: '#6b7280', margin: '0 0 30px 0' }}>Agricultural Platform</p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            🔑 Sign In
          </button>
        </form>

        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>Demo Credentials (Click to fill):</p>

          <button
            type="button"
            onClick={() => fillDemo('admin@efarm.com', 'admin123')}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              marginBottom: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <strong>Admin:</strong> admin@efarm.com / admin123
          </button>

          <button
            type="button"
            onClick={() => fillDemo('farmer@efarm.com', 'farmer123')}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              marginBottom: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <strong>Farmer:</strong> farmer@efarm.com / farmer123
          </button>

          <button
            type="button"
            onClick={() => fillDemo('user@efarm.com', 'user123')}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <strong>User:</strong> user@efarm.com / user123
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
