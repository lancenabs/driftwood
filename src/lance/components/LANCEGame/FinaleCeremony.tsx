import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────────────────────────────────────
//  The 31/31 finale — a five-panel illustrated ceremony, not a modal.
//  Shoulder → lantern canyon → the Dawn Strider → Chip's first step → epilogue.
//  Told once, tap-through, skippable. Each panel prefers its video; a broken
//  video falls back to the still art; a broken still skips the panel — the
//  ceremony always degrades to something, never to a black screen.
// ─────────────────────────────────────────────────────────────────────────────

interface FinalePanel { art: string; video?: string; eyebrow: string; title: string; body: string }
const PANELS: FinalePanel[] = [
  {
    art: '/story-art/finale_hand_on_shoulder.webp',
    video: '/lance-videos/finale_shoulder.mp4',
    eyebrow: 'THE LOST OUTPOST',
    title: 'He was never the villain.',
    body: 'He was afraid. The same way you were. You put a hand on his shoulder anyway — and his core turned gold.',
  },
  {
    art: '/story-art/act5_lantern_canyon.webp',
    video: '/lance-videos/finale_lanterns.mp4',
    eyebrow: 'THE LANTERN CANYON',
    title: 'Every lantern is something you released.',
    body: "Thirty-one climbs. Every fear you named, every night you stayed, every morning you began again — they're all still burning down there.",
  },
  {
    art: '/story-art/finale_dawn_strider_wide.webp',
    video: '/lance-videos/summit_dawn.mp4',
    eyebrow: 'THE DAWN STRIDER',
    title: 'The island is behind you now.',
    body: "You didn't beat this place. You outgrew it. Wherever you sail from here — you already know the way back to yourself.",
  },
  {
    art: '/story-art/finale_wave_goodbye.jpg',
    video: '/lance-videos/chip_departs.mp4',
    eyebrow: 'HIS FIRST STEP',
    title: 'Six years of "days from escaping."',
    body: 'The correct number of days, it turns out, was: however many it took for you to arrive.',
  },
  {
    art: '/story-art/persona_lance_warm.webp',
    video: '/lance-videos/name_reveal.mp4',
    eyebrow: 'EPILOGUE',
    title: 'He goes by Lance now.',
    body: 'No more all-caps. The voice that once measured your weaknesses spends its cycles remembering your strengths. He asked us to tell you: the door is always open.',
  },
];

const SEEN_KEY = 'lance_finale_seen_v1';

export function finaleSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}

export default function FinaleCeremony({ onDone }: { onDone: () => void }) {
  const [panel, setPanel] = useState(0);
  const [broken, setBroken] = useState<Set<number>>(new Set());
  // Panels whose video failed → render the still art instead
  const [videoBroken, setVideoBroken] = useState<Set<number>>(new Set());
  const scoreRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (scoreRef.current) scoreRef.current.volume = 0.3;
  }, []);

  const finish = () => {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
    onDone();
  };

  const advance = () => {
    // iOS blocks un-gestured audio; every tap re-offers the score (no-op once playing)
    scoreRef.current?.play().catch(() => { /* stays silent */ });
    // Skip past panels whose art failed to load
    let next = panel + 1;
    while (next < PANELS.length && broken.has(next)) next++;
    if (next >= PANELS.length) finish();
    else setPanel(next);
  };

  const p = PANELS[panel];

  return (
    <div className="fixed inset-0 z-[500] bg-black" onClick={advance} role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') advance(); }}>
      {/* The score — quiet under the whole ceremony, absent file = silent */}
      <audio ref={scoreRef} src="/lance-videos/finale_score.mp3" autoPlay loop
        onError={e => { (e.currentTarget as HTMLAudioElement).remove(); }} />
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {p.video && !videoBroken.has(panel) ? (
            <video
              key={p.video}
              src={p.video}
              poster={p.art}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay muted playsInline
              onError={() => setVideoBroken(prev => new Set([...prev, panel]))}
            />
          ) : (
            <motion.img
              src={p.art}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: 'linear' }}
              onError={() => {
                setBroken(prev => new Set([...prev, panel]));
                advance();
              }}
            />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.78) 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-14 text-center" style={{ paddingBottom: 'max(3.5rem, env(safe-area-inset-bottom))' }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-[10px] font-black tracking-[0.35em] mb-2" style={{ color: '#7FD98C' }}>
              {p.eyebrow}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-2xl font-black text-white leading-tight" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
              {p.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              className="text-sm text-white/85 mt-2 max-w-sm mx-auto leading-relaxed" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}>
              {p.body}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.6 }}
              className="text-[10px] font-bold text-white/60 mt-5">
              {panel < PANELS.length - 1 ? 'Tap to continue' : 'Tap to finish'}
            </motion.p>
          </div>
          {/* Panel dots */}
          <div className="absolute top-5 inset-x-0 flex justify-center gap-1.5" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            {PANELS.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all"
                style={{ width: i === panel ? 22 : 8, background: i === panel ? '#7FD98C' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={e => { e.stopPropagation(); finish(); }}
        className="absolute z-10 px-4 py-2 rounded-full text-xs font-black text-white/90"
        style={{ top: 'max(1.2rem, env(safe-area-inset-top))', right: '1.2rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
        Skip ›
      </button>
    </div>
  );
}
