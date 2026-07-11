import React, { useState } from 'react';
import GameShell, { feedTogether } from './GameShell';
import { activeCastaway, readCrew } from '../../lib/castaways';

// ═════════════════════════════════════════════════════════════════════════════
//  THE STORY CIRCLE (family · milestone 16 as a live game, kid-friendly). Turn-
//  based: the fire deals a story-prompt, the phone passes the circle, each voice
//  adds a chapter. A family is a story it keeps agreeing to tell together — this
//  makes telling it a game the youngest can win at. Saved to the island
//  (driftwood_story_circle_v1) so the campfire remembers your stories.
// ═════════════════════════════════════════════════════════════════════════════

const PROMPTS = [
  'the funniest thing that ever happened to this family',
  'a time we got lost (and what happened next)',
  'the story of a family meal that went sideways',
  'the bravest thing someone in this family ever did',
  'a holiday that did NOT go as planned',
  'the day the youngest surprised everyone',
  'a family adventure that started with a bad idea',
  'the story of how two people in this family met',
  'a time this family laughed until it hurt',
  'the pet story (every family has one)',
];

interface Chapter { who: string; text: string }
const KEY = 'driftwood_story_circle_v1';

export default function StoryCircle({ onClose }: { onClose: () => void }) {
  const me = activeCastaway();
  const crew = readCrew();
  const tellers = crew.length >= 2 ? crew.map(c => c.name) : [me.name || 'You', 'Family'];
  const [phase, setPhase] = useState<'setup' | 'tell' | 'done'>('setup');
  const [prompt, setPrompt] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [tellerIdx, setTellerIdx] = useState(0);
  const [text, setText] = useState('');

  const teller = tellers[tellerIdx % tellers.length];

  const deal = () => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setChapters([]); setTellerIdx(0); setPhase('tell');
  };

  const addChapter = () => {
    const t = text.trim(); if (t.length < 3) return;
    setChapters(c => [...c, { who: teller, text: t }]);
    setText(''); setTellerIdx(i => i + 1);
  };

  const finish = () => {
    try {
      const book = JSON.parse(localStorage.getItem(KEY) || '[]');
      book.push({ prompt, chapters, at: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(book.slice(-30)));
    } catch { /* the story was still told */ }
    feedTogether('story_circle', { chapters: chapters.length });
    setPhase('done');
  };

  return (
    <GameShell emoji="📖" title="The Story Circle" subtitle="each voice a chapter · the fire remembers"
      onClose={onClose} bg="linear-gradient(#2A2030, #3A2A38 60%, #4A3A2A)">
      <div className="px-5 py-5 flex flex-col justify-center min-h-[70%]">
        {phase === 'setup' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">🔥📖</div>
            <p className="text-white/90 text-sm font-bold">A family is a story it keeps telling together.</p>
            <p className="text-[11px] text-white/70 italic leading-relaxed">
              The fire deals a prompt. Pass the phone around the circle — each person adds a chapter, even one sentence, even the little ones (especially the little ones). The island keeps your stories; they're worth more than planks.
            </p>
            <button onClick={deal} className="bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black rounded-xl py-3 text-sm">Deal a story →</button>
          </div>
        )}
        {phase === 'tell' && (
          <div className="max-w-sm mx-auto w-full flex flex-col gap-3">
            <div className="bg-white/95 rounded-2xl px-4 py-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-wide text-rose-500">tonight's story</p>
              <p className="text-slate-800 font-black text-sm">{prompt}</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 text-center">📱 {teller}'s chapter</p>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3} autoFocus
              placeholder={`${teller}, what happened next…`}
              className="text-sm rounded-xl px-3 py-2.5 bg-white/95 text-slate-800 outline-none resize-none" />
            <div className="flex gap-2">
              <button onClick={addChapter} data-testid="sc-add" className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Add the chapter →</button>
              {chapters.length >= 2 && <button onClick={finish} data-testid="sc-finish" className="bg-amber-700 text-white font-black rounded-xl px-4 text-xs">The end 🏕</button>}
            </div>
            {chapters.length > 0 && (
              <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto">
                {chapters.map((c, i) => (
                  <div key={i} className="bg-white/90 rounded-xl px-3 py-2 text-[12px]">
                    <span className="font-black text-rose-500">{c.who}:</span> <span className="text-slate-700">{c.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {phase === 'done' && (
          <div className="max-w-sm mx-auto w-full text-center flex flex-col gap-4">
            <div className="text-5xl">📖✨</div>
            <p className="text-white text-lg font-black">{chapters.length} chapters, told together.</p>
            <p className="text-white/80 text-sm leading-relaxed">The island keeps this one — your family's history grew a page tonight. The strongest crews are the ones whose stories get told at enough fires.</p>
            <div className="flex gap-2">
              <button onClick={deal} className="flex-1 bg-white/15 border-2 border-white/25 text-white font-black rounded-xl py-2.5 text-sm">Another story</button>
              <button onClick={onClose} className="flex-1 bg-amber-500 text-white font-black rounded-xl py-2.5 text-sm">Back to the campfire</button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
