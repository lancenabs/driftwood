import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  CheckCircle, 
  Copy, 
  Plus, 
  Activity, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Trash2, 
  AlertCircle,
  ThumbsUp,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface RepairAttempt {
  id: string;
  category: 'ifeel' | 'timeout' | 'sorry' | 'stop' | 'compromise' | 'appreciation';
  categoryLabel: string;
  phrase: string;
  context: string;
  color: string;
}

interface PracticedLog {
  id: string;
  attemptId: string;
  phrase: string;
  category: string;
  status: 'practiced' | 'successful';
  timestamp: string;
  notes?: string;
}

const DEFAULT_REPAIRS: RepairAttempt[] = [
  // I FEEL
  {
    id: 'rep-1',
    category: 'ifeel',
    categoryLabel: 'I Feel Statements',
    phrase: "I'm starting to feel defensive. Can you help me hear this by saying it differently?",
    context: "Use when you notice your blood pressure rising and feel the urge to guard your ego.",
    color: '#FF6EA7'
  },
  {
    id: 'rep-2',
    category: 'ifeel',
    categoryLabel: 'I Feel Statements',
    phrase: "I feel criticized and flooded. Can we take a deep breath together?",
    context: "Best when criticisms feel personal, triggers are active, and emotional overload is near.",
    color: '#FF6EA7'
  },
  // TIMEOUTS
  {
    id: 'rep-3',
    category: 'timeout',
    categoryLabel: 'Self-Soothe & Timeouts',
    phrase: "I'm too escalated to listen. Let's take a 20-minute break to calm down, and I promise we will finish this tonight.",
    context: "Crucial for preventing stonewalling. Always give a promise of return so your partner doesn't feel abandoned.",
    color: '#2E96B5'
  },
  {
    id: 'rep-4',
    category: 'timeout',
    categoryLabel: 'Self-Soothe & Timeouts',
    phrase: "Can we sit in silence for a minute and hold hands before we keep talking?",
    context: "Physical touch combined with silence helps down-regulate highly reactive fight/flight nervous systems.",
    color: '#2E96B5'
  },
  // APOLOGY
  {
    id: 'rep-5',
    category: 'sorry',
    categoryLabel: 'Apology & Ownership',
    phrase: "You're right, I was being defensive. Let me try again to hear what you are saying.",
    context: "A powerful, instantaneous repair that cuts through competitive arguing.",
    color: '#0E7C7C'
  },
  {
    id: 'rep-6',
    category: 'sorry',
    categoryLabel: 'Apology & Ownership',
    phrase: "I am really sorry for my tone just now. I want to talk about this, but I lost my cool.",
    context: "Acknowledge the packaging of your message rather than debating the core content.",
    color: '#0E7C7C'
  },
  // STOP ACTION
  {
    id: 'rep-7',
    category: 'stop',
    categoryLabel: 'Stop Action / Reset',
    phrase: "We're getting off track. Can we press the pause button and do a do-over?",
    context: "Use when the fight is turning into a compilation of past historic complaints.",
    color: '#CE9FFC'
  },
  {
    id: 'rep-8',
    category: 'stop',
    categoryLabel: 'Stop Action / Reset',
    phrase: "Let's hit the brakes. This is not how I want us to talk to each other.",
    context: "Sets a boundaries guideline without placing direct blame on the partner.",
    color: '#CE9FFC'
  },
  // COMPROMISE
  {
    id: 'rep-9',
    category: 'compromise',
    categoryLabel: 'Get to Yes',
    phrase: "I agree with part of what you're saying. Can we build on that point?",
    context: "Validates your partner's truth, shifting the dynamic from adversaries to collaborators.",
    color: '#FF8A00'
  },
  {
    id: 'rep-10',
    category: 'compromise',
    categoryLabel: 'Get to Yes',
    phrase: "Let's figure out what we both need here to feel okay. What is your absolute non-negotiable?",
    context: "Identifies core values vs flexible preferences to negotiate a stable win-win.",
    color: '#FF8A00'
  },
  // APPRECIATION
  {
    id: 'rep-11',
    category: 'appreciation',
    categoryLabel: 'Appreciation & Love',
    phrase: "I love you. Even though we are totally disagreeing on this right now.",
    context: "Separates the temporary conflict from the durable attachment bond.",
    color: '#E01563'
  },
  {
    id: 'rep-12',
    category: 'appreciation',
    categoryLabel: 'Appreciation & Love',
    phrase: "Thank you for staying in this conversation with me, even when it feels hard.",
    context: "Recognizes the vulnerability and effort your partner is investing in the relationship.",
    color: '#E01563'
  }
];

export default function RepairToolkit() {
  const [repairs, setRepairs] = useState<RepairAttempt[]>(() => {
    const saved = localStorage.getItem('driftwood_mending_custom_v1');
    return saved ? JSON.parse(saved) : DEFAULT_REPAIRS;
  });

  const [logs, setLogs] = useState<PracticedLog[]>(() => {
    const saved = localStorage.getItem('driftwood_mending_v1');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        attemptId: 'rep-1',
        phrase: "I'm starting to feel defensive. Can you help me hear this by saying it differently?",
        category: 'I Feel Statements',
        status: 'successful',
        timestamp: '2026-07-08',
        notes: "We stopped yelling during the dishes discussion. Partner rephrased softly and it really helped."
      },
      {
        id: 'log-2',
        attemptId: 'rep-5',
        phrase: "You're right, I was being defensive. Let me try again to hear what you are saying.",
        category: 'Apology & Ownership',
        status: 'practiced',
        timestamp: '2026-07-09',
        notes: "I managed to say it, though I still felt some physical tension. Progress not perfection."
      }
    ];
  });

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom form state
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState<'ifeel' | 'timeout' | 'sorry' | 'stop' | 'compromise' | 'appreciation'>('ifeel');
  const [newContext, setNewContext] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Quick logging notes dialog
  const [loggingAttemptId, setLoggingAttemptId] = useState<string | null>(null);
  const [loggingStatus, setLoggingStatus] = useState<'practiced' | 'successful'>('practiced');
  const [logNotes, setLogNotes] = useState('');

  const saveRepairs = (updated: RepairAttempt[]) => {
    setRepairs(updated);
    localStorage.setItem('driftwood_mending_custom_v1', JSON.stringify(updated));
  };

  const saveLogs = (updated: PracticedLog[]) => {
    setLogs(updated);
    localStorage.setItem('driftwood_mending_v1', JSON.stringify(updated));
  };

  const handleCopyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhrase.trim()) return;

    let catLabel = 'Custom Statement';
    let col = '#2E96B5';
    if (newCategory === 'ifeel') { catLabel = 'I Feel Statements'; col = '#FF6EA7'; }
    if (newCategory === 'timeout') { catLabel = 'Self-Soothe & Timeouts'; col = '#2E96B5'; }
    if (newCategory === 'sorry') { catLabel = 'Apology & Ownership'; col = '#0E7C7C'; }
    if (newCategory === 'stop') { catLabel = 'Stop Action / Reset'; col = '#CE9FFC'; }
    if (newCategory === 'compromise') { catLabel = 'Get to Yes'; col = '#FF8A00'; }
    if (newCategory === 'appreciation') { catLabel = 'Appreciation & Love'; col = '#E01563'; }

    const created: RepairAttempt = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      categoryLabel: catLabel,
      phrase: newPhrase.trim(),
      context: newContext.trim() || 'Custom repair attempt tailormade for our relationship bubble.',
      color: col
    };

    saveRepairs([created, ...repairs]);
    setNewPhrase('');
    setNewContext('');
    setIsAddingCustom(false);
  };

  const handleDeleteRepair = (id: string) => {
    const updated = repairs.filter(r => r.id !== id);
    saveRepairs(updated);
  };

  const handleLogAttemptSubmit = () => {
    const attempt = repairs.find(r => r.id === loggingAttemptId);
    if (!attempt) return;

    const newLog: PracticedLog = {
      id: `log-${Date.now()}`,
      attemptId: attempt.id,
      phrase: attempt.phrase,
      category: attempt.categoryLabel,
      status: loggingStatus,
      timestamp: new Date().toISOString().split('T')[0],
      notes: logNotes.trim() || undefined
    };

    saveLogs([newLog, ...logs]);
    setLoggingAttemptId(null);
    setLogNotes('');
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to reset your Repair Attempt Logs for the week?')) {
      saveLogs([]);
    }
  };

  const filteredRepairs = repairs.filter(r => {
    if (activeCategoryFilter === 'All') return true;
    return r.category === activeCategoryFilter;
  });

  // Calculate stats
  const totalPracticed = logs.length;
  const successfulCount = logs.filter(l => l.status === 'successful').length;
  const successRate = totalPracticed > 0 ? Math.round((successfulCount / totalPracticed) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] animate-fade-in" id="repair-toolkit-parent">
      
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-[#FF6EA7] to-[#E01563] text-white p-5 rounded-[2.2rem] shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/10">FamilyFrame Integration</span>
            <h4 className="font-display font-black text-lg text-white leading-tight mt-2">Relational Repair Toolkit</h4>
            <p className="text-[10px] text-white/90 font-sans mt-1 leading-relaxed max-w-[290px]">
              "The difference between stable and unstable couples isn't that they don't fight, but that stable couples repair successfully." — Dr. John Gottman
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl border border-white/20">
            🩹
          </div>
        </div>

        {/* Dynamic Weekly Progress */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center">
          <div className="bg-white/10 p-2 rounded-xl border border-white/5">
            <span className="text-[8px] font-mono text-white/80 block uppercase">Weekly Attempts</span>
            <span className="text-sm font-black text-white">{totalPracticed}</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl border border-white/5">
            <span className="text-[8px] font-mono text-white/80 block uppercase">Successful</span>
            <span className="text-sm font-black text-white">{successfulCount}</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl border border-white/5">
            <span className="text-[8px] font-mono text-white/80 block uppercase">Repair Success Rate</span>
            <span className="text-sm font-black text-white">{successRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left column (Attempts Index) & Right column (Weekly Logs Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Phrases Deck (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          {/* Filters & Add Custom button row */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'All', label: 'All Repairs' },
                { id: 'ifeel', label: 'I Feel' },
                { id: 'timeout', label: 'Timeouts' },
                { id: 'sorry', label: 'Sorry' },
                { id: 'stop', label: 'Reset' },
                { id: 'compromise', label: 'Yes' },
                { id: 'appreciation', label: 'Love' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                    activeCategoryFilter === cat.id
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="bg-primary text-white text-[9.5px] font-black uppercase tracking-wider py-1.5 px-3 rounded-full flex items-center gap-1 hover:scale-102 border-b-2 border-green-700 transition"
            >
              <Plus size={11} /> Custom Repair
            </button>
          </div>

          {/* Add Custom Repair Attempt Form */}
          {isAddingCustom && (
            <form onSubmit={handleCreateCustom} className="bg-stone-50 p-4 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col gap-3 animate-fade-in">
              <h5 className="font-display font-black text-xs text-stone-700 uppercase tracking-tight">Draft Custom FamilyFrame Repair</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold uppercase text-stone-400">Clinical Focus Group</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="bg-white border border-stone-200 rounded-lg p-2 text-[10.5px] text-stone-700 focus:outline-none"
                  >
                    <option value="ifeel">I Feel Statement</option>
                    <option value="timeout">Timeout / Physiological Break</option>
                    <option value="sorry">Apology / Acceptance of Responsibility</option>
                    <option value="stop">Stop Action / Discussion De-escalator</option>
                    <option value="compromise">Compromise / Getting to Yes</option>
                    <option value="appreciation">Appreciation / Validation Statement</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold uppercase text-stone-400">Contextual Trigger / Guide (Optional)</label>
                  <input
                    type="text"
                    value={newContext}
                    onChange={(e) => setNewContext(e.target.value)}
                    placeholder="E.g., Say this when discussions about chores escalate."
                    className="bg-white border border-stone-200 rounded-lg p-2 text-[10.5px] text-stone-700 focus:outline-none placeholder-stone-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8.5px] font-bold uppercase text-stone-400">Repair Phrase Script</label>
                <textarea
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  placeholder="E.g., Let's stop arguing about who does what and just enjoy dinner. We can deal with this tomorrow."
                  rows={2}
                  required
                  className="bg-white border border-stone-200 rounded-lg p-2 text-[10.5px] text-stone-700 focus:outline-none placeholder-stone-400 font-serif italic"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider"
                >
                  Publish to Toolkit
                </button>
              </div>
            </form>
          )}

          {/* Quick-logging Dialog Popover */}
          {loggingAttemptId && (
            <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-md border border-stone-800 flex flex-col gap-3 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] text-[#FF6EA7] uppercase font-black tracking-widest">Clinical Log Entry</span>
                  <h6 className="font-display font-black text-xs text-white">Record Weekly Repair Attempt Outcome</h6>
                </div>
                <button 
                  onClick={() => setLoggingAttemptId(null)}
                  className="text-stone-400 hover:text-white text-[10px]"
                >
                  Cancel
                </button>
              </div>

              <div className="bg-stone-800 p-2.5 rounded-xl border border-stone-700 text-[10px] leading-relaxed italic text-stone-300">
                "{repairs.find(r => r.id === loggingAttemptId)?.phrase}"
              </div>

              <div className="flex gap-3 items-center">
                <span className="text-[9px] font-bold text-stone-400 uppercase">Outcome Status:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setLoggingStatus('practiced')}
                    className={`px-3 py-1 text-[9px] rounded-lg font-black uppercase tracking-wider transition ${
                      loggingStatus === 'practiced' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    ✊ Practiced
                  </button>
                  <button
                    onClick={() => setLoggingStatus('successful')}
                    className={`px-3 py-1 text-[9px] rounded-lg font-black uppercase tracking-wider transition ${
                      loggingStatus === 'successful' 
                        ? 'bg-primary text-white' 
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    🎉 Successful Repair
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8.5px] font-bold uppercase text-stone-400">Brief context notes (What happened?):</label>
                <input
                  type="text"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="E.g., Said this when the discussion about our parents started spiraling..."
                  className="bg-stone-800 text-white border border-stone-700 text-[10.5px] rounded-lg p-2 focus:outline-none placeholder-stone-500"
                />
              </div>

              <button
                onClick={handleLogAttemptSubmit}
                className="bg-white text-stone-900 text-[10px] font-black uppercase tracking-widest py-2 rounded-xl text-center hover:bg-stone-100 transition"
              >
                Log to Weekly Dashboard
              </button>
            </div>
          )}

          {/* Repair Cards Deck Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredRepairs.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border-2 border-stone-200/80 p-4 hover:shadow-sm transition-all flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-stone-50 rounded-bl-3xl -z-10"></div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-start gap-1">
                    <span 
                      className="text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border tracking-wide"
                      style={{ 
                        color: item.color, 
                        backgroundColor: `${item.color}10`,
                        borderColor: `${item.color}25`
                      }}
                    >
                      {item.categoryLabel}
                    </span>
                    {item.id.startsWith('custom-') && (
                      <button 
                        onClick={() => handleDeleteRepair(item.id)}
                        className="text-stone-300 hover:text-rose-500 p-0.5"
                        title="Delete custom phrase"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>

                  <p className="font-serif italic font-medium text-[11px] text-stone-800 leading-relaxed">
                    "{item.phrase}"
                  </p>

                  <p className="text-[9.5px] text-stone-500 leading-normal font-sans bg-stone-50 p-2 rounded-xl border border-stone-100 mt-1">
                    {item.context}
                  </p>
                </div>

                <div className="flex gap-1.5 mt-2 border-t border-stone-100 pt-3">
                  <button
                    onClick={() => handleCopyToClipboard(item.id, item.phrase)}
                    className="flex-1 bg-stone-50 hover:bg-stone-100 text-stone-600 text-[9.5px] font-black uppercase py-1.5 px-2 rounded-lg border border-stone-200 flex items-center justify-center gap-1 transition"
                  >
                    <Copy size={10} /> {copiedId === item.id ? 'Copied!' : 'Copy Script'}
                  </button>
                  <button
                    onClick={() => {
                      setLoggingAttemptId(item.id);
                      setLoggingStatus('successful');
                    }}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-[9.5px] font-black uppercase py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    🩹 Log Practice
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Practice Logs Activity Dashboard (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          <div className="bg-surface-container-lowest p-4.5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-3.5">
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2.5">
              <div>
                <span className="text-[8px] font-black uppercase tracking-wider text-stone-400">Activity Ledger</span>
                <h5 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight">Weekly Repair Logs</h5>
              </div>
              {logs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="text-stone-400 hover:text-stone-600 font-mono text-[8px] uppercase tracking-wide"
                >
                  Reset Log
                </button>
              )}
            </div>

            {/* Custom Clinical Audit Gauge */}
            <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-3.5 rounded-2xl border border-stone-200/50 flex flex-col gap-1.5">
              <span className="text-[8.5px] font-black uppercase text-stone-500 tracking-wide flex items-center gap-1">
                <Activity size={10} className="text-[#FF6EA7]" /> Relational Co-Regulation
              </span>
              <p className="text-[10px] text-stone-600 leading-relaxed">
                By logging repairs, both partners can validate each other's conscious effort, fostering emotional safety.
              </p>
            </div>

            {/* Scrolling Logs list */}
            <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="bg-white p-3 rounded-xl border border-stone-200/70 text-[10.5px] flex flex-col gap-1.5 relative hover:border-stone-300 transition">
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <span className="text-[8px] font-mono text-stone-400 uppercase font-bold">
                      {log.category}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-1.5 rounded ${
                      log.status === 'successful' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {log.status === 'successful' ? '✓ Success' : '✊ Practiced'}
                    </span>
                  </div>

                  <blockquote className="font-serif italic text-[10px] text-stone-700 leading-relaxed border-l-2 border-stone-200 pl-2">
                    "{log.phrase}"
                  </blockquote>

                  {log.notes && (
                    <p className="text-[9.5px] text-stone-500 bg-stone-50 p-1.5 rounded-lg border border-stone-100 font-sans mt-0.5">
                      <strong>Notes:</strong> {log.notes}
                    </p>
                  )}

                  <div className="text-[8px] font-mono text-stone-400 text-right">
                    Logged {log.timestamp}
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-10 text-stone-400">
                  <Heart size={28} className="text-stone-300 mb-1.5" />
                  <h6 className="font-display font-black text-[11px] text-stone-600 uppercase tracking-wider">No logged repairs yet</h6>
                  <p className="text-[9.5px] leading-relaxed max-w-[170px] mt-1">
                    Try using some repair phrases in conflicts, then hit "Log Practice" to record your progress!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Theoretical framework education sidebar */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/60 p-4.5 rounded-[2rem] flex flex-col gap-2">
            <span className="text-[8.5px] font-black uppercase tracking-wider text-[#CE9FFC]">The FamilyFrame Standard</span>
            <h5 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight flex items-center gap-1">
              <BookOpen size={11} className="text-[#CE9FFC]" /> Repair Mechanics
            </h5>
            <p className="text-[10px] text-stone-600 leading-relaxed">
              Family therapists teach that <strong>highly resilient couples and families</strong> do not avoid conflict. Rather, they initiate rapid de-escalations during conflicts to keep their partner's physiological threat levels low. Use these phrases consistently to safeguard your "Couple Bubble."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
