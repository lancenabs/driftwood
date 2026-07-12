import React, { useState } from 'react';
import { Shield, Phone, Plus, Trash2, ChevronRight, LifeBuoy, RotateCcw } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
//  SAFETY & CRISIS — Settings-only, therapist-configured (Lance's 2026-07-12
//  crisis-protocol rework). Crisis parameters differ by state and by practice,
//  so nothing is preloaded: the therapist completes a safety onboarding here,
//  and only what they configure ever shows. This screen is the ONLY surface
//  in the app that carries crisis/safety information.
// ═════════════════════════════════════════════════════════════════════════════

export interface CrisisLine { label: string; number: string }
export interface CrisisConfig {
  version: 1;
  setupAt: string;          // ISO date
  practiceState: string;    // US state / region the protocol is written for
  therapistName: string;
  lines: CrisisLine[];      // therapist-entered crisis contacts, in priority order
  protocol: string;         // the therapist's written crisis protocol / instructions
}

const STORAGE_KEY = 'driftwood_crisis_config_v1';

export function readCrisisConfig(): CrisisConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw);
    return cfg && cfg.version === 1 ? cfg : null;
  } catch { return null; }
}

function writeCrisisConfig(cfg: CrisisConfig | null) {
  try {
    if (cfg) localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable — config lives for the session only */ }
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
};

function MicroLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{children}</p>;
}

export default function SafetyCrisisSettings({
  onOpenSafetyPlan,
}: {
  /** Opens the app's crisis/safety-plan tool (only reachable from here). */
  onOpenSafetyPlan?: () => void;
}) {
  const [config, setConfig] = useState<CrisisConfig | null>(() => readCrisisConfig());
  const [editing, setEditing] = useState(false);

  // Onboarding form state
  const [therapistName, setTherapistName] = useState(config?.therapistName ?? '');
  const [practiceState, setPracticeState] = useState(config?.practiceState ?? '');
  const [lines, setLines] = useState<CrisisLine[]>(config?.lines?.length ? config.lines : [{ label: '', number: '' }]);
  const [protocol, setProtocol] = useState(config?.protocol ?? '');

  const save = () => {
    const cleaned = lines.map(l => ({ label: l.label.trim(), number: l.number.trim() })).filter(l => l.label && l.number);
    const cfg: CrisisConfig = {
      version: 1,
      setupAt: config?.setupAt ?? new Date().toISOString(),
      therapistName: therapistName.trim(),
      practiceState: practiceState.trim(),
      lines: cleaned,
      protocol: protocol.trim(),
    };
    writeCrisisConfig(cfg);
    setConfig(cfg);
    setEditing(false);
  };

  const removeAll = () => {
    if (!window.confirm('Remove this safety protocol? The app will show no crisis information until a new safety onboarding is completed with your therapist.')) return;
    writeCrisisConfig(null);
    setConfig(null);
    setEditing(false);
    setTherapistName(''); setPracticeState(''); setLines([{ label: '', number: '' }]); setProtocol('');
  };

  // ── Not configured: the invitation ──────────────────────────────────────────
  if (!config && !editing) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-2xl space-y-2" style={card}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.15)' }}>
              <Shield className="w-4.5 h-4.5" style={{ color: '#F87171' }} />
            </div>
            <p className="text-sm font-bold text-white">No safety protocol configured</p>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Crisis and safety plans are set up together with your therapist during a
            safety onboarding — protocols and contact lines differ by state and by
            practice, so nothing here is preloaded.
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="w-full py-3.5 rounded-2xl text-sm font-black text-slate-900 uppercase tracking-wider"
          style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)' }}
        >
          Begin Safety Onboarding
        </button>
        <div className="p-3 rounded-xl text-[11px] text-slate-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          Complete this screen in session with your therapist. What they enter here is
          the only crisis information the app will show.
        </div>
      </div>
    );
  }

  // ── The safety onboarding form ───────────────────────────────────────────────
  if (editing) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl space-y-3" style={card}>
          <MicroLabel>Safety Onboarding · with your therapist</MicroLabel>
          <input
            value={therapistName}
            onChange={e => setTherapistName(e.target.value)}
            placeholder="Therapist name"
            className="w-full bg-transparent text-white text-sm font-bold outline-none placeholder-slate-600"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 8 }}
          />
          <input
            value={practiceState}
            onChange={e => setPracticeState(e.target.value)}
            placeholder="State / region this protocol is written for"
            className="w-full bg-transparent text-white text-sm font-bold outline-none placeholder-slate-600"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 8 }}
          />
        </div>

        <div className="p-4 rounded-2xl space-y-3" style={card}>
          <MicroLabel>Crisis contact lines · in priority order</MicroLabel>
          {lines.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={l.label}
                onChange={e => setLines(ls => ls.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                placeholder="Name (e.g. county crisis line)"
                className="flex-1 bg-transparent text-white text-sm font-semibold outline-none placeholder-slate-600"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 6 }}
              />
              <input
                value={l.number}
                onChange={e => setLines(ls => ls.map((x, j) => j === i ? { ...x, number: e.target.value } : x))}
                placeholder="Number"
                inputMode="tel"
                className="w-32 bg-transparent text-white text-sm font-semibold outline-none placeholder-slate-600"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 6 }}
              />
              {lines.length > 1 && (
                <button onClick={() => setLines(ls => ls.filter((_, j) => j !== i))} aria-label="Remove line">
                  <Trash2 className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setLines(ls => [...ls, { label: '', number: '' }])}
            className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400"
          >
            <Plus className="w-3.5 h-3.5" /> Add another line
          </button>
        </div>

        <div className="p-4 rounded-2xl space-y-2" style={card}>
          <MicroLabel>Crisis protocol · therapist's instructions</MicroLabel>
          <textarea
            value={protocol}
            onChange={e => setProtocol(e.target.value)}
            placeholder="What to do, in order, when things escalate — written with your therapist…"
            rows={5}
            className="w-full bg-transparent text-white text-sm font-semibold outline-none placeholder-slate-600 resize-none"
          />
        </div>

        <button
          onClick={save}
          disabled={!lines.some(l => l.label.trim() && l.number.trim())}
          className="w-full py-3.5 rounded-2xl text-sm font-black text-slate-900 uppercase tracking-wider disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)' }}
        >
          Save Safety Protocol
        </button>
        <button
          onClick={() => setEditing(false)}
          className="w-full py-3 rounded-2xl text-sm font-bold text-slate-400"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── Configured: the protocol on record ───────────────────────────────────────
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-2xl space-y-1" style={{ background: 'rgba(62,207,207,0.08)', border: '1px solid rgba(62,207,207,0.2)' }}>
        <p className="text-sm font-black text-white">Safety protocol on record</p>
        <p className="text-[11px] text-slate-400">
          Set up {config!.therapistName ? `with ${config!.therapistName} ` : ''}
          {config!.practiceState ? `· ${config!.practiceState} ` : ''}
          · {new Date(config!.setupAt).toLocaleDateString()}
        </p>
      </div>

      <div className="p-4 rounded-2xl space-y-2" style={card}>
        <MicroLabel>Crisis lines</MicroLabel>
        {config!.lines.map((l, i) => (
          <a
            key={i}
            href={`tel:${l.number.replace(/[^\d+]/g, '')}`}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Phone className="w-4 h-4 shrink-0" style={{ color: '#F87171' }} />
            <span className="flex-1 text-sm font-bold text-white">{l.label}</span>
            <span className="text-[12px] font-semibold text-slate-400">{l.number}</span>
          </a>
        ))}
      </div>

      {config!.protocol && (
        <div className="p-4 rounded-2xl space-y-2" style={card}>
          <MicroLabel>Your protocol</MicroLabel>
          <p className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">{config!.protocol}</p>
        </div>
      )}

      {onOpenSafetyPlan && (
        <button
          onClick={onOpenSafetyPlan}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left"
          style={card}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(62,207,207,0.12)' }}>
            <LifeBuoy className="w-4.5 h-4.5" style={{ color: '#3ECFCF' }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Crisis Safety Plan</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Stanley-model plan — opens only from here</div>
          </div>
          <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#475569' }} />
        </button>
      )}

      <button
        onClick={() => setEditing(true)}
        className="w-full py-3 rounded-2xl text-sm font-black text-white uppercase tracking-wider"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        Edit With Your Therapist
      </button>
      <button
        onClick={removeAll}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <RotateCcw className="w-4 h-4 text-red-400" />
        <div className="text-left">
          <div className="text-sm font-bold text-red-400">Remove Protocol</div>
          <div className="text-[11px] text-slate-500">Back to square one — no crisis info shown until re-onboarded</div>
        </div>
      </button>
    </div>
  );
}
