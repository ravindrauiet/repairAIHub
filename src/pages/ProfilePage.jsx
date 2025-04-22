import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeBookingFilter, setActiveBookingFilter] = useState('all');
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const { cartItems } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('ProfilePage: Firebase auth state changed:', currentUser ? 'User logged in' : 'No user');
      
      if (!currentUser) {
        // Redirect to login if not logged in
        navigate('/login', { state: { from: '/profile' } });
        return;
      }
      
      // Set user data from Firebase
      setUser({
        id: currentUser.uid,
        name: currentUser.displayName || 'User',
        email: currentUser.email,
        phone: currentUser.phoneNumber || '',
        avatar: currentUser.photoURL || '',
        address: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }
      });
      
      // Mock bookings data since we're not using the API
      const mockBookings = [
        {
          id: 'BKG-1001',
          service: {
            id: 'SRV-101',
            title: 'Phone Screen Repair',
            icon: 'mobile-alt'
          },
          date: new Date().toISOString(),
          time: '10:00 AM',
          status: 'active',
          address: '123 Main St, Mumbai',
          total: 2499
        },
        {
          id: 'BKG-1002',
          service: {
            id: 'SRV-102',
            title: 'Laptop Battery Replacement',
            icon: 'laptop'
          },
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          time: '2:00 PM',
          status: 'completed',
          address: '123 Main St, Mumbai',
          total: 3999
        },
        {
          id: 'BKG-1003',
          service: {
            id: 'SRV-103',
            title: 'Data Recovery',
            icon: 'hdd'
          },
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          time: '11:30 AM',
          status: 'cancelled',
          address: '123 Main St, Mumbai',
          total: 4999
        }
      ];
      
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      
      // Mock purchase history
      const mockPurchases = [
        {
          id: 'ORD-1001',
          date: new Date().toISOString(),
          status: 'delivered',
          total: 12999,
          items: [
            {
              id: 'PROD-101',
              name: 'iPhone Screen Protector',
              price: '₹999',
              quantity: 1,
              image: '/images/product-placeholder.jpg'
            },
            {
              id: 'PROD-102',
              name: 'Phone Case',
              variant: 'Black',
              price: '₹1999',
              quantity: 2,
              image: '/images/product-placeholder.jpg'
            }
          ]
        },
        {
          id: 'ORD-1002',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          total: 5499,
          items: [
            {
              id: 'PROD-201',
              name: 'USB-C Cable Fast Charging',
              price: '₹549',
              quantity: 1,
              image: '/images/product-placeholder.jpg'
            }
          ]
        }
      ];
      
      setPurchaseHistory(mockPurchases);
      setLoading(false);
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, [navigate]);
  
  const handleLogout = () => {
    // Sign out from Firebase
    auth.signOut();
    navigate('/login');
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const filterBookings = (status) => {
    setActiveBookingFilter(status);
    
    if (status === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === status));
    }
  };
  
  const countBookingsByStatus = (status) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(booking => booking.status === status).length;
  };
  
  const renderWishlistTab = () => (
    <div className="wishlist-tab">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <i className="fas fa-heart"></i>
          <p>Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-item">
              <div className="item-image">
                <img 
                  src={item.image || '/images/service-placeholder.jpg'} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/service-placeholder.jpg';
                  }}
                />
              </div>
              <div className="item-details">
                <h3>{item.title}</h3>
                <p>{item.description?.substring(0, 100) || 'No description available'}...</p>
                <div className="item-meta">
                  <span className="price">{typeof item.price === 'object' ? Object.values(item.price)[0] : item.price}</span>
                  <span className="rating">
                    <i className="fas fa-star"></i> {item.rating || '4.5'}
                  </span>
                </div>
                <div className="item-actions">
                  <Link to={`/products/${item.id}`} className="btn-secondary">View Details</Link>
                  <button 
                    className="remove-wishlist-btn"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <span>{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <ul className="profile-tabs">
              <li className={activeTab === 'dashboard' ? 'active' : ''}>
                <button onClick={() => handleTabChange('dashboard')}>
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </button>
              </li>
              <li className={activeTab === 'bookings' ? 'active' : ''}>
                <button onClick={() => handleTabChange('bookings')}>
                  <i className="fas fa-calendar-check"></i> Bookings
                  <span className="badge">{bookings.length}</span>
                </button>
              </li>
              <li className={activeTab === 'wishlist' ? 'active' : ''}>
                <button onClick={() => handleTabChange('wishlist')}>
                  <i className="fas fa-heart"></i> Wishlist
                  <span className="badge">{wishlist.length}</span>
                </button>
              </li>
              <li className={activeTab === 'purchases' ? 'active' : ''}>
                <button onClick={() => handleTabChange('purchases')}>
                  <i className="fas fa-shopping-bag"></i> Purchase History
                  <span className="badge">{purchaseHistory.length}</span>
                </button>
              </li>
              <li className={activeTab === 'addresses' ? 'active' : ''}>
                <button onClick={() => handleTabChange('addresses')}>
                  <i className="fas fa-map-marker-alt"></i> Addresses
                </button>
              </li>
              <li className={activeTab === 'settings' ? 'active' : ''}>
                <button onClick={() => handleTabChange('settings')}>
                  <i className="fas fa-cog"></i> Settings
                </button>
              </li>
            </ul>
          </div>
          
          <div className="profile-main">
            {activeTab === 'dashboard' && (
              <div className="profile-dashboard">
                <h2>Dashboard</h2>
                
                <div className="dashboard-summary">
                  <div className="summary-card">
                    <div className="card-content">
                      <h4>Total Bookings</h4>
                      <span className="card-value">{countBookingsByStatus('all')}</span>
                    </div>
                    <div className="card-icon bg-primary">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                  </div>
                  
                  <div className="summary-card">
                    <div className="card-content">
                      <h4>Completed</h4>
                      <span className="card-value">{countBookingsByStatus('completed')}</span>
                    </div>
                    <div className="card-icon bg-success">
                      <i className="fas fa-check-circle"></i>
                    </div>
                  </div>
                  
                  <div className="summary-card">
                    <div className="card-content">
                      <h4>Active</h4>
                      <span className="card-value">{countBookingsByStatus('active')}</span>
                    </div>
                    <div className="card-icon bg-warning">
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="card-content">
                      <h4>Wishlist</h4>
                      <span className="card-value">{wishlist.length}</span>
                    </div>
                    <div className="card-icon bg-accent">
                      <i className="fas fa-heart"></i>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-recent">
                  <div className="recent-bookings">
                    <h3>Recent Bookings</h3>
                    {bookings.length === 0 ? (
                      <p>You have no bookings yet.</p>
                    ) : (
                      <div className="recent-list">
                        {bookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="recent-item">
                            <div className="item-icon">
                              <i className={`fas fa-${booking.service.icon || 'wrench'}`}></i>
                            </div>
                            <div className="item-details">
                              <h4>{booking.service.title}</h4>
                              <p>{new Date(booking.date).toLocaleDateString()} | {booking.time}</p>
                              <span className={`status-badge ${booking.status}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link to="#" onClick={() => handleTabChange('bookings')} className="view-all">
                      View All Bookings
                    </Link>
                  </div>
                  
                  <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="action-buttons">
                      <Link to="/book-service" className="action-btn">
                        <i className="fas fa-calendar-plus"></i>
                        Book a Service
                      </Link>
                      <Link to="/products" className="action-btn">
                        <i className="fas fa-shopping-cart"></i>
                        View Products
                      </Link>
                      <Link to="/contact" className="action-btn">
                        <i className="fas fa-headset"></i>
                        Contact Support
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div className="profile-bookings">
                <h2>My Bookings</h2>
                
                <div className="booking-filters">
                  <button 
                    className={activeBookingFilter === 'all' ? 'active' : ''}
                    onClick={() => filterBookings('all')}
                  >
                    All ({countBookingsByStatus('all')})
                  </button>
                  <button 
                    className={activeBookingFilter === 'active' ? 'active' : ''}
                    onClick={() => filterBookings('active')}
                  >
                    Active ({countBookingsByStatus('active')})
                  </button>
                  <button 
                    className={activeBookingFilter === 'completed' ? 'active' : ''}
                    onClick={() => filterBookings('completed')}
                  >
                    Completed ({countBookingsByStatus('completed')})
                  </button>
                  <button 
                    className={activeBookingFilter === 'cancelled' ? 'active' : ''}
                    onClick={() => filterBookings('cancelled')}
                  >
                    Cancelled ({countBookingsByStatus('cancelled')})
                  </button>
                </div>
                
                {filteredBookings.length === 0 ? (
                  <div className="no-bookings">
                    <i className="fas fa-calendar-times"></i>
                    <p>No bookings found.</p>
                    <Link to="/book-service" className="btn-primary">Book a Service</Link>
                  </div>
                ) : (
                  <div className="bookings-list">
                    {filteredBookings.map(booking => (
                      <div key={booking.id} className="booking-card">
                        <div className="booking-header">
                          <div className="booking-title">
                            <h3>{booking.service.title}</h3>
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="booking-id">
                            Booking ID: <span>#{booking.id}</span>
                          </div>
                        </div>
                        
                        <div className="booking-details">
                          <div className="booking-detail">
                            <i className="fas fa-calendar"></i>
                            <div>
                              <span className="label">Date</span>
                              <span className="value">{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="booking-detail">
                            <i className="fas fa-clock"></i>
                            <div>
                              <span className="label">Time</span>
                              <span className="value">{booking.time}</span>
                            </div>
                          </div>
                          
                          <div className="booking-detail">
                            <i className="fas fa-map-marker-alt"></i>
                            <div>
                              <span className="label">Address</span>
                              <span className="value">{booking.address}</span>
                            </div>
                          </div>
                          
                          <div className="booking-detail">
                            <i className="fas fa-rupee-sign"></i>
                            <div>
                              <span className="label">Total</span>
                              <span className="value">₹{booking.total.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="booking-actions">
                          <Link to={`/services/${booking.service.id}`} className="btn-outline">
                            View Service
                          </Link>
                          {booking.status === 'active' && (
                            <button className="btn-outline btn-danger">
                              Cancel Booking
                            </button>
                          )}
                          {booking.status === 'completed' && (
                            <button className="btn-outline">
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && renderWishlistTab()}

            {activeTab === 'purchases' && (
              <div className="profile-purchases">
                <h2>Purchase History</h2>
                
                {purchaseHistory.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-shopping-bag"></i>
                    <h3>No purchase history</h3>
                    <p>You haven't made any purchases yet.</p>
                    <Link to="/products" className="btn-primary">
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="purchase-history">
                    {purchaseHistory.map(purchase => (
                      <div key={purchase.id} className="purchase-card">
                        <div className="purchase-header">
                          <div>
                            <span className="purchase-date">
                              {new Date(purchase.date).toLocaleDateString()}
                            </span>
                            <span className="purchase-id">Order #{purchase.id}</span>
                          </div>
                          <span className={`purchase-status ${purchase.status}`}>
                            {purchase.status}
                          </span>
                        </div>
                        
                        <div className="purchase-items">
                          {purchase.items.map(item => (
                            <div key={`${purchase.id}-${item.id}`} className="purchase-item">
                              <div className="purchase-item-image">
                                <img src={item.image} alt={item.name} />
                              </div>
                              <div className="purchase-item-details">
                                <h4>{item.name}</h4>
                                {item.variant && <p className="variant">Variant: {item.variant}</p>}
                                <div className="purchase-item-meta">
                                  <span className="item-price">{item.price}</span>
                                  <span className="item-quantity">x{item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="purchase-footer">
                          <div className="purchase-total">
                            Total: <strong>₹{purchase.total.toLocaleString('en-IN')}</strong>
                          </div>
                          <div className="purchase-actions">
                            <button className="btn-outline">
                              View Details
                            </button>
                            <button className="btn-outline">
                              Download Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div className="profile-addresses">
                <h2>Saved Addresses</h2>
                
                <div className="addresses-grid">
                  <div className="address-card">
                    <div className="address-default-badge">Default</div>
                    <h3>Home</h3>
                    <p>123 Main Street, Apartment 4B</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>Phone: +91 9876543210</p>
                    <div className="address-actions">
                      <button className="btn-outline">Edit</button>
                      <button className="btn-outline btn-danger">Delete</button>
                    </div>
                  </div>
                  
                  <div className="address-card">
                    <h3>Office</h3>
                    <p>456 Business Park, Floor 3</p>
                    <p>Mumbai, Maharashtra 400051</p>
                    <p>Phone: +91 9876543210</p>
                    <div className="address-actions">
                      <button className="btn-outline">Edit</button>
                      <button className="btn-outline btn-danger">Delete</button>
                    </div>
                  </div>
                  
                  <div className="add-address-card">
                    <div className="add-icon">
                      <i className="fas fa-plus"></i>
                    </div>
                    <h3>Add New Address</h3>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="profile-settings">
                <h2>Account Settings</h2>
                
                <div className="settings-section">
                  <h3>Personal Information</h3>
                  <form className="settings-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" defaultValue={user.name} />
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" defaultValue={user.email} />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" defaultValue="+91 9876543210" />
                    </div>
                    
                    <button type="submit" className="btn-primary">Save Changes</button>
                  </form>
                </div>
                
                <div className="settings-section">
                  <h3>Change Password</h3>
                  <form className="settings-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" />
                    </div>
                    
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" />
                    </div>
                    
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" />
                    </div>
                    
                    <button type="submit" className="btn-primary">Update Password</button>
                  </form>
                </div>
                
                <div className="settings-section">
                  <h3>Notification Preferences</h3>
                  <div className="settings-form">
                    <div className="form-check">
                      <input type="checkbox" id="email_notifications" defaultChecked />
                      <label htmlFor="email_notifications">
                        Email Notifications
                        <span className="text-muted">Receive booking updates and special offers via email</span>
                      </label>
                    </div>
                    
                    <div className="form-check">
                      <input type="checkbox" id="sms_notifications" defaultChecked />
                      <label htmlFor="sms_notifications">
                        SMS Notifications
                        <span className="text-muted">Receive booking reminders via SMS</span>
                      </label>
                    </div>
                    
                    <div className="form-check">
                      <input type="checkbox" id="marketing_emails" />
                      <label htmlFor="marketing_emails">
                        Marketing Emails
                        <span className="text-muted">Receive news and promotional offers</span>
                      </label>
                    </div>
                    
                    <button className="btn-primary">Save Preferences</button>
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