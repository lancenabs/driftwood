import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageSquare, Check } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface Scenario {
  id: string;
  title: string;
  role: string;
  emoji: string;
  context: string;
  lanceOpening: string;
  skillFocus: 'GIVE' | 'DEAR MAN' | 'FAST';
  checkpoints: string[];
  lanceEvaluation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'coworker',
    title: 'The Passive-Aggressive Coworker',
    role: 'LANCE plays a coworker',
    emoji: '💼',
    context: 'Your coworker consistently takes credit for your ideas in meetings and gives backhanded compliments. You need to address it.',
    lanceOpening: "Oh, that project you presented? I actually suggested that approach three weeks ago in a different context. Not saying it was my idea. Just... noting the overlap. Anyway, great execution on your part.",
    skillFocus: 'DEAR MAN',
    checkpoints: [
      'D — Described the specific behavior (not character attack)',
      'E — Expressed feelings using "I" statements',
      'A — Asserted a clear, specific request',
      'R — Reinforced why this benefits both of you',
      'M — Stayed mindful of your goal (not to win, to resolve)',
    ],
    lanceEvaluation: "DEAR MAN requires describing behavior, not character. 'You always undermine me' lands differently than 'In the last two meetings, I noticed X.' The former puts them on defense. The latter gives them somewhere to move. Did your response describe the behavior or the person?",
  },
  {
    id: 'parent',
    title: 'The Critical Parent',
    role: 'LANCE plays a parent',
    emoji: '👨‍👩‍👧',
    context: "Your parent regularly criticizes your life choices — job, relationships, lifestyle — framed as 'just trying to help.' You want to set a boundary without damaging the relationship.",
    lanceOpening: "I'm not criticizing, I just think you could be doing better. When I was your age, I had already [achievement]. I just worry about you. Is it so wrong to care about your future?",
    skillFocus: 'GIVE',
    checkpoints: [
      'G — Gentle approach (no attacks, no threats, no judgment)',
      'I — Interested (acknowledged their perspective before asserting yours)',
      'V — Validated their feeling without agreeing with their behavior',
      'E — Easy manner (light touch, non-aggressive tone)',
    ],
    lanceEvaluation: "With a parent, the GIVE skill matters more than DEAR MAN. Their criticism often comes from genuine love expressed through an inappropriate channel. Validation — 'I know you care about me' — isn't agreement. It's acknowledging the feeling underneath the behavior. Did you validate before asserting?",
  },
  {
    id: 'partner',
    title: 'The Defensive Partner',
    role: 'LANCE plays a partner',
    emoji: '💑',
    context: "You've been feeling disconnected. When you try to bring it up, your partner gets defensive and says you're always complaining. You want to have a real conversation.",
    lanceOpening: "Here we go again. You always have a problem with something. Can't we just have one normal night? Why do you always have to bring this stuff up?",
    skillFocus: 'GIVE',
    checkpoints: [
      'G — Gentle (no Gottman Four Horsemen: criticism, contempt, defensiveness, stonewalling)',
      'I — Stayed interested and curious, not reactive',
      'V — Validated their frustration before sharing yours',
      'E — Easy manner even when it was hard',
    ],
    lanceEvaluation: "When a partner gets defensive, escalation is the worst available response. The Gottman Four Horsemen enter when both people go defensive simultaneously. Staying curious — 'I can hear that feels like a lot' — keeps you in the game. Did your response lower the temperature or raise it?",
  },
  {
    id: 'friend',
    title: 'The Friend Who Cancelled Again',
    role: 'LANCE plays a friend',
    emoji: '🤝',
    context: "A close friend has cancelled on you 4 times in the last two months, always with a vague excuse. You're hurt and starting to pull back. You want to address it without losing the friendship.",
    lanceOpening: "Hey, I'm so sorry about Saturday. Something just came up and I completely forgot about our plans. We should reschedule! You're not upset, right?",
    skillFocus: 'DEAR MAN',
    checkpoints: [
      'D — Described the pattern (not just the most recent instance)',
      'E — Expressed the impact using "I feel" language',
      'A — Made a specific, doable request for the future',
      'R — Named what you value about the friendship',
      'N — Negotiated — left room for their perspective',
    ],
    lanceEvaluation: "This one requires naming the pattern, not just the incident. 'I felt hurt Saturday' addresses one event. 'I've noticed this has happened four times — I'm starting to wonder if I should pull back' addresses the pattern. Which did your response target? And did you name what the friendship means to you?",
  },
];

const STORAGE_KEY = 'lance_commlab_v1';

export default function CommunicationLab({ onBack }: { onBack: () => void }) {
  const { intern, addXp } = useGame();
  const [screen, setScreen] = useState<'select' | 'context' | 'respond' | 'debrief'>('select');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [response, setResponse] = useState('');
  const [checked, setChecked] = useState<boolean[]>([]);
  const [debriefed, setDebriefed] = useState(false);

  const startScenario = (s: Scenario) => {
    setScenario(s);
    setResponse('');
    setChecked(new Array(s.checkpoints.length).fill(false));
    setDebriefed(false);
    setScreen('context');
  };

  const handleDebrief = () => {
    if (!scenario) return;
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    prev.push({ date: new Date().toISOString(), scenarioId: scenario.id, response, checks: checked });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
    addXp(35);
    setDebriefed(true);
    setScreen('debrief');
  };

  const checkedCount = checked.filter(Boolean).length;

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/relational.webp)',
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
        {screen === 'select' ? (
          <BigBackButton onBack={onBack} />
        ) : (
          <button onClick={() => setScreen('select')}
            className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <MessageSquare className="w-5 h-5" style={{ color: '#60A5FA' }} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Communication Lab</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>
            {scenario ? `${scenario.skillFocus} · ${scenario.title}` : 'Practice hard conversations with LANCE'}
          </p>
        </div>
      </div>

      <div className="px-4 py-4">
        <AnimatePresence mode="wait">

          {/* SCENARIO SELECT */}
          {screen === 'select' && (
            <motion.div key="select" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA44' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="smug" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#60A5FA' }}>{NARRATOR.name} on communication</span>
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF' }}>
                  "I will play the difficult person. You will practice the response. I am, statistically, more difficult than most people you encounter — so anything that works on me will work on them. Choose your scenario."
                </p>
              </div>

              <div className="space-y-3">
                {SCENARIOS.map(s => (
                  <motion.button key={s.id} whileTap={{ scale: 0.98 }}
                    onClick={() => startScenario(s)}
                    className="w-full text-left rounded-3xl p-5 border transition-all"
                    style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA22' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black" style={{ color: '#3C3C3C' }}>{s.title}</div>
                        <div className="text-[10px] font-bold mt-0.5" style={{ color: '#60A5FA' }}>
                          {s.role} · Focus: {s.skillFocus}
                        </div>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9CA3AF' }}>{s.context}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: '#60A5FA' }} />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>
                  These are real situations. LANCE is going to play the difficult role seriously — and then debrief your response using the actual skill framework. Pick the one that's most alive for you right now.
                </p>
              </div>
            </motion.div>
          )}

          {/* CONTEXT */}
          {screen === 'context' && scenario && (
            <motion.div key="context" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA44' }}>
                <div className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: '#60A5FA' }}>The Situation</div>
                <p className="text-xs leading-relaxed" style={{ color: '#3C3C3C' }}>{scenario.context}</p>
              </div>

              <div className="rounded-3xl p-5 border" style={{ background: '#EFF6FF', borderColor: '#60A5FA66' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="smug" size="sm" />
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#2563EB' }}>
                      {NARRATOR.name} ({scenario.role.replace('LANCE plays a ', '')})
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-medium italic" style={{ color: '#1E3A5F' }}>
                  "{scenario.lanceOpening}"
                </p>
              </div>

              <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA22' }}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>Your skill focus</div>
                <div className="text-sm font-black" style={{ color: '#3C3C3C' }}>{scenario.skillFocus}</div>
                <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  {scenario.skillFocus === 'DEAR MAN' && 'Describe · Express · Assert · Reinforce · Mindful · Appear confident · Negotiate'}
                  {scenario.skillFocus === 'GIVE' && 'Gentle · Interested · Validate · Easy manner'}
                  {scenario.skillFocus === 'FAST' && 'Fair · Apologies only when warranted · Stick to values · Truthful'}
                </div>
              </div>

              <button onClick={() => setScreen('respond')}
                className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', color: '#fff' }}>
                Draft My Response →
              </button>
            </motion.div>
          )}

          {/* RESPOND */}
          {screen === 'respond' && scenario && (
            <motion.div key="respond" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {/* LANCE line */}
              <div className="rounded-3xl p-4 border" style={{ background: '#EFF6FF', borderColor: '#60A5FA33' }}>
                <div className="flex items-center gap-2 mb-2">
                  <LanceAvatar emotion="smug" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#2563EB' }}>{NARRATOR.name} said</span>
                </div>
                <p className="text-xs italic leading-relaxed" style={{ color: '#1E3A5F' }}>"{scenario.lanceOpening}"</p>
              </div>

              {/* Response textarea */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA44' }}>
                <div className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#60A5FA' }}>Your response</div>
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  rows={6}
                  placeholder={`Write what you would actually say. Use the ${scenario.skillFocus} framework as a guide...\n\nWrite it out fully — not what you wish you'd said, what you'd actually say in this moment.`}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none leading-relaxed"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #60A5FA22', caretColor: '#60A5FA' }}
                />
              </div>

              {/* Self-evaluation checkpoints */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA22' }}>
                <div className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#60A5FA' }}>
                  Self-Check: Does my response include...
                </div>
                <div className="space-y-2">
                  {scenario.checkpoints.map((point, i) => (
                    <motion.button key={i} whileTap={{ scale: 0.98 }}
                      onClick={() => setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
                      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                      style={{
                        background: checked[i] ? 'rgba(96,165,250,0.12)' : '#F9FAFB',
                        border: `1px solid ${checked[i] ? '#60A5FA' : '#60A5FA22'}`,
                      }}>
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 transition-all"
                        style={{ background: checked[i] ? '#60A5FA' : 'transparent', border: `2px solid ${checked[i] ? '#60A5FA' : '#60A5FA44'}` }}>
                        {checked[i] && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-xs leading-snug" style={{ color: checked[i] ? '#3C3C3C' : '#9CA3AF' }}>{point}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-3 text-[10px] font-bold text-right" style={{ color: '#60A5FA' }}>
                  {checkedCount} of {scenario.checkpoints.length} elements present
                </div>
              </div>

              <button
                onClick={handleDebrief}
                disabled={!response.trim()}
                className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', color: '#fff' }}>
                Get LANCE's Debrief →
              </button>
            </motion.div>
          )}

          {/* DEBRIEF */}
          {screen === 'debrief' && scenario && (
            <motion.div key="debrief" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Score */}
              <div className="rounded-3xl p-5 text-center border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA44' }}>
                <div className="text-4xl mb-2">
                  {checkedCount >= scenario.checkpoints.length - 1 ? '🏆' : checkedCount >= Math.floor(scenario.checkpoints.length / 2) ? '⭐' : '📋'}
                </div>
                <div className="text-lg font-black mb-1" style={{ color: '#60A5FA' }}>
                  {checkedCount} / {scenario.checkpoints.length} elements
                </div>
                <div className="text-xs" style={{ color: '#9CA3AF' }}>
                  {checkedCount >= scenario.checkpoints.length - 1
                    ? 'Strong execution. Most elements present.'
                    : checkedCount >= Math.floor(scenario.checkpoints.length / 2)
                    ? 'Solid foundation. A few refinements would strengthen it.'
                    : 'Good attempt. The debrief below will sharpen your approach.'}
                </div>
              </div>

              {/* Your response */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA22' }}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Your response</div>
                <p className="text-xs leading-relaxed italic" style={{ color: '#3C3C3C' }}>"{response}"</p>
              </div>

              {/* LANCE debrief */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60A5FA44' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#60A5FA' }}>{NARRATOR.name} debrief</span>
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF' }}>"{scenario.lanceEvaluation}"</p>
              </div>

              {/* Intern */}
              <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>
                  The fact that you practiced this — wrote it out, self-evaluated it, read the debrief — means your brain has now actually rehearsed it. Real conversations after this will be easier. That's how skill-building works.
                </p>
              </div>

              <div className="text-xs text-center font-bold" style={{ color: '#9CA3AF' }}>+35 XP earned</div>

              <div className="flex gap-3">
                <button onClick={() => startScenario(scenario)}
                  className="flex-1 py-3 rounded-2xl font-black text-sm border"
                  style={{ borderColor: '#60A5FA44', color: '#60A5FA' }}>Try Again</button>
                <button onClick={() => setScreen('select')}
                  className="flex-1 py-3 rounded-2xl font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', color: '#fff' }}>New Scenario</button>
              </div>
              <button onClick={onBack} className="w-full py-2 text-xs font-bold" style={{ color: '#9CA3AF99' }}>← Home</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
