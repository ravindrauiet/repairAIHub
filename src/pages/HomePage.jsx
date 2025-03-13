import { Link } from 'react-router-dom';
import Hero from '../components/common/Hero';
import ServiceCard from '../components/services/ServiceCard';
import { getAllServices } from '../data/services';

const HomePage = () => {
  const services = getAllServices();
  
  // Custom hero props for home page with banner image
  const heroProps = {
    title: "AI-Powered Repair Solutions",
    subtitle: "Experience the future of device repairs with our AI-assisted diagnostics and expert technicians",
    backgroundImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ctaText: "Book a Service Now",
    ctaLink: "/book-service"
  };

  return (
    <div className="home-page">
      <Hero {...heroProps} />
      
      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <h2 className="section-title">Our Repair Services</h2>
          <div className="service-cards">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.shortDescription}
                imageUrl={service.imageUrl}
              />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">AI-Powered Diagnostics</h2>
          <div className="tech-features">
            <div className="tech-feature">
              <h3>Smart Diagnostics</h3>
              <p>Our AI system analyzes device symptoms to provide accurate fault detection and repair recommendations, ensuring faster and more reliable repairs.</p>
            </div>
            <div className="tech-feature">
              <h3>Predictive Maintenance</h3>
              <p>Advanced algorithms help predict potential device failures before they occur, saving you from unexpected breakdowns and costly repairs.</p>
            </div>
            <div className="tech-feature">
              <h3>Real-time Updates</h3>
              <p>Track your repair status in real-time through our smart tracking system with automated notifications at every stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose RepairAIHub?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Expert Technicians</h3>
              <p>Our repair specialists are certified professionals with years of experience in fixing a wide range of devices and appliances in all major Indian cities.</p>
            </div>
            <div className="feature-item">
              <h3>Quality Parts</h3>
              <p>We use only high-quality, genuine parts for all our repairs to ensure durability and optimal performance of your devices.</p>
            </div>
            <div className="feature-item">
              <h3>Fast Service</h3>
              <p>We understand the importance of quick repairs especially during Indian summers and monsoons. Our team works efficiently to minimize downtime.</p>
            </div>
            <div className="feature-item">
              <h3>Transparent Pricing</h3>
              <p>No hidden fees or surprises. We provide clear quotes in Indian Rupees before starting any repair work.</p>
            </div>
            <div className="feature-item">
              <h3>Warranty Guaranteed</h3>
              <p>All our repair services come with a warranty, giving you peace of mind and confidence in our workmanship.</p>
            </div>
            <div className="feature-item">
              <h3>Customer Satisfaction</h3>
              <p>Our primary goal is your complete satisfaction. We're not happy until your device is working perfectly again.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Repairs Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Customer Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Technicians</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Repair Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-icon">📱</div>
              <h3>Book Service</h3>
              <p>Schedule a repair service through our website or phone</p>
            </div>
            <div className="process-step">
              <div className="step-icon">🔍</div>
              <h3>AI Diagnosis</h3>
              <p>Our AI system analyzes the issue for accurate diagnosis</p>
            </div>
            <div className="process-step">
              <div className="step-icon">🛠️</div>
              <h3>Expert Repair</h3>
              <p>Skilled technicians fix your device with quality parts</p>
            </div>
            <div className="process-step">
              <div className="step-icon">✅</div>
              <h3>Quality Check</h3>
              <p>Thorough testing ensures perfect working condition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section bg-light">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"They fixed my Samsung TV within a day! The service was fast, professional and affordable. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <h4>Rajesh Sharma</h4>
                <p>Delhi</p>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"My AC was barely cooling during the Delhi summer. RepairAIHub came the same day and had it working perfectly by evening. Excellent service!"</p>
              </div>
              <div className="testimonial-author">
                <h4>Priya Patel</h4>
                <p>Noida</p>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Cracked my iPhone screen badly and thought I'd need a new phone. These guys replaced it in under an hour and it looks brand new. Amazing work!"</p>
              </div>
              <div className="testimonial-author">
                <h4>Arjun Mehta</h4>
                <p>Gurgaon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section bg-primary">
        <div className="container text-center">
          <h2>Ready to Fix Your Device?</h2>
          <p>Book a repair service today and get your device working like new again.</p>
          <div className="cta-buttons">
            <Link to="/book-service" className="btn btn-light">Book a Service</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 