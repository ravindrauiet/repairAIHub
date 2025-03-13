import Hero from '../components/common/Hero';
import ContactForm from '../components/common/ContactForm';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Hero 
        title="Contact Us" 
        subtitle="Get in touch with our team for any inquiries or support"
        backgroundImage="/images/contact-bg.jpg"
        ctaText="Book a Service"
        ctaLink="/book-service"
      />
      
      <section className="section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h2 className="section-title">Our Contact Information</h2>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <h3>Visit Us</h3>
                  <p>123 Repair Street</p>
                  <p>Fix City, FC 12345</p>
                </div>
                
                <div className="contact-method">
                  <h3>Call Us</h3>
                  <p>Phone: +1 234 567 8901</p>
                  <p>Toll-free: 1-800-REPAIR-AI</p>
                </div>
                
                <div className="contact-method">
                  <h3>Email Us</h3>
                  <p>info@repairaihub.com</p>
                  <p>support@repairaihub.com</p>
                </div>
                
                <div className="contact-method">
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9am - 6pm</p>
                  <p>Saturday: 10am - 4pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
              
              <div className="contact-map">
                <h3>Find Us</h3>
                <div className="map-placeholder">
                  <p>Map will be displayed here</p>
                  {/* In a real implementation, you would include a Google Maps or other map component here */}
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="contact-faqs">
            <div className="contact-faq">
              <h3>How do I schedule a repair service?</h3>
              <p>You can schedule a repair service by filling out our online booking form, calling our customer service line, or visiting our location in person. We'll arrange for a convenient time for our technicians to assist you.</p>
            </div>
            
            <div className="contact-faq">
              <h3>Do you offer emergency repair services?</h3>
              <p>Yes, we offer emergency repair services for certain devices and situations. Please call our emergency line for immediate assistance, and we'll do our best to help you as quickly as possible.</p>
            </div>
            
            <div className="contact-faq">
              <h3>What areas do you service?</h3>
              <p>We currently service the entire Fix City metropolitan area and surrounding suburbs within a 30-mile radius. For locations outside this area, please contact us to check availability.</p>
            </div>
            
            <div className="contact-faq">
              <h3>How can I check the status of my repair?</h3>
              <p>You can check the status of your repair by calling our customer service line and providing your repair ticket number. We also send email updates at key stages of the repair process.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 