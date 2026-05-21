import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, QrCode, ArrowRightLeft, Clock, Edit2, Landmark } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import QRScanner from './QRScanner';
import TransferModal from './TransferModal';
import HistoryModal from './HistoryModal';
import EditKidModal from './EditKidModal';
import PointUpdateModal from './PointUpdateModal';
import ExchangeModal from './ExchangeModal';

export default function KidCard({ kid }) {
  const { role, kids, getVndFromUsd, formatUSD, formatVND, removeKid, settings } = useAppContext();
  const [showScanner, setShowScanner] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPointUpdate, setShowPointUpdate] = useState(null); // 'add' or 'subtract'
  const [showExchange, setShowExchange] = useState(false);
  
  // Animation state for points changing
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 300);
    return () => clearTimeout(timer);
  }, [kid.stickers]);

  const usdBalance = kid.usd || 0;
  const vndEquivalent = getVndFromUsd(usdBalance);
  
  const isDeviceOwner = role === 'parent' || !settings.deviceOwnerId || kid.id === settings.deviceOwnerId;
  const canTransfer = role === 'child' && kids.length > 1 && isDeviceOwner;

  const avatarDisplay = kid.avatarUrl ? (
    <img src={kid.avatarUrl} alt={kid.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: 'var(--card-shadow)' }} />
  ) : (
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', boxShadow: 'var(--card-shadow)' }}>
      {kid.name.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <>
      <div className="glass-panel" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'var(--primary-glow)', zIndex: 0, pointerEvents: 'none' }} />

        {/* HEADER */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div 
              style={{ position: 'relative', cursor: role === 'parent' ? 'pointer' : 'default' }}
              onClick={() => role === 'parent' && setShowEdit(true)}
              title={role === 'parent' ? "Sửa thông tin bé" : ""}
            >
              {avatarDisplay}
              {role === 'parent' && (
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--primary)', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  <Edit2 size={12} color="white" />
                </div>
              )}
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '6px', wordBreak: 'break-word', lineHeight: 1.2 }}>{kid.name}</h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {isDeviceOwner && (
                  <>
                    <button 
                      onClick={() => setShowHistory(true)}
                      style={{ background: 'rgba(255,255,255,0.6)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Clock size={14} /> Nhật ký
                    </button>
                    <button 
                      onClick={() => setShowExchange(true)}
                      style={{ background: 'var(--success)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Landmark size={14} /> Đổi USD
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {role === 'parent' && (
            <button onClick={() => removeKid(kid.id)} style={{ color: 'var(--danger-text)', background: 'rgba(255,198,199,0.5)', padding: '10px', borderRadius: '14px', display: 'flex', alignItems: 'center' }}>
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* GIANT STICKER DISPLAY */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0 16px' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>
            Số Sao Hiện Có
          </div>
          <div className={bounce ? 'animate-bounce' : ''} style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, textShadow: '2px 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {kid.stickers} <span style={{ fontSize: '3rem' }}>⭐</span>
          </div>
        </div>

        {/* ACTUAL USD BALANCE */}
        <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.5)', padding: '16px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid rgba(255,255,255,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ background: 'var(--success)', padding: '8px', borderRadius: '12px' }}>
                <Landmark size={24} color="var(--success-text)" />
             </div>
             <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.2rem' }}>Két Sắt:</span>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--success-text)' }}>{formatUSD(usdBalance)}</div>
             <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>{formatVND(vndEquivalent)}</div>
          </div>
        </div>

        {/* WISHLIST GOAL PROGRESS BAR */}
        {kid.goalName && kid.goalUsd > 0 && (
          <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.5)', padding: '14px 16px', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>🎯 {kid.goalName}</span>
              <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.9rem' }}>{usdBalance}/{kid.goalUsd} USD</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.07)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, var(--primary), #818cf8)',
                width: `${Math.min(100, Math.round((usdBalance / kid.goalUsd) * 100))}%`,
                transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 2px 6px rgba(99,102,241,0.4)'
              }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>
              {usdBalance >= kid.goalUsd ? '🎉 Đã đủ tiền! Bé có thể mua rồi!' : `còn thiếu ${kid.goalUsd - usdBalance} USD`}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {role === 'parent' ? (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button 
              onClick={() => setShowPointUpdate('subtract')}
              style={{ flex: 1, background: 'var(--danger)', color: 'var(--danger-text)', padding: '16px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', boxShadow: 'var(--card-shadow)' }}
            >
              <Minus size={24} strokeWidth={3} /> Trừ
            </button>
            <button 
              onClick={() => setShowPointUpdate('add')}
              style={{ flex: 1, background: 'var(--success)', color: 'var(--success-text)', padding: '16px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', boxShadow: 'var(--card-shadow)' }}
            >
              <Plus size={24} strokeWidth={3} /> Cộng
            </button>
          </div>
        ) : isDeviceOwner ? (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowScanner(true)}
              style={{ flex: 1, minWidth: '140px', background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: 'var(--card-shadow)' }}
            >
              <QrCode size={24} /> Quét Nhận Quà
            </button>
            {canTransfer && (
              <button 
                onClick={() => setShowTransfer(true)}
                style={{ flex: 1, minWidth: '140px', background: 'white', color: 'var(--text-main)', border: '2px solid var(--primary)', padding: '16px', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: 'var(--card-shadow)' }}
              >
                <ArrowRightLeft size={20} color="var(--primary)" /> Tặng Sao/$
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontWeight: 800, background: 'rgba(255,255,255,0.5)', borderRadius: '16px', marginTop: '8px' }}>
            💳 Thẻ của bé bè (Chỉ xem)
          </div>
        )}
      </div>

      {showScanner && <QRScanner kid={kid} onClose={() => setShowScanner(false)} />}
      {showTransfer && <TransferModal senderKid={kid} onClose={() => setShowTransfer(false)} />}
      {showHistory && <HistoryModal kid={kid} onClose={() => setShowHistory(false)} />}
      {showEdit && <EditKidModal kid={kid} onClose={() => setShowEdit(false)} />}
      {showPointUpdate && <PointUpdateModal kid={kid} type={showPointUpdate} onClose={() => setShowPointUpdate(null)} />}
      {showExchange && <ExchangeModal kid={kid} onClose={() => setShowExchange(false)} />}
    </>
  );
}
