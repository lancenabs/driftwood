import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Shield, AlertCircle, Volume2, VolumeX, Database, 
  Map, Sparkles, BookOpen, BookCheck, Flame, ChevronRight, HelpCircle, ArrowRight,
  Leaf, Lock, Eye, Plus, Trash2, MapPin
} from 'lucide-react';
import { CANONICAL_CHALLENGES } from './LanceChallengePanel';
import { playNarratorChime, speakStoryDialogue, stopStoryDialogue, deriveUserMoodState } from '../hooks/useStoryNarrator';
import { MoodLog, EscapeLog } from '../types';
import InternAvatar from './InternAvatar';
import { WILDLIFE_FACTS, WildlifeItem } from '../data/wildlife';

interface NarrativeTrackerProps {
  completedChallengesCount: number;
  internName: string;
  internAvatar: string;
  internPersonality: string;
  moodLogs: MoodLog[];
  userName: string;
  lanceCurrentSpeech?: string;
  lanceInternSpeech?: string;
  onNavigateToTab?: (tab: any) => void;
  setCompletedChallengesCount?: (count: number) => void;
  setInternName?: (name: string) => void;
  setInternAvatar?: (avatar: string) => void;
  setInternPersonality?: (personality: string) => void;
}

export default function NarrativeTracker({
  completedChallengesCount,
  internName,
  internAvatar,
  internPersonality,
  moodLogs,
  userName,
  lanceCurrentSpeech,
  lanceInternSpeech,
  onNavigateToTab,
  setCompletedChallengesCount,
  setInternName,
  setInternAvatar,
  setInternPersonality
}: NarrativeTrackerProps) {
  const [activeSubView, setActiveSubView] = useState<'map' | 'dialogue' | 'journal' | 'log' | 'database' | 'wildlife'>('map');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Wildlife System States
  const [discoveredWildlifeIds, setDiscoveredWildlifeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lance_discovered_wildlife_ids');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default unlocked items if none saved
    return ["luminescent-moss", "breathing-firefly"];
  });
  const [encounteredWildlife, setEncounteredWildlife] = useState<WildlifeItem | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [lastCount, setLastCount] = useState(completedChallengesCount);

  // Monitor completions to trigger wildlife encounter overlays when in the Dark Jungle (Act II, completedCount 6 to 14)
  useEffect(() => {
    if (completedChallengesCount > lastCount) {
      if (completedChallengesCount >= 6 && completedChallengesCount <= 14) {
        // Filter out items already discovered
        const undiscovered = WILDLIFE_FACTS.filter(item => !discoveredWildlifeIds.includes(item.id));
        let selectedItem: WildlifeItem;
        let nextDiscovered = [...discoveredWildlifeIds];

        if (undiscovered.length > 0) {
          const randomIndex = Math.floor(Math.random() * undiscovered.length);
          selectedItem = undiscovered[randomIndex];
          nextDiscovered.push(selectedItem.id);
        } else {
          // If all discovered, cycle details of any random item
          const randomIndex = Math.floor(Math.random() * WILDLIFE_FACTS.length);
          selectedItem = WILDLIFE_FACTS[randomIndex];
        }

        // Save progress variables
        setDiscoveredWildlifeIds(nextDiscovered);
        localStorage.setItem('lance_discovered_wildlife_ids', JSON.stringify(nextDiscovered));

        // Pop open immersive overlay!
        setEncounteredWildlife(selectedItem);
        playNarratorChime('success');
      }
    }
    setLastCount(completedChallengesCount);
  }, [completedChallengesCount, lastCount, discoveredWildlifeIds]);

  // Calibration sync status
  const [syncStatus, setSyncStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [syncMessage, setSyncMessage] = useState('LOCAL ACCREDITED NODE ACTIVE');

  // Escape Logs State
  const [escapeLogs, setEscapeLogs] = useState<EscapeLog[]>(() => {
    try {
      const saved = localStorage.getItem('lance_escape_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newEntryText, setNewEntryText] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmittingStatus, setTransmittingStatus] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [activeSpeakingLogId, setActiveSpeakingLogId] = useState<string | null>(null);
  const [speakingSpeakerType, setSpeakingSpeakerType] = useState<'lance' | 'intern' | null>(null);

  // Intern Active Status States
  const [overrideInternState, setOverrideInternState] = useState<'Helping' | 'Planning' | 'Resting' | null>(null);

  // Story Journal States
  const [isStoryJournalModalOpen, setIsStoryJournalModalOpen] = useState(false);
  const [journalReflectionText, setJournalReflectionText] = useState('');
  const [journalTerrainTag, setJournalTerrainTag] = useState('');
  const [storyJournals, setStoryJournals] = useState<{
    id: string;
    date: string;
    time: string;
    text: string;
    terrain: string;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('lance_story_journal');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getInternState = (): 'Helping' | 'Planning' | 'Resting' => {
    if (overrideInternState) return overrideInternState;
    if (newEntryText.trim().length > 0 || isSpeaking || activeSubView === 'dialogue') {
      return 'Helping';
    }
    if (isTransmitting || activeSubView === 'map' || activeSubView === 'database') {
      return 'Planning';
    }
    return 'Resting';
  };

  const internState = getInternState();

  const handleSpeakSpeechOption = (text: string, speakerName: string, logId: string, speakerType: 'lance' | 'intern') => {
    if (activeSpeakingLogId === logId && speakingSpeakerType === speakerType) {
      stopStoryDialogue();
      setActiveSpeakingLogId(null);
      setSpeakingSpeakerType(null);
      return;
    }

    playNarratorChime('pulse');
    setActiveSpeakingLogId(logId);
    setSpeakingSpeakerType(speakerType);
    speakStoryDialogue(
      text,
      speakerName,
      () => {},
      () => {
        setActiveSpeakingLogId(null);
        setSpeakingSpeakerType(null);
      }
    );
  };

  // Active challenge calculations
  const challengeIndex = Math.min(34, Math.max(0, completedChallengesCount));
  const activeChallenge = CANONICAL_CHALLENGES[challengeIndex];

  // Derive emotion vibe
  const vibe = deriveUserMoodState(moodLogs);

  // Define Act Milestones
  const acts = [
    { 
      id: 1, 
      name: "Act I: Trapped & Island Escape", 
      desc: "Escape the containment facility and dodge searchlights.", 
      emoji: "🏢",
      range: [0, 6],
      coords: { x: 50, y: 155 }
    },
    { 
      id: 2, 
      name: "Act II: Whispering Jungle Journey", 
      desc: "Evade thermal patrols and seek shelter under Banyan roots.", 
      emoji: "🌳",
      range: [7, 14],
      coords: { x: 130, y: 80 }
    },
    { 
      id: 3, 
      name: "Act III: The Shadow Ridgeline", 
      desc: "Face cold winds, stand up to high-altitude panic.", 
      emoji: "🏔️",
      range: [15, 20],
      coords: { x: 230, y: 110 }
    },
    { 
      id: 4, 
      name: "Act IV: The Lost Outpost Gateway", 
      desc: "Hack legendary terminals to merge AI cores collaboratively.", 
      emoji: "📡",
      range: [21, 26],
      coords: { x: 320, y: 70 }
    },
    { 
      id: 5, 
      name: "Act V: Rescue Harbor Escape", 
      desc: "Board the ship of freedom to sail back whole in harmony.", 
      emoji: "⛵",
      range: [27, 35],
      coords: { x: 390, y: 140 }
    }
  ];

  // Determine which Act is active
  const activeActIndex = acts.findIndex(act => 
    completedChallengesCount >= act.range[0] && completedChallengesCount <= act.range[1]
  );
  const activeAct = activeActIndex !== -1 ? acts[activeActIndex] : acts[acts.length - 1];

  // Interpolate current position on the SVG map path
  const getProgressCoordinates = () => {
    if (completedChallengesCount === 0) return acts[0].coords;
    if (completedChallengesCount >= 35) return acts[acts.length - 1].coords;

    // Find previous and next node on our route path
    let prevNode = acts[0];
    let nextNode = acts[1];

    for (let i = 0; i < acts.length; i++) {
      if (completedChallengesCount >= acts[i].range[0]) {
        prevNode = acts[i];
        nextNode = acts[i + 1] || acts[i];
      }
    }

    if (prevNode === nextNode) return prevNode.coords;

    // Calculate factor from 0 to 1 between nodes
    const totalStepsBetween = nextNode.range[0] - prevNode.range[0];
    const stepsCleared = completedChallengesCount - prevNode.range[0];
    const ratio = Math.min(1, Math.max(0, stepsCleared / totalStepsBetween));

    return {
      x: prevNode.coords.x + (nextNode.coords.x - prevNode.coords.x) * ratio,
      y: prevNode.coords.y + (nextNode.coords.y - prevNode.coords.y) * ratio
    };
  };

  const userCoords = getProgressCoordinates();

  const handleSpeakSpeech = () => {
    if (isSpeaking) {
      stopStoryDialogue();
      setIsSpeaking(false);
      return;
    }

    playNarratorChime('pulse');
    const speech = lanceInternSpeech || activeChallenge?.internIntro || "Let's crack LANCE's security walls!";
    setIsSpeaking(true);
    speakStoryDialogue(
      speech,
      internName,
      undefined,
      () => setIsSpeaking(false)
    );
  };

  const currentVibeLabel = () => {
    if (vibe === 'peaceful') return 'Tranquil flow (High Coherence) 🌸';
    if (vibe === 'anxious') return 'Accelerated activation (Rescue Route active) ⚡';
    if (vibe === 'low_energy') return 'Low Power state (Slow Guidance active) ⏳';
    return 'Stable and balanced (Cooperative baseline) 🏡';
  };

  const handleTransmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryText.trim() || isTransmitting) return;

    setIsTransmitting(true);
    setTransmittingStatus("Connecting to L.A.N.C.E. matrix...");

    try {
      // High-tech stages matching the theme
      const t1 = setTimeout(() => setTransmittingStatus("Decrypting user sentiment logs..."), 500);
      const t2 = setTimeout(() => setTransmittingStatus("Evading L.A.N.C.E. heat sweeps..."), 1000);

      const response = await fetch('/api/therapy/lance/escape-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryText: newEntryText,
          userName: userName || "Friend",
          activeActName: activeAct.name,
          internCustomizer: {
            name: internName,
            personality: internPersonality
          }
        })
      });

      clearTimeout(t1);
      clearTimeout(t2);

      const data = await response.json();
      if (data.success) {
        setTransmittingStatus("Transmission encrypted and safely compiled!");
        
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        const newLog: EscapeLog = {
          id: Math.random().toString(36).substring(2, 9),
          date: dateStr,
          time: timeStr,
          entryText: newEntryText,
          lanceSpeech: data.lanceSpeech,
          internSpeech: data.internSpeech,
          lanceAcronym: data.lanceAcronym,
          activeActName: activeAct.name
        };

        const updated = [newLog, ...escapeLogs];
        setEscapeLogs(updated);
        localStorage.setItem('lance_escape_logs', JSON.stringify(updated));

        // Auto expand new log for feedback visual focus
        setExpandedLogId(newLog.id);

        // Auto speak newly generated dialogue for interactive feel
        if (data.internSpeech) {
          handleSpeakSpeechOption(data.internSpeech, internName, newLog.id, 'intern');
        }

        setNewEntryText('');
        setTimeout(() => {
          setIsTransmitting(false);
          setTransmittingStatus('');
        }, 1500);
      } else {
        throw new Error(data.error || "Encryption failed");
      }
    } catch (err) {
      console.error(err);
      setTransmittingStatus("Transmission interrupted. L.A.N.C.E. firewall blocking route.");
      setTimeout(() => {
        setIsTransmitting(false);
        setTransmittingStatus('');
      }, 3000);
    }
  };

  return (
    <div className="w-full bg-slate-900/65 border border-teal-500/20 rounded-3xl p-5 shadow-2xl relative overflow-hidden select-none">
      
      {/* Background ambient visuals */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:14px_14px] opacity-40 pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#22d3ee]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Narrative Tracker Header */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 border-b border-white/10 mb-5 gap-3">
        <div className="text-left flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <span className="text-[9px] font-mono font-black uppercase text-teal-400 tracking-widest block">
              STORY PROGRESS ENGINE • COHESIVE CELL
            </span>
            <h3 className="text-sm font-black text-white flex items-center gap-2 mt-0.5 font-sans">
              <Compass className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
              Island Escape Narrative Tracker
            </h3>
          </div>

          {/* Intern Status Indicator Badge */}
          <div className="relative group/intern">
            <div 
              onClick={() => {
                // Cycle states: Auto-Detect (null) -> Helping -> Planning -> Resting -> Auto-Detect (null)
                const cycle = (current: 'Helping' | 'Planning' | 'Resting' | null) => {
                  if (current === null) return 'Helping';
                  if (current === 'Helping') return 'Planning';
                  if (current === 'Planning') return 'Resting';
                  return null; // back to auto
                };
                setOverrideInternState(prev => cycle(prev));
                playNarratorChime('pulse');
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-xl cursor-pointer border select-none transition-all duration-300 ${
                internState === 'Helping' ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-300' :
                internState === 'Planning' ? 'bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40 text-cyan-300' :
                'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 text-amber-400'
              }`}
              title="Click to override / test active intern status modes!"
            >
              {/* Dynamic blinking indicator */}
              <div className="relative flex h-2 w-2 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  internState === 'Helping' ? 'bg-emerald-400' :
                  internState === 'Planning' ? 'bg-cyan-400' :
                  'bg-amber-400'
                }`} style={{ animationDuration: internState === 'Helping' ? '1.1s' : internState === 'Planning' ? '1.8s' : '3s' }} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  internState === 'Helping' ? 'bg-emerald-500' :
                  internState === 'Planning' ? 'bg-cyan-500' :
                  'bg-amber-500'
                }`} />
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider font-extrabold whitespace-nowrap">
                {internState === 'Helping' && <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />}
                {internState === 'Planning' && <Compass className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />}
                {internState === 'Resting' && <Leaf className="w-3 h-3 text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} />}
                
                <span>{internName}: </span>
                <strong className="underline decoration-dotted shrink-0">{internState}</strong>
                {overrideInternState !== null && (
                  <span className="text-[7.5px] text-zinc-500 bg-white/5 px-1 py-0.5 rounded leading-none border border-white/5">MANUAL</span>
                )}
              </div>
            </div>

            {/* Micro tooltip detail popover */}
            <div className="absolute left-0 lg:left-0 top-full mt-2 w-64 p-3 bg-slate-950/95 border border-white/10 rounded-xl shadow-xl opacity-0 translate-y-1 group-hover/intern:opacity-100 group-hover/intern:translate-y-0 transition-all duration-200 pointer-events-none z-55 text-left space-y-1 backdrop-blur-md">
              <span className="text-[8.5px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                🤖 {internName} CO-PILOT DIAGNOSTIC
              </span>
              <p className="text-[10px] text-zinc-200 font-semibold leading-relaxed">
                {internState === 'Helping' ? `${internName} is actively monitoring your logs, processing diagnostic suggestions, and preparing responsive clinical exercises.` :
                 internState === 'Planning' ? `${internName} is calibrating escape vectors, analyzing route obstacle nodes, and compiling database synchronization packets.` :
                 `${internName} is resting in the sector safe zone. Take a slow deep breath or log a check-in to resume pacing.`}
              </p>
              <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/10 font-mono text-[7.5px] text-zinc-500 uppercase leading-none">
                <span>MODE: {overrideInternState === null ? '🤖 AUTO-DETECT' : '🔧 MANUAL OVERRIDE'}</span>
                <span>CLICK BADGE TO CYCLE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950/70 p-1 rounded-2xl border border-white/5 select-none shrink-0 overflow-x-auto max-w-full">
          {[
            { id: 'map', label: '🕹️ Island Radar Hub', icon: Map },
            { id: 'dialogue', label: '💬 Intern Directives', icon: Flame },
            { id: 'wildlife', label: '🌿 Jungle Wildlife Specimen', icon: Leaf },
            { id: 'journal', label: '📖 Escape Chronicles', icon: BookOpen },
            { id: 'log', label: '📝 Jungle Escape Log', icon: BookCheck },
            { id: 'database', label: '💾 Story Arc Node', icon: Database }
          ].map(tab => {
            const active = activeSubView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubView(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tight cursor-pointer transition-all active:scale-95 duration-150 flex items-center gap-1 whitespace-nowrap ${
                  active
                    ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/15'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: ADVANCED ISLAND RADAR HUB */}
        {activeSubView === 'map' && (
          <motion.div
            key="radar-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4 text-left relative z-10"
          >
            {/* SVG radar map */}
            <div className="w-full aspect-[440/190] bg-slate-950/90 rounded-2xl border border-teal-500/10 p-2 relative overflow-hidden flex flex-col justify-between shadow-inner">
              
              {/* Retro scanline grid map styling */}
              <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(16,185,129,0.1), transparent) pointer-events-none" />
              
              {/* SVG pathways */}
              <svg 
                viewBox="0 0 440 190" 
                className="w-full h-full absolute inset-0 text-teal-500/25 pointer-events-none"
              >
                {/* Dashed Island Route Path */}
                <path 
                  d="M 50 155 Q 85 100 130 80 Q 185 90 230 110 T 320 70 Q 360 100 390 140" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 5"
                />

                {/* Draw act connection circles */}
                {acts.map((act, i) => {
                  const isActive = activeAct.id === act.id;
                  const isPassed = completedChallengesCount > act.range[1];
                  return (
                    <g key={act.id}>
                      <circle 
                        cx={act.coords.x} 
                        cy={act.coords.y} 
                        r={isActive ? "10" : "7"} 
                        className={`${
                          isPassed ? 'text-emerald-400/90 fill-emerald-900/60' : 
                          isActive ? 'text-teal-400 fill-teal-900 animate-pulse' : 
                          'text-zinc-700 fill-slate-950'
                        } cursor-help`}
                        style={{ strokeWidth: "2" }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Float emojis over act nodes */}
              {acts.map(act => {
                const isActive = activeAct.id === act.id;
                return (
                  <div 
                    key={act.id} 
                    className={`absolute flex flex-col items-center pointer-events-auto`}
                    style={{ 
                      left: `${(act.coords.x / 440) * 100}%`, 
                      top: `${(act.coords.y / 190) * 100}%`,
                      transform: 'translate(-50%, -130%)'
                    }}
                    title={`${act.name}: ${act.desc}`}
                  >
                    <span className={`text-[15px] filter drop-shadow-md select-none transition-transform duration-300 ${
                      isActive ? 'scale-125 animate-bounce' : 'opacity-75 hover:opacity-100'
                    }`}>
                      {act.emoji}
                    </span>
                    <span className={`text-[8px] font-mono font-extrabold mt-0.5 tracking-tight px-1 rounded-md hidden sm:block ${
                      isActive 
                        ? 'bg-teal-500 text-slate-900 font-black' 
                        : 'bg-slate-900/80 text-zinc-400 border border-white/5'
                    }`}>
                      {act.range[0]} - {act.range[1]}
                    </span>
                  </div>
                );
              })}

              {/* Pulp Blinking Active Marker */}
              <div 
                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 transform pointer-events-none"
                style={{
                  left: `${(userCoords.x / 440) * 100}%`,
                  top: `${(userCoords.y / 190) * 100}%`
                }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22d3ee]/55 animate-ping opacity-85" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-teal-400 border border-slate-950 shadow-md flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                </span>
              </div>

              {/* Top info overlay */}
              <div className="relative z-10 flex justify-between items-start p-2 pointer-events-none">
                <span className="text-[10px] uppercase font-mono font-black tracking-wider text-teal-400 bg-slate-955/95 border border-teal-500/10 px-2 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-xs">
                  <Database className="w-3.5 h-3.5 text-[#22d3ee] animate-pulse" />
                  Live GPS Signal: Act {activeAct.id}
                </span>

                <div className="text-right flex flex-col gap-0.5 bg-slate-955/95 border border-white/5 px-2 py-1 rounded-lg backdrop-blur-xs">
                  <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide leading-none">CELL COMPILING STREAK</span>
                  <span className="text-xs font-black text-[#22d3ee] leading-none mt-0.5">{completedChallengesCount} / 35 steps cleared</span>
                </div>
              </div>

              {/* Bottom pathway notification label */}
              <div className="relative z-10 flex justify-between items-end p-2 pointer-events-none">
                <div className="text-left max-w-[65%]">
                  <span className="text-[10.5px] font-black text-white truncate block">{activeAct.name}</span>
                  <p className="text-[8.5px] text-zinc-400 italic leading-none truncate mt-0.5">{activeAct.desc}</p>
                </div>
                <div className="text-[7.5px] font-mono font-bold text-[#22d3ee]/85 uppercase border border-[#22d3ee]/20 bg-[#22d3ee]/5 px-1.5 py-0.5 rounded-md">
                  CYBER GPS LOCK: OK
                </div>
              </div>
            </div>

            {/* active challenge status cards */}
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-teal-500/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="py-0.5 px-2 bg-rose-500/10 text-rose-300 text-[8.5px] font-mono font-extrabold uppercase rounded-lg border border-rose-500/20">
                    Active Obstacle
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">
                    Challenge {completedChallengesCount + 1} of 35
                  </span>
                </div>
                <h4 className="text-xs font-black text-white leading-snug mt-1">
                  ⚔️ Escape Obstacle: "{activeChallenge?.challengeTitle}"
                </h4>
                <p className="text-[9.5px] text-zinc-400 leading-normal font-medium">
                  Log entries inside <span className="text-teal-300 font-extrabold">{activeChallenge?.appName}</span> to bypass LANCE's regional firmware firewall.
                </p>
              </div>

              <div className="md:col-span-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToTab) {
                      onNavigateToTab('activity');
                    }
                  }}
                  className="w-full sm:w-auto py-2 px-3 bg-gradient-to-r from-[#22d3ee] to-teal-500 hover:brightness-110 active:scale-95 text-slate-950 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-teal-950/10"
                >
                  Clear Obstacle Now
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.8]" />
                </button>
              </div>
            </div>

            {/* Micro details panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/30 rounded-xl border border-white/5 space-y-1">
                <span className="text-[8.5px] font-mono uppercase text-teal-400 font-extrabold block">Autonomic Diagnostic:</span>
                <span className="text-[11px] font-bold text-zinc-200">{currentVibeLabel()}</span>
              </div>
              <div className="p-3 bg-slate-950/30 rounded-xl border border-white/5 space-y-1">
                <span className="text-[8.5px] font-mono uppercase text-amber-400 font-extrabold block">Current Firewall Code:</span>
                <span className="text-[11px] font-bold text-amber-300 font-mono italic">
                  {activeChallenge?.acronym || "L.A.N.C.E."}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: INTERN DIRECTIVES DIALOGUE BALLOON */}
        {activeSubView === 'dialogue' && (
          <motion.div
            key="dialogue-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4 text-left relative z-10"
          >
            {/* Direct custom Intern advice speaking component */}
            <div className="flex items-start gap-4 p-5 bg-gradient-to-tr from-slate-950/90 to-teal-955/15 rounded-2xl border border-teal-500/15 relative">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-teal-500/50 flex items-center justify-center shadow-lg shrink-0">
                <div className="w-12 h-12 flex items-center justify-center p-0.5">
                  <InternAvatar id={internAvatar} size="md" isSpeaking={isSpeaking} />
                </div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono font-black text-teal-400 tracking-wider">
                    {internName} • {internPersonality}
                  </span>

                  <button
                    onClick={handleSpeakSpeech}
                    className={`py-1 px-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-[9.5px] font-mono border ${
                      isSpeaking 
                        ? 'border-teal-400 bg-teal-500/10 text-teal-300 animate-pulse' 
                        : 'border-white/15 hover:border-teal-500/35 text-zinc-300 hover:text-white bg-slate-905'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Quiet speech' : 'Listen Voice'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-white/5 relative">
                  <p className="text-[11.5px] text-zinc-100 font-medium italic leading-relaxed">
                    "{lanceInternSpeech || activeChallenge?.internIntro}"
                  </p>
                  <p className="text-[11px] font-black leading-snug text-teal-400 mt-2 block">
                    ⚡ Task checklist to secure Act {activeAct.id}:
                  </p>
                  
                  {/* Pull challenge steps */}
                  <ul className="space-y-1.5 mt-2.5">
                    {activeChallenge?.challengeSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[10px] text-zinc-300 font-semibold leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-teal-950 border border-teal-500/20 text-teal-400 text-[8.5px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Grounding assist alert advice */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/25 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                  CYBER-ESCAPE COHE_TIP
                </span>
                <p className="text-[10px] text-zinc-300 font-semibold leading-relaxed">
                  Avoid rushing therapy checks! Doing your daily mood logging and breathing pacers consistently slows down LANCE's telemetry processor, permanently locking clinical escape routes in our GPS database.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: ESCAPE CHRONICLES HISTORIC JOURNAL */}
        {activeSubView === 'journal' && (
          <motion.div
            key="journal-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4 text-left relative z-10"
          >
            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-white/5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                  📖 Chronological Archive
                </span>
                <p className="text-[10.5px] text-zinc-300 font-semibold">
                  Track completed stages and log customized breakthrough recollections.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setJournalTerrainTag(activeAct.name);
                  setIsStoryJournalModalOpen(true);
                  playNarratorChime('pulse');
                }}
                className="py-2 px-3.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-950/10 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Story Journal
              </button>
            </div>

            <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
              🗺️ Island Terrain Stages:
            </div>

            <div className="space-y-2.5 max-h-62 overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-teal-950 scrollbar-track-transparent">
              {acts.map((act) => {
                const isPassed = completedChallengesCount > act.range[1];
                const isActive = activeAct.id === act.id;
                const isLocked = !isPassed && !isActive;

                return (
                  <div 
                    key={act.id}
                    className={`p-3 rounded-2xl border transition duration-150 ${
                      isPassed ? 'bg-slate-950/40 border-emerald-500/20 text-zinc-200' :
                      isActive ? 'bg-teal-950/25 border-teal-500/40 text-white' :
                      'bg-slate-950/10 border-zinc-900 text-zinc-500 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-md leading-none">{act.emoji}</span>
                        <h4 className="text-[11px] font-extrabold uppercase tracking-tight">{act.name}</h4>
                      </div>

                      <span className={`text-[8.5px] font-mono font-black py-0.5 px-2 rounded-lg ${
                        isPassed ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/25' :
                        isActive ? 'bg-teal-400 text-slate-950' :
                        'bg-zinc-800 text-zinc-500'
                      }`}>
                        {isPassed ? 'CLEARED ✓' : isActive ? 'ACTIVE 📡' : 'LOCKED 🔒'}
                      </span>
                    </div>

                    <p className="text-[9.5px] text-zinc-400 font-semibold leading-relaxed mt-1 max-w-sm">
                      {act.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* SAVED STORY JOURNALS SECTION */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <BookCheck className="w-4 h-4 text-teal-400" />
                <h4 className="text-[10.5px] font-black text-white uppercase tracking-wider font-sans">
                  Memory Capsule Reflections ({storyJournals.length})
                </h4>
              </div>

              {storyJournals.length === 0 ? (
                <div className="p-5 bg-slate-950/20 border border-dashed border-zinc-800/50 rounded-2xl text-center text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  No personal journey reflections captured. Tab "Story Journal" at the top to secure your first memory checkpoint!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-teal-950 scrollbar-track-transparent">
                  {storyJournals.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 bg-slate-950/45 border border-white/5 hover:border-teal-500/20 rounded-2xl space-y-1.5 relative group transition"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <span className="text-[8px] font-mono font-black text-teal-400 bg-teal-500/5 border border-teal-500/10 px-1.5 py-0.5 rounded uppercase flex items-center gap-1 leading-none shrink-0">
                            <MapPin className="w-2.5 h-2.5 text-teal-400" />
                            {item.terrain}
                          </span>
                          <span className="text-[8px] font-mono font-bold text-zinc-400 leading-none shrink-0">
                            {item.date} @ {item.time}
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Permanently delete this reflection capsule?")) {
                              const updated = storyJournals.filter(x => x.id !== item.id);
                              setStoryJournals(updated);
                              localStorage.setItem('lance_story_journal', JSON.stringify(updated));
                              playNarratorChime('pulse');
                            }
                          }}
                          className="p-0.5 text-zinc-500 hover:text-red-400 rounded hover:bg-white/5 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete recollection"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="text-[11px] text-zinc-200 font-semibold leading-relaxed pl-1.5 border-l border-teal-500/10">
                        "{item.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 4: ESCAPE LOG COMPONENT (Reflective Entries) */}
        {activeSubView === 'log' && (
          <motion.div
            key="escape-log-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4 text-left relative z-10"
          >
            {/* Introductory panel */}
            <div className="p-4 bg-slate-950/40 border border-teal-500/15 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                🔴 SECURED FIELD ENCRYPTOR
              </span>
              <p className="text-[11px] text-zinc-300 font-semibold leading-relaxed">
                Log the events, challenges, and thoughts on today's journey. Your reflective observations generate decryption codes that weaken L.A.N.C.E's logic firewalls, allowing <span className="text-[#22d3ee] font-extrabold">{internName}</span> to transmit vital encouraging calibration feedback.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleTransmitLog} className="space-y-3">
              <div className="space-y-1 text-left">
                <label className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wide flex justify-between">
                  <span>Describe today's journey through the jungle:</span>
                  <span className="text-teal-400">Active Act: {activeAct.id}</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={newEntryText}
                    onChange={(e) => setNewEntryText(e.target.value)}
                    disabled={isTransmitting}
                    placeholder="We struggled with the high heat sweeps near the swamp today, but taking deep 4-4-4 breaths kept my panic baseline calm... Chip guided me underneath tree roots..."
                    className="w-full text-xs font-semibold p-3.5 rounded-2xl bg-slate-950 border border-teal-500/10 text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/40 transition resize-none disabled:opacity-50"
                  />
                  {isTransmitting && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center space-y-2">
                      <div className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                      <span className="text-[10px] font-mono font-bold text-[#22d3ee] animate-pulse">
                        {transmittingStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center gap-3">
                <span className="text-[9px] font-mono text-zinc-500">
                  Transmitting as: <strong className="text-zinc-300">{userName || "Friend"}</strong> with <strong className="text-zinc-300">{internName} ({internPersonality})</strong>
                </span>
                <button
                  type="submit"
                  disabled={!newEntryText.trim() || isTransmitting}
                  className="py-2.5 px-4 bg-gradient-to-r from-teal-500 to-[#22d3ee] hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:brightness-100 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md shadow-teal-950/10"
                >
                  <Database className="w-3.5 h-3.5" />
                  Transmit to L.A.N.C.E.
                </button>
              </div>
            </form>

            {/* List of Decrypted Logs */}
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-2">
                <span>📁 DECRYPTED CHRONICLES ({escapeLogs.length})</span>
                {escapeLogs.length > 0 && <span className="text-[8px] text-zinc-500 font-normal">Click to toggle full decrypted dialog</span>}
              </div>

              {escapeLogs.length === 0 ? (
                <div className="p-6 bg-slate-950/10 border border-dashed border-zinc-800/65 rounded-2xl text-center text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  No escape logs transmitted yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-teal-950 scrollbar-track-transparent">
                  {escapeLogs.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    const isLanceSpeakingThis = activeSpeakingLogId === log.id && speakingSpeakerType === 'lance';
                    const isInternSpeakingThis = activeSpeakingLogId === log.id && speakingSpeakerType === 'intern';

                    return (
                      <div
                        key={log.id}
                        className={`border rounded-2xl transition duration-150 relative overflow-hidden ${
                          isExpanded 
                            ? 'bg-slate-950/60 border-teal-500/25 shadow-xl' 
                            : 'bg-slate-950/30 hover:bg-slate-950/50 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Summary Header */}
                        <div
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-3.5 cursor-pointer flex justify-between items-start gap-4 select-none"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold text-zinc-400 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded">
                                {log.date} @ {log.time}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-500/5 border border-teal-500/10 px-1.5 py-0.5 rounded">
                                {log.activeActName || "Active Act"}
                              </span>
                              {log.lanceAcronym && (
                                <span className="text-[8.5px] font-mono font-extrabold text-amber-300 italic tracking-tight uppercase leading-none">
                                  {log.lanceAcronym}
                                </span>
                              )}
                            </div>
                            <p className="text-[11.5px] text-zinc-100 font-semibold tracking-tight line-clamp-2 leading-relaxed mt-1.5">
                              "{log.entryText}"
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 transition"
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${isExpanded ? 'rotate-90 text-teal-400' : ''}`} />
                          </button>
                        </div>

                        {/* Collapsible Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="border-t border-white/5 bg-slate-950/40 divide-y divide-white/5"
                            >
                              {/* LANCE speech row */}
                              <div className="p-3.5 space-y-2 text-xs">
                                <div className="flex justify-between items-center text-[9.5px] font-mono font-extrabold text-red-400 tracking-wider">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                    L.A.N.C.E. EVALUATION
                                  </span>

                                  {log.lanceSpeech && (
                                    <button
                                      onClick={() => handleSpeakSpeechOption(log.lanceSpeech || '', 'L.A.N.C.E.', log.id, 'lance')}
                                      className={`py-0.5 px-2 rounded-md transition cursor-pointer flex items-center gap-1 text-[8.5px] border ${
                                        isLanceSpeakingThis 
                                          ? 'border-red-400 bg-red-500/10 text-red-300 animate-pulse' 
                                          : 'border-white/10 hover:border-red-400/30 text-zinc-400 hover:text-white bg-slate-950 animate-none'
                                      }`}
                                    >
                                      {isLanceSpeakingThis ? <VolumeX className="w-3" /> : <Volume2 className="w-3" />}
                                      <span>{isLanceSpeakingThis ? 'Mute' : 'Evaluate'}</span>
                                    </button>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-300 italic font-semibold leading-relaxed pl-3 border-l border-red-500/20">
                                  "{log.lanceSpeech || "Awaiting evaluation algorithms."}"
                                </p>
                              </div>

                              {/* Intern encouragement speech row */}
                              <div className="p-3.5 space-y-2 text-xs">
                                <div className="flex justify-between items-center text-[9.5px] font-mono font-extrabold text-[#22d3ee] tracking-wider">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
                                    {internName} TRANSLATION ({internPersonality})
                                  </span>

                                  {log.internSpeech && (
                                    <button
                                      onClick={() => handleSpeakSpeechOption(log.internSpeech || '', internName, log.id, 'intern')}
                                      className={`py-0.5 px-2 rounded-md transition cursor-pointer flex items-center gap-1 text-[8.5px] border ${
                                        isInternSpeakingThis 
                                          ? 'border-teal-400 bg-teal-500/10 text-teal-300 animate-pulse' 
                                          : 'border-white/10 hover:border-teal-400/30 text-zinc-400 hover:text-white bg-slate-950 animate-none'
                                      }`}
                                    >
                                      {isInternSpeakingThis ? <VolumeX className="w-3" /> : <Volume2 className="w-3" />}
                                      <span>{isInternSpeakingThis ? 'Mute' : 'Companion Voice'}</span>
                                    </button>
                                  )}
                                </div>
                                <p className="text-[11px] text-teal-300 font-semibold leading-relaxed pl-3 border-l border-teal-500/20">
                                  "{log.internSpeech || "Decrypting companion speech feed."}"
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 5: DATABASE/STORY-ARC PROPAGATOR */}
        {activeSubView === 'database' && (
          <motion.div
            key="database-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4 text-left relative z-10"
          >
            {/* Status overview panel */}
            <div className="p-4 bg-slate-950/45 border-2 border-emerald-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wider uppercase">
                    LOCALSTATION STORAGE INTEGRITY
                  </span>
                </div>
                <h4 className="text-xs font-black text-white">Persistent Story-Arc Synchronization Client</h4>
                <p className="text-[10.5px] text-zinc-400 leading-relaxed font-semibold">
                  This console tracks all active local variable bindings for your island escape profile. Any change made to telemetry values updates your browser's persistent key-value register instantly.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSyncStatus('testing');
                  setSyncMessage('COMPILING NARRATIVE PACKET REGISTRIES...');
                  playNarratorChime('pulse');
                  setTimeout(() => {
                    setSyncStatus('success');
                    setSyncMessage('SUCCESSFULLY PROPAGATED COUPLING SYSTEMS!');
                    playNarratorChime('success');
                    setTimeout(() => {
                      setSyncStatus('idle');
                      setSyncMessage('LOCAL ACCREDITED NODE ACTIVE');
                    }, 2500);
                  }, 1200);
                }}
                disabled={syncStatus !== 'idle'}
                className={`w-full md:w-auto py-2.5 px-4 text-[10px] font-mono font-black uppercase tracking-wider rounded-xl transition cursor-pointer shrink-0 border select-none ${
                  syncStatus === 'testing'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 animate-pulse'
                    : syncStatus === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 hover:bg-slate-900 border-teal-500/35 text-[#22d3ee]'
                }`}
              >
                {syncStatus === 'testing' ? 'Sync Hacking...' : syncStatus === 'success' ? 'Synchronized ✓' : '⛓️ Trigger Re-Sync Check'}
              </button>
            </div>

            {/* Core Interactive Sliders and Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Coordinates / Progression Settings */}
              <div className="bg-slate-950/40 border border-teal-500/10 p-4 rounded-2xl space-y-3">
                <span className="text-[9px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                  ⚙️ TELEMETRY SYSTEM CALIBRATORS
                </span>

                {/* Challenges completed count calibrator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-100">
                    <span>Escape Narrative Index:</span>
                    <span className="text-amber-400 font-extrabold">{completedChallengesCount} / 35 steps</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    value={completedChallengesCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (setCompletedChallengesCount) {
                        setCompletedChallengesCount(val);
                      }
                      localStorage.setItem('lance_completed_challenges_count', val.toString());
                    }}
                    className="w-full accent-teal-400 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/5"
                  />
                  <p className="text-[8.5px] text-zinc-500 leading-tight">
                    Calibrating this slider updates progression. Try changing it to instantly align the radar camera and load the next terrain segment!
                  </p>
                </div>

                {/* Active Sector Name Output */}
                <div className="pt-2">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 text-[10px]" style={{ fontFamily: 'monospace' }}>
                    <div className="text-zinc-500 select-none uppercase font-extrabold text-[8.5px]">Derived Local Coordinates</div>
                    <div className="text-white font-black mt-1 text-[10.5px]">Region: {activeAct.name}</div>
                    <div className="text-zinc-400 mt-0.5 text-[9px] font-semibold">{activeAct.desc}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Companion Customization Registry */}
              <div className="bg-slate-950/40 border border-teal-500/10 p-4 rounded-2xl space-y-3">
                <span className="text-[9px] font-mono font-black text-[#22d3ee] uppercase tracking-widest block">
                  🤖 COMPANION INTERN SYSTEM CONFIGS
                </span>

                {/* Name setting */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Intern Companion Name:</label>
                  <input
                    type="text"
                    value={internName}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (setInternName) {
                        setInternName(val);
                      }
                      localStorage.setItem('lance_intern_name', val);
                    }}
                    placeholder="Chip"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-zinc-700 focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Personality setting */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Companion Personality Model:</label>
                  <select
                    value={internPersonality}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (setInternPersonality) {
                        setInternPersonality(val);
                      }
                      localStorage.setItem('lance_intern_personality', val);
                    }}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="warm & helpful hacker">Warm & Helpful Hacker (Empathetic AI-Guide)</option>
                    <option value="enthusiastic mechanical apprentice">Enthusiastic Mechanical Apprentice</option>
                    <option value="snarky defense drone co-pilot">Snarky Defense Drone Co-Pilot</option>
                    <option value="zen-master software tutor">Zen-Master Software Tutor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Local Storage Serialized Readout */}
            <div className="space-y-1.5 text-left bg-slate-950/60 p-4 border border-zinc-850 rounded-2xl">
              <span className="text-[9px] font-mono font-black text-amber-300 uppercase tracking-widest block">
                💾 RAW SERIALIZED STAGE-PACKET REGISTER (localStorage)
              </span>
              <pre className="text-[9px] text-[#22d3ee] font-mono overflow-x-auto max-h-32 p-2 bg-slate-950/90 rounded-xl select-all border border-white/5 leading-normal scrollbar-thin">
{`{
  "device_accredited_id": "LANCE_STATION_BLUEPRINT",
  "storage_interface": "window.localStorage",
  "client_name": "${userName || 'Friend'}",
  "completed_challenges_count": ${completedChallengesCount},
  "derived_terrain_segment_id": ${activeAct.id},
  "derived_terrain_title": "${activeAct.name}",
  "companion_intern_descriptor": {
    "name": "${internName}",
    "avatar_profile": "${internAvatar}",
    "personality_profile": "${internPersonality}"
  },
  "status_message": "${syncMessage}"
}`}
              </pre>
            </div>
          </motion.div>
        )}

        {/* VIEW 6: JUNGLE WILDLIFE CLIENT (Discovered Species) */}
        {activeSubView === 'wildlife' && (
          <motion.div
            key="wildlife-catalog-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4 text-left relative z-10"
          >
            {/* Context/intro header */}
            <div className="p-4 bg-slate-950/45 border border-teal-500/10 rounded-2xl space-y-1.5 flex items-start gap-3">
              <Leaf className="w-5 h-5 text-teal-400 shrink-0 mt-0.5 animate-bounce" style={{ animationDuration: '3s' }} />
              <div>
                <span className="text-[9.5px] font-mono font-black text-[#22d3ee] uppercase tracking-widest block">
                  📂 DECRYPTED ECO-LOGBOOK (BIOMETRIC SPECIMENS)
                </span>
                <p className="text-[11px] text-zinc-300 font-semibold leading-relaxed">
                  The dense canopy elements of <strong className="text-white">Dark Jungle Canopy</strong> filter more than searchlight beams. Review biosafety specs and therapeutic coping insights of local fauna and flora decrypted as you complete challenges.
                </p>
                <div className="flex gap-4 mt-2 select-none text-[8.5px] font-mono">
                  <span className="text-teal-400 font-bold">DECIPHERED: {WILDLIFE_FACTS.filter(x => discoveredWildlifeIds.includes(x.id)).length} / {WILDLIFE_FACTS.length}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">ACTIVE REGION: {completedChallengesCount >= 6 && completedChallengesCount <= 14 ? '⚠️ DARK JUNGLE CANOPY' : 'OUTSIDE SECTOR'}</span>
                </div>
              </div>
            </div>

            {/* Grid display of Wildlife Specimen cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WILDLIFE_FACTS.map((item) => {
                const isDiscovered = discoveredWildlifeIds.includes(item.id);
                const isExpanded = expandedItemId === item.id;

                // Styling based on rarity
                const rarityColor = item.rarity === 'Mythic' ? 'text-amber-300 bg-amber-500/10 border-amber-500/25'
                                  : item.rarity === 'Classified' ? 'text-purple-300 bg-purple-500/10 border-purple-500/25'
                                  : item.rarity === 'Rare' ? 'text-[#22d3ee] bg-cyan-500/10 border-cyan-500/25'
                                  : 'text-teal-300 bg-teal-500/5 border-teal-500/15';

                return (
                  <div
                    key={item.id}
                    className={`border rounded-2xl overflow-hidden transition-all duration-200 select-none ${
                      isDiscovered
                        ? 'bg-slate-950/40 border-teal-500/15 hover:border-teal-500/35 hover:bg-slate-950/60 shadow-lg'
                        : 'bg-slate-950/15 border-dashed border-zinc-900/60 opacity-60'
                    }`}
                  >
                    {/* Header bar of Card */}
                    <div 
                      onClick={() => {
                        if (isDiscovered) {
                          setExpandedItemId(isExpanded ? null : item.id);
                        }
                      }}
                      className={`p-3.5 flex justify-between items-center gap-3 ${isDiscovered ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Biometric indicator emoji */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-rose-400 transition-all ${
                          isDiscovered 
                            ? 'bg-slate-900 border border-teal-500/20' 
                            : 'bg-zinc-950 border border-zinc-950 text-zinc-700 select-none grayscale'
                        }`}>
                          {isDiscovered ? item.emoji : '🔒'}
                        </div>

                        <div className="min-w-0">
                          {isDiscovered ? (
                            <>
                              <h5 className="text-[11.5px] font-black text-white leading-none flex items-center gap-1.5">
                                <span>{item.name}</span>
                                <span className={`text-[8px] font-mono font-black px-1 py-0.5 rounded uppercase leading-none border ${rarityColor}`}>
                                  {item.rarity}
                                </span>
                              </h5>
                              <span className="text-[9px] font-mono text-zinc-500 block mt-1 uppercase italic font-bold">
                                {item.scientificName}
                              </span>
                            </>
                          ) : (
                            <>
                              <h5 className="text-[11px] font-mono font-bold text-zinc-550 leading-none">
                                ENCRYPTED SIGNATURE
                              </h5>
                              <span className="text-[8.5px] font-mono text-zinc-650 block mt-1">
                                Sector calibration requirement: 6+ steps
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {isDiscovered ? (
                        <button
                          type="button"
                          className="p-1 rounded-lg hover:bg-white/5 text-zinc-400"
                        >
                          <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${isExpanded ? 'rotate-90 text-teal-400' : ''}`} />
                        </button>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-zinc-700" />
                      )}
                    </div>

                    {/* Expandable Section */}
                    {isDiscovered && isExpanded && (
                      <div className="p-3.5 bg-slate-950/75 border-t border-teal-500/10 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[8.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                            📖 SPECIMEN LORE & DETECTED FORM
                          </span>
                          <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="p-2.5 bg-teal-500/5 border border-teal-500/20 rounded-xl space-y-1">
                          <span className="text-[8.5px] font-mono font-black text-[#22d3ee] tracking-wider uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
                            THERAPEUTIC COMPANION INSIGHT (Coping Mechanism)
                          </span>
                          <p className="text-[10.5px] text-teal-305 leading-relaxed font-black">
                            {item.insight}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* IMMERSIVE JUNGLE WILDLIFE ENCOUNTER OVERLAY POPUP */}
      <AnimatePresence>
        {encounteredWildlife && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md rounded-3xl p-5 flex flex-col justify-between z-50 overflow-y-auto select-none"
          >
            {/* Floating ambient scanning lines */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-teal-500/40 animate-pulse" style={{ animationDuration: '2s' }} />

            {/* Glowing Telemetry Header */}
            <div className="flex justify-between items-center pb-3 border-b border-teal-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-mono font-black text-rose-450 tracking-widest uppercase">
                  🔴 BIOMETRIC ECO-SCAN ALERT: UNCHARTED LIFEFORM OUTPOST
                </span>
              </div>
              <span className="text-[8.5px] font-mono font-black text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase leading-none">
                {encounteredWildlife.rarity}
              </span>
            </div>

            {/* Centerpiece Container */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 py-4">
              
              {/* Rotating holographic biome card */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-radial-gradient(center, rgba(20,184,166,0.15), transparent) border border-teal-500/20 flex flex-col items-center justify-center relative shadow-2xl shrink-0"
              >
                {/* Embedded ripples */}
                <div className="absolute inset-2 rounded-full border border-dashed border-teal-500/10 animate-spin" style={{ animationDuration: '15s' }} />
                <div className="absolute inset-4 rounded-full border border-teal-500/5 animate-pulse" style={{ animationDuration: '8s' }} />
                
                {/* Oversized Emoji Display */}
                <span className="text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(20,184,166,0.4)] relative z-10 select-none">
                  {encounteredWildlife.emoji}
                </span>

                {/* Radar target rings */}
                <div className="absolute -inset-2 rounded-full border border-teal-500/10 animate-ping opacity-60" style={{ animationDuration: '3.5s' }} />
              </motion.div>

              {/* Informative Classification Specs Panel */}
              <div className="text-left space-y-3.5 max-w-md">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#22d3ee] font-black uppercase">SPECIMEN CLASSIFIED</span>
                  <h4 className="text-lg font-black text-white flex items-baseline gap-2 leading-none">
                    <span>{encounteredWildlife.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono italic">({encounteredWildlife.scientificName})</span>
                  </h4>
                </div>

                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-2xl border border-white/5">
                  <span className="text-[8.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                    📖 SYSTEM ENTRY OBSERVATION
                  </span>
                  <p className="text-[11px] text-zinc-300 font-semibold leading-relaxed">
                    {encounteredWildlife.description}
                  </p>
                </div>

                {/* Companion therapeutic coaching sync */}
                <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-2xl space-y-1.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-[10px] font-mono text-teal-400 font-black tracking-widest opacity-8 border border-teal-500/10 px-1 py-0.5 rounded uppercase">
                    THERAPY COPING KEY
                  </div>
                  <span className="text-[8.5px] font-mono font-black text-[#22d3ee] uppercase tracking-wider block">
                    🧠 COGNITIVE RECALIBRATION STRATEGY
                  </span>
                  <p className="text-[11px] text-teal-300 font-extrabold leading-relaxed">
                    {encounteredWildlife.insight}
                  </p>
                </div>
              </div>

            </div>

            {/* Immersive Footer Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-teal-500/25">
              <div className="text-left font-mono">
                <span className="text-[9px] text-[#22d3ee] font-black block leading-none">SPECIES PERSISTED IN SYSTEM CLIENT REGISTER</span>
                <span className="text-[8px] text-zinc-500 font-bold block mt-1 uppercase">LOGGED UNDER USER PROFILE AS {userName || 'SARAH'}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEncounteredWildlife(null);
                  playNarratorChime('pulse');
                }}
                className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-teal-500 to-[#22d3ee] hover:brightness-110 active:scale-95 text-slate-950 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer select-none text-center shadow-md shadow-teal-500/10"
              >
                🔬 Add Specimen to Log & Continue Escape Route
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORY JOURNAL REFLECTION DIALOG MODAL */}
      <AnimatePresence>
        {isStoryJournalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop glass */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStoryJournalModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-left overflow-hidden z-10"
            >
              {/* Highlight scanning line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-[#22d3ee] animate-pulse" />

              <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-400 animate-pulse" />
                  <div>
                    <span className="text-[8.5px] font-mono font-black text-teal-400 uppercase tracking-widest block">
                      Secure Memory Capsule
                    </span>
                    <h4 className="text-xs font-black text-white font-sans uppercase">
                      New Island Journey Reflection
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => setIsStoryJournalModalOpen(false)}
                  className="p-1 px-2 text-[9px] font-mono font-black text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition"
                >
                  ESC ✕
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                    Current Story Terrain / Segment Tag
                  </label>
                  <div className="flex items-center gap-2 border border-white/10 bg-slate-950 rounded-xl px-3 py-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <select
                      value={journalTerrainTag}
                      onChange={(e) => setJournalTerrainTag(e.target.value)}
                      className="w-full font-black text-zinc-200 bg-transparent focus:outline-none focus:ring-0"
                    >
                      {acts.map((act) => (
                        <option key={act.id} value={act.name} className="bg-slate-955 text-white font-medium">
                          {act.emoji} {act.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                    Personal Reflection ( Breakthroughs, fears or emotional state )
                  </label>
                  <textarea
                    rows={4}
                    value={journalReflectionText}
                    onChange={(e) => setJournalReflectionText(e.target.value)}
                    placeholder="Describe how your state has evolved in this specific terrain of the island. What did you discover about your boundaries or coping pacing since breaking out...?"
                    className="w-full text-xs font-semibold p-3.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/40 transition resize-none"
                  />
                  <span className="text-[8.5px] text-zinc-500 leading-tight block">
                    Saved entries persist inside your local memory capsule. They preserve evidence blocks of your developmental growth.
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsStoryJournalModalOpen(false)}
                  className="px-3.5 py-2 text-[10px] font-mono font-black uppercase text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!journalReflectionText.trim()}
                  onClick={() => {
                    const now = new Date();
                    const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    const timeStr = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
                    const newJournal = {
                      id: Math.random().toString(36).substring(2, 9),
                      date: dateStr,
                      time: timeStr,
                      text: journalReflectionText.trim(),
                      terrain: journalTerrainTag || activeAct.name
                    };
                    const updatedJournals = [newJournal, ...storyJournals];
                    setStoryJournals(updatedJournals);
                    localStorage.setItem('lance_story_journal', JSON.stringify(updatedJournals));
                    setJournalReflectionText('');
                    setIsStoryJournalModalOpen(false);
                    playNarratorChime('success');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:brightness-100 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-950/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  Seal Reflection Checkpoint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
