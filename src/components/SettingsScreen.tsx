import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ChevronRight, Users, Zap, Heart, Shield, Sliders, Volume2, VolumeX,
  RotateCcw, Trash2, BookOpen, Check,
} from 'lucide-react';
import { THE_SEVEN, readCrew, claimSlot, setActiveCastaway, activeCastaway } from '../lib/castaways';
import { loadCartridge } from '../lib/cartridge';
import SafetyCrisisSettings from './SafetyCrisisSettings';

// ═════════════════════════════════════════════════════════════════════════════
//  THE SHIP'S FITTINGS — rebuilt on the L.A.N.C.E. settings template (Lance's
//  2026-07-12 order: identical appearance across the fleet; each app keeps its
//  own items). Dark bottom sheet · profile card · sectioned rows · sub-screens
//  · Privacy & Data with Factory Reset. Only REAL switches — nothing pretends.
//  Safety & Crisis is the ONLY surface in the app carrying crisis information
//  (therapist-configured per state; blank until the safety onboarding runs).
// ═════════════════════════════════════════════════════════════════════════════

const ACCENT = '#0E7C7C'; // driftwood teal — the sheet keeps LANCE's bones, this world's color

function SectionRow({
  icon: Icon, label, sub, onPress, danger, color,
}: {
  icon: React.ElementType; label: string; sub?: string;
  onPress?: () => void; danger?: boolean; color?: string;
}) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all active:scale-[0.98] cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, marginBottom: 2 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: danger ? 'rgba(239,68,68,0.15)' : (color ? `${color}22` : 'rgba(14,124,124,0.15)') }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: danger ? '#EF4444' : (color ?? ACCENT) }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold" style={{ color: danger ? '#EF4444' : '#fff' }}>{label}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
      </div>
      {onPress && <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#475569' }} />}
    </button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-1 pt-4 pb-1">
      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#2E96B5' }}>{title}</p>
    </div>
  );
}

const card: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

type Screen = 'main' | 'crew' | 'mode' | 'sound' | 'safety' | 'cartridge' | 'data';

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<Screen>('main');
  const [, force] = useState(0);
  const [claimingSlot, setClaimingSlot] = useState<string | null>(null);
  const [claimName, setClaimName] = useState('');
  const [quiet, setQuiet] = useState<boolean>(() => {
    try { return localStorage.getItem('driftwood_quiet_v1') === '1'; } catch { return false; }
  });
  const crew = readCrew();
  const me = activeCastaway();
  const cart = loadCartridge();
  const mode = (() => { try { return localStorage.getItem('driftwood_mode') === 'checkin' ? 'checkin' : 'story'; } catch { return 'story'; } })();

  const toggleQuiet = () => {
    const next = !quiet;
    setQuiet(next);
    try { localStorage.setItem('driftwood_quiet_v1', next ? '1' : '0'); } catch { /* ignore */ }
  };

  const screenTitle: Record<Screen, string> = {
    main: 'Settings', crew: 'The Crew', mode: 'How You Begin', sound: 'Sounds',
    safety: 'Safety & Crisis', cartridge: 'Practice Cartridge', data: 'Privacy & Data',
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onBack}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[28px] overflow-hidden"
        style={{ background: '#0b1322', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '88vh' }}
        initial={{ y: '100%' }} animate={{ y: 0 }}
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
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <ChevronRight className="w-4 h-4 text-white rotate-180" />
              </button>
            )}
            <h2 className="text-lg font-black text-white">{screenTitle[screen]}</h2>
          </div>
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-10 lg:max-w-2xl lg:mx-auto lg:w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, x: screen === 'main' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: screen === 'main' ? 16 : -16 }}
              transition={{ duration: 0.18 }}
            >

              {/* ══ MAIN MENU ══════════════════════════════════════════════════ */}
              {screen === 'main' && (
                <div>
                  {/* Castaway quick card */}
                  <div
                    className="flex items-center gap-3 p-4 rounded-2xl mb-3"
                    style={{ background: 'linear-gradient(135deg,rgba(14,124,124,0.14),rgba(46,150,181,0.14))', border: '1px solid rgba(14,124,124,0.28)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(14,124,124,0.2)', border: '1px solid rgba(14,124,124,0.3)' }}
                    >
                      {THE_SEVEN.find(s => s.id === me.id)?.emoji ?? '🧑'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-black text-white">{me.name || 'Castaway'}</div>
                      <div className="text-[11px] font-bold" style={{ color: '#2E96B5' }}>
                        {THE_SEVEN.find(s => s.id === me.id)?.role ?? 'castaway'} · this device
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{crew.length} of {THE_SEVEN.length} castaways claimed</div>
                    </div>
                    <button
                      onClick={() => setScreen('crew')}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white cursor-pointer"
                      style={{ background: 'rgba(14,124,124,0.25)', border: '1px solid rgba(14,124,124,0.35)' }}
                    >
                      Edit
                    </button>
                  </div>

                  <SectionHeader title="Personalize" />
                  <SectionRow icon={Users} label="The Crew"      sub={`${crew.length} claimed · unclaimed castaways stay honest robot hands`} onPress={() => setScreen('crew')} color="#2E96B5" />
                  <SectionRow icon={Zap}   label="How You Begin" sub={mode === 'story' ? 'Story Mode — the milestones lead' : 'Check-In Mode — the daily check-in leads'} onPress={() => setScreen('mode')} color="#F2A65A" />
                  <SectionRow icon={quiet ? VolumeX : Volume2} label="Sounds" sub={quiet ? 'The quiet shore — sounds off' : 'Shore sounds on'} onPress={() => setScreen('sound')} color="#A78BFA" />

                  <SectionHeader title="System" />
                  <SectionRow icon={Shield}   label="Safety & Crisis"    sub="Set up with your therapist" onPress={() => setScreen('safety')} color="#F87171" />
                  <SectionRow icon={BookOpen} label="Practice Cartridge" sub={cart.practiceName}          onPress={() => setScreen('cartridge')} color="#7FD98C" />

                  <SectionHeader title="Admin & Data" />
                  <SectionRow icon={Sliders} label="Privacy & Data" sub="Where entries live, boarding, reset" onPress={() => setScreen('data')} color="#94A3B8" />

                  <div className="mt-4 text-center text-[10px] text-slate-600 font-mono">
                    Driftwood · loves together · works together · survives together
                  </div>
                </div>
              )}

              {/* ══ THE CREW ═══════════════════════════════════════════════════ */}
              {screen === 'crew' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl space-y-1" style={card}>
                    <p className="text-sm font-bold text-white">Seven castaways washed ashore</p>
                    <p className="text-[12px] text-slate-400 leading-relaxed">
                      Each person claims a castaway. Unclaimed slots wake as little robot hands —
                      they keep camp honestly and never pretend to be family.
                    </p>
                  </div>
                  {THE_SEVEN.map(slot => {
                    const claimed = crew.find(c => c.slotId === slot.id);
                    const isMe = me.id === slot.id;
                    return (
                      <div key={slot.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                        style={{ background: isMe ? 'rgba(14,124,124,0.12)' : 'rgba(255,255,255,0.04)', border: isMe ? '1px solid rgba(14,124,124,0.4)' : '1px solid transparent' }}>
                        <div className="text-xl w-8">{slot.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white">
                            {claimed ? claimed.name : `${slot.role} (robot hands)`}
                            {isMe && <span className="text-[9px] font-black uppercase ml-1.5" style={{ color: '#2E96B5' }}>this device</span>}
                          </div>
                          <div className="text-[11px] text-slate-500">{slot.role}</div>
                        </div>
                        {claimed ? (
                          !isMe && (
                            <button onClick={() => { setActiveCastaway(slot.id); force(x => x + 1); }}
                              className="shrink-0 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl cursor-pointer"
                              style={{ color: '#2E96B5', border: '1px solid rgba(46,150,181,0.4)' }}>
                              Play as
                            </button>
                          )
                        ) : claimingSlot === slot.id ? (
                          <span className="flex items-center gap-1.5 shrink-0">
                            <input value={claimName} onChange={e => setClaimName(e.target.value)} placeholder="name"
                              maxLength={24}
                              className="w-24 px-2 py-1.5 text-[11px] rounded-lg bg-transparent text-white outline-none"
                              style={{ border: '1px solid rgba(255,255,255,0.2)' }} />
                            <button
                              onClick={() => { if (claimName.trim()) { claimSlot(slot.id, claimName.trim()); setClaimingSlot(null); setClaimName(''); force(x => x + 1); } }}
                              className="text-[10px] font-black text-white px-2.5 py-1.5 rounded-lg cursor-pointer"
                              style={{ background: ACCENT }}>
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ) : (
                          <button onClick={() => setClaimingSlot(slot.id)}
                            className="shrink-0 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl text-slate-400 cursor-pointer"
                            style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                            Claim
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <div className="p-3 rounded-xl text-[11px] text-slate-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    Family Gatherings today are pass-the-phone or the camp-code fire. Same-map
                    multi-device play lives on the island — Light the fire on the home screen.
                  </div>
                </div>
              )}

              {/* ══ HOW YOU BEGIN ═════════════════════════════════════════════ */}
              {screen === 'mode' && (
                <div className="space-y-3">
                  {([
                    { id: 'story', label: 'Story Mode', desc: 'Survive the island together — the 31 milestones lead.', icon: Zap, color: '#F2A65A' },
                    { id: 'checkin', label: 'Check-In Mode', desc: 'The daily check-in leads; the island waits for you.', icon: Heart, color: '#2E96B5' },
                  ] as const).map(m => {
                    const active = mode === m.id;
                    const Icon = m.icon;
                    return (
                      <button key={m.id}
                        onClick={() => { try { localStorage.setItem('driftwood_mode', m.id); } catch { /* session */ } force(x => x + 1); }}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all cursor-pointer"
                        style={{
                          background: active ? `${m.color}1E` : 'rgba(255,255,255,0.04)',
                          border: active ? `1px solid ${m.color}66` : '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${m.color}22` }}>
                          <Icon className="w-5 h-5" style={{ color: m.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-black text-white">{m.label}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                        </div>
                        {active && <Check className="w-4 h-4 shrink-0" style={{ color: m.color }} />}
                      </button>
                    );
                  })}
                  <div className="p-3 rounded-xl text-[11px] text-slate-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    Either mode keeps every tool open — this only picks which room greets you.
                  </div>
                </div>
              )}

              {/* ══ SOUNDS ═════════════════════════════════════════════════════ */}
              {screen === 'sound' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl" style={card}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {quiet ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4" style={{ color: ACCENT }} />}
                        <div>
                          <p className="text-sm font-bold text-white">Shore Sounds</p>
                          <p className="text-[11px] text-slate-400">The bell, the creak, the ember pop</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleQuiet}
                        className="relative shrink-0 w-12 h-6 rounded-full transition-all duration-200 cursor-pointer"
                        style={{ background: !quiet ? 'linear-gradient(135deg,#0E7C7C,#2E96B5)' : 'rgba(255,255,255,0.1)' }}
                        role="switch" aria-checked={!quiet} aria-label="Shore sounds"
                      >
                        <motion.div animate={{ x: !quiet ? 24 : 2 }} transition={{ duration: 0.2 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl text-[11px] text-slate-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    The quiet shore never hides a tool — it only silences the ambience.
                  </div>
                </div>
              )}

              {/* ══ SAFETY & CRISIS — therapist-configured, settings-only ═════ */}
              {screen === 'safety' && (
                <SafetyCrisisSettings
                  onOpenSafetyPlan={() => {
                    window.dispatchEvent(new CustomEvent('driftwood:open-tool', { detail: { toolId: 'crisis_safety_plan' } }));
                    onBack();
                  }}
                />
              )}

              {/* ══ PRACTICE CARTRIDGE ════════════════════════════════════════ */}
              {screen === 'cartridge' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl space-y-1" style={card}>
                    <p className="text-sm font-bold text-white">🧠 {cart.practiceName}{cart.id === 'house-family-curriculum' ? ' (the default)' : ''}</p>
                    <p className="text-[12px] text-slate-400 leading-relaxed">{cart.authorNote}</p>
                  </div>
                  <div className="p-3 rounded-xl text-[11px] text-slate-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    A therapist's own cartridge arrives through the companion bridge in a future
                    build. The base layer never varies — no cartridge touches the safety
                    protocol, and none plays a real person.
                  </div>
                </div>
              )}

              {/* ══ PRIVACY & DATA ════════════════════════════════════════════ */}
              {screen === 'data' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl space-y-1" style={card}>
                    <p className="text-sm font-bold text-white">Your Data</p>
                    <p className="text-[12px] text-slate-400">
                      Entries live on this device, and only here — no accounts, no recordings,
                      no cloud copies, no analytics. Practice alongside real care, never a replacement.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Run the boarding again? Your entries stay; only the opening replays.')) {
                        try { localStorage.removeItem('driftwood_boarded_v1'); } catch { /* ignore */ }
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
                  >
                    <Trash2 className="w-4 h-4 text-amber-400" />
                    <div className="text-left">
                      <div className="text-sm font-bold text-amber-400">Run the Boarding Again</div>
                      <div className="text-[11px] text-slate-500">Replays the opening — entries stay</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Factory reset? This clears ALL Driftwood data on this device — crew, milestones, entries, the safety protocol — and cannot be undone.')) {
                        try { localStorage.clear(); } catch { /* ignore */ }
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <RotateCcw className="w-4 h-4 text-red-400" />
                    <div className="text-left">
                      <div className="text-sm font-bold text-red-400">Factory Reset</div>
                      <div className="text-[11px] text-slate-500">Clears all island data and starts fresh</div>
                    </div>
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
