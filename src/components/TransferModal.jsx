import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRightLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { playTransferSound } from '../hooks/useSound';

export default function TransferModal({ senderKid, onClose }) {
  const { kids, transferBalance } = useAppContext();
  
  // Filter out the sender
  const recipients = kids.filter(k => k.id !== senderKid.id);
  
  const [unit, setUnit] = useState('stickers'); // 'stickers' or 'usd'
  const [amountInput, setAmountInput] = useState(1);
  const [reason, setReason] = useState('Chia sẻ cho bạn');
  const [toId, setToId] = useState(recipients.length > 0 ? recipients[0].id : '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const amt = Number(amountInput);
    if (!toId) { setError('Vui lòng chọn người nhận!'); return; }
    if (!Number.isInteger(amt) || amt <= 0) { 
      setError('Số lượng chuyển phải là số nguyên (1, 2, 3...)!'); 
      return; 
    }
    
    // Validate based on the chosen unit's literal balance
    const currentBalance = unit === 'usd' ? (senderKid.usd || 0) : senderKid.stickers;
    
    if (amt > currentBalance) { 
      setError(`Bé không đủ ${unit === 'usd' ? 'USD' : 'Sao'}! (Chỉ còn ${currentBalance})`); 
      return; 
    }

    const isSuccess = transferBalance(senderKid.id, toId, amt, unit, reason);
    if (isSuccess) {
      playTransferSound();
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } else {
      setError('Đã có lỗi xảy ra.');
    }
  };

  if (recipients.length === 0) {
    return createPortal(
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
        <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '360px', padding: '30px', position: 'relative', textAlign: 'center' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}><X size={24} /></button>
          <ArrowRightLeft size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Rất tiếc!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Chưa có tài khoản của anh chị em nào khác để chuyển tiền/sao!</p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '380px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRightLeft size={24} /> Chuyển Giao
        </h2>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🛫</div>
            <h3 style={{ color: 'var(--success-text)', fontWeight: 900 }}>Chuyển thành công!</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Đã gửi {amountInput} {unit === 'usd' ? 'USD' : '⭐'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Từ</label>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>
                {senderKid.name} ({senderKid.stickers} ⭐ / {senderKid.usd || 0} USD)
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Đến</label>
              <select 
                value={toId} onChange={(e) => setToId(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1.1rem', fontWeight: 800 }}
              >
                {recipients.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Mức chuyển</label>
                <input 
                  type="number" min="1" step="1" value={amountInput} onChange={(e) => setAmountInput(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid var(--danger)' : '1px solid var(--surface-border)', background: 'white', fontSize: '1.2rem', outline: 'none', fontWeight: 800 }}
                  required
                />
              </div>
              <div style={{ width: '110px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Đơn vị</label>
                <select 
                  value={unit} onChange={(e) => { setUnit(e.target.value); setError(''); }}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1rem', fontWeight: 800 }}
                >
                  <option value="stickers">Sao ⭐</option>
                  <option value="usd">USD ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Lý do (Lưu vào nhật ký)</label>
              <input 
                type="text" value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Mua kẹo, trả nợ..."
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1.1rem', outline: 'none', fontWeight: 600 }}
                required
              />
            </div>
            
            {error && <p style={{ color: 'var(--danger-text)', fontWeight: 700, margin: 0 }}>{error}</p>}

            <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 900, marginTop: '8px', boxShadow: 'var(--card-shadow)' }}>
              Xác Nhận Chuyển
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
