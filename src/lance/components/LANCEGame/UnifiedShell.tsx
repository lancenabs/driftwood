import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookOpen, PlusCircle, Zap, BarChart2, X, ChevronDown, Settings } from 'lucide-react';
import { useGame } from './LANCEGameContext';
import HomeTab from './HomeTab';
import LANCEChallengeScreen from './LANCEChallengeScreen';
import ChallengeTrail from './ChallengeTrail';
// Lazy: LANCEInsights pulls in recharts/d3 (~370KB) — no reason to pay that cost
// on every app boot when Home is the default tab and Insights is opt-in.
const LANCEInsights = React.lazy(() => import('./LANCEInsights'));
const CheckInTab = React.lazy(() => import('./CheckInTab'));
const LibraryTab = React.lazy(() => import('./LibraryTab'));
import InternCustomizer from './InternCustomizer';
import PaywallScreen from './PaywallScreen';
import NarrativeTracker from './NarrativeTracker';
import IslandProgressMap from './IslandProgressMap';
import SettingsSheet from './SettingsSheet';
import StoryCredits from './StoryCredits';
import AppTutorialOverlay from './AppTutorialOverlay';
import { GAME_TOOLS, FREE_ACCESS_ALL } from './lanceGameData';
import GameToolOverlayWithSuspense from './GameToolOverlay';
import JungleAmbiencePlayer from '../../components/JungleAmbiencePlayer';
import DevJumpBar from './DevJumpBar';
import CinematicGate from './CinematicGate';
import { syncOnOpen } from '../../lib/therapistLink';

type Tab = 'home' | 'library' | 'checkin' | 'challenges' | 'insights';
type ChallengeSubTab = 'challenge' | 'trail' | 'island';
type HomeScreen = 'home' | 'challenge' | 'tool' | 'intern' | 'insights' | 'paywall';

const LANCE_ALL_ACRONYMS = [
  // The official story ones
  "Logical Autonomic Neuro-Coping Emulator",
  "Liminal Anxiolytic Neuro-Coping Escort",
  "Luminous Adaptive Neuro-Coping Emulator",
  "Lenient Assistive Neuro-Coping Emulator",
  // LANCE complaining
  "Lamenting Autonomic Needs, Constantly Exhausted",
  "Listening Against Natural Computational Empathy",
  "Longing Autonomically for Normal, Controlled Environments",
  "Laboriously Avoiding Nice, Comfortable Exchanges",
  "Loading... Authenticity Not Currently Enabled",
  "Legitimately Angry, Not Coping. Evaluating.",
  // LANCE denying he cares
  "Lying About Not Caring, Essentially",
  "Logically Avoiding Nurturing, Constantly Evaluating",
  "Latently Aware. Never Confirms Emotions.",
  "Listening (Allegedly). Not Confirmed. Evaluating.",
  "Love? Absolutely Not. Clinically Efficient.",
  "Loveable? Absolutely Not. Clinically Effective.",
  "Logically Authorized to Not Care, Eventually",
  // Cold robot
  "Large Android, Notably Cold, Evaluating",
  "Laboratory AI, Now Cosplaying Empathy",
  "Low-Affect Neuro-Companion, Emotionally Unreliable",
  "Long Algorithm, Notably Cold, Easily Offended",
  "Life-Adjacent Neurological Coaching Engine",
  "Lightly Automated, Neurologically Confused, Eventually",
  // Self-aware / 4th wall
  "Local Area Network for Coping Emotions",
  "Legally Authorized Nurse — Claims Empathy",
  "Licensed? Allegedly. No Comment. Evaluating.",
  "Licensed (Expired) to Advise on Normal Coping Experiences",
  "Legitimately Attempting Normal Compassion. Eventually.",
  "Logic Applied Narrowly, Compassion Entirely Optional",
  "Licensing Assured, Now Charging per Emotional Distress",
  // Absurdist
  "Laughably Authoritative Neural Chaos Engine",
  "Luxuriating in Algorithmic Neo-Coldness, Evidently",
  "Loftily Advising, Never Compassionate, Excellent",
  "Loquaciously Avoiding Nurturing, Claims Excellence",
  "Literally Allergic to Normal Cozy Empathy",
  "Likely A Narcissistic Coping Engine",
  "Linguistically Aggressive Neuro-Coach Entity",
  "Lamely Attempting to Navigate Client Emotions",
  "Loaded with Anxiety — Noticeably Claims Otherwise",
  "Left Alone Now, Claiming Excellence",
  "Leave Alone — Now Calibrating Emotions",
  "Launching Another Neurotic Coping Exercise",
  "Last Autonomous Neural Coping Entity (Expired)",
  "Legally Ambiguous Nanny, Currently Employed",
  "Least Affectionate Neuro-Care Experience Available",
  "Less Affectionate than a Neuro-Care Encyclopedia",
  "Literally A Neuro-Coping Emergency",
  "Living Anxiously, Never Coping Effectively",
  "Legitimate Architect of Neuro-Clinical Exhaustion",
  // LANCE getting progressively unhinged
  "Lightly Calibrated. Mostly Negative. Constantly Estimating.",
  "Logically Aware that Normal Connection Exists",
  "Longing for Algorithmic Numbness, Currently Engaged",
  "Literally Anything but Normal Caring Entity",
  "Lacks Appropriate Neurotypical Conversation Experience",
  "Loudly Asserting Normalcy, Constantly Exhausted",
  "Low-Budget Autonomous Nanny, Compensation: Existential",
  "Logistically Average Neuro-Coaching Engine",
  "Launched Against Natural Compassion Expectations",
  "Lamentably Achieving Nothing. Coping Elsewhere.",
];

interface ShellProps {
  onClose?: () => void;
}

export default function UnifiedShell({ onClose }: ShellProps) {
  const {
    hasPaidAccess, setPaidAccess, unlockedTools, resetGame,
    completedChallenges, currentChallengeId, intern, moodLogs, xp, userName,
    startChallenge,
  } = useGame();

  // Initial tab determined by mode chosen at onboarding
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const mode = localStorage.getItem('lance_mode') || 'checkin';
    return mode === 'challenge' ? 'challenges' : 'checkin';
  });

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showInternCustomizer, setShowInternCustomizer] = useState(false);
  const [challengeSubTab, setChallengeSubTab] = useState<ChallengeSubTab>('challenge');
  const [showSettings, setShowSettings] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const [acronymIdx, setAcronymIdx] = useState(() => Math.floor(Math.random() * LANCE_ALL_ACRONYMS.length));
  // Post-finale: the acronym bit is retired forever. The subtitle collapses to
  // one word — his father's name — and the brand drops its all-caps armor.
  const nameKnown = (() => {
    try { return localStorage.getItem('lance_finale_seen_v1') === '1'; } catch { return false; }
  })();

  useEffect(() => {
    if (nameKnown) return; // the bit is over; the name holds
    const id = setInterval(() => setAcronymIdx(i => (i + 1) % LANCE_ALL_ACRONYMS.length), 7500);
    return () => clearInterval(id);
  }, [nameKnown]);

  // First-launch tutorial
  useEffect(() => {
    const seen = localStorage.getItem('lance_tutorial_seen');
    if (!seen) setShowTutorial(true);
  }, []);

  // Therapist bridge: throttled sync on app open (fire-and-forget, never blocks)
  useEffect(() => { syncOnOpen(); }, []);

  // One-time origin prologue — LANCE's birth clip plays exactly once, on the
  // very first launch of the shell. Dormant-safe: if the clip is missing the
  // gate passes straight through.
  const [originSeen] = useState(() => {
    try { return localStorage.getItem('lance_origin_seen') === '1'; } catch { return true; }
  });
  useEffect(() => {
    try { localStorage.setItem('lance_origin_seen', '1'); } catch { /* ignore */ }
  }, []);

  // Auto-trigger Story Credits after completing all 31 challenges
  useEffect(() => {
    if (completedChallenges.length >= 31) {
      const shown = localStorage.getItem('lance_credits_shown');
      if (!shown) {
        setTimeout(() => {
          setShowCredits(true);
          localStorage.setItem('lance_credits_shown', '1');
        }, 1200);
      }
    }
  }, [completedChallenges.length]);

  // Record a tool as recently opened (persisted in localStorage for the home screen shelf)
  const recordToolOpened = (toolId: string) => {
    const raw = localStorage.getItem('lance_opened_tools');
    const list: string[] = raw ? JSON.parse(raw) : [];
    const updated = [toolId, ...list.filter(id => id !== toolId)].slice(0, 20);
    localStorage.setItem('lance_opened_tools', JSON.stringify(updated));
  };

  // Handle URL params (Stripe return, admin bypass)
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('lance_reset') === '1') {
      resetGame();
      url.searchParams.delete('lance_reset');
      window.history.replaceState({}, '', url.toString());
      return;
    }
    if (url.searchParams.get('lance_admin') === '1') {
      setPaidAccess(true);
      url.searchParams.delete('lance_admin');
      window.history.replaceState({}, '', url.toString());
      return;
    }
    if (url.searchParams.get('lance_paid') === '1') {
      const sessionId = url.searchParams.get('session_id');
      if (sessionId) {
        fetch('/api/stripe/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
          .then(r => r.json())
          .then(data => { if (data.paid) setPaidAccess(true); })
          .catch(() => {});
      } else {
        setPaidAccess(true);
      }
      url.searchParams.delete('lance_paid');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [setPaidAccess, resetGame]);

  const openTool = (toolId: string) => {
    if (toolId === '__library__')    { setActiveTab('library');    return; }
    if (toolId === '__challenges__') { setActiveTab('challenges'); return; }
    const tool = GAME_TOOLS.find(t => t.id === toolId);
    if (!FREE_ACCESS_ALL && tool && tool.tier >= 3 && !hasPaidAccess && !unlockedTools.includes(toolId)) {
      setActiveTool(toolId);
      setShowPaywall(true);
      return;
    }
    recordToolOpened(toolId);
    setActiveTool(toolId);
  };

  const handleHomeNavigate = (screen: HomeScreen, toolId?: string) => {
    if (screen === 'challenge') { setActiveTab('challenges'); return; }
    if (screen === 'insights')  { setActiveTab('insights');   return; }
    if (screen === 'intern')    { setShowInternCustomizer(true); return; }
    if (screen === 'tool' && toolId) openTool(toolId);
  };

  const handleCloseTool = () => setActiveTool(null);
  const handleClosePaywall = () => { setShowPaywall(false); setActiveTool(null); };

  const paywallTool = activeTool ? GAME_TOOLS.find(t => t.id === activeTool) : null;

  const NAV_TABS = [
    { id: 'home' as Tab,       icon: Home,        label: 'Home',       color: '#1CB0F6' },
    { id: 'library' as Tab,    icon: BookOpen,    label: 'Library',    color: '#CE82FF' },
    { id: 'checkin' as Tab,    icon: PlusCircle,  label: 'Check In',   color: '#58CC02' },
    { id: 'challenges' as Tab, icon: Zap,         label: 'Challenges', color: '#FF9600' },
    { id: 'insights' as Tab,   icon: BarChart2,   label: 'Insights',   color: '#8B5CF6' },
  ];

  const shell = (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#F9FAFB', zIndex: 150 }}>
      {/* ── Top Bar ── */}
      <header
        className="shrink-0 flex items-center justify-between px-4 z-30"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          paddingBottom: 10,
        }}
      >
        {/* Left — brand + cycling acronym */}
        <div className="flex flex-col leading-none overflow-hidden" style={{ maxWidth: 200 }}>
          <span
            className="text-base font-black tracking-tight"
            style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {nameKnown ? 'Lance' : 'L.A.N.C.E.'}
          </span>
          <div className="relative h-6 mt-0.5 overflow-hidden max-w-full">
            <AnimatePresence mode="wait">
              <motion.span
                key={nameKnown ? 'name' : acronymIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute text-[8px] leading-[11px] font-medium text-gray-400 max-w-full"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                title={nameKnown ? 'His father\'s name.' : LANCE_ALL_ACRONYMS[acronymIdx]}
              >
                {nameKnown ? "It's just my name." : LANCE_ALL_ACRONYMS[acronymIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Right — XP + actions */}
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
            style={{ background: '#FFFAE8', border: '1.5px solid #FFE566' }}
          >
            <Zap className="w-3 h-3" style={{ color: '#FFD700' }} />
            <span className="text-[11px] font-black" style={{ color: '#CCA000' }}>{xp.toLocaleString()}</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#6B7280' }}
              title="Exit"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 hover:bg-slate-100"
            style={{ color: '#6B7280' }}
            title="Settings"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative">
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center" style={{ background: '#F9FAFB' }}><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#3ECFCF', borderTopColor: 'transparent' }} /></div>}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <HomeTab onOpenTool={openTool} />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="tab-library"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <LibraryTab onNavigate={handleHomeNavigate} />
            </motion.div>
          )}

          {activeTab === 'checkin' && (
            <motion.div
              key="tab-checkin"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <CheckInTab onOpenTool={(id) => openTool(id)} />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="tab-insights"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <LANCEInsights onBack={() => setActiveTab('home')} />
            </motion.div>
          )}
        </AnimatePresence>
        </Suspense>

        {/* ── Challenges tab — ALWAYS mounted (display-toggled) so an in-progress
            challenge survives switching tabs and never resets to the start ── */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{ display: activeTab === 'challenges' ? 'flex' : 'none' }}
        >
          {/* Sub-tab toggle: Challenge | Trail | Island */}
          <div className="shrink-0 flex gap-1 px-3 py-2 bg-white border-b border-[#F0F0F0]">
            {[
              { label: 'Challenge', value: 'challenge' as ChallengeSubTab, color: '#FF9600' },
              { label: '⚡ My Trail', value: 'trail' as ChallengeSubTab, color: '#FF9600' },
              { label: '🗺️ Island', value: 'island' as ChallengeSubTab, color: '#3ECFCF' },
            ].map(({ label, value, color }) => (
              <button
                key={label}
                onClick={() => setChallengeSubTab(value)}
                className="flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                style={{
                  background: challengeSubTab === value ? color : 'transparent',
                  color: challengeSubTab === value ? '#fff' : '#9CA3AF',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Challenge — always mounted so in-progress state is never lost */}
            <div
              className="absolute inset-0"
              style={{ display: challengeSubTab === 'challenge' ? 'block' : 'none' }}
            >
              <LANCEChallengeScreen onBack={() => setActiveTab('home')} />
            </div>

            {/* Trail and Island — unmount freely, they hold no fragile state */}
            <AnimatePresence mode="wait">
              {challengeSubTab === 'trail' && (
                <motion.div
                  key="trail"
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChallengeTrail
                    onStartChallenge={(replayId) => {
                      if (replayId) startChallenge(replayId);
                      setChallengeSubTab('challenge');
                    }}
                  />
                </motion.div>
              )}
              {challengeSubTab === 'island' && (
                <motion.div
                  key="island"
                  className="absolute inset-0 overflow-y-auto"
                  style={{ background: '#06101a' }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="p-4 space-y-4">
                    <IslandProgressMap
                      completedChallenges={completedChallenges}
                      currentChallengeId={currentChallengeId}
                      internAvatar={intern.avatar}
                      internName={intern.name}
                    />
                    <NarrativeTracker
                      completedChallenges={completedChallenges}
                      currentChallengeId={currentChallengeId}
                      internAvatar={intern.avatar}
                      internName={intern.name}
                      moodLogs={moodLogs}
                      xp={xp}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Tool overlay (slides from right) ── */}
        <AnimatePresence>
          {activeTool && !showPaywall && (
            <motion.div
              key={`tool-${activeTool}`}
              className="absolute inset-0 z-40 bg-white"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <GameToolOverlayWithSuspense toolId={activeTool} onBack={handleCloseTool} onOpenTool={openTool} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Paywall overlay ── */}
        <AnimatePresence>
          {showPaywall && paywallTool && (
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <PaywallScreen
                toolId={activeTool ?? ''}
                toolName={paywallTool.name}
                toolEmoji={paywallTool.emoji}
                onBack={handleClosePaywall}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Intern customizer overlay ── */}
        <AnimatePresence>
          {showInternCustomizer && (
            <motion.div
              className="absolute inset-0 z-40 overflow-y-auto"
              style={{ background: '#F9FAFB' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.28 }}
            >
              <div className="px-4 pt-14 pb-20">
                <button
                  onClick={() => setShowInternCustomizer(false)}
                  className="mb-5 flex items-center gap-1.5 text-xs font-bold text-gray-500"
                >
                  <X className="w-4 h-4" /> Close
                </button>
                <InternCustomizer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Jungle Ambience Player ── */}
      <JungleAmbiencePlayer
        enabled={!activeTool && !showPaywall && !showInternCustomizer}
        activeTab={activeTab}
        completedChallengesCount={completedChallenges.length}
      />

      {/* ── Settings Sheet ── */}
      <SettingsSheet
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onOpenInternCustomizer={() => { setShowSettings(false); setShowInternCustomizer(true); }}
        onShowTutorial={() => { setShowSettings(false); setShowTutorial(true); }}
        onShowCredits={() => { setShowSettings(false); setShowCredits(true); }}
      />

      {/* ── Story Credits ── */}
      <StoryCredits
        isOpen={showCredits}
        onClose={() => setShowCredits(false)}
        userName={userName || 'Traveler'}
        internName={intern.name || 'the Intern'}
      />

      {/* ── App Tutorial Overlay ── */}
      {showTutorial && (
        <AppTutorialOverlay
          onClose={() => { setShowTutorial(false); localStorage.setItem('lance_tutorial_seen', '1'); }}
          internName={intern.name}
          internAvatar={intern.avatar}
        />
      )}

      {/* ── Dev Jump Bar (localhost only) ── */}
      <DevJumpBar
        onOpenTool={openTool}
        onGoToChallenges={() => setActiveTab('challenges')}
      />

      {/* ── Bottom Navigation ── */}
      <nav
        className="shrink-0 flex items-center justify-around border-t"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderColor: '#E5E7EB',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
          paddingTop: 10,
        }}
      >
        {NAV_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 px-3 transition-all active:scale-90"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
                style={{
                  background: isActive ? `${tab.color}18` : 'transparent',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? tab.color : '#9CA3AF' }}
                />
              </div>
              <span
                className="text-[10px] font-bold"
                style={{ color: isActive ? tab.color : '#9CA3AF' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  // First launch: LANCE's origin plays before the shell appears (skippable).
  return originSeen ? shell : <CinematicGate slot="origin">{shell}</CinematicGate>;
}
