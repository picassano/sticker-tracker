import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ----------------------------------------------------
// THIẾT LẬP FIREBASE TẠI ĐÂY KHI BẠN ĐÃ SẴN SÀNG ĐƯA LÊN CLOUD
// ----------------------------------------------------
// 1. Vào trang https://console.firebase.google.com/
// 2. Tạo một dự án mới
// 3. Chọn biểu tượng Web (</>) để thêm ứng dụng
// 4. Copy đoạn firebaseConfig dán đè vào biến dưới:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Khởi tạo app (chỉ chạy khi bạn điền config thật)
let app, db, auth;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 Firebase Data Sync Active");
  }
} catch (error) {
  console.log("Firebase not configured yet. Using LocalStorage fallback.");
}

export { db, auth };
