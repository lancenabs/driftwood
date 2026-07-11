import React, { useState } from 'react';
import { Heart, Moon, Sun, Settings, Home, PlusCircle, Anchor, BarChart2 } from 'lucide-react';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import MicroLessonScreen from './components/MicroLessonScreen';
import CharacterSelectScreen from './components/CharacterSelectScreen';
import LiveScenarioPlayScreen from './components/LiveScenarioPlayScreen';
import DebriefScreen from './components/DebriefScreen';
import SettingsScreen from './components/SettingsScreen';
import CrisisStrip from './components/CrisisStrip';
import GoalsDashboard from './components/GoalsDashboard';
import GenogramEditor from './components/GenogramEditor';
import { ScreenType, Character } from './types';
import { LANCEGameProvider } from './lance/components/LANCEGame/LANCEGameContext';
import GameToolOverlay from './lance/components/LANCEGame/GameToolOverlay';
import LibraryTab from './lance/components/LANCEGame/LibraryTab';
import CheckInTab from './lance/components/LANCEGame/CheckInTab';
import LANCEInsights from './lance/components/LANCEGame/LANCEInsights';

// ═════════════════════════════════════════════════════════════════════════════
//  THE DRIFTWOOD SHELL — the LANCE bones, whole (the house framework):
//  provider at the root · four tabs (DRIFTWOOD · Check-in · Library · Insights,
//  the bible's spec) · one global tool overlay on the driftwood:open-tool
//  treaty · the crisis strip pinned at the TOP of every screen, above
//  everything, forever. The scaffold's phone-bezel demo frame is gone —
//  the app is the app.
// ═════════════════════════════════════════════════════════════════════════════

type Tab = 'driftwood' | 'checkin' | 'library' | 'insights';

export default function App() {
  return (
    <LANCEGameProvider>
      <DriftwoodShell />
    </LANCEGameProvider>
  );
}

function DriftwoodShell() {
  const [boarded, setBoarded] = useState<boolean>(() => {
    try { return localStorage.getItem('driftwood_boarded_v1') === '1'; } catch { return false; }
  });
  const [activeTab, setActiveTab] = useState<Tab>('driftwood');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isCalmMode, setIsCalmMode] = useState(false);

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

  const openTool = (toolId: string) =>
    window.dispatchEvent(new CustomEvent('driftwood:open-tool', { detail: { toolId } }));

  // THE BOARDING — full-screen until complete. The private DV page lives
  // inside OnboardingScreen (traceless; only the fact of boarding is stored).
  if (!boarded) {
    return (
      <div className={`min-h-screen font-sans text-on-background flex flex-col ${isCalmMode ? 'theme-calm bg-surface-container' : 'bg-slate-50'}`}>
        <CrisisStrip />
        <div className="flex-1 overflow-y-auto">
          <OnboardingScreen onStart={() => {
            try { localStorage.setItem('driftwood_boarded_v1', '1'); } catch { /* ignore */ }
            setBoarded(true);
          }} />
        </div>
      </div>
    );
  }

  const NAV: { id: Tab; icon: typeof Home; label: string }[] = [
    { id: 'driftwood', icon: Home,       label: 'Driftwood' },
    { id: 'checkin',   icon: PlusCircle, label: 'Check-in' },
    { id: 'library',   icon: Anchor,     label: 'Library' },
    { id: 'insights',  icon: BarChart2,  label: 'Insights' },
  ];

  return (
    <div className={`h-screen font-sans text-on-background flex flex-col overflow-hidden transition-colors duration-300 ${isCalmMode ? 'theme-calm bg-surface-container' : 'bg-slate-50'}`}>
      {/* THE DV BRIGHT LINE — the top of every screen, above everything. */}
      <CrisisStrip />

      {/* Header — honest brand, no borrowed badges */}
      <header className="w-full bg-white border-b border-outline-variant/30 py-2.5 px-4 shrink-0 z-30">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-primary tracking-tight">Driftwood</span>
              <p className="text-[9px] text-on-surface-variant font-medium -mt-0.5">the island that only yields to together</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
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

      {/* Main viewport */}
      <main className="flex-1 min-h-0 relative max-w-2xl w-full mx-auto">
        <div className="absolute inset-0 overflow-y-auto px-3 pb-4" style={{ display: activeTab === 'driftwood' ? 'block' : 'none' }}>
          <FamilyScreens onOpenTool={openTool} />
        </div>
        {activeTab === 'checkin' && (
          <div className="absolute inset-0 overflow-y-auto">
            <CheckInTab onOpenTool={openTool} />
          </div>
        )}
        {activeTab === 'library' && (
          <div className="absolute inset-0 overflow-y-auto">
            <LibraryTab onNavigate={(screen: string, toolId?: string) => {
              if (screen === 'tool' && toolId) openTool(toolId);
              else if (screen === 'challenge') setActiveTab('driftwood');
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
              onBack={() => setActiveTool(null)}
              onOpenTool={(next: string) => setActiveTool(next)}
            />
          </div>
        )}

        {/* Settings sheet */}
        {showSettings && (
          <div className="absolute inset-0 z-40 bg-slate-50 overflow-y-auto">
            <SettingsScreen onBack={() => setShowSettings(false)} />
          </div>
        )}
      </main>

      {/* Bottom nav — four rooms */}
      <nav className="shrink-0 bg-white border-t border-outline-variant/30 z-30">
        <div className="max-w-2xl mx-auto flex items-stretch justify-around px-2 py-1.5" style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}>
          {NAV.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
//  THE FAMILY SCREENS — the scaffold's real flow (home → lesson / scenario →
//  debrief · goals · genogram), transplanted whole into the DRIFTWOOD tab.
//  Phase 2 remaps these into the Family Deck; Phase 3 raises the shore around
//  them. The scaffold's feedback-theater ("compiled and signed for clinician
//  evaluation" — a false claim) did not make the crossing.
// ─────────────────────────────────────────────────────────────────────────────
function FamilyScreens({ onOpenTool }: { onOpenTool: (id: string) => void }) {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [streak, setStreak] = useState(0);
  const [empathyScore, setEmpathyScore] = useState(0);
  const [safetyScore, setSafetyScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<{ session: number; empathy: number; safety: number }[]>(() => {
    try {
      const val = localStorage.getItem('driftwood_session_history_v1');
      if (val) return JSON.parse(val);
    } catch { /* fresh shore */ }
    return [];
  });

  const handleFinishSimulation = (finalEmpathy: number, finalSafety: number, finalXp: number) => {
    setEmpathyScore(finalEmpathy);
    setSafetyScore(finalSafety);
    setXpEarned(finalXp);
    setSessionHistory(prev => {
      const next = [...prev, { session: prev.length + 1, empathy: finalEmpathy, safety: finalSafety }].slice(-10);
      try { localStorage.setItem('driftwood_session_history_v1', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    setActiveScreen('debrief');
  };

  return (
    <div className="pt-3">
      {activeScreen === 'home' && (
        <HomeScreen
          onStartLesson={() => setActiveScreen('lesson')}
          onEnterPractice={() => setActiveScreen('char-select')}
          onViewGoals={() => setActiveScreen('goals')}
          onViewGenogram={() => setActiveScreen('genogram')}
          streak={streak}
        />
      )}
      {activeScreen === 'lesson' && (
        <MicroLessonScreen
          onBack={() => setActiveScreen('home')}
          onComplete={() => { setStreak(s => s + 1); setActiveScreen('home'); }}
        />
      )}
      {activeScreen === 'char-select' && (
        <CharacterSelectScreen
          onBack={() => setActiveScreen('home')}
          onSelectCharacter={(char) => { setSelectedChar(char); setActiveScreen('simulation'); }}
        />
      )}
      {activeScreen === 'simulation' && selectedChar && (
        <LiveScenarioPlayScreen
          character={selectedChar}
          onBack={() => setActiveScreen('char-select')}
          onFinishSimulation={handleFinishSimulation}
          sessionHistory={sessionHistory}
        />
      )}
      {activeScreen === 'debrief' && (
        <DebriefScreen
          empathyScore={empathyScore}
          safetyScore={safetyScore}
          xpEarned={xpEarned}
          sessionHistory={sessionHistory}
          onDone={() => setActiveScreen('home')}
          onRetry={() => setActiveScreen(selectedChar ? 'simulation' : 'char-select')}
        />
      )}
      {activeScreen === 'goals' && <GoalsDashboard onBack={() => setActiveScreen('home')} />}
      {activeScreen === 'genogram' && <GenogramEditor onBack={() => setActiveScreen('home')} />}
    </div>
  );
}
