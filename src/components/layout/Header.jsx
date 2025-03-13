import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
            <li>
              <NavLink to="/services" className="nav-link" onClick={closeMobileMenu}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/services/tv-repair" className="nav-link" onClick={closeMobileMenu}>
                TV Repair
              </NavLink>
            </li>
            <li>
              <NavLink to="/services/mobile-repair" className="nav-link" onClick={closeMobileMenu}>
                Mobile Repair
              </NavLink>
            </li>
            <li>
              <NavLink to="/services/ac-repair" className="nav-link" onClick={closeMobileMenu}>
                AC Repair
              </NavLink>
            </li>
            <li>
              <NavLink to="/services/refrigerator-repair" className="nav-link" onClick={closeMobileMenu}>
                Refrigerator Repair
              </NavLink>
            </li>
            <li>
              <NavLink to="/services/ro-repair" className="nav-link" onClick={closeMobileMenu}>
                RO Repair
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