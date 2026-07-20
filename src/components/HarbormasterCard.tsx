import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Anchor, CalendarCheck, ClipboardList, MessageSquare, RefreshCw, Unplug, Video,
} from 'lucide-react';
import {
  getLink, pairWithCode, disconnect, syncNow, getLastSync,
  getTherapistAssignments, getTherapistMessages, getPendingConfirms,
  markDirectiveOpened, respondToConfirm,
  TherapistLink, TherapistDirective,
} from '../lib/companionLink';

// ═════════════════════════════════════════════════════════════════════════════
//  THE HARBORMASTER — Driftwood's therapist connection, in the Ship's Fittings.
//  The island app has "Your Therapist", the voyage has the Lighthouse; the
//  family shore gets the harbormaster: the one who knows every boat that's out
//  and logs every safe return. Pair once with a code from the Navigator;
//  assignments and session invites arrive here, honest completion receipts
//  sail back. The bridge treaty holds: crisis tools are never remote-lockable
//  and the waterfall chat NEVER crosses (companionLink's denylist is
//  load-bearing — qa-bridge asserts it).
// ═════════════════════════════════════════════════════════════════════════════

const joinUrlOf = (text?: string): string | null => {
  const m = text?.match(/https?:\/\/\S+/);
  return m ? m[0].replace(/[).,]$/, '') : null;
};

export default function HarbormasterCard() {
  const [link, setLink] = useState<TherapistLink | null>(getLink());
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [assignments, setAssignments] = useState<TherapistDirective[]>([]);
  const [messages, setMessages] = useState<TherapistDirective[]>([]);
  const [confirms, setConfirms] = useState<TherapistDirective[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(getLastSync());

  const refresh = () => {
    setAssignments(getTherapistAssignments());
    setMessages(getTherapistMessages());
    setConfirms(getPendingConfirms());
    setLastSync(getLastSync());
  };

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener('driftwood:directives-updated', onUpdate);
    return () => window.removeEventListener('driftwood:directives-updated', onUpdate);
  }, []);

  const doPair = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setBusy(true); setError('');
    try {
      const l = await pairWithCode(trimmed);
      setLink(l);
      setCode('');
      void syncNow().then(refresh);
    } catch (e: any) {
      setError(e?.message || 'Pairing failed — check the code and try again.');
    } finally {
      setBusy(false);
    }
  };

  const doSync = async () => {
    setBusy(true);
    await syncNow();
    refresh();
    setBusy(false);
  };

  const doDisconnect = () => {
    disconnect();
    setLink(null);
    setConfirmDisconnect(false);
    setAssignments([]); setMessages([]); setConfirms([]);
  };

  const pending = assignments.length + messages.length + confirms.length;
  const box: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 };

  // ── Unpaired: the invitation ─────────────────────────────────────────────
  if (!link) {
    return (
      <div className="p-4 space-y-3" style={box}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(14,124,124,0.15)' }}>
            <Anchor className="w-4.5 h-4.5" style={{ color: '#0E7C7C' }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">The Harbormaster</div>
            <div className="text-[11px] text-slate-500">Working with a therapist? Connect their Navigator to your shore.</div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Your therapist gives you a one-time code from their Navigator. Once connected they can assign
          campfire work, send messages, and invite your family to video sessions — and your milestones
          sail honestly back to their dashboard. Each partner pairs with their own code and their own
          consent. <span className="font-bold text-slate-400">What you say at the waterfall never crosses — not one word. And crisis tools stay yours; no one can lock those, ever.</span>
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doPair()}
            placeholder="6-character code"
            maxLength={8}
            className="flex-1 p-2.5 rounded-xl text-xs font-black tracking-widest uppercase focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
          />
          <button onClick={doPair} disabled={busy || !code.trim()}
            className="px-4 py-2.5 text-xs font-black rounded-xl cursor-pointer transition-all active:scale-[0.97] disabled:opacity-40"
            style={{ background: '#0E7C7C', color: '#fff' }}>
            {busy ? '…' : 'Connect'}
          </button>
        </div>
        {error && <p className="text-[10px] font-bold" style={{ color: '#F87171' }}>{error}</p>}
      </div>
    );
  }

  // ── Paired: the harbor light is on ───────────────────────────────────────
  return (
    <div className="p-4 space-y-3" style={box}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative" style={{ background: 'rgba(14,124,124,0.2)' }}>
            <Anchor className="w-4.5 h-4.5" style={{ color: '#2E96B5' }} />
            <motion.span className="absolute inset-0 rounded-xl" style={{ boxShadow: '0 0 12px rgba(46,150,181,0.45)' }}
              animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 3, repeat: Infinity }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {link.practiceName || 'Your therapist'} <span style={{ color: '#7FD98C' }}>· connected</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {lastSync ? `Last sync ${new Date(lastSync).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Not synced yet'}
              {pending > 0 && <span className="font-black" style={{ color: '#F2A65A' }}> · {pending} waiting</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={doSync} disabled={busy} title="Sync now" aria-label="Sync now"
            className="p-2 rounded-xl cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setConfirmDisconnect(v => !v)} title="Disconnect" aria-label="Disconnect"
            className="p-2 rounded-xl cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)', color: '#64748B' }}>
            <Unplug className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {confirmDisconnect && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-3 rounded-xl flex items-center justify-between gap-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] text-slate-400">Disconnect from {link.practiceName || 'your therapist'}? Your island stays yours.</p>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={doDisconnect} className="px-2.5 py-1.5 text-[10px] font-black rounded-lg cursor-pointer" style={{ background: '#EF4444', color: '#fff' }}>Disconnect</button>
                <button onClick={() => setConfirmDisconnect(false)} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>Keep</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session confirms */}
      {confirms.map(d => (
        <div key={d.id} className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(14,124,124,0.12)', border: '1px solid rgba(14,124,124,0.25)' }}>
          <p className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5" style={{ color: '#2E96B5' }} />
            Session request: {d.payload.date} at {d.payload.time}
          </p>
          <div className="flex gap-1.5">
            <button onClick={() => { respondToConfirm(d.id, 'confirmed'); refresh(); }}
              className="flex-1 py-1.5 text-[10px] font-black rounded-lg cursor-pointer" style={{ background: '#0E7C7C', color: '#fff' }}>
              Confirm
            </button>
            <button onClick={() => { respondToConfirm(d.id, 'declined'); refresh(); }}
              className="flex-1 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>
              Can't make it
            </button>
          </div>
        </div>
      ))}

      {/* Messages — join links become a video door */}
      {messages.map(d => {
        const joinUrl = joinUrlOf(d.payload?.text);
        return (
          <div key={d.id} className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(242,166,90,0.1)', border: '1px solid rgba(242,166,90,0.2)' }}>
            <p className="text-[11px] text-slate-200 flex items-start gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#F2A65A' }} />
              <span><span className="font-black">{link.practiceName || 'Your therapist'}:</span> {d.payload?.text}</span>
            </p>
            <div className="flex gap-1.5">
              {joinUrl && (
                <a href={joinUrl} target="_blank" rel="noopener noreferrer"
                  onClick={() => { markDirectiveOpened(d.id); refresh(); }}
                  className="flex-1 py-2 text-[10px] font-black rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ background: '#0E7C7C', color: '#fff' }}>
                  <Video className="w-3.5 h-3.5" /> Join video session
                </a>
              )}
              <button onClick={() => { markDirectiveOpened(d.id); refresh(); }}
                className={`${joinUrl ? '' : 'flex-1 '}px-3 py-2 text-[10px] font-bold rounded-lg cursor-pointer`}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                {joinUrl ? 'Dismiss' : 'Got it'}
              </button>
            </div>
          </div>
        );
      })}

      {/* Assignments */}
      {assignments.map(d => (
        <button key={d.id} onClick={() => { markDirectiveOpened(d.id); refresh(); }}
          className="w-full p-3 rounded-xl text-left cursor-pointer flex items-center justify-between gap-2"
          style={{ background: 'rgba(14,124,124,0.1)', border: '1px solid rgba(14,124,124,0.2)' }}>
          <span className="flex items-start gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#2E96B5' }} />
            <span>
              <span className="block text-[11px] font-black text-slate-200">
                Assigned: {d.payload?.toolId ?? 'work from your therapist'}
              </span>
              {d.payload?.instructions && (
                <span className="block text-[10px] text-slate-500">"{d.payload.instructions}"</span>
              )}
            </span>
          </span>
        </button>
      ))}

      {pending === 0 && !confirmDisconnect && (
        <p className="text-[10px] text-slate-500 italic">
          Nothing waiting. Every boat accounted for.
        </p>
      )}
    </div>
  );
}
