import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import StoryArtPanel from '../ui/StoryArtPanel';

interface DreamEntry {
  id: string;
  date: string;
  title: string;
  narrative: string;
  emotionDuring: string;
  emotionWaking: string;
  symbols: string[];
  personalMeaning: string;
}

const STORAGE_KEY = 'lance_dreams_v1';
function load(): DreamEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(e: DreamEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }

const SYMBOL_GLOSSARY: { symbol: string; emoji: string; meaning: string }[] = [
  { symbol: 'Water', emoji: '🌊', meaning: 'Emotions, the unconscious, flow of life, purification, or overwhelm depending on state.' },
  { symbol: 'Flying', emoji: '🕊️', meaning: 'Freedom, transcendence, desire to escape, elevated perspective, or spiritual aspiration.' },
  { symbol: 'Falling', emoji: '⬇️', meaning: 'Loss of control, anxiety, fear of failure, or letting go of a situation.' },
  { symbol: 'Teeth falling out', emoji: '🦷', meaning: 'Anxiety about appearance, communication, loss, or a transition where something must be given up.' },
  { symbol: 'Being chased', emoji: '🏃', meaning: 'Avoidance — something you\'re running from in waking life. Often an emotion or unresolved situation.' },
  { symbol: 'Doors / thresholds', emoji: '🚪', meaning: 'Opportunity, transition, choice, or a new chapter about to begin or being resisted.' },
  { symbol: 'House / building', emoji: '🏠', meaning: 'The self, the psyche, or your life structure. Different rooms = different aspects of self.' },
  { symbol: 'Death', emoji: '💀', meaning: 'Transformation, endings, letting go — rarely about literal death. Often signals major change.' },
  { symbol: 'Animals', emoji: '🐺', meaning: 'Instinct, shadow self, natural drives — depends on the animal type and how it appears.' },
  { symbol: 'Being naked', emoji: '😳', meaning: 'Vulnerability, authenticity, fear of exposure, or being seen for who you truly are.' },
  { symbol: 'Dark / unknown space', emoji: '🌑', meaning: 'The unconscious, the unknown, mystery — not inherently threatening, but unexplored.' },
  { symbol: 'Children', emoji: '🧒', meaning: 'Innocence, inner child, new beginnings, creative potential, or unmet childhood needs.' },
  { symbol: 'Fire', emoji: '🔥', meaning: 'Transformation, passion, anger, destruction and renewal, or purification.' },
  { symbol: 'Road / path', emoji: '🛤️', meaning: 'Life direction, choices ahead, the journey itself, or uncertainty about which way to go.' },
  { symbol: 'School / test', emoji: '📝', meaning: 'Performance anxiety, feeling evaluated, unresolved learning, or self-assessment in waking life.' },
  { symbol: 'Ocean', emoji: '🌊', meaning: 'The unconscious in its vast form. Depth of feeling, the unknown, or collective experience.' },
];

const EMOTIONS = ['Fear', 'Joy', 'Confusion', 'Peace', 'Sadness', 'Anger', 'Awe', 'Anxiety', 'Love', 'Dread', 'Wonder', 'Grief', 'Excitement', 'Longing'];

// Real moon phase for the dream's night — each journal page gets stamped with
// the moon that actually hung over it. (Synodic month ≈ 29.53 days from the
// 2000-01-06 new moon.)
const MOON_PHASES = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
const MOON_NAMES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
function moonPhase(dateIso: string): { emoji: string; name: string } {
  const epoch = Date.UTC(2000, 0, 6, 18, 14);
  const days = (new Date(dateIso + 'T12:00:00Z').getTime() - epoch) / 86400000;
  const idx = Math.round(((days % 29.53059) / 29.53059) * 8) % 8;
  const i = (idx + 8) % 8;
  return { emoji: MOON_PHASES[i], name: MOON_NAMES[i] };
}

const LANCE_LINES = [
  "Dream logged. Jungian analysis treats dreams as communications from the unconscious — compensatory messages that balance the one-sided perspective of waking consciousness. The symbols are a language your psyche already speaks.",
  "Filed. The scientific consensus on dream function remains contested, but the clinical utility of dream journaling is well-supported: it improves self-understanding, emotional processing, and insight. You just practiced that.",
  "Recorded. Dreams rarely mean exactly what they depict. They use symbolic language. Your personal association with a symbol is often more clinically relevant than a universal interpretation.",
  "Noted. The emotion you woke with is frequently a truer reading than the content. Recurring emotional signatures in dreams often point to something in waking life needing attention.",
];

const INTERN_LINES = [
  "Dreams are one of the few places the unconscious gets to just... say things. That imagery came from somewhere real in you. Your interpretation is the important part.",
  "I love that you wrote this down. Most dreams dissolve within minutes of waking. You gave this one a chance to be understood.",
  "Whatever your dream was pointing at — your personal meaning at the bottom is what matters most. You know you best.",
  "Dreams are weird and beautiful and confusing. And also sometimes really useful. I'm glad you took the time to sit with this one.",
];

interface Props { onBack: () => void; }

export default function DreamDecoder({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<DreamEntry[]>(load);
  const [view, setView] = useState<'list' | 'create' | 'symbols' | 'meaning' | 'done'>('list');
  const [draft, setDraft] = useState<Partial<DreamEntry>>({ symbols: [] });
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const toggleSymbol = (s: string) => {
    setDraft(d => ({
      ...d,
      symbols: d.symbols?.includes(s) ? d.symbols.filter(x => x !== s) : [...(d.symbols ?? []), s],
    }));
  };

  const handleSave = () => {
    const entry: DreamEntry = {
      id: `dream_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: draft.title ?? '',
      narrative: draft.narrative ?? '',
      emotionDuring: draft.emotionDuring ?? '',
      emotionWaking: draft.emotionWaking ?? '',
      symbols: draft.symbols ?? [],
      personalMeaning: draft.personalMeaning ?? '',
    };
    const updated = [entry, ...entries];
    save(updated);
    setEntries(updated);
    addXp(25);
    setView('done');
  };

  if (view === 'create') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/depth.webp)',
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
          <button onClick={() => setView('list')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🌙</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Record Dream</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Step 1 of 3 — The dream</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <input value={draft.title ?? ''} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            placeholder="Dream title (optional — gives it an anchor)"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #818cf833', caretColor: '#818cf8' }} />
          <textarea value={draft.narrative ?? ''} onChange={e => setDraft(d => ({ ...d, narrative: e.target.value }))}
            rows={7} placeholder="What happened in the dream? Write it like a scene — who was there, where, what occurred..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #818cf833', caretColor: '#818cf8' }} />

          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Emotion during dream</p>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(e => (
                <button key={e} onClick={() => setDraft(d => ({ ...d, emotionDuring: e }))}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full border"
                  style={{ background: draft.emotionDuring === e ? '#818cf822' : 'transparent', borderColor: draft.emotionDuring === e ? '#818cf8' : '#818cf833', color: draft.emotionDuring === e ? '#818cf8' : '#9CA3AF' }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Emotion on waking</p>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(e => (
                <button key={e} onClick={() => setDraft(d => ({ ...d, emotionWaking: e }))}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full border"
                  style={{ background: draft.emotionWaking === e ? '#7FD98C22' : 'transparent', borderColor: draft.emotionWaking === e ? '#7FD98C' : '#7FD98C33', color: draft.emotionWaking === e ? '#7FD98C' : '#9CA3AF' }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setView('symbols')} disabled={!draft.narrative || draft.narrative.trim().length < 15}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)', color: '#3C3C3C' }}>
            Identify Symbols →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'symbols') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('create')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">🔮</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Symbol Glossary</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Step 2 of 3 — What appeared?</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Select symbols that appeared in your dream. Tap for interpretation.</p>
          {SYMBOL_GLOSSARY.map(s => {
            const selected = draft.symbols?.includes(s.symbol);
            const expanded = expandedSymbol === s.symbol;
            return (
              <div key={s.symbol} className="rounded-2xl border overflow-hidden"
                style={{ borderColor: selected ? '#818cf8' : '#818cf822', background: selected ? '#818cf808' : '#FFFFFF' }}>
                <div className="flex items-center">
                  <button onClick={() => toggleSymbol(s.symbol)} className="flex-1 flex items-center gap-3 p-3 text-left">
                    <span className="text-lg">{s.emoji}</span>
                    <span className="text-xs font-black" style={{ color: selected ? '#818cf8' : '#3C3C3C' }}>{s.symbol}</span>
                    {selected && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full ml-auto shrink-0" style={{ background: '#818cf822', color: '#818cf8' }}>✓</span>}
                  </button>
                  <button onClick={() => setExpandedSymbol(expanded ? null : s.symbol)} className="p-3" style={{ color: '#9CA3AF' }}>
                    {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {expanded && (
                  <div className="px-4 pb-3 pt-0">
                    <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF' }}>{s.meaning}</p>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => setView('meaning')}
            className="w-full py-4 rounded-2xl font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)', color: '#3C3C3C' }}>
            Your Personal Meaning →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'meaning') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <button onClick={() => setView('symbols')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">💭</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Your Interpretation</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Step 3 of 3</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="rounded-2xl p-4 border" style={{ background: '#818cf808', borderColor: '#818cf833' }}>
            <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
              No external interpretation is authoritative. Your personal association with the imagery and emotion is the most clinically relevant lens.
            </p>
          </div>
          <textarea value={draft.personalMeaning ?? ''} onChange={e => setDraft(d => ({ ...d, personalMeaning: e.target.value }))}
            rows={8} placeholder="What does this dream feel like it's about? Does it connect to anything happening in your waking life? What stands out as significant to you?"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #818cf833', caretColor: '#818cf8' }} />
          <button onClick={handleSave} disabled={!draft.personalMeaning || draft.personalMeaning.trim().length < 10}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)', color: '#3C3C3C' }}>
            Save Dream (+25 XP)
          </button>
        </div>
      </div>
    );
  }

  if (view === 'done') {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Dream Logged</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <StoryArtPanel src="/story-art/dream_decoder_01.webp" aspect="16/9"
              eyebrow="The Decoder" caption="The same dream, re-rendered in warmer light. That's what naming it does." />
            <div className="rounded-3xl p-5 border text-center" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#818cf833' }}>
              <div className="text-5xl mb-2">🌙</div>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#818cf8' }}>Dream Recorded</p>
              <div className="text-[10px] font-black mt-1" style={{ color: '#7FD98C' }}>+25 XP earned</div>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
              <div className="flex items-center gap-2 mb-3">
                <LanceAvatar emotion="neutral" size="sm" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name}</span>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: '#9CA3AF' }}>"{LANCE_LINES[lanceIdx]}"</p>
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C44' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{intern.avatar}</span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>{intern.name || 'Intern'}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#7FD98C' }}>{INTERN_LINES[internIdx]}</p>
            </div>
            <button onClick={onBack} className="w-full py-4 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)', color: '#3C3C3C' }}>
              ← Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">🌙</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Dream Decoder</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Dream journal · Jungian symbol glossary</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#818cf822', color: '#818cf8' }}>+25 XP</div>
      </div>
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {entries.length > 0 && (
          <p className="text-[9px] font-black uppercase tracking-widest px-1" style={{ color: '#818cf8' }}>
            The dream journal · {entries.length} night{entries.length !== 1 ? 's' : ''}
          </p>
        )}
        {entries.slice(0, 6).map((e, i) => {
          const moon = moonPhase(e.date);
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative rounded-2xl p-4 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(30,39,73,0.06), rgba(129,140,248,0.1)), rgba(255,255,255,0.82)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid #818cf844',
                boxShadow: '0 4px 14px rgba(129,140,248,0.18)',
              }}
            >
              {/* Moon-phase stamp — the moon that actually hung over that night */}
              <div className="absolute top-2.5 right-3 flex flex-col items-center" title={moon.name}>
                <span className="text-xl" style={{ filter: 'drop-shadow(0 0 6px rgba(129,140,248,0.6))' }}>{moon.emoji}</span>
                <span className="text-[7px] font-bold" style={{ color: '#818cf8' }}>{moon.name}</span>
              </div>
              <div className="pr-16">
                <p className="text-xs font-black" style={{ color: '#3C3C3C' }}>{e.title || 'Untitled Dream'}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>
                  {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  {e.emotionWaking ? ` · Woke: ${e.emotionWaking}` : ''}
                </p>
                {e.symbols.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {e.symbols.slice(0, 4).map(s => {
                      const sym = SYMBOL_GLOSSARY.find(x => x.symbol === s);
                      return sym ? <span key={s} className="text-sm">{sym.emoji}</span> : null;
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {entries.length === 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#818cf822' }}>
            <div className="text-4xl text-center mb-3">🌙</div>
            <p className="text-xs text-center leading-relaxed" style={{ color: '#6B7280' }}>
              Record your dreams before they fade. Journal the narrative, identify symbols, and find your own meaning in the imagery.
            </p>
          </div>
        )}

        <button onClick={() => { setView('create'); setDraft({ symbols: [] }); }}
          className="w-full py-4 rounded-2xl font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)', color: '#3C3C3C' }}>
          🌙 Record a Dream
        </button>
      </div>
    </div>
  );
}
