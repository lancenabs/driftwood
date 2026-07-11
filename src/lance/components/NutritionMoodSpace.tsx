import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Apple, Plus, Trash2, Calendar, Clock, Smile, Sparkles, Zap, ShieldAlert,
  ChevronRight, Heart, HeartHandshake, Award, Coffee, Cake, Info
} from 'lucide-react';
import { NutritionMealLog } from '../types';

interface NutritionMoodSpaceProps {
  onAddMealLog: (log: NutritionMealLog) => void;
  mealLogs: NutritionMealLog[];
  onRemoveMealLog: (id: string) => void;
}

const PRESET_TAGS = [
  { label: '☕ Caffeine', value: 'Caffeine', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { label: '🍭 High Sugar', value: 'Sugar', color: 'bg-pink-100 text-pink-900 border-pink-200' },
  { label: '🌾 Heavy Carbs', value: 'Heavy Carbs', color: 'bg-yellow-100 text-yellow-900 border-yellow-200' },
  { label: '🥩 Lean Protein', value: 'Lean Protein', color: 'bg-red-100 text-red-900 border-red-200' },
  { label: '🥦 Veggies & Greens', value: 'Veggies', color: 'bg-green-100 text-green-900 border-green-200' },
  { label: '🍶 Fermented Foods', value: 'Fermented', color: 'bg-teal-100 text-teal-900 border-teal-200' },
  { label: '🍟 Processed / Fast Food', value: 'Processed', color: 'bg-rose-100 text-rose-900 border-rose-200' },
  { label: '🥜 Nuts & Seeds', value: 'Nuts & Seeds', color: 'bg-orange-100 text-orange-900 border-orange-200' },
  { label: '🥤 High Hydration', value: 'Hydration', color: 'bg-sky-100 text-sky-900 border-sky-200' }
];

const PRESET_MEALS = [
  { id: 'breakfast' as const, label: '🍳 Breakfast', desc: 'First metabolic start' },
  { id: 'lunch' as const, label: '🥗 Lunch', desc: 'Midday sustaining fuel' },
  { id: 'dinner' as const, label: '🍲 Dinner', desc: 'Sleep preconditioning' },
  { id: 'snack' as const, label: '🍿 Snack/Dessert', desc: 'Intermittent booster' }
];

export default function NutritionMoodSpace({
  onAddMealLog,
  mealLogs,
  onRemoveMealLog
}: NutritionMoodSpaceProps) {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [foodItems, setFoodItems] = useState('');
  const [moodRating, setMoodRating] = useState<number>(3);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(2);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const [validationError, setValidationError] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItems.trim()) {
      setValidationError('Please specify what food or meal options were consumed.');
      return;
    }
    setValidationError('');

    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    const newLog: NutritionMealLog = {
      id: `meal-${Date.now()}`,
      date: `${YYYY}-${MM}-${DD}`,
      time: timeStr,
      mealType,
      foodItems: foodItems.trim(),
      moodRating,
      energyLevel,
      anxietyLevel,
      tags: selectedTags,
      notes: notes.trim() || undefined
    };

    onAddMealLog(newLog);
    
    // Reset form states
    setFoodItems('');
    setMoodRating(3);
    setEnergyLevel(3);
    setAnxietyLevel(2);
    setSelectedTags([]);
    setNotes('');
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 3000);
  };

  const getGlucoseVibe = (tags: string[]) => {
    if (tags.includes('Sugar') || tags.includes('Processed')) {
      return { msg: '🚨 High Spike Potential', desc: 'Expect a crash in 60-90m. Consider deep exhales or brief hydration walks.', style: 'bg-red-50 text-red-800 border-red-100' };
    }
    if (tags.includes('Lean Protein') || tags.includes('Veggies') || tags.includes('Fermented')) {
      return { msg: '⚡ High Homeostatic Safety', desc: 'Slow digestive assimilation. Provides stable neuro-baseline with minimal insulin spikes.', style: 'bg-emerald-50 text-emerald-800 border-emerald-100' };
    }
    return { msg: '⚖️ Standard Fueling', desc: 'Normal digestive curve. Monitor immediate changes in focus and drowsiness.', style: 'bg-slate-50 text-slate-700 border-slate-100' };
  };

  const activeVibe = getGlucoseVibe(selectedTags);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto align-stretch text-left">
      
      {/* LEFT COLUMN: MEAL SUBMISSION FORM */}
      <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-800 font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase font-mono">
                Gut-Brain Axis Integrator
              </span>
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5 font-sans">
                <Apple className="w-5 h-5 text-emerald-500" />
                <span>Log Nutrition & Post-Meal Response</span>
              </h3>
            </div>
            
            <span className="text-[10px] text-zinc-400 font-bold font-mono uppercase bg-slate-50 border px-2 py-0.5 rounded-md">
              Bio-Integration
            </span>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              {validationError}
            </div>
          )}

          {/* Success Animation Banner */}
          {successAnimation && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>Nutrition entry logged successfully! Real-time correlation updated in the Analyze tab.</span>
            </div>
          )}

          {/* Meal Type Select cards */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
              1. Meal Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_MEALS.map((meal) => {
                const isSelected = mealType === meal.id;
                return (
                  <button
                    key={meal.id}
                    type="button"
                    onClick={() => setMealType(meal.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition relative cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500 text-slate-900 shadow-3xs'
                        : 'border-slate-100 hover:border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    <span className="text-xs font-black font-sans leading-none">{meal.label}</span>
                    <span className="text-[8px] text-slate-400 font-semibold leading-relaxed mt-1">
                      {meal.desc}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* What was Eaten Input Area */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
              2. Consumed Food details
            </label>
            <input
              type="text"
              value={foodItems}
              onChange={(e) => setFoodItems(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition"
              placeholder="e.g., Avocado Salmon salad, Matcha Latte, or Heavy pasta..."
            />
          </div>

          {/* Tag Selectors */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
              3. Select Bio-Constituents / Culinary Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isChecked = selectedTags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                      isChecked 
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-3xs scale-102 font-black'
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biomarkers ratings: Energy, Anxiety, Mood */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/70 space-y-4">
            <h5 className="text-[10px] text-slate-400 font-black uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>4. Post-Meal Systemic Telemetry (Wait 15-30 mins after eating)</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Score slider for Overall Mood */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-slate-500 uppercase tracking-wide">😊 Post-Meal Mood</span>
                  <span className="text-[#107b5a] font-mono">{moodRating}/5</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={moodRating}
                  onChange={(e) => setMoodRating(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase font-mono">
                  <span>Irritable</span>
                  <span>Harmonized</span>
                </div>
              </div>

              {/* Score slider for Energy Level */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500 text-xs fill-amber-500/10" />
                    <span>Metabolic Energy</span>
                  </span>
                  <span className="text-[#a16207] font-mono">{energyLevel}/5</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase font-mono">
                  <span>Sluggish</span>
                  <span>Charged</span>
                </div>
              </div>

              {/* Score slider for Anxiety / Overwhelm */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-500" />
                    <span>Anxiety Spikes</span>
                  </span>
                  <span className="text-[#991b1b] font-mono">{anxietyLevel}/5</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={anxietyLevel}
                  onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase font-mono">
                  <span>None</span>
                  <span>Jittery / Panic</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick analysis based on active selections */}
          <div className={`p-3 rounded-xl border text-[10px] leading-relaxed transition-all ${activeVibe.style}`}>
            <strong className="block font-black uppercase tracking-wider mb-0.5">{activeVibe.msg}</strong>
            <span className="font-semibold">{activeVibe.desc}</span>
          </div>

          {/* Meal notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
              Optional Somatic notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-14 p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none transition"
              placeholder="e.g., Felt mild heart racing 20 mins after, or high cognitive sharpness..."
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-150-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Meal and Correlate</span>
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: RECENT MEAL LOGS LIST */}
      <div className="md:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col space-y-4">
        <div className="border-b border-rose-100 pb-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-widest">
            BIO-LOGGING HISTORY
          </h4>
          <h5 className="text-base font-black text-slate-800">
            Recent Nutrition Records
          </h5>
          <p className="text-[10.5px] text-slate-500 font-semibold leading-snug">
            Showing meal tags coupled with post-meal parameters.
          </p>
        </div>

        {/* List scrollbox */}
        <div className="flex-1 overflow-y-auto max-h-[460px] space-y-3.5 pr-1" id="nutrition-meal-scrollbox">
          {mealLogs.length === 0 ? (
            <div className="bg-gradient-to-b from-rose-50/20 via-white to-white rounded-3xl p-7 border border-rose-100 shadow-[0_12px_24px_rgba(244,63,94,0.01)] text-center flex flex-col items-center relative overflow-hidden mt-2">
              {/* Decorative background filters */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-rose-50 rounded-full blur-xl pointer-events-none" />
              
              {/* Illustration Container */}
              <div className="relative mb-4 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center animate-pulse" style={{ animationDuration: '5s' }} />
                <div className="absolute w-12 h-12 rounded-full bg-rose-100/50 flex items-center justify-center">
                  <Apple className="w-5 h-5 text-rose-500 animate-bounce" style={{ animationDuration: '3.5s' }} />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Coffee className="w-3.5 h-3.5 text-rose-400" />
                </div>
              </div>

              <h4 className="font-display text-sm font-extrabold text-neutral-800 tracking-tight">Your Metabolic Ledger is Ready</h4>
              <p className="text-[11px] text-zinc-500 font-semibold max-w-[280px] mt-1 leading-relaxed">
                Log your meals to inspect how specific blood-glucose peaks and gut microbiome inputs correlate with emotional clarity or sensory fatigue.
              </p>

              {/* Action Guidelines */}
              <div className="w-full mt-5 bg-slate-50/75 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5">
                <h5 className="text-[9px] font-black uppercase tracking-wider text-slate-400">Metabolic Tracker Setup:</h5>
                <div className="space-y-2 text-[10.5px]">
                  <div className="flex gap-2">
                    <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">1</div>
                    <p className="text-slate-600 font-semibold leading-normal">
                      Select your <strong className="text-neutral-800">Meal Session Type</strong> (e.g. breakfast) and fill in the meal's visual description.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">2</div>
                    <p className="text-slate-600 font-semibold leading-normal">
                      Tag physical nutritional parameters such as caffeine spikes or glycemic levels.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">3</div>
                    <p className="text-slate-600 font-semibold leading-normal">
                      Track the post-meal reaction 30 minutes later to build clean behavioral correlations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            mealLogs.map((log) => {
              const mealEmoji = log.mealType === 'breakfast' ? '🍳' 
                : log.mealType === 'lunch' ? '🥗' 
                : log.mealType === 'dinner' ? '🍲' : '🍿';
              
              return (
                <div 
                  key={log.id}
                  className="bg-slate-50/75 hover:bg-white p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-300 transition relative group"
                >
                  {/* Delete button (displays on group hover) */}
                  <button
                    onClick={() => onRemoveMealLog(log.id)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition duration-150 cursor-pointer"
                    title="Remove index journal item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{mealEmoji}</span>
                      <div className="min-w-0">
                        <span className="text-[10.5px] font-black text-slate-900 uppercase tracking-tight block">
                          {log.mealType}
                        </span>
                        <div className="flex items-center gap-1.5 text-[8.5px] text-slate-400 font-bold font-mono">
                          <span className="flex items-center gap-0.5 shrink-0">
                            <Calendar className="w-2.5 h-2.5" />
                            {log.date}
                          </span>
                          <span className="shrink-0">•</span>
                          <span className="flex items-center gap-0.5 shrink-0">
                            <Clock className="w-2.5 h-2.5" />
                            {log.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* What Eaten */}
                    <p className="text-[11px] font-bold text-slate-800 leading-normal pl-0.5">
                      {log.foodItems}
                    </p>

                    {/* Tags List */}
                    {log.tags && log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {log.tags.map(t => {
                          const preset = PRESET_TAGS.find(pt => pt.value === t);
                          return (
                            <span 
                              key={t}
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded border shrink-0 ${
                                preset ? preset.color : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-xl border border-slate-100/70 text-center">
                      <div>
                        <div className="text-[7.5px] text-slate-400 uppercase font-black font-mono">Mood</div>
                        <div className="text-[11px] font-mono font-black text-emerald-800">{log.moodRating}/5</div>
                      </div>
                      <div className="border-x border-slate-100">
                        <div className="text-[7.5px] text-slate-400 uppercase font-black font-mono">Energy</div>
                        <div className="text-[11px] font-mono font-black text-amber-700">{log.energyLevel}/5</div>
                      </div>
                      <div>
                        <div className="text-[7.5px] text-slate-400 uppercase font-black font-mono">Anxiety</div>
                        <div className="text-[11px] font-mono font-black text-rose-800">{log.anxietyLevel}/5</div>
                      </div>
                    </div>

                    {log.notes && (
                      <p className="text-[9px] text-slate-500 bg-white/40 border border-slate-100/45 px-2 py-1.5 rounded-lg italic font-medium leading-normal">
                        “{log.notes}”
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
