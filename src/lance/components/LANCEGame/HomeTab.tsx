import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PencilLine, Zap } from 'lucide-react';
import { useGame } from './LANCEGameContext';
import TherapistCard from './TherapistCard';
import { GAME_TOOLS, FREE_ACCESS_ALL } from './lanceGameData';
import { getToolIcon } from './toolIcons';
import { TOOL_GRADIENTS } from './toolGradients';


const TIER_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Free',    color: '#6B7280' },
  2: { label: 'Starter', color: '#10B981' },
  3: { label: 'Core',    color: '#3B82F6' },
  4: { label: 'Pro',     color: '#8B5CF6' },
  5: { label: 'Expert',  color: '#F59E0B' },
  6: { label: 'Elite',   color: '#EF4444' },
  7: { label: 'Master',  color: '#EC4899' },
  8: { label: 'Advanced',color: '#A78BFA' },
};

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#0EA5E9 0%,#2563EB 100%)',
  'linear-gradient(135deg,#EC4899 0%,#BE185D 100%)',
  'linear-gradient(135deg,#10B981 0%,#047857 100%)',
  'linear-gradient(135deg,#F59E0B 0%,#B45309 100%)',
  'linear-gradient(135deg,#6366F1 0%,#4338CA 100%)',
  'linear-gradient(135deg,#F97316 0%,#C2410C 100%)',
];

const QUICK_CHECKIN_POOL = [
  { id: 'mood_log',        label: 'Mood Log',            emoji: '💜' },
  { id: 'mood_checkin',    label: 'Mood Check-In',       emoji: '🌡️' },
  { id: 'breathwork_478',  label: 'Breathwork 4-7-8',    emoji: '🌬️' },
  { id: 'box_breathing',   label: 'Box Breathing',       emoji: '⬛' },
  { id: 'grounding_54321', label: 'Grounding 5-4-3-2-1', emoji: '⚓' },
  { id: 'cbt_reframe',     label: 'CBT Thought Record',  emoji: '🧠' },
  { id: 'gratitude_log',   label: 'Gratitude Log',       emoji: '✨' },
  { id: 'activity_tracker',label: 'Activity Tracker',    emoji: '✅' },
  { id: 'wise_mind',       label: 'Wise Mind',           emoji: '🌀' },
  { id: 'goal_journal',    label: 'Goal Journal',        emoji: '📔' },
  { id: 'emotion_wheel',   label: 'Emotion Wheel',       emoji: '🎡' },
  { id: 'body_scan',       label: 'Body Scan',           emoji: '🌊' },
];

const ALL_SUB_TABS = [
  { id: 'overview',   label: 'Overview'    },
  { id: 'mood',       label: 'Mood Diary'  },
  { id: 'habits',     label: 'Daily Habits'},
  { id: 'sleep',      label: 'Sleep'       },
  { id: 'nutrition',  label: 'Diet & Mood' },
];

function SubTabPlaceholder({ label, emoji, onOpenTool, toolId }: {
  label: string; emoji: string; onOpenTool: (id: string) => void; toolId: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 px-6 text-center">
      <div className="text-5xl">{emoji}</div>
      <h3 className="text-base font-black text-white">{label}</h3>
      <p className="text-sm text-slate-400">Track your {label.toLowerCase()} in the dedicated tool.</p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenTool(toolId)}
        className="px-6 py-2.5 rounded-2xl text-sm font-black text-white transition-all"
        style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)', boxShadow: '0 4px 16px rgba(62,207,207,0.3)' }}
      >
        Open {label} Tool
      </motion.button>
    </div>
  );
}

interface Props {
  onOpenTool: (id: string) => void;
}

export default function HomeTab({ onOpenTool }: Props) {
  const {
    installedTools, uninstallTool,
    enabledSubTabs, quickCheckInApps, setQuickCheckInApps,
    userName, completedChallenges,
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [showQuickCustomizer, setShowQuickCustomizer] = useState(false);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const visibleSubTabs = ALL_SUB_TABS.filter(t => enabledSubTabs.includes(t.id));
  const safeActiveTab = visibleSubTabs.find(t => t.id === activeSubTab)
    ? activeSubTab
    : (visibleSubTabs[0]?.id ?? 'overview');

  return (
    <div className="flex flex-col h-full" style={{ background: '#0f172a' }}>
      {/* Atmospheric orbs */}
      <div style={{
        position: 'fixed', top: '-10%', left: '-10%', width: '50%', height: '50%',
        borderRadius: '50%', background: 'rgba(6,182,212,0.18)', filter: 'blur(80px)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-10%', width: '55%', height: '55%',
        borderRadius: '50%', background: 'rgba(168,85,247,0.18)', filter: 'blur(100px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Sub-tab pill bar — only show when more than one tab is visible */}
      {visibleSubTabs.length > 1 && (
        <div
          className="shrink-0 px-4 pt-3 pb-2 relative z-10"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="flex gap-1.5 p-1 rounded-2xl overflow-x-auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {visibleSubTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className="shrink-0 py-1.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200"
                style={{
                  background: safeActiveTab === tab.id ? 'linear-gradient(135deg,#3ECFCF,#7C3AED)' : 'transparent',
                  color: safeActiveTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  boxShadow: safeActiveTab === tab.id ? '0 2px 12px rgba(62,207,207,0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">

          {safeActiveTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="px-4 pt-4 pb-28 space-y-5"
            >
              {/* Greeting */}
              <div>
                <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">
                  {greeting}{userName ? `, ${userName}` : ''}
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">What would you like to focus on today?</p>
              </div>

              {/* First Mission Banner — shown only until Challenge 1 is complete */}
              {completedChallenges.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: 'rgba(255,150,0,0.08)',
                    border: '1px solid rgba(255,150,0,0.35)',
                    boxShadow: '0 0 32px rgba(255,150,0,0.12)',
                  }}
                >
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{ background: 'linear-gradient(135deg,#FF9600,#FFCC00)', color: '#1C1C1E' }}
                      >
                        L
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#FF9600AA' }}>
                        L.A.N.C.E. — First Directive
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-snug mb-4" style={{ color: 'rgba(255,255,255,0.88)' }}>
                      "Your first challenge awaits. The island doesn't care if you're ready. Neither do I. Don't embarrass yourself."
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onOpenTool('__challenges__')}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-black"
                      style={{
                        background: 'linear-gradient(135deg,#FF9600,#FFCC00)',
                        color: '#1C1C1E',
                        boxShadow: '0 4px 16px rgba(255,150,0,0.4)',
                      }}
                    >
                      <Zap className="w-4 h-4" />
                      Start Mission 1
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* From your therapist — top slot when connected */}
              <TherapistCard onOpenTool={onOpenTool} />

              {/* Quick Check-In Suite */}
              <div
                className="rounded-3xl p-4 space-y-3"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="text-[11px] font-black text-cyan-300 uppercase tracking-widest">⚡ Quick Check-In Suite</h3>
                  </div>
                  <button
                    onClick={() => setShowQuickCustomizer(true)}
                    className="flex items-center gap-1 text-[10px] font-black text-cyan-400 uppercase tracking-wider px-2.5 py-1 rounded-xl active:scale-95"
                    style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}
                  >
                    <PencilLine className="w-3 h-3" /> Customize
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickCheckInApps.slice(0, 5).map(id => {
                    const pool = QUICK_CHECKIN_POOL.find(p => p.id === id);
                    if (!pool) return null;
                    const gradient = TOOL_GRADIENTS[id] ?? FALLBACK_GRADIENTS[0];
                    return (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onOpenTool(id)}
                        className="flex items-center gap-2.5 p-3 rounded-2xl text-left"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {getToolIcon(id) ? (
                          <img
                            src={getToolIcon(id)!} alt="" loading="lazy" draggable={false}
                            className="w-9 h-9 rounded-xl shrink-0"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                            style={{ background: gradient, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                          >
                            {pool.emoji}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[11px] font-black text-white truncate">{pool.label}</div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Launch ›</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Installed Apps Grid */}
              {installedTools.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-4xl">📱</div>
                  <p className="text-sm font-bold text-slate-400">No apps on your home screen yet</p>
                  <p className="text-xs text-slate-600">
                    Tap <strong className="text-cyan-400">Get</strong> on any tool in the Library
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">My Apps</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 10 }}>
                    <AnimatePresence>
                      {installedTools.map((toolId, idx) => {
                        const tool = GAME_TOOLS.find(t => t.id === toolId);
                        if (!tool) return null;
                        const gradient = TOOL_GRADIENTS[toolId] ?? FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
                        const toolColor = gradient.match(/#[0-9A-Fa-f]{6}/)?.[0] ?? '#64748B';
                        const tier = TIER_LABELS[tool.tier] ?? TIER_LABELS[1];
                        const shortDesc = tool.description.split('.')[0];
                        return (
                          <motion.div
                            key={toolId}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => onOpenTool(toolId)}
                            style={{
                              background: 'rgba(255,255,255,0.78)',
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                              borderRadius: 24,
                              padding: '16px 14px 14px',
                              position: 'relative',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '1px solid rgba(255,255,255,0.95)',
                              boxShadow: `0 8px 28px ${toolColor}2E, 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)`,
                              display: 'flex',
                              flexDirection: 'column',
                              aspectRatio: '4/5',
                              transition: 'box-shadow 0.2s',
                            }}
                          >
                            {/* Soft color tint from the tool's palette */}
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: `linear-gradient(165deg, ${toolColor}30 0%, ${toolColor}0A 45%, transparent 70%)`,
                              pointerEvents: 'none',
                            }} />
                            {/* Shimmer sweep */}
                            <div className="glass-card-shimmer" style={{ opacity: 0.5 }} />

                            {/* Tier badge — hidden while everything is free (FREE_ACCESS_ALL) */}
                            {!FREE_ACCESS_ALL && (
                              <div style={{
                                position: 'absolute', top: 10, right: 10,
                                background: 'rgba(255,255,255,0.7)',
                                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                                border: `1px solid ${tier.color}45`,
                                borderRadius: 8, padding: '2px 7px',
                                fontSize: 9, fontWeight: 800, color: tier.color,
                                letterSpacing: 0.5, textTransform: 'uppercase' as const,
                                zIndex: 2,
                              }}>
                                {tier.label}
                              </div>
                            )}

                            {/* Icon (generated 3D clay set) — emoji fallback when none exists */}
                            {getToolIcon(tool.id) ? (
                              <img
                                src={getToolIcon(tool.id)!}
                                alt=""
                                loading="lazy"
                                draggable={false}
                                style={{
                                  width: 68, height: 68, marginBottom: 10, position: 'relative',
                                  borderRadius: 20,
                                  boxShadow: `0 10px 20px ${toolColor}3D, 0 2px 6px rgba(0,0,0,0.08)`,
                                }}
                              />
                            ) : (
                              <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 10, position: 'relative' }}>
                                {tool.emoji}
                              </div>
                            )}

                            {/* Name */}
                            <div style={{
                              fontSize: 13, fontWeight: 800, color: '#1C1C1E',
                              lineHeight: 1.2, marginBottom: 5, position: 'relative', letterSpacing: -0.2,
                            }}>
                              {tool.name}
                            </div>

                            {/* Description */}
                            <div style={{
                              fontSize: 10, color: '#6B7280',
                              lineHeight: 1.45, flex: 1, position: 'relative',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical' as const,
                              overflow: 'hidden',
                            }}>
                              {shortDesc}
                            </div>

                            {/* Action row */}
                            <div style={{ position: 'relative', marginTop: 12, display: 'flex', gap: 6 }}>
                              <div
                                onClick={e => { e.stopPropagation(); onOpenTool(toolId); }}
                                style={{
                                  flex: 1,
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                  background: gradient,
                                  border: '1px solid rgba(255,255,255,0.5)',
                                  borderRadius: 16, padding: '8px 12px',
                                  fontSize: 12, fontWeight: 900, color: '#FFFFFF',
                                  letterSpacing: 0.4, cursor: 'pointer',
                                  boxShadow: `0 3px 0 ${toolColor}66, 0 8px 16px ${toolColor}45, inset 0 1px 0 rgba(255,255,255,0.45)`,
                                  textShadow: '0 1px 2px rgba(0,0,0,0.18)',
                                }}
                              >
                                <Zap className="w-3 h-3" style={{ color: '#FFFFFF' }} /> OPEN
                              </div>
                              <div
                                onClick={e => { e.stopPropagation(); uninstallTool(toolId); }}
                                style={{
                                  display: 'inline-flex', alignItems: 'center',
                                  background: `${toolColor}1F`,
                                  border: `1px solid ${toolColor}66`,
                                  borderRadius: 20, padding: '6px 12px',
                                  fontSize: 11, fontWeight: 800, color: toolColor,
                                  letterSpacing: 0.4, cursor: 'pointer',
                                  backdropFilter: 'blur(8px)',
                                }}
                              >
                                ✓ Added
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {safeActiveTab === 'mood' && (
            <motion.div key="mood" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SubTabPlaceholder label="Mood Diary" emoji="💜" onOpenTool={onOpenTool} toolId="mood_checkin" />
            </motion.div>
          )}

          {safeActiveTab === 'habits' && (
            <motion.div key="habits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SubTabPlaceholder label="Daily Habits" emoji="✅" onOpenTool={onOpenTool} toolId="activity_tracker" />
            </motion.div>
          )}

          {safeActiveTab === 'sleep' && (
            <motion.div key="sleep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SubTabPlaceholder label="Sleep Tracker" emoji="🌙" onOpenTool={onOpenTool} toolId="sleep_log" />
            </motion.div>
          )}

          {safeActiveTab === 'nutrition' && (
            <motion.div key="nutrition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SubTabPlaceholder label="Diet & Mood" emoji="🥗" onOpenTool={onOpenTool} toolId="nutrition" />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Quick Check-In Customizer sheet */}
      <AnimatePresence>
        {showQuickCustomizer && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowQuickCustomizer(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-5 pb-10"
              style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', maxHeight: '70vh', overflowY: 'auto' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Config Console</p>
                  <h3 className="text-base font-black text-white">Customize Quick Check-In</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select up to 5 apps for rapid access.</p>
                </div>
                <button
                  onClick={() => setShowQuickCustomizer(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {QUICK_CHECKIN_POOL.map(item => {
                  const isSelected = quickCheckInApps.includes(item.id);
                  const gradient = TOOL_GRADIENTS[item.id] ?? FALLBACK_GRADIENTS[0];
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isSelected) {
                          if (quickCheckInApps.length > 1) setQuickCheckInApps(quickCheckInApps.filter(id => id !== item.id));
                        } else {
                          if (quickCheckInApps.length < 5) setQuickCheckInApps([...quickCheckInApps, item.id]);
                        }
                      }}
                      className="flex items-center gap-2.5 p-3 rounded-2xl text-left"
                      style={{
                        background: isSelected ? 'rgba(62,207,207,0.12)' : 'rgba(255,255,255,0.05)',
                        border: isSelected ? '1px solid rgba(62,207,207,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {getToolIcon(item.id) ? (
                        <img src={getToolIcon(item.id)!} alt="" loading="lazy" draggable={false} className="w-8 h-8 rounded-xl shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base" style={{ background: gradient }}>
                          {item.emoji}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-[11px] font-black text-white truncate">{item.label}</div>
                        <div className="text-[9px] font-bold text-slate-500">{isSelected ? '✓ Selected' : 'Add'}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowQuickCustomizer(false)}
                className="w-full py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-900 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)' }}
              >
                Apply
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
