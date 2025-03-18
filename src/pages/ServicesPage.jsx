import { Link } from "react-router-dom";
import Hero from "../components/common/Hero";
import services from "../data/services";

const ServicesPage = () => {
  // Group services by type
  const electronicsServices = services.filter(service => 
    ['tv-repair', 'mobile-repair'].includes(service.id)
  );
  
  const homeAppliancesServices = services.filter(service => 
    ['ac-repair', 'refrigerator-repair', 'ro-repair', 'washing-machine-repair', 'geyser-repair'].includes(service.id)
  );

  return (
    <div className="services-page">
      <Hero 
        title="Our Repair Services" 
        subtitle="Professional repair solutions for all your devices"
        backgroundImage="https://images.unsplash.com/photo-1603322327561-7e36af6fbb97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />
      
      <section className="service-benefits section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Repair Services?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Expert Technicians</h3>
              <p>Our certified professionals have years of experience with all brands and models.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Fast Turnaround</h3>
              <p>We value your time and offer same-day service for most repair needs.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Quality Guarantee</h3>
              <p>All repairs come with a warranty and are completed using genuine parts.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3>Transparent Pricing</h3>
              <p>No hidden fees with clear upfront pricing before any work begins.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="services-section section">
        <div className="container">
          <h2 className="section-title">Electronics Repair</h2>
          <div className="services-grid">
            {electronicsServices.map(service => (
              <div className="service-card" key={service.id}>
                <div className="service-image">
                  <img src={service.imageUrl} alt={service.title} />
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription}</p>
                  <Link to={`/services/${service.id}`} className="btn-secondary">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="services-section section">
        <div className="container">
          <h2 className="section-title">Home Appliances Repair</h2>
          <div className="services-grid">
            {homeAppliancesServices.map(service => (
              <div className="service-card" key={service.id}>
                <div className="service-image">
                  <img src={service.imageUrl} alt={service.title} />
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription}</p>
                  <Link to={`/services/${service.id}`} className="btn-secondary">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="process-section section">
        <div className="container">
          <h2 className="section-title">Our Repair Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Request Service</h3>
              <p>Book a repair service online or call our customer service.</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>AI Diagnosis</h3>
              <p>Our AI system pre-diagnoses common issues for faster resolution.</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Expert Repair</h3>
              <p>Our skilled technicians perform the repair with quality parts.</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Testing & Warranty</h3>
              <p>Thorough testing ensures quality with warranty on all repairs.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Fix Your Device?</h2>
            <p>Schedule a repair service today and our experts will get your device working perfectly again!</p>
            <Link to="/book-service" className="btn-primary">Book Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 