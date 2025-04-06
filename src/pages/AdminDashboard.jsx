import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/adminDashboard.css';

// Import admin dashboard components
import AdminStats from '../components/admin/AdminStats';
import ProductsList from '../components/admin/ProductsList';
import ProductForm from '../components/admin/ProductForm';
import ServicesList from '../components/admin/ServicesList';
import ServiceForm from '../components/admin/ServiceForm';
import BookingDetail from '../components/admin/BookingDetail';
import OrderDetail from '../components/admin/OrderDetail';
import UserForm from '../components/admin/UserForm';
import CategoryForm from '../components/admin/CategoryForm';
import BrandForm from '../components/admin/BrandForm';
import DeviceModelForm from '../components/admin/DeviceModelForm';
import CategoryList from '../components/admin/CategoryList';
import BrandList from '../components/admin/BrandList';
import ModelList from '../components/admin/ModelList';
import OrderList from '../components/admin/OrderList';
import BookingList from '../components/admin/BookingList';
import UserList from '../components/admin/UserList';

const AdminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('AdminDashboard: Checking token:', token ? 'Token exists' : 'No token');
        
        if (!token) {
          console.log('AdminDashboard: No token found, redirecting to login');
          navigate('/login');
          return;
        }
        
        // Get user profile to check admin status
        console.log('AdminDashboard: Fetching user profile to verify admin status');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'x-auth-token': token
          }
        });
        
        console.log('AdminDashboard: User profile response:', response.data);
        const user = response.data.user;
        
        if (!user || !(user.roles && user.roles.includes('admin'))) {
          console.log('AdminDashboard: User is not an admin, redirecting to login');
          navigate('/login');
          return;
        }
        
        console.log('AdminDashboard: Admin verification successful');
        setCurrentUser(user);
        fetchAdminStats();
      } catch (err) {
        console.error('AdminDashboard: Authentication error:', err.response?.data || err.message);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Fetch admin dashboard statistics
  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('AdminDashboard: Fetching admin stats');
      
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/admin/stats', {
          headers: {
            'x-auth-token': token
          }
        });
        
        console.log('AdminDashboard: Stats response:', response.data);
        setAdminStats(response.data);
      } catch (statsErr) {
        console.error('AdminDashboard: Error fetching stats:', statsErr.response?.data || statsErr.message);
        // Use mock data if the endpoint doesn't exist
        setAdminStats({
          stats: {
            totalUsers: 120,
            totalOrders: 45,
            totalBookings: 78,
            totalProducts: 230,
            revenue: {
              total: 124500,
              monthly: 32400,
              daily: 4500
            },
            recentActivity: [
              { type: 'order', id: 'ORD-1001', user: 'John Doe', amount: 2499, date: new Date().toISOString() },
              { type: 'booking', id: 'BKG-1002', user: 'Jane Smith', service: 'Screen Repair', date: new Date().toISOString() },
              { type: 'user', id: 'USR-1003', name: 'Alex Johnson', action: 'registered', date: new Date().toISOString() }
            ]
          }
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('AdminDashboard: Error in fetchAdminStats:', err);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  // Handle logout
  const handleLogout = () => {
    console.log('AdminDashboard: Logging out');
    localStorage.removeItem('token');
    window.location.href = '/login'; // Force a full page reload
  };
  
  // Check if a route is active
  const isActiveRoute = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };
  
  if (loading && !adminStats) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-error-container">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button
          className="admin-error-btn"
          onClick={() => fetchAdminStats()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">Admin Panel</div>
          <button
            className="admin-toggle-btn"
            onClick={toggleSidebar}
          >
            <i className={`fas fa-${isSidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="admin-sidebar-menu">
          <div className="admin-sidebar-item">
            <Link
              to="/admin"
              className={`admin-sidebar-link ${isActiveRoute('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-tachometer-alt"></i>
              <span className="admin-sidebar-text">Dashboard</span>
            </Link>
          </div>
          
          <div className="admin-divider"></div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/products"
              className={`admin-sidebar-link ${isActiveRoute('/admin/products') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-box"></i>
              <span className="admin-sidebar-text">Products</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/categories"
              className={`admin-sidebar-link ${isActiveRoute('/admin/categories') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-folder"></i>
              <span className="admin-sidebar-text">Categories</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/brands"
              className={`admin-sidebar-link ${isActiveRoute('/admin/brands') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-building"></i>
              <span className="admin-sidebar-text">Brands</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/models"
              className={`admin-sidebar-link ${isActiveRoute('/admin/models') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-mobile-alt"></i>
              <span className="admin-sidebar-text">Device Models</span>
            </Link>
          </div>
          
          <div className="admin-divider"></div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/orders"
              className={`admin-sidebar-link ${isActiveRoute('/admin/orders') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-shopping-cart"></i>
              <span className="admin-sidebar-text">Orders</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/bookings"
              className={`admin-sidebar-link ${isActiveRoute('/admin/bookings') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-calendar-alt"></i>
              <span className="admin-sidebar-text">Bookings</span>
            </Link>
          </div>
          
          <div className="admin-divider"></div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/services"
              className={`admin-sidebar-link ${isActiveRoute('/admin/services') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-tools"></i>
              <span className="admin-sidebar-text">Services</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/users"
              className={`admin-sidebar-link ${isActiveRoute('/admin/users') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-users"></i>
              <span className="admin-sidebar-text">Users</span>
            </Link>
          </div>
          
          <div className="admin-divider"></div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/settings"
              className={`admin-sidebar-link ${isActiveRoute('/admin/settings') ? 'active' : ''}`}
            >
              <i className="admin-sidebar-icon fas fa-cog"></i>
              <span className="admin-sidebar-text">Settings</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`admin-main ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <div className="admin-header">
          <div className="admin-header-title">
            <h1>Admin Dashboard</h1>
          </div>
          
          <div className="admin-user-info">
            {currentUser && (
              <>
                <div className="admin-user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="admin-user-name">
                  {currentUser.name}
                </div>
              </>
            )}
            <button
              className="admin-logout-btn"
              onClick={handleLogout}
            >
              <i className="admin-logout-icon fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
        
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminStats stats={adminStats} />} />
            
            {/* Product Routes */}
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            
            {/* Category Routes */}
            <Route path="/categories" element={<CategoryList />} />
            
            {/* Brand Routes */}
            <Route path="/brands" element={<BrandList />} />
            
            {/* Model Routes */}
            <Route path="/models" element={<ModelList />} />
            
            {/* Order Routes */}
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            
            {/* Booking Routes */}
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/bookings/:id" element={<BookingDetail />} />
            
            {/* Service Routes */}
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/add" element={<ServiceForm />} />
            <Route path="/services/edit/:id" element={<ServiceForm />} />
            
            {/* User Routes */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            
            {/* Fallback to dashboard for undefined routes */}
            <Route path="*" element={<AdminStats stats={adminStats} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 