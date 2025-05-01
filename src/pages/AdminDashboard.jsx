import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, isUserAdmin, getCurrentUser } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import * as firestoreService from '../services/firestoreService';
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
import CategoriesList from '../components/admin/CategoriesList';
import BrandList from '../components/admin/BrandList';
import ModelList from '../components/admin/ModelList';
import OrderList from '../components/admin/OrderList';
import BookingList from '../components/admin/BookingList';
import UserList from '../components/admin/UserList';
import ImportDataButton from '../components/admin/ImportDataButton';
import ReferralsList from '../components/admin/ReferralsList';
import ReferralForm from '../components/admin/ReferralForm';
import CouponsList from '../components/admin/CouponsList';
import CouponForm from '../components/admin/CouponForm';
import BookingDevicesManager from '../components/admin/BookingDevicesManager';
import DataImporter from '../components/admin/DataImporter';
import TestBookingData from '../components/admin/TestBookingData';

const AdminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
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
        setLoading(true);
        
        // Check if user is logged in and is an admin using Firebase
        const isAdmin = await isUserAdmin();
        console.log('AdminDashboard: Admin status:', isAdmin);
        
        if (!isAdmin) {
          console.log('AdminDashboard: User is not an admin, redirecting to login');
          navigate('/login');
          return;
        }
        
        // Get current user data
        const userData = await getCurrentUser();
        console.log('AdminDashboard: Admin verification successful');
        setCurrentUser(userData);
        fetchAdminStats();
      } catch (err) {
        console.error('AdminDashboard: Authentication error:', err);
        navigate('/login');
      }
    };
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('AdminDashboard: No user found, redirecting to login');
        navigate('/login');
        return;
      }
      
      checkAuth();
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  // Fetch admin dashboard statistics
  const fetchAdminStats = async () => {
    try {
      console.log('AdminDashboard: Fetching admin stats from Firestore');
      
      // Fetch data from Firestore collections
      const [users, orders, bookings, products, services] = await Promise.all([
        firestoreService.getAllUsers(),
        firestoreService.getAllOrders(),
        firestoreService.getAllDocuments('bookings'),
        firestoreService.getAllProducts(),
        firestoreService.getAllServices()
      ]);
      
      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Get recent activity
      const allActivity = [
        ...orders.map(order => ({ 
          type: 'order', 
          id: order.id, 
          user: order.userName || 'Customer', 
          amount: order.total, 
          date: order.createdAt?.toDate() || new Date() 
        })),
        ...bookings.map(booking => ({ 
          type: 'booking', 
          id: booking.id, 
          user: booking.userName || 'Customer', 
          service: booking.serviceName, 
          date: booking.createdAt?.toDate() || new Date() 
        }))
      ];
      
      // Sort by date descending and take latest 10
      const recentActivity = allActivity
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
      
      // Calculate monthly and daily revenue 
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      
      const monthlyRevenue = orders
        .filter(order => order.createdAt?.toDate() >= oneMonthAgo)
        .reduce((sum, order) => sum + (order.total || 0), 0);
        
      const dailyRevenue = orders
        .filter(order => order.createdAt?.toDate() >= oneDayAgo)
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Set admin stats
      setAdminStats({
        stats: {
          totalUsers: users.length,
          totalOrders: orders.length,
          totalBookings: bookings.length,
          totalProducts: products.length,
          totalServices: services.length,
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue,
            daily: dailyRevenue
          },
          recentActivity
        }
      });
      
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
  
  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
    document.body.classList.toggle('menu-open');
  };

  // Close mobile sidebar when clicking overlay
  const handleOverlayClick = () => {
    setIsMobileSidebarVisible(false);
    document.body.classList.remove('menu-open');
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarVisible(false);
    document.body.classList.remove('menu-open');
  }, [location.pathname]);
  
  // Handle logout
  const handleLogout = () => {
    console.log('AdminDashboard: Logging out');
    auth.signOut();
    navigate('/login');
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
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`admin-sidebar-overlay ${isMobileSidebarVisible ? 'visible' : ''}`}
        onClick={handleOverlayClick}
      />

      {/* Mobile Sidebar Toggle */}
      <button
        className="admin-sidebar-toggle"
        onClick={toggleMobileSidebar}
        aria-label="Toggle Sidebar"
      >
        <i className={`fas fa-${isMobileSidebarVisible ? 'times' : 'bars'}`}></i>
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarVisible ? 'visible' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">Admin Panel</div>
          <button
            className="admin-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar Collapse"
          >
            <i className={`fas fa-${isSidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="admin-sidebar-menu">
          <div className="admin-sidebar-item">
            <Link
              to="/admin"
              className={`admin-sidebar-link ${isActiveRoute('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
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
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-box"></i>
              <span className="admin-sidebar-text">Products</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/categories"
              className={`admin-sidebar-link ${isActiveRoute('/admin/categories') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-folder"></i>
              <span className="admin-sidebar-text">Categories</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/brands"
              className={`admin-sidebar-link ${isActiveRoute('/admin/brands') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-building"></i>
              <span className="admin-sidebar-text">Brands</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/models"
              className={`admin-sidebar-link ${isActiveRoute('/admin/models') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-mobile-alt"></i>
              <span className="admin-sidebar-text">Device Models</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/booking-devices"
              className={`admin-sidebar-link ${isActiveRoute('/admin/booking-devices') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-tools"></i>
              <span className="admin-sidebar-text">Booking Devices</span>
            </Link>
          </div>
          
          <div className="admin-divider"></div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/orders"
              className={`admin-sidebar-link ${isActiveRoute('/admin/orders') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-shopping-cart"></i>
              <span className="admin-sidebar-text">Orders</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/bookings"
              className={`admin-sidebar-link ${isActiveRoute('/admin/bookings') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-calendar-alt"></i>
              <span className="admin-sidebar-text">Bookings</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/referrals"
              className={`admin-sidebar-link ${isActiveRoute('/admin/referrals') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-share-alt"></i>
              <span className="admin-sidebar-text">Referrals</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/coupons"
              className={`admin-sidebar-link ${isActiveRoute('/admin/coupons') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-tag"></i>
              <span className="admin-sidebar-text">Coupons</span>
            </Link>
          </div>
          
          <div className="admin-divider"></div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/services"
              className={`admin-sidebar-link ${isActiveRoute('/admin/services') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-tools"></i>
              <span className="admin-sidebar-text">Services</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link
              to="/admin/users"
              className={`admin-sidebar-link ${isActiveRoute('/admin/users') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
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
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-cog"></i>
              <span className="admin-sidebar-text">Settings</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link 
              to="/admin/data-tools"
              className={`admin-sidebar-link ${isActiveRoute('/admin/data-tools') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-database"></i>
              <span className="admin-sidebar-text">Data Tools</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link 
              to="/admin/data-importer"
              className={`admin-sidebar-link ${isActiveRoute('/admin/data-importer') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-file-import"></i>
              <span className="admin-sidebar-text">Data Importer</span>
            </Link>
          </div>
          
          <div className="admin-sidebar-item">
            <Link 
              to="/admin/test-booking-data"
              className={`admin-sidebar-link ${isActiveRoute('/admin/test-booking-data') ? 'active' : ''}`}
              onClick={() => setIsMobileSidebarVisible(false)}
            >
              <i className="admin-sidebar-icon fas fa-check-circle"></i>
              <span className="admin-sidebar-text">Test Data</span>
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
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="admin-user-name">
                  {currentUser.name || currentUser.email || 'Admin User'}
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
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/add" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />
            
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
            
            {/* Referral Routes */}
            <Route path="/referrals" element={<ReferralsList />} />
            <Route path="/referrals/add" element={<ReferralForm />} />
            <Route path="/referrals/edit/:id" element={<ReferralForm />} />
            
            {/* Coupon Routes */}
            <Route path="/coupons" element={<CouponsList />} />
            <Route path="/coupons/add" element={<CouponForm />} />
            <Route path="/coupons/edit/:id" element={<CouponForm />} />
            
            {/* Service Routes */}
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/add" element={<ServiceForm />} />
            <Route path="/services/edit/:id" element={<ServiceForm />} />
            
            {/* User Routes */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            
            {/* Booking Devices Route */}
            <Route path="/booking-devices" element={<BookingDevicesManager />} />
            
            {/* Data Tools Route */}
            <Route path="/data-tools" element={
              <div className="admin-page-container">
                <div className="admin-page-header">
                  <h1>Data Tools</h1>
                  <p className="admin-page-subtitle">Import, export, and manage application data</p>
                </div>
                
                <div className="admin-content-wrapper">
                  <ImportDataButton />
                </div>
              </div>
            } />
            
            {/* Data Importer Route */}
            <Route path="/data-importer" element={<DataImporter />} />
            
            {/* Test Booking Data Route */}
            <Route path="/test-booking-data" element={<TestBookingData />} />
            
            {/* Fallback to dashboard for undefined routes */}
            <Route path="*" element={<AdminStats stats={adminStats} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 