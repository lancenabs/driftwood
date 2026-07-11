import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import { INTERN_PERSONALITIES } from '../lanceGameData';
import LanceAvatar from '../LanceAvatar';
import { useLANCEAI } from '../useLANCEAI';
import BigBackButton from '../BigBackButton';
import { GlassPanel } from '../ui/GlassKit';

const MOOD_LABELS = ['Terrible', 'Low', 'Okay', 'Good', 'Great'];
const MOOD_EMOJIS = ['😞', '😔', '😐', '🙂', '😄'];
// One color per mood — the whole room tints with the selection (Tidepools signature).
const MOOD_COLORS = ['#F87171', '#FB923C', '#FBBF24', '#7FD98C', '#58CC02'];
const ENERGY_LABELS = ['Depleted', 'Low', 'Moderate', 'Energized', 'Buzzing'];
const ENERGY_EMOJIS = ['🪫', '🔋', '⚡', '✨', '🚀'];

const LANCE_CHECKIN_LINES = [
  "You've submitted a mood entry. This data is useful. You are... less useful. I'm kidding. Partially.",
  "Emotional state logged. I've updated your trajectory model. The Intern is making celebration sounds. I've muted them.",
  "Check-in complete. For the record, logging your mood daily is one of the highest-evidence mental health behaviors. I didn't invent that. I'm merely citing it.",
  "Your data has been recorded. Notably, people who track their mood daily report higher self-awareness. I know this. I'm not impressed by it. But it's accurate.",
];

const TEAL = '#14B8A6';
const GREEN = '#58CC02';
const AMBER = '#FF9600';

// Tidepools backdrop + a live tint layer that takes the chosen mood's color —
// picking how you feel literally colors the room. The intervention, made visual.
function TidepoolBackdrop({ tint }: { tint: string }) {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/mood.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.4,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.88) 0%, rgba(247,248,250,0.93) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0 transition-all duration-700" style={{
        background: `radial-gradient(ellipse at 50% 22%, ${tint}2E 0%, transparent 62%)`,
        zIndex: -1, pointerEvents: 'none',
      }} />
    </>
  );
}

// Big, thumb-friendly tap row (replaces the old slider — one tap, no dragging).
function TapScale({ value, onChange, emojis, labels, colorFor }: {
  value: number;
  onChange: (v: number) => void;
  emojis: string[];
  labels: string[];
  colorFor: (v: number) => string;
}) {
  return (
    <div className="flex gap-1.5" role="radiogroup">
      {emojis.map((emoji, i) => {
        const v = i + 1;
        const active = value === v;
        const color = colorFor(v);
        return (
          <motion.button
            key={v}
            role="radio"
            aria-checked={active}
            aria-label={labels[i]}
            whileTap={{ scale: 0.88 }}
            animate={active ? { scale: 1.06, y: -3 } : { scale: 1, y: 0 }}
            onClick={() => onChange(v)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl min-w-0"
            style={{
              background: active ? `${color}22` : 'rgba(255,255,255,0.55)',
              border: `2px solid ${active ? color : 'rgba(255,255,255,0.9)'}`,
              boxShadow: active ? `0 6px 16px ${color}44` : '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <span className="text-2xl" style={{ filter: active ? 'none' : 'grayscale(0.55) opacity(0.75)' }}>{emoji}</span>
            <span className="text-[8px] font-black uppercase tracking-wide truncate w-full text-center px-0.5"
              style={{ color: active ? color : '#9CA3AF' }}>
              {labels[i]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Pebble shelf — the last 7 check-ins resting as colored tidepool stones.
function StoneShelf({ logs }: { logs: { date: string; mood: number }[] }) {
  if (logs.length < 2) return null;
  const recent = logs.slice(-7);
  return (
    <GlassPanel className="p-4">
      <div className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: '#9CA3AF' }}>
        Your tidepool · last {recent.length} check-ins
      </div>
      <div className="flex items-end justify-center gap-2">
        {recent.map((l, i) => {
          const c = MOOD_COLORS[l.mood - 1] ?? TEAL;
          const h = 16 + l.mood * 4;
          return (
            <motion.div
              key={l.date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="rounded-full" style={{
                width: 22, height: h,
                background: `linear-gradient(160deg, ${c}CC, ${c})`,
                boxShadow: `0 3px 8px ${c}55, inset 0 2px 3px rgba(255,255,255,0.5)`,
              }} />
              <span className="text-[7px] font-bold" style={{ color: '#9CA3AF' }}>
                {new Date(l.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
              </span>
            </motion.div>
          );
        })}
      </div>
      <p className="text-[9px] text-center mt-2" style={{ color: '#C4C7D4' }}>
        Each stone is a day you checked in — taller and greener means brighter.
      </p>
    </GlassPanel>
  );
}

interface Props {
  onBack: () => void;
}

export default function DailyCheckIn({ onBack }: Props) {
  const { logMood, intern, userName, moodLogs, streak } = useGame() as any;
  const { lanceResponse, internResponse, loading: aiLoading, fetchResponses } = useLANCEAI();
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lanceReaction] = useState(
    () => LANCE_CHECKIN_LINES[Math.floor(Math.random() * LANCE_CHECKIN_LINES.length)]
  );

  const moodColor = MOOD_COLORS[mood - 1];
  const internPersonality = INTERN_PERSONALITIES.find((p: any) => p.id === intern.personalityId);
  const internGreetings = [
    `Hey${userName ? ` ${userName}` : ''}! How are you doing today? Take a moment — this is just for you.`,
    `${userName ? `${userName}! ` : ''}No judgment here. Just an honest check-in. How's it going?`,
    `Good to see you. Let's take a quick look at how you're actually feeling today.`,
  ];
  const internGreeting = internGreetings[Math.floor(Math.random() * internGreetings.length)];

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    logMood({ date: today, mood, energy, note: note.trim() || undefined });
    setSubmitted(true);
    fetchResponses({
      trigger: 'checkin_complete',
      userContent: `Mood: ${MOOD_LABELS[mood - 1]} (${mood}/5), Energy: ${ENERGY_LABELS[energy - 1]} (${energy}/5)${note.trim() ? `. Note: "${note.trim()}"` : ''}`,
    });
  };

  if (submitted) {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent' }}>
        <TidepoolBackdrop tint={moodColor} />
        {/* Header */}
        <div className="relative px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black flex-1" style={{ color: '#1C1C1E' }}>Mood Check-In</h2>
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${GREEN}44` }}>
              <span className="text-xs" aria-hidden>🔥</span>
              <span className="text-[11px] font-black" style={{ color: GREEN }}>{streak}</span>
            </div>
          )}
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {/* Summary card — glows in the chosen mood's color */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassPanel className="p-6 text-center" style={{ border: `2px solid ${moodColor}55`, boxShadow: `0 10px 32px ${moodColor}33` }}>
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className="w-20 h-20 rounded-full flex items-center justify-center text-5xl mx-auto mb-3"
                style={{ background: `${moodColor}1E`, boxShadow: `0 0 24px ${moodColor}44` }}
              >
                {MOOD_EMOJIS[mood - 1]}
              </motion.div>
              <div className="text-lg font-black" style={{ color: '#3C3C3C' }}>
                {MOOD_LABELS[mood - 1]} · {ENERGY_LABELS[energy - 1]}
              </div>
              {note && (
                <p className="text-xs mt-3 px-4 italic" style={{ color: '#9CA3AF' }}>
                  "{note}"
                </p>
              )}
              <div
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black text-white"
                style={{ background: GREEN }}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                Logged for today{streak >= 2 ? ` · ${streak}-day streak` : ''}
              </div>
            </GlassPanel>
          </motion.div>

          <StoneShelf logs={moodLogs ?? []} />

          {/* Intern reaction */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassPanel className="p-4" style={{ borderLeft: `4px solid ${GREEN}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-base"
                  style={{ background: `${GREEN}18` }}
                >
                  {intern.avatar}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: GREEN }}>
                  {intern.name || 'Intern'}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#4B5563' }}>
                {aiLoading
                  ? <motion.span animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}>
                      Thinking about your check-in...
                    </motion.span>
                  : internResponse ?? internPersonality?.sampleMessages[1] ?? "You showed up. That matters."
                }
              </p>
            </GlassPanel>
          </motion.div>

          {/* LANCE reaction */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlassPanel className="p-4" style={{ borderLeft: `4px solid ${TEAL}` }}>
              <div className="flex items-center gap-2 mb-2">
                <LanceAvatar emotion={aiLoading ? 'processing' : 'neutral'} size="sm" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: TEAL }}>
                  {NARRATOR.name}
                </span>
              </div>
              <p className="text-xs italic leading-relaxed" style={{ color: '#6B7280' }}>
                {aiLoading
                  ? <span className="inline-flex gap-1" style={{ color: `${TEAL}55` }}>
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}>●</motion.span>
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>●</motion.span>
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>●</motion.span>
                    </span>
                  : `"${lanceResponse ?? lanceReaction}"`
                }
              </p>
            </GlassPanel>
          </motion.div>

          <GlassPanel className="p-4 text-center">
            <p className="text-xs font-bold" style={{ color: '#6B7280' }}>
              Same time tomorrow — the tidepool collects one stone a day.
            </p>
          </GlassPanel>

          <motion.button
            whileTap={{ y: 3, boxShadow: 'none' }}
            onClick={onBack}
            className="w-full py-4 rounded-2xl font-black text-sm mt-2 text-white"
            style={{ background: `linear-gradient(135deg, ${TEAL}, ${GREEN})`, boxShadow: '0 5px 0 #0D9488' }}
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent' }}>
      <TidepoolBackdrop tint={moodColor} />
      {/* Header */}
      <div className="relative sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/mood_checkin.webp" alt="" draggable={false}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: `0 4px 10px ${GREEN}44` }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black leading-none truncate" style={{ color: '#1C1C1E' }}>
            Mood Check-In
          </h2>
          <div className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: '#6B7280' }}>
            Daily ritual · one honest minute
          </div>
        </div>
        {streak >= 2 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0"
            style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${GREEN}44` }}
            aria-label={`${streak} day streak`}>
            <span className="text-xs" aria-hidden>🔥</span>
            <span className="text-[11px] font-black" style={{ color: GREEN }}>{streak}</span>
          </div>
        )}
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
        {/* Intern greeting */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3"
        >
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 mt-0.5"
            style={{ background: `${GREEN}18` }}
          >
            {intern.avatar}
          </span>
          <div
            className="flex-1 px-4 py-3 rounded-2xl rounded-tl-sm text-xs font-medium leading-relaxed"
            style={{
              background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.95)',
              boxShadow: '0 3px 14px rgba(0,0,0,0.05)', color: '#374151',
            }}
          >
            {internGreeting}
          </div>
        </motion.div>

        {/* Mood — big tap targets; the room tints with the choice */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassPanel className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                Overall Mood
              </span>
              <span className="text-sm font-black transition-colors duration-300" style={{ color: moodColor }}>
                {MOOD_LABELS[mood - 1]}
              </span>
            </div>
            <TapScale
              value={mood}
              onChange={setMood}
              emojis={MOOD_EMOJIS}
              labels={MOOD_LABELS}
              colorFor={v => MOOD_COLORS[v - 1]}
            />
          </GlassPanel>
        </motion.div>

        {/* Energy */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassPanel className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                Energy Level
              </span>
              <span className="text-sm font-black" style={{ color: AMBER }}>
                {ENERGY_LABELS[energy - 1]}
              </span>
            </div>
            <TapScale
              value={energy}
              onChange={setEnergy}
              emojis={ENERGY_EMOJIS}
              labels={ENERGY_LABELS}
              colorFor={() => AMBER}
            />
          </GlassPanel>
        </motion.div>

        {/* Optional note */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel className="p-5">
            <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
              Anything on your mind? <span style={{ color: '#D1D5DB' }}>(optional)</span>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Just a quick thought..."
              aria-label="Anything on your mind (optional)"
              className="w-full bg-transparent text-sm font-medium outline-none resize-none placeholder-opacity-30"
              style={{ color: '#3C3C3C', caretColor: TEAL }}
            />
          </GlassPanel>
        </motion.div>

        <StoneShelf logs={moodLogs ?? []} />

        {/* LANCE commentary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-3 rounded-2xl text-xs italic font-medium flex items-start gap-2"
          style={{ background: 'rgba(240,253,250,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(20,184,166,0.25)' }}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: TEAL }} />
          <span style={{ color: '#3C3C3C' }}>
            LANCE notes: "Your feelings are essentially a data point. But data points matter. I'm not saying this to be encouraging."
          </span>
        </motion.div>

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ y: 3, boxShadow: 'none' }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl font-black text-sm text-white"
          style={{ background: `linear-gradient(135deg, ${TEAL}, ${GREEN})`, boxShadow: '0 5px 0 #0D9488' }}
        >
          Log Check-In ✓
        </motion.button>
      </div>
    </div>
  );
}
