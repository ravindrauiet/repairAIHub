import { Link } from 'react-router-dom';
import '../styles/serviceCard.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-card-image">
        <img src={service.image} alt={service.title} />
        {service.discount && (
          <div className="discount-badge">
            {service.discount}% OFF
          </div>
        )}
      </div>
      <div className="service-card-content">
        <h3>{service.title}</h3>
        <p className="service-description">{service.shortDescription}</p>
        
        <div className="service-meta">
          <div className="service-price">
            <span className="price-label">Starting at</span>
            <span className="price-amount">₹{service.startingPrice}</span>
          </div>
          
          <div className="service-rating">
            <span className="rating-value">★ {service.rating}</span>
            <span className="rating-count">({service.reviewCount})</span>
          </div>
        </div>
        
        <div className="service-actions">
          <Link to={`/services/${service.id}`} className="view-details-btn">
            View Details
          </Link>
          <Link to={`/book-service`} state={{ service }} className="book-now-btn">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 