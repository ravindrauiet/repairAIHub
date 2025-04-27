import { useState, useEffect } from 'react';
import Hero from '../components/common/Hero';
import ClickableContact from '../components/common/ClickableContact';
import ContactForm from '../components/common/ContactForm';
import SEO from '../components/common/SEO';
import { generateLocalBusinessSchema } from '../utils/schemaGenerator';
import '../styles/contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    address: '123 Repair Street, Mumbai, India 400001',
    phone: '+91 1234567890',
    email: 'support@callmibro.com',
    hours: 'Monday to Friday: 9am - 6pm, Saturday: 10am - 5pm'
  });
  
  // Generate business schema for structured data
  const businessSchema = generateLocalBusinessSchema();
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional field)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      }, 1000);
    }
  };
  
  return (
    <div className="contact-page">
      <SEO 
        title="Contact Us - CallMiBro Repair Services"
        description="Contact CallMiBro for all your repair service needs. Reach out through phone, email, or visit us in-store for professional device and appliance repairs."
        keywords="contact, support, repair services contact, tech support, help, phone number"
        canonicalUrl="/contact"
        schema={businessSchema}
      />
      
      <Hero 
        title="Contact Us" 
        subtitle="Get in touch with our team for inquiries, support, or feedback"
        backgroundImage="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />
      
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Have questions about our services? Need to schedule a repair? Reach out to us using the contact information below or fill out the form, and our team will get back to you as soon as possible.</p>
              
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h3>Our Location</h3>
                  <p>{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-details">
                  <h3>Call Us</h3>
                  <p><ClickableContact type="phone" value={contactInfo.phone} /></p>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h3>Email Us</h3>
                  <p><ClickableContact type="email" value={contactInfo.email} /></p>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-details">
                  <h3>Business Hours</h3>
                  <p>{contactInfo.hours}</p>
                </div>
              </div>
              
              <div className="social-contact">
                <h3>Connect With Us</h3>
                <div className="social-icons">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              
              {showSuccess ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for reaching out to us. We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={errors.name ? 'error' : ''}
                      />
                      {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email <span className="required">*</span></label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="text" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number (optional)"
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <div className="error-message">{errors.phone}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Message subject (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message <span className="required">*</span></label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your repair needs or questions..."
                      className={errors.message ? 'error' : ''}
                    ></textarea>
                    {errors.message && <div className="error-message">{errors.message}</div>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="map-section">
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160984621!2d72.7409432077263!3d19.08205353332518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1632901417727!5m2!1sen!2sin" 
            width="100%" 
            height="500" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="Office location map"
          ></iframe>
        </div>
      </section>
      
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Find quick answers to common questions about our services</p>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How can I book a repair service?</h3>
              <p>You can book a repair service through our website by filling out the booking form, calling our customer service number, or visiting our service center directly.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you offer emergency repair services?</h3>
              <p>Yes, we offer emergency repair services for critical appliances. Additional charges may apply for urgent service requests.</p>
            </div>
            
            <div className="faq-item">
              <h3>What areas do you service?</h3>
              <p>We currently provide repair services in Mumbai and surrounding areas within a 50km radius. Contact us to confirm if we service your specific location.</p>
            </div>
            
            <div className="faq-item">
              <h3>How long does a typical repair take?</h3>
              <p>Repair times vary depending on the device and issue. Simple repairs may be completed in 1-2 hours, while complex repairs might take 1-3 days, especially if parts need to be ordered.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 