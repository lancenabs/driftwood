import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, ShieldAlert, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Heart, HelpCircle, Wind, RefreshCw, Send, Trash2 } from 'lucide-react';

interface ActEntry {
  id: string;
  quadrant: 'values' | 'actions' | 'barriers' | 'away';
  text: string;
}

export default function ActFlexibilityMatrix() {
  const [matrixData, setMatrixData] = useState<ActEntry[]>(() => {
    const saved = localStorage.getItem('therapy_act_matrix');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'act-1', quadrant: 'values', text: 'Being an authentic, supportive partner and a creative builder.' },
      { id: 'act-2', quadrant: 'actions', text: 'Listen actively without interrupting, dedicate 30 mins to building creative apps.' },
      { id: 'act-3', quadrant: 'barriers', text: '"I will fail anyway," heavy exhaustion, fear of judgment.' },
      { id: 'act-4', quadrant: 'away', text: 'Scrolling aimlessly on social media to avoid beginning hard creative tasks.' }
    ];
  });

  const [activeQuadrant, setActiveQuadrant] = useState<'values' | 'actions' | 'barriers' | 'away'>('values');
  const [inputText, setInputText] = useState('');

  // Thought Defusion states
  const [stickyThought, setStickyThought] = useState('I am going to completely fail and disappoint everyone around me.');
  const [activeDefusion, setActiveDefusion] = useState<'raw' | 'thought-that' | 'thanks-mind' | 'sing-it' | 'balloon'>('raw');
  const [isBalloonFloating, setIsBalloonFloating] = useState(false);

  useEffect(() => {
    localStorage.setItem('therapy_act_matrix', JSON.stringify(matrixData));
  }, [matrixData]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newEntry: ActEntry = {
      id: `act-${Date.now()}`,
      quadrant: activeQuadrant,
      text: inputText.trim()
    };

    setMatrixData([...matrixData, newEntry]);
    setInputText('');
  };

  const handleDeleteEntry = (id: string) => {
    setMatrixData(matrixData.filter(d => d.id !== id));
  };

  const getFilteredEntries = (quad: 'values' | 'actions' | 'barriers' | 'away') => {
    return matrixData.filter(d => d.quadrant === quad);
  };

  const triggerBalloonRelease = () => {
    setIsBalloonFloating(true);
    setTimeout(() => {
      setIsBalloonFloating(false);
      setActiveDefusion('raw');
      setStickyThought('');
    }, 4500); // 4.5 seconds float transition
  };

  const quadMeta = {
    values: {
      title: '💖 Values (Inward Towards)',
      prompt: 'Who and what is most important to you in the deep long-term?',
      bg: 'bg-emerald-50/55 border-emerald-100',
      text: 'text-emerald-950',
      tagColor: 'bg-emerald-100 text-emerald-800',
      desc: 'The deep internal directions, qualities, and virtues you want to express in your actions.'
    },
    actions: {
      title: '🎯 Committed Actions (Outward Towards)',
      prompt: 'What specific physical moves/habits align with your values?',
      bg: 'bg-indigo-50/55 border-indigo-100',
      text: 'text-indigo-950',
      tagColor: 'bg-indigo-100 text-indigo-800',
      desc: 'Real, physical behaviors you undertake to move closer to your values, even if you feel uncomfortable.'
    },
    barriers: {
      title: '⛈️ Internal Barriers (Inward Obstacles)',
      prompt: 'What unwanted emotions, memories, thoughts, and fatigue show up?',
      bg: 'bg-rose-50/55 border-rose-100',
      text: 'text-rose-950',
      tagColor: 'bg-rose-100 text-rose-800',
      desc: 'The internal hooks—thoughts, somatic symptoms, anxieties, and fears—that hold you back.'
    },
    away: {
      title: '🏃 Away Moves (Outward Obstacles)',
      prompt: 'What reactive, short-term numbing habits do you do when hooked?',
      bg: 'bg-amber-50/55 border-amber-100',
      text: 'text-amber-950',
      tagColor: 'bg-amber-100 text-amber-800',
      desc: 'Reactive or avoidance actions taken in search of temporary relief from bad feelings.'
    }
  };

  return (
    <div id="act-flexibility-matrix" className="max-w-6xl mx-auto space-y-6 text-left">
      
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-emerald-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1 text-xs font-black uppercase tracking-widest bg-emerald-500/20 rounded border border-emerald-400/40">
              Acceptance & Commitment (ACT)
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            ACT Psychological Flexibility Matrix
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl">
            ACT doesn't aim to eliminate painful thoughts. Instead, it builds **psychological flexibility**: the capacity to tolerate internal discomfort, contact the present moment, and take values-aligned actions. Use this matrix to map your compass.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Quad Matrix Map (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-400">
                The 4-Quadrant Behavioral Grid
              </h3>
              <span className="text-[9px] font-bold text-slate-400">Towards (Right) vs Away (Left)</span>
            </div>

            {/* Matrix 2x2 Grid Layout */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Top Left: Away Moves */}
              <div 
                onClick={() => setActiveQuadrant('away')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 min-h-[170px] flex flex-col justify-between ${
                  activeQuadrant === 'away' ? 'ring-2 ring-amber-500 shadow-sm scale-[1.01]' : ''
                } ${quadMeta.away.bg}`}
              >
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-950 flex items-center gap-1">
                    <span>🏃 Away Moves</span>
                  </h4>
                  <p className="text-[8.5px] text-amber-900/60 font-bold mb-2">Short-term reactivity/numbing</p>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                    {getFilteredEntries('away').map((ent) => (
                      <div key={ent.id} className="text-[10px] font-medium leading-snug bg-white/60 p-1.5 rounded-lg border border-amber-200/50 flex justify-between items-start gap-1">
                        <span>{ent.text}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEntry(ent.id); }} className="text-amber-700 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[8px] font-extrabold uppercase text-amber-500/80 text-right mt-1">Outward Obstacles</div>
              </div>

              {/* Top Right: Committed Actions */}
              <div 
                onClick={() => setActiveQuadrant('actions')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 min-h-[170px] flex flex-col justify-between ${
                  activeQuadrant === 'actions' ? 'ring-2 ring-indigo-500 shadow-sm scale-[1.01]' : ''
                } ${quadMeta.actions.bg}`}
              >
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1">
                    <span>🎯 Committed Actions</span>
                  </h4>
                  <p className="text-[8.5px] text-indigo-900/60 font-bold mb-2">Physical acts aligned to compass</p>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                    {getFilteredEntries('actions').map((ent) => (
                      <div key={ent.id} className="text-[10px] font-medium leading-snug bg-white/60 p-1.5 rounded-lg border border-indigo-200/50 flex justify-between items-start gap-1">
                        <span>{ent.text}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEntry(ent.id); }} className="text-indigo-700 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[8px] font-extrabold uppercase text-indigo-500/80 text-right mt-1">Outward Toward</div>
              </div>

              {/* Bottom Left: Internal Barriers */}
              <div 
                onClick={() => setActiveQuadrant('barriers')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 min-h-[170px] flex flex-col justify-between ${
                  activeQuadrant === 'barriers' ? 'ring-2 ring-rose-500 shadow-sm scale-[1.01]' : ''
                } ${quadMeta.barriers.bg}`}
              >
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-rose-950 flex items-center gap-1">
                    <span>⛈️ Inner Barriers</span>
                  </h4>
                  <p className="text-[8.5px] text-rose-900/60 font-bold mb-2">Sticky feelings & obstacles</p>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                    {getFilteredEntries('barriers').map((ent) => (
                      <div key={ent.id} className="text-[10px] font-medium leading-snug bg-white/60 p-1.5 rounded-lg border border-rose-200/50 flex justify-between items-start gap-1">
                        <span>{ent.text}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEntry(ent.id); }} className="text-rose-700 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[8px] font-extrabold uppercase text-rose-500/80 text-right mt-1">Inward Hooked</div>
              </div>

              {/* Bottom Right: Values */}
              <div 
                onClick={() => setActiveQuadrant('values')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 min-h-[170px] flex flex-col justify-between ${
                  activeQuadrant === 'values' ? 'ring-2 ring-emerald-500 shadow-sm scale-[1.01]' : ''
                } ${quadMeta.values.bg}`}
              >
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1">
                    <span>💖 True Values</span>
                  </h4>
                  <p className="text-[8.5px] text-emerald-900/60 font-bold mb-2">Your compass priorities</p>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                    {getFilteredEntries('values').map((ent) => (
                      <div key={ent.id} className="text-[10px] font-medium leading-snug bg-white/60 p-1.5 rounded-lg border border-emerald-200/50 flex justify-between items-start gap-1">
                        <span>{ent.text}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEntry(ent.id); }} className="text-emerald-700 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[8px] font-extrabold uppercase text-emerald-500/80 text-right mt-1">Inward Guidelines</div>
              </div>

            </div>

            {/* Selector-Based Inputs */}
            <form onSubmit={handleAddEntry} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>ADD TO:</span>
                <div className="flex gap-1.5">
                  {(['values', 'actions', 'barriers', 'away'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setActiveQuadrant(q)}
                      className={`py-1 px-2.5 rounded-lg text-[9px] font-black uppercase border transition-all cursor-pointer ${
                        activeQuadrant === q
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-3xs'
                          : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <p className="text-[10px] font-black text-slate-700 uppercase">{quadMeta[activeQuadrant].prompt}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`e.g. ${activeQuadrant === 'values' ? 'Kindness, self-preservation' : 'Breathe through craving'}`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 text-xs border border-slate-200 bg-white hover:border-slate-300 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-lg transition shrink-0 cursor-pointer"
                  >
                    Lock Entry
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Interactive Defusion Center (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
            
            {/* Balloon absolute animator container */}
            <AnimatePresence>
              {isBalloonFloating && (
                <motion.div
                  initial={{ y: 220, x: 20, scale: 1, opacity: 1 }}
                  animate={{ y: -300, x: -30, scale: 0.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 4.2, ease: "easeIn" }}
                  className="absolute pointer-events-none w-24 h-24 bg-rose-500 border-2 border-rose-300 rounded-full flex items-center justify-center text-center text-[9px] font-black text-white px-2 shadow-xl z-30"
                  style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }}
                >
                  <div className="relative">
                    <span>{stickyThought.slice(0, 32)}...</span>
                    {/* Balloon tail */}
                    <div className="absolute -bottom-3 left-1/2 -ml-0.5 w-1 h-8 bg-slate-300" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1 text-left">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Cognitive Defusion Deck (ACT)
              </span>
              <h3 className="font-display text-sm font-bold text-gray-800">The Sticky Thought Untangler</h3>
              <p className="text-[10px] text-zinc-500 font-semibold leading-normal">
                Defusion means looking <strong>AT</strong> thoughts rather than <strong>FROM</strong> thoughts. Thoughts are just sentences produced by the prefrontal safety cortex, not absolute reality.
              </p>
            </div>

            <div className="premium-divider" />

            {/* Input Thought Field */}
            <div className="space-y-1.5 text-left text-xs">
              <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Type an unwanted / sticky thought:</label>
              <input
                type="text"
                value={stickyThought}
                onChange={(e) => setStickyThought(e.target.value)}
                disabled={isBalloonFloating}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 focus:bg-white"
                placeholder="e.g. My efforts are useless, or I am breaking down."
              />
            </div>

            {/* Defusion buttons Grid */}
            <div className="space-y-2">
              <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Apply Defusion Technique:</label>
              
              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => setActiveDefusion('thought-that')}
                  className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                    activeDefusion === 'thought-that'
                      ? 'bg-teal-50 border-teal-200 text-teal-950 ring-1 ring-teal-500'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  "I am having the thought..."
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDefusion('thanks-mind')}
                  className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                    activeDefusion === 'thanks-mind'
                      ? 'bg-teal-50 border-teal-200 text-teal-950 ring-1 ring-teal-500'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  "Thank Your Mind"
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDefusion('sing-it')}
                  className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                    activeDefusion === 'sing-it'
                      ? 'bg-teal-50 border-teal-200 text-teal-950 ring-1 ring-teal-500'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  🎵 Sing the text
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDefusion('balloon');
                    triggerBalloonRelease();
                  }}
                  className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 text-[10px] font-black transition-all cursor-pointer"
                >
                  🎈 Float as Balloon
                </button>
              </div>
            </div>

            {/* Output Display panel */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl min-h-[90px] flex items-center justify-center text-center">
              <div className="space-y-1.5">
                {activeDefusion === 'raw' && (
                  <p className="text-xs font-semibold italic text-slate-700">"{stickyThought || 'No thought logged yet'}"</p>
                )}

                {activeDefusion === 'thought-that' && (
                  <p className="text-xs font-black text-teal-950 leading-relaxed">
                    "I am noticing that I am having the cognitive barrier thought that <span className="underline italic font-medium">'{stickyThought}'</span>."
                  </p>
                )}

                {activeDefusion === 'thanks-mind' && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold italic text-slate-500">"{stickyThought}"</p>
                    <p className="text-[10px] font-black text-teal-800 bg-teal-50 px-2 py-1 rounded inline-block">
                      🗣️ "Thanks, mind, for bringing up that worry to try and protect me!"
                    </p>
                  </div>
                )}

                {activeDefusion === 'sing-it' && (
                  <p className="text-xs font-bold text-teal-950 leading-relaxed">
                    🎵 (To the tune of Happy Birthday): "My brain says I'll crash, My brain says I'll fail, Oh look at my safety patterns, What a lovely safe tale!" 🎵
                  </p>
                )}

                {activeDefusion === 'balloon' && (
                  <p className="text-xs font-black text-rose-700/80 animate-pulse">
                    🎈 This heavy thought is now encapsulated and floating safely away out of your bodily space...
                  </p>
                )}
              </div>
            </div>

            {/* Compass Guidance */}
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-xs">
              <span className="font-extrabold uppercase text-[9px] text-indigo-800 block">Psychological Coherence Tip:</span>
              <p className="text-[10px] text-indigo-900 font-medium leading-relaxed">
                Notice how changing the verbal context of the worry changes your somatic relationship to it. It loses its gravity, allowing you to choose values-aligned committed actions instead of running away!
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
