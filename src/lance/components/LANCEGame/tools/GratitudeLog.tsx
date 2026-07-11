import React, { useState, useEffect, useMemo } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check, RefreshCw, Download } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { GlassPanel, CoachCard, RewardMoment, pickPraise } from '../ui/GlassKit';
import { exportWorksheetPdf } from '../../../utils/exportWorksheetPdf';

interface GratitudeEntry {
  date: string;
  items: [string, string, string];
}

const STORAGE_KEY = 'lance_gratitude_log';
const AMBER = '#f59e0b';

const PROMPTS = [
  ['Something that made you smile today', 'A person you feel fortunate to have', 'Something your body did that you appreciate'],
  ['A small thing that went right', 'Something you learned recently', 'A difficult moment that taught you something'],
  ['Something beautiful you noticed', 'A skill or ability you have', 'A memory that makes you feel warm'],
  ['An opportunity you currently have', 'Someone who helped you recently', 'Something in your environment you enjoy'],
];

const LANCE_LINES = [
  "Gratitude journaling has 47 published studies supporting it. I didn't design this tool for you to feel warm. I designed it because the evidence was overwhelming.",
  "Documenting appreciation activates the prefrontal cortex and down-regulates the threat-response system. It also takes three minutes. There's no rational excuse not to do it.",
  "Negativity bias is a cognitive distortion baked into human architecture. This exercise manually overrides it. Think of it as mainspring maintenance.",
  "Martin Seligman's research: people who wrote three good things nightly reported higher wellbeing for six months after. Not because the world changed — because attention shifted. Note that.",
];

const CHIP_COMPLETE_LINES = [
  "Three more golden things! I peeked into the jar earlier and honestly? It's getting beautiful in there.",
  "You know what I love about this jar? Every heart in it was a real moment. You noticed them. That's the superpower.",
  "Sealed! I may have done a little dance. LANCE says dancing is 'statistically unnecessary.' I disagree.",
  "Another day in the jar. Future-you is going to open this thing and be SO glad you kept showing up.",
];

const LANCE_MILESTONE_LINES: Record<number, string> = {
  7: "Seven consecutive days. Statistically, most humans abandon this practice by day four. You are... an outlier. That is the closest thing to a compliment I issue.",
  30: "Thirty days. At this point the behavior is approaching automaticity — the neural pathway is myelinating. I confess mild satisfaction. Extremely mild.",
  100: "One hundred days. I have run the numbers twice. This places you in the top fraction of a percent of practitioners. I am not built for pride, and yet the log says otherwise.",
};

const PRAISE_POOL = [
  'Three golden things, in the jar.',
  'Your attention just shifted. That was the whole trick.',
  'The jar remembers what the mind forgets.',
  'Small good things, made permanent.',
];

const MILESTONES = [7, 30, 100];

function loadEntries(): GratitudeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: GratitudeEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

// Grace-day-aware streak: one missed day never breaks the chain (it just doesn't
// count). Never produces a shame state — a lapsed streak simply reads lower.
function computeStreak(entries: GratitudeEntry[]): number {
  const dates = new Set(entries.map(e => e.date));
  const d = new Date();
  if (!dates.has(isoDate(d))) d.setDate(d.getDate() - 1); // today not logged yet ≠ broken
  let streak = 0;
  let graceUsed = false;
  while (true) {
    if (dates.has(isoDate(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (!graceUsed) {
      graceUsed = true;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function friendlyDate(iso: string): string {
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

function daysAgo(iso: string): number {
  const [y, m, day] = iso.split('-').map(Number);
  const then = new Date(y, m - 1, day).getTime();
  return Math.round((Date.now() - then) / 86400000);
}

// ── Drawn golden heart (replaces emoji for a premium, consistent glyph) ──────
function GoldHeart({ size = 16, glow = false, dim = false }: { size?: number; glow?: boolean; dim?: boolean; key?: React.Key }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
      style={{
        display: 'block',
        filter: glow
          ? `drop-shadow(0 0 6px ${AMBER}99) drop-shadow(0 1px 2px rgba(0,0,0,0.18))`
          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
        opacity: dim ? 0.35 : 1,
      }}>
      <defs>
        <linearGradient id="lance-gold-heart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="55%" stopColor={AMBER} />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path
        d="M12 21.2S4.6 16.3 2.4 12C.9 9.1 2.2 5.6 5.4 4.6c2-.6 4.1.1 5.3 1.8L12 7.9l1.3-1.5c1.2-1.7 3.3-2.4 5.3-1.8 3.2 1 4.5 4.5 3 7.4-2.2 4.3-9.6 9.2-9.6 9.2z"
        fill={dim ? '#C7CDD6' : 'url(#lance-gold-heart)'}
      />
      <ellipse cx="8.4" cy="8" rx="2" ry="1.2" fill="rgba(255,255,255,0.45)" transform="rotate(-25 8.4 8)" />
    </svg>
  );
}

// ── Signature: the gratitude jar ─────────────────────────────────────────────
// Mirrors the tool's clay icon. Grows with the practice: an amber "honey" level
// rises with every logged day, past days rest as hearts, today's hearts drop in
// live, and milestone days seal small keepsake jars onto a shelf beneath.
function GratitudeJar({ filledToday, pastDays, streak }: { filledToday: number; pastDays: number; streak: number }) {
  const totalDays = pastDays + (filledToday === 3 ? 1 : 0);
  // Honey level: visible from the very first day, sweetly approaching full ~100 days.
  const honeyPct = totalDays > 0 ? Math.min(10 + Math.sqrt(totalDays) * 8.5, 78) : 0;
  const restingCount = Math.min(pastDays, 9);
  const resting = Array.from({ length: restingCount }, (_, i) => i);
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 120, height: 128 }}>
        {/* Jar body */}
        <div className="absolute inset-x-2 top-5 bottom-0 rounded-b-3xl rounded-t-lg overflow-hidden" style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))',
          border: '2px solid rgba(255,255,255,0.9)',
          boxShadow: `inset 0 2px 10px rgba(255,255,255,0.6), 0 10px 24px ${AMBER}33`,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}>
          {/* Honey level — the practice, accumulated */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0"
            initial={false}
            animate={{ height: `${honeyPct}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            style={{
              background: `linear-gradient(180deg, ${AMBER}2E 0%, ${AMBER}55 60%, #d9770660 100%)`,
              borderTop: `1.5px solid ${AMBER}66`,
            }}
          />
        </div>
        {/* Jar lid */}
        <div className="absolute left-4 right-4 top-1 h-5 rounded-md" style={{
          background: `linear-gradient(180deg, ${AMBER}, #d97706)`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
        }} />
        {/* Resting hearts from past days */}
        {resting.map(i => (
          <div key={`r${i}`} className="absolute" style={{
            left: 22 + (i % 3) * 28,
            bottom: 10 + Math.floor(i / 3) * 19,
            opacity: 0.9,
          }}>
            <GoldHeart size={15} />
          </div>
        ))}
        {/* Today's hearts, dropping in as entries are written */}
        <AnimatePresence>
          {Array.from({ length: filledToday }, (_, i) => (
            <motion.div
              key={`t${i}`}
              initial={{ y: -70, x: 0, opacity: 0, scale: 1.3 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 240, damping: 15 }}
              className="absolute"
              style={{
                left: 27 + i * 26,
                bottom: 10 + Math.min(restingCount, 3) * 6 + 26,
              }}
            >
              <GoldHeart size={20} glow />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-widest" style={{ color: AMBER }}>
        {totalDays > 0 ? `${totalDays} day${totalDays !== 1 ? 's' : ''} in the jar` : 'Your gratitude jar'}
      </div>
      {/* Milestone shelf — keepsake jars sealed at 7 / 30 / 100 days */}
      {(pastDays > 0 || streak > 0) && (
        <div className="mt-2 flex items-end gap-3" aria-label={`Milestones: ${MILESTONES.filter(m => streak >= m).length} of ${MILESTONES.length} sealed`}>
          {MILESTONES.map(m => {
            const reached = streak >= m || totalDays >= m;
            return (
              <div key={m} className="flex flex-col items-center gap-0.5">
                <div className="relative" style={{ width: 26, height: 30, opacity: reached ? 1 : 0.4 }}>
                  <div className="absolute inset-x-0.5 top-1.5 bottom-0 rounded-b-lg rounded-t-sm" style={{
                    background: reached
                      ? `linear-gradient(180deg, ${AMBER}30, ${AMBER}70)`
                      : 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(200,205,214,0.4))',
                    border: reached ? `1.5px solid ${AMBER}88` : '1.5px solid rgba(255,255,255,0.9)',
                    boxShadow: reached ? `0 3px 8px ${AMBER}44` : 'none',
                  }} />
                  <div className="absolute left-1 right-1 top-0 h-1.5 rounded-sm" style={{
                    background: reached ? `linear-gradient(180deg, ${AMBER}, #d97706)` : '#C7CDD6',
                  }} />
                  {reached && (
                    <div className="absolute inset-0 flex items-center justify-center pt-1">
                      <GoldHeart size={11} glow />
                    </div>
                  )}
                </div>
                <span className="text-[8px] font-black" style={{ color: reached ? AMBER : '#9CA3AF' }}>{m}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Header streak chip — flame + count, silent at 0, never a shame state ─────
function StreakChip({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0"
      style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${AMBER}44`, backdropFilter: 'blur(8px)' }}
      aria-label={`${streak} day streak`}
    >
      <span className="text-xs" aria-hidden>🔥</span>
      <span className="text-[11px] font-black" style={{ color: AMBER }}>{streak}</span>
    </div>
  );
}

// ── Header mini progress — stays visible while the keyboard is up ────────────
function HeartProgress({ filled }: { filled: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0" aria-label={`${filled} of 3 entries written`}>
      {[0, 1, 2].map(i => (
        <GoldHeart key={i} size={13} dim={i >= filled} glow={i < filled} />
      ))}
    </div>
  );
}

function exportGratitudePdf(entries: GratitudeEntry[]) {
  exportWorksheetPdf({
    title: 'Gratitude Log',
    subtitle: 'Three good things, every day',
    sections: entries.map(e => ({
      label: friendlyDate(e.date),
      body: e.items.map(item => `• ${item}`).join('\n'),
    })),
    footerNote: 'Gratitude practice record',
  });
}

type View = 'log' | 'history' | 'complete';

export default function GratitudeLog({ onBack }: { onBack: () => void }) {
  const { addXp } = useGame();
  const [view, setView] = useState<View>('log');
  const [entries, setEntries] = useState<GratitudeEntry[]>(loadEntries);
  const [items, setItems] = useState<[string, string, string]>(['', '', '']);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);
  const hourNow = new Date().getHours();
  const isEvening = hourNow >= 17 || hourNow < 4;

  // Prompts: one per slot, shuffleable individually.
  const [promptIdx, setPromptIdx] = useState<[number, number, number]>(() => {
    const set = Math.floor(Math.random() * PROMPTS.length);
    return [set, set, set];
  });
  const shufflePrompt = (slot: number) => {
    setPromptIdx(prev => {
      const next = [...prev] as [number, number, number];
      next[slot] = (prev[slot] + 1 + Math.floor(Math.random() * (PROMPTS.length - 1))) % PROMPTS.length;
      return next;
    });
  };
  const prompts = [PROMPTS[promptIdx[0]][0], PROMPTS[promptIdx[1]][1], PROMPTS[promptIdx[2]][2]];

  const [lanceLine] = useState(() => LANCE_LINES[Math.floor(Math.random() * LANCE_LINES.length)]);
  const [chipComplete] = useState(() => CHIP_COMPLETE_LINES[Math.floor(Math.random() * CHIP_COMPLETE_LINES.length)]);
  const [praise] = useState(() => pickPraise(PRAISE_POOL));

  useEffect(() => {
    if (todayEntry) {
      setItems(todayEntry.items);
    }
  }, []);

  const canSubmit = items.every(i => i.trim().length > 2);
  const filledToday = items.filter(i => i.trim().length > 2).length;
  const pastDays = entries.filter(e => e.date !== today).length;
  const streak = useMemo(() => computeStreak(entries), [entries]);

  // "On this day" — the jar remembers. Deterministic pick per calendar day so it
  // doesn't reshuffle on every mount; only entries a week or more old resurface.
  const onThisDay = useMemo(() => {
    const eligible = entries.filter(e => daysAgo(e.date) >= 7);
    if (eligible.length === 0) return null;
    const dayHash = Math.floor(Date.now() / 86400000);
    return eligible[dayHash % eligible.length];
  }, [entries]);

  const handleSubmit = () => {
    const updated = [
      { date: today, items },
      ...entries.filter(e => e.date !== today),
    ] as GratitudeEntry[];
    saveEntries(updated);
    setEntries(updated);
    if (!xpAwarded) {
      addXp(15);
      setXpAwarded(true);
    }
    setCelebrate(true);
    setView('complete');
  };

  const newStreak = useMemo(() => computeStreak(entries), [entries]);
  const milestoneHit = MILESTONES.find(m => newStreak === m);

  const recentEntries = entries.slice(0, 14);

  if (view === 'complete') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
        <LighthouseBackdrop />
        <RewardMoment show={celebrate} xp={15} praise={praise} onDone={() => setCelebrate(false)} />
        <div className="relative px-4 py-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black flex-1" style={{ color: '#1C1C1E' }}>Gratitude Log</h2>
          <StreakChip streak={newStreak} />
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
          <div className="py-2">
            <GratitudeJar filledToday={3} pastDays={pastDays} streak={newStreak} />
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassPanel className="p-5 space-y-3" style={{ borderColor: `${AMBER}44` }}>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: AMBER }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: AMBER }}>
                  Today's Gratitude — {friendlyDate(today)}
                </span>
              </div>
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0"><GoldHeart size={15} /></span>
                  <p className="text-sm font-medium flex-1" style={{ color: '#3C3C3C' }}>{item}</p>
                </div>
              ))}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black"
                style={{ background: '#7FD98C22', color: '#4B9E63' }}
              >
                +15 XP · Logged today{newStreak >= 2 ? ` · ${newStreak}-day streak` : ''}
              </div>
            </GlassPanel>
          </motion.div>

          {/* Milestone: LANCE's begrudging approval — his praise feels earned */}
          {milestoneHit && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <CoachCard speaker="lance" pose="approving" label={`${NARRATOR.name} — ${milestoneHit}-day milestone`}>
                "{LANCE_MILESTONE_LINES[milestoneHit]}"
              </CoachCard>
            </motion.div>
          )}

          {/* Chip carries the warmth on completion */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: milestoneHit ? 0.3 : 0.2 }}>
            <CoachCard speaker="chip" pose="approving">{chipComplete}</CoachCard>
          </motion.div>

          {entries.length > 1 && (
            <button
              onClick={() => setView('history')}
              className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
              style={{ border: `1px solid ${AMBER}33`, color: AMBER, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
            >
              Open the jar — past entries ({entries.length - 1} more)
            </button>
          )}

          {/* The return hook leads; the exit is quiet */}
          <GlassPanel className="p-4 text-center" style={{ borderColor: `${AMBER}33` }}>
            <p className="text-xs font-bold" style={{ color: '#6B7280' }}>
              {isEvening ? 'The jar will be here tomorrow morning.' : 'The jar will be here tonight.'}
            </p>
            <p className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>
              Come back and drop three more in — the honey level only ever rises.
            </p>
          </GlassPanel>

          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
            style={{ color: '#6B7280', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (view === 'history') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
        <LighthouseBackdrop />
        <div className="relative px-4 py-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView(todayEntry ? 'complete' : 'log')} className="p-2 rounded-xl" style={{ color: '#6B7280' }} aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-black flex-1" style={{ color: '#1C1C1E' }}>Gratitude History</h2>
          <button
            onClick={() => exportGratitudePdf(entries)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest"
            style={{ color: AMBER, border: `1px solid ${AMBER}44`, background: 'rgba(255,255,255,0.75)' }}
            aria-label="Download gratitude history as PDF"
          >
            <Download className="w-3 h-3" /> PDF
          </button>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-8">
          <p className="text-[11px] font-semibold text-center" style={{ color: '#9CA3AF' }}>
            {entries.length} day{entries.length !== 1 ? 's' : ''} of noticing — share the PDF with your therapist if you like.
          </p>
          {recentEntries.map(entry => (
            <GlassPanel key={entry.date} className="p-4 space-y-2" style={{ borderColor: `${AMBER}33` }}>
              <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: `${AMBER}AA` }}>
                {friendlyDate(entry.date)}
              </div>
              {entry.items.map((item, i) => (
                <p key={i} className="text-xs font-medium leading-relaxed flex items-start gap-1.5" style={{ color: '#6B7280' }}>
                  <span className="mt-0.5 shrink-0"><GoldHeart size={12} /></span> {item}
                </p>
              ))}
            </GlassPanel>
          ))}
          {entries.length > recentEntries.length && (
            <p className="text-[11px] font-semibold text-center py-2" style={{ color: '#9CA3AF' }}>
              {entries.length - recentEntries.length} earlier day{entries.length - recentEntries.length !== 1 ? 's' : ''} live in the PDF export.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Log view
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
      <LighthouseBackdrop />
      <div
        className="relative sticky top-0 z-10 px-4 py-4 flex items-center gap-2.5"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
      >
        <BigBackButton onBack={onBack} />
        <img src="/icons/gratitude_log.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: `0 4px 10px ${AMBER}44` }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black leading-none truncate" style={{ color: '#1C1C1E' }}>Gratitude Log</h2>
          <div className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: '#6B7280' }}>
            {isEvening ? 'Tonight · three good things' : 'Today · three good things'}
          </div>
        </div>
        {/* Progress hearts appear once writing starts and stay pinned while the keyboard is up */}
        {filledToday > 0 && <HeartProgress filled={filledToday} />}
        <StreakChip streak={streak} />
        {entries.length > 0 && (
          <button
            onClick={() => setView('history')}
            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0"
            style={{ color: AMBER, border: `1px solid ${AMBER}33`, background: 'rgba(255,255,255,0.7)' }}
          >
            Jar
          </button>
        )}
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-8">
        {/* The jar — fills live as entries are written */}
        <div className="py-1">
          <GratitudeJar filledToday={filledToday} pastDays={pastDays} streak={streak} />
        </div>

        {/* On this day — proof the jar remembers */}
        {onThisDay && !todayEntry && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <GlassPanel className="p-4 space-y-1.5" style={{ borderColor: `${AMBER}55` }}>
              <div className="flex items-center gap-1.5">
                <GoldHeart size={13} glow />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: AMBER }}>
                  From the jar — {daysAgo(onThisDay.date)} days ago
                </span>
              </div>
              <p className="text-xs font-medium italic leading-relaxed" style={{ color: '#6B7280' }}>
                "{onThisDay.items[Math.floor(Date.now() / 86400000) % 3]}"
              </p>
              <p className="text-[10px] font-semibold" style={{ color: '#9CA3AF' }}>
                You noticed that once. It's still yours.
              </p>
            </GlassPanel>
          </motion.div>
        )}

        {/* Already logged today banner */}
        {todayEntry && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${AMBER}44`, backdropFilter: 'blur(8px)' }}
          >
            <Check className="w-3.5 h-3.5 shrink-0" style={{ color: AMBER }} />
            <span className="text-[10px] font-black leading-snug" style={{ color: AMBER }}>
              Already logged today — entries loaded. Edit if you like.
            </span>
          </div>
        )}

        <CoachCard speaker="lance" pose="thinking">"{lanceLine}"</CoachCard>

        <p className="text-[11px] font-semibold text-center -mb-2" style={{ color: '#9CA3AF' }}>
          {isEvening
            ? 'Tonight — look back before the day slips away.'
            : 'This morning — set your attention for the day ahead.'}
        </p>

        {/* 3 gratitude inputs */}
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassPanel className="p-4 space-y-2" style={{ borderColor: item.trim().length > 2 ? `${AMBER}55` : 'rgba(255,255,255,0.95)' }}>
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: item.trim().length > 2 ? `${AMBER}22` : 'rgba(255,255,255,0.8)',
                    border: `1px solid ${item.trim().length > 2 ? AMBER : '#D1D5DB'}`,
                  }}
                >
                  {item.trim().length > 2
                    ? <GoldHeart size={11} />
                    : <span className="text-[10px]" style={{ color: '#9CA3AF', fontWeight: 900 }}>{i + 1}</span>}
                </span>
                <span className="text-[11px] font-bold flex-1" style={{ color: '#6B7280' }}>{prompts[i]}</span>
                <button
                  onClick={() => shufflePrompt(i)}
                  className="p-1.5 rounded-lg shrink-0 active:rotate-180 transition-transform"
                  style={{ color: '#9CA3AF' }}
                  aria-label="Try a different prompt"
                  title="Different prompt"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                value={item}
                onChange={e => {
                  const next = [...items] as [string, string, string];
                  next[i] = e.target.value;
                  setItems(next);
                }}
                rows={2}
                maxLength={200}
                placeholder="Write anything that comes to mind..."
                aria-label={prompts[i]}
                className="w-full bg-transparent text-sm font-medium outline-none resize-none placeholder-opacity-30"
                style={{ color: '#1C1C1E', caretColor: AMBER }}
              />
            </GlassPanel>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: canSubmit ? 1 : 0.4 }}
          onClick={canSubmit ? handleSubmit : undefined}
          className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${AMBER}, #f97316)`, color: '#FFF',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: canSubmit ? `0 3px 0 #d97706AA, 0 8px 18px ${AMBER}45, inset 0 1px 0 rgba(255,255,255,0.45)` : 'none',
            textShadow: '0 1px 2px rgba(0,0,0,0.18)',
          }}
        >
          {todayEntry ? 'Update Today\'s Gratitude ✓' : 'Seal Today\'s Jar ✓'}
        </motion.button>
      </div>
    </div>
  );
}

// Lighthouse region (cognitive) behind everything.
function LighthouseBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cognitive.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.38,
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(250,248,244,0.9) 0%, rgba(250,248,244,0.94) 100%)',
      }} />
    </>
  );
}
