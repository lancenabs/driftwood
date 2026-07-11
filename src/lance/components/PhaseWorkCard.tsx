import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, BookOpen, Volume2, VolumeX, AlertTriangle, CheckSquare, Plus, Trash2, ArrowRight, ArrowLeft, Heart, ShieldAlert, Award, Smile, Frown, Users, HelpCircle, FileText, Calendar, Play, Pause, Save, CheckCircle, Smartphone, Check, Sparkles } from 'lucide-react';

interface PhaseWorkCardProps {
  onTriggerInteractionAlert?: (title: string, body: string, action?: { label: string; onClick: () => void }) => void;
  onNavigateToTab?: (tab: string, subtab?: string) => void;
}

export default function PhaseWorkCard({ onTriggerInteractionAlert, onNavigateToTab }: PhaseWorkCardProps) {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [speakActive, setSpeakActive] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  
  // Local storage state keys for ease of saving
  const [payoffsList, setPayoffsList] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_phase_payoffs');
    return saved ? JSON.parse(saved) : [
      "No physical hangovers, dry mouth, or pounding headaches",
      "Tremendous financial savings of cash and credit card debit",
      "Deeper restful sleep and clean REM cycles",
      "Rebuilding absolute trust with my closest family members",
      "Waking up daily without toxic guilt, anxiety, or shame",
      "Consistent mental focus, recall, and daily energy levels",
      "Being 100% emotionally present for my loved ones",
      "Zero fear of legal consequences or DUI risks",
      "Restored liver, skin quality, and biological health",
      "Authentic self-confidence without chemical fuel"
    ];
  });

  const [costsList, setCostsList] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_phase_costs');
    return saved ? JSON.parse(saved) : [
      "Severe relationship tension with partner and family",
      "Staggering amounts of wasted finances and resources",
      "Unmanageable chronic morning panic attacks and anxiety",
      "Career performance degradation and absent days",
      "Impaired memory, brain fog, and intellectual drift",
      "Self-loathing and a cycle of broken commitments",
      "Compromised biological health and physical energy",
      "Heavy fatigue and constant sleep deprivation",
      "Inability to sit peacefully with raw feelings",
      "Living in a state of secrecy, lies, and hiding details"
    ];
  });

  // Inputs for adding to list
  const [newPayoffInput, setNewPayoffInput] = useState('');
  const [newCostInput, setNewCostInput] = useState('');

  // Letters
  const [whyNowText, setWhyNowText] = useState(() => localStorage.getItem('recovery_phase_whynow') || '');
  const [dearJohnText, setDearJohnText] = useState(() => localStorage.getItem('recovery_phase_dearjohn') || '');
  const [helloLetterText, setHelloLetterText] = useState(() => localStorage.getItem('recovery_phase_helloletter') || '');
  const [eulogyAText, setEulogyAText] = useState(() => localStorage.getItem('recovery_phase_eulogya') || '');
  const [eulogyBText, setEulogyBText] = useState(() => localStorage.getItem('recovery_phase_eulogyb') || '');

  // Save triggers helper
  const handleSaveText = (key: string, value: string, setter: (val: string) => void) => {
    setter(value);
    localStorage.setItem(key, value);
  };

  // Phase 2: Cognitive Awareness list of Column Entries
  const [fiveColumnEntries, setFiveColumnEntries] = useState<any[]>(() => {
    const saved = localStorage.getItem('recovery_phase_fivecolumn');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        event: 'Confronted in sobriety support group by a peer saying I looked checked out.',
        ant: 'They clearly do not like me, and I obviously do not belong in this group.',
        distortion: 'Mind Reading / All-or-nothing thinking',
        result: 'I feel completely disconnected and have an urge to leave early.',
        rational: 'Actually, Tom is looking out for me because he knows how dry spells feel, and Bob was simply focused on his own notes. People do care.',
        newResult: 'I feel recommitted to complete my recovery program, recognizing that feeling challenged is a growth catalyst.'
      }
    ];
  });

  const [colEvent, setColEvent] = useState('');
  const [colAnt, setColAnt] = useState('');
  const [colDistortion, setColDistortion] = useState('All-or-nothing thinking');
  const [colResult, setColResult] = useState('');
  const [colRational, setColRational] = useState('');
  const [colNewResult, setColNewResult] = useState('');

  const handleAddFiveColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colEvent.trim() || !colAnt.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      event: colEvent,
      ant: colAnt,
      distortion: colDistortion,
      result: colResult,
      rational: colRational,
      newResult: colNewResult
    };
    const updated = [...fiveColumnEntries, newEntry];
    setFiveColumnEntries(updated);
    localStorage.setItem('recovery_phase_fivecolumn', JSON.stringify(updated));
    // Clear inputs
    setColEvent('');
    setColAnt('');
    setColResult('');
    setColRational('');
    setColNewResult('');
  };

  const handleRemoveFiveColumn = (id: string) => {
    const updated = fiveColumnEntries.filter(item => item.id !== id);
    setFiveColumnEntries(updated);
    localStorage.setItem('recovery_phase_fivecolumn', JSON.stringify(updated));
  };

  // Phase 3: Relapse Prevention Threat lists
  const [threatPeople, setThreatPeople] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_phase_threat_people');
    return saved ? JSON.parse(saved) : ['High-drinking acquaintances', 'Stress-triggering former connections'];
  });
  const [threatPlaces, setThreatPlaces] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_phase_threat_places');
    return saved ? JSON.parse(saved) : ['Unregulated bars, late-night nightclubs', 'Unhealthy trigger environments'];
  });
  const [threatThoughts, setThreatThoughts] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_phase_threat_thoughts');
    return saved ? JSON.parse(saved) : ['"I can handle just one drink"', '"Today was so bad, drinking is my only escape"'];
  });
  const [threatFeelings, setThreatFeelings] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_phase_threat_feelings');
    return saved ? JSON.parse(saved) : ['Extreme, unexpressed bitterness', 'Overwhelming isolation or loneliness'];
  });
  const [threatBehaviors, setThreatBehaviors] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_phase_threat_behaviors');
    return saved ? JSON.parse(saved) : ['Skipping daily therapy/wellness', 'Hiding physical locations or receipts'];
  });

  const [inputNewThreat, setInputNewThreat] = useState('');

  const handleAddThreat = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, storageKey: string) => {
    if (!inputNewThreat.trim() || list.length >= 10) return;
    const updated = [...list, inputNewThreat.trim()];
    setList(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInputNewThreat('');
  };

  const handleRemoveThreat = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, storageKey: string) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Relapse warning signs cards flipped state
  const [cardFlip, setCardFlip] = useState<{ [key: string]: boolean }>({});
  const warningCards = [
    { id: 'c1', sign: 'I isolate myself from my sober support and miss group therapy meetings.', thoughts: '"I have got this under control, I do not need them."', feelings: 'Apathy, fatigue, secretiveness', response: 'Initiate a direct wellness check-in, attend next group meeting, and inform my sponsor within 12 hours.' },
    { id: 'c2', sign: 'I start arguing with family members about minor, irrelevant details.', thoughts: '"They are trying to control my life, they are plotting against me."', feelings: 'Defensive anger, building resentment', response: 'Slowing down to apply the CBT TST blueprint, stating: "I hear you, and I value this connection."' },
    { id: 'c3', sign: 'I begin glorifying memories of drinking or drugging, forgetting the costs.', thoughts: '"Those Friday nights were so beautiful and liberating."', feelings: 'Nostalgic yearning, craving spike', response: 'Pull up the interactive Payoffs vs Costs grid immediately and re-read my Eulogy A out loud.' }
  ];

  // Phase 4: Sober Support characteristics verified state
  const [characteristics, setCharacteristics] = useState<{ id: string, label: string, checked: boolean }[]>(() => {
    const saved = localStorage.getItem('recovery_phase_support_char');
    return saved ? JSON.parse(saved) : [
      { id: '1', label: 'Does not use substances in my presence', checked: true },
      { id: '2', label: 'Maintains healthy physical and emotional boundaries', checked: true },
      { id: '3', label: 'Provides non-judgmental, compassionate active listening', checked: true },
      { id: '4', label: 'Has their own stable emotional support structures', checked: true },
      { id: '5', label: 'Respects my sobriety path without placing pressure', checked: true },
      { id: '6', label: 'Is comfortable with complete transparency and honesty', checked: false },
      { id: '7', label: 'Willing to intervene immediately if they notice relapse warning signs', checked: false }
    ];
  });

  const toggleCharacteristic = (id: string) => {
    const updated = characteristics.map(c => c.id === id ? { ...c, checked: !c.checked } : c);
    setCharacteristics(updated);
    localStorage.setItem('recovery_phase_support_char', JSON.stringify(updated));
  };

  // Phase 5: Weekly Discharge/Aftercare Calendar schedule (7AM-11PM Mon-Sun)
  const [calendarHours, setCalendarHours] = useState<{ [key: string]: { category: 'bio' | 'psy' | 'soc' | 'spi' | '', label: string } }>(() => {
    const saved = localStorage.getItem('recovery_phase_discharge_calendar');
    return saved ? JSON.parse(saved) : {
      'Monday-08:00': { category: 'bio', label: 'Biological: Fast Morning Walk' },
      'Monday-18:00': { category: 'psy', label: 'Psychology: Therapist Session' },
      'Wednesday-19:00': { category: 'soc', label: 'Sober Meetings Group' },
      'Saturday-10:00': { category: 'spi', label: 'Spiritual: Breathwork & Nature walk' }
    };
  });

  const [calDay, setCalDay] = useState('Monday');
  const [calTime, setCalTime] = useState('08:00');
  const [calCategory, setCalCategory] = useState<'bio' | 'psy' | 'soc' | 'spi'>('bio');
  const [calLabel, setCalLabel] = useState('');

  const handleAddCalendarSlot = () => {
    if (!calLabel.trim()) return;
    const slotKey = `${calDay}-${calTime}`;
    const updated = {
      ...calendarHours,
      [slotKey]: { category: calCategory, label: calLabel.trim() }
    };
    setCalendarHours(updated);
    localStorage.setItem('recovery_phase_discharge_calendar', JSON.stringify(updated));
    setCalLabel('');
  };

  const handleRemoveCalendarSlot = (key: string) => {
    const copy = { ...calendarHours };
    delete copy[key];
    setCalendarHours(copy);
    localStorage.setItem('recovery_phase_discharge_calendar', JSON.stringify(copy));
  };

  // Setup TTS
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSynth(window.speechSynthesis);
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        setVoices(list);
        
        // Default voice selection logic
        const defaultVoice = list.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Soothing'))) || list[0];
        if (defaultVoice) {
          setSelectedVoiceName(defaultVoice.name);
        }
      };
      
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const handleSpeak = (textToRead: string) => {
    if (!synth) return;
    if (speakActive) {
      synth.cancel();
      setSpeakActive(false);
      return;
    }

    const cleanText = textToRead.replace(/[#*`_]/g, ''); // strip markdown formatting characters
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const selectedVoice = voices.find(v => v.name === selectedVoiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speechRate;
    
    utterance.onend = () => {
      setSpeakActive(false);
    };
    utterance.onerror = () => {
      setSpeakActive(false);
    };

    setSpeakActive(true);
    synth.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (synth) {
      synth.cancel();
      setSpeakActive(false);
    }
  };

  // Stop TTS if user navigates away from tab
  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  // Guidelines text for narration per phase
  const getPhaseGuidelines = (p: number) => {
    switch (p) {
      case 1:
        return "Phase One is Motivation to Change. The goal is to assist in assessing and improving motivation to change self-destructive thinking into a fulfilling life. We complete our 20 Payoffs and Costs listing, write a 'Dear John' Good-bye letter to chemicals, and compile two contrasting eulogies to observe the fork in our personal lifetime path.";
      case 2:
        return "Phase Two is Awareness. The goal is to easily recognize cognitive distortions like all-or-nothing thinking, emotional reasoning, or fortune telling. We complete the interactive five-column CBT worksheet to identify and rewrite automatic negative thoughts that spark sudden craving spikes.";
      case 3:
        return "Phase Three is Developing a Personal Relapse Prevention Plan. The objective is to map specific triggers and create a secure plan. We list 10 threat items for people, places, thoughts, feelings, and behaviors. We also utilize our somatic warning sign deck to learn how to manage thoughts, emotions, and urges before they amplify.";
      case 4:
        return "Phase Four is Developing and Utilizing a Sober Support System. We list 15 vital personal traits our support team needs, register 10 trusted individual allies with phone numbers, and customize a letter granting them permission to intervene if our warning signs become active.";
      case 5:
        return "Phase Five is Developing a Comprehensive Discharge Plan. We establish our 20 payoffs list and structure a solid 24/7 weekly recovery hour calendar covering Biological restoring, Psychological therapy, Social meetings, and Spiritual breathing. This builds full-person alignment across your new life.";
      default:
        return "";
    }
  };

  const handleAddListItem = (isPayoff: boolean) => {
    if (isPayoff) {
      if (!newPayoffInput.trim()) return;
      const updated = [...payoffsList, newPayoffInput.trim()];
      setPayoffsList(updated);
      localStorage.setItem('recovery_phase_payoffs', JSON.stringify(updated));
      setNewPayoffInput('');
    } else {
      if (!newCostInput.trim()) return;
      const updated = [...costsList, newCostInput.trim()];
      setCostsList(updated);
      localStorage.setItem('recovery_phase_costs', JSON.stringify(updated));
      setNewCostInput('');
    }
  };

  const handleRemoveListItem = (index: number, isPayoff: boolean) => {
    if (isPayoff) {
      const updated = payoffsList.filter((_, i) => i !== index);
      setPayoffsList(updated);
      localStorage.setItem('recovery_phase_payoffs', JSON.stringify(updated));
    } else {
      const updated = costsList.filter((_, i) => i !== index);
      setCostsList(updated);
      localStorage.setItem('recovery_phase_costs', JSON.stringify(updated));
    }
  };

  // Quick preset adding for easy tap
  const presetPayoffs = [
    "Restored self-respect", "Saving $400 every single month", "Deep clear skin", "Morning mental peace"
  ];
  const presetCosts = [
    "Financial depletion", "Midnight hot sweating panic", "Lying to friends", "Ruined liver cells"
  ];

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-in text-left">
      
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-[#123120] to-[#07160f] text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
              <span className="text-[10px] uppercase tracking-widest font-extrabold font-sans">CLINICAL TREATMENT PLATFORM</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              My Therapy Assistant Phase Work
            </h3>
            <p className="text-[11px] text-emerald-100/80 leading-relaxed font-semibold max-w-2xl">
              Complete the verified multi-stage therapeutic recovery exercises below. Fully interactive, offline-persistent, and built to structure your sovereignty.
            </p>
          </div>

          {/* Premium TTS Control Widget */}
          <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-800/40 flex flex-col gap-2 shrink-0 max-w-xs w-full sm:w-auto">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                🗣️ Therapeutic Narrator
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSpeak(getPhaseGuidelines(activePhase))}
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                    speakActive ? 'bg-red-650 text-white animate-pulse' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
                  }`}
                  title="Click to hear clinical guidance read out loud"
                >
                  {speakActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{speakActive ? "Stop Guide" : "Listen Guide"}</span>
                </button>
              </div>
            </div>

            {voices.length > 0 && (
              <div className="flex flex-col gap-1">
                <select
                  value={selectedVoiceName}
                  onChange={(e) => {
                    setSelectedVoiceName(e.target.value);
                    if (speakActive) {
                      handleStopSpeaking();
                    }
                  }}
                  className="bg-emerald-900 border border-emerald-800/60 rounded-lg text-[9.5px] text-emerald-150 px-2 py-1 focus:outline-none w-full"
                >
                  {voices.filter(v => v.lang.includes('en')).map(v => (
                    <option key={v.name} value={v.name}>{v.name.slice(0, 18)}</option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[8px] text-emerald-400 font-bold">
                  <span>Speed:</span>
                  <input
                    type="range"
                    min="0.6"
                    max="1.5"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span>{speechRate}x</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Phase progress visual timeline */}
        <div className="grid grid-cols-5 gap-1.5 mt-6 relative z-10 pt-1">
          {[1, 2, 3, 4, 5].map((p) => {
            const isCompleted = p < activePhase;
            const isActive = p === activePhase;
            return (
              <button
                key={p}
                onClick={() => {
                  setActivePhase(p);
                  if (speakActive) handleStopSpeaking();
                }}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-700/60 border-emerald-400 text-white font-bold'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400'
                    : 'bg-transparent border-emerald-900/30 text-emerald-600 hover:text-emerald-350'
                }`}
              >
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider leading-none">Phase</span>
                <span className="text-sm font-black font-mono leading-none">{p}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60" style={{ visibility: isCompleted ? 'visible' : 'hidden' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main interactive cards workspace */}
      <div className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activePhase === 1 && (
            <motion.div
              key="phase-1-workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Objective Banner */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-900">
                <ShieldAlert className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9.5px] uppercase tracking-wider font-black text-emerald-850">Client Goal & Objectives</span>
                  <p className="text-[11.5px] font-semibold text-emerald-900/90 leading-relaxed">
                    Determine motivation for recovery. Look at drug/substance history, contrasting 20 payoffs vs 20 costs, and draft goodbye letters and contrasting eulogies.
                  </p>
                </div>
              </div>

              {/* 20 Payoffs vs 20 Costs columns */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-50">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-700" />
                    Exercise 1.1: Double-List Payoffs & Costs Checklist (Aim for 20 Each)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    {payoffsList.length} / 20 Payoffs • {costsList.length} / 20 Costs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Payoffs of sobriety */}
                  <div className="p-4 bg-emerald-50/10 border border-emerald-100/40 rounded-2xl space-y-3">
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">💎 Sobriety Payoffs / Gains</span>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPayoffInput}
                        onChange={(e) => setNewPayoffInput(e.target.value)}
                        placeholder="Add positive payoff..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:border-emerald-700"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddListItem(true)}
                      />
                      <button
                        onClick={() => handleAddListItem(true)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl px-2.5 text-[11px] font-bold"
                      >
                        Add
                      </button>
                    </div>

                    {/* Quick Taps preset bubbles */}
                    <div className="flex flex-wrap gap-1">
                      {presetPayoffs.map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            if (!payoffsList.includes(p)) {
                              const updated = [...payoffsList, p];
                              setPayoffsList(updated);
                              localStorage.setItem('recovery_phase_payoffs', JSON.stringify(updated));
                            }
                          }}
                          className="text-[9px] font-medium bg-emerald-50 text-emerald-850 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition border border-emerald-100/40"
                        >
                          + {p}
                        </button>
                      ))}
                    </div>

                    <ul className="space-y-1.5 max-h-[14rem] overflow-y-auto pr-1">
                      {payoffsList.map((item, id) => (
                        <li key={id} className="flex items-center justify-between gap-2 p-2 bg-white border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-700 shadow-3xs">
                          <span className="flex items-start gap-1 text-slate-650">
                            <span className="text-emerald-700">✓</span>
                            <span>{item}</span>
                          </span>
                          <button
                            onClick={() => handleRemoveListItem(id, true)}
                            className="p-0.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Costs of drinking/using */}
                  <div className="p-4 bg-red-50/10 border border-red-100/40 rounded-2xl space-y-3">
                    <span className="text-[11px] font-black text-red-800 uppercase tracking-wider block">🚨 Chemical Costs / Loss</span>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCostInput}
                        onChange={(e) => setNewCostInput(e.target.value)}
                        placeholder="Add negative cost of using..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-none focus:border-red-600"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddListItem(false)}
                      />
                      <button
                        onClick={() => handleAddListItem(false)}
                        className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-2.5 text-[11px] font-bold"
                      >
                        Add
                      </button>
                    </div>

                    {/* Quick Taps preset bubbles */}
                    <div className="flex flex-wrap gap-1">
                      {presetCosts.map(c => (
                        <button
                          key={c}
                          onClick={() => {
                            if (!costsList.includes(c)) {
                              const updated = [...costsList, c];
                              setCostsList(updated);
                              localStorage.setItem('recovery_phase_costs', JSON.stringify(updated));
                            }
                          }}
                          className="text-[9px] font-medium bg-red-50 text-red-850 px-2 py-0.5 rounded-full hover:bg-red-100 transition border border-red-100/40"
                        >
                          + {c}
                        </button>
                      ))}
                    </div>

                    <ul className="space-y-1.5 max-h-[14rem] overflow-y-auto pr-1">
                      {costsList.map((item, id) => (
                        <li key={id} className="flex items-center justify-between gap-2 p-2 bg-white border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-700 shadow-3xs">
                          <span className="flex items-start gap-1 text-slate-650">
                            <span className="text-red-700">💔</span>
                            <span>{item}</span>
                          </span>
                          <button
                            onClick={() => handleRemoveListItem(id, false)}
                            className="p-0.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Essays and goodbye letter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-50">
                
                {/* Essay: Why Now */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-slate-705 block uppercase tracking-widest">
                    Exercise 1.2: Essay - Why Now?
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase leading-tight leading-none">
                    Discuss what prompted seeking recovery at this exact split second.
                  </p>
                  <textarea
                    value={whyNowText}
                    onChange={(e) => handleSaveText('recovery_phase_whynow', e.target.value, setWhyNowText)}
                    placeholder="Describe your raw feelings, relationships, health spikes, and legal/financial boundaries..."
                    className="w-full h-36 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 rounded-xl p-3.5 text-xs text-slate-700 font-medium leading-relaxed shadow-3xs"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Persistent Autosafe Active</span>
                    <span>{whyNowText.length} characters</span>
                  </div>
                </div>

                {/* Goodbye letter to chemicals */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-slate-705 block uppercase tracking-widest">
                    Exercise 1.4: Farewell "Dear John" Goodbye Letter
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase leading-tight leading-none">
                    Write a goodbye letter to substance usage as a primary dysfunctional relationship.
                  </p>
                  <textarea
                    value={dearJohnText}
                    onChange={(e) => handleSaveText('recovery_phase_dearjohn', e.target.value, setDearJohnText)}
                    placeholder="We started off feeling like we had fun, but you turned negative, lying, secretive and destructive. Goodbye..."
                    className="w-full h-36 bg-slate-100/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 rounded-xl p-3.5 text-xs text-slate-700 font-medium leading-relaxed italic shadow-3xs"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Persistent Autosafe Active</span>
                    <span>{dearJohnText.length} characters</span>
                  </div>
                </div>

              </div>

              {/* Hello Letter to Recovery and contrast Eulogies */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <span className="text-xs font-black text-slate-800 block uppercase tracking-widest">
                  Exercise 1.6-1.7: Contrasting Lifeline Eulogies
                </span>
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                  Alcoholism and Addiction are terminal. Fill in the contrasting statements below to observe what people write about your legacy.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Eulogy A (Active usage) */}
                  <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-bold text-red-900 block flex items-center gap-1.5">
                      💀 EULOGY A: If I continue substance usage
                    </span>
                    <textarea
                      value={eulogyAText}
                      onChange={(e) => handleSaveText('recovery_phase_eulogya', e.target.value, setEulogyAText)}
                      placeholder="He/She passed away too early, having left behind broken relationships, uncompleted goals, and isolated solitude..."
                      className="w-full h-24 bg-white border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-650 rounded-xl p-3 text-xs text-slate-700 font-medium leading-relaxed"
                    />
                  </div>

                  {/* Eulogy B (Recovery route) */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1.5">
                      💎 EULOGY B: If I live fully in Recovery
                    </span>
                    <textarea
                      value={eulogyBText}
                      onChange={(e) => handleSaveText('recovery_phase_eulogyb', e.target.value, setEulogyBText)}
                      placeholder="He/She went on to build true wisdom, deep trust, loved by grandchildren, present for every crisis..."
                      className="w-full h-24 bg-white border border-emerald-250 focus:outline-none focus:ring-1 focus:ring-emerald-700 rounded-xl p-3 text-xs text-slate-700 font-medium leading-relaxed"
                    />
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {activePhase === 2 && (
            <motion.div
              key="phase-2-workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Objective Banner */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-900">
                <BookOpen className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9.5px] uppercase tracking-wider font-black text-emerald-850">Phase Two Awareness Goal</span>
                  <p className="text-[11.5px] font-semibold text-emerald-900/90 leading-relaxed">
                    Identify subconscious patterns of cognitive self-defeat, commonly referred to as "stinking thinking", "our dark side", "mental committee", or "rat brain" that lead to cravings and rationalized relapses.
                  </p>
                </div>
              </div>

              {/* Distortions Dictionary */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">
                  Quick Glossary of Sobriety-Diminishing Cognitive Distortions
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { title: "All-or-Nothing", desc: '"Since I drank half a glass, I ruined everything, I might as well stay high for a year."' },
                    { title: "Fortune Telling", desc: '"I will go to this wedding and crack. There is zero hope I can stand sober."' },
                    { title: "Mind Reading", desc: '"My therapist was glancing at her clock. She thinks I am a hopeless liar."' },
                    { title: "Emotional Reasoning", desc: '"I feel deeply guilty, meaning I am inherently an awful person who deserves relapse."' }
                  ].map(d => (
                    <div key={d.title} className="bg-slate-50 border border-slate-150 p-3 rounded-2xl space-y-1.5 shadow-3xs cursor-pointer hover:border-emerald-200 transition">
                      <span className="text-[10.5px] font-extrabold text-slate-755 block">{d.title}</span>
                      <p className="text-[9.5px] text-slate-500 italic leading-snug">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column editor */}
              <div className="bg-slate-50/50 border border-slate-150/60 p-5 rounded-3xl space-y-4">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">
                  Exercise 2.2: Interactive Five-Column Technique Worksheet
                </span>
                <p className="text-[11px] font-semibold text-slate-505">
                  Deconstruct actual offending events causing acute cravings or self-sabotaging thoughts. Rewrite them to restore neural peace.
                </p>

                <form onSubmit={handleAddFiveColumn} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Offending Event</label>
                      <input
                        type="text"
                        value={colEvent}
                        onChange={(e) => setColEvent(e.target.value)}
                        placeholder="e.g. Challenged in my support group..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Automatic Negative Thoughts (ANT)</label>
                      <input
                        type="text"
                        value={colAnt}
                        onChange={(e) => setColAnt(e.target.value)}
                        placeholder="They hate me. I will never build sober days..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cognitive Distortion classification</label>
                      <select
                        value={colDistortion}
                        onChange={(e) => setColDistortion(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="All-or-nothing thinking">All-or-nothing thinking</option>
                        <option value="Fortune Telling Error">Fortune Telling Error</option>
                        <option value="Mind Reading">Mind Reading</option>
                        <option value="Emotional Reasoning">Emotional Reasoning</option>
                        <option value="Overgeneralization">Overgeneralization</option>
                        <option value="Should statements">Should statements</option>
                        <option value="Labeling / Personalization">Labeling / Personalization</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CBT Results / Urge level</label>
                      <input
                        type="text"
                        value={colResult}
                        onChange={(e) => setColResult(e.target.value)}
                        placeholder="I feel isolated, craving level rises to 8..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Rational Objective Response</label>
                      <input
                        type="text"
                        value={colRational}
                        onChange={(e) => setColRational(e.target.value)}
                        placeholder="They want me to succeed, healing has hiccups..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Result / Stabilized Emotion</label>
                      <input
                        type="text"
                        value={colNewResult}
                        onChange={(e) => setColNewResult(e.target.value)}
                        placeholder="I feel grounded, trigger has been surfed down to 1."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 border border-transparent text-white text-xs font-bold font-sans uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Cognitive Entry on My Therapy Assistant Sheet
                    </button>
                  </div>
                </form>
              </div>

              {/* Dynamic list of Columns saved */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">
                  Completed Five Column Techniques List
                </span>
                
                <div className="space-y-3">
                  {fiveColumnEntries.map(item => (
                    <div key={item.id} className="bg-white border border-slate-150 p-4.5 rounded-2xl shadow-3xs space-y-3 text-left relative">
                      <button
                        onClick={() => handleRemoveFiveColumn(item.id)}
                        className="absolute top-4 right-4 p-1 hover:bg-slate-50 text-red-500 rounded cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#446650] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Event</span>
                        <p className="text-xs font-semibold text-slate-800 italic">"{item.event}"</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2 border-t border-slate-100 text-[11px] font-medium leading-relaxed text-slate-650">
                        <div>
                          <span className="font-extrabold text-red-800 block mb-0.5">1. Automatic ANT</span>
                          <p>{item.ant}</p>
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-450 block mb-0.5">2. Distortion</span>
                          <p className="font-bold text-amber-700">{item.distortion}</p>
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-450 block mb-0.5">3. Unchecked Result</span>
                          <p>{item.result}</p>
                        </div>
                        <div>
                          <span className="font-extrabold text-emerald-800 block mb-0.5">4. Rational Response</span>
                          <p className="italic">{item.rational}</p>
                        </div>
                        <div>
                          <span className="font-extrabold text-[#446650] block mb-0.5">5. Active Alignment</span>
                          <p className="font-black text-emerald-800 bg-emerald-50/40 p-1 rounded border border-emerald-100/30">{item.newResult}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activePhase === 3 && (
            <motion.div
              key="phase-3-workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Objective Banner */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-900">
                <Compass className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9.5px] uppercase tracking-wider font-black text-emerald-850">Phase Three Relapse Prevention</span>
                  <p className="text-[11.5px] font-semibold text-emerald-900/90 leading-relaxed">
                    Set up your 10 critical warning signals and coping maneuvers. Remember, relapse is a slow process, never an overnight event. Defy early signals.
                  </p>
                </div>
              </div>

              {/* 10 Threat Lists Progress bars */}
              <div className="space-y-4">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">
                  Interactive Exercise 3.1 - 3.5: Identify Threat Inventories (Up to 10 Each)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                  {[
                    { label: "👥 1. People", list: threatPeople, setter: setThreatPeople, key: 'recovery_phase_threat_people' },
                    { label: "📍 2. Places", list: threatPlaces, setter: setThreatPlaces, key: 'recovery_phase_threat_places' },
                    { label: "💭 3. Thoughts", list: threatThoughts, setter: setThreatThoughts, key: 'recovery_phase_threat_thoughts' },
                    { label: "🎭 4. Feelings", list: threatFeelings, setter: setThreatFeelings, key: 'recovery_phase_threat_feelings' },
                    { label: "⚡ 5. Behaviors", list: threatBehaviors, setter: setThreatBehaviors, key: 'recovery_phase_threat_behaviors' }
                  ].map((inventory) => (
                    <div key={inventory.label} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-between min-h-[14rem] shadow-3xs">
                      <div className="space-y-2">
                        <span className="text-[10.5px] font-extrabold text-slate-700 block">{inventory.label}</span>
                        {/* Progressive Checklist Progress indicator */}
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(inventory.list.length / 10) * 100}%` }} />
                        </div>
                        <span className="text-[8.5px] text-slate-400 font-bold block">{inventory.list.length} of 10 entered</span>
                        
                        <ul className="space-y-1.5 overflow-y-auto max-h-[8rem]">
                          {inventory.list.map((item, id) => (
                            <li key={id} className="p-1.5 bg-white border border-slate-100 rounded-lg text-[9.5px] font-semibold text-slate-600 flex justify-between items-center">
                              <span className="truncate max-w-[80%]">• {item}</span>
                              <button
                                onClick={() => handleRemoveThreat(id, inventory.list, inventory.setter, inventory.key)}
                                className="text-red-500 hover:bg-slate-50 p-0.5 rounded shrink-0 cursor-pointer"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {inventory.list.length < 10 && (
                        <div className="flex gap-1 pt-2">
                          <input
                            type="text"
                            placeholder="Add threat..."
                            value={inputNewThreat}
                            onChange={(e) => setInputNewThreat(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] w-full focus:outline-none focus:border-emerald-700"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddThreat(inventory.list, inventory.setter, inventory.key);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddThreat(inventory.list, inventory.setter, inventory.key)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg px-2 py-0.5 text-[10px] font-bold shrink-0 shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings and Flashcards */}
              <div className="space-y-4 pt-4 border-t border-slate-105">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">
                  Exercise 3.8-3.9: Somatic 3x5 Flashcards - Warning Signs to Coping Strategies
                </span>
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                  Flip these cards to view immediate coping directives. Keep warning signs on one side and defensive actions on the other.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {warningCards.map((card) => {
                    const isFlipped = cardFlip[card.id] || false;
                    return (
                      <div
                        key={card.id}
                        onClick={() => setCardFlip({ ...cardFlip, [card.id]: !isFlipped })}
                        className="perspective-1000 h-48 cursor-pointer relative"
                      >
                        <div className={`relative w-full h-full duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                          
                          {/* Front Side */}
                          <div className="absolute inset-0 backface-hidden bg-[#fffbeb] border border-amber-250 p-4.5 rounded-2xl flex flex-col justify-between shadow-xs select-none">
                            <div className="space-y-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 shadow-3xs px-2 py-0.5 rounded-md inline-block">
                                Warning Signal
                              </span>
                              <h4 className="text-[11.5px] font-extrabold text-slate-800 leading-normal">
                                "{card.sign}"
                              </h4>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] text-slate-450 font-bold uppercase leading-none">Internal Somatic State</p>
                              <p className="text-[10px] text-slate-550 leading-relaxed font-semibold italic">{card.feelings}</p>
                            </div>
                            <span className="text-[8.5px] text-amber-800 font-extrabold uppercase tracking-widest block text-right mt-1">
                              Click to Flip for Coping Directives ↺
                            </span>
                          </div>

                          {/* Back Side */}
                          <div className="absolute inset-0 backface-hidden bg-[#f0fdf4] border border-emerald-250 p-4.5 rounded-2xl flex flex-col justify-between shadow-xs rotate-y-180 select-none">
                            <div className="space-y-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-100 shadow-3xs px-2 py-0.5 rounded-md inline-block">
                                Safe Coping Maneuver
                              </span>
                              <h4 className="text-[11.5px] font-bold text-slate-800 leading-normal italic">
                                "{card.response}"
                              </h4>
                            </div>
                            <div className="space-y-1 text-slate-600">
                              <p className="text-[9px] text-emerald-700 font-bold uppercase leading-none">Defensive Thoughts</p>
                              <p className="text-[10px] text-emerald-900 leading-relaxed font-semibold">{card.thoughts}</p>
                            </div>
                            <span className="text-[8.5px] text-emerald-700 font-extrabold uppercase tracking-widest block text-right mt-1">
                              Click to Flip Signal ↺
                            </span>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activePhase === 4 && (
            <motion.div
              key="phase-4-workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Objective Banner */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-900">
                <Users className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9.5px] uppercase tracking-wider font-black text-emerald-850">Phase Four Support System Goal</span>
                  <p className="text-[11.5px] font-semibold text-emerald-900/90 leading-relaxed">
                    Identify characteristics of effective allies, map 10 concrete individuals to include in your discharge network, and customize a letter granting active intervention permission to these allies.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 15 Characteristics Checklist */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      Exercise 4.1: Characteristics of a Safe Ally (Min 15)
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">
                      {characteristics.filter(c => c.checked).length} Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 bg-slate-50 border border-slate-150 rounded-2xl p-4 max-h-[22rem] overflow-y-auto">
                    {characteristics.map(c => (
                      <div
                        key={c.id}
                        onClick={() => toggleCharacteristic(c.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                          c.checked 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                            : 'bg-white border-slate-150 text-slate-600 hover:border-emerald-100'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-left">{c.label}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          c.checked ? 'bg-emerald-700 border-transparent text-white' : 'border-slate-300 bg-white text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2.5 pt-2 border-t border-slate-200 mt-2">
                      <input
                        type="text"
                        placeholder="Add required partner characteristic..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = e.currentTarget.value.trim();
                            if (!val) return;
                            const updated = [...characteristics, { id: Date.now().toString(), label: val, checked: true }];
                            setCharacteristics(updated);
                            localStorage.setItem('recovery_phase_support_char', JSON.stringify(updated));
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Ally letters & Contacts list */}
                <div className="space-y-4">
                  <span className="text-xs font-black text-slate-800 block uppercase tracking-widest">
                    Exercise 4.3: Intervention Permission Letter Creator
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase leading-tight leading-none">
                    Grant permission and list relapse warning signs for your close allies.
                  </p>

                  <div className="bg-slate-100 p-4.5 rounded-2xl border border-slate-200 space-y-3 shadow-3xs">
                    <span className="text-[10.5px] font-black text-slate-800 uppercase tracking-wider block">✍️ Customize Support Letter Template</span>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Customize this authorization so allies can step in immediately if they detect danger:
                    </p>

                    <div className="p-3.5 bg-white border border-slate-150 rounded-xl max-h-[14rem] overflow-y-auto text-[11px] font-medium leading-relaxed text-slate-650 italic">
                      Dear Support, <br /><br />
                      I am actively writing to you because you are an essential pillar of my recovery system. <br /><br />
                      If you notice any of my warning behaviors, like missing family calls, isolating, or expressing irrational defensiveness, I hereby grant you full, unconditional authorization and invite you to intervene and direct me toward professional aftercare immediately.
                    </div>

                    <button
                      onClick={() => {
                        if (onTriggerInteractionAlert) {
                          onTriggerInteractionAlert(
                            "Support Letter Authorized! ✉️",
                            "Your customized authorization letter template has been locked. You may print and share this letter with your sober mates safely.",
                            { label: "Done", onClick: () => {} }
                          );
                        }
                      }}
                      className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[11px] font-extrabold uppercase font-sans tracking-wider transition shadow-sm active:scale-95"
                    >
                      Authorize & Lock Support Letter
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activePhase === 5 && (
            <motion.div
              key="phase-5-workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Objective Banner */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-900">
                <Calendar className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9.5px] uppercase tracking-wider font-black text-emerald-850">Phase Five Discharge Plan Goal</span>
                  <p className="text-[11.5px] font-semibold text-emerald-900/90 leading-relaxed">
                    Build a structured initial weekly recovery hour calendar with locations and categories. Address life holistically: Biologically, Psychologically, Socially, and Spiritually.
                  </p>
                </div>
              </div>

              {/* Weekly Calendar builder */}
              <div className="space-y-4">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">
                  Interactive Exercise 5.2: Hour Block Recovery Scheduler (Mon-Sun)
                </span>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3.5">
                  {/* Calendar controller */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 items-end">
                    <div>
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase block mb-1">Weekday</label>
                      <select value={calDay} onChange={(e) => setCalDay(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase block mb-1">Time Block</label>
                      <select value={calTime} onChange={(e) => setCalTime(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none">
                        {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase block mb-1">Domain category</label>
                      <select value={calCategory} onChange={(e) => setCalCategory(e.target.value as any)} className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none">
                        <option value="bio">☀️ Biological (Wellness/Gym)</option>
                        <option value="psy">🧠 Psychological (Therapy/CBT)</option>
                        <option value="soc">👥 Social (Support meetings)</option>
                        <option value="spi">🕉️ Spiritual (Zen / Nature)</option>
                      </select>
                    </div>

                    <div>
                      <button
                        onClick={handleAddCalendarSlot}
                        className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider shadow-sm"
                      >
                        Add Hour
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-bold text-slate-400 uppercase block mb-1">Enter specific activity location & names</label>
                    <input
                      type="text"
                      value={calLabel}
                      onChange={(e) => setCalLabel(e.target.value)}
                      placeholder="e.g., AA Support meeting with Sponsor Bob on Main street room 3..."
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Display calendar list organized by weekdays */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
                  {['Monday', 'Wednesday', 'Friday', 'Saturday'].map((dayName) => {
                    const matchedSlots = (Object.entries(calendarHours) as [string, { category: 'bio' | 'psy' | 'soc' | 'spi' | '', label: string }][]).filter(([key]) => key.startsWith(dayName));
                    return (
                      <div key={dayName} className="p-3.5 bg-[#f6faf7] border border-emerald-150/40 rounded-2xl space-y-2.5">
                        <span className="text-[10.5px] font-black text-[#576956] uppercase tracking-wider block">📅 {dayName}</span>
                        
                        <div className="space-y-1.5">
                          {matchedSlots.length === 0 ? (
                            <p className="text-[9.5px] text-slate-400 font-semibold italic">Unscheduled open space.</p>
                          ) : (
                            matchedSlots.map(([key, data]) => {
                              const timeVal = key.split('-')[1];
                              const isBio = data.category === 'bio';
                              const isPsy = data.category === 'psy';
                              const isSoc = data.category === 'soc';
                              const isSpi = data.category === 'spi';
                              return (
                                <div
                                  key={key}
                                  className={`p-2.5 rounded-xl border flex flex-col justify-between text-left gap-1 transition ${
                                    isBio ? 'bg-sky-50 border-sky-200 text-sky-900' :
                                    isPsy ? 'bg-amber-50 border-amber-200 text-amber-900' :
                                    isSoc ? 'bg-indigo-50 border-indigo-200 text-indigo-900' :
                                    'bg-emerald-50 border-emerald-200 text-emerald-900'
                                  }`}
                                >
                                  <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase">
                                    <span>{timeVal}</span>
                                    <button
                                      onClick={() => handleRemoveCalendarSlot(key)}
                                      className="text-red-500 hover:bg-white/40 px-1 rounded cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <p className="text-[10px] font-bold leading-snug">{data.label}</p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
