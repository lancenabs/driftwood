import React, { useEffect, useState } from 'react';
import { gatheringState, hostGathering, joinGathering, leaveGathering, passConch, resumeGathering, GatheringState } from '../lib/gathering';
import { readEvents } from '../lib/world';
import { THE_SEVEN, readCrew, activeCastaway } from '../lib/castaways';
// "Walk together" now opens the SAME 3D island as the shore door (one island,
// no confusion). The 3D world reads the live camp and puts the family on the
// same ground — the old 2D IslandSeek map is retired as the play surface.
const enterIsland = () => window.dispatchEvent(new CustomEvent('driftwood:walk-island'));

// The standing rally, if one is out: the latest rally_called (≤2h old) with
// no rally_met after it. Read from the world log — the Gathering transport
// already merges the family's calls into it.
function activeRally(): { spotName: string; name: string } | null {
  const evs = readEvents();
  for (let i = evs.length - 1; i >= 0; i--) {
    const e = evs[i];
    if (e.action === 'rally_met') return null;
    if (e.action === 'rally_called') {
      if (Date.now() - Date.parse(e.at) > 2 * 3600 * 1000) return null;
      return { spotName: String(e.payload?.spotName ?? 'the meeting spot'), name: String(e.payload?.name ?? 'Someone') };
    }
  }
  return null;
}

// ═════════════════════════════════════════════════════════════════════════════
//  THE GATHERING BAR — the fire circle, live (D3D-0 · bible §6).
//  Host reads the camp code aloud; each phone joins; the shore becomes SHARED:
//  every real act lands on every device, the fire feeds for the whole crew,
//  and the conch travels between phones (the phone IS the conch).
//  No-shame law: presence shows who's here, never who isn't.
// ═════════════════════════════════════════════════════════════════════════════

export default function GatheringBar() {
  const [g, setG] = useState<GatheringState>(gatheringState());
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'idle' | 'join'>('idle');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sync = () => setG(gatheringState());
    window.addEventListener('driftwood:gathering', sync);
    // rallies arrive as world events (the family calling from another device)
    window.addEventListener('driftwood:world-event', sync);
    resumeGathering();                 // a dropped phone shouldn't end the circle
    return () => {
      window.removeEventListener('driftwood:gathering', sync);
      window.removeEventListener('driftwood:world-event', sync);
    };
  }, []);

  const me = activeCastaway();
  const crew = readCrew();
  const slotEmoji = (id: string) => THE_SEVEN.find(s => s.id === id)?.emoji ?? '🏝️';
  const nameOf = (id: string) => crew.find(c => c.slotId === id)?.name
    ?? g.presence.find(p => p.actor === id)?.name ?? 'Castaway';

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true); setErr(null);
    try { await fn(); setMode('idle'); setJoinCode(''); }
    catch (e: any) { setErr(e.message); }
    setBusy(false);
  };

  // ── Not gathered: the invitation ──
  if (!g.code) {
    return (
      <div className="rounded-[2rem] border-2 border-outline-variant bg-white p-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg">🔥</span>
          <div className="flex-1 min-w-[140px]">
            <p className="text-[11px] font-black text-slate-700">The Gathering</p>
            <p className="text-[9px] text-slate-400">meet on the same shore — each phone, one camp</p>
          </div>
          {mode === 'idle' ? (
            <div className="flex gap-1.5">
              <button onClick={() => act(hostGathering)} disabled={busy}
                className="text-[10px] font-black uppercase tracking-wide rounded-full px-3 py-1.5 bg-amber-500 text-white disabled:opacity-50">
                Light the fire
              </button>
              <button onClick={() => setMode('join')}
                className="text-[10px] font-black uppercase tracking-wide rounded-full px-3 py-1.5 border-2 border-outline-variant text-slate-600">
                Join a camp
              </button>
            </div>
          ) : (
            <form className="flex gap-1.5" onSubmit={e => { e.preventDefault(); act(() => joinGathering(joinCode)); }}>
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="CAMP CODE" maxLength={6} autoFocus
                className="w-24 text-center text-[11px] font-black tracking-[0.2em] border-2 border-outline-variant rounded-full px-2 py-1.5 outline-none focus:border-amber-400" />
              <button disabled={busy || joinCode.length < 6}
                className="text-[10px] font-black uppercase rounded-full px-3 py-1.5 bg-amber-500 text-white disabled:opacity-40">Join</button>
              <button type="button" onClick={() => { setMode('idle'); setErr(null); }}
                className="text-[10px] text-slate-400 px-1">✕</button>
            </form>
          )}
        </div>
        {err && <p className="text-[9px] text-rose-500 font-bold mt-1.5">{err}</p>}
      </div>
    );
  }

  // ── Gathered: the fire circle ──
  const iHoldConch = g.conchHolder === me.id;
  return (
    <div className="rounded-[2rem] border-2 border-amber-300 bg-amber-50 p-3 mb-4" data-testid="gathering-live">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-lg" style={{ filter: g.connected ? 'drop-shadow(0 0 6px rgba(255,166,77,0.8))' : 'grayscale(1)' }}>🔥</span>
        <div className="flex-1 min-w-[120px]">
          <p className="text-[11px] font-black text-amber-800">
            {g.connected ? 'The fire is lit' : 'Rejoining the circle…'}
            <span className="ml-2 font-mono tracking-[0.25em] text-amber-600" data-testid="camp-code">{g.code}</span>
          </p>
          <p className="text-[9px] text-amber-600/80">
            {g.hosting ? 'read the code aloud — each phone joins with it' : 'gathered at the family fire'}
          </p>
        </div>
        <button onClick={enterIsland}
          className="text-[9px] font-black uppercase tracking-wide rounded-full px-2.5 py-1 bg-emerald-500 text-white"
          title="Walk the 3D island together — the family on the same ground, live">
          🏝 Walk together
        </button>
        <button onClick={() => leaveGathering()}
          className="text-[9px] font-black uppercase tracking-wide rounded-full px-2.5 py-1 border border-amber-300 text-amber-700">
          Leave quietly
        </button>
      </div>

      {/* a standing rally — someone is waiting at a named place, live */}
      {(() => {
        const r = activeRally();
        if (!r) return null;
        return (
          <div className="flex items-center gap-2 mt-2 p-2 rounded-2xl bg-white border-2 border-teal-500/40" data-testid="rally-banner">
            <span className="text-base animate-pulse">📣</span>
            <p className="flex-1 text-[10px] font-black text-teal-800">
              {r.name} called the family to <span className="uppercase tracking-wide">{r.spotName}</span> — they're waiting there now.
            </p>
            <button onClick={enterIsland}
              className="shrink-0 text-[9px] font-black uppercase tracking-wide rounded-full px-2.5 py-1.5 bg-teal-600 text-white cursor-pointer">
              🏝 Walk there
            </button>
          </div>
        );
      })()}

      {/* presence — warm, never counting absence */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap" data-testid="gathering-presence">
        {g.presence.map((p, i) => (
          <span key={`${p.actor}-${i}`}
            className={`inline-flex items-center gap-1 text-[9px] font-bold rounded-full px-2 py-0.5 border ${p.actor === g.conchHolder ? 'bg-white border-amber-400 text-amber-700' : 'bg-white/60 border-amber-200 text-slate-600'}`}>
            {slotEmoji(p.actor)} {p.name}{p.actor === g.conchHolder && ' 🐚'}
          </span>
        ))}
        {g.presence.length === 1 && <span className="text-[9px] text-amber-600/70 italic">the fire is ready — the crew arrives when it arrives</span>}
      </div>

      {/* the conch — the phone that holds it speaks */}
      {g.presence.length >= 2 && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-wide text-amber-700">
            🐚 {g.conchHolder ? (iHoldConch ? 'You hold the shell — the circle listens' : `${nameOf(g.conchHolder)} holds the shell`) : 'The shell rests on the sand'}
          </span>
          {(iHoldConch || !g.conchHolder) && (
            <span className="flex gap-1 flex-wrap">
              {g.presence.filter(p => p.actor !== me.id).map((p, i) => (
                <button key={`pass-${p.actor}-${i}`} onClick={() => passConch(p.actor)}
                  className="text-[9px] font-bold rounded-full px-2 py-0.5 bg-white border border-amber-300 text-amber-700 hover:bg-amber-100">
                  pass to {p.name}
                </button>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
