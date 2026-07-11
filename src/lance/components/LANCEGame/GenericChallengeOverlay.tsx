import React, { useState, useEffect, useRef } from 'react';
import { Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOL_COMPLETION, readSaveProgress, readSaveSignature, CompletionSignal } from './challengeCompletion';
import { onChallengeProgress, resetChallengeProgress, getChallengeProgress } from './challengeProgressBus';

interface Props {
  tasks: string[];
  onComplete: () => void;
  toolId: string;
}

export default function GenericChallengeOverlay({ tasks, onComplete, toolId }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  // ── Real completion gate ──────────────────────────────────────────────────
  const signal: CompletionSignal | undefined = TOOL_COMPLETION[toolId];
  const [earned, setEarned] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    signal?.kind === 'session' ? signal.minSeconds : 0,
  );
  const [repCount, setRepCount] = useState(0);
  const baseline = useRef<number | null>(null);
  const baselineSignature = useRef<string | null>(null);

  // 'save' tools: snapshot the store on mount, then poll for a NEWLY saved entry.
  // Unlock when EITHER the count grows past the baseline (append-style tools) OR the
  // raw content changes at all (upsert-style tools, e.g. Gratitude Log / Activity
  // Tracker save one entry per calendar day — saving again today changes content but
  // not array length, so a length-only check would leave the challenge stuck if
  // today's entry already existed when this screen mounted).
  // (Same-tab localStorage writes don't fire the 'storage' event, so we poll.)
  useEffect(() => {
    if (!signal || signal.kind !== 'save') return;
    baseline.current = readSaveProgress(signal.keys);
    baselineSignature.current = readSaveSignature(signal.keys);
    const id = setInterval(() => {
      const grew = readSaveProgress(signal.keys) > (baseline.current ?? 0);
      const changed = readSaveSignature(signal.keys) !== (baselineSignature.current ?? '');
      if (grew || changed) {
        setEarned(true);
        clearInterval(id);
      }
    }, 700);
    return () => clearInterval(id);
  }, [toolId]);

  // 'count' tools: reset the counter for this fresh attempt, then unlock only once
  // the user has genuinely completed `target` real repetitions (e.g. breath cycles).
  useEffect(() => {
    if (!signal || signal.kind !== 'count') return;
    resetChallengeProgress(signal.channel);
    setRepCount(getChallengeProgress(signal.channel));
    const off = onChallengeProgress((channel, count) => {
      if (channel !== signal.channel) return;
      setRepCount(count);
      if (count >= signal.target) setEarned(true);
    });
    return off;
  }, [toolId]);

  // 'session' tools: unlock after the user genuinely stays engaged.
  useEffect(() => {
    if (!signal || signal.kind !== 'session') return;
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { setEarned(true); clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [toolId]);

  // Tools with no registered signal fall back to enabling completion (legacy safety).
  useEffect(() => { if (!signal) setEarned(true); }, [signal]);

  // ── Checklist reflects REAL progress — it is never self-checked ─────────────
  // The number of ticked items is derived from how much of the task is genuinely
  // done, so a checkmark can only appear once that portion is actually complete.
  let progressFraction = earned ? 1 : 0;
  if (!earned && signal) {
    if (signal.kind === 'count') {
      progressFraction = Math.min(1, repCount / signal.target);
    } else if (signal.kind === 'session') {
      progressFraction = Math.min(1, 1 - secondsLeft / signal.minSeconds);
    }
    // 'save' tools are all-or-nothing: nothing ticks until the entry is saved.
  }
  const checkedCount = earned ? tasks.length : Math.floor(progressFraction * tasks.length);
  const checked = tasks.map((_, i) => i < checkedCount);

  const statusLabel = earned
    ? 'Task complete — nicely done! 🎉'
    : signal?.kind === 'count'
      ? `${repCount}/${signal.target} ${signal.unit}${signal.target === 1 ? '' : 's'} · ${signal.actionLabel}`
      : signal?.kind === 'session'
        ? `${signal.actionLabel} · ${secondsLeft}s`
        : signal?.actionLabel ?? 'Use the tool to complete';

  const progressPct = earned ? 100 : Math.round(progressFraction * 100);

  return (
    <div className="absolute top-4 right-3 z-30" style={{ width: 208 }}>
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg border"
            style={{
              background: earned ? '#F0FFF6' : 'white',
              borderColor: earned ? '#58CC02' : '#E5E7EB',
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white"
              style={{ background: earned ? '#58CC02' : '#3ECFCF' }}
            >
              {earned ? <Check className="w-3 h-3" strokeWidth={3.5} /> : <Lock className="w-2.5 h-2.5" />}
            </div>
            <span className="text-[10px] font-black text-slate-600">
              {earned
                ? 'Complete!'
                : signal?.kind === 'count'
                  ? `${repCount}/${signal.target}`
                  : 'Challenge'}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-2xl overflow-hidden"
            style={{
              border: `1.5px solid ${earned ? '#58CC02' : '#E5E7EB'}`,
              boxShadow: earned
                ? '0 6px 28px rgba(88,204,2,0.22)'
                : '0 6px 28px rgba(0,0,0,0.13)',
              background: 'white',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-3 py-2.5"
              style={{ background: earned ? '#58CC02' : '#3ECFCF' }}
            >
              <div className="min-w-0">
                <div className="text-[8px] font-black uppercase tracking-widest text-white/70">
                  Challenge {earned ? 'Done' : 'Progress'}
                </div>
                <div className="text-[11px] font-black text-white leading-snug truncate">
                  {statusLabel}
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-white/80 hover:text-white text-sm font-bold leading-none"
                style={{ background: 'rgba(255,255,255,0.18)' }}
              >
                −
              </button>
            </div>

            {/* Progress bar — reflects REAL completion, not self-checks */}
            <div className="h-1.5 bg-slate-100">
              <motion.div
                className="h-full"
                style={{ background: earned ? '#58CC02' : '#3ECFCF' }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            {/* Checklist — a live read-out of real progress; it cannot be tapped to cheat */}
            <div className="divide-y divide-slate-50 bg-white">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-left"
                  style={{ opacity: checked[i] ? 0.65 : 1 }}
                >
                  <div
                    className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: checked[i] ? '#3ECFCF' : 'transparent',
                      border: checked[i] ? 'none' : '1.5px solid #D1D5DB',
                    }}
                  >
                    {checked[i] && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />}
                  </div>
                  <div
                    className="text-[10px] font-black leading-snug"
                    style={{
                      color: checked[i] ? '#9CA3AF' : '#1a1a1a',
                      textDecoration: checked[i] ? 'line-through' : 'none',
                    }}
                  >
                    {task}
                  </div>
                </div>
              ))}
            </div>

            {/* Complete button — only appears once the task is GENUINELY done */}
            <AnimatePresence>
              {earned ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pb-3 pt-1"
                >
                  <motion.button
                    whileTap={{ scale: 0.97, y: 2 }}
                    onClick={onComplete}
                    className="w-full py-2.5 rounded-xl font-black text-white text-[10px] uppercase tracking-wider"
                    style={{ background: '#58CC02', boxShadow: '0 3px 0 #46A302' }}
                  >
                    Challenge Complete →
                  </motion.button>
                </motion.div>
              ) : (
                <div className="px-3 pb-3 pt-2 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-[9px] font-bold text-slate-400 leading-snug">
                    {signal?.kind === 'count'
                      ? `Keep going — ${signal.target - repCount} more ${signal.unit}${signal.target - repCount === 1 ? '' : 's'} to finish.`
                      : 'Do the exercise in the tool — completion unlocks itself.'}
                  </span>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
