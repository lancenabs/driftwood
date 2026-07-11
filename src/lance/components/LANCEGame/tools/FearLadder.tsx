import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Trash2, Check, Lock, Download } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { exportWorksheetPdf } from '../../../utils/exportWorksheetPdf';
import { GlassPanel, CoachCard, RewardMoment, EmptyStateCoach, pickPraise } from '../ui/GlassKit';

// Observatory region (cbt) behind the whole tool — the fear is mapped like a
// constellation, one rung at a time.
function ObservatoryBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cbt.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.4,
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(246,246,250,0.9) 0%, rgba(246,246,250,0.94) 100%)',
      }} />
    </>
  );
}

const CLIMB_PRAISE = [
  'Rung climbed. The fear has new data now.',
  'You went toward it. That IS the therapy.',
  'One rung braver than an hour ago.',
  'Your nervous system just updated its map.',
];

interface LadderStep {
  id: string;
  description: string;
  difficulty: number; // 1–10
  completed: boolean;
  completedDate?: string;
}

interface FearLadder {
  id: string;
  fearName: string;
  createdDate: string;
  steps: LadderStep[];
}

const STORAGE_KEY = 'lance_fears_v1';
function load(): FearLadder[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(ladders: FearLadder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ladders));
}

const DIFFICULTY_LABELS = ['', '😌 1', '😐 2', '😟 3', '😬 4', '😰 5', '😱 6', '🤯 7', '😨 8', '💀 9', '🫨 10'];
const difficultyColor = (d: number) =>
  d <= 3 ? '#7FD98C' : d <= 5 ? '#eab308' : d <= 7 ? '#f97316' : '#ef4444';

const LANCE_LINES_NEW = [
  "Fear ladder constructed. Avoidance is the maintenance behavior for anxiety. You've decided to discontinue maintenance. I'll track your progress.",
  "Graded exposure framework: built. The ladder is the intervention. Climbing it is the therapy. Do not skip rungs.",
  "Filed. You've identified the fear and graded the exposure hierarchy. The data is clean. What comes next requires execution, not analysis.",
];
const INTERN_LINES_NEW = [
  "Building this ladder took courage. You named the thing. That's step one and it's not nothing.",
  "A fear ladder is literally how exposure therapy works in clinical practice. You just built your own. I'm so proud.",
  "The fact that you named this fear and made a plan means you're already doing the hardest part.",
];
const INTERN_LINES_CLIMB = [
  "You climbed a rung! Your brain just got new evidence that it can survive this. That's exposure therapy working in real time.",
  "Every rung you check off rewires a little piece of the fear response. You just did that. You just actually did that.",
  "That took real courage. I know it didn't feel like enough — it's always enough. You showed up.",
  "LANCE is pretending not to be impressed. I am very openly impressed.",
];

interface Props { onBack: () => void; }

export default function FearLadderTool({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [ladders, setLadders] = useState<FearLadder[]>(load);
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [activeLadderId, setActiveLadderId] = useState<string | null>(null);
  // Create state
  const [fearName, setFearName] = useState('');
  const [steps, setSteps] = useState<{ description: string; difficulty: number }[]>([
    { description: '', difficulty: 2 },
    { description: '', difficulty: 4 },
    { description: '', difficulty: 7 },
  ]);
  const [justClimbed, setJustClimbed] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [praise, setPraise] = useState('');
  const [lanceNewIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES_NEW.length));
  const [internNewIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES_NEW.length));
  const [internClimbIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES_CLIMB.length));

  const activeLadder = ladders.find(l => l.id === activeLadderId);
  const sortedSteps = activeLadder
    ? [...activeLadder.steps].sort((a, b) => a.difficulty - b.difficulty)
    : [];
  const completedCount = activeLadder?.steps.filter(s => s.completed).length ?? 0;

  const addStep = () => {
    setSteps(prev => [...prev, { description: '', difficulty: 5 }]);
  };
  const removeStep = (idx: number) => {
    setSteps(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    const validSteps = steps.filter(s => s.description.trim().length > 0);
    if (!fearName.trim() || validSteps.length < 2) return;
    const sorted = [...validSteps].sort((a, b) => a.difficulty - b.difficulty);
    const ladder: FearLadder = {
      id: `ladder_${Date.now()}`,
      fearName: fearName.trim(),
      createdDate: new Date().toISOString().split('T')[0],
      steps: sorted.map(s => ({
        id: `step_${Date.now()}_${Math.random()}`,
        description: s.description.trim(),
        difficulty: s.difficulty,
        completed: false,
      })),
    };
    const updated = [ladder, ...ladders];
    save(updated);
    setLadders(updated);
    addXp(20);
    setActiveLadderId(ladder.id);
    setView('detail');
    setFearName('');
    setSteps([{ description: '', difficulty: 2 }, { description: '', difficulty: 4 }, { description: '', difficulty: 7 }]);
  };

  const climbRung = (ladderId: string, stepId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = ladders.map(l =>
      l.id === ladderId
        ? { ...l, steps: l.steps.map(s => s.id === stepId ? { ...s, completed: true, completedDate: today } : s) }
        : l
    );
    save(updated);
    setLadders(updated);
    addXp(25);
    setPraise(pickPraise(CLIMB_PRAISE));
    setCelebrate(true);
    setJustClimbed(stepId);
    setTimeout(() => setJustClimbed(null), 3000);
  };

  const downloadLadderPdf = (ladder: FearLadder) => {
    const sorted = [...ladder.steps].sort((a, b) => a.difficulty - b.difficulty);
    exportWorksheetPdf({
      title: `Fear Ladder — ${ladder.fearName}`,
      subtitle: 'Graded exposure hierarchy, least to most difficult',
      sections: sorted.map((s, i) => ({
        label: `Rung ${i + 1} · Difficulty ${s.difficulty}/10${s.completed ? ' · Climbed' : ''}`,
        body: s.description,
      })),
    });
  };

  const deleteLadder = (id: string) => {
    const updated = ladders.filter(l => l.id !== id);
    save(updated);
    setLadders(updated);
    if (activeLadderId === id) { setActiveLadderId(null); setView('list'); }
  };

  if (view === 'create') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(62,207,207,0.1)' }}>
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90 transition-all" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🪜</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Build Fear Ladder</h2>
        </div>
        <div className="flex-1 px-4 py-4 space-y-4">
          {/* Fear name */}
          <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#f9741622' }}>
            <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#3C3C3C' }}>Name the fear</p>
            <input
              type="text"
              value={fearName}
              onChange={e => setFearName(e.target.value)}
              placeholder="e.g. Public speaking, driving on highways, calling strangers..."
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #f9741633', caretColor: '#f97316' }}
            />
          </div>

          {/* LANCE instruction */}
          <div className="rounded-2xl p-4 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
            <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
              "Build rungs from least scary to most scary. Start where the anxiety is mild. Each rung should feel achievable if barely. A bad ladder has rungs that are too far apart."
              <span className="ml-1 text-[9px] not-italic" style={{ color: '#3ECFCF' }}>— {NARRATOR.name}</span>
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="rounded-2xl p-4 border" style={{ background: '#FFFFFF', borderColor: difficultyColor(step.difficulty) + '33' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: difficultyColor(step.difficulty) }}>
                    Rung {idx + 1} · Difficulty {step.difficulty}/10
                  </span>
                  {steps.length > 2 && (
                    <button onClick={() => removeStep(idx)} style={{ color: '#ef444466' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={step.description}
                  onChange={e => setSteps(prev => prev.map((s, i) => i === idx ? { ...s, description: e.target.value } : s))}
                  placeholder="Describe this exposure step..."
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none mb-3"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: `1px solid ${difficultyColor(step.difficulty)}22`, caretColor: difficultyColor(step.difficulty) }}
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px]" style={{ color: '#9CA3AF' }}>Difficulty:</span>
                  <input type="range" min={1} max={10} step={1} value={step.difficulty}
                    onChange={e => setSteps(prev => prev.map((s, i) => i === idx ? { ...s, difficulty: parseInt(e.target.value) } : s))}
                    className="flex-1" style={{ accentColor: difficultyColor(step.difficulty) }} />
                  <span className="text-xs font-black w-8 text-right" style={{ color: difficultyColor(step.difficulty) }}>{step.difficulty}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addStep} className="w-full py-3 rounded-2xl font-black text-sm border flex items-center justify-center gap-2"
            style={{ borderColor: '#3ECFCF44', color: '#3ECFCF' }}>
            <Plus className="w-4 h-4" /> Add Rung
          </button>

          <button
            onClick={handleCreate}
            disabled={!fearName.trim() || steps.filter(s => s.description.trim()).length < 2}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', color: '#fff' }}>
            Build Ladder →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'detail' && activeLadder) {
    const allDone = activeLadder.steps.every(s => s.completed);
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
        <ObservatoryBackdrop />
        <RewardMoment show={celebrate} xp={25} praise={praise} onDone={() => setCelebrate(false)} />
        <div className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90 transition-all" style={{ color: '#6B7280' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🪜</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black truncate" style={{ color: '#1C1C1E' }}>{activeLadder.fearName}</h2>
            <p className="text-[10px]" style={{ color: '#6B7280' }}>
              {completedCount}/{activeLadder.steps.length} rungs climbed
            </p>
          </div>
          {/* Progress */}
          <div className="text-xs font-black" style={{ color: completedCount > 0 ? '#7FD98C' : '#6B7280' }}>
            {Math.round((completedCount / activeLadder.steps.length) * 100)}%
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* LANCE intro on new ladder */}
          {completedCount === 0 && (
            <CoachCard speaker="lance" pose="pointing">"{LANCE_LINES_NEW[lanceNewIdx]}"</CoachCard>
          )}

          {/* Celebrated climb */}
          <AnimatePresence>
            {justClimbed && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <CoachCard speaker="chip" pose="celebrating" label={intern.name || 'Chip'}>
                  {INTERN_LINES_CLIMB[internClimbIdx]}
                </CoachCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <GlassPanel className="px-4 py-3">
            <div className="flex justify-between text-[10px] font-black mb-2" style={{ color: '#6B7280' }}>
              <span>Progress</span><span style={{ color: '#7FD98C' }}>{completedCount}/{activeLadder.steps.length}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(156,163,175,0.35)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #7FD98C, #3ECFCF)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / activeLadder.steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </GlassPanel>

          {/* Rungs — the ladder itself: rails connect the rungs, locked rungs sit in mist */}
          <div className="relative">
            {/* Ladder rails */}
            <div aria-hidden className="absolute top-2 bottom-2 pointer-events-none" style={{ left: 26, width: 3, background: 'linear-gradient(180deg, #f9731655, #f9731622)', borderRadius: 2 }} />
            <div aria-hidden className="absolute top-2 bottom-2 pointer-events-none" style={{ right: 26, width: 3, background: 'linear-gradient(180deg, #f9731655, #f9731622)', borderRadius: 2 }} />
            <div className="space-y-3">
          {sortedSteps.map((step, idx) => {
            const prevStepsComplete = sortedSteps.slice(0, idx).every(s => s.completed);
            const isLocked = idx > 0 && !prevStepsComplete;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative rounded-2xl p-4"
                style={{
                  background: step.completed ? 'rgba(232,250,238,0.85)' : isLocked ? 'rgba(243,244,246,0.6)' : 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${step.completed ? '#7FD98C55' : isLocked ? 'rgba(200,205,215,0.5)' : difficultyColor(step.difficulty) + '40'}`,
                  boxShadow: step.completed
                    ? '0 4px 14px rgba(127,217,140,0.25)'
                    : isLocked ? 'none' : `0 4px 14px ${difficultyColor(step.difficulty)}22`,
                  opacity: isLocked ? 0.55 : 1,
                  filter: isLocked ? 'blur(0.4px)' : 'none',
                }}
              >
                {step.completed && (
                  <span aria-hidden className="absolute -top-1.5 right-4 text-sm" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>🚩</span>
                )}
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div className="shrink-0 mt-0.5">
                    {step.completed ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#7FD98C22' }}>
                        <Check className="w-4 h-4" style={{ color: '#7FD98C' }} />
                      </div>
                    ) : isLocked ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#9CA3AF' }}>
                        <Lock className="w-3.5 h-3.5" style={{ color: '#FFFFFF' }} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black"
                        style={{ borderColor: difficultyColor(step.difficulty) + '66', color: difficultyColor(step.difficulty) }}>
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug" style={{ color: step.completed ? '#7FD98C88' : isLocked ? '#9CA3AF99' : '#3C3C3C' }}>
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black" style={{ color: difficultyColor(step.difficulty) + (step.completed ? '66' : '') }}>
                        Difficulty {step.difficulty}/10
                      </span>
                      {step.completedDate && (
                        <span className="text-[9px]" style={{ color: '#7FD98C66' }}>
                          · Climbed {new Date(step.completedDate + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  {!step.completed && !isLocked && (
                    <button
                      onClick={() => climbRung(activeLadder.id, step.id)}
                      className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-90"
                      style={{ background: difficultyColor(step.difficulty) + '22', color: difficultyColor(step.difficulty), border: `1px solid ${difficultyColor(step.difficulty)}44` }}>
                      Climb →
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
            </div>
          </div>

          {allDone && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <GlassPanel className="p-5 text-center" style={{ borderColor: '#7FD98C55' }}>
                <div className="text-5xl mb-2">🏆</div>
                <p className="text-sm font-black" style={{ color: '#7FD98C' }}>Fear Ladder Complete</p>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>You climbed every rung. The fear has new data now.</p>
              </GlassPanel>
            </motion.div>
          )}

          <button onClick={() => downloadLadderPdf(activeLadder)}
            className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{ border: '1px solid #f9741655', color: '#f97316', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}>
            <Download className="w-4 h-4" /> Download as PDF
          </button>

          <button onClick={onBack} className="w-full py-3 rounded-2xl font-black text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.8)', color: '#6B7280', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
      <ObservatoryBackdrop />
      <div className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/fear_ladder.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(249,115,22,0.35)' }} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#1C1C1E' }}>Fear Ladder</h2>
          <p className="text-[10px]" style={{ color: '#6B7280' }}>Graded exposure · Rung by rung</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.8)', color: '#f97316', border: '1px solid #f9731640' }}>+25 XP/rung</div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {ladders.length === 0 ? (
          <div className="space-y-4">
            <CoachCard speaker="lance" pose="smug" label={`${NARRATOR.name} explains`}>
              "Avoidance is the maintenance behavior for fear. Every time you avoid the feared stimulus, you teach your nervous system that avoidance was necessary. The Fear Ladder breaks this loop through graded exposure — starting small, building tolerance rung by rung."
            </CoachCard>
            <EmptyStateCoach
              message="No ladders yet. Name the fear, grade the rungs, and start climbing — I'll be right here."
              ctaLabel="Build Your First Ladder"
              onCta={() => setView('create')}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {ladders.map(l => {
              const done = l.steps.filter(s => s.completed).length;
              const pct = Math.round((done / l.steps.length) * 100);
              return (
                <motion.div
                  key={l.id}
                  role="button"
                  tabIndex={0}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveLadderId(l.id); setView('detail'); }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveLadderId(l.id); setView('detail'); } }}
                  className="w-full p-4 rounded-2xl border text-left cursor-pointer"
                  style={{ background: '#FFFFFF', borderColor: pct === 100 ? '#7FD98C44' : '#f9741622' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🪜</span>
                        <p className="text-sm font-black truncate" style={{ color: pct === 100 ? '#7FD98C' : '#3C3C3C' }}>
                          {l.fearName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px]" style={{ color: '#9CA3AF' }}>
                        <span>{l.steps.length} rungs</span>
                        <span style={{ color: pct === 100 ? '#7FD98C' : '#f97316' }}>{pct}% climbed</span>
                      </div>
                      <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: '#9CA3AF' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#7FD98C' : 'linear-gradient(90deg, #f97316, #ef4444)' }} />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <ChevronLeft className="w-4 h-4 rotate-180" style={{ color: '#9CA3AF' }} />
                      <button
                        onClick={e => { e.stopPropagation(); deleteLadder(l.id); }}
                        aria-label={`Delete ladder ${l.fearName}`}
                        className="p-1 rounded-lg"
                        style={{ color: '#ef444444' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setView('create')}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', color: '#fff' }}>
          <Plus className="w-4 h-4" /> Build New Fear Ladder
        </button>
      </div>
    </div>
  );
}
