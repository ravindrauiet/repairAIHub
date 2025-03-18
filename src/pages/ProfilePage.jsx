import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [addressList, setAddressList] = useState([]);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!loggedInUser || !loggedInUser.isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setUser(loggedInUser);
    
    // Get user's bookings from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.id === loggedInUser.id);
    
    if (currentUser) {
      setBookings(currentUser.bookings || []);
      setAddressList(currentUser.addresses || []);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-primary';
      case 'in-progress':
        return 'badge-info';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };
  
  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p className="member-since">Member since {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button className="profile-edit-btn">Edit Profile</button>
            <button className="profile-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <nav className="profile-nav">
              <button 
                className={`profile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                My Addresses
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Account Settings
              </button>
            </nav>
          </div>
          
          <div className="profile-main">
            {activeTab === 'dashboard' && (
              <div className="dashboard-tab">
                <h3 className="tab-title">Dashboard</h3>
                
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <div className="stat-value">{bookings.length}</div>
                    <div className="stat-label">Total Bookings</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {bookings.filter(booking => booking.status === 'completed').length}
                    </div>
                    <div className="stat-label">Completed</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {bookings.filter(booking => ['pending', 'confirmed', 'in-progress'].includes(booking.status)).length}
                    </div>
                    <div className="stat-label">Active</div>
                  </div>
                </div>
                
                <div className="recent-bookings">
                  <div className="section-header">
                    <h4>Recent Bookings</h4>
                    <button 
                      className="view-all-btn"
                      onClick={() => setActiveTab('bookings')}
                    >
                      View All
                    </button>
                  </div>
                  
                  {bookings.length > 0 ? (
                    <div className="booking-list">
                      {bookings.slice(0, 3).map(booking => (
                        <div className="booking-item" key={booking.id}>
                          <div className="booking-service">
                            <h5>{booking.serviceName}</h5>
                            <div className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                              {booking.status}
                            </div>
                          </div>
                          <div className="booking-details">
                            <div>
                              <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div>
                              <strong>Time:</strong> {booking.time}
                            </div>
                          </div>
                          <div className="booking-actions">
                            <button className="booking-details-btn">Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>You haven't booked any services yet.</p>
                      <Link to="/services" className="book-now-btn">Book a Service Now</Link>
                    </div>
                  )}
                </div>
                
                <div className="quick-actions">
                  <h4>Quick Actions</h4>
                  <div className="action-buttons">
                    <Link to="/book-service" className="action-btn">
                      Book a Service
                    </Link>
                    <Link to="/products" className="action-btn">
                      Browse Products
                    </Link>
                    <Link to="/contact" className="action-btn">
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div className="bookings-tab">
                <h3 className="tab-title">My Bookings</h3>
                
                <div className="bookings-filter">
                  <select className="filter-select">
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                {bookings.length > 0 ? (
                  <div className="bookings-list">
                    {bookings.map(booking => (
                      <div className="booking-card" key={booking.id}>
                        <div className="booking-header">
                          <div className="booking-service-name">{booking.serviceName}</div>
                          <div className={`booking-status-badge ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </div>
                        </div>
                        
                        <div className="booking-body">
                          <div className="booking-info">
                            <div className="booking-info-item">
                              <span className="info-label">Booking ID:</span>
                              <span className="info-value">{booking.id}</span>
                            </div>
                            <div className="booking-info-item">
                              <span className="info-label">Date:</span>
                              <span className="info-value">{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="booking-info-item">
                              <span className="info-label">Time:</span>
                              <span className="info-value">{booking.time}</span>
                            </div>
                            <div className="booking-info-item">
                              <span className="info-label">Address:</span>
                              <span className="info-value">{booking.address}</span>
                            </div>
                            <div className="booking-info-item">
                              <span className="info-label">Total:</span>
                              <span className="info-value price">₹{booking.totalAmount}</span>
                            </div>
                          </div>
                          
                          {booking.status === 'in-progress' && (
                            <div className="booking-progress">
                              <h5>Service Progress</h5>
                              <div className="progress-bar">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ width: `${booking.progress || 30}%` }}
                                ></div>
                              </div>
                              <div className="progress-labels">
                                <span>Started</span>
                                <span>In Progress</span>
                                <span>Completed</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="booking-footer">
                          <button className="booking-action-btn">View Details</button>
                          {booking.status === 'pending' && (
                            <button className="booking-action-btn cancel">Cancel Booking</button>
                          )}
                          {booking.status === 'completed' && (
                            <button className="booking-action-btn feedback">Leave Feedback</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>You haven't booked any services yet.</p>
                    <Link to="/services" className="book-now-btn">Book a Service Now</Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div className="addresses-tab">
                <h3 className="tab-title">My Addresses</h3>
                
                <div className="addresses-container">
                  <button className="add-address-btn">
                    + Add New Address
                  </button>
                  
                  {addressList.length > 0 ? (
                    <div className="address-list">
                      {addressList.map((address, index) => (
                        <div className="address-card" key={index}>
                          <div className="address-info">
                            <h4 className="address-name">{address.type || 'Address'} {index + 1}</h4>
                            <p className="address-text">{address.text}</p>
                            <p className="address-contact">
                              <span>{address.name}</span> • <span>{address.phone}</span>
                            </p>
                          </div>
                          <div className="address-actions">
                            <button className="address-edit-btn">Edit</button>
                            <button className="address-delete-btn">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>You haven't added any addresses yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h3 className="tab-title">Account Settings</h3>
                
                <div className="settings-form">
                  <div className="form-section">
                    <h4 className="section-title">Personal Information</h4>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-input" value={user.name} readOnly />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" value={user.email} readOnly />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input type="tel" className="form-input" placeholder="Add your phone number" />
                      </div>
                    </div>
                    
                    <button className="update-btn">Update Information</button>
                  </div>
                  
                  <div className="form-section">
                    <h4 className="section-title">Change Password</h4>
                    
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-input" placeholder="Enter current password" />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-input" placeholder="Enter new password" />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-input" placeholder="Confirm new password" />
                    </div>
                    
                    <button className="update-btn">Change Password</button>
                  </div>
                  
                  <div className="form-section">
                    <h4 className="section-title">Notification Preferences</h4>
                    
                    <div className="form-checkbox">
                      <input type="checkbox" id="emailNotifications" checked />
                      <label htmlFor="emailNotifications">Email Notifications</label>
                    </div>
                    
                    <div className="form-checkbox">
                      <input type="checkbox" id="smsNotifications" />
                      <label htmlFor="smsNotifications">SMS Notifications</label>
                    </div>
                    
                    <div className="form-checkbox">
                      <input type="checkbox" id="marketingEmails" checked />
                      <label htmlFor="marketingEmails">Marketing Emails</label>
                    </div>
                    
                    <button className="update-btn">Update Preferences</button>
                  </div>
                  
                  <div className="form-section danger-zone">
                    <h4 className="section-title">Danger Zone</h4>
                    <button className="delete-account-btn">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 