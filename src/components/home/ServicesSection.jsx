import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';
import './ServicesSection.css';

// SVG Icons components
const TvIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="service-icon">
    <path d="M512 448H127.1C110.3 448 96 462.3 96 479.1S110.3 512 127.1 512h384C529.7 512 544 497.7 544 480S529.7 448 512 448zM592 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h544c26.5 0 48-21.5 48-48v-320C640 21.5 618.5 0 592 0zM576 352H64v-288h512V352z"/>
  </svg>
);

const RefrigeratorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="service-icon">
    <path d="M336 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48v-416C384 21.49 362.5 0 336 0zM192 64c8.844 0 16 7.156 16 16S200.8 96 192 96S176 88.84 176 80S183.2 64 192 64zM64 128h256v192H64V128zM192 448c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32s32 14.33 32 32C224 433.7 209.7 448 192 448z"/>
  </svg>
);

const WashingMachineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="service-icon">
    <path d="M224 96c-53 0-96 43-96 96s43 96 96 96s96-43 96-96S277 96 224 96zM320 0H128C92.65 0 64 28.65 64 64v384c0 35.35 28.65 64 64 64h192c35.35 0 64-28.65 64-64V64C384 28.65 355.3 0 320 0zM320 48c13.23 0 24 10.77 24 24S333.2 96 320 96S296 85.23 296 72S306.8 48 320 48zM256 48c13.23 0 24 10.77 24 24S269.2 96 256 96S232 85.23 232 72S242.8 48 256 48zM224 384c-70.58 0-128-57.42-128-128s57.42-128 128-128s128 57.42 128 128S294.6 384 224 384z"/>
  </svg>
);

const MobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="service-icon">
    <path d="M304 0h-224c-35.35 0-64 28.65-64 64v384c0 35.35 28.65 64 64 64h224c35.35 0 64-28.65 64-64V64C368 28.65 339.3 0 304 0zM192 480c-17.75 0-32-14.25-32-32s14.25-32 32-32s32 14.25 32 32S209.8 480 192 480zM304 64v320h-224V64H304z"/>
  </svg>
);

const LaptopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="service-icon">
    <path d="M128 96h384v256h64V80C576 53.63 554.4 32 528 32h-416C85.63 32 64 53.63 64 80V352h64V96zM624 384h-608C7.25 384 0 391.3 0 400V416c0 35.25 28.75 64 64 64h512c35.25 0 64-28.75 64-64v-16C640 391.3 632.8 384 624 384z"/>
  </svg>
);

const AcIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="service-icon">
    <path d="M544 0H32C14.38 0 0 14.38 0 32v160c0 17.62 14.38 32 32 32h512c17.62 0 32-14.38 32-32V32C576 14.38 561.6 0 544 0zM112 128c-17.62 0-32-14.38-32-32s14.38-32 32-32s32 14.38 32 32S129.6 128 112 128zM544 320h-512c-17.62 0-32 14.38-32 32v160c0 17.62 14.38 32 32 32h512c17.62 0 32-14.38 32-32v-160C576 334.4 561.6 320 544 320zM112 448c-17.62 0-32-14.38-32-32s14.38-32 32-32s32 14.38 32 32S129.6 448 112 448z"/>
  </svg>
);

// Map service ID to specific icon
const getServiceIcon = (serviceId) => {
  switch(serviceId) {
    case 'tv-repair':
      return <TvIcon />;
    case 'refrigerator-repair':
      return <RefrigeratorIcon />;
    case 'washing-machine-repair':
      return <WashingMachineIcon />;
    case 'mobile-repair':
      return <MobileIcon />;
    case 'laptop-repair':
      return <LaptopIcon />;
    case 'ac-repair':
      return <AcIcon />;
    default:
      return <WashingMachineIcon />;
  }
};

// Star rating component
const ServiceRating = ({ rating }) => {
  return (
    <div className="service-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <i 
          key={star} 
          className={`fas fa-star ${star <= rating ? 'filled' : ''}`}
        ></i>
      ))}
      <span className="rating-number">{rating.toFixed(1)}</span>
    </div>
  );
};

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get featured services from Firestore
        const featuredServices = await firestoreService.getFeaturedServices(6);
        
        // Get all categories
        const allCategories = await firestoreService.getAllCategories();
        const categoryNames = allCategories.map(cat => cat.name);
        
        setServices(featuredServices);
        setCategories(categoryNames);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
        setLoading(false);
        
        // Fallback to hardcoded data if Firestore fails
        // This is temporary while we migrate to Firestore
        import('../../data/services').then(module => {
          const { getAllServiceCategories, getServicesByCategory } = module;
          const cats = getAllServiceCategories();
          const allServices = cats.flatMap(category => getServicesByCategory(category));
          const topServices = allServices.slice(0, 6);
          
          setServices(topServices);
          setCategories(cats);
          setLoading(false);
        });
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <section className="services-section">
      <div className="services-bg-element"></div>
      <div className="container">
        <div className="services-header">
          <div className="section-heading">
            <h2 className="section-title">Our Repair Services</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Professional repair services for all your electronic and home appliance needs</p>
          </div>
        </div>
        
        {loading ? (
          <div className="services-loading">
            <div className="spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <div className="services-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="service-card-inner">
                  <div className="service-image-container">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title} 
                      className="service-image" 
                    />
                    <div className="service-category-tag">
                      {service.category}
                    </div>
                  </div>
                  
                  <div className="service-content">
                    <div className="service-icon-wrapper">
                      {getServiceIcon(service.id)}
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.shortDescription}</p>
                    
                    <div className="service-meta">
                      <div className="service-price">{service.priceRange}</div>
                      <ServiceRating rating={service.rating || 4.5} />
                    </div>
                    
                    <Link to={`/services/${service.id}`} className="service-learn-more">
                      <span>Learn More</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="services-cta">
          <Link to="/services" className="btn btn-primary">
            <span>View All Services</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
          <Link to="/book-service" className="btn btn-outline">
            <i className="fas fa-calendar-alt"></i>
            <span>Book a Service</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 