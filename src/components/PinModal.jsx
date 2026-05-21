import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

export default function PinModal({ expectedPin, onSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === expectedPin) {
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '340px', padding: '24px', position: 'relative', textAlign: 'center' }}>
        <button onClick={onCancel} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <Lock size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>Nhập Mã PIN</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Chỉ phụ huynh mới được truy cập</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="••••"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: error ? '2px solid var(--danger-text)' : '1px solid var(--surface-border)', background: 'white', fontSize: '1.5rem', textAlign: 'center', outline: 'none', letterSpacing: '4px', fontWeight: 800 }}
            required
          />
          {error && <p style={{ color: 'var(--danger-text)', fontSize: '0.9rem', marginTop: '-8px', fontWeight: 700 }}>Mã PIN không đúng!</p>}

          <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '14px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 800, marginTop: '8px', boxShadow: 'var(--card-shadow)' }}>
            Mở Khóa
          </button>
        </form>
      </div>
    </div>
  );
}
