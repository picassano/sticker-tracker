import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { auth } from '../firebase/firebaseConfig';
import { signInAnonymously } from 'firebase/auth';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('stickerTrackerRole') || 'parent');

  const [kids, setKids] = useState(() => {
    const saved = localStorage.getItem('stickerTrackerKids');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('stickerTrackerSettings');
    return saved ? JSON.parse(saved) : {
      stickersPerUSD: 10,
      vndPerUSD: 25000,
      parentPin: '',
      familyId: '',
    };
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('stickerTrackerHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('stickerTrackerRequests');
    return saved ? JSON.parse(saved) : [];
  });

  // ── LocalStorage sync (always on as fallback) ──
  useEffect(() => { localStorage.setItem('stickerTrackerRole', role); }, [role]);
  useEffect(() => { localStorage.setItem('stickerTrackerKids', JSON.stringify(kids)); }, [kids]);
  useEffect(() => { localStorage.setItem('stickerTrackerSettings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('stickerTrackerHistory', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('stickerTrackerRequests', JSON.stringify(requests)); }, [requests]);

  // ── Firebase Anonymous Auth ──
  useEffect(() => {
    if (auth) {
      signInAnonymously(auth).catch(err => console.warn("Lỗi đăng nhập ẩn danh:", err));
    }
  }, []);

  // ── Cross-tab sync ──
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'stickerTrackerKids') setKids(JSON.parse(e.newValue || '[]'));
      if (e.key === 'stickerTrackerHistory') setHistory(JSON.parse(e.newValue || '[]'));
      if (e.key === 'stickerTrackerRequests') setRequests(JSON.parse(e.newValue || '[]'));
      if (e.key === 'stickerTrackerSettings') setSettings(JSON.parse(e.newValue || '{}'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ── Firebase Cloud Sync ──
  const { syncToCloud, isCloudEnabled } = useFirestore(
    settings.familyId,
    { kids, history, requests, settings },
    { setKids, setHistory, setRequests, setSettings }
  );

  // Wrapper: sau mỗi thay đổi state → sync lên cloud
  const syncKids = useCallback((newKids) => {
    setKids(newKids);
    syncToCloud('kids', newKids);
  }, [syncToCloud]);

  const syncHistory = useCallback((newHistory) => {
    setHistory(newHistory);
    syncToCloud('history', newHistory);
  }, [syncToCloud]);

  const syncRequests = useCallback((newRequests) => {
    setRequests(newRequests);
    syncToCloud('requests', newRequests);
  }, [syncToCloud]);

  // ── CRUD operations ──
  const addKid = (kid) => {
    const newKid = { ...kid, id: Date.now().toString(), stickers: 0, usd: 0 };
    syncKids(k => {
      const updated = [...k, newKid];
      syncToCloud('kids', updated);
      return updated;
    });
  };

  const removeKid = (id) => {
    setKids(prev => {
      const updated = prev.filter(k => k.id !== id);
      syncToCloud('kids', updated);
      return updated;
    });
  };

  const updateKid = (id, newData) => {
    setKids(prev => {
      const updated = prev.map(kid => kid.id === id ? { ...kid, ...newData } : kid);
      syncToCloud('kids', updated);
      return updated;
    });
  };

  const updateBalance = (id, amount, currency = 'stickers', reason = "Cập nhật") => {
    let success = true;
    let updatedKids = null;

    setKids(prev => {
      const newKids = prev.map(kid => {
        if (kid.id === id) {
          const currentBal = kid[currency] || 0;
          if (currentBal + amount < 0) { success = false; return kid; }
          return { ...kid, [currency]: currentBal + amount };
        }
        return kid;
      });
      if (success) {
        updatedKids = newKids;
        syncToCloud('kids', newKids);
      }
      return newKids;
    });

    if (success) {
      const newEntry = {
        id: Date.now().toString() + Math.random(),
        kidId: id, amount, currency, reason,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => {
        const updated = [newEntry, ...prev].slice(0, 200);
        syncToCloud('history', updated);
        return updated;
      });
    }
    return success;
  };

  const updateStickers = (id, amount, reason) => updateBalance(id, amount, 'stickers', reason);

  const transferBalance = (fromId, toId, amount, currency, reason = "Tặng điểm") => {
    if (amount <= 0 || fromId === toId) return false;
    let canTransfer = false;
    setKids(prev => {
      const fromKid = prev.find(k => k.id === fromId);
      if (fromKid && (fromKid[currency] || 0) >= amount) canTransfer = true;
      return prev;
    });
    if (canTransfer) {
      updateBalance(fromId, -amount, currency, `Chuyển: ${reason}`);
      updateBalance(toId, amount, currency, `Nhận: ${reason}`);
      return true;
    }
    return false;
  };

  const exchangeStickersToUSD = (kidId, usdAmount) => {
    let success = false;
    const requiredStickers = usdAmount * (settings.stickersPerUSD || 10);
    setKids(prev => {
      const kid = prev.find(k => k.id === kidId);
      if (kid && kid.stickers >= requiredStickers) success = true;
      return prev;
    });
    if (success) {
      updateBalance(kidId, -requiredStickers, 'stickers', `Quy đổi ra ${usdAmount} USD`);
      updateBalance(kidId, usdAmount, 'usd', `Quy đổi từ ${requiredStickers} Sao`);
      return true;
    }
    return false;
  };

  const addRequest = (kidId, action) => {
    const newReq = {
      id: Date.now().toString(), kidId, action,
      status: 'pending', timestamp: new Date().toISOString()
    };
    setRequests(prev => {
      const updated = [newReq, ...prev];
      syncToCloud('requests', updated);
      return updated;
    });
  };

  const processRequest = (reqId, isApproved) => {
    setRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === reqId) {
          if (isApproved && req.status === 'pending') {
            const pointChange = req.action.type === 'EARN' ? req.action.points : -req.action.points;
            updateStickers(req.kidId, pointChange, `Duyệt: ${req.action.name}`);
          }
          return { ...req, status: isApproved ? 'approved' : 'rejected' };
        }
        return req;
      });
      syncToCloud('requests', updated);
      return updated;
    });
  };

  const clearHistory = (kidId) => {
    setHistory(prev => {
      // Keep only the newest 5 records for this kid, and all records for other kids
      const otherKidsHistory = prev.filter(h => h.kidId !== kidId);
      const kidHistory = prev.filter(h => h.kidId === kidId).slice(0, 5);
      const updated = [...otherKidsHistory, ...kidHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      syncToCloud('history', updated);
      return updated;
    });
  };

  const getVndFromUsd = (usdAmount) => (usdAmount || 0) * (settings.vndPerUSD || 25000);
  const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

  return (
    <AppContext.Provider value={{
      role, setRole,
      kids, addKid, removeKid, updateKid, updateStickers, updateBalance, transferBalance, exchangeStickersToUSD,
      settings, setSettings,
      getVndFromUsd, formatUSD, formatVND,
      history, clearHistory,
      requests, addRequest, processRequest,
      isCloudEnabled,
    }}>
      {children}
    </AppContext.Provider>
  );
};
