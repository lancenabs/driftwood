import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Layers, RefreshCw, Play, Trash2, Info, Check, ArrowRight, AlertTriangle, ShieldAlert
} from 'lucide-react';

interface HabitBlock {
  id: string;
  type: 'anchor' | 'habit';
  label: string;
  weight: number; // bigger task = heavier weight
  width: number;
  height: number;
  x: number; // canvas x
  y: number; // canvas y
  vy: number; // velocity y
  color: string;
  glow: string;
  angle: number; // rotation angle
  vangle: number; // angular velocity
  anchorAnchor?: string;
  hasLanded: boolean;
  vx?: number;       // horizontal velocity
  offsetX?: number;  // offset relative to the block directly below it
}

const PRESET_ANCHORS = [
  "After I pour my first cup of coffee",
  "After I shut down my work laptop",
  "After I step out of the morning shower",
  "After I sit down in my driver's seat",
  "After I close my bedroom door at night"
];

const PRESET_HABITS = [
  "I will write 1 positive bullet in my journal",
  "I will floss exactly 1 tooth",
  "I will take 3 slow diaphragmatic sighs",
  "I will extend my arms in a 30-second shoulder shrug",
  "I will verify my physical hydration state"
];

export default function HabitNeuroStacker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Custom inputs state
  const [selectedAnchor, setSelectedAnchor] = useState<string>(PRESET_ANCHORS[0]);
  const [customHabitText, setCustomHabitText] = useState<string>('');
  const [habitComplexity, setHabitComplexity] = useState<'tiny' | 'medium' | 'overload'>('tiny');

  const [blocks, setBlocks] = useState<HabitBlock[]>([]);
  const [stackStability, setStackStability] = useState<number>(100);

  useEffect(() => {
    localStorage.setItem('therapy_neuro_stacker_stability', stackStability.toString());
  }, [stackStability]);
  const [collapseOccurred, setCollapseOccurred] = useState<boolean>(false);
  const [collapseReason, setCollapseReason] = useState<string>('');
  
  // Real-time dragging trackers
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const draggedBlockIdRef = useRef<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);

  // Live mouse interaction tracking to support pointer-highlighting and "pokes"
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const activePokesRef = useRef<{ x: number; y: number; progress: number }[]>([]);

  // 1. Core Physics Animation Loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Gravity, elastic bounce and friction constants
    const gravity = 0.45;
    const floorY = canvasHeight - 35;

    const render = () => {
      // Clear canvas with ambient slate backdrop
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw subtle background grid lines representing cognitive metrics
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 20; x < canvasWidth; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, floorY);
        ctx.stroke();
      }

      // Draw horizontal foundation soil line
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(canvasWidth, floorY);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 8px var(--font-mono, monospace)';
      ctx.textAlign = 'center';
      ctx.fillText('CORE BEHAVIORAL BEDROCK (STABLE FOUNDATION)', canvasWidth / 2, floorY + 16);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px var(--font-mono, monospace)';
      ctx.fillText('💡 CLICK ANY BLOCK TO POKE AND TEST ROUTINE RESILIENCE', canvasWidth / 2, floorY + 28);

      // We maintain the active telemetry metrics to update state asynchronously
      let stackStabilityDraft = 100;
      let triggersCollapse = false;
      let localReason = '';

      // Physics calculation update
      setBlocks((prevBlocks) => {
        if (prevBlocks.length === 0) return prevBlocks;

        const draft = prevBlocks.map((b) => ({ ...b }));

        // 1. Core iterative physics solver
        for (let i = 0; i < draft.length; i++) {
          const block = draft[i];

          if (block.id === draggedBlockIdRef.current) {
            // Dragged block manually overrides physics!
            const canvas = canvasRef.current;
            if (canvas) {
              const mouseX = mouseRef.current.x;
              const mouseY = mouseRef.current.y;
              block.x = mouseX - dragOffsetRef.current.x;
              block.y = mouseY - dragOffsetRef.current.y;
              block.vy = 0;
              block.vx = 0;
              block.hasLanded = false; // Float during active drag
              
              // Apply dynamic "drag wobble" angular vibration based on stability context!
              const instabilityMultiplier = (100 - stackStability) / 100; // 0 (perfect stable) to 1 (near collapse)
              const baseWobbleSpeed = 0.08 + instabilityMultiplier * 0.15;
              const baseWobbleAmplitude = 0.05 + instabilityMultiplier * 0.25;
              
              block.angle = Math.sin(Date.now() * baseWobbleSpeed) * baseWobbleAmplitude;
              block.vangle = 0;
            }
          } else if (collapseOccurred) {
            // Drop scattered falling blocks with natural bounces
            block.vy = (block.vy || 0) + gravity;
            block.vx = (block.vx || 0) * 0.985;
            block.y += block.vy;
            block.x += block.vx;
            block.angle += block.vangle;

            // Roll / bounce off floor
            const halfH = block.height / 2;
            if (block.y >= floorY - halfH) {
              block.y = floorY - halfH;
              block.vy = -Math.abs(block.vy) * 0.38; // elastic coefficient
              block.vx *= 0.5;
              block.vangle *= 0.4;
            }
            // Bounce off boundaries x
            const halfW = block.width / 2;
            if (block.x <= halfW) {
              block.x = halfW;
              block.vx = Math.abs(block.vx) * 0.5;
            }
            if (block.x >= canvasWidth - halfW) {
              block.x = canvasWidth - halfW;
              block.vx = -Math.abs(block.vx) * 0.5;
            }
          } else if (!block.hasLanded) {
            // Air drop phase integration
            block.vy = (block.vy || 0) + gravity;
            block.vx = (block.vx || 0);
            block.y += block.vy;
            block.x += block.vx;

            // Dynamic air friction turbulence
            block.angle += block.vangle;
            block.vangle += (Math.random() - 0.5) * 0.004;

            // Predict precise landing surface Y coordinate
            let targetY = floorY - block.height / 2;
            if (i > 0) {
              const below = draft[i - 1];
              if (below.hasLanded) {
                targetY = below.y - (below.height / 2) - (block.height / 2);
              }
            }

            if (block.y >= targetY) {
              block.y = targetY;
              block.vy = 0;
              block.vx = 0;
              block.hasLanded = true;

              const below = i > 0 ? draft[i - 1] : null;
              block.offsetX = below ? (block.x - below.x) : 0;

              // Collision Impact Angular impulse
              const anchorX = below ? below.x : canvasWidth / 2;
              const landingDiff = block.x - anchorX;

              // Generates tilt momentum corresponding to the spatial landing placement offset
              block.vangle = landingDiff * 0.008 + (Math.random() - 0.5) * 0.12;

              // Instantly propagate shockwaves down the stack to shiver surrounding links!
              for (let j = 0; j < i; j++) {
                if (draft[j].hasLanded) {
                  draft[j].vangle += (Math.random() - 0.5) * 0.05 * (j + 1);
                }
              }
            }
          } else {
            // Landed/Stacked joint constraint physics
            if (i === 0) {
              // Bedrock Anchor Block
              block.x = canvasWidth / 2;
              block.y = floorY - block.height / 2;

              // Primary bedrock spring tension centering
              const K = 0.35;
              const D = 0.18;
              const torque = -K * block.angle - D * block.vangle;
              block.vangle += torque;
              block.angle += block.vangle;
            } else {
              const below = draft[i - 1];
              if (below.hasLanded) {
                // Pivot lock around lower block's rotating upper profile face
                const cosB = Math.cos(below.angle);
                const sinB = Math.sin(below.angle);
                const separation = below.height / 2 + block.height / 2;
                const offsetLandedX = block.offsetX || 0;

                block.x = below.x + offsetLandedX * cosB - separation * sinB;
                block.y = below.y + offsetLandedX * sinB - separation * cosB;

                // Rotational spring joint restoration aligning facing angles
                const relativeAngle = block.angle - below.angle;

                // Mass-dampened joint stiffness based on habit weight complexity
                let K = 0.22;
                if (block.weight > 2.5) {
                  K = 0.035; // overloaded - highly sloppy/wobbly structure!
                } else if (block.weight > 1.2) {
                  K = 0.11;  // medium - flexible
                }

                // Damping constant
                const D = 0.08 * Math.sqrt(block.weight || 1.0);

                // Destabilizing tipping gravity torque
                const gravityTorque = 0.0045 * block.weight * Math.sin(block.angle);

                const relativeVangle = block.vangle - below.vangle;
                const totalTorque = -K * relativeAngle + gravityTorque - D * relativeVangle;

                block.vangle += totalTorque;
                block.angle += block.vangle;

                // Speed limit caps to preserve numerical integration stability
                block.vangle = Math.max(-0.25, Math.min(0.25, block.vangle));
              }
            }
          }
        }

        // 2. Continuous stability stress evaluation
        if (!collapseOccurred) {
          let cumulativeStress = 0;
          const habits = draft.filter(b => b.type === 'habit' && b.hasLanded);

          if (habits.length > 0) {
            draft.forEach((b) => {
              if (b.hasLanded) {
                // Large angles and large offsets contribute heavy physical shear stress
                cumulativeStress += Math.abs(b.angle) * 115;
                cumulativeStress += Math.abs(b.offsetX || 0) * 1.6;
              }
            });

            // Extra strain from tall columns of stacking
            if (habits.length > 3) {
              cumulativeStress += (habits.length - 3) * 35;
            }

            // High complexity heavy mass penalty
            const heavyHabits = habits.filter(b => b.weight > 2.0);
            cumulativeStress += heavyHabits.length * 25;

            const liveStability = Math.max(0, Math.min(100, Math.round(100 - cumulativeStress)));
            stackStabilityDraft = liveStability;

            if (liveStability <= 15) {
              triggersCollapse = true;
              localReason = `Habit collapse! Accumulating ${habits.length} habits with high task complexity onto one single anchor ("${draft[0]?.label}") was physically unsustainable. Try splitting into Tiny 1-min habits or distribute them across distinct anchors!`;
            }
          }
        }

        return draft;
      });

      // Synchronize state outputs safely without warning cascades
      if (stackStabilityDraft !== stackStability && !collapseOccurred) {
        setTimeout(() => setStackStability(stackStabilityDraft), 0);
      }

      if (triggersCollapse) {
        setTimeout(() => {
          setCollapseOccurred(true);
          setCollapseReason(localReason);
          setBlocks((current) => current.map(item => ({
            ...item,
            hasLanded: false,
            vy: -4 - Math.random() * 5,
            vx: (Math.random() - 0.5) * 8 + (item.x < canvasWidth / 2 ? -3 : 3),
            vangle: (Math.random() - 0.5) * 0.3
          })));
        }, 0);
      }

      // --- GRAPHIC DRAWING PASS ---
      
      // Update and draw expanding pointer poke concentric ripples
      activePokesRef.current = activePokesRef.current.map(p => ({
        ...p,
        progress: p.progress + 0.04
      })).filter(p => p.progress < 1.0);

      activePokesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.progress * 45, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(236, 72, 153, ${1 - p.progress})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.progress * 20, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(13, 148, 136, ${(1 - p.progress) * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw center-of-gravity vector plumbline string
      if (blocks.length > 0 && !collapseOccurred) {
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2, floorY);
        
        // Follow centerline upwards
        blocks.forEach((b) => {
          if (b.hasLanded) {
            ctx.lineTo(b.x, b.y);
          }
        });

        // Plumb color matches structural health
        if (stackStability > 60) {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)'; // green
        } else if (stackStability > 30) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)'; // amber
        } else {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'; // red
        }
        ctx.lineWidth = 2.4;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label center-of-gravity warning if swaying too much
        const topBlock = blocks[blocks.length - 1];
        if (topBlock && topBlock.hasLanded && Math.abs(topBlock.x - canvasWidth / 2) > 40) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 7.5px var(--font-mono, monospace)';
          ctx.fillText('⚠️ MASS BALANCE OFF-CENTER', topBlock.x, topBlock.y - 30);
        }
      }

      // Draw each individual block
      blocks.forEach((block) => {
        ctx.save();

        // Translate and rotate canvas coordinate space
        ctx.translate(block.x, block.y);
        ctx.rotate(block.angle);

        // Check cursor distance to draw outstanding active hover glow highlights
        const dx = mouseRef.current.x - block.x;
        const dy = mouseRef.current.y - block.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const isHovered = distToMouse < Math.max(block.width, block.height) / 2 && !collapseOccurred;

        // Apply drop shadow glow color
        ctx.shadowColor = isHovered ? '#ec4899' : block.glow;
        ctx.shadowBlur = isHovered ? 16 : block.hasLanded ? 8 : 2;
        ctx.fillStyle = block.color;

        // Block round rectangular boundary
        const rx = -block.width / 2;
        const ry = -block.height / 2;
        const rw = block.width;
        const rh = block.height;
        const rad = 10;

        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(rx, ry, rw, rh, rad) : ctx.rect(rx, ry, rw, rh);
        ctx.fill();

        // High gloss white internal edge accent
        ctx.shadowBlur = 0;
        ctx.strokeStyle = isHovered ? '#ffffff' : '#ffffff80';
        ctx.lineWidth = isHovered ? 2.2 : 1.8;
        ctx.stroke();

        // Visual Tension joint indicator lines showing shear stress
        if (block.type === 'habit' && block.hasLanded) {
          ctx.beginPath();
          ctx.moveTo(rx + 8, ry + rh);
          ctx.lineTo(rx + rw - 8, ry + rh);
          // Highlight connector stress at bottom joint
          const rotationStrain = Math.abs(block.angle - (block.id ? 0 : 0)); // approximate relative tilt
          ctx.strokeStyle = rotationStrain > 0.1 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Draw internal labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px var(--font-sans, sans-serif)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Wrap labels cleanly inside the card capsule
        const maxTextW = block.width - 24;
        const words = block.label.split(' ');
        let line = '';
        let lines: string[] = [];

        words.forEach(word => {
          let testLine = line + word + ' ';
          if (ctx.measureText(testLine).width > maxTextW && line !== '') {
            lines.push(line.trim());
            line = word + ' ';
          } else {
            line = testLine;
          }
        });
        lines.push(line.trim());

        if (lines.length === 1) {
          ctx.fillText(block.label.toUpperCase(), 0, 0);
        } else {
          ctx.fillText(lines[0].toUpperCase(), 0, -6);
          ctx.fillText(lines[1].toUpperCase(), 0, 6);
        }

        // Pin bedrock badge label
        if (block.type === 'anchor') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.font = '8px var(--font-mono, monospace)';
          ctx.fillText('🔗 ANCHOR', 0, ry + 11);
        }

        // Interactive Left-click prompt on hover
        if (isHovered) {
          ctx.fillStyle = '#ffb3c5';
          ctx.font = 'bold 8px var(--font-sans, sans-serif)';
          ctx.fillText('💥 CLICK TO NUDGE', 0, ry + rh - 10);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [blocks, collapseOccurred, stackStability]);

  // 2. Clear stack
  const handleClearStack = () => {
    setBlocks([]);
    setStackStability(100);
    setCollapseOccurred(false);
    setCollapseReason('');
  };

  // 3. Add custom block to stack chain
  const handleAddBlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check if Anchor foundation already exists
    const hasAnchor = blocks.some((b) => b.type === 'anchor');
    const canvas = canvasRef.current;
    const cw = canvas ? canvas.width : 500;
    const ch = canvas ? canvas.height : 300;

    const midX = cw / 2;

    if (!hasAnchor) {
      // Must drop anchor block first!
      const anchorNode: HabitBlock = {
        id: 'anchor-' + Date.now(),
        type: 'anchor',
        label: selectedAnchor,
        weight: 1.0,
        width: 250,
        height: 38,
        x: midX,
        y: 20, // drop from top
        vy: 2.0,
        angle: 0.1,
        vangle: 0.01,
        color: '#334155', // dark slate
        glow: 'rgba(51, 65, 85, 0.45)',
        hasLanded: false
      };
      setBlocks([anchorNode]);
      return;
    }

    // User is adding a habit block onto are existing bedrock
    const habitText = customHabitText.trim() || PRESET_HABITS[Math.floor(Math.random() * PRESET_HABITS.length)];
    const weightVal = habitComplexity === 'tiny' ? 1.0 : habitComplexity === 'medium' ? 1.8 : 3.5;
    const blockWidth = habitComplexity === 'tiny' ? 220 : habitComplexity === 'medium' ? 245 : 290;
    const blockHeight = habitComplexity === 'tiny' ? 34 : habitComplexity === 'medium' ? 40 : 46;

    const blockColor = habitComplexity === 'tiny' 
      ? '#0d9488' // teal
      : habitComplexity === 'medium' 
      ? '#d97706' // amber
      : '#e11d48'; // red rose alert

    const blockGlow = habitComplexity === 'tiny' 
      ? 'rgba(13, 148, 136, 0.4)' 
      : habitComplexity === 'medium' 
      ? 'rgba(217, 119, 6, 0.4)' 
      : 'rgba(225, 29, 72, 0.5)';

    const newHabitBlock: HabitBlock = {
      id: 'habit-' + Date.now(),
      type: 'habit',
      label: habitText,
      weight: weightVal,
      width: blockWidth,
      height: blockHeight,
      x: midX + (Math.random() - 0.5) * 12, // subtle landing variance
      y: 10,
      vy: 1.5,
      angle: -0.15 + Math.random() * 0.3,
      vangle: (Math.random() - 0.5) * 0.05,
      color: blockColor,
      glow: blockGlow,
      hasLanded: false
    };

    setBlocks((prev) => [...prev, newHabitBlock]);
    setCustomHabitText('');
  };

  return (
    <div id="neuro-stacker-container" className="bg-white border rounded-3xl p-5 md:p-6 space-y-5 text-left" style={{ borderColor: '#F0F0F0', boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest font-mono" style={{ color: '#0D9488' }}>
            <Layers className="w-4 h-4 animate-pulse" style={{ color: '#14B8A6' }} />
            <span>Behavioral Stack Diagnostics</span>
          </div>
          <h3 className="font-display text-base font-bold tracking-tight" style={{ color: '#3C3C3C' }}>
            Micro-Habit "Neuro-Stacker" Physics Simulator
          </h3>
          <p className="text-[11.5px] font-medium leading-relaxed" style={{ color: '#6B7280' }}>
            James Clear (Atomic Habits) and BJ Fogg proved that effective habits attach directly onto existing routines (anchors). Test the physical balance of your goals. Drop blocks under live gravity!
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearStack}
          className="min-h-10 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          style={{ color: '#3C3C3C' }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Bedrock</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: THE PHYSICAL CANVAS LAB (lg:span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <motion.div 
            className="relative border border-slate-200 bg-slate-50 rounded-2xl overflow-hidden p-1 shadow-inner h-[280px]"
            animate={isDragging ? "wobble" : "idle"}
            variants={{
              wobble: {
                x: [0, -1.8, 1.8, -0.9, 0.9, 0],
                y: [0, 0.9, -0.9, 0.9, -0.9, 0],
                rotate: [0, -0.5, 0.5, -0.25, 0.25, 0],
                transition: {
                  repeat: Infinity,
                  duration: stackStability > 75 ? 0.32 : stackStability > 35 ? 0.20 : 0.12,
                  ease: "easeInOut"
                }
              },
              idle: { x: 0, y: 0, rotate: 0 }
            }}
          >
            <canvas
              ref={canvasRef}
              width={520}
              height={272}
              onMouseDown={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
                const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

                // Find top-most block under cursor
                const clickedBlock = [...blocks].reverse().find(b => {
                  const dx = clickX - b.x;
                  const dy = clickY - b.y;
                  return Math.abs(dx) < b.width / 2 && Math.abs(dy) < b.height / 2;
                });

                if (clickedBlock && !collapseOccurred) {
                  draggedBlockIdRef.current = clickedBlock.id;
                  dragOffsetRef.current = { x: clickX - clickedBlock.x, y: clickY - clickedBlock.y };
                  setIsDragging(true);
                  hasDraggedRef.current = false;
                  
                  // Release from joint locks immediately so dragging is organic
                  setBlocks(prev => prev.map(b => b.id === clickedBlock.id ? { ...b, hasLanded: false, vy: 0, vx: 0 } : b));
                }
              }}
              onMouseMove={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
                const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
                mouseRef.current = { x, y };

                if (draggedBlockIdRef.current) {
                  hasDraggedRef.current = true;
                }
              }}
              onMouseLeave={() => {
                mouseRef.current = { x: -1000, y: -1000 };
                if (draggedBlockIdRef.current) {
                  draggedBlockIdRef.current = null;
                  setIsDragging(false);
                }
              }}
              onMouseUp={() => {
                if (draggedBlockIdRef.current) {
                  draggedBlockIdRef.current = null;
                  setIsDragging(false);
                }
              }}
              onClick={(e) => {
                if (hasDraggedRef.current) {
                  hasDraggedRef.current = false;
                  return;
                }
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
                const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

                activePokesRef.current.push({ x: clickX, y: clickY, progress: 0 });

                setBlocks((prevBlocks) => {
                  return prevBlocks.map((block) => {
                    if (!block.hasLanded) return block;
                    const dx = clickX - block.x;
                    const dy = clickY - block.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                      const force = (130 - dist) / 130;
                      const pushDirection = clickX < block.x ? 1 : -1;
                      const torque = force * 0.16 * pushDirection / (block.weight || 1);
                      return {
                        ...block,
                        vangle: block.vangle + torque
                      };
                    }
                    return block;
                  });
                });
              }}
              className="w-full h-full block rounded-xl cursor-crosshair"
            />

            {/* Simulated Live Diagnostic overlay panel */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/60 text-xs font-bold font-sans space-y-1 max-w-[170px]" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Stack Security</span>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      stackStability > 70
                        ? 'bg-emerald-500'
                        : stackStability > 30
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${stackStability}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] font-black shrink-0" style={{ color: '#3C3C3C' }}>{stackStability}%</span>
              </div>
              <p className="text-[11px] text-slate-500 uppercase leading-none font-semibold">
                State: {stackStability > 70 ? '🟢 Stable anchor' : stackStability > 30 ? '🟡 Wobbly overcommit' : '🔴 Collapse Warning'}
              </p>
            </div>
          </motion.div>

          {/* Prompt banner for Collapsed states */}
          <AnimatePresence>
            {collapseOccurred && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3"
                style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
              >
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-rose-700 font-mono">Cognitive Gravity Alert</span>
                  <p className="text-xs leading-relaxed font-semibold">
                    {collapseReason}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: BUILD WORKSPACE CONTROLS (lg:span-5) */}
        <div className="lg:col-span-5 bg-slate-50/70 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
              <span>Behavior Stack Lab</span>
            </h4>

            {/* Check if anchor is placed */}
            {!blocks.some(b => b.type === 'anchor') ? (
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-wide font-extrabold text-indigo-700 block">
                  Step 1: Select Foundation Anchor
                </span>
                <p className="text-xs leading-normal font-semibold" style={{ color: '#6B7280' }}>
                  To drop a card, establish an immediate biological "trigger" action that you already perform without effort daily.
                </p>

                <div className="space-y-2">
                  {PRESET_ANCHORS.map((anchor) => (
                    <button
                      key={anchor}
                      onClick={() => setSelectedAnchor(anchor)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold leading-snug transition-all flex items-center justify-between cursor-pointer ${
                        selectedAnchor === anchor
                          ? 'text-white font-bold border-transparent'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                      style={selectedAnchor === anchor ? { background: 'linear-gradient(135deg, #14B8A6, #0D9488)' } : undefined}
                    >
                      <span>{anchor}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>

                <motion.button
                  whileTap={{ y: 3, boxShadow: 'none' }}
                  type="button"
                  onClick={() => handleAddBlock()}
                  className="w-full py-3.5 text-white text-xs font-black rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #14B8A6, #58CC02)', boxShadow: '0 5px 0 #0D9488' }}
                >
                  <Layers className="w-4 h-4" />
                  <span>Establish Bedrock Anchor</span>
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleAddBlock} className="space-y-4">
                <div className="bg-emerald-50/70 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-semibold leading-relaxed flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Anchor Active: <strong>"{blocks[0]?.label}"</strong></span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wide font-extrabold block" style={{ color: '#0D9488' }}>
                    Step 2: Add Stacked Habit Block
                  </span>
                  <input
                    type="text"
                    value={customHabitText}
                    onChange={(e) => setCustomHabitText(e.target.value)}
                    placeholder="Enter micro activity: e.g. 'write 1 goal'"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/10 text-xs font-semibold"
                    style={{ color: '#3C3C3C' }}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_HABITS.slice(0, 3).map((ph) => (
                      <button
                        key={ph}
                        type="button"
                        onClick={() => setCustomHabitText(ph)}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        ⚡ {ph.substring(11)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Habit Task Weight Option representing complexity */}
                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                    Select Task Complexity (Signaling Cognitive Mass)
                  </span>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setHabitComplexity('tiny')}
                      className={`flex-1 min-h-9 py-1 rounded-lg transition-all text-[10px] uppercase cursor-pointer text-center font-bold ${
                        habitComplexity === 'tiny'
                          ? 'bg-teal-600 text-white font-black'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Tiny (1 Min)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHabitComplexity('medium')}
                      className={`flex-1 min-h-9 py-1 rounded-lg transition-all text-[10px] uppercase cursor-pointer text-center font-bold ${
                        habitComplexity === 'medium'
                          ? 'bg-amber-600 text-white font-black'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Medium (10 Min)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHabitComplexity('overload')}
                      className={`flex-1 min-h-9 py-1 rounded-lg transition-all text-[10px] uppercase cursor-pointer text-center font-bold ${
                        habitComplexity === 'overload'
                          ? 'bg-rose-600 text-white font-black'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Big (30 Min)
                    </button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ y: 3, boxShadow: 'none' }}
                  type="submit"
                  disabled={collapseOccurred}
                  className="w-full py-3.5 text-white disabled:opacity-40 text-xs font-black rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #14B8A6, #58CC02)', boxShadow: collapseOccurred ? 'none' : '0 5px 0 #0D9488' }}
                >
                  <span>Drop Stacking Block</span>
                  <span>↓</span>
                </motion.button>
              </form>
            )}
          </div>

          <div className="border-t border-slate-200/60 pt-3 flex items-start gap-2.5 text-[11px] text-slate-500 leading-normal font-medium">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              Adding blocks drifts the weight vector off center. Red cards representing large tasks cause instant structural strain to demonstrate how mental commitments crush daily follow-through.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
