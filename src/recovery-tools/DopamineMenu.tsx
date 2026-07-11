import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UtensilsCrossed, Sparkles, Plus, X } from 'lucide-react';
import BigBackButton from '../lance/components/LANCEGame/BigBackButton';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';
import MateCard from './MateCard';

// ============================================================================
// DOPAMINE MENU — the neuroscience of the curriculum, plated like a menu.
// Addiction narrowed the menu to one item. Early recovery is a re-opening:
// receptors up-regulate, the baseline rebuilds — IF you feed it real meals.
// Quick hits hold the line; slow burns rebuild the kitchen. Build your own
// menu when calm; when bored or craving, let the house deal you an order.
// ============================================================================

interface MenuItem {
  id: string;
  text: string;
  course: 'quick' | 'slow';
}

interface OrderLog {
  id: string;
  timestamp: string;
  quick: string;
  slow: string;
}

const MENU_KEY = 'rehabit_dopamine_menu_v1';
const ORDERS_KEY = 'rehabit_dopamine_orders_v1';

function loadMenu(): MenuItem[] {
  try { return JSON.parse(localStorage.getItem(MENU_KEY) || '[]'); } catch { return []; }
}
function saveMenu(items: MenuItem[]) {
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
}
function loadOrders(): OrderLog[] {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; }
}
function saveOrders(orders: OrderLog[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// House suggestions, straight off the curriculum's activity bank (§8/§9).
const QUICK_SUGGESTIONS = [
  'Cold water on the face', 'One song, actually listened to', 'Twenty of anything (steps, squats, dishes)',
  'Step outside for two minutes', 'A full glass of water', 'Squeeze-and-release, hands to shoulders',
];
const SLOW_SUGGESTIONS = [
  'An hour of a real hobby', 'Cook something with steps', 'A walk with no phone',
  'Draw / build / knit / fix something', 'Call someone and go deep', 'A meeting, in person',
];

export default function DopamineMenu({ onBack }: { onBack: () => void }) {
  const [menu, setMenu] = useState<MenuItem[]>(loadMenu);
  const [orders, setOrders] = useState<OrderLog[]>(loadOrders);
  const [draft, setDraft] = useState('');
  const [draftCourse, setDraftCourse] = useState<'quick' | 'slow'>('quick');
  const [dealt, setDealt] = useState<{ quick: string; slow: string } | null>(null);

  const quick = menu.filter(m => m.course === 'quick');
  const slow = menu.filter(m => m.course === 'slow');

  const addItem = (text: string, course: 'quick' | 'slow') => {
    const t = text.trim();
    if (!t) return;
    if (menu.some(m => m.text.toLowerCase() === t.toLowerCase() && m.course === course)) return;
    const next = [...menu, { id: `mi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: t, course }];
    setMenu(next); saveMenu(next); setDraft('');
  };

  const removeItem = (id: string) => {
    const next = menu.filter(m => m.id !== id);
    setMenu(next); saveMenu(next);
  };

  const deal = () => {
    const q = quick[Math.floor(Math.random() * quick.length)]?.text
      ?? QUICK_SUGGESTIONS[Math.floor(Math.random() * QUICK_SUGGESTIONS.length)];
    const s = slow[Math.floor(Math.random() * slow.length)]?.text
      ?? SLOW_SUGGESTIONS[Math.floor(Math.random() * SLOW_SUGGESTIONS.length)];
    setDealt({ quick: q, slow: s });
    const entry: OrderLog = { id: `ord-${Date.now()}`, timestamp: new Date().toISOString(), quick: q, slow: s };
    const next = [entry, ...orders];
    setOrders(next); saveOrders(next);
  };

  const Column = ({ title, sub, items, course, suggestions }: {
    title: string; sub: string; items: MenuItem[]; course: 'quick' | 'slow'; suggestions: string[];
  }) => (
    <GlassPanel className="p-4 space-y-2">
      <div>
        <h3 className="text-xs font-black text-slate-800">{title}</h3>
        <p className="text-[10px] text-slate-400">{sub}</p>
      </div>
      {items.map(m => (
        <div key={m.id} className="flex items-center justify-between gap-2 p-2 bg-white/70 border border-slate-100 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-600">{m.text}</span>
          <button onClick={() => removeItem(m.id)} className="text-slate-300 hover:text-slate-500 cursor-pointer" aria-label="Remove">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <div className="space-y-1">
          {suggestions.slice(0, 3).map(sugg => (
            <button key={sugg} onClick={() => addItem(sugg, course)}
              className="w-full text-left px-2.5 py-1.5 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-[10px] text-slate-400 hover:text-slate-600 hover:border-slate-300 cursor-pointer transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> {sugg}
            </button>
          ))}
        </div>
      )}
    </GlassPanel>
  );

  return (
    <div className="relative min-h-full p-4 md:p-6 pb-24" style={{ background: 'linear-gradient(180deg, #FEFCE8 0%, #F8FAFC 35%)' }}>
      <BigBackButton onBack={onBack} />

      <div className="max-w-xl mx-auto space-y-4 pt-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-yellow-700">
            <UtensilsCrossed className="w-5 h-5" />
            <h1 className="text-xl font-black tracking-tight">Dopamine Menu</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            The substance shrank the menu to one item. This is the re-opening.
          </p>
        </div>

        <MateCard>
          The science in one breath: your receptors are up-regulating and your baseline is rebuilding —
          week by week, IF it gets fed real meals. Quick hits hold the line in a hard minute; slow burns
          rebuild the kitchen. One slow burn a day is the house special — not so you won't use, but
          because it genuinely refuels you.
        </MateCard>

        <button onClick={deal}
          className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 text-white font-black rounded-2xl text-sm shadow-lg cursor-pointer transition-colors flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> I'm bored / craving — deal me an order
        </button>

        <AnimatePresence>
          {dealt && (
            <motion.div key={dealt.quick + dealt.slow} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="p-4 bg-white border-2 border-yellow-300 rounded-2xl shadow-md space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600 text-center">Tonight's order</p>
              <div className="flex items-start gap-2">
                <span className="text-[9px] font-black uppercase text-slate-400 w-16 pt-0.5 shrink-0">Right now</span>
                <p className="text-sm font-bold text-slate-800">{dealt.quick}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[9px] font-black uppercase text-slate-400 w-16 pt-0.5 shrink-0">The meal</span>
                <p className="text-sm font-bold text-slate-800">{dealt.slow}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-3">
          <Column title="Quick hits (healthy)" sub="Under five minutes. Holds the line." items={quick} course="quick" suggestions={QUICK_SUGGESTIONS} />
          <Column title="Slow burns" sub="Absorbing, real, an hour-ish. Rebuilds the baseline." items={slow} course="slow" suggestions={SLOW_SUGGESTIONS} />
        </div>

        <GlassPanel className="p-4 space-y-2">
          <label className="text-xs font-black text-slate-700 block">Add your own dish:</label>
          <div className="flex gap-2">
            <input value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem(draft, draftCourse)}
              placeholder="Something that genuinely refuels you…"
              className="flex-1 p-2.5 bg-white/70 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <button onClick={() => setDraftCourse(c => c === 'quick' ? 'slow' : 'quick')}
              className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors whitespace-nowrap">
              {draftCourse === 'quick' ? 'Quick hit' : 'Slow burn'}
            </button>
            <button onClick={() => addItem(draft, draftCourse)}
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl cursor-pointer transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </GlassPanel>

        {orders.length > 0 && (
          <p className="text-center text-[10px] text-slate-400">
            {orders.length} order{orders.length === 1 ? '' : 's'} served. Every real meal raises the baseline a little.
          </p>
        )}
      </div>
    </div>
  );
}
