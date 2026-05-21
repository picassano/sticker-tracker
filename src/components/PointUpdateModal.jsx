import React, { useState } from 'react';
import { X, PlusCircle, MinusCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { playCoinSound, playErrorSound } from '../hooks/useSound';

export default function PointUpdateModal({ kid, type, onClose }) {
  const { updateStickers } = useAppContext();
  
  const isAdd = type === 'add';
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState(isAdd ? 'Thưởng ngoan' : 'Phạt không nghe lời');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const amt = Number(amount);
    
    if (!Number.isInteger(amt) || amt <= 0) {
      setError('Số lượng sao phải là số nguyên lớn hơn 0!');
      return;
    }
    
    // If subtracting, ensure they have enough stickers
    if (!isAdd && amt > kid.stickers) {
      setError('Số sao bị trừ không được vượt quá số sao hiện có!');
      return;
    }

    const finalAmount = isAdd ? amt : -amt;
    updateStickers(kid.id, finalAmount, reason || (isAdd ? 'Thưởng điểm' : 'Trừ điểm'));
    if (isAdd) playCoinSound(); else playErrorSound();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '380px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px', color: isAdd ? 'var(--success-text)' : 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAdd ? <PlusCircle size={24} /> : <MinusCircle size={24} />}
          {isAdd ? 'Thưởng Thêm Sao' : 'Trừ Bớt Sao'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Bé nhận</label>
            <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', fontWeight: 800, color: 'var(--text-main)' }}>
              {kid.name} (Hiện có: {kid.stickers} ⭐)
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Số lượng sao</label>
            <input 
              type="number" 
              min="1" 
              max={isAdd ? 9999 : kid.stickers} 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid var(--danger)' : '1px solid var(--surface-border)', background: 'white', fontSize: '1.2rem', outline: 'none', fontWeight: 800 }}
              required
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Lý do (Sẽ lưu vào nhật ký)</label>
            <input 
              type="text" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Quét nhà giúp mẹ..."
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1.1rem', outline: 'none', fontWeight: 600 }}
              required
            />
          </div>
          
          {error && <p style={{ color: 'var(--danger-text)', fontWeight: 700, margin: 0 }}>{error}</p>}

          <button type="submit" style={{ background: isAdd ? 'var(--success)' : 'var(--danger)', color: isAdd ? 'var(--success-text)' : 'var(--danger-text)', padding: '16px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 900, marginTop: '8px', boxShadow: 'var(--card-shadow)' }}>
            Xác Nhận {isAdd ? 'Thưởng' : 'Trừ'}
          </button>
        </form>
      </div>
    </div>
  );
}
