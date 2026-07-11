import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  RITUAL DESIGNER (steady flame · roadmap #13). Families are held together by
//  rituals more than rules (Doherty's "intentional family"): the ceremony you
//  invent OWNS a slot in the week. Design it together — when, what always
//  happens, what it's called — and it enters THE TIDE TABLE for real: a
//  CalendarEvent lands on the next occurrence with the ritual inscribed, and
//  the ritual book persists (driftwood_rituals_v1).
// ═════════════════════════════════════════════════════════════════════════════

const OCCASIONS = [
  { id: 'meal',    emoji: '🍳', label: 'a meal that is OURS',        seed: 'same table, no screens, one question everyone answers' },
  { id: 'goodbye', emoji: '🚪', label: 'the goodbye & the hello',    seed: 'a real goodbye at the door, a 6-second hug at the return' },
  { id: 'bedtime', emoji: '🌙', label: 'the last 10 minutes of the day', seed: 'one good thing from today, said out loud, lights low' },
  { id: 'weekend', emoji: '🛶', label: 'a weekly small adventure',   seed: 'somewhere we have never stood before, even one block away' },
  { id: 'repair',  emoji: '🌊', label: 'after a storm',              seed: 'the walk-it-off loop, then the two sentences that reopen the door' },
  { id: 'win',     emoji: '🎉', label: 'when someone wins at anything', seed: 'the family horn sounds, everyone drops what they hold' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function nextDateFor(dayIdx: number): string {
  const d = new Date();
  const delta = (dayIdx - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function RitualDesigner({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const [phase, setPhase] = useState<'intro' | 'shape' | 'sealed'>('intro');
  const [occasion, setOccasion] = useState<typeof OCCASIONS[0] | null>(null);
  const [always, setAlways] = useState('');
  const [name, setName] = useState('');
  const [dayIdx, setDayIdx] = useState(6);
  const [time, setTime] = useState('18:00');

  const pick = (o: typeof OCCASIONS[0]) => { setOccasion(o); setAlways(o.seed); setPhase('shape'); };

  const seal = () => {
    const ritual = {
      occasion: occasion!.id, emoji: occasion!.emoji,
      name: name.trim() || `The ${occasion!.label} ritual`,
      always: always.trim(), day: DAYS[dayIdx], time,
      by: me.name || 'the family', at: new Date().toISOString(),
    };
    try {
      const book = JSON.parse(localStorage.getItem('driftwood_rituals_v1') || '[]');
      book.push(ritual);
      localStorage.setItem('driftwood_rituals_v1', JSON.stringify(book.slice(-20)));
    } catch { /* the ritual lives in the room first */ }
    // → THE TIDE TABLE, for real (the shared calendar's own shape)
    try {
      const events = JSON.parse(localStorage.getItem('driftwood_calendar_events_v1') || '[]');
      events.push({
        id: `ritual-${Date.now()}`,
        title: `${ritual.emoji} ${ritual.name}`,
        date: nextDateFor(dayIdx), time,
        type: 'other', organizer: ritual.by, attendees: [],
        notes: `A ritual this family invented together (${DAYS[dayIdx]}s). It repeats — same time next week, whoever lights it first.`,
        ritualPrompt: `We always: ${ritual.always}`,
      });
      localStorage.setItem('driftwood_calendar_events_v1', JSON.stringify(events));
    } catch { /* the calendar can catch up */ }
    feedTogether('ritual_designer', { occasion: occasion!.id });
    setPhase('sealed');
  };

  return (
    <GameShell emoji="🕯" title="Ritual Designer" subtitle="invent a ceremony · it owns a slot in the week"
      onClose={onClose} bg="linear-gradient(#2A2135, #3A2E48 55%, #4A3A2A)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'intro' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🕯📜</div>
            <p className="text-white/90 text-sm font-bold">Families run on rituals more than rules.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              A ritual is a small ceremony that always happens the same way — that's what makes it safe, and what makes it yours. Design one together: pick the moment, decide what ALWAYS happens, give it a name only this family would understand. It goes straight into the tide table.
            </p>
            <div className="flex flex-col gap-1.5">
              {OCCASIONS.map(o => (
                <button key={o.id} onClick={() => pick(o)} data-testid={`rd-occ-${o.id}`}
                  className="text-left bg-white/90 hover:brightness-105 rounded-xl px-3 py-2.5 text-[12.5px] font-bold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">{o.emoji}</span> {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === 'shape' && occasion && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-300">{occasion.emoji} shaping the ceremony — decide out loud, one types</p>
            <div className="bg-white/95 rounded-2xl px-4 py-3 flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-wide text-purple-600">we ALWAYS…</p>
              <textarea value={always} onChange={e => setAlways(e.target.value)} rows={2} data-testid="rd-always"
                className="text-sm rounded-xl px-3 py-2.5 bg-slate-100 text-slate-800 outline-none resize-none" />
            </div>
            <div className="bg-white/95 rounded-2xl px-4 py-3 flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-wide text-purple-600">its name (one only this family gets)</p>
              <input value={name} onChange={e => setName(e.target.value)} data-testid="rd-name"
                placeholder="e.g. Pancake Parliament · The Long Goodbye…"
                className="text-sm rounded-xl px-3 py-2.5 bg-slate-100 text-slate-800 outline-none" />
            </div>
            <div className="bg-white/95 rounded-2xl px-4 py-3 flex items-center gap-2">
              <select value={dayIdx} onChange={e => setDayIdx(+e.target.value)} data-testid="rd-day"
                className="flex-1 text-sm rounded-xl px-2 py-2 bg-slate-100 text-slate-800 outline-none">
                {DAYS.map((d, i) => <option key={d} value={i}>{d}s</option>)}
              </select>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} data-testid="rd-time"
                className="text-sm rounded-xl px-2 py-2 bg-slate-100 text-slate-800 outline-none" />
            </div>
            <button onClick={seal} data-testid="rd-seal" disabled={always.trim().length < 3}
              className={`font-black rounded-xl py-3 text-sm ${always.trim().length >= 3 ? 'bg-amber-500 text-white' : 'bg-white/20 text-white/50'}`}>
              Light it — into the tide table 🕯
            </button>
          </div>
        )}
        {phase === 'sealed' && occasion && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🕯✨</div>
            <p className="text-white text-lg font-black">{name.trim() || `The ${occasion.label} ritual`}</p>
            <p className="text-white/80 text-sm leading-relaxed">
              is now on the tide table — {DAYS[dayIdx]}s at {time}. A ritual only becomes real the third time it happens; the first two are rehearsal. Protect it like a little lighthouse.
            </p>
            <div className="flex gap-2">
              <button onClick={() => { setName(''); setPhase('intro'); }} className="flex-1 bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-sm">Design another</button>
              <button onClick={onClose} className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Back to the campfire</button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
