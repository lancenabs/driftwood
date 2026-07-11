export interface BubbleItem {
  word: string;
  description: string;
  left: number; // percentage coordinate on 600x600 grid (e.g. 10 to 90)
  top: number;  // percentage coordinate on 600x600 grid (e.g. 10 to 90)
  size: number; // size in pixels
}

export interface QuadrantData {
  id: string;
  title: string;
  description: string;
  emoji: string;
  bg: string;
  bubbleColor: string;
  selectedBubbleColor: string;
  accent: string;
  label: string;
  bubbles: BubbleItem[];
}

export interface BoxInteractiveConfig {
  id: 'thoughts' | 'behaviors' | 'emotions' | 'sensation';
  title: string;
  subtitle: string;
  emoji: string;
  themeColor: string;
  quadrants: QuadrantData[];
}

// ---------------------------------------------
// 1. EMOTIONS INTERACTIVE REGISTRY
// ---------------------------------------------
export const EMOTIONS_CONFIG: BoxInteractiveConfig = {
  id: 'emotions',
  title: "Emotional Space",
  subtitle: "Choose your energy quadrant then navigate your feelings wall",
  emoji: "😊",
  themeColor: "rose",
  quadrants: [
    {
      id: 'high-good',
      title: 'High Energy • Feeling Good',
      description: 'Feeling vibrant, enthusiastic, and confident. Alert and ready to enjoy life.',
      emoji: '🔥',
      bg: 'from-amber-100 via-amber-50 to-orange-50 border-amber-200 text-amber-900',
      bubbleColor: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 text-slate-900 border-yellow-200',
      selectedBubbleColor: 'bg-gradient-to-br from-yellow-300 to-amber-400 text-slate-950 font-black shadow-[0_0_20px_rgba(250,204,21,0.7)]',
      accent: '#f59e0b',
      label: 'Energized',
      bubbles: [
        { word: "Alive", description: "Filled with vibrant physical energy, safety, and core vitality.", left: 50, top: 50, size: 104 },
        { word: "Excited", description: "Charged with joyful and eager anticipation of good things.", left: 22, top: 22, size: 85 },
        { word: "Determined", description: "Feeling solid, resolved, and completely focused.", left: 34, top: 15, size: 85 },
        { word: "Inspired", description: "Filled with creative warmth and internal motivation.", left: 82, top: 22, size: 85 },
        { word: "Joyful", description: "Experiencing clear, radiant happiness in your soul.", left: 68, top: 38, size: 92 },
        { word: "Focused", description: "Attentive, centered, and physically aligned.", left: 22, top: 48, size: 90 },
        { word: "Delighted", description: "Filled with absolute pleasure and light satisfaction.", left: 48, top: 72, size: 94 },
        { word: "Amazed", description: "Awestruck, wonderfully surprised, and filled with wonder.", left: 68, top: 18, size: 85 },
        { word: "Confident", description: "Securely aligned with your personal capabilities.", left: 78, top: 52, size: 92 },
        { word: "Eager", description: "Keenly interested and enthusiastically ready.", left: 28, top: 33, size: 84 },
        { word: "Successful", description: "Savoring positive efforts and peaceful validation.", left: 50, top: 26, size: 90 },
        { word: "Playful", description: "Full of sparkling fun, humor, and easy laughter.", left: 24, top: 66, size: 88 },
        { word: "Upbeat", description: "Cheerful, optimistic, and anticipating beautiful moments.", left: 50, top: 38, size: 84 }
      ]
    },
    {
      id: 'high-down',
      title: 'High Energy • Feeling Down',
      description: 'Feeling tense, restless, anxious, or stressed. Charged with nervous energy.',
      emoji: '⚡',
      bg: 'from-rose-100 via-rose-50 to-orange-50 border-rose-200 text-rose-900',
      bubbleColor: 'bg-gradient-to-br from-red-400 via-rose-500 to-orange-500 text-white border-rose-300',
      selectedBubbleColor: 'bg-gradient-to-br from-rose-400 to-orange-600 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.7)]',
      accent: '#f43f5e',
      label: 'Restless',
      bubbles: [
        { word: "Overwhelmed", description: "Overloaded with complex thoughts, emotions, or responsibilities.", left: 50, top: 50, size: 104 },
        { word: "Anxious", description: "Apprehensive, uneasy, or experiencing core physical worry.", left: 22, top: 24, size: 90 },
        { word: "Frustrated", description: "Restless or blocked from being heard, loved, or understood.", left: 78, top: 28, size: 90 },
        { word: "Angry", description: "Surged with active displeasure, irritation, or resentment.", left: 50, top: 25, size: 90 },
        { word: "Restless", description: "Struggling to find physical calm or mental quiet.", left: 22, top: 48, size: 90 },
        { word: "Stressed", description: "Carrying elevated emotional pressure or tight tension.", left: 78, top: 52, size: 92 },
        { word: "Irritated", description: "Annoyed, easily vexed, and struggling with patience.", left: 50, top: 72, size: 92 },
        { word: "Panicked", description: "Feeling an immediate surge of tight, elevated alarm.", left: 22, top: 14, size: 82 },
        { word: "Defensive", description: "Guarding against perceived threats or critical comments.", left: 78, top: 14, size: 84 },
        { word: "Turbulent", description: "Experiencing conflicting, rolling, high feelings.", left: 24, top: 66, size: 86 },
        { word: "Jittery", description: "Highly alert, physically tense, or hyper-stimulated.", left: 50, top: 10, size: 80 }
      ]
    },
    {
      id: 'low-good',
      title: 'Low Energy • Feeling Good',
      description: 'Feeling calm, relaxed, peaceful, and satisfied. Enjoying quiet comfort.',
      emoji: '🍃',
      bg: 'from-emerald-100 via-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
      bubbleColor: 'bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-400 text-neutral-900 border-emerald-200',
      selectedBubbleColor: 'bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 font-black shadow-[0_0_20px_rgba(52,211,153,0.7)]',
      accent: '#10b981',
      label: 'Peaceful',
      bubbles: [
        { word: "Calm", description: "Aligned, serene, and entirely peaceful in body and heart.", left: 50, top: 50, size: 104 },
        { word: "At Ease", description: "Free from urgent worries or physical discomfort.", left: 22, top: 24, size: 90 },
        { word: "Understood", description: "Feeling recognized, supported, and emotionally seen.", left: 78, top: 28, size: 92 },
        { word: "Loved", description: "Encased in soft warmth, care, and secure connection.", left: 50, top: 25, size: 92 },
        { word: "Relaxed", description: "Experiencing quiet muscles and calm, drifting thoughts.", left: 22, top: 48, size: 90 },
        { word: "Chill", description: "Easygoing, unhurried, and pleasantly content.", left: 78, top: 52, size: 90 },
        { word: "Content", description: "Savoring what is here without needing extra items.", left: 50, top: 72, size: 92 },
        { word: "Grateful", description: "Warmly appreciating life's small advantages and blessings.", left: 22, top: 14, size: 84 },
        { word: "Peaceful", description: "Quiet, stable, and untroubled in your thoughts.", left: 78, top: 14, size: 85 },
        { word: "Safe", description: "Feeling completely sheltered, supported, and secure.", left: 24, top: 66, size: 86 },
        { word: "Serene", description: "Tranquil, clear, and enjoying emotional silence.", left: 50, top: 10, size: 80 }
      ]
    },
    {
      id: 'low-down',
      title: 'Low Energy • Feeling Down',
      description: 'Feeling heavy, tired, lonely, or drained. Seeking rest or comfort.',
      emoji: '🌧️',
      bg: 'from-slate-200 via-indigo-50/70 to-indigo-50 border-indigo-200 text-indigo-900',
      bubbleColor: 'bg-gradient-to-br from-slate-400 via-indigo-500 to-indigo-800 text-white border-indigo-400',
      selectedBubbleColor: 'bg-gradient-to-br from-indigo-400 to-indigo-950 text-white font-black shadow-[0_0_20px_rgba(99,102,241,0.73)]',
      accent: '#6366f1',
      label: 'Drained',
      bubbles: [
        { word: "Drained", description: "Completely depleted of emotional and adaptive energy.", left: 50, top: 50, size: 104 },
        { word: "Tired", description: "Feeling core physical or mental exhaustion.", left: 22, top: 24, size: 90 },
        { word: "Sad", description: "Sorrowful, soft, or mourning an expectation or event.", left: 78, top: 28, size: 90 },
        { word: "Lonely", description: "Craving gentle connection, warmth, or human presence.", left: 50, top: 25, size: 92 },
        { word: "Burned Out", description: "Chronically fatigued by extended effort or stress.", left: 22, top: 48, size: 92 },
        { word: "Disappointed", description: "Feeling let down by people, outcomes, or ourselves.", left: 78, top: 52, size: 90 },
        { word: "Numb", description: "Disconnected, listless, or emotionally flat query.", left: 50, top: 72, size: 92 },
        { word: "Heavy", description: "Weighed down by dense thoughts or grief in the heart.", left: 22, top: 14, size: 84 },
        { word: "Bored", description: "Struggling to find stimulation, focus, or interest.", left: 78, top: 14, size: 85 },
        { word: "Hopeless", description: "Struggling to see positive outcomes in the road ahead.", left: 24, top: 66, size: 86 },
        { word: "Left Out", description: "Feeling excluded, forgotten, or quietly isolated.", left: 50, top: 10, size: 80 }
      ]
    }
  ]
};

// ---------------------------------------------
// 2. SENSATIONS INTERACTIVE REGISTRY
// ---------------------------------------------
export const SENSATIONS_CONFIG: BoxInteractiveConfig = {
  id: 'sensation',
  title: "Somatic Mapping",
  subtitle: "Choose your primary physiological region then map body sensations",
  emoji: "💓",
  themeColor: "indigo",
  quadrants: [
    {
      id: 'chest-breath',
      title: 'Chest & Respiration',
      description: 'Sensations around breathing patterns, heart rhythm, and bronchial expansion.',
      emoji: '🫁',
      bg: 'from-orange-100 via-orange-50 to-red-50 border-orange-200 text-orange-950',
      bubbleColor: 'bg-gradient-to-br from-orange-300 via-red-400 to-rose-400 text-white border-orange-200',
      selectedBubbleColor: 'bg-gradient-to-br from-orange-400 to-rose-600 text-white font-black shadow-[0_0_20px_rgba(249,115,22,0.7)]',
      accent: '#f97316',
      label: 'Respiration',
      bubbles: [
        { word: "Tight Chest", description: "An interactive constriction feeling in the ribs or upper lungs.", left: 50, top: 50, size: 104 },
        { word: "Shallow Breaths", description: "Rapid, half-breaths restricted into the upper throat.", left: 22, top: 22, size: 90 },
        { word: "Racing Heart", description: "Elevated, intense, or highly rapid palpitations in the sternum.", left: 78, top: 24, size: 94 },
        { word: "Easy Lungs", description: "Smooth, quiet, high-capacity, and unbothered diaphragmatic loops.", left: 50, top: 20, size: 92 },
        { word: "Fluttering", description: "A light, rapid, nervous vibrating sensation below the collarbone.", left: 22, top: 50, size: 86 },
        { word: "Warm Center", description: "Spreading comfort, safety, and physical warmth in the thymus.", left: 78, top: 52, size: 92 },
        { word: "Quiet Heart", description: "Extremely steady, slow, calming pacemaker rate.", left: 48, top: 76, size: 90 },
        { word: "Catch in Throat", description: "A tight feeling where swallowing becomes a conscious, heavy effort.", left: 22, top: 70, size: 86 }
      ]
    },
    {
      id: 'head-tension',
      title: 'Head, Neck & Jaw',
      description: 'Neuromuscular activation, temples, jaws, and facial expressions.',
      emoji: '🧠',
      bg: 'from-purple-100 via-purple-50 to-indigo-55 border-purple-200 text-purple-950',
      bubbleColor: 'bg-gradient-to-br from-purple-300 via-violet-400 to-indigo-400 text-white border-purple-200',
      selectedBubbleColor: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.7)]',
      accent: '#a855f7',
      label: 'Head & Neck',
      bubbles: [
        { word: "Clenched Jaw", description: "Unconscious pressure locked into the teeth, masseter, or neck.", left: 50, top: 50, size: 104 },
        { word: "Heavy Head", description: "A dull, loaded pressure feeling centered behind the eyebrows or crown.", left: 22, top: 24, size: 90 },
        { word: "Tight Neck", description: "Heavy tightness radiating down the Trapezius and upper cervical spine.", left: 78, top: 28, size: 92 },
        { word: "Clear Vista", description: "Light eyes, visual sharpness, and general tension release in the brow.", left: 50, top: 22, size: 92 },
        { word: "Dizzy State", description: "Lightheadedness or a floating, disconnected sensory perception.", left: 22, top: 50, size: 88 },
        { word: "Brow Furrow", description: "Continuous muscle activation around the middle forehead.", left: 78, top: 54, size: 90 },
        { word: "Easy Temples", description: "A cooling release of blood pressure and nervous energy in the face.", left: 50, top: 74, size: 92 },
        { word: "Teeth Grinding", description: "Continuous micro-tension causing subtle fatigue in the cheekbones.", left: 24, top: 70, size: 85 }
      ]
    },
    {
      id: 'core-belly',
      title: 'Core & Abdomen',
      description: 'Gastrointestinal focus, digestion sensations, and autonomic responses.',
      emoji: '🤰',
      bg: 'from-yellow-100 via-yellow-50 to-amber-50 border-yellow-200 text-yellow-950',
      bubbleColor: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-550 text-slate-900 border-yellow-200',
      selectedBubbleColor: 'bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-900 font-black shadow-[0_0_20px_rgba(234,179,8,0.7)]',
      accent: '#eab308',
      label: 'Core / Belly',
      bubbles: [
        { word: "Butterflies", description: "A highly rapid, fluttering sensory feedback in the upper stomach.", left: 50, top: 50, size: 104 },
        { word: "Knot in Stomach", description: "A dense, hard, tightly clenched ball of unresolved stress in the gut.", left: 22, top: 22, size: 90 },
        { word: "Warm Solar", description: "A pleasant, nourishing, grounded feeling of digestion and safety.", left: 78, top: 24, size: 92 },
        { word: "Nervous Flutter", description: "A delicate, intermittent wave of anticipation centered in the belly.", left: 50, top: 20, size: 88 },
        { word: "Nausea Wave", description: "Slight somatic rejection or highly sensitive physical distress.", left: 22, top: 50, size: 90 },
        { word: "Grounded Core", description: "A heavy, supportive feeling of gravity holding you steady from the midsection.", left: 78, top: 52, size: 92 },
        { word: "Empty & Light", description: "Pleasantly unburdened, responsive, and comfortable gastrically.", left: 48, top: 74, size: 90 },
        { word: "Clenched Gut", description: "Persistent tensing of the abdominal wall during times of alert.", left: 24, top: 68, size: 84 }
      ]
    },
    {
      id: 'limbs-somatic',
      title: 'Limbs & Extremities',
      description: 'Physical motor tone, blood flow, skin, and muscular energy level.',
      emoji: '🦵',
      bg: 'from-teal-100 via-teal-50 to-emerald-50 border-teal-200 text-teal-950',
      bubbleColor: 'bg-gradient-to-br from-teal-300 via-emerald-400 to-teal-500 text-slate-900 border-teal-200',
      selectedBubbleColor: 'bg-gradient-to-br from-teal-300 to-emerald-500 text-slate-950 font-black shadow-[0_0_20px_rgba(20,184,166,0.7)]',
      accent: '#14b8a6',
      label: 'Limbs & Skin',
      bubbles: [
        { word: "Heavy Limbs", description: "Feeling weighed down, fatigued, and physically slow to move.", left: 50, top: 50, size: 104 },
        { word: "Relaxed Arms", description: "Limber, quiet muscles with no background stress or urge to run.", left: 22, top: 24, size: 90 },
        { word: "Tingling Skin", description: "Hypersensitive, electric, or buzzing skin receptors.", left: 78, top: 28, size: 92 },
        { word: "Cold Hands", description: "Blood flow withdrawing from extremities during sympathetic activation.", left: 50, top: 22, size: 90 },
        { word: "Fidgety Legs", description: "A strong somatic urge to move, shake, or wander physically.", left: 22, top: 50, size: 88 },
        { word: "Sweaty Palms", description: "Moist skin signaling moderate arousal or excitement.", left: 78, top: 52, size: 90 },
        { word: "Warm Hands", description: "Comfortable vascular circulation indicating parasympathetic safety.", left: 50, top: 74, size: 92 },
        { word: "Jumpy Muscles", description: "Sudden micro-twitches or minor tension releases in the calves or shoulders.", left: 24, top: 70, size: 84 }
      ]
    }
  ]
};

// ---------------------------------------------
// 3. BEHAVIORS INTERACTIVE REGISTRY
// ---------------------------------------------
export const BEHAVIORS_CONFIG: BoxInteractiveConfig = {
  id: 'behaviors',
  title: "Behavioral Alignment",
  subtitle: "Choose your primary category and map habits completed today",
  emoji: "🏃",
  themeColor: "emerald",
  quadrants: [
    {
      id: 'physical-care',
      title: 'Physical Vitality',
      description: 'Habits for direct cellular hydration, high nutrition, and cellular energy.',
      emoji: '🥦',
      bg: 'from-[#eefcf4] via-[#f7fdfa] to-[#f0fff4] border-emerald-150 text-emerald-950',
      bubbleColor: 'bg-gradient-to-br from-emerald-300 via-green-400 to-emerald-500 text-slate-900 border-emerald-150',
      selectedBubbleColor: 'bg-gradient-to-br from-emerald-400 to-green-600 text-white font-black shadow-[0_0_20px_rgba(16,185,129,0.7)]',
      accent: '#10b981',
      label: 'Vitality',
      bubbles: [
        { word: "Rested Well", description: "Obtained a deep, structured, non-fragmented night of deep sleep.", left: 50, top: 50, size: 104 },
        { word: "Hydrated", description: "Consistently refilled pure water levels to lower brain fatigue.", left: 22, top: 22, size: 90 },
        { word: "Healthy Eating", description: "Consumed nutrient-dense, high-buffer whole foods with kindness.", left: 78, top: 24, size: 92 },
        { word: "Stretched", description: "Stretched major muscle fibers to trigger safe somatic release.", left: 50, top: 22, size: 88 },
        { word: "Medication", description: "Sustained clinical adherence to health and vitamin plans.", left: 22, top: 50, size: 86 },
        { word: "Deep Shower", description: "Utilized physical heat on skin to lower nervous systems adrenaline.", left: 78, top: 52, size: 92 },
        { word: "Clean Space", description: "Refreshed primary visual zones to secure immediate peace.", left: 50, top: 74, size: 90 },
        { word: "Hygiene", description: "Honored basic physical maintenance as a self-validation baseline.", left: 24, top: 68, size: 84 }
      ]
    },
    {
      id: 'mind-connection',
      title: 'Connection & Mind',
      description: 'Interactive routines honoring social context and focus restoration.',
      emoji: '👥',
      bg: 'from-sky-100 via-sky-50 to-indigo-50 border-sky-200 text-sky-950',
      bubbleColor: 'bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-400 text-slate-900 border-sky-150',
      selectedBubbleColor: 'bg-gradient-to-br from-sky-400 to-indigo-600 text-white font-black shadow-[0_0_20px_rgba(56,189,248,0.7)]',
      accent: '#0284c7',
      label: 'Connection',
      bubbles: [
        { word: "Outdoor Walk", description: "Allowed linear optical flow outdoors to calm panic circuitry.", left: 50, top: 50, size: 104 },
        { word: "Socialized", description: "Connected safely, felt supported, and triggered mirror neurals.", left: 22, top: 22, size: 90 },
        { word: "Unplugged", description: "Paused dopaminergic feeds and took back cognitive focus.", left: 78, top: 24, size: 92 },
        { word: "Read Book", description: "Engaged in slow-form written cognitive processing.", left: 50, top: 20, size: 90 },
        { word: "Deep Laugh", description: "Naturally unlocked muscles by expressing joyful sound.", left: 22, top: 50, size: 88 },
        { word: "Shared Feelings", description: "Spoke transparently with someone who values security.", left: 78, top: 52, size: 92 },
        { word: "Mindful Pause", description: "Stopped working for 5 minutes, allowing thoughts to drift safely.", left: 48, top: 75, size: 90 },
        { word: "Heard Someone", description: "Lowered your ego and fully focused on validating another.", left: 24, top: 68, size: 84 }
      ]
    },
    {
      id: 'grounding-tasks',
      title: 'Grounding Tasks',
      description: 'Habits establishing borders, agency, and physical accomplishments.',
      emoji: '🎯',
      bg: 'from-indigo-100 via-indigo-50 to-violet-50 border-indigo-200 text-indigo-950',
      bubbleColor: 'bg-gradient-to-br from-indigo-300 via-violet-400 to-purple-400 text-white border-indigo-200',
      selectedBubbleColor: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black shadow-[0_0_20px_rgba(99,102,241,0.7)]',
      accent: '#6366f1',
      label: 'Grounding',
      bubbles: [
        { word: "Set Boundaries", description: "Expressed a firm, kind, and supportive boundary.", left: 50, top: 50, size: 104 },
        { word: "Took Breaks", description: "Paused before fatigue signals triggered cognitive blocks.", left: 22, top: 24, size: 90 },
        { word: "Organized Desk", description: "Rearranged workspace to clarify active focus fields.", left: 78, top: 28, size: 90 },
        { word: "List Completed", description: "Offloaded memory into simple, physical check marks.", left: 50, top: 20, size: 90 },
        { word: "Set Intentions", description: "Decided in advance how to apply emotional energy.", left: 22, top: 50, size: 88 },
        { word: "Solved Issue", description: "Enacted a micro-solution without waiting for perfection.", left: 78, top: 52, size: 92 },
        { word: "Focused Study", description: "Sustained visual attention on a single priority task.", left: 48, top: 74, size: 90 },
        { word: "Spoke Up", description: "Asked for what was needed clearly and directly.", left: 24, top: 68, size: 84 }
      ]
    },
    {
      id: 'somatic-calm',
      title: 'Nervous-System Rest',
      description: 'Repetitive active somatic methods designed to discharge stress.',
      emoji: '🧘',
      bg: 'from-rose-100 via-rose-50 to-amber-50 border-rose-200 text-rose-950',
      bubbleColor: 'bg-gradient-to-br from-rose-300 via-amber-300 to-orange-400 text-slate-950 border-rose-200',
      selectedBubbleColor: 'bg-gradient-to-br from-rose-400 to-orange-500 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.7)]',
      accent: '#f43f5e',
      label: 'Somatic Rest',
      bubbles: [
        { word: "Somatic Shaking", description: "Shook out the joints to physically discharge cortisol buildup.", left: 50, top: 50, size: 104 },
        { word: "Breathing Loops", description: "Completed physiological sighs to clear state immediately.", left: 22, top: 22, size: 90 },
        { word: "Weighted Calm", description: "Utilized physical weight to pacify skin mechanoreceptors.", left: 78, top: 24, size: 92 },
        { word: "Gentle Songs", description: "Listened to low-tempo audio to shift down vagal speed.", left: 50, top: 20, size: 88 },
        { word: "Rested Eyes", description: "Completed dark-adaptation pauses to cool retinal input.", left: 22, top: 50, size: 90 },
        { word: "Safe Space", description: "Visualized a completely calm, uncritical retreat.", left: 78, top: 52, size: 92 },
        { word: "Aroma Therapy", description: "Leveraged olfactories to bypass thinking tracks.", left: 48, top: 74, size: 90 },
        { word: "Warm Bath", description: "Submerged in warm water to expand skin vascular beds.", left: 24, top: 68, size: 84 }
      ]
    }
  ]
};

// ---------------------------------------------
// 4. THOUGHTS INTERACTIVE REGISTRY
// ---------------------------------------------
export const THOUGHTS_CONFIG: BoxInteractiveConfig = {
  id: 'thoughts',
  title: "Cognitive Focus",
  subtitle: "Choose your primary mindset category then verify repeating thoughts",
  emoji: "💭",
  themeColor: "teal",
  quadrants: [
    {
      id: 'kind-clarity',
      title: 'Clarifying & Kind',
      description: 'Supportive, realistic, and highly adaptive cognitive frameworks.',
      emoji: '🌱',
      bg: 'from-[#f0fbf7] via-emerald-50/20 to-[#f0fff4] border-emerald-150 text-emerald-950',
      bubbleColor: 'bg-gradient-to-br from-emerald-300 via-teal-300 to-emerald-400 text-slate-900 border-emerald-150',
      selectedBubbleColor: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-black shadow-[0_0_20px_rgba(16,185,129,0.7)]',
      accent: '#10b981',
      label: 'Empathetic',
      bubbles: [
        { word: "This Is Temporary", description: "Remembering that feelings and hurdles always shift and flow.", left: 50, top: 50, size: 104 },
        { word: "Doing My Best", description: "Self-forgiveness of perfect outcomes given basic human scale.", left: 22, top: 22, size: 90 },
        { word: "Safe to Rest", description: "Acknowledging that resting is a boundary, never lazy or slacking.", left: 78, top: 24, size: 92 },
        { word: "One Step Today", description: "Restricting expectations into simple, small units of progress.", left: 50, top: 20, size: 90 },
        { word: "Safe To Learn", description: "Accepting mistakes as structural feedback, not proof of shame.", left: 22, top: 50, size: 88 },
        { word: "Moving Gently", description: "Lowering inner frantic pacing to maintain safe motor calm.", left: 78, top: 52, size: 92 },
        { word: "I Am Enough", description: "Inherent worth as a living, loving person, separate from output.", left: 48, top: 75, size: 90 },
        { word: "Can Be Handled", description: "Trusting internal resources to puzzle out complex realities.", left: 24, top: 68, size: 84 }
      ]
    },
    {
      id: 'future-anticipation',
      title: 'Future & Urgent',
      description: 'Cognitive anticipation loops, planners, list stress, and alert cycles.',
      emoji: '🔮',
      bg: 'from-amber-100 via-amber-50 to-rose-50/50 border-amber-200 text-amber-950',
      bubbleColor: 'bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 text-slate-900 border-amber-200',
      selectedBubbleColor: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white font-black shadow-[0_0_20px_rgba(245,158,11,0.7)]',
      accent: '#f59e0b',
      label: 'Anticipation',
      bubbles: [
        { word: "What If It Fails", description: "Recurring simulation of safety breakdowns or worst scenarios.", left: 50, top: 50, size: 104 },
        { word: "Too Much To Do", description: "Experiencing list paralysis and panic around small deadlines.", left: 22, top: 22, size: 90 },
        { word: "Will I Catch Up", description: "Continuous backward references comparing tracking speed.", left: 78, top: 24, size: 92 },
        { word: "Running Out Time", description: "Somatic rush and emergency feelings centered around clocks.", left: 50, top: 20, size: 88 },
        { word: "Seeking Control", description: "Urge to force variables to lock down immediately for relief.", left: 22, top: 50, size: 90 },
        { word: "Always Busy", description: "Feeling like stopping active work will invite bad outcomes.", left: 78, top: 52, size: 92 },
        { word: "Seeking Answers", description: "Looping research questions trying to solve tomorrow today.", left: 48, top: 74, size: 90 },
        { word: "Fear Of Failing", description: "Somatic stress on high standards to avoid perceived criticism.", left: 24, top: 68, size: 84 }
      ]
    },
    {
      id: 'critical-judge',
      title: 'Self-Critical & Doubt',
      description: 'Persistent thoughts comparing milestones, paces, or capabilities.',
      emoji: '⚖️',
      bg: 'from-rose-100 via-rose-50 to-purple-50 border-rose-200 text-rose-950',
      bubbleColor: 'bg-gradient-to-br from-rose-300 via-rose-400 to-purple-400 text-white border-rose-200',
      selectedBubbleColor: 'bg-gradient-to-br from-rose-500 to-purple-600 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.7)]',
      accent: '#f43f5e',
      label: 'Evaluation',
      bubbles: [
        { word: "Falling Behind", description: "Belief that others are comfortably progressing while you sit stuck.", left: 50, top: 50, size: 104 },
        { word: "Should Do More", description: "Persistent background demands telling you your output is too low.", left: 22, top: 24, size: 90 },
        { word: "Why Is This Hard", description: "Feeling like normal life shouldn't require this level of recovery.", left: 78, top: 28, size: 92 },
        { word: "Not Good Enough", description: "Deep visual critique that your best efforts are inherently lacking.", left: 50, top: 20, size: 90 },
        { word: "Why Am I Drained", description: "Frustrated scanning of energy level with impatience and anger.", left: 22, top: 50, size: 88 },
        { word: "Always Resetting", description: "Feeling annoyed that you must consistently do mindfulness check-ins.", left: 78, top: 52, size: 92 },
        { word: "Overcomposing", description: "Tiring analytical patterns breaking down simple choices into math.", left: 48, top: 74, size: 90 },
        { word: "Compare Output", description: "Comparing raw statistics with peers or imaginary high targets.", left: 24, top: 68, size: 84 }
      ]
    },
    {
      id: 'grounded-silence',
      title: 'Grounded & Present',
      description: 'Cognitive patterns limiting speech noise and returning to physical boundaries.',
      emoji: '🧘‍♂️',
      bg: 'from-slate-200 via-slate-50 to-zinc-50 border-slate-300 text-slate-900',
      bubbleColor: 'bg-gradient-to-br from-slate-400 via-slate-500 to-zinc-650 text-white border-slate-400',
      selectedBubbleColor: 'bg-gradient-to-br from-slate-650 to-slate-950 text-white font-black shadow-[0_0_20px_rgba(71,85,105,0.7)]',
      accent: '#475569',
      label: 'Presence',
      bubbles: [
        { word: "Breathing Now", description: "Focusing attention purely onto the cool air entering the nasal tip.", left: 50, top: 50, size: 104 },
        { word: "Silence Is Safe", description: "Reassuring yourself that you do not need active internal chatter.", left: 22, top: 22, size: 90 },
        { word: "Focusing Now", description: "Aware of the tactile interface in front of you.", left: 78, top: 24, size: 92 },
        { word: "Core Is Present", description: "Locating your presence inside muscles instead of thoughts.", left: 50, top: 20, size: 88 },
        { word: "Earth Is Solid", description: "Acknowledging actual gravitational support beneath your feet.", left: 22, top: 50, size: 90 },
        { word: "Tasks Can Wait", description: "Willingly putting down uncompleted lists to find calm.", left: 78, top: 52, size: 92 },
        { word: "No Need To Rush", description: "Deciding to proceed at natural physical speeds.", left: 48, top: 74, size: 90 },
        { word: "Quiet Inside", description: "An interactive mental blank slate free of immediate critical judgments.", left: 24, top: 68, size: 84 }
      ]
    }
  ]
};

export const CHECKIN_CONFIGS = {
  emotions: EMOTIONS_CONFIG,
  sensation: SENSATIONS_CONFIG,
  behaviors: BEHAVIORS_CONFIG,
  thoughts: THOUGHTS_CONFIG
};
