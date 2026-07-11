import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { 
  Sparkles, Zap, Brain, Flame, Plus, Trash2, ArrowRight, Activity, 
  HelpCircle, RefreshCw, ZoomIn, ZoomOut, Check, Info, ShieldAlert, Heart, Compass
} from 'lucide-react';

// Interfaces for our hierarchy structures
interface HabitStack {
  id: string;
  triggerHabit: string;
  targetHabit: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  streak: number;
  completedToday: boolean;
  notes?: string;
  strength?: number; // Calculated dynamic strength 0-100
}

interface TreeNode {
  id: string;
  name: string;
  type: 'root' | 'anchor' | 'routine';
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  streak?: number;
  completedToday?: boolean;
  notes?: string;
  strength?: number;
  parentName?: string;
  children?: TreeNode[];
}

// Preset Clinical Recommendation Pathways for grafting
const CLINICAL_PRESETS = [
  {
    id: 'preset-adhd',
    triggerHabit: 'open my morning web browser',
    targetHabit: 'do a 3-minute mental brain-dump on paper',
    timeOfDay: 'morning' as const,
    streak: 0,
    completedToday: false,
    notes: 'Neuro-tip: Keep notepad on top of the keyboard before bed.',
    strength: 45
  },
  {
    id: 'preset-vagal',
    triggerHabit: 'sit down to eat my lunch',
    targetHabit: 'release jaw muscles & take 3 slow double-sighs',
    timeOfDay: 'afternoon' as const,
    streak: 0,
    completedToday: false,
    notes: 'Neuro-tip: Stimulates solar-plexus vagus nerve nodes during food digestion.',
    strength: 35
  },
  {
    id: 'preset-circadian',
    triggerHabit: 'step outside to check the mailbox',
    targetHabit: 'look towards the soft blue sky light for 3 minutes',
    timeOfDay: 'afternoon' as const,
    streak: 0,
    completedToday: false,
    notes: 'Neuro-tip: Pins central circadian suprachiasmatic clock for sleep quality.',
    strength: 55
  },
  {
    id: 'preset-somatic',
    triggerHabit: 'hear a work chat or phone alert buzz',
    targetHabit: 'check shoulder height and drop them 1 inch deliberately',
    timeOfDay: 'afternoon' as const,
    streak: 0,
    completedToday: false,
    notes: 'Neuro-tip: De-shields muscle bracing alerts before amygdala ramps up.',
    strength: 40
  },
  {
    id: 'preset-winddown',
    triggerHabit: 'plug in my phone to charge at night',
    targetHabit: 'do 2 minutes of paced 4-7-8 breathing relaxation',
    timeOfDay: 'evening' as const,
    streak: 0,
    completedToday: false,
    notes: 'Neuro-tip: Coaxes motor response centers to transition from alert to sleep gates.',
    strength: 50
  },
];

export default function AnchorVisualization() {
  // 1. Core State
  const [habitStacks, setHabitStacks] = useState<HabitStack[]>(() => {
    const saved = localStorage.getItem('therapy_habit_lab_stacks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify they have strength state, otherwise supply a default based on streak
          return parsed.map((item: any) => ({
            ...item,
            strength: item.strength !== undefined ? item.strength : Math.min(100, 30 + (item.streak || 0) * 8 + (item.completedToday ? 15 : 0))
          }));
        }
      } catch (err) {
        console.warn("Failed parsing state, reverting to presets.", err);
      }
    }
    // Default starting stacks if localstorage is empty
    const defaults: HabitStack[] = [
      {
        id: 'stack-1',
        triggerHabit: 'pour my morning tea',
        targetHabit: 'sit peacefully and write down 1 gratitude entry',
        timeOfDay: 'morning',
        streak: 5,
        completedToday: true,
        notes: 'Keep journal right next to the kettle as a visual cue.',
        strength: 78
      },
      {
        id: 'stack-2',
        triggerHabit: 'close my laptop after work',
        targetHabit: 'stretch my neck and take 3 deep somatic breaths',
        timeOfDay: 'afternoon',
        streak: 3,
        completedToday: false,
        notes: 'Friction reduction: Stand up immediately.',
        strength: 52
      }
    ];
    localStorage.setItem('therapy_habit_lab_stacks', JSON.stringify(defaults));
    return defaults;
  });

  // Editor states
  const [newTrigger, setNewTrigger] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newTime, setNewTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newNotes, setNewNotes] = useState('');
  
  // Selected inspect node track
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Zoom tracker index values
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const startDragRef = useRef({ x: 0, y: 0 });

  // Mental Rehearsal Live Trainer Sub-Workspace
  const [rehearsalActive, setRehearsalActive] = useState(false);
  const [rehearsalBreathPhase, setRehearsalBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale' | 'complete'>('idle');
  const [rehearsalCounter, setRehearsalCounter] = useState(0);

  // Synchronize stacks with localstorage
  const saveStacks = (updated: HabitStack[]) => {
    setHabitStacks(updated);
    localStorage.setItem('therapy_habit_lab_stacks', JSON.stringify(updated));
  };

  // Convert flat HabitStack list into hierarchical Tree representation for D3
  const d3HierarchyData = useMemo(() => {
    // Top Root
    const root: TreeNode = {
      id: 'root-cns',
      name: 'Central Autonomous Loop',
      type: 'root',
      strength: 100,
      children: []
    };

    // Group items by Trigger Anchor
    const triggerGroups: Record<string, HabitStack[]> = {};
    habitStacks.forEach(h => {
      const trigger = h.triggerHabit.trim().toLowerCase();
      if (!triggerGroups[trigger]) {
        triggerGroups[trigger] = [];
      }
      triggerGroups[trigger].push(h);
    });

    // Build trigger anchors as first-level branches
    Object.entries(triggerGroups).forEach(([triggerName, stacks], idx) => {
      const anchorNodeId = `anchor-${idx}`;
      
      // Compute cumulative average strength of all stacked children components
      const totalStrength = stacks.reduce((sum, s) => sum + (s.strength || 40), 0);
      const avgStrength = Math.round(totalStrength / stacks.length);

      const anchorNode: TreeNode = {
        id: anchorNodeId,
        name: `After I: "${triggerName}"`,
        type: 'anchor',
        strength: avgStrength,
        children: []
      };

      // Add routines linked under this trigger anchor
      stacks.forEach(s => {
        const routineNode: TreeNode = {
          id: s.id,
          name: `I will: "${s.targetHabit}"`,
          type: 'routine',
          timeOfDay: s.timeOfDay,
          streak: s.streak,
          completedToday: s.completedToday,
          notes: s.notes,
          strength: s.strength || 40,
          parentName: triggerName
        };
        anchorNode.children!.push(routineNode);
      });

      root.children!.push(anchorNode);
    });

    return root;
  }, [habitStacks]);

  // SVG Dimension Constants
  const width = 640;
  const height = 360;

  // Run the D3 tree calculations using React as the renderer
  const { d3Nodes, d3Links } = useMemo(() => {
    const root = d3.hierarchy(d3HierarchyData);
    
    // Create tree layout generator
    // Horizontal space is width-wise, vertical spacing separates sibling branches
    const treeLayout = d3.tree<any>()
      .size([height - 60, width - 200]); // leave margins page edges

    const treeData = treeLayout(root);
    
    const d3Nodes = treeData.descendants().map(d => {
      // Offset layout coordinates to center within SVG view frame
      return {
        ...d,
        x: d.y + 70, // Swap axes for horizontal orientation
        y: d.x + 30,
        data: d.data as TreeNode
      };
    });

    const d3Links = treeData.links().map(l => {
      return {
        source: { x: l.source.y + 70, y: l.source.x + 30, data: l.source.data as TreeNode },
        target: { x: l.target.y + 70, y: l.target.x + 30, data: l.target.data as TreeNode }
      };
    });

    return { d3Nodes, d3Links };
  }, [d3HierarchyData, width, height]);

  // Drag pan handler calculations — pointer events cover mouse, touch AND pen,
  // so panning works on phones/tablets (mouse-only handlers did not).
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startDragRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const nextX = e.clientX - startDragRef.current.x;
    const nextY = e.clientY - startDragRef.current.y;
    setPanOffset({ x: nextX, y: nextY });
  };

  const handlePointerUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Add customized anchor link connection
  const handleRegisterLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newTarget.trim()) return;

    const newStack: HabitStack = {
      id: `stack-${Date.now()}`,
      triggerHabit: newTrigger.trim(),
      targetHabit: newTarget.trim(),
      timeOfDay: newTime,
      streak: 0,
      completedToday: false,
      notes: newNotes.trim() || undefined,
      strength: 35 // Initial synaptic strength default
    };

    const next = [newStack, ...habitStacks];
    saveStacks(next);

    setNewTrigger('');
    setNewTarget('');
    setNewNotes('');
  };

  // Graft clinical recommendation directly onto active tree
  const handleGraftPreset = (preset: typeof CLINICAL_PRESETS[0]) => {
    // Check if duplicate already exists
    if (habitStacks.some(h => h.targetHabit.toLowerCase() === preset.targetHabit.toLowerCase())) {
      return;
    }

    const grafted: HabitStack = {
      id: `stack-${Date.now()}`,
      triggerHabit: preset.triggerHabit,
      targetHabit: preset.targetHabit,
      timeOfDay: preset.timeOfDay,
      streak: 1,
      completedToday: false,
      notes: preset.notes,
      strength: preset.strength
    };

    const next = [grafted, ...habitStacks];
    saveStacks(next);
  };

  // Delete specific connection
  const handleDeleteNode = (id: string) => {
    const next = habitStacks.filter(h => h.id !== id);
    saveStacks(next);
    setSelectedNode(null);
  };

  // Rehearsal sequence effects
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rehearsalActive) {
      if (rehearsalBreathPhase === 'inhale') {
        timer = setTimeout(() => {
          setRehearsalBreathPhase('hold');
          setRehearsalCounter(4);
        }, 4000);
      } else if (rehearsalBreathPhase === 'hold') {
        if (rehearsalCounter > 0) {
          timer = setTimeout(() => setRehearsalCounter(prev => prev - 1), 1000);
        } else {
          setRehearsalBreathPhase('exhale');
        }
      } else if (rehearsalBreathPhase === 'exhale') {
        timer = setTimeout(() => {
          setRehearsalBreathPhase('complete');
        }, 4000);
      }
    }
    return () => clearTimeout(timer);
  }, [rehearsalActive, rehearsalBreathPhase, rehearsalCounter]);

  const triggerRehearsalAction = () => {
    setRehearsalActive(true);
    setRehearsalBreathPhase('inhale');
    setRehearsalCounter(4);
  };

  const finishRehearsalAndBoostStrength = () => {
    if (!selectedNode || selectedNode.type !== 'routine') return;
    
    // Boost current habit stack strength representation
    const updated = habitStacks.map(h => {
      if (h.id === selectedNode.id) {
        const nextStrength = Math.min(100, (h.strength || 35) + 12);
        const nextStreak = h.streak + 1;
        
        // Sync selected inspection detail too
        setSelectedNode(prev => prev ? {
          ...prev,
          strength: nextStrength,
          streak: nextStreak,
          completedToday: true
        } : null);

        return {
          ...h,
          strength: nextStrength,
          streak: nextStreak,
          completedToday: true
        };
      }
      return h;
    });

    saveStacks(updated);
    setRehearsalActive(false);
    setRehearsalBreathPhase('idle');
  };

  // Helper colors configuration based on strength/type
  const getStrengthMeta = (strength: number = 40) => {
    if (strength >= 75) {
      return { 
        stroke: '#10b981', // emerald
        glow: 'rgba(16, 185, 129, 0.45)', 
        speed: '0.4s', 
        name: 'Highly Myelinated (Super Highway)', 
        accent: 'text-emerald-500 bg-emerald-50/70 border-emerald-200' 
      };
    }
    if (strength >= 45) {
      return { 
        stroke: '#f59e0b', // amber
        glow: 'rgba(245, 158, 11, 0.35)', 
        speed: '0.9s', 
        name: 'Medium Association (Evolving Route)', 
        accent: 'text-amber-500 bg-amber-50/70 border-amber-200' 
      };
    }
    return { 
      stroke: '#ec4899', // pink/rose weak signal
      glow: 'rgba(236, 72, 153, 0.2)', 
      speed: '1.8s', 
      name: 'Weak Association (Sprouting Synapse)', 
      accent: 'text-pink-500 bg-pink-50/70 border-pink-200' 
    };
  };

  const zoomIn = () => setZoomScale(prev => Math.min(1.8, prev + 0.15));
  const zoomOut = () => setZoomScale(prev => Math.max(0.6, prev - 0.15));
  const resetZoom = () => {
    setZoomScale(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      {/* 🧠 Main Visualization Column (Left 8 Units) */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Intro Card */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 border border-white/[0.08] shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="text-[9px] bg-sky-500/30 text-sky-300 font-bold tracking-widest uppercase block border border-sky-500/20 px-2 py-0.5 rounded-full w-fit leading-none mb-1">
              D3 SYNAPSE SIMULATION 🧬
            </span>
            <h3 className="font-sans text-base font-bold flex items-center gap-1.5">
              <span>Anchor Tree Mapping (CNS Engine)</span>
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-xl">
              Physical habits build permanent physical pathways in your brain through a process called <strong>Myelination</strong>. This map displays the relative electrical strength and stability of your daily anchor-to-routine synaptic loops.
            </p>
          </div>
          <div className="absolute top-4 right-4 text-sky-500/10 pointer-events-none select-none">
            <Activity className="w-24 h-24 stroke-[1]" />
          </div>
        </div>

        {/* The D3 Interactive Canvas Wrapper */}
        <div className="relative bg-slate-950 rounded-3xl border border-slate-800/80 shadow-inner overflow-hidden h-[395px] select-none group">
          
          {/* Canvas Controls overlay */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 p-1.5 rounded-xl text-white">
            <button
              onClick={zoomIn}
              className="p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 text-slate-300" />
            </button>
            <button
              onClick={zoomOut}
              className="p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 text-slate-300" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1 hover:bg-slate-800 rounded text-[9px] font-mono font-bold text-slate-400 transition cursor-pointer"
              title="Reset View"
            >
              RESET
            </button>
          </div>

          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-[9px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
            <span>LIVE RESIDUAL STABILITY PORT</span>
          </div>

          {/* D3 Graphical Interactive SVG Stage */}
          <svg
            id="d3-neurotree-svg"
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrLeave}
            onPointerCancel={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
          >
            {/* Background Grid Accent */}
            <defs>
              <pattern id="neuro-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="0.75" fill="rgba(71, 85, 105, 0.45)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neuro-grid)" />

            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomScale})`}>
              
              {/* Render Synaptic Action Potential Connection Pathways (Links) */}
              {d3Links.map((link, lIdx) => {
                const targetNode = link.target.data;
                const meta = getStrengthMeta(targetNode.strength);
                
                // SVG Diagonal Generator math: smooth horizontal bezier curved paths
                const sourceX = link.source.x;
                const sourceY = link.source.y;
                const targetX = link.target.x;
                const targetY = link.target.y;
                const pathString = d3.linkHorizontal<any, any>()({
                  source: [sourceX, sourceY],
                  target: [targetX, targetY]
                });

                return (
                  <g key={`link-${lIdx}`}>
                    {/* Underlying thick structural blur glow */}
                    <path
                      d={pathString || ''}
                      fill="none"
                      stroke={meta.stroke}
                      strokeWidth={targetNode.strength ? Math.max(1, (targetNode.strength / 14)) : 22}
                      strokeOpacity="0.15"
                      style={{ filter: 'blur(3px)' }}
                    />
                    
                    {/* Primary visible nerve dendrite core path */}
                    <path
                      d={pathString || ''}
                      fill="none"
                      stroke={meta.stroke}
                      strokeWidth={targetNode.strength ? Math.max(1, (targetNode.strength / 22)) : 1.5}
                      strokeOpacity="0.7"
                      strokeDasharray={targetNode.strength && targetNode.strength < 35 ? '3, 4' : undefined}
                    />

                    {/* Firing action potential particle moving along the path lines */}
                    {targetNode.strength && targetNode.strength >= 25 && (
                      <circle r="2.8" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #fff)' }}>
                        <animateMotion
                          dur={meta.speed}
                          repeatCount="indefinite"
                          path={pathString || ''}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Render Neural Centroid Nodes */}
              {d3Nodes.map((node, nIdx) => {
                const nd = node.data;
                const isSelected = selectedNode?.id === nd.id;
                
                // Styling configs based on type
                let nodeRadius = 14;
                let strokeColor = '#38bdf8'; // blue CNS root
                let fillColor = '#0f172a';
                let iconLabel = '🧠';

                if (nd.type === 'anchor') {
                  nodeRadius = 11;
                  strokeColor = '#6366f1'; // indigo anchor
                  fillColor = '#1e1b4b';
                  iconLabel = '🔗';
                } else if (nd.type === 'routine') {
                  nodeRadius = 9;
                  const meta = getStrengthMeta(nd.strength);
                  strokeColor = meta.stroke;
                  fillColor = '#0f172a';
                  iconLabel = nd.timeOfDay === 'morning' ? '🌅' : nd.timeOfDay === 'afternoon' ? '☀️' : '🌙';
                }

                return (
                  <g
                    key={`node-${nIdx}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(nd);
                    }}
                  >
                    {/* Outer hover pulse ring */}
                    <circle
                      r={nodeRadius + 6}
                      fill="transparent"
                      stroke={isSelected ? strokeColor : 'transparent'}
                      strokeWidth="2"
                      strokeDasharray="3, 3"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />

                    {/* Base Node Circle with custom border indicator coloring */}
                    <circle
                      r={nodeRadius}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3.5 : 2}
                      style={{
                        filter: isSelected ? `drop-shadow(0 0 8px ${strokeColor})` : 'none',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />

                    {/* Emoji overlay icon inside node */}
                    <text
                      y="3.5"
                      fontSize="9"
                      textAnchor="middle"
                      style={{ userSelect: 'none' }}
                    >
                      {iconLabel}
                    </text>

                    {/* Node Text Label Block */}
                    <g transform={`translate(0, ${nodeRadius + 14})`}>
                      {/* Background label pill to prevent overlap readability issues */}
                      <rect
                        x={-55}
                        y={-8}
                        width={110}
                        height={16}
                        rx={5}
                        fill="rgba(15, 23, 42, 0.85)"
                        stroke="rgba(51, 65, 85, 0.3)"
                        strokeWidth="0.5"
                      />
                      <text
                        fill={isSelected ? '#f8fafc' : '#94a3b8'}
                        fontSize="8"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fontFamily="var(--font-sans, sans-serif)"
                        textAnchor="middle"
                      >
                        {nd.name.length > 18 ? nd.name.slice(0, 16) + '...' : nd.name}
                      </text>
                    </g>
                  </g>
                );
              })}

            </g>
          </svg>

          {/* Quick usage instructions watermark inside canvas frame */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none text-slate-500 text-[9px] font-semibold text-center select-none bg-slate-900/50 p-1.5 rounded-lg border border-slate-800/20">
            🖱️ DRAG TO PARALLEL PAN VIEWPORT • USE WHEEL OR OVERLAY TO ZOOM • CLICK ANY SYNAPSE NODE TO AUDIT PATHWAYS
          </div>
        </div>

        {/* Add Connection custom form panel */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3xs text-left">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-black text-slate-800">Draft New Custom Synaptic Link</h4>
          </div>

          <form onSubmit={handleRegisterLink} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-wider">
                  1. Anchoring Day Trigger (A clear existing physical habit)
                </label>
                <input
                  type="text"
                  required
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="After I... pour coffee / step outdoors / charge my phone"
                  className="w-full text-xs font-semibold py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-wider">
                  2. positive target routine (Keep it under 3 minutes)
                </label>
                <input
                  type="text"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="I will... take 3 vagal deep sighs / drop my shoulders"
                  className="w-full text-xs font-semibold py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-wider">
                  3. Loop Execution Time Frame
                </label>
                <select
                  value={newTime}
                  onChange={(e: any) => setNewTime(e.target.value)}
                  className="w-full text-xs font-bold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-700"
                >
                  <option value="morning">🌅 Morning Cue</option>
                  <option value="afternoon">☀️ Afternoon Focus</option>
                  <option value="evening">🌙 Bedtime wind down</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-wider">
                  4. Friction Reduction Cues (Visual prompt/triggers)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Keep diary next to the mug / post-it node on wall"
                  className="w-full text-xs font-semibold py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-900 border border-indigo-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition active:scale-97 cursor-pointer"
            >
              + Compile to Central Synapse Map
            </button>
          </form>
        </div>
      </div>

      {/* 🔮 Interactive Inspector Sidebar Column (Right 4 Units) */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        
        {/* Selected Synapse Inspector Section */}
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key="inspector-active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-black px-2.5 py-0.5 roundedbg bg-slate-100 border border-slate-200 text-slate-500 font-mono tracking-wider">
                    Synaptic Inspector
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-400 hover:text-slate-900 text-xs font-bold font-mono p-1 rounded hover:bg-slate-50"
                  >
                    CLOSE
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-normal font-black text-slate-900 leading-tight">
                    {selectedNode.type === 'root' ? selectedNode.name : selectedNode.name.replace(/^(After I: |I will: )/, '')}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    Node: {selectedNode.type.toUpperCase()}
                  </p>
                </div>

                {/* Main clinical metrics inside details node */}
                {selectedNode.type === 'routine' ? (
                  <>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2.5">
                      {/* Strength metric slider mapping */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-extrabold text-slate-500 uppercase tracking-wide">Synaptic Potency:</span>
                          <span className={`font-black ${getStrengthMeta(selectedNode.strength).stroke ? 'text-slate-800' : 'text-slate-400'}`}>
                            {selectedNode.strength || 40}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${selectedNode.strength || 40}%`,
                              backgroundColor: getStrengthMeta(selectedNode.strength).stroke
                            }}
                          />
                        </div>
                        <p className="text-[8.5px] italic text-slate-400 pl-0.5">
                          {getStrengthMeta(selectedNode.strength).name}
                        </p>
                      </div>

                      {/* Info logs */}
                      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                        <div className="p-1 px-2 bg-white rounded-lg border border-slate-100/40">
                          <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Streak Count</span>
                          <strong className="text-amber-600 flex items-center gap-0.5">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            <span>{selectedNode.streak || 0} cycles</span>
                          </strong>
                        </div>
                        <div className="p-1 px-2 bg-white rounded-lg border border-slate-100/40">
                          <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Status Today</span>
                          <strong className={selectedNode.completedToday ? 'text-emerald-700' : 'text-rose-500'}>
                            {selectedNode.completedToday ? '✓ Complete' : '✗ Awaiting Link'}
                          </strong>
                        </div>
                      </div>

                      {selectedNode.notes && (
                        <div className="bg-indigo-50/25 p-2 rounded-xl text-[10px] text-indigo-950 font-semibold border border-indigo-100/30">
                          💡 <strong>Reduction Cue:</strong> "{selectedNode.notes}"
                        </div>
                      )}
                    </div>

                    {/* Neurological and Neurotransmitter guide matches node outcomes */}
                    <div className="space-y-1 bg-sky-50/40 p-3.5 rounded-2xl border border-sky-100 text-[10.2px] text-slate-700 leading-normal">
                      <span className="text-[#3d627f] font-black uppercase text-[8px] tracking-widest flex items-center gap-1 mb-1">
                        <Brain className="w-3.5 h-3.5" />
                        <span>NEUROCHEMICAL TARGET PATTERNS</span>
                      </span>
                      {selectedNode.streak && selectedNode.streak > 3 ? (
                        <p>
                          <strong>Acquisition Level Achieved:</strong> High myelination signals mean this habit is now triggered with 40% less conscious effort. The brain initiates the routine pre-attentively.
                        </p>
                      ) : (
                        <p>
                          <strong>Synaptic Sprouting Mode:</strong> Your brain is currently establishing new protein links at this terminal. To increase bonding speed, engage in an instant reward immediately once complete.
                        </p>
                      )}
                      <p className="mt-1 pt-1 border-t border-sky-100/40 text-[9.5px] italic text-slate-500">
                        Primary target neurotransmitter: <strong>Dopamine (motivation gating)</strong> &amp; <strong>Acetylcholine (focused memory consolidation)</strong>.
                      </p>
                    </div>

                    {/* Action button to rehearse active mental synapse loops */}
                    <div className="space-y-2 pt-1">
                      {rehearsalActive ? (
                        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3.5 text-center">
                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block font-mono">
                              COGNITIVE ALIGNMENT DRILL
                            </span>
                            <h5 className="text-[11px] font-bold">Mental Action Rehearsal</h5>
                          </div>

                          {/* Beautiful breathing visual pacing simulator */}
                          <div className="flex flex-col items-center justify-center py-4">
                            <motion.div
                              animate={{
                                scale: rehearsalBreathPhase === 'inhale' ? 1.6 : rehearsalBreathPhase === 'hold' ? 1.6 : rehearsalBreathPhase === 'exhale' ? 0.9 : 1.0,
                                opacity: rehearsalBreathPhase === 'hold' ? 0.9 : 1.0
                              }}
                              transition={{ duration: 4.0, ease: 'easeInOut' }}
                              className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center font-bold text-xs"
                              style={{ 
                                background: rehearsalBreathPhase === 'inhale' ? '#10b981' : rehearsalBreathPhase === 'hold' ? '#f59e0b' : '#3b82f6',
                                boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)'
                              }}
                            >
                              🌀
                            </motion.div>
                            <span className="text-xs font-mono font-black uppercase text-slate-300 mt-4 h-4">
                              {rehearsalBreathPhase === 'inhale' && '🗣️ INHALE SAFETY...'}
                              {rehearsalBreathPhase === 'hold' && `🧘 HOLD CONVICTION (${rehearsalCounter}s)...`}
                              {rehearsalBreathPhase === 'exhale' && '🌬️ EXHALE COGNITIVE STATIC...'}
                              {rehearsalBreathPhase === 'complete' && '✓ SYNAPSE READY'}
                            </span>
                          </div>

                          {rehearsalBreathPhase === 'complete' ? (
                            <button
                              onClick={finishRehearsalAndBoostStrength}
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-black transition cursor-pointer"
                            >
                              Lock In +12% Myelination Base
                            </button>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">
                              Mentally link the anchor: "After I {selectedNode.parentName}" with doing "{selectedNode.name.replace('I will: ', '')}" immediately behind it.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={triggerRehearsalAction}
                            className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-[10.5px] font-medium transition cursor-pointer text-center flex items-center justify-center gap-1.5 border border-indigo-200"
                          >
                            <Brain className="w-3.5 h-3.5 shrink-0" />
                            <span>Rehearse Nerve Pathway</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteNode(selectedNode.id)}
                            className="p-2 border border-rose-200 hover:bg-rose-50 rounded-xl text-rose-600 transition cursor-pointer shrink-0"
                            title="Prune branch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-500 leading-relaxed text-center">
                    <Info className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-800 mb-1">Anchor Node Inspected</p>
                    <p>All routines mounted behind this anchor inherit the signal velocity calculated from daily streak continuity multipliers. Adjust specific habits below to alter connections.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="inspector-empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-3xl border border-slate-200 shadow-3xs flex flex-col items-center justify-center py-10 text-center space-y-2"
            >
              <HelpCircle className="w-10 h-10 text-slate-300 stroke-[1.2] animate-bounce" />
              <h5 className="text-xs font-black text-slate-700">Synaptic Inspector Idle</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
                Hover or click any node point on your live Neuromorphic Tree to view custom clinical myelination analysis, loop completion ratios, and neurotransmitter pathways.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clinical Preset Grafting Panel */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 text-left space-y-3 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <h5 className="text-[11.5px] font-black text-slate-800 uppercase tracking-wide">
              Adopt Clinical Anchor Loops
            </h5>
          </div>
          <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold pl-0.5">
            Graft evidence-based self-care hooks directly onto your neural map compiled by behavioral therapists and neuroscientists:
          </p>

          <div className="space-y-2 pt-1">
            {CLINICAL_PRESETS.map((preset) => {
              const isAdopted = habitStacks.some(
                h => h.targetHabit.toLowerCase() === preset.targetHabit.toLowerCase()
              );

              return (
                <div 
                  key={preset.id}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition flex items-start justify-between gap-3 text-[10.2px]"
                >
                  <div className="space-y-1.5 text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] tracking-wider uppercase font-black text-slate-400 bg-slate-100 rounded px-1.5 py-0.5 font-mono">
                        {preset.timeOfDay}
                      </span>
                      <span className="text-[8px] tracking-wider font-extrabold text-indigo-500 font-mono">
                        POTENCY: {preset.strength}%
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-800 leading-tight">
                      <span className="text-slate-400 font-bold">After I:</span>{" "}
                      <span className="italic font-medium">{preset.triggerHabit}</span>
                      <br />
                      <span className="text-indigo-600 font-bold">I will:</span>{" "}
                      <strong className="font-extrabold">{preset.targetHabit}</strong>
                    </div>

                    <p className="text-[8px] text-slate-400 italic">
                      {preset.notes}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isAdopted}
                    onClick={() => handleGraftPreset(preset)}
                    className={`shrink-0 p-1 rounded-lg border text-[9px] font-black transition cursor-pointer-none ${
                      isAdopted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-indigo-900 active:scale-95'
                    }`}
                  >
                    {isAdopted ? '✓ Grafted' : '+ Adopt'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
