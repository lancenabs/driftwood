import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Smile, Sparkles, Trash2 } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface Reframe {
  id: string;
  date: string;
  raw: string;
  reframed: string;
}

const STORAGE_KEY = 'lance_self_talk_mirror_v1';

function load(): Reframe[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

const SAMPLE = 'I always procrastinate because I can never get anything pristine.';

interface Props { onBack: () => void; }

export default function SelfTalkMirror({ onBack }: Props) {
  const { addXp } = useGame();
  const [entries, setEntries] = useState<Reframe[]>(load);
  const [input, setInput] = useState('');
  const [reframed, setReframed] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }, [entries]);

  const activate = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setReframed(null);
    setTimeout(() => {
      const result = "I hear the part of me trying to protect my work quality. It's safe to proceed at my own pace — incremental learning is normal, and small errors build stronger habits over time.";
      setIsAnalyzing(false);
      setReframed(result);
      setEntries([{ id: `reframe_${Date.now()}`, date: new Date().toISOString(), raw: input.trim(), reframed: result }, ...entries]);
      addXp(20);
    }, 1200);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cbt.webp)',
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
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Self-Talk Mirror</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Cognitive schema mirror</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border space-y-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <p className="text-[11px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>
            Type your raw, critical inner narrative below. The mirror reflects back a more compassionate, balanced version of the same thought.
          </p>

          <div>
            <label className="text-[9px] uppercase tracking-wider font-extrabold block mb-1.5" style={{ color: '#9CA3AF' }}>Critical self-narrative</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I am too slow and I will make a permanent mistake at work that shows my incompetence..."
              className="w-full h-20 p-3 rounded-2xl text-[11px] font-semibold outline-none resize-none border"
              style={{ background: '#F9FAFB', color: '#3C3C3C', borderColor: '#F0F0F0' }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={activate}
              disabled={isAnalyzing || !input.trim()}
              className="flex-1 py-2.5 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ background: '#4F46E5' }}
            >
              {isAnalyzing ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Reframing...</span></>
              ) : (
                <><Smile className="w-3.5 h-3.5" /><span>Activate Compassionate Mirror</span></>
              )}
            </button>
            <button
              type="button"
              onClick={() => setInput(SAMPLE)}
              className="px-3.5 rounded-xl text-[10px] font-bold transition cursor-pointer border"
              style={{ background: '#F9FAFB', borderColor: '#F0F0F0', color: '#6B7280' }}
            >
              Sample
            </button>
          </div>

          <AnimatePresence>
            {reframed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 rounded-2xl space-y-2 text-left border"
                style={{ background: 'linear-gradient(135deg, #EEF2FF, #FAF5FF)', borderColor: '#E0E7FF' }}
              >
                <div className="flex items-center gap-1.5" style={{ color: '#4338CA' }}>
                  <Sparkles className="w-4 h-4" style={{ color: '#7C3AED' }} />
                  <span className="text-[9px] uppercase tracking-widest font-black font-mono">Reflected back</span>
                </div>
                <p className="text-[11px] leading-relaxed font-semibold italic" style={{ color: '#3C3C3C' }}>"{reframed}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {entries.length > 0 && (
          <div className="rounded-2xl p-4 border space-y-2" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Past reframes</p>
            {entries.map(e => (
              <div key={e.id} className="p-2.5 rounded-xl flex items-start justify-between gap-2" style={{ background: '#F9FAFB' }}>
                <div className="min-w-0">
                  <p className="text-[10px] line-through truncate" style={{ color: '#9CA3AF' }}>{e.raw}</p>
                  <p className="text-[11px] font-semibold truncate" style={{ color: '#4338CA' }}>{e.reframed}</p>
                </div>
                <button onClick={() => setEntries(entries.filter(x => x.id !== e.id))} className="p-1 rounded shrink-0" style={{ color: '#EF4444' }}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
