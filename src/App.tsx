import React, { useState } from 'react';
import { Heart, Moon, Sun, Settings, Home, PlusCircle, Anchor, BarChart2, Zap, Palmtree } from 'lucide-react';
import BoardingStory from './components/BoardingStory';
import SettingsScreen from './components/SettingsScreen';
import MyAppsGrid from './components/MyAppsGrid';
import { MotionConfig } from 'motion/react';
import { LANCEGameProvider, useGame } from './lance/components/LANCEGame/LANCEGameContext';
import ChallengesTab from './components/ChallengesTab';
import GameToolOverlay from './lance/components/LANCEGame/GameToolOverlay';
import LibraryTab from './lance/components/LANCEGame/LibraryTab';
import CheckInTab from './lance/components/LANCEGame/CheckInTab';
import LANCEInsights from './lance/components/LANCEGame/LANCEInsights';
import TheShore from './components/TheShore';
import GatheringBar from './components/GatheringBar';
import PerspectiveSwap from './components/PerspectiveSwap';
import { TOOL_COMPLETION, readSaveSignature } from './lance/components/LANCEGame/challengeCompletion';
import { appendEvent } from './lib/world';
import { activeCastaway } from './lib/castaways';
import { parseInvite, acceptInvite, clearInviteFromURL } from './lib/invite';
import GamesMenu from './components/games/GamesMenu';
import DriftwoodCity from './components/DriftwoodCity';

// ═════════════════════════════════════════════════════════════════════════════
//  THE DRIFTWOOD SHELL — the LANCE bones, whole (the house framework):
//  provider at the root · four tabs (DRIFTWOOD · Check-in · Library · Insights,
//  the bible's spec) · one global tool overlay on the driftwood:open-tool
//  treaty · the crisis strip pinned at the TOP of every screen, above
//  everything, forever. The scaffold's phone-bezel demo frame is gone —
//  the app is the app.
// ═════════════════════════════════════════════════════════════════════════════

type Tab = 'driftwood' | 'checkin' | 'challenges' | 'library' | 'insights';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LANCEGameProvider>
        <DriftwoodShell />
      </LANCEGameProvider>
    </MotionConfig>
  );
}

function DriftwoodShell() {
  const [boarded, setBoarded] = useState<boolean>(() => {
    try { return localStorage.getItem('driftwood_boarded_v1') === '1'; } catch { return false; }
  });
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    // the boarding's choice: story mode lands on the shore (the milestone log
    // lives there); check-in mode goes straight to the daily check-in
    try { return localStorage.getItem('driftwood_mode') === 'checkin' ? 'checkin' : 'driftwood'; } catch { return 'driftwood'; }
  });
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGames, setShowGames] = useState(false); // campfire games overlay (the games are challenge instruments)
  const [showCity, setShowCity] = useState(false); // Driftwood City — the wooden supersystem, an overlay from anywhere
  const [isCalmMode, setIsCalmMode] = useState(false);
  const { xp } = useGame(); // the flagship's gold chip — one economy across the fleet

  // The tool treaty — anything can open any instrument over any tab; closing
  // lands you exactly where you stood.
  React.useEffect(() => {
    const openTool = (e: Event) => {
      const toolId = (e as CustomEvent).detail?.toolId;
      if (toolId) setActiveTool(toolId);
    };
    window.addEventListener('driftwood:open-tool', openTool as EventListener);
    return () => window.removeEventListener('driftwood:open-tool', openTool as EventListener);
  }, []);

  // THE INVITE lands here: "meet me at the waterfall" was a texted link, and the
  // husband just tapped it. Join the wife's camp, hand the island the place, and
  // put him on the shore. Runs once, before anything else claims the tab.
  React.useEffect(() => {
    const inv = parseInvite();
    if (!inv) return;
    (async () => {
      await acceptInvite(inv);          // join the camp + stash the beacon target
      clearInviteFromURL();             // a refresh shouldn't re-fire; the URL isn't a live code
      try { localStorage.setItem('driftwood_mode', 'story'); } catch { /* fine */ }
      setActiveTab('challenges');       // the island itself — where the beacon waits
    })();
  }, []);

  // Real work lights lanterns: snapshot the tool's save keys on open; if the
  // signature moved by close, the shore hears about it (the event law).
  const toolBaseline = React.useRef<{ toolId: string; sig: string } | null>(null);
  React.useEffect(() => {
    if (!activeTool) return;
    const signal = (TOOL_COMPLETION as Record<string, { kind: string; keys?: string[] }>)[activeTool];
    toolBaseline.current = signal?.kind === 'save' && signal.keys
      ? { toolId: activeTool, sig: readSaveSignature(signal.keys) }
      : null;
  }, [activeTool]);
  const closeTool = () => {
    const base = toolBaseline.current;
    if (base) {
      const signal = (TOOL_COMPLETION as Record<string, { kind: string; keys?: string[] }>)[base.toolId];
      if (signal?.keys && readSaveSignature(signal.keys) !== base.sig) {
        appendEvent(activeCastaway().id, 'tool_work', { toolId: base.toolId });
      }
      toolBaseline.current = null;
    }
    setActiveTool(null);
  };

  const openTool = (toolId: string) =>
    window.dispatchEvent(new CustomEvent('driftwood:open-tool', { detail: { toolId } }));

  // Tools point people at their safety plan (Settings → Safety & Crisis,
  // the 2026-07-12 law) via this event — the only crisis pathway.
  React.useEffect(() => {
    const openSafety = () => { setActiveTool(null); setShowSettings(true); };
    window.addEventListener('app:open-safety-settings', openSafety);
    return () => window.removeEventListener('app:open-safety-settings', openSafety);
  }, []);

  // anything in the app can walk you to the fire (banners) or to the Island
  // tab (the shore's hero door, the Gathering bar's "Walk together" — island
  // law, 2026-07-12: this IS how every challenge and game opens now).
  // Registered BEFORE the boarding early-return — hooks must run in the same
  // order on every render.
  React.useEffect(() => {
    const toFire = () => setShowGames(true);
    const toChallenges = () => setActiveTab('challenges');
    const toCity = () => setShowCity(true);
    window.addEventListener('driftwood:open-campfire', toFire);
    window.addEventListener('driftwood:open-challenges', toChallenges);
    window.addEventListener('driftwood:walk-island', toChallenges);
    window.addEventListener('driftwood:open-city', toCity);
    return () => {
      window.removeEventListener('driftwood:open-campfire', toFire);
      window.removeEventListener('driftwood:open-challenges', toChallenges);
      window.removeEventListener('driftwood:walk-island', toChallenges);
      window.removeEventListener('driftwood:open-city', toCity);
    };
  }, []);

  // THE BOARDING — full-screen until complete. Safety/crisis onboarding lives
  // in Settings → Safety & Crisis (therapist-configured, 2026-07-12 law).
  if (!boarded) {
    return (
      <div className={`min-h-screen font-sans text-on-background flex flex-col ${isCalmMode ? 'theme-calm bg-surface-container' : 'bg-slate-50'}`}>
        <div className="flex-1 overflow-y-auto">
          <BoardingStory onStart={() => {
            try { localStorage.setItem('driftwood_boarded_v1', '1'); } catch { /* ignore */ }
            // honor the choice made a moment ago (state initialized pre-boarding)
            try { setActiveTab(localStorage.getItem('driftwood_mode') === 'checkin' ? 'checkin' : 'driftwood'); } catch { /* shore */ }
            setBoarded(true);
          }} />
        </div>
      </div>
    );
  }

  // The flagship's five rooms, Driftwood's own way (LANCE nav-slot parity,
  // island-only law 2026-07-12: "this app is different — it starts on the
  // island"). Home · Library · Check-in keep the flagship's exact jobs; the
  // fourth slot IS the 3D island now — no list, no bypass, every challenge
  // and every game opens by walking to it there. Insights stays the read-only
  // data room, off-island, same as the fleet.
  const NAV: { id: Tab; icon: typeof Home; label: string }[] = [
    { id: 'driftwood',  icon: Home,       label: 'Home' },
    { id: 'library',    icon: Anchor,     label: 'Library' },
    { id: 'checkin',    icon: PlusCircle, label: 'Check-in' },
    { id: 'challenges', icon: Palmtree,   label: 'Island' },
    { id: 'insights',   icon: BarChart2,  label: 'Insights' },
  ];


  return (
    <div className={`h-screen font-sans text-on-background flex flex-col overflow-hidden transition-colors duration-300 ${isCalmMode ? 'theme-calm bg-surface-container' : 'bg-slate-50'}`}>
      {/* Crisis/safety information lives ONLY in Settings → Safety & Crisis
          (therapist-configured per state — the 2026-07-12 law). */}

      {/* Header — honest brand, no borrowed badges */}
      <header className="w-full bg-white border-b border-outline-variant/30 py-2.5 px-4 shrink-0 z-30">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-primary tracking-tight">Driftwood</span>
              <p className="text-[9px] text-on-surface-variant font-medium -mt-0.5">loves together · works together · survives together</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* The flagship's gold chip — XP earned on the crossing */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
              style={{ background: '#FFFAE8', border: '1.5px solid #FFE566' }}
              title="XP — earned by real milestone work"
            >
              <Zap className="w-3 h-3" style={{ color: '#FFD700' }} />
              <span className="text-[11px] font-black" style={{ color: '#CCA000' }}>{xp.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setIsCalmMode(!isCalmMode)}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container cursor-pointer"
              title={isCalmMode ? 'Evening light' : 'Day light'}
              aria-label="Toggle day or evening light"
            >
              {isCalmMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container cursor-pointer"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* The adaptive body: ≥lg the nav is a left RAIL and the content column
          widens; <lg the nav is the bottom tab bar. FLAGSHIP LAW (Lance,
          2026-07-12): NO max-width on the shell — LANCE fills the screen edge
          to edge, so Driftwood does too. The earlier max-w-5xl cap was the
          "stuck on mobile" culprit on wide monitors. */}
      <div className="flex-1 min-h-0 flex flex-row w-full">
      {/* Desktop nav rail (hidden on phones) */}
      <nav className="hidden lg:flex flex-col gap-1 py-4 pr-3 pl-1 w-44 shrink-0">
        {NAV.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'driftwood' && activeTab === 'driftwood') {
                  window.dispatchEvent(new CustomEvent('driftwood:go-home'));
                }
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl cursor-pointer transition-colors text-left ${active ? 'bg-white text-primary shadow-sm border border-outline-variant/40' : 'text-on-surface-variant hover:bg-white/60'}`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[12px] font-bold">{tab.label}</span>
            </button>
          );
        })}
        <div className="flex-1" />
        <p className="text-[8px] text-on-surface-variant/70 px-3 pb-2 italic">A family that loves together. A family that works together. A family that survives together.</p>
      </nav>

      {/* Main viewport */}
      <main className="flex-1 min-h-0 relative w-full min-w-0">
        <div className="absolute inset-0 overflow-y-auto px-3 pb-4" style={{ display: activeTab === 'driftwood' ? 'block' : 'none' }}>
          <DriftwoodHome onOpenTool={openTool} />
        </div>
        {activeTab === 'checkin' && (
          <div className="absolute inset-0 overflow-y-auto">
            <CheckInTab onOpenTool={openTool} />
          </div>
        )}
        {activeTab === 'challenges' && (
          // Full-bleed, no scroll wrapper — this IS the island, not a list
          // about it (island-only law, 2026-07-12).
          <ChallengesTab
            onOpenTool={openTool}
            onOpenGames={() => setShowGames(true)}
            onLeaveIsland={() => setActiveTab('driftwood')}
          />
        )}
        {activeTab === 'library' && (
          <div className="absolute inset-0 overflow-y-auto">
            <LibraryTab onNavigate={(screen: string, toolId?: string) => {
              if (screen === 'tool' && toolId) openTool(toolId);
              else if (screen === 'challenge') setActiveTab('challenges');
            }} />
          </div>
        )}
        {activeTab === 'insights' && (
          <div className="absolute inset-0 overflow-y-auto">
            <LANCEInsights onBack={() => setActiveTab('driftwood')} />
          </div>
        )}

        {/* THE GLOBAL TOOL OVERLAY — over any tab; the strip stays above it. */}
        {activeTool && (
          <div className="absolute inset-0 z-40 bg-slate-50">
            <GameToolOverlay
              toolId={activeTool}
              onBack={closeTool}
              onOpenTool={(next: string) => setActiveTool(next)}
            />
          </div>
        )}

        {/* Campfire games — an overlay from anywhere (the instruments' room) */}
        {showGames && (
          <div className="absolute inset-0 z-40 bg-slate-50">
            <GamesMenu embedded onClose={() => setShowGames(false)} />
          </div>
        )}

        {/* Driftwood City — the wooden supersystem, an overlay from anywhere.
            Places that name a tool open it through the same treaty. */}
        {showCity && (
          <DriftwoodCity
            onClose={() => setShowCity(false)}
            onOpenTool={(toolId) => { setShowCity(false); openTool(toolId); }}
          />
        )}

        {/* Settings — the LANCE-style bottom sheet renders its own backdrop */}
        {showSettings && <SettingsScreen onBack={() => setShowSettings(false)} />}
      </main>
      </div>

      {/* Bottom nav — four rooms (phones; the rail carries desktop) */}
      <nav className="shrink-0 bg-white border-t border-outline-variant/30 z-30 lg:hidden">
        <div className="max-w-2xl mx-auto flex items-stretch justify-around px-2 py-1.5" style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}>
          {NAV.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'driftwood' && activeTab === 'driftwood') {
                    window.dispatchEvent(new CustomEvent('driftwood:go-home'));
                  }
                  setActiveTab(tab.id);
                }}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl cursor-pointer transition-colors ${active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  THE HOME SHORE — island-first law (2026-07-12, "this app is different, it
//  starts on the island"). Home has exactly three jobs now: the hero door
//  onto the island (every challenge and game lives there, walked to), the
//  Gathering (coordinate with family on other devices — light the fire, walk
//  together), and the apps you've saved here from the Library. The old
//  scaffold's separate lesson/practice/debrief/goals/genogram screen-flow —
//  a second, competing "milestone" system that never touched the island or
//  the robots — did not make the crossing; Goals and the Genogram remain one
//  tap away as real Library tools (family_manifest, family_map).
// ─────────────────────────────────────────────────────────────────────────────
function DriftwoodHome({ onOpenTool }: { onOpenTool: (id: string) => void }) {
  return (
    <div className="pt-3">
      <TheShore onOpenTool={onOpenTool} />
      <CityDoor />
      <GatheringBar />
      <MyAppsGrid onOpenTool={onOpenTool} />
      <PerspectiveSwap />
    </div>
  );
}

// The wooden sign on the shore that opens Driftwood City — the robots' little
// city, twenty-seven places to go. One tap raises the city overlay from anywhere.
function CityDoor() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('driftwood:open-city'))}
      className="mt-3 w-full overflow-hidden rounded-2xl p-4 text-left shadow-sm transition-transform active:scale-[.99]"
      style={{
        background: 'linear-gradient(135deg, #b8804a 0%, #9a6a3a 100%)',
        border: '1px solid rgba(122,79,34,.35)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 text-2xl">🪵</span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-black tracking-tight text-white">Visit Driftwood City</p>
          <p className="text-[11.5px] font-medium text-white/85">
            The canyon, the lake, the golf park, the caves — 27 places the robots built, somewhere for everyone.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white">Explore →</span>
      </div>
    </button>
  );
}
