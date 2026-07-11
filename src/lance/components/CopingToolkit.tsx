import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Wind, LifeBuoy, BookOpen } from 'lucide-react';

interface CopingToolkitProps {
  onLaunch: (appId: string) => void;
}

interface Tool { appId: string; name: string; why: string; }
interface Feeling {
  id: string;
  emoji: string;
  label: string;
  blurb: string;
  grad: string;
  tools: Tool[];
}

const FEELINGS: Feeling[] = [
  {
    id: 'panic', emoji: '😰', label: 'Panicked', blurb: 'Racing heart, can’t breathe, on edge',
    grad: 'linear-gradient(150deg,#fb7185,#f43f5e 60%,#e11d48)',
    tools: [
      { appId: 'breathing', name: 'Breathwork', why: 'Slow the alarm with a long exhale' },
      { appId: 'dbt', name: 'DBT Rescue', why: 'Cold water + TIPP to cool the spike fast' },
      { appId: 'anxiety_detox', name: 'Prefrontal Detox', why: 'Shift blood flow out of the panic centre' },
    ],
  },
  {
    id: 'spiral', emoji: '🌀', label: 'Spiraling', blurb: 'Overthinking, looping worries',
    grad: 'linear-gradient(150deg,#38bdf8,#06b6d4 60%,#3ECFCF)',
    tools: [
      { appId: 'worry_parking', name: 'Worry Parking', why: 'Park the thought and sort what’s yours' },
      { appId: 'cbt', name: 'CBT Diary', why: 'Catch the distortion and reframe it' },
      { appId: 'self_talk', name: 'Self-Talk Mirror', why: 'Soften the harsh inner voice' },
    ],
  },
  {
    id: 'numb', emoji: '😶', label: 'Numb', blurb: 'Flat, shut down, disconnected',
    grad: 'linear-gradient(150deg,#94a3b8,#64748b 60%,#475569)',
    tools: [
      { appId: 'somatic', name: 'Somatic Mind Map', why: 'Gently locate sensation in the body' },
      { appId: 'breathing', name: 'Breathwork', why: 'A small rhythm to come back online' },
      { appId: 'art', name: 'Art Studio', why: 'Express what words can’t reach yet' },
    ],
  },
  {
    id: 'angry', emoji: '😡', label: 'Angry', blurb: 'Tense, frustrated, ready to burst',
    grad: 'linear-gradient(150deg,#f59e0b,#f97316 60%,#ea580c)',
    tools: [
      { appId: 'scream_room', name: 'Scream Room', why: 'Discharge the pressure safely' },
      { appId: 'somatic_tremor', name: 'Tremor Lab', why: 'Shake off the survival tension' },
      { appId: 'breathing', name: 'Breathwork', why: 'Cool the body before you act' },
    ],
  },
  {
    id: 'low', emoji: '😢', label: 'Sad / low', blurb: 'Heavy, tearful, self-critical',
    grad: 'linear-gradient(150deg,#818cf8,#6366f1 60%,#4f46e5)',
    tools: [
      { appId: 'compassion_room', name: 'Compassion Rooms', why: 'Meet yourself with warmth' },
      { appId: 'gratitude', name: 'Gratitude', why: 'Anchor to one good thing' },
      { appId: 'self_talk', name: 'Self-Talk Mirror', why: 'Rewrite the critical script' },
    ],
  },
  {
    id: 'grief', emoji: '🕯️', label: 'Grieving', blurb: 'Loss, longing, sorrow',
    grad: 'linear-gradient(150deg,#fb923c,#f43f5e 60%,#be123c)',
    tools: [
      { appId: 'grief_space', name: 'Grief Release', why: 'Hold and set down the weight' },
      { appId: 'compassion_room', name: 'Compassion Rooms', why: 'Tend to the tender parts' },
    ],
  },
  {
    id: 'sleepless', emoji: '😴', label: 'Can’t sleep', blurb: 'Wired, restless, mind won’t stop',
    grad: 'linear-gradient(150deg,#6366f1,#4338ca 60%,#312e81)',
    tools: [
      { appId: 'circadian_sunset', name: 'Melatonin Glow', why: 'Wind down with sunset + 4-7-8' },
      { appId: 'sound_bath', name: 'Sound Bath', why: 'Soothe with low-frequency waves' },
      { appId: 'dream_decoded', name: 'Dream Decoder', why: 'Empty the mind onto the page' },
    ],
  },
  {
    id: 'drained', emoji: '🔋', label: 'Drained', blurb: 'Overwhelmed, depleted, peopled-out',
    grad: 'linear-gradient(150deg,#34d399,#10b981 60%,#059669)',
    tools: [
      { appId: 'social_battery', name: 'Social Battery', why: 'See what’s charging vs draining you' },
      { appId: 'breathing', name: 'Breathwork', why: 'A 2-minute reset' },
      { appId: 'focus', name: 'Focus Timer', why: 'One small block, then rest' },
    ],
  },
];

export default function CopingToolkit({ onLaunch }: CopingToolkitProps) {
  const [selected, setSelected] = useState<Feeling | null>(null);

  if (selected) {
    return (
      <div className="max-w-xl mx-auto space-y-4 text-left animate-slide-up">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="relative overflow-hidden rounded-[2rem] p-7 text-white shadow-lg" style={{ background: selected.grad }}>
          <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <span className="text-4xl leading-none select-none">{selected.emoji}</span>
            <h2 className="text-[26px] font-bold tracking-tight mt-2 leading-tight">When you feel {selected.label.toLowerCase()}</h2>
            <p className="text-[13px] text-white/85 font-medium mt-1.5">Here are a few things that can help right now. Pick one — that’s enough.</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {selected.tools.map((t) => (
            <button
              key={t.appId}
              onClick={() => onLaunch(t.appId)}
              className="w-full bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex items-center gap-3 text-left transition hover:border-slate-300 active:scale-[0.99] cursor-pointer"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[14px] text-slate-900">{t.name}</span>
                <span className="block text-[12px] text-slate-500 leading-snug mt-0.5">{t.why}</span>
              </span>
              <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed px-4">
          If you ever feel unsafe, this isn’t a substitute for help — call or text <strong>988</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 text-left animate-slide-up">
      <div className="relative overflow-hidden rounded-[2rem] p-7 text-white shadow-lg" style={{ background: 'linear-gradient(150deg,#0d3d35,#0a5a52 55%,#3ECFCF)' }}>
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-[24px] font-bold tracking-tight leading-tight">What do you need right now?</h2>
            <p className="text-[12px] text-white/85 font-medium mt-1">Tap how you feel — I’ll point you to the right tool.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FEELINGS.map((f) => (
          <motion.button
            key={f.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(f)}
            className="rounded-2xl p-4 text-left text-white shadow-sm cursor-pointer relative overflow-hidden min-h-[104px] flex flex-col justify-between"
            style={{ background: f.grad }}
          >
            <span className="text-2xl leading-none select-none">{f.emoji}</span>
            <span>
              <span className="block font-bold text-[14px] leading-tight">{f.label}</span>
              <span className="block text-[10.5px] text-white/85 leading-snug mt-0.5">{f.blurb}</span>
            </span>
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => onLaunch('breathing')}
        className="w-full rounded-2xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/60 text-teal-800 font-bold text-[13px] py-3.5 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
      >
        <Wind className="w-4 h-4" /> Not sure? Just breathe for a minute
      </button>

      <button
        onClick={() => onLaunch('coping_card')}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 text-slate-700 font-bold text-[13px] py-3.5 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
      >
        <BookOpen className="w-4 h-4" /> Build a coping card to keep for later
      </button>
    </div>
  );
}
