import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Music } from 'lucide-react';
import { TREASURES, ISLAND_THEME, Treasure } from './lanceVideos';

// ─────────────────────────────────────────────────────────────────────────────
//  The Vault of Treasures — the keeper's private collection, opened.
//  Moments from the island's history, in the order the story happened.
//  Found in Settings → Help & Story, beside Dr. Malakor's journals.
// ─────────────────────────────────────────────────────────────────────────────

export default function StoryTreasures({ onDone }: { onDone: () => void }) {
  const [playing, setPlaying] = useState<Treasure | null>(null);
  const [themeOn, setThemeOn] = useState(false);
  const themeRef = useRef<HTMLAudioElement>(null);

  const toggleTheme = () => {
    const a = themeRef.current;
    if (!a) return;
    if (themeOn) { a.pause(); setThemeOn(false); }
    else { a.volume = 0.5; a.play().catch(() => {}); setThemeOn(true); }
  };

  return (
    <div className="fixed inset-0 z-[510] bg-black overflow-y-auto">
      <audio ref={themeRef} src={ISLAND_THEME} loop
        onError={e => { (e.currentTarget as HTMLAudioElement).remove(); }} />

      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pb-3 bg-gradient-to-b from-black via-black/90 to-transparent"
        style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#FCD34D' }}>
              Recovered archive
            </div>
            <h2 className="text-white text-lg font-black">The Vault of Treasures</h2>
          </div>
          <button onClick={onDone} aria-label="Close"
            className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* The island's theme */}
        <button onClick={toggleTheme}
          className="mt-3 w-full flex items-center gap-3 p-3 rounded-2xl text-left"
          style={{ background: 'rgba(127,217,140,0.08)', border: '1px solid rgba(127,217,140,0.2)' }}>
          <div className="p-2 rounded-full" style={{ background: 'rgba(127,217,140,0.15)' }}>
            {themeOn ? <Pause size={16} style={{ color: '#7FD98C' }} /> : <Music size={16} style={{ color: '#7FD98C' }} />}
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-bold">The Island&apos;s Theme</div>
            <div className="text-[11px] text-slate-400">{themeOn ? 'Playing — tap to pause' : 'The song the lighthouse hums'}</div>
          </div>
        </button>
      </div>

      {/* The collection */}
      <div className="px-5 pb-10 grid grid-cols-2 gap-3">
        {TREASURES.map(t => (
          <button key={t.file} onClick={() => setPlaying(t)}
            className="text-left rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="relative" style={{ aspectRatio: '9/13' }}>
              <video src={`/lance-videos/${t.file}`} preload="metadata" muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-2.5 rounded-full" style={{ background: 'rgba(0,0,0,0.45)' }}>
                  <Play size={16} className="text-white" fill="white" />
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <div className="text-white text-[13px] font-bold leading-tight">{t.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t.caption}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen player */}
      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[520] bg-black flex items-center justify-center"
            onClick={() => setPlaying(null)}>
            <video key={playing.file} src={`/lance-videos/${playing.file}`}
              autoPlay loop muted playsInline
              className="max-h-full max-w-full object-contain" />
            <div className="absolute bottom-0 inset-x-0 p-6 text-center pointer-events-none"
              style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85), transparent)', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
              <div className="text-white font-black">{playing.title}</div>
              <div className="text-slate-300 text-xs mt-1">{playing.caption}</div>
              <div className="text-slate-500 text-[10px] mt-2">Tap anywhere to close</div>
            </div>
            <button onClick={() => setPlaying(null)} aria-label="Close player"
              className="absolute p-2 rounded-full"
              style={{ top: 'max(1.25rem, env(safe-area-inset-top))', right: '1.25rem', background: 'rgba(255,255,255,0.1)' }}>
              <X size={18} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
