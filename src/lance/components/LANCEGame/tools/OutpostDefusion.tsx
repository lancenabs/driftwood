import React, { useState, useEffect } from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

const LENSES = [
  { id: 'label_it', label: '🏷️ Label It', desc: 'Prepend "I have the thought"' },
  { id: 'thank_mind', label: '🧠 Thank Mind', desc: 'Acknowledge the defense' },
  { id: 'sing', label: '🎶 Silly Song', desc: 'Hum it to a tune' },
  { id: 'slow_motion', label: '🐢 Slow Mo', desc: 'Introduce pauses' },
] as const;

type LensId = typeof LENSES[number]['id'];

const STORAGE_KEY = 'lance_outpost_defusion_v1';

interface Saved { score: number; completedSteps: string[]; }

function load(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { score: 0, completedSteps: [] };
}

interface Props { onBack: () => void; }

export default function OutpostDefusion({ onBack }: Props) {
  const { addXp } = useGame();
  const saved = load();
  const [prediction, setPrediction] = useState('I am going to get trapped here forever and disappoint everyone.');
  const [activeLens, setActiveLens] = useState<LensId>('label_it');
  const [score, setScore] = useState(saved.score);
  const [completedSteps, setCompletedSteps] = useState<string[]>(saved.completedSteps);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ score, completedSteps }));
  }, [score, completedSteps]);

  const selectLens = (id: LensId) => {
    setActiveLens(id);
    setScore(s => s + 15);
    if (!completedSteps.includes(id)) {
      setCompletedSteps([...completedSteps, id]);
      addXp(10);
    }
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
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Outpost Defusion Node</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Cognitive defusion</p>
        </div>
        <Layers className="w-5 h-5" style={{ color: '#2563EB' }} />
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border space-y-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <p className="text-[11px] leading-relaxed" style={{ color: '#6B7280' }}>
            Rigid, catastrophic thoughts ("I must handle this flawlessly") feel like facts. Defusion techniques create distance between you and the thought, without arguing whether it's true.
          </p>

          <div className="space-y-1.5">
            <span className="text-[8.5px] font-black uppercase tracking-wider block font-mono" style={{ color: '#9CA3AF' }}>1. Enter the looping thought</span>
            <input
              type="text" value={prediction} onChange={(e) => setPrediction(e.target.value)}
              placeholder="Type your current catastrophic thought here..."
              className="px-3 py-2 text-[10.5px] font-semibold rounded-xl w-full outline-none border"
              style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#E5E7EB', color: '#3C3C3C' }}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[8.5px] font-black uppercase tracking-wider block" style={{ color: '#9CA3AF' }}>2. Choose a defusion lens</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {LENSES.map((opt) => (
                <button
                  key={opt.id} type="button" onClick={() => selectLens(opt.id)}
                  className="p-2 rounded-xl text-left border transition cursor-pointer"
                  style={activeLens === opt.id
                    ? { background: '#EFF6FF', borderColor: '#93C5FD', boxShadow: '0 0 0 1px #93C5FD' }
                    : { background: '#F9FAFB', borderColor: '#F0F0F0' }}
                >
                  <span className="text-[10px] font-bold block" style={{ color: '#3C3C3C' }}>{opt.label}</span>
                  <span className="text-[7.5px] leading-tight block mt-0.5" style={{ color: '#9CA3AF' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl relative overflow-hidden h-36 flex flex-col justify-between"
            style={{ background: 'linear-gradient(160deg, #0c1830, #04091a)', border: '1px solid rgba(30,64,175,0.4)' }}>
            <div className="space-y-1">
              <span className="text-[8px] font-mono font-black uppercase tracking-wider block" style={{ color: '#22D3EE' }}>Defused thought output</span>
              <div className="text-[11.5px] font-semibold leading-relaxed pt-1.5 select-none" style={{ color: '#CFFAFE' }}>
                {activeLens === 'label_it' && (
                  <span>"I notice that <span className="font-bold" style={{ color: '#22D3EE' }}>I am having the thought that</span> '{prediction}'."</span>
                )}
                {activeLens === 'thank_mind' && (
                  <span>"Thank you, Mind, <span className="font-bold" style={{ color: '#22D3EE' }}>for trying to protect me</span> by telling me '{prediction}'. But I've got this covered."</span>
                )}
                {activeLens === 'sing' && (
                  <span className="italic flex flex-col gap-1">
                    <span>🎶 La-la-la... '{prediction}' ✨</span>
                    <span className="text-[9px] tracking-wider" style={{ color: '#93C5FD' }}>Humming this warning to a silly tune strips its catastrophic power.</span>
                  </span>
                )}
                {activeLens === 'slow_motion' && (
                  <span className="tracking-widest">{prediction.split(' ').join(' ... ')}</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center relative z-10 pt-2 border-t text-[8.5px] font-mono uppercase tracking-widest leading-none select-none"
              style={{ borderColor: 'rgba(8,145,178,0.4)', color: '#67E8F9' }}>
              <span>Prefrontal load: decreased</span>
              <span className="font-extrabold" style={{ color: '#22D3EE' }}>Score: +{score} XP</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9.5px]">
            <span className="font-semibold" style={{ color: '#6B7280' }}>Trained lenses: {completedSteps.length}/4</span>
            <button
              type="button"
              onClick={() => { setPrediction('This challenge is too big and I will never get through it.'); setScore(s => s + 10); }}
              className="font-bold transition flex items-center gap-0.5 cursor-pointer"
              style={{ color: '#2563EB' }}
            >
              Try example thought <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
