import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Activity, Heart, Check, 
  Sparkles, Award, Zap, Smile, Info, RefreshCw, BarChart2 
} from 'lucide-react';

interface StretchStep {
  id: number;
  title: string;
  targetArea: string;
  duration: number; // in seconds
  description: string;
  tips: string[];
  animationType: 'neck' | 'shoulder' | 'chest' | 'twist' | 'wrist';
}

export default function PhysicalWellness() {
  const steps: StretchStep[] = [
    {
      id: 1,
      title: "Cervical Neck & Trapezius Release",
      targetArea: "Upper cervical spine, neck extensors, trapezius",
      duration: 60,
      description: "Gently lower your right ear towards your right shoulder until you feel a soft pull. For a deeper stretching effect, extend your left arm outward and point your fingertips down toward the floor.",
      tips: [
        "Keep your shoulders level and pressed down",
        "Deepen the stretch only with breathing out",
        "Slowly switch sides halfway through (at 30s)"
      ],
      animationType: 'neck'
    },
    {
      id: 2,
      title: "Thoracic Shoulder Roll & Recoil",
      targetArea: "Deltoids, rhomboids, upper back",
      duration: 60,
      description: "Inhale and draw both shoulders up toward your ears. Roll them backward in a wide circular loop, squeezing your shoulder blades together, then exhale as they glide down.",
      tips: [
        "Incorporate deep nasal breathing with each roll",
        "Emphasize the backwards compression phase to release desk-hunching",
        "Reverse direction for the final 20 seconds"
      ],
      animationType: 'shoulder'
    },
    {
      id: 3,
      title: "Expanded Pectoral Chest Opener",
      targetArea: "Pectoralis major, anterior shoulders, chest walls",
      duration: 60,
      description: "Interlace your fingers behind your lower back. Inhale deeply, drawing your elbows back and expanding your ribcage. Gently lift your breastbone toward the sky values.",
      tips: [
        "Avoid hyperextending your lower back; engage your core",
        "Keep your chin tucked slightly to protect your neck",
        "Allow each chest expansion to unlock diaphragmatic reserve"
      ],
      animationType: 'chest'
    },
    {
      id: 4,
      title: "Seated Spinal Decompression Twist",
      targetArea: "Erector spinae, obliques, lumbar rotation",
      duration: 60,
      description: "Sit tall with feet flat. Place your left hand on your right knee. Inhale to lengthen your spine, then exhale to gently twist your torso to the right, looking back over your right shoulder.",
      tips: [
        "Initiate the rotation from your core, not your neck",
        "Keep your pelvis anchored and hips stable",
        "Switch sides at the 30-second mark"
      ],
      animationType: 'twist'
    },
    {
      id: 5,
      title: "Nerve-Glide Wrist & Forearm Flexion",
      targetArea: "Wrist flexors, extensors, hand tendons",
      duration: 60,
      description: "Extend your right arm forward with palm facing out, fingers up. Use your left hand to gently pull your fingers back towards your body. Next, point your fingers down and pull.",
      tips: [
        "Maintain a straight elbow without locking the joint",
        "Hold each pull for 5 seconds, then alternate hands",
        "Highly beneficial for relieving digital screen hand strain"
      ],
      animationType: 'wrist'
    }
  ];

  // Tension log states before stretch
  const [hasStartedRoutine, setHasStartedRoutine] = useState<boolean>(false);
  const [preTensionLevel, setPreTensionLevel] = useState<number>(5);
  const [selectedTensionZones, setSelectedTensionZones] = useState<string[]>([]);
  
  // Timer & Session state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(steps[0].duration);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [routineFinished, setRoutineFinished] = useState<boolean>(false);
  
  // Post-stretch evaluation states
  const [postTensionLevel, setPostTensionLevel] = useState<number>(3);
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep = steps[currentStepIndex];

  // Handling Timer progress hook
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextStep();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  // Adjust remaining timer on step index switch
  useEffect(() => {
    setTimeLeft(steps[currentStepIndex].duration);
  }, [currentStepIndex]);

  const handleStartRoutine = () => {
    setHasStartedRoutine(true);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleResetTimer = () => {
    setIsPlaying(false);
    setTimeLeft(currentStep.duration);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setRoutineFinished(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleToggleZone = (zone: string) => {
    setSelectedTensionZones(prev => 
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  const handleCompleteAndSave = () => {
    try {
      // Create a unified activity log in therapy_activity_logs so that it connects with the dashboard dynamically!
      const currentDate = new Date().toISOString().split('T')[0];
      const savedActivities = localStorage.getItem('therapy_activity_logs');
      let logsList = [];
      if (savedActivities) {
        logsList = JSON.parse(savedActivities);
      }

      const exerciseNote = `Visual Stretches focused on: ${selectedTensionZones.join(', ') || 'General relief'}. Tension decreased from level ${preTensionLevel} to ${postTensionLevel}. ${feedbackNotes.trim()}`;
      
      const stretchLog = {
        id: "stretch-" + Date.now(),
        date: currentDate,
        type: "🧘 Guided Somatic Stretching",
        duration: 5, // 5 minutes flat
        intensity: "low",
        notes: exerciseNote
      };

      logsList.unshift(stretchLog);
      localStorage.setItem('therapy_activity_logs', JSON.stringify(logsList));

      // Trigger standard state saves
      setSavedSuccessMessage("Visual stretching logged! The physiological data has been synchronized with your Biopsychosocial Dashboard.");
      
      // Auto dismiss success and return to dashboard/home or reset states after 3.5s
      setTimeout(() => {
        setSavedSuccessMessage('');
        // reset session
        setHasStartedRoutine(false);
        setRoutineFinished(false);
        setCurrentStepIndex(0);
        setSelectedTensionZones([]);
        setFeedbackNotes('');
      }, 4000);

    } catch (e) {
      console.error("Could not write physical stretching log:", e);
    }
  };

  // Helper variables for step progress bar
  const progressPercent = ((currentStep.duration - timeLeft) / currentStep.duration) * 100;
  const overallProgressPercent = ((currentStepIndex + (currentStep.duration - timeLeft) / currentStep.duration) / steps.length) * 100;

  return (
    <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-[0_8px_30px_rgb(15,118,110,0.03)] overflow-hidden text-left" id="physical-wellness-container">
      
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-emerald-50/60 to-teal-50/30 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100/70 border border-emerald-200/50 text-emerald-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              Somatic Tension Release Lab
              <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full lowercase tracking-normal">
                5-min active
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Guided neuro-somatic stretching. Dissolve physical storage of stress, back strain, and screen fatigue.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!hasStartedRoutine && !routineFinished ? (
            // PRE-ROUTINE: Welcome & Tension Self-Assessment
            <motion.div
              key="pre-routine"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50 flex items-start gap-3.5">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Why Body-Work in Biopsychosocial Care?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Muscle tightness, shallow breathing, and postural strain actively feed anxiety signals up the vagus nerve back into the brain, perpetuating high cognitive stress. Restoring muscular pliability sends immediate bio-feedback signals of safety and structural ease.
                  </p>
                </div>
              </div>

              {/* Assessment Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* Zone Select */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-1">
                      1. Select Active Tension Zones
                    </span>
                    <p className="text-[11px] text-slate-400 font-semibold">Where are you storing physical pressure today?</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'neck', label: '💆‍♀️ Cervical Neck & Jaw' },
                      { id: 'shoulders', label: '🪵 Shoulders & Traps' },
                      { id: 'back', label: '🧍 Upper / Lower Spinal' },
                      { id: 'wrists', label: '⌨️ Wrists & Keyboard Strain' },
                      { id: 'legs', label: '🦵 Hips & Leg Seating Tendons' }
                    ].map(zone => {
                      const isSelected = selectedTensionZones.includes(zone.label);
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => handleToggleZone(zone.label)}
                          className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all ${
                            isSelected 
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {zone.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pre-stretch rating */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-1">
                      2. Scale Current Muscle Tension
                    </span>
                    <p className="text-[11px] text-slate-400 font-semibold">Rate how rigid or locked your body feels right now.</p>
                  </div>
                  
                  <div className="space-y-1.5 py-2">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-emerald-600">Loose & Fluid (1)</span>
                      <span className="bg-emerald-200/60 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        Level: {preTensionLevel}
                      </span>
                      <span className="text-rose-500">Extremely Stiff (10)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={preTensionLevel}
                      onChange={e => setPreTensionLevel(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <p className="text-[10.5px] text-slate-400 italic font-medium leading-tight">
                    This step structures your somatic comparative data, which will feed your physiological charts upon closure.
                  </p>
                </div>
              </div>

              {/* Begin CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleStartRoutine}
                  className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 hover:shadow-xs text-white font-extrabold text-[12px] uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Play className="w-4 h-4 text-emerald-100 fill-emerald-100" />
                  Begin 5-Minute Stretch Sequence
                </button>
              </div>
            </motion.div>
          ) : routineFinished ? (
            // POST-ROUTINE: Self-Review & Data Synchronization
            <motion.div
              key="post-routine"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="text-center p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-2xl border border-emerald-100 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200/50 flex items-center justify-center mb-3 shadow-3xs">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wider">Tension Decompression Successful!</h4>
                <p className="text-xs font-semibold text-slate-500 max-w-md mt-1">
                  You successfully cleared all 5 somatic stretching loops. Let us gauge your current system feedback and save.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 text-left">
                {/* Post Tension Rating */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-left">
                  <div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-0.5">
                      Assess Post-Stretch Tension
                    </span>
                    <p className="text-[11px] text-slate-400 font-semibold">How soft, warm, or loosened up is your body post-routine?</p>
                  </div>

                  <div className="space-y-1.5 py-1">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-emerald-600">Fully Malleable (1)</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
                        Post Level: {postTensionLevel}
                      </span>
                      <span className="text-slate-400">Locked Stiff (10)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={postTensionLevel}
                      onChange={e => setPostTensionLevel(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  {/* Visual Change Delta Pill */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-3xs flex items-center justify-between text-[11px] font-extrabold text-slate-600">
                    <span>Initial Hardness: {preTensionLevel}/10</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Relief Shift: +{Math.max(0, preTensionLevel - postTensionLevel)} Point(s)
                    </span>
                  </div>
                </div>

                {/* Narrative commentary */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest block mb-0.5">
                      Qualitative Sensations (Optional)
                    </span>
                    <p className="text-[11px] text-slate-400 font-semibold">Log any shifts in blood-circulation warmth, spine ease, or breathing depth.</p>
                  </div>
                  <textarea
                    rows={3}
                    value={feedbackNotes}
                    onChange={e => setFeedbackNotes(e.target.value)}
                    placeholder="E.g. Shoulder knots dissolved, felt an increase in warm oxygenated breaths."
                    className="w-full p-3 border border-slate-200 bg-slate-50/50 text-xs font-semibold rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Interactive confirmation alerts */}
              {savedSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl font-bold font-sans text-center"
                >
                  {savedSuccessMessage}
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setHasStartedRoutine(false);
                    setRoutineFinished(false);
                    setCurrentStepIndex(0);
                    setSelectedTensionZones([]);
                    setFeedbackNotes('');
                  }}
                  className="w-full sm:w-auto px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold text-[12px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Discard & Restart
                </button>
                <button
                  type="button"
                  onClick={handleCompleteAndSave}
                  className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-[12px] uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
                  Log Physical Wellness & Sync Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            // ACTIVE ROUTINE SCREEN
            <motion.div
              key="active-routine"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            >
              
              {/* Dynamic SVGs & Avatar Animations Column */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-slate-50/55 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Step {currentStep.id} of {steps.length}
                  </span>
                  <span className="text-[10px] font-bold bg-white text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                    Active stretch zone: {currentStep.targetArea}
                  </span>
                </div>

                {/* Visual SVG Animation Display */}
                <div className="h-64 flex items-center justify-center relative bg-white border border-slate-100 rounded-xl shadow-3xs overflow-hidden py-4">
                  
                  {/* Visual Ambient expansion field mapping pacing indicator */}
                  <motion.div
                    className="absolute bg-emerald-50 text-emerald-50 rounded-full border border-emerald-100/50"
                    animate={{ 
                      scale: isPlaying ? [1, 2.8, 1] : 1,
                      opacity: isPlaying ? [0.4, 0.1, 0.4] : 0.25
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 8.5, 
                      ease: "easeInOut" 
                    }}
                    style={{ width: "90px", height: "90px" }}
                  />

                  {/* Interactive Breath Timing text overlay */}
                  {isPlaying && (
                    <div className="absolute top-2.5 right-3 bg-slate-100 text-[9.5px] font-bold py-0.5 px-2 rounded-md font-mono text-slate-500 uppercase tracking-wider select-none flex items-center gap-1 ring-1 ring-black/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {timeLeft % 8 < 4 ? "Breathe In Slow" : "Exhale Somatic Lock"}
                      </motion.span>
                    </div>
                  )}

                  {/* SVG Render based on animation type */}
                  <div className="w-40 h-40">
                    {currentStep.animationType === 'neck' && (
                      <svg className="w-full h-full text-emerald-600" viewBox="0 0 50 50" fill="none">
                        {/* Static Seat Base */}
                        <line x1="12" y1="46" x2="38" y2="46" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                        <line x1="25" y1="36" x2="25" y2="46" stroke="#94a3b8" strokeWidth="2.5" />
                        
                        {/* Human figure with Neck Tilt animation */}
                        <g>
                          {/* Anchor pelvis */}
                          <circle cx="25" cy="35" r="2" fill="currentColor" />
                          {/* Back spine line */}
                          <line x1="25" y1="21" x2="25" y2="35" stroke="currentColor" strokeWidth="2.5" />
                          {/* Shoulders */}
                          <line x1="16" y1="21" x2="34" y2="21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          {/* Left hand relaxed downward */}
                          <line x1="16" y1="21" x2="11" y2="32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          {/* Right hand pointing down for neck alignment */}
                          <motion.line 
                            x1="34" y1="21" 
                            x2="38" 
                            y2="32" 
                            stroke="currentColor" 
                            strokeWidth="1.8" 
                            strokeLinecap="round"
                            animate={{ y: [0, 1.5, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                          />

                          {/* Neck & Head Group tilted index */}
                          <g>
                            {/* Head with tilt motion */}
                            <motion.g
                              animate={isPlaying ? { 
                                rotate: [-16, 16, -16],
                                x: [-2, 2, -2]
                              } : { rotate: -10 }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 8.5, 
                                ease: "easeInOut" 
                              }}
                              style={{ transformOrigin: "25px 20px" }}
                            >
                              {/* Neck element */}
                              <line x1="25" y1="21" x2="25" y2="16" stroke="currentColor" strokeWidth="2" />
                              {/* Glowing Brain head orb */}
                              <circle cx="25" cy="12" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#fff" />
                              {/* Visual muscle tension guide waves along lateral neck */}
                              <motion.path 
                                d="M 19 15 Q 22 13, 22 10" 
                                stroke="#f43f5e" 
                                strokeWidth="1" 
                                strokeDasharray="1.5 1.5"
                                fill="none"
                                animate={{ opacity: [0.3, 0.9, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                            </motion.g>
                          </g>
                        </g>
                      </svg>
                    )}

                    {currentStep.animationType === 'shoulder' && (
                      <svg className="w-full h-full text-teal-600" viewBox="0 0 50 50" fill="none">
                        {/* Static stool outline */}
                        <line x1="14" y1="45" x2="36" y2="45" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="25" y1="36" x2="25" y2="45" stroke="#94a3b8" strokeWidth="2" />

                        {/* Torso & Head */}
                        <g>
                          <circle cx="25" cy="11" r="3.5" stroke="currentColor" strokeWidth="2" />
                          {/* Spine */}
                          <line x1="25" y1="18.5" x2="25" y2="35" stroke="currentColor" strokeWidth="2" />
                          {/* Hip stability */}
                          <line x1="18" y1="35" x2="32" y2="35" stroke="currentColor" strokeWidth="1.8" />
                          
                          {/* Animated shoulders rolling */}
                          <g>
                            {/* Human arms hanging with shoulders revolving as motion trackers */}
                            <motion.g
                              animate={isPlaying ? {
                                y: [-1.8, 1.2, 0.4, -1.8],
                                x: [0.6, 0.2, -0.6, 0.6],
                                scaleY: [0.95, 1.05, 1, 0.95]
                              } : {}}
                              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                              style={{ transformOrigin: "25px 18.5px" }}
                            >
                              {/* Shoulder core linkage */}
                              <line x1="15" y1="18.5" x2="35" y2="18.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                              {/* Left arm hanging */}
                              <line x1="15" y1="18.5" x2="13" y2="29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                              {/* Right arm hanging */}
                              <line x1="35" y1="18.5" x2="37" y2="29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                              
                              {/* Indicators representing physical stress release rolling direction */}
                              <motion.circle 
                                cx="15" cy="18.5" r="5" 
                                stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" fill="none"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                              />
                              <motion.circle 
                                cx="35" cy="18.5" r="5" 
                                stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" fill="none"
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                              />
                            </motion.g>
                          </g>
                        </g>
                      </svg>
                    )}

                    {currentStep.animationType === 'chest' && (
                      <svg className="w-full h-full text-emerald-600" viewBox="0 0 50 50" fill="none">
                        {/* Background lungs diagram that expands */}
                        <motion.circle
                          cx="25" cy="19" r="6"
                          stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" fill="none"
                          animate={isPlaying ? { scale: [1, 2.3, 1], opacity: [0.2, 0.75, 0.2] } : {}}
                          transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut" }}
                        />

                        {/* Figure with hands joined in expansion */}
                        <g>
                          <circle cx="25" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="2" />
                          
                          {/* Animated Spine bending gently backward */}
                          <motion.path 
                            d="M 25 13 Q 23 23, 25 35" 
                            stroke="currentColor" strokeWidth="2.5" fill="none"
                            animate={isPlaying ? { d: ["M 25 13 Q 23 23, 25 35", "M 25 13 Q 20 23, 25 35", "M 25 13 Q 23 23, 25 35"] } : {}}
                            transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut" }}
                          />
                          
                          {/* Anchor support */}
                          <line x1="18" y1="35" x2="32" y2="35" stroke="currentColor" strokeWidth="2" />

                          {/* Interlaced arms drawn back */}
                          <motion.g
                            animate={isPlaying ? {
                              x: [-1.2, 1.2, -1.2],
                              scaleX: [1, 0.95, 1]
                            } : {}}
                            transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut" }}
                            style={{ transformOrigin: "25px 14px" }}
                          >
                            {/* Left extended shoulder block */}
                            <path d="M 25 14 Q 13 18, 18 29" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                            {/* Right extended shoulder block */}
                            <path d="M 25 14 Q 37 18, 32 29" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                            {/* Linked hands clasp bar */}
                            <line x1="18" y1="29" x2="32" y2="29" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.5 1.5" strokeLinecap="round" />
                          </motion.g>
                        </g>
                      </svg>
                    )}

                    {currentStep.animationType === 'twist' && (
                      <svg className="w-full h-full text-indigo-600" viewBox="0 0 50 50" fill="none">
                        {/* Twisting arrow guidelines */}
                        <motion.path 
                          d="M 12 30 A 16 6 0 0 1 38 30" 
                          stroke="#6366f1" strokeWidth="1" strokeDasharray="2 3" fill="none" strokeLinecap="round"
                          animate={isPlaying ? { x: [-1.5, 1.5, -1.5], opacity: [0.3, 0.8, 0.3] } : {}}
                          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                        />

                        {/* Figure twist */}
                        <g>
                          <circle cx="25" cy="11" r="3.5" stroke="currentColor" strokeWidth="2.1" />
                          
                          {/* Spinal rotators */}
                          <g>
                            <motion.g
                              animate={isPlaying ? {
                                rotateY: [-28, 28, -28],
                                rotate: [-4, 4, -4]
                              } : {}}
                              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                              style={{ transformOrigin: "25px 23px" }}
                            >
                              {/* Spine center axis */}
                              <line x1="25" y1="18" x2="25" y2="34" stroke="currentColor" strokeWidth="2.5" />
                              {/* Shoulder level rotate line */}
                              <line x1="16" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                              
                              {/* Twisting arms */}
                              {/* Left crossing arm */}
                              <path d="M 16 18 Q 23 24, 28 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                              {/* Right tracing arm back */}
                              <path d="M 34 18 Q 38 22, 36 29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                            </motion.g>
                          </g>

                          {/* Seated leg anchor points */}
                          <line x1="18" y1="34" x2="32" y2="34" stroke="currentColor" strokeWidth="2" />
                        </g>
                      </svg>
                    )}

                    {currentStep.animationType === 'wrist' && (
                      <svg className="w-full h-full text-slate-700" viewBox="0 0 50 50" fill="none">
                        {/* Wrist / Hand schematic structure */}
                        <g>
                          {/* Forward straight stabilizing arm */}
                          <line x1="6" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="2.5" />
                          <circle cx="6" cy="24" r="1.5" fill="currentColor" />
                          
                          {/* Flexing hand joint animation */}
                          <g>
                            <motion.g
                              animate={isPlaying ? {
                                rotate: [-38, 48, -38],
                              } : { rotate: -15 }}
                              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                              style={{ transformOrigin: "28px 24px" }}
                            >
                              {/* Joint Node anchor */}
                              <circle cx="28" cy="24" r="3.2" stroke="currentColor" strokeWidth="1.5" fill="#fff" />
                              {/* Hand palm base */}
                              <line x1="28" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                              
                              {/* Multiple extended finger strands representing release */}
                              <line x1="38" y1="24" x2="45" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="38" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="38" y1="24" x2="45" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

                              {/* Energy release lines around fingers */}
                              <motion.path 
                                d="M 44 14 Q 48 24, 44 34" 
                                stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="2 2" fill="none"
                                animate={{ opacity: [0.2, 0.8, 0.2] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                            </motion.g>
                          </g>
                        </g>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Subtitle instructions on inhalation state */}
                <div className="text-center font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                  {isPlaying ? (
                    <span className="text-emerald-700 animate-pulse">Wave Sync: Slow Core expansion active</span>
                  ) : (
                    <span>Somatic Player Paused</span>
                  )}
                </div>
              </div>

              {/* Informative instructions & step mechanics details Column */}
              <div className="lg:col-span-12 lg:xl:col-span-7 flex flex-col justify-between space-y-5">
                
                {/* Text Content */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                      Target Area: {currentStep.targetArea}
                    </span>
                    <h3 className="text-lg font-black font-sans text-slate-900 tracking-tight mt-0.5">
                      {currentStep.title}
                    </h3>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs">
                    {currentStep.description}
                  </p>

                  {/* Tips checklist */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                      Bio-alignment Coaching Tips
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {currentStep.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold bg-indigo-50/30 p-2.5 rounded-lg border border-indigo-100/30">
                          <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Duration slider progress & CTAs player */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  
                  {/* Timer text displays */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-mono font-black text-indigo-950 tracking-tighter">
                        0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#64748b] bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-3xs">
                        remaining
                      </span>
                    </div>

                    {/* Step counters bubble lists */}
                    <div className="flex gap-1">
                      {steps.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIndex(idx);
                          }}
                          className={`w-6 h-6 rounded-lg text-[10px] font-extrabold focus:outline-hidden transition-all text-center flex items-center justify-center cursor-pointer ${
                            currentStepIndex === idx
                              ? 'bg-emerald-600 text-white shadow-3xs'
                              : idx < currentStepIndex
                              ? 'bg-emerald-100/70 border border-emerald-200/50 text-emerald-700'
                              : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {s.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Progress bar indicators */}
                  <div className="space-y-1">
                    {/* Active step progress */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner flex">
                      <motion.div 
                        className="bg-emerald-500 rounded-full h-full"
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.35 }}
                      />
                    </div>
                    {/* Overall sequence visual progress tracking */}
                    <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-400">
                      <span>Overall Timeline Progress</span>
                      <span>{Math.round(overallProgressPercent)}% completed</span>
                    </div>
                  </div>

                  {/* Core Player Trigger CTAs */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {/* Skip back */}
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
                      title="Previous Step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Play / Pause Toggle */}
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className={`flex-1 py-3 px-5 rounded-xl text-xs uppercase font-extrabold tracking-widest text-white transition-all scale-100 cursor-pointer flex items-center justify-center gap-2 active:scale-97 ${
                        isPlaying 
                          ? 'bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/10' 
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-white text-white" /> Pause Guided Stretch
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white text-white" /> Resume Visual Stretch
                        </>
                      )}
                    </button>

                    {/* Reset step */}
                    <button
                      type="button"
                      onClick={handleResetTimer}
                      className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      title="Reset step timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Skip Forward */}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      title="Skip Step"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
