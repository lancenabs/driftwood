import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Thermometer, RefreshCw, Info, Wind } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

type Mode = 'reacting' | 'regulating';

function tempColor(temp: number): string {
  return temp < 65 ? '#60A5FA' : temp > 75 ? '#F43F5E' : '#10B981';
}

// The thermostat dial — a real gauge with a spring needle. 55–85°F sweep.
function ThermostatDial({ temp }: { temp: number }) {
  const fraction = Math.max(0, Math.min(1, (temp - 55) / 30));
  const needleDeg = -90 + fraction * 180;
  const color = tempColor(temp);
  const R = 74;
  const arc = (from: number, to: number) => {
    // angles in [0..1] across the semicircle, left → right
    const a0 = Math.PI * (1 - from);
    const a1 = Math.PI * (1 - to);
    const x0 = 90 + R * Math.cos(a0), y0 = 92 - R * Math.sin(a0);
    const x1 = 90 + R * Math.cos(a1), y1 = 92 - R * Math.sin(a1);
    return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <div className="flex flex-col items-center" aria-hidden>
      <svg width={180} height={104} viewBox="0 0 180 104">
        {/* zone arcs */}
        <path d={arc(0, 0.33)} stroke="#60A5FA55" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d={arc(0.34, 0.66)} stroke="#10B98155" strokeWidth={12} fill="none" />
        <path d={arc(0.67, 1)} stroke="#F43F5E55" strokeWidth={12} fill="none" strokeLinecap="round" />
        {/* active arc up to current temp */}
        <path d={arc(0, Math.max(0.02, fraction))} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke 0.4s' }} />
        {/* needle */}
        <motion.g
          initial={false}
          animate={{ rotate: needleDeg }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          style={{ transformOrigin: '90px 92px' }}
        >
          <line x1={90} y1={92} x2={90} y2={34} stroke="#3C3C3C" strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={90} cy={92} r={8} fill="#3C3C3C" />
          <circle cx={90} cy={92} r={3.5} fill="#FFFFFF" />
        </motion.g>
      </svg>
      <div className="-mt-2 font-mono font-extrabold text-lg" style={{ color, transition: 'color 0.4s' }}>
        {temp}°F
      </div>
    </div>
  );
}

interface Props { onBack: () => void; }

export default function AutonomicThermostat({ onBack }: Props) {
  const { addXp } = useGame();
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('therapy_thermostat_mode_today') as Mode) || 'regulating');
  const [temp, setTemp] = useState<number>(() => {
    const saved = localStorage.getItem('therapy_thermostat_temp_rating');
    return saved ? parseInt(saved, 10) : 70;
  });
  const [triggers, setTriggers] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('therapy_thermostat_triggers_today') || '[]'); } catch { return []; }
  });
  const [newTrigger, setNewTrigger] = useState('');

  useEffect(() => { localStorage.setItem('therapy_thermostat_mode_today', mode); }, [mode]);
  useEffect(() => { localStorage.setItem('therapy_thermostat_temp_rating', temp.toString()); }, [temp]);
  useEffect(() => { localStorage.setItem('therapy_thermostat_triggers_today', JSON.stringify(triggers)); }, [triggers]);

  const toggleMode = (next: Mode) => {
    setMode(next);
    if (next === 'regulating') setTemp(70);
  };

  const addTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTrigger.trim();
    if (clean && !triggers.includes(clean)) {
      setTriggers([...triggers, clean]);
      addXp(15);
      setNewTrigger('');
    }
  };

  const feedback = mode === 'regulating'
    ? (temp > 75
        ? 'Your thermostat is calling for cooling. Try a slow exhale to restore comfort.'
        : temp < 65
          ? 'Your internal environment feels withdrawn. A little movement can restore warmth.'
          : 'Your baseline is stable — right in the comfort zone (68–72°).')
    : "Your nervous temperature is spiking in reaction to what's around you. You're reflecting someone else's weather right now.";

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/somatic.webp)',
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
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Autonomic Thermostat</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Mindset climate control</p>
        </div>
        <Thermometer className="w-5 h-5" style={{ color: mode === 'regulating' ? '#059669' : '#F43F5E' }} />
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.95)', boxShadow: '0 6px 22px rgba(13,148,136,0.15)' }}>
          <p className="text-xs leading-relaxed font-bold mb-4" style={{ color: '#6B7280' }}>
            Thermometers reflect the room's temperature. Thermostats set it. Which one are you being right now?
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button" onClick={() => toggleMode('reacting')}
              className="p-3.5 rounded-2xl flex flex-col justify-between text-left border transition-all cursor-pointer"
              style={mode === 'reacting' ? { background: '#FFF1F2', borderColor: '#FECDD3', color: '#881337' } : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              <span className="text-xl">🌡️</span>
              <div className="mt-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider">Thermometer</h4>
                <p className="text-[9.5px] font-medium leading-tight opacity-80 mt-0.5">I'm absorbing the stress around me.</p>
              </div>
            </button>
            <button
              type="button" onClick={() => toggleMode('regulating')}
              className="p-3.5 rounded-2xl flex flex-col justify-between text-left border transition-all cursor-pointer"
              style={mode === 'regulating' ? { background: '#ECFDF5', borderColor: '#A7F3D0', color: '#064E3B' } : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              <span className="text-xl">🎛️</span>
              <div className="mt-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider">Thermostat</h4>
                <p className="text-[9.5px] font-medium leading-tight opacity-80 mt-0.5">I regulate my own internal climate.</p>
              </div>
            </button>
          </div>

          <div className="mt-4 p-4 rounded-2xl border" style={{ background: mode === 'regulating' ? '#F0FDFA' : '#FFF1F2', borderColor: mode === 'regulating' ? '#99F6E4' : '#FECDD3' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-center" style={{ color: '#4B5563' }}>
              Internal temperature {temp === 70 ? '· ideal' : ''}
            </div>
            <ThermostatDial temp={temp} />
            <input
              type="range" min="55" max="85" step="1" value={temp}
              onChange={(e) => setTemp(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: '#0D9488', background: '#E5E7EB' }}
            />
            <div className="flex justify-between text-[8px] font-mono font-bold mt-1 uppercase" style={{ color: '#9CA3AF' }}>
              <span>❄️ Cool (withdrawal)</span>
              <span>70° Optimal</span>
              <span>🔥 Hot (spike)</span>
            </div>
            <p className="text-[10px] font-semibold italic mt-2 leading-tight flex items-start gap-1" style={{ color: '#6B7280' }}>
              <Info className="w-3 h-3 shrink-0 mt-0.5" style={{ color: '#0D9488' }} />
              <span>{feedback}</span>
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-[9.5px] font-black uppercase tracking-wider block" style={{ color: '#9CA3AF' }}>
              Triggers of thermal drift
            </label>
            <form onSubmit={addTrigger} className="flex gap-2">
              <input
                type="text" placeholder="e.g. email notifications, coworker anger..."
                value={newTrigger} onChange={(e) => setNewTrigger(e.target.value)}
                className="flex-1 text-xs rounded-xl px-3 py-2 border outline-none"
                style={{ background: '#F9FAFB', borderColor: '#F0F0F0', color: '#3C3C3C' }}
              />
              <button type="submit" className="py-1.5 px-3 rounded-xl text-white text-xs font-black transition cursor-pointer shrink-0" style={{ background: '#0F766E' }}>
                Log
              </button>
            </form>
            <div className="flex flex-wrap gap-1 mt-2">
              {triggers.length > 0 ? triggers.map((trig, idx) => (
                <span key={idx} className="text-[9px] font-bold py-1 px-2.5 rounded-lg border flex items-center gap-1" style={{ background: '#FFFFFF', color: '#4B5563', borderColor: '#E5E7EB' }}>
                  <span>⚠️ {trig}</span>
                  <button type="button" onClick={() => setTriggers(triggers.filter((_, i) => i !== idx))} className="font-extrabold text-[10px] pl-1 cursor-pointer" style={{ color: '#9CA3AF' }}>×</button>
                </span>
              )) : (
                <span className="text-[9.5px] italic font-semibold" style={{ color: '#9CA3AF' }}>No thermal triggers logged today. Peaceful so far.</span>
              )}
            </div>
          </div>

          {mode === 'reacting' && (
            <div className="mt-4 p-3 rounded-2xl border" style={{ background: '#F0FDFA', borderColor: '#99F6E4' }}>
              <div className="flex gap-1.5 items-start">
                <Wind className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#0F766E' }} />
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#134E4A' }}>Deploy a cooling anchor</h4>
                  <p className="text-[9.5px] font-bold leading-relaxed" style={{ color: 'rgba(19,78,74,0.7)' }}>
                    Take a deep double-inhale, then a long exhale sigh — that's a real parasympathetic cooling switch.
                  </p>
                  <button
                    type="button" onClick={() => toggleMode('regulating')}
                    className="mt-1.5 py-1 px-3 rounded-lg text-[9px] font-black transition cursor-pointer flex items-center gap-1 text-white"
                    style={{ background: '#059669' }}
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Shift to Thermostat</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
