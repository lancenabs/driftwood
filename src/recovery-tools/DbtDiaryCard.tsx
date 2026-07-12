import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, LifeBuoy, Check } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// DBT DIARY CARD — the classic daily skills tracker, recovery edition.
// Rate today's emotions and urges (0–5), check the skills you actually used,
// one honest line. The week view shows the real curve, not the remembered one.
// Clinical rule: any self-harm urge above zero surfaces the lifebuoy — softly,
// immediately, every time. Tracking it is brave; facing it alone isn't required.
// ============================================================================

interface DiaryDay {
  date: string;               // YYYY-MM-DD
  emotions: Record<string, number>;
  urges: Record<string, number>;
  skills: string[];
  note: string;
}

const STORAGE_KEY = 'rehabit_diary_cards_v1';

function load(): DiaryDay[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(days: DiaryDay[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
}

const EMOTIONS = ['Sadness', 'Anger', 'Fear', 'Shame', 'Joy'];
const URGES = [
  { id: 'use', label: 'Urge to use' },
  { id: 'selfharm', label: 'Urge to self-harm' },
  { id: 'isolate', label: 'Urge to isolate' },
];
const SKILLS = [
  'Wise Mind', 'Urge surfing', 'Opposite action', 'TIPP', 'Pros & cons',
  '5-4-3-2-1 grounding', 'Self-soothe', 'DEAR MAN', 'Radical acceptance',
  'Reached out to someone', 'Balancing activity', 'Check the facts',
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DbtDiaryCard({ onBack }: { onBack: () => void }) {
  const [days, setDays] = useState<DiaryDay[]>(load);
  const existing = days.find(d => d.date === todayKey());
  const [emotions, setEmotions] = useState<Record<string, number>>(existing?.emotions || {});
  const [urges, setUrges] = useState<Record<string, number>>(existing?.urges || {});
  const [skills, setSkills] = useState<string[]>(existing?.skills || []);
  const [note, setNote] = useState(existing?.note || '');
  const [saved, setSaved] = useState(false);

  const selfHarmFlag = (urges.selfharm || 0) > 0;

  const toggleSkill = (s: string) => {
    setSaved(false);
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const saveDay = () => {
    const entry: DiaryDay = { date: todayKey(), emotions, urges, skills, note: note.trim() };
    const next = [entry, ...days.filter(d => d.date !== todayKey())];
    setDays(next);
    save(next);
    setSaved(true);
  };

  // Last 7 calendar days for the week strip.
  const week: { key: string; day: DiaryDay | undefined }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    week.push({ key, day: days.find(x => x.date === key) });
  }

  const Rating = ({ value, onChange, accent }: { value: number; onChange: (n: number) => void; accent: string }) => (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => { onChange(n); setSaved(false); }}
          className={`w-7 h-7 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
            value === n ? `${accent} text-white border-transparent` : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
          }`}>
          {n}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-violet-700">
            <ClipboardList className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">DBT Diary Card</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Two honest minutes a day. The card remembers the week your memory smooths over.
          </p>
        </div>

        {/* Week strip */}
        <div className="grid grid-cols-7 gap-1.5">
          {week.map(({ key, day }) => {
            const label = new Date(key + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'narrow' });
            const isToday = key === todayKey();
            return (
              <div key={key} className={`p-1.5 rounded-xl border text-center ${
                isToday ? 'border-violet-300 bg-violet-50' : day ? 'border-teal-200 bg-teal-50' : 'border-slate-200 bg-white'
              }`}>
                <p className="text-[9px] font-black text-slate-400">{label}</p>
                {day ? <Check className="w-3 h-3 text-teal-600 mx-auto" /> : <p className="text-[10px] text-slate-300">·</p>}
              </div>
            );
          })}
        </div>

        <GlassPanel className="p-4 space-y-3">
          <h3 className="text-xs font-black text-slate-700">Emotions today (0 = none · 5 = flooded)</h3>
          {EMOTIONS.map(e => (
            <div key={e} className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600 w-20">{e}</span>
              <Rating value={emotions[e] ?? -1} onChange={n => setEmotions(prev => ({ ...prev, [e]: n }))} accent="bg-violet-600" />
            </div>
          ))}
        </GlassPanel>

        <GlassPanel className="p-4 space-y-3">
          <h3 className="text-xs font-black text-slate-700">Urges today</h3>
          {URGES.map(u => (
            <div key={u.id} className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600 w-28">{u.label}</span>
              <Rating value={urges[u.id] ?? -1} onChange={n => setUrges(prev => ({ ...prev, [u.id]: n }))} accent="bg-rose-500" />
            </div>
          ))}
        </GlassPanel>

        {selfHarmFlag && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <MateCard>
              You rated the self-harm urge above zero — logging that honestly took real courage.
              This is exactly the moment the crew exists for: a human voice helps more than any card.
              The safety plan you set up with your therapist lives in Settings, and your own people are one tap away.
            </MateCard>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('app:open-safety-settings'))}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl text-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5">
              <LifeBuoy className="w-4 h-4" /> Open your safety plan (Settings)
            </button>
          </motion.div>
        )}

        <GlassPanel className="p-4 space-y-2">
          <h3 className="text-xs font-black text-slate-700">Skills you actually used</h3>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS.map(s => (
              <button key={s} onClick={() => toggleSkill(s)}
                className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                  skills.includes(s) ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 space-y-2">
          <label className="text-xs font-black text-slate-700 block">One honest line about today:</label>
          <input value={note} onChange={e => { setNote(e.target.value); setSaved(false); }}
            placeholder="Honest beats pretty…"
            className="w-full p-3 bg-white/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-400" />
        </GlassPanel>

        <button onClick={saveDay}
          className="w-full py-3.5 bg-violet-700 hover:bg-violet-600 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
          {saved ? '✓ Saved — today is on the card' : existing ? 'Update today' : 'Save today'}
        </button>

        {days.length >= 3 && (
          <p className="text-center text-[10px] text-slate-400">
            {days.length} days on the card. When the bridge to your therapist lands, this is the page they'll be glad you kept.
          </p>
        )}
      </div>
    </div>
  );
}
