import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { RewardMoment, pickPraise } from '../ui/GlassKit';

const PRAISE_POOL = [
  'Body maintenance: logged and honored.',
  'You moved, you fueled, you noticed. All three count.',
  'Infrastructure report filed. The machine thanks you.',
  'Rest days count too — and you showed up to say so.',
];

interface ActivityEntry {
  date: string;
  activities: { type: string; minutes: number }[];
  mealQuality: number; // 1–5
  meds: boolean | null; // null = not tracking
  water: number;       // glasses
  notes: string;
}

const STORAGE_KEY = 'lance_activity_v1';
const ACTIVITY_TYPES = [
  { id: 'walk', label: '🚶 Walk' },
  { id: 'run', label: '🏃 Run' },
  { id: 'workout', label: '💪 Workout' },
  { id: 'yoga', label: '🧘 Yoga' },
  { id: 'swim', label: '🏊 Swim' },
  { id: 'bike', label: '🚴 Bike' },
  { id: 'stretch', label: '🤸 Stretch' },
  { id: 'other', label: '⚡ Other' },
];
const MEAL_LABELS = ['', 'Poor', 'Meh', 'Fair', 'Good', 'Great'];
const MEAL_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#7FD98C', '#3ECFCF'];

function loadEntries(): ActivityEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveEntries(entries: ActivityEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const LANCE_LINES = [
  "Logged. The biological maintenance data is... acceptable. Barely.",
  "Activity recorded. I'll note that humans who track movement tend to live longer. Inconvenient, but true.",
  "Filed. Your physical operating parameters are now in the record. I'll reserve judgment.",
  "Maintenance logged. The fact that you're tracking this suggests some awareness of your own infrastructure.",
];
const INTERN_LINES = [
  "Logging your activity is how you make it real. You noticed what your body did today. That's everything.",
  "Every bit of movement counts. Every glass of water counts. You're taking care of yourself, and that matters.",
  "Small consistent actions compound. This log is proof you showed up for yourself today.",
  "Tracking this stuff is an act of self-respect. I see you doing it and it makes me so happy.",
];

interface Props { onBack: () => void; }

export default function ActivityTracker({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const today = new Date().toISOString().split('T')[0];

  const [entries, setEntries] = useState<ActivityEntry[]>(loadEntries);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customMinutes, setCustomMinutes] = useState<Record<string, number>>({});
  const [mealQuality, setMealQuality] = useState(3);
  const [meds, setMeds] = useState<boolean | null>(null);
  const [water, setWater] = useState(4);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [praise] = useState(() => pickPraise(PRAISE_POOL));
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const todayEntry = entries.find(e => e.date === today);

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
    if (!customMinutes[id]) {
      setCustomMinutes(prev => ({ ...prev, [id]: 30 }));
    }
  };

  const handleSubmit = () => {
    const activities = selectedActivities.map(id => ({
      type: id,
      minutes: customMinutes[id] ?? 30,
    }));
    const entry: ActivityEntry = { date: today, activities, mealQuality, meds, water, notes };
    const updated = [entry, ...entries.filter(e => e.date !== today)];
    saveEntries(updated);
    setEntries(updated);
    addXp(25);
    setSubmitted(true);
    setCelebrate(true);
  };

  const totalMinutes = selectedActivities.reduce((sum, id) => sum + (customMinutes[id] ?? 30), 0);

  return (
    <div className="relative flex flex-col h-full overflow-y-auto" style={{ color: '#3C3C3C' }}>
      <RewardMoment show={celebrate} xp={25} praise={praise} onDone={() => setCelebrate(false)} />
      {/* Region backdrop */}
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/mood.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      {/* Header */}
      <div
        className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
      >
        <BigBackButton onBack={onBack} />
        <img src="/icons/activity_tracker.webp" alt="" draggable={false}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(127,217,140,0.4)' }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black truncate" style={{ color: '#3C3C3C' }}>Activity Tracker</h2>
          <p className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>Movement, meals, hydration</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#7FD98C22', color: '#7FD98C' }}>
          +25 XP
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        <AnimatePresence mode="wait">

          {/* ── ALREADY LOGGED TODAY ── */}
          {todayEntry && !submitted ? (
            <motion.div key="already" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="rounded-3xl p-5 border text-center" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>Today already logged</p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  {todayEntry.activities.length > 0
                    ? todayEntry.activities.map(a => ACTIVITY_TYPES.find(t => t.id === a.type)?.label ?? a.type).join(', ')
                    : 'Rest day'
                  } · Meals: {MEAL_LABELS[todayEntry.mealQuality]} · {todayEntry.water} glasses 💧
                </p>
              </div>
              {entries.length > 1 && <RecentHistory entries={entries.slice(0, 5)} />}
              <button onClick={onBack} className="w-full py-3 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}>
                ← Back
              </button>
            </motion.div>

          ) : submitted ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} reviews</span>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: '#9CA3AF' }}>"{LANCE_LINES[lanceIdx]}"</p>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#7FD98C' }}>{INTERN_LINES[internIdx]}</p>
              </div>
              <div className="rounded-2xl p-4 border space-y-2" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                {totalMinutes > 0 && (
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#9CA3AF' }}>Total movement</span>
                    <span className="font-black" style={{ color: '#7FD98C' }}>{totalMinutes} min</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#9CA3AF' }}>Meal quality</span>
                  <span className="font-black" style={{ color: MEAL_COLORS[mealQuality] }}>{MEAL_LABELS[mealQuality]}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#9CA3AF' }}>Hydration</span>
                  <span className="font-black" style={{ color: '#3ECFCF' }}>{water} glasses 💧</span>
                </div>
                <div className="text-[10px] font-black text-right" style={{ color: '#7FD98C' }}>+25 XP earned</div>
              </div>
              {entries.length > 1 && <RecentHistory entries={entries.slice(0, 5)} />}
              <button onClick={onBack} className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#F9FAFB' }}>
                ← Back to Home
              </button>
            </motion.div>

          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Movement */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C22' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#3C3C3C' }}>Movement</span>
                  {totalMinutes > 0 && (
                    <span className="text-xs font-black" style={{ color: '#7FD98C' }}>{totalMinutes} min total</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ACTIVITY_TYPES.map(act => (
                    <button
                      key={act.id}
                      onClick={() => toggleActivity(act.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90"
                      style={{
                        background: selectedActivities.includes(act.id) ? '#7FD98C22' : '#F9FAFB',
                        border: `1px solid ${selectedActivities.includes(act.id) ? '#7FD98C' : '#9CA3AF'}`,
                        color: selectedActivities.includes(act.id) ? '#7FD98C' : '#9CA3AF',
                      }}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
                {/* Duration inputs for selected activities */}
                {selectedActivities.length > 0 && (
                  <div className="space-y-2">
                    {selectedActivities.map(id => {
                      const act = ACTIVITY_TYPES.find(a => a.id === id)!;
                      return (
                        <div key={id} className="flex items-center justify-between text-xs">
                          <span style={{ color: '#7FD98C' }}>{act.label}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCustomMinutes(p => ({ ...p, [id]: Math.max(5, (p[id] ?? 30) - 5) }))}
                              className="w-6 h-6 rounded-full font-black"
                              style={{ background: '#F9FAFB', border: '1px solid #3ECFCF33', color: '#3ECFCF' }}
                            >−</button>
                            <span className="w-12 text-center font-black" style={{ color: '#3C3C3C' }}>
                              {customMinutes[id] ?? 30}m
                            </span>
                            <button
                              onClick={() => setCustomMinutes(p => ({ ...p, [id]: Math.min(180, (p[id] ?? 30) + 5) }))}
                              className="w-6 h-6 rounded-full font-black"
                              style={{ background: '#F9FAFB', border: '1px solid #3ECFCF33', color: '#3ECFCF' }}
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {selectedActivities.length === 0 && (
                  <p className="text-xs text-center" style={{ color: '#9CA3AF99' }}>Tap to log movement · Rest days count too</p>
                )}
              </div>

              {/* Meal Quality */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C22' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#3C3C3C' }}>Meal Quality</span>
                  <span className="text-xs font-black" style={{ color: MEAL_COLORS[mealQuality] }}>{MEAL_LABELS[mealQuality]}</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(q => (
                    <button key={q} onClick={() => setMealQuality(q)}
                      className="flex-1 py-2.5 rounded-xl font-black text-xs transition-all active:scale-90"
                      style={{
                        background: mealQuality === q ? MEAL_COLORS[q] + '33' : '#F9FAFB',
                        border: `1px solid ${mealQuality === q ? MEAL_COLORS[q] : '#9CA3AF'}`,
                        color: mealQuality === q ? MEAL_COLORS[q] : '#9CA3AF',
                      }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hydration */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C22' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#3C3C3C' }}>💧 Water</span>
                  <span className="text-sm font-black" style={{ color: '#3ECFCF' }}>{water} glasses</span>
                </div>
                {/* Tap-to-fill glasses — tap the Nth glass to set the count; tap the same to zero it */}
                <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Glasses of water">
                  {Array.from({ length: 12 }, (_, i) => {
                    const filled = i < water;
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setWater(water === i + 1 ? 0 : i + 1)}
                        aria-label={`${i + 1} glasses`}
                        className="relative h-11 rounded-b-xl rounded-t-md overflow-hidden"
                        style={{
                          background: 'rgba(255,255,255,0.6)',
                          border: `1.5px solid ${filled ? '#3ECFCF' : '#D1D5DB'}`,
                          boxShadow: filled ? '0 3px 8px rgba(62,207,207,0.35)' : 'none',
                        }}
                      >
                        <motion.div
                          className="absolute inset-x-0 bottom-0"
                          initial={false}
                          animate={{ height: filled ? '78%' : '0%' }}
                          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                          style={{ background: 'linear-gradient(180deg, #7DE3E3, #3ECFCF)' }}
                        />
                        <span className="absolute inset-0 flex items-end justify-center pb-0.5 text-[8px] font-black"
                          style={{ color: filled ? '#FFF' : '#C4C7D4' }}>
                          {i + 1}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Meds */}
              <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C22' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black" style={{ color: '#3C3C3C' }}>💊 Medications taken?</span>
                  <div className="flex gap-2">
                    {([true, false, null] as const).map((val, i) => (
                      <button key={i} onClick={() => setMeds(val)}
                        className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                        style={{
                          background: meds === val ? '#3ECFCF22' : '#F9FAFB',
                          border: `1px solid ${meds === val ? '#3ECFCF' : '#9CA3AF'}`,
                          color: meds === val ? '#3ECFCF' : '#9CA3AF',
                        }}>
                        {val === true ? 'Yes' : val === false ? 'No' : 'N/A'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Any notes about today... (optional)"
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #3ECFCF22', caretColor: '#3ECFCF' }}
              />

              {entries.length > 0 && <RecentHistory entries={entries.slice(0, 4)} />}

              <motion.button whileTap={{ scale: 0.97, y: 2 }} onClick={handleSubmit}
                className="w-full py-4 rounded-2xl font-black text-sm"
                style={{
                  background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)', color: '#FFF',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 3px 0 #4B9E63AA, 0 8px 18px rgba(127,217,140,0.45), inset 0 1px 0 rgba(255,255,255,0.45)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }}>
                Log Activity ✓
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RecentHistory({ entries }: { entries: ActivityEntry[] }) {
  return (
    <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C22' }}>
      <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Recent Activity</div>
      <div className="space-y-2">
        {entries.map(e => {
          const totalMins = e.activities.reduce((s, a) => s + a.minutes, 0);
          return (
            <div key={e.date} className="flex items-center justify-between text-xs">
              <span style={{ color: '#9CA3AF' }}>
                {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div className="flex items-center gap-3">
                {totalMins > 0 ? (
                  <span style={{ color: '#7FD98C' }}>{totalMins}m</span>
                ) : (
                  <span style={{ color: '#9CA3AF99' }}>rest</span>
                )}
                <span style={{ color: '#3ECFCF' }}>{e.water}💧</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
