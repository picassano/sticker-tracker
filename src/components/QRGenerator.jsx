import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

export default function QRGenerator({ onClose }) {
  const [type, setType] = useState('EARN');
  const [points, setPoints] = useState(5);
  const [name, setName] = useState('Quét nhà');

  const payload = JSON.stringify({ type, points: Number(points), name });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)' }}>Tạo Mã QR</h2>

        <div style={{ width: '100%', marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setType('EARN')}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', background: type === 'EARN' ? 'var(--success)' : 'rgba(255,255,255,0.5)', color: type === 'EARN' ? 'var(--success-text)' : 'var(--text-muted)', fontWeight: 800 }}
          >Thưởng (+)</button>
          <button 
            onClick={() => setType('SPEND')}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', background: type === 'SPEND' ? 'var(--danger)' : 'rgba(255,255,255,0.5)', color: type === 'SPEND' ? 'var(--danger-text)' : 'var(--text-muted)', fontWeight: 800 }}
          >Tiêu (-)</button>
        </div>

        <div style={{ width: '100%', marginBottom: '12px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tên nhiệm vụ / Thưởng</label>
          <input 
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'white', marginTop: '4px' }}
          />
        </div>

        <div style={{ width: '100%', marginBottom: '24px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Số sao</label>
          <input 
            type="number" value={points} onChange={(e) => setPoints(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'white', marginTop: '4px' }}
          />
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'var(--card-shadow)' }}>
          <QRCodeSVG value={payload} size={200} level="H" />
        </div>
        
        <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
          Bạn có thể chụp màn hình mã này và in ra để dán lên tường/tủ lạnh.
        </p>
      </div>
    </div>
  );
}
