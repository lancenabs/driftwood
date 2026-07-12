import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';
import { useGame } from '../lance/components/LANCEGame/LANCEGameContext';
import { GAME_TOOLS, FREE_ACCESS_ALL } from '../lance/components/LANCEGame/lanceGameData';
import { getToolIcon } from '../lance/components/LANCEGame/toolIcons';
import { TOOL_GRADIENTS } from '../lance/components/LANCEGame/toolGradients';

// ═════════════════════════════════════════════════════════════════════════════
//  MY APPS — the flagship's installed-tools grid (lance-app HomeTab.tsx),
//  brought to Driftwood's shore. Same card language as the Library (glass,
//  shimmer, icon, OPEN) so a tool looks like itself whether you found it in
//  the Library or pinned it home — "the beautiful apps on the home screen
//  they saved" (Lance, 2026-07-12).
// ═════════════════════════════════════════════════════════════════════════════

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#0E7C7C 0%,#2E96B5 100%)',
  'linear-gradient(135deg,#F59E0B 0%,#B45309 100%)',
  'linear-gradient(135deg,#10B981 0%,#047857 100%)',
  'linear-gradient(135deg,#6366F1 0%,#4338CA 100%)',
];

export default function MyAppsGrid({ onOpenTool }: { onOpenTool: (id: string) => void }) {
  const { installedTools, uninstallTool } = useGame();

  return (
    <div className="bg-white rounded-[2rem] border-2 border-outline-variant p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display font-black text-sm text-slate-800">My Apps</h3>
          <p className="text-[10px] text-slate-400">the tools you saved here — real work, off the island too</p>
        </div>
      </div>

      {installedTools.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <div className="text-3xl">🏝️</div>
          <p className="text-[11px] font-bold text-slate-500">No apps on your shore yet</p>
          <p className="text-[10px] text-slate-400">
            Finish a milestone on the island, then tap <strong className="text-primary">+ Home</strong> on it in the Library
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 10 }}>
          <AnimatePresence>
            {installedTools.map((toolId, idx) => {
              const tool = GAME_TOOLS.find(t => t.id === toolId);
              if (!tool) return null;
              const gradient = TOOL_GRADIENTS[toolId] ?? FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
              const toolColor = gradient.match(/#[0-9A-Fa-f]{6}/)?.[0] ?? '#64748B';
              const shortDesc = tool.description.split('.')[0];
              return (
                <motion.div
                  key={toolId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="app-card-glass"
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
                    minHeight: 190,
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(165deg, ${toolColor}30 0%, ${toolColor}0A 45%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                  <div className="glass-card-shimmer" style={{ opacity: 0.5 }} />

                  {getToolIcon(tool.id) ? (
                    <img
                      src={getToolIcon(tool.id)!} alt="" loading="lazy" draggable={false}
                      style={{ width: 60, height: 60, marginBottom: 8, position: 'relative', borderRadius: 18, boxShadow: `0 10px 20px ${toolColor}3D, 0 2px 6px rgba(0,0,0,0.08)` }}
                    />
                  ) : (
                    <div style={{ fontSize: 38, lineHeight: 1, marginBottom: 8, position: 'relative' }}>{tool.emoji}</div>
                  )}

                  <div style={{
                    fontSize: 12.5, fontWeight: 800, color: '#1C1C1E', lineHeight: 1.2, marginBottom: 4,
                    position: 'relative', letterSpacing: -0.2,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                  }}>
                    {tool.name}
                  </div>
                  <div style={{
                    fontSize: 9.5, color: '#6B7280', lineHeight: 1.4, flex: 1, position: 'relative',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                  }}>
                    {shortDesc}
                  </div>

                  <div style={{ position: 'relative', marginTop: 10, display: 'flex', gap: 6 }}>
                    <div
                      onClick={e => { e.stopPropagation(); onOpenTool(toolId); }}
                      style={{
                        flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        background: gradient, border: '1px solid rgba(255,255,255,0.5)', borderRadius: 14,
                        padding: '7px 10px', fontSize: 11, fontWeight: 900, color: '#FFFFFF', letterSpacing: 0.4, cursor: 'pointer',
                        boxShadow: `0 3px 0 ${toolColor}66, 0 8px 16px ${toolColor}45, inset 0 1px 0 rgba(255,255,255,0.45)`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.18)',
                      }}
                    >
                      <Zap className="w-3 h-3" style={{ color: '#FFFFFF' }} /> OPEN
                    </div>
                    <div
                      onClick={e => { e.stopPropagation(); uninstallTool(toolId); }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', background: `${toolColor}1F`,
                        border: `1px solid ${toolColor}66`, borderRadius: 20, padding: '5px 10px',
                        fontSize: 10, fontWeight: 800, color: toolColor, letterSpacing: 0.4, cursor: 'pointer',
                      }}
                      title="Remove from home"
                    >
                      ✓
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      {!FREE_ACCESS_ALL && installedTools.length > 0 && (
        <p className="text-[8px] text-slate-300 text-center mt-2 italic">tier gates apply per your therapist's plan</p>
      )}
    </div>
  );
}
