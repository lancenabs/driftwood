import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Check, X, ChevronRight } from 'lucide-react';
import {
  getLink, getTherapistAssignments, getTherapistMessages, getPendingConfirms,
  markDirectiveOpened, respondToConfirm, syncNow, TherapistDirective,
} from '../../lib/therapistLink';
import { getToolIcon } from './toolIcons';
import { GAME_TOOLS } from './lanceGameData';

// ─────────────────────────────────────────────────────────────────────────────
//  "From your therapist" — the Home-tab surface for the bridge.
//  Renders nothing unless paired AND something is pending: assignments to do,
//  a session to confirm, or a note delivered warmly by Chip.
//  Crisis rule: this card never gates or hides anything — it only adds.
// ─────────────────────────────────────────────────────────────────────────────

function toolName(toolId?: string): string {
  return GAME_TOOLS.find(t => t.id === toolId)?.name ?? toolId ?? 'a tool';
}

export default function TherapistCard({ onOpenTool }: { onOpenTool: (id: string) => void }) {
  const [, forceRender] = useState(0);
  const refresh = () => forceRender(n => n + 1);

  useEffect(() => {
    // pick up anything new shortly after mount (sync-on-open may still be in flight)
    const t = setTimeout(refresh, 2500);
    return () => clearTimeout(t);
  }, []);

  const link = getLink();
  if (!link) return null;

  const assignments = getTherapistAssignments();
  const confirms = getPendingConfirms();
  const messages = getTherapistMessages();
  if (assignments.length === 0 && confirms.length === 0 && messages.length === 0) return null;

  const openAssignment = (d: TherapistDirective) => {
    markDirectiveOpened(d.id);
    const toolId = d.payload.toolId as string | undefined;
    if (toolId) onOpenTool(toolId);
    refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-4 space-y-3"
      style={{
        background: 'linear-gradient(140deg, rgba(127,217,140,0.12), rgba(62,207,207,0.1))',
        border: '1px solid rgba(127,217,140,0.35)',
        boxShadow: '0 6px 20px rgba(127,217,140,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-center gap-1.5">
        <Stethoscope className="w-3.5 h-3.5" style={{ color: '#7FD98C' }} />
        <h3 className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>
          From your therapist
        </h3>
      </div>

      {/* Session confirmations — one tap, receipt flies back immediately */}
      <AnimatePresence>
        {confirms.map(d => (
          <motion.div
            key={d.id}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl p-3"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p className="text-xs font-black text-white">
              Session {d.payload.date ? `on ${d.payload.date}` : ''} {d.payload.time ? `at ${d.payload.time}` : ''}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>Can you make it?</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { respondToConfirm(d.id, 'confirmed'); refresh(); }}
                className="flex-1 py-2 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)' }}
              >
                <Check className="w-3.5 h-3.5" /> I'll be there
              </button>
              <button
                onClick={() => { respondToConfirm(d.id, 'declined'); refresh(); }}
                className="py-2 px-3 rounded-xl text-xs font-bold active:scale-95"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Messages — Chip hands them over */}
      {messages.map(d => (
        <div key={d.id} className="rounded-2xl p-3 flex items-start gap-2.5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <span className="text-lg shrink-0">📝</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#7FD98C' }}>A note for you</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#D1D5DB' }}>{String(d.payload.text ?? '')}</p>
            <button
              onClick={() => { markDirectiveOpened(d.id); void syncNow(); refresh(); }}
              className="mt-1.5 text-[10px] font-black active:scale-95"
              style={{ color: '#3ECFCF' }}
            >
              Got it ✓
            </button>
          </div>
        </div>
      ))}

      {/* Assigned tools — real Library cards, therapist's instructions attached */}
      {assignments.map(d => {
        const toolId = d.payload.toolId as string | undefined;
        const icon = toolId ? getToolIcon(toolId) : null;
        return (
          <button
            key={d.id}
            onClick={() => openAssignment(d)}
            className="w-full rounded-2xl p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {icon
              ? <img src={icon} alt="" draggable={false} style={{ width: 40, height: 40, borderRadius: 10 }} />
              : <span className="text-2xl">🧰</span>}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{toolName(toolId)}</p>
              {d.payload.instructions ? (
                <p className="text-[10px] mt-0.5 leading-snug line-clamp-2" style={{ color: '#9CA3AF' }}>
                  "{String(d.payload.instructions)}"
                </p>
              ) : (
                <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>Recommended for you</p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#7FD98C' }} />
          </button>
        );
      })}
    </motion.div>
  );
}
