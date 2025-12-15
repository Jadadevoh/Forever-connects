import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For security, these should be loaded from environment variables (e.g., .env file)
// but can be pasted here directly for testing if you don't have a build step.
const firebaseConfig = {
  apiKey: "AIzaSyAXBaPYsWTi1XBF34TpsP1DzuL7endWNB8",
  authDomain: "memorial-137e2.firebaseapp.com",
  projectId: "memorial-137e2",
  storageBucket: "memorial-137e2.firebasestorage.app",
  messagingSenderId: "399198634514",
  appId: "1:399198634514:web:3f88a5e9b9f44399368ecb",
  measurementId: "G-QJPJYTHGYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);