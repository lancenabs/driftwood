import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Heart, Check, Sparkles, X, Sun, Compass, AlertCircle, Calendar } from 'lucide-react';
import { MorningActivationEntry } from '../types';
import { playClick, playDing, playSuccess } from '../utils/playfulAudio';

interface MorningActivationProps {
  userName: string;
  assistantName: string;
  internName?: string;
  lanceModeEnabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: MorningActivationEntry) => void;
}

const PRESET_GOALS = [
  "Take 3 mindful breathing breaks",
  "Complete one therapeutic challenge on the map",
  "Drink 8 glasses of water to stay hydrated",
  "Write down 3 things I'm grateful for",
  "Stretch for 10 minutes at mid-day",
  "Maintain a clear work-rest boundary"
];

const PRESET_KINDNESS = [
  "Treat myself to 15 minutes of uninterrupted reading",
  "Forgive myself for yesterday's small slip-ups",
  "Eat a nourishing, mindful meal without screens",
  "Use positive self-talk if I start feeling anxious",
  "Go outside and look at the trees/sky for 5 minutes",
  "Give myself permission to say no to extra demands"
];

export default function MorningActivation({
  userName,
  assistantName,
  internName = "The Intern",
  lanceModeEnabled = true,
  isOpen,
  onClose,
  onSave
}: MorningActivationProps) {
  const [dailyGoal, setDailyGoal] = useState('');
  const [selfKindness, setSelfKindness] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');

  // Audio helper for custom haptic sound
  const playTactileChime = (freq: number = 520, duration: number = 0.08) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {}
  };

  const handleNextStep = () => {
    if (!dailyGoal.trim()) {
      setError("Calibrate your Primary Objective (Daily Goal) first!");
      playTactileChime(320, 0.15);
      return;
    }
    setError('');
    playClick();
    setStep(2);
  };

  const handlePrevStep = () => {
    playClick();
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyGoal.trim() || !selfKindness.trim()) {
      setError("Please complete both coordinates to sync your morning systems!");
      playTactileChime(320, 0.15);
      return;
    }

    const todayStr = new Date().toLocaleDateString('sv').substring(0, 10); // YYYY-MM-DD
    const newEntry: MorningActivationEntry = {
      id: `morning_${Date.now()}`,
      date: todayStr,
      dailyGoal: dailyGoal.trim(),
      selfKindness: selfKindness.trim(),
      completedGoal: false,
      completedKindness: false,
      timestamp: new Date().toISOString()
    };

    onSave(newEntry);
    playSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="relative w-full max-w-lg bg-[#F9FAFB] rounded-3xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]"
          style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.16)' }}
        >
          {/* Header Bar */}
          <div className="p-5 border-b flex items-center justify-between bg-white select-none" style={{ borderColor: '#F0F0F0' }}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: '#FF960018' }}>
                <Sun className="w-5 h-5 animate-spin-slow" style={{ color: '#FF9600' }} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider font-mono block" style={{ color: '#CC7A00' }}>Morning Systems Calibrator</span>
                <h3 className="text-sm font-bold block" style={{ color: '#3C3C3C' }}>Morning Activation Protocols</h3>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              aria-label="Back"
              className="p-2.5 rounded-2xl text-white transition active:scale-90 shrink-0"
              style={{
                background: 'linear-gradient(135deg,#FF9600,#FF6B00)',
                boxShadow: '0 3px 0 #CC7A00, 0 4px 12px rgba(255,150,0,0.35)',
              }}
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>

          {/* Intern / Lance Dialogue Transmission */}
          <div className="px-6 py-4 bg-white border-b text-left select-none" style={{ borderColor: '#F0F0F0' }}>
            <div className="space-y-2">
              {/* Intern dialogue */}
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0">🌸</span>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block leading-none mb-1" style={{ color: '#CC7A00' }}>{internName}</span>
                  <p className="text-xs leading-relaxed font-semibold italic" style={{ color: '#3C3C3C' }}>
                    "Morning transmission received! Calibrating today's escape path requires clean mental coordinates. Let's set one primary goal and lock in one act of self-kindness to sustain your vital systems in the deep jungle today."
                  </p>
                </div>
              </div>

              {/* Lance snark if enabled */}
              {lanceModeEnabled && (
                <div className="flex items-start gap-2.5 mt-2 p-2.5 rounded-xl" style={{ background: '#3C3C3C' }}>
                  <span className="text-xl shrink-0">🤖</span>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider block leading-none mb-1" style={{ color: '#FF9600' }}>L.A.N.C.E.</span>
                    <p className="text-[11px] leading-relaxed font-semibold italic text-white/80">
                      "Primary objectives? Highly cute. Just don't let those coordinates lead you directly into a quicksand swamp. Or do, it makes for better telemetry logs."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Content / Wizard Steps */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 text-left bg-[#F9FAFB]">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-semibold">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                <motion.div
                  key="step-goal"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 font-mono" style={{ color: '#6B7280' }}>
                      <Target className="w-4 h-4" style={{ color: '#FF9600' }} />
                      Coordinate Alpha: One Daily Goal
                    </label>
                    <p className="text-[11px] leading-normal" style={{ color: '#6B7280' }}>
                      What is one simple, realistic, and constructive achievement you want to lock in today? Make it action-oriented and positive.
                    </p>
                    <input
                      type="text"
                      value={dailyGoal}
                      onChange={(e) => {
                        setDailyGoal(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g., Meditate for 10 minutes, complete my jungle trek..."
                      maxLength={120}
                      className="w-full px-4 py-3 bg-white border rounded-xl text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-1 transition-all font-semibold"
                      style={{ color: '#3C3C3C', borderColor: '#E5E7EB' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#FF9600'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
                    />
                    <div className="text-right text-[11px] font-bold font-mono" style={{ color: '#9CA3AF' }}>
                      {dailyGoal.length}/120 CHARS
                    </div>
                  </div>

                  {/* Goal Presets */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest font-mono" style={{ color: '#9CA3AF' }}>Inspiration Logs:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_GOALS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            playClick();
                            setDailyGoal(preset);
                            if (error) setError('');
                          }}
                          className="p-2.5 text-left rounded-xl bg-white hover:bg-[#FFF7EC] border text-[11px] leading-tight font-semibold transition active:scale-[0.98] cursor-pointer"
                          style={{ borderColor: '#F0F0F0', color: '#6B7280' }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step-kindness"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 font-mono" style={{ color: '#6B7280' }}>
                      <Heart className="w-4 h-4 animate-pulse" style={{ color: '#FF9600' }} />
                      Coordinate Beta: One Act of Self-Kindness
                    </label>
                    <p className="text-[11px] leading-normal" style={{ color: '#6B7280' }}>
                      The jungle is demanding. What is one act of self-care, breathing room, or supportive self-kindness you will give yourself today?
                    </p>
                    <input
                      type="text"
                      value={selfKindness}
                      onChange={(e) => {
                        setSelfKindness(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g., Eat a healthy lunch, excuse myself from overthinking..."
                      maxLength={120}
                      className="w-full px-4 py-3 bg-white border rounded-xl text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-1 transition-all font-semibold"
                      style={{ color: '#3C3C3C', borderColor: '#E5E7EB' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#FF9600'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
                    />
                    <div className="text-right text-[11px] font-bold font-mono" style={{ color: '#9CA3AF' }}>
                      {selfKindness.length}/120 CHARS
                    </div>
                  </div>

                  {/* Kindness Presets */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest font-mono font-semibold" style={{ color: '#9CA3AF' }}>Self-Kindness Coordinates:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_KINDNESS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            playClick();
                            setSelfKindness(preset);
                            if (error) setError('');
                          }}
                          className="p-2.5 text-left rounded-xl bg-white hover:bg-[#FFF7EC] border text-[11px] leading-tight font-semibold transition active:scale-[0.98] cursor-pointer"
                          style={{ borderColor: '#F0F0F0', color: '#6B7280' }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Footer Navigation Buttons */}
          <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-between">
            {step === 1 ? (
              <div />
            ) : (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#3C3C3C] hover:bg-white rounded-xl transition cursor-pointer"
              >
                Back
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-white hover:bg-white text-teal-400 font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 border border-teal-500/20 transition active:scale-[0.98] cursor-pointer"
              >
                Lock In Coordinate Alpha
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,184,166,0.25)] transition active:scale-[0.98] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Complete Morning Activation
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
