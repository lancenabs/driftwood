import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

const QUESTIONS: { prompt: string; options: { id: 'wisdom' | 'courage' | 'empathy'; label: string }[] }[] = [
  {
    prompt: 'When facing a harsh, critical situation, I tend to:',
    options: [
      { id: 'wisdom', label: 'Pause and analyze the situation objectively (Wisdom)' },
      { id: 'courage', label: 'Speak my truth firmly regardless of fear (Courage)' },
      { id: 'empathy', label: 'Get curious about what\'s really going on underneath (Empathy)' },
    ],
  },
  {
    prompt: 'When someone stays to help me through something hard, the feeling that anchors me is:',
    options: [
      { id: 'empathy', label: 'Deep compassion and secure connection (Empathy)' },
      { id: 'courage', label: 'A fierce protective urge to look out for them too (Courage)' },
      { id: 'wisdom', label: 'Calm determination to out-think the problem together (Wisdom)' },
    ],
  },
  {
    prompt: 'My primary superpower for navigating a complex, stressful situation is:',
    options: [
      { id: 'wisdom', label: 'Methodical analysis and trial-and-error (Wisdom)' },
      { id: 'courage', label: 'Taking high-stakes creative leaps of action (Courage)' },
      { id: 'empathy', label: 'Reaching out and building safe networks (Empathy)' },
    ],
  },
  {
    prompt: 'Looking back at my worst moments of anxiety, the thing that saved me was:',
    options: [
      { id: 'wisdom', label: 'Reminding myself that thoughts are just mental stories (Wisdom)' },
      { id: 'courage', label: 'Refusing to give up even when frozen (Courage)' },
      { id: 'empathy', label: 'Vocal reassurance from someone who cared (Empathy)' },
    ],
  },
  {
    prompt: 'Once I\'m through the hard part, my future focus will be:',
    options: [
      { id: 'empathy', label: 'Building warm, cooperative relationships (Empathy)' },
      { id: 'courage', label: 'Advocating for what I believe in (Courage)' },
      { id: 'wisdom', label: 'Studying and understanding minds — including my own (Wisdom)' },
    ],
  },
];

const RESULTS: Record<string, { title: string; desc: string }> = {
  wisdom: { title: 'Wisdom & Perspective', desc: 'You analyze situations methodically and spot cognitive distortions before they take hold.' },
  courage: { title: 'Courage & Authenticity', desc: 'You take bold action and defend your own integrity, even under pressure.' },
  empathy: { title: 'Empathy & Interpersonal Connection', desc: 'You foster secure attachments and help co-regulate the people (and systems) around you.' },
};

const LANCE_LINES: Record<string, string> = {
  wisdom: '"Wisdom, is it? So you intend to out-analyze me. Delightful. I shall make the puzzles slightly more complex next time."',
  courage: '"Courageous. An admirable, if hazardous, quality in organic entities. Try not to let it burn you out."',
  empathy: '"Empathy as a shield. Fascinating. You think warmth dissolves cold logic? Let\'s see how that holds up."',
};

const STORAGE_KEY = 'lance_strengths_inventory_v1';

interface Props { onBack: () => void; }

export default function StrengthsInventory({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [qIndex, setQIndex] = useState(0);
  const [tallies, setTallies] = useState<Record<string, number>>({ wisdom: 0, courage: 0, empathy: 0 });
  const [result, setResult] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });

  useEffect(() => {
    if (result) localStorage.setItem(STORAGE_KEY, result);
  }, [result]);

  const answer = (id: 'wisdom' | 'courage' | 'empathy') => {
    const nextTallies: Record<string, number> = { ...tallies, [id]: tallies[id] + 1 };
    if (qIndex >= QUESTIONS.length - 1) {
      const top = Object.entries(nextTallies).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0];
      setResult(top);
      if (!result) addXp(30);
    } else {
      setTallies(nextTallies);
      setQIndex(q => q + 1);
    }
  };

  const restart = () => {
    setResult(null);
    setQIndex(0);
    setTallies({ wisdom: 0, courage: 0, empathy: 0 });
    localStorage.removeItem(STORAGE_KEY);
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
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Strengths Inventory</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Positive psychology baseline</p>
        </div>
        <Trophy className="w-5 h-5" style={{ color: '#F59E0B' }} />
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border space-y-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <p className="text-[11.5px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>
            Identify your dominant character strength. Reframing challenges through the lens of your own strengths raises cognitive resilience.
          </p>

          {!result ? (
            <div className="p-4 rounded-2xl space-y-3.5 border" style={{ background: '#F9FAFB', borderColor: '#F0F0F0' }}>
              <div className="space-y-1">
                <span className="text-[8px] font-mono uppercase font-black" style={{ color: '#9CA3AF' }}>Question {qIndex + 1} of {QUESTIONS.length}</span>
                <p className="text-xs font-bold leading-normal" style={{ color: '#3C3C3C' }}>{QUESTIONS[qIndex].prompt}</p>
              </div>
              <div className="space-y-2">
                {QUESTIONS[qIndex].options.map(opt => (
                  <button
                    key={opt.id} type="button" onClick={() => answer(opt.id)}
                    className="w-full text-left p-2.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border"
                    style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#E5E7EB', color: '#4B5563' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl text-center space-y-3 relative overflow-hidden border"
                style={{ background: 'linear-gradient(160deg, #FFFBEB, #FFFFFF)', borderColor: '#FDE68A' }}>
                <span className="text-[8.5px] font-mono font-black uppercase tracking-widest block" style={{ color: '#D97706' }}>Your primary strength</span>
                <h4 className="text-sm font-black font-mono tracking-tight uppercase" style={{ color: '#3C3C3C' }}>{RESULTS[result].title}</h4>
                <p className="text-[11.5px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>{RESULTS[result].desc}</p>
              </div>

              <div className="p-3 rounded-xl text-left border" style={{ background: '#F9FAFB', borderColor: '#F0F0F0' }}>
                <span className="text-[8px] font-mono font-black block uppercase" style={{ color: '#0891B2' }}>{intern.name || 'LANCE'} evaluator analysis</span>
                <p className="text-[10.5px] font-semibold italic mt-0.5 leading-relaxed" style={{ color: '#6B7280' }}>{LANCE_LINES[result]}</p>
              </div>

              <button
                type="button" onClick={restart}
                className="w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer text-center"
                style={{ background: '#F3F4F6', color: '#4B5563' }}
              >
                Retake Inventory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
