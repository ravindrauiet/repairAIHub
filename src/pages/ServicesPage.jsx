import Hero from '../components/common/Hero';
import ServiceCard from '../components/services/ServiceCard';
import { getAllServices } from '../data/services';

const ServicesPage = () => {
  const services = getAllServices();

  return (
    <div className="services-page">
      <Hero 
        title="Our Repair Services" 
        subtitle="Expert repair solutions for all your electronics and appliances"
        backgroundImage="/images/services-bg.jpg" 
      />
      
      <section className="section">
        <div className="container">
          <div className="services-intro">
            <h2 className="section-title">Quality Repair Services</h2>
            <p className="services-description">
              At RepairAIHub, we provide professional repair services for a wide range of electronic devices and appliances. 
              Our team of certified technicians is equipped with the knowledge, tools, and parts necessary to fix your devices 
              quickly and efficiently. We pride ourselves on offering transparent pricing, quality workmanship, and exceptional 
              customer service for every repair job.
            </p>
          </div>
          
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
      
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Our Repair Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="process-number">1</div>
              <h3>Diagnosis</h3>
              <p>Our technicians will thoroughly examine your device to identify the exact cause of the problem.</p>
            </div>
            <div className="process-step">
              <div className="process-number">2</div>
              <h3>Quote</h3>
              <p>You'll receive a transparent quote with no hidden fees before any repair work begins.</p>
            </div>
            <div className="process-step">
              <div className="process-number">3</div>
              <h3>Repair</h3>
              <p>Our experts will fix your device using high-quality parts and professional techniques.</p>
            </div>
            <div className="process-step">
              <div className="process-number">4</div>
              <h3>Testing</h3>
              <p>We rigorously test your repaired device to ensure everything is working perfectly.</p>
            </div>
            <div className="process-step">
              <div className="process-number">5</div>
              <h3>Warranty</h3>
              <p>All our repairs come with a warranty for your peace of mind and satisfaction.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 