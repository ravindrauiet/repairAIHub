import Hero from '../components/common/Hero';
import ContactForm from '../components/common/ContactForm';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Hero 
        title="Contact Us" 
        subtitle="Get in touch with our team for any inquiries or support"
        backgroundImage="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
                  <p>42/A, Raj Nagar, Sector 9</p>
                  <p>New Delhi, 110085</p>
                </div>
                
                <div className="contact-method">
                  <h3>Call Us</h3>
                  <p>Phone: +91 98765 43210</p>
                  <p>Toll-free: 1800-REPAIR-AI</p>
                </div>
                
                <div className="contact-method">
                  <h3>Email Us</h3>
                  <p>info@repairaihub.com</p>
                  <p>support@repairaihub.com</p>
                </div>
                
                <div className="contact-method">
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9am - 7pm</p>
                  <p>Saturday: 10am - 6pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
              
              <div className="contact-map">
                <h3>Find Us</h3>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112364.25338715465!2d77.2019376!3d28.4089123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sFaridabad%2C%20Haryana!5e0!3m2!1sen!2sin!4v1689927456789!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
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
              <p>We currently service Delhi NCR including Delhi, Noida, Gurgaon, Faridabad, and Ghaziabad. For locations outside this area, please contact us to check availability.</p>
            </div>
            
            <div className="contact-faq">
              <h3>How can I check the status of my repair?</h3>
              <p>You can check the status of your repair by calling our customer service line and providing your repair ticket number. We also send WhatsApp updates at key stages of the repair process.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 