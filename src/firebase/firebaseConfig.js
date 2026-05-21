import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5Zkpp50a0VdP9T_39wzYkYyz3JKfkHHE",
  authDomain: "sticker-tracker-fa845.firebaseapp.com",
  projectId: "sticker-tracker-fa845",
  storageBucket: "sticker-tracker-fa845.firebasestorage.app",
  messagingSenderId: "942156597763",
  appId: "1:942156597763:web:5108ff774211fc8f8c9c36",
  measurementId: "G-GNTPQNBFTV"
};

// Kiểm tra xem config đã được điền chưa
export const isFirebaseConfigured = !firebaseConfig.apiKey.includes('PASTE');

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };
