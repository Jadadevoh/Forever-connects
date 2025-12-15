import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For security, these should be loaded from environment variables (e.g., .env file)
// but can be pasted here directly for testing if you don't have a build step.
const firebaseConfig = {
  apiKey: "AIzaSyDcxRsnLFlb_11u9fbgLttoPwCvcbAuahg",
  authDomain: "memo-80293877-394d6.firebaseapp.com",
  projectId: "memo-80293877-394d6",
  storageBucket: "memo-80293877-394d6.firebasestorage.app",
  messagingSenderId: "855384215042",
  appId: "1:855384215042:web:fe9a6d7587e4a3744be11b",
  measurementId: "G-TLMZXCGLJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);