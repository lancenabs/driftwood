import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Smile, Trash2 } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface SanctuaryEntry {
  id: string;
  date: string;
  text: string;
  soundtrack: string;
}

const SOUNDTRACKS = [
  { id: 'jungle', name: 'Jungle', icon: '🌲', bg: '/sanctuary-bg/jungle.webp' },
  { id: 'waves', name: 'Waves', icon: '🌊', bg: '/sanctuary-bg/waves.webp' },
  { id: 'rain', name: 'Rain', icon: '🌧️', bg: '/sanctuary-bg/rain.webp' },
  { id: 'campfire', name: 'Fire', icon: '🔥', bg: '/sanctuary-bg/campfire.webp' },
];

const STORAGE_KEY = 'lance_safe_place_v1';

function load(): SanctuaryEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(entries: SanctuaryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

interface Props { onBack: () => void; }

export default function SafePlaceSanctuary({ onBack }: Props) {
  const { addXp } = useGame();
  const [entries, setEntries] = useState<SanctuaryEntry[]>(load);
  const [text, setText] = useState('');
  const [soundtrack, setSoundtrack] = useState('jungle');
  const [phase, setPhase] = useState<'writing' | 'guided'>(entries.length > 0 ? 'guided' : 'writing');

  const active = entries[0] ?? null;

  const beginGuided = () => {
    if (!text.trim()) return;
    const entry: SanctuaryEntry = {
      id: `sanctuary_${Date.now()}`,
      date: new Date().toISOString(),
      text: text.trim(),
      soundtrack,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    save(updated);
    addXp(30);
    setText('');
    setPhase('guided');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    save(updated);
    if (updated.length === 0) setPhase('writing');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F0F0F0' }}>
        <BigBackButton onBack={onBack} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Safe Place Sanctuary</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Trauma focus · guided imagery</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: '#F0F0F0' }}>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#059669' }}>Guided Imagery</span>
            </div>
            <Compass className="w-5 h-5" style={{ color: '#10B981' }} />
          </div>

          <p className="text-[11.5px] leading-relaxed font-semibold mb-4" style={{ color: '#6B7280' }}>
            Plot the exact sensory coordinates of a secure, imagined sanctuary. Under distress, your nervous system responds to sensory cues — train it to anchor in safety here.
          </p>

          {phase === 'writing' ? (
            <div className="space-y-3">
              <div>
                <label className="text-[8.5px] uppercase tracking-wider font-extrabold block mb-1" style={{ color: '#9CA3AF' }}>Describe your sensory coordinates</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g., A quiet moss-covered clearing in the woods, under amber evening clouds, with the gentle sound of rain and the warmth of a small campfire on my skin..."
                  className="w-full h-24 p-3 rounded-2xl text-[11.5px] font-semibold outline-none resize-none border"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', borderColor: '#F0F0F0' }}
                />
              </div>

              <div>
                <label className="text-[8.5px] uppercase tracking-wider font-extrabold block mb-1.5" style={{ color: '#9CA3AF' }}>Anchor soundtrack</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SOUNDTRACKS.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSoundtrack(item.id)}
                      className="p-2 rounded-xl text-center border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      style={soundtrack === item.id
                        ? { background: '#10B98118', borderColor: '#10B981', color: '#059669' }
                        : { background: '#F9FAFB', borderColor: '#F0F0F0', color: '#6B7280' }}
                    >
                      <div className="text-base mb-1">{item.icon}</div>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={beginGuided}
                disabled={!text.trim()}
                className="w-full py-3 rounded-2xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                Begin Guided Sanctuary Safe-Dive
              </button>

              {entries.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPhase('guided')}
                  className="w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  style={{ background: '#F3F4F6', color: '#4B5563' }}
                >
                  ← Back to my sanctuary
                </button>
              )}
            </div>
          ) : active ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl h-44 relative overflow-hidden flex flex-col justify-between sanctuary-drift"
                style={{
                  backgroundImage: `linear-gradient(160deg, rgba(6,30,26,0.82), rgba(4,13,10,0.9)), url(${SOUNDTRACKS.find(s => s.id === active.soundtrack)?.bg ?? SOUNDTRACKS[0].bg})`,
                  backgroundRepeat: 'no-repeat',
                  border: '1px solid #064e3b',
                  boxShadow: '0 10px 30px rgba(6,78,59,0.35)',
                }}>
                {/* Living backdrop — the still comes alive as a seamless ambient loop.
                    poster = the same still, so a slow connection (or reduced motion,
                    where we skip the video entirely) is indistinguishable from before. */}
                {!(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) && (
                  <video
                    key={active.soundtrack}
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: 'cover', zIndex: 0 }}
                    src={`/sanctuary-loops/${active.soundtrack}.mp4`}
                    poster={SOUNDTRACKS.find(s => s.id === active.soundtrack)?.bg}
                    autoPlay muted loop playsInline
                    onError={e => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; }}
                  />
                )}
                <div aria-hidden className="absolute inset-0" style={{
                  background: 'linear-gradient(160deg, rgba(6,30,26,0.72), rgba(4,13,10,0.82))', zIndex: 1,
                }} />
                <div className="flex justify-center mt-3 relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: '#10B98118', border: '1px solid #34D39944', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}
                  >
                    <Smile className="w-5 h-5" style={{ color: '#34D399' }} />
                  </motion.div>
                </div>

                <p className="text-[11px] italic text-center font-semibold leading-relaxed relative z-10 px-2 line-clamp-3" style={{ color: '#D1D5DB' }}>
                  "{active.text}"
                </p>

                <div className="flex justify-between items-center text-[8.5px] font-mono uppercase tracking-widest leading-none pt-2 border-t relative z-10"
                  style={{ color: '#34D399CC', borderColor: '#064e3b' }}>
                  <span>Soundtrack: {active.soundtrack.toUpperCase()}</span>
                  <span>Breathe in step with the light</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setText(active.text); setSoundtrack(active.soundtrack); setPhase('writing'); }}
                className="w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                style={{ background: '#F3F4F6', color: '#4B5563' }}
              >
                Edit sanctuary coordinates
              </button>
            </div>
          ) : null}
        </div>

        {entries.length > 1 && (
          <div className="rounded-2xl p-4 border space-y-2" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Past sanctuaries</p>
            {entries.slice(1).map(e => (
              <div key={e.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl" style={{ background: '#F9FAFB' }}>
                <p className="text-[11px] truncate flex-1" style={{ color: '#4B5563' }}>{e.text}</p>
                <button onClick={() => deleteEntry(e.id)} className="p-1 rounded shrink-0" style={{ color: '#EF4444' }}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
