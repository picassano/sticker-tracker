import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function SettingsModal({ onClose }) {
  const { settings, setSettings, kids } = useAppContext();
  
  const [stickersPerUSD, setStickersPerUSD] = useState(settings.stickersPerUSD || 10);
  const [vndPerUSD, setVndPerUSD] = useState(settings.vndPerUSD || 25000);
  const [parentPin, setParentPin] = useState(settings.parentPin || '');
  const [deviceOwnerId, setDeviceOwnerId] = useState(settings.deviceOwnerId || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings(prev => ({ 
      ...prev, 
      stickersPerUSD: Number(stickersPerUSD), 
      vndPerUSD: Number(vndPerUSD),
      parentPin,
      deviceOwnerId
    }));
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={24} color="var(--primary)" />
          Cài Đặt Hệ Thống
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.4)', padding: '16px', borderRadius: '16px' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Tỷ Giá Quy Đổi</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input 
                type="number" min="1" value={stickersPerUSD} onChange={(e) => setStickersPerUSD(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1.1rem', fontWeight: 700 }} required
              /> 
              <span style={{fontWeight: 700}}>⭐ = 1 USD</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <span style={{fontWeight: 700, width: '50px'}}>1 USD =</span>
              <input 
                type="number" min="1" value={vndPerUSD} onChange={(e) => setVndPerUSD(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1.1rem', fontWeight: 700, color: 'var(--success-text)' }} required
              /> 
              <span style={{fontWeight: 700}}>VND</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,198,199,0.3)', padding: '16px', borderRadius: '16px' }}>
             <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, color: 'var(--danger-text)' }}>Khóa Chế độ Phụ huynh (Mã PIN)</label>
             <input 
               type="password" 
               inputMode="numeric"
               maxLength={6}
               value={parentPin} 
               onChange={(e) => setParentPin(e.target.value)}
               placeholder="Để trống nếu không khóa"
               style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--danger)', background: 'white', fontSize: '1.2rem', outline: 'none', fontWeight: 600, letterSpacing: parentPin ? '4px' : 'normal' }}
             />
             <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Khi thiết lập, bé không thể tự ý bấm vào quản lý để duyệt điểm.</p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Quyền riêng tư (Chế độ bé)</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Gán thiết bị này cho duy nhất bé sau (Các thẻ khác bị ẩn trừ khi được chia sẻ):</p>
            <select 
              value={deviceOwnerId} onChange={(e) => setDeviceOwnerId(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1.1rem', fontWeight: 800 }}
            >
              <option value="">-- Dùng chung (Hiện tất cả) --</option>
              {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </div>

          {error && <p style={{ color: 'var(--danger-text)', fontWeight: 700, margin: 0 }}>{error}</p>}

          <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 900, marginTop: '8px', boxShadow: 'var(--card-shadow)' }}>
            Lưu Cài Đặt
          </button>
        </form>
      </div>
    </div>
  );
}
