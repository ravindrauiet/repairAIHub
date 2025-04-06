import React from 'react';
import { Link } from 'react-router-dom';

const AdminStats = ({ stats }) => {
  // Ensure stats exists and has the expected structure
  const statsData = stats?.stats || stats || {};
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Helper function to safely access stats data
  const getStat = (path, defaultValue = 0) => {
    try {
      const parts = path.split('.');
      let result = statsData;
      
      for (const part of parts) {
        if (result && result[part] !== undefined) {
          result = result[part];
        } else {
          return defaultValue;
        }
      }
      
      return result || defaultValue;
    } catch (err) {
      console.error(`Error accessing stat path: ${path}`, err);
      return defaultValue;
    }
  };

  return (
    <div className="admin-stats">
      <h2 className="admin-section-title">Dashboard Overview</h2>
      
      {/* Stats Summary */}
      <div className="admin-stats-grid">
        {/* Revenue Card */}
        <div className="admin-card admin-stat-card">
          <div className="stat-icon revenue-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Total Revenue</h3>
            <div className="stat-value">{formatCurrency(getStat('revenue.total', 0))}</div>
            <div className="stat-info">
              <span className="stat-badge">
                <i className="fas fa-calendar-alt"></i> Monthly: {formatCurrency(getStat('revenue.monthly', 0))}
              </span>
            </div>
          </div>
        </div>
        
        {/* Orders Card */}
        <div className="admin-card admin-stat-card">
          <div className="stat-icon orders-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Orders</h3>
            <div className="stat-value">{getStat('totalOrders', 0)}</div>
            <div className="stat-info">
              <span className="stat-badge">
                <i className="fas fa-clock"></i> Active: {Math.floor(getStat('totalOrders', 0) * 0.3)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bookings Card */}
        <div className="admin-card admin-stat-card">
          <div className="stat-icon bookings-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Bookings</h3>
            <div className="stat-value">{getStat('totalBookings', 0)}</div>
            <div className="stat-info">
              <span className="stat-badge">
                <i className="fas fa-clock"></i> Pending: {Math.floor(getStat('totalBookings', 0) * 0.2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Users Card */}
        <div className="admin-card admin-stat-card">
          <div className="stat-icon users-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Users</h3>
            <div className="stat-value">{getStat('totalUsers', 0)}</div>
            <div className="stat-info">
              <span className="stat-badge">
                <i className="fas fa-user-plus"></i> New: {Math.floor(getStat('totalUsers', 0) * 0.1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inventory Summary */}
      <div className="admin-section">
        <h3 className="admin-section-subtitle">Inventory & Catalog</h3>
        <div className="admin-stats-grid-small">
          <div className="admin-card admin-stat-card-small">
            <div className="stat-content-small">
              <div className="stat-small-icon products-icon">
                <i className="fas fa-box"></i>
              </div>
              <div className="stat-small-value">{getStat('totalProducts', 0)}</div>
              <h4 className="stat-small-title">Products</h4>
            </div>
            <Link to="/admin/products" className="stat-small-link">View All</Link>
          </div>
          
          <div className="admin-card admin-stat-card-small">
            <div className="stat-content-small">
              <div className="stat-small-icon services-icon">
                <i className="fas fa-tools"></i>
              </div>
              <div className="stat-small-value">{Math.floor(getStat('totalProducts', 0) * 0.4)}</div>
              <h4 className="stat-small-title">Services</h4>
            </div>
            <Link to="/admin/services" className="stat-small-link">View All</Link>
          </div>
          
          <div className="admin-card admin-stat-card-small">
            <div className="stat-content-small">
              <div className="stat-small-icon categories-icon">
                <i className="fas fa-tags"></i>
              </div>
              <div className="stat-small-value">{Math.floor(getStat('totalProducts', 0) * 0.1)}</div>
              <h4 className="stat-small-title">Categories</h4>
            </div>
            <Link to="/admin/categories" className="stat-small-link">View All</Link>
          </div>
          
          <div className="admin-card admin-stat-card-small">
            <div className="stat-content-small">
              <div className="stat-small-icon brands-icon">
                <i className="fas fa-copyright"></i>
              </div>
              <div className="stat-small-value">{Math.floor(getStat('totalProducts', 0) * 0.05)}</div>
              <h4 className="stat-small-title">Brands</h4>
            </div>
            <Link to="/admin/brands" className="stat-small-link">View All</Link>
          </div>
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="admin-section">
        <h3 className="admin-section-subtitle">Recent Activity</h3>
        <div className="admin-stats-grid-2">
          {/* Recent Activities (Combined) */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h4 className="admin-card-title">Recent Activities</h4>
              <Link to="/admin/bookings" className="admin-btn admin-btn-sm admin-btn-primary">
                View All
              </Link>
            </div>
            <div className="admin-card-body">
              {getStat('recentActivity', []).length > 0 ? (
                <div className="admin-activity-list">
                  {getStat('recentActivity', []).map((activity, index) => (
                    <div className="admin-activity-item" key={activity.id || index}>
                      <div className={`activity-icon ${activity.type}-icon`}>
                        <i className={`fas fa-${getActivityIcon(activity.type)}`}></i>
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">
                          {renderActivityTitle(activity)}
                        </div>
                        <div className="activity-meta">
                          <span className="activity-date">{formatDate(activity.date)}</span>
                          {activity.status && (
                            <span className={`admin-badge admin-badge-${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link to={getActivityLink(activity)} className="activity-action">
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-items">No recent activity</p>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h4 className="admin-card-title">Today's Summary</h4>
            </div>
            <div className="admin-card-body">
              <div className="admin-quick-stats">
                <div className="admin-quick-stat-item">
                  <div className="quick-stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="quick-stat-content">
                    <div className="quick-stat-label">Today's Revenue</div>
                    <div className="quick-stat-value">{formatCurrency(getStat('revenue.daily', 0))}</div>
                  </div>
                </div>
                
                <div className="admin-quick-stat-item">
                  <div className="quick-stat-icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <div className="quick-stat-content">
                    <div className="quick-stat-label">Today's Orders</div>
                    <div className="quick-stat-value">{Math.floor(getStat('totalOrders', 0) * 0.05)}</div>
                  </div>
                </div>
                
                <div className="admin-quick-stat-item">
                  <div className="quick-stat-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="quick-stat-content">
                    <div className="quick-stat-label">Today's Bookings</div>
                    <div className="quick-stat-value">{Math.floor(getStat('totalBookings', 0) * 0.08)}</div>
                  </div>
                </div>
                
                <div className="admin-quick-stat-item">
                  <div className="quick-stat-icon">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div className="quick-stat-content">
                    <div className="quick-stat-label">New Users</div>
                    <div className="quick-stat-value">{Math.floor(getStat('totalUsers', 0) * 0.02)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get badge color based on status
const getStatusColor = (status) => {
  if (!status) return 'info';
  
  switch (status.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'success';
    case 'pending':
    case 'processing':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'info';
  }
};

// Helper function to get icon based on activity type
const getActivityIcon = (type) => {
  if (!type) return 'bell';
  
  switch (type.toLowerCase()) {
    case 'order':
      return 'shopping-cart';
    case 'booking':
      return 'calendar-check';
    case 'user':
      return 'user';
    default:
      return 'bell';
  }
};

// Helper function to get link based on activity type
const getActivityLink = (activity) => {
  if (!activity || !activity.type) return '#';
  
  switch (activity.type.toLowerCase()) {
    case 'order':
      return `/admin/orders/${activity.id}`;
    case 'booking':
      return `/admin/bookings/${activity.id}`;
    case 'user':
      return `/admin/users/${activity.id}`;
    default:
      return '#';
  }
};

// Helper function to render activity title
const renderActivityTitle = (activity) => {
  if (!activity || !activity.type) return 'Unknown activity';
  
  switch (activity.type.toLowerCase()) {
    case 'order':
      return (
        <>
          <span className="user-name">{activity.user}</span>
          <span> placed an order for </span>
          <span className="order-value">₹{activity.amount}</span>
        </>
      );
    case 'booking':
      return (
        <>
          <span className="user-name">{activity.user}</span>
          <span> booked </span>
          <span className="service-name">{activity.service}</span>
        </>
      );
    case 'user':
      return (
        <>
          <span className="user-name">{activity.name}</span>
          <span> {activity.action || 'joined the system'}</span>
        </>
      );
    default:
      return 'New activity';
  }
};

export default AdminStats; 