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
import { getReferralByCode, getCouponByCode, isUserEligibleForCoupon, incrementReferralUse, incrementCouponUse } from '../services/firestoreService';
import * as firestoreService from '../services/firestoreService';
import '../styles/bookServicePage.css';

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
    additionalInfo: '',
    referralCode: '',
    couponCode: ''
  });
  
  // Add missing state variables
  const [selectedDate, setSelectedDate] = useState('');
  const [deviceSelection, setDeviceSelection] = useState({ brand: null, model: null });
  const [timesLoading, setTimesLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  
  // Pricing and discount state
  const [basePrice, setBasePrice] = useState(0);
  const [discountInfo, setDiscountInfo] = useState({
    referral: { valid: false, code: '', percentage: 0, amount: 0, id: '' },
    coupon: { valid: false, code: '', percentage: 0, amount: 0, id: '' }
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  
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
  
  // Update price calculation when service or discounts change
  useEffect(() => {
    if (selectedService) {
      const price = selectedService.price || 0;
      setBasePrice(price);
      
      // Calculate discount amounts
      const referralDiscount = discountInfo.referral.valid 
        ? (price * discountInfo.referral.percentage / 100) 
        : 0;
        
      const couponDiscount = discountInfo.coupon.valid 
        ? (price * discountInfo.coupon.percentage / 100) 
        : 0;
      
      // Update discount info with calculated amounts
      setDiscountInfo(prev => ({
        referral: {
          ...prev.referral,
          amount: referralDiscount
        },
        coupon: {
          ...prev.coupon,
          amount: couponDiscount
        }
      }));
      
      // Calculate total after discounts
      const total = price - referralDiscount - couponDiscount;
      setTotalPrice(Math.max(0, total));
    } else {
      setBasePrice(0);
      setTotalPrice(0);
    }
  }, [selectedService, discountInfo.referral.valid, discountInfo.referral.percentage, 
      discountInfo.coupon.valid, discountInfo.coupon.percentage]);
  
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
  const handleDeviceSelect = (deviceInfo) => {
    if (deviceInfo.brandName) {
      setFormData(prev => ({
        ...prev,
        deviceBrand: deviceInfo.brandName
      }));
    }
    
    if (deviceInfo.modelName) {
      setFormData(prev => ({
        ...prev,
        deviceModel: deviceInfo.modelName
      }));
    }
    
    // Update deviceSelection state
    setDeviceSelection({
      brand: {
        id: deviceInfo.brandId,
        name: deviceInfo.brandName
      },
      model: {
        id: deviceInfo.modelId,
        name: deviceInfo.modelName
      }
    });
    
    // Clear errors if they exist
    if (errors.deviceBrand || errors.deviceModel) {
      setErrors(prev => ({
        ...prev,
        deviceBrand: '',
        deviceModel: ''
      }));
    }
  };
  
  // Apply referral code
  const handleApplyReferral = async () => {
    const code = formData.referralCode.trim();
    if (!code) {
      setErrors(prev => ({
        ...prev,
        referralCode: 'Please enter a referral code'
      }));
      return;
    }
    
    setIsApplyingCode(true);
    setErrors(prev => ({ ...prev, referralCode: '' }));
    
    try {
      const referral = await getReferralByCode(code);
      
      if (!referral || !referral.active) {
        setErrors(prev => ({
          ...prev,
          referralCode: 'Please enter a valid code'
        }));
        setDiscountInfo(prev => ({
          ...prev,
          referral: { valid: false, code: '', percentage: 0, amount: 0, id: '' }
        }));
      } else {
        // Referral is valid, apply the discount
        setDiscountInfo(prev => ({
          ...prev,
          referral: {
            valid: true,
            code: referral.code,
            percentage: referral.discountPercentage,
            amount: basePrice * (referral.discountPercentage / 100),
            id: referral.id
          }
        }));
      }
    } catch (err) {
      console.error('Error validating referral code:', err);
      setErrors(prev => ({
        ...prev,
        referralCode: 'Error validating code'
      }));
    } finally {
      setIsApplyingCode(false);
    }
  };
  
  // Apply coupon code
  const handleApplyCoupon = async () => {
    const code = formData.couponCode.trim();
    if (!code) {
      setErrors(prev => ({
        ...prev,
        couponCode: 'Please enter a coupon code'
      }));
      return;
    }
    
    setIsApplyingCode(true);
    setErrors(prev => ({ ...prev, couponCode: '' }));
    
    try {
      const coupon = await getCouponByCode(code);
      
      if (!coupon || !coupon.active) {
        setErrors(prev => ({
          ...prev,
          couponCode: 'Please enter a valid coupon code'
        }));
        setDiscountInfo(prev => ({
          ...prev,
          coupon: { valid: false, code: '', percentage: 0, amount: 0, id: '' }
        }));
      } else {
        // Check if user is eligible for this coupon
        const isEligible = user ? await isUserEligibleForCoupon(coupon.id, user.id) : false;
        
        if (!isEligible && coupon.target === 'specific') {
          setErrors(prev => ({
            ...prev,
            couponCode: 'This coupon is not applicable to your account'
          }));
          setDiscountInfo(prev => ({
            ...prev,
            coupon: { valid: false, code: '', percentage: 0, amount: 0, id: '' }
          }));
        } else {
          // Coupon is valid and applicable, apply the discount
          setDiscountInfo(prev => ({
            ...prev,
            coupon: {
              valid: true,
              code: coupon.code,
              percentage: coupon.discountPercentage,
              amount: basePrice * (coupon.discountPercentage / 100),
              id: coupon.id
            }
          }));
        }
      }
    } catch (err) {
      console.error('Error validating coupon code:', err);
      setErrors(prev => ({
        ...prev,
        couponCode: 'Error validating code'
      }));
    } finally {
      setIsApplyingCode(false);
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
        
        // Create a new booking object with discount information
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
          discounts: {
            referral: discountInfo.referral.valid ? {
              code: discountInfo.referral.code,
              percentage: discountInfo.referral.percentage,
              amount: discountInfo.referral.amount
            } : null,
            coupon: discountInfo.coupon.valid ? {
              code: discountInfo.coupon.code,
              percentage: discountInfo.coupon.percentage,
              amount: discountInfo.coupon.amount
            } : null
          },
          basePrice: basePrice,
          totalPrice: totalPrice,
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
        
        // Track discount usage if applicable
        if (user && user.id) {
          if (discountInfo.referral.valid) {
            await incrementReferralUse(
              discountInfo.referral.id, 
              user.id, 
              discountInfo.referral.amount
            );
          }
          
          if (discountInfo.coupon.valid) {
            await incrementCouponUse(
              discountInfo.coupon.id, 
              user.id, 
              discountInfo.coupon.amount
            );
          }
        }
        
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
          additionalInfo: '',
          referralCode: '',
          couponCode: ''
        });
        
        // Reset discounts
        setDiscountInfo({
          referral: { valid: false, code: '', percentage: 0, amount: 0, id: '' },
          coupon: { valid: false, code: '', percentage: 0, amount: 0, id: '' }
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
  
  // Add this function to check if booking devices data exists and migrate it if needed
  useEffect(() => {
    const checkAndMigrateBookingDevices = async () => {
      try {
        if (selectedService && selectedService.id) {
          const bookingDevice = await firestoreService.getBookingDevice(selectedService.id);
          
          // If booking devices data doesn't exist and we have static data, migrate it
          if (!bookingDevice && window.confirm(
            'Booking device data not found in database. Would you like to migrate it from static data?'
          )) {
            try {
              setLoading(true);
              await migrateBookingDevicesData(selectedService.id);
              setLoading(false);
              // Refresh the page to show the migrated data
              window.location.reload();
            } catch (err) {
              console.error('Error migrating booking devices data:', err);
              setLoading(false);
            }
          }
        }
      } catch (err) {
        console.error('Error checking booking devices data:', err);
      }
    };
    
    checkAndMigrateBookingDevices();
  }, [selectedService]);

  // Add this function to migrate data (only if needed)
  const migrateBookingDevicesData = async (serviceType) => {
    try {
      // Import the static data
      const { bookingDevices } = await import('../data/products.jsx');
      
      if (bookingDevices[serviceType]) {
        // Save the booking device brands
        await firestoreService.saveBookingDevice(serviceType, {
          type: serviceType,
          brands: bookingDevices[serviceType].brands
        });
        
        // Save the models for each brand
        for (const [brandId, models] of Object.entries(bookingDevices[serviceType].models)) {
          await firestoreService.saveBookingDeviceModels(serviceType, brandId, models);
        }
        
        return true;
      } else {
        console.error(`No static data found for ${serviceType}`);
        return false;
      }
    } catch (err) {
      console.error('Error migrating booking devices data:', err);
      throw err;
    }
  };
  
  // Find the useEffect that handles available times
  useEffect(() => {
    // Only fetch available times when all required selections are made
    if (selectedDate && selectedService && deviceSelection.brand && deviceSelection.model) {
      setTimesLoading(true);
      
      // Mock API call to get available times
      setTimeout(() => {
        // In a real app, you would call your API here with the selected date and service
        setAvailableTimes(generateTimeSlots());
        setTimesLoading(false);
      }, 500);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, selectedService, deviceSelection]);
  
  // Generate time slots for the day
  const generateTimeSlots = () => {
    // This is a mock function that would normally check availability from the server
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
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
                    serviceType={formData.serviceType}
                    onDeviceSelect={handleDeviceSelect}
                    showTitle={false}
                  />
                  {errors.deviceBrand && <div className="error-message">{errors.deviceBrand}</div>}
                  {errors.deviceModel && <div className="error-message">{errors.deviceModel}</div>}
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
                    onChange={(e) => {
                      handleChange(e);
                      setSelectedDate(e.target.value);
                    }}
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
                    disabled={!selectedDate || timesLoading || availableTimes.length === 0}
                    className={errors.preferredTime ? 'error' : ''}
                  >
                    <option value="">Select Time</option>
                    {availableTimes.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {timesLoading && <div className="loading-indicator">Loading available times...</div>}
                  {selectedDate && !timesLoading && availableTimes.length === 0 && (
                    <div className="info-message">Please complete all required service details to see available times.</div>
                  )}
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
            
            {basePrice > 0 && (
              <div className="form-section pricing-section">
                <h2>Service Pricing</h2>
                
                <div className="price-summary">
                  <div className="price-row">
                    <span className="price-label">Base Price:</span>
                    <span className="price-value">₹{basePrice.toLocaleString()}</span>
                  </div>
                  
                  {/* Discount fields */}
                  <div className="discount-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="referralCode">Referral Code</label>
                        <div className="code-input-group">
                          <input 
                            type="text" 
                            id="referralCode" 
                            name="referralCode" 
                            value={formData.referralCode}
                            onChange={handleChange}
                            placeholder="Enter referral code (if you have one)"
                            className={errors.referralCode ? 'error' : ''}
                            disabled={discountInfo.referral.valid || isApplyingCode}
                          />
                          <button 
                            type="button" 
                            className="apply-code-btn"
                            onClick={handleApplyReferral}
                            disabled={!formData.referralCode || discountInfo.referral.valid || isApplyingCode}
                          >
                            {isApplyingCode && formData.referralCode ? 'Validating...' : 'Apply'}
                          </button>
                        </div>
                        {errors.referralCode && <div className="error-message">{errors.referralCode}</div>}
                        {discountInfo.referral.valid && (
                          <div className="success-message">
                            Referral applied: {discountInfo.referral.percentage}% off
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="couponCode">Coupon Code</label>
                        <div className="code-input-group">
                          <input 
                            type="text" 
                            id="couponCode" 
                            name="couponCode" 
                            value={formData.couponCode}
                            onChange={handleChange}
                            placeholder="Enter coupon code (if you have one)"
                            className={errors.couponCode ? 'error' : ''}
                            disabled={discountInfo.coupon.valid || isApplyingCode}
                          />
                          <button 
                            type="button" 
                            className="apply-code-btn"
                            onClick={handleApplyCoupon}
                            disabled={!formData.couponCode || discountInfo.coupon.valid || isApplyingCode}
                          >
                            {isApplyingCode && formData.couponCode ? 'Validating...' : 'Apply'}
                          </button>
                        </div>
                        {errors.couponCode && <div className="error-message">{errors.couponCode}</div>}
                        {discountInfo.coupon.valid && (
                          <div className="success-message">
                            Coupon applied: {discountInfo.coupon.percentage}% off
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Display discounts if applied */}
                  {discountInfo.referral.valid && (
                    <div className="price-row discount">
                      <span className="price-label">Referral Discount:</span>
                      <span className="price-value">-₹{discountInfo.referral.amount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {discountInfo.coupon.valid && (
                    <div className="price-row discount">
                      <span className="price-label">Coupon Discount:</span>
                      <span className="price-value">-₹{discountInfo.coupon.amount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="price-row total">
                    <span className="price-label">Total Price:</span>
                    <span className="price-value">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="booking-terms">
              <p>By submitting this form, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="book-btn" 
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