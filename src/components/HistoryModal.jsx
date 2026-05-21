import React from 'react';
import { X, Clock, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function HistoryModal({ kid, onClose }) {
  const { history } = useAppContext();
  
  // Filter history for this kid, show latest 50 only (history is already newest-first)
  const kidHistory = history.filter(h => h.kidId === kid.id).slice(0, 50);

  // Format date helper
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '400px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={24} /> Nhật Ký Của {kid.name}
        </h2>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {kidHistory.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>Hiện chưa có hoạt động nào được ghi lại.</p>
          ) : (
            kidHistory.map(item => {
              const isPositive = item.amount > 0;
              return (
                <div key={item.id} style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'var(--card-shadow)', borderLeft: `6px solid ${isPositive ? 'var(--success-text)' : 'var(--danger-text)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isPositive ? <ArrowUpCircle size={18} color="var(--success-text)" /> : <ArrowDownCircle size={18} color="var(--danger-text)" />}
                      {item.reason}
                    </div>
                    <span style={{ color: isPositive ? 'var(--success-text)' : 'var(--danger-text)', fontWeight: 900, fontSize: '1.2rem' }}>
                      {isPositive ? '+' : ''}{item.amount} {item.currency === 'usd' ? 'USD' : '⭐'}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {formatDate(item.timestamp)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
