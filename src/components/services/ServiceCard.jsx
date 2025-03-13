import { Link } from 'react-router-dom';

const ServiceCard = ({ id, title, description, imageUrl }) => {
  return (
    <div className="service-card">
      <img 
        src={imageUrl || `/images/services/${id}.jpg`} 
        alt={title} 
        className="service-card-img" 
      />
      <div className="service-card-content">
        <h3 className="service-card-title">{title}</h3>
        <p className="service-card-text">
          {description.length > 120 
            ? `${description.slice(0, 120)}...` 
            : description
          }
        </p>
        <Link to={`/services/${id}`} className="service-card-link">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard; 