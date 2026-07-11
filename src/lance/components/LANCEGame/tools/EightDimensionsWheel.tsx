import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Save, History } from 'lucide-react';
import BigBackButton from '../BigBackButton';

interface Dimension {
  key: string;
  title: string;
  emoji: string;
  accentBg: string;
  accentText: string;
  description: string;
  signsOfDepletion: string;
  clinicalSolutions: string;
  toolId: string;
  toolLabel: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: 'physical', title: 'Physical Wellness', emoji: '🔋', accentBg: '#ECFDF5', accentText: '#047857',
    description: 'Nourishing the biological machine through balanced movement, intentional nutrition, hygiene, and restorative sleep.',
    signsOfDepletion: 'Chronic exhaustion, tension in the shoulders, restless sleep, reliance on stimulants, shallow chest-breathing.',
    clinicalSolutions: 'Build high-contrast rhythm markers in your day. Align your sleep cycle with clear boundary checklists.',
    toolId: 'habit_lab', toolLabel: 'Go to Habit Builder Lab',
  },
  {
    key: 'emotional', title: 'Emotional Wellness', emoji: '🔮', accentBg: '#FFF1F2', accentText: '#9F1239',
    description: 'Cultivating the capacity to experience, express, process, and regulate emotional states safely.',
    signsOfDepletion: 'Nervous-system hyper-reactivity, sudden anxiety spikes, emotional numbness, difficulty sharing vulnerable states.',
    clinicalSolutions: 'Somatic grounding. Map uncomfortable feelings directly to where they live in your body.',
    toolId: 'somatic_body_map', toolLabel: 'Go to Somatic Body Map',
  },
  {
    key: 'intellectual', title: 'Intellectual Wellness', emoji: '🧠', accentBg: '#EEF2FF', accentText: '#4338CA',
    description: 'Expanding cognitive flexibility through creative curiosity, critical thinking, and structured learning.',
    signsOfDepletion: 'Persistent brain fog, rigid black-and-white thinking, quick frustration with complex tasks.',
    clinicalSolutions: 'Engage with a core psychological concept — CBT reframing or a Jungian idea — to diversify your coping schemas.',
    toolId: 'cbt_reframe', toolLabel: 'Go to Quick Thought Reframe',
  },
  {
    key: 'social', title: 'Social Wellness', emoji: '👥', accentBg: '#ECFEFF', accentText: '#0E7490',
    description: 'Nurturing relational support systems while keeping healthy personal boundaries and interactive energy balance.',
    signsOfDepletion: 'Overwhelming post-interaction fatigue, people-pleasing pressure, sudden social withdrawal.',
    clinicalSolutions: 'Log energy before and after each interaction to see stress trends and protect your battery.',
    toolId: 'social_battery', toolLabel: 'Go to Social Battery',
  },
  {
    key: 'spiritual', title: 'Spiritual Wellness', emoji: '🧘', accentBg: '#FFFBEB', accentText: '#B45309',
    description: 'Connecting inner values with daily behaviors and nourishing a conscious sense of peace.',
    signsOfDepletion: 'Loss of meaning, feeling disconnected from your values, existential dread, feeling robotic.',
    clinicalSolutions: 'Structured reflective work and slow diaphragmatic breathing to move from alarm back to presence.',
    toolId: 'sand_tray', toolLabel: 'Go to Sand Tray Therapy',
  },
  {
    key: 'occupational', title: 'Occupational Wellness', emoji: '💼', accentBg: '#F4F4F5', accentText: '#3F3F46',
    description: 'Creating healthy separation from work, avoiding performance burnout, and aligning work with personal values.',
    signsOfDepletion: 'Over-identifying with your job, Sunday anxiety, working through rest hours, feeling unfulfilled.',
    clinicalSolutions: 'Set strict focus/rest intervals and track a clear boundary goal.',
    toolId: 'smart_goals', toolLabel: 'Go to SMART Goals',
  },
  {
    key: 'environmental', title: 'Environmental Wellness', emoji: '🌱', accentBg: '#F0FDF4', accentText: '#166534',
    description: 'Harmony with your surroundings — soothing sounds, clean spaces, and calm sensory input.',
    signsOfDepletion: 'Sensory overload, tension from noisy surroundings, disorganization, feeling disconnected from nature.',
    clinicalSolutions: 'Pair ambient sound with breathwork to pacify sensory overload.',
    toolId: 'breathwork_478', toolLabel: 'Go to Breathwork',
  },
  {
    key: 'financial', title: 'Financial Wellness', emoji: '💵', accentBg: '#FEFCE8', accentText: '#854D0E',
    description: 'Establishing security and conscious financial boundaries, and making intentional budget decisions.',
    signsOfDepletion: 'Money-related panic spikes, impulsive spending, chronic shame reviewing bills.',
    clinicalSolutions: 'Turn financial anxiety into transparent, structured milestones rather than avoidance.',
    toolId: 'smart_goals', toolLabel: 'Go to SMART Goals',
  },
];

const STORAGE_KEY = 'lance_8d_wellness_v1';
const HISTORY_KEY = 'lance_8d_wellness_history_v1';
const MAX_HISTORY = 20;

interface AuditSnapshot {
  date: string; // ISO timestamp
  overallIndex: number;
  ratings: Record<string, number>;
}

function loadRatings(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return Object.fromEntries(DIMENSIONS.map(d => [d.key, 5]));
}

function loadHistory(): AuditSnapshot[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

interface Props { onBack: () => void; onOpenTool?: (toolId: string) => void; }

export default function EightDimensionsWheel({ onBack, onOpenTool }: Props) {
  const [ratings, setRatings] = useState<Record<string, number>>(loadRatings);
  const [selected, setSelected] = useState('physical');
  const [history, setHistory] = useState<AuditSnapshot[]>(loadHistory);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings)); }, [ratings]);

  const active = DIMENSIONS.find(d => d.key === selected)!;
  const ratingValues: number[] = Object.values(ratings);
  const overallIndex = Math.round((ratingValues.reduce((a: number, b: number) => a + b, 0) / 80) * 100);

  const saveAudit = () => {
    const snapshot: AuditSnapshot = { date: new Date().toISOString(), overallIndex, ratings: { ...ratings } };
    const next = [snapshot, ...history].slice(0, MAX_HISTORY);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

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
        <BigBackButton onBack={onBack} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>8D Equilibrium Audit</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>8 Dimensions of Wellness</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #ECFDF5, #F9FAFB)', border: '1px solid #A7F3D0' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center gap-1.5" style={{ color: '#059669' }}>
                <Sparkles className="w-4 h-4" />
                <span className="text-[9.5px] font-black uppercase tracking-widest font-mono">Whole-life balance</span>
              </div>
              <p className="text-xs leading-relaxed font-semibold" style={{ color: '#4B5563' }}>
                Rate each life dimension honestly — this isn't a score to win, it's a map of where your attention is most needed right now.
              </p>
            </div>
            <div className="p-4 rounded-2xl flex flex-col items-center shrink-0 min-w-[130px]" style={{ background: '#FFFFFF', border: '1px solid #A7F3D0' }}>
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono" style={{ color: '#9CA3AF' }}>Equilibrium</span>
              <p className="text-3xl font-black mt-1" style={{ color: '#059669' }}>{overallIndex}%</p>
              <div className="w-full h-1.5 rounded-full mt-2.5 overflow-hidden" style={{ background: '#F3F4F6' }}>
                <div className="h-full transition-all" style={{ width: `${overallIndex}%`, background: '#10B981' }} />
              </div>
              <button
                onClick={saveAudit}
                className="w-full mt-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 text-white transition"
                style={{ background: justSaved ? '#10B981' : '#059669' }}
              >
                <Save className="w-3 h-3" /> {justSaved ? 'Saved!' : 'Save this audit'}
              </button>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <History className="w-4 h-4" style={{ color: '#6B7280' }} />
              <span className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: '#6B7280' }}>Past Audits</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {history.map((h, i) => (
                <div key={i} className="shrink-0 px-3 py-2 rounded-2xl text-center min-w-[76px]" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
                  <p className="text-sm font-black" style={{ color: '#059669' }}>{h.overallIndex}%</p>
                  <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#9CA3AF' }}>
                    {new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {DIMENSIONS.map(d => {
            const rating = ratings[d.key] ?? 5;
            const isSel = selected === d.key;
            return (
              <motion.button
                key={d.key} type="button" onClick={() => setSelected(d.key)}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl border text-left cursor-pointer flex flex-col justify-between min-h-[100px]"
                style={isSel ? { background: '#FFFFFF', borderColor: '#111827', boxShadow: '0 0 0 1px #111827' } : { background: '#FFFFFF', borderColor: '#F0F0F0' }}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xl">{d.emoji}</span>
                  <span className="text-[9px] font-mono font-black rounded-lg px-1.5 py-0.5 leading-none" style={{ background: '#F9FAFB', color: '#4B5563' }}>{rating}/10</span>
                </div>
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-black block leading-none" style={{ color: '#3C3C3C' }}>{d.title.replace(' Wellness', '')}</span>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                    <div className="h-full rounded-full" style={{ width: `${rating * 10}%`, background: rating > 7 ? '#10B981' : rating > 4 ? '#F59E0B' : '#F43F5E' }} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 border space-y-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: '#F0F0F0' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl" style={{ background: active.accentBg }}>{active.emoji}</span>
              <h3 className="text-base font-black" style={{ color: '#3C3C3C' }}>{active.title}</h3>
            </div>
            <div className="p-3 rounded-2xl min-w-[190px] space-y-1" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-wider font-mono" style={{ color: '#9CA3AF' }}>Assess level</span>
                <span className="text-xs font-mono font-black" style={{ color: active.accentText }}>{ratings[selected] ?? 5}/10</span>
              </div>
              <input
                type="range" min="1" max="10" value={ratings[selected] ?? 5}
                onChange={(e) => setRatings(r => ({ ...r, [selected]: Number(e.target.value) }))}
                className="w-full h-1 rounded-lg cursor-pointer" style={{ accentColor: active.accentText }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-black tracking-widest block font-mono" style={{ color: '#9CA3AF' }}>Overview</span>
              <p className="text-[11.5px] font-semibold leading-relaxed" style={{ color: '#4B5563' }}>{active.description}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-black tracking-widest block font-mono" style={{ color: '#E11D48' }}>🚨 Signs of depletion</span>
              <p className="text-[11.5px] font-semibold italic leading-relaxed" style={{ color: '#4B5563' }}>"{active.signsOfDepletion}"</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-black tracking-widest block font-mono" style={{ color: '#059669' }}>✨ What helps</span>
              <p className="text-[11.5px] font-semibold leading-relaxed p-2.5 rounded-xl" style={{ background: '#ECFDF5', color: '#065F46' }}>{active.clinicalSolutions}</p>
            </div>
          </div>

          {onOpenTool && (
            <button
              onClick={() => onOpenTool(active.toolId)}
              className="w-full py-2.5 rounded-xl text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
              style={{ background: active.accentText }}
            >
              {active.toolLabel} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
