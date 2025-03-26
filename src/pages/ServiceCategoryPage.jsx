import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, productCategories } from '../data/products.jsx';
import BrandModelSelector from '../components/BrandModelSelector';
import '../styles/serviceCategory.css';

const ServiceCategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    // Get category details
    const catInfo = productCategories.find(cat => cat.id === category);
    setCategoryInfo(catInfo);

    // Get products for this category
    const categoryProducts = getProductsByCategory(category);
    setProducts(categoryProducts);
    setLoading(false);
  }, [category]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="error-container">
        <h2>Category not found</h2>
        <p>The service category you're looking for doesn't exist.</p>
        <Link to="/services" className="btn-primary">Browse All Services</Link>
      </div>
    );
  }

  return (
    <div className="service-category-page">
      <div className="category-header">
        <div className="container">
          <h1>
            <i className={`fas ${categoryInfo.icon}`}></i>
            {categoryInfo.name} Repair & Services
          </h1>
          <p>Find the perfect repair solution for your {categoryInfo.name.toLowerCase()}</p>
        </div>
      </div>

      <div className="container">
        <div className="category-content">
          <section className="brand-model-section">
            <h2>Select Your {categoryInfo.name} Model</h2>
            <p>Choose your brand and model to see specific repair options</p>
            <BrandModelSelector category={category} />
          </section>

          <section className="popular-services">
            <h2>Popular {categoryInfo.name} Services</h2>
            <div className="services-grid">
              {products.slice(0, 6).map(product => (
                <div key={product.id} className="service-card">
                  <div className="service-image">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/service-placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="service-details">
                    <h3>{product.title}</h3>
                    <p>{product.description.substring(0, 100)}...</p>
                    <div className="service-meta">
                      <div className="service-price">{Object.values(product.price)[0]}</div>
                      <div className="service-rating">
                        <i className="fas fa-star"></i> {product.rating} ({product.reviewCount})
                      </div>
                    </div>
                    <div className="service-actions">
                      <Link to={`/products/${product.id}`} className="view-details-btn">
                        View Details
                      </Link>
                      <button className="add-to-cart-btn">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length > 6 && (
              <div className="view-all-container">
                <Link to={`/products?category=${category}`} className="btn-secondary">
                  View All {categoryInfo.name} Services
                </Link>
              </div>
            )}
          </section>

          <section className="why-choose-section">
            <h2>Why Choose Our {categoryInfo.name} Repair Services</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <h3>Genuine Parts</h3>
                <p>We use only authentic components for all our repairs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Warranty Protection</h3>
                <p>All our repairs come with service warranty</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-tools"></i>
                </div>
                <h3>Expert Technicians</h3>
                <p>Skilled professionals with years of experience</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-truck"></i>
                </div>
                <h3>Doorstep Service</h3>
                <p>Convenient repairs at your location</p>
              </div>
            </div>
          </section>

          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faqs">
              <div className="faq-item">
                <h3>How long does a typical {categoryInfo.name.toLowerCase()} repair take?</h3>
                <p>Most {categoryInfo.name.toLowerCase()} repairs are completed within 1-3 hours, depending on the complexity of the issue. Major repairs may take up to 24 hours.</p>
              </div>
              <div className="faq-item">
                <h3>Do you offer warranty on {categoryInfo.name.toLowerCase()} repairs?</h3>
                <p>Yes, we provide a warranty on all our {categoryInfo.name.toLowerCase()} repairs, ranging from 3 months to 1 year depending on the service.</p>
              </div>
              <div className="faq-item">
                <h3>Can I get my {categoryInfo.name.toLowerCase()} repaired at home?</h3>
                <p>Yes, we offer doorstep repair services for most {categoryInfo.name.toLowerCase()} issues. Our technician will visit your location at your preferred time slot.</p>
              </div>
              <div className="faq-item">
                <h3>What happens if my {categoryInfo.name.toLowerCase()} can't be repaired?</h3>
                <p>If your device cannot be repaired, we'll provide a detailed assessment and recommend replacement options. You'll only be charged for the diagnosis fee.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoryPage; 