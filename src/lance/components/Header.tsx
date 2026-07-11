import React from 'react';
import { Settings, Sparkles, Cloud, CloudOff, RefreshCw, Play, Award, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import StickFigureAnimator from './StickFigureAnimator';

interface HeaderProps {
  onOpenSettings: () => void;
  userName: string;
  assistantName: string;
  assistantAvatarUrl: string;
  onClickAvatar: () => void;
  onOpenImmersiveVisualizer?: () => void;
  onReplayIntro?: () => void;
  syncStatus?: 'loading' | 'synced' | 'error' | 'local';
  onSyncClick?: () => void;
  onOpenBetaReadiness?: () => void;
  escapeTokens?: number;
  onOpenMarketing?: () => void;
  streak?: number;
  streakProgress?: number;
}

export default function Header({ 
  onOpenSettings, 
  userName, 
  assistantName, 
  assistantAvatarUrl, 
  onClickAvatar,
  onOpenImmersiveVisualizer,
  onReplayIntro,
  syncStatus = 'local',
  onSyncClick,
  onOpenBetaReadiness,
  escapeTokens,
  onOpenMarketing,
  streak,
  streakProgress = 0
}: HeaderProps) {
  const [headerFigureType, setHeaderFigureType] = React.useState<'playing' | 'running' | 'painting' | 'couple' | 'group'>('playing');

  const cycleHeaderFigure = () => {
    const types: ('playing' | 'running' | 'painting' | 'couple' | 'group')[] = ['playing', 'running', 'painting', 'couple', 'group'];
    const idx = types.indexOf(headerFigureType);
    setHeaderFigureType(types[(idx + 1) % types.length]);
  };

  return (
    <header id="main-app-header" className="fixed top-0 left-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60 flex justify-between items-center px-4 md:px-6 h-20 sm:h-16 pt-[env(safe-area-inset-top,0px)] transition-all duration-300 shadow-[0_1px_5px_rgba(0,0,0,0.02)]">
      <div className="max-w-[680px] md:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div 
            onClick={onClickAvatar}
            className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-800 shadow-xs shrink-0 cursor-pointer hover:scale-105 active:scale-90 transition-all duration-200"
            title={`Get a peaceful tip from ${assistantName}`}
          >
            <img
              alt="Assistant profile"
              className="w-full h-full object-cover"
              src={assistantAvatarUrl}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight leading-none font-sans">
              {assistantName}
            </h1>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-flex animate-pulse" /> online
            </span>
          </div>
        </div>

        {/* Animated Brand Stick Figure (Tap to Cycle Easter Egg) */}
        <div 
          onClick={cycleHeaderFigure}
          className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900/50 hover:bg-slate-850 rounded-full border border-slate-800 cursor-pointer transition-all active:scale-95 shadow-3xs group select-none animate-fade-in"
          title="Dynamic Intimacy Brand Logo - Click to change posture!"
        >
          <StickFigureAnimator type={headerFigureType} className="w-8 h-8" />
          <span className="text-[9px] uppercase font-black text-slate-400 group-hover:text-slate-200 font-mono tracking-widest transition-colors">
            {headerFigureType === 'couple' ? 'couples' : headerFigureType === 'group' ? 'groups' : headerFigureType}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dynamic Streak Progress Ring Tracker */}
          {streak !== undefined && (
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/60 hover:bg-slate-850 rounded-full border border-slate-800/80 transition-all select-none group relative cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.02)]"
              title={`Today's task alignment: ${Math.round(streakProgress * 100)}% complete. Keep your ${streak} Days streak burning!`}
            >
              {/* Visual Progress Ring */}
              <div className="relative w-6.5 h-6.5 flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                  {/* Background Track */}
                  <circle
                    cx="13"
                    cy="13"
                    r="10.5"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="2"
                  />
                  {/* Animated Progress Path */}
                  <motion.circle
                    cx="13"
                    cy="13"
                    r="10.5"
                    className="stroke-amber-500 fill-none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: 66, strokeDashoffset: 66 }}
                    animate={{ strokeDashoffset: 66 - (66 * Math.min(1, Math.max(0, streakProgress))) }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  />
                </svg>
                {/* Centered micro flame */}
                <Flame className={`w-3.5 h-3.5 ${streakProgress > 0 ? 'text-amber-500 fill-amber-505/20 animate-pulse' : 'text-slate-600'}`} />
              </div>

              {/* Text */}
              <div className="flex flex-col text-left justify-center leading-none">
                <span className="text-[8px] font-black uppercase text-amber-550 tracking-wider font-mono">Streak</span>
                <span className="text-[10px] font-extrabold text-slate-150 font-mono mt-0.5">{streak} d</span>
              </div>
            </div>
          )}

          {/* Escape Tokens Pocket Tracker */}
          {escapeTokens !== undefined && (
            <div 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/15 text-orange-400 hover:text-orange-300 rounded-full border border-amber-500/20 shadow-3xs text-[9px] font-mono font-black transition-all select-none animate-fade-in"
              title={`${escapeTokens} Escape Tokens pocketed! Keep beating story challenges to earn more.`}
            >
              <span>🪙</span> 
              <span>{escapeTokens} TOKENS</span>
            </div>
          )}

          {/* Cloud Sync Status Indicator */}
          {onSyncClick && (
            <button
              onClick={onSyncClick}
              className={`p-1.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
                syncStatus === 'synced'
                  ? 'text-teal-400 bg-teal-500/10 hover:bg-teal-500/20'
                  : syncStatus === 'loading'
                  ? 'text-sky-400 bg-sky-500/10'
                  : syncStatus === 'error'
                  ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800'
              }`}
              title={
                syncStatus === 'synced'
                  ? 'Cloud Synced - Click to view Cloud Backup'
                  : syncStatus === 'loading'
                  ? 'Synchronizing with Firestore Database...'
                  : syncStatus === 'error'
                  ? 'Connection Error - Click to reconnect cloud database'
                  : 'Cloud Backup Off - Click to configure cloud sync'
              }
            >
              {syncStatus === 'loading' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : syncStatus === 'error' ? (
                <CloudOff className="w-4 h-4" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
            </button>
          )}

          {onOpenImmersiveVisualizer && (
            <button
              onClick={onOpenImmersiveVisualizer}
              className="hidden md:flex px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 font-black text-[9.5px] uppercase tracking-wider items-center gap-1.5 transition-all duration-250 cursor-pointer active:scale-90 hover:bg-teal-500/20 animate-fade-in"
              title="Experience high-fidelity 2026 wellness concept"
            >
              <Sparkles className="w-3 h-3 text-teal-400 animate-pulse shrink-0" />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent font-black">2026 Mode</span>
            </button>
          )}

          {onOpenMarketing && (
            <button
              onClick={onOpenMarketing}
              className="hidden lg:flex px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-black text-[9.5px] uppercase tracking-wider items-center gap-1.5 transition-all duration-250 cursor-pointer active:scale-90 hover:bg-indigo-500/20 animate-fade-in"
              title="View the L.A.N.C.E. Product Launch & Marketing Website"
            >
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent font-black">🌐 Product Site</span>
            </button>
          )}

          {onOpenBetaReadiness && (
            <button
              onClick={onOpenBetaReadiness}
              className="hidden xl:flex px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-[9.5px] uppercase tracking-wider items-center gap-1.5 transition-all duration-250 cursor-pointer active:scale-90 hover:bg-slate-800 animate-fade-in"
              title="Verify app release candidate readiness before Beta launch"
            >
              <Award className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Beta Readiness</span>
            </button>
          )}

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              style={{ padding: '6px' }}
              className="hidden sm:flex p-1.5 rounded-full hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all duration-200 active:scale-90 cursor-pointer items-center justify-center shrink-0"
              title="Replay Cinematic Video Intro"
            >
              <Play className="w-4.5 h-4.5 text-slate-400 fill-slate-500 hover:fill-slate-200" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
            id="btn-settings-toggle"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
