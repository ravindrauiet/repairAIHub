import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithRedirect, 
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, signInWithGoogle, isMobile } from '../firebase/config';
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
  
  // CRITICAL FIX: Check URL parameters for mobile auth token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token');
    
    if (authToken) {
      console.log('[LoginPage] Found auth_token in URL, attempting to restore session');
      
      // Clear the URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Small delay before navigating to profile
      setTimeout(() => {
        console.log('[LoginPage] Redirecting to profile based on URL auth_token');
        window.location.href = '/profile';
      }, 1000);
    }
  }, []);
  
  // Force check authentication state - especially helpful for mobile
  useEffect(() => {
    const forceCheckAuthState = async () => {
      try {
        // Small delay to ensure Firebase has initialized
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          console.log("[LoginPage] Force-checked auth state: User is logged in", currentUser.uid);
          localStorage.setItem('auth_debug_force_check', 'user_found');
          
          if (!localStorage.getItem('handling_google_redirect')) {
            navigate('/profile');
          }
        } else {
          console.log("[LoginPage] Force-checked auth state: No user found");
          localStorage.setItem('auth_debug_force_check', 'no_user');
        }
      } catch (error) {
        console.error("[LoginPage] Force auth check error:", error);
        localStorage.setItem('auth_debug_force_check_error', error.message);
      }
    };
    
    forceCheckAuthState();
  }, [navigate]);
  
  // Check if user is already logged in and handle redirect result
  useEffect(() => {
    console.log('[LoginPage] Component mounted, device type:', isMobile ? 'Mobile' : 'Desktop');
    
    // Add debug info to localStorage (survives refreshes)
    localStorage.setItem('auth_debug_time', new Date().toString());
    localStorage.setItem('auth_debug_location', location.pathname);
    localStorage.setItem('auth_debug_device', isMobile ? 'mobile' : 'desktop');
    
    // First, check if the user is already logged in
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('[LoginPage] User already logged in:', currentUser.uid);
      localStorage.setItem('auth_debug_current_user', currentUser.uid);
      
      // Don't navigate if we're already handling a Google redirect
      if (!localStorage.getItem('handling_google_redirect')) {
        localStorage.setItem('auth_debug_action', 'direct_navigation_to_profile');
        navigate('/profile');
        return;
      }
    }
    
    // Check for redirect result on page load
    const handleRedirectResult = async () => {
      console.log('[LoginPage] Starting to handle redirect result');
      localStorage.setItem('auth_debug_redirect_start', new Date().toString());
      
      try {
        // Set flag to indicate we're handling a redirect (using localStorage instead of sessionStorage)
        console.log('[LoginPage] Setting handling_google_redirect flag in localStorage');
        localStorage.setItem('handling_google_redirect', 'true');
        
        console.log('[LoginPage] Calling getRedirectResult()');
        const result = await getRedirectResult(auth);
        localStorage.setItem('auth_debug_redirect_result', result ? 'success' : 'no_result');
        console.log('[LoginPage] getRedirectResult returned:', result ? 'Result exists' : 'No result');
        
        if (result?.user) {
          console.log('[LoginPage] Google sign in successful (redirect):', result.user.uid);
          localStorage.setItem('auth_debug_user_uid', result.user.uid);
          localStorage.setItem('auth_debug_user_email', result.user.email);
          
          // Check if user exists in Firestore, if not create a new document
          const userRef = doc(db, "users", result.user.uid);
          console.log('[LoginPage] Checking if user exists in Firestore');
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            console.log('[LoginPage] User does not exist in Firestore, creating new document');
            // User doesn't exist in Firestore, create new document
            await setDoc(userRef, {
              uid: result.user.uid,
              name: result.user.displayName || 'User',
              email: result.user.email,
              phone: result.user.phoneNumber || '',
              address: {
                street: '',
                city: '',
                state: '',
                pincode: ''
              },
              photoURL: result.user.photoURL || '',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
            console.log('[LoginPage] New Google user data saved to Firestore');
          } else {
            console.log('[LoginPage] User exists in Firestore, updating last login time');
            // Update last login time
            await setDoc(userRef, {
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp()
            }, { merge: true });
            console.log('[LoginPage] User login time updated in Firestore');
          }
          
          // Set auth attempted flag to prevent onAuthStateChanged from redirecting again
          setAuthAttempted(true);
          
          console.log('[LoginPage] Redirect successful, navigating to /profile');
          localStorage.setItem('auth_debug_final_action', 'navigating_to_profile');
          
          // Small delay to ensure state is settled before navigation
          setTimeout(() => {
            localStorage.removeItem('handling_google_redirect');
            // On mobile, use enhanced auth navigation
            if (isMobile) {
              const savedAuthToken = localStorage.getItem('mobile_auth_token');
              if (savedAuthToken) {
                localStorage.removeItem('mobile_auth_token'); // Clear it
                window.location.href = '/profile';
              } else {
                // Generate a temporary token for future use
                const tempAuthToken = Date.now().toString(36) + Math.random().toString(36).substr(2);
                localStorage.setItem('mobile_auth_token', tempAuthToken);
                window.location.href = '/profile';
              }
            } else {
              navigate('/profile');
            }
            console.log('[LoginPage] Navigation to /profile initiated');
          }, 500);
        } else {
          console.log('[LoginPage] No redirect result user found');
          localStorage.setItem('auth_debug_no_user', 'true');
          localStorage.removeItem('handling_google_redirect');
        }
      } catch (err) {
        // Remove the flag if there's an error
        console.error('[LoginPage] Google redirect sign in error:', err);
        localStorage.setItem('auth_debug_error', JSON.stringify({
          code: err.code,
          message: err.message
        }));
        
        localStorage.removeItem('handling_google_redirect');
        setLoginError('Google Sign-In Error: ' + err.message);
      }
    };

    // Only attempt to handle redirect if we haven't just completed a redirect
    if (!authAttempted) {
      handleRedirectResult();
    }

    // Check auth state
    console.log('[LoginPage] Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[LoginPage] Auth state changed, user:', user ? user.uid : 'No user');
      localStorage.setItem('auth_debug_auth_state', user ? 'logged_in' : 'logged_out');
      
      if (user && !authAttempted) {
        console.log('[LoginPage] User is signed in, checking if we should navigate');
        
        // Don't navigate if we're already handling a redirect
        const isHandlingRedirect = localStorage.getItem('handling_google_redirect');
        console.log('[LoginPage] handling_google_redirect flag value:', isHandlingRedirect);
        
        if (!isHandlingRedirect) {
          console.log('[LoginPage] Not handling redirect, navigating to /profile');
          localStorage.setItem('auth_debug_navigation_reason', 'auth_state_changed');
          
          // On mobile, use enhanced auth navigation
          if (isMobile) {
            const savedAuthToken = localStorage.getItem('mobile_auth_token');
            if (savedAuthToken) {
              localStorage.removeItem('mobile_auth_token'); // Clear it
              window.location.href = '/profile';
            } else {
              // Generate a temporary token for future use
              const tempAuthToken = Date.now().toString(36) + Math.random().toString(36).substr(2);
              localStorage.setItem('mobile_auth_token', tempAuthToken);
              window.location.href = '/profile';
            }
          } else {
            navigate('/profile');
          }
          console.log('[LoginPage] Navigation to /profile initiated from auth state change');
        } else {
          console.log('[LoginPage] Currently handling redirect, skipping navigation');
        }
      } else {
        console.log('[LoginPage] No user is signed in or auth was already attempted');
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      console.log('[LoginPage] Component unmounting, unsubscribing from auth');
      unsubscribe();
    };
  }, [navigate, location, authAttempted]);
  
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
        
        // On mobile, use enhanced auth navigation
        if (isMobile) {
          const savedAuthToken = localStorage.getItem('mobile_auth_token');
          if (savedAuthToken) {
            localStorage.removeItem('mobile_auth_token'); // Clear it
            window.location.href = '/profile';
          } else {
            // Generate a temporary token for future use
            const tempAuthToken = Date.now().toString(36) + Math.random().toString(36).substr(2);
            localStorage.setItem('mobile_auth_token', tempAuthToken);
            window.location.href = '/profile';
          }
        } else {
          navigate('/profile');
        }
        console.log('[LoginPage] Navigation to /profile initiated from email login');
      } catch (err) {
        console.error('[LoginPage] Login error:', err);
        localStorage.setItem('auth_debug_email_login_error', JSON.stringify({
          code: err.code,
          message: err.message
        }));
        
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
      
      // Clear any existing flags
      console.log('[LoginPage] Clearing any existing redirect flags');
      localStorage.removeItem('handling_google_redirect');
      localStorage.setItem('auth_debug_google_signin_start', new Date().toString());
      
      // Use the signInWithGoogle helper instead of direct implementation
      console.log('[LoginPage] Calling signInWithGoogle helper');
      localStorage.setItem('auth_debug_auth_method', isMobile ? 'redirect' : 'popup');
      
      // Use the signInWithGoogle helper from config
      await signInWithGoogle();
      
      // If we reach here on mobile, the redirect has already happened
      // If we reach here on desktop, it means popup was successful
      if (!isMobile) {
        console.log('[LoginPage] Google popup sign in successful');
        
        // Get current user after popup
        const user = auth.currentUser;
        if (user) {
          // Update Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email,
              phone: user.phoneNumber || '',
              address: {
                street: '',
                city: '',
                state: '',
                pincode: ''
              },
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
          } else {
            await setDoc(userRef, {
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp()
            }, { merge: true });
          }
          
          setAuthAttempted(true);
          navigate('/profile');
        }
      }
    } catch (err) {
      console.error('[LoginPage] Google sign in error:', err);
      localStorage.setItem('auth_debug_google_signin_error', JSON.stringify({
        code: err.code,
        message: err.message
      }));
      
      setLoginError('Google Sign-In Error: ' + err.message);
      setIsSubmitting(false);
    }
  };
  
  // Debug button to check localStorage
  const checkDebugInfo = () => {
    console.log('[LoginPage] === DEBUG INFO ===');
    const debugKeys = Object.keys(localStorage).filter(key => key.startsWith('auth_debug_'));
    debugKeys.forEach(key => {
      console.log(`[LoginPage] ${key}: ${localStorage.getItem(key)}`);
    });
    console.log('[LoginPage] handling_google_redirect:', localStorage.getItem('handling_google_redirect'));
    console.log('[LoginPage] Current User:', auth.currentUser ? auth.currentUser.uid : 'None');
    console.log('[LoginPage] Device Type:', isMobile ? 'Mobile' : 'Desktop');
    console.log('[LoginPage] === END DEBUG INFO ===');
  };
  
  // Clear all debug info
  const clearDebugInfo = () => {
    const debugKeys = Object.keys(localStorage).filter(key => key.startsWith('auth_debug_'));
    debugKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('handling_google_redirect');
    console.log('[LoginPage] All debug info cleared');
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your account</p>
          {/* Debug buttons - remove in production */}
          <div style={{display: 'flex', gap: '5px', position: 'absolute', top: '5px', right: '5px', opacity: 0.2}}>
            <button 
              type="button" 
              onClick={checkDebugInfo} 
              style={{fontSize: '10px', padding: '2px', margin: '2px', background: 'none', border: 'none'}}
              aria-label="Debug info"
            >
              🐞
            </button>
            <button 
              type="button" 
              onClick={clearDebugInfo} 
              style={{fontSize: '10px', padding: '2px', margin: '2px', background: 'none', border: 'none'}}
              aria-label="Clear debug info"
            >
              🧹
            </button>
          </div>
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