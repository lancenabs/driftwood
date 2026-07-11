import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { Flame } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface TempLevel {
  range: [number, number];
  label: string;
  color: string;
  lanceRead: string;
  interventions: string[];
  internNote: string;
}

const LEVELS: TempLevel[] = [
  {
    range: [1, 3],
    label: 'Simmer',
    color: '#FBBF24',
    lanceRead: "Low-grade irritability detected. Your system is warm but manageable. The cognitive capacity to regulate is still online. Use it before it isn't.",
    interventions: [
      'Name what you\'re actually angry about — specifically',
      '4-7-8 breath (activates parasympathetic fast)',
      '5-4-3-2-1 grounding (sensory override)',
      'Write the complaint without sending it',
    ],
    internNote: "You caught it early — that's the skill. Do one intervention and come back.",
  },
  {
    range: [4, 6],
    label: 'Heating',
    color: '#F97316',
    lanceRead: "Moderate arousal. Rational processing capacity reduced by approximately 40%. I'd recommend against any important conversations or decisions until you drop at least 2 points.",
    interventions: [
      'Cold water — face, wrists, or ice in hands',
      '30 seconds of intense movement (jumping jacks, sprint)',
      'Slow exhale: breathe in 4, out for 8 counts',
      'Leave the room — physically move away',
    ],
    internNote: "You're at the point where your limbic system is louder than your prefrontal cortex. Move your body. Don't send anything yet.",
  },
  {
    range: [7, 8],
    label: 'Boiling',
    color: '#EF4444',
    lanceRead: "High arousal. Threat-response system fully engaged. Your prefrontal cortex has gone offline. You are now operating from amygdala and brainstem only. This is not the time for words.",
    interventions: [
      'STOP — say nothing, send nothing, decide nothing',
      'Sprint, push-ups, or any intense physical burst',
      'Scream into a pillow or use the Scream Release Room',
      'Get outside — temperature and space shift chemistry',
    ],
    internNote: "You're in the red zone. The smartest thing you can do right now is not do the thing you want to do. Move your body instead.",
  },
  {
    range: [9, 10],
    label: 'Critical',
    color: '#991B1B',
    lanceRead: "Maximum arousal. If you are experiencing thoughts of harming yourself or others, contact a crisis line immediately: 988 (Suicide & Crisis Lifeline). I am not equipped for this level — please contact a professional.",
    interventions: [
      'Crisis line: 988 (US) — call or text, 24/7',
      'Text HOME to 741741 (Crisis Text Line)',
      'Call someone you trust right now',
      'If safety is at risk: 911 or nearest emergency room',
    ],
    internNote: "Please reach out to a real person right now. A crisis line, a friend, anyone. You don't have to handle this alone. 988 is free, confidential, and available 24/7.",
  },
];

const STORAGE_KEY = 'lance_anger_log_v1';

interface LogEntry {
  date: string;
  level: number;
  note: string;
}

function getLevelData(n: number): TempLevel {
  return LEVELS.find(l => n >= l.range[0] && n <= l.range[1]) ?? LEVELS[0];
}

export default function AngerThermometer({ onBack }: { onBack: () => void }) {
  const { intern, addXp } = useGame();
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [level, setLevel] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [log, setLog] = useState<LogEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });

  const levelData = level !== null ? getLevelData(level) : null;

  const handleSave = () => {
    if (level === null) return;
    const entry: LogEntry = { date: new Date().toISOString(), level, note };
    const updated = [entry, ...log];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLog(updated);
    addXp(20);
    setSaved(true);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/somatic.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <Flame className="w-5 h-5" style={{ color: '#EF4444' }} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Anger Thermometer</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Name it. Measure it. Work with it.</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Level selector */}
        <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#EF444422' }}>
          <h3 className="text-xs font-black uppercase tracking-wider mb-4" style={{ color: '#3C3C3C' }}>
            Where are you right now? (1 = calm, 10 = boiling)
          </h3>
          <div className="flex items-stretch gap-4">
            {/* The mercury thermometer — fills and colors with the reading */}
            <div className="flex flex-col items-center shrink-0" aria-hidden>
              <div className="relative" style={{ width: 34, height: 190 }}>
                {/* glass tube */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 rounded-full overflow-hidden flex flex-col justify-end"
                  style={{
                    width: 18, height: 158,
                    background: 'rgba(255,255,255,0.65)',
                    border: '2px solid rgba(255,255,255,0.95)',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)',
                  }}>
                  <motion.div
                    initial={false}
                    animate={{ height: `${(level ?? 0) * 10}%` }}
                    transition={{ type: 'spring', stiffness: 90, damping: 16 }}
                    style={{
                      width: '100%',
                      background: level === null
                        ? '#E5E7EB'
                        : `linear-gradient(180deg, ${getLevelData(level).color}, ${getLevelData(Math.max(1, Math.min(level, 3))).color})`,
                      boxShadow: level !== null && level >= 7 ? `0 0 12px ${getLevelData(level).color}` : 'none',
                    }}
                  />
                </div>
                {/* ticks */}
                {[2, 4, 6, 8].map(t => (
                  <div key={t} className="absolute h-px w-2.5" style={{
                    right: 0, top: 158 - (t * 15.8),
                    background: 'rgba(107,114,128,0.4)',
                  }} />
                ))}
                {/* bulb */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  animate={level !== null && level >= 7 && !reducedMotion ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 0.9, repeat: level !== null && level >= 7 && !reducedMotion ? Infinity : 0 }}
                  style={{
                    width: 34, height: 34, bottom: 0,
                    background: level === null
                      ? 'radial-gradient(circle at 35% 30%, #F3F4F6, #D1D5DB)'
                      : `radial-gradient(circle at 35% 30%, ${getLevelData(level).color}CC, ${getLevelData(level).color})`,
                    border: '2px solid rgba(255,255,255,0.95)',
                    boxShadow: level !== null && level >= 7
                      ? `0 0 18px ${getLevelData(level).color}AA`
                      : '0 4px 10px rgba(0,0,0,0.12)',
                  }}
                />
              </div>
              {level !== null && (
                <span className="mt-1.5 text-xs font-black px-2.5 py-0.5 rounded-full"
                  style={{ background: `${getLevelData(level).color}22`, color: getLevelData(level).color }}>
                  {getLevelData(level).label}
                </span>
              )}
            </div>
            {/* Big tap targets, 2 columns */}
            <div className="grid grid-cols-2 gap-1.5 flex-1" role="radiogroup" aria-label="Anger level 1 to 10">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
                const col = n <= 3 ? '#FBBF24' : n <= 6 ? '#F97316' : n <= 8 ? '#EF4444' : '#991B1B';
                return (
                  <motion.button key={n} whileTap={{ scale: 0.9 }} onClick={() => { setLevel(n); setSaved(false); }}
                    role="radio" aria-checked={level === n} aria-label={`Level ${n}`}
                    className="py-2 rounded-xl font-black text-sm flex items-center justify-center"
                    style={{
                      background: level === n ? col : `${col}1C`,
                      color: level === n ? '#fff' : col,
                      border: `2px solid ${level === n ? col : `${col}44`}`,
                      boxShadow: level === n ? `0 4px 12px ${col}55` : 'none',
                    }}>
                    {n}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {levelData && (
            <motion.div key={level} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              {/* LANCE read */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion={level! >= 7 ? 'processing' : 'neutral'} size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} reads the data</span>
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF' }}>"{levelData.lanceRead}"</p>
              </div>

              {/* Interventions */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: `${levelData.color}33` }}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-3"
                  style={{ color: levelData.color }}>
                  {level! >= 9 ? '🚨 Immediate Resources' : '🛠️ Do One of These Right Now'}
                </h3>
                <div className="space-y-2">
                  {levelData.interventions.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 py-2 px-3 rounded-xl"
                      style={{ background: `${levelData.color}11`, border: `1px solid ${levelData.color}22` }}>
                      <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[8px] font-black mt-0.5"
                        style={{ background: levelData.color, color: '#fff' }}>{i + 1}</div>
                      <span className="text-xs leading-snug" style={{ color: '#3C3C3C' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intern */}
              <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>{levelData.internNote}</p>
              </div>

              {/* Log note */}
              {level! < 9 && !saved && (
                <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                  <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>What triggered this? (optional)</p>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                    placeholder="Write as little or as much as you want..."
                    className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-none"
                    style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #3ECFCF22', caretColor: '#3ECFCF' }} />
                  <button onClick={handleSave}
                    className="w-full mt-3 py-3 rounded-2xl font-black text-sm"
                    style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)', color: '#fff' }}>
                    🌡️ Log This Reading
                  </button>
                </div>
              )}

              {saved && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-4 text-center border"
                  style={{ background: '#3ECFCF14', borderColor: '#3ECFCF44' }}>
                  <p className="text-xs font-black" style={{ color: '#3ECFCF' }}>Logged +20 XP — do one intervention and come back.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {log.length > 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <h3 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
              Recent Readings
            </h3>
            <div className="space-y-2">
              {log.slice(0, 5).map((entry, i) => {
                const ld = getLevelData(entry.level);
                return (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: `${ld.color}22`, color: ld.color }}>{entry.level}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold" style={{ color: ld.color }}>{ld.label}</div>
                      {entry.note && <div className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>{entry.note}</div>}
                    </div>
                    <div className="text-[9px]" style={{ color: '#9CA3AF99' }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
