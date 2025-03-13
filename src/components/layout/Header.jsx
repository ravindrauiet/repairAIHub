import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAllServices } from '../../data/services';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const services = getAllServices();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  const closeServicesDropdown = () => {
    setServicesDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <div className="logo-text">
            Repair<span>AI</span>Hub
          </div>
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav>
          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <NavLink to="/" className="nav-link" onClick={closeMobileMenu}>
                Home
              </NavLink>
            </li>
            
            <li className="dropdown-container">
              <div 
                className={`nav-link dropdown-trigger ${servicesDropdownOpen ? 'active' : ''}`} 
                onClick={toggleServicesDropdown}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                Services {servicesDropdownOpen ? '▲' : '▼'}
              </div>
              
              <ul 
                className={`dropdown-menu ${servicesDropdownOpen ? 'active' : ''}`}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                {services.map(service => (
                  <li key={service.id}>
                    <NavLink 
                      to={`/services/${service.id}`} 
                      className="dropdown-item" 
                      onClick={() => {
                        closeServicesDropdown();
                        closeMobileMenu();
                      }}
                    >
                      {service.title}
                    </NavLink>
                  </li>
                ))}
                
                <li className="dropdown-divider"></li>
                
                <li>
                  <NavLink 
                    to="/services" 
                    className="dropdown-item all-services" 
                    onClick={() => {
                      closeServicesDropdown();
                      closeMobileMenu();
                    }}
                  >
                    All Services
                  </NavLink>
                </li>
              </ul>
            </li>
            
            <li>
              <NavLink to="/products" className="nav-link" onClick={closeMobileMenu}>
                Products
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/technicians" className="nav-link" onClick={closeMobileMenu}>
                Our Technicians
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/book-service" className="nav-link" onClick={closeMobileMenu}>
                Book Service
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/contact" className="nav-link" onClick={closeMobileMenu}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 