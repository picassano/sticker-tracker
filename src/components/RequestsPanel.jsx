import React from 'react';
import { X, Check, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function RequestsPanel({ onClose }) {
  const { requests, kids, processRequest } = useAppContext();

  const pendingRequests = requests.filter(r => r.status === 'pending');

  const getKidName = (kidId) => {
    const kid = kids.find(k => k.id === kidId);
    return kid ? kid.name : 'Bé ẩn danh';
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '400px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={24} /> Yêu Cầu Chờ Duyệt
        </h2>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingRequests.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>Không có yêu cầu nào mới.</p>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'var(--card-shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800 }}>{getKidName(req.kidId)}</span>
                  <span style={{ color: 'var(--success-text)', fontWeight: 800 }}>+{req.action.points} ⭐</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Đã làm: {req.action.name}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => processRequest(req.id, false)}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'var(--danger)', color: 'var(--danger-text)', fontWeight: 700 }}
                  >Từ chối</button>
                  <button 
                    onClick={() => processRequest(req.id, true)}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'var(--success)', color: 'var(--success-text)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  ><Check size={18} /> Duyệt</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
