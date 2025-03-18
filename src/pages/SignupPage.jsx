import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      navigate('/profile');
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear errors when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Check if email already exists in local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === formData.email);
        
        if (userExists) {
          setErrors({
            ...errors,
            email: 'This email is already registered'
          });
          setIsSubmitting(false);
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password: formData.password, // In a real app, never store plain text passwords
          createdAt: new Date().toISOString(),
          bookings: []
        };
        
        // Save to local storage
        localStorage.setItem('users', JSON.stringify([...users, newUser]));
        
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isLoggedIn: true
        }));
        
        // Redirect to profile page
        navigate('/profile');
        
        setIsSubmitting(false);
      }, 1000);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Join RepairAIHub to access all services</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-toggle">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="password-toggle">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-remember">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeTerms">
              I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
            </label>
          </div>
          {errors.agreeTerms && <div className="form-error">{errors.agreeTerms}</div>}
          
          <button 
            type="submit" 
            className="auth-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
          
          <div className="auth-divider">
            <span>or sign up with</span>
          </div>
          
          <div className="social-buttons">
            <button type="button" className="social-btn">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/google.svg" alt="Google" />
            </button>
            <button type="button" className="social-btn">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg" alt="Facebook" />
            </button>
          </div>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 