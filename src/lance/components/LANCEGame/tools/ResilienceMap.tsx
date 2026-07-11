import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, X } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface ResilienceEntry {
  id: string;
  date: string;
  adversities: string[];
  strengths: { label: string; rating: number }[];
  whatGotMeThrough: string;
}

const STORAGE_KEY = 'lance_resilience_v1';
function load(): ResilienceEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(e: ResilienceEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }

const STRENGTH_OPTIONS = [
  'Persistence', 'Creativity', 'Support system', 'Faith / spirituality',
  'Humor', 'Adaptability', 'Courage', 'Problem-solving',
  'Self-awareness', 'Empathy', 'Patience', 'Determination',
  'Vulnerability', 'Resourcefulness', 'Love', 'Purpose',
];

const LANCE_LINES = [
  "Logged. Post-traumatic growth research consistently shows that people who survive difficult experiences often develop capacities they did not have before. This is not a silver lining — it is an observable outcome in longitudinal data.",
  "Filed. You have survived 100% of your worst days so far. This map is evidence of that, not motivation — evidence.",
  "Recorded. Resilience is not the absence of struggle — it is the capacity to continue functioning through and after adversity. You have demonstrated this. Multiple times, apparently.",
  "Noted. The strengths you identified are not personality traits — they are skills. They were built under pressure. That means they transfer.",
];

const INTERN_LINES = [
  "Look at what you've come through. Look at what you carried and kept going anyway. That's not nothing — that's everything.",
  "You've been through hard things and you're still here. That matters. This map is proof of your own durability.",
  "I want you to really sit with this. Every adversity on that list — you survived it. You're on the other side of all of them.",
  "The strengths you found in those moments? They're still in you. They don't go away when things get easier.",
];

interface Props { onBack: () => void; }

export default function ResilienceMap({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<ResilienceEntry[]>(load);
  const [view, setView] = useState<'list' | 'create' | 'done'>('list');
  const [adversities, setAdversities] = useState<string[]>([]);
  const [newAdversity, setNewAdversity] = useState('');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [strengthRatings, setStrengthRatings] = useState<Record<string, number>>({});
  const [whatGotMeThrough, setWhatGotMeThrough] = useState('');
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const addAdversity = () => {
    if (newAdversity.trim()) {
      setAdversities(a => [...a, newAdversity.trim()]);
      setNewAdversity('');
    }
  };

  const toggleStrength = (s: string) => {
    setSelectedStrengths(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSave = () => {
    const entry: ResilienceEntry = {
      id: `res_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      adversities,
      strengths: selectedStrengths.map(s => ({ label: s, rating: strengthRatings[s] ?? 3 })),
      whatGotMeThrough,
    };
    const updated = [entry, ...entries];
    save(updated);
    setEntries(updated);
    addXp(30);
    setView('done');
  };

  if (view === 'create') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/insight.webp)',
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
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🗺️</span>
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Build Your Map</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-5">

          {/* Adversities */}
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Things I've survived</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Hard seasons, losses, challenges — things that were genuinely difficult and you came through.</p>
            {adversities.map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #fbbf2422' }}>
                <span className="text-sm flex-1" style={{ color: '#3C3C3C' }}>✓ {a}</span>
                <button onClick={() => setAdversities(prev => prev.filter((_, j) => j !== i))} style={{ color: '#9CA3AF' }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                value={newAdversity}
                onChange={e => setNewAdversity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addAdversity()}
                placeholder="I survived..."
                className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #fbbf2422', caretColor: '#fbbf24' }}
              />
              <button onClick={addAdversity} className="px-4 py-3 rounded-2xl" style={{ background: '#fbbf2422', color: '#fbbf24' }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Strengths that helped</p>
            <div className="flex flex-wrap gap-2">
              {STRENGTH_OPTIONS.map(s => (
                <button key={s} onClick={() => toggleStrength(s)}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full border"
                  style={{ background: selectedStrengths.includes(s) ? '#fbbf2422' : 'transparent', borderColor: selectedStrengths.includes(s) ? '#fbbf24' : '#fbbf2433', color: selectedStrengths.includes(s) ? '#fbbf24' : '#9CA3AF' }}>
                  {s}
                </button>
              ))}
            </div>
            {selectedStrengths.length > 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>How much did each help? (1-5)</p>
                {selectedStrengths.map(s => (
                  <div key={s} className="flex items-center gap-3">
                    <span className="text-xs flex-1" style={{ color: '#3C3C3C' }}>{s}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} onClick={() => setStrengthRatings(r => ({ ...r, [s]: v }))}
                          className="w-6 h-6 rounded-full text-[10px] font-black"
                          style={{ background: (strengthRatings[s] ?? 0) >= v ? '#fbbf24' : '#fbbf2422', color: (strengthRatings[s] ?? 0) >= v ? '#F9FAFB' : '#fbbf24' }}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reflection */}
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>What got you through</p>
            <textarea
              value={whatGotMeThrough}
              onChange={e => setWhatGotMeThrough(e.target.value)}
              rows={4}
              placeholder="Looking back, what do you think got you through the hardest moments?"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #fbbf2422', caretColor: '#fbbf24' }}
            />
          </div>

          <button onClick={handleSave}
            disabled={adversities.length === 0 || whatGotMeThrough.trim().length < 10}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#F9FAFB' }}>
            Save My Map (+30 XP)
          </button>
        </div>
      </div>
    );
  }

  if (view === 'done') {
    const latest = entries[0];
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Resilience Map</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {latest && (
              <div className="rounded-3xl p-5 border" style={{ background: '#FFFBEB', borderColor: '#fbbf2433' }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: '#B45309' }}>Things you've survived</p>
                <div className="space-y-1">
                  {latest.adversities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#f59e0b' }} />
                      <span className="text-xs" style={{ color: '#3C3C3C' }}>{a}</span>
                    </div>
                  ))}
                </div>
                {latest.strengths.length > 0 && (
                  <>
                    <p className="text-[9px] font-black uppercase tracking-widest mt-3 mb-2" style={{ color: '#B45309' }}>Strengths used</p>
                    <div className="flex flex-wrap gap-1">
                      {latest.strengths.map(s => (
                        <span key={s.label} className="text-[10px] px-2 py-0.5 rounded-full font-black"
                          style={{ background: '#fbbf2422', color: '#B45309' }}>{s.label}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
              <div className="flex items-center gap-2 mb-3">
                <LanceAvatar emotion="reluctant_approval" size="sm" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name}</span>
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
            <button onClick={onBack} className="w-full py-4 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#F9FAFB' }}>
              ← Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // List
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">🗺️</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Resilience Map</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Evidence of your durability</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fbbf2422', color: '#fbbf24' }}>+30 XP</div>
      </div>
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {entries.slice(0, 3).map(e => (
          <div key={e.id} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#fbbf2422' }}>
            <p className="text-[10px] mb-1" style={{ color: '#9CA3AF' }}>
              {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })} · {e.adversities.length} things survived
            </p>
            <div className="flex flex-wrap gap-1">
              {e.strengths.slice(0, 4).map(s => (
                <span key={s.label} className="text-[9px] px-1.5 py-0.5 rounded-full font-black"
                  style={{ background: '#fbbf2411', color: '#fbbf24' }}>{s.label}</span>
              ))}
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#fbbf2433' }}>
            <div className="text-4xl text-center mb-3">🗺️</div>
            <p className="text-xs text-center leading-relaxed" style={{ color: '#9CA3AF' }}>
              Map the hard things you've survived. Not to dwell on them — to have evidence of your own durability when you need it most.
            </p>
          </div>
        )}

        <button onClick={() => { setView('create'); setAdversities([]); setSelectedStrengths([]); setStrengthRatings({}); setWhatGotMeThrough(''); }}
          className="w-full py-4 rounded-2xl font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#F9FAFB' }}>
          🗺️ Build My Resilience Map
        </button>
      </div>
    </div>
  );
}
