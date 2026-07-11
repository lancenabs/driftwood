import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, LifeBuoy, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// PHQ-9 & GAD-7 SCREENS — the real instruments (public domain), honestly
// framed: a screening is a flashlight, not a verdict. Scores are for the
// conversation with your therapist, not for self-diagnosis.
// CLINICAL SPINE: PHQ-9 item 9 (thoughts of death/self-harm) above zero
// surfaces SOS immediately, warmly, every time. Non-negotiable.
// ============================================================================

const PHQ9_ITEMS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading or watching television',
  'Moving or speaking so slowly that other people could have noticed — or the opposite, being fidgety or restless',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

const GAD7_ITEMS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  "Being so restless that it's hard to sit still",
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen',
];

const FREQ = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

function phqBand(score: number): string {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  if (score <= 19) return 'moderately severe';
  return 'severe';
}
function gadBand(score: number): string {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  return 'severe';
}

interface ScreenResult {
  id: string;
  timestamp: string;
  instrument: 'phq9' | 'gad7';
  score: number;
  item9: number; // phq9 only; 0 for gad7
}

const STORAGE_KEY = 'rehabit_screens_v1';

function load(): ScreenResult[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function save(results: ScreenResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export default function ClinicalScreens({ onBack }: { onBack: () => void }) {
  const [instrument, setInstrument] = useState<'phq9' | 'gad7'>('phq9');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ScreenResult | null>(null);
  const [history, setHistory] = useState<ScreenResult[]>(load);

  const items = instrument === 'phq9' ? PHQ9_ITEMS : GAD7_ITEMS;
  const answered = items.every((_, i) => answers[i] !== undefined);
  const item9Flag = instrument === 'phq9' && (answers[8] ?? 0) > 0;

  const submit = () => {
    const score = items.reduce((sum, _, i) => sum + (answers[i] ?? 0), 0);
    const entry: ScreenResult = {
      id: `scr-${Date.now()}`,
      timestamp: new Date().toISOString(),
      instrument,
      score,
      item9: instrument === 'phq9' ? (answers[8] ?? 0) : 0,
    };
    const next = [entry, ...history];
    setHistory(next); save(next);
    setResult(entry);
  };

  const reset = (inst: 'phq9' | 'gad7') => {
    setInstrument(inst);
    setAnswers({});
    setResult(null);
  };

  const prior = history.filter(h => h.instrument === instrument && h.id !== result?.id)[0];
  const band = result ? (result.instrument === 'phq9' ? phqBand(result.score) : gadBand(result.score)) : '';
  const max = instrument === 'phq9' ? 27 : 21;

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-blue-700">
            <Stethoscope className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">PHQ-9 & GAD-7</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            A screening is a flashlight, not a verdict. Bring the number to your therapist — that's its whole job.
          </p>
        </div>

        <div className="flex gap-2">
          {([['phq9', 'PHQ-9 · mood'], ['gad7', 'GAD-7 · anxiety']] as const).map(([id, label]) => (
            <button key={id} onClick={() => reset(id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                instrument === id ? 'bg-blue-700 border-blue-700 text-white' : 'bg-white border-slate-200 text-slate-500'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {!result && (
          <>
            <p className="text-[11px] text-slate-500 text-center">
              Over the <span className="font-bold">last two weeks</span>, how often have you been bothered by:
            </p>
            {items.map((item, i) => (
              <GlassPanel key={i} className="p-3.5 space-y-2">
                <p className="text-xs font-semibold text-slate-700">{i + 1}. {item}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {FREQ.map((f, v) => (
                    <button key={v} onClick={() => setAnswers(prev => ({ ...prev, [i]: v }))}
                      className={`py-1.5 px-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                        answers[i] === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </GlassPanel>
            ))}

            <AnimatePresence>
              {item9Flag && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <MateCard>
                    You answered honestly about thoughts of death or self-harm — that honesty matters more
                    than any score on this page. Please don't carry it alone: 988 answers around the clock,
                    and the SOS screen has your people one tap away. This is exactly what they're for.
                  </MateCard>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('rehabit:sos'))}
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl text-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                    <LifeBuoy className="w-4 h-4" /> Open SOS — people first
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={submit} disabled={!answered}
              className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 disabled:bg-slate-300 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors">
              {answered ? 'Score it' : `${items.filter((_, i) => answers[i] !== undefined).length} of ${items.length} answered`}
            </button>
          </>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <GlassPanel solid className="p-5 text-center space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {result.instrument === 'phq9' ? 'PHQ-9' : 'GAD-7'} · {new Date(result.timestamp).toLocaleDateString()}
              </p>
              <p className="text-4xl font-black text-slate-800">{result.score}<span className="text-lg text-slate-400"> / {max}</span></p>
              <p className="text-sm font-bold text-blue-700 capitalize">{band} range</p>
              {prior && (
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  {result.score < prior.score ? <TrendingDown className="w-3.5 h-3.5 text-teal-600" />
                    : result.score > prior.score ? <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                    : <Minus className="w-3.5 h-3.5 text-slate-400" />}
                  {Math.abs(result.score - prior.score)} point{Math.abs(result.score - prior.score) === 1 ? '' : 's'} vs. {new Date(prior.timestamp).toLocaleDateString()}
                </p>
              )}
            </GlassPanel>

            {result.item9 > 0 && (
              <>
                <MateCard>
                  One answer on this screen matters more than the total: the thoughts of death or self-harm.
                  Please bring that to a human today — 988 now, your therapist this week. You logged it
                  honestly; let someone help you carry it.
                </MateCard>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('rehabit:sos'))}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl text-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                  <LifeBuoy className="w-4 h-4" /> Open SOS
                </button>
              </>
            )}

            <MateCard>
              What this number is for: a two-week snapshot to lay beside the last one, in front of someone
              qualified to read it. What it is not: a diagnosis, a grade, or a prophecy. Screens change —
              that's the point of taking them more than once.
            </MateCard>

            <button onClick={() => reset(instrument)}
              className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs cursor-pointer hover:bg-slate-50 transition-colors">
              Done
            </button>
          </motion.div>
        )}

        {history.length > 1 && !result && (
          <GlassPanel className="p-4 space-y-1.5">
            <h3 className="text-xs font-black text-slate-700">Past screens</h3>
            {history.slice(0, 6).map(h => (
              <div key={h.id} className="flex items-center justify-between text-[11px] p-2 bg-white/60 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-600">{h.instrument === 'phq9' ? 'PHQ-9' : 'GAD-7'}</span>
                <span className="text-slate-500">{h.score} · {h.instrument === 'phq9' ? phqBand(h.score) : gadBand(h.score)}</span>
                <span className="text-slate-400">{new Date(h.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
