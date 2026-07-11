import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Sparkles, 
  Trophy, 
  Volume2, 
  Archive, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  CheckCircle,
  HelpCircle,
  Smile,
  BookOpen,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './SwitchUserBar';

interface GratitudeNote {
  id: string;
  from: string;
  to: string;
  content: string;
  emoji: string;
  color: string; // Tailwind bg color class
  timestamp: string;
}

interface CompletedSyncSession {
  id: string;
  date: string;
  notesCount: number;
  notes: GratitudeNote[];
}

interface GratitudeJarProps {
  currentUser: UserProfile;
  onAddMilestone?: (title: string, emoji: string) => void;
  onClose?: () => void;
}

const FAMILY_MEMBERS = [
  { id: 'sarah', name: 'Sarah (Mom)', avatar: '👩', color: 'from-pink-400 to-rose-400' },
  { id: 'mark', name: 'Mark (Dad)', avatar: '👨', color: 'from-blue-400 to-sky-400' },
  { id: 'jamie', name: 'Jamie (Teenager)', avatar: '🎧', color: 'from-purple-400 to-indigo-400' },
  { id: 'charlie', name: 'Charlie (Child)', avatar: '🧒', color: 'from-amber-400 to-yellow-400' }
];

const SEED_NOTES: GratitudeNote[] = [
  {
    id: 'note-1',
    from: 'Sarah (Mom)',
    to: 'Mark (Dad)',
    content: 'Thank you for making fresh coffee every morning this week. It feels like a warm hug before my chaotic work days start.',
    emoji: '☕',
    color: 'bg-rose-50 border-rose-200 text-rose-800',
    timestamp: '3 days ago'
  },
  {
    id: 'note-2',
    from: 'Mark (Dad)',
    to: 'Jamie (Teenager)',
    content: 'I really appreciated you washing the family car on Tuesday without any nagging. It showed real maturity and helped me a lot.',
    emoji: '🚗',
    color: 'bg-sky-50 border-sky-200 text-sky-800',
    timestamp: '2 days ago'
  },
  {
    id: 'note-3',
    from: 'Jamie (Teenager)',
    to: 'Sarah (Mom)',
    content: 'Thanks for not overreacting when I came home slightly past curfew on Thursday. It made me feel trusted and respected.',
    emoji: '🤝',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    timestamp: 'Yesterday'
  },
  {
    id: 'note-4',
    from: 'Charlie (Child)',
    to: 'Mark (Dad)',
    content: 'Thank you for building the giant LEGO spaceship with me on Wednesday night. It is the best toy ever!',
    emoji: '🚀',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    timestamp: '1 day ago'
  }
];

const EMOJIS = ['❤️', '☕', '🌟', '🤝', '🍕', '🚗', '☀️', '🌸', '🚀', '🧒', '💡', '🏡'];

const COLOR_OPTIONS = [
  { name: 'Rose Blush', value: 'bg-rose-50 border-rose-200 text-rose-800' },
  { name: 'Sky Breezy', value: 'bg-sky-50 border-sky-200 text-sky-800' },
  { name: 'Violet Peace', value: 'bg-purple-50 border-purple-200 text-purple-800' },
  { name: 'Amber Glow', value: 'bg-amber-50 border-amber-200 text-amber-800' },
  { name: 'Mint Balance', value: 'bg-emerald-50 border-emerald-200 text-emerald-800' }
];

export default function GratitudeJar({ currentUser, onAddMilestone, onClose }: GratitudeJarProps) {
  // NOTES STATE
  const [notes, setNotes] = useState<GratitudeNote[]>(() => {
    try {
      const saved = localStorage.getItem('driftwood_gratitude_notes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return SEED_NOTES;
  });

  // ARCHIVE STATE
  const [archives, setArchives] = useState<CompletedSyncSession[]>(() => {
    try {
      const saved = localStorage.getItem('driftwood_gratitude_archives');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // NEW NOTE FORM STATE
  const [showAddForm, setShowAddForm] = useState(false);
  const [fromUser, setFromUser] = useState(FAMILY_MEMBERS[0].name);
  const [toUser, setToUser] = useState(FAMILY_MEMBERS[1].name);
  const [noteContent, setNoteContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);

  // FAMILY SYNC VIEW STATE
  const [syncSessionActive, setSyncSessionActive] = useState(false);
  const [currentSyncIndex, setCurrentSyncIndex] = useState(0);
  const [heartBursts, setHeartBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // VIEW MODE STATE
  const [activeSubView, setActiveSubView] = useState<'jar' | 'archive'>('jar');

  // Trigger LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('driftwood_gratitude_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('driftwood_gratitude_archives', JSON.stringify(archives));
  }, [archives]);

  // Synthesize soft, therapeutic chime
  const playTherapeuticChime = (freqs = [261.63, 329.63, 392.00, 523.25]) => {
    if (!audioFeedback) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 1.5);
      });
    } catch (e) {
      console.warn('AudioContext blocked or unsupported', e);
    }
  };

  const playSingleChime = (freq = 440) => {
    playTherapeuticChime([freq]);
  };

  // Submit Note
  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newNote: GratitudeNote = {
      id: `note-${Date.now()}`,
      from: fromUser,
      to: toUser,
      content: noteContent.trim(),
      emoji: selectedEmoji,
      color: selectedColor,
      timestamp: 'Just now'
    };

    setNotes(prev => [...prev, newNote]);
    setNoteContent('');
    setShowAddForm(false);
    playTherapeuticChime([392.00, 523.25]); // high comforting chime

    if (onAddMilestone) {
      onAddMilestone(`Submitted Gratitude Note inside the Jar: From ${fromUser} to ${toUser} 🫙`, '💖');
    }
  };

  // Start Sync Session
  const handleStartFamilySync = () => {
    if (notes.length === 0) return;
    playTherapeuticChime([196.00, 261.63, 329.63, 392.00, 523.25]); // sweeping chime
    setCurrentSyncIndex(0);
    setSyncSessionActive(true);
    setShowSuccessCelebration(false);
  };

  // Click Heart Acknowledge
  const handleAcknowledgeHeart = (e: React.MouseEvent) => {
    playSingleChime(523.25 + (currentSyncIndex * 20)); // interactive pitch rising
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;
    
    const burstId = Date.now();
    setHeartBursts(prev => [...prev, { id: burstId, x, y }]);
    
    // Auto remove burst
    setTimeout(() => {
      setHeartBursts(prev => prev.filter(b => b.id !== burstId));
    }, 1000);
  };

  // Finish Sync Session
  const handleFinishSyncSession = () => {
    playTherapeuticChime([329.63, 392.00, 523.25, 659.25, 783.99]); // triumphant major chime
    
    const newArchive: CompletedSyncSession = {
      id: `session-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      notesCount: notes.length,
      notes: [...notes]
    };

    setArchives(prev => [newArchive, ...prev]);
    setNotes([]); // clear the current jar
    setSyncSessionActive(false);
    setShowSuccessCelebration(true);

    if (onAddMilestone) {
      onAddMilestone(`Completed Weekly Family Sync Ritual: Opened and read ${newArchive.notesCount} gratitude notes together! 🫙✨`, '🏆');
    }
  };

  // Delete individual note while in jar
  const handleDeleteNote = (id: string) => {
    if (window.confirm('Delete this gratitude note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      playSingleChime(220); // low decline chime
    }
  };

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] select-none" id="gratitude-jar-component">
      
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white p-4 rounded-[2.2rem] shadow-sm flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-300 to-emerald-400 flex items-center justify-center text-xl shadow-md">
            🫙
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-yellow-300">Positive Sentiment Override</span>
            <h4 className="font-display font-black text-sm text-white leading-tight mt-0.5">The Weekly Gratitude Jar</h4>
            <p className="text-[10px] text-teal-100 font-sans mt-0.5 max-w-[280px]">
              Drop in daily appreciations. Sit down together to read them during the weekly Family Sync.
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => setAudioFeedback(!audioFeedback)}
            className={`p-2 rounded-full transition cursor-pointer ${audioFeedback ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-transparent text-teal-300'}`}
            title="Toggle Chime Feedback"
          >
            <Volume2 size={13} className={audioFeedback ? 'animate-pulse' : 'opacity-40'} />
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full text-white transition cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Subnavigation Tab Switcher */}
      <div className="flex bg-slate-100 rounded-2xl p-1 gap-1 border-2 border-stone-200">
        <button
          onClick={() => { setActiveSubView('jar'); playSingleChime(330); }}
          className={`flex-1 font-display font-black text-[9px] py-2 px-3 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 ${
            activeSubView === 'jar' 
              ? 'bg-teal-700 text-white border-b-2 border-teal-900 shadow-xs' 
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          <span>🫙 Current Jar ({notes.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubView('archive'); playSingleChime(261.63); }}
          className={`flex-1 font-display font-black text-[9px] py-2 px-3 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 ${
            activeSubView === 'archive' 
              ? 'bg-teal-700 text-white border-b-2 border-teal-900 shadow-xs' 
              : 'text-stone-600 hover:bg-stone-200'
          }`}
        >
          <span>📂 Sync Archives ({archives.length})</span>
        </button>
      </div>

      {/* SUCCESS CELEBRATION MODAL */}
      {showSuccessCelebration && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-[2rem] flex flex-col gap-2 items-center text-center animate-fade-in">
          <span className="text-3xl animate-bounce">🏆✨</span>
          <h4 className="font-display font-black text-xs text-emerald-800 uppercase tracking-wider">Family Sync Accomplished!</h4>
          <p className="text-[10px] text-emerald-700 max-w-[320px] font-sans">
            Fantastic work! You have opened your Gratitude Jar and integrated your appreciations. Your positive sentiment bank is topped up!
          </p>
          <div className="flex gap-2 items-center text-[10px] bg-white border border-emerald-200 text-emerald-800 font-mono font-black px-3 py-1 rounded-full shadow-xs mt-1">
            <Trophy size={11} className="text-yellow-500" /> +100 FAMILY CO-OP XP COLLECTED
          </div>
          <button 
            onClick={() => setShowSuccessCelebration(false)} 
            className="text-[9px] font-bold text-emerald-950 underline hover:text-emerald-800 mt-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN LAYOUT */}
      {activeSubView === 'jar' && !syncSessionActive && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* LEFT: THE INTERACTIVE GLASS JAR PREVIEW (7 cols) */}
          <div className="md:col-span-7 bg-white p-5 rounded-[2rem] border-2 border-stone-200 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
            
            <div className="w-full flex justify-between items-center border-b border-stone-100 pb-2.5">
              <div>
                <span className="text-[8px] font-black uppercase text-teal-600 tracking-widest">Active Vessel</span>
                <h5 className="font-display font-black text-xs text-stone-800 leading-tight">Shared Connection Reservoir</h5>
              </div>
              <span className="bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full text-[9px] font-bold font-mono text-teal-800">
                {notes.length} Active Appreciations
              </span>
            </div>

            {/* THE VISUAL GLASS JAR CONTAINER */}
            <div className="w-56 h-72 border-4 border-slate-300/40 bg-slate-50/20 rounded-[4.5rem] relative my-6 flex flex-col justify-end items-center p-4 overflow-hidden shadow-inner shadow-slate-100">
              
              {/* Wooden Jar Lid */}
              <div className="absolute top-0 w-36 h-4 bg-amber-800/80 rounded-full border-b border-amber-950 shadow-md"></div>
              <div className="absolute top-4 w-32 h-2.5 bg-amber-700/60 rounded-b-lg"></div>

              {/* Glass Glare Effects */}
              <div className="absolute left-3 top-6 bottom-6 w-2.5 bg-white/20 rounded-full blur-[1px]"></div>
              <div className="absolute right-4 top-8 bottom-8 w-1.5 bg-white/15 rounded-full blur-[1px]"></div>

              {/* EMPTY JAR FALLBACK */}
              {notes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-2">
                  <span className="text-2xl opacity-40">🫙</span>
                  <p className="text-[9.5px] font-sans font-semibold text-stone-400">The Jar is completely empty.</p>
                  <p className="text-[8.5px] font-sans text-stone-400 max-w-[140px] leading-relaxed">
                    Write a note to spark a sweet conversation for your family!
                  </p>
                </div>
              )}

              {/* FLOATING SLIPS OF PAPERS / MOTIONS */}
              <div className="absolute inset-x-4 bottom-3 top-10 flex flex-wrap gap-2 items-end justify-center overflow-hidden">
                {notes.map((note, idx) => {
                  // Generate predictable random looking positions so slips lie stacked or float
                  const rotation = (idx * 17) % 35 - 17; // -17deg to +18deg
                  const scale = 0.95 + ((idx * 0.04) % 0.1);
                  const hoverY = -4;

                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 50, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ y: hoverY, scale: 1.1, zIndex: 30 }}
                      className={`w-11 h-8 rounded-md border-b-[3px] border shadow-md flex items-center justify-center cursor-pointer relative group shrink-0 ${
                        note.color.includes('rose') ? 'bg-rose-200 border-rose-300 text-rose-700' :
                        note.color.includes('sky') ? 'bg-sky-200 border-sky-300 text-sky-700' :
                        note.color.includes('purple') ? 'bg-purple-200 border-purple-300 text-purple-700' :
                        note.color.includes('amber') ? 'bg-amber-200 border-amber-300 text-amber-700' :
                        'bg-emerald-200 border-emerald-300 text-emerald-700'
                      }`}
                      style={{ 
                        transform: `rotate(${rotation}deg) scale(${scale})`,
                      }}
                      title={`From: ${note.from} -> To: ${note.to}`}
                    >
                      <span className="text-xs">{note.emoji}</span>
                      
                      {/* Miniature paper fold lines */}
                      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-black/5"></div>
                      
                      {/* Delete cross inside jar on hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs cursor-pointer border border-white"
                      >
                        ×
                      </button>
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* FAMILY SYNC TRIGGER TRIGGER */}
            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={handleStartFamilySync}
                disabled={notes.length === 0}
                className={`w-full font-display font-black py-3 rounded-2xl border-b-[4px] text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  notes.length > 0
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-600 text-white border-teal-900 active:translate-y-[2px] active:border-b-[2px] hover:brightness-110'
                    : 'bg-stone-150 text-stone-400 border-stone-200 cursor-not-allowed'
                }`}
              >
                <span>🔥 Begin Weekly Family Sync Ceremony</span>
                <span className="text-xs">→</span>
              </button>
              <div className="flex justify-center items-center gap-1.5 text-[8.5px] text-stone-400 font-mono">
                <span>🛡️ SECURE PORTAL</span>
                <span>•</span>
                <span>ROOTED IN SENTIMENT THEORY</span>
              </div>
            </div>

          </div>

          {/* RIGHT: NOTE SUBMISSION SUITE & LIST (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            {/* SUBMIT BUTTON CARD */}
            {!showAddForm ? (
              <button
                type="button"
                onClick={() => { setShowAddForm(true); playSingleChime(392); }}
                className="bg-white p-5 rounded-[2rem] border-2 border-stone-200 shadow-sm hover:border-teal-500 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group text-center min-h-[140px]"
              >
                <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center border-2 border-teal-100 group-hover:bg-teal-500 group-hover:text-white group-hover:scale-105 transition-all text-xl">
                  <Plus size={16} />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-stone-800 leading-tight">Deposit New Gratitude Slip</h4>
                  <p className="font-sans text-[10px] text-stone-400 mt-1 max-w-[200px] leading-snug">
                    Log an appreciation in the jar. Anyone in the family can author.
                  </p>
                </div>
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-[2.2rem] border-2 border-teal-600 shadow-md flex flex-col gap-3.5"
              >
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <h4 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight flex items-center gap-1.5">
                    <Heart size={12} className="text-rose-500 fill-rose-500/10" /> Craft Gratitude note
                  </h4>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-stone-400 hover:text-stone-600 transition p-1"
                  >
                    <X size={12} />
                  </button>
                </div>

                <form onSubmit={handleSubmitNote} className="flex flex-col gap-3">
                  
                  {/* Sender Select */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-black uppercase text-stone-400 tracking-wider">From:</label>
                      <select
                        value={fromUser}
                        onChange={(e) => setFromUser(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-[10px] text-stone-700 focus:outline-none focus:border-teal-600 cursor-pointer"
                      >
                        {FAMILY_MEMBERS.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-black uppercase text-stone-400 tracking-wider">To (Recipient):</label>
                      <select
                        value={toUser}
                        onChange={(e) => {
                          setToUser(e.target.value);
                          playSingleChime(329.63);
                        }}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-[10px] text-stone-700 focus:outline-none focus:border-teal-600 cursor-pointer"
                      >
                        <option value="Whole Family">Whole Family 🏡</option>
                        {FAMILY_MEMBERS.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-stone-400 tracking-wider">Appreciation message:</label>
                    <textarea
                      required
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Be specific! E.g., Thank you for cleaning the dinner table on Tuesday and letting me relax. It made me feel so cared for."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[10px] text-stone-700 focus:outline-none focus:border-teal-600 font-sans h-20 resize-none placeholder-stone-400"
                    />
                  </div>

                  {/* Emoji selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-stone-400 tracking-wider">Select Note Stamp (Emoji):</label>
                    <div className="flex flex-wrap gap-1.5 max-h-12 overflow-y-auto py-1">
                      {EMOJIS.map(em => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => { setSelectedEmoji(em); playSingleChime(440); }}
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition border cursor-pointer ${selectedEmoji === em ? 'bg-teal-50 border-teal-500 scale-110 shadow-3xs' : 'bg-stone-50 border-stone-100 hover:bg-stone-100'}`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-black uppercase text-stone-400 tracking-wider">Paper Color Accent:</label>
                    <div className="flex gap-1.5">
                      {COLOR_OPTIONS.map((co) => (
                        <button
                          key={co.value}
                          type="button"
                          onClick={() => { setSelectedColor(co.value); playSingleChime(350); }}
                          className={`w-6 h-6 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${co.value} ${selectedColor === co.value ? 'border-teal-600 scale-110 shadow-xs' : 'border-transparent hover:scale-105'}`}
                          title={co.name}
                        >
                          {selectedColor === co.value && <div className="w-1.5 h-1.5 rounded-full bg-stone-700"></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-2 justify-end pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-white text-stone-600 text-[9.5px] px-3.5 py-1.5 rounded-xl border-2 border-stone-200 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-700 text-white text-[9.5px] px-4.5 py-1.5 rounded-xl border-b-[3px] border-teal-900 font-black uppercase tracking-wider cursor-pointer"
                    >
                      Slip inside Jar
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* BRIEF CLINICAL ADVICE PANEL */}
            <div className="bg-amber-50/75 border-2 border-amber-100 p-4 rounded-[2rem] flex flex-col gap-2">
              <h5 className="font-display font-black text-[9px] text-amber-800 uppercase tracking-widest flex items-center gap-1">
                <BookOpen size={11} /> POSITIVE SENTIMENT OVERRIDE
              </h5>
              <p className="text-[9.5px] text-amber-900 leading-relaxed font-sans">
                Gottman research shows stable couples have a **5:1 ratio** of positive to negative interactions. Depositing specific appreciations builds a buffer so that during difficult conflicts, partners are far more likely to interpret each other's intent charitably.
              </p>
            </div>

            {/* SEED/DEMO INSTRUCTIONS PANEL */}
            <div className="bg-[#E6F8FF] border border-[#99DFFF] p-4 rounded-[2rem] flex flex-col gap-1.5">
              <h5 className="font-display font-black text-[9px] text-[#006EB2] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} /> PREVIEW SEEDS INSTALLED
              </h5>
              <p className="text-[9.5px] text-[#005180] leading-relaxed font-sans">
                We have seeded **4 heartwarming gratitude notes** in the jar from Mark, Sarah, Jamie, and Charlie. You can edit, delete, or submit more before starting the Family Sync Ceremony!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SYNC SESSION INTERACTIVE STATE (Ceremony View) */}
      {syncSessionActive && notes.length > 0 && (
        <div className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-[2.5rem] p-5 md:p-8 shadow-2xl flex flex-col items-center justify-between min-h-[500px] animate-fade-in relative overflow-hidden select-text">
          
          {/* Ambient Glowing Particle Orbs */}
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Progress Bar Header */}
          <div className="w-full flex justify-between items-center border-b border-white/10 pb-3.5 z-10">
            <div>
              <span className="text-[8px] font-black uppercase text-teal-400 tracking-widest block">Family Sync Session active</span>
              <h4 className="font-display font-black text-xs text-white uppercase tracking-wider">Unfolding Shared Appreciations</h4>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Progress Count */}
              <span className="font-mono text-[9px] font-bold bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                Note {currentSyncIndex + 1} of {notes.length}
              </span>
              
              <button
                onClick={() => {
                  if (window.confirm("Abort the Family Sync session? Past progress won't be cleared but notes won't be archived.")) {
                    setSyncSessionActive(false);
                    playTherapeuticChime([220]);
                  }
                }}
                className="text-stone-400 hover:text-white transition text-[9px] font-bold uppercase tracking-wider cursor-pointer bg-white/5 px-2.5 py-1 rounded-full border border-white/5"
              >
                Exit Sync
              </button>
            </div>
          </div>

          {/* Visual Progress Steps Indicators */}
          <div className="w-full flex gap-1 mt-2.5 z-10">
            {notes.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx === currentSyncIndex ? 'bg-teal-400 shadow-md shadow-teal-500/50 scale-y-110' :
                  idx < currentSyncIndex ? 'bg-teal-600/70' :
                  'bg-white/10'
                }`}
              ></div>
            ))}
          </div>

          {/* CARDS DISPLAY CONTAINER WITH ANIMATION */}
          <div className="my-6 w-full max-w-[420px] z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSyncIndex}
                initial={{ opacity: 0, scale: 0.9, rotate: -2, y: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 2, y: -15 }}
                transition={{ type: 'spring', damping: 20 }}
                className={`relative bg-stone-800 border-2 border-white/10 rounded-[2.2rem] shadow-2xl p-6 md:p-8 flex flex-col gap-5 overflow-hidden min-h-[250px]`}
              >
                {/* Note Header Details */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl bg-white/5 border border-white/10 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner">
                      {notes[currentSyncIndex].emoji}
                    </span>
                    <div>
                      <span className="text-[8.5px] font-mono font-black uppercase text-teal-400 tracking-wider">Generous Acknowledgment</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-black text-white">{notes[currentSyncIndex].from}</span>
                        <span className="text-xs text-white/40">➔</span>
                        <span className="text-[11px] font-black text-teal-300">{notes[currentSyncIndex].to}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-[8px] font-mono font-semibold text-white/40">
                    {notes[currentSyncIndex].timestamp}
                  </span>
                </div>

                {/* HEARTBURST CONTAINER (Interactive Clickable Area) */}
                <div 
                  onClick={handleAcknowledgeHeart}
                  className="relative flex-1 bg-stone-900/60 border border-white/5 rounded-2xl p-4.5 cursor-pointer hover:border-white/20 transition-all group min-h-[120px] select-text"
                  title="Click anywhere inside the note bubble to send connection hearts!"
                >
                  <p className="font-sans text-xs md:text-sm text-stone-100 leading-relaxed whitespace-pre-wrap font-medium">
                    "{notes[currentSyncIndex].content}"
                  </p>
                  
                  {/* Floating click instruction indicator */}
                  <div className="absolute right-3 bottom-2 text-[7.5px] font-mono font-bold uppercase tracking-wider text-white/30 group-hover:text-teal-400/80 transition-colors flex items-center gap-1 pointer-events-none">
                    <Heart size={9} className="fill-current animate-pulse text-rose-500" /> Click note to send hearts
                  </div>

                  {/* Render heart particles */}
                  {heartBursts.map(burst => (
                    <motion.div
                      key={burst.id}
                      initial={{ opacity: 1, scale: 0.8, y: 0 }}
                      animate={{ opacity: 0, scale: 2.2, y: -60, x: (Math.random() - 0.5) * 40 }}
                      className="absolute text-rose-500 text-lg pointer-events-none fill-current"
                      style={{ left: burst.x, top: burst.y }}
                    >
                      ❤️
                    </motion.div>
                  ))}
                </div>

                {/* THERAPEUTIC / CLINICAL PRACTICE GUIDANCE */}
                <div className="bg-[#E6F2FF]/10 border border-teal-500/20 rounded-2xl p-3.5 flex gap-2.5 items-start">
                  <span className="text-base shrink-0 select-none">💬</span>
                  <div className="text-left">
                    <span className="text-[8px] font-black uppercase text-teal-300 tracking-wider block">Clinical Guided Interaction</span>
                    <p className="text-[10px] text-stone-200 font-sans leading-relaxed mt-0.5">
                      <strong>Read aloud together:</strong> Take turns speaking this slip. Ask {notes[currentSyncIndex].to} how it feels to have their effort noticed. Gottman Method teaches us to receive praise without deflective minimization!
                    </p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* LOWER CONTROLS PANEL */}
          <div className="w-full flex flex-col items-center gap-3.5 z-10">
            <div className="flex gap-3 justify-center w-full max-w-[320px]">
              
              <button
                onClick={() => {
                  if (currentSyncIndex > 0) {
                    setCurrentSyncIndex(idx => idx - 1);
                    playSingleChime(350);
                  }
                }}
                disabled={currentSyncIndex === 0}
                className={`flex-1 font-display font-black py-2.5 px-4 rounded-xl text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer border-2 border-white/10 ${
                  currentSyncIndex > 0 
                    ? 'bg-transparent text-white hover:bg-white/10' 
                    : 'text-white/20 border-white/5 cursor-not-allowed'
                }`}
              >
                <ArrowLeft size={10} /> Back
              </button>

              {currentSyncIndex < notes.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentSyncIndex(idx => idx + 1);
                    playSingleChime(392 + (currentSyncIndex * 20));
                  }}
                  className="flex-1 bg-teal-500 text-stone-950 font-display font-black py-2.5 px-4 rounded-xl text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition hover:bg-teal-400 cursor-pointer shadow-md shadow-teal-500/20 active:translate-y-[2px]"
                >
                  Next note <ArrowRight size={10} />
                </button>
              ) : (
                <button
                  onClick={handleFinishSyncSession}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-950 font-display font-black py-2.5 px-4 rounded-xl text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition hover:brightness-110 cursor-pointer shadow-md shadow-yellow-500/20 active:translate-y-[2px] border-b-2 border-amber-600 animate-pulse"
                >
                  <span>🎉 Conclude Sync</span>
                  <CheckCircle size={10} />
                </button>
              )}

            </div>

            <div className="text-[8px] text-stone-500 font-mono">
              FAMILY FRAME CO-OP RITUAL • PREVENT CRITICAL DISTANCE
            </div>
          </div>

        </div>
      )}

      {/* HISTORICAL ARCHIVE SUBVIEW */}
      {activeSubView === 'archive' && (
        <div className="flex flex-col gap-4 animate-fade-in text-[#4B4B4B]">
          
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-[10px] leading-relaxed text-stone-500 flex gap-2">
            <Archive className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
            <p>
              <strong>Completed Family Sync History:</strong> Access previous sync sessions to review archived gratitude notes. Recalling shared warmth acts as a buffer during moments of high relational stress.
            </p>
          </div>

          {archives.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-stone-200 py-10 rounded-[2rem] text-center flex flex-col items-center justify-center gap-2">
              <span className="text-xl">🗄️</span>
              <p className="text-[10px] font-sans font-bold text-stone-400">No completed sync history yet.</p>
              <p className="text-[9px] font-sans text-stone-400 max-w-[200px] leading-relaxed">
                Once you complete your first Family Sync session, all notes will be archived safely in this tab.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {archives.map((session) => (
                <div key={session.id} className="bg-white border-2 border-stone-200 p-4.5 rounded-[2rem] shadow-sm flex flex-col gap-3">
                  
                  {/* Session Header */}
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-teal-50 border border-teal-100 p-1.5 rounded-lg text-teal-700">🏆</span>
                      <div>
                        <h4 className="font-display font-black text-xs text-stone-800">Family Sync Ceremony</h4>
                        <span className="text-[8px] font-mono text-stone-400">{session.date}</span>
                      </div>
                    </div>
                    <span className="bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold">
                      {session.notesCount} Slips Read
                    </span>
                  </div>

                  {/* Notes List inside Archive */}
                  <div className="flex flex-col gap-2.5 mt-1 select-text">
                    {session.notes.map((note) => (
                      <div key={note.id} className={`p-3 rounded-2xl border text-[10px] ${note.color} leading-relaxed flex flex-col gap-1.5 shadow-2xs`}>
                        <div className="flex justify-between items-center border-b border-black/5 pb-1">
                          <span className="font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                            {note.emoji} From {note.from} to {note.to}
                          </span>
                          <span className="text-[8px] font-mono text-stone-400">Archived</span>
                        </div>
                        <p className="font-sans italic">"{note.content}"</p>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
