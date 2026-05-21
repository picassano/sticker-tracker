// src/firebase/firebaseConfig.js
// ==================================================
// HƯỚNG DẪN: Thay các giá trị "..." bằng config thật
// từ Firebase Console > Project Settings > Web App
// ==================================================
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };
