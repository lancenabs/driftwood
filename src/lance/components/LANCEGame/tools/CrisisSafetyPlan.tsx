import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Shield, Phone, Save, MessageSquare, Download } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { exportWorksheetPdf } from '../../../utils/exportWorksheetPdf';
import { GlassPanel, CoachCard } from '../ui/GlassKit';

// Design note (TOOL_INTERIOR_DESIGN_PLAN.md, S-tier): this tool is deliberately
// EXEMPT from gamification pressure. No confetti, no RewardMoment, no streaks —
// completion is honored with a single quiet glow. The 988 bar stays instantly
// visible and instantly tappable on every screen; nothing here may slow it down.

const ACCENT = '#818CF8'; // calm indigo — this tool's own accent

// Always-visible crisis lifeline. Rendered on EVERY screen of this tool so a client
// in acute distress never has to build or finish a plan to reach help. Taps dial/text 988.
function CrisisLifelineBar() {
  return (
    <div className="px-4 pt-3 pb-1 shrink-0 relative z-10">
      <div className="rounded-2xl p-3 flex items-center gap-2" style={{
        background: 'rgba(254,242,242,0.92)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        border: '1.5px solid #FCA5A5',
        boxShadow: '0 4px 16px rgba(239,68,68,0.18)',
      }}>
        <Phone className="w-4 h-4 shrink-0" style={{ color: '#EF4444' }} />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-black leading-tight" style={{ color: '#B91C1C' }}>In crisis right now? You don't have to finish this plan.</div>
          <div className="text-[10px] leading-tight" style={{ color: '#9CA3AF' }}>988 Suicide &amp; Crisis Lifeline · free · 24/7 · confidential</div>
        </div>
        <a href="tel:988" aria-label="Call 988"
          className="px-3 py-2 rounded-xl font-black text-[11px] text-white active:scale-95 shrink-0"
          style={{ background: '#EF4444', boxShadow: '0 3px 0 #B91C1C' }}>Call</a>
        <a href="sms:988" aria-label="Text 988"
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 shrink-0"
          style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
          <MessageSquare className="w-4 h-4" style={{ color: '#EF4444' }} />
        </a>
      </div>
    </div>
  );
}

// Calm rope-bridges region backdrop — static, softly blurred, never animated.
function CalmBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/dbt.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(24px)', transform: 'scale(1.1)', opacity: 0.35,
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(244,245,250,0.94) 0%, rgba(244,245,250,0.97) 100%)',
      }} />
    </>
  );
}

// Six lanterns, one per step — each lights as its step gains content.
function LanternRow({ plan, activeIdx }: { plan: SafetyPlan; activeIdx?: number }) {
  return (
    <div className="flex justify-center gap-3 py-1">
      {STEPS.map((s, i) => {
        const lit = plan[s.key].trim().length > 0;
        const active = i === activeIdx;
        return (
          <div key={s.key} className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{
                background: lit ? `radial-gradient(circle at 50% 35%, #FDE68A, ${ACCENT})` : 'rgba(255,255,255,0.7)',
                border: active ? `2px solid ${ACCENT}` : lit ? '1px solid rgba(255,255,255,0.8)' : `1px solid ${ACCENT}33`,
                boxShadow: lit ? `0 0 14px ${ACCENT}66, 0 2px 6px rgba(0,0,0,0.08)` : '0 1px 4px rgba(0,0,0,0.05)',
                filter: lit || active ? 'none' : 'grayscale(0.4) opacity(0.75)',
                transition: 'box-shadow 0.6s ease, background 0.6s ease',
              }}
            >
              {s.emoji}
            </div>
            <div className="w-1 h-1 rounded-full" style={{ background: active ? ACCENT : 'transparent' }} />
          </div>
        );
      })}
    </div>
  );
}

interface SafetyPlan {
  warningSigns: string;
  selfDistract: string;
  socialDistract: string;
  contacts: string;
  professionals: string;
  safeEnvironment: string;
  reasonsToLive: string;
}

const EMPTY_PLAN: SafetyPlan = {
  warningSigns: '',
  selfDistract: '',
  socialDistract: '',
  contacts: '',
  professionals: '',
  safeEnvironment: '',
  reasonsToLive: '',
};

const STEPS = [
  {
    key: 'warningSigns' as keyof SafetyPlan,
    title: 'Warning Signs',
    subtitle: 'Step 1 of 6',
    emoji: '⚠️',
    prompt: 'What thoughts, feelings, behaviors, or situations signal that a crisis may be building?',
    placeholder: 'e.g., I stop responding to texts, I begin to feel like a burden, I isolate for more than 2 days, I start catastrophizing about everything...',
    lanceNote: "Warning signs are the early alert system. Identifying them now — before the crisis — is the highest-leverage move in this entire plan.",
    rows: 4,
  },
  {
    key: 'selfDistract' as keyof SafetyPlan,
    title: 'Things I Can Do Alone',
    subtitle: 'Step 2 of 6',
    emoji: '🎮',
    prompt: 'What can you do by yourself to distract or soothe before reaching out to others?',
    placeholder: 'e.g., Put on a comfort show, take a walk, do a body scan, call my dog to me, make tea, clean one small thing...',
    lanceNote: "These are your first-tier interventions. Ideally, something physical and low-effort. The goal is to survive the next 20 minutes.",
    rows: 3,
  },
  {
    key: 'socialDistract' as keyof SafetyPlan,
    title: 'People Who Help — Not Crisis',
    subtitle: 'Step 3 of 6',
    emoji: '👥',
    prompt: 'Who can you be around or talk to — not necessarily about the crisis, just people who help you feel less alone?',
    placeholder: 'e.g., Call Mia (not to talk about it, just to hear her voice), go sit in a coffee shop, text Jordan to hang out...',
    lanceNote: "Social connection has a direct physiological effect on the nervous system. Name specific people. The more specific, the more usable this is in a crisis.",
    rows: 3,
  },
  {
    key: 'contacts' as keyof SafetyPlan,
    title: 'Crisis Contacts',
    subtitle: 'Step 4 of 6',
    emoji: '📞',
    prompt: 'Who can you call if things escalate? List people AND crisis resources.',
    placeholder: 'Person: [Name] — [phone]\nPerson: [Name] — [phone]\n\n988 Suicide & Crisis Lifeline (call or text)\nCrisis Text Line: text HOME to 741741\nLocal ER: [nearest hospital name]',
    lanceNote: "988 is free, confidential, available 24/7 and requires no insurance. Please include it here. I am not a substitute for a real human in a crisis.",
    rows: 5,
  },
  {
    key: 'professionals' as keyof SafetyPlan,
    title: 'My Treatment Team',
    subtitle: 'Step 5 of 6',
    emoji: '🏥',
    prompt: 'Who are your mental health providers? Include contact info and after-hours protocols.',
    placeholder: 'Therapist: [Name] — [phone or practice]\nPsychiatrist: [Name] — [phone]\nAfter-hours: [protocol or answering service]',
    lanceNote: "If you don't have a current provider, 988 can connect you with one. Open Path Collective and SAMHSA also offer low-cost referrals.",
    rows: 4,
  },
  {
    key: 'safeEnvironment' as keyof SafetyPlan,
    title: 'Making My Environment Safe',
    subtitle: 'Step 6a of 6',
    emoji: '🔒',
    prompt: 'What steps can you take to make your environment safer during a crisis?',
    placeholder: 'e.g., Give medications to a trusted person to hold, remove or secure firearms, ask someone to stay with me, stay off social media...',
    lanceNote: "Means restriction is one of the most evidence-based crisis interventions available. Access matters. Reducing access during a crisis can be lifesaving.",
    rows: 3,
  },
];

const STORAGE_KEY = 'lance_safety_plan_v1';

function loadPlan(): SafetyPlan {
  try { return { ...EMPTY_PLAN, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')) }; } catch { return { ...EMPTY_PLAN }; }
}

export default function CrisisSafetyPlan({ onBack }: { onBack: () => void }) {
  const { intern, addXp } = useGame();
  const [screen, setScreen] = useState<'intro' | 'edit' | 'reasons' | 'view'>('intro');
  const [stepIdx, setStepIdx] = useState(0);
  const [plan, setPlan] = useState<SafetyPlan>(loadPlan);
  const [saved, setSaved] = useState(false);

  const step = STEPS[stepIdx];
  const isLastStep = stepIdx === STEPS.length - 1;

  const savePlan = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    addXp(50);
    setSaved(true);
  };

  const hasPlan = Object.values(plan as Record<string, string>).some(v => v.trim().length > 0);

  const downloadPlanPdf = () => {
    exportWorksheetPdf({
      title: 'Crisis Safety Plan',
      subtitle: 'Personal plan — keep somewhere easy to find',
      footerNote: '988 Suicide & Crisis Lifeline · call or text · free · 24/7',
      sections: [...STEPS, {
        key: 'reasonsToLive' as keyof SafetyPlan,
        title: 'Reasons to Live',
        emoji: '',
        prompt: '',
        placeholder: '',
        lanceNote: '',
        rows: 0,
        subtitle: '',
      }].map(s => ({ label: s.title, body: plan[s.key] })),
    });
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#3C3C3C' }}>
      <CalmBackdrop />

      <div className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${ACCENT}22` }}>
        {screen === 'edit' && stepIdx > 0 ? (
          <button onClick={() => setStepIdx(i => i - 1)}
            className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <BigBackButton onBack={onBack} />
        )}
        <Shield className="w-5 h-5" style={{ color: ACCENT }} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#1C1C1E' }}>Crisis Safety Plan</h2>
          <p className="text-[10px]" style={{ color: '#6B7280' }}>
            {screen === 'edit' ? step.subtitle : screen === 'view' ? 'Your plan' : 'For the hardest moments'}
          </p>
        </div>
        {hasPlan && (
          <button onClick={() => setScreen('view')}
            className="text-[9px] px-2 py-1 rounded-full font-black"
            style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44` }}>
            View Plan
          </button>
        )}
      </div>

      {/* Persistent crisis lifeline — visible on all screens, not gated behind plan completion */}
      <CrisisLifelineBar />

      <div className="relative flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {screen === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <CoachCard speaker="lance" pose="thinking">
                "I find safety planning compelling as an act of self-contract. You are documenting, in advance and with full cognitive capacity, what to do when capacity is reduced. This is one of the most rational things a human being can produce. We will do it carefully."
              </CoachCard>

              <CoachCard speaker="chip" pose="idle" label={intern.name || 'Chip'}>
                You don't have to be in crisis to build this. The best time to build a safety plan is when you're not in one. We're going to go through 6 steps and create something you can actually use.
              </CoachCard>

              <GlassPanel solid className="p-5">
                <h3 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: ACCENT }}>6 Steps</h3>
                <LanternRow plan={plan} />
                <div className="mt-3">
                  {[
                    'Warning Signs — what signals a crisis is building',
                    'Self-Soothing — what you can do alone first',
                    'Social Contacts — people who help you feel less alone',
                    'Crisis Contacts — who to call if things escalate',
                    'Treatment Team — your providers and how to reach them',
                    'Safe Environment — reducing access to means',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black"
                        style={{ background: `${ACCENT}22`, color: ACCENT }}>{i + 1}</div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <button onClick={() => { setStepIdx(0); setScreen('edit'); }}
                className="w-full py-4 rounded-2xl font-black text-sm"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`, color: '#fff',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: `0 3px 0 #4F46E5AA, 0 8px 18px ${ACCENT}45, inset 0 1px 0 rgba(255,255,255,0.4)`,
                }}>
                Begin Safety Plan →
              </button>

              {hasPlan && (
                <button onClick={() => setScreen('view')}
                  className="w-full py-3 rounded-2xl font-black text-sm"
                  style={{ border: `1px solid ${ACCENT}44`, color: ACCENT, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                  View Existing Plan
                </button>
              )}
            </motion.div>
          )}

          {/* EDIT STEPS */}
          {screen === 'edit' && (
            <motion.div key={`step-${stepIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {/* Lantern progress */}
              <LanternRow plan={plan} activeIdx={stepIdx} />

              {/* Step card */}
              <GlassPanel solid className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{step.emoji}</span>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>{step.subtitle}</div>
                    <div className="text-base font-black" style={{ color: '#1C1C1E' }}>{step.title}</div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7280' }}>{step.prompt}</p>
                <textarea
                  value={plan[step.key]}
                  onChange={e => setPlan(p => ({ ...p, [step.key]: e.target.value }))}
                  rows={step.rows}
                  placeholder={step.placeholder}
                  className="w-full px-4 py-3 rounded-2xl text-xs outline-none resize-none leading-relaxed"
                  style={{ background: 'rgba(244,245,250,0.9)', color: '#1C1C1E', border: `1px solid ${ACCENT}22`, caretColor: ACCENT }}
                />
              </GlassPanel>

              {/* LANCE note */}
              <CoachCard speaker="lance" pose="pointing" label={`${NARRATOR.name} note`}>
                "{step.lanceNote}"
              </CoachCard>

              <button
                onClick={() => {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
                  if (isLastStep) {
                    setScreen('reasons');
                  } else {
                    setStepIdx(i => i + 1);
                  }
                }}
                className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`, color: '#fff',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: `0 3px 0 #4F46E5AA, 0 8px 18px ${ACCENT}45, inset 0 1px 0 rgba(255,255,255,0.4)`,
                }}>
                {isLastStep ? 'One More Step →' : 'Continue'} <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* REASONS TO LIVE */}
          {screen === 'reasons' && (
            <motion.div key="reasons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <GlassPanel solid className="p-5 text-center">
                <div className="text-4xl mb-2">💙</div>
                <div className="text-base font-black mb-1" style={{ color: ACCENT }}>Reasons to Live</div>
                <div className="text-xs" style={{ color: '#6B7280' }}>The most important section.</div>
              </GlassPanel>

              <CoachCard speaker="lance" pose="talking">
                "This section is not for me. It is for you — the version of you who will read this in a harder moment. Write it for them. Be specific. Generic reasons dissolve under pressure. Specific ones hold."
              </CoachCard>

              <GlassPanel solid className="p-5">
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7280' }}>
                  What are your reasons to live? Who and what needs you here? What haven't you done yet that you want to do?
                </p>
                <textarea
                  value={plan.reasonsToLive}
                  onChange={e => setPlan(p => ({ ...p, reasonsToLive: e.target.value }))}
                  rows={6}
                  placeholder="My dog needs me. My sister doesn't know how much she means to me. I haven't seen the Pacific Ocean yet. I want to see what I become. I love Tuesday morning coffee. There are people who would be permanently changed by losing me..."
                  className="w-full px-4 py-3 rounded-2xl text-xs outline-none resize-none leading-relaxed"
                  style={{ background: 'rgba(244,245,250,0.9)', color: '#1C1C1E', border: `1px solid ${ACCENT}22`, caretColor: ACCENT }}
                />
              </GlassPanel>

              {!saved ? (
                <button onClick={savePlan}
                  className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`, color: '#fff',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: `0 3px 0 #4F46E5AA, 0 8px 18px ${ACCENT}45, inset 0 1px 0 rgba(255,255,255,0.4)`,
                  }}>
                  <Save className="w-4 h-4" /> Save My Safety Plan +50 XP
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3">
                  {/* Quiet completion — one soft glow, no confetti. Deliberate. */}
                  <motion.div
                    initial={{ boxShadow: `0 0 0px ${ACCENT}00` }}
                    animate={{ boxShadow: [`0 0 0px ${ACCENT}00`, `0 0 34px ${ACCENT}55`, `0 0 14px ${ACCENT}22`] }}
                    transition={{ duration: 2.2, times: [0, 0.4, 1], ease: 'easeOut' }}
                    className="rounded-2xl p-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${ACCENT}44` }}
                  >
                    <p className="text-sm font-black" style={{ color: ACCENT }}>Safety Plan Saved ✓</p>
                    <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Available anytime from the Library. Keep a copy where you can find it.</p>
                  </motion.div>
                  <CoachCard speaker="chip" pose="approving" label={intern.name || 'Chip'}>
                    You built it. Now you have it. If the moment ever comes when you need it — it's here, it's yours, and it was made by you, for you, when you were thinking clearly. That matters more than you know.
                  </CoachCard>
                  <button onClick={downloadPlanPdf}
                    className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                    style={{ border: `1px solid ${ACCENT}44`, color: ACCENT, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}>
                    <Download className="w-4 h-4" /> Download as PDF — share with your therapist
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => setScreen('view')}
                      className="flex-1 py-3 rounded-2xl font-black text-sm"
                      style={{ border: `1px solid ${ACCENT}44`, color: ACCENT, background: 'rgba(255,255,255,0.7)' }}>View Plan</button>
                    <button onClick={onBack}
                      className="flex-1 py-3 rounded-2xl font-black text-sm"
                      style={{ background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`, color: '#fff' }}>← Home</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* VIEW PLAN — presented as the "card in your wallet" */}
          {screen === 'view' && (
            <motion.div key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {/* Wallet card header */}
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: `0 12px 32px ${ACCENT}35, 0 3px 10px rgba(0,0,0,0.1)` }}>
                <div className="px-5 py-4 flex items-center gap-3" style={{ background: `linear-gradient(120deg, ${ACCENT}, #6366F1 70%, #4F46E5)` }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)' }}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-white">My Safety Plan</div>
                    <div className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Made by you, for you, thinking clearly</div>
                  </div>
                  <LanternRow plan={plan} />
                </div>
                <div className="px-5 py-4 space-y-3" style={{ background: 'rgba(255,255,255,0.95)' }}>
                  {[...STEPS, {
                    key: 'reasonsToLive' as keyof SafetyPlan,
                    title: 'Reasons to Live',
                    emoji: '💙',
                    prompt: '',
                    placeholder: '',
                    lanceNote: '',
                    rows: 0,
                    subtitle: '',
                  }].map((s) => (
                    plan[s.key]?.trim() ? (
                      <div key={s.key} className="pb-3" style={{ borderBottom: '1px solid rgba(129,140,248,0.12)' }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-base">{s.emoji}</span>
                          <span className="text-xs font-black" style={{ color: ACCENT }}>{s.title}</span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#3C3C3C' }}>{plan[s.key]}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>

              <button onClick={downloadPlanPdf}
                className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                style={{ border: `1px solid ${ACCENT}44`, color: ACCENT, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}>
                <Download className="w-4 h-4" /> Download as PDF — share with your therapist
              </button>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setStepIdx(0); setScreen('edit'); }}
                  className="flex-1 py-3 rounded-2xl font-black text-sm"
                  style={{ border: `1px solid ${ACCENT}44`, color: ACCENT, background: 'rgba(255,255,255,0.7)' }}>Edit Plan</button>
                <button onClick={onBack}
                  className="flex-1 py-3 rounded-2xl font-black text-sm"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`, color: '#fff' }}>← Home</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
