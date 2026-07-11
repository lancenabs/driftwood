import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';

import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

type Zone = 'hyper' | 'window' | 'hypo';

interface ZoneData {
  id: Zone;
  label: string;
  subtitle: string;
  color: string;
  emoji: string;
  signs: string[];
  lanceRead: string;
  interventions: string[];
  internNote: string;
}

const ZONES: ZoneData[] = [
  {
    id: 'hyper',
    label: 'Hyper-Arousal',
    subtitle: 'Above the Window',
    color: '#EF4444',
    emoji: '⚡',
    signs: [
      'Racing thoughts, can\'t slow down',
      'Heart pounding, chest tight',
      'Anxiety, panic, or rage',
      'Hypervigilance — scanning for threats',
      'Restlessness, inability to sit still',
    ],
    lanceRead: "Hyper-arousal detected. Your sympathetic nervous system is running a threat-response protocol on a situation that — statistically — does not require it. You are over-resourced for the current moment. The goal is not to suppress the energy. It is to redirect it downward, into the window.",
    interventions: [
      'Physiological sigh: deep inhale, second sip of air, long slow exhale',
      'Cold water on face or wrists (dive reflex)',
      'Intense movement — 30 seconds, burn the cortisol',
      'Name 5 things you see (sensory grounding)',
      'TIPP skill — Temperature intervention',
    ],
    internNote: "You're running hot right now. Your body prepared for a fight that didn't happen. One intervention brings you down into the window — then you can think clearly again.",
  },
  {
    id: 'window',
    label: 'Window of Tolerance',
    subtitle: 'Optimal Zone',
    color: '#22C55E',
    emoji: '✅',
    signs: [
      'Present and alert without alarm',
      'Can think and feel at the same time',
      'Able to engage with hard topics',
      'Emotions feel manageable',
      'Body feels grounded and available',
    ],
    lanceRead: "Window of tolerance: confirmed. You are operating within optimal nervous system parameters. Your prefrontal cortex is online. Your emotional processing is available. Your capacity for regulation, learning, and connection is at peak availability. This is the zone.",
    interventions: [
      'This is where healing, learning, and connection happen — stay here',
      'Challenge yourself slightly: process something difficult while grounded',
      'Practice any skill or tool while in this state — it will embed more deeply',
      'Connection — reach out to someone, you\'re resourced for it',
    ],
    internNote: "You're in the window — this is where the real work happens. Do something meaningful with this state.",
  },
  {
    id: 'hypo',
    label: 'Hypo-Arousal',
    subtitle: 'Below the Window',
    color: '#60A5FA',
    emoji: '💤',
    signs: [
      'Flat, numb, or disconnected',
      'Low energy or depression',
      'Dissociation — spacey, foggy',
      'Hard to feel anything at all',
      'Collapsed, shut down, or frozen',
    ],
    lanceRead: "Hypo-arousal detected. Your nervous system has engaged a shutdown response — the dorsal vagal brake has activated. This is not weakness. It is a protective response to overwhelm. The goal is gentle, upward activation. Not forcing energy — coaxing the system back online slowly.",
    interventions: [
      'Movement — gentle first: stretch, slow walk, gentle rocking',
      'Temperature change: warm tea, warm shower',
      'Human contact: a call, a text, or being near someone',
      'Sensory activation: smell something strong, touch textured surfaces',
      'Rhythmic activity: humming, tapping, slow breathing',
    ],
    internNote: "You've gone into protective shutdown — that's okay, it's just your nervous system protecting you. The path back up is gentle. Start with movement or connection.",
  },
];

const STORAGE_KEY = 'lance_window_logs_v1';

export default function WindowOfTolerance({ onBack }: { onBack: () => void }) {
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const { intern, addXp } = useGame();
  const [screen, setScreen] = useState<'learn' | 'locate' | 'result'>('learn');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [logged, setLogged] = useState(false);

  const zoneData = selectedZone ? ZONES.find(z => z.id === selectedZone)! : null;

  const handleLog = () => {
    if (!selectedZone) return;
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    prev.push({ date: new Date().toISOString(), zone: selectedZone });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
    addXp(25);
    setLogged(true);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/somatic.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/window_of_tolerance.webp" alt="" draggable={false}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(34,197,94,0.35)' }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black truncate" style={{ color: '#3C3C3C' }}>Window of Tolerance</h2>
          <p className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>Where are you in your nervous system right now?</p>
        </div>
        <div className="flex gap-1">
          {(['learn', 'locate'] as const).map(s => (
            <button key={s} onClick={() => setScreen(s)}
              className="px-2 py-1 rounded-full text-[9px] font-black"
              style={{ background: screen === s ? '#3ECFCF22' : 'transparent', color: screen === s ? '#3ECFCF' : '#9CA3AF99',
                border: `1px solid ${screen === s ? '#3ECFCF44' : 'transparent'}` }}>
              {s === 'learn' ? 'Learn' : 'Check In'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <AnimatePresence mode="wait">

          {screen === 'learn' && (
            <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* LANCE intro */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="processing" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} explains polyvagal theory</span>
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF' }}>
                  "Your nervous system has three functional states — a window in the middle where you operate optimally, and two threat zones above and below it. Most humans spend significant time outside the window without realizing it. Understanding which zone you're in is the first regulation skill. You cannot regulate a state you haven't named."
                </p>
              </div>

              {/* Visual diagram */}
              <div className="rounded-3xl overflow-hidden border" style={{ borderColor: '#F0F0F0' }}>
                {ZONES.map((zone, i) => (
                  <div key={zone.id} className="px-5 py-4 flex items-center gap-4"
                    style={{
                      background: i === 0 ? 'rgba(239,68,68,0.08)' : i === 1 ? 'rgba(34,197,94,0.08)' : 'rgba(96,165,250,0.08)',
                      borderBottom: i < ZONES.length - 1 ? '1px solid rgba(62,207,207,0.1)' : 'none',
                    }}>
                    <div className="text-2xl shrink-0">{zone.emoji}</div>
                    <div className="flex-1">
                      <div className="text-sm font-black" style={{ color: zone.color }}>{zone.label}</div>
                      <div className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>{zone.subtitle}</div>
                      <div className="text-[10px] mt-1 leading-relaxed" style={{ color: '#9CA3AF' }}>
                        {zone.signs[0]}, {zone.signs[1]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Intern */}
              <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>
                  Most people don't know which zone they're in — they just know they feel "off." Now you have a map. Tap "Check In" to find yourself on it.
                </p>
              </div>

              <button onClick={() => setScreen('locate')}
                className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #3ECFCF, #22C55E)', color: '#F9FAFB' }}>
                Check In — Where Am I Now?
              </button>
            </motion.div>
          )}

          {screen === 'locate' && (
            <motion.div key="locate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <p className="text-xs text-center font-bold" style={{ color: '#9CA3AF' }}>
                Which of these resonates with how you feel right now?
              </p>

              {ZONES.map(zone => (
                <motion.button key={zone.id} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedZone(zone.id); setLogged(false); setScreen('result'); }}
                  className="w-full text-left rounded-3xl p-5 border transition-all"
                  style={{
                    background: `${zone.color}11`,
                    borderColor: selectedZone === zone.id ? zone.color : `${zone.color}33`,
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{zone.emoji}</div>
                    <div>
                      <div className="text-sm font-black" style={{ color: zone.color }}>{zone.label}</div>
                      <div className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>{zone.subtitle}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {zone.signs.slice(0, 3).map((sign, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ background: zone.color }} />
                        <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{sign}</span>
                      </div>
                    ))}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {screen === 'result' && zoneData && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-3xl p-5 border"
                style={{ background: `${zoneData.color}11`, backdropFilter: 'blur(10px)', borderColor: `${zoneData.color}44` }}>
                <div className="flex items-center gap-5">
                  {/* The window gauge — a literal window with three panes and a "you are here" light */}
                  <div className="relative shrink-0 rounded-2xl overflow-hidden" aria-hidden style={{
                    width: 72, height: 160,
                    border: '3px solid rgba(255,255,255,0.95)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
                  }}>
                    {ZONES.map(z => (
                      <div key={z.id} className="relative" style={{
                        height: z.id === 'window' ? '44%' : '28%',
                        background: selectedZone === z.id
                          ? `linear-gradient(160deg, ${z.color}66, ${z.color}99)`
                          : `${z.color}1E`,
                        borderBottom: z.id !== 'hypo' ? '2px solid rgba(255,255,255,0.85)' : 'none',
                        transition: 'background 0.5s',
                      }}>
                        {selectedZone === z.id && (
                          <motion.div
                            className="absolute left-1/2 top-1/2 rounded-full"
                            animate={reducedMotion ? {} : { y: [-4, 4, -4], boxShadow: [`0 0 10px ${z.color}`, `0 0 22px ${z.color}`, `0 0 10px ${z.color}`] }}
                            transition={{ duration: 2.6, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                            style={{
                              width: 18, height: 18, marginLeft: -9, marginTop: -9,
                              background: `radial-gradient(circle at 35% 30%, #FFFFFF, ${z.color})`,
                              border: '2px solid rgba(255,255,255,0.9)',
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-2">{zoneData.emoji}</div>
                    <div className="text-lg font-black leading-tight" style={{ color: zoneData.color }}>{zoneData.label}</div>
                    <div className="text-xs font-bold mt-0.5" style={{ color: '#9CA3AF' }}>{zoneData.subtitle}</div>
                    <div className="text-[10px] mt-2 font-semibold" style={{ color: '#9CA3AF' }}>
                      {selectedZone === 'window' ? 'The light is in the window.' : selectedZone === 'hyper' ? 'The light sits above the window — bring it down gently.' : 'The light sits below the window — coax it up gently.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion={selectedZone === 'hyper' ? 'annoyed' : selectedZone === 'window' ? 'neutral' : 'processing'} size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} reads your state</span>
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF' }}>"{zoneData.lanceRead}"</p>
              </div>

              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: `${zoneData.color}33` }}>
                <h3 className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: zoneData.color }}>
                  {selectedZone === 'window' ? '✅ You\'re in the window — use it' : '🛠️ Interventions'}
                </h3>
                <div className="space-y-2">
                  {zoneData.interventions.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 px-3 rounded-xl"
                      style={{ background: `${zoneData.color}11` }}>
                      <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[8px] font-black mt-0.5"
                        style={{ background: zoneData.color, color: '#fff' }}>{i + 1}</div>
                      <span className="text-xs leading-snug" style={{ color: '#3C3C3C' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{intern.avatar}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#7FD98C' }}>{zoneData.internNote}</p>
              </div>

              {!logged ? (
                <button onClick={handleLog}
                  className="w-full py-3 rounded-2xl font-black text-sm"
                  style={{ background: `linear-gradient(135deg, ${zoneData.color}, #3ECFCF)`, color: '#F9FAFB' }}>
                  Log This Check-In +25 XP
                </button>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl p-3 text-center border" style={{ background: '#3ECFCF14', borderColor: '#3ECFCF44' }}>
                  <p className="text-xs font-black" style={{ color: '#3ECFCF' }}>Logged. Try one intervention and check back in.</p>
                </motion.div>
              )}

              <button onClick={() => setScreen('locate')}
                className="w-full py-2 text-xs font-bold" style={{ color: '#9CA3AF' }}>
                ← Check a different zone
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
