import React, { useState } from 'react';
import { NARRATOR } from '../narrator';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LanceAvatar from '../LanceAvatar';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface DomainVision {
  domainId: string;
  oneYear: string;
  fiveYear: string;
  nextStep: string;
}

interface VisionEntry {
  id: string;
  date: string;
  domains: DomainVision[];
}

const STORAGE_KEY = 'lance_vision_v1';
function load(): VisionEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(e: VisionEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }

const DOMAINS = [
  { id: 'career', label: 'Career & Purpose', emoji: '🎯', color: '#60a5fa', desc: 'Work, mission, contribution' },
  { id: 'relationships', label: 'Relationships', emoji: '❤️', color: '#ec4899', desc: 'Love, friendship, family, community' },
  { id: 'health', label: 'Health & Body', emoji: '💪', color: '#7FD98C', desc: 'Physical, mental, energy, longevity' },
  { id: 'growth', label: 'Growth & Mind', emoji: '🌱', color: '#a78bfa', desc: 'Learning, therapy, skills, wisdom' },
  { id: 'creativity', label: 'Creativity & Play', emoji: '🎨', color: '#f59e0b', desc: 'Art, expression, joy, adventure' },
  { id: 'legacy', label: 'Legacy & Impact', emoji: '🌍', color: '#3ECFCF', desc: 'What you leave behind, your mark on the world' },
];

const LANCE_LINES = [
  "Vision recorded. Research on prospection — the cognitive capacity to simulate future states — shows that vivid, specific future self-projection correlates with present-day goal-directed behavior. You've just done that.",
  "Filed. The next step you identified is more important than the 5-year vision. Most people can articulate long-term goals. Almost no one identifies the immediate action that connects today to that future. You did.",
  "Logged. Goals without timelines are wishes. The domains you've mapped now have structural specificity. That matters.",
  "Documented. The difference between a dream and a plan is a next step. You now have both.",
];

const INTERN_LINES = [
  "Looking at your life across all these domains at once takes real clarity. What you just articulated is a whole picture of who you're becoming. That's powerful.",
  "That next step you wrote — that's the one that matters most. The vision is the destination. The next step is the door.",
  "I love that you're thinking this far forward. It means you believe in your own future. That belief is something.",
  "You're building a life you can see. That's different from just responding to what happens. You're being intentional. That matters enormously.",
];

interface Props { onBack: () => void; }

export default function LifeVision({ onBack }: Props) {
  const { intern, addXp } = useGame();
  const [entries, setEntries] = useState<VisionEntry[]>(load);
  const [view, setView] = useState<'list' | 'select' | 'fill' | 'done'>('list');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [domainIdx, setDomainIdx] = useState(0);
  const [domainData, setDomainData] = useState<Record<string, DomainVision>>({});
  const [lanceIdx] = useState(() => Math.floor(Math.random() * LANCE_LINES.length));
  const [internIdx] = useState(() => Math.floor(Math.random() * INTERN_LINES.length));

  const MAX_DOMAINS = 3;
  const activeDomain = selectedDomains[domainIdx];
  const domainConfig = DOMAINS.find(d => d.id === activeDomain);
  const currentData = domainData[activeDomain] ?? { domainId: activeDomain, oneYear: '', fiveYear: '', nextStep: '' };

  const updateDomainData = (field: keyof DomainVision, val: string) => {
    setDomainData(prev => ({
      ...prev,
      [activeDomain]: { ...currentData, [field]: val },
    }));
  };

  const handleSave = () => {
    const entry: VisionEntry = {
      id: `vision_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      domains: selectedDomains.map(id => domainData[id] ?? { domainId: id, oneYear: '', fiveYear: '', nextStep: '' }),
    };
    const updated = [entry, ...entries];
    save(updated);
    setEntries(updated);
    addXp(35);
    setView('done');
  };

  const canAdvanceDomain = currentData.oneYear.trim().length > 0 && currentData.nextStep.trim().length > 0;

  if (view === 'select') {
    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cognitive.webp)',
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
          <span className="text-lg">🔭</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Choose your focus</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Pick up to {MAX_DOMAINS} domains to vision</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {DOMAINS.map(d => {
            const selected = selectedDomains.includes(d.id);
            const disabled = !selected && selectedDomains.length >= MAX_DOMAINS;
            return (
              <button key={d.id}
                onClick={() => setSelectedDomains(prev => selected ? prev.filter(x => x !== d.id) : [...prev, d.id])}
                disabled={disabled}
                className="w-full p-4 rounded-2xl border text-left transition-all disabled:opacity-40"
                style={{ background: selected ? d.color + '15' : '#FFFFFF', borderColor: selected ? d.color : d.color + '22' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{d.emoji}</span>
                  <div>
                    <p className="text-sm font-black" style={{ color: selected ? d.color : '#3C3C3C' }}>{d.label}</p>
                    <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{d.desc}</p>
                  </div>
                  {selected && <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: d.color, color: '#F9FAFB' }}>✓</div>}
                </div>
              </button>
            );
          })}
          <button onClick={() => { setDomainIdx(0); setView('fill'); }}
            disabled={selectedDomains.length === 0}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#F9FAFB' }}>
            Begin Vision Work →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'fill' && activeDomain && domainConfig) {
    const isLast = domainIdx === selectedDomains.length - 1;
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${domainConfig.color}22` }}>
          <button onClick={() => domainIdx > 0 ? setDomainIdx(i => i - 1) : setView('select')} className="p-2 rounded-xl active:scale-90" style={{ color: '#9CA3AF' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">{domainConfig.emoji}</span>
          <div className="flex-1">
            <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>{domainConfig.label}</h2>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{domainIdx + 1} of {selectedDomains.length}</p>
          </div>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="flex gap-1">
            {selectedDomains.map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full"
                style={{ background: i < domainIdx ? '#7FD98C' : i === domainIdx ? domainConfig.color : domainConfig.color + '22' }} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeDomain} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="rounded-3xl p-4 border" style={{ background: domainConfig.color + '0a', borderColor: domainConfig.color + '33' }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: domainConfig.color }}>1 year from now</p>
                <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>Where do you want to be in this area of your life?</p>
                <textarea value={currentData.oneYear} onChange={e => updateDomainData('oneYear', e.target.value)}
                  rows={3} placeholder={`In my ${domainConfig.label.toLowerCase()}, one year from now I want to...`}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: `1px solid ${domainConfig.color}22`, caretColor: domainConfig.color }} />
              </div>

              <div className="rounded-3xl p-4 border" style={{ background: domainConfig.color + '06', borderColor: domainConfig.color + '22' }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: domainConfig.color }}>5 years from now</p>
                <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>The bigger picture. Let yourself dream a little here.</p>
                <textarea value={currentData.fiveYear} onChange={e => updateDomainData('fiveYear', e.target.value)}
                  rows={3} placeholder="Five years from now, in this domain..."
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: `1px solid ${domainConfig.color}22`, caretColor: domainConfig.color }} />
              </div>

              <div className="rounded-3xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#7FD98C33' }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#7FD98C' }}>Next concrete step</p>
                <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>One thing you can do in the next 7 days toward this vision.</p>
                <textarea value={currentData.nextStep} onChange={e => updateDomainData('nextStep', e.target.value)}
                  rows={2} placeholder="This week I will..."
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: '#F9FAFB', color: '#3C3C3C', border: '1px solid #7FD98C33', caretColor: '#7FD98C' }} />
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => isLast ? handleSave() : setDomainIdx(i => i + 1)}
            disabled={!canAdvanceDomain}
            className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-40"
            style={{ background: isLast ? 'linear-gradient(135deg, #059669, #10b981)' : `linear-gradient(135deg, ${domainConfig.color}cc, ${domainConfig.color})`, color: '#F9FAFB' }}>
            {isLast ? 'Save Vision (+35 XP)' : 'Next Domain →'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'done') {
    const latest = entries[0];
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
          <BigBackButton onBack={onBack} />
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Vision Mapped</h2>
        </div>
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {latest?.domains.map(d => {
              const cfg = DOMAINS.find(x => x.id === d.domainId);
              if (!cfg) return null;
              return (
                <div key={d.domainId} className="rounded-2xl p-4 border" style={{ background: cfg.color + '0a', borderColor: cfg.color + '33' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{cfg.emoji}</span>
                    <span className="text-xs font-black" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: '#3C3C3C' }}>{d.oneYear}</p>
                  <div className="flex items-center gap-1.5 mt-2 p-2 rounded-xl" style={{ background: '#7FD98C11' }}>
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>This week:</span>
                    <span className="text-[10px]" style={{ color: '#7FD98C' }}>{d.nextStep}</span>
                  </div>
                </div>
              );
            })}
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
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#F9FAFB' }}>
              ← Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // List
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <span className="text-lg">🔭</span>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Life Vision</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Long-horizon goal work · 6 life domains</p>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#10b98122', color: '#10b981' }}>+35 XP</div>
      </div>
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {entries.slice(0, 2).map(e => (
          <div key={e.id} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#10b98122' }}>
            <p className="text-[10px] mb-2" style={{ color: '#9CA3AF' }}>
              {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="flex gap-2 flex-wrap">
              {e.domains.map(d => {
                const cfg = DOMAINS.find(x => x.id === d.domainId);
                return cfg ? (
                  <span key={d.domainId} className="text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1"
                    style={{ background: cfg.color + '22', color: cfg.color }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                ) : null;
              })}
            </div>
            {e.domains[0]?.nextStep && (
              <p className="text-[10px] mt-2 italic" style={{ color: '#9CA3AF' }}>
                Next step: {e.domains[0].nextStep}
              </p>
            )}
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#10b98122' }}>
            <div className="text-4xl text-center mb-3">🔭</div>
            <p className="text-xs text-center leading-relaxed" style={{ color: '#6B7280' }}>
              Define where you're going across the domains of your life. Focus on up to 3. Build a 1-year and 5-year picture, and identify one concrete next step.
            </p>
          </div>
        )}

        <button onClick={() => { setView('select'); setSelectedDomains([]); setDomainData({}); setDomainIdx(0); }}
          className="w-full py-4 rounded-2xl font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#F9FAFB' }}>
          🔭 Map My Life Vision
        </button>
      </div>
    </div>
  );
}
