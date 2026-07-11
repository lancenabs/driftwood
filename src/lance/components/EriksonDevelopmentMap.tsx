import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Award, ShieldAlert, CheckCircle, ArrowRight, Heart, Users, Sparkles, BookOpen, 
  HelpCircle, ChevronRight, Bookmark, Calendar, RotateCcw, AlertCircle, BookmarkCheck, Star,
  GitBranch, Brain, HeartHandshake, Activity, Zap, RefreshCw, UserCheck
} from 'lucide-react';

interface EriksonStage {
  number: number;
  name: string;
  crisis: string;
  years: string;
  existentialQuestion: string;
  virtue: string;
  color: string;
  textColor: string;
  bgGrad: string;
  description: string;
  stagnationLabel: string;
  stagnationDesc: string;
  growthReflections: string[];
  behavioralExercises: {
    title: string;
    description: string;
    strategy: string;
    operantType: 'Positive Reinforcement' | 'Negative Reinforcement' | 'Response Friction';
    expectedOutcome: string;
  }[];
}

const ERIKSON_STAGES: EriksonStage[] = [
  {
    number: 1,
    name: "Trust vs. Mistrust",
    crisis: "Infancy",
    years: "0 – 1.5 yrs",
    existentialQuestion: "Can I trust the world around me?",
    virtue: "Hope",
    color: "from-sky-500 to-indigo-500",
    textColor: "text-sky-600",
    bgGrad: "bg-sky-50/70 border-sky-100",
    description: "The foundation of entire personality structure. Safe dependence on primary environment allows children to form healthy attachments and secure relationships.",
    stagnationLabel: "Chronic Mistrust & Insecurity",
    stagnationDesc: "Failure results in generalized paranoia, existential dread, deep relational withdrawal, hyper-vigilance, and an inability to seek or accept support in adulthood.",
    growthReflections: [
      "How safe does it feel to let down your guard and rely on another person's care?",
      "In what areas of your adult life do you suspect others have hidden motives?",
      "Practice declaring an emotional vulnerability to a close friend without defending or over-explaining."
    ],
    behavioralExercises: [
      {
        title: "Vulnerable Request Practice",
        description: "Practice vocalizing a direct, simple request for emotional warmth or help to a trusted peer.",
        strategy: "Positive Reinforcement: Treat yourself to a warm tea and 10 minutes of uninterrupted rest immediately after showing vulnerability.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Repatterns deep survival-based mistrust by validating that the social environment is responsive to support queries."
      },
      {
        title: "Hyper-vigilance De-escalation",
        description: "When sensing sudden relational panic, consciously slow exhalations to double the length of your inhalations.",
        strategy: "Negative Reinforcement: Escape the biochemical flood of autonomic cortisol and physical muscle clenching.",
        operantType: "Negative Reinforcement",
        expectedOutcome: "Calms subcortical warning signals, wiring a secure internal center of biological safety."
      }
    ]
  },
  {
    number: 2,
    name: "Autonomy vs. Shame & Doubt",
    crisis: "Early Childhood",
    years: "1.5 – 3 yrs",
    existentialQuestion: "Is it okay to be independent?",
    virtue: "Will",
    color: "from-indigo-500 to-purple-500",
    textColor: "text-indigo-600",
    bgGrad: "bg-indigo-50/70 border-indigo-100",
    description: "Developing robust neuro-muscular control, independent motor skills, and self-assertion. Encouragement fosters agency; severe criticism breeds deep internal self-reproach.",
    stagnationLabel: "Paralyzing Self-Doubt",
    stagnationDesc: "Failure breeds compulsive self-reproach, absolute terror of being seen as incompetent, vulnerability avoidance, and obsessive low self-esteem.",
    growthReflections: [
      "Do you feel intense guilt or shame when defining healthy personal boundaries?",
      "How often do you defer your own genuine preferences just to keep external social peace?",
      "Recall a time you felt structurally inadequate. Was that voice truly yours or an inherited critic?"
    ],
    behavioralExercises: [
      {
        title: "The Boundaries Log",
        description: "Practice saying a clean, professional 'No' to at least one unaligned minor demand today.",
        strategy: "Positive Reinforcement: Log this choice in your journal, marking a golden star for Will representation.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Dismantles automatic people-pleasing and builds self-directed agency."
      },
      {
        title: "Extinguishing Internal Criticism",
        description: "When a failure occurs, immediately replace self-reproach phrases with: 'I am learning to possess personal will.'",
        strategy: "Negative Reinforcement: Instantly mutes cognitive distortions and lowers emotional friction.",
        operantType: "Negative Reinforcement",
        expectedOutcome: "Interrupts persistent shame loops before they crystallize inside prefrontal networks."
      }
    ]
  },
  {
    number: 3,
    name: "Initiative vs. Guilt",
    crisis: "Preschool",
    years: "3 – 5 yrs",
    existentialQuestion: "Is it okay for me to act, move, and plan?",
    virtue: "Purpose",
    color: "from-purple-500 to-pink-500",
    textColor: "text-purple-600",
    bgGrad: "bg-purple-50/70 border-purple-100",
    description: "Asserting active power and creative leadership through imaginative play, direct creation, and social trials. Over-direction by authority figures installs paralyzing moral perfectionism.",
    stagnationLabel: "Inhibiting Social Guilt",
    stagnationDesc: "Overwhelming guilt, fear of taking creative risks, passive reliance on others, and severe moral perfectionism that halts action.",
    growthReflections: [
      "Do you feel like an imposter when initiating a new project or creative task?",
      "In what ways does a fear of making an error prevent you from stepping into leadership?",
      "How can you re-invite unstructured play and exploratory creation back into your week?"
    ],
    behavioralExercises: [
      {
        title: "Imaginative Micro-Project",
        description: "Spend 20 minutes sketching, drafting, or playing completely free of judgment or monetization intent.",
        strategy: "Positive Reinforcement: Reward yourself with a relaxing bath or listening to your favorite ambient list.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Unlocks subcortical child play pathways, overriding systemic adult perfectionism."
      },
      {
        title: "The Friction Buffer",
        description: "When planning a new project, commit to taking one immediate imperfect progress action within 5 minutes.",
        strategy: "Response Friction: Lowers the psychological start-up barrier by accepting minor operational typos.",
        operantType: "Response Friction",
        expectedOutcome: "Bypasses decision paralysis by converting high conceptual stakes into low-friction physical action."
      }
    ]
  },
  {
    number: 4,
    name: "Industry vs. Inferiority",
    crisis: "School Age",
    years: "5 – 12 yrs",
    existentialQuestion: "Can I make it in the world of skills?",
    virtue: "Competence",
    color: "from-pink-500 to-rose-500",
    textColor: "text-pink-600",
    bgGrad: "bg-pink-50/70 border-pink-100",
    description: "Sustaining structured efforts to master physical, social, and technical challenges. Building pride, dedication, and systematic competence.",
    stagnationLabel: "Inadequacy & Giving Up",
    stagnationDesc: "Failing to build positive peer relationships or skills leads to assuming oneself as fundamentally inferior, leading to giving up early.",
    growthReflections: [
      "In what areas do you prematurely abandon mastery because you feel others are naturally superior?",
      "How do your childhood school experiences still affect your current professional work ethic?",
      "Separate your sense of human value from your raw productivity and skill accolades."
    ],
    behavioralExercises: [
      {
        title: "The Skill Stacking Ritual",
        description: "Choose a target skill (coding, piano, cooking) and practice for 15 minutes without looking at the outcome.",
        strategy: "Positive Reinforcement: Log a completion mark on a calendar to visualize consistent, persistent efforts.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Demonstrates that incremental industry builds functional neurological mastery over time."
      },
      {
        title: "Curbing Task Avoidance",
        description: "When a difficult skill task causes anxiety, work for precisely 8 minutes, then permit a temporary step-away.",
        strategy: "Negative Reinforcement: Escape the cognitive pressure while ensuring 8 minutes of high-value focus.",
        operantType: "Negative Reinforcement",
        expectedOutcome: "Re-wires task avoidance behavior by showing that task friction declines after the initial few minutes."
      }
    ]
  },
  {
    number: 5,
    name: "Identity vs. Role Confusion",
    years: "12 – 18 yrs",
    crisis: "Adolescence",
    existentialQuestion: "Who am I and what can I be?",
    virtue: "Fidelity",
    color: "from-rose-500 to-amber-500",
    textColor: "text-rose-600",
    bgGrad: "bg-rose-50/70 border-rose-100",
    description: "Synthesizing individual beliefs, relational values, boundaries, and vocational ambitions into a coherent ideological sense of Self.",
    stagnationLabel: "Fragmented Role Confusion",
    stagnationDesc: "Crystallizes into peer chameleons who constantly change personalities, drift aimlessly without values, and struggle to form distinct boundaries.",
    growthReflections: [
      "Are you wearing a persona or mask right now to guarantee other people's approval?",
      "What are the three core, unshakeable values that you would fight to defend?",
      "How do you distinguish between what you truly want and what family or society wanted for you?"
    ],
    behavioralExercises: [
      {
        title: "The Core Values Declaration",
        description: "Write down your 3 non-negotiable personal boundaries and place them where you can read them daily.",
        strategy: "Positive Reinforcement: Give yourself permission to say 'My values are aligned' once a day.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Strengthens identity cohesion, building ideological fidelity over social people-pleasing."
      },
      {
        title: "Social Mask Removal",
        description: "During a conversation, consciously catch herself before nodding or agreeing with a claim you disagree with.",
        strategy: "Response Friction: Pausing before nodding, choosing neutral silence or polite assertion.",
        operantType: "Response Friction",
        expectedOutcome: "Breaks automatic fawning/chameleonic alignment, protecting selfhood boundaries."
      }
    ]
  },
  {
    number: 6,
    name: "Intimacy vs. Isolation",
    crisis: "Young Adulthood",
    years: "18 – 40 yrs",
    existentialQuestion: "Can I love and be loved deeply?",
    virtue: "Love",
    color: "from-amber-500 to-emerald-500",
    textColor: "text-amber-600",
    bgGrad: "bg-amber-50/70 border-amber-100",
    description: "Developing capacity for deep, vulnerable interpersonal sharing and physical/emotional commitment without losing one's own identity.",
    stagnationLabel: "Defensive Self-Reliance & Loneliness",
    stagnationDesc: "Fear of rejection leads to absolute relational isolation, shallow physical connection, emotional coldness, and walling off the heart.",
    growthReflections: [
      "In what ways are you holding partners or close friends at an emotional distance to stay safe?",
      "Do you worry that deep intimacy will require you to lose your own autonomy?",
      "Can you accept another person's care and warmth without immediately feeling indebted?"
    ],
    behavioralExercises: [
      {
        title: "Intimacy Vulnerability Disclosure",
        description: "Share one current, non-shaming fear, doubt, or rest need with a close companion or partner.",
        strategy: "Positive Reinforcement: Plan a pleasant shared meal or peaceful activity immediately following the talk.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Unlocks relational co-regulation and trains the brain that self-disclosure breeds deeper safety."
      },
      {
        title: "Distancing Trigger Override",
        description: "When feeling an urge to pull away or isolate, schedule a brief check-in instead of ghosting.",
        strategy: "Negative Reinforcement: Escape the claustrophobic anxiety of loneliness by establishing controlled relational boundaries.",
        operantType: "Negative Reinforcement",
        expectedOutcome: "Re-patterns defensive self-reliance into high-functioning secure attachment behavior."
      }
    ]
  },
  {
    number: 7,
    name: "Generativity vs. Stagnation",
    crisis: "Adulthood",
    years: "40 – 65 yrs",
    existentialQuestion: "Can I make my life efforts count?",
    virtue: "Care",
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-600",
    bgGrad: "bg-emerald-50/70 border-emerald-100",
    description: "Focusing on nurturing the next generation, mentoring, contributing to lasting societal progress, and creating meaningful legacy work.",
    stagnationLabel: "Self-Absorption & Stagnancy",
    stagnationDesc: "Results in mid-life stagnation, extreme self-absorption, sterile routines, and a general feeling of uselessness to society.",
    growthReflections: [
      "What skills or life hard-won wisdom can you proactively share with younger seekers?",
      "How does your daily labor serve a purpose beyond self-enrichment?",
      "In what ways have you allowed yourself to fall into self-limiting comfort zones?"
    ],
    behavioralExercises: [
      {
        title: "The Legacy Mentorship Hour",
        description: "Dedicate 30 minutes to support, guide, or write down a guide for a junior peer starting behind you.",
        strategy: "Positive Reinforcement: Savor the deep sense of prosocial connection and log a legacy point.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Triggers generativity neural dopamine rewards, breaking the loop of mid-life stagnation."
      },
      {
        title: "Eradicating Sterile Routines",
        description: "Consciously replace one passive consume habit with a generative act (e.g., planting a sprout, mentoring, writing guidance).",
        strategy: "Response Friction: Increasing physical steps to access entertainment apps during generative hours.",
        operantType: "Response Friction",
        expectedOutcome: "Sustains neural vigor by directing biological prefrontal energy outward toward the collective."
      }
    ]
  },
  {
    number: 8,
    name: "Ego Integrity vs. Despair",
    crisis: "Late Adulthood",
    years: "65+ yrs",
    existentialQuestion: "Is it okay to have been me?",
    virtue: "Wisdom",
    color: "from-teal-500 to-sky-600",
    textColor: "text-teal-600",
    bgGrad: "bg-teal-50/70 border-teal-100",
    description: "Reflecting on life’s full arc with acceptance, integrating triumphs along with heavy physical or interpersonal losses without resentment.",
    stagnationLabel: "Severe Despair & Regret",
    stagnationDesc: "Bitter regrets about incomplete lifework, profound terror of mortality, and intense resentment for missed possibilities.",
    growthReflections: [
      "What life choices or losses are you still struggle to forgive yourself for?",
      "Can you view your mistakes as pivotal developmental prerequisites for your current wisdom?",
      "How would you summarize the overriding story of your life if it was a beautiful clinical text?"
    ],
    behavioralExercises: [
      {
        title: "The Panorama Lifework Review",
        description: "Write down a list of 3 major challenges you survived, focusing on the wisdom virtue gained in each.",
        strategy: "Positive Reinforcement: Place this lifework outline in your workspace and review it during self-reflection.",
        operantType: "Positive Reinforcement",
        expectedOutcome: "Consolidates memory networks from regret into integrated, humble selfhood completion."
      },
      {
        title: "Existential Compassion Sweep",
        description: "When thoughts of old regrets arise, place a warm hand on your heart and breathe out compassion.",
        strategy: "Negative Reinforcement: Safely disperses bodily adrenaline and deep muscular tension.",
        operantType: "Negative Reinforcement",
        expectedOutcome: "Dismantles automatic catastrophic despair loops by establishing immediate somatic safety."
      }
    ]
  }
];

export interface ReparentingNode {
  title: string;
  subtitle: string;
  description: string;
  insight: string;
  somaticExercise: string;
  affirmation: string;
}

export interface StageReparenting {
  shadowBranch: {
    somaticShock: ReparentingNode;
    adaptiveCoping: ReparentingNode;
    shadowIntegration: ReparentingNode;
  };
  growthBranch: {
    innerChildHealing: ReparentingNode;
    nurturingParent: ReparentingNode;
    virtueIntegration: ReparentingNode;
  };
}

export const STAGE_REPARENTING_DATA: Record<number, StageReparenting> = {
  1: {
    shadowBranch: {
      somaticShock: {
        title: "Hyper-vigilant Guarding",
        subtitle: "How it lives in the body",
        description: "Autonomic system stuck in sympathetic defense. Sinks breathing into throat, clenches jaw, and registers all close social presence as potential hazards.",
        insight: "Your body is trying to protect you from an empty environment of the past.",
        somaticExercise: "Inhale slowly for 4 seconds, block throat for 2 seconds, then exhale for 8 seconds with a soft 'haa' sound to trigger vagus nerve release.",
        affirmation: "My body is permitted to let go. Deep breathing is safe in this space."
      },
      adaptiveCoping: {
        title: "Hyper-Independence Shield",
        subtitle: "The protective habit",
        description: "Rigid hyper-independence where you claim 'I need nobody.' Relational ties are kept thin or severed at the first sign of emotional vulnerability.",
        insight: "Independence became your armor when dependence felt like certain danger.",
        somaticExercise: "Wrap both arms around your ribs, squeeze firmly, then experience the boundary of where you end and support begins.",
        affirmation: "Asking for assistance is a strategic adult choice, not a return to infantile weakness."
      },
      shadowIntegration: {
        title: "The Isolation Envoy",
        subtitle: "The part that took over",
        description: "Engaging with the internal skeptic who mistrusts advice or intimacy. Instead of forcing trust, we value the skeptic's high-functioning historical intelligence.",
        insight: "Your suspicion is not a defect; it was your loyal bodyguard.",
        somaticExercise: "Place a hand on your stomach and speak inwardly: 'Thank you for keeping me safe for so many years. I hear you, but we are secure now.'",
        affirmation: "Every protector in my mind has a positive intent. I welcome its presence."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "Infant Holding Container",
        subtitle: "What the child needed",
        description: "Accessing the primitive pre-verbal core of infancy. Sending basic signals of physical welcome, holding, and biological security.",
        insight: "You do not need to earn your right to occupy space.",
        somaticExercise: "Adopt a fetal posture or cuddle a soft pillow, repeating: 'You are welcome here. Your existence is complete. I will keep watch.'",
        affirmation: "You are here, and your belongingness in this universe is non-negotiable."
      },
      nurturingParent: {
        title: "Consistent Containment",
        subtitle: "Being your own steady parent",
        description: "Establishing standard reliable daily care loops—rhythmically sleeping, hydrating, and feeding without waiting for exhaustion thresholds.",
        insight: "A loving parent does not require their infant to beg for life-support.",
        somaticExercise: "Commit to sipping warm water every 90 minutes today, logging each hydration act as an act of physical self-parenting.",
        affirmation: "I am a reliable protector. I maintain my physical vessel with sovereign care."
      },
      virtueIntegration: {
        title: "Hope Beacon Activation",
        subtitle: "The strength this builds",
        description: "Opening minor social interfaces to test the safety of interdependence. Exercising small trust trials with verified low-stake partners.",
        insight: "The universe can surprise you with warmth when you open minor windows.",
        somaticExercise: "Ask a close colleague or friend to recommend a book or send a relaxing song, then enjoy it with total receptivity.",
        affirmation: "I choose to hope. I permit the helpfulness of others to nourish me."
      }
    }
  },
  2: {
    shadowBranch: {
      somaticShock: {
        title: "Compliance Throat-Lock",
        subtitle: "How it lives in the body",
        description: "Physical throat tightening and sudden solar plexus hollow when an unaligned claim or boundary transgression occurs.",
        insight: "Shame causes the physical body to shrink so it is not visible to the validator.",
        somaticExercise: "Gently stretch your neck, hum a low C-note for 10 seconds to loosen cervical vocal cords, and swallow warm tea.",
        affirmation: "My voice is clear, and its sound does not endanger my connection."
      },
      adaptiveCoping: {
        title: "The Chameleon Default",
        subtitle: "The protective habit",
        description: "Fawning and auto-aligning with other opinions/customs. Changing hobbies, values, and attire to accommodate whoever is closest.",
        insight: "Adopting a social disguise was safer than risking rejection for being visible.",
        somaticExercise: "In a group, notice an opinion you disagree with. Press your feet into the floor and maintain silence instead of nodding.",
        affirmation: "I am distinct. I do not require absolute consensus to remain worthy."
      },
      shadowIntegration: {
        title: "The Rebel Bodyguard",
        subtitle: "The part that took over",
        description: "Integrating the repressed internal frustration and anger that arose when your early agency was punished or micro-managed.",
        insight: "Anger is the natural biochemical marker of boundary defense.",
        somaticExercise: "Clench your fists tightly for 5 seconds, release, and focus on the surge of energetic Will flowing into your hands.",
        affirmation: "My boundary drive is a clean resource of preservation. I honor its heat."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "Independent Motor Agency",
        subtitle: "What the child needed",
        description: "Re-wiring early childhood shame loops with sovereign affirmation of Will, clean desires, and physical impulses.",
        insight: "Your choices are not crimes; they are the genesis of your individuality.",
        somaticExercise: "Write on a paper in big letters: 'Grown-ups can say no,' and tap it thrice. Affirmation: 'Your will is beautiful, and I protect your choices.'",
        affirmation: "I am separate, sovereign, and my independent will is inherently safe."
      },
      nurturingParent: {
        title: "Sovereign Workspace Anchor",
        subtitle: "Being your own steady parent",
        description: "Setting up minor aesthetic or procedural configurations that belong 100% to you and are closed to outer evaluation.",
        insight: "A protective parent constructs a playground where the child has absolute veto power.",
        somaticExercise: "Re-organize three physical items on your desk or room in a custom layout, saying: 'This is my sovereign choice.'",
        affirmation: "I govern my space and my preferences with absolute, clean authority."
      },
      virtueIntegration: {
        title: "The Will Declarator",
        subtitle: "The strength this builds",
        description: "Exercising a deliberate 'No' or a clean self-directed selection when presented with multiple standard paths.",
        insight: "Will is a physical muscle. It strengthens with every clean boundary.",
        somaticExercise: "Politely refuse one minor group request or suggest a different restaurant option directly without apologizing.",
        affirmation: "My 'No' protects my identity, and my 'Yes' is weighted with sovereign power."
      }
    }
  },
  3: {
    shadowBranch: {
      somaticShock: {
        title: "Creative Freeze Reflex",
        subtitle: "How it lives in the body",
        description: "Somatic paralysis when initiating a raw creative project. A heavy, lead-like feeling in the arms and sudden cognitive fatigue.",
        insight: "Early over-regulation registered creative spark as an dangerous act of defiance.",
        somaticExercise: "Shed chemical paralysis by shaking your hands and shoulders vigorously for 15 seconds to discharge cortisol.",
        affirmation: "My creativity is a safe, biological current that is permitted to flow freely."
      },
      adaptiveCoping: {
        title: "The Passive Complier",
        subtitle: "The protective habit",
        description: "Hiding behind absolute bureaucratic alignment. Becoming the perfect helper who executes others' instructions while burying personal projects.",
        insight: "It was safer to work on other people's plans because failure carried no personal guilt.",
        somaticExercise: "Open a blank canvas or paper and scribble lines, circles, and messy words without plan or self-criticism.",
        affirmation: "I am allowed to form projects of my own and pursue my unique horizons."
      },
      shadowIntegration: {
        title: "The Wild Creator",
        subtitle: "The part that took over",
        description: "Consolidating the shadow kid who was scolded for making a mess, shouting in play, or being 'too loud' and expressive.",
        insight: "Creation is inherently messy before it is clean.",
        somaticExercise: "Intentionally paint, write, or work in a chaotic manner for 5 minutes, allowing things to be imperfectly structured.",
        affirmation: "I make space for my raw energy to dance before imposing adult order."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "Play without Boundaries",
        subtitle: "What the child needed",
        description: "Giving the early explorer total clearance to play, imagine, organize, and try out roles without outer utility.",
        insight: "Your play has value in itself; it does not need to yield a financial return.",
        somaticExercise: "Sit on the floor, play with toys, blocks, or digital doodles, whispering: 'You are allowed to make a beautiful mess.'",
        affirmation: "I release the intense guilt of unstructured creation and step into my purpose."
      },
      nurturingParent: {
        title: "Purpose Champion Armor",
        subtitle: "Being your own steady parent",
        description: "Shielding your initial creative endeavors from outer reviews, criticism, or early monetization pressures.",
        insight: "A loving parent displays the child's messy drawings on the fridge rather than critiquing the line-work.",
        somaticExercise: "Place your initial drafts in a closed folder named 'Safe Playroom,' sealing it against adult judgment.",
        affirmation: "I guard my initial sparks from early assessment so they can grow strong."
      },
      virtueIntegration: {
        title: "Bold Purpose Ascent",
        subtitle: "The strength this builds",
        description: "Formulating a simple personal initiative and committing to taking one imperfect 5-minute action on it daily.",
        insight: "Initiative is fueled by action. Action destroys the paralysis of moral guilt.",
        somaticExercise: "Send an email, buy a web domain, or write a single paragraph for your targeted project within 5 minutes of planning.",
        affirmation: "I choose to act, I choose to explore, and I lean confidently into my purpose."
      }
    }
  },
  4: {
    shadowBranch: {
      somaticShock: {
        title: "Comparison Solar Sinking",
        subtitle: "How it lives in the body",
        description: "A sudden cold, hollow sensation in the solar plexus accompanied by chest tightness whenever comparing skills with peers.",
        insight: "Inefficiency triggers childhood memories of being labeled as slow or average.",
        somaticExercise: "Stand tall, press your hands against a solid wall for 10 seconds to activate skeletal muscles and feel your core power.",
        affirmation: "My skill level is a dynamic trajectory. I do not match my human value to peer benchmarks."
      },
      adaptiveCoping: {
        title: "The Quit-Early Algorithm",
        subtitle: "The protective habit",
        description: "Ditching complex tasks at the first sign of difficulty. Defending against the pain of being 'bad' by claiming 'I didn't care anyway.'",
        insight: "Quitting early allows you to control the failure rather than letting the failure control you.",
        somaticExercise: "When a hard task stymies you, set a timer for 3 minutes, taking deep belly breaths while staying seated without closing the tab.",
        affirmation: "Friction is just neurological data. I stay with my learning loops."
      },
      shadowIntegration: {
        title: "The Clumsy Apprentice",
        subtitle: "The part that took over",
        description: "Embracing the slow, awkward inner beginner who was compared to gifted siblings or scolded for school-age mistakes.",
        insight: "Mastery is built through hundreds of calibrated clumsy trials.",
        somaticExercise: "Acknowledge a failure aloud: 'I am doing a clumsy trial, and this is exactly how competence gets constructed.'",
        affirmation: "Every master was once a clumsy beginner. I support my awkward steps."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "Effort Validation Cradle",
        subtitle: "What the child needed",
        description: "Praising the learner's developmental grit, persistence, and focus rather than focusing on accolades or outcome perfection.",
        insight: "Your value lies in your capacity to focus and explore, not your trophy case.",
        somaticExercise: "Look in a mirror and say: 'I see how hard you tried. I am proud of your focus. Settle down inside. Your competence is real.'",
        affirmation: "I am growing, I am learning, and my growth rate is perfectly balanced."
      },
      nurturingParent: {
        title: "Micro-Syllabus Calibration",
        subtitle: "Being your own steady parent",
        description: "Structuring learning materials in bite-sized, low-friction chunks that guarantee small wins and build deep confidence.",
        insight: "A wise parent divides a high mountain path into small, manageable rest points.",
        somaticExercise: "Break a highly complex skill target into three 10-minute daily protocols, logging each as a solid win on a calendar.",
        affirmation: "I break massive systems down to protect my child's neural endurance."
      },
      virtueIntegration: {
        title: "Competence Forge",
        subtitle: "The strength this builds",
        description: "Executing precise, focused effort on a specific technical challenge without seeking outer validation or sharing results.",
        insight: "True competence is silent self-pride in your capacity to shape raw materials.",
        somaticExercise: "Conduct a 15-minute silent skill drill (e.g. key work, drawing, code loops) and close it with a simple smile.",
        affirmation: "I possess systematic competence. My incremental effort compiles into absolute mastery."
      }
    }
  },
  5: {
    shadowBranch: {
      somaticShock: {
        title: "Ideological Suffocation",
        subtitle: "How it lives in the body",
        description: "Autonomic system fatigue and flat energy from mimicking a composite social construct while suppressing your true beliefs.",
        insight: "Wearing a chameleonic personality depletes prefrontal metabolic reserves.",
        somaticExercise: "Stand firmly, widen your arms, take a deep horizontal breath to stretch ribs, and exhale with a strong, audible sigh.",
        affirmation: "I am separate from family and societal expectations. My identity is safe."
      },
      adaptiveCoping: {
        title: "The Persona Overdrive",
        subtitle: "The protective habit",
        description: "Obsessively polishing an elite, curated online or corporate persona. Over-identifying with titles, metrics, or external social status.",
        insight: "A flawless mask ensures you will not be criticized, but it keeps select core parts forever lonely.",
        somaticExercise: "Examine a curated post or profile you created. Notice the gap between that graphic and your raw, complex internal self.",
        affirmation: "I am more than my titles, my metrics, and my visual summaries."
      },
      shadowIntegration: {
        title: "The Outcast Jester",
        subtitle: "The part that took over",
        description: "Sovereign integration of your unconventional, weird, or raw traits that did not align with early social benchmarks.",
        insight: "Your eccentricities are the raw materials of your authentic identity.",
        somaticExercise: "Write down one uncommon hobby or belief you hold, saying: 'This part is distinct, beautiful, and fully welcome under my brand.'",
        affirmation: "My unique differences are my ultimate technological assets. I protect them."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "The Fidelity Declaration",
        subtitle: "What the child needed",
        description: "Establishing safe boundaries for self-expression. Assuring the growing teen that they are fully permitted to reject external dogmas.",
        insight: "Authentic separation is a prerequisite to genuine, adult community integration.",
        somaticExercise: "Place a hand on your throat and speak aloud: 'I love you for who you are. You do not need to fit in to be held.'",
        affirmation: "I am separate, I am integrated, and my authentic truth is my anchor."
      },
      nurturingParent: {
        title: "Values Sovereign Sanctuary",
        subtitle: "Being your own steady parent",
        description: "Drafting a definitive ledger of non-negotiable personal values, establishing healthy protection against consensus noise.",
        insight: "A healthy parent validates when pre-adults disagree, supporting structural boundary differentiation.",
        somaticExercise: "Draft three core personal values on a card and place them in your pocket as an active identity anchor today.",
        affirmation: "I defend my authentic values against peer pressure and consensus noise."
      },
      virtueIntegration: {
        title: "Fidelity Core Calibration",
        subtitle: "The strength this builds",
        description: "Taking a clean, standing commitment based on your core values, even when it creates minor professional or social friction.",
        insight: "Identity is compiled when actions align completely with your internal code.",
        somaticExercise: "Speak your authentic opinion in a low-stakes discussion with total confidence and zero explanatory excuses.",
        affirmation: "My alignment with my inner values is my highest form of security."
      }
    }
  },
  6: {
    shadowBranch: {
      somaticShock: {
        title: "Relational Chest Spasm",
        subtitle: "How it lives in the body",
        description: "Rapid heartbeat, physical chest contraction, and cold hands when a companion attempts deep relational checking or emotional warmth.",
        insight: "The autonomic nervous system interprets intimacy as a threat to fragile autonomy.",
        somaticExercise: "Place both hands flat on your sternum, close eyes, and hum softly to trigger vagus heart de-escalation.",
        affirmation: "Intimacy is not a threat to my borders. I can stay separate and connected."
      },
      adaptiveCoping: {
        title: "Defensive Relational Offshoring",
        subtitle: "The protective habit",
        description: "Keeping all relationships strictly superficial or temporary. Crafting a hyper-independent loop where no one can get close enough to see your wounds.",
        insight: "Isolation keeps you completely safe from rejection, but locks you inside an empty castle.",
        somaticExercise: "Invite a trusted peer to spend 10 minutes in silent observation or close presence without attempting to fill conversational gaps.",
        affirmation: "I am courageous enough to reveal my true face. Our connection will hold."
      },
      shadowIntegration: {
        title: "The Sentinel Guard",
        subtitle: "The part that took over",
        description: "Gently honoring the internal walls and gatekeepers that locked up your heart after early relational abandonments.",
        insight: "Your wall was not a mistake; it was an amazing structure to keep you secure.",
        somaticExercise: "Look at your chest and say: 'Thank you for protecting my heart when it was tender. It is safe to allow selective passage now.'",
        affirmation: "I validate my defensive gates. I thank them for keeping my heart alive."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "Safe Relational Anchoring",
        subtitle: "What the child needed",
        description: "Inviting core attachment safety. Synthesizing safe core coregulation without risking the loss of your distinct selfhood.",
        insight: "You can be deeply connected to another and still keep your own name.",
        somaticExercise: "Affirm: 'You are safe here. I will not let them consume us. You can rest in their warmth; I am guarding our perimeter.'",
        affirmation: "I am ready to share, I am safe to connect, and my heart is warm."
      },
      nurturingParent: {
        title: "Vulnerable Presence Calibration",
        subtitle: "Being your own steady parent",
        description: "Practicing sitting with a close companion during raw, vulnerable moments without trying to fix, run away, or over-explain.",
        insight: "A loving parent sits silently with the child's tears, offering warm containment instead of early solutions.",
        somaticExercise: "Sit facing a partner or close friend, make eye contact, and share one minor current vulnerability without apologizing.",
        affirmation: "I offer my raw presence with grace, and I accept their loving presence with care."
      },
      virtueIntegration: {
        title: "Love Current Activation",
        subtitle: "The strength this builds",
        description: "Directing an active stream of vulnerable disclosure and support outward, testing the elasticity of secure attachment.",
        insight: "Vulnerability is not weakness; it is the ultimate super-power of human connection.",
        somaticExercise: "Send a message to a loved one: 'I was thinking of you. Your presence brings me comfort.'",
        affirmation: "I choose to love and be loved. My vulnerability is my highest power."
      }
    }
  },
  7: {
    shadowBranch: {
      somaticShock: {
        title: "Lethargic Consumption Block",
        subtitle: "How it lives in the body",
        description: "A heavy, persistent chest pressure and flat, grey energy that leads to mechanical scrolling, streaming, or comfort routines with zero spark.",
        insight: "Stagnation is metabolic energy being hoarded because you feel your output doesn't count.",
        somaticExercise: "Jump or stretch to activate deep circulatory networks, taking three shallow fast nasal breaths and one long sigh.",
        affirmation: "I am a generative being. My inner fire is ready to activate and warm others."
      },
      adaptiveCoping: {
        title: "The Mid-Life Accrual Loop",
        subtitle: "The protective habit",
        description: "Chasing material accolades, credentials, or physical toys to quieten the voice that asks: 'Is this all my life has been?'",
        insight: "Accumulation is a temporary substitute for the deep psychological requirement to create a legacy.",
        somaticExercise: "Clear three unnecessary clutter items from your room, giving them away or recycling them with total release.",
        affirmation: "I count because of what I share and create, not because of what I pile up."
      },
      shadowIntegration: {
        title: "The Weary Breadwinner",
        subtitle: "The part that took over",
        description: "Validating the deeply tired adult part of you that has spent decades carrying responsibilities and is terrified of burnout.",
        insight: "Deep rest is the authentic fuel of consistent generativity.",
        somaticExercise: "Lie down fully flat on your back for 15 minutes, allowing your back to sink into the floor with absolute release.",
        affirmation: "Rest is not structural failure. I celebrate my bodily biological fatigue."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "Generative Catalyst Spark",
        subtitle: "What the child needed",
        description: "Igniting the internal mentor. Showing the inner self that your hard-won life struggles are ready to become gold for others.",
        insight: "Your pain was not in vain; it is the blueprint of someone else's healing.",
        somaticExercise: "Affirm: 'Your hard years are valuable resources. The youth need your unique trail. I will help you compose your legacy.'",
        affirmation: "My wisdom has high value, and I step confidently into my generative years."
      },
      nurturingParent: {
        title: "Generative Rhythm Calibration",
        subtitle: "Being your own steady parent",
        description: "Replacing minor daily passive consumption habits with low-pressure generative creations (gardening, mentoring, sketching, writing).",
        insight: "A loving parent encourages the child to build sandcastles instead of just sitting on the shore.",
        somaticExercise: "Write a 3-sentence guide explaining a valuable lesson you learned, and post it online or share it with a junior colleague.",
        affirmation: "I am an active creator. My daily expressions shape a beautiful legacy."
      },
      virtueIntegration: {
        title: "Legacy Force Generation",
        subtitle: "The strength this builds",
        description: "Engaging in proactive, warm, and unconditional support of a younger seeker, asking for zero personal return or accolades.",
        insight: "Generativity is completed when you cultivate a fire in another's hearth.",
        somaticExercise: "Send an email or message of sincere professional guidance and encouragement to a junior colleague or newcomer.",
        affirmation: "I offer my care to the next generation. My legacy is warm, durable, and active."
      }
    }
  },
  8: {
    shadowBranch: {
      somaticShock: {
        title: "The Sinking Regression",
        subtitle: "How it lives in the body",
        description: "A sudden, crushing chest tightness or feeling of falling backward when reviewing past mistakes, failed connections, or unchosen lifepaths.",
        insight: "Despair is your brain replaying past scenes and wishing they could be rewritten.",
        somaticExercise: "Place your hand on your heart and take slow, yawning breaths, allowing each exhale to make a deep vibrating chest sound.",
        affirmation: "I cannot rewrite the timeline, but I can embrace the canvas as complete."
      },
      adaptiveCoping: {
        title: "The Bitterness Projection",
        subtitle: "The protective habit",
        description: "Projecting internal self-judgment onto society as general decay. Feeling bitter toward younger peers or expressing cold resignation.",
        insight: "Bitterness is a shield that prevents you from feeling the grief of finite limits.",
        somaticExercise: "List three things the younger generation is creating which you find intriguing, and smile at their exploratory chaos.",
        affirmation: "The cycle of life is beautiful, and I am a timeless part of its spiral."
      },
      shadowIntegration: {
        title: "The Despairing Mourner",
        subtitle: "The part that took over",
        description: "Integrating the deep internal grief, tears, and regrets that arise when acknowledging that our time on this earth is finite.",
        insight: "Grief is the exact chemical price we pay for having loved this human experience.",
        somaticExercise: "Allow yourself to sit in 5 minutes of total silent grief, placing a hand on your chest and allowing any tears to emerge.",
        affirmation: "I allow my tears to sweep clean my regrets. Grief is the signature of love."
      }
    },
    growthBranch: {
      innerChildHealing: {
        title: "The Sovereign Integrity Script",
        subtitle: "What the child needed",
        description: "Compiling the life-path, validating that all triumphs, errors, and detours were critical developmental templates for your soul.",
        insight: "Your life map is a completed piece of fine art, not a series of errors.",
        somaticExercise: "Look at your childhood photo and declare: 'You did exceptionally well. You survived the storm. Your path is fully integrated.'",
        affirmation: "Every step was guided. My story is whole, my path is complete, and I am secure."
      },
      nurturingParent: {
        title: "Infinite Healing Grace",
        subtitle: "Being your own steady parent",
        description: "Offering unconditional self-acceptance and complete parent forgiveness back to every younger version of you.",
        insight: "A wise parent forgives the child's slips instantly, recognizing they were learning to walk.",
        somaticExercise: "List your three heaviest regrets. Next to each, write: 'I forgive you. You did the best with what you knew then.' and sigh deeply.",
        affirmation: "I wrap all younger versions of myself in infinite parent grace."
      },
      virtueIntegration: {
        title: "The Memoir Forge",
        subtitle: "The strength this builds",
        description: "Extracting pure distilled wisdom from your life story, offering it up as a clinical, loving beacon for the rest of humanity.",
        insight: "Wisdom is the ultimate product of integrated human consciousness.",
        somaticExercise: "Write a short personal philosophy ledger: 3 golden rules for human thriving, based strictly on your greatest survived trials.",
        affirmation: "I possess absolute wisdom. My integrated lifespan is an eternal beacon of secure hope."
      }
    }
  }
};

const REFRAMING_INSIGHTS: Record<number, string> = {
  1: "Mistrust keeps you safe from the past, but hope opens the gates to a collaborative future.",
  2: "Your independent choices are not acts of defiance; they are the clean expression of your unique life-force.",
  3: "Creativity is permitted to be messy and playful before it is perfect and aligned.",
  4: "Clumsy dynamic trials are not failures; they are the essential milestones on your path to mastery.",
  5: "You do not need to fit into a pre-made social template to be worthy of absolute alignment and community.",
  6: "Opening your heart to deep, vulnerable connection does not require sacrificing your sovereign borders.",
  7: "Your historical struggles are ready to be recycled into clean, unconditional guidance for younger seekers.",
  8: "Every detouring step, triumph, and regret is a completed thread in the perfect masterpiece of your life story."
};

interface ConflictLog {
  id: string;
  stageNumber: number;
  stageName: string;
  conflictDescription: string;
  completedReflections: Record<number, boolean>;
  loggedAnswers: Record<number, string>;
  exerciseEnrollment: Record<number, boolean>;
  exerciseCompletions: Record<number, number>; // index -> count
  createdDate: string;
}

export default function EriksonDevelopmentMap() {
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(4); // Default to Identity (Stage 5)
  const [userCurrentStageNum, setUserCurrentStageNum] = useState<number>(5);
  const [personalConflictInput, setPersonalConflictInput] = useState<string>('');
  const [hoveredStageIdx, setHoveredStageIdx] = useState<number | null>(null);
  
  const [completedStages, setCompletedStages] = useState<number[]>(() => {
    const saved = localStorage.getItem('erikson_fully_unlocked_stages_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [popStageNum, setPopStageNum] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance canvas confetti triggers
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#38bdf8', '#818cf8', '#34d399', '#f59e0b', '#fb7185', '#a7f3d0', '#6366f1'];
    
    canvas.width = canvas.parentElement?.clientWidth || canvas.clientWidth || 1000;
    canvas.height = canvas.parentElement?.clientHeight || canvas.clientHeight || 450;

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      gravity: number;
      friction: number;
    }[] = [];

    // Emit from center/slightly upper to pour down beautifully across the whole map container
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 14 - 6,
        radius: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        gravity: 0.24,
        friction: 0.985
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          
          ctx.beginPath();
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
          ctx.restore();
        }
      });

      if (active) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  // Reparenting branching states
  const [activatedNodes, setActivatedNodes] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('erikson_activated_nodes_v2');
    if (saved) return JSON.parse(saved);
    return {};
  });
  
  const [selectedNodeKey, setSelectedNodeKey] = useState<string>('stage-5-core');

  // Sync selected node key when stage changes
  useEffect(() => {
    setSelectedNodeKey(`stage-${selectedStageIdx + 1}-core`);
  }, [selectedStageIdx]);

  const handleToggleNode = (nodeKey: string) => {
    const updated = { ...activatedNodes, [nodeKey]: !activatedNodes[nodeKey] };
    setActivatedNodes(updated);
    localStorage.setItem('erikson_activated_nodes_v2', JSON.stringify(updated));
    
    if (updated[nodeKey]) {
      // Success feedback cyber chime!
      playBeep(523.25, 'sine', 0.1); // C5
      setTimeout(() => playBeep(659.25, 'sine', 0.12), 110); // E5
    } else {
      playBeep(392, 'sine', 0.08); // G4
    }
  };

  const getNodeDetails = (key: string) => {
    const stageNum = activeStage.number;
    const reparenting = STAGE_REPARENTING_DATA[stageNum];
    
    if (!reparenting) {
      return {
        title: activeStage.name,
        subtitle: "Universal Crisis Gate",
        description: activeStage.description,
        insight: activeStage.existentialQuestion,
        somaticExercise: "Initiate self-assessment or write a journal entry below.",
        affirmation: "My path is safe."
      };
    }

    if (key.endsWith('-core')) {
      return {
        title: activeStage.name,
        subtitle: "Universal Crisis Junction",
        description: activeStage.description,
        insight: `Existential Axis: "${activeStage.existentialQuestion}"`,
        somaticExercise: "To integrate this core crisis junction, select and complete any of the surrounding Shadow or Re-Parenting somatic nodes. Each node represents a specific psychological development milestone.",
        affirmation: `I am stepping into the virtue of ${activeStage.virtue}.`
      };
    }
    if (key.endsWith('-shadow-somatic')) return reparenting.shadowBranch.somaticShock;
    if (key.endsWith('-shadow-coping')) return reparenting.shadowBranch.adaptiveCoping;
    if (key.endsWith('-shadow-integration')) return reparenting.shadowBranch.shadowIntegration;
    if (key.endsWith('-growth-child')) return reparenting.growthBranch.innerChildHealing;
    if (key.endsWith('-growth-parent')) return reparenting.growthBranch.nurturingParent;
    if (key.endsWith('-growth-virtue')) return reparenting.growthBranch.virtueIntegration;

    return {
      title: "Unknown Node",
      subtitle: "N/A",
      description: "",
      insight: "",
      somaticExercise: "",
      affirmation: ""
    };
  };
  
  // Local storage state for development logs
  const [conflictLogs, setConflictLogs] = useState<ConflictLog[]>(() => {
    const saved = localStorage.getItem('erikson_conflict_logs_new');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'con-init-1',
        stageNumber: 5,
        stageName: "Identity vs. Role Confusion",
        conflictDescription: "Feeling fragmented between a stable corporate role and my aspiration to construct authentic psychiatric wellness applications. Struggling with peer comparison and imposter feelings.",
        completedReflections: { 0: true, 1: true },
        loggedAnswers: {
          0: "I notice I wear a corporate compliance mask to ensure approval, but my prefrontal brain feels absolutely depleted of drive.",
          1: "My three core values are clinical integrity, beautiful creative technological exploration, and emotional co-regulation."
        },
        exerciseEnrollment: { 0: true },
        exerciseCompletions: { 0: 3 },
        createdDate: new Date().toISOString().split('T')[0]
      }
    ];
  });

  // Safe Audio feedback
  const playBeep = (freq: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square', duration: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const getTooltipClass = (index: number) => {
    const base = "absolute bottom-full mb-3 z-55 p-3.5 bg-slate-950 border border-indigo-500/40 text-slate-100 rounded-xl shadow-2xl text-xs flex flex-col gap-1 w-60 sm:w-64 pointer-events-none font-sans leading-relaxed tracking-normal transition-all duration-150 normal-case select-none text-left";
    if (index === 0) return `${base} left-0 origin-bottom-left`;
    if (index === 7) return `${base} right-0 origin-bottom-right`;
    return (index % 2 === 0)
      ? `${base} left-0 lg:left-1/2 lg:-translate-x-1/2 origin-bottom`
      : `${base} right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 origin-bottom`;
  };

  const getArrowClass = (index: number) => {
    const base = "absolute top-full w-2 h-2 bg-slate-950 border-r border-b border-indigo-500/40 rotate-45 -mt-1 z-55";
    if (index === 0) return `${base} left-4`;
    if (index === 7) return `${base} right-4`;
    return (index % 2 === 0)
      ? `${base} left-4 lg:left-1/2 lg:-translate-x-1/2`
      : `${base} right-4 lg:right-auto lg:left-1/2 lg:-translate-x-1/2`;
  };

  const handleSaveLogs = (updated: ConflictLog[]) => {
    setConflictLogs(updated);
    localStorage.setItem('erikson_conflict_logs_new', JSON.stringify(updated));
  };

  // Synchronized listener that tracks when a life stage is fully unlocked/completed
  useEffect(() => {
    const currentCompleted: number[] = [];
    ERIKSON_STAGES.forEach((st) => {
      // 1. Check if journal/reflections/somatic exercises are completely done for this stage
      const log = conflictLogs?.find((l) => l.stageNumber === st.number);
      const exercisesDone = log
        ? st.growthReflections.every((_, i) => !!log.completedReflections[i]) &&
          st.behavioralExercises.every((_, i) => (log.exerciseCompletions[i] || 0) > 0)
        : false;

      // 2. Check if all 6 interactive reparenting nodes are completed
      const reparentingKeys = [
        `stage-${st.number}-shadow-somatic`,
        `stage-${st.number}-shadow-coping`,
        `stage-${st.number}-shadow-integration`,
        `stage-${st.number}-growth-child`,
        `stage-${st.number}-growth-parent`,
        `stage-${st.number}-growth-virtue`
      ];
      const reparentingDone = reparentingKeys.every(k => !!activatedNodes[k]);

      if (exercisesDone || reparentingDone) {
        currentCompleted.push(st.number);
      }
    });

    // Detect if a stage was newly unlocked (existed in currentCompleted, but not in previous completedStages state)
    const newlyCompleted = currentCompleted.filter(num => !completedStages.includes(num));
    if (newlyCompleted.length > 0) {
      // Trigger user rewards!
      const unlockedNum = newlyCompleted[0];
      setPopStageNum(unlockedNum);
      setTimeout(() => setPopStageNum(null), 1800);
      
      // Cyber reward chord
      playBeep(523.25, 'sine', 0.08); // C5
      setTimeout(() => playBeep(659.25, 'sine', 0.08), 100); // E5
      setTimeout(() => playBeep(783.99, 'sine', 0.10), 200); // G5
      setTimeout(() => playBeep(1046.50, 'sine', 0.22), 300); // C6

      // Start the confetti cascade!
      setTimeout(() => {
        triggerConfetti();
      }, 50);
    }

    // Only update state if there is a real difference
    const isDifferent = JSON.stringify([...currentCompleted].sort()) !== JSON.stringify([...completedStages].sort());
    if (isDifferent) {
      setCompletedStages(currentCompleted);
      localStorage.setItem('erikson_fully_unlocked_stages_v2', JSON.stringify(currentCompleted));
    }
  }, [conflictLogs, activatedNodes]);

  const activeStage = ERIKSON_STAGES[selectedStageIdx];

  // Self assessment variables
  const [assessmentStep, setAssessmentStep] = useState<number>(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({}); // stage num -> rating (1-5)
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);

  const startSelfAssessment = () => {
    playBeep(440, 'sine', 0.1);
    setAssessmentStep(1);
    setAssessmentAnswers({});
    setAssessmentResult(null);
  };

  const handleAssessmentAnswer = (rating: number) => {
    playBeep(480 + (rating * 20), 'sine', 0.08);
    const updated = { ...assessmentAnswers, [assessmentStep]: rating };
    setAssessmentAnswers(updated);

    if (assessmentStep < 8) {
      setAssessmentStep(prev => prev + 1);
    } else {
      // Calculate active crisis stage
      // The stage with the lowest rating (lowest functioning/safest attachment) or highest conflict is identified
      let targetStageNum = 5;
      let minScore = 999;
      
      // Calculate scores
      for(let i = 1; i <= 8; i++) {
        const score = updated[i] || 3;
        if(score < minScore) {
          minScore = score;
          targetStageNum = i;
        }
      }
      
      const foundStage = ERIKSON_STAGES.find(s => s.number === targetStageNum);
      setAssessmentResult(foundStage ? foundStage.name : "Identity vs. Role Confusion");
      setUserCurrentStageNum(targetStageNum);
      setSelectedStageIdx(targetStageNum - 1);
      playBeep(580, 'sine', 0.1);
      setTimeout(() => playBeep(880, 'sine', 0.18), 100);
    }
  };

  // Log active conflict
  const handleLogConflict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalConflictInput.trim()) return;

    const newLog: ConflictLog = {
      id: `con-${Date.now()}`,
      stageNumber: activeStage.number,
      stageName: activeStage.name,
      conflictDescription: personalConflictInput,
      completedReflections: {},
      loggedAnswers: {},
      exerciseEnrollment: {},
      exerciseCompletions: {},
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updated = [newLog, ...conflictLogs];
    handleSaveLogs(updated);
    setPersonalConflictInput('');
    playBeep(640, 'sine', 0.2);
    setTimeout(() => playBeep(880, 'sine', 0.12), 150);
  };

  const deleteConflictLog = (id: string) => {
    const updated = conflictLogs.filter(log => log.id !== id);
    handleSaveLogs(updated);
    playBeep(300, 'sawtooth', 0.1);
  };

  // Toggle checklist reflections
  const toggleReflectionCheck = (logId: string, refIdx: number) => {
    const updated = conflictLogs.map(log => {
      if (log.id === logId) {
        const currentChecks = { ...log.completedReflections };
        const nextVal = !currentChecks[refIdx];
        currentChecks[refIdx] = nextVal;
        
        if (nextVal) {
          playBeep(720, 'sine', 0.08);
        } else {
          playBeep(350, 'sine', 0.05);
        }

        return { ...log, completedReflections: currentChecks };
      }
      return log;
    });
    handleSaveLogs(updated);
  };

  // Log reflection answers text
  const handleSaveReflectionAnswer = (logId: string, refIdx: number, val: string) => {
    const updated = conflictLogs.map(log => {
      if (log.id === logId) {
        const curAns = { ...log.loggedAnswers };
        curAns[refIdx] = val;
        return { ...log, loggedAnswers: curAns };
      }
      return log;
    });
    handleSaveLogs(updated);
  };

  // Enroll in behavioral exercises
  const toggleExerciseEnrollment = (logId: string, exIdx: number) => {
    const updated = conflictLogs.map(log => {
      if (log.id === logId) {
        const curEnroll = { ...log.exerciseEnrollment };
        const nextVal = !curEnroll[exIdx];
        curEnroll[exIdx] = nextVal;
        
        playBeep(nextVal ? 580 : 320, 'sine', 0.1);
        
        return { ...log, exerciseEnrollment: curEnroll };
      }
      return log;
    });
    handleSaveLogs(updated);
  };

  // Log physical task reinforcement completion
  const triggerExerciseRepetition = (logId: string, exIdx: number) => {
    const updated = conflictLogs.map(log => {
      if (log.id === logId) {
        const curComps = { ...log.exerciseCompletions };
        const currentCount = curComps[exIdx] || 0;
        curComps[exIdx] = currentCount + 1;
        
        // Double pitch rewards dopamine repetition!
        playBeep(520, 'sine', 0.08);
        setTimeout(() => playBeep(784, 'sine', 0.15), 80);

        return { ...log, exerciseCompletions: curComps };
      }
      return log;
    });
    handleSaveLogs(updated);
  };

  const currentStageNum = activeStage.number;
  const currentReparenting = STAGE_REPARENTING_DATA[currentStageNum];

  // Dynamic progress tracker
  const totalSubNodes = 8 * 6; // 48 interactive nodes in total
  const activeNodesCount = Object.keys(activatedNodes).filter(key => activatedNodes[key] && !key.endsWith('-core')).length;
  const globalIntegrationPercent = Math.round((activeNodesCount / totalSubNodes) * 100);

  // Inspector Node Information
  const activeInspectedNode = getNodeDetails(selectedNodeKey);
  const isInspectedNodeCore = selectedNodeKey.endsWith('-core');
  const isInspectedNodeActivated = activatedNodes[selectedNodeKey];

  return (
    <div className="text-slate-800 p-4 sm:p-6 rounded-3xl max-w-5xl mx-auto space-y-6 select-none" style={{
      background: 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.95)',
      boxShadow: '0 12px 40px rgba(180,83,9,0.16), 0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
    }}>
      
      {/* Dynamic Header Space with Compass Aesthetic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-50/75 pb-5">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-13 h-13 rounded-2xl text-white flex items-center justify-center" style={{
            background: 'linear-gradient(145deg, #FCD34D 0%, #B45309 100%)',
            boxShadow: '0 6px 16px rgba(180,83,9,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}>
            <Compass className="w-7 h-7 stroke-[2.2] animate-[spin_24s_linear_infinite]" />
          </div>
          <div>
            <h2 className="font-display text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Erikson Developmental Lifespan Map</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase font-mono">
                8 Psychosocial Stages
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-semibold tracking-wide">
              Erik Erikson's eight psychosocial stages — map each life crisis, its virtue, and the developmental work it asks of you
            </p>
          </div>
        </div>

        {/* Current Active User Stage Marker */}
        <div className="flex items-center gap-2 rounded-2xl px-3 py-1.5" style={{
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(252,211,77,0.5)',
          boxShadow: '0 2px 10px rgba(180,83,9,0.12)',
        }}>
          <div className="text-left">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block leading-none">YOUR LIFESPAN FOCUS</span>
            <span className="text-xs font-extrabold text-indigo-950 font-mono">
              Stage {userCurrentStageNum}: {ERIKSON_STAGES[userCurrentStageNum - 1]?.name.split('vs.')[0]}
            </span>
          </div>
          <button
            onClick={startSelfAssessment}
            className="text-[9px] uppercase font-black active:scale-95 transition cursor-pointer text-white px-2.5 py-1.5 rounded-xl ml-1 font-mono tracking-wider flex items-center gap-1"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #B45309)', boxShadow: '0 3px 0 rgba(120,53,15,0.6), 0 4px 12px rgba(180,83,9,0.35)' }}
          >
            <Sparkles className="w-3 h-3 text-white fill-current" />
            <span>Identify Stage</span>
          </button>
        </div>
      </div>

      {/* --- Interactive Lifepath Map Timeline --- */}
      <div className="bg-slate-900 border border-slate-950 p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden text-left">
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-50 w-full h-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15" />
        
        <div className="flex justify-between items-center mb-5 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-[11px] uppercase font-black tracking-widest text-[#93c5fd] font-mono leading-none">
              Developmental Life-Path Arc Matrix
            </h3>
          </div>
          <span className="text-[9px] text-[#93c5fd]/80 font-mono font-semibold">
            CLICK ANY SEGMENT TO ANALYZE CRISIS
          </span>
        </div>

        {/* Path segments layout */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {ERIKSON_STAGES.map((st, idx) => {
            const isSelected = selectedStageIdx === idx;
            const isUserCurrent = userCurrentStageNum === st.number;
            const isCompleted = completedStages.includes(st.number);
            const isPopping = popStageNum === st.number;
            
            return (
              <button
                key={st.number}
                type="button"
                onClick={() => {
                  setSelectedStageIdx(idx);
                  playBeep(480 + (idx * 25), 'sine', 0.08);
                }}
                onMouseEnter={() => setHoveredStageIdx(idx)}
                onMouseLeave={() => setHoveredStageIdx(null)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-[115px] relative group cursor-pointer ${
                  isPopping
                    ? 'border-emerald-400 bg-emerald-950/80 ring-4 ring-emerald-500/50 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.5)] z-20 transition-all duration-300 animate-[bounce_0.6s_ease-in-out_2]'
                    : isCompleted
                      ? 'bg-slate-950/95 border-emerald-500/50 shadow-[0_4px_16px_rgba(16,185,129,0.1)] hover:border-emerald-400'
                      : isSelected
                        ? 'bg-slate-950 border-sky-400 shadow-[0_4px_12px_rgba(14,165,233,0.15)] scale-102 ring-2 ring-sky-400/40'
                        : isUserCurrent
                          ? 'bg-slate-950/80 border-amber-400/70 ring-2 ring-amber-400/30 shadow-[0_0_22px_rgba(251,191,36,0.25)] hover:border-amber-300'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                {/* Horizontal flow connector lines for desktop */}
                {idx < 7 && (
                  <div className="hidden lg:block absolute -right-2.5 top-[30px] w-2.5 h-[1.5px] bg-slate-800 group-hover:bg-slate-700 z-0" />
                )}

                <div className="flex justify-between items-start w-full relative z-10">
                  <span className={`text-[8px] font-black font-mono px-1.5 py-0.5 rounded-md ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : isSelected ? 'bg-sky-500/15 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    STAGE {st.number}
                  </span>
                  
                  {isCompleted ? (
                    <span className="flex items-center gap-0.5 text-emerald-400 font-extrabold text-[8px] uppercase font-mono bg-emerald-500/10 px-1 py-0.5 rounded-md border border-emerald-500/30 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-pulse shrink-0" />
                      <span>UNLOCKED</span>
                    </span>
                  ) : isUserCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 flex items-center justify-center animate-[pulse_1.5s_infinite]" title="Your Lifespan Stage" />
                  ) : null}
                </div>

                <div className="mt-2.5 relative z-10">
                  <span className="text-[9px] text-slate-400 font-mono font-bold leading-none block uppercase tracking-wider">{st.crisis}</span>
                  <p className={`text-xs font-black truncate mt-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {st.name.split('vs.')[0]}
                  </p>
                  <span className={`text-[9.5px] font-extrabold mt-1 block font-mono ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                    Virtue: <strong className="uppercase">{st.virtue}</strong>
                  </span>
                </div>

                {/* Progress dot inside button */}
                <div className="mt-2 flex items-center gap-1.5 relative z-10">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sky-400' : 'bg-slate-700'}`} />
                  <span className="text-[8px] text-slate-500 font-mono font-semibold">{st.years}</span>
                </div>

                {/* Reframing Insight Hover Tooltip */}
                <AnimatePresence>
                  {hoveredStageIdx === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={getTooltipClass(idx)}
                    >
                      <div className="flex items-center gap-1 text-indigo-400 font-bold text-[8.5px] tracking-widest uppercase font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
                        <span>Reframing Insight</span>
                      </div>
                      <p className="text-[10.5px] text-slate-200 font-semibold leading-relaxed mt-1 select-text">
                        {REFRAMING_INSIGHTS[st.number]}
                      </p>
                      <div className={getArrowClass(idx)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Interactive Reparenting & Branching Diagnostics Map --- */}
      <div className="bg-slate-900/5 sm:bg-slate-50/10 border border-slate-200/50 rounded-3xl p-4 sm:p-6 space-y-6 text-left relative overflow-hidden shadow-2xs">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.8px,transparent_0.8px)] [background-size:20px_20px] opacity-5 pointer-events-none" />
        
        {/* Metric Header Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/40 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#38bdf8] flex items-center justify-center shadow-md border border-slate-800">
              <GitBranch className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <span>Interactive Re-Parenting &amp; Branching Blueprint</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black animate-pulse">
                  ACTIVE
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold leading-none mt-1">
                Establish dual somatic alignment for: <strong className="text-indigo-600">Stage {activeStage.number} • {activeStage.name}</strong>
              </p>
            </div>
          </div>

          {/* Global completion stat */}
          <div className="w-full md:w-64 bg-slate-100 rounded-2xl p-2.5 border border-slate-200/60 flex flex-col justify-between">
            <div className="flex justify-between text-[10px] font-black uppercase font-mono text-slate-500 leading-none mb-1.5">
              <span>Lifespan Integration</span>
              <span className="text-indigo-600 font-bold">{activeNodesCount} / {totalSubNodes} steps integrated ({globalIntegrationPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${globalIntegrationPercent > 0 ? Math.max(globalIntegrationPercent, 4) : 0}%` }}
              />
              <div 
                className="absolute top-0 bottom-0 right-0 bg-white/20 animate-[pulse_1s_infinite]" 
                style={{ left: `${globalIntegrationPercent > 0 ? Math.max(globalIntegrationPercent, 4) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* --- Interactive Branching Diagram Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-stretch relative py-4 px-2.5 bg-slate-950 rounded-2xl border border-slate-900 shadow-inner overflow-hidden z-10 text-slate-200">
          <div className="absolute inset-0 bg-[#090d16] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
          
          {/* COLUMN 1: Shadow Track (Cols 1 to 4) */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 relative z-10 p-2 border-r border-slate-900/50">
            <div className="flex items-center gap-1.5 border-b border-rose-950/40 pb-2 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-[10px] font-black font-mono tracking-widest text-rose-400 block uppercase">WHEN IT STAYS UNRESOLVED</span>
                <span className="text-[8px] text-slate-500 font-mono">How this crisis shows up as stuck patterns</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { type: 'somaticShock', label: "Body Response", keySuffix: "shadow-somatic", bg: "hover:border-rose-500/50 border-rose-950/60", hoverText: "text-rose-400", activeBg: "bg-rose-950/40 border-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.25)] text-rose-200" },
                { type: 'adaptiveCoping', label: "Protective Coping", keySuffix: "shadow-coping", bg: "hover:border-amber-500/50 border-amber-950/60", hoverText: "text-amber-400", activeBg: "bg-amber-950/40 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)] text-amber-200" },
                { type: 'shadowIntegration', label: "Making Peace", keySuffix: "shadow-integration", bg: "hover:border-orange-500/50 border-orange-950/60", hoverText: "text-orange-400", activeBg: "bg-orange-950/40 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.25)] text-orange-200" },
              ].map((item, idx) => {
                const nodeKey = `stage-${activeStage.number}-${item.keySuffix}`;
                const isSelected = selectedNodeKey === nodeKey;
                const isActivated = activatedNodes[nodeKey];
                const nodeData = currentReparenting?.shadowBranch[item.type as keyof typeof currentReparenting.shadowBranch];

                return (
                  <button
                    key={nodeKey}
                    type="button"
                    onClick={() => {
                      setSelectedNodeKey(nodeKey);
                      playBeep(400 + (idx * 20), 'sine', 0.08);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition relative cursor-pointer group flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-900 border-white text-white z-20 scale-102 ring-2 ring-rose-500/20' 
                        : isActivated 
                          ? item.activeBg 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider font-bold opacity-75">{item.label}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${isActivated ? 'bg-rose-500 bg-rose-500 animate-ping' : 'bg-slate-800'}`} />
                    </div>
                    <div className="mt-1">
                      <h4 className={`text-xs font-black truncate ${isSelected ? 'text-white' : isActivated ? 'text-rose-100 font-bold' : 'text-slate-300'}`}>
                        {nodeData?.title || "Loading..."}
                      </h4>
                      <p className="text-[9px] text-slate-400 line-clamp-1 leading-none mt-0.5">{nodeData?.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Symmetrical Flow Connectors Left (Col 5) */}
          <div className="hidden md:flex md:col-span-1 flex-col items-center justify-around py-12 relative pointer-events-none">
            <div className="w-[1px] h-full bg-slate-900 absolute left-1/2 -ml-[0.5px] z-0" />
            <div className="flex flex-col gap-10 items-center w-full relative z-10">
              <div className={`w-3 h-3 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950 ${activatedNodes[`stage-${activeStage.number}-shadow-somatic`] ? 'border-rose-500/80' : 'border-slate-800'}`}>
                <div className={`w-1 h-1 rounded-full ${activatedNodes[`stage-${activeStage.number}-shadow-somatic`] ? 'bg-rose-500 animate-pulse' : 'bg-slate-800'}`} />
              </div>
              <div className={`w-3 h-3 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950 ${activatedNodes[`stage-${activeStage.number}-shadow-coping`] ? 'border-amber-500/80' : 'border-slate-800'}`}>
                <div className={`w-1 h-1 rounded-full ${activatedNodes[`stage-${activeStage.number}-shadow-coping`] ? 'bg-amber-500 animate-pulse' : 'bg-slate-800'}`} />
              </div>
              <div className={`w-3 h-3 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950 ${activatedNodes[`stage-${activeStage.number}-shadow-integration`] ? 'border-orange-500/80' : 'border-slate-800'}`}>
                <div className={`w-1 h-1 rounded-full ${activatedNodes[`stage-${activeStage.number}-shadow-integration`] ? 'bg-orange-500 animate-pulse' : 'bg-slate-800'}`} />
              </div>
            </div>
          </div>

          {/* COLUMN 3: Core Gate Junction Node (Cols 6 & 7) */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col justify-center items-center p-2 relative z-10">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-[1px] bg-slate-900 z-0" />
            
            <button
              type="button"
              onClick={() => {
                const centerKey = `stage-${activeStage.number}-core`;
                setSelectedNodeKey(centerKey);
                playBeep(440, 'triangle', 0.1);
              }}
              className={`p-3.5 rounded-full border flex flex-col items-center justify-center relative z-10 cursor-pointer transition-all duration-300 ${
                selectedNodeKey === `stage-${activeStage.number}-core`
                  ? 'bg-gradient-to-br from-indigo-900 via-[#0d1527] to-purple-900 border-[#6366f1] ring-4 ring-indigo-500/30 scale-105'
                  : 'bg-slate-950 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
              } w-18 h-18 text-center text-white`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute top-1.5 animate-ping" />
              <Brain className="w-6 h-6 text-indigo-400 stroke-[2] animate-[bounce_2s_infinite]" />
              <span className="text-[7.5px] font-black uppercase font-mono tracking-widest text-[#a5b4fc] block mt-1">GATE</span>
              <span className="text-[7.5px] font-mono text-slate-500">{activeStage.years.split('–')[0]}</span>
            </button>
          </div>

          {/* COLUMN 4: Symmetrical Flow Connectors Right (Col 8) */}
          <div className="hidden md:flex md:col-span-1 flex-col items-center justify-around py-12 relative pointer-events-none">
            <div className="w-[1px] h-full bg-slate-900 absolute left-1/2 -ml-[0.5px] z-0" />
            <div className="flex flex-col gap-10 items-center w-full relative z-10">
              <div className={`w-3 h-3 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950 ${activatedNodes[`stage-${activeStage.number}-growth-child`] ? 'border-teal-500/80' : 'border-slate-800'}`}>
                <div className={`w-1 h-1 rounded-full ${activatedNodes[`stage-${activeStage.number}-growth-child`] ? 'bg-teal-500 animate-pulse' : 'bg-slate-800'}`} />
              </div>
              <div className={`w-3 h-3 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950 ${activatedNodes[`stage-${activeStage.number}-growth-parent`] ? 'border-emerald-500/80' : 'border-slate-800'}`}>
                <div className={`w-1 h-1 rounded-full ${activatedNodes[`stage-${activeStage.number}-growth-parent`] ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`} />
              </div>
              <div className={`w-3 h-3 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950 ${activatedNodes[`stage-${activeStage.number}-growth-virtue`] ? 'border-sky-500/80' : 'border-slate-800'}`}>
                <div className={`w-1 h-1 rounded-full ${activatedNodes[`stage-${activeStage.number}-growth-virtue`] ? 'bg-sky-500 animate-pulse' : 'bg-slate-800'}`} />
              </div>
            </div>
          </div>

          {/* COLUMN 5: Growth Track (Cols 9 to 11) */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 relative z-10 p-2 border-l border-slate-900/50">
            <div className="flex items-center gap-1.5 border-b border-emerald-950/40 pb-2 mb-1.5">
              <HeartHandshake className="w-4 h-4 text-[#10b981]" />
              <div>
                <span className="text-[10px] font-black font-mono tracking-widest text-[#10b981] block uppercase">RE-PARENTING PATH</span>
                <span className="text-[8px] text-slate-500 font-mono">Practices that build this stage's virtue</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { type: 'innerChildHealing', label: "Inner Child Rescripting I", keySuffix: "growth-child", bg: "hover:border-teal-500/50 border-teal-950/60", hoverText: "text-teal-400", activeBg: "bg-teal-950/40 border-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.25)] text-teal-200" },
                { type: 'nurturingParent', label: "Parent Container II", keySuffix: "growth-parent", bg: "hover:border-emerald-500/50 border-emerald-950/60", hoverText: "text-emerald-400", activeBg: "bg-emerald-950/40 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.25)] text-emerald-200" },
                { type: 'virtueIntegration', label: "Virtue Forge III", keySuffix: "growth-virtue", bg: "hover:border-sky-500/50 border-sky-950/60", hoverText: "text-sky-400", activeBg: "bg-sky-950/40 border-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.25)] text-sky-200" },
              ].map((item, idx) => {
                const nodeKey = `stage-${activeStage.number}-${item.keySuffix}`;
                const isSelected = selectedNodeKey === nodeKey;
                const isActivated = activatedNodes[nodeKey];
                const nodeData = currentReparenting?.growthBranch[item.type as keyof typeof currentReparenting.growthBranch];

                return (
                  <button
                    key={nodeKey}
                    type="button"
                    onClick={() => {
                      setSelectedNodeKey(nodeKey);
                      playBeep(480 + (idx * 20), 'sine', 0.08);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition relative cursor-pointer group flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-900 border-white text-white z-20 scale-102 ring-2 ring-emerald-500/20' 
                        : isActivated 
                          ? item.activeBg 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider font-bold opacity-75">{item.label}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${isActivated ? 'bg-emerald-400 animate-ping' : 'bg-slate-800'}`} />
                    </div>
                    <div className="mt-1">
                      <h4 className={`text-xs font-black truncate ${isSelected ? 'text-white' : isActivated ? 'text-emerald-100 font-bold' : 'text-slate-300'}`}>
                        {nodeData?.title || "Loading..."}
                      </h4>
                      <p className="text-[9px] text-[#94a3b8] line-clamp-1 leading-none mt-0.5">{nodeData?.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- Decryption Inspection Terminal --- */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedNodeKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden text-left text-slate-200"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />
            
            {/* Decryption top metadata */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-3 mb-4">
              <div>
                <span className={`text-[8px] font-black font-mono px-2 py-0.5 rounded uppercase ${
                  isInspectedNodeCore 
                    ? 'bg-indigo-500/10 text-[#a5b4fc] border border-indigo-950' 
                    : selectedNodeKey.includes('-shadow-')
                      ? 'bg-rose-950/40 text-rose-300 border border-rose-900/50'
                      : 'bg-[#064e3b]/40 text-[#a7f3d0] border border-emerald-900/50'
                }`}>
                  {activeInspectedNode.subtitle}
                </span>
                <h4 className="text-sm font-black text-white tracking-tight mt-1">
                  {activeInspectedNode.title}
                </h4>
              </div>
              
              {!isInspectedNodeCore && (
                <button
                  type="button"
                  onClick={() => handleToggleNode(selectedNodeKey)}
                  className={`py-2 px-4 rounded-xl text-[9px] font-mono uppercase font-black tracking-widest cursor-pointer transition flex items-center gap-2 active:scale-95 shadow ${
                    isInspectedNodeActivated 
                      ? 'bg-[#059669] hover:bg-[#047857] text-[#e6fbf3] shadow-emerald-990/20' 
                      : 'bg-slate-900 hover:bg-slate-800 hover:text-white text-[#94a3b8] border border-slate-800'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isInspectedNodeActivated ? 'text-white' : 'text-slate-500'}`} />
                  {isInspectedNodeActivated ? "STABILIZED ✓ (TAP RE-CALIBRATE)" : "RUN SOMATIC RE-PARENTING ENGINE"}
                </button>
              )}
            </div>

            {/* Description and Diagnostic Insight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Psychological Diagnosis</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {activeInspectedNode.description}
                  </p>
                </div>
                {activeInspectedNode.insight && (
                  <div className="p-3 bg-[#0a0e1a]/60 border border-slate-900 rounded-xl">
                    <span className="text-[8px] font-mono text-[#6366f1] uppercase tracking-widest block font-bold leading-none mb-1">Clinical Insight</span>
                    <p className="text-[10px] sm:text-[11px] text-[#94a3b8] italic font-semibold leading-relaxed">
                      "{activeInspectedNode.insight}"
                    </p>
                  </div>
                )}
              </div>

              {/* Somatic Action Module & Affirmation */}
              <div className="space-y-4 bg-slate-900/40 p-4 border border-slate-900 rounded-xl relative leading-relaxed">
                <div className="space-y-1.5">
                  <span className="text-[8.5px] font-mono text-cyan-400 uppercase tracking-widest block font-black flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-pulse" /> SOMATIC RE-CONSTITUTION PRACTICE
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-200 font-semibold leading-relaxed">
                    {activeInspectedNode.somaticExercise}
                  </p>
                </div>

                {activeInspectedNode.affirmation && (
                  <div className="border-t border-slate-900/80 pt-3 flex items-start gap-2.5">
                    <HeartHandshake className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[7.5px] font-mono text-indigo-400 uppercase tracking-widest block font-bold leading-none mb-1">Self-Parenting Script</span>
                      <p className="text-[10.5px] sm:text-xs text-indigo-200 font-black italic select-text">
                        "{activeInspectedNode.affirmation}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- In-App Self Assessment Survey Simulator --- */}
      <AnimatePresence>
        {assessmentStep > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-3xl text-left relative overflow-hidden"
          >
            <div className="absolute right-4 top-4">
              <button
                onClick={() => {
                  setAssessmentStep(0);
                  playBeep(320, 'sine', 0.08);
                }}
                className="text-xs text-indigo-500 hover:text-indigo-800 font-black cursor-pointer uppercase font-mono bg-white px-2.5 py-1 rounded-xl border border-indigo-100"
              >
                Cancel
              </button>
            </div>

            <span className="text-[8px] bg-indigo-200 text-indigo-800 px-2.5 py-0.5 rounded-full font-black uppercase font-mono">
              STAGE RESOLUTION SELF-ASSESSMENT
            </span>

            {assessmentStep <= 8 ? (
              <div className="mt-3 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-indigo-900 bg-white border border-indigo-200 w-7 h-7 rounded-full flex items-center justify-center">
                    {assessmentStep}
                  </span>
                  <div className="text-left">
                    <h4 className="text-xs font-black text-slate-800">
                      Evaluating Stage: <strong className="text-indigo-700">{ERIKSON_STAGES[assessmentStep - 1]?.name}</strong>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Existential Question: "{ERIKSON_STAGES[assessmentStep - 1]?.existentialQuestion}"
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-indigo-100">
                  <p className="text-xs font-extrabold text-slate-700 mb-3">
                    Rate how integrated and safe this stage's virtue (Hope, Will, Purpose, Competence, Fidelity) feels inside your current behavior loops:
                  </p>

                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { val: 1, label: "⚠️ Severe Stagnation / Constant Shame" },
                      { val: 2, label: "💧 Weak Integration" },
                      { val: 3, label: "⚖️ Average Balance" },
                      { val: 4, label: "📈 Solid Attachment" },
                      { val: 5, label: "🌟 High Virtue Mastery" }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleAssessmentAnswer(opt.val)}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 text-center cursor-pointer transition flex flex-col justify-between items-center h-[75px]"
                      >
                        <span className="text-xs font-black font-mono text-indigo-900">{opt.val}</span>
                        <span className="text-[8px] font-black uppercase text-slate-500 leading-snug group-hover:text-indigo-800 leading-tight">
                          {opt.label.split('/')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-left">
                <div className="bg-white p-4 rounded-3xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full font-black uppercase block w-max leading-none">
                      ASSESSMENT COMPLETED!
                    </span>
                    <h4 className="text-sm font-black text-slate-900">
                      Identified Active Developmental Conflict: <strong className="text-indigo-700">{assessmentResult}</strong>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      This stage reflects the highest balance of un-integrated trauma, guilt, role confusion, or loneliness. We have set this as your Workspace lifespan focus.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setAssessmentStep(0);
                      playBeep(520, 'sine', 0.08);
                    }}
                    className="py-2 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase tracking-widest font-black rounded-xl cursor-pointer shadow-xs transition"
                  >
                    Load Integrated Tools
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Two-Column Core Layout: Current Stage analysis & Active logs --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* LEFT COLUMN (5 Cls): Current Selected Stage Deep Analysis */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-3xs space-y-4">
            
            {/* Stage Title Info */}
            <div className="space-y-1">
              <span className="text-[9px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-black font-mono">
                {activeStage.years} • {activeStage.crisis} Crisis
              </span>
              <h3 className="font-display text-base font-black text-slate-900 mt-1.5 flex items-center justify-between">
                <span>Stage {activeStage.number}: {activeStage.name}</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase font-black font-mono">
                  {activeStage.virtue}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono italic font-bold">
                Existential Axis: "{activeStage.existentialQuestion}"
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-700 tracking-wider">🌟 Lifespan Goal Achievement</span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">{activeStage.description}</p>
              </div>

              <div className="space-y-1 border-t border-slate-100 pt-3">
                <span className="text-[9px] font-black uppercase text-rose-800 tracking-wider block">⚠️ Stagnation Risk: {activeStage.stagnationLabel}</span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">{activeStage.stagnationDesc}</p>
              </div>
            </div>

            {/* Create Conflict Entry Button */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[9px] font-black uppercase text-slate-400">Log Developmental Conflict</span>
              </div>
              
              <form onSubmit={handleLogConflict} className="space-y-2">
                <textarea
                  required
                  value={personalConflictInput}
                  onChange={(e) => setPersonalConflictInput(e.target.value)}
                  placeholder={`Describe a conflict matching "${activeStage.name.split('vs.')[0]}" in your lifespan. (e.g. fear of starting, shame, boundary defaults)...`}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded-xl resize-none h-[88px] font-semibold"
                />
                
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition shadow-xs cursor-pointer active:scale-97"
                >
                  Initiate Developmental Reflection Log
                </button>
              </form>
            </div>

          </div>

          {/* Theoretical Growth Exercises Preview */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg border border-slate-950 space-y-4">
            <span className="text-[8.5px] font-mono text-cyan-400 font-black uppercase tracking-wider block">
              💡 Theoretical Practice Framework
            </span>
            <div className="space-y-3.5">
              {activeStage.behavioralExercises.map((ex, idx) => (
                <div key={idx} className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-slate-300 font-black font-mono">EXERCISE #{idx+1}</span>
                    <span className="text-[8px] bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-black px-1.5 py-0.5 rounded uppercase">
                      {ex.operantType}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white">{ex.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold mt-1">{ex.description}</p>
                  
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                    <span className="text-[7.5px] font-mono uppercase text-sky-400 block font-black">Operant Strategy:</span>
                    <p className="text-[9.5px] text-slate-300 italic font-medium leading-relaxed">{ex.strategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (7 Cls): Active Developmental Logs & Interactive Exercises */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
              DEVELOPMENTAL WORKSPACE LOGS ({conflictLogs.length})
            </span>
            {conflictLogs.length > 0 && (
              <span className="text-[9px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-extrabold font-mono">
                ATTACHED TO CLINICAL WORKSPACE
              </span>
            )}
          </div>

          {conflictLogs.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-slate-100 shadow-sm">
                <BookmarkCheck className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-xs font-bold text-slate-800">No active developmental reflections registered</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  Select a lifespan stage from the life-path grid above, write your developmental crisis details, and tap "Initiate" to build interactive exercises.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {conflictLogs.map((log) => {
                const stageRef = ERIKSON_STAGES.find(s => s.number === log.stageNumber) || activeStage;
                
                return (
                  <div key={log.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-3xs p-5 space-y-4">
                    
                    {/* Header bar of log */}
                    <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3">
                      <div className="text-left">
                        <span className="text-[8.5px] text-indigo-700 font-black font-mono uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          STAGE {log.stageNumber}: {log.stageName.split('vs')[0]}
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-semibold font-mono block mt-1.5">
                          Initialized on {log.createdDate}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteConflictLog(log.id)}
                        className="py-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[8.5px] font-black uppercase rounded-lg transition cursor-pointer"
                      >
                        Abandon Reflection
                      </button>
                    </div>

                    {/* Conflict description */}
                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-200/20 text-left">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">REGISTERED DEVELOPMENTAL CONFLICT</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-bold italic">
                        "{log.conflictDescription}"
                      </p>
                    </div>

                    {/* GROWTH REFLECTION CHANNELS */}
                    <div className="space-y-2.5 border-t border-slate-100 pt-3.5">
                      <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest block">
                        Phase 1: Cognitive Growth Reflections Checklist
                      </span>

                      <div className="space-y-2">
                        {stageRef.growthReflections.map((ref, idx) => {
                          const isDone = !!log.completedReflections[idx];
                          const curAnswer = log.loggedAnswers[idx] || '';

                          return (
                            <div key={idx} className="bg-slate-50 border border-slate-100/75 rounded-2xl p-3">
                              <div className="flex items-start gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => toggleReflectionCheck(log.id, idx)}
                                  className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 transition cursor-pointer active:scale-90 ${
                                    isDone 
                                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                                      : 'border-slate-300 hover:border-indigo-500 bg-white'
                                  }`}
                                >
                                  {isDone && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                                <div className="text-left flex-1 min-w-0">
                                  <p className={`text-xs font-semibold leading-relaxed ${isDone ? 'text-slate-400 italic line-through' : 'text-slate-800'}`}>
                                    {ref}
                                  </p>

                                  {/* Answer TextArea input */}
                                  <div className="mt-2 text-left">
                                    <textarea
                                      value={curAnswer}
                                      onChange={(e) => handleSaveReflectionAnswer(log.id, idx, e.target.value)}
                                      placeholder="Reflect vulnerably here... (Saves automatically)"
                                      className="w-full text-[11px] p-2 bg-white rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-200 h-12 resize-none leading-relaxed font-semibold"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ENROLLED BEHAVIORAL EXERCISES PROGRESSION */}
                    <div className="space-y-2.5 border-t border-slate-100 pt-3.5 text-left">
                      <span className="text-[9px] font-black uppercase text-purple-700 tracking-widest block">
                        Phase 2: Enrolled Behavioral Conditioning Tasks
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stageRef.behavioralExercises.map((ex, idx) => {
                          const isEnrolled = !!log.exerciseEnrollment[idx];
                          const currentCompletes = log.exerciseCompletions[idx] || 0;

                          return (
                            <div key={idx} className={`p-3 rounded-2xl border transition text-left space-y-2 ${
                              isEnrolled 
                                ? 'bg-purple-50/15 border-purple-200 shadow-3xs' 
                                : 'bg-slate-50 border-slate-100'
                            }`}>
                              <div className="flex justify-between items-center">
                                <span className="text-[7.5px] font-black uppercase font-mono text-slate-400">EXERCISE {idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => toggleExerciseEnrollment(log.id, idx)}
                                  className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black transition cursor-pointer select-none ${
                                    isEnrolled
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                      : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200'
                                  }`}
                                >
                                  {isEnrolled ? "✓ Enrolled" : "Enroll"}
                                </button>
                              </div>

                              <div>
                                <h5 className="text-[11px] font-black text-slate-900 leading-tight">{ex.title}</h5>
                                <p className="text-[9.5px] text-slate-400 mt-1 leading-relaxed font-semibold italic">{ex.description}</p>
                              </div>

                              {isEnrolled && (
                                <div className="mt-2 bg-white p-2.5 rounded-xl border border-purple-100/60 flex items-center justify-between gap-1">
                                  <div>
                                    <span className="text-[7.5px] font-black text-slate-400 uppercase font-mono leading-none block">Logged Completions</span>
                                    <span className="text-xs font-black text-purple-950 font-mono mt-0.5 block">{currentCompletes} repetitions</span>
                                  </div>

                                  <button
                                    onClick={() => triggerExerciseRepetition(log.id, idx)}
                                    className="py-1 px-2.5 bg-purple-600 hover:bg-purple-500 active:scale-95 transition text-white text-[8px] uppercase tracking-wider font-extrabold rounded-lg font-mono flex items-center gap-1 cursor-pointer"
                                  >
                                    <Star className="w-3 h-3 fill-current text-white animate-spin-slow" />
                                    <span>Log Step</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* --- Clinical Theory Summary Banner --- */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-left">
        <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0 shadow-3xs">
          <BookOpen className="w-5.5 h-5.5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono">DEVELOPMENTAL CLINICAL MECHANISMS</h4>
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-relaxed">
            By connecting classical developmental psychology (Erikson's 8 lifespan phases) with physical behavioral conditioning (operant reinforcement variable ratios), clinical seekers can actively re-parent cellular neural networks, strengthening myelinated traces while extinguishing lifelong stagnation triggers.
          </p>
        </div>
      </div>

    </div>
  );
}
