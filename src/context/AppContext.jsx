import React, { createContext, useContext, useState, useEffect } from 'react';

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
      parentPin: ''
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

  useEffect(() => { localStorage.setItem('stickerTrackerRole', role); }, [role]);
  useEffect(() => { localStorage.setItem('stickerTrackerKids', JSON.stringify(kids)); }, [kids]);
  useEffect(() => { localStorage.setItem('stickerTrackerSettings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('stickerTrackerHistory', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('stickerTrackerRequests', JSON.stringify(requests)); }, [requests]);

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

  const addKid = (kid) => {
    const newKid = { ...kid, id: Date.now().toString(), stickers: 0, usd: 0 };
    setKids(prev => [...prev, newKid]);
  };

  const removeKid = (id) => setKids(prev => prev.filter(k => k.id !== id));

  const updateKid = (id, newData) => {
    setKids(prev => prev.map(kid => kid.id === id ? { ...kid, ...newData } : kid));
  };

  const updateBalance = (id, amount, currency = 'stickers', reason = "Cập nhật") => {
    let success = true;
    setKids(prev => prev.map(kid => {
      if (kid.id === id) {
        const currentBal = kid[currency] || 0;
        if (currentBal + amount < 0) {
          success = false;
          return kid;
        }
        return { ...kid, [currency]: currentBal + amount };
      }
      return kid;
    }));
    
    if (success) {
      setHistory(prev => [{
        id: Date.now().toString() + Math.random(),
        kidId: id,
        amount, 
        currency,
        reason,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 100));
    }
    return success;
  };

  // Keep this for backwards compatibility with UI that updates stickers directly
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
      updateBalance(fromId, -amount, currency, `Chuyển điểm: ${reason}`);
      updateBalance(toId, amount, currency, `Nhận điểm: ${reason}`);
      return true;
    }
    return false;
  };

  const exchangeStickersToUSD = (kidId, usdAmount) => {
    let success = false;
    const requiredStickers = usdAmount * (settings.stickersPerUSD || 10);
    
    setKids(prev => {
      const kid = prev.find(k => k.id === kidId);
      if (kid && kid.stickers >= requiredStickers) {
        success = true;
      }
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
      id: Date.now().toString(), kidId, action, status: 'pending', timestamp: new Date().toISOString()
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const processRequest = (reqId, isApproved) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        if (isApproved && req.status === 'pending') {
          const pointChange = req.action.type === 'EARN' ? req.action.points : -req.action.points;
          updateStickers(req.kidId, pointChange, `Duyệt: ${req.action.name}`);
        }
        return { ...req, status: isApproved ? 'approved' : 'rejected' };
      }
      return req;
    }));
  };

  const getVndFromUsd = (usdAmount) => {
    return (usdAmount || 0) * (settings.vndPerUSD || 25000);
  };

  const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

  return (
    <AppContext.Provider value={{ 
      role, setRole,
      kids, addKid, removeKid, updateKid, updateStickers, updateBalance, transferBalance, exchangeStickersToUSD,
      settings, setSettings, getVndFromUsd, formatUSD, formatVND,
      history,
      requests, addRequest, processRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};
