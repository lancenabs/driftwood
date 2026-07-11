import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Check, Trash2, ChevronRight } from 'lucide-react';
import { useGame, Goal } from '../LANCEGameContext';
import { INTERN_PERSONALITIES } from '../lanceGameData';
import BigBackButton from '../BigBackButton';
import { GlassPanel, CoachCard, RewardMoment, EmptyStateCoach, pickPraise } from '../ui/GlassKit';

type View = 'list' | 'create' | 'detail';

const GREEN = '#7FD98C';

const LANCE_GOAL_LINES = [
  "Goals are statements of intention. 92% of people never revisit them. I'm watching to see which category you fall into.",
  "Research indicates goals with a written 'why' have 2.5× higher completion rates. This is data, not motivation.",
  "You've created a goal. Now comes the part where most humans either follow through or find a reason not to. I've modeled both outcomes.",
  "Micro-actions compound. James Clear would call this 'atomic habits.' I call it the minimum viable unit of not quitting.",
  "The brain treats a stated goal as already achieved unless paired with daily behavior. You're here, so you know this. Good.",
  "I'm tracking your consistency. Not because I care. Because consistent behavior is the only variable that matters.",
  "Implementation intentions — 'I will do X at Y time' — increase follow-through by 300%. Consider that when logging your action.",
];

const LANCE_ACTION_LINES = [
  "Micro-action logged. Consistency compounds. You didn't hear that from me.",
  "One more data point added. The trend is... not embarrassing. Yet.",
  "Daily action recorded. I've updated your trajectory. It's improved. Marginally.",
  "You showed up again. I've noted this in your file under 'unexpectedly persistent.'",
  "Action logged. The Intern is making that face again. The pleased one. I've muted them.",
];

const LANCE_COMPLETE_GOAL_LINES = [
  "Goal marked complete. +100 XP. I won't say I'm impressed. But the data is... notable.",
  "Completion logged. You set a goal and followed through. Statistically rare. I've updated my model.",
  "Goal achieved. The Intern is doing something celebratory. I'm choosing not to look. Congratulations. There. Done.",
];

const ACTION_PRAISE = [
  'One small action. The terrace grows.',
  'Watered. Roots deepen quietly.',
  'Consistency is the whole trick — and you just did it.',
  'The plant noticed. So did we.',
];
const COMPLETE_PRAISE = [
  'In full bloom. You grew this.',
  'Planted, tended, finished. That was all you.',
  'A goal, completed. The rarest flower on the terrace.',
];

// ── Terraces signature: every goal is a planting that grows with actions ─────
// seed → sprout → seedling → plant → tree; a completed goal blooms.
function growthStage(goal: Goal): { glyph: string; label: string } {
  if (goal.completed) return { glyph: '🌸', label: 'In bloom' };
  const n = goal.actions.length;
  if (n === 0) return { glyph: '🌰', label: 'Seed planted' };
  if (n < 5) return { glyph: '🌱', label: 'Sprouting' };
  if (n < 10) return { glyph: '🌿', label: 'Growing' };
  if (n < 20) return { glyph: '🪴', label: 'Thriving' };
  return { glyph: '🌳', label: 'Deep roots' };
}

function GrowthBadge({ goal, size = 'sm' }: { goal: Goal; size?: 'sm' | 'lg' }) {
  const stage = growthStage(goal);
  const dim = size === 'sm' ? { box: 44, text: 22 } : { box: 76, text: 40 };
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <motion.div
        key={stage.glyph}
        initial={{ scale: 0.5, y: 6 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="rounded-2xl flex items-center justify-center"
        style={{
          width: dim.box, height: dim.box, fontSize: dim.text,
          background: goal.completed ? '#FDF2F8' : `${GREEN}18`,
          border: `1.5px solid ${goal.completed ? '#F9A8D4' : `${GREEN}44`}`,
          boxShadow: `0 4px 12px ${goal.completed ? '#F9A8D455' : `${GREEN}33`}`,
        }}
        aria-label={stage.label}
      >
        {stage.glyph}
      </motion.div>
      {size === 'lg' && (
        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: goal.completed ? '#EC4899' : GREEN }}>
          {stage.label}
        </span>
      )}
    </div>
  );
}

function TerracesBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/habit.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.38,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.88) 0%, rgba(247,248,250,0.93) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
    </>
  );
}

function daysRemaining(targetDate: string): number {
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function getActionStreak(actions: Goal['actions']): number {
  if (actions.length === 0) return 0;
  const sorted = [...actions].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  for (const action of sorted) {
    const actionDate = new Date(action.date);
    actionDate.setHours(0, 0, 0, 0);
    const diff = (checkDate.getTime() - actionDate.getTime()) / 86400000;
    if (diff <= 1) {
      streak++;
      checkDate = actionDate;
    } else {
      break;
    }
  }
  return streak;
}

interface Props {
  onBack: () => void;
}

// ─── Goal Card ────────────────────────────────────────────────────────────────
function GoalCard({ goal, onSelect }: { goal: Goal; onSelect: () => void }) {
  const today = new Date().toISOString().split('T')[0];
  const loggedToday = goal.actions.some(a => a.date === today);
  const streak = getActionStreak(goal.actions);
  const days = daysRemaining(goal.targetDate);

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="w-full text-left rounded-3xl p-4 transition-all"
      style={{
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: `1.5px solid ${goal.completed ? '#F9A8D466' : loggedToday ? `${GREEN}66` : 'rgba(255,255,255,0.95)'}`,
        boxShadow: `0 6px 20px ${goal.completed ? '#F9A8D42E' : `${GREEN}26`}, 0 2px 8px rgba(0,0,0,0.04)`,
      }}
    >
      <div className="flex items-start gap-3">
        <GrowthBadge goal={goal} />
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-black truncate mb-0.5"
            style={{
              color: goal.completed ? '#9CA3AF' : '#3C3C3C',
              textDecoration: goal.completed ? 'line-through' : 'none',
            }}
          >
            {goal.title}
          </h3>
          <p className="text-[10px] font-medium line-clamp-1 mb-1.5" style={{ color: '#9CA3AF' }}>
            "{goal.why}"
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {streak > 0 && (
              <span className="text-[10px] font-black" style={{ color: '#f97316' }}>🔥 {streak}d</span>
            )}
            {!goal.completed && (
              <span
                className="text-[10px] font-bold"
                style={{ color: days < 0 ? '#ef4444' : days <= 3 ? '#f97316' : '#9CA3AF' }}
              >
                {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
              </span>
            )}
            <span className="text-[10px]" style={{ color: '#9CA3AF' }}>
              {goal.actions.length} action{goal.actions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {!goal.completed && (
            <div
              className="px-2 py-1 rounded-full text-[9px] font-black"
              style={{
                background: loggedToday ? `${GREEN}22` : 'rgba(255,255,255,0.7)',
                border: `1px solid ${loggedToday ? GREEN : '#E5E7EB'}`,
                color: loggedToday ? '#4B9E63' : '#9CA3AF',
              }}
            >
              {loggedToday ? '✓ watered' : 'water today'}
            </div>
          )}
          <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GoalJournal({ onBack }: Props) {
  const { goals, addGoal, logGoalAction, completeGoal, deleteGoal, intern } = useGame();
  const internPersonality = INTERN_PERSONALITIES.find(p => p.id === intern.personalityId);

  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newWhy, setNewWhy] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [todayAction, setTodayAction] = useState('');
  const [justLogged, setJustLogged] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [celebrateAction, setCelebrateAction] = useState(false);
  const [celebrateComplete, setCelebrateComplete] = useState(false);
  const [actionPraise] = useState(() => pickPraise(ACTION_PRAISE));
  const [completePraise] = useState(() => pickPraise(COMPLETE_PRAISE));

  const [lanceLine] = useState(() => LANCE_GOAL_LINES[Math.floor(Math.random() * LANCE_GOAL_LINES.length)]);
  const [lanceActionLine] = useState(() => LANCE_ACTION_LINES[Math.floor(Math.random() * LANCE_ACTION_LINES.length)]);
  const [lanceCompleteLine] = useState(() => LANCE_COMPLETE_GOAL_LINES[Math.floor(Math.random() * LANCE_COMPLETE_GOAL_LINES.length)]);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const selectedGoal = goals.find(g => g.id === selectedId) ?? null;
  const today = new Date().toISOString().split('T')[0];
  const loggedToday = selectedGoal?.actions.some(a => a.date === today) ?? false;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleCreateGoal = () => {
    if (!newTitle.trim() || !newWhy.trim() || !newTargetDate) return;
    addGoal({ title: newTitle.trim(), why: newWhy.trim(), targetDate: newTargetDate });
    setNewTitle('');
    setNewWhy('');
    setNewTargetDate('');
    setView('list');
  };

  const handleLogAction = () => {
    if (!selectedId || !todayAction.trim()) return;
    logGoalAction(selectedId, todayAction.trim());
    setTodayAction('');
    setJustLogged(true);
    setCelebrateAction(true);
  };

  const handleCompleteGoal = () => {
    if (!selectedId) return;
    completeGoal(selectedId);
    setJustCompleted(true);
    setCelebrateComplete(true);
  };

  const handleDeleteGoal = () => {
    if (!selectedId) return;
    deleteGoal(selectedId);
    setView('list');
    setSelectedId(null);
    setConfirmDelete(false);
  };

  // ── List View ──
  if (view === 'list') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
        <TerracesBackdrop />
        <div
          className="relative sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
        >
          <BigBackButton onBack={onBack} />
          <img src="/icons/goal_journal.webp" alt="" draggable={false}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            style={{ width: 34, height: 34, borderRadius: 10, boxShadow: `0 4px 10px ${GREEN}44` }} />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black leading-none truncate" style={{ color: '#1C1C1E' }}>Goal Journal</h2>
            <div className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: '#6B7280' }}>Your terrace · one small action a day</div>
          </div>
          <button
            onClick={() => setView('create')}
            aria-label="New goal"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, #3ECFCF)`, color: '#FFF',
              boxShadow: `0 3px 0 #4B9E63AA, 0 6px 14px ${GREEN}55`,
            }}
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
          <CoachCard speaker="lance" pose="pointing">"{lanceLine}"</CoachCard>

          {goals.length === 0 ? (
            <GlassPanel className="py-2">
              <EmptyStateCoach
                message="This terrace is empty — plant your first goal. Write why it matters, then water it with one small action a day."
                ctaLabel="Plant First Goal"
                onCta={() => setView('create')}
              />
            </GlassPanel>
          ) : (
            <>
              {activeGoals.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[9px] font-black uppercase tracking-widest px-1" style={{ color: '#6B7280' }}>
                    Growing now
                  </div>
                  {activeGoals.map(g => (
                    <React.Fragment key={g.id}>
                      <GoalCard
                        goal={g}
                        onSelect={() => { setSelectedId(g.id); setJustLogged(false); setJustCompleted(false); setView('detail'); }}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}

              {completedGoals.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[9px] font-black uppercase tracking-widest px-1" style={{ color: '#6B7280' }}>
                    In bloom 🌸
                  </div>
                  {completedGoals.map(g => (
                    <React.Fragment key={g.id}>
                      <GoalCard
                        goal={g}
                        onSelect={() => { setSelectedId(g.id); setView('detail'); }}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Create View ──
  if (view === 'create') {
    const canCreate = newTitle.trim().length > 2 && newWhy.trim().length > 5 && newTargetDate !== '';
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
        <TerracesBackdrop />
        <div
          className="relative shrink-0 px-4 py-4 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
        >
          <button onClick={() => setView('list')} className="p-2 rounded-xl" style={{ color: '#9CA3AF' }} aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-black">Plant a New Goal 🌰</h2>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <GlassPanel solid className="p-5 space-y-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
                What's the goal?
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Run a 5K. Write the book. Sleep before midnight..."
                maxLength={60}
                aria-label="Goal title"
                className="w-full bg-transparent text-sm font-bold outline-none"
                style={{ color: '#3C3C3C', caretColor: GREEN }}
                autoFocus
              />
            </div>

            <div className="border-t" style={{ borderColor: `${GREEN}22` }} />

            <div>
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
                Why does this matter to you?
              </div>
              <textarea
                value={newWhy}
                onChange={e => setNewWhy(e.target.value)}
                rows={3}
                placeholder="The real reason — not the logical one, the emotional one..."
                aria-label="Why this goal matters"
                className="w-full bg-transparent text-sm font-medium outline-none resize-none"
                style={{ color: '#3C3C3C', caretColor: GREEN }}
              />
            </div>

            <div className="border-t" style={{ borderColor: `${GREEN}22` }} />

            <div>
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
                Target date
              </div>
              <input
                type="date"
                value={newTargetDate}
                onChange={e => setNewTargetDate(e.target.value)}
                min={minDateStr}
                aria-label="Target date"
                className="w-full bg-transparent text-sm font-bold outline-none"
                style={{ color: newTargetDate ? '#3C3C3C' : '#9CA3AF', caretColor: GREEN }}
              />
            </div>
          </GlassPanel>

          <CoachCard speaker="lance" pose="thinking">
            "Goals with a written 'why' have 2.5× higher completion rates. You're already ahead statistically."
          </CoachCard>
        </div>

        <div
          className="relative shrink-0 px-4 pb-6 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <button
            onClick={handleCreateGoal}
            disabled={!canCreate}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40 transition-opacity"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, #3ECFCF)`, color: '#FFF',
              boxShadow: canCreate ? `0 3px 0 #4B9E63AA, 0 8px 18px ${GREEN}45` : 'none',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
            }}
          >
            Plant This Goal 🌱
          </button>
        </div>
      </div>
    );
  }

  // ── Detail View ──
  if (!selectedGoal) {
    setView('list');
    return null;
  }

  const streak = getActionStreak(selectedGoal.actions);
  const days = daysRemaining(selectedGoal.targetDate);
  const recentActions = [...selectedGoal.actions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <TerracesBackdrop />
      <RewardMoment show={celebrateAction} xp={15} praise={actionPraise} onDone={() => setCelebrateAction(false)} />
      <RewardMoment show={celebrateComplete} xp={100} praise={completePraise} onDone={() => setCelebrateComplete(false)} />
      <div
        className="relative shrink-0 px-4 py-4 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}
      >
        <button
          onClick={() => { setView('list'); setSelectedId(null); setJustLogged(false); setJustCompleted(false); setConfirmDelete(false); }}
          className="p-2 rounded-xl"
          style={{ color: '#9CA3AF' }}
          aria-label="Back to goals"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: selectedGoal.completed ? GREEN : '#9CA3AF' }}>
            {selectedGoal.completed ? 'Completed ✓' : growthStage(selectedGoal).label}
          </div>
          <h2 className="text-sm font-black truncate leading-none" style={{ color: '#3C3C3C' }}>
            {selectedGoal.title}
          </h2>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
        {/* Goal header card — the plant front and center */}
        <GlassPanel className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <GrowthBadge goal={selectedGoal} size="lg" />
            <div className="flex-1 text-xs font-medium italic" style={{ color: '#6B7280' }}>
              "{selectedGoal.why}"
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.65)' }}>
              <div className="text-xl font-black" style={{ color: '#f97316' }}>{streak}</div>
              <div className="text-[9px]" style={{ color: '#9CA3AF' }}>day streak</div>
            </div>
            <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.65)' }}>
              <div
                className="text-xl font-black"
                style={{ color: days < 0 ? '#ef4444' : days <= 3 ? '#f97316' : GREEN }}
              >
                {Math.abs(days)}
              </div>
              <div className="text-[9px]" style={{ color: '#9CA3AF' }}>
                {days < 0 ? 'days over' : 'days left'}
              </div>
            </div>
            <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.65)' }}>
              <div className="text-xl font-black" style={{ color: '#3ECFCF' }}>{selectedGoal.actions.length}</div>
              <div className="text-[9px]" style={{ color: '#9CA3AF' }}>waterings</div>
            </div>
          </div>
        </GlassPanel>

        {/* Completed state */}
        <AnimatePresence>
          {(justCompleted || selectedGoal.completed) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassPanel className="p-5 text-center space-y-2" style={{ border: '2px solid #F9A8D466' }}>
                <div className="text-4xl">🌸</div>
                <div className="text-sm font-black" style={{ color: '#EC4899' }}>In Full Bloom — Goal Complete!</div>
                <div className="text-xs" style={{ color: '#9CA3AF' }}>+100 XP awarded</div>
                <p className="text-xs italic" style={{ color: '#4B9E63' }}>
                  {internPersonality?.sampleMessages[2] || "You set this goal and you followed through. That's not small."}
                </p>
                <p className="text-xs italic mt-2" style={{ color: '#9CA3AF' }}>"{lanceCompleteLine}"</p>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log today's action */}
        {!selectedGoal.completed && (
          <AnimatePresence mode="wait">
            {justLogged ? (
              <motion.div
                key="logged"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GlassPanel className="p-5 space-y-3" style={{ border: `1.5px solid ${GREEN}55` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{intern.avatar}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: GREEN }}>
                      {intern.name || 'Intern'}
                    </span>
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#4B9E63' }}>
                    {internPersonality?.sampleMessages[0] || "You showed up today. That's everything."}
                  </p>
                  <p className="text-xs italic" style={{ color: '#9CA3AF' }}>"{lanceActionLine}"</p>
                </GlassPanel>
              </motion.div>
            ) : loggedToday ? (
              <motion.div
                key="already-logged"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <GlassPanel className="p-4 text-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black"
                    style={{ background: `${GREEN}22`, color: '#4B9E63' }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Watered today — come back tomorrow
                  </div>
                </GlassPanel>
              </motion.div>
            ) : (
              <motion.div
                key="log-action"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassPanel className="p-5 space-y-3">
                  <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#4B9E63' }}>
                    Water it — today's micro-action
                  </div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    What one small thing did you do toward this goal today?
                  </p>
                  <textarea
                    value={todayAction}
                    onChange={e => setTodayAction(e.target.value)}
                    rows={2}
                    placeholder="Even something small counts — 5 minutes, one step, one choice..."
                    aria-label="Today's micro-action"
                    className="w-full bg-transparent text-sm font-medium outline-none resize-none"
                    style={{ color: '#3C3C3C', caretColor: GREEN }}
                  />
                  <button
                    onClick={handleLogAction}
                    disabled={todayAction.trim().length < 3}
                    className="w-full py-3 rounded-2xl font-black text-sm disabled:opacity-40"
                    style={{
                      background: `linear-gradient(135deg, ${GREEN}, #3ECFCF)`, color: '#FFF',
                      boxShadow: `0 3px 0 #4B9E63AA, 0 6px 14px ${GREEN}40`,
                      textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                    }}
                  >
                    💧 Log Action +15 XP
                  </button>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Action history */}
        {recentActions.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] font-black uppercase tracking-widest px-1" style={{ color: '#6B7280' }}>
              Recent waterings
            </div>
            {recentActions.map((action, i) => (
              <div
                key={i}
                className="rounded-2xl px-4 py-3 text-xs"
                style={{
                  background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.9)',
                }}
              >
                <div className="font-bold mb-0.5" style={{ color: '#4B9E63' }}>
                  {new Date(action.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="font-medium" style={{ color: '#6B7280' }}>{action.note}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom actions */}
        {!selectedGoal.completed && (
          <div className="space-y-2 pt-2">
            {!confirmDelete ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCompleteGoal}
                  className="flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5"
                  style={{ border: `1.5px solid ${GREEN}55`, color: '#4B9E63', background: 'rgba(255,255,255,0.7)' }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark Complete 🌸
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Delete goal"
                  className="py-3 px-4 rounded-2xl"
                  style={{ border: '1.5px solid #ef444433', color: '#ef4444', background: 'rgba(255,255,255,0.7)' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="rounded-2xl p-4 text-center space-y-3"
                style={{ background: 'rgba(254,242,242,0.92)', border: '1.5px solid #FCA5A5' }}
              >
                <p className="text-xs font-bold" style={{ color: '#B91C1C' }}>Delete this goal?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-black"
                    style={{ border: '1px solid #E5E7EB', color: '#6B7280', background: '#FFF' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteGoal}
                    className="flex-1 py-2 rounded-xl text-xs font-black"
                    style={{ background: '#ef4444', color: '#fff' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
