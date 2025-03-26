import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getServiceById } from '../data/services';
import FAQ from '../components/common/FAQ';
import BrandModelSelector from '../components/BrandModelSelector';
import { getProductsByCategory, productCategories } from '../data/products.jsx';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [activePricing, setActivePricing] = useState(1); // Index of selected pricing plan
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch service data
    const fetchService = () => {
      setLoading(true);
      try {
        const serviceData = getServiceById(serviceId);
        
        if (serviceData) {
          setService(serviceData);
          
          // Map service ID to corresponding product category
          const serviceToProductMap = {
            'tv-repair': 'tv',
            'mobile-repair': 'mobile',
            'laptop-repair': 'laptop',
            'ac-repair': 'ac',
            'refrigerator-repair': 'refrigerator',
            'washing-machine-repair': 'washing-machine',
            'water-purifier-repair': 'water-purifier'
          };
          
          const productCategoryId = serviceToProductMap[serviceId] || serviceId;
          
          // Find category info using the mapped product category ID
          const catInfo = productCategories.find(cat => cat.id === productCategoryId);
          setCategoryInfo(catInfo);
          
          // Get products for this category
          if (productCategoryId) {
            console.log("Fetching products for category:", productCategoryId);
            const categoryProducts = getProductsByCategory(productCategoryId);
            console.log("Products found:", categoryProducts.length);
            setProducts(categoryProducts);
          }
        } else {
          // Service not found, redirect to services page
          navigate('/services');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [serviceId, navigate]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="error-container">
        <h2>Service Not Found</h2>
        <p>Sorry, the service you're looking for doesn't exist.</p>
        <Link to="/services" className="btn-primary">View All Services</Link>
      </div>
    );
  }

  // Service Promotion component - shows for category pages
  const ServicePromotion = () => (
    <section className="service-promotion">
      <div className="promotion-content">
        <h2>Find {service.title} Repair Services For Your Specific Model</h2>
        <p>
          {service.title} repair needs vary greatly depending on the brand and model. We offer specialized repair 
          services for all major {service.title.toLowerCase()} brands including popular manufacturers in the market.
        </p>
        <div className="promotion-features">
          <div className="promotion-feature">
            <i className="fas fa-tools"></i>
            <span>Model-specific repair guides</span>
          </div>
          <div className="promotion-feature">
            <i className="fas fa-video"></i>
            <span>DIY repair tutorials</span>
          </div>
          <div className="promotion-feature">
            <i className="fas fa-tag"></i>
            <span>Genuine replacement parts</span>
          </div>
          <div className="promotion-feature">
            <i className="fas fa-shield-alt"></i>
            <span>Extended warranty options</span>
          </div>
        </div>
        <p className="promotion-cta-text">
          Select your {service.title.toLowerCase()} brand and model below to see repair options tailored specifically for your device.
        </p>
      </div>
    </section>
  );
  
  return (
    <div className="service-detail-page">
      <div className="service-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${service.imageUrl})` }}>
        <div className="container">
          <div className="service-hero-content">
            <h1>{service.title}</h1>
            <p>{service.shortDescription}</p>
            <div className="service-hero-actions">
              <Link to="/book-service" className="btn-primary">Book Now</Link>
              <button 
                className="btn-outline-light" 
                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="service-detail-container">
          <div className="service-navigation">
            <div className="breadcrumb">
              <Link to="/">Home</Link> / 
              <Link to="/services">Services</Link> / 
              <span>{service.title}</span>
            </div>
            
            <div className="service-tabs">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
                onClick={() => setActiveTab('pricing')}
              >
                Pricing
              </button>
              <button 
                className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
                onClick={() => setActiveTab('faq')}
              >
                FAQs
              </button>
              <button 
                className={`tab-btn ${activeTab === 'model-specific' ? 'active' : ''}`}
                onClick={() => setActiveTab('model-specific')}
              >
                Model-Specific
              </button>
            </div>
          </div>
          
          <div className="service-content">
            {activeTab === 'description' && (
              <div className="service-tab-content">
                <h2>About {service.title}</h2>
                <div className="service-description">
                  {service.longDescription ? (
                    service.longDescription.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{service.longDescription || service.shortDescription}</p>
                  )}
                  
                  <div className="service-highlights">
                    <h3>Why Choose Our {service.title} Service?</h3>
                    <div className="highlights-grid">
                      <div className="highlight-item">
                        <div className="highlight-icon">
                          <i className="fas fa-tools"></i>
                        </div>
                        <h4>Expert Technicians</h4>
                        <p>Our certified professionals have years of experience with all brands and models.</p>
                      </div>
                      
                      <div className="highlight-item">
                        <div className="highlight-icon">
                          <i className="fas fa-shield-alt"></i>
                        </div>
                        <h4>Quality Guarantee</h4>
                        <p>All repairs come with a warranty and are completed using genuine parts.</p>
                      </div>
                      
                      <div className="highlight-item">
                        <div className="highlight-icon">
                          <i className="fas fa-clock"></i>
                        </div>
                        <h4>Fast Service</h4>
                        <p>We value your time and offer quick turnaround for most repair needs.</p>
                      </div>
                      
                      <div className="highlight-item">
                        <div className="highlight-icon">
                          <i className="fas fa-hand-holding-usd"></i>
                        </div>
                        <h4>Transparent Pricing</h4>
                        <p>No hidden fees with clear upfront pricing before any work begins.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div className="service-tab-content">
                <h2>What's Included</h2>
                <div className="features-list">
                  {service.features && service.features.map((feature, index) => (
                    <div className="feature-item" key={index}>
                      <div className="feature-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="feature-text">
                        <h3>{feature}</h3>
                        <p>Our {service.title.toLowerCase()} service includes this essential feature to ensure your device works perfectly.</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="service-process">
                  <h2>Our Service Process</h2>
                  <div className="process-steps">
                    <div className="process-step">
                      <div className="step-number">1</div>
                      <h3>Diagnosis</h3>
                      <p>Our technicians thoroughly examine your device to identify all issues.</p>
                    </div>
                    
                    <div className="process-step">
                      <div className="step-number">2</div>
                      <h3>Quote Approval</h3>
                      <p>We provide a detailed cost estimate for your approval before starting work.</p>
                    </div>
                    
                    <div className="process-step">
                      <div className="step-number">3</div>
                      <h3>Repair</h3>
                      <p>Our expert technicians fix the issues using quality parts and tools.</p>
                    </div>
                    
                    <div className="process-step">
                      <div className="step-number">4</div>
                      <h3>Quality Test</h3>
                      <p>We thoroughly test your device to ensure everything works perfectly.</p>
                    </div>
                    
                    <div className="process-step">
                      <div className="step-number">5</div>
                      <h3>Completion</h3>
                      <p>Your device is returned with a warranty and service guarantee.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'pricing' && (
              <div className="service-tab-content" id="pricing">
                <h2>Pricing Plans</h2>
                <p className="pricing-intro">We offer flexible pricing options to meet your needs. Choose the plan that works best for you:</p>
                
                <div className="pricing-plans">
                  <div className={`pricing-plan ${activePricing === 0 ? 'active' : ''}`} onClick={() => setActivePricing(0)}>
                    <div className="plan-header">
                      <h3>Basic Plan</h3>
                      <div className="plan-price">
                        <span className="price">₹{service.priceRange?.split(' - ')[0]?.replace('₹', '') || '299'}</span>
                        <span className="period">One-time</span>
                      </div>
                    </div>
                    <div className="plan-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Standard diagnosis</li>
                        <li><i className="fas fa-check"></i> Basic repairs</li>
                        <li><i className="fas fa-check"></i> 30-day warranty</li>
                        <li><i className="fas fa-times"></i> Premium parts</li>
                        <li><i className="fas fa-times"></i> Priority service</li>
                      </ul>
                    </div>
                    <div className="plan-cta">
                      <Link to="/book-service" className="btn-outline">Book Now</Link>
                    </div>
                  </div>
                  
                  <div className={`pricing-plan recommended ${activePricing === 1 ? 'active' : ''}`} onClick={() => setActivePricing(1)}>
                    <div className="plan-badge">Recommended</div>
                    <div className="plan-header">
                      <h3>Standard Plan</h3>
                      <div className="plan-price">
                        <span className="price">₹{
                          service.priceRange ? 
                            Math.floor((parseInt(service.priceRange.split(' - ')[0].replace('₹', '')) + parseInt(service.priceRange.split(' - ')[1].replace('₹', ''))) / 2) : 
                            '999'
                        }</span>
                        <span className="period">One-time</span>
                      </div>
                    </div>
                    <div className="plan-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Comprehensive diagnosis</li>
                        <li><i className="fas fa-check"></i> Complete service</li>
                        <li><i className="fas fa-check"></i> 90-day warranty</li>
                        <li><i className="fas fa-check"></i> Quality parts</li>
                        <li><i className="fas fa-times"></i> Priority service</li>
                      </ul>
                    </div>
                    <div className="plan-cta">
                      <Link to="/book-service" className="btn-primary">Book Now</Link>
                    </div>
                  </div>
                  
                  <div className={`pricing-plan ${activePricing === 2 ? 'active' : ''}`} onClick={() => setActivePricing(2)}>
                    <div className="plan-header">
                      <h3>Premium Plan</h3>
                      <div className="plan-price">
                        <span className="price">₹{service.priceRange?.split(' - ')[1]?.replace('₹', '') || '3999'}</span>
                        <span className="period">One-time</span>
                      </div>
                    </div>
                    <div className="plan-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Advanced diagnosis</li>
                        <li><i className="fas fa-check"></i> Premium service</li>
                        <li><i className="fas fa-check"></i> 12-month warranty</li>
                        <li><i className="fas fa-check"></i> Premium parts</li>
                        <li><i className="fas fa-check"></i> Priority service</li>
                      </ul>
                    </div>
                    <div className="plan-cta">
                      <Link to="/book-service" className="btn-outline">Book Now</Link>
                    </div>
                  </div>
                </div>
                
                <div className="pricing-note">
                  <p><strong>Note:</strong> Actual pricing may vary based on the specific issue with your device. We provide a detailed quote after diagnosis.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'faq' && (
              <div className="service-tab-content">
                <h2>Frequently Asked Questions</h2>
                <div className="faqs-container">
                  {service.faqs && service.faqs.length > 0 ? (
                    <FAQ faqs={service.faqs} />
                  ) : (
                    <div className="default-faqs">
                      <div className="faq-item">
                        <h3>How long does a typical repair take?</h3>
                        <p>Most repairs are completed within 24-48 hours. However, complex issues or repairs requiring special parts may take 3-5 business days. We'll provide you with an estimated timeline when you book the service.</p>
                      </div>
                      <div className="faq-item">
                        <h3>Do you offer on-site repair services?</h3>
                        <p>Yes, we offer on-site repair for most issues. Our technicians come equipped with common replacement parts and tools. For more complex repairs, we may need to take your device to our service center.</p>
                      </div>
                      <div className="faq-item">
                        <h3>What warranty do you provide on repairs?</h3>
                        <p>All our repairs come with a minimum 90-day warranty covering both parts and labor. For premium services, we offer extended warranty options up to 12 months.</p>
                      </div>
                      <div className="faq-item">
                        <h3>How can I book a service?</h3>
                        <p>You can book a service through our website, by calling our customer service line, or by visiting one of our service centers. We'll schedule a convenient time for the repair based on your availability.</p>
                      </div>
                      <div className="faq-item">
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept all major credit and debit cards, UPI payments, net banking, and cash. Payment is typically collected after the service is completed to your satisfaction.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* New Model-Specific tab with ServiceCategoryPage content */}
            {activeTab === 'model-specific' && (
              <div className="service-tab-content">
                <h2>Model-Specific {service.title} Services</h2>
                <p>Select your specific model to get customized repair services:</p>

                {/* Service promotion section */}
                <ServicePromotion />
                
                {/* Brand and model selector */}
                <section className="brand-model-section">
                  <h3>Select Your {service.title} Model</h3>
                  <p>Choose your brand and model to see specific repair options</p>
                  <BrandModelSelector category={serviceId} />
                </section>

                {/* Popular services section */}
                <section className="popular-services">
                  <h3>Popular {service.title} Services</h3>
                  {products && products.length > 0 ? (
                    <div className="services-grid">
                      {products.slice(0, 6).map(product => (
                        <div key={product.id} className="service-card">
                          <div className="service-image">
                            <img 
                              src={product.image || '/images/service-placeholder.jpg'} 
                              alt={product.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/service-placeholder.jpg';
                              }}
                            />
                          </div>
                          <div className="service-details">
                            <h3>{product.title}</h3>
                            <p>{product.description?.substring(0, 100) || 'No description available'}...</p>
                            <div className="service-meta">
                              <div className="service-price">{typeof product.price === 'object' ? Object.values(product.price)[0] : product.price}</div>
                              <div className="service-rating">
                                <i className="fas fa-star"></i> {product.rating || '4.5'} ({product.reviewCount || '0'})
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
                  ) : (
                    <div className="no-products-message">
                      <p>No specific products found for this service category. Please contact us for custom solutions.</p>
                      <Link to="/contact" className="btn-secondary">Contact Us</Link>
                    </div>
                  )}
                  {products && products.length > 6 && (
                    <div className="view-all-container">
                      <Link to={`/services/${serviceId}`} className="btn-secondary">
                        View All {service.title} Services
                      </Link>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <section className="related-services section">
        <div className="container">
          <h2 className="section-title">Explore Other Services</h2>
          <p className="section-subtitle">Discover our range of repair services for all your devices</p>
          
          <div className="cta-buttons">
            <Link to="/services" className="btn-primary">All Services</Link>
            <Link to="/book-service" className="btn-secondary">Book a Service</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage; 