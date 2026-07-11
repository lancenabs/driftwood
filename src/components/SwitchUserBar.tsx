import React, { useState } from 'react';
import { Smartphone, RefreshCw, Check, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UserProfile {
  id: string;
  name: string;
  roleText: string;
  avatar: string;
  device: string;
  color: string;
}

export const SIMULATED_PROFILES: UserProfile[] = [
  {
    id: 'alex',
    name: 'Alex',
    roleText: 'Partner A',
    avatar: '👤',
    device: "Alex's iPhone 15",
    color: 'bg-primary border-primary-dark text-white',
  },
  {
    id: 'taylor',
    name: 'Taylor',
    roleText: 'Partner B',
    avatar: '💖',
    device: "Taylor's Galaxy S24",
    color: 'bg-secondary border-secondary-dark text-white',
  },
  {
    id: 'jamie',
    name: 'Jamie',
    roleText: 'Teenager/Child',
    avatar: '🧒',
    device: "Jamie's Pixel 8",
    color: 'bg-amber-500 border-amber-600 text-white',
  },
];

interface SwitchUserBarProps {
  currentUser: UserProfile;
  onChangeUser: (user: UserProfile) => void;
}

export default function SwitchUserBar({ currentUser, onChangeUser }: SwitchUserBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSelect = (user: UserProfile) => {
    if (user.id === currentUser.id) {
      setIsOpen(false);
      return;
    }
    setSyncing(true);
    setIsOpen(false);
    setTimeout(() => {
      setSyncing(false);
      onChangeUser(user);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    }, 700);
  };

  return (
    <div className="w-full flex flex-col gap-2 bg-surface-container-low border-2 border-outline-variant p-3.5 rounded-[2rem] shadow-2xs relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="text-xl">{currentUser.avatar}</span>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-2.5 h-2.5 rounded-full border border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xs text-on-surface leading-none">{currentUser.name}</span>
              <span className="text-[7.5px] font-black uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/25">
                {currentUser.roleText}
              </span>
            </div>
            <p className="text-[9px] font-mono font-bold text-on-surface-variant flex items-center gap-1 mt-0.5">
              <Smartphone className="w-2.5 h-2.5 text-on-surface-variant" />
              <span>{currentUser.device}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[9px] font-black bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 px-3 py-1.5 rounded-xl cursor-pointer uppercase tracking-wider flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
          <span>Switch Profile</span>
        </button>
      </div>

      {/* Syncing Simulator feedback */}
      <AnimatePresence>
        {syncing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary/5 p-2 rounded-xl text-[9px] font-bold text-primary flex items-center gap-1.5 border border-primary/10"
          >
            <RefreshCw className="w-3 h-3 animate-spin text-primary" />
            <span>Switching castaway…</span>
          </motion.div>
        )}
        {syncSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 p-2 rounded-xl text-[9.5px] font-sans font-semibold text-green-700 flex items-center gap-1.5 border border-green-200"
          >
            <div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
              ✓
            </div>
            <span>Logged into {currentUser.name}'s device. Shared data synced.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-outline-variant rounded-2xl shadow-xl p-2.5 z-40 flex flex-col gap-1.5 animate-scale-in text-on-surface">
          <div className="border-b border-outline-variant pb-1.5 mb-1 text-center">
            <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-wider flex items-center justify-center gap-1">
              <Shield className="w-2.5 h-2.5 text-secondary" />
              <span>Co-op Session Device Switcher</span>
            </span>
          </div>
          {SIMULATED_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleSelect(profile)}
              className={`flex justify-between items-center p-2 rounded-xl border transition-all cursor-pointer text-left ${profile.id === currentUser.id ? 'bg-primary/5 border-primary/30 font-bold' : 'bg-slate-50 hover:bg-slate-100 border-transparent hover:border-outline-variant'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{profile.avatar}</span>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-[#4B4B4B]">{profile.name}</span>
                    <span className="text-[7px] bg-slate-200 text-slate-600 px-1 rounded font-black uppercase tracking-wider">{profile.roleText}</span>
                  </div>
                  <span className="text-[8px] font-mono text-on-surface-variant">{profile.device}</span>
                </div>
              </div>
              {profile.id === currentUser.id ? (
                <Check className="w-3.5 h-3.5 text-primary stroke-[3px]" />
              ) : (
                <span className="text-[8px] font-bold text-primary opacity-0 hover:opacity-100 transition-opacity">Simulate Login →</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
