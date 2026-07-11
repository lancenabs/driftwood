import React, { useState, useEffect } from 'react';
import { Battery } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface SocialLog {
  id: string;
  name: string;
  type: string;
  before: number;
  after: number;
  stress: number;
  note: string;
}

const SEED: SocialLog[] = [
  { id: '1', name: 'Jamie (Partner)', type: 'partner', before: 6, after: 9, stress: 1, note: 'Warm validation check-in, built strong attachment feel.' },
  { id: '2', name: 'Supervisor Greg', type: 'superior', before: 7, after: 4, stress: 7, note: 'Micro-managing scheduling feedback. Caused bad chest tightness.' },
  { id: '3', name: 'Supportive Peer group', type: 'peer', before: 5, after: 8, stress: 2, note: 'Validated feelings, felt secure.' },
];

const STORAGE_KEY = 'lance_social_battery_v1';

function load(): SocialLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch { return SEED; }
}

const TYPE_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  partner: { bg: '#EEF2FF', border: '#C7D2FE', text: '#4338CA' },
  superior: { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
  peer: { bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280' },
  counselor: { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' },
};

interface Props { onBack: () => void; }

export default function SocialBattery({ onBack }: Props) {
  const { addXp } = useGame();
  const [logs, setLogs] = useState<SocialLog[]>(load);
  const [name, setName] = useState('');
  const [type, setType] = useState('peer');
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [stress, setStress] = useState(3);
  const [note, setNote] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)); }, [logs]);

  const addLog = () => {
    if (!name.trim()) return;
    const entry: SocialLog = { id: Date.now().toString(), name: name.trim(), type, before, after, stress, note };
    setLogs([entry, ...logs]);
    addXp(20);
    setName('');
    setNote('');
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/relational.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Social Battery</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Autonomic energy management</p>
        </div>
        <Battery className="w-5 h-5" style={{ color: '#0D9488' }} />
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <p className="text-[11px] leading-relaxed" style={{ color: '#6B7280' }}>
          Track social interactions, compare energy before vs. after, and spot which relationships drain you versus recharge you — then use that map to set healthy boundaries.
        </p>

        {/* The battery itself — fills to your after-energy, charging or draining live */}
        <div className="flex items-center justify-center gap-3 py-1" aria-label={`Energy after: ${after} of 10, ${after > before ? 'charging' : after < before ? 'draining' : 'holding'}`}>
          <div className="relative flex items-center">
            <div className="relative rounded-lg overflow-hidden flex" style={{
              width: 148, height: 52,
              border: '3px solid rgba(255,255,255,0.95)',
              background: 'rgba(255,255,255,0.5)',
              boxShadow: '0 6px 16px rgba(13,148,136,0.2), inset 0 1px 3px rgba(0,0,0,0.06)',
            }}>
              {Array.from({ length: 10 }, (_, i) => {
                const filled = i < after;
                const c = after <= 3 ? '#F43F5E' : after <= 6 ? '#f59e0b' : '#10B981';
                return (
                  <div key={i} className="flex-1 m-0.5 rounded-sm transition-all duration-300" style={{
                    background: filled ? `linear-gradient(180deg, ${c}CC, ${c})` : 'rgba(203,213,225,0.35)',
                    boxShadow: filled ? `0 0 6px ${c}66` : 'none',
                  }} />
                );
              })}
            </div>
            {/* battery cap */}
            <div className="rounded-r-md" style={{ width: 7, height: 22, background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
          </div>
          <div className="text-center">
            <div className="text-lg font-black leading-none" style={{ color: after <= 3 ? '#F43F5E' : after <= 6 ? '#d97706' : '#0D9488' }}>
              {after * 10}%
            </div>
            <div className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              {after > before ? '⚡ charging' : after < before ? '▽ draining' : '— holding'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border space-y-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <span className="text-[8px] font-mono font-black block uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Log a recent interaction</span>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[7.5px] uppercase font-mono font-black block" style={{ color: '#9CA3AF' }}>Name</label>
              <input
                type="text" placeholder="e.g. Supervisor Greg"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl text-[10.5px] font-semibold outline-none border"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#E5E7EB', color: '#3C3C3C' }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[7.5px] uppercase font-mono font-black block" style={{ color: '#9CA3AF' }}>Relationship</label>
              <select
                value={type} onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 rounded-xl text-[10.5px] font-semibold outline-none border"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#E5E7EB', color: '#3C3C3C' }}
              >
                <option value="peer">Friend / Peer</option>
                <option value="partner">Partner / Spouse</option>
                <option value="superior">Professional Superior</option>
                <option value="counselor">Clinical Coach / Practitioner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 text-center">
              <label className="text-[7.5px] uppercase font-mono font-black block" style={{ color: '#9CA3AF' }}>Energy before</label>
              <input type="range" min="1" max="10" value={before} onChange={(e) => setBefore(parseInt(e.target.value, 10))} className="w-full mt-1" style={{ accentColor: '#06B6D4' }} />
              <span className="text-[9.5px] font-bold font-mono" style={{ color: '#3C3C3C' }}>{before} /10</span>
            </div>
            <div className="space-y-1 text-center">
              <label className="text-[7.5px] uppercase font-mono font-black block" style={{ color: '#9CA3AF' }}>Energy after</label>
              <input type="range" min="1" max="10" value={after} onChange={(e) => setAfter(parseInt(e.target.value, 10))} className="w-full mt-1" style={{ accentColor: '#0D9488' }} />
              <span className="text-[9.5px] font-bold font-mono" style={{ color: '#3C3C3C' }}>{after} /10</span>
            </div>
            <div className="space-y-1 text-center">
              <label className="text-[7.5px] uppercase font-mono font-black block" style={{ color: '#9CA3AF' }}>Stress level</label>
              <input type="range" min="1" max="10" value={stress} onChange={(e) => setStress(parseInt(e.target.value, 10))} className="w-full mt-1" style={{ accentColor: '#F43F5E' }} />
              <span className="text-[9.5px] font-bold font-mono" style={{ color: '#E11D48' }}>{stress} /10</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[7.5px] uppercase font-mono font-black block" style={{ color: '#9CA3AF' }}>Notes</label>
            <input
              type="text" placeholder="e.g. Micro-managing, felt stomach tension..."
              value={note} onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-xl text-[10.5px] font-semibold outline-none border"
              style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#E5E7EB', color: '#3C3C3C' }}
            />
          </div>

          <button
            onClick={addLog}
            className="w-full py-2.5 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer"
            style={{ background: '#0D9488' }}
          >
            Log Social Interaction
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-[8px] font-black tracking-widest uppercase font-mono block" style={{ color: '#9CA3AF' }}>Recent interpersonal logs</span>
          <div className="space-y-2.5">
            {logs.map((log) => {
              const netChange = log.after - log.before;
              const style = TYPE_STYLE[log.type] ?? TYPE_STYLE.peer;
              return (
                <div key={log.id} className="p-3 rounded-xl border flex justify-between items-center gap-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                  <div className="min-w-0 text-left space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black" style={{ color: '#3C3C3C' }}>{log.name}</span>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border" style={{ background: style.bg, borderColor: style.border, color: style.text }}>{log.type}</span>
                    </div>
                    <p className="text-[9.5px] font-semibold leading-tight truncate" style={{ color: '#9CA3AF' }}>{log.note}</p>
                  </div>
                  <div className="flex items-center gap-2 text-right shrink-0">
                    <div className="text-center rounded px-2 py-0.5 border" style={{ background: '#F9FAFB', borderColor: '#F0F0F0' }}>
                      <span className="text-[7px] block uppercase font-mono tracking-tight font-black" style={{ color: '#9CA3AF' }}>Stress</span>
                      <span className="text-[10px] font-black" style={{ color: '#E11D48' }}>{log.stress}</span>
                    </div>
                    <div className="text-center rounded px-2 py-0.5 border" style={{ background: '#F9FAFB', borderColor: '#F0F0F0' }}>
                      <span className="text-[7px] block uppercase font-mono tracking-tight font-black" style={{ color: '#9CA3AF' }}>Net energy</span>
                      <span className="text-[10px] font-mono font-black" style={{ color: netChange >= 0 ? '#059669' : '#DC2626' }}>{netChange >= 0 ? `+${netChange}` : netChange}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
