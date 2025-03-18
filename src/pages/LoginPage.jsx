import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
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
    
    // Clear login error
    if (loginError) {
      setLoginError('');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Check local storage for user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === formData.email);
        
        if (user && user.password === formData.password) {
          // Set current user in local storage (in a real app, don't store passwords)
          localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            isLoggedIn: true
          }));
          
          // Redirect to profile page
          navigate('/profile');
        } else {
          setLoginError('Invalid email or password');
        }
        
        setIsSubmitting(false);
      }, 1000);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your account</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {loginError && (
            <div className="form-error" style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
              {loginError}
            </div>
          )}
          
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
                placeholder="Enter your password"
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
          
          <div className="form-remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          
          <button 
            type="submit" 
            className="auth-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="auth-divider">
            <span>or continue with</span>
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
            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 