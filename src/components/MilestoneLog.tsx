import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, X, Lock, CheckCircle2, Circle, Flag } from 'lucide-react';
import { MILESTONES, SEASONS, isSeasonEnd, Milestone, Beat } from '../data/milestones';
import { CRAFT } from '../data/milestoneCraft';
import { TOOL_COMPLETION, readSaveSignature } from '../lance/components/LANCEGame/challengeCompletion';
import { appendEvent } from '../lib/world';
import { driftBell, tideCreak, emberPop } from '../lib/shoreSounds';
import { activeCastaway, readCrew } from '../lib/castaways';
import { useGame } from '../lance/components/LANCEGame/LANCEGameContext';

// ═════════════════════════════════════════════════════════════════════════════
//  THE MILESTONE LOG — the 31 survival firsts on the flagship loop (LANCE law,
//  2026-07-12): scene beats → the conjoint step (the conch passes) → the REAL
//  tool via the treaty → honest save-signature completion → XP + gems +
//  planks + embers → THE INSTRUMENT UNLOCKS (challenges teach the library,
//  app by app; production gates by therapist/paywall, dev trial stays open
//  via FREE_ACCESS_ALL) → season curtains.
//
//  LAWS: the log is optional and exitable at every beat · safety surfaces are
//  never instruments · an unfinished milestone is simply unfinished.
// ═════════════════════════════════════════════════════════════════════════════

interface LogState {
  closed: string[];
  // THE CHECKBOX GATE (the LANCE law, walked ashore 2026-07-12): work carries
  // a task list — the CRAFT steps as real checkboxes on the right of the
  // screen. A milestone closes only when the instrument's save signature
  // moved AND every box is checked. Each first check strikes a match or
  // lands a ration (rewarded[] guards the double-tap; the tide keeps what
  // it pays).
  investigating: { id: string; baseline: string; tasks?: boolean[]; rewarded?: boolean[] } | null;
}
const STATE_KEY = 'driftwood_milestone_log_v1';

// THE BRANCHING SPINE — the story remembers the family's choices.
const CHOICES_KEY = 'driftwood_story_choices_v1';
function readStoryChoices(): Record<string, string> {
  try { const r = JSON.parse(localStorage.getItem(CHOICES_KEY) || '{}'); return r && typeof r === 'object' ? r : {}; } catch { return {}; }
}
function writeStoryChoice(id: string, option: string) {
  try { const all = readStoryChoices(); all[id] = option; localStorage.setItem(CHOICES_KEY, JSON.stringify(all)); } catch { /* best-effort */ }
}

function loadState(): LogState {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (s && Array.isArray(s.closed)) return s;
  } catch { /* fresh log */ }
  return { closed: [], investigating: null };
}
function saveState(s: LogState) { localStorage.setItem(STATE_KEY, JSON.stringify(s)); }

// A campfire-game instrument completes on a genuinely finished round — the
// fire_quiz_played event the game itself appends (never a self-checked box).
function gameRounds(gameId: string): number {
  try {
    const evs = JSON.parse(localStorage.getItem('driftwood_events_v1') || '[]');
    return evs.filter((e: { action?: string; payload?: { game?: string } }) =>
      e?.action === 'fire_quiz_played' && e?.payload?.game === gameId).length;
  } catch { return 0; }
}

const ROBOT_NAMES: Record<string, { name: string; emoji: string }> = {
  skip:    { name: 'Skip',        emoji: '🤖' },
  hollow:  { name: 'Hollow',      emoji: '🐚' },
  echo2:   { name: 'Echo-2',      emoji: '📻' },
  bailer:  { name: 'Bailer',      emoji: '🪣' },
  collier: { name: 'The Collier', emoji: '⚒️' },
};

type Phase = 'log' | 'scene' | 'conch' | 'working' | 'closing' | 'closed';

// A story still that slow-zooms over its beat (the Ken Burns law). Missing
// art renders nothing at all — the text carries the scene alone, honestly.
function StoryArt({ src }: { src: string }) {
  const [ok, setOk] = React.useState(true);
  if (!ok) return null;
  return (
    <div className="rounded-2xl overflow-hidden border-2 border-outline-variant mb-1" style={{ aspectRatio: '16/9' }}>
      <img src={src} alt="" aria-hidden loading="lazy"
        className="w-full h-full object-cover story-kenburns"
        onError={() => setOk(false)} />
    </div>
  );
}

export default function MilestoneLog({ onOpenTool, hideShelf }: { onOpenTool: (id: string) => void; hideShelf?: boolean }) {
  const { addXp, addGems, unlockTool } = useGame();
  const [state, setState] = useState<LogState>(loadState);
  const [active, setActive] = useState<Milestone | null>(null);
  const [phase, setPhase] = useState<Phase>('log');
  const [beatIdx, setBeatIdx] = useState(0);
  const [conchConfirms, setConchConfirms] = useState<string[]>([]);
  const [curtain, setCurtain] = useState<{ season: number; name: string; arc: string } | null>(null);

  const firstOpen = useMemo(
    () => MILESTONES.find(m => !state.closed.includes(m.id))?.id ?? null,
    [state.closed],
  );

  // Honest completion, twice over (the checkbox gate): the instrument's real
  // store must have grown AND every task box must be checked. Neither alone
  // closes a milestone — the save proves the work, the boxes prove the crew
  // walked every step of it.
  useEffect(() => {
    const check = () => {
      const inv = loadState().investigating;
      if (!inv) return;
      const m = MILESTONES.find(x => x.id === inv.id);
      if (!m) return;
      const boxesDone = !inv.tasks?.length || inv.tasks.every(Boolean);
      if (!boxesDone) return;
      const craft = CRAFT[m.id];
      if (craft?.gameId) {
        // game instrument: a new finished round since the baseline closes it
        if (gameRounds(craft.gameId) > Number(inv.baseline || 0)) finishMilestone(m);
        return;
      }
      const signal = m.instrument
        ? (TOOL_COMPLETION as Record<string, { kind: string; keys?: string[] }>)[m.instrument.toolId]
        : null;
      if (!signal || signal.kind !== 'save' || !signal.keys) return;
      if (readSaveSignature(signal.keys) !== inv.baseline) {
        finishMilestone(m);
      }
    };
    window.addEventListener('driftwood:world-event', check);
    window.addEventListener('focus', check);
    // the island's story circles: walking into the ring opens the milestone
    const openFromIsland = (e: Event) => {
      const id = (e as CustomEvent).detail?.id as string | undefined;
      const m = MILESTONES.find(x => x.id === id);
      if (m) openMilestone(m);
    };
    window.addEventListener('driftwood:open-milestone', openFromIsland);
    check();
    return () => {
      window.removeEventListener('driftwood:world-event', check);
      window.removeEventListener('focus', check);
      window.removeEventListener('driftwood:open-milestone', openFromIsland);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every beat/phase change starts at the top (the Rehabit casebook lesson,
  // 2026-07-12): taller beats must not inherit the previous scroll position.
  React.useEffect(() => {
    document.querySelector('.absolute.inset-0.overflow-y-auto')?.scrollTo({ top: 0 });
  }, [phase, beatIdx]);

  // Returning to the island mid-work: the checklist dock resumes on its own —
  // a family that walked away from an open milestone doesn't lose the trail.
  React.useEffect(() => {
    if (!hideShelf) return;
    const inv = loadState().investigating;
    if (!inv) return;
    const m = MILESTONES.find(x => x.id === inv.id);
    if (m) { setActive(m); setPhase('working'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openMilestone = (m: Milestone) => {
    tideCreak();
    setActive(m); setBeatIdx(0); setConchConfirms([]);
    setPhase(state.investigating?.id === m.id ? 'working' : 'scene');
  };

  const afterScene = (m: Milestone) => {
    if (!m.instrument) { finishMilestone(m); return; }
    if (m.instrument.conjoint && readCrew().length > 1) { setPhase('conch'); return; }
    beginWork(m);
  };

  const beginWork = (m: Milestone) => {
    if (!m.instrument) return;
    const craft = CRAFT[m.id];
    // the task list boards with the work: one checkbox per CRAFT step
    const tasks = craft?.steps?.length ? craft.steps.map(() => false) : undefined;
    const rewarded = tasks ? tasks.map(() => false) : undefined;
    if (craft?.gameId) {
      // the instrument is a campfire game — baseline the real round count,
      // then send the crew to the fire with the right game queued
      const next = { ...loadState(), investigating: { id: m.id, baseline: String(gameRounds(craft.gameId)), tasks, rewarded } };
      setState(next); saveState(next);
      setPhase('working');
      try { sessionStorage.setItem('driftwood_pending_game', craft.gameId); } catch { /* menu still opens */ }
      window.dispatchEvent(new CustomEvent('driftwood:open-campfire'));
      return;
    }
    const signal = (TOOL_COMPLETION as Record<string, { kind: string; keys?: string[] }>)[m.instrument.toolId];
    const baseline = signal?.kind === 'save' && signal.keys ? readSaveSignature(signal.keys) : '';
    const next = { ...loadState(), investigating: { id: m.id, baseline, tasks, rewarded } };
    setState(next); saveState(next);
    setPhase('working');
    onOpenTool(m.instrument.toolId);
  };

  // A box gets checked: persist it, pay the survival wage on the FIRST check
  // (even steps strike a match 🔥, odd steps land a ration 🍲 — warmth and
  // food, the two needs a shipwrecked family works for), then re-run the
  // completion check in case the instrument's save already landed.
  const toggleTask = (i: number) => {
    const s = loadState();
    const inv = s.investigating;
    if (!inv?.tasks) return;
    const tasks = [...inv.tasks];
    tasks[i] = !tasks[i];
    const rewarded = [...(inv.rewarded ?? inv.tasks.map(() => false))];
    if (tasks[i] && !rewarded[i]) {
      rewarded[i] = true;
      appendEvent(activeCastaway().id, i % 2 === 0 ? 'match_earned' : 'food_earned', { milestoneId: inv.id, step: i });
      emberPop();
    }
    const next = { ...s, investigating: { ...inv, tasks, rewarded } };
    setState(next); saveState(next);
    if (tasks.every(Boolean)) {
      const m = MILESTONES.find(x => x.id === inv.id);
      if (!m) return;
      const craft = CRAFT[m.id];
      if (craft?.gameId) {
        if (gameRounds(craft.gameId) > Number(inv.baseline || 0)) finishMilestone(m);
        return;
      }
      const signal = m.instrument
        ? (TOOL_COMPLETION as Record<string, { kind: string; keys?: string[] }>)[m.instrument.toolId]
        : null;
      if (signal?.kind === 'save' && signal.keys && readSaveSignature(signal.keys) !== inv.baseline) {
        finishMilestone(m);
      }
    }
  };

  const finishMilestone = (m: Milestone) => {
    const already = loadState().closed.includes(m.id);
    const next: LogState = {
      closed: already ? loadState().closed : [...loadState().closed, m.id],
      investigating: null,
    };
    setState(next); saveState(next);
    if (!already) {
      driftBell();
      setTimeout(emberPop, 800);
      const me = activeCastaway();
      // THE FLAGSHIP ECONOMY: XP + gems into the one vendored economy (the
      // Rewards Store spends them), and the instrument UNLOCKS — each
      // milestone teaches one library app, the LANCE way.
      const keystone = isSeasonEnd(m);
      addXp(m.planks * (keystone ? 30 : 15));
      addGems(keystone ? 25 : 5);
      if (m.instrument) unlockTool(m.instrument.toolId);
      appendEvent(me.id, 'milestone_closed', { milestoneId: m.id, n: m.n });
      for (let i = 0; i < m.planks; i++) appendEvent(me.id, 'plank_earned', { milestoneId: m.id });
      appendEvent(me.id, 'ember_earned', { milestoneId: m.id });
      if (m.instrument?.conjoint) appendEvent(me.id, 'gathering_held', { milestoneId: m.id });
      if (isSeasonEnd(m)) {
        const s = SEASONS.find(x => x.n === m.season)!;
        setCurtain({ season: s.n, name: s.name, arc: s.arc });
      }
    }
    setActive(m);
    setBeatIdx(0);
    setPhase(CRAFT[m.id]?.closing?.length ? 'closing' : 'closed');
  };

  const backToLog = () => { setActive(null); setPhase('log'); setBeatIdx(0); setConchConfirms([]); };

  // ── Beat renderer ──────────────────────────────────────────────────────────
  const Beats = ({ beats, onDone, doneLabel }: { beats: Beat[]; onDone: () => void; doneLabel: string }) => {
    const [flags, setFlags] = React.useState(() => readStoryChoices());
    const activeBeats = beats.filter(b => !b.when || flags[b.when.flag] === b.when.is);
    const visible = activeBeats.slice(0, beatIdx + 1);
    const atEnd = beatIdx >= activeBeats.length - 1;
    const current = visible[visible.length - 1];
    const pendingChoice = current?.kind === 'choice' && !flags[current.id] ? current : null;
    return (
      <div className="flex flex-col gap-2">
        {visible.map((b, i) => (
          <div key={i}>
            {b.art && <StoryArt src={b.art} />}
            {b.kind === 'narration' && (
              <p className="font-serif italic text-[12px] leading-relaxed text-slate-600 px-1">{b.text}</p>
            )}
            {b.kind === 'choice' && flags[b.id] && (
              <p className="text-[10.5px] text-teal-700 italic px-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {b.options.find(o => o.id === flags[b.id])?.label}
              </p>
            )}
            {b.kind === 'robot' && (
              <div className="p-2.5 bg-surface-container-lowest border-2 border-outline-variant rounded-2xl flex items-start gap-2">
                <span className="text-lg shrink-0">{ROBOT_NAMES[b.who].emoji}</span>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-amber-600">{ROBOT_NAMES[b.who].name}</p>
                  <p className="text-[11.5px] leading-relaxed text-slate-700">{b.text}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {pendingChoice ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-700 text-center">{pendingChoice.prompt}</p>
            {pendingChoice.options.map(opt => (
              <button key={opt.id}
                onClick={() => { writeStoryChoice(pendingChoice.id, opt.id); setFlags(readStoryChoices()); }}
                className="w-full py-2.5 px-3 bg-white border-2 border-teal-600/40 hover:bg-teal-50 text-slate-700 font-bold rounded-2xl text-[12px] cursor-pointer transition-colors text-left">
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
        <button
          onClick={() => (atEnd ? onDone() : setBeatIdx(beatIdx + 1))}
          className="w-full py-2.5 bg-primary text-white font-display font-black rounded-xl border-b-[3px] border-primary-dark text-xs cursor-pointer hover:brightness-105 active:translate-y-[1px] flex items-center justify-center gap-1"
        >
          {atEnd ? doneLabel : 'Continue'} <ChevronRight className="w-3.5 h-3.5" />
        </button>
        )}
      </div>
    );
  };

  // ── The log shelf ──────────────────────────────────────────────────────────
  // island-only law (2026-07-12): off-island, there is nothing to browse or
  // open here — the shelf IS the island's story circles now. hideShelf mounts
  // this component invisibly until a milestone is actually triggered.
  if (phase === 'log' || !active) {
    if (hideShelf) return null;
    return (
      <div className="bg-white rounded-[2rem] border-2 border-outline-variant p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-display font-black text-sm text-slate-800">The Milestone Log</h3>
            <p className="text-[10px] text-slate-400">31 survival firsts · five seasons · the island only yields to together</p>
          </div>
          <span className="text-[10px] font-black text-amber-600">{state.closed.length}/31</span>
        </div>
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
          {MILESTONES.map(m => {
            const closed = state.closed.includes(m.id);
            const isNext = m.id === firstOpen;
            const seasonStart = MILESTONES.find(x => x.season === m.season)?.id === m.id;
            return (
              <React.Fragment key={m.id}>
                {seasonStart && (
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 pt-2 px-1">
                    Season {m.season} · {SEASONS.find(s => s.n === m.season)!.name}
                    <span className="normal-case tracking-normal font-semibold italic"> — {SEASONS.find(s => s.n === m.season)!.arc}</span>
                  </p>
                )}
                <button
                  onClick={() => (closed || isNext) && openMilestone(m)}
                  disabled={!closed && !isNext}
                  className={`w-full p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-2 ${
                    closed ? 'bg-amber-50 border-amber-200 cursor-pointer'
                    : isNext ? 'bg-white border-primary/50 cursor-pointer hover:bg-primary/5'
                    : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-[11px] font-black ${closed ? 'text-amber-700' : isNext ? 'text-slate-800' : 'text-slate-300'}`}>
                      {m.n} · {m.title}
                    </p>
                    <p className={`text-[9px] italic ${closed || isNext ? 'text-slate-400' : 'text-slate-300'}`}>{m.first}</p>
                    {state.investigating?.id === m.id && m.instrument && (
                      <p className="text-[8px] font-black text-primary mt-0.5">WORK OPEN — {m.instrument.toolName}. Do it for real; the island knows.</p>
                    )}
                  </div>
                  <span className="shrink-0">
                    {closed ? <span className="text-sm">🪵</span>
                      : isNext ? <ChevronRight className="w-4 h-4 text-primary" />
                      : <Lock className="w-3 h-3 text-slate-200" />}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-center text-[8px] text-slate-400 italic mt-2">
          The log is yours to open or set aside — every tool stays free of it, always.
        </p>
      </div>
    );
  }

  // ── Season curtain (full-screen; tap to lift) ─────────────────────────────
  if (curtain) {
    return (
      <button
        onClick={() => setCurtain(null)}
        className="fixed inset-0 z-50 cursor-pointer"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #1E2A44 0%, #141C30 60%, #0C111E 100%)' }}
        aria-label="Lift the curtain"
      >
        <video
          src={`/shore/curtain${curtain.season}.mp4`}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          onLoadedData={e => { (e.target as HTMLVideoElement).style.opacity = '0.4'; (e.target as HTMLVideoElement).style.transition = 'opacity 1.5s'; }}
          onError={e => { (e.target as HTMLVideoElement).remove(); }}
        />
        <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-300/70">season {curtain.season} is over</p>
          <h2 className="text-3xl font-display font-black text-amber-50 mt-3 drop-shadow-lg">{curtain.name}</h2>
          <p className="text-[13px] italic text-amber-100/75 font-serif mt-3 max-w-sm leading-relaxed">{curtain.arc}</p>
          <p className="text-[10px] text-amber-200/40 mt-10 uppercase tracking-widest">tap to continue the crossing</p>
        </div>
      </button>
    );
  }

  // ── Scene / conch / working / closed ───────────────────────────────────────
  const activeCard = (
    <div className="bg-white rounded-[2rem] border-2 border-outline-variant p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-1">
          <Flag className="w-3 h-3" /> Milestone {active.n} · {active.title}
        </p>
        <button onClick={backToLog} className="p-1 text-slate-300 hover:text-slate-500 cursor-pointer" aria-label="Set the milestone aside">
          <X className="w-4 h-4" />
        </button>
      </div>

      {phase === 'scene' && (
        <>
          <Beats
            beats={active.opening}
            doneLabel={active.instrument
              ? (active.instrument.conjoint && readCrew().length > 1 ? 'Pass the conch' : `Do it: ${active.instrument.toolName}`)
              : 'Mark the first'}
            onDone={() => afterScene(active)}
          />
          {/* THE NAMES LAW ("the story is about US"): where the story counts
              or carves the family, the REAL claimed names appear. */}
          {active.id === 'ms_count_heads' && readCrew().length > 0 && (
            <div className="mt-2 p-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-600 mb-1">the headcount</p>
              <p className="text-[12px] font-display font-black text-amber-800">
                {readCrew().map(c => c.name).join(' · ')} — all ashore.
              </p>
            </div>
          )}
          {active.id === 'ms_launch_council' && readCrew().length > 0 && (
            <div className="mt-2 p-2.5 rounded-2xl text-center" style={{ background: '#2A1F14', border: '2px solid #B4530966' }}>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-500/80 mb-1">cut into the totem</p>
              <p className="text-[12px] font-display font-black tracking-wide" style={{ color: '#E7C892' }}>
                {readCrew().map(c => c.name.toUpperCase()).join(' · ')}
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: '#B45309' }}>
                MR. BAUER'S FAMILY — ALL OF US
              </p>
            </div>
          )}
        </>
      )}

      {phase === 'conch' && active.instrument && (
        <div className="flex flex-col gap-2">
          <p className="font-serif italic text-[12px] text-slate-600 px-1">
            🐚 This first is a TOGETHER first. The phone is the conch: pass it around —
            each person taps their name to say "I'm here for this one."
          </p>
          {readCrew().map(c => {
            const confirmed = conchConfirms.includes(c.slotId);
            return (
              <button
                key={c.slotId}
                onClick={() => setConchConfirms(prev => confirmed ? prev.filter(x => x !== c.slotId) : [...prev, c.slotId])}
                className={`w-full p-2.5 rounded-xl border-2 text-left flex items-center gap-2 cursor-pointer ${confirmed ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
              >
                {confirmed ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-slate-300" />}
                <span className="text-[11px] font-black text-slate-700">{c.name}</span>
              </button>
            );
          })}
          <button
            onClick={() => beginWork(active)}
            disabled={conchConfirms.length < Math.min(2, readCrew().length)}
            className={`w-full py-2.5 font-display font-black rounded-xl text-xs flex items-center justify-center gap-1 ${
              conchConfirms.length >= Math.min(2, readCrew().length)
                ? 'bg-primary text-white border-b-[3px] border-primary-dark cursor-pointer'
                : 'bg-slate-100 text-slate-300'
            }`}
          >
            Together: {active.instrument.toolName} <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <p className="text-[8px] text-slate-400 italic text-center">
            Solo tonight? That's honest too — set it aside and bring the crew at the next Gathering. Nothing is lost by waiting.
          </p>
        </div>
      )}

      {phase === 'working' && active.instrument && (
        <div className="flex flex-col gap-2 py-2">
          <p className="text-[12px] font-black text-slate-700 text-center">The work is open.</p>
          <p className="text-[11px] text-slate-500 leading-relaxed px-2 text-center">{active.instrument.why}</p>
          {state.investigating?.tasks && CRAFT[active.id]?.steps && (
            <div className="flex flex-col gap-1.5 my-1" data-testid="work-checklist">
              {CRAFT[active.id].steps.map((st, i) => {
                const done = !!state.investigating?.tasks?.[i];
                return (
                  <button key={i} onClick={() => toggleTask(i)} data-testid={`work-task-${i}`}
                    className={`flex items-start gap-2 p-2 rounded-xl border-2 text-left cursor-pointer transition-all ${done ? 'bg-emerald-50 border-emerald-300' : 'bg-surface-container-lowest border-outline-variant hover:border-primary/40'}`}>
                    {done ? <CheckCircle2 className="shrink-0 w-5 h-5 text-emerald-500" /> : <Circle className="shrink-0 w-5 h-5 text-slate-300" />}
                    <span className={`text-[11px] leading-relaxed ${done ? 'text-emerald-800' : 'text-slate-600'}`}>{st}</span>
                    <span className="shrink-0 ml-auto text-xs" title={i % 2 === 0 ? 'strikes a match' : 'lands a ration'}>{i % 2 === 0 ? '🔥' : '🍲'}</span>
                  </button>
                );
              })}
            </div>
          )}
          <button
            onClick={() => {
              const craft = CRAFT[active.id];
              if (craft?.gameId) {
                try { sessionStorage.setItem('driftwood_pending_game', craft.gameId); } catch { /* menu opens */ }
                window.dispatchEvent(new CustomEvent('driftwood:open-campfire'));
              } else onOpenTool(active.instrument!.toolId);
            }}
            className="w-full py-2.5 bg-secondary text-white font-display font-black rounded-xl border-b-[3px] border-on-secondary-container text-xs cursor-pointer"
          >
            {CRAFT[active.id]?.gameId ? `🏕 To the fire: ${active.instrument.toolName}` : `Open ${active.instrument.toolName}`}
          </button>
          <p className="text-[8px] text-slate-400 italic text-center">
            The island counts twice: the real saved work AND every step walked. Checked steps strike matches 🔥 and land rations 🍲.
          </p>
          <button onClick={backToLog} className="text-[10px] font-bold text-slate-400 cursor-pointer py-1 text-center w-full">
            Set it aside for now
          </button>
        </div>
      )}

      {phase === 'closing' && CRAFT[active.id]?.closing && (
        <Beats
          beats={CRAFT[active.id].closing}
          doneLabel="Lay the plank"
          onDone={() => setPhase('closed')}
        />
      )}

      {phase === 'closed' && (
        <div className="flex flex-col gap-2 text-center py-2">
          <span className="text-2xl">🪵</span>
          <p className="text-[13px] font-display font-black text-slate-800">{active.title} — done for real.</p>
          <p className="text-[10px] text-slate-500">
            +{active.planks} plank{active.planks > 1 ? 's' : ''} on the raft · +1 ember for the fire.
            The camp never shrinks; this is yours forever.
          </p>
          <button onClick={backToLog}
            className="w-full py-2.5 bg-amber-500 text-white font-display font-black rounded-xl border-b-[3px] border-amber-600 text-xs cursor-pointer">
            Back to the log
          </button>
        </div>
      )}
    </div>
  );

  // On the island (hideShelf), a triggered milestone floats as a real overlay
  // above the 3D world instead of an inline tab card — the story circle calls,
  // this answers, and closing it drops you right back on the ground you stood on.
  if (hideShelf) {
    // While the WORK is open, the milestone must not block the instrument
    // beneath it — it docks as the flagship's checkbox panel on the RIGHT of
    // the screen (the LANCE law, verbatim from the captain), checking off the
    // steps while the family does the real thing.
    if (phase === 'working' && active.instrument) {
      const steps = CRAFT[active.id]?.steps ?? [];
      const tasks = state.investigating?.tasks;
      const doneCount = tasks?.filter(Boolean).length ?? 0;
      return (
        <div className="fixed right-3 top-24 bottom-24 z-[80] w-[240px] max-w-[62vw] flex flex-col pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-3xl border-2 border-outline-variant shadow-xl flex flex-col overflow-hidden max-h-full" data-testid="work-checklist">
            <div className="px-3.5 pt-3 pb-2 border-b border-outline-variant/50 shrink-0">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-1">
                <Flag className="w-2.5 h-2.5" /> Milestone {active.n}
              </p>
              <p className="text-[11px] font-display font-black text-slate-800 leading-tight">{active.title}</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">{doneCount}/{tasks?.length ?? 0} steps · every ✓ pays 🔥 or 🍲</p>
            </div>
            <div className="flex-1 overflow-y-auto px-2.5 py-2 flex flex-col gap-1.5">
              {steps.map((st, i) => {
                const done = !!tasks?.[i];
                return (
                  <button key={i} onClick={() => toggleTask(i)} data-testid={`work-task-${i}`}
                    className={`flex items-start gap-1.5 p-2 rounded-xl border-2 text-left cursor-pointer transition-all ${done ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-outline-variant hover:border-primary/40'}`}>
                    {done ? <CheckCircle2 className="shrink-0 w-4 h-4 text-emerald-500 mt-0.5" /> : <Circle className="shrink-0 w-4 h-4 text-slate-300 mt-0.5" />}
                    <span className={`text-[9.5px] leading-snug ${done ? 'text-emerald-800' : 'text-slate-600'}`}>{st}</span>
                    <span className="shrink-0 ml-auto text-[10px]">{i % 2 === 0 ? '🔥' : '🍲'}</span>
                  </button>
                );
              })}
            </div>
            <div className="px-2.5 pb-2.5 shrink-0 flex flex-col gap-1">
              <button
                onClick={() => {
                  const craft = CRAFT[active.id];
                  if (craft?.gameId) {
                    try { sessionStorage.setItem('driftwood_pending_game', craft.gameId); } catch { /* menu opens */ }
                    window.dispatchEvent(new CustomEvent('driftwood:open-campfire'));
                  } else onOpenTool(active.instrument!.toolId);
                }}
                className="w-full py-2 bg-secondary text-white font-display font-black rounded-xl border-b-[3px] border-on-secondary-container text-[10px] cursor-pointer">
                {CRAFT[active.id]?.gameId ? '🏕 To the fire' : `Open ${active.instrument.toolName}`}
              </button>
              <button onClick={backToLog} className="text-[9px] font-bold text-slate-400 cursor-pointer text-center w-full">
                Set it aside
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 overflow-y-auto">
        <div className="w-full max-w-md sm:my-auto">{activeCard}</div>
      </div>
    );
  }
  return activeCard;
}
