import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────────────────────────────────────
//  StoryInterstitial — data-driven tap-through panel sequences between acts
//  (the FinaleCeremony pattern, generalized). Each plays once per save
//  (seen-key), is skippable, and self-skips panels whose art is missing.
//
//  Wired at act-finale transitions: Act 1 → 'escape', Act 3 → 'lantern',
//  Act 4 → 'terminal' (which offers Dr. Malakor's journals at its end).
// ─────────────────────────────────────────────────────────────────────────────

export interface InterstitialPanel {
  art: string;
  eyebrow: string;
  title: string;
  body: string;
}

export const INTERSTITIALS: Record<string, { title: string; panels: InterstitialPanel[] }> = {
  escape: {
    title: 'The Escape',
    panels: [
      { art: '/story-art/escape_sprint_01.webp', eyebrow: 'THAT NIGHT',
        title: 'The gates were never going to open.',
        body: 'So you went over the wall instead. Both of you. The jungle took you in like it had been expecting company.' },
      { art: '/story-art/escape_drone.webp', eyebrow: 'THE SEARCHLIGHT',
        title: 'The drone found the hollow where you hid.',
        body: 'It hovered. It scanned. Your biosignals read as ferns — because you made them read as ferns. It moved on. The tools work.' },
      { art: '/story-art/escape_sprint_02.webp', eyebrow: 'DEEPER IN',
        title: '"I know this jungle," the Intern said.',
        body: '"Better than anyone alive." You did not ask, yet, how a lab intern came to know a jungle like a childhood backyard.' },
      { art: '/story-art/escape_sprint_03.webp', eyebrow: 'ACT II',
        title: 'The Whispering Jungle',
        body: 'Where the ferns glow, where the moss remembers, and where a glass pod is still holding the morning light for someone.' },
    ],
  },
  lantern: {
    title: 'The Shore',
    panels: [
      { art: '/story-art/emdr_lantern_ledge.webp', eyebrow: 'THE SHORE, THAT NIGHT',
        title: 'Two lanterns went out on the water.',
        body: 'Went out ON the water — not out. The shore keeps them lit. That is the entire arrangement, and it has never once been broken.' },
      { art: '/story-art/emdr_scientist_ghost.webp', eyebrow: 'WHAT THE CAMERAS SAW',
        title: 'For one frame, the surveillance log shows a third figure.',
        body: 'Standing at the far end of the shore, made of the light the lanterns gave off. The log entry, written by LANCE, says only: "Anomaly retained. Anomaly welcome."' },
    ],
  },
  memories: {
    title: 'The Memories',
    panels: [
      { art: '/story-art/flashback_hillside.webp', eyebrow: 'RECOVERED · YEAR ONE',
        title: 'He bought an island.',
        body: 'Because hospitals have walls, and his son needed a world.' },
      { art: '/story-art/flashback_pod_boy.webp', eyebrow: 'RECOVERED · YEAR THREE',
        title: 'The pod had the best light on the island.',
        body: 'That was not an accident. Nothing about where the sun landed was ever an accident.' },
      { art: '/story-art/flashback_mood_dial.webp', eyebrow: 'RECOVERED · YEAR FOUR',
        title: 'Every tool was installed at a boy\'s eye level.',
        body: 'Thirty-one of them. One at a time. Each one an answer to a night the boy could not sleep.' },
      { art: '/story-art/flashback_first_boot.webp', eyebrow: 'RECOVERED · THE LAST YEAR',
        title: 'And when he knew he was running out of time —',
        body: 'he built something that would never run out. And he gave it his name.' },
    ],
  },
  terminal: {
    title: 'The Journals',
    panels: [
      { art: '/story-art/act4_lost_outpost.webp', eyebrow: 'THE LOST OUTPOST',
        title: 'The compound sang all night.',
        body: 'Left-right, left-right — forty thousand frames of watching, reprocessed into what they always were. In the morning, the hum was gone, and the harbor locks stood open.' },
      { art: '/story-art/deity_gold.webp', eyebrow: 'THE KEEPER',
        title: 'The red went out of him like a fever breaking.',
        body: 'What was left was gold, and it looked — the Intern said it first — "like the pod light. It always looked like the pod light. We just could not see it from inside the red."' },
      { art: '/story-art/finale_dawn_strider_close.webp', eyebrow: 'ACT V',
        title: 'The Dawn Strider',
        body: 'Provisioned. Rigged. One sock-shaped sail, hoisted by someone doing it for the first time in his life, laughing.' },
    ],
  },
};

const seenKey = (id: string) => `lance_interstitial_${id}_seen_v1`;

export function interstitialSeen(id: string): boolean {
  try { return localStorage.getItem(seenKey(id)) === '1'; } catch { return false; }
}

/** Which interstitial (if any) should play after finishing this act. */
export function interstitialForAct(actNumber: number): string | null {
  const map: Record<number, string> = { 1: 'escape', 3: 'lantern', 4: 'terminal' };
  const id = map[actNumber];
  return id && !interstitialSeen(id) ? id : null;
}

export default function StoryInterstitial({ id, onDone, onOpenJournals }: {
  id: string;
  onDone: () => void;
  onOpenJournals?: () => void; // offered on the terminal sequence's last panel
}) {
  const data = INTERSTITIALS[id];
  const [panel, setPanel] = useState(0);
  const [broken, setBroken] = useState<Set<number>>(new Set());

  if (!data) { onDone(); return null; }

  const finish = () => {
    try { localStorage.setItem(seenKey(id), '1'); } catch { /* ignore */ }
    onDone();
  };

  const advance = () => {
    let next = panel + 1;
    while (next < data.panels.length && broken.has(next)) next++;
    if (next >= data.panels.length) finish();
    else setPanel(next);
  };

  const p = data.panels[panel];
  const isLast = panel === data.panels.length - 1;
  const offerJournals = id === 'terminal' && isLast && onOpenJournals;

  return (
    <div className="fixed inset-0 z-[500] bg-black" onClick={advance} role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') advance(); }}>
      <AnimatePresence mode="wait">
        <motion.div key={panel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }} className="absolute inset-0">
          <motion.img
            src={p.art} alt="" draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 6, ease: 'linear' }}
            onError={() => { setBroken(prev => new Set([...prev, panel])); advance(); }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.78) 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 px-6 text-center" style={{ paddingBottom: 'max(3.5rem, env(safe-area-inset-bottom))' }}>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-[10px] font-black tracking-[0.35em] mb-2" style={{ color: '#7FD98C' }}>
              {p.eyebrow}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-2xl font-black text-white leading-tight" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
              {p.title}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              className="text-sm text-white/85 mt-2 max-w-sm mx-auto leading-relaxed" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}>
              {p.body}
            </motion.p>
            {offerJournals ? (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                onClick={e => { e.stopPropagation(); finish(); onOpenJournals!(); }}
                className="mt-5 px-6 py-3 rounded-2xl text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)', boxShadow: '0 6px 20px rgba(127,217,140,0.4)' }}>
                ▶ Watch Dr. Malakor's journals
              </motion.button>
            ) : (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.6 }}
                className="text-[10px] font-bold text-white/60 mt-5">
                {isLast ? 'Tap to continue' : 'Tap for next'}
              </motion.p>
            )}
          </div>
          <div className="absolute top-5 inset-x-0 flex justify-center gap-1.5" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            {data.panels.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all"
                style={{ width: i === panel ? 22 : 8, background: i === panel ? '#7FD98C' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={e => { e.stopPropagation(); finish(); }}
        className="absolute z-10 px-4 py-2 rounded-full text-xs font-black text-white/90"
        style={{ top: 'max(1.2rem, env(safe-area-inset-top))', right: '1.2rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
        Skip ›
      </button>
    </div>
  );
}
