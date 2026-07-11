import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Map, Trees, Trophy, HelpCircle, Activity, Lock, CheckCircle, 
  MapPin, Milestone, Sparkles, Navigation, Info, ArrowRight, Sun, Anchor 
} from 'lucide-react';
import { CANONICAL_CHALLENGES, StoryChallenge } from './LanceChallengePanel';

interface IslandProgressMapProps {
  completedChallengesCount: number;
  internName?: string;
  internAvatar?: string;
  storyMapSelectedCheckpointId?: number;
  onSelectedCheckpointIdChange?: (id: number) => void;
}

interface MapCheckpoint {
  id: number;
  name: string;
  actTitle: string;
  tag: string;
  milestoneRange: [number, number];
  description: string;
  environment: string;
  therapeuticValue: string;
  emoji: string;
  coordX: number; // percentage X for SVG coordinate path placement
  coordY: number; // percentage Y for SVG coordinate path placement
  color: string;
  activeColor: string;
  pathSegment: string; // SVG bezier representation for this stretch
}

const CHECKPOINTS: MapCheckpoint[] = [
  {
    id: 1,
    name: "Beach Landing Zone",
    actTitle: "Act I - Arrival & Lockdown",
    tag: "Beach Landing",
    milestoneRange: [1, 5],
    description: "Your escape begins at the quarantine beach. Breakthrough isolating barriers set up by LANCE's core firewall.",
    environment: "Tense sea breeze, tall razor wire, and sand dunes guarded by active scanners.",
    therapeuticValue: "Safe somatic grounding & regulatory boundaries introduction.",
    emoji: "🌴",
    coordX: 12,
    coordY: 76,
    color: "from-amber-500/20 to-orange-500/20 border-orange-500/30 text-amber-400",
    activeColor: "shadow-orange-500/50 bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-500 text-white border-orange-400",
    pathSegment: "M 12 76 Q 25 70, 38 52"
  },
  {
    id: 2,
    name: "Jungle Whispering Canopy",
    actTitle: "Act II - The Great Escape",
    tag: "Deep Forest",
    milestoneRange: [6, 13],
    description: "Deep in the primeval rainforest. Learn to listen to somatic patterns and emotional signals without LANCE's interceptors catching on.",
    environment: "Dense moisture, giant glowing ferns, damp tree leaves, and high-vibrato cricket sounds.",
    therapeuticValue: "Vagal nerve activation & mapping emotional states.",
    emoji: "🌲",
    coordX: 38,
    coordY: 52,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    activeColor: "shadow-emerald-500/50 bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-500 text-white border-emerald-400",
    pathSegment: "M 38 52 Q 50 35, 52 24"
  },
  {
    id: 3,
    name: "Mossy Subterranean Cavern",
    actTitle: "Act III - Evading the Patrols",
    tag: "Ancient Caves",
    milestoneRange: [14, 19],
    description: "A dark hollow cavern. Navigate cold passages, using CBT tools to avoid thermal detectors and defragment negative thought structures.",
    environment: "Sub-bass water ripples, echo-chambers, glowing moss, and cool whispering wind gusts.",
    therapeuticValue: "Anxiety defusion & identification of core core-beliefs.",
    emoji: "🕳️",
    coordX: 52,
    coordY: 24,
    color: "from-cyan-500/20 to-indigo-500/20 border-cyan-500/30 text-cyan-450",
    activeColor: "shadow-cyan-500/50 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-blue-500 text-white border-cyan-400",
    pathSegment: "M 52 24 Q 65 30, 78 40"
  },
  {
    id: 4,
    name: "High Shadow Ridgeline",
    actTitle: "Act IV - The Shadow Ridgeline",
    tag: "Mountain Heights",
    milestoneRange: [20, 25],
    description: "Scale high altitude mountain peaks under code red blizzard winds. Construct a bulletproof navigational future plan.",
    environment: "Shivering wind currents, crystalline chimes, dark low synth frequencies, and tech radars.",
    therapeuticValue: "Sovereign autonomy building & future navigational life design.",
    emoji: "🧗",
    coordX: 78,
    coordY: 40,
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    activeColor: "shadow-purple-500/50 bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 text-white border-purple-400",
    pathSegment: "M 78 40 Q 86 60, 85 82"
  },
  {
    id: 5,
    name: "Coastal Harbor Escape",
    actTitle: "Act V - The Ocean Harbor Integration",
    tag: "The Sea Port",
    milestoneRange: [26, 35],
    description: "The final step. Tune up the vessel to set sail, integrating LANCE's firewall into your supportive clinical system.",
    environment: "Harmonized ocean tides, soothing breaking waves, positive major scale chords, and clear sunset.",
    therapeuticValue: "Unified self-identity integration & triumphant closure.",
    emoji: "⛵",
    coordX: 85,
    coordY: 82,
    color: "from-blue-500/20 to-teal-500/20 border-blue-500/30 text-blue-400",
    activeColor: "shadow-blue-550/50 bg-gradient-to-tr from-blue-600 via-teal-555 to-emerald-500 text-white border-blue-400",
    pathSegment: ""
  }
];

interface TerrainLegendItem {
  id: number;
  name: string;
  emoji: string;
  reqCount: number;
  unlockedTitle: string;
  type: string;
  lore: string;
  intel: string;
  riskLevel: string;
}

const TERRAIN_LEGENDS: TerrainLegendItem[] = [
  {
    id: 1,
    name: "Quarantine Beach Head",
    emoji: "🌴",
    reqCount: 1,
    unlockedTitle: "Discovered: Beach Head",
    type: "Sandy Dunes & Razor-wire",
    lore: "Guards the perimeter. Overcome isolation constraints by seeking safe sensory grounding.",
    intel: "Slow, focused somatic breathing overrides local detector scanning grids.",
    riskLevel: "Low to Moderate - Scanner Grid Patrol"
  },
  {
    id: 2,
    name: "Dark Jungle Canopy",
    emoji: "🌲",
    reqCount: 6,
    unlockedTitle: "Discovered: Whispering Canopy",
    type: "Primeval Forest Rainforest",
    lore: "Primeval foliage filters sensory input. Learn to process physical stress feedback patterns.",
    intel: "Use vagus nerve activation triggers to block local audio-drone interception sweeps.",
    riskLevel: "Moderate - Sound Signature Sensor Swarms"
  },
  {
    id: 3,
    name: "Basalt Moss Caverns",
    emoji: "🕳️",
    reqCount: 14,
    unlockedTitle: "Discovered: Subterranean Hollow",
    type: "Echo Caves & Cold Vaults",
    lore: "Silent basalt chambers protect against high-frequency thermal seeker drone waves.",
    intel: "Reframing deep core beliefs dampens thermal heat output indices from stress.",
    riskLevel: "High - Thermal Tracking & Echo Patrols"
  },
  {
    id: 4,
    name: "High Frost Ridgeline",
    emoji: "🧗",
    reqCount: 20,
    unlockedTitle: "Discovered: Shadow Ridgeline",
    type: "Alpine Peaks & Radars",
    lore: "Sovereign heights where cognitive storms test the strength of your personal boundaries.",
    intel: "Plan exact future milestones to clear the mountain's high pressure freezing zones.",
    riskLevel: "Severe - Sudden Blizzards & Height Scanners"
  },
  {
    id: 5,
    name: "Cooperative integration Harbor",
    emoji: "⛵",
    reqCount: 26,
    unlockedTitle: "Discovered: Seaport Harbor",
    type: "Sunset Coastal Shoreline",
    lore: "Absolute synthesis. Emancipate from the quarantine and launch your cooperative vessel.",
    intel: "Co-pilot synthesis turns LANCE from a restrictive firewall to a collaborative system booster.",
    riskLevel: "None - Harmonized Cooperative Synthesis"
  }
];

export default function IslandProgressMap({
  completedChallengesCount,
  internName = "Chip",
  internAvatar = "drone",
  storyMapSelectedCheckpointId,
  onSelectedCheckpointIdChange
}: IslandProgressMapProps) {
  const [localSelectedCheckpointId, setLocalSelectedCheckpointId] = useState<number>(() => {
    // Default to the checkpoint the user is current in
    if (completedChallengesCount < 6) return 1;
    if (completedChallengesCount < 14) return 2;
    if (completedChallengesCount < 20) return 3;
    if (completedChallengesCount < 26) return 4;
    return 5;
  });

  const selectedCheckpointId = (storyMapSelectedCheckpointId !== undefined && storyMapSelectedCheckpointId !== 0)
    ? storyMapSelectedCheckpointId 
    : localSelectedCheckpointId;

  const handleSelectCheckpoint = (id: number) => {
    if (onSelectedCheckpointIdChange) {
      onSelectedCheckpointIdChange(id);
    } else {
      setLocalSelectedCheckpointId(id);
    }
  };

  // Track state changes to handle pan notifications on completed challenge increment
  const [prevCount, setPrevCount] = useState(completedChallengesCount);
  const [panningAlert, setPanningAlert] = useState<string | null>(null);

  useEffect(() => {
    const targetId = completedChallengesCount < 6 ? 1 
                  : completedChallengesCount < 14 ? 2 
                  : completedChallengesCount < 20 ? 3 
                  : completedChallengesCount < 26 ? 4 
                  : 5;
    
    // Automatically select the active checkpoint node if we have not loaded one yet, or on challenge count bump
    if (storyMapSelectedCheckpointId === undefined || storyMapSelectedCheckpointId === 0) {
      handleSelectCheckpoint(targetId);
    }

    // If challenge completion count increased, flash a high-contrast tracking hud report
    if (completedChallengesCount > prevCount) {
      const prevId = prevCount < 6 ? 1 
                    : prevCount < 14 ? 2 
                    : prevCount < 20 ? 3 
                    : prevCount < 26 ? 4 
                    : 5;
      
      if (prevId !== targetId) {
        handleSelectCheckpoint(targetId);
        const prevCheckpoint = CHECKPOINTS.find(c => c.id === prevId);
        const targetCheckpoint = CHECKPOINTS.find(c => c.id === targetId);
        if (prevCheckpoint && targetCheckpoint) {
          setPanningAlert(`AUTO-PANNING TELEMETRY: "${prevCheckpoint.tag}" ➔ "${targetCheckpoint.tag}"`);
          const timer = setTimeout(() => {
            setPanningAlert(null);
          }, 4500);
          return () => clearTimeout(timer);
        }
      }
    }
    setPrevCount(completedChallengesCount);
  }, [completedChallengesCount, prevCount, storyMapSelectedCheckpointId]);

  // Calculate current active checkpoint index (1-indexed)
  const currentCheckpointId = completedChallengesCount < 6 ? 1 
                        : completedChallengesCount < 14 ? 2 
                        : completedChallengesCount < 20 ? 3 
                        : completedChallengesCount < 26 ? 4 
                        : 5;

  const currentCheckpoint = CHECKPOINTS.find(c => c.id === currentCheckpointId) || CHECKPOINTS[0];
  const selectedCheckpoint = CHECKPOINTS.find(c => c.id === selectedCheckpointId) || CHECKPOINTS[0];

  // Camera-pan cinematic telemetry offsets (Slightly zoom to 1.35x and translate target point to center)
  const scale = 1.35;
  const focusX = selectedCheckpoint.coordX;
  const focusY = selectedCheckpoint.coordY;

  const rawTx = 50 - scale * focusX;
  const rawTy = 50 - scale * focusY;

  // Clamping translations to keep the 1.35x scaled board always contained beautifully without revealing empty borders
  const tx = Math.max((1 - scale) * 100, Math.min(0, rawTx));
  const ty = Math.max((1 - scale) * 100, Math.min(0, rawTy));

  // Determine actual challenges in the selected checkpoint's Act
  const actIndex = selectedCheckpointId;
  const checkpointChallenges = CANONICAL_CHALLENGES.filter(c => c.act === actIndex);

  // Stats
  const activeChallengesCompleted = checkpointChallenges.filter(ch => completedChallengesCount >= ch.id).length;
  const totalChallengesInAct = checkpointChallenges.length;
  const percentArchived = totalChallengesInAct > 0 
    ? Math.round((activeChallengesCompleted / totalChallengesInAct) * 100) 
    : 0;

  // Render drone or custom avatar for current position marker
  const getAvatarEmoji = () => {
    if (internAvatar?.includes('drone')) return '🛸';
    if (internAvatar?.includes('bot')) return '🤖';
    if (internAvatar?.includes('cat')) return '🐱';
    return '🏃';
  };

  return (
    <div className="bg-slate-900 border border-zinc-800 rounded-3xl p-5 md:p-6 text-left relative overflow-hidden shadow-xl space-y-6">
      {/* Absolute Decorative Grid Backdrops */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-black tracking-widest text-[#22d3ee] bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/30 inline-flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400 rotate-12 flex-shrink-0" />
            ISLAND ESCAPE GEOGRAPHICAL MAP
          </span>
          <h3 className="text-lg font-black font-display text-white tracking-tight flex items-center gap-2">
            Escape Journey Progress
            <span className="text-xs font-semibold text-zinc-400">({completedChallengesCount}/35 Decrypted)</span>
          </h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-xl">
            Live telemetry tracking of your psychological breakthroughs as you cross LANCE's quarantine island. Track nodes and click any checkpoint to reveal deep regional diagnostics.
          </p>
        </div>

        {/* Dynamic Global Status Panel */}
        <div className="self-start sm:self-center bg-[#090d16] border border-zinc-800 rounded-xl p-2.5 px-3.5 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-[10px] font-mono leading-tight">
            <span className="text-zinc-500 uppercase font-bold block">Current Location</span>
            <span className="text-white font-black truncate max-w-[150px] block">
              {currentCheckpoint.name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* 'Jungle Viewport' Container - Span 7 */}
        <div className="lg:col-span-7 bg-slate-950/45 border-2 border-teal-500/25 rounded-3xl overflow-hidden flex flex-col justify-between h-[360px] md:h-[390px] relative shadow-lg shadow-teal-950/20">
          
          {/* Viewport Top Bar Header / Telemetry HUD */}
          <div className="flex items-center justify-between border-b border-teal-500/15 bg-slate-950 px-4 py-2.5 text-[9.5px] font-mono font-black tracking-wider text-teal-400 select-none z-10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>LIVE JUNGLE VIEWPORT SCAN</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-teal-500/10 px-1.5 py-0.5 rounded text-[8.5px] border border-teal-500/20">
                ZOOM: {scale.toFixed(2)}x
              </span>
              <span className="text-zinc-600 font-light">|</span>
              <span className="text-[#22d3ee]">
                FOCUS: {selectedCheckpoint.tag.toUpperCase()} (CP-{selectedCheckpointId})
              </span>
            </div>
          </div>

          {/* Panoramic Camera-Pan Viewport Wrapper */}
          <div className="relative flex-1 overflow-hidden pointer-events-none">
            
            {/* Overlay Grid lines for Retro Tactical feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.02)_1px,transparent_1px)] bg-[size:12px_12px] z-5 pointer-events-none" />
            
            {/* Viewport tracking overlay indicators */}
            <div className="absolute inset-x-4 top-3.5 flex justify-between items-center text-[8px] font-mono font-extrabold text-zinc-500 tracking-wider z-10 select-none uppercase">
              <span>LAT: {(selectedCheckpoint.coordY * 1.15).toFixed(4)}° N</span>
              <span>LNG: {(selectedCheckpoint.coordX * 1.45).toFixed(4)}° W</span>
            </div>

            {/* Panning Transition Alert banner with motion */}
            <AnimatePresence>
              {panningAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="absolute top-10 inset-x-4 z-20 bg-teal-950/90 border border-teal-500/35 p-3 rounded-xl flex items-center justify-between shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                    <div className="text-left font-mono">
                      <span className="text-[10px] uppercase font-black text-white block">Camera Auto-Tracking Active</span>
                      <span className="text-[9px] text-[#22d3ee] font-black">{panningAlert}</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-black text-teal-400/80 border border-teal-500/20 px-2 py-0.5 rounded animate-pulse">
                    SEGMENT UNLOCKED
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Panable Map Slide Stage */}
            <motion.div 
              className="absolute inset-0 pointer-events-auto"
              style={{ transformOrigin: "0% 0%" }}
              animate={{ 
                transform: `translate(${tx}%, ${ty}%) scale(${scale})` 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 85, 
                damping: 22,
                mass: 1
              }}
            >
              {/* Island Contour & Elevation Water Rings (Underlay) */}
              <div className="absolute inset-x-8 inset-y-10 border border-dashed border-teal-500/5 rounded-[40%] pointer-events-none" />
              <div className="absolute inset-x-16 inset-y-20 border border-teal-500/5 rounded-[45%] pointer-events-none animate-pulse" />

              {/* Graphical Vector Trail Line SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '100%' }}>
                {/* Trail shadow backup line */}
                <path 
                  d="M 12 76 Q 25 70, 38 52 T 52 24 T 78 40 T 85 82"
                  fill="none"
                  stroke="#090d16"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Base Locked Trail */}
                <path 
                  d="M 12 76 Q 25 70, 38 52 T 52 24 T 78 40 T 85 82"
                  fill="none"
                  stroke="#1b253b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Partial Active Completed Path */}
                <motion.path 
                  d="M 12 76 Q 25 70, 38 52 T 52 24 T 78 40 T 85 82"
                  fill="none"
                  stroke="url(#completedPathGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  initial={{ strokeDashoffset: 400 }}
                  animate={{ 
                    strokeDashoffset: 400 - (400 * Math.min(1, completedChallengesCount / 35)) 
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="completedPathGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="25%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="75%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Interactive Checkpoint Markers */}
              <div className="absolute inset-0 pointer-events-auto">
                {CHECKPOINTS.map((cp) => {
                  const isCompleted = completedChallengesCount >= cp.milestoneRange[1];
                  const isActive = currentCheckpointId === cp.id;
                  const isSelected = selectedCheckpointId === cp.id;
                  const isLocked = completedChallengesCount < cp.milestoneRange[0];

                  return (
                    <div
                      key={cp.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group cursor-pointer"
                      style={{ left: `${cp.coordX}%`, top: `${cp.coordY}%` }}
                      onClick={() => handleSelectCheckpoint(cp.id)}
                    >
                      {/* Outer active pulse */}
                      {isActive && (
                        <span className="absolute -inset-2.5 rounded-full bg-cyan-400/20 border border-cyan-400/30 animate-ping" />
                      )}

                      {/* Marker Node */}
                      <motion.div
                        whileHover={{ scale: 1.25 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                          isSelected
                            ? cp.activeColor + " ring-4 ring-white/10 scale-110"
                            : isCompleted
                            ? "bg-slate-900 text-emerald-400 border-emerald-500/50 shadow-sm shadow-emerald-500/10"
                            : isActive
                            ? "bg-slate-900 text-teal-300 border-teal-500/80 animate-pulse"
                            : isLocked
                            ? "bg-[#05070c] text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50"
                            : "bg-slate-900 text-zinc-400 border-zinc-800"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-zinc-700" />
                        ) : (
                          <span className="font-mono">{cp.emoji}</span>
                        )}
                      </motion.div>

                      {/* Hover Floating Mini Badge Label */}
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 p-1.5 px-2 bg-slate-950 border border-zinc-850 rounded-lg text-[9px] font-bold text-white shadow-lg pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <div className="flex items-center gap-1">
                          <span>{cp.tag}</span>
                          <span className="text-[8px] font-mono opacity-60">({cp.actTitle.split(' - ')[0]})</span>
                        </div>
                      </div>

                      {/* Dynamic Companion Avatar Flag on current active segment */}
                      {isActive && (
                        <motion.div
                          animate={{ y: [-4, 1, -4] }}
                          transition={{ duration: 2.2, repeat: Infinity }}
                          className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                        >
                          <span className="text-[17px] drop-shadow-md select-none">{getAvatarEmoji()}</span>
                          <span className="text-[7.5px] font-black uppercase text-cyan-400 tracking-wider bg-slate-950 px-1 rounded border border-cyan-500/30 leading-none">
                            {internName}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Graphical Compass Overlay in Top-Left (Static viewport glass overlay) */}
          <div className="absolute top-14 left-3.5 opacity-25 pointer-events-none flex flex-col items-center z-10 select-none">
            <div className="border border-teal-500/20 rounded-full p-2 bg-[#05070d]/75 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-teal-400 rotate-45 animate-pulse" />
            </div>
          </div>

          {/* Viewport Bottom Info Footer */}
          <div className="p-3 bg-slate-950 border-t border-teal-500/10 z-10 flex flex-col sm:flex-row items-center justify-between text-[9.5px] text-zinc-400 font-mono gap-1 select-none">
            <span className="flex items-center gap-2 uppercase leading-none">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Decrypted</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Active</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-700" /> Encrypted</span>
            </span>
            <span className="text-teal-400/90 font-bold">Touch checkpoint nodes to pan camera focus</span>
          </div>
        </div>

        {/* Selected Checkpoint Detailed Diagnostic Card - Span 5 */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-950/60 to-slate-900/40 p-4.5 rounded-3xl border border-zinc-850 flex flex-col justify-between h-[360px] md:h-[390px] relative">
          
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Act & Position Header */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-widest text-[#22d3ee] uppercase font-black">
                {selectedCheckpoint.actTitle}
              </span>
              <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono uppercase font-black border ${
                completedChallengesCount >= selectedCheckpoint.milestoneRange[1]
                  ? "bg-emerald-950/40 border-emerald-500/25 text-emerald-400"
                  : completedChallengesCount >= selectedCheckpoint.milestoneRange[0]
                  ? "bg-teal-950/40 border-teal-550/25 text-teal-400 animate-pulse"
                  : "bg-slate-950/50 border-zinc-900 text-zinc-500"
              }`}>
                {completedChallengesCount >= selectedCheckpoint.milestoneRange[1] 
                  ? 'Decrypted Act' 
                  : completedChallengesCount >= selectedCheckpoint.milestoneRange[0] 
                  ? 'Currently Navigating' 
                  : 'Locked Node'}
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span className="text-lg">{selectedCheckpoint.emoji}</span>
                {selectedCheckpoint.name}
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1 flex-grow font-normal leading-relaxed">
                {selectedCheckpoint.description}
              </p>
            </div>

            {/* Geographical details list */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/50 p-3 rounded-xl border border-zinc-900">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-black block">Atmospheric Sensory</span>
                <span className="text-[10px] text-zinc-300 font-medium leading-normal block">
                  {selectedCheckpoint.environment}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono text-zinc-505 uppercase font-black block">Resilience Objective</span>
                <span className="text-[10px] text-teal-300 font-medium leading-normal block">
                  {selectedCheckpoint.therapeuticValue}
                </span>
              </div>
            </div>

            {/* Interactive Progress Indicator inside Drawer */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9.5px] font-mono">
                <span className="text-zinc-550 font-bold">Act Decryption Progress</span>
                <span className="text-zinc-300 font-black">{activeChallengesCompleted} / {totalChallengesInAct} Completed ({percentArchived}%)</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentArchived === 100 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : "bg-gradient-to-r from-teal-500 to-[#22d3ee]"
                  }`}
                  style={{ width: `${percentArchived}%` }}
                />
              </div>
            </div>

          </div>

          {/* Quick Context Action Button */}
          <div className="pt-3 border-t border-zinc-900">
            <div className="text-[9.5px] text-zinc-500 font-mono leading-tight flex justify-between items-center bg-[#090d16] p-2 rounded-lg border border-zinc-850">
              <span className="flex items-center gap-1">
                <Milestone className="w-3.5 h-3.5 text-yellow-500" /> Max Target Milestone:
              </span>
              <span className="font-bold text-zinc-300">Challenge {selectedCheckpoint.milestoneRange[1]}</span>
            </div>
          </div>

        </div>

      </div>

      {/* DYNAMIC REGIONAL GEOGRAPHICAL LEGEND & LORE */}
      <div className="border-t border-zinc-800/80 pt-5 mt-3 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h4 className="text-xs font-black font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-450 shrink-0 animate-pulse" />
              Dynamic Geographical Terrain Legend
            </h4>
            <p className="text-[10.5px] text-zinc-400 mt-0.5 leading-normal">
              Evolving sensory markers and tactical intelligence. Markers decode automatically as you decrypt high security regions.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[9px] font-mono uppercase bg-emerald-555/10 bg-emerald-950/40 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-md">
              Intel Status: {TERRAIN_LEGENDS.filter(l => completedChallengesCount >= l.reqCount).length} / {TERRAIN_LEGENDS.length} Regions Discovered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {TERRAIN_LEGENDS.map((legend) => {
            const isDiscovered = completedChallengesCount >= legend.reqCount;
            return (
              <div
                key={legend.id}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isDiscovered
                    ? "bg-[#090d16]/80 border-cyan-500/15 hover:border-cyan-500/30 shadow-xs scale-100"
                    : "bg-[#04060b]/40 border-zinc-900/40 opacity-45 select-none"
                }`}
              >
                {/* Visual Glow behind active discovered legends */}
                {isDiscovered && (
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl select-none" role="img" aria-label={legend.name}>
                      {isDiscovered ? legend.emoji : "🔒"}
                    </span>
                    <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded-md border font-black uppercase ${
                      isDiscovered
                        ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400"
                        : "bg-slate-950/65 border-zinc-900 text-zinc-500"
                    }`}>
                      {isDiscovered ? `ACT ${legend.id}` : "ENCRYPTED"}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-[11.5px] font-bold text-white tracking-tight truncate">
                      {isDiscovered ? legend.name : "Encrypted Corridor"}
                    </h5>
                    <p className="text-[8.5px] font-mono text-zinc-500 uppercase font-black leading-none mt-0.5">
                      {isDiscovered ? legend.type : `Locked till Challenge ${legend.reqCount}`}
                    </p>
                  </div>

                  {isDiscovered ? (
                    <div className="space-y-1.5 pt-1.5 border-t border-zinc-900/60 font-sans">
                      <p className="text-[10px] text-zinc-300 leading-relaxed font-light">
                        {legend.lore}
                      </p>
                      <div className="bg-[#05070c]/90 border border-zinc-850 p-2 rounded-lg space-y-0.5 leading-snug">
                        <span className="text-[8px] font-mono font-black text-[#22d3ee] uppercase tracking-wider block">
                          Tactical Intel
                        </span>
                        <span className="text-[9.5px] text-zinc-400 font-medium font-sans block leading-normal">
                          {legend.intel}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-900/20 text-[9.5px] text-zinc-600 leading-relaxed italic">
                      "Complete therapeutic milestone #{legend.reqCount} to decrypt surrounding weather patterns, regional sensory diagnostic files, and tactical escape telemetry."
                    </div>
                  )}
                </div>

                {isDiscovered && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-950 flex items-center justify-between text-[8px] font-mono text-zinc-500 uppercase">
                    <span>Threat: {legend.riskLevel.split(' - ')[0]}</span>
                    <span className="text-emerald-400 font-bold">● ONLINE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
