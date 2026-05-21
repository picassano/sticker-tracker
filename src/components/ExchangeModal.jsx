import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Landmark } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { playTadaSound, playErrorSound } from '../hooks/useSound';

export default function ExchangeModal({ kid, onClose }) {
  const { exchangeStickersToUSD, settings } = useAppContext();
  
  const rate = settings.stickersPerUSD || 10;
  const maxUsd = Math.floor(kid.stickers / rate);
  
  const [usdAmount, setUsdAmount] = useState(maxUsd > 0 ? 1 : 0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const requiredStickers = Number(usdAmount) * rate;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const amt = Number(usdAmount);

    if (amt <= 0 || !Number.isInteger(amt)) {
      setError('Số lượng USD muốn đổi phải là số nguyên > 0!');
      return;
    }

    if (requiredStickers > kid.stickers) {
      setError(`Cần ${requiredStickers} ⭐ nhưng bé chỉ có ${kid.stickers} ⭐.`);
      return;
    }

    const isSuccess = exchangeStickersToUSD(kid.id, amt);
    if (isSuccess) {
      playTadaSound();
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } else {
      playErrorSound();
      setError('Lỗi hệ thống khi quy đổi!');
    }
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '380px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Landmark size={24} /> Đút lợn (Đổi USD)
        </h2>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>💵</div>
            <h3 style={{ color: 'var(--success-text)', fontWeight: 900 }}>Đổi thành công!</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Tiền đã vào két sắt.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '14px', borderRadius: '12px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Ngân quỹ hiện có:</span>
              <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.1rem' }}>{kid.stickers} ⭐</span>
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(255,139,167,0.1)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Tỷ giá: {rate} ⭐ = 1 USD</span>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Số USD muốn đổi lấy</label>
              <input 
                type="number" min="1" max={Math.max(1, maxUsd)} step="1" 
                value={usdAmount} onChange={(e) => setUsdAmount(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid var(--danger)' : '1px solid var(--surface-border)', background: 'white', fontSize: '1.2rem', outline: 'none', fontWeight: 800, textAlign: 'center' }}
                disabled={maxUsd < 1}
                required
              />
            </div>

            <div style={{ fontSize: '0.95rem', color: 'var(--danger-text)', fontWeight: 800, textAlign: 'center' }}>
              Sẽ trừ đi: {requiredStickers} ⭐
            </div>
            
            {error && <p style={{ color: 'var(--danger-text)', fontWeight: 700, margin: 0, textAlign: 'center' }}>{error}</p>}
            {maxUsd < 1 && !error && <p style={{ color: 'var(--danger-text)', fontWeight: 700, margin: 0, textAlign: 'center' }}>Bé chưa đủ sao để đổi lấy phần USD nhỏ nhất!</p>}

            <button type="submit" disabled={maxUsd < 1} style={{ background: maxUsd < 1 ? 'var(--surface-border)' : 'var(--primary)', color: 'white', padding: '16px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 900, marginTop: '8px', boxShadow: maxUsd < 1 ? 'none' : 'var(--card-shadow)' }}>
              Xác Nhận Đổi
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
