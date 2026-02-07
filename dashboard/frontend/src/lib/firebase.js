// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCk73_dYRfKh99s_ASz4_TXgwYXxkUptiI",
  authDomain: "project-6e88c.firebaseapp.com",
  projectId: "project-6e88c",
  storageBucket: "project-6e88c.firebasestorage.app",
  messagingSenderId: "1063293166247",
  appId: "1:1063293166247:web:de23dcee54884e78f7f182",
  measurementId: "G-092EY67DT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { analytics };
export default app;
