import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Check, Trash2 } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

type ActivityCategory = 'pleasure' | 'mastery' | 'social' | 'physical' | 'rest';
type ActivityDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface BAActivity {
  id: string;
  name: string;
  category: ActivityCategory;
  scheduledDay: ActivityDay;
  why?: string;
  completed: boolean;
  completedDate?: string;
  createdDate: string;
}

const STORAGE_KEY = 'lance_ba_v1';
function load(): BAActivity[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(a: BAActivity[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); }

const CATEGORIES: Record<ActivityCategory, { label: string; emoji: string; color: string; examples: string }> = {
  pleasure: { label: 'Pleasure', emoji: '🎉', color: '#f97316', examples: 'Music, nature, cooking, games, art' },
  mastery: { label: 'Mastery', emoji: '🎯', color: '#8B5CF6', examples: 'Learning, projects, creative work, skills' },
  social: { label: 'Social', emoji: '🤝', color: '#3ECFCF', examples: 'Calls, visits, messages, groups' },
  physical: { label: 'Physical', emoji: '💪', color: '#7FD98C', examples: 'Walk, workout, yoga, dance, sport' },
  rest: { label: 'Rest', emoji: '🛋️', color: '#60a5fa', examples: 'Reading, bath, nap, quiet time' },
};
const DAYS: ActivityDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const LANCE_LINES = [
  "Activity logged complete. Behavioral activation works because motivation is a feeling that follows behavior — not the other way around. You tested that hypothesis correctly.",
  "Completion recorded. The behavioral model of depression is empirically robust. You've demonstrated the intervention. I'm noting the result.",
  "Recorded. You didn't wait for motivation. You generated it. That's the mechanism. That's the whole point.",
  "Filed. Behavioral activation has a 60–80% efficacy rate in moderate depression. You've contributed to your own data set.",
];
const LANCE_PLAN_LINES = [
  "Activity scheduled. The act of planning is itself an activation — you've pre-committed the behavior, which increases follow-through probability by approximately 40%.",
  "Logged. Implementation intentions — 'when X, I will do Y' — are one of the most effective behavioral change tools documented. You've created one.",
  "Plan filed. Scheduling the activity removes a decision-making step at execution time. Correct approach.",
];
const INTERN_LINES = [
  "You did the thing even when you didn't feel like it. That's the whole intervention and you nailed it. Motivation followed, didn't it?",
  "Checking that off is such a big deal. Behavioral activation is hard because the very thing depression steals is your ability to start. You started anyway.",
  "Look at you going. This is how you break the cycle — one small completed thing at a time.",
  "I am so proud of you for following through. That wasn't nothing. That was everything.",
];

interface Props { onBack: () => void; }

export default function BehavioralActivation({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [activities, setActivities] = useState<BAActivity[]>(load);
  const [view, setView] = useState<'list' | 'add' | 'celebrate'>('list');
  const [justCompleted, setJustCompleted] = useState<BAActivity | null>(null);
  // Add form
  const [actName, setActName] = useState('');
  const [actCategory, setActCategory] = useState<ActivityCategory>('pleasure');
  const [actDay, setActDay] = useState<ActivityDay>('Mon');
  const [actWhy, setActWhy] = useState('');
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));
  const [lancePlanIdx] = useState(() => Math.floor(Math.random() * LANCE_PLAN_LINES.length));

  const today = new Date().toLocaleDateString('en', { weekday: 'short' }) as ActivityDay;
  const todayActivities = activities.filter(a => a.scheduledDay === today);
  const upcomingActivities = activities.filter(a => a.scheduledDay !== today && !a.completed);
  const completedActivities = activities.filter(a => a.completed);

  const handleAdd = () => {
    if (!actName.trim()) return;
    const activity: BAActivity = {
      id: `ba_${Date.now()}`,
      name: actName.trim(),
      category: actCategory,
      scheduledDay: actDay,
      why: actWhy.trim() || undefined,
      completed: false,
      createdDate: new Date().toISOString().split('T')[0],
    };
    const updated = [activity, ...activities];
    save(updated);
    setActivities(updated);
    addXp(15);
    setActName('');
    setActWhy('');
    setView('list');
  };

  const handleComplete = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = activities.map(a =>
      a.id === id ? { ...a, completed: true, completedDate: today } : a
    );
    save(updated);
    setActivities(updated);
    addXp(25);
    const completed = updated.find(a => a.id === id)!;
    setJustCompleted(completed);
    setView('celebrate');
  };

  const handleDelete = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    save(updated);
    setActivities(updated);
  };

  if (view === 'celebrate' && justCompleted) {
    const cat = CATEGORIES[justCompleted.category];
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/habit.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90 transition-all" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">📆</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Behavioral Activation</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="rounded-3xl p-5 border text-center" style={{ background: '#FFFFFF', borderColor: cat.color + '33' }}>
              <div className="text-5xl mb-2">{cat.emoji}</div>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: cat.color }}>Completed</p>
              <p className="text-sm font-bold" style={{ color: '#3C3C3C' }}>{justCompleted.name}</p>
              <p className="text-[10px] mt-1" style={{ color: '#9CA3AF' }}>{cat.label} activity</p>
              <div className="text-[10px] font-black mt-2" style={{ color: '#7FD98C' }}>+25 XP earned</div>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
              <div className="flex items-center gap-2 mb-3">
                <LanceAvatar emotion="reluctant_approval" size="sm" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} notes</span>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: '#9CA3AF' }}>"{LANCE_LINES[lanceIdx]}"</p>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#7FD98C44' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{intern.avatar}</span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#7FD98C' }}>{INTERN_LINES[internIdx]}</p>
            </div>
            <button onClick={() => setView('list')} className="w-full py-4 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)', color: '#F9FAFB' }}>
              ← Back to Schedule
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90 transition-all" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">📆</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Schedule Activity</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-2xl p-4 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
            <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
              "Schedule the activity first. Do not wait for motivation — it follows action, never precedes it."
              <span className="ml-1 text-[9px] not-italic" style={{ color: '#3ECFCF' }}>— {NARRATOR.name}</span>
            </p>
          </div>

          {/* Activity name */}
          <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#7FD98C22' }}>
            <p className="text-xs font-black mb-2" style={{ color: '#3C3C3C' }}>Activity name</p>
            <input type="text" value={actName} onChange={e => setActName(e.target.value)}
              placeholder="e.g. 30-min walk, call a friend, work on painting..."
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #7FD98C22', caretColor: '#7FD98C' }} />
          </div>

          {/* Category */}
          <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#7FD98C22' }}>
            <p className="text-xs font-black mb-3" style={{ color: '#3C3C3C' }}>Category</p>
            <div className="space-y-2">
              {(Object.entries(CATEGORIES) as [ActivityCategory, typeof CATEGORIES[ActivityCategory]][]).map(([key, cat]) => (
                <button key={key} onClick={() => setActCategory(key)}
                  className="w-full p-3 rounded-xl border text-left transition-all active:scale-[0.98]"
                  style={{ background: actCategory === key ? cat.color + '22' : '#F9FAFB', borderColor: actCategory === key ? cat.color : '#9CA3AF' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.emoji}</span>
                    <div>
                      <div className="text-xs font-black" style={{ color: actCategory === key ? cat.color : '#3C3C3C' }}>{cat.label}</div>
                      <div className="text-[9px]" style={{ color: '#9CA3AF99' }}>{cat.examples}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Day */}
          <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#7FD98C22' }}>
            <p className="text-xs font-black mb-3" style={{ color: '#3C3C3C' }}>Schedule for</p>
            <div className="flex gap-1.5 flex-wrap">
              {DAYS.map(d => (
                <button key={d} onClick={() => setActDay(d)}
                  className="flex-1 py-2.5 rounded-xl font-black text-xs transition-all min-w-0"
                  style={{
                    background: actDay === d ? '#7FD98C22' : '#F9FAFB',
                    border: `1px solid ${actDay === d ? '#7FD98C' : '#9CA3AF'}`,
                    color: actDay === d ? '#7FD98C' : '#9CA3AF',
                  }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Why it matters — anchors the activity to a value, not a mood */}
          <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#3ECFCF22' }}>
            <p className="text-xs font-black mb-1" style={{ color: '#3C3C3C' }}>Why it matters <span className="font-medium" style={{ color: '#9CA3AF' }}>(the value behind it)</span></p>
            <p className="text-[11px] mb-2 leading-relaxed" style={{ color: '#9CA3AF' }}>Tie it to what you care about — not how you feel. This is what makes you do it even on a low day.</p>
            <textarea value={actWhy} onChange={e => setActWhy(e.target.value)} rows={2}
              placeholder="I'm doing this because I value..."
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #3ECFCF22', caretColor: '#3ECFCF' }} />
          </div>

          <button onClick={handleAdd} disabled={!actName.trim()}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)', color: '#F9FAFB' }}>
            Schedule It (+15 XP)
          </button>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">📆</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Behavioral Activation</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Schedule it. Do it. Motivation follows.</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#7FD98C22', color: '#7FD98C' }}>+25 XP</div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {activities.length === 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
            <div className="flex items-start gap-3">
              <LanceAvatar emotion="superior" size="sm" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide mb-1" style={{ color: '#3ECFCF' }}>{NARRATOR.name} explains</p>
                <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
                  "Depression is maintained by inactivity. Behavioral activation breaks the cycle by scheduling behaviors that generate positive reinforcement — whether you feel like doing them or not. The feelings follow. Start with one. Schedule it. Do it."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Today */}
        {todayActivities.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>
              Today ({today})
            </div>
            {todayActivities.map(a => {
              const cat = CATEGORIES[a.category];
              return (
                <motion.div key={a.id} layout className="rounded-2xl p-4 border"
                  style={{ background: a.completed ? '#7FD98C11' : cat.color + '11', borderColor: a.completed ? '#7FD98C44' : cat.color + '33' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: a.completed ? '#7FD98C88' : '#3C3C3C', textDecoration: a.completed ? 'line-through' : 'none' }}>
                        {a.name}
                      </p>
                      <p className="text-[9px]" style={{ color: cat.color + (a.completed ? '55' : '') }}>{cat.label}</p>
                    </div>
                    {!a.completed ? (
                      <button onClick={() => handleComplete(a.id)}
                        className="px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all active:scale-90"
                        style={{ background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}>
                        <Check className="w-3 h-3" /> Done
                      </button>
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#7FD98C22' }}>
                        <Check className="w-4 h-4" style={{ color: '#7FD98C' }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Upcoming */}
        {upcomingActivities.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
              Upcoming
            </div>
            {upcomingActivities.map(a => {
              const cat = CATEGORIES[a.category];
              return (
                <div key={a.id} className="rounded-2xl p-3 border flex items-center gap-3"
                  style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
                  <span className="text-lg">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: '#3C3C3C' }}>{a.name}</p>
                    <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{cat.label} · {a.scheduledDay}</p>
                    {a.why && <p className="text-[10px] italic mt-0.5" style={{ color: '#3ECFCF' }}>Because {a.why}</p>}
                  </div>
                  <button onClick={() => handleDelete(a.id)} style={{ color: '#ef444444' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {completedActivities.length > 0 && (
          <div className="rounded-2xl p-3 border" style={{ background: '#FFFFFF', borderColor: '#7FD98C22' }}>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: '#9CA3AF' }}>Completed this week</span>
              <span className="font-black" style={{ color: '#7FD98C' }}>{completedActivities.length} activities</span>
            </div>
          </div>
        )}

        {activities.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>No activities scheduled</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Don't wait for the feeling. Schedule first.</p>
          </div>
        )}

        <button onClick={() => setView('add')}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)', color: '#F9FAFB' }}>
          <Plus className="w-4 h-4" /> Schedule Activity
        </button>
      </div>
    </div>
  );
}
