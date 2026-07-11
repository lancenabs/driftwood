import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Plus, Trash2, Check } from 'lucide-react';

interface PyramidLevel {
  id: string;
  label: string;
  sublabel: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  examples: string[];
  rating: number;
  activities: string[];
}

const DEFAULT_LEVELS: PyramidLevel[] = [
  {
    id: 'transcendence', label: 'Transcendence', sublabel: 'Tier 7', emoji: '✨',
    color: '#7c3aed', bgColor: '#f5f3ff', borderColor: '#c4b5fd',
    description: 'Helping others self-actualize; spiritual peak experiences; unity with something larger.',
    examples: ['Mentoring others', 'Spiritual practice', 'Service beyond self', 'Mystical experiences'],
    rating: 0, activities: [],
  },
  {
    id: 'self_actualization', label: 'Self-Actualization', sublabel: 'Tier 6', emoji: '🌟',
    color: '#4f46e5', bgColor: '#eef2ff', borderColor: '#a5b4fc',
    description: 'Realizing your fullest potential — creativity, spontaneity, problem-solving, morality.',
    examples: ['Pursuing mastery', 'Creative expression', 'Personal authenticity', 'Growth mindset'],
    rating: 0, activities: [],
  },
  {
    id: 'aesthetic', label: 'Aesthetic Needs', sublabel: 'Tier 5', emoji: '🎨',
    color: '#0891b2', bgColor: '#ecfeff', borderColor: '#67e8f9',
    description: 'Beauty, order, symmetry, balance. Appreciation for art, nature, and elegant design.',
    examples: ['Time in nature', 'Art & music', 'Organized spaces', 'Meaningful rituals'],
    rating: 0, activities: [],
  },
  {
    id: 'cognitive', label: 'Cognitive Needs', sublabel: 'Tier 4', emoji: '🧠',
    color: '#059669', bgColor: '#ecfdf5', borderColor: '#6ee7b7',
    description: 'Knowledge, curiosity, meaning-making, intellectual stimulation.',
    examples: ['Learning new skills', 'Reading deeply', 'Philosophical inquiry', 'Creative problem-solving'],
    rating: 0, activities: [],
  },
  {
    id: 'esteem', label: 'Esteem', sublabel: 'Tier 3', emoji: '🏆',
    color: '#d97706', bgColor: '#fffbeb', borderColor: '#fcd34d',
    description: 'Achievement, mastery, recognition, respect from others, and self-respect.',
    examples: ['Goal achievement', 'Public recognition', 'Skill development', 'Healthy pride'],
    rating: 0, activities: [],
  },
  {
    id: 'love_belonging', label: 'Love & Belonging', sublabel: 'Tier 2', emoji: '❤️',
    color: '#e11d48', bgColor: '#fff1f2', borderColor: '#fda4af',
    description: 'Friendship, intimacy, family, community, sense of connection.',
    examples: ['Close friendships', 'Romantic relationships', 'Community groups', 'Belonging rituals'],
    rating: 0, activities: [],
  },
  {
    id: 'safety', label: 'Safety & Security', sublabel: 'Tier 1B', emoji: '🛡️',
    color: '#0284c7', bgColor: '#f0f9ff', borderColor: '#7dd3fc',
    description: 'Personal security, employment, resources, health, property, stability.',
    examples: ['Financial stability', 'Safe housing', 'Health maintenance', 'Predictable routines'],
    rating: 0, activities: [],
  },
  {
    id: 'physiological', label: 'Physiological', sublabel: 'Tier 1A', emoji: '🍃',
    color: '#16a34a', bgColor: '#f0fdf4', borderColor: '#86efac',
    description: 'Air, food, water, shelter, clothing, sleep, reproduction. The biological baseline.',
    examples: ['Regular sleep', 'Nourishing food', 'Physical movement', 'Rest & recovery'],
    rating: 0, activities: [],
  },
];

export default function MaslowAscentMap() {
  const [levels, setLevels] = useState<PyramidLevel[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('therapy_maslow_ratings') || 'null');
      if (saved && Array.isArray(saved)) {
        return DEFAULT_LEVELS.map(dl => {
          const s = saved.find((sv: any) => sv.id === dl.id);
          return s ? { ...dl, rating: s.rating ?? 0, activities: s.activities ?? [] } : dl;
        });
      }
    } catch {}
    return DEFAULT_LEVELS;
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    localStorage.setItem('therapy_maslow_ratings', JSON.stringify(levels.map(l => ({ id: l.id, rating: l.rating, activities: l.activities }))));
  }, [levels]);

  const updateRating = (id: string, rating: number) => {
    setLevels(prev => prev.map(l => l.id === id ? { ...l, rating } : l));
  };

  const addActivity = (id: string) => {
    const text = newActivity[id]?.trim();
    if (!text) return;
    setLevels(prev => prev.map(l => l.id === id ? { ...l, activities: [...l.activities, text] } : l));
    setNewActivity(prev => ({ ...prev, [id]: '' }));
  };

  const removeActivity = (levelId: string, idx: number) => {
    setLevels(prev => prev.map(l => l.id === levelId ? { ...l, activities: l.activities.filter((_, i) => i !== idx) } : l));
  };

  const overallScore = Math.round(levels.reduce((sum, l) => sum + l.rating, 0) / levels.length);

  const getRatingLabel = (r: number) => {
    if (r === 0) return 'Not yet assessed';
    if (r <= 2) return 'Critically unmet';
    if (r <= 4) return 'Significantly lacking';
    if (r <= 6) return 'Partially met';
    if (r <= 8) return 'Mostly met';
    return 'Well satisfied';
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1e1b4b, #4338ca, #6d28d9)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🔺</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Abraham Maslow · Hierarchy of Needs</div>
            <h2 className="text-lg font-black leading-tight">Maslow Ascent Map</h2>
          </div>
        </div>
        <p className="text-xs text-indigo-100 leading-relaxed font-medium">
          "What a man can be, he must be." Rate satisfaction at each level of the hierarchy — from physiological survival to transcendence. Identify where to direct your energy and build activities at every tier.
        </p>
      </div>

      {/* Overall score */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Overall Hierarchy Health</div>
            <div className="text-2xl font-black text-slate-900">{overallScore}<span className="text-base text-slate-400 font-bold">/10</span></div>
          </div>
          <div className="w-24 h-24 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#4f46e5" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40 * overallScore / 10} ${2 * Math.PI * 40}`}
                strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-black text-indigo-600">{overallScore * 10}%</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-1 flex-wrap">
          {levels.slice().reverse().map(l => (
            <div key={l.id} className="flex-1 h-2 rounded-full min-w-[8px]" style={{ background: l.rating > 0 ? l.color : '#e2e8f0' }} />
          ))}
        </div>
      </div>

      {/* Pyramid levels — displayed top to bottom (transcendence → physiological) */}
      <div className="space-y-3">
        {levels.map((level, idx) => {
          const isExpanded = expandedId === level.id;
          const widthPct = 40 + (levels.length - idx) * 8;
          return (
            <div key={level.id} className="rounded-2xl border-2 overflow-hidden transition-all" style={{ borderColor: level.borderColor, background: isExpanded ? level.bgColor : 'white' }}>
              <button className="w-full p-4 text-left flex items-center gap-3" onClick={() => setExpandedId(isExpanded ? null : level.id)}>
                <div className="text-xl">{level.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black" style={{ color: level.color }}>{level.label}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{level.sublabel}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${level.rating * 10}%`, background: level.color }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: level.color }}>{level.rating}/10</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t-2" style={{ borderColor: level.borderColor }}>
                    <div className="p-4 space-y-4">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{level.description}</p>

                      {/* Rating */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: level.color }}>Satisfaction Rating</span>
                          <span className="text-[10px] font-bold text-slate-500">{getRatingLabel(level.rating)}</span>
                        </div>
                        <input type="range" min={0} max={10} value={level.rating} onChange={e => updateRating(level.id, Number(e.target.value))}
                          className="w-full h-2 rounded-full outline-none cursor-pointer" style={{ accentColor: level.color }} />
                        <div className="flex justify-between mt-0.5">
                          <span className="text-[9px] text-slate-400 font-bold">0 — Unmet</span>
                          <span className="text-[9px] text-slate-400 font-bold">10 — Flourishing</span>
                        </div>
                      </div>

                      {/* Examples */}
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: level.color }}>Common Practices</div>
                        <div className="flex flex-wrap gap-1.5">
                          {level.examples.map(ex => (
                            <span key={ex} className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: level.bgColor, color: level.color, border: `1px solid ${level.borderColor}` }}>{ex}</span>
                          ))}
                        </div>
                      </div>

                      {/* Activities */}
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: level.color }}>My Activities at This Level</div>
                        {level.activities.length > 0 && (
                          <div className="space-y-1.5 mb-2">
                            {level.activities.map((act, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: level.color }} />
                                <span className="flex-1">{act}</span>
                                <button onClick={() => removeActivity(level.id, i)} className="text-slate-300 hover:text-rose-500 transition"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            className="flex-1 border-2 rounded-xl px-3 py-2 text-xs outline-none transition font-medium text-slate-800 placeholder:text-slate-400"
                            style={{ borderColor: level.borderColor, background: 'white' }}
                            placeholder="Add a nourishing activity…"
                            value={newActivity[level.id] || ''}
                            onChange={e => setNewActivity(prev => ({ ...prev, [level.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && addActivity(level.id)}
                          />
                          <button onClick={() => addActivity(level.id)} className="px-3 py-2 rounded-xl text-white font-bold text-xs transition active:scale-95" style={{ background: level.color }}>
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
