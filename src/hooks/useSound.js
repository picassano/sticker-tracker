// useSound.js - Web Audio API sound effects (no external files needed)
const ctx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

function playTone(frequency, type, duration, volume = 0.3) {
  if (!ctx) return;
  try {
    ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* silent fail */ }
}

export function playCoinSound() {
  // "Ting!" — 2 quick ascending notes
  playTone(880, 'sine', 0.12, 0.25);
  setTimeout(() => playTone(1320, 'sine', 0.18, 0.2), 80);
}

export function playTadaSound() {
  // "Tada!" — triumphant chord sweep
  playTone(523, 'triangle', 0.15, 0.2);
  setTimeout(() => playTone(659, 'triangle', 0.15, 0.2), 80);
  setTimeout(() => playTone(784, 'triangle', 0.15, 0.2), 160);
  setTimeout(() => playTone(1047, 'triangle', 0.4, 0.3), 240);
}

export function playErrorSound() {
  // Low "buzz" for errors
  playTone(180, 'sawtooth', 0.2, 0.15);
  setTimeout(() => playTone(140, 'sawtooth', 0.25, 0.15), 100);
}

export function playTransferSound() {
  // "Swoosh" effect for transfers
  playTone(660, 'sine', 0.08, 0.15);
  setTimeout(() => playTone(550, 'sine', 0.08, 0.08), 60);
  setTimeout(() => playTone(440, 'sine', 0.12, 0.12), 120);
}
