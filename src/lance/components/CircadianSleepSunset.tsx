import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Play, Pause, Compass, Zap, Shield, HelpCircle, Save, Check, RefreshCw } from 'lucide-react';

interface SleepLog {
  id: string;
  date: string;
  bedTime: string;
  quality: number; // 1-10
  restfulness: 'rested' | 'groggy' | 'exhausted';
}

// Shared accent — amber fits the sunset / melatonin wind-down concept.
const AMBER = '#F59E0B';
const AMBER_DARK = '#D97706';

export default function CircadianSleepSunset() {
  const [targetBedtime, setTargetBedtime] = useState('23:00');
  const [circadianLogs, setCircadianLogs] = useState<SleepLog[]>(() => {
    const saved = localStorage.getItem('circadian_sleep_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Somatic wind-down glow player
  const [isGlowActive, setIsGlowActive] = useState(false);
  const [glowColor, setGlowColor] = useState<'amber' | 'crimson' | 'nebula'>('amber');
  const [breathingText, setBreathingText] = useState('Inhale...');
  const [progressWidth, setProgressWidth] = useState(0);

  // New log form state
  const [logQuality, setLogQuality] = useState(7);
  const [logRestfulness, setLogRestfulness] = useState<'rested' | 'groggy' | 'exhausted'>('rested');
  const [successSaved, setSuccessSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('circadian_sleep_logs', JSON.stringify(circadianLogs));
  }, [circadianLogs]);

  // Guided 4-7-8 sleep breathing cycle running in background
  useEffect(() => {
    if (!isGlowActive) {
      setBreathingText('Somatic Wind-down Standby');
      setProgressWidth(0);
      return;
    }

    let cycleTime = 0;
    const interval = setInterval(() => {
      cycleTime = (cycleTime + 1) % 19; // 4 + 7 + 8 = 19 second loop

      if (cycleTime < 4) {
        setBreathingText('Inhale Deeply (4s)... fill abdominal lungs');
        setProgressWidth((cycleTime / 4) * 100);
      } else if (cycleTime < 11) {
        setBreathingText('Hold breath (7s)... allow carbon-dioxide balancing');
        setProgressWidth(((cycleTime - 4) / 7) * 100);
      } else {
        setBreathingText('Exhale fully (8s)... release all somatic residue');
        setProgressWidth(((cycleTime - 11) / 8) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGlowActive]);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: SleepLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      bedTime: targetBedtime,
      quality: logQuality,
      restfulness: logRestfulness
    };

    setCircadianLogs(prev => [newLog, ...prev]);
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 2500);
  };

  const clearLogs = () => {
    setCircadianLogs([]);
  };

  // Circadian window helper based on user input
  const getCircadianBreakdown = () => {
    const [hours, minutes] = targetBedtime.split(':').map(Number);

    // Adenosine build-up starts 3 hours before sleep
    let adHrs = hours - 3;
    if (adHrs < 0) adHrs += 24;
    const adTime = `${adHrs.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Melatonin secretion cascade begins 2 hours before target
    let melHrs = hours - 2;
    if (melHrs < 0) melHrs += 24;
    const melTime = `${melHrs.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Cortisol wakeup peak occurs 8 hours after bedtime
    let cortHrs = (hours + 8) % 24;
    const cortTime = `${cortHrs.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return { adTime, melTime, cortTime };
  };

  const windows = getCircadianBreakdown();

  // Light, warm "sunset" gradient that lives INSIDE the wind-down card — keeps the
  // visual metaphor of the tool without going back to a dark page background.
  const getGlowBgClass = () => {
    if (!isGlowActive) return 'bg-[#F9FAFB] border-[#F0F0F0]';
    if (glowColor === 'amber') return 'bg-gradient-to-b from-amber-100 via-orange-50 to-white border-amber-200';
    if (glowColor === 'crimson') return 'bg-gradient-to-b from-rose-100 via-red-50 to-white border-rose-200';
    return 'bg-gradient-to-b from-purple-100 via-indigo-50 to-white border-purple-200';
  };

  const getGlowAccent = () => {
    if (glowColor === 'amber') return { text: 'text-amber-600', dot: 'bg-amber-500', halo: 'bg-amber-300' };
    if (glowColor === 'crimson') return { text: 'text-rose-600', dot: 'bg-rose-500', halo: 'bg-rose-300' };
    return { text: 'text-purple-600', dot: 'bg-purple-500', halo: 'bg-purple-300' };
  };
  const glowAccent = getGlowAccent();

  return (
    <div id="circadian-sleep-sunset-root" className="rounded-3xl p-4 sm:p-6 max-w-4xl mx-auto overflow-hidden relative" style={{ background: '#F9FAFB' }}>
      {/* Header */}
      <div className="px-1 py-2 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: `${AMBER}18` }}>
          🌇
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: AMBER_DARK }}>
            Circadian Wind-down
          </div>
          <h2 className="text-sm sm:text-base font-black leading-tight" style={{ color: '#3C3C3C' }}>
            Melatonin Sunset Light &amp; Circadian Sync
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <p className="text-xs leading-relaxed max-w-md" style={{ color: '#6B7280' }}>
            Emit warm, non-blue melatonin-friendly light and pair it with clinical 4-7-8 breathing to
            activate your body's natural fatigue cascade before bed.
          </p>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0" style={{ background: `${AMBER}14`, color: AMBER_DARK }}>
            <Shield className="w-3.5 h-3.5" />
            Nocturnal Eye-Safe Mode
          </div>
        </div>

        {/* Dynamic split layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT: Melatonin Emitter / Sunset Breathing Screen */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-700 flex flex-col justify-between min-h-[360px] relative overflow-hidden ${getGlowBgClass()}`}
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
          >

            {/* Pulsating breathing halo ring */}
            {isGlowActive && (
              <motion.div
                className={`absolute w-36 h-36 rounded-full blur-xl top-1/3 left-1/3 opacity-40 pointer-events-none ${glowAccent.halo}`}
                animate={{ scale: [1, 2.3, 1] }}
                transition={{ repeat: Infinity, duration: 19, ease: 'easeInOut' }}
              />
            )}

            <div className="flex justify-between items-center text-[10px] font-bold z-10" style={{ color: '#9CA3AF' }}>
              <span>SUNSET LIGHT EMITTER WINDOW</span>
              {isGlowActive ? (
                <span className={`flex items-center gap-1 font-black ${glowAccent.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${glowAccent.dot}`} /> ACTIVE EMISSION
                </span>
              ) : (
                <span style={{ color: '#9CA3AF' }}>STANDBY</span>
              )}
            </div>

            <div className="text-center space-y-4 z-10 flex flex-col justify-center items-center h-full">
              {isGlowActive ? (
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-white w-full">
                  <h4 className={`text-xs font-black tracking-wide uppercase animate-pulse ${glowAccent.text}`}>{breathingText}</h4>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${glowAccent.dot}`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                  <p className="text-[11px] leading-normal" style={{ color: '#6B7280' }}>
                    This clinically lowers vagal tension and balances nitric oxide to signal transition to sleep.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Sun className="w-10 h-10 mx-auto" style={{ color: `${AMBER}66` }} />
                  <p className="text-xs font-bold" style={{ color: '#6B7280' }}>Emit melatonin-blocking light waves</p>
                  <p className="text-[11px] max-w-xs mx-auto" style={{ color: '#9CA3AF' }}>Click below to start. Position your phone/screen on your bedside table facing you as you practice your 19-second cycle.</p>
                </div>
              )}
            </div>

            <div className="space-y-3 z-10">
              {/* Color selectors */}
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setGlowColor('amber')}
                  className={`px-3 py-2.5 min-h-[40px] text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    glowColor === 'amber' ? 'bg-amber-100 text-amber-700 border-amber-400' : 'bg-white text-[#9CA3AF] border-[#F0F0F0]'
                  }`}
                >
                  Amber Sunset
                </button>
                <button
                  onClick={() => setGlowColor('crimson')}
                  className={`px-3 py-2.5 min-h-[40px] text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    glowColor === 'crimson' ? 'bg-rose-100 text-rose-700 border-rose-400' : 'bg-white text-[#9CA3AF] border-[#F0F0F0]'
                  }`}
                >
                  Deep Crimson
                </button>
                <button
                  onClick={() => setGlowColor('nebula')}
                  className={`px-3 py-2.5 min-h-[40px] text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    glowColor === 'nebula' ? 'bg-purple-100 text-purple-700 border-purple-400' : 'bg-white text-[#9CA3AF] border-[#F0F0F0]'
                  }`}
                >
                  Nebula Indigo
                </button>
              </div>

              {!isGlowActive ? (
                <motion.button
                  whileTap={{ y: 3, boxShadow: 'none' }}
                  onClick={() => setIsGlowActive(true)}
                  className="w-full py-3.5 text-white rounded-2xl font-black text-sm flex justify-center items-center gap-1.5 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${AMBER}, #F97316)`, boxShadow: '0 5px 0 #C2410C' }}
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Start Bedside Sunset Wind-down
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ y: 3, boxShadow: 'none' }}
                  onClick={() => setIsGlowActive(false)}
                  className="w-full py-3.5 rounded-2xl font-black text-sm flex justify-center items-center gap-1.5 cursor-pointer border"
                  style={{ background: '#FFFFFF', color: '#3C3C3C', borderColor: '#F0F0F0' }}
                >
                  <Pause className="w-3.5 h-3.5" />
                  Pause Circadian Glow
                </motion.button>
              )}
            </div>
          </div>

          {/* RIGHT: Sleep Debt Logger & Circadian Window Generator */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 space-y-3" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: AMBER_DARK }}>
                <Sun className="w-4 h-4" style={{ color: AMBER }} />
                Target Bedtime Chronobiology Window
              </h4>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs" style={{ color: '#6B7280' }}>Tonight's Bedtime Target:</span>
                <input
                  type="time"
                  value={targetBedtime}
                  onChange={(e) => setTargetBedtime(e.target.value)}
                  className="text-xs rounded-xl px-2.5 py-2 min-h-[40px] outline-none border"
                  style={{ background: '#F9FAFB', borderColor: '#F0F0F0', color: '#3C3C3C' }}
                />
              </div>

              {/* Dynamic windows checklist */}
              <div className="grid grid-cols-1 gap-2 text-xs pt-1">
                <div className="flex justify-between gap-2 p-2.5 rounded-xl border border-[#F0F0F0] leading-normal" style={{ background: '#F9FAFB' }}>
                  <div>
                    <p className="font-extrabold" style={{ color: '#3C3C3C' }}>Melatonin Cascade Secretion Begins</p>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Screen/device lights must be fully filtered.</p>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded h-fit self-center" style={{ color: AMBER_DARK, background: `${AMBER}18`, border: `1px solid ${AMBER}44` }}>{windows.melTime}</span>
                </div>

                <div className="flex justify-between gap-2 p-2.5 rounded-xl border border-[#F0F0F0] leading-normal" style={{ background: '#F9FAFB' }}>
                  <div>
                    <p className="font-extrabold" style={{ color: '#3C3C3C' }}>Adenosine Satiety Build-up Peak</p>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Caffeine half-life must be fully exhausted.</p>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded h-fit self-center" style={{ color: AMBER_DARK, background: `${AMBER}18`, border: `1px solid ${AMBER}44` }}>{windows.adTime}</span>
                </div>

                <div className="flex justify-between gap-2 p-2.5 rounded-xl border border-[#F0F0F0] leading-normal" style={{ background: '#F9FAFB' }}>
                  <div>
                    <p className="font-extrabold" style={{ color: '#3C3C3C' }}>Optimal Cortisol Wakeup Rise</p>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Coordinates sound natural REM sleep exits.</p>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded h-fit self-center" style={{ color: AMBER_DARK, background: `${AMBER}18`, border: `1px solid ${AMBER}44` }}>{windows.cortTime}</span>
                </div>
              </div>
            </div>

            {/* Micro Sleep Diary Form */}
            <form onSubmit={handleSaveLog} className="p-4 bg-white rounded-2xl border border-[#F0F0F0] space-y-3" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: AMBER_DARK }}>Morning Restfulness Log</h4>
                {successSaved && (
                  <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: '#46A302' }}>
                    <Check className="w-3.5 h-3.5" /> Saved Log
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 justify-between flex-wrap">
                <span className="text-xs shrink-0" style={{ color: '#6B7280' }}>Awakening Restfulness Quality:</span>
                <select
                  value={logRestfulness}
                  onChange={(e) => setLogRestfulness(e.target.value as any)}
                  className="text-xs rounded-xl px-2 py-2 min-h-[40px] font-bold border"
                  style={{ background: '#F9FAFB', borderColor: '#F0F0F0', color: '#3C3C3C' }}
                >
                  <option value="rested">✨ Refreshed / Rested</option>
                  <option value="groggy">💤 Groggy (Slight Sleep Inertia)</option>
                  <option value="exhausted">⚠️ Exhausted / Sleep Debt</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]" style={{ color: '#6B7280' }}>
                  <span>Subjective Sleep Depth Score (1-10):</span>
                  <span className="font-bold" style={{ color: AMBER_DARK }}>{logQuality}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={logQuality}
                  onChange={(e) => setLogQuality(parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: AMBER }}
                />
              </div>

              <motion.button
                whileTap={{ y: 3, boxShadow: 'none' }}
                type="submit"
                className="w-full py-3 min-h-[40px] text-white rounded-2xl text-xs font-black flex justify-center items-center gap-1.5 cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${AMBER}, #F97316)`, boxShadow: '0 5px 0 #C2410C' }}
              >
                <Save className="w-3.5 h-3.5" />
                Commit Sleep Log
              </motion.button>
            </form>
          </div>
        </div>

        {/* Saved historic logs table */}
        {circadianLogs.length > 0 && (
          <div className="p-3 bg-white rounded-2xl border border-[#F0F0F0] space-y-2" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
            <div className="flex justify-between items-center text-[11px] font-bold tracking-wide" style={{ color: '#6B7280' }}>
              <span>CIRCADIAN ALIGNMENT LOGS</span>
              <button
                onClick={clearLogs}
                className="flex items-center gap-1 uppercase font-black text-[11px] px-3 py-2 min-h-[36px] rounded-xl border cursor-pointer"
                style={{ color: '#9CA3AF', background: '#F9FAFB', borderColor: '#F0F0F0' }}
              >
                <RefreshCw className="w-3 h-3" /> Clear Logs
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 overflow-x-auto max-h-40 sm:max-h-24 pr-1">
              {circadianLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-[#F9FAFB] border border-[#F0F0F0] rounded-xl flex flex-col justify-between text-[11px]">
                  <div className="flex justify-between font-bold" style={{ color: '#9CA3AF' }}>
                    <span>{log.date}</span>
                    <span style={{ color: AMBER_DARK }}>Qual: {log.quality}/10</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span style={{ color: '#6B7280' }}>Bedtime: {log.bedTime}</span>
                    <span
                      className="uppercase font-bold"
                      style={{
                        color: log.restfulness === 'rested' ? '#46A302' : log.restfulness === 'groggy' ? AMBER_DARK : '#DB2777'
                      }}
                    >
                      {log.restfulness}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
