// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB67O_TSQwnxtMj5XO-Ecbgem61uzQIh5k",
  authDomain: "repairhub-80333.firebaseapp.com",
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
const googleProvider = new GoogleAuthProvider();

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

export { auth, db, storage, googleProvider, checkUserRole, isUserAdmin, getCurrentUser };
export default app; 