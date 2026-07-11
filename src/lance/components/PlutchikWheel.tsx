import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Heart, HelpCircle, Check, Sparkles } from 'lucide-react';

interface PlutchikEmotion {
  word: string;
  intensity: 'High' | 'Medium' | 'Low';
  meaning: string;
  color: string;
  hoverColor: string;
  textColor: string;
}

interface PlutchikPetal {
  id: string;
  title: string;
  accentColor: string;
  high: PlutchikEmotion;
  medium: PlutchikEmotion;
  low: PlutchikEmotion;
  angle: number; // center angle in degrees
}

interface PlutchikWheelProps {
  selectedWords: string[];
  onToggleWord: (word: string) => void;
  maxSelections?: number;
}

// 8 Primary Petals representing full spectrum Plutchik Framework
export const PLUTCHIK_PETALS: PlutchikPetal[] = [
  {
    id: 'joy',
    title: 'Joy',
    accentColor: '#eab308', // Amber/Yellow
    angle: 0,
    high: { word: 'Ecstasy', intensity: 'High', meaning: 'Intense delight, euphoric delight, and spiritual vitality.', color: '#eab308', hoverColor: '#ca8a04', textColor: '#1e293b' },
    medium: { word: 'Joy', intensity: 'Medium', meaning: 'Clean radiant happiness, inner delight, and connection.', color: '#facc15', hoverColor: '#eab308', textColor: '#1e293b' },
    low: { word: 'Serenity', intensity: 'Low', meaning: 'Calm inward peacefulness, tranquil harmony, and quiet satisfaction.', color: '#fef08a', hoverColor: '#fde047', textColor: '#1e293b' }
  },
  {
    id: 'trust',
    title: 'Trust',
    accentColor: '#84cc16', // Lime
    angle: 45,
    high: { word: 'Admiration', intensity: 'High', meaning: 'Deep secure respect, physical validation, and warm approval.', color: '#84cc16', hoverColor: '#65a30d', textColor: '#1e293b' },
    medium: { word: 'Trust', intensity: 'Medium', meaning: 'Secure bonding, vulnerability ease, and mutual safety.', color: '#a3e635', hoverColor: '#84cc16', textColor: '#1e293b' },
    low: { word: 'Acceptance', intensity: 'Low', meaning: 'Gentle receptive approval and open welcoming stance.', color: '#d9f99d', hoverColor: '#bef264', textColor: '#1e293b' }
  },
  {
    id: 'fear',
    title: 'Fear',
    accentColor: '#10b981', // Emerald
    angle: 90,
    high: { word: 'Terror', intensity: 'High', meaning: 'Sudden high alarm activation, autonomic hyper-vigilance, and threat surge.', color: '#10b981', hoverColor: '#059669', textColor: '#ffffff' },
    medium: { word: 'Fear', intensity: 'Medium', meaning: 'Apprehensive self-protection response or physical stress.', color: '#34d399', hoverColor: '#10b981', textColor: '#1e293b' },
    low: { word: 'Apprehension', intensity: 'Low', meaning: 'Slight localized unease, sensory awareness, and future concern.', color: '#a7f3d0', hoverColor: '#6ee7b7', textColor: '#1e293b' }
  },
  {
    id: 'surprise',
    title: 'Surprise',
    accentColor: '#06b6d4', // Cyan
    angle: 135,
    high: { word: 'Amazement', intensity: 'High', meaning: 'Unbelieving awestruck wonder, cognitive shock, and complete openness.', color: '#06b6d4', hoverColor: '#0891b2', textColor: '#ffffff' },
    medium: { word: 'Surprise', intensity: 'Medium', meaning: 'Sudden unexpected turn or brief change in stimulus vectors.', color: '#22d3ee', hoverColor: '#06b6d4', textColor: '#1e293b' },
    low: { word: 'Distraction', intensity: 'Low', meaning: 'Slightly scattered core focus or brief mental shift.', color: '#a5f3fc', hoverColor: '#67e8f9', textColor: '#1e293b' }
  },
  {
    id: 'sadness',
    title: 'Sadness',
    accentColor: '#3b82f6', // Blue
    angle: 180,
    high: { word: 'Grief', intensity: 'High', meaning: 'Dense inward sorrow, emotional heaviness, or profound sense of loss.', color: '#3b82f6', hoverColor: '#2563eb', textColor: '#ffffff' },
    medium: { word: 'Sadness', intensity: 'Medium', meaning: 'Quiet mournful state, physical softening, or needing gentle space.', color: '#60a5fa', hoverColor: '#3b82f6', textColor: '#ffffff' },
    low: { word: 'Pensiveness', intensity: 'Low', meaning: 'Melancholic reflection, warm nostalgic longing, or quiet thoughts.', color: '#bfdbfe', hoverColor: '#93c5fd', textColor: '#1e293b' }
  },
  {
    id: 'disgust',
    title: 'Disgust',
    accentColor: '#8b5cf6', // Violet
    angle: 225,
    high: { word: 'Loathing', intensity: 'High', meaning: 'Intense visceral aversion, heavy rejection, or strong mental blocks.', color: '#8b5cf6', hoverColor: '#7c3aed', textColor: '#ffffff' },
    medium: { word: 'Disgust', intensity: 'Medium', meaning: 'Active distaste, disapproval, or direct boundary protection.', color: '#a78bfa', hoverColor: '#8b5cf6', textColor: '#ffffff' },
    low: { word: 'Boredom', intensity: 'Low', meaning: 'Flat uninspired listlessness, routine stagnation, or lack of stimulus.', color: '#ddd6fe', hoverColor: '#c084fc', textColor: '#1e293b' }
  },
  {
    id: 'anger',
    title: 'Anger',
    accentColor: '#ef4444', // Red
    angle: 270,
    high: { word: 'Rage', intensity: 'High', meaning: 'Adrenaline heated surge of boundaries, intense focus, and core fury.', color: '#ef4444', hoverColor: '#dc2626', textColor: '#ffffff' },
    medium: { word: 'Anger', intensity: 'Medium', meaning: 'Heated boundary signal, active irritation, or urge to push back.', color: '#f87171', hoverColor: '#ef4444', textColor: '#ffffff' },
    low: { word: 'Annoyance', intensity: 'Low', meaning: 'Vexed posture, slight impatience, or surface physical friction.', color: '#fca5a5', hoverColor: '#f87171', textColor: '#1e293b' }
  },
  {
    id: 'anticipation',
    title: 'Anticipation',
    accentColor: '#f97316', // Orange
    angle: 315,
    high: { word: 'Vigilance', intensity: 'High', meaning: 'Active hyper-alert readiness, tracking detail patterns, and intense focus.', color: '#f97316', hoverColor: '#ea580c', textColor: '#ffffff' },
    medium: { word: 'Anticipation', intensity: 'Medium', meaning: 'Eager planning forward, future looking thoughts, and ready stance.', color: '#fb923c', hoverColor: '#f97316', textColor: '#1e293b' },
    low: { word: 'Interest', intensity: 'Low', meaning: 'Healthy mental curiosity, light mental lean-in, and exploration.', color: '#fed7aa', hoverColor: '#fdba74', textColor: '#1e293b' }
  }
];

// Helper to compute SVG sector path arcs mathematically
function getArcPath(
  cx: number, cy: number,
  rIn: number, rOut: number,
  startAngleDeg: number, endAngleDeg: number
): string {
  const toRad = Math.PI / 180;
  // Subtract 90 degrees to align 0 degrees to the absolute vertical top center point
  const sAngle = (startAngleDeg - 90) * toRad;
  const eAngle = (endAngleDeg - 90) * toRad;
  
  const x1_in = cx + rIn * Math.cos(sAngle);
  const y1_in = cy + rIn * Math.sin(sAngle);
  const x2_in = cx + rIn * Math.cos(eAngle);
  const y2_in = cy + rIn * Math.sin(eAngle);
  
  const x1_out = cx + rOut * Math.cos(sAngle);
  const y1_out = cy + rOut * Math.sin(sAngle);
  const x2_out = cx + rOut * Math.cos(eAngle);
  const y2_out = cy + rOut * Math.sin(eAngle);
  
  // Outer arc clockwise, straight line edge, inner arc counter-clockwise, close path
  return `
    M ${x1_out} ${y1_out}
    A ${rOut} ${rOut} 0 0 1 ${x2_out} ${y2_out}
    L ${x2_in} ${y2_in}
    A ${rIn} ${rIn} 0 0 0 ${x1_in} ${y1_in}
    Z
  `.trim();
}

export default function PlutchikWheel({
  selectedWords,
  onToggleWord,
  maxSelections = 5
}: PlutchikWheelProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<PlutchikEmotion | null>(null);
  
  const cx = 200;
  const cy = 200;
  
  // concentric ring radii definitions
  const rHigh_In = 35;
  const rHigh_Out = 85;
  
  const rMedium_In = 85;
  const rMedium_Out = 135;
  
  const rLow_In = 135;
  const rLow_Out = 185;

  // Flattened emotions list for quick lookups
  const allEmotionsMap = useMemo(() => {
    const map: Record<string, PlutchikEmotion> = {};
    PLUTCHIK_PETALS.forEach(p => {
      map[p.high.word] = p.high;
      map[p.medium.word] = p.medium;
      map[p.low.word] = p.low;
    });
    return map;
  }, []);

  // Compute Active Plutchik Psychological Dyads based on Selected Words
  const activeDyads = useMemo(() => {
    const activeSectors = new Set<string>();
    PLUTCHIK_PETALS.forEach(p => {
      if (selectedWords.includes(p.high.word) || selectedWords.includes(p.medium.word) || selectedWords.includes(p.low.word)) {
        activeSectors.add(p.id);
      }
    });

    const dyads: Array<{ title: string; components: string[]; description: string; emoji: string }> = [];

    const checkDyad = (sec1: string, sec2: string, title: string, description: string, emoji: string) => {
      if (activeSectors.has(sec1) && activeSectors.has(sec2)) {
        dyads.push({
          title,
          components: [
            PLUTCHIK_PETALS.find(p => p.id === sec1)?.medium.word || '',
            PLUTCHIK_PETALS.find(p => p.id === sec2)?.medium.word || ''
          ],
          description,
          emoji
        });
      }
    };

    // Primary Dyads (adjacent petals)
    checkDyad('joy', 'trust', 'Love', 'A beautiful state of deep appreciation, mutual embrace, and warmth.', '💖');
    checkDyad('trust', 'fear', 'Submission', 'Accepting conditions and preparing pathways inside relational systems.', '🛡️');
    checkDyad('fear', 'surprise', 'Awe', 'Overwhelmed by mystery, unexpected news, or incredible events.', '✨');
    checkDyad('surprise', 'sadness', 'Disapproval', 'Shattered expectations or a sudden difficult realization.', '🌧️');
    checkDyad('sadness', 'disgust', 'Remorse', 'Reflective guilt, melancholy of past actions, or quiet regrets.', '💭');
    checkDyad('disgust', 'anger', 'Contempt', 'Visible frustration when personal standards or boundaries feel violated.', '⚡');
    checkDyad('anger', 'anticipation', 'Aggressiveness', 'Intense readiness to confront obstacles or assert goals.', '🎯');
    checkDyad('anticipation', 'joy', 'Optimism', 'Excited expectation of wonderful outcomes and clean confidence.', '🌅');

    return dyads;
  }, [selectedWords]);

  const activeFocus = hoveredEmotion || (selectedWords.length > 0 ? allEmotionsMap[selectedWords[selectedWords.length - 1]] : null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-stretch w-full max-w-4xl mx-auto">
      
      {/* LEFT: Complete Circular SVG Interaction Area */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center relative select-none w-full max-w-[440px] aspect-square shrink-0">
        
        {/* Core SVG */}
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full overflow-visible drop-shadow-md"
        >
          {/* Subtle Grid backing ring markers */}
          <circle cx={cx} cy={cy} r={rLow_Out} fill="none" stroke="#f1f5f9" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={rMedium_Out} fill="none" stroke="#f1f5f9" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={rHigh_Out} fill="none" stroke="#f1f5f9" strokeWidth={1} />

          {/* Render Petals Loops */}
          {PLUTCHIK_PETALS.map((petal, pIdx) => {
            const startAngle = petal.angle - 22.5;
            const endAngle = petal.angle + 22.5;

            // Generate levels of emotion slices
            const levels = [
              { emotion: petal.low, rIn: rMedium_Out, rOut: rLow_Out, label: 'Low' },
              { emotion: petal.medium, rIn: rHigh_Out, rOut: rMedium_Out, label: 'Medium' },
              { emotion: petal.high, rIn: rHigh_In, rOut: rHigh_Out, label: 'High' }
            ];

            // Radial label orientation: right/top half reads outward, left/bottom
            // half is flipped 180° so no word ever renders upside down.
            const labelRot = petal.angle >= 180 ? petal.angle + 90 : petal.angle - 90;

            return (
              <motion.g
                key={petal.id}
                id={`petal-group-${petal.id}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: pIdx * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '200px 200px', transformBox: 'view-box' }}
              >
                {levels.map((level, lIdx) => {
                  const isSelected = selectedWords.includes(level.emotion.word);
                  const isHovered = hoveredEmotion?.word === level.emotion.word;
                  const dPath = getArcPath(cx, cy, level.rIn, level.rOut, startAngle, endAngle);

                  return (
                    <path
                      key={lIdx}
                      d={dPath}
                      fill={isHovered ? level.emotion.hoverColor : level.emotion.color}
                      stroke={isSelected ? '#1e293b' : '#ffffff'}
                      strokeWidth={isSelected ? 2.5 : 0.8}
                      className="transition-all duration-200 cursor-pointer"
                      onClick={() => onToggleWord(level.emotion.word)}
                      onMouseEnter={() => setHoveredEmotion(level.emotion)}
                      onMouseLeave={() => setHoveredEmotion(null)}
                      style={{
                        transformOrigin: `${cx}px ${cy}px`,
                        // Selected slices "explode" slightly outward from the hub for a tactile pop
                        transform: isSelected ? 'scale(1.045)' : 'scale(1)',
                        filter: isSelected ? `drop-shadow(0 0 6px ${petal.accentColor}99)` : 'none',
                        opacity: selectedWords.length > 0 && !isSelected ? 0.75 : 1
                      }}
                    />
                  );
                })}

                {/* Word labels on every slice — tappable-blind wedges were unusable on mobile */}
                {levels.map((level, lIdx) => {
                  const isSelected = selectedWords.includes(level.emotion.word);
                  const rMid = (level.rIn + level.rOut) / 2;
                  const rad = ((petal.angle - 90) * Math.PI) / 180;
                  const lx = cx + rMid * Math.cos(rad);
                  const ly = cy + rMid * Math.sin(rad);
                  return (
                    <text
                      key={`label-${lIdx}`}
                      x={lx}
                      y={ly}
                      transform={`rotate(${labelRot}, ${lx}, ${ly})${isSelected ? ` translate(0,0)` : ''}`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: level.emotion.word.length > 10 ? 7 : 8.5,
                        fontWeight: 800,
                        fill: level.emotion.textColor,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {level.emotion.word}
                    </text>
                  );
                })}
              </motion.g>
            );
          })}

          {/* Central Origin Circle — glows toward whatever is currently focused, so the
              hub feels alive/responsive rather than a static plain-white disc */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={rHigh_In}
            fill="#ffffff"
            stroke={activeFocus ? activeFocus.color : '#cbd5e1'}
            strokeWidth={activeFocus ? 2.5 : 1}
            animate={{ scale: selectedWords.length > 0 ? [1, 1.03, 1] : 1 }}
            transition={{ duration: 1.6, repeat: selectedWords.length > 0 ? Infinity : 0, ease: 'easeInOut' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
          {selectedWords.length > 0 ? (
            <>
              <text x={cx} y={cy - 6} textAnchor="middle" className="text-[22px] font-black fill-current select-none" style={{ fill: '#1e293b' }}>
                {selectedWords.length}
              </text>
              <text x={cx} y={cy + 12} textAnchor="middle" className="text-[7.5px] font-black tracking-widest fill-current select-none" style={{ fill: '#94a3b8' }}>
                SELECTED
              </text>
            </>
          ) : (
            <text
              x={cx}
              y={cy + 3}
              textAnchor="middle"
              className="text-[9px] font-black tracking-widest text-slate-400 font-mono pointer-events-none fill-current select-none"
            >
              COGNITIVE
            </text>
          )}
        </svg>

        {/* Floating guidance overlay */}
        <div className="absolute top-3 right-3 text-[8.5px] font-extrabold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 pointer-events-none flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-500" />
          <span>Tap slices to lock feelings</span>
        </div>
      </div>

      {/* RIGHT: Selected Details & Cognitive Dyads Insight (Adaptive Panel) */}
      <div className="flex-1 bg-gradient-to-br from-[#fafcff] to-[#f4f8fd] border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4 text-left flex flex-col justify-between min-w-[280px]">
        
        {/* Dynamic Definition Card */}
        <div className="space-y-3 flex-1">
          <div className="space-y-0.5">
            <span className="text-[8.5px] font-black tracking-widest text-[#3d627f] uppercase font-mono block">
              📊 Plutchik Precision Guide
            </span>
            <h4 className="text-sm font-black text-slate-800 tracking-tight">
              Interactive Emotion Breakdown
            </h4>
          </div>

          <AnimatePresence mode="wait">
            {activeFocus ? (
              <motion.div
                key={activeFocus.word}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-white border border-slate-100 rounded-2xl shadow-3xs space-y-2.5 relative overflow-hidden"
              >
                {/* Visual Accent bar depending on exact selected emotion color */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: activeFocus.color }}
                />
                
                <div className="pl-2.5 space-y-1.5 text-left">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-base font-extrabold text-slate-800">{activeFocus.word}</span>
                    <span 
                      style={{ backgroundColor: `${activeFocus.color}25`, color: activeFocus.hoverColor }}
                      className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider font-mono"
                    >
                      Intensity: {activeFocus.intensity}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 leading-normal">
                    {activeFocus.meaning}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="p-5 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 space-y-1 py-10">
                <Heart className="w-6 h-6 text-slate-300 mx-auto animate-pulse" />
                <p className="text-xs font-bold">Select emotion slices</p>
                <p className="text-[9.5px] leading-snug">Hover or tap any sector of Plutchik's Wheel to analyze its psychological intensity and definitions.</p>
              </div>
            )}
          </AnimatePresence>

          {/* Current Selection Badges Display */}
          {selectedWords.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Selected ({selectedWords.length}/{maxSelections})</span>
              <div className="flex flex-wrap gap-1">
                {selectedWords.map(word => {
                  const emo = allEmotionsMap[word];
                  return (
                    <span 
                      key={word}
                      onClick={() => onToggleWord(word)}
                      style={{ backgroundColor: emo ? `${emo.color}18` : '#f1f5f9', color: emo ? emo.hoverColor : '#1e293b' }}
                      className="px-2 py-1 rounded-xl text-[10px] font-black border border-transparent hover:border-slate-300 transition cursor-pointer flex items-center gap-1 select-none animate-fade-in"
                    >
                      <span>{word}</span>
                      <XIcon className="w-2.5 h-2.5 shrink-0 hover:opacity-85" />
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Blends / Psychological Dyads — the wheel's unique reward moment:
              finding a hidden emotional blend by combining two adjacent slices */}
          <AnimatePresence>
            {activeDyads.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2.5 border-t border-slate-200/50 overflow-hidden"
              >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  </motion.span>
                  <span>Computed Complex Blends ({activeDyads.length})</span>
                </span>

                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {activeDyads.map((dyad) => (
                      <motion.div
                        key={dyad.title}
                        initial={{ opacity: 0, scale: 0.9, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="p-3 bg-gradient-to-br from-amber-50 to-white border border-amber-200/60 rounded-2xl flex gap-2.5 items-start text-xs font-semibold shadow-sm"
                      >
                        <span className="text-xl shrink-0 p-1 bg-white border border-amber-100 rounded-lg">{dyad.emoji}</span>
                        <div className="space-y-0.5 text-left flex-1 min-w-0">
                          <h5 className="font-extrabold text-[#3d627f] flex items-center gap-1.5 leading-none">
                            <span>{dyad.title}</span>
                            <span className="text-[8px] uppercase font-bold text-slate-400">({dyad.components.join(' + ')})</span>
                          </h5>
                          <p className="text-[10px] text-slate-500 leading-snug font-medium pr-1">
                            {dyad.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Medical Tip */}
        <div className="bg-[#3d627f]/5 border border-[#3d627f]/10 p-3 rounded-2xl flex items-start gap-2 pt-3 mt-3">
          <Info className="w-3.5 h-3.5 text-[#3d627f] shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
            By mapping complex emotions to Plutchik's Wheel, you engage the **prefrontal cortex** in verbal labeling. This down-regulates immediate emotional amygdala storms, helping you gain adaptive stability.
          </p>
        </div>

      </div>

    </div>
  );
}

// Inline minimal SVG X Icon
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={3} 
      stroke="currentColor" 
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
