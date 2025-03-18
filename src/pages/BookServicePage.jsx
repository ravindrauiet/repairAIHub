import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import services from '../data/services';

const BookServicePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    deviceBrand: '',
    deviceModel: '',
    issueDescription: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    preferredDate: '',
    preferredTime: '',
    additionalInfo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (loggedInUser) {
      setUser(loggedInUser);
      // Pre-fill user details
      setFormData(prev => ({
        ...prev,
        name: loggedInUser.name || '',
        email: loggedInUser.email || ''
      }));
    }
  }, []);
  
  // Get time slots for booking
  const getTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 19; i++) {
      const hour = i < 10 ? `0${i}` : `${i}`;
      slots.push(`${hour}:00`);
      if (i < 19) {
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  };
  
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
    const requiredFields = [
      'serviceType', 'deviceBrand', 'deviceModel', 
      'issueDescription', 'name', 'email', 'phone',
      'address', 'city', 'pincode', 'preferredDate', 'preferredTime'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
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
        // Create a new booking
        const booking = {
          id: Date.now().toString(),
          ...formData,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        // If user is logged in, save booking to their profile
        if (user) {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const updatedUsers = users.map(u => {
            if (u.id === user.id) {
              return {
                ...u,
                bookings: [...(u.bookings || []), booking]
              };
            }
            return u;
          });
          
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
        
        // Save all bookings to localStorage for reference
        const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        localStorage.setItem('bookings', JSON.stringify([...allBookings, booking]));
        
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          serviceType: '',
          deviceBrand: '',
          deviceModel: '',
          issueDescription: '',
          name: user ? user.name : '',
          email: user ? user.email : '',
          phone: '',
          address: '',
          city: '',
          pincode: '',
          preferredDate: '',
          preferredTime: '',
          additionalInfo: ''
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          if (user) {
            navigate('/profile');
          } else {
            navigate('/');
          }
        }, 3000);
      }, 1000);
    }
  };
  
  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  return (
    <div className="book-service-page">
      <div className="container">
        <div className="booking-header">
          <h1>Book a Repair Service</h1>
          <p>Fill in the details below to schedule a repair service with our expert technicians</p>
        </div>
        
        {showSuccess ? (
          <div className="booking-success">
            <div className="success-icon">✓</div>
            <h2>Booking Successful!</h2>
            <p>Your service request has been submitted successfully. Our team will contact you shortly to confirm your appointment.</p>
            <p>Booking reference: <strong>#{Date.now().toString().slice(-8)}</strong></p>
            <div className="success-actions">
              {user ? (
                <Link to="/profile" className="btn-primary">View in My Bookings</Link>
              ) : (
                <Link to="/" className="btn-primary">Back to Home</Link>
              )}
            </div>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Service Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceType">Service Type <span className="required">*</span></label>
                  <select 
                    id="serviceType" 
                    name="serviceType" 
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={errors.serviceType ? 'error' : ''}
                  >
                    <option value="">Select Service Type</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && <div className="error-message">{errors.serviceType}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deviceBrand">Device Brand <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="deviceBrand" 
                    name="deviceBrand" 
                    value={formData.deviceBrand}
                    onChange={handleChange}
                    placeholder="e.g. Samsung, LG, Apple"
                    className={errors.deviceBrand ? 'error' : ''}
                  />
                  {errors.deviceBrand && <div className="error-message">{errors.deviceBrand}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="deviceModel">Device Model <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="deviceModel" 
                    name="deviceModel" 
                    value={formData.deviceModel}
                    onChange={handleChange}
                    placeholder="e.g. Galaxy S21, iPhone 13"
                    className={errors.deviceModel ? 'error' : ''}
                  />
                  {errors.deviceModel && <div className="error-message">{errors.deviceModel}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="issueDescription">Describe the Issue <span className="required">*</span></label>
                <textarea 
                  id="issueDescription" 
                  name="issueDescription" 
                  value={formData.issueDescription}
                  onChange={handleChange}
                  placeholder="Please describe the problem in detail..."
                  rows="4"
                  className={errors.issueDescription ? 'error' : ''}
                ></textarea>
                {errors.issueDescription && <div className="error-message">{errors.issueDescription}</div>}
              </div>
            </div>
            
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit phone number"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Address Details</h2>
              
              <div className="form-group">
                <label htmlFor="address">Address <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <div className="error-message">{errors.address}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <div className="error-message">{errors.city}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="pincode">Pincode <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="pincode" 
                    name="pincode" 
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter your 6-digit pincode"
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <div className="error-message">{errors.pincode}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Appointment Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date <span className="required">*</span></label>
                  <input 
                    type="date" 
                    id="preferredDate" 
                    name="preferredDate" 
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    className={errors.preferredDate ? 'error' : ''}
                  />
                  {errors.preferredDate && <div className="error-message">{errors.preferredDate}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="preferredTime">Preferred Time <span className="required">*</span></label>
                  <select 
                    id="preferredTime" 
                    name="preferredTime" 
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={errors.preferredTime ? 'error' : ''}
                  >
                    <option value="">Select Time Slot</option>
                    {getTimeSlots().map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.preferredTime && <div className="error-message">{errors.preferredTime}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="additionalInfo">Additional Information</label>
                <textarea 
                  id="additionalInfo" 
                  name="additionalInfo" 
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any additional details or special requirements..."
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div className="booking-terms">
              <p>By submitting this form, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary book-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Book Service'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookServicePage; 