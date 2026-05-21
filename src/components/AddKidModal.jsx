import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AddKidModal({ onClose }) {
  const { addKid } = useAppContext();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isShared, setIsShared] = useState(true);

  const presetAvatars = [
    'Kem', 'Bap', 'Kitty', 'Puppy', 'Bear', 'Tiger', 'Lion', 
    'Panda', 'Fox', 'Rabbit', 'Monkey', 'Penguin', 'Frog', 'Unicorn', 'Dragon'
  ].map(seed => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addKid({ name: name.trim(), avatarUrl: avatarUrl.trim() });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
      <div className="glass-panel animate-pop" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={24} color="var(--primary)" />
          Thêm Bé Mới
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-muted)' }}>Tên của bé</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Kem, Bơ..."
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

          <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 800, marginTop: '8px', boxShadow: 'var(--card-shadow)' }}>
            Xong
          </button>
        </form>
      </div>
    </div>
  );
}
