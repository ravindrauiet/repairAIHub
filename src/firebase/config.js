// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
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
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app; 