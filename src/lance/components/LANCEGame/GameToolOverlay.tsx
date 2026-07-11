import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useGame } from './LANCEGameContext';
import { GAME_CHALLENGES, GAME_TOOLS } from './lanceGameData';
import GenericChallengeOverlay from './GenericChallengeOverlay';
import CinematicGate from './CinematicGate';
import StoryArtPanel from './ui/StoryArtPanel';
import { getStingSlot } from './lanceVideos';
import { reportChallengeCycle } from './challengeProgressBus';
import BigBackButton from './BigBackButton';
import { ToolScaffold } from './ui/GlassKit';
import { toolAccentColor, toolGradient } from './toolGradients';
import type { ActivityReminder } from '../../types';

// ── LANCE game-only tools ──
const MoodLogTool          = React.lazy(() => import('./tools/MoodLogTool'));
const DailyCheckIn         = React.lazy(() => import('./tools/DailyCheckIn'));
const BreathworkPro        = React.lazy(() => import('./tools/BreathworkPro'));
const GoalJournal          = React.lazy(() => import('./tools/GoalJournal'));
const GroundingTool        = React.lazy(() => import('./tools/GroundingTool'));
const GratitudeLog         = React.lazy(() => import('./tools/GratitudeLog'));
const SleepLog             = React.lazy(() => import('./tools/SleepLog'));
const ActivityTracker      = React.lazy(() => import('./tools/ActivityTracker'));
const WorryParkingLot      = React.lazy(() => import('./tools/WorryParkingLot'));
const FearLadder           = React.lazy(() => import('./tools/FearLadder'));
const InnerChild           = React.lazy(() => import('./tools/InnerChild'));
const BodyScan             = React.lazy(() => import('./tools/BodyScan'));
const BehavioralActivation = React.lazy(() => import('./tools/BehavioralActivation'));
const FutureSelfLetter = React.lazy(() => import('./tools/FutureSelfLetter'));
const IntegrationStatement = React.lazy(() => import('./tools/IntegrationStatement'));
const PositiveDataLog      = React.lazy(() => import('./tools/PositiveDataLog'));
const DEARMANScript        = React.lazy(() => import('./tools/DEARMANScript'));
const DreamDecoder         = React.lazy(() => import('./tools/DreamDecoder'));
const GriefSpace           = React.lazy(() => import('./tools/GriefSpace'));
const ResilienceMap        = React.lazy(() => import('./tools/ResilienceMap'));
const LifeVision           = React.lazy(() => import('./tools/LifeVision'));
const SafePlaceSanctuary   = React.lazy(() => import('./tools/SafePlaceSanctuary'));
const SocialBattery        = React.lazy(() => import('./tools/SocialBattery'));
const SelfTalkMirror       = React.lazy(() => import('./tools/SelfTalkMirror'));
const RASVisionBoard       = React.lazy(() => import('./tools/RASVisionBoard'));
const OutpostDefusion      = React.lazy(() => import('./tools/OutpostDefusion'));
const StrengthsInventory   = React.lazy(() => import('./tools/StrengthsInventory'));
const ClientCareHub        = React.lazy(() => import('./tools/ClientCareHub'));
const CopingCardCreator    = React.lazy(() => import('./tools/CopingCardCreator'));
const AutonomicThermostat  = React.lazy(() => import('./tools/AutonomicThermostat'));
const DailyInspiration     = React.lazy(() => import('./tools/DailyInspiration'));
const QuestsCenter         = React.lazy(() => import('./tools/QuestsCenter'));
const RewardsStore         = React.lazy(() => import('./tools/RewardsStore'));
const EightDimensionsWheel = React.lazy(() => import('./tools/EightDimensionsWheel'));
const SupportFinder        = React.lazy(() => import('./tools/SupportFinder'));
const FocusTimer           = React.lazy(() => import('./tools/FocusTimer'));

const ScreenImmersiveVisualizer = React.lazy(() => import('../../components/ScreenImmersiveVisualizer'));

// ── REHABIT RECOVERY DECK (fenced addition — interiors live outside src/lance) ──
const UrgeSurfer  = React.lazy(() => import('../../../recovery-tools/UrgeSurfer'));
const PlayTheTape = React.lazy(() => import('../../../recovery-tools/PlayTheTape'));
const HALTCheck   = React.lazy(() => import('../../../recovery-tools/HALTCheck'));
const ImpulseDelay = React.lazy(() => import('../../../recovery-tools/ImpulseDelay'));
const ProsConsLedger = React.lazy(() => import('../../../recovery-tools/ProsConsLedger'));
const OppositeAction = React.lazy(() => import('../../../recovery-tools/OppositeAction'));
const DbtDiaryCard = React.lazy(() => import('../../../recovery-tools/DbtDiaryCard'));
const DopamineMenu = React.lazy(() => import('../../../recovery-tools/DopamineMenu'));
const BoundaryHoop = React.lazy(() => import('../../../recovery-tools/BoundaryHoop'));
const ClinicalScreens = React.lazy(() => import('../../../recovery-tools/ClinicalScreens'));


// ── DRIFTWOOD FAMILY DECK (fenced addition — interiors live outside src/lance) ──
const UndertowChart   = React.lazy(() => import('../../../components/EftCycleMapper'));
const MooringLines    = React.lazy(() => import('../../../components/AttachmentMapper'));
const Soundings       = React.lazy(() => import('../../../components/GottmanQuiz'));
const FamilyMap       = React.lazy(() => import('../../../components/GenogramEditor'));
const TideTable       = React.lazy(() => import('../../../components/RitualDesigner'));
const BottlePost      = React.lazy(() => import('../../../components/GratitudeJar'));
const MendingBench    = React.lazy(() => import('../../../components/RepairToolkit'));
const Barometer       = React.lazy(() => import('../../../components/FamilyStressMeter'));
const PassageChart    = React.lazy(() => import('../../../components/RelationshipRoadmap'));
const FamilyManifest  = React.lazy(() => import('../../../components/GoalsDashboard'));
const DailyRigging    = React.lazy(() => import('../../../components/HabitsRitualsSection'));
const ShipsCalendar   = React.lazy(() => import('../../../components/CalendarSection'));
const SeaChest        = React.lazy(() => import('../../../components/ResourceVault'));
const AskTheJumble    = React.lazy(() => import('../../../components/CoachChat'));

// The active castaway, castaway-system-lite until Phase 4's Seven land.
const driftwoodUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('driftwood_active_castaway_v1') || 'null');
    if (u?.name) return u;
  } catch { /* not claimed yet */ }
  return { id: 'castaway-1', name: 'You', roleText: 'Castaway', avatar: '🏝️', device: 'this device', color: 'bg-primary border-primary-dark text-white' };
};
// Small real wins logged as driftwood milestones (the manifest reads these).
const driftwoodMilestone = (title: string, emoji: string) => {
  try {
    const log = JSON.parse(localStorage.getItem('driftwood_milestones_v1') || '[]');
    log.push({ title, emoji, at: new Date().toISOString() });
    localStorage.setItem('driftwood_milestones_v1', JSON.stringify(log.slice(-200)));
  } catch { /* ignore */ }
};

// ── Original full app components ──
const CbtReframerGym          = React.lazy(() => import('../../components/CbtReframerGym'));
const PlutchikWheel           = React.lazy(() => import('../../components/PlutchikWheel'));
const DbtSkillsSpace          = React.lazy(() => import('../../components/DbtSkillsSpace'));
const ActFlexibilityMatrix    = React.lazy(() => import('../../components/ActFlexibilityMatrix'));
const JungianReflection       = React.lazy(() => import('../../components/JungianReflection'));
const IfsPartsWorkSpace       = React.lazy(() => import('../../components/IfsPartsWorkSpace'));
const CftCompassionSpace      = React.lazy(() => import('../../components/CftCompassionSpace'));
const EmdrSimulator           = React.lazy(() => import('../../components/EmdrSimulator'));
const SoundscapeAudioMixer    = React.lazy(() => import('../../components/SoundscapeAudioMixer'));
const OrigRecoverySpace       = React.lazy(() => import('../../components/RecoverySpace'));
const CouplesTherapySpace     = React.lazy(() => import('../../components/CouplesTherapySpace'));
const ArtTherapySpace         = React.lazy(() => import('../../components/ArtTherapySpace'));
const BehavioralPsychologyLab = React.lazy(() => import('../../components/BehavioralPsychologyLab'));
const EriksonDevelopmentMap   = React.lazy(() => import('../../components/EriksonDevelopmentMap'));
const CharacterStudio         = React.lazy(() => import('../../components/CharacterStudio'));
const CircadianSleepSunset    = React.lazy(() => import('../../components/CircadianSleepSunset'));
// ── New expanded library components ──
const SomaticBodyMap            = React.lazy(() => import('../../components/SomaticBodyMap'));
const SomaticAcousticTuner      = React.lazy(() => import('../../components/SomaticAcousticTuner'));
const SomaticBreathPacer        = React.lazy(() => import('../../components/SomaticBreathPacer'));
const PolyvagalHarmonizer       = React.lazy(() => import('../../components/PolyvagalHarmonizer'));
const VagalVoiceAnalyzer        = React.lazy(() => import('../../components/VagalVoiceAnalyzer'));
const CbtThoughtRecord          = React.lazy(() => import('../../components/CbtThoughtRecord'));
const CbtDbtExploration         = React.lazy(() => import('../../components/CbtDbtExploration'));
const ScreenSmartGoals          = React.lazy(() => import('../../components/ScreenSmartGoals'));
const LearningLibrary           = React.lazy(() => import('../../components/LearningLibrary'));
const PositivePsychologyPermGym = React.lazy(() => import('../../components/positivePsychologyPermGym'));
const MaslowAscentMap           = React.lazy(() => import('../../components/MaslowAscentMap'));
const SandTray                  = React.lazy(() => import('../../components/SandTray'));
const GestaltChairIntegration   = React.lazy(() => import('../../components/GestaltChairIntegration'));
const RogerianCongruenceMirror  = React.lazy(() => import('../../components/RogerianCongruenceMirror'));
const TransactionalAnalysisBoard = React.lazy(() => import('../../components/TransactionalAnalysisBoard'));
const SchemaModeReconstructor   = React.lazy(() => import('../../components/SchemaModeReconstructor'));
const AdlerianLifestyleLab      = React.lazy(() => import('../../components/AdlerianLifestyleLab'));
const ActiveImaginationCards    = React.lazy(() => import('../../components/ActiveImaginationCards'));
const ExistentialMeaningSpace   = React.lazy(() => import('../../components/ExistentialMeaningSpace'));
const HabitLab                  = React.lazy(() => import('../../components/HabitLab'));
const HabitNeuroStacker         = React.lazy(() => import('../../components/HabitNeuroStacker'));
const BiophilicHabitGarden      = React.lazy(() => import('../../components/BiophilicHabitGarden'));
const MorningActivation         = React.lazy(() => import('../../components/MorningActivation'));
const BanduraAgencyBuilder      = React.lazy(() => import('../../components/BanduraAgencyBuilder'));
const YourDayAtAGlance          = React.lazy(() => import('../../components/YourDayAtAGlance'));
const CopingToolkit             = React.lazy(() => import('../../components/CopingToolkit'));
const AutonomicRegulationWidget = React.lazy(() => import('../../components/AutonomicRegulationWidget'));
const PhysicalWellness          = React.lazy(() => import('../../components/PhysicalWellness'));
const BiopsychosocialAssessment = React.lazy(() => import('../../components/BiopsychosocialAssessment'));
const BiopsychosocialDashboard  = React.lazy(() => import('../../components/BiopsychosocialDashboard'));
const NutritionMoodSpace        = React.lazy(() => import('../../components/NutritionMoodSpace'));
const ErGuideSpace              = React.lazy(() => import('../../components/ErGuideSpace'));
const BiometricMoodMap          = React.lazy(() => import('../../components/BiometricMoodMap'));
const CranialNerveGym              = React.lazy(() => import('./CranialNerveGym'));
const PrefrontalDetox              = React.lazy(() => import('./PrefrontalDetox'));
const ScreamReleaseRoom            = React.lazy(() => import('./ScreamReleaseRoom'));
const TremorPacingLab              = React.lazy(() => import('./TremorPacingLab'));
const ProgressiveMuscleRelaxation  = React.lazy(() => import('./tools/ProgressiveMuscleRelaxation'));
const AngerThermometer             = React.lazy(() => import('./tools/AngerThermometer'));
const WindowOfTolerance            = React.lazy(() => import('./tools/WindowOfTolerance'));
const CrisisSafetyPlan             = React.lazy(() => import('./tools/CrisisSafetyPlan'));
const CommunicationLab             = React.lazy(() => import('./tools/CommunicationLab'));

export function ToolLoader() {
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: '#e5e7eb', borderTopColor: '#58CC02' }} />
    </div>
  );
}

const NOOP = () => {};

// ── Wrappers for components that need props from game context or local state ──

function MorningActivationWrapper({ onBack }: { onBack: () => void }) {
  const { userName, intern } = useGame();
  return (
    <MorningActivation
      userName={userName || 'You'}
      assistantName={intern.name || 'LANCE'}
      internName={intern.name}
      lanceModeEnabled={true}
      isOpen={true}
      onClose={onBack}
      onSave={() => {}}
    />
  );
}

// The icon grid's legacy (tab, subtab) destinations, from when this component lived in
// a tab-based shell, mapped onto the closest real toolId in the current game library —
// so tapping an icon actually opens something instead of silently doing nothing.
const DAY_GLANCE_DESTINATIONS: Record<string, string> = {
  'checkin.mood': 'mood_checkin',
  'checkin.voice': 'vagal_voice_analyzer',
  'checkin.gratitude': 'gratitude_log',
  'checkin.chat': 'mood_checkin',
  'checkin.explore': 'emotion_wheel',
  'practice.breathing': 'breathwork_478',
  'practice.assessment': 'biopsychosocial',
  'practice.couples': 'couples_alignment',
  'practice.cbt': 'cbt_reframe',
  'practice.canvas': 'art_therapy',
  'practice.experience': 'holographic_breath',
  'analyze.tech': 'biometric_mood_map',
  'analyze.ble': 'biometric_mood_map',
  'activity.goals': 'goal_journal',
  'activity.reminders': 'habit_lab',
  'learning.cbt-news': 'cbt_dbt_explore',
  'learning.library': 'learning_library',
  'learning.podcasts': 'sound_bath',
  'learning.faq': 'learning_library',
};

function YourDayAtAGlanceWrapper({ onBack, onOpenTool }: { onBack: () => void; onOpenTool?: (toolId: string) => void }) {
  const { userName, moodLogs } = useGame();
  return (
    <LanceToolShellInner toolId="day_at_a_glance" onBack={onBack}>
      <YourDayAtAGlance
        userName={userName || 'You'}
        moodLogs={moodLogs as any[]}
        onNavigateToTab={(tab, subtab) => {
          const dest = DAY_GLANCE_DESTINATIONS[`${tab}.${subtab ?? ''}`];
          if (dest && onOpenTool) onOpenTool(dest);
        }}
      />
    </LanceToolShellInner>
  );
}

// CopingToolkit's card ids are legacy app names from before the game refactor —
// translated to the real toolId so "launch this tool" actually opens it.
const COPING_TOOLKIT_DESTINATIONS: Record<string, string> = {
  breathing: 'breathwork_478',
  dbt: 'tipp_skills',
  anxiety_detox: 'prefrontal_detox',
  worry_parking: 'worry_parking',
  cbt: 'cbt_reframe',
  self_talk: 'self_talk_mirror',
  somatic: 'somatic_body_map',
  art: 'art_therapy',
  scream_room: 'scream_release_room',
  somatic_tremor: 'tremor_pacing_lab',
  compassion_room: 'compassion_space',
  gratitude: 'gratitude_log',
  grief_space: 'grief_space',
  circadian_sunset: 'sleep_log',
  sound_bath: 'sound_bath',
  dream_decoded: 'dream_decoder',
  social_battery: 'social_battery',
  focus: 'focus_timer',
  coping_card: 'coping_card_creator',
};

function CopingToolkitWrapper({ onBack, onOpenTool }: { onBack: () => void; onOpenTool?: (toolId: string) => void }) {
  return (
    <LanceToolShellInner toolId="coping_toolkit" onBack={onBack}>
      <CopingToolkit
        onLaunch={(appId) => {
          const dest = COPING_TOOLKIT_DESTINATIONS[appId];
          if (dest && onOpenTool) onOpenTool(dest);
        }}
      />
    </LanceToolShellInner>
  );
}

const SMART_GOAL_REMINDERS_KEY = 'lance_smart_goal_reminders_v1';

function SmartGoalsWrapper({ onBack }: { onBack: () => void }) {
  const { userName } = useGame();
  const [activityReminders, setActivityReminders] = useState<ActivityReminder[]>(() => {
    try { return JSON.parse(localStorage.getItem(SMART_GOAL_REMINDERS_KEY) || '[]'); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem(SMART_GOAL_REMINDERS_KEY, JSON.stringify(activityReminders));
  }, [activityReminders]);

  return (
    <LanceToolShell toolId="smart_goals" onBack={onBack} tier={2} title="SMART Goals">
      <ScreenSmartGoals
        userName={userName || 'You'}
        onTriggerInteractionAlert={NOOP}
        activityReminders={activityReminders}
        setActivityReminders={setActivityReminders}
      />
    </LanceToolShell>
  );
}

const NUTRITION_STORAGE_KEY = 'lance_nutrition_v1';

function loadNutritionLogs(): any[] {
  try {
    const raw = localStorage.getItem(NUTRITION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function NutritionMoodWrapper({ onBack }: { onBack: () => void }) {
  // Previously held only in local component state, so every meal log a client entered
  // was lost the moment they navigated away — never actually persisted anywhere.
  const [logs, setLogs] = React.useState<any[]>(loadNutritionLogs);

  React.useEffect(() => {
    localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  return (
    <LanceToolShellInner toolId="nutrition_mood" onBack={onBack}>
      <NutritionMoodSpace
        mealLogs={logs}
        onAddMealLog={(log: any) => setLogs(prev => [log, ...prev])}
        onRemoveMealLog={(id: string) => setLogs(prev => prev.filter((l: any) => l.id !== id))}
      />
    </LanceToolShellInner>
  );
}

function BiometricMoodMapWrapper({ onBack }: { onBack: () => void }) {
  const { userName, moodLogs } = useGame();
  return (
    <LanceToolShellInner toolId="biometric_mood_map" onBack={onBack}>
      <BiometricMoodMap userName={userName || 'You'} moodLogs={moodLogs as any[]} activityLogs={[]} />
    </LanceToolShellInner>
  );
}

// Both shells render through the shared Glass Interior scaffold (ui/GlassKit):
// region backdrop per category + frosted glass header with the tool's clay icon.
// Hosted "Space" components sit on a near-solid surface inside the scaffold so
// their own light UIs stay legible over the backdrop.
function HostedSurface({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full" style={{ background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      {children}
    </div>
  );
}

function LanceToolShellInner({ toolId, title, onBack, children }: { toolId?: string; title?: string; onBack: () => void; children: React.ReactNode }) {
  const id = toolId ?? '';
  return (
    <ToolScaffold
      toolId={id}
      title={title ?? GAME_TOOLS.find(t => t.id === id)?.name ?? ''}
      onBack={onBack}
      accentColor={toolAccentColor(id)}
      accentGradient={toolGradient(id)}
    >
      <HostedSurface>{children}</HostedSurface>
    </ToolScaffold>
  );
}

export function LanceToolShell({
  toolId, onBack, tier, title, xpMinutes = 2, children,
}: {
  toolId?: string; onBack: () => void; tier: number; title: string; xpMinutes?: number; children: React.ReactNode;
}) {
  const { addXp } = useGame();
  const awarded = useRef(false);
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!awarded.current) {
        addXp(30);
        awarded.current = true;
        setBanner(true);
        setTimeout(() => setBanner(false), 3000);
      }
    }, xpMinutes * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  const id = toolId ?? '';
  return (
    <ToolScaffold
      toolId={id}
      title={title}
      subtitle={`Tier ${tier} tool`}
      onBack={onBack}
      accentColor={toolAccentColor(id)}
      accentGradient={toolGradient(id)}
      headerRight={banner ? (
        <span className="text-xs font-black animate-pulse" style={{ color: '#58CC02' }}>+30 XP</span>
      ) : undefined}
    >
      <HostedSurface>{children}</HostedSurface>
    </ToolScaffold>
  );
}

function withChallengeOverlay(
  tool: React.ReactNode,
  tasks: string[] | undefined,
  onComplete: (() => void) | undefined,
  toolId: string,
): React.ReactNode {
  if (!tasks?.length || !onComplete) return tool;
  return (
    <div className="relative h-full" style={{ isolation: 'isolate' }}>
      {tool}
      <GenericChallengeOverlay tasks={tasks} onComplete={onComplete} toolId={toolId} />
    </div>
  );
}

function HolographicIntroWrapper({ onBack, userName }: { onBack: () => void; userName: string }) {
  const [started, setStarted] = useState(false);

  if (started) {
    return <ScreenImmersiveVisualizer isOpen={true} onClose={onBack} userName={userName} />;
  }

  const FEATURES = [
    { icon: '🎨', label: 'Multi-theme visualizer',       sub: 'Hyper-saturation · Sunset-hologram · Cyber-cosmic' },
    { icon: '🎧', label: 'Solfeggio sound frequencies',  sub: '432Hz · 528Hz · 963Hz binaural entrainment' },
    { icon: '🫁', label: 'Guided breathing phases',      sub: 'Inhale · Hold · Exhale with somatic tracking' },
    { icon: '⚡', label: 'Somatic node activation',      sub: 'Body-map coherence metrics + neural state readout' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: '#030914' }}>
      <div className="px-4 py-4 flex items-center gap-3">
        <BigBackButton onBack={onBack} />
        <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#E879F9' }}>
          Tier 4 · Somatic · Holographic
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 text-center gap-6 py-6">
        <div style={{ fontSize: 64 }}>🔮</div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Holographic Breathwork 2026</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(200,180,255,0.65)' }}>
            A full-sensory immersive breathing experience. Solfeggio frequencies, neural entrainment, and multi-sensory somatic activation — all in one session.
          </p>
        </div>
        <div className="w-full space-y-2 text-left">
          {FEATURES.map(f => (
            <div
              key={f.label}
              className="flex items-start gap-3 p-3 rounded-2xl"
              style={{ background: 'rgba(232,121,249,0.06)', border: '1px solid rgba(232,121,249,0.12)' }}
            >
              <span className="text-xl shrink-0">{f.icon}</span>
              <div>
                <div className="text-xs font-black text-white">{f.label}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(200,180,255,0.45)' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 pt-4">
        <button
          onClick={() => setStarted(true)}
          className="w-full py-4 rounded-2xl font-black text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#E879F9,#22D3EE)', boxShadow: '0 4px 20px rgba(232,121,249,0.35)' }}
        >
          Begin Session →
        </button>
      </div>
    </div>
  );
}

// Hosts the controlled Plutchik wheel with its own selection state + save-to-log.
// PlutchikWheel REQUIRES selectedWords/onToggleWord — rendering it bare crashes (blank screen).
// Game rule: the challenge checklist asks for "at least 3" emotions, so saving is
// gated on that minimum — picking 1-2 and saving must NOT be able to complete the challenge.
const PLUTCHIK_MIN_SELECTIONS = 3;

function PlutchikEmotionHosted() {
  const { addXp } = useGame();
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const toggle = (w: string) =>
    setSelected(s => (s.includes(w) ? s.filter(x => x !== w) : s.length >= 5 ? s : [...s, w]));

  const canSave = selected.length >= PLUTCHIK_MIN_SELECTIONS;

  const handleSave = () => {
    if (!canSave) return;
    try {
      const prev = JSON.parse(localStorage.getItem('lance_emotion_log_v1') || '[]');
      prev.unshift({ date: new Date().toISOString(), emotions: selected });
      localStorage.setItem('lance_emotion_log_v1', JSON.stringify(prev));
    } catch { /* ignore */ }
    if (!saved) addXp(30);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const remaining = PLUTCHIK_MIN_SELECTIONS - selected.length;

  return (
    <div>
      <PlutchikWheel selectedWords={selected} onToggleWord={toggle} maxSelections={5} />
      <div className="sticky bottom-0 px-4 py-3 bg-white/95 backdrop-blur border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full py-3 rounded-2xl font-black text-sm disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#FB7185,#DB2777)', color: '#fff' }}
        >
          {saved
            ? '✓ Saved to your log  ·  +30 XP'
            : canSave
              ? `Save ${selected.length} emotion${selected.length > 1 ? 's' : ''} to log`
              : selected.length
                ? `Tap ${remaining} more emotion${remaining > 1 ? 's' : ''} (need at least ${PLUTCHIK_MIN_SELECTIONS})`
                : `Tap at least ${PLUTCHIK_MIN_SELECTIONS} emotions on the wheel to begin`}
        </button>
      </div>
    </div>
  );
}

export function GameToolOverlay({ toolId, onBack, onChallengeComplete, onOpenTool }: { toolId: string; onBack: () => void; onChallengeComplete?: () => void; onOpenTool?: (toolId: string) => void }) {
  const { currentChallengeId, userName } = useGame();

  const challengeTasks = React.useMemo(() => {
    if (!onChallengeComplete || !currentChallengeId) return undefined;
    const ch = GAME_CHALLENGES.find(c => c.id === currentChallengeId);
    return ch?.challengeToolTasks;
  }, [onChallengeComplete, currentChallengeId]);

  // mood_log handles its own built-in overlay
  if (toolId === 'mood_log')
    return <MoodLogTool onBack={onBack} onChallengeComplete={onChallengeComplete} />;

  if (toolId === 'breathwork_478')
    return withChallengeOverlay(<BreathworkPro onBack={onBack} initialProfileIdx={2} channel="breathwork_478" />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'box_breathing')
    return withChallengeOverlay(<BreathworkPro onBack={onBack} initialProfileIdx={0} channel="box_breathing" />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'cbt_reframe')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="Quick Thought Reframe"><CbtReframerGym onTriggerInteractionAlert={NOOP} /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'emotion_wheel')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Emotion Wheel"><PlutchikEmotionHosted /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'wise_mind' || toolId === 'tipp_skills')
    // Both library entries open the same DBT space (it's genuinely one connected set of
    // skills), but each should land on ITS OWN content instead of both dropping onto a
    // generic default — "Wise Mind" opens on the actual Wise Mind exercise now, not
    // buried as a footnote inside the TIPP crisis flow.
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title={toolId === 'wise_mind' ? 'Wise Mind (DBT)' : 'TIPP Crisis Skills'}>
        <DbtSkillsSpace onTriggerInteractionAlert={NOOP} focusTab={toolId === 'wise_mind' ? 'wisemind' : 'temperature'} />
      </LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'values_act')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Values Clarification"><ActFlexibilityMatrix /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'shadow_journal')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Shadow Journal">
        <div className="px-4 pt-4">
          <StoryArtPanel src="/story-art/mirror_vines_selftalk.webp" aspect="16/7" rounded={18}
            eyebrow="The Vine Mirror" caption="The vines don't dissolve when you fight them. They dissolve when you say: oh — you're mine." />
        </div>
        <JungianReflection moodLogs={[]} activityLogs={[]} userName="You" onNavigateToTab={NOOP} onOpenTherapeuticChat={NOOP} />
      </LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'ifs_parts')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={6} title="IFS Parts Work"><IfsPartsWorkSpace /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'compassion_space')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={6} title="Compassion Space"><CftCompassionSpace /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'emdr_pacer')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={7} title="EMDR Eye Pacer">
        <div className="px-4 pt-4">
          <StoryArtPanel src="/story-art/emdr_chord_rings.webp" aspect="16/6" rounded={18}
            eyebrow="The Converted Array" caption="Once a weapon. Retuned to walk a hard memory home, gently." />
        </div>
        <EmdrSimulator />
      </LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'binaural_lab')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={7} title="Binaural Focus Lab"><SoundscapeAudioMixer variant="binaural" /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'recovery_space')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={7} title="Recovery Space" xpMinutes={3}><OrigRecoverySpace onTriggerInteractionAlert={NOOP} /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'couples_alignment')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={7} title="Couples Alignment" xpMinutes={3}><CouplesTherapySpace /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'art_therapy')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={7} title="Art Therapy Studio"><ArtTherapySpace /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'mood_checkin')          return <DailyCheckIn onBack={onBack} />;
  if (toolId === 'goal_journal')          return <GoalJournal onBack={onBack} />;

  if (toolId === 'grounding_54321')
    return withChallengeOverlay(
      <GroundingTool onBack={onBack} onStepComplete={() => reportChallengeCycle('grounding_54321')} />,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;
  if (toolId === 'gratitude_log')
    return withChallengeOverlay(<GratitudeLog onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'sleep_log')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Sleep & Circadian Lab"><CircadianSleepSunset /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;
  // ── DRIFTWOOD FAMILY DECK ──
  if (toolId === 'undertow_chart')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Undertow Chart"><UndertowChart /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'mooring_lines')
    return withChallengeOverlay(<MooringLines onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'soundings')
    return withChallengeOverlay(<Soundings onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'family_map')
    return withChallengeOverlay(<FamilyMap onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'family_manifest')
    return withChallengeOverlay(<FamilyManifest onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'bottle_post')
    return withChallengeOverlay(<BottlePost currentUser={driftwoodUser()} onAddMilestone={driftwoodMilestone} onClose={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'tide_table')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Tide Table"><TideTable /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'mending_bench')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Mending Bench"><MendingBench /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'barometer')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Barometer"><Barometer /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'passage_chart')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Passage Chart"><PassageChart /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'daily_rigging')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Daily Rigging"><DailyRigging currentUser={driftwoodUser()} onAddMilestone={driftwoodMilestone} /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'ships_calendar')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Ship's Calendar"><ShipsCalendar currentUser={driftwoodUser()} /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'sea_chest')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="The Sea Chest"><SeaChest /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'ask_the_jumble')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={1} title="Ask the Jumble"><AskTheJumble /></LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  // ── REHABIT RECOVERY DECK ──
  if (toolId === 'urge_surfer')
    return withChallengeOverlay(<UrgeSurfer onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'play_the_tape')
    return withChallengeOverlay(<PlayTheTape onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'halt_check')
    return withChallengeOverlay(<HALTCheck onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'impulse_delay')
    return withChallengeOverlay(<ImpulseDelay onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'pros_cons_ledger')
    return withChallengeOverlay(<ProsConsLedger onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'opposite_action')
    return withChallengeOverlay(<OppositeAction onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'dbt_diary_card')
    return withChallengeOverlay(<DbtDiaryCard onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'dopamine_menu')
    return withChallengeOverlay(<DopamineMenu onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'boundary_hoop')
    return withChallengeOverlay(<BoundaryHoop onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'clinical_screens')
    return withChallengeOverlay(<ClinicalScreens onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'activity_tracker')
    return withChallengeOverlay(<ActivityTracker onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'worry_parking')
    return withChallengeOverlay(<WorryParkingLot onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'fear_ladder')
    return withChallengeOverlay(<FearLadder onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'inner_child')
    return withChallengeOverlay(<InnerChild onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'body_scan')
    return withChallengeOverlay(
      <BodyScan onBack={onBack} onZoneComplete={() => reportChallengeCycle('body_scan')} />,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;
  if (toolId === 'behavioral_activation')
    return withChallengeOverlay(<BehavioralActivation onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'future_letter')
    return withChallengeOverlay(<FutureSelfLetter onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'integration_statement')
    return withChallengeOverlay(<IntegrationStatement onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'positive_data')
    return withChallengeOverlay(<PositiveDataLog onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'assertiveness')
    return withChallengeOverlay(<DEARMANScript onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'dream_decoder')
    return withChallengeOverlay(<DreamDecoder onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'grief_space')
    return withChallengeOverlay(<GriefSpace onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'resilience_map')
    return withChallengeOverlay(<ResilienceMap onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;
  if (toolId === 'life_vision')
    return withChallengeOverlay(<LifeVision onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'holographic_breath')
    return <HolographicIntroWrapper onBack={onBack} userName={userName || ''} />;

  if (toolId === 'cranial_nerve_gym')
    return withChallengeOverlay(
      <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Cranial Nerve Gym">
        <CranialNerveGym onExerciseComplete={() => reportChallengeCycle('cranial_nerve_gym')} />
      </LanceToolShell>,
      challengeTasks, onChallengeComplete, toolId,
    ) as React.ReactElement;

  if (toolId === 'prefrontal_detox')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Prefrontal Detox Lab"><PrefrontalDetox /></LanceToolShell>;

  if (toolId === 'scream_release_room')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Scream Release Room"><ScreamReleaseRoom /></LanceToolShell>;

  if (toolId === 'tremor_pacing_lab')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Tremor Pacing Lab"><TremorPacingLab /></LanceToolShell>;

  if (toolId === 'progressive_muscle_relaxation')
    return withChallengeOverlay(<ProgressiveMuscleRelaxation onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'anger_thermometer')
    return withChallengeOverlay(<AngerThermometer onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'window_of_tolerance')
    return withChallengeOverlay(<WindowOfTolerance onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'crisis_safety_plan')
    return withChallengeOverlay(<CrisisSafetyPlan onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  if (toolId === 'communication_lab')
    return withChallengeOverlay(<CommunicationLab onBack={onBack} />, challengeTasks, onChallengeComplete, toolId) as React.ReactElement;

  // ── Somatic expansion ──────────────────────────────────────────────────────
  if (toolId === 'somatic_body_map')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Somatic Body Map"><SomaticBodyMap onTriggerInteractionAlert={NOOP} /></LanceToolShell>;
  if (toolId === 'somatic_acoustic_tuner')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Somatic Acoustic Tuner"><SomaticAcousticTuner /></LanceToolShell>;
  if (toolId === 'somatic_breath_pacer')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Somatic Breath Pacer"><SomaticBreathPacer /></LanceToolShell>;
  if (toolId === 'polyvagal_harmonizer')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Polyvagal Harmonizer"><PolyvagalHarmonizer /></LanceToolShell>;
  if (toolId === 'vagal_voice_analyzer')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Vagal Voice Analyzer"><VagalVoiceAnalyzer /></LanceToolShell>;

  // ── CBT expansion ──────────────────────────────────────────────────────────
  if (toolId === 'cbt_thought_record_full')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="CBT Thought Record"><CbtThoughtRecord onTriggerInteractionAlert={NOOP} /></LanceToolShell>;
  if (toolId === 'cbt_dbt_explore')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={2} title="CBT/DBT Explorer"><CbtDbtExploration onTriggerInteractionAlert={NOOP} /></LanceToolShell>;

  // ── Cognitive expansion ────────────────────────────────────────────────────
  if (toolId === 'perm_gym')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="PERM Gym"><PositivePsychologyPermGym /></LanceToolShell>;
  if (toolId === 'maslow_map')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Maslow Ascent Map"><MaslowAscentMap /></LanceToolShell>;

  // ── Depth expansion ────────────────────────────────────────────────────────
  if (toolId === 'sand_tray')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Sand Tray Therapy"><SandTray /></LanceToolShell>;
  if (toolId === 'gestalt_chair')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={6} title="Gestalt Empty Chair"><GestaltChairIntegration /></LanceToolShell>;
  if (toolId === 'rogerian_mirror')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Rogerian Mirror"><RogerianCongruenceMirror /></LanceToolShell>;
  if (toolId === 'transactional_analysis')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Transactional Analysis"><TransactionalAnalysisBoard /></LanceToolShell>;
  if (toolId === 'schema_mode')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={6} title="Schema Reconstructor"><SchemaModeReconstructor /></LanceToolShell>;
  if (toolId === 'adlerian_lab')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Adlerian Lifestyle Lab"><AdlerianLifestyleLab /></LanceToolShell>;
  if (toolId === 'active_imagination')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={6} title="Active Imagination"><ActiveImaginationCards /></LanceToolShell>;
  if (toolId === 'existential_meaning')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Existential Meaning Space"><ExistentialMeaningSpace /></LanceToolShell>;
  if (toolId === 'anchor_visualization')
    return <SafePlaceSanctuary onBack={onBack} />;
  if (toolId === 'social_battery')
    return <SocialBattery onBack={onBack} />;
  if (toolId === 'self_talk_mirror')
    return <SelfTalkMirror onBack={onBack} />;
  if (toolId === 'ras_vision_board')
    return <RASVisionBoard onBack={onBack} />;
  if (toolId === 'outpost_defusion')
    return <OutpostDefusion onBack={onBack} />;
  if (toolId === 'strengths_inventory')
    return <StrengthsInventory onBack={onBack} />;
  if (toolId === 'client_care_hub')
    return <ClientCareHub onBack={onBack} />;
  if (toolId === 'coping_card_creator')
    return <CopingCardCreator onBack={onBack} />;
  if (toolId === 'autonomic_thermostat')
    return <AutonomicThermostat onBack={onBack} />;
  if (toolId === 'daily_inspiration')
    return <DailyInspiration onBack={onBack} onOpenTool={onOpenTool} />;
  if (toolId === 'quests_center')
    return <QuestsCenter onBack={onBack} onOpenTool={onOpenTool} />;
  if (toolId === 'rewards_store')
    return <RewardsStore onBack={onBack} />;
  if (toolId === 'eight_dimensions_wheel')
    return <EightDimensionsWheel onBack={onBack} onOpenTool={onOpenTool} />;
  if (toolId === 'support_finder')
    return <SupportFinder onBack={onBack} />;
  if (toolId === 'focus_timer')
    return <FocusTimer onBack={onBack} />;

  // ── Habit & wellness ───────────────────────────────────────────────────────
  if (toolId === 'habit_lab')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Habit Builder Lab"><HabitLab onTriggerInteractionAlert={NOOP} /></LanceToolShell>;
  if (toolId === 'habit_neuro_stacker')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Habit Neuro Stacker"><HabitNeuroStacker /></LanceToolShell>;
  if (toolId === 'biophilic_garden')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Biophilic Garden"><BiophilicHabitGarden /></LanceToolShell>;
  if (toolId === 'morning_activation')
    return <MorningActivationWrapper onBack={onBack} />;
  if (toolId === 'bandura_agency')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Bandura Agency Builder"><BanduraAgencyBuilder /></LanceToolShell>;
  if (toolId === 'day_at_a_glance')
    return <YourDayAtAGlanceWrapper onBack={onBack} onOpenTool={onOpenTool} />;
  if (toolId === 'coping_toolkit')
    return <CopingToolkitWrapper onBack={onBack} onOpenTool={onOpenTool} />;
  if (toolId === 'smart_goals')
    return <SmartGoalsWrapper onBack={onBack} />;
  if (toolId === 'autonomic_regulation')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Autonomic Regulation"><AutonomicRegulationWidget /></LanceToolShell>;
  if (toolId === 'physical_wellness')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={2} title="Physical Wellness"><PhysicalWellness /></LanceToolShell>;

  // ── Clinical tools ─────────────────────────────────────────────────────────
  if (toolId === 'biopsychosocial')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Clinical Intake"><BiopsychosocialAssessment /></LanceToolShell>;
  if (toolId === 'biopsychosocial_dashboard')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Clinical Dashboard"><BiopsychosocialDashboard /></LanceToolShell>;

  // ── Nutrition ──────────────────────────────────────────────────────────────
  if (toolId === 'nutrition_mood')
    return <NutritionMoodWrapper onBack={onBack} />;

  // ── Theory & science ───────────────────────────────────────────────────────
  if (toolId === 'theory_library')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Trauma Systems Therapy"><ErGuideSpace /></LanceToolShell>;
  if (toolId === 'learning_library')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={2} title="Learning Library"><LearningLibrary onOpenTool={onOpenTool} /></LanceToolShell>;
  if (toolId === 'erikson_map')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Erikson Development Map"><EriksonDevelopmentMap /></LanceToolShell>;
  if (toolId === 'behavioral_lab')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={4} title="Behavioral Psychology Lab"><BehavioralPsychologyLab /></LanceToolShell>;
  if (toolId === 'character_studio')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={5} title="Inner Parts Studio"><CharacterStudio /></LanceToolShell>;

  // ── Insight & analytics ────────────────────────────────────────────────────
  if (toolId === 'biometric_mood_map')
    return <BiometricMoodMapWrapper onBack={onBack} />;
  if (toolId === 'sound_bath')
    return <LanceToolShell toolId={toolId} onBack={onBack} tier={3} title="Sound Bath Studio"><SoundscapeAudioMixer variant="soundbath" /></LanceToolShell>;

  return <DailyCheckIn onBack={onBack} />;
}

export default function GameToolOverlayWithSuspense({ toolId, onBack, onChallengeComplete, onOpenTool }: { toolId: string; onBack: () => void; onChallengeComplete?: () => void; onOpenTool?: (toolId: string) => void }) {
  const category = GAME_TOOLS.find(t => t.id === toolId)?.category;
  return (
    <CinematicGate slot={getStingSlot(toolId, category)}>
      <Suspense fallback={<ToolLoader />}>
        <GameToolOverlay toolId={toolId} onBack={onBack} onChallengeComplete={onChallengeComplete} onOpenTool={onOpenTool} />
      </Suspense>
    </CinematicGate>
  );
}
