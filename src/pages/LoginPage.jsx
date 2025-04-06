import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token validity
      const checkAuth = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              'x-auth-token': token
            }
          });
          
          const user = response.data.user;
          
          if (user.roles && user.roles.includes('admin')) {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('token');
        }
      };
      
      checkAuth();
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        console.log('Attempting login with:', { email: formData.email });
        
        // Try the auth endpoint first
        let response;
        try {
          response = await axios.post('http://localhost:5000/api/auth/login', {
            email: formData.email,
            password: formData.password
          });
          console.log('Auth login response:', response.data);
        } catch (authErr) {
          console.log('Auth login failed, trying user login endpoint');
          // If auth endpoint fails, try the user endpoint
          response = await axios.post('http://localhost:5000/api/users/login', {
            email: formData.email,
            password: formData.password
          });
          console.log('User login response:', response.data);
        }
        
        const data = response.data;
        console.log('Login response data:', data);
        
        if (data.success && data.token) {
          // Store token in local storage
          localStorage.setItem('token', data.token);
          console.log('Token stored in localStorage:', data.token);
          
          // Force reload to ensure state is reset across components
          window.location.href = data.user && data.user.roles && 
            data.user.roles.includes('admin') ? '/admin' : '/profile';
          return;
        } else {
          setLoginError('Login failed. Please try again.');
        }
      } catch (err) {
        console.error('Login error:', err);
        const errorMessage = err.response?.data?.message || 'Invalid email or password';
        setLoginError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
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