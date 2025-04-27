// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  indexedDBLocalPersistence,
  signInWithPopup,
  signInWithRedirect
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Enable Firebase Auth debugging
if (typeof window !== 'undefined') {
  window.FIREBASE_AUTHUI_DEBUG = true;
}

// Your Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB67O_TSQwnxtMj5XO-Ecbgem61uzQIh5k",
  authDomain: "www.callmibro.com", // Using custom domain instead of Firebase default domain
  projectId: "repairhub-80333",
  storageBucket: "repairhub-80333.firebasestorage.app",
  messagingSenderId: "955262673047",
  appId: "1:955262673047:web:a537a4b8c250241627c9d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Create Google provider
const googleProvider = new GoogleAuthProvider();

// Add additional scopes if needed for your app
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Set custom parameters to always prompt user to select account
// and use the custom domain for authentication
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline',
  include_granted_scopes: true,
  response_type: 'token',
  state: 'firebase',
  service: 'lso',
  flowName: 'GeneralOAuthFlow'
});

// Detect if user is on a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);

// Set persistent auth state to maintain login across page refreshes
// Use stronger persistence for mobile devices
setPersistence(auth, isMobile ? indexedDBLocalPersistence : browserLocalPersistence)
  .then(() => {
    console.log(`[Firebase] Auth persistence set to ${isMobile ? 'INDEXED_DB_LOCAL' : 'LOCAL'}`);
    console.log(`[Firebase] Device detected as: ${isMobile ? 'Mobile' : 'Desktop'}`);
  })
  .catch((error) => {
    console.error("[Firebase] Error setting auth persistence:", error);
  });

// Modified Google sign-in function to always use redirect flow
const signInWithGoogle = async () => {
  try {
    // ALWAYS use redirect flow for both mobile and desktop for consistent behavior
    console.log('[Auth] Using redirect for authentication');
    // Force clear any pending redirects
    sessionStorage.removeItem('firebase:redirectUser');
    
    // Force the provider to use select_account every time
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      // Add these additional parameters to force Google to show the account picker
      access_type: 'offline',
      include_granted_scopes: true,
      response_type: 'token',
      state: 'firebase',
      service: 'lso',
      flowName: 'GeneralOAuthFlow'
    });
    
    return signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('[Auth] Google sign-in error:', error);
    throw error;
  }
};

// Direct Google sign-in function that bypasses Firebase's handler
const signInWithGoogleDirect = async () => {
  try {
    console.log('[Auth] Using direct Google OAuth URL');
    const redirectUrl = 'https://www.callmibro.com/login';
    const clientId = '955262673047-ldm0ln3tvas6ckkki7tgfrs6rkd8o1rh.apps.googleusercontent.com';
    
    // Construct URL that works
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent('email profile')}&response_type=token&state=firebase&prompt=select_account&service=lso&flowName=GeneralOAuthFlow`;
    
    // Redirect browser
    window.location.href = authUrl;
  } catch (error) {
    console.error('[Auth] Direct Google sign-in error:', error);
    throw error;
  }
};

// Check if user is an admin
const checkUserRole = async (user) => {
  if (!user) return null;
  
  try {
    const { getDoc, doc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role || 'user'; // Default to 'user' if no role specified
    }
    return 'user';
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'user';
  }
};

// Check if current user is admin
const isUserAdmin = async () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        resolve(false);
        return;
      }
      
      const role = await checkUserRole(user);
      resolve(role === 'admin');
    });
  });
};

// Get current user data
const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        const role = await checkUserRole(user);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: role
        };
        resolve(userData);
      } else {
        resolve(null);
      }
    });
  });
};

export { auth, db, storage, googleProvider, signInWithGoogle, signInWithGoogleDirect, checkUserRole, isUserAdmin, getCurrentUser, isMobile };
export default app; 