import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  getRedirectResult,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, isMobile } from '../firebase/config';
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
  const [authAttempted, setAuthAttempted] = useState(false);
  const [formFocus, setFormFocus] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle redirect result when component mounts
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('[LoginPage] Checking for redirect result');
        
        // Check for redirect result (crucial for mobile authentication)
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          console.log('[LoginPage] Redirect successful, user:', result.user.uid);
          
          // Update Firestore if needed
          const userRef = doc(db, "users", result.user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // Create user document if new user
            await setDoc(userRef, {
              uid: result.user.uid,
              name: result.user.displayName || 'User',
              email: result.user.email,
              photoURL: result.user.photoURL || '',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
            console.log('[LoginPage] Created new user document in Firestore');
          } else {
            // Update last login
            await setDoc(userRef, {
              lastLogin: serverTimestamp()
            }, { merge: true });
            console.log('[LoginPage] Updated user last login in Firestore');
          }
          
          // Navigate to profile or intended destination
          const destination = location.state?.from || '/profile';
          console.log('[LoginPage] Navigating to:', destination);
          navigate(destination, { replace: true });
        } else {
          console.log('[LoginPage] No redirect result found');
        }
      } catch (error) {
        console.error('[LoginPage] Redirect error:', error);
        setLoginError('Authentication error: ' + error.message);
      }
    };

    // Always check for redirect results on mount
    handleRedirectResult();
  }, [navigate, location.state]);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      onAuthStateChanged(auth, (user) => {
        if (user && !authAttempted) {
          console.log('[LoginPage] User already signed in:', user.uid);
          const destination = location.state?.from || '/profile';
          navigate(destination, { replace: true });
        }
      });
    };
    
    checkAuth();
  }, [navigate, authAttempted, location.state]);
  
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

  const handleFocus = (field) => {
    setFormFocus(field);
  };

  const handleBlur = () => {
    setFormFocus('');
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
        console.log('[LoginPage] Attempting login with email:', formData.email);
        
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        console.log('[LoginPage] Email login successful, user:', userCredential.user.uid);
        
        // Update last login time in Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        console.log('[LoginPage] Login successful, login time updated in Firestore');
        setAuthAttempted(true);
        
        // Navigate to profile or intended destination
        const destination = location.state?.from || '/profile';
        navigate(destination, { replace: true });
      } catch (err) {
        console.error('[LoginPage] Login error:', err);
        
        const errorMessage = err.code === 'auth/invalid-credential' 
          ? 'Invalid email or password' 
          : err.message;
        setLoginError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      console.log('[LoginPage] Starting Google sign in process');
      setIsSubmitting(true);
      setLoginError('');
      
      // Use the signInWithGoogle helper from config
      await signInWithGoogle();
      
      // On desktop, handle success directly
      if (!isMobile) {
        const user = auth.currentUser;
        if (user) {
          console.log('[LoginPage] Google sign in successful (popup)');
          setAuthAttempted(true);
          const destination = location.state?.from || '/profile';
          navigate(destination, { replace: true });
        }
      } else {
        // On mobile, the page will redirect and we'll handle in useEffect
        console.log('[LoginPage] Redirecting for mobile Google auth...');
      }
    } catch (err) {
      console.error('[LoginPage] Google sign in error:', err);
      setLoginError('Google Sign-In Error: ' + err.message);
      setIsSubmitting(false);
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
            <div className="form-error" style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)' }}>
              {loginError}
            </div>
          )}
          
          <div className={`form-group ${formFocus === 'email' ? 'focused' : ''}`}>
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          
          <div className={`form-group ${formFocus === 'password' ? 'focused' : ''}`}>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-toggle">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            {isSubmitting ? (
              <span className="loading-spinner">
                <span className="sr-only">Signing in...</span>
              </span>
            ) : 'Sign In'}
          </button>
          
          <div className="auth-divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-buttons">
            <button 
              type="button" 
              className="social-btn" 
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              aria-label="Sign in with Google"
            >
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/google.svg" alt="" />
              <span className="sr-only">Google</span>
            </button>
            <button 
              type="button" 
              className="social-btn"
              aria-label="Sign in with Facebook"
            >
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/facebook.svg" alt="" />
              <span className="sr-only">Facebook</span>
            </button>
            <button 
              type="button" 
              className="social-btn"
              aria-label="Sign in with Twitter"
            >
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/twitter.svg" alt="" />
              <span className="sr-only">Twitter</span>
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