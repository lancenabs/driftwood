import React, { useState, useMemo } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { INTERN_POSES, LANCE_POSES } from '../GameCharacter';

// ─────────────────────────────────────────────────────────────────────────────
// Sleep Log — the app's true NIGHT-MODE interior. This tool is opened at 11pm
// in a dark bedroom: deep indigo glass, warm amber action color, no bright
// white surfaces, and a QUIET completion (a moonrise glow, not confetti).
// ─────────────────────────────────────────────────────────────────────────────

const INDIGO = '#818CF8';   // lavender-indigo, readable on dark
const AMBER = '#f59e0b';    // warm, melatonin-friendly action color
const TEXT = '#EEF0FF';
const MUTED = '#9FA3C8';

interface SleepEntry {
  date: string;
  hoursSlept: number;
  quality: number; // 1–5
  factors: string[];
  wakeFeel: 'refreshed' | 'okay' | 'groggy';
}

const STORAGE_KEY = 'lance_sleep_v1';
const FACTORS = [
  { id: 'phone', label: '📱 Phone in bed' },
  { id: 'caffeine', label: '☕ Caffeine PM' },
  { id: 'exercise', label: '🏃 Exercised' },
  { id: 'stress', label: '😰 Stressed' },
  { id: 'alcohol', label: '🍷 Alcohol' },
  { id: 'late_meal', label: '🍕 Late meal' },
];
const WAKE_OPTIONS = [
  { id: 'refreshed', label: '🌞 Refreshed', color: '#7FD98C' },
  { id: 'okay', label: '😐 Okay', color: '#3ECFCF' },
  { id: 'groggy', label: '😴 Groggy', color: '#A78BFA' },
] as const;
const QUALITY_LABELS = ['', 'Terrible', 'Poor', 'Fair', 'Good', 'Great'];

const LANCE_LINES = [
  "Your circadian rhythm is a 24.2-hour oscillator run by a cluster of 20,000 neurons. You just gave it a data point. It appreciates precision more than you do.",
  "Adenosine clearance, glymphatic drainage, memory consolidation — all of it happened while you were unconscious. Logging it is the only part I can verify.",
  "Sleep hygiene data recorded. I'll run pattern recognition on your failure points. That was a joke. Partially.",
  "Filed. Sleep is the single highest-leverage variable in your entire dataset. I don't say that about most human activities.",
];
const INTERN_LINES = [
  "Sleep affects literally everything — mood, focus, resilience. Logging this is a huge deal. Proud of you.",
  "Your body was working so hard while you slept. Honoring that with a log? That's real self-awareness.",
  "The fact that you're tracking this means you're paying attention to yourself. That matters more than the number.",
  "Sleep data = self-compassion data. I love that you're doing this.",
];
const LANCE_MILESTONE_LINES: Record<number, string> = {
  7: "Seven consecutive nights of data. Most humans quit tracking by night three. Statistically, you are becoming reliable. Do not let it go to your head.",
  30: "Thirty nights. A full lunar cycle of data. Your circadian baseline is now computable. I am... not displeased.",
};
const MILESTONES = [7, 30];

function loadEntries(): SleepEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}
function saveEntries(entries: SleepEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

// Grace-day-aware streak — one missed night never breaks the chain, and there
// is never a shame state; a lapsed streak simply reads lower.
function computeStreak(entries: SleepEntry[]): number {
  const dates = new Set(entries.map(e => e.date));
  const d = new Date();
  if (!dates.has(isoDate(d))) d.setDate(d.getDate() - 1);
  let streak = 0;
  let graceUsed = false;
  while (true) {
    if (dates.has(isoDate(d))) { streak++; d.setDate(d.getDate() - 1); }
    else if (!graceUsed) { graceUsed = true; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

// ── Night backdrop: the mood hero dimmed to deep night ───────────────────────
function NightBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/mood.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(22px) brightness(0.5) saturate(0.9)', transform: 'scale(1.12)',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(17,19,43,0.88) 0%, rgba(10,12,30,0.94) 100%)',
      }} />
    </>
  );
}

// ── Dark glass panel (this interior's own surface language) ──────────────────
function NightPanel({ children, className = '', style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; key?: React.Key;
}) {
  return (
    <div className={`rounded-3xl ${className}`} style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.14)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Dark coach row (CoachCard would flash white in a night interior) ─────────
function NightCoach({ speaker, pose, label, children }: {
  speaker: 'lance' | 'chip'; pose: string; label?: string; children: React.ReactNode;
}) {
  const poses = speaker === 'lance' ? LANCE_POSES : INTERN_POSES;
  const src = (poses as Record<string, string>)[pose] ?? (poses as Record<string, string>).idle;
  const name = label ?? (speaker === 'lance' ? NARRATOR.name : 'Buddy');
  const nameColor = speaker === 'lance' ? '#67E8F9' : '#86EFAC';
  return (
    <NightPanel className="p-4">
      <div className="flex items-start gap-3">
        <img src={src} alt="" draggable={false}
          style={{ width: 60, height: 68, objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }} />
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: nameColor }}>{name}</div>
          <div className="text-xs leading-relaxed" style={{ color: MUTED, fontStyle: speaker === 'lance' ? 'italic' : 'normal' }}>
            {children}
          </div>
        </div>
      </div>
    </NightPanel>
  );
}

// ── Signature: the week of moons — tonight's moon fills live ────────────────
function MoonWeek({ entries, liveHours, today, glowToday }: {
  entries: SleepEntry[]; liveHours?: number; today: string; glowToday?: boolean;
}) {
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const days: { key: string; label: string; hours: number | null; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === key);
    days.push({
      key,
      label: d.toLocaleDateString('en', { weekday: 'narrow' }),
      hours: key === today && liveHours !== undefined ? liveHours : entry ? entry.hoursSlept : null,
      isToday: key === today,
    });
  }
  return (
    <div className="flex justify-center gap-2.5 py-1">
      {days.map(d => {
        const fill = d.hours === null ? 0 : Math.max(0, Math.min(1, d.hours / 8));
        return (
          <div key={d.key} className="flex flex-col items-center gap-1">
            <motion.div
              className="relative w-9 h-9 rounded-full overflow-hidden"
              animate={d.isToday && glowToday && !reducedMotion ? { boxShadow: [`0 0 10px ${INDIGO}44`, `0 0 26px ${INDIGO}CC`, `0 0 14px ${INDIGO}66`] } : {}}
              transition={{ duration: 2.4, repeat: d.isToday && glowToday && !reducedMotion ? Infinity : 0, ease: 'easeInOut' }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: d.isToday ? `2px solid ${INDIGO}` : '1px solid rgba(129,140,248,0.35)',
                boxShadow: fill > 0.85 ? `0 0 14px ${INDIGO}88` : '0 1px 4px rgba(0,0,0,0.3)',
              }}
            >
              {/* fill rises from the bottom like a waxing moon */}
              <div className="absolute inset-x-0 bottom-0 transition-all duration-500" style={{
                height: `${fill * 100}%`,
                background: `linear-gradient(180deg, #C7D2FE, ${INDIGO})`,
                boxShadow: fill > 0 ? 'inset 0 2px 6px rgba(255,255,255,0.35)' : 'none',
              }} />
              {d.hours === null && !d.isToday && (
                <div className="absolute inset-0 flex items-center justify-center text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>·</div>
              )}
            </motion.div>
            <span className="text-[8px] font-black" style={{ color: d.isToday ? INDIGO : MUTED }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Long-term artifact: the moon calendar (last 28 nights) ───────────────────
function MoonCalendar({ entries, today }: { entries: SleepEntry[]; today: string }) {
  const nights: { key: string; hours: number | null }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === key);
    nights.push({ key, hours: entry ? entry.hoursSlept : null });
  }
  const logged = entries.filter(e => nights.some(n => n.key === e.date));
  const avg = logged.length ? logged.reduce((s, e) => s + e.hoursSlept, 0) / logged.length : 0;
  const best = logged.length ? Math.max(...logged.map(e => e.hoursSlept)) : 0;
  return (
    <NightPanel className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: MUTED }}>
          Moon Calendar · 28 nights
        </span>
        {logged.length > 0 && (
          <span className="text-[10px] font-bold" style={{ color: INDIGO }}>
            avg {avg.toFixed(1)}h · best {best}h
          </span>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1.5 justify-items-center">
        {nights.map(n => {
          const fill = n.hours === null ? 0 : Math.max(0, Math.min(1, n.hours / 8));
          const isToday = n.key === today;
          return (
            <div key={n.key} className="relative w-5 h-5 rounded-full overflow-hidden" style={{
              background: 'rgba(255,255,255,0.06)',
              border: isToday ? `1.5px solid ${INDIGO}` : '1px solid rgba(129,140,248,0.22)',
              boxShadow: fill > 0.85 ? `0 0 8px ${INDIGO}77` : 'none',
            }}>
              {n.hours !== null && (
                <div className="absolute inset-x-0 bottom-0" style={{
                  height: `${fill * 100}%`,
                  background: `linear-gradient(180deg, #C7D2FE, ${INDIGO})`,
                }} />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-center" style={{ color: 'rgba(159,163,200,0.7)' }}>
        Each moon fills with that night's sleep — 8 hours is a full moon.
      </p>
    </NightPanel>
  );
}

function StreakChip({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0"
      style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${INDIGO}55` }}
      aria-label={`${streak} night streak`}>
      <span className="text-xs" aria-hidden>🌙</span>
      <span className="text-[11px] font-black" style={{ color: INDIGO }}>{streak}</span>
    </div>
  );
}

interface Props { onBack: () => void; }

export default function SleepLog({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const today = new Date().toISOString().split('T')[0];

  const [entries, setEntries] = useState<SleepEntry[]>(loadEntries);
  const [hoursSlept, setHoursSlept] = useState(7);
  const [quality, setQuality] = useState(3);
  const [factors, setFactors] = useState<string[]>([]);
  const [wakeFeel, setWakeFeel] = useState<'refreshed' | 'okay' | 'groggy'>('okay');
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const todayEntry = entries.find(e => e.date === today);
  const recentEntries = entries.slice(0, 7);
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const milestoneHit = submitted ? MILESTONES.find(m => streak === m) : undefined;

  const toggleFactor = (id: string) => {
    setFactors(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    const entry: SleepEntry = { date: today, hoursSlept, quality, factors, wakeFeel };
    const updated = [entry, ...entries.filter(e => e.date !== today)];
    saveEntries(updated);
    setEntries(updated);
    addXp(25);
    setSubmitted(true);
    // Bring the moonrise into view — the form leaves the user scrolled to the CTA.
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const qualityColor = (q: number) =>
    q >= 4 ? '#7FD98C' : q === 3 ? '#3ECFCF' : q === 2 ? '#FB923C' : '#F87171';

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: TEXT }}>
      <NightBackdrop />
      {/* Header — dark glass, night register */}
      <div
        className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(12,14,34,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <BigBackButton onBack={onBack} />
        <img src="/icons/sleep_log.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: `0 4px 12px ${INDIGO}66` }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black truncate" style={{ color: TEXT }}>Sleep Log</h2>
          <p className="text-[10px] truncate" style={{ color: MUTED }}>Night mode · easy on tired eyes</p>
        </div>
        <StreakChip streak={streak} />
      </div>

      <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
        {/* Week of moons — fills live with the slider; glows softly after logging */}
        <MoonWeek
          entries={entries}
          liveHours={!submitted && !todayEntry ? hoursSlept : undefined}
          today={today}
          glowToday={submitted}
        />
        <AnimatePresence mode="wait">

          {/* ── ALREADY LOGGED (arrived after logging earlier) ── */}
          {(submitted || todayEntry) && !submitted ? (
            <motion.div key="already" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <NightPanel className="p-5 text-center">
                <div className="text-4xl mb-2">🌙</div>
                <p className="text-sm font-black" style={{ color: TEXT }}>Tonight's sleep already logged</p>
                <p className="text-xs mt-1" style={{ color: MUTED }}>
                  {todayEntry!.hoursSlept}h · Quality: {QUALITY_LABELS[todayEntry!.quality]} · Felt {todayEntry!.wakeFeel}
                </p>
              </NightPanel>
              <MoonCalendar entries={entries} today={today} />
              <button onClick={onBack} className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
                style={{ color: MUTED, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
                ← Back
              </button>
            </motion.div>
          ) : submitted ? (

            /* ── QUIET MOONRISE COMPLETION — no confetti at bedtime ── */
            <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-1"
              >
                <span className="px-4 py-1.5 rounded-full font-black text-xs"
                  style={{ background: `${INDIGO}22`, color: '#C7D2FE', border: `1px solid ${INDIGO}55`, boxShadow: `0 0 18px ${INDIGO}44` }}>
                  +25 XP · night logged{streak >= 2 ? ` · ${streak} nights` : ''}
                </span>
              </motion.div>

              {milestoneHit && (
                <NightCoach speaker="lance" pose="approving" label={`${NARRATOR.name} — ${milestoneHit}-night milestone`}>
                  "{LANCE_MILESTONE_LINES[milestoneHit]}"
                </NightCoach>
              )}
              <NightCoach speaker="lance" pose="thinking">"{LANCE_LINES[lanceIdx]}"</NightCoach>
              <NightCoach speaker="chip" pose="approving" label={intern.name || 'Buddy'}>{INTERN_LINES[internIdx]}</NightCoach>

              {/* Stats */}
              <NightPanel className="p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: MUTED }}>Hours slept</span>
                  <span className="font-black" style={{ color: TEXT }}>{hoursSlept}h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: MUTED }}>Quality</span>
                  <span className="font-black" style={{ color: qualityColor(quality) }}>{QUALITY_LABELS[quality]}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: MUTED }}>Woke feeling</span>
                  <span className="font-black" style={{ color: TEXT }}>{wakeFeel}</span>
                </div>
              </NightPanel>

              <MoonCalendar entries={entries} today={today} />

              <NightPanel className="p-4 text-center">
                <p className="text-xs font-bold" style={{ color: MUTED }}>Sleep well tonight. The moon will be waiting tomorrow.</p>
              </NightPanel>

              <button onClick={onBack} className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
                style={{ color: MUTED, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
                ← Back to Home
              </button>
            </motion.div>
          ) : (

            /* ── LOG FORM ── */
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Hours Slept */}
              <NightPanel className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: TEXT }}>Hours Slept</span>
                  <span className="text-2xl font-black" style={{ color: INDIGO }}>{hoursSlept}h</span>
                </div>
                <input
                  type="range" min={1} max={12} step={0.5}
                  value={hoursSlept}
                  onChange={e => setHoursSlept(parseFloat(e.target.value))}
                  className="w-full"
                  style={{ accentColor: INDIGO }}
                  aria-label="Hours slept"
                />
                <div className="flex justify-between text-[9px] mt-1" style={{ color: MUTED }}>
                  <span>1h</span><span>6h</span><span>12h</span>
                </div>
              </NightPanel>

              {/* Quality */}
              <NightPanel className="p-5">
                <span className="text-xs font-black uppercase tracking-wider block mb-3" style={{ color: TEXT }}>
                  Sleep Quality
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(q => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className="flex-1 py-2.5 rounded-xl font-black text-xs transition-all active:scale-90"
                      style={{
                        background: quality === q ? qualityColor(q) + '2E' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${quality === q ? qualityColor(q) : 'rgba(255,255,255,0.18)'}`,
                        color: quality === q ? qualityColor(q) : MUTED,
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="text-center text-xs mt-2 font-bold" style={{ color: qualityColor(quality) }}>
                  {QUALITY_LABELS[quality]}
                </div>
              </NightPanel>

              {/* Wake Feel */}
              <NightPanel className="p-5">
                <span className="text-xs font-black uppercase tracking-wider block mb-3" style={{ color: TEXT }}>
                  How'd you wake up?
                </span>
                <div className="flex gap-2">
                  {WAKE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setWakeFeel(opt.id)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-90"
                      style={{
                        background: wakeFeel === opt.id ? opt.color + '22' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${wakeFeel === opt.id ? opt.color : 'rgba(255,255,255,0.18)'}`,
                        color: wakeFeel === opt.id ? opt.color : MUTED,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </NightPanel>

              {/* Factors */}
              <NightPanel className="p-5">
                <span className="text-xs font-black uppercase tracking-wider block mb-3" style={{ color: TEXT }}>
                  Factors (optional)
                </span>
                <div className="flex flex-wrap gap-2">
                  {FACTORS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => toggleFactor(f.id)}
                      className="px-3 py-2 rounded-full text-xs font-bold transition-all active:scale-90"
                      style={{
                        background: factors.includes(f.id) ? `${INDIGO}26` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${factors.includes(f.id) ? INDIGO : 'rgba(255,255,255,0.18)'}`,
                        color: factors.includes(f.id) ? '#C7D2FE' : MUTED,
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </NightPanel>

              {/* Moon calendar preview once there's history */}
              {entries.length >= 2 && <MoonCalendar entries={entries} today={today} />}

              {/* Recent list */}
              {recentEntries.length > 0 && (
                <NightPanel className="p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: MUTED }}>Recent Sleep</div>
                  <div className="space-y-2">
                    {recentEntries.slice(0, 5).map(e => (
                      <div key={e.date} className="flex items-center justify-between text-xs">
                        <span style={{ color: MUTED }}>
                          {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-3">
                          <span style={{ color: INDIGO }}>{e.hoursSlept}h</span>
                          <span className="font-black" style={{ color: qualityColor(e.quality) }}>{QUALITY_LABELS[e.quality]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </NightPanel>
              )}

              {/* Warm amber CTA — the only bright thing on the page, deliberately */}
              <motion.button
                whileTap={{ scale: 0.97, y: 2 }}
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl font-black text-sm"
                style={{
                  background: `linear-gradient(135deg, #d97706, ${AMBER})`, color: '#FFF7E8',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: `0 3px 0 #92400eAA, 0 8px 22px ${AMBER}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                }}
              >
                🌙 Log Tonight's Sleep
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
