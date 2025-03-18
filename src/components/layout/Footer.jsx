import { Link } from 'react-router-dom';
import ClickableContact from '../common/ClickableContact';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-column">
            <h4>RepairAIHub</h4>
            <p>Your trusted partner for all repair services in India. We specialize in fixing TVs, mobile phones, AC units, refrigerators, and RO systems with quality and care.</p>
            <div className="social-icons">
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                f
              </a>
              <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                t
              </a>
              <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                i
              </a>
              <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                in
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Our Services</h4>
            <ul>
              <li>
                <Link to="/services/tv-repair">TV Repair</Link>
              </li>
              <li>
                <Link to="/services/mobile-repair">Mobile Repair</Link>
              </li>
              <li>
                <Link to="/services/ac-repair">AC Repair</Link>
              </li>
              <li>
                <Link to="/services/refrigerator-repair">Refrigerator Repair</Link>
              </li>
              <li>
                <Link to="/services/ro-repair">RO System Repair</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/technicians">Our Technicians</Link>
              </li>
              <li>
                <Link to="/book-service">Book a Service</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Contact Info</h4>
            <ul>
              <li>42/A, Raj Nagar, Sector 9</li>
              <li>New Delhi, 110085</li>
              <li>Phone: <ClickableContact type="phone" value="+91 98765 43210" /></li>
              <li>Email: <ClickableContact type="email" value="info@repairaihub.com" /></li>
              <li>Hours: Monday-Saturday, 9am-7pm</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RepairAIHub. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 