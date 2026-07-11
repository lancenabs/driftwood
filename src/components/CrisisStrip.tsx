import React from 'react';
import { Phone } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
//  THE CRISIS STRIP — the DV bright line (DRIFTWOOD_BIBLE §7, non-negotiable).
//
//  Conjoint work is contraindicated in active intimate-partner violence, so
//  this world carries BOTH lines, ungated, on every surface including the
//  boarding: 988 AND the National DV Hotline. Never behind a tap-through,
//  never themed away, never handled by an NPC or an AI. This component is in
//  the app's FIRST commit — the gate exists before the first feature.
// ═════════════════════════════════════════════════════════════════════════════

export const CRISIS_LINES = [
  { name: '988 Suicide & Crisis Lifeline', action: 'Call or text 988', href: 'tel:988' },
  { name: 'National Domestic Violence Hotline', action: 'Call 1-800-799-7233 · text START to 88788', href: 'tel:18007997233' },
  { name: 'SAMHSA National Helpline', action: 'Call 1-800-662-4357', href: 'tel:18006624357' },
] as const;

export default function CrisisStrip() {
  return (
    <div className="w-full bg-white border-t border-slate-200 px-3 py-2" role="region" aria-label="Crisis help — always available">
      <div className="max-w-md mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {CRISIS_LINES.map(line => (
          <a
            key={line.name}
            href={line.href}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
          >
            <Phone className="w-3 h-3 text-rose-500 shrink-0" />
            <span>{line.name}</span>
            <span className="text-slate-400 font-semibold">— {line.action}</span>
          </a>
        ))}
      </div>
      <p className="text-center text-[9px] text-slate-400 mt-1">
        Free · 24/7 · confidential. If home doesn't feel safe, these lines come first — this app can wait.
      </p>
    </div>
  );
}
