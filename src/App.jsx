import React, { useState } from 'react';
import { Sparkles, UserPlus, Settings, QrCode, Bell, UserCircle2, Lock, Wallet, Star } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import KidCard from './components/KidCard';
import AddKidModal from './components/AddKidModal';
import SettingsModal from './components/SettingsModal';
import QRGenerator from './components/QRGenerator';
import RequestsPanel from './components/RequestsPanel';
import PinModal from './components/PinModal';
import './index.css';

function Dashboard() {
  const { role, setRole, kids, requests, settings } = useAppContext();
  const [showAddKid, setShowAddKid] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQRGen, setShowQRGen] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showPinAuth, setShowPinAuth] = useState(false);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const handleToggleRole = () => {
    if (role === 'child') {
      if (settings.parentPin) {
        setShowPinAuth(true);
      } else {
        setRole('parent');
      }
    } else {
      setRole('child');
    }
  };

  const visibleKids = (() => {
    if (role === 'parent') return kids;
    if (settings.deviceOwnerId) {
      return kids.filter(k => k.id === settings.deviceOwnerId || k.isShared);
    }
    return kids;
  })();

  return (
    <div className="app-container">
      {/* ROLE SWITCHER */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '0' }}>
        <button 
          onClick={handleToggleRole}
          style={{ background: 'rgba(255,255,255,0.6)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', border: '1px solid var(--surface-border)' }}
        >
          {role === 'child' && settings.parentPin ? (
            <Lock size={16} color="var(--danger-text)" />
          ) : (
            <UserCircle2 size={16} color="var(--primary)" />
          )}
          {role === 'parent' ? 'Chế độ Phụ Huynh' : 'Chế độ của Bé'}
        </button>
      </div>

      {/* HEADER */}
      <header className="glass-panel animate-pop" style={{ padding: '24px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {role === 'parent' ? (
          <button onClick={() => setShowSettings(true)} style={{ color: 'var(--text-muted)' }}>
            <Settings size={28} />
          </button>
        ) : <div style={{width: 28}} />}
        
        <div style={{ flex: 1 }}>
          <h1 style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles fill="var(--primary)" size={24} />
            Sticker Tracker
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600 }}>Cùng bé tích điểm mỗi ngày!</p>
        </div>

        {role === 'parent' ? (
          <button onClick={() => setShowAddKid(true)} style={{ color: 'var(--primary)', background: 'var(--bg)', padding: '8px', borderRadius: '50%', display: 'flex' }}>
            <UserPlus size={24} />
          </button>
        ) : <div style={{width: 28}} />}
      </header>

      {/* PARENT TOOLBAR */}
      {role === 'parent' && (
        <div className="animate-pop" style={{ display: 'flex', gap: '12px', animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          <button 
            onClick={() => setShowQRGen(true)}
            style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxShadow: 'var(--card-shadow)', fontWeight: 800, color: 'var(--primary)' }}
          >
            <QrCode size={28} /> Tạo Mã QR
          </button>
          
          <button 
            onClick={() => setShowRequests(true)}
            style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxShadow: 'var(--card-shadow)', fontWeight: 800, color: 'var(--success-text)', position: 'relative' }}
          >
            {pendingCount > 0 && (
              <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: 'white', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px' }}>{pendingCount}</span>
            )}
            <Bell size={28} /> Yêu cầu duyệt
          </button>
        </div>
      )}
      
      {/* PARENT TOTAL FUND */}
      {role === 'parent' && kids.length > 0 && (() => {
        const totalUsd = kids.reduce((sum, k) => sum + (k.usd || 0), 0);
        const totalVnd = totalUsd * (settings.vndPerUSD || 25000);
        const totalStickers = kids.reduce((sum, k) => sum + (k.stickers || 0), 0);
        return (
          <div className="animate-pop glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards', background: 'rgba(99,102,241,0.08)', border: '2px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--primary)', borderRadius: '12px', padding: '8px', display: 'flex' }}>
                <Wallet size={20} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tổng Quỹ Bé</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>(bố mẹ đang «nợ»)</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                  ${totalUsd.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalVnd)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '12px', padding: '8px 14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.8)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} fill="gold" color="gold" />{totalStickers}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Tổng Sao</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {visibleKids.length === 0 ? (
          <div className="glass-panel animate-pop" style={{ padding: '40px 20px', textAlign: 'center', animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌟</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Chưa có thẻ hiển thị!</h2>
            {role === 'parent' ? (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Hãy thêm thông tin của bé để bắt đầu theo dõi điểm thưởng nhé.</p>
                <button onClick={() => setShowAddKid(true)} style={{ background: 'var(--primary)', color: 'white', padding: '16px 24px', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 800, boxShadow: 'var(--card-shadow)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={20} /> Thêm bé ngay
                </button>
              </>
            ) : (
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Bố mẹ chưa tạo thẻ hoặc thẻ đang bị ẩn do cài đặt riêng tư.</p>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {visibleKids.map((kid, index) => (
              <div key={kid.id} className="animate-pop" style={{ animationDelay: `${index * 0.1 + 0.2}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <KidCard kid={kid} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODALS */}
      {showAddKid && <AddKidModal onClose={() => setShowAddKid(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showQRGen && <QRGenerator onClose={() => setShowQRGen(false)} />}
      {showRequests && <RequestsPanel onClose={() => setShowRequests(false)} />}
      
      {showPinAuth && (
        <PinModal 
          expectedPin={settings.parentPin} 
          onSuccess={() => {
            setShowPinAuth(false);
            setRole('parent');
          }} 
          onCancel={() => setShowPinAuth(false)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
