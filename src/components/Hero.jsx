import { useState } from 'react';
import { Link } from 'react-router-dom';
import services from '../data/services';
import '../styles/hero.css';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-left">
          <h1>Home services at your doorstep</h1>
          <p>Professional repair services for all your electronic devices</p>
          
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search for AC service, TV repair, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <span className="material-icons">search</span>
                </button>
              </div>
            </form>
          </div>
          
          <div className="service-selector">
            <h3>What are you looking for?</h3>
            <div className="service-grid">
              {services.slice(0, 6).map(service => (
                <div 
                  key={service.id}
                  className={`service-item ${selectedService === service.id ? 'active' : ''}`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div className="service-icon">
                    <img src={service.imageUrl} alt={service.title} />
                  </div>
                  <div className="service-name">{service.title}</div>
                  {service.isNew && <span className="new-badge">NEW</span>}
                </div>
              ))}
            </div>
            
            {selectedService && (
              <Link to={`/services/${selectedService}`} className="view-service-btn">
                View Service
              </Link>
            )}
          </div>
        </div>
        
        <div className="hero-right">
          <div className="hero-images">
            <img 
              src="/images/hero/technician-1.jpg" 
              alt="Technician repairing a device" 
              className="hero-image-1"
            />
            <img 
              src="/images/hero/technician-2.jpg" 
              alt="Technician repairing an appliance" 
              className="hero-image-2"
            />
            <img 
              src="/images/hero/technician-3.jpg" 
              alt="Satisfied customer" 
              className="hero-image-3"
            />
          </div>
        </div>
      </div>
      
      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-value">4.8</div>
          <div className="stat-label">Service Rating</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">12M+</div>
          <div className="stat-label">Customers Globally</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;