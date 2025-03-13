import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getServiceById } from '../data/services';
import FAQ from '../components/common/FAQ';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = getServiceById(serviceId);
  
  useEffect(() => {
    // If service doesn't exist, redirect to services page
    if (!service) {
      navigate('/services');
    }
  }, [service, navigate]);
  
  if (!service) {
    return null;
  }

  return (
    <div className="service-detail">
      <div className="container">
        <div className="service-detail-header">
          <img 
            src={service.imageUrl} 
            alt={service.title} 
            className="service-detail-image" 
          />
          <div className="service-detail-title-container">
            <h1 className="service-detail-title">{service.title}</h1>
            <p className="service-detail-subtitle">{service.shortDescription}</p>
            <Link to="/book-service" className="hero-cta">
              Book This Service
            </Link>
          </div>
        </div>
        
        <div className="service-detail-content">
          <div className="service-detail-description">
            <div className="description-text">
              {service.fullDescription.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <h3>Benefits</h3>
            <ul>
              {service.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            
            <h3>Our Process</h3>
            <ol>
              {service.process.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            
            <FAQ faqs={service.faqs} />
          </div>
          
          <div className="service-detail-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Service Features</h3>
              <ul className="service-features">
                {service.benefits.slice(0, 5).map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div className="sidebar-section">
              <h3 className="sidebar-title">Pricing</h3>
              <div className="pricing-list">
                {service.pricing.map((item, index) => (
                  <div key={index} className="pricing-item">
                    <span>{item.service}</span>
                    <span className="text-primary">{item.price}</span>
                  </div>
                ))}
              </div>
              <p className="pricing-note">
                * Prices may vary depending on the specific model and issue
              </p>
            </div>
            
            <Link to="/book-service" className="book-service-btn">
              Book This Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage; 