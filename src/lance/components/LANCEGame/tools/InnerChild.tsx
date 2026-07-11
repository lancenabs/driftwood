import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import StoryArtPanel from '../ui/StoryArtPanel';
import { useGame } from '../LANCEGameContext';

interface ChildEntry {
  id: string;
  date: string;
  age: number;
  whatTheyNeeded: string;
  letter: string;
}

const STORAGE_KEY = 'lance_innerchild_v1';
function load(): ChildEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(e: ChildEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }

const AGES = [
  { age: 4, label: '4 years old', emoji: '🧸', context: 'The world was enormous and confusing. Safety was everything. You understood more than people thought.' },
  { age: 7, label: '7 years old', emoji: '🎒', context: 'School arrived and with it: comparison, belonging, the first real wounds from peers. You were figuring out what the world thought of you.' },
  { age: 10, label: '10 years old', emoji: '⚡', context: 'You could feel big feelings but had no map for them. You were watching adults and deciding what kind of person you wanted to be — or feared you were.' },
  { age: 13, label: '13 years old', emoji: '🌀', context: 'Everything was changing and nothing felt stable. Your body, your relationships, your sense of self — all in flux. You were desperately trying to belong.' },
  { age: 16, label: '16 years old', emoji: '🔥', context: 'You could see the adult world ahead but still lived in the constraints of being young. You had adult-sized feelings with no adult-sized tools.' },
];

const NEEDED_PROMPTS: Record<number, string> = {
  4:  'What did 4-year-old you most need to hear? What were they afraid of that nobody seemed to notice?',
  7:  'What did 7-year-old you need from the adults around them? What verdict about yourself did you start forming around this age?',
  10: 'What did 10-year-old you need that they weren\'t getting? What big feeling were they having that nobody helped them name?',
  13: 'What did 13-year-old you desperately need — from someone, anyone? What were they most afraid was true about them?',
  16: 'What would 16-year-old you have given anything to hear? What decision were they making about who they were that you wish you could undo?',
};

const LANCE_LINES = [
  "Inner child work logged. The developmental architecture of your emotional patterns was built by that version of you, under conditions they couldn't control. Integration is the correct response.",
  "Recorded. Childhood experiences encode neural patterns before the prefrontal cortex is fully online. You've begun the repair. That is, clinically speaking, significant.",
  "Filed. The needs you identified were real then. They're still real now, in updated form. Acknowledging the original source reduces their unconscious control. Correct sequence.",
  "Noted. Compassion toward your developmental history is not weakness. It is precision maintenance of the system you have to operate with.",
];
const INTERN_LINES = [
  "Writing to your younger self is one of the most healing things you can do. They needed to hear something and you just said it. You gave them something today.",
  "That little version of you has been carrying something for a long time. You just sat with them. That's reparenting. That's everything.",
  "What you wrote to them — they deserved to hear it then. You're saying it now. It still counts. It might count more.",
  "I'm so moved by this. You looked at that kid with so much compassion. I hope you save some of it for current-you too.",
];

interface Props { onBack: () => void; }

export default function InnerChild({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<ChildEntry[]>(load);
  const [view, setView] = useState<'intro' | 'age' | 'write' | 'done' | 'history'>('intro');
  const [selectedAge, setSelectedAge] = useState(AGES[0]);
  const [whatTheyNeeded, setWhatTheyNeeded] = useState('');
  const [letter, setLetter] = useState('');
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const handleSubmit = () => {
    const entry: ChildEntry = {
      id: `ic_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      age: selectedAge.age,
      whatTheyNeeded: whatTheyNeeded.trim(),
      letter: letter.trim(),
    };
    const updated = [entry, ...entries];
    save(updated);
    setEntries(updated);
    addXp(35);
    setView('done');
  };

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
        <button onClick={view === 'write' ? () => setView('age') : view === 'age' ? () => setView('intro') : onBack}
          className="p-2 rounded-xl active:scale-90 transition-all" style={{ color: '#9CA3AF' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg">👶</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Inner Child</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Co-regulate with your younger self</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setView('history')}
            className="text-[9px] px-2 py-1 rounded-full font-black"
            style={{ background: view === 'history' ? '#ec489922' : 'transparent', color: view === 'history' ? '#ec4899' : '#9CA3AF', border: `1px solid ${view === 'history' ? '#ec489944' : 'transparent'}` }}>
            History
          </button>
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#ec489922', color: '#ec4899' }}>+35 XP</div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {view === 'intro' && (
          <StoryArtPanel src="/story-art/innerchild_glass_pod.webp" aspect="16/9"
            eyebrow="The Archive Pod" caption="Somewhere in here, a younger you is still writing stories. Go say hello." />
        )}
        <AnimatePresence mode="wait">

          {view === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">👶</div>
                  <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>No entries yet</p>
                  <button onClick={() => setView('intro')} className="mt-4 px-6 py-2.5 rounded-full font-black text-sm"
                    style={{ background: '#ec489922', color: '#ec4899', border: '1px solid #ec489944' }}>
                    Begin →
                  </button>
                </div>
              ) : entries.map(e => {
                const age = AGES.find(a => a.age === e.age);
                return (
                  <div key={e.id} className="rounded-2xl p-4 border space-y-2" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#ec489922' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{age?.emoji}</span>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#ec4899' }}>{age?.label}</div>
                        <div className="text-[9px]" style={{ color: '#9CA3AF99' }}>
                          {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs leading-snug" style={{ color: '#9CA3AF' }}>{e.letter.slice(0, 120)}...</p>
                  </div>
                );
              })}
              <button onClick={() => { setView('intro'); setWhatTheyNeeded(''); setLetter(''); }}
                className="w-full py-3 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8B5CF6)', color: '#fff' }}>
                New Session
              </button>
            </motion.div>
          )}

          {view === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-3xl p-5 border" style={{ background: '#FDF2F8', borderColor: '#ec489933' }}>
                <div className="flex items-start gap-3">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wide mb-1" style={{ color: '#ec4899' }}>{NARRATOR.name} explains</p>
                    <p className="text-xs italic leading-relaxed" style={{ color: '#9CA3AF' }}>
                      "The inner child framework maps onto how early experiences encode into adult emotional patterns. Developmental psychology is clear: unmet needs from childhood do not simply disappear. They become the architecture of your adult responses. This is about updating that architecture — carefully."
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl p-5 border text-center" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#ec489922' }}>
                <div className="text-5xl mb-3">👶</div>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                  You'll choose an age to visit, reflect on what that version of you needed, and write them a letter from who you are now.
                </p>
                <p className="text-[10px] mt-3" style={{ color: '#ec489955' }}>Gentle. Take your time.</p>
              </div>
              <button onClick={() => setView('age')} className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8B5CF6)', color: '#fff' }}>
                Choose an Age →
              </button>
              {entries.length > 0 && (
                <button onClick={() => setView('history')} className="w-full py-2 text-xs font-bold" style={{ color: '#9CA3AF' }}>
                  View history ({entries.length}) →
                </button>
              )}
            </motion.div>
          )}

          {view === 'age' && (
            <motion.div key="age" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>Which version of you do you want to visit?</p>
              <div className="space-y-2">
                {AGES.map(a => (
                  <button key={a.age} onClick={() => setSelectedAge(a)}
                    className="w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98]"
                    style={{
                      background: selectedAge.age === a.age ? '#FDF2F8' : '#FFFFFF',
                      borderColor: selectedAge.age === a.age ? '#ec4899' : '#ec489922',
                    }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{a.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black" style={{ color: selectedAge.age === a.age ? '#ec4899' : '#3C3C3C' }}>{a.label}</div>
                        <p className="text-[10px] mt-0.5 leading-snug" style={{ color: '#9CA3AF' }}>{a.context}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setView('write')} className="w-full py-4 rounded-2xl font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8B5CF6)', color: '#fff' }}>
                Visit {selectedAge.label} →
              </button>
            </motion.div>
          )}

          {view === 'write' && (
            <motion.div key="write" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {/* Age scene card */}
              <div className="rounded-3xl p-5 border text-center" style={{ background: '#FDF2F8', borderColor: '#ec489933' }}>
                <div className="text-5xl mb-2">{selectedAge.emoji}</div>
                <p className="text-sm font-black" style={{ color: '#ec4899' }}>{selectedAge.label}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9CA3AF' }}>{selectedAge.context}</p>
              </div>

              {/* What they needed */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#ec489922' }}>
                <p className="text-xs font-black mb-3" style={{ color: '#3C3C3C' }}>
                  {NEEDED_PROMPTS[selectedAge.age]}
                </p>
                <textarea
                  value={whatTheyNeeded}
                  onChange={e => setWhatTheyNeeded(e.target.value)}
                  rows={3}
                  placeholder="What did they need? What were they carrying alone?"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #ec489933', caretColor: '#ec4899' }}
                />
              </div>

              {/* Letter */}
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#ec489922' }}>
                <p className="text-xs font-black mb-1" style={{ color: '#3C3C3C' }}>
                  Write them a letter from who you are now.
                </p>
                <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>
                  Start with "Dear {selectedAge.age}-year-old me..." — and say what they needed to hear.
                </p>
                <textarea
                  value={letter}
                  onChange={e => setLetter(e.target.value)}
                  rows={6}
                  placeholder={`Dear ${selectedAge.age}-year-old me,\n\nI want you to know...`}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #ec489933', caretColor: '#ec4899' }}
                />
              </div>

              <button onClick={handleSubmit} disabled={whatTheyNeeded.trim().length < 10 || letter.trim().length < 20}
                className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8B5CF6)', color: '#fff' }}>
                Send the Letter ✓
              </button>
            </motion.div>
          )}

          {view === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="rounded-3xl p-5 border text-center" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#ec489933' }}>
                <div className="text-5xl mb-2">💌</div>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#ec4899' }}>Letter Sent</p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{selectedAge.label} heard you.</p>
                <div className="text-[10px] font-black mt-2" style={{ color: '#7FD98C' }}>+35 XP earned</div>
              </div>
              <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <LanceAvatar emotion="neutral" size="sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>{NARRATOR.name} notes</span>
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
                style={{ background: 'linear-gradient(135deg, #ec4899, #8B5CF6)', color: '#fff' }}>
                ← Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
