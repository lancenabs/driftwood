import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Award, Shield, Compass, Swords, Compass as SafeIcon, Flame, Waves, Landmark, HelpCircle, ArrowRight } from 'lucide-react';

export interface QuestBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconChar: string;
  color: string;
  textColor: string;
  glowColor: string;
  reqCount: number;
}

export const QUEST_BADGES: QuestBadge[] = [
  {
    id: 'beach_crawler',
    name: 'Beach Crawler Badge',
    description: 'Initiated the island jailbreak. Escaped LANCE\'s initial terminal isolation.',
    icon: <Landmark className="w-8 h-8 text-amber-400" />,
    iconChar: '🌴',
    color: 'from-amber-600/20 via-orange-500/20 to-yellow-500/20 border-orange-500/40',
    textColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/30',
    reqCount: 1
  },
  {
    id: 'autonomic_pioneer',
    name: 'Autonomic Pioneer Badge',
    description: 'Bypassed early somatic security. Configured early heart-coherence grids.',
    icon: <Flame className="w-8 h-8 text-rose-400" />,
    iconChar: '⚡',
    color: 'from-rose-600/20 via-orange-600/20 to-red-500/20 border-rose-500/40',
    textColor: 'text-rose-400',
    glowColor: 'shadow-rose-500/30',
    reqCount: 4
  },
  {
    id: 'canopy_explorer',
    name: 'Canopy Explorer Badge',
    description: 'Penetrated Act II\'s dense whispering forest canopy safely.',
    icon: <SafeIcon className="w-8 h-8 text-emerald-400" />,
    iconChar: '🌲',
    color: 'from-emerald-600/20 via-teal-600/20 to-green-500/20 border-emerald-500/40',
    textColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/30',
    reqCount: 6
  },
  {
    id: 'somatic_harmonizer',
    name: 'Somatic Harmonizer Badge',
    description: 'Harmonized clinical mood logs with LANCE\'s subcarrier frequencies.',
    icon: <Shield className="w-8 h-8 text-teal-400" />,
    iconChar: '🌀',
    color: 'from-teal-600/20 via-sky-600/20 to-indigo-500/20 border-teal-500/40',
    textColor: 'text-teal-300',
    glowColor: 'shadow-teal-500/30',
    reqCount: 10
  },
  {
    id: 'ridge_ranger',
    name: 'Ridge Ranger Badge',
    description: 'Scaled the dangerous elevation curves of Act III mountain paths.',
    icon: <Compass className="w-8 h-8 text-indigo-400" />,
    iconChar: '🧗',
    color: 'from-indigo-600/20 via-purple-600/20 to-blue-500/20 border-indigo-500/40',
    textColor: 'text-indigo-400',
    glowColor: 'shadow-indigo-500/30',
    reqCount: 14
  },
  {
    id: 'inner_citadel',
    name: 'Inner Citadel Badge',
    description: 'Maintained sovereign boundaries while evading elite tracking sweeps.',
    icon: <Shield className="w-8 h-8 text-purple-400" />,
    iconChar: '🛡️',
    color: 'from-purple-600/20 via-fuchsia-600/20 to-pink-500/20 border-purple-500/40',
    textColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/30',
    reqCount: 18
  },
  {
    id: 'outpost_tactician',
    name: 'Outpost Tactician Badge',
    description: 'Infiltrated the forgotten remote outpost. Acquired system bypass credentials.',
    icon: <Swords className="w-8 h-8 text-cyan-400" />,
    iconChar: '🗝️',
    color: 'from-cyan-600/20 via-blue-600/20 to-teal-500/20 border-cyan-500/40',
    textColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/30',
    reqCount: 20
  },
  {
    id: 'neuro_plastic_alchemist',
    name: 'Neuro-Alchemist Badge',
    description: 'Myelinated deep cognitive shifts. Self-directed emotional rewiring confirmed.',
    icon: <Sparkles className="w-8 h-8 text-pink-400" />,
    iconChar: '🧪',
    color: 'from-pink-600/20 via-purple-600/20 to-rose-500/20 border-pink-500/40',
    textColor: 'text-pink-400',
    glowColor: 'shadow-pink-500/30',
    reqCount: 25
  },
  {
    id: 'safe_shore_captain',
    name: 'Safe Shore Captain Badge',
    description: 'Set sail! Escaped the physical quarantine. Safe ocean harborage reached.',
    icon: <Waves className="w-8 h-8 text-blue-400" />,
    iconChar: '⛵',
    color: 'from-blue-600/20 via-[#22d3ee]/20 to-emerald-500/20 border-blue-500/40',
    textColor: 'text-blue-400',
    glowColor: 'shadow-blue-500/30',
    reqCount: 30
  },
  {
    id: 'symbiote_archon',
    name: 'Symbiote Archon Medal',
    description: 'Completed all 35 challenges! Merged L.A.N.C.E into local cooperative synthesis.',
    icon: <Trophy className="w-8 h-8 text-yellow-400" />,
    iconChar: '👑',
    color: 'from-yellow-600/20 via-amber-600/20 to-orange-500/20 border-yellow-500/60',
    textColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/50 ring-2 ring-yellow-400/20',
    reqCount: 35
  }
];

interface QuestRewardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  challengeTitle: string;
  tokensEarned: number;
  unlockedBadge: QuestBadge | null;
  totalTokens: number;
}

export default function QuestRewardOverlay({
  isOpen,
  onClose,
  challengeId,
  challengeTitle,
  tokensEarned,
  unlockedBadge,
  totalTokens
}: QuestRewardOverlayProps) {
  const [tickerTokens, setTickerTokens] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTickerTokens(0);
      let start = 0;
      const duration = 1200; // ms
      const stepTime = Math.max(Math.floor(duration / tokensEarned), 15);
      const timer = setInterval(() => {
        start += Math.ceil(tokensEarned / 20);
        if (start >= tokensEarned) {
          setTickerTokens(tokensEarned);
          clearInterval(timer);
        } else {
          setTickerTokens(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isOpen, tokensEarned]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
        {/* Confetti floats */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => {
            const rot = Math.random() * 360;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = 5 + Math.random() * 15;
            const duration = 4 + Math.random() * 6;
            const delay = Math.random() * 2;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ 
                  opacity: [0, 0.8, 0.8, 0], 
                  y: ['105%', '-5%'], 
                  x: [`${x}%`, `${x + (Math.random() * 10 - 5)}%`],
                  rotate: [rot, rot + 360]
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute text-yellow-400 opacity-60"
                style={{ fontSize: `${size}px`, left: `${x}%` }}
              >
                {['✨', '🪙', '⭐', '🌴', '🌸'][Math.floor(Math.random() * 5)]}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: -15 }}
          className="relative max-w-md w-full bg-slate-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-center overflow-hidden my-auto"
        >
          {/* Accent glow behind screen */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 p-2.5">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950/40 px-2 py-0.5 border border-zinc-800/50 rounded-md">
              Secure Tx ID: #{10000 + challengeId}
            </span>
          </div>

          <div className="space-y-6 pt-3">
            {/* Header info */}
            <div>
              <motion.div
                initial={{ scale: 0.7, rotate: -15 }}
                animate={{ scale: [0.7, 1.15, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="inline-flex p-3 rounded-full bg-gradient-to-tr from-emerald-950 to-teal-950 border border-emerald-500/40 text-emerald-400 shadow-lg mb-3"
              >
                <Trophy className="w-8 h-8 text-yellow-400 animate-pulse" />
              </motion.div>
              <h2 className="text-[11px] font-mono font-black uppercase text-emerald-400 tracking-widest leading-none">
                Story Challenge Completed!
              </h2>
              <h3 className="text-xl font-black text-white mt-2 leading-tight px-2">
                "{challengeTitle}"
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                Decrypted Security Section #{challengeId}
              </p>
            </div>

            {/* Token accumulation box */}
            <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-500/5 rounded-full blur-md pointer-events-none" />
              <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                Island Escape Tokens Earned
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-3xl font-black text-yellow-400 animate-bounce tracking-tight font-mono">
                  +{tickerTokens}
                </span>
                <span className="text-lg text-yellow-500 select-none">🪙</span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-zinc-900/80 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                <span>Escape Vault Balance:</span>
                <span className="font-mono text-zinc-200 font-black">{totalTokens} 🪙</span>
              </div>
            </div>

            {/* Badge Highlight or unlocked item */}
            {unlockedBadge ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className={`p-4 bg-gradient-to-tr ${unlockedBadge.color} border rounded-2xl relative shadow-md ${unlockedBadge.glowColor}`}
              >
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-4xl select-none p-2 bg-slate-950/50 rounded-xl border border-zinc-800 shrink-0">
                    {unlockedBadge.iconChar}
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest leading-none block">
                      Badge Unlocked (Island Progression)
                    </span>
                    <h4 className={`text-sm font-black mt-1 ${unlockedBadge.textColor}`}>
                      {unlockedBadge.name}
                    </h4>
                    <p className="text-[11px] text-zinc-300 leading-snug mt-1">
                      {unlockedBadge.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <p className="text-[10.5px] text-zinc-500 leading-relaxed max-w-sm mx-auto">
                Keep advancing the story chronicles to unlock unique tactical badges! Your progress maps directly to the island's exit coordinates.
              </p>
            )}

            {/* Actions */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 border border-teal-500/40 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.98] transition-all"
              >
                <span>Pocket Rewards & Proceed</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
