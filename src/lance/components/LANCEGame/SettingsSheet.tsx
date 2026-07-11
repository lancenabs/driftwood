import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ChevronRight, User, Palette, Bell, Shield, Trash2,
  LogIn, LogOut, Cloud, CloudOff, Check, RotateCcw, Sliders,
  Moon, Type, Layout, Zap, Volume2, VolumeX, BookOpen, Film, Heart,
} from 'lucide-react';
import { useGame } from './LANCEGameContext';
import { getLink, pairWithCode, disconnect as disconnectTherapist, syncNow } from '../../lib/therapistLink';
import { getCinematicSrc } from './lanceVideos';
import JournalPlayer, { journalsSeen } from './JournalPlayer';
import StoryTreasures from './StoryTreasures';
import StoryInterstitial, { interstitialSeen } from './StoryInterstitial';
import FinaleCeremony, { finaleSeen } from './FinaleCeremony';
import { WALLPAPERS } from '../../utils/wallpapers';
import { auth, isFirebaseInitialized } from '../../lib/firebase';

// Firebase auth — dynamic import to avoid breaking when firebase is a stub
let onAuthStateChanged: typeof import('firebase/auth').onAuthStateChanged | null = null;
let signInWithPopup: typeof import('firebase/auth').signInWithPopup | null = null;
let signOutFn: typeof import('firebase/auth').signOut | null = null;
let GoogleAuthProvider: typeof import('firebase/auth').GoogleAuthProvider | null = null;

if (isFirebaseInitialized) {
  import('firebase/auth').then(m => {
    onAuthStateChanged = m.onAuthStateChanged;
    signInWithPopup = m.signInWithPopup;
    signOutFn = m.signOut;
    GoogleAuthProvider = m.GoogleAuthProvider;
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const COLOR_THEMES = [
  { id: 'lance_brand',  name: 'LANCE Cyan',       hex: '#3ECFCF', glow: 'rgba(62,207,207,0.3)'  },
  { id: 'amethyst',     name: 'Mystic Amethyst',  hex: '#7C3AED', glow: 'rgba(124,58,237,0.3)'  },
  { id: 'ocean',        name: 'Deep Ocean',        hex: '#0284C7', glow: 'rgba(2,132,199,0.3)'   },
  { id: 'emerald',      name: 'Forest Emerald',   hex: '#10B981', glow: 'rgba(16,185,129,0.3)'  },
  { id: 'rose',         name: 'Rose Quartz',       hex: '#EC4899', glow: 'rgba(236,72,153,0.3)'  },
  { id: 'amber',        name: 'Solar Amber',       hex: '#F59E0B', glow: 'rgba(245,158,11,0.3)'  },
  { id: 'obsidian',     name: 'Obsidian',          hex: '#94A3B8', glow: 'rgba(148,163,184,0.3)' },
];

const FONT_SIZES = [
  { id: 'small',  label: 'Small',   preview: 'text-xs' },
  { id: 'normal', label: 'Default', preview: 'text-sm' },
  { id: 'large',  label: 'Large',   preview: 'text-base' },
  { id: 'larger', label: 'X-Large', preview: 'text-lg' },
];

const FONT_FAMILIES = [
  { id: 'sans',  label: 'Modern',  style: { fontFamily: 'system-ui, sans-serif' } },
  { id: 'serif', label: 'Elegant', style: { fontFamily: 'Georgia, serif' }        },
  { id: 'mono',  label: 'Tech',    style: { fontFamily: 'monospace' }             },
];

const INTERN_PERSONAS = [
  { id: 'hype',          label: '⚡ Hype Coach',     desc: 'Energetic & motivating'  },
  { id: 'compassionate', label: '💙 Compassionate',  desc: 'Warm & supportive'        },
  { id: 'zen',           label: '🧘 Zen Guide',       desc: 'Calm & mindful'           },
  { id: 'structured',   label: '📋 Structured',      desc: 'Logical & goal-oriented' },
  { id: 'playful',      label: '🎮 Playful',          desc: 'Fun & gamified'           },
];

const INTERN_AVATARS = ['🌟', '🤖', '🌸', '⚡', '🦋', '🔮', '🌊', '🎯', '🧠', '💫', '🌙', '🦄'];

const SUB_TABS_ALL = [
  { id: 'overview',   label: 'Overview',    emoji: '🏠' },
  { id: 'mood',       label: 'Mood Diary',  emoji: '💜' },
  { id: 'habits',     label: 'Daily Habits',emoji: '✅' },
  { id: 'sleep',      label: 'Sleep',       emoji: '🌙' },
  { id: 'nutrition',  label: 'Diet & Mood', emoji: '🥗' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionRow({
  icon: Icon, label, sub, value, onPress, danger, color,
}: {
  icon: React.ElementType; label: string; sub?: string; value?: string;
  onPress?: () => void; danger?: boolean; color?: string;
}) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all active:scale-[0.98]"
      style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, marginBottom: 2 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: danger ? 'rgba(239,68,68,0.15)' : (color ? `${color}22` : 'rgba(62,207,207,0.12)') }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: danger ? '#EF4444' : (color ?? '#3ECFCF') }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold" style={{ color: danger ? '#EF4444' : '#fff' }}>{label}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
      </div>
      {value && <span className="text-[11px] text-slate-400 font-semibold shrink-0 mr-1">{value}</span>}
      {onPress && <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#475569' }} />}
    </button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-1 pt-4 pb-1">
      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{title}</p>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative shrink-0 w-12 h-6 rounded-full transition-all duration-200"
      style={{ background: checked ? 'linear-gradient(135deg,#3ECFCF,#7C3AED)' : 'rgba(255,255,255,0.1)' }}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ duration: 0.2 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type Screen = 'main' | 'profile' | 'intern' | 'appearance' | 'homescreen' | 'notifications' | 'account' | 'data' | 'therapist';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenInternCustomizer: () => void;
  onShowTutorial?: () => void;
  onShowCredits?: () => void;
}

export default function SettingsSheet({ isOpen, onClose, onOpenInternCustomizer, onShowTutorial, onShowCredits }: Props) {
  const {
    userName, setUserName,
    intern, completeInternSetup,
    enabledSubTabs, setEnabledSubTabs,
    quickCheckInApps,
    primaryColorTheme, setPrimaryColorTheme,
    setPaidAccess, resetGame, clearMoodLogs,
    installedTools,
  } = useGame();

  const [screen, setScreen] = useState<Screen>('main');
  const [showJournalArchive, setShowJournalArchive] = useState(false);
  const [showTreasures, setShowTreasures] = useState(false);
  const [replayMoment, setReplayMoment] = useState<string | null>(null); // interstitial id or 'finale'

  // Appearance state (stored in localStorage like App.tsx)
  const [selectedWallpaper, setSelectedWallpaper] = useState(
    () => localStorage.getItem('lance_wallpaper') || 'original'
  );
  const [themeFontSize, setThemeFontSize] = useState(
    () => localStorage.getItem('lance_font_size') || 'normal'
  );
  const [themeFontFamily, setThemeFontFamily] = useState(
    () => localStorage.getItem('lance_font_family') || 'sans'
  );

  // Notifications state
  const [notifEnabled, setNotifEnabled] = useState(
    () => localStorage.getItem('lance_notif_enabled') === 'true'
  );
  const [notifTime, setNotifTime] = useState(
    () => localStorage.getItem('lance_notif_time') || '20:00'
  );
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem('lance_sound_enabled') !== 'false'
  );

  // Local intern edits (he is Chip; only avatar accent + personality edit)
  const [internAvatar, setInternAvatar] = useState(intern.avatar);
  const [internPersona, setInternPersona] = useState(intern.personalityId);

  // Profile edits
  const [editName, setEditName] = useState(userName);

  // Auth state
  const [authUser, setAuthUser] = useState<{ email: string | null; displayName: string | null } | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Reset to main screen when sheet closes
  useEffect(() => {
    if (!isOpen) setTimeout(() => setScreen('main'), 350);
  }, [isOpen]);

  // Sync intern edits when sheet opens
  useEffect(() => {
    if (isOpen) {
      setInternAvatar(intern.avatar);
      setInternPersona(intern.personalityId);
      setEditName(userName);
    }
  }, [isOpen, intern, userName]);

  // Firebase auth listener
  useEffect(() => {
    if (!isFirebaseInitialized || !auth) return;
    let unsub: (() => void) | undefined;
    import('firebase/auth').then(m => {
      unsub = m.onAuthStateChanged(auth as any, (user: any) => {
        setAuthUser(user ? { email: user.email, displayName: user.displayName } : null);
      });
    });
    return () => { if (unsub) unsub(); };
  }, []);

  // Persist appearance settings
  useEffect(() => {
    localStorage.setItem('lance_wallpaper', selectedWallpaper);
    const wp = WALLPAPERS.find(w => w.id === selectedWallpaper);
    if (wp) {
      document.body.style.background = wp.style.background;
      if (wp.style.backgroundImage) document.body.style.backgroundImage = wp.style.backgroundImage;
      if (wp.style.backgroundSize) document.body.style.backgroundSize = wp.style.backgroundSize;
      else document.body.style.backgroundSize = '';
    }
  }, [selectedWallpaper]);

  useEffect(() => { localStorage.setItem('lance_font_size', themeFontSize); }, [themeFontSize]);
  useEffect(() => { localStorage.setItem('lance_font_family', themeFontFamily); }, [themeFontFamily]);
  useEffect(() => { localStorage.setItem('lance_notif_enabled', String(notifEnabled)); }, [notifEnabled]);
  useEffect(() => { localStorage.setItem('lance_notif_time', notifTime); }, [notifTime]);
  useEffect(() => { localStorage.setItem('lance_sound_enabled', String(soundEnabled)); }, [soundEnabled]);

  const handleSignIn = async () => {
    if (!isFirebaseInitialized) return;
    setAuthLoading(true);
    try {
      const m = await import('firebase/auth');
      const provider = new m.GoogleAuthProvider();
      await m.signInWithPopup(auth as any, provider);
    } catch { /* popup blocked or cancelled */ }
    finally { setAuthLoading(false); }
  };

  const handleSignOut = async () => {
    if (!isFirebaseInitialized) return;
    const m = await import('firebase/auth');
    await m.signOut(auth as any);
  };

  const handleSaveProfile = () => {
    setUserName(editName);
    setScreen('main');
  };

  const handleSaveIntern = () => {
    completeInternSetup({ name: 'Chip', personalityId: internPersona, avatar: internAvatar });
    setScreen('main');
  };

  const currentWp = WALLPAPERS.find(w => w.id === selectedWallpaper);

  const screenTitle: Record<Screen, string> = {
    main: 'Settings', profile: 'Your Profile', intern: 'AI Intern',
    appearance: 'Appearance', homescreen: 'Home Screen', notifications: 'Notifications',
    account: 'Account & Sync', data: 'Privacy & Data', therapist: 'Your Therapist',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[28px] overflow-hidden"
            style={{ background: '#0b1322', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '88vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-0 shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2.5">
                {screen !== 'main' && (
                  <button
                    onClick={() => setScreen('main')}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <ChevronRight className="w-4 h-4 text-white rotate-180" />
                  </button>
                )}
                <h2 className="text-lg font-black text-white">{screenTitle[screen]}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content — animated screen transitions */}
            <div className="flex-1 overflow-y-auto px-4 pb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen}
                  initial={{ opacity: 0, x: screen === 'main' ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: screen === 'main' ? 16 : -16 }}
                  transition={{ duration: 0.18 }}
                >

                  {/* ══ MAIN MENU ══════════════════════════════════════════════════════════ */}
                  {screen === 'main' && (
                    <div>
                      {/* User quick card */}
                      <div
                        className="flex items-center gap-3 p-4 rounded-2xl mb-3"
                        style={{ background: 'linear-gradient(135deg,rgba(62,207,207,0.12),rgba(124,58,237,0.12))', border: '1px solid rgba(62,207,207,0.2)' }}
                      >
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ background: 'rgba(62,207,207,0.2)', border: '1px solid rgba(62,207,207,0.3)' }}
                        >
                          {intern.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-black text-white">{userName || 'Set your name'}</div>
                          <div className="text-[11px] text-cyan-400 font-bold">Intern: {intern.name} · {intern.personalityId}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{installedTools.length} apps installed</div>
                        </div>
                        <button
                          onClick={() => setScreen('profile')}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white"
                          style={{ background: 'rgba(62,207,207,0.2)', border: '1px solid rgba(62,207,207,0.3)' }}
                        >
                          Edit
                        </button>
                      </div>

                      <SectionHeader title="Personalize" />
                      <SectionRow icon={User}    label="Your Profile"    sub={userName || 'Name, avatar'}        onPress={() => setScreen('profile')}      color="#3ECFCF" />
                      <SectionRow icon={Zap}     label="AI Intern"       sub={`${intern.name} · ${intern.personalityId}`} onPress={() => setScreen('intern')} color="#A78BFA" />
                      <SectionRow icon={Palette} label="Appearance"      sub="Themes, wallpaper, fonts"          onPress={() => setScreen('appearance')}   color="#EC4899" />
                      <SectionRow icon={Layout}  label="Home Screen"     sub="Sub-tabs, quick check-in"          onPress={() => setScreen('homescreen')}   color="#F59E0B" />

                      <SectionHeader title="System" />
                      <SectionRow icon={Bell}    label="Notifications"   sub={notifEnabled ? `Daily at ${notifTime}` : 'Off'} onPress={() => setScreen('notifications')} color="#3ECFCF" />
                      <SectionRow icon={Heart}   label="Your Therapist"  sub={getLink() ? 'Connected — sharing progress' : 'Connect with a code'} onPress={() => setScreen('therapist')} color="#7FD98C" />
                      <SectionRow icon={Cloud}   label="Account & Sync"  sub={authUser ? authUser.email ?? 'Signed in' : 'Sign in with Google'} onPress={() => setScreen('account')} color="#60A5FA" />

                      <SectionHeader title="Help & Story" />
                      <SectionRow icon={BookOpen} label="Show Tutorial"      sub="Replay the welcome guide"       onPress={onShowTutorial}                          color="#3ECFCF" />
                      <SectionRow icon={Film}     label="View Story Credits" sub="The Dawn Strider Chronicles"   onPress={onShowCredits}                           color="#F59E0B" />
                      {(journalsSeen() || interstitialSeen('terminal')) && (
                        <SectionRow icon={Film} label="Dr. Malakor's Journals" sub="Recovered archive · rewatch" onPress={() => setShowJournalArchive(true)} color="#FCD34D" />
                      )}
                      <SectionRow icon={Film} label="The Vault of Treasures" sub="The keeper's collection · 17 moments + the theme" onPress={() => setShowTreasures(true)} color="#A78BFA" />
                      {interstitialSeen('escape') && (
                        <SectionRow icon={Film} label="The Escape" sub="Story moment · rewatch" onPress={() => setReplayMoment('escape')} color="#58CC02" />
                      )}
                      {interstitialSeen('lantern') && (
                        <SectionRow icon={Film} label="The Shore" sub="Story moment · rewatch" onPress={() => setReplayMoment('lantern')} color="#60A5FA" />
                      )}
                      {interstitialSeen('memories') && (
                        <SectionRow icon={Film} label="The Memories" sub="Story moment · rewatch" onPress={() => setReplayMoment('memories')} color="#F59E0B" />
                      )}
                      {finaleSeen() && (
                        <SectionRow icon={Film} label="The Finale" sub="31/31 · watch again" onPress={() => setReplayMoment('finale')} color="#7FD98C" />
                      )}

                      <SectionHeader title="Admin & Data" />
                      <SectionRow icon={Shield}    label="Unlock All Tools"  sub="Admin: enable full library" onPress={() => { setPaidAccess(true); onClose(); }} color="#A78BFA" />
                      <SectionRow icon={Sliders}   label="Privacy & Data"    sub="Export, clear, reset"      onPress={() => setScreen('data')}                   color="#94A3B8" />

                      <div className="mt-4 text-center text-[10px] text-slate-600 font-mono">
                        L.A.N.C.E. v2.0 · Island Escape Arc
                      </div>
                    </div>
                  )}

                  {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
                  {screen === 'profile' && (
                    <div className="space-y-4">
                      <div
                        className="p-4 rounded-2xl space-y-3"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Your Name</p>
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          placeholder="Enter your first name..."
                          className="w-full bg-transparent text-white text-base font-bold outline-none placeholder-slate-600"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 8 }}
                        />
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        className="w-full py-3.5 rounded-2xl text-sm font-black text-slate-900 uppercase tracking-wider"
                        style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)' }}
                      >
                        Save Profile
                      </button>

                      <button
                        onClick={() => { onOpenInternCustomizer(); onClose(); }}
                        className="w-full py-3.5 rounded-2xl text-sm font-black text-white uppercase tracking-wider"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        Open Full Intern Customizer →
                      </button>
                    </div>
                  )}

                  {/* ══ AI INTERN ════════════════════════════════════════════════════════ */}
                  {screen === 'intern' && (
                    <div className="space-y-4">
                      {/* Avatar picker */}
                      <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Intern Avatar</p>
                        <div className="grid grid-cols-6 gap-2">
                          {INTERN_AVATARS.map(em => (
                            <button
                              key={em}
                              onClick={() => setInternAvatar(em)}
                              className="aspect-square rounded-xl flex items-center justify-center text-xl transition-all"
                              style={{
                                background: internAvatar === em ? 'rgba(62,207,207,0.2)' : 'rgba(255,255,255,0.05)',
                                border: internAvatar === em ? '2px solid #3ECFCF' : '2px solid transparent',
                                boxShadow: internAvatar === em ? '0 0 12px rgba(62,207,207,0.4)' : 'none',
                              }}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Persona */}
                      <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Personality</p>
                        {INTERN_PERSONAS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setInternPersona(p.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                            style={{
                              background: internPersona === p.id ? 'rgba(62,207,207,0.12)' : 'rgba(255,255,255,0.04)',
                              border: internPersona === p.id ? '1px solid rgba(62,207,207,0.4)' : '1px solid transparent',
                            }}
                          >
                            <div className="text-base font-black text-white flex-1">{p.label}</div>
                            <div className="text-[11px] text-slate-400">{p.desc}</div>
                            {internPersona === p.id && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleSaveIntern}
                        className="w-full py-3.5 rounded-2xl text-sm font-black text-slate-900 uppercase tracking-wider"
                        style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)' }}
                      >
                        Save Intern Settings
                      </button>
                    </div>
                  )}

                  {/* ══ APPEARANCE ══════════════════════════════════════════════════════ */}
                  {screen === 'appearance' && (
                    <div className="space-y-4">
                      {/* Color Themes */}
                      <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Color Theme</p>
                        <div className="grid grid-cols-4 gap-2">
                          {COLOR_THEMES.map(t => (
                            <button
                              key={t.id}
                              onClick={() => setPrimaryColorTheme(t.id)}
                              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all"
                              style={{
                                background: primaryColorTheme === t.id ? `${t.hex}22` : 'rgba(255,255,255,0.04)',
                                border: primaryColorTheme === t.id ? `2px solid ${t.hex}` : '2px solid rgba(255,255,255,0.06)',
                                boxShadow: primaryColorTheme === t.id ? `0 0 16px ${t.glow}` : 'none',
                              }}
                            >
                              <div className="w-8 h-8 rounded-full" style={{ background: t.hex, boxShadow: `0 2px 8px ${t.glow}` }} />
                              <span className="text-[9px] font-bold text-slate-400 text-center leading-tight">{t.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Wallpaper */}
                      <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Background</p>
                          <span className="text-[10px] text-slate-400">{currentWp?.name}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {WALLPAPERS.filter(w => w.category === 'Gradients').map(wp => (
                            <button
                              key={wp.id}
                              onClick={() => setSelectedWallpaper(wp.id)}
                              className="aspect-[3/4] rounded-2xl overflow-hidden relative transition-all"
                              style={{
                                ...wp.style,
                                border: selectedWallpaper === wp.id
                                  ? '2.5px solid #3ECFCF'
                                  : '2px solid rgba(255,255,255,0.1)',
                                boxShadow: selectedWallpaper === wp.id ? '0 0 16px rgba(62,207,207,0.4)' : 'none',
                              }}
                            >
                              {selectedWallpaper === wp.id && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-slate-900" />
                                  </div>
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 p-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
                                <p className="text-[8px] text-white font-bold truncate">{wp.name.replace(/^[^\s]+\s/, '')}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Font Size</p>
                        <div className="flex gap-2">
                          {FONT_SIZES.map(fs => (
                            <button
                              key={fs.id}
                              onClick={() => setThemeFontSize(fs.id)}
                              className="flex-1 py-2.5 rounded-xl text-center font-black transition-all"
                              style={{
                                background: themeFontSize === fs.id ? 'rgba(62,207,207,0.15)' : 'rgba(255,255,255,0.04)',
                                border: themeFontSize === fs.id ? '1px solid rgba(62,207,207,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                color: themeFontSize === fs.id ? '#3ECFCF' : '#94A3B8',
                                fontSize: fs.id === 'small' ? 10 : fs.id === 'normal' ? 12 : fs.id === 'large' ? 14 : 16,
                              }}
                            >
                              {fs.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Family */}
                      <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Font Style</p>
                        <div className="flex gap-2">
                          {FONT_FAMILIES.map(ff => (
                            <button
                              key={ff.id}
                              onClick={() => setThemeFontFamily(ff.id)}
                              className="flex-1 py-2.5 rounded-xl text-center font-bold transition-all"
                              style={{
                                ...ff.style,
                                background: themeFontFamily === ff.id ? 'rgba(62,207,207,0.15)' : 'rgba(255,255,255,0.04)',
                                border: themeFontFamily === ff.id ? '1px solid rgba(62,207,207,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                color: themeFontFamily === ff.id ? '#3ECFCF' : '#94A3B8',
                                fontSize: 12,
                              }}
                            >
                              {ff.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ══ HOME SCREEN ══════════════════════════════════════════════════════ */}
                  {screen === 'homescreen' && (
                    <div className="space-y-4">
                      {/* Sub-tabs */}
                      <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div>
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Home Sub-Tabs</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Choose which sections appear at the top of your home screen</p>
                        </div>
                        <div className="space-y-2">
                          {SUB_TABS_ALL.map(tab => {
                            const isEnabled = enabledSubTabs.includes(tab.id);
                            const isOverview = tab.id === 'overview';
                            return (
                              <div
                                key={tab.id}
                                className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.04)' }}
                              >
                                <div className="text-xl w-7">{tab.emoji}</div>
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-white">{tab.label}</div>
                                  {isOverview && <div className="text-[10px] text-slate-500">Always shown</div>}
                                </div>
                                <Toggle
                                  checked={isEnabled}
                                  onChange={checked => {
                                    if (isOverview) return;
                                    if (checked) {
                                      setEnabledSubTabs([...enabledSubTabs, tab.id]);
                                    } else {
                                      setEnabledSubTabs(enabledSubTabs.filter(t => t !== tab.id));
                                    }
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Check-In shortcuts */}
                      <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Quick Check-In Shortcuts</p>
                        <p className="text-[11px] text-slate-500">Currently selected ({quickCheckInApps.length}/5):</p>
                        <div className="flex flex-wrap gap-1.5">
                          {quickCheckInApps.map(id => (
                            <span
                              key={id}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-cyan-300"
                              style={{ background: 'rgba(62,207,207,0.12)', border: '1px solid rgba(62,207,207,0.25)' }}
                            >
                              {id.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-600">Tap "Customize" on your Home screen to change these.</p>
                      </div>
                    </div>
                  )}

                  {/* ══ NOTIFICATIONS ════════════════════════════════════════════════════ */}
                  {screen === 'notifications' && (
                    <div className="space-y-3">
                      {/* Daily reminder */}
                      <div className="p-4 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-white">Daily Check-In Reminder</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Get a gentle nudge each day</p>
                          </div>
                          <Toggle checked={notifEnabled} onChange={setNotifEnabled} />
                        </div>

                        {notifEnabled && (
                          <div className="flex items-center gap-3">
                            <div className="text-[11px] text-slate-400 font-bold">Time</div>
                            <input
                              type="time"
                              value={notifTime}
                              onChange={e => setNotifTime(e.target.value)}
                              className="flex-1 text-white font-bold text-sm outline-none text-right"
                              style={{ background: 'transparent', border: 'none', colorScheme: 'dark' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Sound */}
                      <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                            <div>
                              <p className="text-sm font-bold text-white">Jungle Ambience</p>
                              <p className="text-[11px] text-slate-400">Background soundscape</p>
                            </div>
                          </div>
                          <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
                        </div>
                      </div>

                      <div
                        className="p-3 rounded-xl text-[11px] text-slate-500"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        Notification permissions are managed by your browser or device settings.
                      </div>
                    </div>
                  )}

                  {/* ══ ACCOUNT & SYNC ═══════════════════════════════════════════════════ */}
                  {showJournalArchive && (
                    <JournalPlayer onDone={() => setShowJournalArchive(false)} />
                  )}
                  {showTreasures && (
                    <StoryTreasures onDone={() => setShowTreasures(false)} />
                  )}
                  {replayMoment && replayMoment !== 'finale' && (
                    <StoryInterstitial id={replayMoment} onDone={() => setReplayMoment(null)} />
                  )}
                  {replayMoment === 'finale' && (
                    <FinaleCeremony onDone={() => setReplayMoment(null)} />
                  )}
                  {screen === 'therapist' && (
                    <TherapistLinkScreen />
                  )}

                  {screen === 'account' && (
                    <div className="space-y-3">
                      {authUser ? (
                        <>
                          {/* Signed in card */}
                          <div
                            className="p-4 rounded-2xl"
                            style={{ background: 'rgba(62,207,207,0.08)', border: '1px solid rgba(62,207,207,0.2)' }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                style={{ background: 'rgba(62,207,207,0.2)' }}>
                                ✓
                              </div>
                              <div>
                                <p className="text-sm font-black text-white">Signed in</p>
                                <p className="text-[11px] text-cyan-400">{authUser.email}</p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            <LogOut className="w-4 h-4 text-red-400" />
                            <div className="text-sm font-bold text-red-400">Sign Out</div>
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <p className="text-sm font-bold text-white">Cloud Backup & Sync</p>
                            <p className="text-[12px] text-slate-400 leading-relaxed">
                              Sign in with Google to back up your progress, mood logs, and settings across devices.
                            </p>
                          </div>

                          <button
                            onClick={handleSignIn}
                            disabled={authLoading}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-white transition-all active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg,#3ECFCF,#7C3AED)' }}
                          >
                            <LogIn className="w-5 h-5" />
                            <span className="flex-1 text-center">{authLoading ? 'Connecting…' : 'Sign in with Google'}</span>
                          </button>

                          <div
                            className="flex items-center gap-2 p-3 rounded-xl text-[11px] text-slate-500"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <CloudOff className="w-3.5 h-3.5 shrink-0" />
                            Your data is saved locally on this device.
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* ══ PRIVACY & DATA ═══════════════════════════════════════════════════ */}
                  {screen === 'data' && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl space-y-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-sm font-bold text-white">Your Data</p>
                        <p className="text-[12px] text-slate-400">All your wellness data stays on your device. We don't sell or share it.</p>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm('Clear all mood logs and check-in history? This cannot be undone.')) {
                            clearMoodLogs();
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
                      >
                        <Trash2 className="w-4 h-4 text-amber-400" />
                        <div className="text-left">
                          <div className="text-sm font-bold text-amber-400">Clear Mood Logs</div>
                          <div className="text-[11px] text-slate-500">Removes check-in history</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Reset ALL progress including XP, challenges, and installed apps? This cannot be undone.')) {
                            resetGame();
                            onClose();
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        <RotateCcw className="w-4 h-4 text-red-400" />
                        <div className="text-left">
                          <div className="text-sm font-bold text-red-400">Factory Reset</div>
                          <div className="text-[11px] text-slate-500">Clears all game data and starts fresh</div>
                        </div>
                      </button>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


// ── Therapist pairing screen ──────────────────────────────────────────────────
// Plain-language consent copy, one code entry, visible disconnect. The link
// shares structured logs and progress — never journal prose.
function TherapistLinkScreen() {
  const [link, setLink] = React.useState(getLink());
  const [code, setCode] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  // One-time pairing cinematic: Chip installs the link (null = dormant slot)
  const [pairMoment, setPairMoment] = React.useState<string | null>(null);
  const [syncedFlash, setSyncedFlash] = React.useState(false);

  if (link) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(127,217,140,0.1)', border: '1px solid rgba(127,217,140,0.3)' }}>
          <p className="text-sm font-black text-white">Connected to your therapist</p>
          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: '#9CA3AF' }}>
            Your check-ins, logs, and progress sync automatically. Your journal and letter text
            stays on this device — only structured progress is shared.
          </p>
          <p className="text-[10px] mt-2 font-bold" style={{ color: '#7FD98C' }}>
            Paired {new Date(link.pairedAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={async () => { setBusy(true); const ok = await syncNow(); setBusy(false); if (ok) { setSyncedFlash(true); setTimeout(() => setSyncedFlash(false), 2000); } }}
          disabled={busy}
          className="w-full py-3 rounded-2xl font-black text-sm disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)', color: '#FFF' }}
        >
          {busy ? 'Syncing…' : syncedFlash ? 'Synced ✓' : 'Sync now'}
        </button>
        <button
          onClick={() => {
            if (window.confirm('Disconnect from your therapist? Syncing stops immediately; nothing already shared is deleted on their side.')) {
              disconnectTherapist();
              setLink(null);
            }
          }}
          className="w-full py-3 rounded-2xl font-bold text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-sm font-black text-white">Connect to your therapist</p>
        <p className="text-[11px] mt-1 leading-relaxed" style={{ color: '#9CA3AF' }}>
          Your therapist gives you a 6-character code. Once connected, your check-ins, logs,
          and progress are shared with them, and anything they assign appears in your app.
          You can disconnect at any time.
        </p>
      </div>
      <input
        value={code}
        onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
        placeholder="ENTER CODE"
        maxLength={6}
        autoCapitalize="characters"
        className="w-full py-3.5 rounded-2xl text-center text-xl font-black tracking-[0.4em] outline-none"
        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${error ? '#F87171' : 'rgba(255,255,255,0.15)'}`, color: '#FFF', caretColor: '#3ECFCF' }}
      />
      {error && <p className="text-[11px] font-bold text-center" style={{ color: '#F87171' }}>{error}</p>}
      <button
        onClick={async () => {
          setBusy(true); setError('');
          try {
            const l = await pairWithCode(code.trim());
            setLink(l);
            setPairMoment(getCinematicSrc('pair'));
            void syncNow();
          } catch (e: any) {
            setError(e?.message ?? 'Something went wrong.');
          } finally { setBusy(false); }
        }}
        disabled={busy || code.trim().length !== 6}
        className="w-full py-3 rounded-2xl font-black text-sm disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)', color: '#FFF' }}
      >
        {busy ? 'Connecting…' : 'Connect'}
      </button>
      {pairMoment && (
        <div className="fixed inset-0 z-[500] bg-black flex items-center justify-center"
          onClick={() => setPairMoment(null)}>
          <video
            src={pairMoment}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover' }}
            autoPlay muted playsInline
            onEnded={() => setPairMoment(null)}
            onError={() => setPairMoment(null)}
          />
          <div className="absolute inset-x-0 text-center px-8"
            style={{ bottom: 'max(3.5rem, env(safe-area-inset-bottom))' }}>
            <p className="text-white text-base font-black" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              You're connected.
            </p>
            <p className="text-white/80 text-xs font-semibold mt-1" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
              Your therapist can now walk beside you in here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
