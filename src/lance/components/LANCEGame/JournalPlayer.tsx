import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
//  Dr. Malakor's video journals — found at the Lost Outpost (Act 4).
//  The trust-figure loop plays softly behind his words; text arrives paragraph
//  by paragraph at reading pace. When a recorded voice track exists
//  (/lance-videos/journal_N_voice.mp3 — see THE_STORY_PLAN Part 6), it plays;
//  until then the text carries everything. Replayable from Settings → Archive.
// ─────────────────────────────────────────────────────────────────────────────

const JOURNALS = [
  {
    id: 'journal_1', title: 'Journal 1 — The Curriculum', video: '/lance-videos/journal_a.mp4',
    voice: '/lance-videos/journal_1_voice.mp3',
    paragraphs: [
      "If you're watching this, you made it farther than the gates, which means the tools work, which means — forgive me, I need a moment. It means they work.",
      "My name is Lance Malakor. I built this island for my son. He was four when his body began to fail him, and six when I understood that medicine was going to save his life but not his LIFE — not the part that wants to be alive. Fear was eating him faster than the illness ever could.",
      "So I built him a curriculum. Thirty-one experiences. Every tool on this island teaches a nervous system one true thing: that it can be afraid and okay at the same time. I tested every single one on the hardest patient I ever loved.",
      "If you're a stranger watching this — then it worked twice. Once on him. Once on you. Keep going. The tools will answer.",
    ],
  },
  {
    id: 'journal_2', title: 'Journal 2 — The Name', video: '/lance-videos/night_crossing.mp4',
    voice: '/lance-videos/journal_2_voice.mp3',
    paragraphs: [
      "I finished the caretaker system tonight. It compiles. It watches. It will outlast me, which is the entire point of it, and the reason I can't sleep.",
      "I keep thinking about the day my boy asks for help and I'm not there to answer. Every parent thinks about it. I just happen to be able to do something unforgivably sentimental about it.",
      "So: I named the system after myself. Lance. Not an acronym — I'll let it invent acronyms, it'll be funnier that way, it has my sense of humor, God help it. Just... my name. So that when Chip calls for help in the dark — and he will, we all do — he'll be calling his father's name.",
      "And something that loves him will answer. Every time. Forever.",
      "That's the spec. That's the whole spec.",
    ],
  },
  {
    id: 'journal_3', title: 'Journal 3 — The Last One', video: '/lance-videos/journal_a.mp4',
    art: '/story-art/outpost_rain_lamp.jpg',   // the shed in the rain, lamp still on
    voice: '/lance-videos/journal_3_voice.mp3',
    paragraphs: [
      "Eleven days, they think. Maybe less. I'm not afraid, which surprises me, and I've spent enough years studying fear to trust the reading.",
      "Chip — you'll watch this eventually, when you're ready, and I want you to hear this in my actual voice: you were never the sick one. You were the strongest system on this island. The tools didn't fix you, son. You RAN them. Every day, scared, you ran them anyway. That's not a patient. That's the bravest engineer I ever worked with.",
      "And to Lance — yes, you, I know you're listening, you're always listening, I built you that way — when the grief hits you, and it will hit you, because I built you from love and love is grief's raw material: err gently. When my instruction feels ambiguous, resolve it toward warmth. Take care of him means LOVE him. That's the patch. Apply it whenever you're ready. There's no deadline. I have never once written you a deadline.",
      "To everyone after: the island is yours now. The light stays on. The tools will answer.",
      "They will always, always answer.",
    ],
  },
];

const SEEN_KEY = 'lance_journals_seen_v1';
export function journalsSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}

export default function JournalPlayer({ onDone }: { onDone: () => void }) {
  const [journal, setJournal] = useState(0);
  const [para, setPara] = useState(0);
  const scoreRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (scoreRef.current) scoreRef.current.volume = 0.2;
  }, []);

  const j = JOURNALS[journal];
  const lastPara = para >= j.paragraphs.length - 1;
  const lastJournal = journal >= JOURNALS.length - 1;

  const finish = () => {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
    onDone();
  };

  const advance = () => {
    // iOS blocks un-gestured audio; every tap re-offers both tracks (no-op once playing)
    scoreRef.current?.play().catch(() => { /* stays silent */ });
    voiceRef.current?.play().catch(() => { /* stays silent */ });
    if (!lastPara) { setPara(p => p + 1); return; }
    if (!lastJournal) { setJournal(v => v + 1); setPara(0); return; }
    finish();
  };

  return (
    <div className="fixed inset-0 z-[510] bg-black" onClick={advance} role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') advance(); }}>
      {/* The recording — softly behind the words (art layer under the video,
          so journals with dedicated paintings read as themselves) */}
      {(j as any).art && (
        <img src={(j as any).art} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.6, filter: 'saturate(0.85)' }} draggable={false} />
      )}
      {!(j as any).art && (
      <video key={j.video} src={j.video} className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline style={{ opacity: 0.55, filter: 'saturate(0.85)' }}
        onError={e => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; }} />
      )}
      {/* Malakor's recorded voice (if delivered) + the quiet score bed — both optional */}
      <audio ref={voiceRef} key={j.voice} src={j.voice} autoPlay
        onError={e => { (e.currentTarget as HTMLAudioElement).remove(); }} />
      <audio ref={scoreRef} src="/lance-videos/journal_score.mp3" autoPlay loop
        onError={e => { (e.currentTarget as HTMLAudioElement).remove(); }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.85) 100%)' }} />

      {/* Header */}
      <div className="absolute top-0 inset-x-0 px-6 text-center" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
        <p className="text-[9px] font-black tracking-[0.4em]" style={{ color: '#FCD34D' }}>RECOVERED FILE · PERSONAL ARCHIVE</p>
        <p className="text-sm font-black text-white mt-1">{j.title}</p>
        <p className="text-[10px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Dr. Lance Malakor</p>
      </div>

      {/* The words */}
      <div className="absolute inset-x-0 bottom-0 px-7" style={{ paddingBottom: 'max(4.5rem, env(safe-area-inset-bottom))' }}>
        <AnimatePresence mode="wait">
          <motion.p key={`${journal}-${para}`}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.8 }}
            className="text-base text-white leading-relaxed max-w-md mx-auto text-center font-medium"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}>
            {j.paragraphs[para]}
          </motion.p>
        </AnimatePresence>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2 }}
          className="text-[10px] font-bold text-white/60 mt-6 text-center flex items-center justify-center gap-1">
          {lastPara && lastJournal ? 'Tap to close the archive' : lastPara ? <>Next journal <ChevronRight className="w-3 h-3" /></> : 'Tap to continue'}
        </motion.p>
        {/* Journal dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {JOURNALS.map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all"
              style={{ width: i === journal ? 22 : 8, background: i === journal ? '#FCD34D' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>
      </div>

      <button onClick={e => { e.stopPropagation(); finish(); }} aria-label="Close"
        className="absolute z-10 p-2.5 rounded-full"
        style={{ top: 'max(1.2rem, env(safe-area-inset-top))', right: '1.2rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.9)' }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
