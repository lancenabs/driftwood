import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Zap, Heart, SkipForward, Plus, Check } from 'lucide-react';
import { THE_SEVEN, claimSlot, setActiveCastaway, readCrew, writeRelationship } from '../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE BOARDING — Driftwood's opening, on the L.A.N.C.E. onboarding template
//  (the Bible): splash video → story cinematic → the family claims their
//  castaways → THE CHOICE (Story mode vs Check-in), dark cinematic cards,
//  switchable in Settings. Safety/crisis content lives ONLY in Settings →
//  Safety & Crisis (therapist-configured per state — the 2026-07-12 law);
//  the boarding carries none.
//
//  Video slots auto-light when Lance's renders land (honest fallback: the
//  boarding painting). Slots:
//    /shore/onboard_ship.mp4    — the Ship of Separate Rooms (cold open)
//    /shore/onboard_storm.mp4   — the storm
//    /shore/onboard_shore.mp4   — waking on the tide line
// ═════════════════════════════════════════════════════════════════════════════

const VIDEO = {
  ship: '/shore/onboard_ship.mp4',
  storm: '/shore/onboard_storm.mp4',
  shore: '/shore/onboard_shore.mp4',
};
const FALLBACK_ART = '/shore/boarding_hero.jpg';

// THE COLD OPEN — THE_TIDE_LINE.md canon, playable
// `art`: the commissioned Ken Burns still (ASSET_PROMPTS_V3) — slow-zooms
// over the beat when the file exists; the video/painting carry it otherwise.
const CINEMATIC: { speaker: string; color: string; location: string; text: string; video: keyof typeof VIDEO; art?: string }[] = [
  {
    speaker: 'THE DOCK', color: '#9CC3D5', location: 'PIER 4 · MORNING · THE FAMILY TOUR',
    text: 'The brochure said ISLAND ADVENTURE — A DAY TO RECONNECT. The family arrives the way they arrive everywhere lately: together, and in separate rooms. Two phones out. One argument already half-finished from the car, warming up for its hundredth performance.',
    video: 'ship',
    art: '/story/act1/01_the_dock.jpg',
  },
  {
    speaker: 'THE ARGUMENT', color: '#D14545', location: 'PIER 4 · THE SAME FIGHT',
    text: '"You PROMISED you\'d leave work at home—" "Somebody has to PAY for—" "Can we not. CAN WE NOT." "Nobody even asked what I wanted to do today." Four voices, one knot. The youngest counts seagulls and pretends not to hear, which is a skill nobody should have to be good at.',
    video: 'ship',
    art: '/story/act1/01_the_dock.jpg',
  },
  {
    speaker: 'MR. BAUER', color: '#E7C892', location: 'THE GANGWAY · THE GUIDE',
    text: 'The guide is waiting at the boat like he\'s been waiting longer than a morning. Weathered hands. Eyes that do a headcount of the family and land somewhere deeper than a headcount. "Mr. Bauer," he says. "I take families to the island. Just families. It only works on families." Odd thing to say. He says it like a man who has seen this exact argument board this exact boat before.',
    video: 'ship',
    art: '/story/act1/02_bauer_wheel.jpg',
  },
  {
    speaker: 'THE STORM', color: '#7A8FB5', location: 'OPEN WATER · NO WARNING',
    text: 'It comes over the horizon like a decision. The sky goes green-black. Bauer\'s voice changes registers — the tour-guide is gone; something older takes the wheel. "LIFE JACKETS. NOW. All of you — to the mast line."',
    video: 'storm',
    art: '/story/act1/03_storm_wall.jpg',
  },
  {
    speaker: 'MR. BAUER', color: '#E7C892', location: 'THE MAST LINE · HIS LAST ORDER',
    text: 'He lashes the family\'s hands to one rope, hand over hand over hand, and puts both of his over all of theirs. "HOLD THE LINE. Not the rail — EACH OTHER. Whatever the sea takes, it does not get to take the LINE—" Lightning. The wheel spinning. His silhouette going back for it.',
    video: 'storm',
    art: '/story/act1/04_hold_the_line.jpg',
  },
  {
    speaker: ' ', color: '#0A1512', location: ' ',
    text: '…',
    video: 'storm',
  },
  {
    speaker: 'THE TIDE LINE', color: '#F2A65A', location: 'THE ISLAND · THE GREY BEFORE DAWN',
    text: 'Sand. Rain-light. The sound of a sea pretending nothing happened. The family wakes scattered down one shoreline — soaked, bruised, alive, still holding one rope with no boat on the end of it. They count heads the way you count when you cannot breathe until the number is right. The number is right. All of them. Except—',
    video: 'shore',
    art: '/story/act1/05_tide_line.jpg',
  },
  {
    speaker: 'THE COMPASS', color: '#E7C892', location: 'THE WRECK LINE · WHAT WASHED UP',
    text: 'Mr. Bauer is not on the beach. Not in the shallows. Not anywhere a voice can reach. What washes up instead, glinting in the tide junk, is his brass compass — heavy, old, engraved with letters gone soft: TO M.B. — COME HOME. The needle does not point north. It points INLAND, toward the jungle, steady as a held breath. And from the treeline — small, wooden, gone the second anyone looks — something watches the family count heads.',
    video: 'shore',
    art: '/story/act1/06_compass_ashore.jpg',
  },
];

// ── Typewriter (the Bible's) ──────────────────────────────────────────────────
function TypewriterText({ text, speed = 24, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);
  useEffect(() => {
    setDisplayed(''); setDone(false); idxRef.current = 0;
    const id = setInterval(() => {
      if (idxRef.current >= text.length) { clearInterval(id); setDone(true); onComplete?.(); return; }
      setDisplayed(text.slice(0, idxRef.current + 1));
      idxRef.current++;
    }, speed);
    return () => clearInterval(id);
  }, [text]); // eslint-disable-line
  const skip = () => { setDisplayed(text); setDone(true); idxRef.current = text.length; onComplete?.(); };
  return (
    <span onClick={skip} className="cursor-pointer select-none">
      <span style={{ whiteSpace: 'pre-wrap' }}>{displayed}</span>
      {!done && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.65, repeat: Infinity }} style={{ color: '#F2A65A' }}>▋</motion.span>}
    </span>
  );
}

// ── Speech panel (the Bible's glass) ──────────────────────────────────────────
function SpeechPanel({ speakerColor, speakerLabel, locationLine, text, onNext, nextLabel, children }: {
  speakerColor: string; speakerLabel: string; locationLine?: string;
  text?: string; onNext?: () => void; nextLabel?: string; children?: React.ReactNode;
}) {
  const [typeDone, setTypeDone] = useState(false);
  useEffect(() => { setTypeDone(false); }, [text]);
  return (
    <div style={{
      background: 'rgba(8,14,12,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderTop: `2px solid ${speakerColor}44`, boxShadow: `0 -12px 56px rgba(0,0,0,0.7), inset 0 1px 0 ${speakerColor}18`,
    }}>
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${speakerColor}BB,transparent)` }} />
      <div className="px-5 pt-4 pb-6 space-y-3">
        {locationLine && (
          <div className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: `${speakerColor}66` }}>{locationLine}</div>
        )}
        <div className="flex items-center gap-2">
          <motion.div animate={{ boxShadow: [`0 0 6px ${speakerColor}`, `0 0 12px ${speakerColor}`, `0 0 6px ${speakerColor}`] }}
            transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: speakerColor }} />
          <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: speakerColor }}>{speakerLabel}</span>
        </div>
        {text ? (
          <p className="text-[15px] font-semibold leading-relaxed" style={{ color: '#F2EEE4', minHeight: '4rem' }}>
            <TypewriterText text={text} onComplete={() => setTypeDone(true)} />
          </p>
        ) : <div>{children}</div>}
        {onNext && (text ? typeDone : true) && (
          <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={onNext} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#0E7C7C,#2E96B5)', color: '#fff', boxShadow: '0 4px 28px rgba(14,124,124,0.45)' }}>
            {nextLabel ?? 'Continue'}<ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ── Background: art still (Ken Burns) → video → the honest painting, in that
// order of preference; whatever exists carries the scene, nothing fakes it. ──
function SceneBackdrop({ video, art }: { video: string; art?: string }) {
  const [videoOk, setVideoOk] = useState(true);
  const [artOk, setArtOk] = useState(true);
  useEffect(() => { setVideoOk(true); }, [video]);
  useEffect(() => { setArtOk(true); }, [art]);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0A1512' }}>
      <img src={FALLBACK_ART} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-45" />
      {videoOk && (!art || !artOk) && (
        <video key={video} src={video} autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.85 }}
          onError={() => setVideoOk(false)} />
      )}
      {art && artOk && (
        <img key={art} src={art} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover story-kenburns"
          style={{ opacity: 0.92 }}
          onError={() => setArtOk(false)} />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,21,18,0.35), rgba(10,21,18,0.15) 45%, rgba(10,21,18,0.75))' }} />
    </div>
  );
}

type Phase = 'splash' | 'cinematic' | 'crew' | 'language' | 'mode';
interface Member { slotId: string; name: string; age: 'adult' | 'young'; tint?: string }

// Skin tones for the island avatar — chosen per member, never asked in words.
// The first chip is "island light" (no tint: the mesh's own material).
const SKIN_TONES = ['#F6D7C4', '#E8B98F', '#C98E5A', '#A26B3F', '#7A4B2A', '#4A2F20'];

export default function BoardingStory({ onStart }: { onStart: () => void }) {
  const [phase, setPhase] = useState<Phase>('splash');
  const [beat, setBeat] = useState(0);
  const [members, setMembers] = useState<Member[]>([{ slotId: THE_SEVEN[0].id, name: '', age: 'adult' }]);

  const phaseIndex: Record<Phase, number> = { splash: 0, cinematic: 1, crew: 2, language: 3, mode: 4 };
  const totalDots = 5;

  const claimAll = () => {
    const named = members.filter(m => m.name.trim());
    for (const m of named) claimSlot(m.slotId, m.name.trim(), { age: m.age, tint: m.tint });
    if (named.length) setActiveCastaway(named[0].slotId);
    else if (!readCrew().length) { claimSlot(THE_SEVEN[0].id, 'Castaway'); setActiveCastaway(THE_SEVEN[0].id); }
  };
  // the language step only exists where relationship words could apply:
  // two or more named adults (a couple, or the couple inside a family)
  const adultsNamed = members.filter(m => m.name.trim() && m.age === 'adult').length;
  const afterCrew = () => { claimAll(); setPhase(adultsNamed >= 2 ? 'language' : 'mode'); };
  const finish = (mode: 'checkin' | 'story') => {
    try { localStorage.setItem('driftwood_mode', mode); } catch { /* choice still applies this session */ }
    onStart();
  };

  const cine = CINEMATIC[Math.min(beat, CINEMATIC.length - 1)];
  const usedSlots = new Set(members.map(m => m.slotId));

  return (
    <div className="fixed inset-0 z-[90] flex flex-col overflow-hidden">
      <SceneBackdrop video={phase === 'cinematic' ? VIDEO[cine.video] : VIDEO.shore} art={phase === 'cinematic' ? cine.art : undefined} />

      {/* progress dots + honest skip (crisis strip stays above via App) */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-9">
        <div className="flex gap-1.5">
          {Array.from({ length: totalDots }).map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all"
              style={{ width: i === phaseIndex[phase] ? 22 : 8, background: i <= phaseIndex[phase] ? '#F2A65A' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
        {phase !== 'mode' && (
          <button onClick={() => setPhase(phase === 'crew' || phase === 'language' ? 'mode' : 'crew')}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white/50 cursor-pointer">
            <SkipForward className="w-3 h-3" /> skip
          </button>
        )}
      </div>

      <div className="relative z-10 flex-1" />

      {/* Content column — capped on desktop so the boarding never reads as
          stretched mobile (the panels float as a centered card ≥lg). */}
      <div className="relative z-10 w-full lg:max-w-xl lg:mx-auto lg:pb-10 lg:[&>div>div]:rounded-3xl lg:[&>div>div]:overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── SPLASH ── */}
          {phase === 'splash' && (
            <motion.div key="splash" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="px-6 pb-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">a family survival story</p>
                <h1 className="font-display font-black text-5xl text-white drop-shadow-lg">Driftwood</h1>
                <p className="text-sm text-white/85 mt-2 font-semibold leading-relaxed">A family that loves together.<br/>A family that works together.<br/>A family that survives together.</p>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setBeat(0); setPhase('cinematic'); }}
                  className="mt-7 w-full py-4 rounded-2xl font-black text-sm text-white cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#0E7C7C,#2E96B5)', boxShadow: '0 4px 28px rgba(14,124,124,0.5)' }}>
                  Begin the crossing
                </motion.button>
                <p className="text-[9px] text-white/40 mt-3 uppercase tracking-widest">no accounts · entries live on this device</p>
              </div>
            </motion.div>
          )}

          {/* ── CINEMATIC — the cold open ── */}
          {phase === 'cinematic' && (
            <motion.div key={`cine-${beat}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SpeechPanel speakerColor={cine.color} speakerLabel={cine.speaker} locationLine={cine.location} text={cine.text}
                onNext={() => (beat < CINEMATIC.length - 1 ? setBeat(beat + 1) : setPhase('crew'))}
                nextLabel={beat < CINEMATIC.length - 1 ? 'Continue' : 'Wade ashore'} />
            </motion.div>
          )}

          {/* ── THE CREW — the family claims their castaways ── */}
          {phase === 'crew' && (
            <motion.div key="crew" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(8,14,12,0.97)', backdropFilter: 'blur(24px)', borderTop: '2px solid rgba(242,166,90,0.35)', maxHeight: '68vh', overflowY: 'auto' }}>
              <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,#F2A65ABB,transparent)' }} />
              <div className="px-5 pt-4 pb-8 space-y-3">
                <div className="text-[9px] font-black uppercase tracking-[0.28em] text-amber-200/60">THE TIDE LINE · SEVEN CASTAWAYS WASHED ASHORE</div>
                <h2 className="text-lg font-black text-white">Who made it to the beach?</h2>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Each person in the family claims a castaway — a name and a role. Add everyone who'll
                  play (a couple, or the whole crew). Unclaimed castaways wake as little robot hands:
                  they keep camp honestly and never pretend to be family.
                </p>
                {members.map((m, i) => {
                  const slot = THE_SEVEN.find(s => s.id === m.slotId)!;
                  return (
                    <div key={i} className="rounded-2xl border border-white/15 bg-white/5 p-3 space-y-2">
                      <div className="flex gap-2">
                        <input value={m.name}
                          onChange={e => setMembers(ms => ms.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                          placeholder={i === 0 ? 'First name (you)' : 'First name'}
                          maxLength={24}
                          className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-bold text-white placeholder:text-white/35 focus:outline-none focus:border-amber-300" />
                        {/* the one quiet toggle — it frames the story and keeps
                            the register kid-safe; never a bigger question */}
                        <div className="flex rounded-xl border border-white/20 overflow-hidden shrink-0" data-testid={`age-toggle-${i}`}>
                          <button onClick={() => setMembers(ms => ms.map((x, j) => j === i ? { ...x, age: 'adult' } : x))}
                            title="Adult castaway"
                            className={`px-2.5 text-sm cursor-pointer ${m.age === 'adult' ? 'bg-amber-300/25' : 'bg-white/5 opacity-50'}`}>🧑</button>
                          <button onClick={() => setMembers(ms => ms.map((x, j) => j === i ? { ...x, age: 'young' } : x))}
                            title="Young castaway"
                            className={`px-2.5 text-sm cursor-pointer ${m.age === 'young' ? 'bg-amber-300/25' : 'bg-white/5 opacity-50'}`}>🧒</button>
                        </div>
                        {members.length > 1 && (
                          <button onClick={() => setMembers(ms => ms.filter((_, j) => j !== i))}
                            className="px-3 rounded-xl text-white/40 text-xs font-black cursor-pointer">✕</button>
                        )}
                      </div>
                      {/* skin tone for the island avatar — a look you pick,
                          never a question you answer. Optional. */}
                      <div className="flex items-center gap-1.5" data-testid={`tone-row-${i}`}>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40 mr-0.5">island look</span>
                        {SKIN_TONES.map(t => (
                          <button key={t}
                            onClick={() => setMembers(ms => ms.map((x, j) => j === i ? { ...x, tint: x.tint === t ? undefined : t } : x))}
                            title="Skin tone for your island avatar"
                            className="w-5 h-5 rounded-full cursor-pointer transition-transform"
                            style={{ background: t, border: m.tint === t ? '2px solid #FCD34D' : '2px solid rgba(255,255,255,0.25)', transform: m.tint === t ? 'scale(1.2)' : 'none' }} />
                        ))}
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {THE_SEVEN.map(s => {
                          const taken = usedSlots.has(s.id) && m.slotId !== s.id;
                          return (
                            <button key={s.id} disabled={taken}
                              onClick={() => setMembers(ms => ms.map((x, j) => j === i ? { ...x, slotId: s.id } : x))}
                              title={`${s.role} — ${s.blurb}`}
                              className={`shrink-0 w-16 rounded-xl border p-1.5 text-center cursor-pointer transition-all ${
                                m.slotId === s.id ? 'border-amber-300 bg-amber-300/15' : taken ? 'border-white/5 opacity-25' : 'border-white/15 bg-white/5'}`}>
                              <span className="text-xl block">{s.emoji}</span>
                              <span className="text-[7px] font-black uppercase tracking-tight text-white/70 block leading-tight">{s.role}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[9px] text-white/45 italic">{slot.blurb}</p>
                    </div>
                  );
                })}
                {members.length < THE_SEVEN.length && (
                  <button onClick={() => {
                    const free = THE_SEVEN.find(s => !usedSlots.has(s.id));
                    if (free) setMembers(ms => [...ms, { slotId: free.id, name: '', age: 'adult' }]);
                  }}
                    className="w-full py-2.5 rounded-xl border border-dashed border-white/25 text-[11px] font-black text-white/60 flex items-center justify-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add a family member
                  </button>
                )}
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={afterCrew}
                  disabled={!members.some(m => m.name.trim())}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg,#0E7C7C,#2E96B5)', boxShadow: '0 4px 28px rgba(14,124,124,0.45)' }}>
                  <Check className="w-4 h-4" /> Make landfall
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── THE WORDS — how the island speaks about you (a language choice,
              chosen once, changeable in Settings; never a category) ── */}
          {phase === 'language' && (
            <motion.div key="language" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(8,14,12,0.97)', backdropFilter: 'blur(24px)', borderTop: '2px solid rgba(242,166,90,0.35)' }}>
              <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,#F2A65ABB,transparent)' }} />
              <div className="px-5 pt-4 pb-8 space-y-3">
                <div className="text-[9px] font-black uppercase tracking-[0.28em] text-amber-200/60">THE ISLAND LEARNS YOUR WORDS</div>
                <h2 className="text-lg font-black text-white">How should the island speak about you?</h2>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  The robots will use whichever words are yours. This only changes language — nothing else.
                </p>
                <div className="grid grid-cols-1 gap-2" data-testid="language-choices">
                  {([
                    { label: 'husbands' as const,     line: 'Husbands',        sub: '"…and tell your husband what you noticed."' },
                    { label: 'wives' as const,        line: 'Wives',           sub: '"…and tell your wife what you noticed."' },
                    { label: 'husband-wife' as const, line: 'Husband & wife',  sub: 'the island uses each of your words for the other' },
                    { label: 'partners' as const,     line: 'Partners',        sub: '"…and tell your partner what you noticed."' },
                    { label: 'names-only' as const,   line: 'Just our names',  sub: 'the island only ever calls you by name' },
                  ]).map(opt => (
                    <button key={opt.label}
                      onClick={() => { writeRelationship(opt.label); setPhase('mode'); }}
                      className="w-full text-left rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-3 cursor-pointer transition-colors">
                      <div className="text-sm font-black text-white">{opt.line}</div>
                      <div className="text-[10px] text-white/50 italic mt-0.5">{opt.sub}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => { writeRelationship('names-only'); setPhase('mode'); }}
                  className="w-full text-center text-[10px] font-bold text-white/40 py-1 cursor-pointer">
                  Skip — names are enough
                </button>
              </div>
            </motion.div>
          )}

          {/* ── THE CHOICE — the Bible's mode screen, worn by the island ── */}
          {phase === 'mode' && (
            <motion.div key="mode" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: 'rgba(8,14,12,0.98)', backdropFilter: 'blur(28px)', borderTop: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 -16px 64px rgba(0,0,0,0.8)' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(242,166,90,0.5),rgba(14,124,124,0.5),transparent)' }} />
                <div className="px-5 pt-5 pb-8 space-y-4">
                  <div className="text-center space-y-1">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/35">Landfall complete</div>
                    <h2 className="text-xl font-black text-white">How would you like to begin?</h2>
                    <p className="text-[11px] text-white/50">You can switch modes any time in Settings.</p>
                  </div>

                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => finish('story')}
                    className="w-full text-left rounded-3xl overflow-hidden relative cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#F2683A,#D14545)', boxShadow: '0 8px 32px rgba(242,104,58,0.35)', border: '1.5px solid rgba(255,170,110,0.4)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,0.15),transparent)', pointerEvents: 'none' }} />
                    <div className="px-5 py-4 flex items-center gap-4 relative">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <Zap className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-white text-base leading-tight">Story Mode</div>
                        <div className="text-sm mt-0.5 leading-relaxed text-white/80">
                          Survive the island together. 31 milestones across five seasons — every one a real
                          family skill, told by the driftwood robots.
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-wider mt-2 text-amber-100/90">
                          ▶ Begins with Season I: The Wreck
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white shrink-0" />
                    </div>
                  </motion.button>

                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => finish('checkin')}
                    className="w-full text-left rounded-3xl overflow-hidden relative cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#0E7C7C,#2E96B5)', boxShadow: '0 8px 32px rgba(14,124,124,0.35)', border: '1.5px solid rgba(120,210,200,0.35)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,0.12),transparent)', pointerEvents: 'none' }} />
                    <div className="px-5 py-4 flex items-center gap-4 relative">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-white text-base leading-tight">Check-In Mode</div>
                        <div className="text-sm mt-0.5 leading-relaxed text-white/80">
                          Start with daily check-ins, the family tools, and the campfire games right away.
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-wider mt-2 text-teal-100/90">
                          ▶ Goes straight to your check-in
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white shrink-0" />
                    </div>
                  </motion.button>

                  <p className="text-center text-[9px] uppercase tracking-widest text-white/25">
                    Either path gives the family full access to every tool
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
