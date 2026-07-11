import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Thermometer, Settings, Shield, RefreshCw, Sparkles, AlertCircle, CheckCircle, Info, Wind, Zap, BookOpen } from 'lucide-react';

interface ThermometerThermostatWidgetProps {
  onTriggerInteractionAlert: (title: string, body: string) => void;
}

export default function ThermometerThermostatWidget({ onTriggerInteractionAlert }: ThermometerThermostatWidgetProps) {
  // 'reacting' = Thermometer, 'regulating' = Thermostat
  const [mindstateMode, setMindstateMode] = useState<'reacting' | 'regulating'>(() => {
    return (localStorage.getItem('therapy_thermostat_mode_today') as 'reacting' | 'regulating') || 'regulating';
  });

  const [currentTempRating, setCurrentTempRating] = useState<number>(() => {
    const saved = localStorage.getItem('therapy_thermostat_temp_rating');
    return saved ? parseInt(saved, 10) : 70; // 70 is comfortable baseline
  });

  const [driftTriggers, setDriftTriggers] = useState<string[]>(() => {
    const saved = localStorage.getItem('therapy_thermostat_triggers_today');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTriggerText, setNewTriggerText] = useState('');

  const [coolingAction, setCoolingAction] = useState<string>(() => {
    return localStorage.getItem('therapy_thermostat_cooling_action') || 'Breathe slowly';
  });

  useEffect(() => {
    localStorage.setItem('therapy_thermostat_mode_today', mindstateMode);
  }, [mindstateMode]);

  useEffect(() => {
    localStorage.setItem('therapy_thermostat_temp_rating', currentTempRating.toString());
  }, [currentTempRating]);

  useEffect(() => {
    localStorage.setItem('therapy_thermostat_triggers_today', JSON.stringify(driftTriggers));
  }, [driftTriggers]);

  useEffect(() => {
    localStorage.setItem('therapy_thermostat_cooling_action', coolingAction);
  }, [coolingAction]);

  const handleToggleMode = (mode: 'reacting' | 'regulating') => {
    setMindstateMode(mode);
    if (mode === 'regulating') {
      setCurrentTempRating(70); // automatic cooling reset
      onTriggerInteractionAlert(
        "🎛️ Thermostat Mindset Activating",
        "Nervous system command locked. You have switched from absorbing the chaotic temperature of your surroundings to actively regulating your mental climate. Breathe, slow down, and stay centered!"
      );
    } else {
      onTriggerInteractionAlert(
        "🌡️ Thermometer Awareness",
        "You have noted that you are currently in Thermometer mode—absorbing the emotional stress, conflicts, or atmospheric temperature around you. This is an excellent moment of self-compassion. Let's study what triggered this."
      );
    }
  };

  const handleAddTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTriggerText.trim()) return;
    const clean = newTriggerText.trim();
    if (!driftTriggers.includes(clean)) {
      const next = [...driftTriggers, clean];
      setDriftTriggers(next);
      setNewTriggerText('');
    }
  };

  const handleClearTriggers = () => {
    setDriftTriggers([]);
  };

  // Helper messages depending on current status
  const getFeedbackMessage = () => {
    if (mindstateMode === 'regulating') {
      if (currentTempRating > 75) {
        return "Internal thermostat is calling for cooling. Apply slow exhalations now to restore thermal comfort.";
      }
      if (currentTempRating < 65) {
        return "Internal environment is feeling cool/withdrawn. Activate somatic movement (push-ups or stretching) to restore heat.";
      }
      return "Autonomic climate is stable (ideal comfort zone 68-72°F). Your emotional core is set to steady baseline.";
    } else {
      return "Nervous temperature is spiking in reaction to surrounding friction. You are currently reflecting other people's temperatures.";
    }
  };

  return (
    <div id="mindset-climate-widget" className="apple-card p-6 bg-white rounded-3xl border border-teal-100 shadow-sm relative overflow-hidden transition-all duration-300">
      {/* Decorative absolute glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
        mindstateMode === 'regulating' ? 'bg-emerald-300/10' : 'bg-red-300/10'
      }`} />

      {/* Title & Icon Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-base p-1.5 rounded-xl flex items-center justify-center transition-colors duration-300 ${
              mindstateMode === 'regulating' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-500 animate-pulse'
            }`}>
              <Thermometer className="w-5 h-5" />
            </span>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Mindset Climate Control</span>
          </div>
          <h3 className="font-display text-base font-black text-slate-800 tracking-tight leading-tight">
            Thermometer vs. Thermostat Center
          </h3>
          <p className="text-[10.5px] text-zinc-500 font-bold leading-relaxed max-w-sm">
            Thermometers reflect and react to the room's temperature. Thermostats actively regulate and set the ambient climate of their internal environment.
          </p>
        </div>
      </div>

      <div className="premium-divider my-4" />

      {/* Interactive Mode Switches */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          type="button"
          onClick={() => handleToggleMode('reacting')}
          className={`p-3.5 rounded-2xl flex flex-col justify-between text-left border transition-all cursor-pointer ${
            mindstateMode === 'reacting'
              ? 'bg-rose-50/70 border-rose-200 text-rose-900 shadow-xs'
              : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xl">🌡️</span>
            {mindstateMode === 'reacting' && (
              <span className="text-[9px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-sm uppercase">Active Response</span>
            )}
          </div>
          <div className="mt-2 text-left">
            <h4 className="text-[11px] font-black uppercase tracking-wider">Thermometer Mode</h4>
            <p className="text-[9.5px] font-medium leading-tight opacity-80 mt-0.5">
              I am absorbing and reflecting the stressful temperature around me.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleToggleMode('regulating')}
          className={`p-3.5 rounded-2xl flex flex-col justify-between text-left border transition-all cursor-pointer ${
            mindstateMode === 'regulating'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-xs'
              : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xl">🎛️</span>
            {mindstateMode === 'regulating' && (
              <span className="text-[9px] font-black bg-emerald-650 text-white px-2 py-0.5 rounded-sm uppercase font-display">Target Base</span>
            )}
          </div>
          <div className="mt-2 text-left">
            <h4 className="text-[11px] font-black uppercase tracking-wider">Thermostat Mode</h4>
            <p className="text-[9.5px] font-medium leading-tight opacity-80 mt-0.5">
              I actively regulate my own internal safety levels and boundaries.
            </p>
          </div>
        </button>
      </div>

      {/* Thermic Slider Gauge */}
      <div className={`mt-4 p-4 rounded-2xl border transition-all ${
        mindstateMode === 'regulating' ? 'bg-teal-50/30 border-teal-100' : 'bg-rose-50/30 border-rose-100'
      }`}>
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1">
          <span className="uppercase tracking-wider">Internal Temperature Monitor</span>
          <span className="font-mono text-[11px] font-extrabold text-teal-850 bg-white/80 px-2 py-0.5 rounded-full border border-teal-100 shadow-3xs">
            {currentTempRating}°F {currentTempRating === 70 ? '(Ideal Coherence)' : ''}
          </span>
        </div>

        <input
          type="range"
          min="55"
          max="85"
          step="1"
          value={currentTempRating}
          onChange={(e) => setCurrentTempRating(parseInt(e.target.value, 10))}
          className="w-full pointer-events-auto h-2 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-teal-600"
        />

        <div className="flex justify-between text-[8px] font-mono font-bold text-slate-400 mt-1 uppercase">
          <span>❄️ Cool (Withdrawal)</span>
          <span>70° Optimal</span>
          <span>🔥 Hot (Sympathetic Spike)</span>
        </div>

        <p className="text-[10px] text-zinc-500 font-semibold italic mt-2 leading-tight flex items-center gap-1">
          <Info className="w-3 h-3 text-teal-650 shrink-0" />
          <span>{getFeedbackMessage()}</span>
        </p>
      </div>

      {/* Triggers of Thermal Drift Logger */}
      <div className="mt-4 space-y-2">
        <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block">
          Triggers of Thermal Drift (Forces that push you out of range):
        </label>
        
        <form onSubmit={handleAddTrigger} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. email notifications, coworker anger..."
            value={newTriggerText}
            onChange={(e) => setNewTriggerText(e.target.value)}
            className="flex-1 text-xs border border-slate-150 bg-slate-50 hover:bg-white"
          />
          <button
            type="submit"
            className="py-1.5 px-3 rounded-xl bg-teal-700 text-white text-xs font-black hover:bg-teal-800 transition shadow-sm cursor-pointer shrink-0"
          >
            Log Factor
          </button>
        </form>

        <div className="flex flex-wrap gap-1 mt-2">
          {driftTriggers.length > 0 ? (
            driftTriggers.map((trig, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold py-1 px-2.5 rounded-lg border bg-white text-slate-700 border-slate-200 flex items-center gap-1"
              >
                <span>⚠️ {trig}</span>
                <button
                  type="button"
                  onClick={() => setDriftTriggers(driftTriggers.filter((_, i) => i !== idx))}
                  className="hover:text-red-500 font-extrabold text-[10px] select-none pl-1 transition cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-[9.5px] text-slate-400 italic font-semibold">
              No thermal triggers logged today. Your environment has been peaceful!
            </span>
          )}
        </div>

        {driftTriggers.length > 0 && (
          <button
            type="button"
            onClick={handleClearTriggers}
            className="text-[9px] text-slate-400 hover:text-slate-600 font-bold select-none cursor-pointer underline"
          >
            Clear environment drift factors
          </button>
        )}
      </div>

      {/* The Vagal Valve / Thermostat Adjuster */}
      {mindstateMode === 'reacting' && (
        <div className="mt-4 p-3 bg-teal-50/50 border border-teal-150 rounded-2xl animate-slide-up">
          <div className="flex gap-1.5 items-start">
            <Wind className="w-4 h-4 text-teal-650 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-[11px] font-black text-teal-950 uppercase tracking-wider">Deploy Thermostatic cooling anchor</h4>
              <p className="text-[9.5px] font-bold text-teal-900/70 leading-relaxed">
                Take a deep somatic double-inhale with an extended exhalation sigh. This forces parasympathetic cooling to assert your own steady state.
              </p>
              <button
                type="button"
                onClick={() => handleToggleMode('regulating')}
                className="mt-1.5 py-1 px-3 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black transition cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Shift to Thermostat (Regulate Now)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
