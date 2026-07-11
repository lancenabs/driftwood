import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, Sparkles, Sun, Heart, Target, ChevronLeft, ChevronRight, Info, Award } from 'lucide-react';
import { MorningActivationEntry } from '../types';
import { playClick, playDing } from '../utils/playfulAudio';

interface MorningIntentionCalendarProps {
  morningActivations: MorningActivationEntry[];
  setMorningActivations?: React.Dispatch<React.SetStateAction<MorningActivationEntry[]>>;
  onToggleMorningActivation?: (dateStr: string, field: 'goal' | 'kindness') => void;
}

export default function MorningIntentionCalendar({ 
  morningActivations, 
  setMorningActivations,
  onToggleMorningActivation
}: MorningIntentionCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<MorningActivationEntry | null>(null);
  const [hoveredDay, setHoveredDay] = useState<MorningActivationEntry | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'details'>('grid');

  // Find current actual selected day's live log from morningActivations to keep details view fully reactive
  const liveSelectedDay = useMemo(() => {
    if (!selectedDay) return null;
    return morningActivations.find(e => e.date === selectedDay.date) || null;
  }, [selectedDay, morningActivations]);

  const handleToggleGoal = (dateStr: string) => {
    if (onToggleMorningActivation) {
      onToggleMorningActivation(dateStr, 'goal');
      return;
    }
    if (!setMorningActivations) return;
    playDing();
    setMorningActivations(prev =>
      prev.map(item =>
        item.date === dateStr ? { ...item, completedGoal: !item.completedGoal } : item
      )
    );
  };

  const handleToggleKindness = (dateStr: string) => {
    if (onToggleMorningActivation) {
      onToggleMorningActivation(dateStr, 'kindness');
      return;
    }
    if (!setMorningActivations) return;
    playDing();
    setMorningActivations(prev =>
      prev.map(item =>
        item.date === dateStr ? { ...item, completedKindness: !item.completedKindness } : item
      )
    );
  };

  // Generate the last 35 days (5 weeks) including today, aligned to the days of the week
  const gridDays = useMemo(() => {
    const days = [];
    const today = new Date();
    
    // We want the grid to end on today, but to look like a neat calendar, 
    // let's go back 34 days so we have exactly 35 days (5 full weeks).
    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('sv').substring(0, 10); // YYYY-MM-DD
      
      const log = morningActivations.find(entry => entry.date === dateStr);
      days.push({
        date: date,
        dateStr: dateStr,
        log: log || null
      });
    }
    return days;
  }, [morningActivations]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalLogged = morningActivations.length;
    const fullyCompleted = morningActivations.filter(e => e.completedGoal && e.completedKindness).length;
    const halfCompleted = morningActivations.filter(e => (e.completedGoal && !e.completedKindness) || (!e.completedGoal && e.completedKindness)).length;
    const alphaCleared = morningActivations.filter(e => e.completedGoal).length;
    const betaShielded = morningActivations.filter(e => e.completedKindness).length;
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedLogs = [...morningActivations].sort((a, b) => b.date.localeCompare(a.date));
    const todayStr = new Date().toLocaleDateString('sv').substring(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('sv').substring(0, 10);
    
    let hasStreakAnchor = sortedLogs.some(e => e.date === todayStr || e.date === yesterdayStr);
    
    if (hasStreakAnchor) {
      let streakDate = new Date();
      // If we haven't logged today yet but logged yesterday, start streak from yesterday
      if (!sortedLogs.some(e => e.date === todayStr) && sortedLogs.some(e => e.date === yesterdayStr)) {
        streakDate = yesterday;
      }
      
      while (true) {
        const checkStr = streakDate.toLocaleDateString('sv').substring(0, 10);
        const dayLog = sortedLogs.find(e => e.date === checkStr);
        if (dayLog) {
          currentStreak++;
          streakDate.setDate(streakDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const consistencyRate = totalLogged > 0 ? Math.round((fullyCompleted / totalLogged) * 100) : 0;

    return {
      totalLogged,
      fullyCompleted,
      halfCompleted,
      alphaCleared,
      betaShielded,
      currentStreak,
      consistencyRate
    };
  }, [morningActivations]);

  const daysOfWeekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="space-y-4 font-sans text-left text-slate-200">
      {/* Stats Board Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Streak card */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-teal-500/10 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500/15 to-orange-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Award className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono block">Streak</span>
            <span className="text-sm font-black text-amber-400 font-mono">{stats.currentStreak} Days</span>
          </div>
        </div>

        {/* Consistency rate */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-teal-500/10 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-500/15 to-emerald-500/10 rounded-xl border border-teal-500/20 text-teal-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono block">Full Sync</span>
            <span className="text-sm font-black text-teal-400 font-mono">{stats.consistencyRate}%</span>
          </div>
        </div>

        {/* Coordinate Alpha */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-teal-500/10 flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono block">Alpha Cleared</span>
            <span className="text-sm font-bold text-slate-200 font-mono">{stats.alphaCleared} / {stats.totalLogged}</span>
          </div>
        </div>

        {/* Coordinate Beta */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-teal-500/10 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono block">Beta Shielded</span>
            <span className="text-sm font-bold text-slate-200 font-mono">{stats.betaShielded} / {stats.totalLogged}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 font-mono">Survival Consistency Grid</h4>
            <p className="text-[10px] text-slate-500 leading-none">Visualization of Coordinate Calibrations over the last 35 days.</p>
          </div>

          {/* Quick Guide Legend */}
          <div className="flex items-center gap-3 text-[9px] font-bold font-mono text-slate-400 select-none">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-slate-900 border border-slate-800" />
              <span>Offline</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-slate-800 border border-teal-500/40" />
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_6px_rgba(20,184,166,0.3)]" />
              <span>Synced</span>
            </div>
          </div>
        </div>

        {/* The Day Grid */}
        <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto sm:mx-0">
          {gridDays.map(({ date, dateStr, log }, idx) => {
            const isToday = new Date().toLocaleDateString('sv').substring(0, 10) === dateStr;
            const isFullyCompleted = log && log.completedGoal && log.completedKindness;
            const isPartiallyCompleted = log && (log.completedGoal || log.completedKindness) && !isFullyCompleted;
            const isLoggedNotDone = log && !log.completedGoal && !log.completedKindness;

            let bgClass = "bg-slate-950/70 border-slate-850 hover:border-slate-750 hover:bg-slate-900/40";
            let glowStyles = {};

            if (isFullyCompleted) {
              bgClass = "bg-gradient-to-r from-teal-500 to-emerald-400 border-transparent text-slate-950 shadow-[0_0_8px_rgba(20,184,166,0.25)]";
            } else if (isPartiallyCompleted) {
              bgClass = "bg-slate-900 border-teal-500/40 hover:border-teal-400 text-teal-400 shadow-[0_0_6px_rgba(20,184,166,0.1)]";
            } else if (isLoggedNotDone) {
              bgClass = "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700";
            }

            return (
              <div key={idx} className="relative group aspect-square">
                <motion.button
                  type="button"
                  onClick={() => {
                    playClick();
                    if (log) {
                      setSelectedDay(log);
                    }
                  }}
                  onMouseEnter={() => {
                    if (log) setHoveredDay(log);
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.93 }}
                  disabled={!log}
                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center border text-[10px] font-bold font-mono transition-all relative ${
                    log ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  } ${bgClass}`}
                  style={glowStyles}
                >
                  <span>{date.getDate()}</span>
                  
                  {/* Today marker indicator dot */}
                  {isToday && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
                  )}

                  {/* Complete Check icon overlay if fully done */}
                  {isFullyCompleted && (
                    <Check className="w-2.5 h-2.5 absolute top-0.5 right-0.5 stroke-[4.5] text-slate-950" />
                  )}
                </motion.button>

                {/* Micro tooltip on hover */}
                {log && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap bg-slate-900 border border-slate-800 text-[9px] font-bold text-teal-400 px-2 py-1 rounded-lg shadow-xl z-30">
                    {dateStr}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Details Panel */}
        <AnimatePresence mode="wait">
          {liveSelectedDay ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3.5 rounded-2xl bg-slate-900/70 border border-teal-500/20 text-left relative"
            >
              <button
                onClick={() => setSelectedDay(null)}
                className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-300 transition"
              >
                Clear Focus
              </button>
              
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 font-mono">
                    Calibration Coordinates: {liveSelectedDay.date}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Goal detail (Interactive Checkbox) */}
                  <button
                    type="button"
                    onClick={() => handleToggleGoal(liveSelectedDay.date)}
                    className={`space-y-1.5 p-3 rounded-xl bg-slate-950/60 border text-left w-full transition-all hover:bg-slate-950/90 active:scale-[0.98] select-none group cursor-pointer ${
                      liveSelectedDay.completedGoal 
                        ? 'border-teal-500/30 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.05)]' 
                        : 'border-slate-850 hover:border-slate-750 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
                        <Target className={`w-3.5 h-3.5 ${liveSelectedDay.completedGoal ? 'text-teal-400' : 'text-slate-650'}`} />
                        Alpha: Primary Goal
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        liveSelectedDay.completedGoal 
                          ? 'bg-teal-550 border-transparent text-slate-950' 
                          : 'border-slate-700 group-hover:border-teal-550/50'
                      }`}>
                        {liveSelectedDay.completedGoal && <Check className="w-2.5 h-2.5 stroke-[4.5]" />}
                      </div>
                    </div>
                    <p className={`text-xs font-semibold leading-relaxed ${liveSelectedDay.completedGoal ? 'text-teal-400/95 line-through opacity-70' : 'text-slate-250'}`}>
                      {liveSelectedDay.dailyGoal}
                    </p>
                    <span className="text-[9px] font-extrabold text-slate-500 font-mono block pt-0.5">
                      Status: {liveSelectedDay.completedGoal ? "✓ Complete (Synced)" : "✗ Tap to check off"}
                    </span>
                  </button>

                  {/* Kindness detail (Interactive Checkbox) */}
                  <button
                    type="button"
                    onClick={() => handleToggleKindness(liveSelectedDay.date)}
                    className={`space-y-1.5 p-3 rounded-xl bg-slate-950/60 border text-left w-full transition-all hover:bg-slate-950/90 active:scale-[0.98] select-none group cursor-pointer ${
                      liveSelectedDay.completedKindness 
                        ? 'border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                        : 'border-slate-850 hover:border-slate-750 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
                        <Heart className={`w-3.5 h-3.5 ${liveSelectedDay.completedKindness ? 'text-emerald-400 animate-pulse' : 'text-slate-650'}`} />
                        Beta: Self-Kindness Shield
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        liveSelectedDay.completedKindness 
                          ? 'bg-emerald-550 border-transparent text-slate-950' 
                          : 'border-slate-700 group-hover:border-emerald-550/50'
                      }`}>
                        {liveSelectedDay.completedKindness && <Check className="w-2.5 h-2.5 stroke-[4.5]" />}
                      </div>
                    </div>
                    <p className={`text-xs font-semibold leading-relaxed ${liveSelectedDay.completedKindness ? 'text-emerald-400/95 line-through opacity-70' : 'text-slate-250'}`}>
                      {liveSelectedDay.selfKindness}
                    </p>
                    <span className="text-[9px] font-extrabold text-slate-500 font-mono block pt-0.5">
                      Status: {liveSelectedDay.completedKindness ? "✓ Complete (Calibrated)" : "✗ Tap to check off"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mt-4 p-3 text-center rounded-xl bg-slate-900/10 border border-dashed border-slate-850/60 text-[10.5px] text-slate-500 font-semibold flex items-center justify-center gap-2">
              <Info className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Hover or tap an activated day to audit and complete Coordinate Alpha & Beta intentions.</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
