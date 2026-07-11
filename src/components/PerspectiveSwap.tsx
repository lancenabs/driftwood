import React, { useState } from 'react';
import { Repeat, ChevronRight, X } from 'lucide-react';
import { readCrew, activeCastaway, THE_SEVEN } from '../lib/castaways';
import { appendEvent } from '../lib/world';

// ═════════════════════════════════════════════════════════════════════════════
//  THE PERSPECTIVE SWAP — the crown mechanic (bible §5; nobody has built this).
//  Play as another member's castaway: carry their load, answer as them, tend
//  what they tend. Psychodrama's role reversal + the empty chair, made
//  playable.
//
//  THE SPINE IS CONSENT: a swap is INVITED (in person, out loud — the app
//  asks you to ask them, then both tap), BOUNDED (one scene: a written
//  walkthrough of their ordinary day), BANNERED (the honest strip stays on
//  screen the whole time — no impersonation, ever), and DEBRIEFED (the card
//  is the treatment: what was heaviest about their day?). Receipts land on
//  the world ledger so a paired therapist can see the swap happened —
//  counts only, never content.
// ═════════════════════════════════════════════════════════════════════════════

type Phase = 'closed' | 'invite' | 'consent' | 'walk' | 'debrief' | 'done';

const WALK_PROMPTS = [
  'Their alarm goes off. What is the FIRST thing on their plate that you usually never see?',
  'Mid-day. Name two loads they carry for this family that happen quietly, without applause.',
  'Something goes sideways — the kind of sideways that finds THEM specifically. What lands on them, and who do they worry about first?',
  'Evening. What do they still have left to do after everyone else has stopped?',
];

const DEBRIEF_PROMPTS = [
  'What was heaviest about their day?',
  'What did you not know until you carried it?',
  'What is one thing you want to say to them, now that you have walked it?',
];

export default function PerspectiveSwap() {
  const [phase, setPhase] = useState<Phase>('closed');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [walkIdx, setWalkIdx] = useState(0);
  const [walkNotes, setWalkNotes] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [debriefIdx, setDebriefIdx] = useState(0);
  const [debriefNotes, setDebriefNotes] = useState<string[]>([]);

  const me = activeCastaway();
  const crew = readCrew();
  const others = crew.filter(c => c.slotId !== me.id);
  const partner = crew.find(c => c.slotId === partnerId);
  const partnerSlot = THE_SEVEN.find(s => s.id === partnerId);

  const reset = () => {
    setPhase('closed'); setPartnerId(null); setWalkIdx(0);
    setWalkNotes([]); setNote(''); setDebriefIdx(0); setDebriefNotes([]);
  };

  const finishSwap = () => {
    // The receipt: the swap HAPPENED — who walked as whom, when, and that the
    // debrief was completed. Counts only; the notes stay on this device with
    // the family (they are shown once, at the fire, and saved locally).
    try {
      const log = JSON.parse(localStorage.getItem('driftwood_swaps_v1') || '[]');
      log.push({
        walker: me.id, walked: partnerId, at: new Date().toISOString(),
        debrief: debriefNotes.filter(Boolean),
      });
      localStorage.setItem('driftwood_swaps_v1', JSON.stringify(log.slice(-50)));
    } catch { /* ignore */ }
    appendEvent(me.id, 'swap_debriefed', { walked: partnerId });
    setPhase('done');
  };

  if (phase === 'closed') {
    return (
      <button
        onClick={() => setPhase(others.length ? 'invite' : 'closed')}
        disabled={!others.length}
        className={`w-full mb-4 p-4 rounded-[2rem] border-2 text-left flex items-center justify-between transition-all ${
          others.length ? 'bg-white border-outline-variant hover:border-primary/50 cursor-pointer' : 'bg-slate-50 border-slate-100'
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Repeat className="w-4 h-4 text-indigo-600" />
          </span>
          <span>
            <span className="block text-xs font-display font-black text-slate-800">Walk a Day in Their Boots</span>
            <span className="block text-[10px] text-slate-400">
              {others.length
                ? 'the perspective swap — carry their load for one scene, with their yes'
                : 'needs two claimed castaways — the swap starts when family joins'}
            </span>
          </span>
        </span>
        {others.length > 0 && <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />}
      </button>
    );
  }

  return (
    <div data-testid="perspective-swap" className="w-full mb-4 p-4 bg-white rounded-[2rem] border-2 border-outline-variant relative">
      {/* THE HONEST BANNER — visible through every swap phase. */}
      {(phase === 'walk' || phase === 'debrief') && partner && (
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-3 px-4 py-1.5 bg-indigo-600 rounded-t-[2rem] text-center pointer-events-none">
          <p className="text-[9px] font-black text-white uppercase tracking-wider">
            🔁 {me.name} is walking as {partner.name} — a bounded swap, invited and agreed. Nobody is being impersonated.
          </p>
        </div>
      )}
      <button onClick={reset} className="absolute top-3 right-3 p-1 text-slate-300 hover:text-slate-500 cursor-pointer" aria-label="Close the swap">
        <X className="w-4 h-4" />
      </button>

      {phase === 'invite' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-display font-black text-slate-800">Whose boots?</p>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            The swap has one law: <strong>their yes comes first.</strong> Pick the family member,
            then ask them out loud — the next screen is theirs to tap.
          </p>
          {others.map(c => {
            const slot = THE_SEVEN.find(s => s.id === c.slotId)!;
            return (
              <button key={c.slotId} onClick={() => { setPartnerId(c.slotId); setPhase('consent'); }}
                className="w-full p-3 rounded-xl border-2 border-outline-variant hover:border-indigo-300 text-left cursor-pointer">
                <span className="text-[11px] font-black text-slate-700">{slot.emoji} {c.name}</span>
                <span className="block text-[9px] text-slate-400">{slot.role}</span>
              </button>
            );
          })}
        </div>
      )}

      {phase === 'consent' && partner && (
        <div className="flex flex-col gap-3 text-center py-2">
          <p className="text-xs font-display font-black text-slate-800">Pass the phone to {partner.name}.</p>
          <div className="p-3 bg-indigo-50 border-2 border-indigo-100 rounded-xl text-left">
            <p className="text-[11px] text-slate-700 leading-relaxed">
              <strong>{partner.name}</strong> — {me.name} is asking to walk one scene of your
              ordinary day: your morning, your quiet loads, your evening. You'll see everything
              they write, together, at the end. Nothing happens without this tap.
            </p>
          </div>
          <button
            onClick={() => { appendEvent(partnerId!, 'swap_consented', { walker: me.id }); setPhase('walk'); }}
            className="w-full py-2.5 bg-indigo-600 text-white font-display font-black rounded-xl border-b-[3px] border-indigo-700 text-xs cursor-pointer"
          >
            Yes — walk my day ({partner.name} taps this)
          </button>
          <button onClick={reset} className="text-[10px] font-bold text-slate-400 cursor-pointer">
            Not tonight (that's a full answer)
          </button>
        </div>
      )}

      {phase === 'walk' && partner && (
        <div className="flex flex-col gap-2">
          <p className="text-[9px] font-black uppercase tracking-wider text-indigo-500">
            Scene {walkIdx + 1} of {WALK_PROMPTS.length} · walking as {partner.name} ({partnerSlot?.role})
          </p>
          <p className="text-[12px] font-serif italic text-slate-700 leading-relaxed">{WALK_PROMPTS[walkIdx]}</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Write it as them — first person, honest guesses welcome…"
            className="w-full h-20 p-3 bg-slate-50 border-2 border-outline-variant rounded-xl text-[11px] focus:outline-none focus:border-indigo-400 resize-none"
          />
          <button
            onClick={() => {
              setWalkNotes(prev => [...prev, note]); setNote('');
              if (walkIdx < WALK_PROMPTS.length - 1) setWalkIdx(walkIdx + 1);
              else setPhase('debrief');
            }}
            disabled={!note.trim()}
            className={`w-full py-2.5 font-display font-black rounded-xl text-xs ${note.trim() ? 'bg-indigo-600 text-white border-b-[3px] border-indigo-700 cursor-pointer' : 'bg-slate-100 text-slate-300'}`}
          >
            {walkIdx < WALK_PROMPTS.length - 1 ? 'Next scene' : 'End the walk — debrief together'}
          </button>
        </div>
      )}

      {phase === 'debrief' && partner && (
        <div className="flex flex-col gap-2">
          <p className="text-[9px] font-black uppercase tracking-wider text-indigo-500">
            The debrief — read your walk to {partner.name}, then answer together
          </p>
          {debriefIdx === 0 && walkNotes.length > 0 && (
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl max-h-28 overflow-y-auto">
              {walkNotes.map((w, i) => (
                <p key={i} className="text-[10px] text-slate-600 italic mb-1.5">"{w}"</p>
              ))}
            </div>
          )}
          <p className="text-[12px] font-serif italic text-slate-700">{DEBRIEF_PROMPTS[debriefIdx]}</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Both voices welcome here…"
            className="w-full h-16 p-3 bg-slate-50 border-2 border-outline-variant rounded-xl text-[11px] focus:outline-none focus:border-indigo-400 resize-none"
          />
          <button
            onClick={() => {
              setDebriefNotes(prev => [...prev, note]); setNote('');
              if (debriefIdx < DEBRIEF_PROMPTS.length - 1) setDebriefIdx(debriefIdx + 1);
              else finishSwap();
            }}
            disabled={!note.trim()}
            className={`w-full py-2.5 font-display font-black rounded-xl text-xs ${note.trim() ? 'bg-[#58CC02] text-white border-b-[3px] border-[#46A302] cursor-pointer' : 'bg-slate-100 text-slate-300'}`}
          >
            {debriefIdx < DEBRIEF_PROMPTS.length - 1 ? 'Next' : 'Close the swap'}
          </button>
        </div>
      )}

      {phase === 'done' && partner && (
        <div className="flex flex-col gap-2 text-center py-2">
          <span className="text-2xl">🥾</span>
          <p className="text-[13px] font-display font-black text-slate-800">You walked it.</p>
          <p className="text-[10px] text-slate-500 leading-relaxed px-2">
            "I can see it from their side" just stopped being a worksheet phrase.
            The debrief is saved on this device; the swap itself feeds TOGETHER on the shore.
          </p>
          <button onClick={reset}
            className="w-full py-2.5 bg-indigo-600 text-white font-display font-black rounded-xl border-b-[3px] border-indigo-700 text-xs cursor-pointer">
            Back to the shore
          </button>
        </div>
      )}
    </div>
  );
}
