// src/hooks/useFirestore.js
// Hook đồng bộ dữ liệu 2 chiều với Firebase Firestore
// - Nếu Firebase chưa config → dùng LocalStorage như cũ (fallback)
// - Nếu đã config → lắng nghe realtime, mọi thiết bị cùng Family ID đồng bộ tức thì

import { useEffect, useRef } from 'react';
import {
  doc, collection, onSnapshot,
  setDoc, updateDoc, deleteDoc,
  writeBatch, serverTimestamp, getDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig';

/**
 * Hook chính: đồng bộ toàn bộ state với Firestore theo familyId
 * @param {string} familyId - Mã gia đình (do phụ huynh đặt, VD: "nhaconghuong2024")
 * @param {object} state - { kids, history, requests, settings }
 * @param {object} setters - { setKids, setHistory, setRequests, setSettings }
 */
export function useFirestore(familyId, state, setters) {
  const isInitialized = useRef(false);
  const unsubscribers = useRef([]);

  useEffect(() => {
    // Không làm gì nếu chưa config Firebase hoặc chưa có familyId
    if (!isFirebaseConfigured || !familyId || familyId.trim().length < 3) return;

    // Cleanup listeners cũ
    unsubscribers.current.forEach(fn => fn());
    unsubscribers.current = [];
    isInitialized.current = false;

    const familyRef = doc(db, 'families', familyId.trim());

    // ── Lắng nghe thay đổi realtime từ Firestore ──
    const unsub = onSnapshot(familyRef, (snap) => {
      if (!snap.exists()) {
        // Gia đình mới → tạo document với dữ liệu hiện tại
        setDoc(familyRef, {
          kids: state.kids,
          history: state.history,
          requests: state.requests,
          settings: state.settings,
          createdAt: serverTimestamp(),
        });
        isInitialized.current = true;
        return;
      }

      const data = snap.data();

      // Cập nhật state từ Firestore (chỉ nếu không phải thay đổi do chính mình gây ra)
      if (isInitialized.current) {
        if (data.kids) setters.setKids(data.kids);
        if (data.history) setters.setHistory(data.history);
        if (data.requests) setters.setRequests(data.requests);
        if (data.settings) setters.setSettings(prev => ({ ...prev, ...data.settings }));
      } else {
        // Lần đầu kết nối → load dữ liệu từ cloud về (ưu tiên cloud)
        if (data.kids?.length > 0) setters.setKids(data.kids);
        if (data.history?.length > 0) setters.setHistory(data.history);
        if (data.requests?.length > 0) setters.setRequests(data.requests);
        if (data.settings) setters.setSettings(prev => ({ ...prev, ...data.settings }));
        isInitialized.current = true;
      }
    }, (error) => {
      console.warn('Firestore sync error:', error.message);
    });

    unsubscribers.current.push(unsub);

    return () => {
      unsubscribers.current.forEach(fn => fn());
    };
  }, [familyId]);

  // ── Hàm ghi dữ liệu lên Firestore ──
  const syncToCloud = (field, value) => {
    if (!isFirebaseConfigured || !familyId || familyId.trim().length < 3) return;
    if (!isInitialized.current) return;

    const familyRef = doc(db, 'families', familyId.trim());
    updateDoc(familyRef, {
      [field]: value,
      updatedAt: serverTimestamp()
    }).catch(err => console.warn('Sync failed:', err.message));
  };

  return { syncToCloud, isCloudEnabled: isFirebaseConfigured && familyId?.trim().length >= 3 };
}
