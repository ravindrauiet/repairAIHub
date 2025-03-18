import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getServiceById } from '../data/services';
import FAQ from '../components/common/FAQ';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [activePricing, setActivePricing] = useState(1); // Index of selected pricing plan
  
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
                      <h3>Expert Repair</h3>
                      <p>Our skilled technicians perform the repair with quality parts.</p>
                    </div>
                    
                    <div className="process-step">
                      <div className="step-number">4</div>
                      <h3>Quality Testing</h3>
                      <p>Thorough testing ensures your device functions perfectly.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'pricing' && (
              <div className="service-tab-content" id="pricing">
                <h2>Service Plans & Pricing</h2>
                <p className="pricing-intro">Choose the service plan that best fits your needs and budget.</p>
                
                <div className="pricing-plans">
                  {service.priceRange ? (
                    <div className="pricing-plan active">
                      <div className="plan-header">
                        <h3>Standard Service</h3>
                        <div className="plan-price">{service.priceRange}</div>
                      </div>
                      
                      <div className="plan-features">
                        <ul>
                          {service.features && service.features.slice(0, 5).map((feature, i) => (
                            <li key={i}>
                              <i className="fas fa-check"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="plan-action">
                        <Link to="/book-service" className="btn-secondary">Book Now</Link>
                      </div>
                    </div>
                  ) : service.pricing && service.pricing.map ? (
                    service.pricing.map((plan, index) => (
                      <div 
                        className={`pricing-plan ${activePricing === index ? 'active' : ''}`} 
                        key={index}
                        onClick={() => setActivePricing(index)}
                      >
                        <div className="plan-header">
                          <h3>{plan.title}</h3>
                          <div className="plan-price">₹{plan.price}</div>
                        </div>
                        
                        <div className="plan-features">
                          <ul>
                            {plan.included && plan.included.map((item, i) => (
                              <li key={i}>
                                <i className="fas fa-check"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="plan-action">
                          <Link to="/book-service" className="btn-secondary">Select Plan</Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pricing-plan active">
                      <div className="plan-header">
                        <h3>Custom Quote</h3>
                        <div className="plan-price">Contact Us</div>
                      </div>
                      
                      <div className="plan-features">
                        <p>Please contact us for a custom quote tailored to your specific needs.</p>
                      </div>
                      
                      <div className="plan-action">
                        <Link to="/contact" className="btn-secondary">Get Quote</Link>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pricing-note">
                  <p>* Additional charges may apply for parts and specialized repairs.</p>
                  <p>* All prices are inclusive of service visit and labor.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'faq' && (
              <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                
                <div className="faq-list">
                  {service.faqs && service.faqs.length > 0 ? (
                    service.faqs.map((faq, index) => (
                      <div className="faq-item" key={index}>
                        <div className="faq-question" onClick={() => {
                          // Toggle active class on click
                          const faqItems = document.querySelectorAll('.faq-item');
                          faqItems[index].classList.toggle('active');
                        }}>
                          <h3>{faq.question}</h3>
                          <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="faq-item">
                      <div className="faq-question">
                        <h3>How long does the repair process take?</h3>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                      <div className="faq-answer">
                        <p>Most repairs are completed within 24-48 hours. Complex issues may take longer depending on part availability and the nature of the problem.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="more-questions">
                  <h3>Still Have Questions?</h3>
                  <p>Our customer support team is ready to help you with any other questions you might have about our services.</p>
                  <Link to="/contact" className="btn-primary">Contact Us</Link>
                </div>
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