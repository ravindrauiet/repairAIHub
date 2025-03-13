import { Link } from 'react-router-dom';
import Hero from '../components/common/Hero';
import ServiceCard from '../components/services/ServiceCard';
import { getAllServices } from '../data/services';

const HomePage = () => {
  const services = getAllServices();

  return (
    <div className="home-page">
      <Hero />
      
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
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Why Choose RepairAIHub?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Expert Technicians</h3>
              <p>Our repair specialists are certified professionals with years of experience in fixing a wide range of devices and appliances.</p>
            </div>
            <div className="feature-item">
              <h3>Quality Parts</h3>
              <p>We use only high-quality, genuine parts for all our repairs to ensure durability and optimal performance.</p>
            </div>
            <div className="feature-item">
              <h3>Fast Service</h3>
              <p>We understand the importance of quick repairs. Our team works efficiently to minimize downtime for your essential devices.</p>
            </div>
            <div className="feature-item">
              <h3>Transparent Pricing</h3>
              <p>No hidden fees or surprises. We provide clear quotes before starting any repair work so you know exactly what to expect.</p>
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

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"They fixed my Samsung TV within a day! The service was fast, professional and affordable. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <h4>John Davis</h4>
                <p>TV Repair Customer</p>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"My AC was barely cooling during the hottest week of summer. RepairAIHub came the same day and had it working perfectly by evening. Excellent service!"</p>
              </div>
              <div className="testimonial-author">
                <h4>Sarah Johnson</h4>
                <p>AC Repair Customer</p>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Cracked my iPhone screen badly and thought I'd need a new phone. These guys replaced it in under an hour and it looks brand new. Great job!"</p>
              </div>
              <div className="testimonial-author">
                <h4>Michael Reynolds</h4>
                <p>Mobile Repair Customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 