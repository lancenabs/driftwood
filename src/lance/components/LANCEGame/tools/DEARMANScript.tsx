import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { Download } from 'lucide-react';
import { exportWorksheetPdf } from '../../../utils/exportWorksheetPdf';

function exportDearmanPdf(scripts: DearManScript[]) {
  exportWorksheetPdf({
    title: 'DEAR MAN Scripts',
    subtitle: 'DBT interpersonal effectiveness — describe, express, assert, reinforce',
    sections: scripts.flatMap(s => [
      { label: `Situation — ${s.date}`, body: s.situation },
      { label: 'Describe (the facts)', body: s.D },
      { label: 'Express (how I feel)', body: s.E },
      { label: 'Assert (what I need)', body: s.A },
      { label: 'Reinforce (why it helps us both)', body: s.R },
    ]),
    footerNote: 'Practice script — bring to session',
  });
}

interface DearManScript {
  id: string;
  date: string;
  situation: string;
  D: string;
  E: string;
  A: string;
  R: string;
}

const STORAGE_KEY = 'lance_dearman_v1';
function load(): DearManScript[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(s: DearManScript[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

const STEPS = [
  {
    key: 'D',
    label: 'Describe',
    tip: 'M — Mindful',
    tipDetail: 'Stick to observable facts. No interpretations, no accusations, no past incidents. Just what happened.',
    prompt: 'Describe the situation factually',
    sub: 'What happened? Who did what? Only facts — no "you always," no "you never," no judgments.',
    placeholder: '"When you said / did [X]..."  or  "In the situation where [Y] happened..."',
    color: '#3ECFCF',
  },
  {
    key: 'E',
    label: 'Express',
    tip: 'A — Appear confident',
    tipDetail: "Use 'I feel' statements — not 'you make me feel.' Own the emotion. No apology for having it.",
    prompt: 'Express how you feel',
    sub: 'What emotion does this bring up for you? Use "I feel..." language, not blame.',
    placeholder: '"I feel [emotion] when [situation]..."',
    color: '#a78bfa',
  },
  {
    key: 'A',
    label: 'Assert',
    tip: 'N — Negotiate',
    tipDetail: "Be clear. Don't hint, don't beat around it. Say exactly what you want or don't want.",
    prompt: 'Assert what you want',
    sub: 'What are you asking for? Be specific. Clear requests get better responses than vague ones.',
    placeholder: '"I\'d like you to... / I\'m asking that... / I need..."',
    color: '#7FD98C',
  },
  {
    key: 'R',
    label: 'Reinforce',
    tip: 'Reinforce = make the YES worth it',
    tipDetail: "Explain what's in it for them — or for the relationship — if they respond positively. Not a threat. A reason.",
    prompt: 'Reinforce — why should they agree?',
    sub: 'What positive outcome follows if they respond well? For them, for you, for the relationship.',
    placeholder: '"If we can resolve this, I think... / This matters to our relationship because..."',
    color: '#f59e0b',
  },
];

const LANCE_LINES = [
  "Script complete. DEAR MAN maximizes the probability of a successful interpersonal outcome by structuring the communication to be clear, non-threatening, and reinforced. You've built a functional script.",
  "Drafted. The DEAR MAN format is designed to reduce the likelihood of defensive reactions while increasing clarity of request. Clarity is how you get what you need.",
  "Filed. Most failed interpersonal requests fail due to vagueness or emotional escalation — not the request itself. You've addressed both.",
  "Recorded. This script separates fact from feeling from request. That structure reduces the other person's defensiveness by approximately the margin that unclear communication increases it.",
];
const INTERN_LINES = [
  "You wrote the hard conversation before you had it. That takes so much courage — and it makes the actual conversation so much easier. You're already prepared.",
  "DEAR MAN isn't about being cold or scripted — it's about being clear enough that the other person actually understands what you need. You just did that.",
  "The fact that you took time to prepare this? That's self-advocacy. That's you taking yourself seriously enough to ask for what you need.",
  "I love DEAR MAN because it protects the relationship AND asks for what you need. You've built something you can actually use.",
];

interface Props { onBack: () => void; }

export default function DEARMANScript({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [scripts, setScripts] = useState<DearManScript[]>(load);
  const [view, setView] = useState<'list' | 'create' | 'preview' | 'done' | 'history_detail'>('list');
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<DearManScript>>({});
  const [copied, setCopied] = useState(false);
  const [detailScript, setDetailScript] = useState<DearManScript | null>(null);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const ALL_STEPS = [
    {
      key: 'situation',
      label: 'The Situation',
      prompt: 'What conversation do you need to have?',
      sub: 'Who is it with? What do you need to address? Give yourself context before you build the script.',
      placeholder: '"I need to talk to [person] about [topic]..."',
      color: '#9CA3AF',
    },
    ...STEPS,
  ];

  const currentStep = ALL_STEPS[step];
  const currentValue = (draft[currentStep.key as keyof DearManScript] as string) ?? '';

  const handleNext = () => {
    if (step < ALL_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setView('preview');
    }
  };

  const buildScript = (s: Partial<DearManScript>) =>
    [
      s.D && `Describe: "${s.D}"`,
      s.E && `Express: "${s.E}"`,
      s.A && `Assert: "${s.A}"`,
      s.R && `Reinforce: "${s.R}"`,
    ].filter(Boolean).join('\n\n');

  const handleSave = () => {
    const script: DearManScript = {
      id: `dm_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      situation: draft.situation ?? '',
      D: draft.D ?? '',
      E: draft.E ?? '',
      A: draft.A ?? '',
      R: draft.R ?? '',
    };
    const updated = [script, ...scripts];
    save(updated);
    setScripts(updated);
    addXp(30);
    setView('done');
  };

  const handleCopy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === 'history_detail' && detailScript) {
    const script = buildScript(detailScript);
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/dbt.webp)',
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
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🛡️</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Past Script</h2>
          <button onClick={() => handleCopy(script)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: copied ? '#7FD98C22' : '#9CA3AF', color: copied ? '#7FD98C' : '#3ECFCF', border: `1px solid ${copied ? '#7FD98C44' : '#9CA3AF'}` }}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>About</p>
            <p className="text-xs italic" style={{ color: '#9CA3AF' }}>{detailScript.situation}</p>
          </div>
          {STEPS.map(s => {
            const val = detailScript[s.key as keyof DearManScript] as string;
            if (!val) return null;
            return (
              <div key={s.key} className="rounded-2xl p-4 border" style={{ background: s.color + '11', borderColor: s.color + '33' }}>
                <div className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: s.color }}>
                  {s.key} — {s.label}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#3C3C3C' }}>"{val}"</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'preview') {
    const script = buildScript(draft);
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('create')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🛡️</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Your Script</h2>
          <button onClick={() => handleCopy(script)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: copied ? '#7FD98C22' : '#9CA3AF', color: copied ? '#7FD98C' : '#3ECFCF', border: `1px solid ${copied ? '#7FD98C44' : '#9CA3AF'}` }}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>About</p>
            <p className="text-xs italic" style={{ color: '#9CA3AF' }}>{draft.situation}</p>
          </div>
          {STEPS.map(s => {
            const val = draft[s.key as keyof DearManScript] as string;
            if (!val) return null;
            return (
              <div key={s.key} className="rounded-2xl p-4 border" style={{ background: s.color + '11', borderColor: s.color + '33' }}>
                <div className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: s.color }}>
                  {s.key} — {s.label}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#3C3C3C' }}>"{val}"</p>
              </div>
            );
          })}
          <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <p className="text-xs italic" style={{ color: '#9CA3AF' }}>
              <span className="font-black not-italic" style={{ color: '#3ECFCF' }}>M — </span>Stay mindful. If they go off-topic, gently return: "I'd like to stay focused on what I asked."<br />
              <span className="font-black not-italic mt-2 block" style={{ color: '#3ECFCF' }}>A — </span>Appear confident. Even if you don't feel it — voice steady, eye contact, don't pre-apologize.<br />
              <span className="font-black not-italic mt-2 block" style={{ color: '#3ECFCF' }}>N — </span>Negotiate. Know what you can be flexible on before you start.
            </p>
          </div>
          <button onClick={handleSave} className="w-full py-4 rounded-2xl font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #60a5fa, #3ECFCF)', color: '#F9FAFB' }}>
            Save Script (+30 XP) →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'done') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <span className="text-lg">🛡️</span>
          <h2 className="text-sm font-black flex-1" style={{ color: '#3C3C3C' }}>Script Saved</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="rounded-3xl p-5 border text-center" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60a5fa33' }}>
              <div className="text-5xl mb-2">🛡️</div>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#60a5fa' }}>DEAR MAN Script Ready</p>
              <div className="text-[10px] font-black mt-2" style={{ color: '#7FD98C' }}>+30 XP earned</div>
              <button
                onClick={() => exportDearmanPdf(scripts.slice(0, 1))}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ color: '#60a5fa', border: '1px solid #60a5fa44', background: 'rgba(255,255,255,0.8)' }}
              >
                <Download className="w-3 h-3" /> Download as PDF — practice before the conversation
              </button>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
              <div className="flex items-center gap-2 mb-3">
                <LanceAvatar emotion="neutral" size="sm" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} notes</span>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: '#9CA3AF' }}>"{LANCE_LINES[lanceIdx]}"</p>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{intern.avatar}</span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#7FD98C' }}>{INTERN_LINES[internIdx]}</p>
            </div>
            <button onClick={onBack} className="w-full py-4 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #60a5fa, #3ECFCF)', color: '#F9FAFB' }}>
              ← Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => step > 0 ? setStep(s => s - 1) : setView('list')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🛡️</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>DEAR MAN</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Step {step + 1} of {ALL_STEPS.length}</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="flex gap-1">
            {ALL_STEPS.map((s, i) => (
              <div key={i} className="h-1 flex-1 rounded-full"
                style={{ background: i < step ? '#7FD98C' : i === step ? (s as any).color ?? '#3ECFCF' : '#9CA3AF' }} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl p-5 border"
              style={{ background: ((currentStep as any).color ?? '#3ECFCF') + '11', borderColor: ((currentStep as any).color ?? '#3ECFCF') + '33' }}>
              {currentStep.key !== 'situation' && (
                <div className="mb-3 p-3 rounded-xl text-xs" style={{ background: '#F9FAFB', border: `1px solid ${(currentStep as any).color ?? '#3ECFCF'}22` }}>
                  <span className="font-black" style={{ color: (currentStep as any).color ?? '#3ECFCF' }}>{(STEPS.find(s => s.key === currentStep.key) as any)?.tip}: </span>
                  <span style={{ color: '#9CA3AF' }}>{(STEPS.find(s => s.key === currentStep.key) as any)?.tipDetail}</span>
                </div>
              )}
              <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: (currentStep as any).color ?? '#3ECFCF' }}>
                {currentStep.key !== 'situation' ? `${currentStep.key} — ` : ''}{currentStep.label}
              </div>
              <p className="text-sm font-black mb-1" style={{ color: '#3C3C3C' }}>{currentStep.prompt}</p>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: '#9CA3AF' }}>{currentStep.sub}</p>
              <textarea
                value={currentValue}
                onChange={e => setDraft(d => ({ ...d, [currentStep.key]: e.target.value }))}
                rows={4}
                placeholder={currentStep.placeholder}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                style={{ background: '#F9FAFB', color: '#3C3C3C', border: `1px solid ${(currentStep as any).color ?? '#3ECFCF'}33`, caretColor: (currentStep as any).color ?? '#3ECFCF' }}
              />
            </motion.div>
          </AnimatePresence>

          <button onClick={handleNext} disabled={currentValue.trim().length < 10}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: step < ALL_STEPS.length - 1 ? `linear-gradient(135deg, ${(currentStep as any).color ?? '#3ECFCF'}, #3ECFCF)` : 'linear-gradient(135deg, #60a5fa, #3ECFCF)', color: '#F9FAFB' }}>
            {step < ALL_STEPS.length - 1 ? 'Next →' : 'Preview Script →'}
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">🛡️</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Assertiveness (DEAR MAN)</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Draft the hard conversation · DBT scripting</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#60a5fa22', color: '#60a5fa' }}>+30 XP</div>
      </div>
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {scripts.length === 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
            <div className="flex items-start gap-3">
              <LanceAvatar emotion="superior" size="sm" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide mb-1" style={{ color: '#3ECFCF' }}>{NARRATOR.name} explains</p>
                <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
                  "DEAR MAN is a DBT interpersonal effectiveness skill. D: Describe facts. E: Express feelings. A: Assert your request. R: Reinforce why they should agree. M: Mindful — stay on topic. A: Appear confident. N: Negotiate. Most failed requests fail because of vagueness or escalation. This prevents both."
                </p>
              </div>
            </div>
          </div>
        )}

        {scripts.map(s => (
          <button key={s.id} onClick={() => { setDetailScript(s); setView('history_detail'); }}
            className="w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#60a5fa22' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate" style={{ color: '#3C3C3C' }}>{s.situation}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>
                  {new Date(s.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#60a5fa66' }} />
            </div>
          </button>
        ))}

        <button onClick={() => { setView('create'); setStep(0); setDraft({}); }}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #60a5fa, #3ECFCF)', color: '#F9FAFB' }}>
          🛡️ Write a DEAR MAN Script
        </button>
      </div>
    </div>
  );
}
