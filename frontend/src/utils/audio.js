// Web Audio API Synthesizer for rich arcade feedback without external audio files
let audioCtx = null;
let soundEnabled = true;

export function toggleAudio(forceState) {
  if (forceState !== undefined) {
    soundEnabled = forceState;
  } else {
    soundEnabled = !soundEnabled;
  }
  return soundEnabled;
}

export function isAudioEnabled() {
  return soundEnabled;
}

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

export function playKeyStrokeSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

export function playScoreFeedbackSound(positions, digits) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Play subtle chord based on score
  const baseFreq = positions === 4 ? 880 : 350 + digits * 60 + positions * 100;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = positions > 0 ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.15);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

export function playWinSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Heroic brass chord progression (C5 -> E5 -> G5 -> C6 -> E6)
  const fanfareNotes = [
    { freq: 523.25, time: 0.00, dur: 0.28 }, // C5
    { freq: 659.25, time: 0.15, dur: 0.28 }, // E5
    { freq: 783.99, time: 0.30, dur: 0.35 }, // G5
    { freq: 1046.50, time: 0.48, dur: 0.70 }, // C6
    { freq: 1318.51, time: 0.65, dur: 0.90 }, // E6
  ];

  fanfareNotes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.22, now + time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + dur);
  });

  // Sparkling golden bell chimes on top
  const bellFrequencies = [1567.98, 2093.00, 2637.02, 3135.96];
  bellFrequencies.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = now + 0.5 + idx * 0.12;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);
  });
}

export function playErrorSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(160, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}
