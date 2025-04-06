import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAllServices } from '../../data/services';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const services = getAllServices();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { cartCount } = useCart();

  // Group services by category
  const serviceCategories = services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      console.log('Header: Checking login token:', token ? 'Token exists' : 'No token');
      
      if (token) {
        try {
          console.log('Header: Fetching user profile');
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              'x-auth-token': token
            }
          });
          
          console.log('Header: User profile response:', response.data);
          const userData = response.data.user;
          setUser(userData);
          
          // Check if user has admin role
          setIsAdmin(userData.roles && userData.roles.includes('admin'));
          console.log('Header: User is admin:', userData.roles && userData.roles.includes('admin'));
        } catch (err) {
          console.error('Header: Error fetching user profile:', err.response?.data || err.message);
          localStorage.removeItem('token');
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };
    
    checkLoginStatus();
    
    // Listen for storage events to update when login/logout happens in other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'token') {
        checkLoginStatus();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    };

    // Only add listener if dropdown is open
    if (servicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [servicesDropdownOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleServicesDropdown = (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setServicesDropdownOpen(!servicesDropdownOpen);
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) {
      setServicesDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setServicesDropdownOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="RepairAIHub Logo" />
          RepAIrHub
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <nav>
          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home 
              </NavLink>
            </li>
            
            <li 
              className={`nav-item dropdown ${servicesDropdownOpen ? 'show' : ''}`} 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a 
                href="#" 
                className="nav-link dropdown-toggle"
                onClick={toggleServicesDropdown}
              >
                Services
                <i className={`dropdown-icon fas fa-chevron-${servicesDropdownOpen ? 'up' : 'down'}`}></i>
              </a>
              
              <div className={`dropdown-menu dropdown-menu-grid ${servicesDropdownOpen ? 'show' : ''}`}>
                {Object.keys(serviceCategories).map((category) => (
                  <div key={category} className="dropdown-category">
                    <h6 className="dropdown-header">{category}</h6>
                    {serviceCategories[category].map(service => (
                      <NavLink 
                        key={service.id}
                        to={`/services/${service.id}`} 
                        className={({isActive}) => isActive ? "dropdown-item active" : "dropdown-item"}
                      >
                        <i className={`fas fa-${service.icon || 'wrench'}`}></i>
                        {service.title}
                      </NavLink>
                    ))}
                  </div>
                ))}
                
                <div className="dropdown-actions">
                  <NavLink 
                    to="/services" 
                    className="dropdown-action-item"
                  >
                    <i className="fas fa-th-list"></i> View All Services
                  </NavLink>
                  
                  <NavLink 
                    to="/book-service" 
                    className="dropdown-action-item highlight"
                  >
                    <i className="fas fa-calendar-check"></i> Book a Service
                  </NavLink>
                </div>
              </div>
            </li>
            
            {/* <li className="nav-item">
              <NavLink to="/services" className="nav-link">Services</NavLink>
            </li> */}
            
            <li className="nav-item">
              <NavLink to="/products" className="nav-link">Product Guide</NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="/technicians" className="nav-link">
                Our Technicians
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">Contact</NavLink>
            </li>
            
            <li className="nav-item cart-item">
              <NavLink to="/cart" className="nav-link cart-link">
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </NavLink>
            </li>
            
            {user ? (
              <li className="auth-links">
                <div className="user-dropdown">
                  <div className="profile-link">
                    <span className="profile-icon">{user.name.charAt(0).toUpperCase()}</span>
                    <span className="profile-name">{user.name}</span>
                    <i className="fas fa-caret-down"></i>
                  </div>
                  <div className="user-dropdown-menu">
                    <NavLink to="/profile" className="dropdown-item">
                      <i className="fas fa-user"></i> My Profile
                    </NavLink>
                    {isAdmin && (
                      <NavLink to="/admin" className="dropdown-item">
                        <i className="fas fa-cog"></i> Admin Dashboard
                      </NavLink>
                    )}
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}
                    >
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li className="auth-links">
                <NavLink to="/login" className="login-link">
                  Login
                </NavLink>
                <NavLink to="/signup" className="signup-link">
                  Sign Up
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 