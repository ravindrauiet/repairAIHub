import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ServiceCard = ({ service, brandModel }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      id: service.id,
      title: service.title,
      price: Object.values(service.price)[0].split(' - ')[0],
      image: service.image,
      quantity: 1,
      brandModel: brandModel || ''
    });
  };
  
  // Get the first price from the price object
  const firstPrice = Object.values(service.price)[0];
  
  return (
    <div className="service-card">
      <div className="service-image">
        <img 
          src={service.image} 
          alt={service.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/service-placeholder.jpg';
          }}
        />
      </div>
      <div className="service-details">
        <h3>{service.title}</h3>
        {brandModel && <div className="model-badge">{brandModel}</div>}
        <p>{service.description.substring(0, 100)}...</p>
        <div className="service-meta">
          <div className="service-price">{firstPrice}</div>
          <div className="service-rating">
            <i className="fas fa-star"></i> {service.rating} ({service.reviewCount})
          </div>
        </div>
        <div className="service-actions">
          <Link to={`/products/${service.id}`} className="view-details-btn">
            View Details
          </Link>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 