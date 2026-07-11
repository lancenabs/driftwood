import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;
const STORAGE_KEY = 'lance_focus_timer_v1';

function loadSessions(): number {
  try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0; } catch { return 0; }
}

interface Props { onBack: () => void; }

export default function FocusTimer({ onBack }: Props) {
  const { addXp } = useGame();
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(loadSessions);
  const [noiseOn, setNoiseOn] = useState(false);
  const [volume, setVolume] = useState(0.25);

  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, sessionsCompleted.toString()); }, [sessionsCompleted]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (phase === 'focus') {
            setSessionsCompleted(c => c + 1);
            addXp(35);
            setPhase('break');
            return BREAK_MINUTES * 60;
          } else {
            setPhase('focus');
            return FOCUS_MINUTES * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [running, phase]);

  // Brown-noise Web Audio generator
  useEffect(() => {
    if (!noiseOn) {
      sourceRef.current?.stop();
      sourceRef.current = null;
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      return;
    }
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);

    sourceRef.current = source;
    gainRef.current = gain;

    return () => {
      source.stop();
      ctx.close().catch(() => {});
    };
  }, [noiseOn]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => () => {
    sourceRef.current?.stop();
    audioCtxRef.current?.close().catch(() => {});
  }, []);

  const reset = () => {
    setRunning(false);
    setPhase('focus');
    setSecondsLeft(FOCUS_MINUTES * 60);
  };

  const totalSeconds = (phase === 'focus' ? FOCUS_MINUTES : BREAK_MINUTES) * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  const accent = phase === 'focus' ? '#7C3AED' : '#059669';
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
      {/* Lighthouse region (cognitive), dimming further while a focus session runs */}
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cognitive.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)',
        opacity: running && phase === 'focus' ? 0.18 : 0.38,
        transition: 'opacity 1.2s ease',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(248,247,252,0.9) 0%, rgba(248,247,252,0.94) 100%)',
      }} />
      <div className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/focus_timer.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(124,58,237,0.35)' }} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#1C1C1E' }}>Focus Timer</h2>
          <p className="text-[10px]" style={{ color: '#6B7280' }}>Prefrontal-preservation Pomodoro</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md mx-auto w-full">
        <div className="rounded-3xl p-6 text-center" style={{
          background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: `0 8px 28px ${accent}26, inset 0 1px 0 rgba(255,255,255,0.9)`,
        }}>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: phase === 'focus' ? '#7C3AED' : '#059669' }}>
            {phase === 'focus' ? 'Focus Session' : 'Break'}
          </span>

          <div className="relative w-56 h-56 mx-auto my-6">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="focus-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={phase === 'focus' ? '#A78BFA' : '#34D399'} />
                  <stop offset="100%" stopColor={phase === 'focus' ? '#6D28D9' : '#047857'} />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="88" fill="none" stroke={`${accent}1E`} strokeWidth="12" />
              <circle
                cx="100" cy="100" r="88" fill="none"
                stroke="url(#focus-ring-grad)"
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${accent}66)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black font-mono" style={{ color: '#3C3C3C' }}>{mins}:{secs}</span>
              <span className="text-[10px] font-bold mt-1" style={{ color: '#9CA3AF' }}>{sessionsCompleted} session{sessionsCompleted === 1 ? '' : 's'} today</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setRunning(r => !r)}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md transition active:scale-95 cursor-pointer"
              style={{ background: phase === 'focus' ? 'linear-gradient(135deg, #7C3AED, #4C1D95)' : 'linear-gradient(135deg, #10B981, #047857)' }}
            >
              {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <button
              onClick={reset}
              className="w-12 h-12 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer border"
              style={{ background: '#F9FAFB', borderColor: '#F0F0F0', color: '#6B7280' }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-3xl p-5 space-y-3" style={{
          background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 6px 22px rgba(13,148,136,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {noiseOn ? <Volume2 className="w-4 h-4" style={{ color: '#0D9488' }} /> : <VolumeX className="w-4 h-4" style={{ color: '#9CA3AF' }} />}
              <span className="text-xs font-black" style={{ color: '#3C3C3C' }}>Brown noise masking</span>
            </div>
            <button
              onClick={() => setNoiseOn(n => !n)}
              className="w-11 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer"
              style={{ background: noiseOn ? '#0D9488' : '#E5E7EB' }}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transition-all absolute top-0.5" style={{ left: noiseOn ? '22px' : '2px' }} />
            </button>
          </div>
          {noiseOn && (
            <input
              type="range" min="0" max="1" step="0.05" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: '#0D9488' }}
            />
          )}
          <p className="text-[10.5px]" style={{ color: '#9CA3AF' }}>Deep, steady low-frequency noise to mask distracting sounds while you focus.</p>
        </div>
      </div>
    </div>
  );
}
