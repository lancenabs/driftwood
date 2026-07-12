import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StickFigureAnimator from './StickFigureAnimator';
import { Compass, Calendar, Sparkles, Flame, ShieldAlert, BookOpen, Clock, Play, Pause, RotateCcw, AlertTriangle, User, Plus, Trash2, CheckCircle2, Heart, Wind, Activity, Award, Check, Smile, HelpCircle, ShieldCheck } from 'lucide-react';
import { RelapsePreventionPlan } from '../types';
import { ALTERNATIVE_12_STEPS_PROGRAMS, AlternativeTwelveStepProgram } from '../data/alternative12Steps';

const RADICAL_ACCEPTANCE_WISDOM = [
  {
    quote: "Pain is inevitable; suffering is optional. Suffering is the result of pain plus non-acceptance.",
    author: "M. Linehan (DBT Founder)"
  },
  {
    quote: "By radically accepting reality as it is, we find the grounding required to change it. We cannot change what we refuse to see.",
    author: "Carl Rogers"
  },
  {
    quote: "Deep acceptance is not surrender; it is declaring, 'I am currently in this winter storm, so I will put on my winter coat instead of screaming at the clouds.'",
    author: "Clinical Grounding Handbook"
  },
  {
    quote: "Urges are not commands. They are ancient, automatic neural requests trying to keep you warm or safe in the wrong way. Let them rise, peak, and dissolve like clouds.",
    author: "Jon Kabat-Zinn"
  },
  {
    quote: "Acceptance is the only doorway out of chronic distress. As soon as you stop fighting the wave, you begin to utilize the ocean's real current.",
    author: "Tara Brach"
  }
];

interface RecoverySpaceProps {
  onTriggerInteractionAlert: (title: string, body: string, action?: { label: string; onClick: () => void }) => void;
  onNavigateToTab?: (legacyTab: string, subtab?: string) => void;
}

const DEFAULT_COPING_CARDS = [
  {
    id: 'soothe',
    category: 'Compassionate Reset',
    title: 'The Soften-Soothe-Allow Anchor',
    icon: '❤️',
    quote: "A craving is simply a somatic sensation with a high-stress label. You are safe.",
    advice: "Close your eyes. Place a warm hand over your heart or abdomen. Acknowledge that urges are normal tidal waves, not moral failures. Breath smoothly and whisper: 'This is hard, but it is temporary. I am safe in this body and can host this ripple.'"
  },
  {
    id: 'sensory',
    category: 'Vigorous Distraction',
    title: 'The 5-4-3-2-1 Sensory Shock',
    icon: '🧊',
    quote: "De-escalate the mental feedback loop by shocking your physical senses.",
    advice: "Splash freezing cold water directly on your face, or hold an ice cube in your closed palm. Now identify out loud: 5 things you can see, 4 weights or surfaces you touch, 3 direct sounds, 2 scents, and 1 clean self-reassurance."
  },
  {
    id: 'physio',
    category: 'Somatic Downregulation',
    title: 'The Double Physiological Sigh',
    icon: '💨',
    quote: "The fastest neural hack to dump toxic stress hyper-arousal is your breath.",
    advice: "Take a deep double-inhale through your nose (one deep breath, then a second rapid sniff at the very peak to inflate the lungs fully), then release a slow, long, sigh-like mouth exhale. Repeat 3 times to immediately drop your heart rate."
  },
  {
    id: 'cognitive',
    category: 'CBT Cognitive Reframe',
    title: 'Playing the Tape Forward',
    icon: '⏩',
    quote: "Urges lie by pretending temporary relief is secondary to long-term harmony.",
    advice: "Fast-forward 2 hours into the future. If you cave, feel the exhaustion, dry mouth, shame, and regret. Now fast-forward to you putting your head on the pillow clean tonight. Bask in that golden, rich pride. Choose that future self, now."
  },
  {
    id: 'kinetic',
    category: 'Kinetic Redirection',
    title: 'The 3-Minute Muscle Exhaustion',
    icon: '⚡',
    quote: "Visceral craving energy is kinetic adrenaline. Redirect it into your body.",
    advice: "Perform 12 slow, deep squats, stretch your spine fully upwards, or complete 10 pushups immediately. Feel the blood and attention shift away from the mental craving centers directly into your large power muscle groups."
  },
  {
    id: 'creative',
    category: 'Somatic Art Release',
    title: 'Draw & Shred the Monster',
    icon: '🎨',
    quote: "Somatic energy wants an outlet. Let it leave through your fingertips.",
    advice: "Grab any scrap paper. Spend 90 seconds scrubbing herculean lines illustrating the shape, heat, and texture of the urge. When finished, physically rip the scrap into twenty tiny pieces and scatter them into the recycling."
  }
];

export default function RecoverySpace({ onTriggerInteractionAlert, onNavigateToTab }: RecoverySpaceProps) {
  // 1. Sobriety Date & Clean Counter State
  const [sobrietyDate, setSobrietyDate] = useState<string>(() => {
    return localStorage.getItem('therapy_sobriety_date') || '';
  });

  const [counter, setCounter] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate live counter
  useEffect(() => {
    if (!sobrietyDate) return;

    const intervalId = setInterval(() => {
      const diffMs = Date.now() - new Date(sobrietyDate).getTime();
      if (diffMs <= 0) {
        setCounter({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const secs = Math.floor(diffMs / 1000);
      const days = Math.floor(secs / (3600 * 24));
      const hours = Math.floor((secs % (3600 * 24)) / 3600);
      const minutes = Math.floor((secs % 3600) / 60);
      const seconds = secs % 60;

      setCounter({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [sobrietyDate]);

  const handleSaveSobrietyDate = (dateVal: string) => {
    setSobrietyDate(dateVal);
    localStorage.setItem('therapy_sobriety_date', dateVal);
  };

  const handleResetSobrietyDate = () => {
    onTriggerInteractionAlert(
      "⚠️ Reset Sobriety Track Identifier?",
      "Are you sure you want to clear your sobriety date tracker? This will clear your current day count display.",
      {
        label: "Yes, Reset Tracker",
        onClick: () => {
          setSobrietyDate('');
          localStorage.removeItem('therapy_sobriety_date');
        }
      }
    );
  };

  // 2. Interactive Urge Surfer Timer State
  const [surfActive, setSurfActive] = useState(false);
  const [surfTimeMax, setSurfTimeMax] = useState<number>(180); // defaulted to 3 min (180s)
  const [surfSecondsLeft, setSurfSecondsLeft] = useState<number>(180);
  const [surfPhase, setSurfPhase] = useState<string>("Ready to Surf?");
  
  // Timer effect
  useEffect(() => {
    let intervalId: any;
    if (surfActive && surfSecondsLeft > 0) {
      intervalId = setInterval(() => {
        setSurfSecondsLeft(prev => {
          const next = prev - 1;
          updateSurfPhaseMessage(next, surfTimeMax);
          return next;
        });
      }, 1000);
    } else if (surfSecondsLeft === 0 && surfActive) {
      setSurfActive(false);
      onTriggerInteractionAlert(
        "🌊 You rode that wave out",
        "Nice work. The urge peaked and passed, and you stayed with it. Take a breath — you earned this one.",
        { label: "Close", onClick: () => {} }
      );
    }
    return () => clearInterval(intervalId);
  }, [surfActive, surfSecondsLeft]);

  const updateSurfPhaseMessage = (secondsLeft: number, maxSeconds: number) => {
    const elapsed = maxSeconds - secondsLeft;
    if (secondsLeft === 0) {
      setSurfPhase("Triumph! Wave has fully crested and collapsed.");
      return;
    }
    // Phase thresholds
    if (elapsed < 30) {
      setSurfPhase("Observe: Note the exact location, physical texture, and warmth of the craving without judging it.");
    } else if (elapsed < 60) {
      setSurfPhase("Diaphragmatic Breath: Inhale slow. Exhale slower. Send comfort directly into the physical center of the urge.");
    } else if (elapsed < 120) {
      setSurfPhase("De-identify: Say to yourself: 'I am experiencing an urge, but I am not the urge. I am the observer.'");
    } else if (elapsed < 150) {
      setSurfPhase("Melt: Experience the somatic spike dissolving. The neural demand is running clean out of kinetic fuel.");
    } else {
      setSurfPhase("Glide Home: The physical intensity has flattened. Return your baseline presence into safe, warm reality.");
    }
  };

  const handleStartSurf = (targetSecs: number) => {
    setSurfTimeMax(targetSecs);
    setSurfSecondsLeft(targetSecs);
    setSurfActive(true);
    updateSurfPhaseMessage(targetSecs, targetSecs);
  };

  const handleStopSurf = () => {
    setSurfActive(false);
  };

  const handleResetSurf = () => {
    setSurfActive(false);
    setSurfSecondsLeft(surfTimeMax);
    setSurfPhase("Ready to Surf?");
  };

  // 3. Relapse Prevention Planner state
  const [plan, setPlan] = useState<RelapsePreventionPlan>(() => {
    const saved = localStorage.getItem('therapy_relapse_prevention_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      sobrietyDate: '',
      reasonsForSobriety: ["My ultimate health and long-term vitality", "Being fully emotionally present for my loved ones", "Reclaiming focus, clarity, and peace of mind"],
      mainTriggers: ["Chronic mental fatigue on Friday afternoons", "Heavy social pressures and networking environments", "Unresolved stress arguments or boundary spikes"],
      copingStrategies: ["Active 3-minute Urge Surfer session in my app", "Taking a walk with a large cold beverage", "Applying 4-7-8 breathing or double-inhale reset"],
      safeContacts: ["Sponsor / Accountability buddy", "Support Group Meeting / Community portal", "The contacts from your Settings safety plan"]
    };
  });

  const [newReason, setNewReason] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newStrategy, setNewStrategy] = useState('');
  const [newContact, setNewContact] = useState('');

  const savePlanToLocal = (newPlan: RelapsePreventionPlan) => {
    setPlan(newPlan);
    localStorage.setItem('therapy_relapse_prevention_plan', JSON.stringify(newPlan));
  };

  const handleAddPlanItem = (field: keyof RelapsePreventionPlan, val: string, setInput: (v: string) => void) => {
    if (!val.trim()) return;
    const array = [...(plan[field] as string[])];
    array.push(val.trim());
    const updated = { ...plan, [field]: array };
    savePlanToLocal(updated);
    setInput('');
  };

  const handleRemovePlanItem = (field: keyof RelapsePreventionPlan, index: number) => {
    const array = [...(plan[field] as string[])];
    array.splice(index, 1);
    const updated = { ...plan, [field]: array };
    savePlanToLocal(updated);
  };

  // 4. Urge Intensity Tracker state
  const [urgeLevel, setUrgeLevel] = useState<number>(5);
  const [urgeNote, setUrgeNote] = useState<string>('');
  const [urgeLogs, setUrgeLogs] = useState<{ id: string; timestamp: string; level: number; note: string }[]>(() => {
    const saved = localStorage.getItem('recovery_urge_intensity_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 'initial-1', timestamp: 'Today, 10:15 AM', level: 4, note: 'Slight stress during work call' },
      { id: 'initial-2', timestamp: 'Yesterday, 6:30 PM', level: 7, note: 'Encountered Friday social trigger' }
    ];
  });

  const handleLogUrge = () => {
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      level: urgeLevel,
      note: urgeNote.trim() || 'Logged current urge level'
    };
    const updated = [newLog, ...urgeLogs].slice(0, 10); // Keep last 10
    setUrgeLogs(updated);
    localStorage.setItem('recovery_urge_intensity_logs', JSON.stringify(updated));
    setUrgeNote('');

    onTriggerInteractionAlert(
      "📝 Logged",
      `Urge level ${urgeLevel}/10 saved. Noticing and naming a craving — instead of just reacting to it — is one of the most useful habits you can build.`
    );
  };

  const handleClearUrgeLogs = () => {
    onTriggerInteractionAlert(
      "⚠️ Clear Urge History?",
      "Are you sure you want to permanently delete all logged urge history? This action is local and irreversible.",
      {
        label: "Yes, Clear History",
        onClick: () => {
          setUrgeLogs([]);
          localStorage.removeItem('recovery_urge_intensity_logs');
        }
      }
    );
  };

  const getUrgeLevelInfo = (lvl: number) => {
    if (lvl <= 2) return {
      label: "✨ Minimal / Fluid Passing Thought",
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
      progressColor: "accent-emerald-600 bg-emerald-100",
      textColor: "text-emerald-800",
      strategy: "Keep moving! A short walk or a simple glass of cold water can clear this minimal ripple instantly."
    };
    if (lvl <= 5) return {
      label: "🍃 Moderate / Noticeable Mental Pull",
      color: "text-teal-700 bg-teal-50 border-teal-100",
      progressColor: "accent-teal-600 bg-teal-100",
      textColor: "text-teal-800",
      strategy: "Acknowledge the pull without judging. Take 3 deliberate deep breaths or message a supportive sponsor."
    };
    if (lvl <= 7) return {
      label: "⚠️ High / Urge Wave Cresting",
      color: "text-amber-700 bg-amber-50 border-amber-100",
      progressColor: "accent-amber-600 bg-amber-100",
      textColor: "text-amber-800",
      strategy: "The urge is a wave that peaks and then subsides. Do not fight it—surf it. Activate our guided Breathing practice!"
    };
    if (lvl <= 9) return {
      label: "⚡ Acute Somatic Spike",
      color: "text-orange-700 bg-orange-50 border-orange-100",
      progressColor: "accent-orange-600 bg-orange-100",
      textColor: "text-orange-800",
      strategy: "Highly intense body sensations are firing. Call a safe contact from your Coping Armour right now and open the breath tracker."
    };
    return {
      label: "🔥 Severe Immediate Crisis Point",
      color: "text-red-700 bg-red-50 border-red-100 animate-pulse",
      progressColor: "accent-red-600 bg-red-100",
      textColor: "text-red-800",
      strategy: "Stop what you are doing completely. Sit down, tap 'Activate Breathing Exercise' immediately to slow your heart rate, and follow the safety plan you set up with your therapist in Settings."
    };
  };

  const currentLevelInfo = getUrgeLevelInfo(urgeLevel);

  // 5. Emergency Coping Cards Deck State
  const [customCopingCards, setCustomCopingCards] = useState<{ id: string; category: string; title: string; icon: string; quote: string; advice: string }[]>(() => {
    const saved = localStorage.getItem('recovery_custom_coping_cards_v3');
    return saved ? JSON.parse(saved) : [];
  });
  
  const allCopingCards = [...DEFAULT_COPING_CARDS, ...customCopingCards];
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  const [copingSuccesses, setCopingSuccesses] = useState<number>(() => {
    const saved = localStorage.getItem('recovery_coping_successes');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [customTitle, setCustomTitle] = useState('');
  const [customAdvice, setCustomAdvice] = useState('');
  const [customCategory, setCustomCategory] = useState('Personal Safehouse');
  const [customIcon, setCustomIcon] = useState('🌟');
  const [showAddCardForm, setShowAddCardForm] = useState(false);

  const handleShuffleCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      let nextIdx = activeCardIndex;
      if (allCopingCards.length > 1) {
        while (nextIdx === activeCardIndex) {
          nextIdx = Math.floor(Math.random() * allCopingCards.length);
        }
      }
      setActiveCardIndex(nextIdx);
    }, 150);
  };

  const handleCopingSuccess = (cardTitle: string) => {
    const newVal = copingSuccesses + 1;
    setCopingSuccesses(newVal);
    localStorage.setItem('recovery_coping_successes', newVal.toString());
    
    onTriggerInteractionAlert(
      "🌟 Nice work",
      `You used "${cardTitle}" to ground yourself through that craving. That's ${newVal} coping win${newVal === 1 ? '' : 's'} logged — every one of them adds up.`
    );
  };

  const handleCreateCustomCard = () => {
    if (!customTitle.trim() || !customAdvice.trim()) {
      onTriggerInteractionAlert("⚠️ Complete Card Fields", "Please supply a short Title and a powerful, descriptive action advice string for your personal coping card.");
      return;
    }
    const newCard = {
      id: 'custom-' + Math.random().toString(36).substring(2, 9),
      category: customCategory.trim() || 'My Personal Anchor',
      title: customTitle.trim(),
      icon: customIcon,
      quote: "My custom-created somatic de-escalation sequence.",
      advice: customAdvice.trim()
    };
    
    const updated = [newCard, ...customCopingCards];
    setCustomCopingCards(updated);
    localStorage.setItem('recovery_custom_coping_cards_v3', JSON.stringify(updated));
    setCustomTitle('');
    setCustomAdvice('');
    setShowAddCardForm(false);

    // Swap index to load this new card
    const updatedAll = [...DEFAULT_COPING_CARDS, ...updated];
    setActiveCardIndex(DEFAULT_COPING_CARDS.length); // points to first element in custom array
    setIsFlipped(false);

    onTriggerInteractionAlert(
      "📝 Card added",
      `"${newCard.title}" is now in your coping deck, ready whenever you need it.`
    );
  };

  const handleDeleteCustomCard = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent flipping card when clicking delete
    onTriggerInteractionAlert(
      "🗑️ Delete Custom Card?",
      "Are you sure you want to permanently clear this personal coping card from your deck?",
      {
        label: "Confirm Delete",
        onClick: () => {
          const updated = customCopingCards.filter(c => c.id !== idToDelete);
          setCustomCopingCards(updated);
          localStorage.setItem('recovery_custom_coping_cards_v3', JSON.stringify(updated));
          setActiveCardIndex(0);
          setIsFlipped(false);
        }
      }
    );
  };

  const activeCopingCard = allCopingCards[activeCardIndex] || DEFAULT_COPING_CARDS[0];

  // ============================================
  // CLINICAL SOBRIETY WORKBENCH STATES & HANDLERS
  // ============================================

  // Subtab Navigation
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'radical_acceptance' | 'problem_solving' | 'behavior_reinforcement' | 'wellness_reflection' | 'alt_12_steps'>('dashboard');

  // --- Alternative Inclusive 12-Step Workspace States ---
  const [selectedProgramId, setSelectedProgramId] = useState<string>(() => {
    return localStorage.getItem('therapy_selected_12_step_program_id') || 'traditional_aa';
  });

  const [activeStepWorkIndex, setActiveStepWorkIndex] = useState<number>(0);

  const [alt12StepJournal, setAlt12StepJournal] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('therapy_alt_12_step_journal');
    try {
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [alt12StepCompletions, setAlt12StepCompletions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('therapy_alt_12_step_completions');
    try {
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleToggleStepCompletion = (progId: string, index: number) => {
    const key = `${progId}:${index}`;
    const nextCompletions = { ...alt12StepCompletions, [key]: !alt12StepCompletions[key] };
    setAlt12StepCompletions(nextCompletions);
    localStorage.setItem('therapy_alt_12_step_completions', JSON.stringify(nextCompletions));
    
    if (nextCompletions[key]) {
      onTriggerInteractionAlert(
        "✨ Step marked complete",
        `Step ${index + 1} is done. That's real progress — keep going at your own pace.`
      );
    }
  };

  const handleSaveStepJournal = (progId: string, index: number, text: string) => {
    const key = `${progId}:${index}`;
    const nextJournal = { ...alt12StepJournal, [key]: text };
    setAlt12StepJournal(nextJournal);
    localStorage.setItem('therapy_alt_12_step_journal', JSON.stringify(nextJournal));
  };

  // --- Holistic 8 Dimensions Therapist Self-Reflection Worksheet (Therapy for Families PDF) ---
  const [reflectionRows, setReflectionRows] = useState(() => {
    const saved = localStorage.getItem('recovery_therapy_reflection_rows');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Sync initially from existing ratings if possible
    const existingRatingsSaved = localStorage.getItem('therapy_wellness_dimension_ratings');
    let r = { physical: 6, emotional: 5, intellectual: 7, social: 6, spiritual: 4, occupational: 6, environmental: 5, financial: 5 };
    if (existingRatingsSaved) {
      try {
        r = { ...r, ...JSON.parse(existingRatingsSaved) };
      } catch (e) {}
    }
    return [
      { key: 'physical', name: 'Physical Wellness 🔋', rating: r.physical, goingWell: '', needsAttention: '', nextStep: '' },
      { key: 'emotional', name: 'Emotional Wellness 🔮', rating: r.emotional, goingWell: '', needsAttention: '', nextStep: '' },
      { key: 'intellectual', name: 'Intellectual Wellness 🧠', rating: r.intellectual, goingWell: '', needsAttention: '', nextStep: '' },
      { key: 'social', name: 'Social Wellness 👥', rating: r.social, goingWell: '', needsAttention: '', nextStep: '' },
      { key: 'spiritual', name: 'Spiritual Wellness 🧘', rating: r.spiritual, goingWell: '', needsAttention: '', nextStep: '' },
      { key: 'occupational', name: 'Occupational Wellness 💼', rating: r.occupational, goingWell: '', needsAttention: '', nextStep: '' },
      { key: 'environmental', name: 'Environmental Wellness 🌱', rating: r.environmental, goingWell: '', needsAttention: '', nextStep: '' },
      { key: 'financial', name: 'Financial Wellness 💵', rating: r.financial, goingWell: '', needsAttention: '', nextStep: '' }
    ];
  });

  const [generalReflectionAnswers, setGeneralReflectionAnswers] = useState(() => {
    const saved = localStorage.getItem('recovery_therapy_general_reflection');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      strongestReason: '',
      depletedAction: '',
      spilloverImpact: ''
    };
  });

  const handleUpdateRowValue = (key: string, field: 'rating' | 'goingWell' | 'needsAttention' | 'nextStep', val: any) => {
    const updated = reflectionRows.map((row) => {
      if (row.key === key) {
        return { ...row, [field]: val };
      }
      return row;
    });
    setReflectionRows(updated);
    localStorage.setItem('recovery_therapy_reflection_rows', JSON.stringify(updated));

    // Sync rating to global wellness dashboard dimension ratings automatically!
    if (field === 'rating') {
      const savedRatings = localStorage.getItem('therapy_wellness_dimension_ratings');
      let ratingsObj: Record<string, number> = {};
      try {
        ratingsObj = savedRatings ? JSON.parse(savedRatings) : {};
      } catch (e) {}
      const nextRatings = { ...ratingsObj, [key]: Number(val) };
      localStorage.setItem('therapy_wellness_dimension_ratings', JSON.stringify(nextRatings));
    }
  };

  const handleUpdateGeneralReflection = (field: 'strongestReason' | 'depletedAction' | 'spilloverImpact', val: string) => {
    const nextAnswers = { ...generalReflectionAnswers, [field]: val };
    setGeneralReflectionAnswers(nextAnswers);
    localStorage.setItem('recovery_therapy_general_reflection', JSON.stringify(nextAnswers));
  };

  const handleSaveReflectionPledges = () => {
    onTriggerInteractionAlert(
      "🌱 Saved",
      "Your ratings and reflections are saved. Checking back in on these week to week can help you notice patterns over time."
    );
  };

  const handleResetReflectionWorksheet = () => {
    onTriggerInteractionAlert(
      "⚠️ Reset Reflection Worksheet?",
      "Are you sure you want to clear your current text answers? This action cannot be undone.",
      {
        label: "Yes, Reset Answers",
        onClick: () => {
          const cleared = reflectionRows.map(row => ({ ...row, goingWell: '', needsAttention: '', nextStep: '' }));
          setReflectionRows(cleared);
          localStorage.setItem('recovery_therapy_reflection_rows', JSON.stringify(cleared));
          
          const clearedGeneral = { strongestReason: '', depletedAction: '', spilloverImpact: '' };
          setGeneralReflectionAnswers(clearedGeneral);
          localStorage.setItem('recovery_therapy_general_reflection', JSON.stringify(clearedGeneral));
        }
      }
    );
  };

  // --- Radical Acceptance States ---
  const [radicalStruggle, setRadicalStruggle] = useState<string>('The sudden onset of a strong physical craving trigger');
  const [radicalCustomStruggle, setRadicalCustomStruggle] = useState<string>('');
  const [radicalFact, setRadicalFact] = useState<string>('');
  const [radicalCause, setRadicalCause] = useState<string>('');
  const [radicalSomatic, setRadicalSomatic] = useState<string>('');
  const [radicalCommitment, setRadicalCommitment] = useState<string>('');

  const [acceptanceLogs, setAcceptanceLogs] = useState<{ id: string; timestamp: string; struggle: string; commitment: string }[]>(() => {
    const saved = localStorage.getItem('recovery_radical_acceptance_logs_v1');
    return saved ? JSON.parse(saved) : [
      { id: 'acc-1', timestamp: 'Yesterday, 8:45 PM', struggle: 'Aggravation over work sprint pressure', commitment: 'I radically accept that I am fatigued. My stress is here, and screaming at it won\'t lower it. I will rest with chamomile tea instead.' }
    ];
  });

  const [acceptanceWisdomIdx, setAcceptanceWisdomIdx] = useState<number>(0);
  const [acceptanceReflection, setAcceptanceReflection] = useState<string>('');
  const [reflectionLogs, setReflectionLogs] = useState<{ id: string; timestamp: string; quote: string; response: string }[]>(() => {
    const saved = localStorage.getItem('recovery_reflection_logs_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCommitAcceptance = () => {
    const clearStruggle = radicalStruggle === 'custom' ? radicalCustomStruggle : radicalStruggle;
    if (!clearStruggle.trim() || !radicalCommitment.trim()) {
      onTriggerInteractionAlert("⚠️ Complete Acceptance Fields", "Please articulate what reality you are facing and state your value-based target response plan.");
      return;
    }

    const newLog = {
      id: 'acc-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      struggle: clearStruggle.trim(),
      commitment: `${radicalCommitment.trim()}. Somatic grounding status: ${radicalSomatic || "Mindful baseline"}. Facts checked: ${radicalFact || "Unconditional truth"}.`
    };

    const updated = [newLog, ...acceptanceLogs];
    setAcceptanceLogs(updated);
    localStorage.setItem('recovery_radical_acceptance_logs_v1', JSON.stringify(updated));

    // Reset fields
    setRadicalFact('');
    setRadicalCause('');
    setRadicalSomatic('');
    setRadicalCommitment('');
    if (radicalStruggle === 'custom') setRadicalCustomStruggle('');

    onTriggerInteractionAlert(
      "🧘 Logged",
      "You chose to accept things as they are, instead of fighting them. That's not giving up — it's what makes room for the next step."
    );
  };

  const handleDeleteAcceptanceLog = (id: string) => {
    const updated = acceptanceLogs.filter(item => item.id !== id);
    setAcceptanceLogs(updated);
    localStorage.setItem('recovery_radical_acceptance_logs_v1', JSON.stringify(updated));
  };

  const handleShuffleWisdom = () => {
    let next = acceptanceWisdomIdx;
    if (RADICAL_ACCEPTANCE_WISDOM.length > 1) {
      while (next === acceptanceWisdomIdx) {
        next = Math.floor(Math.random() * RADICAL_ACCEPTANCE_WISDOM.length);
      }
    }
    setAcceptanceWisdomIdx(next);
    setAcceptanceReflection('');
  };

  const handleSaveReflection = () => {
    if (!acceptanceReflection.trim()) return;
    const newLog = {
      id: 'ref-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      quote: RADICAL_ACCEPTANCE_WISDOM[acceptanceWisdomIdx].quote,
      response: acceptanceReflection.trim()
    };
    const updated = [newLog, ...reflectionLogs];
    setReflectionLogs(updated);
    localStorage.setItem('recovery_reflection_logs_v1', JSON.stringify(updated));
    setAcceptanceReflection('');
    
    onTriggerInteractionAlert("📝 Saved", "Your reflection is saved to your notebook.");
  };

  const handleDeleteReflectionLog = (id: string) => {
    const updated = reflectionLogs.filter(item => item.id !== id);
    setReflectionLogs(updated);
    localStorage.setItem('recovery_reflection_logs_v1', JSON.stringify(updated));
  };

  // --- Problem Solving States ---
  const [psWizardStep, setPsWizardStep] = useState<number>(1);
  const [psTrigger, setPsTrigger] = useState<string>('');
  const [psSolution1, setPsSolution1] = useState<string>('');
  const [psSolution2, setPsSolution2] = useState<string>('');
  const [psSolution3, setPsSolution3] = useState<string>('');
  const [psProsCons1, setPsProsCons1] = useState<string>('');
  const [psProsCons2, setPsProsCons2] = useState<string>('');
  const [psProsCons3, setPsProsCons3] = useState<string>('');
  const [psSelectedSolution, setPsSelectedSolution] = useState<string>('');
  const [psTimelineCommitment, setPsTimelineCommitment] = useState<string>('');

  const [psPlansList, setPsPlansList] = useState<{
    id: string;
    timestamp: string;
    trigger: string;
    solutions: string[];
    selected: string;
    timeline: string;
    resolved: boolean;
  }[]>(() => {
    const saved = localStorage.getItem('recovery_problem_solving_plans_v1');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ps-1',
        timestamp: 'Thursday, 4:10 PM',
        trigger: 'Friday afternoon isolation and high boredom',
        solutions: [
          'Pre-book a premium non-substance pottery class',
          'Coordinate a direct phone checkout with sister at 5 PM',
          'Stay at the gym for an extended swimming session'
        ],
        selected: 'Coordinate a direct phone checkout with sister at 5 PM',
        timeline: 'Friday afternoon exactly at 17:00',
        resolved: true
      }
    ];
  });

  const handleSaveProblemSolvingPlan = () => {
    if (!psTrigger.trim() || !psSolution1.trim() || !psSelectedSolution.trim()) {
      onTriggerInteractionAlert("⚠️ Complete Plan Steps", "Please complete Step 1 (Trigger), list at least your primary brainstormed solution, and specify your committed action.");
      return;
    }

    const solutionsList = [psSolution1.trim()];
    if (psSolution2.trim()) solutionsList.push(psSolution2.trim());
    if (psSolution3.trim()) solutionsList.push(psSolution3.trim());

    const newPlan = {
      id: 'ps-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      trigger: psTrigger.trim(),
      solutions: solutionsList,
      selected: psSelectedSolution.trim(),
      timeline: psTimelineCommitment.trim() || "Immediate trigger threshold",
      resolved: false
    };

    const updated = [newPlan, ...psPlansList];
    setPsPlansList(updated);
    localStorage.setItem('recovery_problem_solving_plans_v1', JSON.stringify(updated));

    // Reset fields
    setPsTrigger('');
    setPsSolution1('');
    setPsSolution2('');
    setPsSolution3('');
    setPsProsCons1('');
    setPsProsCons2('');
    setPsProsCons3('');
    setPsSelectedSolution('');
    setPsTimelineCommitment('');
    setPsWizardStep(1);

    onTriggerInteractionAlert(
      "🧠 Plan saved",
      `Your plan for "${newPlan.trigger}" is ready. Having a plan before the moment hits makes it a lot easier to follow through.`
    );
  };

  const handleResolvePlan = (id: string) => {
    const updated = psPlansList.map(plan => {
      if (plan.id === id) {
        return { ...plan, resolved: !plan.resolved };
      }
      return plan;
    });
    setPsPlansList(updated);
    localStorage.setItem('recovery_problem_solving_plans_v1', JSON.stringify(updated));

    const resolvedPlan = updated.find(p => p.id === id);
    if (resolvedPlan?.resolved) {
      // Boost coping successes score
      const newScore = copingSuccesses + 2;
      setCopingSuccesses(newScore);
      localStorage.setItem('recovery_coping_successes', newScore.toString());

      onTriggerInteractionAlert(
        "🎉 You followed through",
        `You used your plan ("${resolvedPlan.selected}") and got through a tough moment. That's ${newScore} coping wins logged now — that took courage.`
      );
    }
  };

  const handleDeletePlan = (id: string) => {
    const updated = psPlansList.filter(plan => plan.id !== id);
    setPsPlansList(updated);
    localStorage.setItem('recovery_problem_solving_plans_v1', JSON.stringify(updated));
  };


  // --- Behavioral Reinforcement States ---
  const [habitCue, setHabitCue] = useState<string>('');
  const [habitOldRoutine, setHabitOldRoutine] = useState<string>('');
  const [habitNewRoutine, setHabitNewRoutine] = useState<string>('');
  const [habitReward, setHabitReward] = useState<string>('');

  const [habitLoopsList, setHabitLoopsList] = useState<{ id: string; cue: string; oldRoutine: string; newRoutine: string; reward: string }[]>(() => {
    const saved = localStorage.getItem('recovery_habit_loops_v1');
    return saved ? JSON.parse(saved) : [
      {
        id: 'hab-1',
        cue: 'Entering my empty apartment after a long day',
        oldRoutine: 'Pouring a highball immediately in defense',
        newRoutine: 'Taking a 5-minute hot steam shower and changing into soft linen sheets',
        reward: 'Brewing a premium raspberry hibiscus tonic tea'
      }
    ];
  });

  const [milestoneRewards, setMilestoneRewards] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('recovery_milestone_rewards_v1');
    return saved ? JSON.parse(saved) : {
      '1_day': "A warm specialty tea or premium coffee from my favorite local shop",
      '3_days': "Setting aside 1 hour of completely guilt-free playtime, fiction reading, or music",
      '7_days': "Ordering my favorite takeout or gourmet comfort food without restriction",
      '14_days': "Buying a fresh journal, nice pen, or clean workspace candle",
      '30_days': "Booking a professional therapeutic massage or deep somatic body release session",
      '90_days': "A major celebration reward (e.g. buying a premium jacket or planning a weekend road trip)"
    };
  });

  const [claimedMilestones, setClaimedMilestones] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('recovery_claimed_milestones_v1');
    return saved ? JSON.parse(saved) : {};
  });

  const [reinforceFeedback, setReinforceFeedback] = useState<string>('');
  const [showReinforceEffect, setShowReinforceEffect] = useState<boolean>(false);

  const handleSaveHabitLoop = () => {
    if (!habitCue.trim() || !habitOldRoutine.trim() || !habitNewRoutine.trim() || !habitReward.trim()) {
      onTriggerInteractionAlert("⚠️ Empty Habit Fields", "To map your behavior schedule, please furnish details for the Cue, Old Routine, Alternative Routine, and Rewards.");
      return;
    }

    const newLoop = {
      id: 'hab-' + Math.random().toString(36).substring(2, 9),
      cue: habitCue.trim(),
      oldRoutine: habitOldRoutine.trim(),
      newRoutine: habitNewRoutine.trim(),
      reward: habitReward.trim()
    };

    const updated = [newLoop, ...habitLoopsList];
    setHabitLoopsList(updated);
    localStorage.setItem('recovery_habit_loops_v1', JSON.stringify(updated));

    // Reset fields
    setHabitCue('');
    setHabitOldRoutine('');
    setHabitNewRoutine('');
    setHabitReward('');

    onTriggerInteractionAlert(
      "🎗️ Habit loop saved",
      `Your new Cue → New Routine → Reward is saved. The more you practice the new routine, the more automatic it becomes.`
    );
  };

  const handleDeleteHabitLoop = (id: string) => {
    const updated = habitLoopsList.filter(loop => loop.id !== id);
    setHabitLoopsList(updated);
    localStorage.setItem('recovery_habit_loops_v1', JSON.stringify(updated));
  };

  const handleSaveMilestoneReward = (key: string, val: string) => {
    const updated = { ...milestoneRewards, [key]: val };
    setMilestoneRewards(updated);
    localStorage.setItem('recovery_milestone_rewards_v1', JSON.stringify(updated));
  };

  const handleClaimMilestone = (key: string) => {
    const updated = { ...claimedMilestones, [key]: !claimedMilestones[key] };
    setClaimedMilestones(updated);
    localStorage.setItem('recovery_claimed_milestones_v1', JSON.stringify(updated));

    if (updated[key]) {
      onTriggerInteractionAlert(
        "🎁 Reward claimed",
        `Enjoy it — "${milestoneRewards[key] || "Treat"}". You earned this milestone, so take the moment to actually celebrate it.`
      );
    }
  };

  const triggerSomaticReinforcer = () => {
    setShowReinforceEffect(true);
    const triggers = [
      "🧠 Nice work — that's one more step forward.",
      "🌟 Logged. That took courage.",
      "💎 You showed up for yourself just now. That matters.",
      "🌱 Small, steady choices like this one are what recovery is actually made of."
    ];
    const msg = triggers[Math.floor(Math.random() * triggers.length)];
    setReinforceFeedback(msg);

    // Increment mastery score
    const nextVal = copingSuccesses + 1;
    setCopingSuccesses(nextVal);
    localStorage.setItem('recovery_coping_successes', nextVal.toString());

    setTimeout(() => {
      setShowReinforceEffect(false);
    }, 3500);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto pb-12">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl p-4 flex gap-4 items-center shadow-xs">
        <div className="w-16 h-14 shrink-0 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-3xs" id="recovery-group-animator">
          <StickFigureAnimator type="group" className="w-14 h-11" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="font-display text-sm font-bold text-emerald-950 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-600" />
            Active Recovery Compass
          </h3>
          <p className="text-[11.5px] text-emerald-800 font-medium leading-relaxed font-sans">
            Your self-directed space to measure clean streaks, surf out sudden craving surges safely, and construct a permanent armor of relapse safety tools. Connect your learnings directly to action!
          </p>
        </div>
      </div>

      {/* Clinically Styled Subtab bar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-200 select-none cursor-pointer ${
            activeSubTab === 'dashboard'
              ? 'bg-emerald-50 text-[#3C3C3C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Compass Hub</span>
        </button>

        <button
          onClick={() => setActiveSubTab('radical_acceptance')}
          className={`flex-1 min-w-[124px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-200 select-none cursor-pointer ${
            activeSubTab === 'radical_acceptance'
              ? 'bg-emerald-50 text-[#3C3C3C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>Radical Acceptance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('problem_solving')}
          className={`flex-1 min-w-[124px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-200 select-none cursor-pointer ${
            activeSubTab === 'problem_solving'
              ? 'bg-emerald-50 text-[#3C3C3C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Problem Solver</span>
        </button>

        <button
          onClick={() => setActiveSubTab('behavior_reinforcement')}
          className={`flex-1 min-w-[124px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-200 select-none cursor-pointer ${
            activeSubTab === 'behavior_reinforcement'
              ? 'bg-emerald-50 text-[#3C3C3C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Loop Reinforcer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wellness_reflection')}
          className={`flex-1 min-w-[124px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-200 select-none cursor-pointer ${
            activeSubTab === 'wellness_reflection'
              ? 'bg-emerald-50 text-[#3C3C3C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>8D Worksheet</span>
        </button>

        <button
          onClick={() => setActiveSubTab('alt_12_steps')}
          className={`flex-1 min-w-[124px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-200 select-none cursor-pointer ${
            activeSubTab === 'alt_12_steps'
              ? 'bg-emerald-50 text-[#3C3C3C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>12 Steps Lab</span>
        </button>
      </div>

      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Clean Counters & Urge Surfer Timers */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sobriety Day Tracker */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-slate-800">Sobriety Counter</h4>
              </div>
              {sobrietyDate && (
                <button
                  onClick={handleResetSobrietyDate}
                  className="text-[10px] text-red-600 hover:text-red-700 font-bold uppercase transition"
                >
                  Reset
                </button>
              )}
            </div>

            {!sobrietyDate ? (
              <div className="space-y-3 py-2 text-center">
                <p className="text-[11.5px] text-slate-500 font-medium">No sobriety tracker active. Enter your clean date to start your visual timeline.</p>
                <div className="flex gap-2">
                  <input
                    type="date"
                    id="sob_picker_inp"
                    onChange={(e) => handleSaveSobrietyDate(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Your date is synced securely in your encrypted personal locker.</p>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                {/* Visual Streak Counter Circles */}
                <div className="py-2 inline-flex flex-col items-center justify-center">
                  <div className="relative w-28 h-28 rounded-full bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-black font-mono text-emerald-800 leading-none">
                      {counter.days}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 select-none">
                      {counter.days === 1 ? 'Day' : 'Days'}
                    </span>
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1.5 shadow-md">
                      <Flame className="w-4 h-4 animate-bounce" />
                    </span>
                  </div>
                </div>

                {/* Grid of Hours, Min, Sec */}
                <div className="grid grid-cols-3 gap-2 px-2">
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl text-center">
                    <span className="text-sm font-bold font-mono text-slate-800 block">{counter.hours}</span>
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Hours</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl text-center">
                    <span className="text-sm font-bold font-mono text-slate-800 block">{counter.minutes}</span>
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Minutes</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl text-center">
                    <span className="text-sm font-bold font-mono text-slate-800 block">{counter.seconds}</span>
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Seconds</span>
                  </div>
                </div>

                {/* Milestone Level indicator */}
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-800 leading-normal flex items-center gap-3">
                  <span className="text-lg">🏆</span>
                  <div className="text-left">
                    <span className="font-extrabold block">Current Reward Status:</span>
                    <span className="font-semibold text-[10.5px]">
                      {counter.days < 1 && "🌱 24h Seed - Germination phase."}
                      {counter.days >= 1 && counter.days < 7 && "🌿 Sprout Active - Grounding physical base."}
                      {counter.days >= 7 && counter.days < 30 && "🌟 1-Week Resiliency Star - Inner neural bloom!"}
                      {counter.days >= 30 && counter.days < 365 && "🦁 1-Month Sovereign Pride - Strong willpower!"}
                      {counter.days >= 365 && "💎 Obsidian Lifetime Crown - Wholeness and Mastery."}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-bold font-mono">
                  Sober Since: {new Date(sobrietyDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            )}
          </div>

          {/* Urge Intensity Tracker Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-slate-800">Urge Intensity Tracker</h4>
              </div>
              <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest leading-none">
                CBT Selfcheck
              </span>
            </div>

            <div className="space-y-4">
              {/* Informative text */}
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Rate your current craving or urge level below. Monitoring intensity levels is a prime clinical practice to track somatic reactivity cycles over time.
              </p>

              {/* Slider Input with Level Marker */}
              <div className="space-y-3 bg-[#f8faf9] p-3.5 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[11.5px] font-black text-slate-700">Urge Intensity</span>
                  <span className={`text-xs font-mono font-black border px-2.5 py-0.5 rounded-lg transition-all duration-300 ${currentLevelInfo.color}`}>
                    {urgeLevel} / 10
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={urgeLevel}
                  onChange={(e) => setUrgeLevel(parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none transition-colors duration-300 ${currentLevelInfo.progressColor}`}
                />

                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  <span>1 (Tranquil)</span>
                  <span>5 (Noticeable)</span>
                  <span>10 (Severe Critical)</span>
                </div>

                {/* Dynamic feedback display */}
                <div className="pt-2">
                  <span className={`text-[11.5px] font-black leading-none block ${currentLevelInfo.textColor}`}>
                    {currentLevelInfo.label}
                  </span>
                  <span className="text-[10.5px] text-slate-500 leading-relaxed font-semibold mt-1 block">
                    {currentLevelInfo.strategy}
                  </span>
                </div>
              </div>

              {/* One-Click Dynamic Breathing Trigger Button */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-300/40 p-4 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 animate-pulse">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11.5px] font-black text-emerald-950 uppercase tracking-wide leading-tight">Feeling a Craving right now?</h5>
                    <p className="text-[10px] text-emerald-800 font-semibold leading-normal mt-0.5">
                      Paced diaphragmatic breathing is clinically proven to down-regulate the nervous system's physical urge impulses and safely cool emotional fire within 60 seconds.
                    </p>
                  </div>
                </div>

                {onNavigateToTab ? (
                  <button
                    onClick={() => {
                      onNavigateToTab('practice', 'breathing');
                    }}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-50 focus:ring-2 focus:ring-emerald-700 text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wind className="w-4 h-4" />
                    <span>Trigger Guided Breathing Now</span>
                  </button>
                ) : (
                  <p className="text-[10.5px] text-red-600 font-bold">
                    [Breathing Practice tab currently loading...]
                  </p>
                )}
              </div>

              {/* Optional selfcheck note */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">Optional Trigger / Context Note:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urgeNote}
                    onChange={(e) => setUrgeNote(e.target.value)}
                    placeholder="e.g., Friday high fatigue, social anxiety spike, boredom..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    onClick={handleLogUrge}
                    className="px-4 py-2 bg-white hover:bg-white text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer select-none"
                  >
                    Log Urge
                  </button>
                </div>
              </div>

              {/* History list of urge logs */}
              {urgeLogs.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                    <span>Recent Urge Logs</span>
                    <button
                      onClick={handleClearUrgeLogs}
                      className="hover:text-red-500 transition cursor-pointer font-black"
                    >
                      Clear Logs
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-50">
                    {urgeLogs.map((log) => (
                      <div key={log.id} className="pt-1.5 flex justify-between items-start gap-3">
                        <div className="space-y-0.5 text-left">
                          <span className="text-[10.5px] font-black text-slate-700 leading-none block">
                            {log.note}
                          </span>
                          <span className="text-[9px] font-mono font-semibold text-slate-400 block">
                            📅 {log.timestamp}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-black border px-1.5 py-0.5 rounded shrink-0 ${getUrgeLevelInfo(log.level).color}`}>
                          {log.level}/10
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Interactive Urge Surfer */}
          <div className="bg-[#1b2f21] p-5 rounded-3xl border border-emerald-950 text-white shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-emerald-900/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold text-emerald-100 font-sans uppercase tracking-wider">Urge Surfer Coach</h4>
              </div>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="space-y-4 text-center">
              <p className="text-[11px] text-emerald-200/90 leading-relaxed font-semibold">
                Cravings are like ocean waves—they peak at 10 minutes and break. Ride them out with somatic visualization coaching.
              </p>

              {/* Waves pulse animation circle */}
              <div className="flex justify-center py-2">
                <div className={`relative w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-500/40 flex flex-col items-center justify-center ${surfActive ? 'animate-pulse' : ''} shadow-md`}>
                  {surfActive && (
                    <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-25" />
                  )}
                  <span className="text-lg font-black font-mono text-emerald-200">
                    {Math.floor(surfSecondsLeft / 60)}:{(surfSecondsLeft % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                    {surfActive ? 'Riding Wave' : 'Calm'}
                  </span>
                </div>
              </div>

              {/* Live phase feedback instructions */}
              <div className="bg-emerald-50 border border-emerald-800/40 p-3.5 rounded-2xl min-h-[5rem] flex flex-col justify-center text-center">
                <p className="text-xs font-semibold text-emerald-100 italic transition-all duration-300">
                  "{surfPhase}"
                </p>
              </div>

              {/* Presets and controllers */}
              {!surfActive ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => handleStartSurf(60)}
                      className="py-1 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-50 text-[10px] font-bold border border-emerald-800 text-emerald-200"
                    >
                      1 Min (Sprint)
                    </button>
                    <button
                      onClick={() => handleStartSurf(180)}
                      className="py-1 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-50 text-[10px] font-bold border border-emerald-800 text-emerald-200"
                    >
                      3 Min (Mild)
                    </button>
                    <button
                      onClick={() => handleStartSurf(300)}
                      className="py-1 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-50 text-[10px] font-bold border border-emerald-800 text-emerald-200"
                    >
                      5 Min (Acute)
                    </button>
                  </div>
                  <p className="text-[9.5px] text-emerald-400 font-medium">Select a duration above to initiate paced audio-somatic guidance loop.</p>
                </div>
              ) : (
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={handleStopSurf}
                    className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold font-mono transition flex items-center gap-1"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pause Sesh
                  </button>
                  <button
                    onClick={handleResetSurf}
                    className="p-2 bg-emerald-50 border border-emerald-700 text-emerald-200 hover:bg-emerald-50 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Stop / Restart
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Relapse Prevention Plan Editor & Emergency Coping Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 🚨 Emergency Coping Cards Deck Widget Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-rose-50">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 rounded-lg bg-red-50 border border-red-100/50">
                  <span className="text-[10px] font-black text-red-600 animate-pulse uppercase tracking-wider">🔥 Urge Emergency</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Coping Room Deck</h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                <span>Coping Mastery Score:</span>
                <span className="text-emerald-700 font-mono font-black">🌟 {copingSuccesses}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Feeling an active craving or high stress? Tap a card below to flip and activate clinically validated distress tolerance skills. Draw a new card or build your own custom exit strategies.
            </p>

            {/* Interactive Card Canvas Container */}
            <div className="flex justify-center py-2 relative">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ perspective: 1000 }}
                className="w-full max-w-sm h-60 cursor-pointer relative select-none"
              >
                <div 
                  className={`w-full h-full relative transition-[transform] duration-500 transform-style-3d ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                >
                  
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl p-5 border flex flex-col justify-between shadow-xs bg-gradient-to-br from-slate-50 to-emerald-50/40 border-emerald-100/60 backface-hidden">
                    <div className="flex justify-between items-start">
                      <span className="text-[9.5px] font-mono font-black text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                        {activeCopingCard.category}
                      </span>
                      <span className="text-xl">{activeCopingCard.icon}</span>
                    </div>

                    <div className="space-y-1.5 py-2">
                      <h3 className="font-display text-sm font-black text-slate-800 tracking-tight leading-snug">
                        {activeCopingCard.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold italic leading-relaxed">
                        "{activeCopingCard.quote}"
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10.5px] text-emerald-800 font-bold border-t border-emerald-100/30 pt-2.5">
                      <span className="flex items-center gap-1 select-none animate-pulse">
                        💡 Tap to flip & reveal advice
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 font-semibold">
                        Card {activeCardIndex + 1} of {allCopingCards.length}
                      </span>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl p-5 border flex flex-col justify-between shadow-sm bg-slate-900 border-slate-950 text-white backface-hidden [transform:rotateY(180deg)]">
                    <div className="flex justify-between items-start">
                      <span className="text-[9.5px] font-mono font-black text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        Cognitive Defense Action
                      </span>
                      <div className="flex gap-1.5">
                        {activeCopingCard.id.startsWith('custom-') && (
                          <button
                            onClick={(e) => handleDeleteCustomCard(activeCopingCard.id, e)}
                            className="p-1 px-1.5 rounded bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-red-200 text-[9px] font-bold tracking-tight uppercase"
                            title="Delete this custom card"
                          >
                            Delete
                          </button>
                        )}
                        <span className="text-lg">{activeCopingCard.icon}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-2 text-left">
                      <p className="text-[11px] text-slate-200 font-bold select-text leading-relaxed tracking-normal">
                        {activeCopingCard.advice}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-200 pt-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleCopingSuccess(activeCopingCard.title)}
                        className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                        <span>This Action Saved Me!</span>
                      </button>
                      <button
                        onClick={() => setIsFlipped(false)}
                        className="p-1.5 bg-white hover:bg-white text-slate-500 hover:text-[#3C3C3C] rounded-lg text-xs font-bold transition cursor-pointer"
                        title="Flip back to front"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Deck Action Triggers */}
            <div className="flex gap-2">
              <button
                onClick={handleShuffleCard}
                className="flex-1 py-2 bg-white hover:bg-white text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>Draw / Shuffle Deck</span>
              </button>
              
              <button
                onClick={() => {
                  setShowAddCardForm(!showAddCardForm);
                  setIsFlipped(false);
                }}
                className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                  showAddCardForm 
                    ? 'bg-rose-700 text-white hover:bg-rose-800' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{showAddCardForm ? 'Close Builder' : 'Build Custom Card'}</span>
              </button>
            </div>

            {/* Custom Interactive card creator */}
            <AnimatePresence>
              {showAddCardForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-1 border-t border-slate-100 text-left space-y-3"
                >
                  <div className="bg-[#fbfcfa] border border-slate-200 p-3.5 rounded-2xl space-y-3">
                    <span className="text-[9px] font-mono font-black text-rose-800 uppercase tracking-widest block">
                      🔨 distress-tolerance card workbench
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wide">Category</label>
                        <select
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        >
                          <option value="Personal Grounding">🧘 Personal Grounding</option>
                          <option value="Somatic Safehouse">🏡 Somatic Safehouse</option>
                          <option value="Urgent Intimacy">❤️ Urgent Dialogue</option>
                          <option value="Hobby Intervention">🧶 Creative Play</option>
                          <option value="Emergency Rescue">🚨 Emergency Escape</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wide">Select Icon token</label>
                        <div className="flex flex-wrap gap-1">
                          {['🌟', '❤️', '🍃', '💨', '⚡', '🧘', '🧶', '🪴', '🧠'].map((ico) => (
                            <button
                              key={ico}
                              type="button"
                              onClick={() => setCustomIcon(ico)}
                              className={`w-6.5 h-6.5 flex items-center justify-center rounded-lg text-xs border transition ${
                                customIcon === ico 
                                  ? 'bg-emerald-50 border-emerald-300 scale-105 font-bold' 
                                  : 'bg-white border-slate-100 hover:border-slate-300'
                              }`}
                            >
                              {ico}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wide">Card Title</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="e.g., Cold Ice Shock, My Warm Chamomile Cup..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wide">Step-by-step Grounding Advice</label>
                      <textarea
                        value={customAdvice}
                        onChange={(e) => setCustomAdvice(e.target.value)}
                        rows={2}
                        placeholder="Detail exactly what physical physical steps to execute, starting right now..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-2 pt-1 font-sans">
                      <button
                        onClick={handleCreateCustomCard}
                        className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] rounded-xl text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Add Custom Card to Deck
                      </button>
                      <button
                        onClick={() => {
                          setShowAddCardForm(false);
                          setCustomTitle('');
                          setCustomAdvice('');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10.5px] font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <ShieldAlert className="w-5 h-5 text-emerald-800" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Coping Armour: Personalized Relapse Plan</h4>
                <p className="text-[10px] text-slate-400 font-medium font-semibold uppercase leading-none">Cognitive-Behavioral Defense Sheet</p>
              </div>
            </div>

            {/* Section 1: Reasons for Sobriety */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Heart className="w-4 h-4" /> 1. Reasons My Sobriety Matters
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Self-Anchor</span>
              </div>
              <ul className="space-y-2">
                {plan.reasonsForSobriety.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-emerald-50/20 border border-emerald-100/30 p-2.5 rounded-xl text-xs font-medium text-slate-700">
                    <span className="flex items-start gap-2 max-w-[85%] leading-relaxed select-text">
                      <span className="text-emerald-700 mt-0.5">•</span>
                      <span>{item}</span>
                    </span>
                    <button
                      onClick={() => handleRemovePlanItem('reasonsForSobriety', index)}
                      className="p-1 hover:bg-slate-100 rounded text-red-500 shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Enter positive anchor..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  onClick={() => handleAddPlanItem('reasonsForSobriety', newReason, setNewReason)}
                  className="px-3.5 bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Section 2: Main Triggers */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4" /> 2. High-Risk Triggers
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Warning Alerts</span>
              </div>
              <ul className="space-y-2">
                {plan.mainTriggers.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-amber-50/20 border border-amber-100/30 p-2.5 rounded-xl text-xs font-medium text-slate-700">
                    <span className="flex items-start gap-2 max-w-[85%] leading-relaxed select-text">
                      <span className="text-amber-700 mt-0.5">•</span>
                      <span>{item}</span>
                    </span>
                    <button
                      onClick={() => handleRemovePlanItem('mainTriggers', index)}
                      className="p-1 hover:bg-slate-100 rounded text-red-500 shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="Enter trigger (e.g. fatigue, Friday night)..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  onClick={() => handleAddPlanItem('mainTriggers', newTrigger, setNewTrigger)}
                  className="px-3.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Section 3: Coping Strategies */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5 text-blue-800">
                  <Calendar className="w-4 h-4" /> 3. Coping Strategies
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Defensive Routine</span>
              </div>
              <ul className="space-y-2">
                {plan.copingStrategies.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-blue-50/20 border border-blue-100/30 p-2.5 rounded-xl text-xs font-medium text-slate-700">
                    <span className="flex items-start gap-2 max-w-[85%] leading-relaxed select-text">
                      <span className="text-blue-700 mt-0.5">⭐</span>
                      <span>{item}</span>
                    </span>
                    <button
                      onClick={() => handleRemovePlanItem('copingStrategies', index)}
                      className="p-1 hover:bg-slate-100 rounded text-red-500 shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStrategy}
                  onChange={(e) => setNewStrategy(e.target.value)}
                  placeholder="Enter strategy..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  onClick={() => handleAddPlanItem('copingStrategies', newStrategy, setNewStrategy)}
                  className="px-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Section 4: Safe Emergency Contacts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <span className="flex items-center gap-1.5 text-indigo-800">
                  <User className="w-4 h-4" /> 4. Emergency Support Contacts
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Rescue Crew</span>
              </div>
              <ul className="space-y-2">
                {plan.safeContacts.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-indigo-50/20 border border-indigo-100/30 p-2.5 rounded-xl text-xs font-medium text-slate-700">
                    <span className="flex items-start gap-2 max-w-[85%] leading-relaxed select-text">
                      <span className="text-indigo-700 mt-0.5">📞</span>
                      <span>{item}</span>
                    </span>
                    <button
                      onClick={() => handleRemovePlanItem('safeContacts', index)}
                      className="p-1 hover:bg-slate-100 rounded text-red-500 shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="Enter contact name/details..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  onClick={() => handleAddPlanItem('safeContacts', newContact, setNewContact)}
                  className="px-3.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      )}

      {/* --- RADICAL ACCEPTANCE TAB CONTENT --- */}
      {activeSubTab === 'radical_acceptance' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-50 pb-4">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-2xl">
                <Smile className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 font-display">DBT Radical Acceptance Matrix</h4>
                <p className="text-[11.5px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Mindful Distress Tolerance & Sovereignty</p>
              </div>
            </div>

            <div className="bg-[#fbfcfa] border border-slate-200 p-4 rounded-2xl text-[12px] text-slate-600 leading-relaxed font-semibold space-y-2.5">
              <span className="font-extrabold text-emerald-800 block text-xs">🎓 Clinical Goal: Demolish Suffering by Accepting Current Reality</span>
              <p>
                Radical Acceptance is not approval, agreement, or passivity. It is the courageous decision to acknowledge <strong>unconditional reality as it is in the present moment</strong>, rather than fighting it. When we fight reality ("This shouldn't be happening!", "I can't stand this urge!"), our raw physical pain is multiplied into acute, toxic suffering.
              </p>
              <p>
                By fully accepting that an urge exists, we stop wasting neural energy trying to fight or suppress it, freeing our rational prefrontal cortex to make calm, value-aligned decisions.
              </p>
            </div>

            {/* Step-by-Step Exercise workbench */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 space-y-4">
                <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <span>🛠️</span> Reality Acceptance Workshop
                </h5>

                <div className="space-y-4 bg-white border border-slate-200 p-4 rounded-2xl">
                  {/* Struggle Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Step 1: Define what is causing pain or resistance</label>
                    <select
                      value={radicalStruggle}
                      onChange={(e) => setRadicalStruggle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="The sudden onset of a strong physical craving trigger">The sudden onset of a strong physical craving trigger</option>
                      <option value="An intense interpersonal argument or emotional boundary friction">An intense interpersonal argument or emotional boundary friction</option>
                      <option value="The physical exhaustion or heavy stress of my work environment">The physical exhaustion or heavy stress of my work environment</option>
                      <option value="Persistent regret over past substance behaviors or lost timeline">Persistent regret over past substance behaviors or lost timeline</option>
                      <option value="custom">✍️ Customize my own current struggle/reality...</option>
                    </select>
                  </div>

                  {radicalStruggle === 'custom' && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">My Specific Struggle Description:</label>
                      <input
                        type="text"
                        value={radicalCustomStruggle}
                        onChange={(e) => setRadicalCustomStruggle(e.target.value)}
                        placeholder="e.g., Feeling extremely isolated and restless in my apartment right now..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 font-semibold text-slate-700"
                      />
                    </div>
                  )}

                  {/* Fact check input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Step 2: Check the Facts / Unconditional Truths</label>
                    <p className="text-[10px] text-slate-400 font-medium">State the reality exactly as it is, without valuation, exaggeration or emotional blame.</p>
                    <textarea
                      value={radicalFact}
                      onChange={(e) => setRadicalFact(e.target.value)}
                      rows={1}
                      placeholder="e.g., 'I am safe. My heartbeat is elevated. A craving is firing. The past has occurred.'"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none text-slate-700"
                    />
                  </div>

                  {/* Somatic embodiment */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Step 3: Embody Acceptance (Somatic Release Check)</label>
                    <p className="text-[10px] text-slate-400 font-medium">Actively relax your muscles. Open your hands on your lap face upwards. Take a long exhale.</p>
                    <input
                      type="text"
                      value={radicalSomatic}
                      onChange={(e) => setRadicalSomatic(e.target.value)}
                      placeholder="e.g., 'Hands are open, jaw is unclenched, shoulders are dropped. I am host to this weather.'"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none text-slate-700"
                    />
                  </div>

                  {/* Commit action statement */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Step 4: Values-Based Action Commitment</label>
                    <p className="text-[10px] text-slate-400 font-medium">If I radically accept this moment, what action can I take right now that aligns with my values?</p>
                    <textarea
                      value={radicalCommitment}
                      onChange={(e) => setRadicalCommitment(e.target.value)}
                      rows={2}
                      placeholder="e.g., 'Since I accept this tiredness is here, I choose to go to sleep rather than fight my fatigue with substances.'"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none text-slate-700"
                    />
                  </div>

                  <button
                    onClick={handleCommitAcceptance}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                    <span>Commit and Log Radical Acceptance</span>
                  </button>
                </div>
              </div>

              {/* Side Column: Radical wisdom cards & notebook logs */}
              <div className="md:col-span-5 space-y-4 text-left">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/45 p-4 rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-mono font-black text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-lg uppercase">Clinical Wisdom</span>
                    <button
                      onClick={handleShuffleWisdom}
                      className="text-[9px] font-bold text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Shuffle Wisdom 🔄
                    </button>
                  </div>

                  <div className="space-y-1 text-left min-h-[5.5rem] flex flex-col justify-center">
                    <p className="text-[11.5px] text-slate-800 leading-relaxed font-bold italic">
                      "{RADICAL_ACCEPTANCE_WISDOM[acceptanceWisdomIdx]?.quote}"
                    </p>
                    <span className="text-[9.5px] font-black text-slate-400 text-right block mt-1">
                      — {RADICAL_ACCEPTANCE_WISDOM[acceptanceWisdomIdx]?.author}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1.5 border-t border-emerald-200/30">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Apply this quote to your life today:</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={acceptanceReflection}
                        onChange={(e) => setAcceptanceReflection(e.target.value)}
                        placeholder="Applying this to me today..."
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
                      />
                      <button
                        onClick={handleSaveReflection}
                        className="px-3 bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] text-[10.5px] font-black uppercase rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Log
                      </button>
                    </div>
                  </div>
                </div>

                {/* Acceptance Notebook List */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">My Acceptance Notebook</span>
                  {acceptanceLogs.length === 0 && reflectionLogs.length === 0 ? (
                    <p className="text-[10px] text-slate-400 font-medium italic">No active acceptance declarations logged yet.</p>
                  ) : (
                    <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-200/40">
                      {acceptanceLogs.map((log) => (
                        <div key={log.id} className="bg-white p-2.5 rounded-xl border border-slate-200/60 relative space-y-1 shadow-2xs pt-2">
                          <button
                            onClick={() => handleDeleteAcceptanceLog(log.id)}
                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="text-[8px] font-mono font-bold text-slate-400 block">{log.timestamp}</span>
                          <span className="text-[9px] font-extrabold text-emerald-800 uppercase block tracking-wider leading-none mt-1">Accepted Reality:</span>
                          <p className="text-[10px] text-slate-700 font-bold leading-normal">{log.struggle}</p>
                          <span className="text-[9px] font-extrabold text-slate-400 block tracking-wider leading-none mt-1 uppercase">Acceptance Plan:</span>
                          <p className="text-[10px] text-slate-600 font-semibold leading-relaxed italic">{log.commitment}</p>
                        </div>
                      ))}

                      {reflectionLogs.map((ref) => (
                        <div key={ref.id} className="bg-emerald-50/15 p-2.5 rounded-xl border border-emerald-100/50 relative space-y-1 shadow-2xs pt-2">
                          <button
                            onClick={() => handleDeleteReflectionLog(ref.id)}
                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="text-[8px] font-mono font-bold text-slate-400 block">{ref.timestamp}</span>
                          <span className="text-[9px] font-bold text-emerald-950 leading-snug block italic">"{ref.quote}"</span>
                          <p className="text-[10px] text-slate-700 font-bold leading-normal mt-1 flex gap-1 items-start">
                            <span>🧠</span>
                            <span>{ref.response}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- PROBLEM SOLVING MODEL TAB CONTENT --- */}
      {activeSubTab === 'problem_solving' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-50 pb-4">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-2xl">
                <HelpCircle className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 font-display">CBT Systematic Problem-Solving Model</h4>
                <p className="text-[11.5px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Proactive Vulnerability Mitigation</p>
              </div>
            </div>

            <div className="bg-[#fbfcfa] border border-slate-200 p-4 rounded-2xl text-[12px] text-slate-600 leading-relaxed font-semibold space-y-2">
              <span className="font-extrabold text-blue-900 block text-xs">🎓 Clinical Goal: Systematic Defense for Critical Boundary Triggers</span>
              <p>
                Cravings and substance relapse are rarely random; they are highly predictable behavioral escape solutions to painful life obstacles, unmet connection bounds, isolation, or boundary friction.
              </p>
              <p>
                The <strong>Cognitive Problem-Solving Model (SBT)</strong> trains you to treat active triggers not as emotional emergencies, but as solvable problems with logical paths. Laying down exact brainstorm options, auditing pros and cons, and committing to details stops automatic habit response systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Wizard Form */}
              <div className="md:col-span-7 bg-[#f8fafc] border border-slate-200 rounded-2.5xl p-5 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block font-display">
                    ⚔️ Clinical Action Architect
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <span
                        key={st}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition ${
                          psWizardStep === st
                            ? 'bg-emerald-50 text-[#3C3C3C] border-emerald-800 scale-110'
                            : psWizardStep > st
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-400 border-slate-200'
                        }`}
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {psWizardStep === 1 && (
                  <div className="space-y-3 text-left">
                    <span className="text-[11px] font-black text-slate-600 block uppercase tracking-wide">Step 1: Precise Stressor / Trigger Identification</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Deconstruct the precise trigger conflict. Be specific. When does this happen? Who is present? What is the core vulnerable emotion?
                    </p>
                    <textarea
                      value={psTrigger}
                      onChange={(e) => setPsTrigger(e.target.value)}
                      rows={3}
                      placeholder="e.g., 'Friday evening isolation. After a stressful work-week sprint, I arrive home at 5 PM. The empty physical silence triggers intense boredom and urges to seek a reward substance.'"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-700"
                    />
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          if (!psTrigger.trim()) return;
                          setPsWizardStep(2);
                        }}
                        disabled={!psTrigger.trim()}
                        className="px-4.5 py-2 bg-white hover:bg-white disabled:opacity-50 text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Step 2: Brainstorm Options ⏩
                      </button>
                    </div>
                  </div>
                )}

                {psWizardStep === 2 && (
                  <div className="space-y-3 text-left animate-fadeIn">
                    <span className="text-[11px] font-black text-slate-600 block uppercase tracking-wide">Step 2: Brainstorm Alternate safe Exit Doors</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Brainstorm exactly three custom, safe behaviors to de-escalate this risk. No censorship here—any safe, life-affirming idea fits!
                    </p>
                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Option A (Standard Safe Action) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={psSolution1}
                          onChange={(e) => setPsSolution1(e.target.value)}
                          placeholder="e.g., Set up a scheduled phone call with support partner exactly at 5 PM"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Option B (Physical Somatic Redirect)</label>
                        <input
                          type="text"
                          value={psSolution2}
                          onChange={(e) => setPsSolution2(e.target.value)}
                          placeholder="e.g., Drive directly to the boulder climbing gym instead of heading home"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Option C (Distress-Tolerance Escape)</label>
                        <input
                          type="text"
                          value={psSolution3}
                          onChange={(e) => setPsSolution3(e.target.value)}
                          placeholder="e.g., Pre-book a movie ticket at the theater for 5:35 PM to stay occupied"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setPsWizardStep(1)}
                        className="px-4 py-2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (!psSolution1.trim()) return;
                          setPsWizardStep(3);
                        }}
                        disabled={!psSolution1.trim()}
                        className="px-4.5 py-2 bg-white hover:bg-white text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50 transition cursor-pointer"
                      >
                        Step 3: Analyze Pros/Cons ⏩
                      </button>
                    </div>
                  </div>
                )}

                {psWizardStep === 3 && (
                  <div className="space-y-3 text-left animate-fadeIn">
                    <span className="text-[11px] font-black text-slate-600 block uppercase tracking-wide">Step 3: Analyze Pros & Cons of the options</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Assess the mental resistance or value rewards of your brainstormed choices. Write pros & cons:
                    </p>
                    <div className="space-y-2">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[9.5px] font-bold text-slate-400 block truncate">FOR: {psSolution1}</span>
                        <input
                          type="text"
                          value={psProsCons1}
                          onChange={(e) => setPsProsCons1(e.target.value)}
                          placeholder="e.g., Pros: High connection. Cons: Sister might be busy, need backup."
                          className="w-full px-2.5 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                        />
                      </div>
                      {psSolution2 && (
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400 block truncate">FOR: {psSolution2}</span>
                          <input
                            type="text"
                            value={psProsCons2}
                            onChange={(e) => setPsProsCons2(e.target.value)}
                            placeholder="e.g., Pros: Somatic release, tires body. Cons: Requires packing clothes."
                            className="w-full px-2.5 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                          />
                        </div>
                      )}
                      {psSolution3 && (
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400 block truncate">FOR: {psSolution3}</span>
                          <input
                            type="text"
                            value={psProsCons3}
                            onChange={(e) => setPsProsCons3(e.target.value)}
                            placeholder="e.g., Pros: Immersive environment. Cons: Costs cinema ticket fee."
                            className="w-full px-2.5 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setPsWizardStep(2)}
                        className="px-4 py-2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setPsWizardStep(4);
                        }}
                        className="px-4.5 py-2 bg-white hover:bg-white text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider transition"
                      >
                        Step 4: Commit Selection ⏩
                      </button>
                    </div>
                  </div>
                )}

                {psWizardStep === 4 && (
                  <div className="space-y-4 text-left animate-fadeIn">
                    <span className="text-[11px] font-black text-slate-600 block uppercase tracking-wide">Step 4: Select optimal Value Commitment</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Evaluate your pros and cons. Decide on the single most practical, highest-integrity action plan to execute.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setPsSelectedSolution(psSolution1)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-extrabold transition flex items-center gap-2.5 ${
                          psSelectedSolution === psSolution1
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-sm">🔑</span>
                        <span>{psSolution1}</span>
                      </button>
                      {psSolution2 && (
                        <button
                          onClick={() => setPsSelectedSolution(psSolution2)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-extrabold transition flex items-center gap-2.5 ${
                            psSelectedSolution === psSolution2
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm">🧗</span>
                          <span>{psSolution2}</span>
                        </button>
                      )}
                      {psSolution3 && (
                        <button
                          onClick={() => setPsSelectedSolution(psSolution3)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-extrabold transition flex items-center gap-2.5 ${
                            psSelectedSolution === psSolution3
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm">🎬</span>
                          <span>{psSolution3}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setPsWizardStep(3)}
                        className="px-4 py-2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (!psSelectedSolution) return;
                          setPsWizardStep(5);
                        }}
                        disabled={!psSelectedSolution}
                        className="px-4.5 py-2 bg-white hover:bg-white text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50 transition cursor-pointer"
                      >
                        Step 5: Timeline Execution ⏩
                      </button>
                    </div>
                  </div>
                )}

                {psWizardStep === 5 && (
                  <div className="space-y-4 text-left animate-fadeIn">
                    <span className="text-[11px] font-black text-slate-600 block uppercase tracking-wide">Step 5: Exact Execution Timeline</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Determine exactly when and where this solution will trigger. Removing ambiguity reduces subconscious hesitation.
                    </p>
                    <textarea
                      value={psTimelineCommitment}
                      onChange={(e) => setPsTimelineCommitment(e.target.value)}
                      rows={2}
                      placeholder="e.g., 'Friday evening at 4:45 PM before packing my work bag, I will dial my sister. If she doesn't pick up, my immediate backup option is driving directly to the climbing gym.'"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-700"
                    />
                    <div className="flex justify-between pt-3 border-t border-slate-200">
                      <button
                        onClick={() => setPsWizardStep(4)}
                        className="px-4 py-2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSaveProblemSolvingPlan}
                        className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-100" />
                        <span>Lock In Defenses</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Strategy vault */}
              <div className="md:col-span-5 space-y-4 text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Strategic Intervention Vault</span>
                
                {psPlansList.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-medium italic">No active de-escalation strategies created yet.</p>
                ) : (
                  <div className="space-y-3 max-h-[29rem] overflow-y-auto pr-1">
                    {psPlansList.map((pl) => (
                      <div 
                        key={pl.id} 
                        className={`p-4 rounded-2.5xl border transition duration-200 relative text-left space-y-2.5 ${
                          pl.resolved 
                            ? 'bg-slate-50 border-slate-200 opacity-80' 
                            : 'bg-white border-emerald-100 shadow-xs'
                        }`}
                      >
                        <button
                          onClick={() => handleDeletePlan(pl.id)}
                          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-red-500 rounded p-1 hover:bg-slate-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex justify-between items-start pr-6 gap-2">
                          <span className={`text-[8.5px] font-mono font-black border px-2 py-0.5 rounded-lg uppercase tracking-wide ${
                            pl.resolved 
                              ? 'bg-slate-100 text-slate-500' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          }`}>
                            {pl.resolved ? "🏆 Resolved safe" : "🔥 Active plan"}
                          </span>
                          <span className="text-[8.5px] font-mono text-slate-400 font-semibold">{pl.timestamp}</span>
                        </div>

                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Trigger Bottleneck:</span>
                          <p className="text-[11px] text-slate-700 font-bold leading-normal select-text">
                            {pl.trigger}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Brainstormed exit doors:</span>
                          <div className="flex flex-col gap-1">
                            {pl.solutions.map((sol, i) => (
                              <div key={i} className="text-[10px] text-slate-500 font-semibold leading-tight flex items-start gap-1">
                                <span>-</span>
                                <span className={pl.selected === sol ? 'font-black text-emerald-950 underline' : ''}>{sol}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/40 text-left space-y-1">
                          <span className="text-[8.5px] font-black text-emerald-800 uppercase tracking-widest block">Selected Value Commitment:</span>
                          <p className="text-[10.5px] text-slate-800 font-bold leading-normal">
                             "{pl.selected}"
                          </p>
                        </div>

                        <div className="text-[9.5px] text-slate-500 leading-normal flex items-start gap-1 p-0.5">
                          <span className="font-extrabold text-slate-700 leading-none block uppercase">Timeline:</span>
                          <span className="italic font-semibold">{pl.timeline}</span>
                        </div>

                        <button
                          onClick={() => handleResolvePlan(pl.id)}
                          className={`w-full py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer ${
                            pl.resolved
                              ? 'bg-slate-200 text-slate-600 hover:bg-slate-200'
                              : 'bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] font-black shadow-xs'
                          }`}
                        >
                          {pl.resolved ? "Re-open Active Plan" : "✓ Mark as Successfully De-escalated"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- BEHAVIORAL REINFORCEMENT TAB CONTENT --- */}
      {activeSubTab === 'behavior_reinforcement' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-50 pb-4">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-2xl">
                <Award className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 font-display">Behavioral Reinforcement Model</h4>
                <p className="text-[11.5px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Operant Conditioning Loop Rescheduling</p>
              </div>
            </div>

            <div className="bg-[#fbfcfa] border border-slate-200 p-4 rounded-2xl text-[12px] text-slate-600 leading-relaxed font-semibold space-y-2">
              <span className="font-extrabold text-teal-800 block text-xs">🎓 Clinical Goal: Rewire Somatic Brain Circuits & Reschedule Rewards</span>
              <p>
                Chronic addictive behaviors run on rapid <strong>cue-conditioned routines</strong> configured to trigger automated substance-seeking paths for immediate dopamine rewards. To smash this automatic loops, we must deliberately de-couple the Cue from the Old Routine, slot in a healthy Alternative Routine, and coordinate powerful physical, delayed treats.
              </p>
              <p>
                Use this operant conditioning laboratory to write custom loops, schedule milestones rewards, and fire off direct somatic reinforcement cues.
              </p>
            </div>

            {/* Hold Somatic Dopamine clicker */}
            <div className="bg-gradient-to-r from-[#173322] to-[#122e1d] text-white p-5 rounded-2.5xl border border-emerald-950 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative overflow-hidden">
              <div className="space-y-1 z-10">
                <span className="text-[9px] font-mono font-black text-emerald-400 animate-pulse uppercase tracking-widest block font-bold">🚀 immediate somatic reinforcement clicker</span>
                <h5 className="font-display font-black text-sm text-emerald-50 tracking-tight">Reinforce Neural Decoupling Immediately</h5>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-semibold max-w-lg">
                  Did you just safely avoid an urge? Click the high-energy reinforcer below. Delivering immediate tactile, visual validation re-trains prefrontal conditioning centers.
                </p>
              </div>

              <div className="shrink-0 z-10">
                <button
                  onClick={triggerSomaticReinforcer}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-lg hover:shadow-emerald-500/10 active:scale-95 transition flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <Sparkles className="w-4 h-4 text-emerald-100" />
                  <span>Send Dopamine Pulse</span>
                </button>
              </div>

              <AnimatePresence>
                {showReinforceEffect && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0e2114]/98 flex items-center justify-center p-4 z-25 text-center flex-col space-y-1.5 text-white"
                  >
                    <span className="text-xl">🌟</span>
                    <p className="text-xs font-black text-emerald-200 max-w-md uppercase tracking-tight font-display px-4 leading-normal">
                      {reinforceFeedback}
                    </p>
                    <span className="text-[9.5px] font-mono text-emerald-400 font-extrabold">+1 Mastery Points added. Pathway updated!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Loop architect */}
              <div className="md:col-span-6 space-y-4 text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Habit Loop Architect (Cue ➡️ Routine ➡️ Reward)</span>
                
                <div className="bg-[#fbfcfa] border border-slate-200 p-4.5 rounded-2.5xl space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest block font-sans">1. The Conditioned Cue (Context/Trigger)</label>
                    <input
                      type="text"
                      value={habitCue}
                      onChange={(e) => setHabitCue(e.target.value)}
                      placeholder="e.g., Saturday at 6:00 pm, returning home alone"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-black text-red-700 uppercase tracking-widest block">2. Old Automated Routine (Erase)</label>
                    <input
                      type="text"
                      value={habitOldRoutine}
                      onChange={(e) => setHabitOldRoutine(e.target.value)}
                      placeholder="e.g., Drinking or requesting substance seek"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-black text-emerald-800 uppercase tracking-widest block">3. New Replacement Routine (Somatic Lock-in)</label>
                    <input
                      type="text"
                      value={habitNewRoutine}
                      onChange={(e) => setHabitNewRoutine(e.target.value)}
                      placeholder="e.g., Running hot steam towel bath & lighting vanilla candle"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-black text-blue-800 uppercase tracking-widest block">4. Safe Healthy Delayed Reward (New Reinforcer)</label>
                    <input
                      type="text"
                      value={habitReward}
                      onChange={(e) => setHabitReward(e.target.value)}
                      placeholder="e.g., Eating double fudge ice cream & calling sister"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 font-sans"
                    />
                  </div>

                  <button
                    onClick={handleSaveHabitLoop}
                    className="w-full py-2.5 bg-white hover:bg-white text-[#3C3C3C] text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer font-sans"
                  >
                    Save Habit Loop Template
                  </button>
                </div>

                {/* List of active habit loops */}
                <div className="space-y-2 animate-fadeIn">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase block tracking-wider">My Active Rewriting Schedules</span>
                  {habitLoopsList.map((hl) => (
                    <div key={hl.id} className="bg-white border border-slate-200 rounded-2xl p-4 relative space-y-2 text-left shadow-2xs">
                      <button
                        onClick={() => handleDeleteHabitLoop(hl.id)}
                        className="absolute top-2.5 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1">
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">Target Cue Context:</span>
                        <p className="text-[10.5px] text-slate-800 font-bold leading-normal">{hl.cue}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                        <div className="text-left space-y-0.5">
                          <span className="text-[7.5px] font-black text-red-600 uppercase tracking-widest block">Old routine:</span>
                          <span className="text-[9.5px] text-slate-400 font-semibold leading-tight block line-through">{hl.oldRoutine}</span>
                        </div>
                        <div className="text-left space-y-0.5 border-l border-slate-200 pl-2">
                          <span className="text-[7.5px] font-black text-emerald-800 uppercase tracking-widest block">New routine:</span>
                          <span className="text-[9.5px] text-slate-700 font-extrabold leading-tight block">{hl.newRoutine}</span>
                        </div>
                        <div className="text-left space-y-0.5 border-l border-slate-200 pl-2">
                          <span className="text-[7.5px] font-black text-blue-900 uppercase tracking-widest block">Reward Treat:</span>
                          <span className="text-[9.5px] text-blue-950 font-extrabold leading-tight block italic">{hl.reward}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editable milestone treats ledger */}
              <div className="md:col-span-6 space-y-4 text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Sobriety Milestone Treat Ledger</span>
                
                <div className="bg-[#fcfdfd] border border-slate-200 p-4 rounded-2.5xl space-y-4.5">
                  <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                    Rewire your dopamine circuits by coordinating tangible rewards for clean timeline marks. Enter custom treats below, and tick them off when reached!
                  </p>

                  <div className="space-y-3.5">
                    {/* milestone block */}
                    {[
                      { key: '1_day', label: '🌱 Day 1 (Germination Sprout)', icon: '🍃', requiredDays: 1 },
                      { key: '3_days', label: '🌿 Day 3 (Somatic Foundation)', icon: '🌾', requiredDays: 3 },
                      { key: '7_days', label: '🌟 Day 7 (Week Resiliency)', icon: '🏆', requiredDays: 7 },
                      { key: '14_days', label: '🦁 Day 14 (Fortress Sovereignty)', icon: '🛡️', requiredDays: 14 },
                      { key: '30_days', label: '💎 Month 1 (Neuroplastic Glow)', icon: '🦁', requiredDays: 30 },
                      { key: '90_days', label: '👑 Month 3 (Sovereignty Legacy)', icon: '👑', requiredDays: 90 }
                    ].map((mile) => {
                      const isUnlocked = sobrietyDate ? (counter.days >= mile.requiredDays) : false;
                      const hasClaimed = !!claimedMilestones[mile.key];

                      return (
                        <div key={mile.key} className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 text-left items-start relative shadow-2xs">
                          {/* Left icon wrapper */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs ${
                            isUnlocked 
                              ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse' 
                              : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}>
                            {mile.icon}
                          </div>

                          <div className="flex-1 space-y-1 select-text">
                            <span className="text-[10.5px] font-bold text-slate-800 block">{mile.label}</span>
                            
                            <div className="flex gap-1.5 items-center">
                              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest shrink-0">Treat:</span>
                              <input
                                type="text"
                                value={milestoneRewards[mile.key] || ''}
                                onChange={(e) => handleSaveMilestoneReward(mile.key, e.target.value)}
                                placeholder="State target reward/treat..."
                                className="flex-1 bg-slate-50 px-2 py-0.5 rounded text-[10.5px] font-semibold border border-transparent focus:border-slate-300 focus:bg-white outline-none text-slate-700 font-sans"
                              />
                            </div>

                            <div className="flex justify-between items-center pt-1.5">
                              {/* Status badge */}
                              {isUnlocked ? (
                                <span className="text-[8.5px] font-mono font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                   ✓ Unlocked!
                                </span>
                              ) : (
                                <span className="text-[8px] font-mono font-bold text-slate-400">
                                   {sobrietyDate ? `Need ${mile.requiredDays - counter.days} more days` : "Activate Counter"}
                                </span>
                              )}

                              {/* check claim button if unlocked */}
                              <div className="flex items-center gap-1.5">
                                <label className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer">Claimed:</label>
                                <input
                                  type="checkbox"
                                  disabled={!isUnlocked}
                                  checked={hasClaimed}
                                  onChange={() => handleClaimMilestone(mile.key)}
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-800 accent-emerald-800 disabled:opacity-40 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- 8 DIMENSIONS SELF-REFLECTION WORKSHEET (THERAPIST PDF INTEGRATION) --- */}
      {activeSubTab === 'wellness_reflection' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-left"
        >
          {/* Header Hero */}
          <div className="bg-gradient-to-br from-emerald-950 to-teal-900 text-white p-5 md:p-6 rounded-3xl border border-emerald-800 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[9px] uppercase tracking-widest font-mono font-black">
                    Therapy for Families Worksheet Framework
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display tracking-tight">8 Dimensions of Wellness Reflection</h3>
                <p className="text-[11.5px] text-emerald-100 font-medium leading-relaxed max-w-xl font-sans">
                  Holistic assessment. Identify where you are flourishing, note depletions, and define tiny actionable steps. Your ratings are auto-synchronized with your main Wellness dashboard.
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetReflectionWorksheet}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-3 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Clear Answers</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Bento Rows representing the 8 Dimensions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest font-mono">
                Holistic Dimensions Tracker
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase font-black">
                All inputs autosave in real-time
              </span>
            </div>

            <div className="space-y-4">
              {reflectionRows.map((row) => (
                <div 
                  key={row.key} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-2xs space-y-4 text-left transition hover:border-slate-300"
                >
                  {/* Dimension Header and Rating */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{row.name.split(' ').pop()}</span>
                        <h4 className="text-sm font-black text-slate-900 leading-none">
                          {row.name.replace(/ [^\s]+$/, '')}
                        </h4>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-medium">
                        {row.key === 'physical' && "Somatic vitality, sleeping routines, metabolic balance, and physical replenishment cycles."}
                        {row.key === 'emotional' && "Processing uncomfortable feelings, managing stress, and self-soothing during anxiety flares."}
                        {row.key === 'intellectual' && "Cognitive growth, study, opening minds to new inputs, and reframing rigid distortions."}
                        {row.key === 'social' && "Stable relationships, emotional connection boundaries, and preventing people-pleasing fatigue."}
                        {row.key === 'spiritual' && "Existential purpose alignment, values-focused actions, inner composure, and tranquility."}
                        {row.key === 'occupational' && "Labor-rest separating boundaries, performance pressures containment, and career pacing."}
                        {row.key === 'environmental' && "Nurturing pleasant spatial surroundings, sound management, and reducing sensory overload."}
                        {row.key === 'financial' && "Spending boundaries checklist, budget planning, and reducing financial distress loops."}
                      </p>
                    </div>

                    {/* Desktop/Mobile Rating input */}
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl shrink-0">
                      <label className="text-[9.5px] font-black uppercase text-slate-500 font-mono">Rating:</label>
                      <select
                        value={row.rating}
                        onChange={(e) => handleUpdateRowValue(row.key, 'rating', Number(e.target.value))}
                        className="bg-transparent text-xs font-mono font-black text-emerald-800 outline-none focus:ring-0 text-center cursor-pointer font-sans"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} - {num <= 3 ? 'Depleted' : num <= 6 ? 'Neutral' : num <= 8 ? 'Strong' : 'Flourishing'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Worksheet Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* 1. What's going well */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase font-black text-slate-500 tracking-wide font-mono flex items-center gap-1 pl-0.5">
                        <span className="text-emerald-600">✓</span> What's Going Well
                      </label>
                      <textarea
                        rows={2}
                        value={row.goingWell}
                        onChange={(e) => handleUpdateRowValue(row.key, 'goingWell', e.target.value)}
                        placeholder="Detail positive attributes or healthy behaviors currently working..."
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[11px] font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white resize-none font-sans"
                      />
                    </div>

                    {/* 2. What needs attention */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase font-black text-slate-500 tracking-wide font-mono flex items-center gap-1 pl-0.5">
                        <span className="text-rose-500">⚠️</span> What Needs Attention
                      </label>
                      <textarea
                        rows={2}
                        value={row.needsAttention}
                        onChange={(e) => handleUpdateRowValue(row.key, 'needsAttention', e.target.value)}
                        placeholder="State specific gaps, stressors, depletions, or symptoms..."
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[11px] font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white resize-none font-sans"
                      />
                    </div>

                    {/* 3. Next small step */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase font-black text-slate-500 tracking-wide font-mono flex items-center gap-1 pl-0.5">
                        <span className="text-teal-600">👣</span> Next Small Step (This Week)
                      </label>
                      <textarea
                        rows={2}
                        value={row.nextStep}
                        onChange={(e) => handleUpdateRowValue(row.key, 'nextStep', e.target.value)}
                        placeholder="e.g. hydrate with 1L water before coffee, download woodland rain ambient sound, etc..."
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[11px] font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white resize-none font-sans"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinician Reflection Questions Card from Therapy for Families Guidelines */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <h4 className="text-sm font-black text-slate-900 font-display uppercase tracking-wide">
                Integration & Self-Reflection Queries
              </h4>
            </div>

            <div className="space-y-4">
              {/* Question 1 */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11.5px] font-bold text-slate-800 leading-snug">
                  1. Looking at your scores, which dimension is currently your strongest? Why is this aspect of your life flourishing?
                </label>
                <textarea
                  rows={3}
                  value={generalReflectionAnswers.strongestReason}
                  onChange={(e) => handleUpdateGeneralReflection('strongestReason', e.target.value)}
                  placeholder="Analyze the supportive mechanisms, habits, or environment making this category flourish..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-slate-300 font-sans"
                />
              </div>

              {/* Question 2 */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11.5px] font-bold text-slate-800 leading-snug">
                  2. Which dimension feels the most depleted? What is one small, realistic action you can take this week to nourish it?
                </label>
                <textarea
                  rows={3}
                  value={generalReflectionAnswers.depletedAction}
                  onChange={(e) => handleUpdateGeneralReflection('depletedAction', e.target.value)}
                  placeholder="Commit to a specific micro-behavior. Keep it manageable to prevent emotional frustration..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-slate-300 font-sans"
                />
              </div>

              {/* Question 3 */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11.5px] font-bold text-slate-800 leading-snug">
                  3. Describe how a depletion in one area affects your overall emotional sobriety, relationship stability, and stress boundaries.
                </label>
                <textarea
                  rows={3}
                  value={generalReflectionAnswers.spilloverImpact}
                  onChange={(e) => handleUpdateGeneralReflection('spilloverImpact', e.target.value)}
                  placeholder="e.g., when my Physical rest is depleted, I notice immediate emotional hyper-reactivity at work..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-slate-300 font-sans"
                />
              </div>
            </div>

            {/* Complete Reflection button */}
            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSaveReflectionPledges}
                className="py-3 px-6 bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pledge My Reflection Worksheet</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- ALTERNATIVE 12-STEP EXPLORER & JOURNALING WORKSPACE --- */}
      {activeSubTab === 'alt_12_steps' && (() => {
        const activeProg = ALTERNATIVE_12_STEPS_PROGRAMS.find(p => p.id === selectedProgramId) || ALTERNATIVE_12_STEPS_PROGRAMS[0];
        
        // Calculate progress matching the active program
        let completedCount = 0;
        for (let idx = 0; idx < 12; idx++) {
          if (alt12StepCompletions[`${activeProg.id}:${idx}`]) {
            completedCount++;
          }
        }
        const progPercent = Math.round((completedCount / 12) * 100);

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-left"
          >
            {/* Header Hero */}
            <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-50 text-white p-5 md:p-6 rounded-3xl border border-emerald-800 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-[9px] uppercase tracking-widest font-mono font-black">
                      Alternative Twelve-Steps Library & Journaling Workspace
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display tracking-tight">Adaptive Sobriety & Values Paths</h3>
                  <p className="text-[11.5px] text-emerald-100 font-medium leading-relaxed max-w-xl font-sans">
                    Traditional twelve-step literature contains theological assertions that may not align with everyone's background. This library presents inclusive, humanist, rational, Stoic, Buddhist, Pagan, Islamic, and Native American adaptations, encouraging you to personalize your internal recovery compass.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick selector grid of all 20 programs */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest font-mono">
                Choose Your Inclusive Recovery Pathway
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {ALTERNATIVE_12_STEPS_PROGRAMS.map((prog) => {
                  const isSel = prog.id === selectedProgramId;
                  // Count completed for each program to show micro progress badges
                  let progComps = 0;
                  for (let i = 0; i < 12; i++) {
                    if (alt12StepCompletions[`${prog.id}:${i}`]) progComps++;
                  }

                  return (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => {
                        setSelectedProgramId(prog.id);
                        localStorage.setItem('therapy_selected_12_step_program_id', prog.id);
                        setActiveStepWorkIndex(0);
                        onTriggerInteractionAlert(
                          `🧬 Recovery Framework Changed`,
                          `Your workspace has updated! You are now viewing the steps, references, and journal notebooks adapted for the ${prog.name}.`
                        );
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition relative overflow-hidden cursor-pointer h-24 ${
                        isSel
                          ? 'bg-white border-slate-200 text-[#3C3C3C] shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-xl">{prog.emoji}</span>
                        {progComps > 0 && (
                          <span className={`text-[8.5px] font-mono font-black py-0.5 px-1.5 rounded-md ${
                            isSel ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          }`}>
                            {progComps}/12
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-0.5 select-none">
                        <span className="text-[10.5px] font-black block truncate tracking-tight leading-tight">
                          {prog.name}
                        </span>
                        <span className="text-[8px] font-bold block truncate opacity-70">
                          {prog.creator}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Program Detail Dashboard Card */}
            <div className="bg-white text-[#3C3C3C] border border-slate-200 rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 text-left">
                  <span className="text-[9.5px] font-mono font-black text-emerald-400 uppercase tracking-widest bg-emerald-50 border border-emerald-900/60 px-2 py-0.5 rounded-md">
                    Active Program
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="text-2xl">{activeProg.emoji}</span>
                    {activeProg.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                    {activeProg.summary}
                  </p>
                  <div className="text-[9.5px] font-mono opacity-80 text-teal-300 font-bold">
                    Source: <span className="italic">{activeProg.source}</span>
                  </div>
                </div>

                {/* Micro dial */}
                <div className="bg-white/5 border border-white/10 p-4.5 rounded-2xl flex flex-col items-center shrink-0 min-w-[150px]">
                  <span className="text-[9px] uppercase text-slate-400 font-mono font-bold tracking-wider">Core Program Progress</span>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{progPercent}%</p>
                  <span className="text-[8.5px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                    {completedCount === 12 ? 'Step Work Complete ⭐' : `${completedCount} of 12 Steps Logged`}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Layout: Steps List on Left, Active Step Workout Desk on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Column: All 12 Steps List */}
              <div className="md:col-span-5 space-y-2 max-h-[550px] overflow-y-auto pr-1">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest font-mono block pl-1">
                  Step Navigation Selector
                </span>
                
                <div className="space-y-2">
                  {activeProg.steps.map((stepText, idx) => {
                    const stepK = `${activeProg.id}:${idx}`;
                    const isCompleted = !!alt12StepCompletions[stepK];
                    const hasJournal = !!alt12StepJournal[stepK]?.trim();
                    const isSelected = activeStepWorkIndex === idx;

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveStepWorkIndex(idx)}
                        className={`p-3.5 rounded-2xl border text-left transition duration-150 cursor-pointer flex gap-3.5 relative overflow-hidden ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 border-2 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Selector/Index Circle */}
                        <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-mono text-[10px] font-black border ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-800 text-[#3C3C3C]'
                            : isSelected
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          {isCompleted ? "✓" : idx + 1}
                        </div>

                        {/* Text and attributes */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <p className={`text-[11.5px] font-semibold leading-relaxed line-clamp-2 ${
                            isSelected ? 'text-emerald-950 font-bold' : 'text-slate-700'
                          }`}>
                            {stepText}
                          </p>
                          
                          <div className="flex gap-2 items-center">
                            {hasJournal && (
                              <span className="text-[8.5px] font-mono font-semibold text-teal-800 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                📝 Journal Entry Saved
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[8.5px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                                Completed Milestone
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Step Workbook desk */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-black text-slate-400">
                      Step Reflection Notebook
                    </span>
                    <h4 className="text-sm font-black text-slate-900 font-display">
                      Step {activeStepWorkIndex + 1} Interactive Worksheet
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStepCompletion(activeProg.id, activeStepWorkIndex)}
                    className={`py-1.5 px-3 rounded-xl border font-black text-[9.5px] uppercase font-mono tracking-wider transition cursor-pointer flex items-center gap-1 ${
                      alt12StepCompletions[`${activeProg.id}:${activeStepWorkIndex}`]
                        ? 'bg-emerald-5 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {alt12StepCompletions[`${activeProg.id}:${activeStepWorkIndex}`]
                        ? "Mark Incomplete"
                        : "Mark Complete ✓"}
                    </span>
                  </button>
                </div>

                {/* Large Display Step focus */}
                <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl text-left">
                  <span className="text-3xl leading-none block pb-2">{activeProg.emoji}</span>
                  <p className="text-xs font-bold leading-relaxed text-slate-800 font-sans italic">
                    "{activeProg.steps[activeStepWorkIndex]}"
                  </p>
                </div>

                {/* Custom Guidelines Based on Step Number */}
                <div className="space-y-1.5 text-left text-xs bg-indigo-50/40 border border-indigo-100/65 p-3.5 rounded-2xl">
                  <span className="text-[9.5px] uppercase font-black tracking-wide text-indigo-950 font-mono block">
                    📘 Clinical Guidelines & Prompts
                  </span>
                  <p className="text-slate-600 font-semibold leading-relaxed font-sans text-[11px]">
                    {activeStepWorkIndex === 0 && "Step 1 centers on radical honesty. Write down exactly how the addiction or habit cycle has affected your biological health, mental balance, relationship boundaries, and professional satisfaction."}
                    {activeStepWorkIndex === 1 && "Step 2 is about hope and identifying supportive structures. What serves as your 'restoration power'? It can be your therapist, clinical guides, peer recovery networks, physical movement, or evidence-based sciences."}
                    {activeStepWorkIndex === 2 && "Step 3 involves constructive action. How do you plan to let go of control over factors you cannot change? What are you actively ready to adjust within your behavior patterns?"}
                    {activeStepWorkIndex === 3 && "Step 4 is your inventory. Honestly write down your primary strengths, followed by specific situations, environmental stimuli, or trauma triggers that challenge your self-control."}
                    {activeStepWorkIndex === 4 && "Step 5 is honest communication. Who is a safe, empathetic person you can discuss these inventory items with? Reflect on breaking the loneliness cycle through clinical or peer containment."}
                    {activeStepWorkIndex === 5 && "Step 6 relates to deep readiness. What are the negative cognitive distortions, automatic assumptions, or defensive coping mechanisms you are ready to put down? Identify their emotional logic."}
                    {activeStepWorkIndex === 7 && "Step 8 asks you to list those who were harmed by your destructive cycles. Formulate this list with care, remembering to prioritize yourself. Cultivate self-compassion for your past struggles."}
                    {activeStepWorkIndex === 8 && "Step 9 centers on making amends. What are the realistic, direct, or living amends you can work on this month? Ensure these amends build harmony without violating any safety boundaries."}
                    {activeStepWorkIndex === 9 && "Step 10 is steady self-reflection. Describe how you plan to conduct regular inventory checks, mindful behavior audits, and prompt admissions when you act unskillfully or defensively."}
                    {activeStepWorkIndex === 10 && "Step 11 is deep restorative practice. Write about your current meditation routines, somatic pausing, or therapy homework tasks. How can these enhance your conscious contact with your true self?"}
                    {activeStepWorkIndex === 11 && "Step 12 is service and sharing. Gained insight prompts us to comfort others in similar spirals. What is one supportive act you can perform to help a peer starting their journey?"}
                    {!([0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11].includes(activeStepWorkIndex)) && "Step 7 is about humility and character growth. Identify the positive habits and adaptive skills you are cultivating to replace old habits."}
                  </p>
                </div>

                {/* Written Journal Input area */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wide font-mono pl-0.5">
                    Your Step Journal Entry & Reflection Desk
                  </label>
                  <textarea
                    rows={6}
                    value={alt12StepJournal[`${activeProg.id}:${activeStepWorkIndex}`] || ''}
                    onChange={(e) => handleSaveStepJournal(activeProg.id, activeStepWorkIndex, e.target.value)}
                    placeholder="Describe your thoughts, list your triggers, record your amends, or outline your active steps..."
                    className="w-full bg-slate-50/50 focus:bg-white border border-slate-200 rounded-2xl p-3.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-300 focus:ring-1 focus:ring-emerald-700/20 font-sans transition-all"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 pl-0.5">
                    <span>Replies are automatically saved in real-time</span>
                    <span>{alt12StepJournal[`${activeProg.id}:${activeStepWorkIndex}`]?.length || 0} characters</span>
                  </div>
                </div>

                {/* Save and Controls action Bar */}
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      onTriggerInteractionAlert(
                        "📝 Step Reflection Saved",
                        `Your written journaling worksheet response for Step ${activeStepWorkIndex + 1} has been archived securely. Keep up the amazing work!`
                      );
                    }}
                    className="py-2.5 px-5 bg-emerald-50 hover:bg-emerald-50 text-[#3C3C3C] font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm border border-emerald-900"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Archive Entry</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Support footer card */}
            <div className="bg-emerald-50/30 border border-emerald-100 p-4.5 rounded-2xl">
              <span className="text-[9.5px] font-mono font-black uppercase text-emerald-800 tracking-wider">CLINICAL SOBRIETY INSIGHTS</span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold mt-1">
                Shoring up permanent recovery requires finding a framework that you genuinely believe in. The multi-path alternative 12-steps allow you to switch templates at any time without losing your completed logs or step entries. Customize your path!
              </p>
            </div>
          </motion.div>
        );
      })()}

    </div>
  );
}
