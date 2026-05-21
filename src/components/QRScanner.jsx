import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function QRScanner({ kid, onClose }) {
  const { addRequest, updateStickers } = useAppContext();
  const [result, setResult] = useState(null); // 'success-earn', 'success-spend', 'error-balance', 'error-invalid'

  const handleScan = (detectedCodes) => {
    if (result) return; // prevent multiple scans
    if (detectedCodes && detectedCodes.length > 0) {
      try {
        const rawValue = detectedCodes[0].rawValue;
        const action = JSON.parse(rawValue);
        
        if (!action.type || !action.points || !action.name) throw new Error("Invalid Format");

        if (action.type === 'EARN') {
          addRequest(kid.id, action);
          setResult('success-earn');
        } else if (action.type === 'SPEND') {
          if (kid.stickers >= action.points) {
            updateStickers(kid.id, -action.points, `Dùng: ${action.name}`);
            setResult('success-spend');
          } else {
            setResult('error-balance');
          }
        }
      } catch (err) {
        setResult('error-invalid');
      }
    }
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', zIndex: 10 }}>
        <h2 style={{ color: 'white', fontWeight: 800, margin: 0 }}>Máy Quét Của {kid.name}</h2>
        <button onClick={onClose} style={{ color: 'white', background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
          <X size={24} />
        </button>
      </div>

      {/* Scanner Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {!result ? (
           <>
             <Scanner 
               onScan={handleScan}
               formats={['qr_code']}
               styles={{ container: { width: '100%', height: '100%' } }}
             />
             <p style={{ color: 'white', textAlign: 'center', marginTop: '20px', fontWeight: 600 }}>
               Hướng camera vào mã QR
             </p>
           </>
        ) : (
          <div className="glass-panel animate-pop" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.9)', maxWidth: '80%' }}>
            {result === 'success-earn' && (
              <>
                <CheckCircle size={64} color="var(--success-text)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--success-text)', marginBottom: '8px' }}>Gửi thành công!</h3>
                <p>Hãy chờ bố mẹ duyệt để nhận sao nhé.</p>
              </>
            )}
            {result === 'success-spend' && (
              <>
                <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '8px' }}>Chính xác!</h3>
                <p>Bé đã đổi sao thành công. Bắt đầu ngay thôi!</p>
              </>
            )}
            {result === 'error-balance' && (
              <>
                <AlertTriangle size={64} color="var(--danger-text)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--danger-text)', marginBottom: '8px' }}>Không đủ sao!</h3>
                <p>Bé cần làm thêm việc tốt để có đủ sao nhé.</p>
              </>
            )}
            {result === 'error-invalid' && (
              <>
                <AlertTriangle size={64} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Mã QR không hợp lệ</h3>
                <p>Đây không phải mã QR của ứng dụng.</p>
              </>
            )}
            <button 
              onClick={onClose}
              style={{ background: 'var(--primary)', color: 'white', padding: '14px 30px', borderRadius: '20px', fontWeight: 800, marginTop: '24px', fontSize: '1.1rem' }}
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
