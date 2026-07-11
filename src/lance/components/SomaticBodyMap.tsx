import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, Activity, Shield, Zap, Heart, Wind, HelpCircle, AlertCircle, Info, RefreshCcw
} from 'lucide-react';

interface BodyZone {
  id: string;
  name: string;
  emotionTrigger: string;
  biologyExplanation: string;
  physicalSymptom: string;
  soothingExerciseName: string;
  soothingExerciseIcon: string;
  soothingExerciseMarkdown: string[];
}

const BODY_ZONES_DATABASE: BodyZone[] = [
  {
    id: 'zone-head',
    name: 'Head & Jaw',
    emotionTrigger: 'Overthinking, Worry, Social Anxiety',
    biologyExplanation: 'When feeling threatened, the temporalis and masseter muscles in the jaw automatically clench to prepare for conflict, while cerebral arterial tension causes forehead pressure.',
    physicalSymptom: 'Clenched teeth, dull brow headache, hyper-vigilance',
    soothingExerciseName: 'Jaw Slacking & Brow Sweep',
    soothingExerciseIcon: '💆',
    soothingExerciseMarkdown: [
      "1. Drop your mouth open slightly, letting the tongue fall naturally away from the roof of the mouth.",
      "2. Massage the joints just below your ears with two fingers in gentle circular motions for 15 seconds.",
      "3. Place your fingers on your forehead, draw them slowly across your hair line, and blow air out like a candle."
    ]
  },
  {
    id: 'zone-throat',
    name: 'Throat & Vocal Tract',
    emotionTrigger: 'Held Emotions, Grief, Unspoken Stress',
    biologyExplanation: 'The glottis clenches to restrict sudden crying or choking reflexes, causing a severe physical sensation of a tight lump (globus sensation) or difficulty swallowing.',
    physicalSymptom: 'Tight vocal chords, swallow resistance, soft raspy breathing',
    soothingExerciseName: 'The Open Glottis Humming',
    soothingExerciseIcon: '🗣️',
    soothingExerciseMarkdown: [
      "1. Take a normal, shallow breath through your mouth while making a silent yawn shape with your throat.",
      "2. On the slow exhale, hum softly with a low, deep note: 'Mmmmmmm'. Feeling the vibration in your clavicles.",
      "3. Swallow twice smoothly to relax the esophagus sphincter muscle."
    ]
  },
  {
    id: 'zone-chest',
    name: 'Chest & Lungs',
    emotionTrigger: 'Fight-or-Flight, Acute Anxiety, Panic',
    biologyExplanation: 'Adrenaline triggers intercostal thoracic muscles to freeze up, holding air inside. Breathing shifts to rapid, shallow clavicular inhales to support sprinting biology.',
    physicalSymptom: 'Tightness, fluttering heart rate, feeling of oxygen hunger',
    soothingExerciseName: 'The Double Physiological Sigh',
    soothingExerciseIcon: '🌬️',
    soothingExerciseMarkdown: [
      "1. Inhale deeply through your nose, expanding your rib cage near 90% full.",
      "2. Immediately take a second sharp 'sniff' inhale to fully pop open the tiny air-sacs (alveoli) in your lungs.",
      "3. Blow all air out through your slowly puckered lips in a long, sighing exhale: 'Ssssshhhh'."
    ]
  },
  {
    id: 'zone-gut',
    name: 'Stomach & Solar Plexus',
    emotionTrigger: 'Chronic Alarm, Dread, Nervous Anticipation',
    biologyExplanation: 'The enteric nervous system contains millions of neurons. Under alarm stress, blood supply is instantly diverted away from digestion to vital limbs, creating butterflies or painful contractions.',
    physicalSymptom: 'Butterflies, nausea knots, hyper-ventilation flutter',
    soothingExerciseName: 'The Safe Diaphragmatic Warmth',
    soothingExerciseIcon: '🧘',
    soothingExerciseMarkdown: [
      "1. Place both warm hands directly on your stomach button, stacked on top of each other.",
      "2. Imagine inhaling warm, green light directly into your palms, causing your hands to rise outwards.",
      "3. Exhale fully, letting your stomach sink completely back down, repeating for 5 cycles."
    ]
  },
  {
    id: 'zone-shoulders',
    name: 'Shoulders & Neck',
    emotionTrigger: 'Bearing Responsibility, Chronic Burden, Anger',
    biologyExplanation: 'The trapezius muscles automatically raise to armor the carotid arteries in the neck from simulated wild predator strikes, causing permanent shoulder high shrug tension.',
    physicalSymptom: 'Shoulders creep up to ears, neck stiffness, shoulder burn',
    soothingExerciseName: 'The Trapezius Drop Shrug',
    soothingExerciseIcon: '🦅',
    soothingExerciseMarkdown: [
      "1. Inhale deeply, while pulling your shoulders up as high as humanly possible, trying to squeeze your ears.",
      "2. Hold this extreme tension for exactly 4 seconds, noting the rigid muscle tightness.",
      "3. Exhale and drop them instantly like a bag of heavy rocks, letting all gravity loose."
    ]
  }
];

interface SomaticBodyMapProps {
  onTriggerInteractionAlert: (title: string, body: string) => void;
}

export default function SomaticBodyMap({ onTriggerInteractionAlert }: SomaticBodyMapProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-chest');
  const [exerciseStepIdx, setExerciseStepIdx] = useState(0);
  const [exerciseRunning, setExerciseRunning] = useState(false);

  // States for logging physical somatic state
  const [somaticLogs, setSomaticLogs] = useState<string[]>([]);
  const [isRelieved, setIsRelieved] = useState(false);

  const activeZone = BODY_ZONES_DATABASE.find(z => z.id === selectedZoneId) || BODY_ZONES_DATABASE[2];

  const handleToggleSomaticLog = (symptom: string) => {
    setSomaticLogs(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const startSomaticExercise = () => {
    setExerciseRunning(true);
    setExerciseStepIdx(0);
    setIsRelieved(false);
  };

  const nextStep = () => {
    if (exerciseStepIdx < activeZone.soothingExerciseMarkdown.length - 1) {
      setExerciseStepIdx(prev => prev + 1);
    } else {
      setExerciseRunning(false);
      setIsRelieved(true);
      onTriggerInteractionAlert(
        "✨ Somatic Focus Shifted", 
        `You have successfully mapped your physical signal and somatic block. Grounding your ${activeZone.name} decreases heart-rate variability and triggers parasympathetic vagus nerve activation.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Somatic education header */}
      <div className="duo-banner duo-banner-green space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="duo-badge duo-badge-green">Somatic Integration</span>
        </div>
        <h3 className="font-sans text-base font-bold text-slate-800">The Somatic Body-Mind Connection</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
          Emotions are not purely psychological concepts. Anxiety, hyper-vigilance, and stress map onto specific neural hot spots in our physical muscles. Reconnecting with body signals directly calms the amygdala.
        </p>
      </div>

      {/* Main split dashboard: stylized body representation vs somatic explanation card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Side: Body outlines and focus points picker */}
        <div className="md:col-span-5 bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Click physical focus zone</span>
          
          {/* Stylized Body graphic coordinates */}
          <div className="relative w-full h-[290px] bg-sky-50/20 rounded-2xl flex flex-col items-center justify-around overflow-hidden p-2 border border-sky-100">
            {/* Background geometric grid layout */}
            <div className="absolute inset-0 bg-[radial-gradient(#05344f_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
            
            {/* Somatic body connector focus lines */}
            <div className="w-[120px] h-[250px] relative mt-2 border border-gray-200 rounded-full bg-slate-100/50 flex flex-col items-center py-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center relative shadow-xs">
                <span className="text-xs font-bold text-slate-600">Head</span>
              </div>
              <div className="w-1.5 h-6 bg-slate-300" />
              
              <div className="w-14 h-14 rounded-full bg-slate-300/80 flex items-center justify-center relative shadow-xs">
                <span className="text-xs font-bold text-slate-600">Chest</span>
              </div>
              <div className="w-1.5 h-8 bg-slate-300" />

              <div className="w-12 h-12 rounded-full bg-slate-300/60 flex items-center justify-center relative shadow-xs">
                <span className="text-xs font-bold text-slate-700">Gut</span>
              </div>
            </div>

            {/* Float Absolute selector Buttons over coordinates */}
            {BODY_ZONES_DATABASE.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              
              // Map absolute positions matching outline points perfectly
              let absPos = '';
              if (zone.id === 'zone-head') absPos = 'top-[22px] left-[calc(50%-44px)]';
              else if (zone.id === 'zone-throat') absPos = 'top-[68px] left-[calc(50%-55px)]';
              else if (zone.id === 'zone-chest') absPos = 'top-[112px] left-[calc(50%-52px)]';
              else if (zone.id === 'zone-gut') absPos = 'top-[186px] left-[calc(50%-48px)]';
              else if (zone.id === 'zone-shoulders') absPos = 'top-[88px] right-[4px] sm:right-[15px]';

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setExerciseRunning(false);
                    setExerciseStepIdx(0);
                    setIsRelieved(false);
                  }}
                  className={`absolute z-10 py-2 px-2.5 rounded-full text-[10px] font-black transition-all border shadow-xs leading-none flex items-center gap-1 cursor-pointer whitespace-nowrap min-h-[36px] ${absPos} ${
                    isSelected 
                      ? 'bg-emerald-600 text-white border-transparent scale-105 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-gray-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{zone.name}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-gray-400 bg-slate-50 p-2.5 rounded-xl border border-gray-100 italic">
            💡 Tap on highlighted centers of mass tension to inspect clinical soothe tactics.
          </div>
        </div>

        {/* Right Side: Active focus details explanation dynamic cards */}
        <div className="md:col-span-7 flex flex-col justify-between gap-4">
          
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs text-left space-y-4 flex-1">
            <span className="text-[10px] bg-slate-200 text-slate-800 font-extrabold uppercase px-2.5 py-0.5 rounded-full w-fit block font-mono">
              Diagnostic Log: {activeZone.name}
            </span>

            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-slate-900">
                Emotion Anchor: <span className="text-emerald-700">{activeZone.emotionTrigger}</span>
              </h4>
              <p className="text-[11px] font-bold text-slate-400">
                Physical Symptom: <em>{activeZone.physicalSymptom}</em>
              </p>
            </div>

            {/* Scientific Biology description */}
            <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-semibold">
              <span className="font-extrabold uppercase text-[10px] text-slate-500 block mb-1">Biological Physics</span>
              {activeZone.biologyExplanation}
            </div>

            {/* Soothing micro-session active window */}
            <div className="border border-emerald-100 bg-emerald-50/20 rounded-2xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeZone.soothingExerciseIcon}</span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block font-mono">Micro Somatic Soothe</span>
                    <h5 className="text-[12px] font-black text-slate-800 leading-none">{activeZone.soothingExerciseName}</h5>
                  </div>
                </div>
              </div>

              {exerciseRunning ? (
                <div className="space-y-3 p-1 animate-fade-in text-left">
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-white py-2 px-3 rounded-xl border border-gray-200 italic shadow-2xs">
                    {activeZone.soothingExerciseMarkdown[exerciseStepIdx]}
                  </p>
                  
                  <div className="flex justify-between items-center gap-2.5">
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wide">
                      Step {exerciseStepIdx + 1} of {activeZone.soothingExerciseMarkdown.length}
                    </span>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black transition shadow-sm cursor-pointer"
                    >
                      {exerciseStepIdx === activeZone.soothingExerciseMarkdown.length - 1 ? 'Finish Habit ✓' : 'Continue Step ›'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  {isRelieved ? (
                    <div className="space-y-2 py-1 text-center animate-fade-in">
                      <span className="text-emerald-700 font-extrabold text-xs block">✨ Exercise Completed Sweetly!</span>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Your vagus nerve has registered the physical safety feedback loops.</p>
                      <button
                        type="button"
                        onClick={startSomaticExercise}
                        className="text-[11px] text-emerald-800 hover:underline uppercase font-extrabold"
                      >
                        Reset and practice relaxation again
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed max-w-[65%]">
                        Take a 45-second scientific physical breathing lock to shift your nervous state.
                      </p>
                      <button
                        type="button"
                        onClick={startSomaticExercise}
                        className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black transition shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        Begin Soothe 🚀
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Somatic diagnostic check interactive toolbox */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs text-left space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Somatic Symptom Tracker</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-semibold">
            Select what symptoms are active in your body right now to catalog against mental cues.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {[
            { label: '🦷 Clenched Teeth', value: 'teeth-clench' },
            { label: '🌩️ Brow Tension', value: 'brow-tension' },
            { label: '🌬️ Shallow Breaths', value: 'shallow-breath' },
            { label: '💓 Heart Racing', value: 'heart-flutter' },
            { label: '🧣 Trapezius Burn', value: 'shoulder-trapezius' },
            { label: '🌪️ Stomach Butterflies', value: 'stomach-knot' }
          ].map((symp) => {
            const isSel = somaticLogs.includes(symp.value);
            return (
              <button
                key={symp.value}
                type="button"
                onClick={() => handleToggleSomaticLog(symp.value)}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-bold text-center border transition-all cursor-pointer ${
                  isSel
                    ? 'bg-emerald-600 text-white border-transparent font-black shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {symp.label}
              </button>
            );
          })}
        </div>

        {somaticLogs.length > 0 && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center gap-4 animate-fade-in">
            <p className="text-[11px] text-emerald-950 font-bold leading-normal">
              Logged {somaticLogs.length} severe muscular somatic patterns. Try practicing the <strong>Physiological Double Sigh</strong> to balance your systemic CO₂ count.
            </p>
            <button
              type="button"
              onClick={() => setSomaticLogs([])}
              className="text-[10px] text-emerald-800 font-black hover:underline whitespace-nowrap shrink-0"
            >
              Clear Logs
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
