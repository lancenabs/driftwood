import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Lock, Zap } from 'lucide-react';
import { useGame } from './LANCEGameContext';
import { getLockedTools, getUnlockedTools } from '../../lib/therapistLink';
import { GAME_TOOLS, FREE_ACCESS_ALL, SAFETY_TOOL_IDS } from './lanceGameData';

// Safety/crisis tools are configured and opened from Settings → Safety & Crisis
// only — never listed on the Library (search included).
const LIBRARY_TOOLS = GAME_TOOLS.filter(t => !SAFETY_TOOL_IDS.includes(t.id));
import { getToolIcon } from './toolIcons';
import { TOOL_GRADIENTS } from './toolGradients';

type HomeScreen = 'home' | 'challenge' | 'tool' | 'intern' | 'insights' | 'paywall';

interface Props {
  onNavigate: (screen: HomeScreen, toolId?: string) => void;
}


const CATEGORY_SECTIONS: { id: string; label: string; color: string; glow: string }[] = [
  // ── THE FAMILY DECK — leads the grid on this island (the evil-eye catch:
  //    this section was MISSING entirely; the app's own 14 tools rendered
  //    nowhere while the vendored Recovery deck led a family app) ──
  { id: 'family',     label: 'The Family Deck',    color: '#0E7C7C', glow: 'rgba(14,124,124,0.3)'   },
  { id: 'relational', label: 'Relational',         color: '#EC4899', glow: 'rgba(236,72,153,0.3)'   },
  { id: 'recovery',   label: 'Recovery',           color: '#0D9488', glow: 'rgba(13,148,136,0.3)'   },
  { id: 'mood',       label: 'Mood & Tracking',   color: '#14B8A6', glow: 'rgba(20,184,166,0.3)'   },
  { id: 'breathing',  label: 'Breathwork',         color: '#38BDF8', glow: 'rgba(56,189,248,0.3)'   },
  { id: 'cognitive',  label: 'Cognitive',          color: '#10B981', glow: 'rgba(16,185,129,0.3)'   },
  { id: 'somatic',    label: 'Body & Somatic',     color: '#06B6D4', glow: 'rgba(6,182,212,0.3)'    },
  { id: 'cbt',        label: 'CBT Tools',          color: '#F97316', glow: 'rgba(249,115,22,0.3)'   },
  { id: 'dbt',        label: 'DBT Skills',         color: '#EF4444', glow: 'rgba(239,68,68,0.3)'    },
  { id: 'depth',      label: 'Depth Psychology',   color: '#8B5CF6', glow: 'rgba(139,92,246,0.3)'   },
  { id: 'habit',      label: 'Habit & Wellness',   color: '#22C55E', glow: 'rgba(34,197,94,0.3)'    },
  { id: 'clinical',   label: 'Clinical Tools',     color: '#3B82F6', glow: 'rgba(59,130,246,0.3)'   },
  { id: 'nutrition',  label: 'Nutrition & Gut',    color: '#84CC16', glow: 'rgba(132,204,22,0.3)'   },
  { id: 'theory',     label: 'Theory & Science',   color: '#6366F1', glow: 'rgba(99,102,241,0.3)'   },
  { id: 'insight',    label: 'Insights & Data',    color: '#0EA5E9', glow: 'rgba(14,165,233,0.3)'   },
];

const TIER_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Free',    color: '#6B7280' },
  2: { label: 'Starter', color: '#10B981' },
  3: { label: 'Core',    color: '#3B82F6' },
  4: { label: 'Pro',     color: '#8B5CF6' },
  5: { label: 'Expert',  color: '#F59E0B' },
  6: { label: 'Elite',   color: '#EF4444' },
  7: { label: 'Master',  color: '#EC4899' },
};

function AppCard({
  tool,
  isUnlocked,
  isInstalled,
  onOpen,
  onInstall,
  onUninstall,
}: {
  tool: (typeof GAME_TOOLS)[number];
  isUnlocked: boolean;
  isInstalled: boolean;
  onOpen: () => void;
  onInstall: () => void;
  onUninstall: () => void;
  key?: React.Key;
}) {
  const gradient = TOOL_GRADIENTS[tool.id] ?? 'linear-gradient(145deg, #94A3B8, #64748B)';
  const toolColor = gradient.match(/#[0-9A-Fa-f]{6}/)?.[0] ?? '#64748B';
  const shortDesc = tool.description.split('.')[0] + '.'; // full first sentence, period restored — never reads as chopped
  const tier = TIER_LABELS[tool.tier] ?? TIER_LABELS[1];

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={onOpen}
      style={{
        width: 162,
        flexShrink: 0,
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

      {/* Tier badge — hidden while everything is free (FREE_ACCESS_ALL);
          "FREE" chips on an all-free library read as noise, not information */}
      {!FREE_ACCESS_ALL && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: `1px solid ${tier.color}45`,
          borderRadius: 8,
          padding: '2px 7px',
          fontSize: 9,
          fontWeight: 800,
          color: tier.color,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          zIndex: 2,
        }}>
          {tier.label}
        </div>
      )}

      {/* Locked overlay */}
      {!isUnlocked && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(1.5px)',
          borderRadius: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 3,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock className="w-5 h-5" style={{ color: '#9CA3AF' }} />
          </div>
        </div>
      )}

      {/* Icon (generated 3D clay set) — falls back to the tool's emoji when no icon exists */}
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
            filter: !isUnlocked ? 'grayscale(0.4)' : 'none',
          }}
        />
      ) : (
        <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 10, position: 'relative', filter: !isUnlocked ? 'grayscale(0.4)' : 'none' }}>
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
        lineHeight: 1.45, flex: 1, position: 'relative', minHeight: 29,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      }}>
        {shortDesc}
      </div>

      {/* Action row: Open (big, colorful, primary tap target) + Get/Added */}
      <div style={{ position: 'relative', marginTop: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* Open button — filled with the tool's own gradient, soft clay shadow */}
        <div
          onClick={e => { e.stopPropagation(); onOpen(); }}
          style={{
            flex: 1,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: isUnlocked ? gradient : 'rgba(180,186,196,0.35)',
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: 16,
            padding: '10px 14px',
            fontSize: 13, fontWeight: 900,
            color: isUnlocked ? '#FFFFFF' : '#9CA3AF',
            letterSpacing: 0.4, cursor: 'pointer',
            boxShadow: isUnlocked
              ? `0 3px 0 ${toolColor}66, 0 8px 16px ${toolColor}45, inset 0 1px 0 rgba(255,255,255,0.45)`
              : 'none',
            textShadow: isUnlocked ? '0 1px 2px rgba(0,0,0,0.18)' : 'none',
          }}
        >
          {isUnlocked ? (
            <><Zap className="w-4 h-4" style={{ color: '#FFFFFF' }} /> OPEN</>
          ) : (
            <><Lock className="w-3.5 h-3.5" /> UNLOCK</>
          )}
        </div>
        {/* Get / Added toggle */}
        {isUnlocked && (
          <div
            onClick={e => { e.stopPropagation(); isInstalled ? onUninstall() : onInstall(); }}
            style={{
              display: 'inline-flex', alignItems: 'center',
              background: isInstalled ? `${toolColor}1F` : 'rgba(255,255,255,0.85)',
              border: isInstalled ? `1px solid ${toolColor}66` : '1px solid rgba(0,0,0,0.08)',
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 11, fontWeight: 800,
              color: isInstalled ? toolColor : '#3C3C43',
              letterSpacing: 0.4, cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: isInstalled ? 'none' : '0 2px 6px rgba(0,0,0,0.08)',
            }}
          >
            {isInstalled ? '✓ On Home' : '＋ Home'}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function LibraryTab({ onNavigate }: Props) {
  const { unlockedTools, hasPaidAccess, installedTools, installTool, uninstallTool } = useGame();
  const [query, setQuery] = useState('');

  const openTool = useCallback(
    (toolId: string) => {
      const raw = localStorage.getItem('lance_opened_tools');
      const list: string[] = raw ? JSON.parse(raw) : [];
      const updated = [toolId, ...list.filter(id => id !== toolId)].slice(0, 20);
      localStorage.setItem('lance_opened_tools', JSON.stringify(updated));
      onNavigate('tool', toolId);
    },
    [onNavigate],
  );

  // Therapist bridge overrides: locks pause a tool outright (crisis tools are
  // immune, filtered inside getLockedTools); unlocks override tier gating.
  const therapistLocked = useMemo(() => getLockedTools(), []);
  const therapistUnlocked = useMemo(() => getUnlockedTools(), []);

  const isToolPaused = useCallback(
    (tool: (typeof GAME_TOOLS)[number]) => therapistLocked.has(tool.id),
    [therapistLocked],
  );

  const isToolUnlocked = useCallback(
    (tool: (typeof GAME_TOOLS)[number]) =>
      !therapistLocked.has(tool.id) && (
        FREE_ACCESS_ALL || tool.tier <= 2 || hasPaidAccess || unlockedTools.includes(tool.id)
        || therapistUnlocked.has('*') || therapistUnlocked.has(tool.id)
      ),
    [hasPaidAccess, unlockedTools, therapistLocked, therapistUnlocked],
  );

  const filteredTools = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return LIBRARY_TOOLS;
    return LIBRARY_TOOLS.filter(
      t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q),
    );
  }, [query]);

  const searchActive = query.length > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-28" style={{ background: '#F2F2F7' }}>

      {/* ── Sticky Header + Search ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(242,242,247,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '14px 16px 12px',
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1C1C1E', letterSpacing: -0.5, margin: '0 0 10px 4px' }}>
          The Field Guide
        </h1>

        {/* Search bar — frosted glass to match the card system */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
          borderRadius: 16, padding: '9px 14px',
        }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#8E8E93' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools..."
            style={{
              flex: 1, border: 'none', background: 'transparent',
              fontSize: 14, color: '#1C1C1E', outline: 'none',
            }}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X className="w-4 h-4" style={{ color: '#8E8E93' }} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Challenge Jump Banner ── */}
      {!searchActive && (
        <div style={{ padding: '14px 14px 0' }}>
          <motion.button
            whileTap={{ scale: 0.97, y: 2 }}
            onClick={() => onNavigate('challenge')}
            style={{
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: 'url(/region-heroes/insight.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              borderRadius: 18,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '1px solid rgba(127,217,140,0.45)',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(62,207,207,0.25), 0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'left' as const,
              marginBottom: 4,
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(8,14,18,0.85) 0%, rgba(8,14,18,0.55) 55%, rgba(8,14,18,0.25) 100%)',
              pointerEvents: 'none',
            }} />
            <div className="glass-card-shimmer" style={{ opacity: 0.35 }} />
            <div style={{
              position: 'relative',
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)',
              boxShadow: '0 3px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>⚡</div>
            <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: 'white', letterSpacing: -0.2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                Go to Challenges
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginTop: 1, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                Each milestone unlocks a new tool in this guide
              </div>
            </div>
            <div style={{ position: 'relative', fontSize: 18, color: '#7FD98C' }}>→</div>
          </motion.button>
        </div>
      )}

      {/* ── Search Results or Category Grid ── */}
      <div style={{ padding: '16px 14px 8px' }}>
        {searchActive ? (
          /* Flat search results */
          <>
            <p style={{ fontSize: 12, color: '#8E8E93', fontWeight: 700, marginBottom: 14, paddingLeft: 2 }}>
              {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''} for "{query}"
            </p>
            {filteredTools.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: 14 }}>
                No tools match "{query}"
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
                {filteredTools.map(tool => (
                  <AppCard
                    key={tool.id}
                    tool={tool}
                    isUnlocked={isToolUnlocked(tool)}
                    isInstalled={installedTools.includes(tool.id)}
                    onOpen={() => openTool(tool.id)}
                    onInstall={() => installTool(tool.id)}
                    onUninstall={() => uninstallTool(tool.id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Category sections */
          CATEGORY_SECTIONS.map(cat => {
            const catTools = LIBRARY_TOOLS.filter(t => t.category === cat.id);
            if (catTools.length === 0) return null;

            return (
              <div key={cat.id} style={{ marginBottom: 32 }}>
                {/* Region banner header — generated hero art per category */}
                <div style={{
                  position: 'relative', height: 64, borderRadius: 16, overflow: 'hidden',
                  marginBottom: 12, border: `1px solid ${cat.color}40`,
                  backgroundImage: `url(/region-heroes/${cat.id}.webp)`,
                  backgroundSize: 'cover', backgroundPosition: 'center 40%',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(90deg, rgba(10,14,20,0.88) 0%, rgba(10,14,20,0.45) 55%, rgba(10,14,20,0.15) 100%)`,
                  }} />
                  <div style={{
                    position: 'relative', height: '100%', display: 'flex',
                    alignItems: 'center', gap: 8, padding: '0 14px',
                  }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: cat.color,
                      boxShadow: `0 0 8px ${cat.glow}`,
                    }} />
                    <span style={{
                      fontSize: 12.5, fontWeight: 800, color: '#FFFFFF',
                      textTransform: 'uppercase', letterSpacing: 0.8,
                      textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    }}>
                      {cat.label}
                    </span>
                    <span style={{
                      marginLeft: 'auto', fontSize: 11, fontWeight: 700,
                      color: 'rgba(255,255,255,0.85)',
                      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
                      borderRadius: 10, padding: '2px 8px',
                      border: `1px solid ${cat.color}55`,
                    }}>{catTools.length}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
                  {catTools.map(tool => (
                    <AppCard
                      key={tool.id}
                      tool={tool}
                      isUnlocked={isToolUnlocked(tool)}
                      isInstalled={installedTools.includes(tool.id)}
                      onOpen={() => openTool(tool.id)}
                      onInstall={() => installTool(tool.id)}
                      onUninstall={() => uninstallTool(tool.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
