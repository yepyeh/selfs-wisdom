import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase Web SDK Configuration
// Note: Web API keys are public client-side keys used by the browser to connect to Firebase.
// Security is handled by Firestore Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyAAQMFB97Hy1K9Q-pvDHSancFdma8OImv8",
  authDomain: "self-wisdom.firebaseapp.com",
  projectId: "self-wisdom",
  storageBucket: "self-wisdom.firebasestorage.app",
  messagingSenderId: "860404830166",
  appId: "1:860404830166:web:d54be4c4ec0e58167ade77",
  measurementId: "G-BSJC9ZS9LW"
};

const isFirebaseConfigured = true;

let db = null;
let auth = null;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

export { db, auth, isFirebaseConfigured };
