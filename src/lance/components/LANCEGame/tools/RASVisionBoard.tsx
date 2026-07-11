import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface Intention {
  id: string;
  text: string;
  category: string;
}

const STORAGE_KEY = 'lance_ras_vision_v1';

function load(): Intention[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [
    { id: '1', text: 'Somatic vagus soothing focus', category: 'Health' },
    { id: '2', text: 'Unconditional positive regard', category: 'Mindset' },
    { id: '3', text: 'Subtle daily flow state', category: 'Creativity' },
  ];
}

interface Props { onBack: () => void; }

export default function RASVisionBoard({ onBack }: Props) {
  const { addXp } = useGame();
  const [intentions, setIntentions] = useState<Intention[]>(load);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('Mindset');
  const [activated, setActivated] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(intentions)); }, [intentions]);

  const addIntention = () => {
    if (!newText.trim()) return;
    setIntentions([...intentions, { id: Date.now().toString(), text: newText.trim(), category: newCategory }]);
    addXp(15);
    setNewText('');
  };

  const removeIntention = (id: string) => setIntentions(intentions.filter(i => i.id !== id));

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cognitive.webp)',
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
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>RAS Vision Board</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Reticular Activating System</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border space-y-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <p className="text-[11px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>
            Your Reticular Activating System filters what you notice out of everything around you. Pin what you want it to prioritize — repetition trains what your attention surfaces first.
          </p>

          <div className="rounded-2xl p-4 relative h-48 overflow-hidden flex flex-col justify-between"
            style={{
              backgroundImage: 'linear-gradient(160deg, rgba(15,23,42,0.55), rgba(15,23,42,0.85)), url(/vision-board-bg/starfield.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="relative z-10 flex flex-wrap gap-2 max-w-full content-start overflow-y-auto">
              {intentions.map((node) => (
                <motion.div
                  key={node.id}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  whileDrag={{ scale: 1.05 }}
                  onClick={() => removeIntention(node.id)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm cursor-grab select-none active:cursor-grabbing border"
                  style={activated ? { borderColor: '#FBBF24', background: 'rgba(245,158,11,0.2)' } : { borderColor: '#1E293B', background: 'rgba(15,23,42,0.9)' }}
                  title="Tap to remove"
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FBBF24' }} />
                  <span>{node.text}</span>
                  <span className="text-[8px] opacity-60 font-mono">({node.category})</span>
                </motion.div>
              ))}
            </div>
            <div className="relative z-10 flex justify-between items-center text-[9px] uppercase tracking-wider font-mono" style={{ color: '#94A3B8' }}>
              <span>Intention web capacity: normal</span>
              <span style={activated ? { color: '#FBBF24', fontWeight: 800 } : {}}>{activated ? '● PRIMING ACTIVE' : '● DISARMED'}</span>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-2xl border" style={{ background: '#F9FAFB', borderColor: '#F0F0F0' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[8px] uppercase tracking-wider font-extrabold block mb-1" style={{ color: '#9CA3AF' }}>New intention anchor</label>
                <input
                  type="text" value={newText} onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g., Deep mindful breathing triggers..."
                  className="w-full px-3 py-1.5 rounded-lg text-[10.5px] font-semibold border outline-none"
                  style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#E5E7EB', color: '#3C3C3C' }}
                />
              </div>
              <div>
                <label className="text-[8px] uppercase tracking-wider font-extrabold block mb-1" style={{ color: '#9CA3AF' }}>Attention domain</label>
                <select
                  value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-[10.5px] font-semibold border outline-none"
                  style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#E5E7EB', color: '#3C3C3C' }}
                >
                  <option value="Mindset">Mindset Calibration</option>
                  <option value="Health">Somatic Health</option>
                  <option value="Creativity">Creative Manifestation</option>
                  <option value="Boundary">Equilibrium Boundary</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button" onClick={addIntention} disabled={!newText.trim()}
                className="flex-1 py-1.5 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-40"
                style={{ background: '#1E293B' }}
              >
                Pin Focus Anchor
              </button>
              <button
                type="button" onClick={() => setActivated(!activated)}
                className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition cursor-pointer"
                style={activated ? { background: '#F59E0B', color: '#FFFFFF' } : { background: '#FEF3C7', color: '#B45309' }}
              >
                {activated ? 'Deactivate RAS' : 'Activate RAS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
