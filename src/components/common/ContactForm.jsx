import { useState } from 'react';

const ContactForm = ({ isBooking = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: '',
    date: '',
    time: '',
    address: ''
  });
  
  const [formMessage, setFormMessage] = useState({
    show: false,
    type: '',
    text: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.phone) {
      setFormMessage({
        show: true,
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }
    
    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    setFormMessage({
      show: true,
      type: 'success',
      text: isBooking 
        ? 'Your service booking has been received. We will contact you shortly to confirm.' 
        : 'Your message has been sent. We will get back to you soon!'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      service: '',
      date: '',
      time: '',
      address: ''
    });
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setFormMessage({
        show: false,
        type: '',
        text: ''
      });
    }, 5000);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {isBooking ? 'Book a Repair Service' : 'Get in Touch'}
      </h2>
      <p className="form-description">
        {isBooking 
          ? 'Fill in the form below to schedule a repair service. Our team will reach out to confirm your appointment.' 
          : 'Have any questions or inquiries? Fill out the form below and we\'ll get back to you as soon as possible.'
        }
      </p>
      
      {formMessage.show && (
        <div className={`form-message ${formMessage.type}`}>
          {formMessage.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name <span className="form-required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="form-required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone <span className="form-required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          {isBooking ? (
            <div className="form-group">
              <label htmlFor="service" className="form-label">
                Service Type <span className="form-required">*</span>
              </label>
              <select
                id="service"
                name="service"
                className="form-select"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a service</option>
                <option value="tv-repair">TV Repair</option>
                <option value="mobile-repair">Mobile Phone Repair</option>
                <option value="ac-repair">AC Repair</option>
                <option value="refrigerator-repair">Refrigerator Repair</option>
                <option value="ro-repair">RO System Repair</option>
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="form-input"
                placeholder="What is this regarding?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        
        {isBooking && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Preferred Date <span className="form-required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time" className="form-label">
                  Preferred Time <span className="form-required">*</span>
                </label>
                <select
                  id="time"
                  name="time"
                  className="form-select"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a time slot</option>
                  <option value="9am-12pm">Morning (9am - 12pm)</option>
                  <option value="12pm-3pm">Afternoon (12pm - 3pm)</option>
                  <option value="3pm-6pm">Evening (3pm - 6pm)</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Service Address <span className="form-required">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                className="form-textarea"
                placeholder="Your complete address for service"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
              ></textarea>
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            {isBooking ? 'Additional Information' : 'Message'} 
            {!isBooking && <span className="form-required">*</span>}
          </label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            placeholder={isBooking ? 'Any specific details about your repair needs?' : 'How can we help you?'}
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required={!isBooking}
          ></textarea>
        </div>
        
        <button type="submit" className="form-submit">
          {isBooking ? 'Book Service' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 