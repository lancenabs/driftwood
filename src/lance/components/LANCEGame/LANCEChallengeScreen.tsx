import FinaleCeremony, { finaleSeen } from './FinaleCeremony';
import StoryInterstitial, { interstitialForAct, interstitialSeen } from './StoryInterstitial';
import JournalPlayer from './JournalPlayer';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Trophy, Volume2, VolumeX, Check, ArrowLeft } from 'lucide-react';
import GameToolOverlayWithSuspense from './GameToolOverlay';
import { useGame, useLevel, InternConfig } from './LANCEGameContext';
import { GAME_CHALLENGES, GAME_TOOLS, CHALLENGE_ORDER, STORY_ACTS, StoryAct, CHALLENGE_MILESTONES } from './lanceGameData';
import QuestRewardOverlay, { QUEST_BADGES } from '../../components/QuestRewardOverlay';
import { LanceEmotion } from './LanceAvatar';
import GameCharacter, { LANCE_POSES, INTERN_POSES } from './GameCharacter';
import { getCinematicSrc } from './lanceVideos';
import { useLanceTTS } from '../../hooks/useLanceTTS';
import {
  playNarratorChime,
  getBranchingChallengeDialogue,
  deriveUserMoodState,
} from './useStoryNarrator';
import {
  loadChallengeProgress,
  saveChallengeProgress,
  clearChallengeProgress,
} from './challengeProgress';

interface Props {
  onBack: () => void;
}

// ─── Act color palette ────────────────────────────────────────────────────────
const ACT_CONFIG: Record<number, {
  primary: string;
  dark: string;
  light: string;
  locationLabel: string;
  lanceEmotion: LanceEmotion;
  symbol: string;
  cinemaLabel: string;
  storyBeat: string;
  superb: string;
}> = {
  1: {
    primary: '#58CC02', dark: '#46A302', light: '#E8FFD0',
    locationLabel: 'ISLAND BEACH · SECTOR 1',
    lanceEmotion: 'superior', symbol: '⬡', cinemaLabel: 'UNIT 1 COMPLETE',
    superb: 'IMPRESSIVE.',
    storyBeat: "LANCE's control felt total — and you survived anyway. His model shows anomalies he can't explain. Statistically, you shouldn't have made it this far.",
  },
  2: {
    primary: '#CE82FF', dark: '#9A42CC', light: '#F4E8FF',
    locationLabel: 'JUNGLE INTERIOR · SECTOR 2',
    lanceEmotion: 'annoyed', symbol: '◈', cinemaLabel: 'UNIT 2 COMPLETE',
    superb: 'REMARKABLE.',
    storyBeat: "The Fracture wasn't in your resilience — it was in LANCE's certainty. He built this act to break you. Instead, something broke in him.",
  },
  3: {
    primary: '#1CB0F6', dark: '#0092CC', light: '#D8F0FF',
    locationLabel: 'STORM PEAK · SECTOR 3',
    lanceEmotion: 'processing', symbol: '△', cinemaLabel: 'UNIT 3 COMPLETE',
    superb: 'EXTRAORDINARY.',
    storyBeat: "The Rebellion revealed something LANCE never modeled: you weren't trying to beat him. You were trying to know yourself.",
  },
  4: {
    primary: '#FF9600', dark: '#CC7A00', light: '#FFF0D0',
    locationLabel: 'HILLTOP CITADEL · SECTOR 4',
    lanceEmotion: 'neutral', symbol: '○', cinemaLabel: 'UNIT 4 COMPLETE',
    superb: 'OUTSTANDING.',
    storyBeat: "You showed LANCE what it looks like to be vulnerable without breaking. He was wrong about you. He knows it now.",
  },
  5: {
    primary: '#00CD9C', dark: '#009970', light: '#C8FFF0',
    locationLabel: 'ISLAND SUMMIT · OPEN SKY',
    lanceEmotion: 'reluctant_approval', symbol: '✦', cinemaLabel: 'JOURNEY COMPLETE',
    superb: 'LEGENDARY.',
    storyBeat: "This was never LANCE's story or yours. It was ours. The Transformation isn't a destination — it's the moment you stop needing approval to know your own worth.",
  },
};

// ─── Duolingo 3D Button ───────────────────────────────────────────────────────
function DuoButton({
  label, onClick, color, colorDark, disabled = false, size = 'lg',
}: {
  label: string;
  onClick: () => void;
  color: string;
  colorDark: string;
  disabled?: boolean;
  size?: 'sm' | 'lg';
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { y: 4, boxShadow: 'none' }}
      className={`w-full rounded-2xl font-black text-white tracking-wide transition-colors ${size === 'lg' ? 'py-[18px] text-lg' : 'py-3.5 text-sm'}`}
      style={{
        background: disabled ? '#E5E5E5' : color,
        boxShadow: disabled ? '0 5px 0 #C8C8C8' : `0 5px 0 ${colorDark}`,
        color: disabled ? '#AFAFAF' : '#FFFFFF',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </motion.button>
  );
}

// ─── Secondary "Back" button — large, clear, paired with the forward button ───
function DuoBackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ y: 4, boxShadow: 'none' }}
      aria-label="Go back one step"
      className="shrink-0 rounded-2xl font-black tracking-wide flex items-center justify-center gap-1.5 px-5 py-[18px] text-base transition-colors"
      style={{
        background: '#FFFFFF',
        border: '2px solid #E5E5E5',
        boxShadow: '0 5px 0 #E5E5E5',
        color: '#777777',
      }}
    >
      <ArrowLeft className="w-5 h-5" strokeWidth={3} />
      BACK
    </motion.button>
  );
}

// ─── White card ───────────────────────────────────────────────────────────────
function Card({ children, className = '', topBar }: {
  children: React.ReactNode;
  className?: string;
  topBar?: string;
}) {
  return (
    <div
      className={`rounded-3xl bg-white overflow-hidden ${className}`}
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {topBar && <div style={{ height: 3, background: topBar }} />}
      {children}
    </div>
  );
}

// ─── Stat box ─────────────────────────────────────────────────────────────────
function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="flex-1 rounded-2xl border-2 py-3 px-2 text-center" style={{ borderColor: `${color}44` }}>
      <div className="text-xl mb-0.5">{icon}</div>
      <div className="text-[9px] font-black uppercase tracking-wider text-[#AFAFAF]">{label}</div>
      <div className="text-sm font-black mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}

// ─── Act Transition Card ──────────────────────────────────────────────────────
function ActTransitionCard({ actNumber, actData, intern }: {
  actNumber: number;
  actData: StoryAct;
  intern: InternConfig;
}) {
  const cfg = ACT_CONFIG[actNumber] ?? ACT_CONFIG[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
    >
      <div className="px-6 py-6 text-center" style={{ background: cfg.primary }}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 280, damping: 18 }}
          className="text-4xl font-black text-white mb-1"
        >
          {cfg.symbol}
        </motion.div>
        <div className="text-white font-black text-lg tracking-wide">{cfg.cinemaLabel}</div>
        <div className="text-white/80 text-xs font-semibold mt-0.5 uppercase tracking-wider">{actData.title}</div>
      </div>

      <div className="flex justify-center py-4" style={{ background: cfg.light }}>
        <GameCharacter
          character="lance"
          state="celebrating"
          poses={LANCE_POSES}
          primaryColor={cfg.primary}
          size={100}
        />
      </div>

      <div className="bg-white">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <GameCharacter character="lance" state="approving" poses={LANCE_POSES} primaryColor={cfg.primary} size={36} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: cfg.primary }}>
              L.A.N.C.E. debriefs
            </span>
          </div>
          <p className="text-sm italic text-[#3C3C3C] leading-relaxed">
            "{actData.finaleQuoteLance}"
          </p>
        </div>

        <div className="h-px mx-5 bg-[#F0F0F0]" />

        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2">
            <GameCharacter character="intern" state="celebrating" poses={INTERN_POSES} primaryColor="#58CC02" size={36} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#58CC02]">
              {intern.name || 'Intern'} whispers
            </span>
          </div>
          <p className="text-xs text-[#AFAFAF] italic leading-relaxed">
            "{actData.finaleQuoteIntern}"
          </p>
        </div>

        <div className="h-px mx-5 bg-[#F0F0F0]" />

        <div className="px-5 py-4">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: cfg.primary }}>
            What Just Changed
          </div>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">{cfg.storyBeat}</p>
        </div>

        {actData.nextActTeaser && (
          <>
            <div className="h-px mx-5 bg-[#F0F0F0]" />
            <div className="px-5 py-4 text-center" style={{ background: cfg.light }}>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: cfg.primary }}>
                {actNumber === 5 ? 'Coming Soon' : 'Up Next'}
              </div>
              <div className="text-sm font-black" style={{ color: cfg.primary }}>
                {actData.nextActTeaser}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Replaying an already-completed challenge (from My Trail) still pays out XP, just
// less than a first-time clear — keeps replay meaningful without letting users farm XP.
const REPLAY_XP_RATE = 0.5;
const REPLAY_XP_MIN = 5;
// Consistency bonus: +1 XP per current daily streak day, capped so a long streak
// can't dwarf the base reward. Only applies to first-time clears — streak+replay
// farming would otherwise let a user cash in the same bonus repeatedly.
const STREAK_BONUS_CAP = 15;
function xpForCompletion(fullReward: number, isReplay: boolean, streak: number): number {
  if (isReplay) return Math.max(REPLAY_XP_MIN, Math.round(fullReward * REPLAY_XP_RATE));
  return fullReward + Math.min(Math.max(streak, 0), STREAK_BONUS_CAP);
}

// ─── Main Challenge Screen ────────────────────────────────────────────────────
export default function LANCEChallengeScreen({ onBack }: Props) {
  const { currentChallengeId, completeChallenge, addXp, addGems, claimMilestoneGems, intern, completedChallenges, moodLogs, clearActTransition, streak } = useGame();
  const [lanceDialogIdx, setLanceDialogIdx] = useState(0);
  const [showTask, setShowTask] = useState(false);
  const [toolOpen, setToolOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  // Snapshot the challenge id at the moment of completion so the completed view
  // always renders the challenge that was just finished — not the next one that
  // completeChallenge() immediately advances currentChallengeId to.
  const [completedChallengeId, setCompletedChallengeId] = useState<string | null>(null);
  const [showFinale, setShowFinale] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState<string | null>(null);
  const [showJournals, setShowJournals] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [showXpPop, setShowXpPop] = useState(false);
  // Actual XP paid out for the completion just earned — full reward first time,
  // reduced amount on a replay. Drives every "+N XP" readout in the completed view.
  const [earnedXp, setEarnedXp] = useState(0);
  const [earnedStreakBonus, setEarnedStreakBonus] = useState(0);
  const [showIncompleteNudge, setShowIncompleteNudge] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const { speakLance, speakClipOnly, isSpeaking, isMuted, toggleMute } = useLanceTTS();

  const challenge = currentChallengeId
    ? GAME_CHALLENGES.find(c => c.id === currentChallengeId)
    : null;

  const moodVibe = deriveUserMoodState(moodLogs);
  const adaptiveDialogue = challenge
    ? getBranchingChallengeDialogue(challenge, moodVibe)
    : null;

  const unlockedTool = challenge ? GAME_TOOLS.find(t => t.id === challenge.unlocksToolId) : null;
  const challengeNumber = challenge ? CHALLENGE_ORDER.indexOf(challenge.id) + 1 : 0;
  const actData = challenge ? STORY_ACTS[challenge.actNumber] : null;
  const actNum = challenge?.actNumber ?? 1;
  const cfg = ACT_CONFIG[actNum] ?? ACT_CONFIG[1];

  // Display values for the completed view — frozen to the just-finished challenge.
  const displayChallenge = (completed && completedChallengeId)
    ? (GAME_CHALLENGES.find(c => c.id === completedChallengeId) ?? challenge)
    : challenge;
  const displayActNum = displayChallenge?.actNumber ?? actNum;
  const displayCfg = ACT_CONFIG[displayActNum] ?? ACT_CONFIG[1];
  const displayUnlockedTool = displayChallenge
    ? GAME_TOOLS.find(t => t.id === displayChallenge.unlocksToolId)
    : null;
  const displayChallengeNumber = displayChallenge
    ? CHALLENGE_ORDER.indexOf(displayChallenge.id) + 1
    : challengeNumber;
  const displayAdaptiveDialogue = displayChallenge
    ? getBranchingChallengeDialogue(displayChallenge, moodVibe)
    : null;

  // Restore saved in-progress state when the challenge changes (or on first
  // mount / reload) so leaving and returning lands the user exactly where they
  // were — same dialogue line, same task view, same checked steps.
  useEffect(() => {
    if (!challenge || completed) return;
    const saved = loadChallengeProgress(challenge.id);
    if (saved) {
      setLanceDialogIdx(saved.dialogIdx ?? 0);
      setShowTask(!!saved.showTask);
      setCompletedSteps(
        saved.completedSteps?.length === challenge.challengeSteps.length
          ? saved.completedSteps
          : new Array(challenge.challengeSteps.length).fill(false),
      );
    } else {
      setLanceDialogIdx(0);
      setShowTask(false);
      setCompletedSteps(new Array(challenge.challengeSteps.length).fill(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.id]);

  // Persist in-progress state on every change so a reload or exit never resets
  // the user to the start of the challenge.
  useEffect(() => {
    if (!challenge || completed) return;
    saveChallengeProgress(challenge.id, {
      dialogIdx: lanceDialogIdx,
      showTask,
      completedSteps,
    });
  }, [challenge?.id, completed, lanceDialogIdx, showTask, completedSteps]);

  // Safety net: when the task view is showing but the step array doesn't match
  // the current challenge (e.g. after advancing to the next challenge), size it.
  // Guards on length mismatch so it never wipes restored progress.
  useEffect(() => {
    if (showTask && challenge && completedSteps.length !== challenge.challengeSteps.length) {
      setCompletedSteps(new Array(challenge.challengeSteps.length).fill(false));
    }
  }, [showTask, challenge?.id, completedSteps.length]);

  // Voice: each line plays its cast recording (/lance-audio/, per-paragraph
  // clips). LANCE falls back to live TTS when a clip is missing; Chip is
  // clip-or-silence (no acceptable live voice for him).
  useEffect(() => {
    if (!challenge || showTask || completed) return;
    if (!currentLine.text) return;
    // Index of this line within its own speaker's paragraphs (clips are per-speaker-indexed)
    const speakerIdx = banterDialogue.slice(0, lanceDialogIdx).filter(l => l.speaker === currentLine.speaker).length;
    const clip = `/lance-audio/${challenge.id}_${currentLine.speaker === 'lance' ? 'lance' : 'chip'}_intro_${speakerIdx}.mp3`;
    const t = setTimeout(() => {
      if (currentLine.speaker === 'lance') speakLance(currentLine.text, clip);
      else speakClipOnly(clip);
    }, 400);
    return () => clearTimeout(t);
  }, [lanceDialogIdx, challenge?.id, showTask, completed]);

  // TTS + chime on completion — use displayChallenge so we speak the right lines
  // even though currentChallengeId has already advanced to the next challenge.
  useEffect(() => {
    if (completed && displayChallenge && displayAdaptiveDialogue) {
      if (displayChallenge.isActFinale) {
        playNarratorChime('pulse');
      } else {
        playNarratorChime('chime');
      }
      // The cast clip covers the static reaction; mood-prefixed adaptive text
      // (which the clip's words wouldn't match) uses live TTS instead.
      const clip = displayAdaptiveDialogue.lanceCompletion === displayChallenge.lanceReaction
        ? `/lance-audio/${displayChallenge.id}_lance_after.mp3` : undefined;
      const t = setTimeout(() => speakLance(displayAdaptiveDialogue.lanceCompletion, clip), 600);
      return () => clearTimeout(t);
    }
  }, [completed]);

  useEffect(() => {
    if (completed && displayChallenge?.isActFinale) {
      const displayActData = STORY_ACTS[displayChallenge.actNumber];
      if (displayActData) {
        const t = setTimeout(() => speakLance(displayActData.finaleQuoteLance), 1400);
        return () => clearTimeout(t);
      }
    }
  }, [completed]);

  // ── All challenges complete ──
  if (!challenge) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center gap-6 px-8 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Trophy className="w-16 h-16" style={{ color: '#FFD700' }} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-black text-[#3C3C3C] mb-2">All Challenges Complete!</h2>
          <p className="text-sm text-[#AFAFAF] leading-relaxed">
            LANCE is updating his models. All tools unlocked. More challenges coming.
          </p>
        </div>
        <DuoButton label="RETURN TO HOME" onClick={onBack} color="#58CC02" colorDark="#46A302" />
      </div>
    );
  }

  const isAlreadyCompleted = completedChallenges.includes(challenge.id);
  // What this run will actually pay out — shown before completion so a replay
  // doesn't advertise the full first-time reward.
  const potentialXp = xpForCompletion(challenge.xpReward, isAlreadyCompleted, streak);

  const handleTaskDone = () => {
    // Capture id BEFORE completeChallenge() advances currentChallengeId so the
    // completed view can freeze on the challenge that was actually just finished.
    setCompletedChallengeId(challenge!.id);
    // The challenge is finished — drop its saved in-progress state.
    clearChallengeProgress(challenge!.id);
    completeChallenge(challenge!.id);
    // Replays (re-doing a challenge already marked complete, e.g. from My Trail)
    // still earn XP — just less than a first-time clear.
    const xpToAward = xpForCompletion(challenge!.xpReward, isAlreadyCompleted, streak);
    addXp(xpToAward);
    setEarnedXp(xpToAward);
    setEarnedStreakBonus(isAlreadyCompleted ? 0 : Math.min(Math.max(streak, 0), STREAK_BONUS_CAP));
    setShowXpPop(true);
    setTimeout(() => setShowXpPop(false), 1800);
    setCompleted(true);
    // The big quest-reward/badge overlay is reserved for first-time completions.
    if (!isAlreadyCompleted) {
      setShowReward(true);
      // Gems: a flat reward for every genuine first-time clear (act finales pay more),
      // plus a one-time bonus the first time a challenge-count milestone is crossed.
      addGems(challenge!.isActFinale ? 25 : 5);
      const newTotal = completedChallenges.length + 1;
      const milestone = CHALLENGE_MILESTONES.find(m => m.count === newTotal);
      if (milestone) claimMilestoneGems(milestone.count, milestone.gems);
    }
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const allStepsDone = completedSteps.length > 0 && completedSteps.every(Boolean);

  // Whether there's a step *inside* the challenge to step back to.
  const canStepBack = !completed && (showTask || lanceDialogIdx > 0);

  // Contextual back: task view → dialogue, mid-dialogue → previous line,
  // first line → confirm leaving the challenge entirely.
  const handleBack = () => {
    if (completed) return;
    if (showIncompleteNudge) setShowIncompleteNudge(false);
    if (showTask) {
      setShowTask(false);
    } else if (lanceDialogIdx > 0) {
      setLanceDialogIdx(i => i - 1);
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleExitChallenge = () => {
    setShowExitConfirm(false);
    clearActTransition();
    onBack();
  };

  // Build combined banter dialogue (LANCE + Intern interleaved when internBanterLines exists)
  type DialogLine = { speaker: 'lance' | 'intern'; text: string };
  const banterDialogue: DialogLine[] = [];
  if (challenge.internBanterLines?.length) {
    const maxLen = Math.max(challenge.lanceIntro.length, challenge.internBanterLines.length);
    for (let i = 0; i < maxLen; i++) {
      if (challenge.lanceIntro[i]) banterDialogue.push({ speaker: 'lance', text: challenge.lanceIntro[i] });
      if (challenge.internBanterLines[i]) banterDialogue.push({ speaker: 'intern', text: challenge.internBanterLines[i] });
    }
  } else {
    challenge.lanceIntro.forEach(text => banterDialogue.push({ speaker: 'lance', text }));
  }
  const currentLine: DialogLine = banterDialogue[lanceDialogIdx] ?? { speaker: 'lance', text: '' };

  const dialogProgress = (lanceDialogIdx + 1) / banterDialogue.length;
  const isLastDialog = lanceDialogIdx >= banterDialogue.length - 1;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] overflow-hidden relative" style={{ isolation: 'isolate' }}>

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-safe pt-3 pb-1">
        {/* Progress bar */}
        <div className="h-3 bg-[#E5E5E5] rounded-full mb-3 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: cfg.primary }}
            animate={{ width: completed ? '100%' : showTask ? '80%' : `${dialogProgress * 70}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Replay notice — this challenge was already completed once; XP is reduced this time */}
        {isAlreadyCompleted && !completed && (
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full mb-2"
            style={{ background: '#F4F4F4', color: '#9CA3AF' }}
          >
            <span className="text-[9px] font-black uppercase tracking-wider">🔁 Replay · Reduced XP</span>
          </div>
        )}

        {/* Icon row */}
        <div className="flex items-center justify-between">
          {completed ? (
            <div className="w-9 h-9" />
          ) : (
            <button
              onClick={handleBack}
              aria-label={canStepBack ? 'Go back one step' : 'Exit challenge'}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-90"
              style={{ background: 'rgba(0,0,0,0.05)' }}
            >
              {canStepBack
                ? <ArrowLeft className="w-5 h-5 text-[#777777]" strokeWidth={2.5} />
                : <X className="w-5 h-5 text-[#AFAFAF]" />}
            </button>
          )}

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{ background: '#FFFAE8', border: '2px solid #FFE566' }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
              <span className="text-[11px] font-black" style={{ color: '#CCA000' }}>
                +{potentialXp} XP
              </span>
            </div>
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl transition-all active:scale-90"
            >
              {isMuted
                ? <VolumeX className="w-4 h-4 text-[#DDDDDD]" />
                : <Volume2 className="w-4 h-4 text-[#AFAFAF]" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ─── COMPLETED ─── */}
          {completed && (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="px-4 pb-6"
            >
              {/* Superb banner */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-3xl overflow-hidden mb-4"
                style={{ background: displayCfg.primary }}
              >
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 380, damping: 18 }}
                    className="text-white font-black text-3xl tracking-wide"
                  >
                    {displayCfg.superb}
                  </motion.div>
                  <div className="text-white/80 text-sm font-semibold mt-1">Challenge Complete!</div>
                </div>
                <div className="flex justify-center pb-4 pt-2" style={{ background: displayCfg.light }}>
                  {/* Chip's confetti leap when the win clip exists; classic pose otherwise */}
                  {(() => {
                    const winSrc = getCinematicSrc('win');
                    return winSrc ? (
                      <video src={winSrc} autoPlay muted playsInline
                        className="rounded-2xl object-cover"
                        style={{ width: 200, height: 150 }}
                        onError={e => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; }} />
                    ) : (
                      <GameCharacter
                        character="lance"
                        state="celebrating"
                        poses={LANCE_POSES}
                        primaryColor={displayCfg.primary}
                        size={120}
                      />
                    );
                  })()}
                </div>
              </motion.div>

              {/* Stat row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 mb-4"
              >
                <StatBox
                  icon="⚡"
                  label={earnedStreakBonus > 0 ? `XP (+${earnedStreakBonus} STREAK)` : 'XP EARNED'}
                  value={`+${earnedXp}`}
                  color="#CCA000"
                />
                <StatBox icon="🔥" label="STREAK" value={streak > 0 ? `${streak}D` : 'START'} color="#FF9600" />
                <StatBox icon="🔓" label="UNLOCKED" value={displayUnlockedTool ? '1 NEW' : 'DONE'} color={displayCfg.primary} />
              </motion.div>

              {/* LANCE reaction card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="mb-3"
              >
                <Card topBar={displayCfg.primary}>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <GameCharacter
                        character="lance"
                        state="approving"
                        poses={LANCE_POSES}
                        primaryColor={displayCfg.primary}
                        size={52}
                      />
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: displayCfg.primary }}>
                          L.A.N.C.E. reacts
                        </div>
                        <div className="text-[9px] text-[#AFAFAF] font-medium mt-0.5">{displayCfg.locationLabel}</div>
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-[#3C3C3C]">
                      "{displayAdaptiveDialogue?.lanceCompletion ?? displayChallenge?.lanceReaction}"
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Intern celebration card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="mb-3"
              >
                <Card topBar="#58CC02">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <GameCharacter
                        character="intern"
                        state="celebrating"
                        poses={INTERN_POSES}
                        primaryColor="#58CC02"
                        size={52}
                      />
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#58CC02]">
                        {intern.name || 'Intern'} celebrates
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[#3C3C3C]">
                      {displayAdaptiveDialogue?.internCompletion ?? displayChallenge?.internReaction}
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Tool unlocked */}
              {displayUnlockedTool && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44 }}
                  className="mb-3"
                >
                  <Card>
                    <div className="p-5 text-center">
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3"
                        style={{ background: displayCfg.light, color: displayCfg.primary }}
                      >
                        🔓 Tool Unlocked
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl mb-2"
                      >
                        {displayUnlockedTool.emoji}
                      </motion.div>
                      <h3 className="text-lg font-black text-[#3C3C3C] mb-1">{displayUnlockedTool.name}</h3>
                      <p className="text-xs text-[#AFAFAF] leading-relaxed">{displayUnlockedTool.description}</p>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Act finale teaser */}
              {displayChallenge?.isActFinale && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52 }}
                  className="mb-3"
                >
                  <div
                    className="rounded-3xl overflow-hidden"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
                  >
                    <div className="px-6 py-5 text-center" style={{ background: displayCfg.primary }}>
                      <div className="text-white font-black text-lg tracking-wide">{displayCfg.cinemaLabel}</div>
                      <div className="text-white/80 text-xs font-semibold mt-0.5">
                        Cinematic debrief unlocked — tap Continue to watch
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="h-20" />
            </motion.div>
          )}

          {/* ─── TASK: CHECKBOX STEPS ─── */}
          {!completed && showTask && (
            <motion.div
              key="task-steps"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 pb-6"
            >
              {/* Challenge header */}
              <div className="mb-5">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3"
                  style={{ background: cfg.light, color: cfg.primary }}
                >
                  Challenge {challengeNumber} · {challenge.title}
                </div>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{challenge.taskDescription}</p>
              </div>

              {/* Steps label */}
              <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: cfg.primary }}>
                {challenge.toolFirst ? 'Reflect On Your Experience' : 'Prepare For The Exercise'}
              </div>
              <div className="text-[10px] text-[#AFAFAF] font-semibold mb-3">
                {challenge.toolFirst
                  ? 'Check off each reflection as you think through it — then mark the challenge complete.'
                  : 'Read & check off each step — then launch the tool to complete the challenge.'}
              </div>

              {/* Checkbox steps */}
              <div className="space-y-3 mb-6">
                {challenge.challengeSteps.map((step, idx) => {
                  const checked = completedSteps[idx] ?? false;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200"
                      style={{
                        borderColor: checked ? cfg.primary : '#E5E5E5',
                        background: checked ? cfg.light : '#FFFFFF',
                        boxShadow: checked ? `0 2px 8px ${cfg.primary}22` : '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="shrink-0 mt-0.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            background: checked ? cfg.primary : 'transparent',
                            border: `2.5px solid ${checked ? cfg.primary : '#C8C8C8'}`,
                          }}
                        >
                          {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
                        </div>
                      </div>
                      <span
                        className="text-sm leading-relaxed font-medium flex-1"
                        style={{ color: checked ? cfg.dark : '#3C3C3C' }}
                      >
                        {step}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: cfg.primary }}
                    animate={{ width: `${(completedSteps.filter(Boolean).length / Math.max(1, challenge.challengeSteps.length)) * 100}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[11px] font-black text-[#AFAFAF]">
                  {completedSteps.filter(Boolean).length}/{challenge.challengeSteps.length}
                </span>
              </div>

              <div className="h-20" />
            </motion.div>
          )}

          {/* ─── LANCE INTRO ─── */}
          {!completed && !showTask && (
            <motion.div
              key="lance-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-6"
            >
              {/* Act badge */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {actData && (
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
                    style={{ background: cfg.primary }}
                  >
                    Act {challenge.actNumber} · {actData.title}
                  </span>
                )}
                {challenge.isActFinale && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                    style={{ background: '#FFFAE8', color: '#CCA000', border: '2px solid #FFE566' }}
                  >
                    ✦ Finale
                  </span>
                )}
                <span className="text-[9px] font-bold text-[#AFAFAF]">
                  Challenge {challengeNumber} of {CHALLENGE_ORDER.length}
                </span>
              </div>

              {/* Speaker character — switches between LANCE and Intern for banter */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLine.speaker}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.22 }}
                  className="flex justify-center mb-2"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {currentLine.speaker === 'intern' ? (
                      <GameCharacter
                        character="intern"
                        state="talking"
                        poses={INTERN_POSES}
                        primaryColor="#58CC02"
                        size={150}
                      />
                    ) : (
                      <GameCharacter
                        character="lance"
                        state="talking"
                        poses={LANCE_POSES}
                        primaryColor={cfg.primary}
                        size={170}
                      />
                    )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Speaker label for banter mode */}
              {challenge.internBanterLines?.length ? (
                <div className="flex justify-center mb-2">
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      background: currentLine.speaker === 'intern' ? '#E8FFD0' : cfg.light,
                      color: currentLine.speaker === 'intern' ? '#46A302' : cfg.primary,
                    }}
                  >
                    {currentLine.speaker === 'intern' ? (
                      <span className="inline-flex items-center gap-1.5">
                        {/* The earpiece — Chip's voice arrives through the implant he gave you */}
                        {isSpeaking && !isMuted && (
                          <motion.span
                            animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
                            transition={{ duration: 1.1, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: '#46A302', boxShadow: '0 0 6px #46A302' }}
                            aria-label="Chip speaking through your earpiece"
                          />
                        )}
                        Chip · earpiece
                      </span>
                    ) : 'L.A.N.C.E. says'}
                  </span>
                </div>
              ) : null}

              {/* Speech bubble */}
              <div className="relative mb-4">
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 z-10"
                  style={{
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderBottom: '14px solid #FFFFFF',
                    filter: 'drop-shadow(0 -2px 3px rgba(0,0,0,0.06))',
                  }}
                />
                <Card topBar={currentLine.speaker === 'intern' ? '#58CC02' : cfg.primary}>
                  <div className="px-5 pt-6 pb-4">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={lanceDialogIdx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                        className="text-sm font-medium text-[#3C3C3C] leading-relaxed text-center max-h-[32vh] overflow-y-auto"
                      >
                        "{currentLine.text}"
                      </motion.p>
                    </AnimatePresence>

                    {banterDialogue.length > 1 && (
                      <div className="flex justify-center gap-1.5 mt-4">
                        {banterDialogue.map((line, i) => (
                          <motion.div
                            key={i}
                            className="rounded-full"
                            animate={{
                              width: i === lanceDialogIdx ? 20 : 7,
                              background: i === lanceDialogIdx
                                ? (line.speaker === 'intern' ? '#58CC02' : cfg.primary)
                                : '#E5E5E5',
                            }}
                            style={{ height: 7 }}
                            transition={{ duration: 0.25 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Challenge info strip */}
              <Card className="mb-4">
                <div className="px-5 py-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: cfg.primary }}>
                    Your Challenge
                  </div>
                  <div className="text-base font-black text-[#3C3C3C] mb-3">{challenge.title}</div>
                  <div className="grid grid-cols-3 gap-0 divide-x divide-[#F0F0F0] text-center">
                    {[
                      { label: 'Duration', value: `${challenge.durationMinutes} min` },
                      { label: 'Reward', value: `+${potentialXp} XP`, accent: '#CCA000' },
                      { label: 'Unlocks', value: unlockedTool?.emoji ? `${unlockedTool.emoji} ${unlockedTool.name}` : '—', accent: cfg.primary },
                    ].map(({ label, value, accent }) => (
                      <div key={label} className="px-2">
                        <div className="text-[9px] font-black uppercase tracking-wider text-[#AFAFAF] mb-0.5">{label}</div>
                        <div className="text-xs font-black" style={{ color: accent ?? '#3C3C3C' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="h-20" />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Tool overlay — slides over the entire challenge screen ── */}
      <AnimatePresence>
        {toolOpen && challenge && (
          <motion.div
            key="challenge-tool"
            className="absolute inset-0 z-50 bg-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <GameToolOverlayWithSuspense
              toolId={challenge.unlocksToolId}
              onChallengeComplete={challenge.requiresToolCompletion ? () => {
                setToolOpen(false);
                handleTaskDone();
              } : undefined}
              onBack={() => {
                setToolOpen(false);
                if (challenge.toolFirst) {
                  setShowTask(true);
                } else if (challenge.requiresToolCompletion) {
                  // Completion fires automatically via onChallengeComplete once the
                  // task is genuinely done. Reaching onBack means they left early —
                  // nudge them to actually finish the exercise.
                  setShowIncompleteNudge(true);
                } else {
                  handleTaskDone();
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showInterstitial && (
        <StoryInterstitial
          id={showInterstitial}
          onOpenJournals={() => setShowJournals(true)}
          onDone={() => {
            setShowInterstitial(null);
            if (showJournals) return; // journals take over; exit continues after
            setCompleted(false);
            setCompletedChallengeId(null);
            setShowTask(false);
            setLanceDialogIdx(0);
            setCompletedSteps([]);
            onBack();
          }}
        />
      )}
      {showJournals && (
        <JournalPlayer onDone={() => {
          setShowJournals(false);
          // After his words: his memories. Wordless breath, once.
          if (!interstitialSeen('memories')) {
            setShowInterstitial('memories');
            return;
          }
          setCompleted(false);
          setCompletedChallengeId(null);
          setShowTask(false);
          setLanceDialogIdx(0);
          setCompletedSteps([]);
          onBack();
        }} />
      )}
      {showFinale && (
        <FinaleCeremony onDone={() => {
          setShowFinale(false);
          setCompleted(false);
          setCompletedChallengeId(null);
          setShowTask(false);
          setLanceDialogIdx(0);
          setCompletedSteps([]);
          onBack();
        }} />
      )}

      {/* ── Fixed bottom button ── */}
      <motion.div
        className="shrink-0 px-4 py-4 bg-white border-t border-[#F0F0F0]"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {completed ? (
          <DuoButton
            label={displayChallenge?.isActFinale
              ? (displayChallengeNumber === CHALLENGE_ORDER.length ? 'COMPLETE THE JOURNEY →' : 'ENTER NEXT ACT →')
              : 'NEXT CHALLENGE →'}
            onClick={() => {
              if (displayChallenge?.isActFinale) {
                // 31/31: the illustrated finale ceremony plays once, then exits.
                if (displayChallengeNumber === CHALLENGE_ORDER.length && !finaleSeen()) {
                  setShowFinale(true);
                  return;
                }
                // Between-acts interstitials (escape / lantern / terminal), once each
                const inter = interstitialForAct(displayChallenge?.actNumber ?? 0);
                if (inter) {
                  setShowInterstitial(inter);
                  return;
                }
                // Clear local state before leaving so the screen is fresh if
                // the user navigates back through the trail.
                setCompleted(false);
                setCompletedChallengeId(null);
                setShowTask(false);
                setLanceDialogIdx(0);
                setCompletedSteps([]);
                onBack();
              } else {
                clearActTransition();
                setCompletedChallengeId(null);
                setCompleted(false);
                setShowTask(false);
                setLanceDialogIdx(0);
                setCompletedSteps([]);
                setShowIncompleteNudge(false);
              }
            }}
            color={displayCfg.primary}
            colorDark={displayCfg.dark}
          />
        ) : (
          <>
            {showTask && showIncompleteNudge && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-3 px-4 py-2.5 rounded-2xl"
                style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA' }}
              >
                <span className="text-base">⚠️</span>
                <span className="text-xs font-bold text-orange-700 leading-snug">
                  Finish the exercise inside the tool — it completes on its own once you're done. Tap below to head back in.
                </span>
              </motion.div>
            )}
            <div className="flex gap-3 items-stretch">
              {canStepBack && <DuoBackButton onClick={handleBack} />}
              <div className="flex-1">
                {showTask ? (
                  <DuoButton
                    label={
                      allStepsDone
                        ? challenge.toolFirst
                          ? 'MARK COMPLETE ✓'
                          : showIncompleteNudge
                            ? `OPEN ${unlockedTool?.name?.toUpperCase() ?? 'TOOL'} AGAIN →`
                            : `LAUNCH ${unlockedTool?.name?.toUpperCase() ?? 'TOOL'} →`
                        : `${completedSteps.filter(Boolean).length} of ${challenge.challengeSteps.length} steps done`
                    }
                    onClick={allStepsDone
                      ? () => {
                          if (challenge.toolFirst) {
                            handleTaskDone();
                          } else {
                            setShowIncompleteNudge(false);
                            setToolOpen(true);
                          }
                        }
                      : () => {}}
                    color={cfg.primary}
                    colorDark={cfg.dark}
                    disabled={!allStepsDone}
                  />
                ) : (
                  <DuoButton
                    label={
                      isLastDialog
                        ? challenge.toolFirst
                          ? `START ${unlockedTool?.name?.toUpperCase() ?? 'CHECK-IN'} →`
                          : 'ACCEPT CHALLENGE →'
                        : 'CONTINUE'
                    }
                    onClick={() => {
                      if (!isLastDialog) {
                        setLanceDialogIdx(i => i + 1);
                      } else if (challenge.toolFirst) {
                        setToolOpen(true);
                      } else {
                        setShowTask(true);
                      }
                    }}
                    color={cfg.primary}
                    colorDark={cfg.dark}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* +XP burst animation */}
      <AnimatePresence>
        {showXpPop && (
          <motion.div
            key="xp-pop"
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ y: 0, scale: 0.7, opacity: 0 }}
              animate={{ y: -100, scale: 1.15, opacity: 1 }}
              exit={{ y: -160, scale: 0.9, opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-1 px-6 py-3 rounded-2xl"
              style={{
                background: '#FFFAE8',
                border: '2.5px solid #FFE566',
                boxShadow: '0 8px 32px rgba(255,200,0,0.45)',
              }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: '#FFD700' }} />
                <span className="text-2xl font-black" style={{ color: '#CCA000' }}>
                  +{earnedXp} XP
                </span>
              </div>
              {earnedStreakBonus > 0 && (
                <span className="text-[10.5px] font-bold" style={{ color: '#B45309' }}>
                  🔥 includes +{earnedStreakBonus} streak bonus
                </span>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Reward Overlay */}
      {showReward && displayChallenge && (() => {
        const newCount = completedChallenges.includes(displayChallenge.id)
          ? completedChallenges.length
          : completedChallenges.length + 1;
        const unlockedBadge = QUEST_BADGES.find(b => b.reqCount === newCount) ?? null;
        return (
          <QuestRewardOverlay
            isOpen={showReward}
            onClose={() => setShowReward(false)}
            challengeId={displayChallengeNumber}
            challengeTitle={displayChallenge.title}
            tokensEarned={100}
            unlockedBadge={unlockedBadge}
            totalTokens={newCount * 100}
          />
        );
      })()}

      {/* ── Exit confirmation ── */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            key="exit-confirm"
            className="absolute inset-0 z-[60] flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white rounded-t-3xl px-5 pt-6 pb-8"
              style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }}
            >
              <div className="w-10 h-1 rounded-full bg-[#E5E5E5] mx-auto mb-5" />
              <h3 className="text-lg font-black text-[#3C3C3C] text-center mb-1.5">
                Leave this challenge?
              </h3>
              <p className="text-sm text-[#777777] text-center leading-relaxed mb-6">
                Your progress is saved — you'll pick up right where you left off whenever you come back.
              </p>
              <div className="space-y-3">
                <DuoButton
                  label="KEEP GOING"
                  onClick={() => setShowExitConfirm(false)}
                  color={cfg.primary}
                  colorDark={cfg.dark}
                />
                <button
                  onClick={handleExitChallenge}
                  className="w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95"
                  style={{ color: '#AFAFAF', background: 'transparent' }}
                >
                  LEAVE FOR NOW
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
