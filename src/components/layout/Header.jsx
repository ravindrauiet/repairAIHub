import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
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

  // Check if user is logged in using Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('Header: Firebase user logged in:', currentUser.displayName);
        setUser({
          name: currentUser.displayName || 'User',
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          uid: currentUser.uid,
          createdAt: currentUser.metadata.creationTime
        });
        
        // You can implement admin check here if needed
        // For now, no admin role is set
        setIsAdmin(false);
      } else {
        console.log('Header: No Firebase user logged in');
        setUser(null);
        setIsAdmin(false);
      }
    });
    
    return () => unsubscribe();
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

  const handleLogout = () => {
    auth.signOut();
    window.location.href = '/login';
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
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.name} 
                        className="profile-photo"
                        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                      />
                    ) : (
                      <span className="profile-icon">{user.name.charAt(0).toUpperCase()}</span>
                    )}
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
                      onClick={handleLogout}
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
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 