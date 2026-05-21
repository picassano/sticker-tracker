import React, { useState } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function EditKidModal({ kid, onClose }) {
  const { updateKid } = useAppContext();
  const [name, setName] = useState(kid.name);
  const [avatarUrl, setAvatarUrl] = useState(kid.avatarUrl || '');
  const [isShared, setIsShared] = useState(kid.isShared !== undefined ? kid.isShared : true);
  const [goalName, setGoalName] = useState(kid.goalName || '');
  const [goalUsd, setGoalUsd] = useState(kid.goalUsd || '');
  const [error, setError] = useState('');

  const presetAvatars = [
    'Kem', 'Bap', 'Kitty', 'Puppy', 'Bear', 'Tiger', 'Lion', 
    'Panda', 'Fox', 'Rabbit', 'Monkey', 'Penguin', 'Frog', 'Unicorn', 'Dragon'
  ].map(seed => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Tên bé không được để trống!'); return; }
    updateKid(kid.id, { 
      name: name.trim(), 
      avatarUrl: avatarUrl.trim(), 
      isShared,
      goalName: goalName.trim(),
      goalUsd: goalUsd ? Number(goalUsd) : null
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Sửa thông tin bé
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          {avatarUrl ? (
             <img src={avatarUrl} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: 'var(--card-shadow)' }} />
          ) : (
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--primary)' }}>
               <ImageIcon size={32} color="var(--primary)" />
             </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-muted)' }}>Tên của bé</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', outline: 'none', color: 'var(--text-main)', fontWeight: 600 }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Avatar nhanh (Hoạt hình)</label>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
              {presetAvatars.map(url => (
                <img 
                  key={url} src={url} alt="avatar" 
                  onClick={() => setAvatarUrl(url)}
                  style={{ 
                    width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
                    border: avatarUrl === url ? '3px solid var(--primary)' : '2px solid transparent',
                    background: 'rgba(255,255,255,0.8)', boxShadow: avatarUrl === url ? '0 4px 12px rgba(99,102,241,0.4)' : 'none'
                  }} 
                />
              ))}
            </div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Hoặc nhập link ảnh của bạn</label>
            <input 
              type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1.1rem', outline: 'none' }}
            />
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>🎯 Mục Tiêu Đổi Thưởng (Mọ̆n quà bé đang tiết kiệm)</label>
            <input 
              type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)}
              placeholder="VD: Bộ Lego Creator"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1rem', outline: 'none', marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" value={goalUsd} onChange={(e) => setGoalUsd(e.target.value)}
                placeholder="Giá (USD)"
                min="1" step="1"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'white', fontSize: '1rem', outline: 'none' }}
              />
              <span style={{ fontWeight: 800, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>USD</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.6)', padding: '14px', borderRadius: '12px' }}>
            <input 
              type="checkbox" 
              id="isShared" 
              checked={isShared} 
              onChange={(e) => setIsShared(e.target.checked)} 
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="isShared" style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              Hiển thị thẻ này với các bé khác (Để nhận quà chuyển chéo)
            </label>
          </div>

          {error && <p style={{ color: 'var(--danger-text)', fontWeight: 700, margin: 0 }}>{error}</p>}

          <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 800, marginTop: '8px', boxShadow: 'var(--card-shadow)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Save size={20} /> Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
