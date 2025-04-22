import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  arrayUnion 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import services from '../data/services';
import BookingDeviceSelector from '../components/BookingDeviceSelector';

const BookServicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
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
  const [bookingReference, setBookingReference] = useState('');
  
  // Check if user is logged in and get service from location state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName || '',
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || ''
        });
        
        // Pre-fill user details
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || '',
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || ''
        }));
      } else {
        setUser(null);
      }
    });

    // Get service from location state if available
    if (location.state?.service) {
      setSelectedService(location.state.service);
      setFormData(prev => ({
        ...prev,
        serviceType: location.state.service.id
      }));
    }
    
    return () => unsubscribe();
  }, [location]);
  
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
  
  // Handle brand and model selection
  const handleDeviceSelect = ({ brand, model }) => {
    if (brand) {
      setFormData(prev => ({
        ...prev,
        deviceBrand: brand.name
      }));
    }
    if (model) {
      setFormData(prev => ({
        ...prev,
        deviceModel: model.name
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Get the selected service details
        const serviceDetails = services.find(service => service.id === formData.serviceType) || {};
        
        // Create a new booking object
        const bookingData = {
          ...formData,
          userId: user?.id || null,
          status: 'pending',
          service: {
            id: serviceDetails.id || '',
            title: serviceDetails.title || '',
            icon: serviceDetails.icon || '',
            price: serviceDetails.price || 0
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // Save the booking to Firestore
        const bookingRef = await addDoc(collection(db, "bookings"), bookingData);
        console.log("Booking saved with ID: ", bookingRef.id);
        
        // Generate a booking reference number
        const bookingId = `BKG-${Date.now().toString().slice(-6)}`;
        setBookingReference(bookingId);
        
        // Update the booking with the reference ID
        await updateDoc(doc(db, "bookings", bookingRef.id), {
          bookingId: bookingId
        });
        
        // If user is logged in, update their profile with this booking reference
        if (user) {
          const userRef = doc(db, "users", user.id);
          
          // Check if user document exists first
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            // Update existing user document
            await updateDoc(userRef, {
              bookings: arrayUnion(bookingRef.id),
              updatedAt: serverTimestamp()
            });
          } else {
            // Create new user document if it doesn't exist
            await setDoc(userRef, {
              uid: user.id,
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              address: {
                street: '',
                city: '',
                state: '',
                pincode: ''
              },
              photoURL: '',
              bookings: [bookingRef.id],
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        }
        
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
          phone: user ? user.phone : '',
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
      } catch (error) {
        console.error("Error adding booking: ", error);
        setIsSubmitting(false);
        // Handle error display to user here
      }
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
            <p>Booking reference: <strong>{bookingReference}</strong></p>
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

              {formData.serviceType && (
                <div className="device-selection-section">
                  <h3>Select Your Device</h3>
                  <BookingDeviceSelector 
                    category={formData.serviceType} 
                    onSelectionChange={handleDeviceSelect}
                  />
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="issueDescription">Issue Description <span className="required">*</span></label>
                  <textarea 
                    id="issueDescription" 
                    name="issueDescription" 
                    value={formData.issueDescription}
                    onChange={handleChange}
                    placeholder="Please describe the issue you're experiencing"
                    className={errors.issueDescription ? 'error' : ''}
                  />
                  {errors.issueDescription && <div className="error-message">{errors.issueDescription}</div>}
                </div>
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