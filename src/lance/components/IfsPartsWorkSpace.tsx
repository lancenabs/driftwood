import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Heart, ShieldAlert, Sparkles, Plus, Trash2, Edit2, MessageCircle, HelpCircle, Eye, RefreshCw, CheckCircle } from 'lucide-react';

interface IfsPart {
  id: string;
  name: string;
  role: 'manager' | 'firefighter' | 'exile';
  emoji: string;
  intensity: number; // 0 - 100
  positiveIntent: string;
  fearOfResting: string;
  relationshipState: 'blended' | 'polarized' | 'curious-distance' | 'unburdened';
  dialogueHistory: { speaker: 'Self' | 'Part'; text: string; timestamp: string }[];
}

export default function IfsPartsWorkSpace() {
  const [parts, setParts] = useState<IfsPart[]>(() => {
    const saved = localStorage.getItem('therapy_ifs_parts');
    if (saved) return JSON.parse(saved);
    // Seed some classic parts
    return [
      {
        id: 'p-1',
        name: 'The Constant Critic',
        role: 'manager',
        emoji: '🧐',
        intensity: 75,
        positiveIntent: 'To make sure we perform absolutely perfectly so we never experience rejection or criticism from others.',
        fearOfResting: 'If I stop criticizing, we will turn lazy, fail at our commitments, and be completely abandoned.',
        relationshipState: 'blended',
        dialogueHistory: [
          { speaker: 'Self', text: 'Thank you for wanting to protect me from failure. How does it feel when you criticize me so heavily?', timestamp: 'Jan 10' },
          { speaker: 'Part', text: 'I feel exhausted and hyper-vigilant, but I don\'t know any other way to keep us safe.', timestamp: 'Jan 10' }
        ]
      },
      {
        id: 'p-2',
        name: 'The Instant Number / Comfort Seeker',
        role: 'firefighter',
        emoji: '🍿',
        intensity: 60,
        positiveIntent: 'To immediately extinguish overwhelming somatic panic and heavy sadness using food, scrolling, or sleep.',
        fearOfResting: 'If I do not numb us instantly, the severe sorrow from the Exile will consume us entirely and kill our spirit.',
        relationshipState: 'curious-distance',
        dialogueHistory: []
      },
      {
        id: 'p-3',
        name: 'The Rejected Little One',
        role: 'exile',
        emoji: '🥺',
        intensity: 45,
        positiveIntent: 'Storing past family/childhood shame and feelings of not being welcome or valued as we are.',
        fearOfResting: 'I am afraid that if I show myself, everyone will deem me too broken and leave me for good.',
        relationshipState: 'polarized',
        dialogueHistory: []
      }
    ];
  });

  const [activePartId, setActivePartId] = useState<string | null>('p-1');
  const [newPartModal, setNewPartModal] = useState(false);
  
  // New part form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<'manager' | 'firefighter' | 'exile'>('manager');
  const [emoji, setEmoji] = useState('🧐');
  const [positiveIntent, setPositiveIntent] = useState('');
  const [fearOfResting, setFearOfResting] = useState('');
  const [dialogueText, setDialogueText] = useState('');

  useEffect(() => {
    localStorage.setItem('therapy_ifs_parts', JSON.stringify(parts));
  }, [parts]);

  const activePart = parts.find(p => p.id === activePartId) || parts[0];

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPart: IfsPart = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      role,
      emoji,
      intensity: 50,
      positiveIntent: positiveIntent.trim() || 'Protecting the internal household from threat.',
      fearOfResting: fearOfResting.trim() || 'Being overwhelmed by uncontrollable feelings or rejection.',
      relationshipState: 'blended',
      dialogueHistory: []
    };

    setParts([...parts, newPart]);
    setActivePartId(newPart.id);
    setNewPartModal(false);

    // Reset fields
    setName('');
    setRole('manager');
    setEmoji('🧐');
    setPositiveIntent('');
    setFearOfResting('');
  };

  const handleDeletePart = (id: string) => {
    const nextParts = parts.filter(p => p.id !== id);
    setParts(nextParts);
    if (activePartId === id) {
      setActivePartId(nextParts[0]?.id || null);
    }
  };

  const handleAddDialogue = () => {
    if (!dialogueText.trim() || !activePart) return;

    // Simulate conversational pacing inside parts work
    const updatedParts = parts.map(p => {
      if (p.id === activePart.id) {
        const selfMsg = {
          speaker: 'Self' as const,
          text: dialogueText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        let partReplyText = '';
        if (p.role === 'manager') {
          partReplyText = `I hear your curiosity. I\'m just trying to make sure you behave perfectly because I am terrified of what happens if we slip up. But since you\'re asking from a space of Calm and Compassion, I feel a little bit lighter already.`;
        } else if (p.role === 'firefighter') {
          partReplyText = `I react instantly because I thought you couldn\'t handle the pain. If I can trust your spacious 'Self' presence to hold the Exile, I won\'t have to run to these emergency mechanisms as much.`;
        } else {
          partReplyText = `I have been carrying this heavy shame alone in the dark for years. Thank you for looking at me instead of pushing me deeper into the cellar. I feel less abandoned.`;
        }

        const partMsg = {
          speaker: 'Part' as const,
          text: partReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        return {
          ...p,
          dialogueHistory: [...p.dialogueHistory, selfMsg, partMsg]
        };
      }
      return p;
    });

    setParts(updatedParts);
    setDialogueText('');
  };

  const handleUpdateStatus = (id: string, updates: Partial<IfsPart>) => {
    setParts(parts.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // 8 C's of Self leadership
  const selfCs = [
    { name: 'Calmness', desc: 'Physiological tranquility' },
    { name: 'Curiosity', desc: 'Non-judgmental desire to learn' },
    { name: 'Compassion', desc: 'Warm heart for the part\'s burden' },
    { name: 'Clarity', desc: 'Seeing past reactive assumptions' },
    { name: 'Connection', desc: 'Sense of alignment with your system' },
    { name: 'Confidence', desc: 'Trusting internal leadership is safe' },
    { name: 'Courage', desc: 'Willingness to face feared exiles' },
    { name: 'Creativity', desc: 'Spontaneous ways to invite healing' },
  ];

  return (
    <div id="ifs-parts-workspace" className="max-w-6xl mx-auto space-y-6 text-left">
      {/* Intro Header banner */}
      <div className="duo-banner duo-banner-purple space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          <span className="duo-badge duo-badge-purple">Internal Family Systems (IFS)</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-800">
          IFS Parts Mapping & Dialogue Board
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Under the IFS clinical model, the mind is not singular. It is a family of various sub-personalities called <strong>"Parts"</strong>, which gather burdens and enact defense actions to protect you. Healing occurs when you cultivate <strong>Self-Leadership</strong> (the 8 C's) to de-escalate protective parts and unburden your exiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Orbit Visualization & List (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Orbit Map */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[340px]">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-4 h-4 text-violet-600" />
              <span>Internal System Map</span>
            </h3>

            {/* Simulated Orbit Board */}
            <div className="relative w-full h-[220px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center overflow-hidden my-3">
              {/* Central Self Core */}
              <div className="w-16 h-16 rounded-full bg-indigo-600 border-4 border-indigo-100 flex flex-col items-center justify-center shadow-md animate-pulse z-10 text-white">
                <span className="text-[9px] font-black uppercase tracking-wider">SELF</span>
                <span className="text-xs font-bold leading-none">8 C's</span>
              </div>

              {/* Orbiting Elements */}
              {parts.map((p, idx) => {
                // Calculate position based on index or golden spiral
                const total = parts.length;
                const angle = (idx * (2 * Math.PI)) / total;
                const radius = 68; // orbit path size
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePartId(p.id)}
                    className={`absolute w-12 h-12 rounded-full border flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-300 hover:scale-110 shadow-sm ${
                      activePartId === p.id
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-200 ring-offset-2 scale-105'
                        : p.role === 'manager'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        : p.role === 'firefighter'
                        ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                        : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    }`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <span className="text-base select-none">{p.emoji}</span>
                    <span className="text-[7.5px] font-bold tracking-tight truncate max-w-[44px]">
                      {p.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}

              {/* Dotted Orbit Path line */}
              <div className="absolute w-[136px] h-[136px] rounded-full border border-dashed border-slate-200 pointer-events-none" />
            </div>

            <div className="text-[9.5px] text-slate-400 font-semibold text-center italic">
              Tap any orbiting Part to open its somatic positive intent, fear, and conversational board.
            </div>
          </div>

          {/* Parts Manager List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-400">
                Registered Sub-Personalities ({parts.length})
              </h3>
              <button
                type="button"
                onClick={() => setNewPartModal(true)}
                className="py-1 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Map Part</span>
              </button>
            </div>

            <div className="space-y-2">
              {parts.map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActivePartId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActivePartId(p.id);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group outline-none ${
                    activePartId === p.id
                      ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-500 shadow-3xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50/80 hover:border-slate-300 focus:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-slate-100 rounded-xl group-hover:scale-105 transition-transform">{p.emoji}</span>
                    <div className="space-y-0.5">
                      <h4 className="text-[11.5px] font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          p.role === 'manager'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.role === 'firefighter'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.role}
                        </span>
                      </h4>
                      <p className="text-[9.5px] text-slate-500 font-semibold truncate max-w-[170px] xl:max-w-[220px]">
                        Intent: {p.positiveIntent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[8px] font-black text-slate-400 uppercase">Intensity</div>
                      <div className="font-mono text-xs font-bold text-slate-700">{p.intensity}%</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePart(p.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Selected Active Part Space & Self Leadership Dialogue (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activePart ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
              
              {/* Active Part Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl p-1.5 bg-indigo-50 border border-indigo-100 rounded-2xl">{activePart.emoji}</span>
                    <div>
                      <h3 className="font-display text-base font-black text-slate-800 tracking-tight flex items-baseline gap-2">
                        <span>{activePart.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">({activePart.role} part)</span>
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-100">
                          Boundary State: {activePart.relationshipState}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-100">
                          Somatic Load: {activePart.intensity}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adjustment Sliders / Actions */}
                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Interaction Status:</span>
                    <select
                      value={activePart.relationshipState}
                      onChange={(e) => handleUpdateStatus(activePart.id, { relationshipState: e.target.value as any })}
                      className="text-[10px] font-black bg-slate-50 border border-slate-100 rounded-lg py-1 px-2 text-slate-700 cursor-pointer outline-none"
                    >
                      <option value="blended">⚠️ Blended (Fully Taken Over)</option>
                      <option value="polarized">⚡ Polarized (In Conflict)</option>
                      <option value="curious-distance">👀 Gentle Safety Distance</option>
                      <option value="unburdened">🌸 Unburdened (Healed/Free)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="premium-divider" />

              {/* Somatic intent cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 text-left space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Its Human Positive Intent:</span>
                  </h4>
                  <p className="text-[10.5px] font-medium leading-relaxed text-emerald-900/80">
                    "{activePart.positiveIntent}"
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/60 text-left space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-950 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>What it Fears if it Rests:</span>
                  </h4>
                  <p className="text-[10.5px] font-medium leading-relaxed text-amber-900/80">
                    "{activePart.fearOfResting}"
                  </p>
                </div>
              </div>

              {/* Part Somatic Scale slider */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
                <div className="flex justify-between items-center text-[9.5px] font-bold text-slate-600 mb-1">
                  <span className="uppercase tracking-wider">Current Somatic Intensity / Dominance Gauge</span>
                  <span className="font-mono text-[10.5px] font-black bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-3xs">
                    {activePart.intensity}% Loading
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={activePart.intensity}
                  onChange={(e) => handleUpdateStatus(activePart.id, { intensity: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  <span>💤 Dormant / Calm</span>
                  <span>🔥 Highly Blended / Dominant</span>
                </div>
              </div>

              {/* Conversational Dialog Pad */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                  <span>Cochair Dialogue: Self Leaderships & {activePart.name}</span>
                </h4>

                {/* Dialog Messages history container */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2.5">
                  {activePart.dialogueHistory.length > 0 ? (
                    activePart.dialogueHistory.map((chat, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[85%] text-xs ${
                          chat.speaker === 'Self' ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                      >
                        <div className={`p-2.5 rounded-2xl font-medium leading-snug ${
                          chat.speaker === 'Self'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}>
                          <p>{chat.text}</p>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest px-1">
                          {chat.speaker} • {chat.timestamp}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="h-[120px] flex flex-col items-center justify-center text-center space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-300" />
                      <div>
                        <p className="text-[10.5px] font-bold text-slate-500">No Dialogue Recorded Yet</p>
                        <p className="text-[9px] text-slate-400 font-semibold max-w-sm">
                          Use the therapeutic dialog composer below to ask the part questions from your Self leadership state (The 8 C's).
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dialog Form */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask with Curiosity: 'What are you trying to protect me from?'"
                      value={dialogueText}
                      onChange={(e) => setDialogueText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddDialogue();
                        }
                      }}
                      className="flex-1 text-xs border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={handleAddDialogue}
                      disabled={!dialogueText.trim()}
                      className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black transition cursor-pointer shrink-0"
                    >
                      Acknowledge
                    </button>
                  </div>

                  {/* Quick-Ask Prompts helper */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[8px] font-black uppercase text-slate-400 shrink-0">Self Questions:</span>
                    <button
                      onClick={() => setDialogueText('Thank you for being here. What do you wish I knew about your workload?')}
                      className="text-[9.5px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5 hover:bg-indigo-100/60 transition cursor-pointer"
                    >
                      "What do you wish I knew?"
                    </button>
                    <button
                      onClick={() => setDialogueText('What are you afraid would happen to us if you did not perform this task?')}
                      className="text-[9.5px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5 hover:bg-indigo-100/60 transition cursor-pointer"
                    >
                      "What is your absolute core fear?"
                    </button>
                    <button
                      onClick={() => setDialogueText('How old do you believe I am, and would you let me show you who I am today?')}
                      className="text-[9.5px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5 hover:bg-indigo-100/60 transition cursor-pointer"
                    >
                      "How old do you think I am?"
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-[400px] bg-slate-50 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Layers className="w-12 h-12 text-slate-300" />
              <div>
                <h3 className="text-sm font-black text-slate-800">No active sub-personality mapped</h3>
                <p className="text-xs text-slate-400 font-semibold max-w-sm mt-0.5">
                  Set up a part (Manager, Firefighter, or Exile) to begin checking boundary conditions and somatic dialogs.
                </p>
                <button
                  onClick={() => setNewPartModal(true)}
                  className="mt-3 py-1.5 px-4 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-700 text-xs transition cursor-pointer"
                >
                  Create Your First Part
                </button>
              </div>
            </div>
          )}

          {/* The 8 C's of Self Leadership */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Self Leadership Checklist (The 8 C's)</span>
            </h4>
            <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
              When working with internal parts, you must be in your <strong>Self-State</strong>. If you feel anger, shame, or fear toward a part, you are currently blended with another protective part. Unblend by embodying these attributes:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {selfCs.map((c, i) => (
                <div key={i} className="p-2 border border-slate-100 bg-slate-50/50 rounded-xl space-y-0.5">
                  <div className="text-[10px] font-black text-slate-800 leading-tight">{c.name}</div>
                  <div className="text-[8px] text-slate-400 leading-tight font-medium">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map New Part Modal Form */}
      {newPartModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-left"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                <span>🧩 Map New Internal Part</span>
              </h3>
              <button
                type="button"
                onClick={() => setNewPartModal(false)}
                className="p-1 px-2.5 rounded-lg border text-slate-400 hover:bg-slate-50 hover:text-slate-700 text-xs font-black cursor-pointer select-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddPart} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Part Identifier Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Workaholic, Little Shame Bear..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">System Role:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl py-2 px-3 outline-none cursor-pointer"
                  >
                    <option value="manager">🛡️ Manager (Prevention)</option>
                    <option value="firefighter">🍿 Firefighter (Rescue)</option>
                    <option value="exile">🥺 Exile (Stored Strain)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Emoji Avatar:</label>
                  <select
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl py-2 px-3 outline-none cursor-pointer"
                  >
                    <option value="🧐">🧐 Scholar (Critical)</option>
                    <option value="🍿">🍿 Food/Numb (Distract)</option>
                    <option value="🥺">🥺 Broken (Hurt Exile)</option>
                    <option value="😤">😤 Anger/Fierce</option>
                    <option value="🤐">🤐 Quiet/Withdraw</option>
                    <option value="🧠">🧠 Intelectualizer</option>
                    <option value="🧘">🧘 Deep Zen Anchor</option>
                    <option value="🎭">🎭 False Persona</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Positive Intent (What it keeps you safe from):</label>
                <textarea
                  placeholder="e.g., Keeping us highly focused on work so we never have to feel the underlying void of not being enough as we are."
                  value={positiveIntent}
                  onChange={(e) => setPositiveIntent(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Fears if it stops working (Worst-case fantasy):</label>
                <textarea
                  placeholder="e.g. If I don't work constantly, the deep rejection and worthlessness will consume our internal world completely."
                  value={fearOfResting}
                  onChange={(e) => setFearOfResting(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl py-2 px-3 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer mt-2"
              >
                Assemble Part Structure
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
