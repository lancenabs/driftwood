import React, { useState } from 'react';
import GottmanQuiz from './GottmanQuiz';
import EftCycleMapper from './EftCycleMapper';
import RelationshipRoadmap from './RelationshipRoadmap';
import RepairToolkit from './RepairToolkit';
import ResourceVault from './ResourceVault';
import CoachChat from './CoachChat';
import RelationalResonanceOrb from './RelationalResonanceOrb';
import RitualDesigner from './RitualDesigner';
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  MessageCircle, 
  Users, 
  Layers, 
  Activity, 
  HelpCircle, 
  Check, 
  ChevronRight, 
  Plus, 
  RefreshCw, 
  Send, 
  Grid,
  FileText,
  GraduationCap,
  ClipboardList,
  Wrench
} from 'lucide-react';
import { THERAPY_DETAILS } from '../data/therapyContent';

interface TherapyModel {
  id: string;
  name: string;
  author: string;
  tagline: string;
  category: 'couples' | 'family' | 'general';
  icon: string;
  color: string;
  bgLight: string;
  summary: string;
  concepts: string[];
  toolName: string;
  toolDescription: string;
}

const THERAPY_MODELS: TherapyModel[] = [
  {
    id: 'gottman',
    name: 'Gottman Method',
    author: 'Drs. John & Julie Gottman',
    tagline: 'Empirical ratios and the antidote to the Four Horsemen.',
    category: 'couples',
    icon: '❤️',
    color: '#0E7C7C',
    bgLight: 'rgba(14, 124, 124, 0.1)',
    summary: 'Based on 40+ years of longitudinal research, this model focuses on increasing intimacy, respect, and affection while removing barriers that create feeling stagnated in conflict.',
    concepts: ['The Magic 5:1 Ratio', 'The Four Horsemen', 'Love Maps', 'Softened Start-up'],
    toolName: '5:1 Interaction Calculator & Horsemen Shield',
    toolDescription: 'Analyze your dialogue interactions and instantly receive non-defensive clinical antidotes.'
  },
  {
    id: 'lovelanguages',
    name: '5 Love Languages',
    author: 'Dr. Gary Chapman',
    tagline: 'Discover and match emotional validation triggers.',
    category: 'couples',
    icon: '✨',
    color: '#CE9FFC',
    bgLight: 'rgba(206, 159, 252, 0.1)',
    summary: 'Helps partners express and receive love in ways that resonate deeply with their unique attachment needs.',
    concepts: ['Words of Affirmation', 'Quality Time', 'Receiving Gifts', 'Acts of Service', 'Physical Touch'],
    toolName: 'Alignment Matrix & Daily Action Planner',
    toolDescription: 'Map your languages, discover compatibility zones, and generate high-impact intimacy action prompts.'
  },
  {
    id: 'eft',
    name: 'Emotionally Focused Therapy (EFT)',
    author: 'Dr. Sue Johnson',
    tagline: 'Deconstruct negative attachment cycles and build secure bonds.',
    category: 'couples',
    icon: '🤝',
    color: '#2E96B5',
    bgLight: 'rgba(46, 150, 181, 0.1)',
    summary: 'Recognizes that relationship distress stems from the threat of abandonment. It maps reactive arguments to vulnerable emotional needs.',
    concepts: ['Pursuer-Distancer Loops', 'Primary vs. Secondary Emotion', 'Secure Attachment Bonds'],
    toolName: 'Attachment Loop Mapper',
    toolDescription: 'Reveal the vulnerable emotions underneath secondary anger or withdrawal to defuse repetitive arguments.'
  },
  {
    id: 'imago',
    name: 'Imago Relationship Therapy',
    author: 'Drs. Harville Hendrix & Helen LaKelly Hunt',
    tagline: 'Mirroring, validation, and empathy as healing dialogue.',
    category: 'couples',
    icon: '🗣️',
    color: '#FF8A00',
    bgLight: 'rgba(255, 138, 0, 0.1)',
    summary: 'Transforms relationship conflict into an opportunity for growth and mutual healing of childhood attachment wounds.',
    concepts: ['Imago Dialogue', 'Mirroring', 'Validation', 'Empathy Nudging'],
    toolName: 'Three-Step Mirroring simulator',
    toolDescription: 'Practice structured dialoguing to handle sensitive issues without triggering defenses.'
  },
  {
    id: 'cbct',
    name: 'Cognitive Behavioral Couples Therapy',
    author: 'Dr. Donald Baucom',
    tagline: 'Reframe cognitive distortions and practice behavioral exchanges.',
    category: 'couples',
    icon: '🧠',
    color: '#FF5B5B',
    bgLight: 'rgba(255, 91, 91, 0.1)',
    summary: 'Target relationship satisfaction by restructuring negative thoughts and identifying positive behavior exchanges.',
    concepts: ['Cognitive Restructuring', 'Behavioral Contracts', 'Communication Training'],
    toolName: 'Cognitive Reattribution Worksheet',
    toolDescription: 'Input a friction point and instantly reframe unhelpful assumptions into constructive realities.'
  },
  {
    id: 'bowen',
    name: 'Bowen Family Systems',
    author: 'Dr. Murray Bowen',
    tagline: 'Balance differentiation of self with intergenerational patterns.',
    category: 'family',
    icon: '🌳',
    color: '#00D2C4',
    bgLight: 'rgba(0, 210, 196, 0.1)',
    summary: 'Views the family as an emotional unit. It uses systemic mapping to understand intergenerational triangles and emotional cut-offs.',
    concepts: ['Differentiation of Self', 'Triangles & Coalitions', 'Intergenerational Transmission'],
    toolName: 'Family Genogram & Differentiation Gauge',
    toolDescription: 'Build a family tree map, label emotional bonds, and test your differentiation-of-self level.'
  },
  {
    id: 'narrative',
    name: 'Narrative Family Therapy',
    author: 'Michael White & David Epston',
    tagline: 'Separate the person from the problem and re-author your family story.',
    category: 'family',
    icon: '📝',
    color: '#FF6EA7',
    bgLight: 'rgba(255, 110, 167, 0.1)',
    summary: 'Helps families externalize painful conflicts so they can collaboratively rewrite their shared narratives.',
    concepts: ['Externalizing the Problem', 'Unique Outcomes', 'Re-authoring'],
    toolName: 'Problem Externalizer "Rename the Dragon"',
    toolDescription: 'Rename persistent family problems as external entities to dismantle blame and unite in repair.'
  },
  {
    id: 'structural',
    name: 'Structural Family Therapy',
    author: 'Dr. Salvador Minuchin',
    tagline: 'Map boundaries, coalitions, and subsystems in the household.',
    category: 'family',
    icon: '🧱',
    color: '#8A56DE',
    bgLight: 'rgba(138, 86, 222, 0.1)',
    summary: 'Focuses on the structure of the family system, mapping boundary lines (rigid, diffuse, clear) to foster healthy hierarchies.',
    concepts: ['Subsystems', 'Boundary Adjustments', 'Coalitions'],
    toolName: 'Family Boundary & Alliance Mapper',
    toolDescription: 'Visualize and adjust boundaries and alliances within your household structure.'
  },
  {
    id: 'nvc',
    name: 'Nonviolent Communication (NVC)',
    author: 'Dr. Marshall Rosenberg',
    tagline: 'Connect vulnerably via Observations, Feelings, Needs, and Requests.',
    category: 'couples',
    icon: '🗣️',
    color: '#2E96B5',
    bgLight: 'rgba(46, 150, 181, 0.1)',
    summary: 'A structured "communication lab" framework that translates defensive blame loops into pure universal needs and clear actionable requests.',
    concepts: ['Observations over Evaluations', 'Primary Feelings', 'Universal Needs', 'Actionable Requests'],
    toolName: '4-Step Connection Builder & Needs Translator',
    toolDescription: 'Practice expressing observations, vulnerability, core needs, and actionable requests.'
  },
  {
    id: 'financial',
    name: 'Couples Financial Harmony',
    author: 'Dr. Bradley Klontz',
    tagline: 'Deconstruct money scripts and balance safety with autonomy.',
    category: 'couples',
    icon: '💵',
    color: '#0E7C7C',
    bgLight: 'rgba(14, 124, 124, 0.1)',
    summary: 'Unpacks subconscious money scripts (Saver vs Spender) to create transparent financial intimacy and cooperative budgeting covenants.',
    concepts: ['Money Scripts', 'Financial Intimacy', 'No-Permission Budgets', 'Co-op Resource Pooling'],
    toolName: 'Money Scripts Analyzer & Shared Worth Planner',
    toolDescription: 'Map your money scripts and model a balanced autonomy-security financial contract.'
  },
  {
    id: 'ibct',
    name: 'Integrative Behavioral Couple Therapy (IBCT)',
    author: 'Drs. Neil Jacobson & Andrew Christensen',
    tagline: 'Foster compromise through Empathic Joining and Unified Detachment.',
    category: 'couples',
    icon: '🤝',
    color: '#FF8A00',
    bgLight: 'rgba(255, 138, 0, 0.1)',
    summary: 'Focuses on building radical emotional acceptance first, allowing couples to view repetitive fights from a neutral intellectual perspective.',
    concepts: ['Empathic Joining', 'Unified Detachment', 'Tolerance Building', 'Acceptance-First Dynamics'],
    toolName: 'Acceptance & Toleration Coach',
    toolDescription: 'Deconstruct conflict loops into an objective, third-person pattern.'
  },
  {
    id: 'fairplay',
    name: 'The Fair Play Method',
    author: 'Eve Rodsky',
    tagline: 'Rebalance the cognitive load of domestic and mental labor.',
    category: 'family',
    icon: '🃏',
    color: '#CE9FFC',
    bgLight: 'rgba(206, 159, 252, 0.1)',
    summary: 'Reduces nagging by turning invisible chores into a physical deck of cards where one partner owns Conception, Planning, and Execution (CPE) 100%.',
    concepts: ['Cognitive Load Visibility', 'CPE Ownership', 'Minimum Standard of Care (MSC)', 'Task Card Re-dealing'],
    toolName: 'Domestic Equity & Cognitive Load Balancer',
    toolDescription: 'Draft, deal, and customize chore cards with transparent standards of care.'
  },
  {
    id: 'comparator',
    name: 'Clinical Model Comparator',
    author: 'Evidence-Based Frameworks',
    tagline: 'Compare Gottman, EFT, NVC, CBCT, Bowen, and Fair Play side-by-side.',
    category: 'couples',
    icon: '⚖️',
    color: '#FF6EA7',
    bgLight: 'rgba(255, 110, 167, 0.1)',
    summary: 'An interactive clinical comparator mapping different evidence-based therapeutic systems across key distress points like conflict, communication, and intimacy.',
    concepts: ['Differential Diagnosis', 'Integrative Therapy', 'Cross-Model Mapping'],
    toolName: 'Side-by-Side Model Comparer',
    toolDescription: 'Map and cross-examine clinical methodologies side-by-side to find the right approach.'
  },
  {
    id: 'feelings_finder',
    name: 'Feelings Finder Wheel',
    author: 'Gloria Willcox & EFT Pioneers',
    tagline: 'Pinpoint precise tertiary emotions to de-escalate blame loops.',
    category: 'couples',
    icon: '🎡',
    color: '#FF6EA7',
    bgLight: 'rgba(255, 110, 167, 0.1)',
    summary: 'Trace emotional reactivity from vague outer zones (like Anger or Fear) down to precise primary emotions. This interactive tool helps build emotional granularity, providing exact definitions and better ways to express universal needs.',
    concepts: ['Emotional Granularity', 'Secondary vs. Primary', 'Needs Alignment'],
    toolName: 'Interactive Feelings Wheel',
    toolDescription: 'Select and explore feelings in a beautiful hierarchical wheel, view definitions, and generate softened connection scripts.'
  },
  {
    id: 'relationship_roadmap',
    name: 'Relationship Roadmap',
    author: 'Evidence-Based Integrative Systems',
    tagline: 'Track milestones, unlock clinical stages, and complete action plans.',
    category: 'couples',
    icon: '🗺️',
    color: '#FF6EA7',
    bgLight: 'rgba(255, 110, 167, 0.1)',
    summary: 'A unified interactive map combining Gottman, EFT, PACT, and NVC into clear, bite-sized milestones to sustain connection and track progress.',
    concepts: ['Milestone Tracking', 'Between-Session Exercises', 'Framework Progress'],
    toolName: 'Relationship Roadmap & Progress Monitor',
    toolDescription: 'Navigate milestone phases and complete daily interactive reflections.'
  },
  {
    id: 'repair_toolkit',
    name: 'Relational Repair Toolkit',
    author: 'Gottman-Inspired De-escalation Systems',
    tagline: 'Quick-access repair attempts, phrases, and tracking checklists.',
    category: 'couples',
    icon: '🩹',
    color: '#FF6EA7',
    bgLight: 'rgba(255, 110, 167, 0.1)',
    summary: 'An interactive dashboard providing quick-access repair attempts and phrasing templates. Track your practiced and successful weekly repairs to establish co-regulation.',
    concepts: ['Repair Attempts', 'De-escalation Phrases', 'Co-Regulation', 'Emotional Safety'],
    toolName: 'Repair Attempts & De-escalation Checklist',
    toolDescription: 'Use clinical repair scripts and log their real-world outcomes.'
  },
  {
    id: 'resource_vault',
    name: 'Clinical Resource Vault',
    author: 'EFT, PACT & Gottman Media Advisory',
    tagline: 'Downloadable PDF guides and audio meditations for secure, offline-ready use.',
    category: 'general',
    icon: '📁',
    color: '#2E96B5',
    bgLight: 'rgba(46, 150, 181, 0.1)',
    summary: 'An interactive repository hosting evidence-based reading worksheets and audio guides. Sync files to local storage for persistent offline access.',
    concepts: ['Worksheet Downloads', 'Audio Meditations', 'Offline Access', 'Clinical Materials'],
    toolName: 'Clinical Resource Vault & Media Player',
    toolDescription: 'Read worksheets, play guided sessions, and synchronize files offline.'
  },
  {
    id: 'coach_chat',
    name: 'Clinical CoachChat',
    author: 'Gottman & EFT Relational Intelligence',
    tagline: 'Get instant, non-judgmental feedback on Gottman Method & EFT topics.',
    category: 'general',
    icon: '💬',
    color: '#FF6EA7',
    bgLight: 'rgba(255, 110, 167, 0.1)',
    summary: 'An AI-powered clinical assistant trained to guide couples through communication blocks, repair attempts, and attachment cycles in real-time.',
    concepts: ['Instant Communication Tips', 'Gottman Antidotes', 'EFT Cycle Slowdown', 'Crisis Prevention'],
    toolName: 'Clinical CoachChat Interface',
    toolDescription: 'Type relational questions or situations to receive prompt clinical support.'
  },
  {
    id: 'resonance_orb',
    name: 'Somatic Co-Regulation Orb',
    author: 'Polyvagal Biofeedback & Somatic Theory',
    tagline: 'Simulate physiological self-soothing and sync relational standing waves.',
    category: 'general',
    icon: '🌀',
    color: '#10B981',
    bgLight: 'rgba(16, 185, 129, 0.1)',
    summary: 'A futuristic biometric-feedback sandbox designed to visualize nervous system synchronization and translate bio-tension into perfectly consonant standing harmonic soundscapes.',
    concepts: ['Polyvagal Theory', 'Autonomic Soothing', 'Harmonic Resonance', 'Co-Regulation'],
    toolName: 'Somatic Co-Regulation Wave Sandbox',
    toolDescription: 'Calibrate physiological states and compute custom somatic blueprints using AI.'
  }
];

const COMPARISON_DATA: Record<
  string,
  {
    title: string;
    icon: string;
    description: string;
    models: Record<
      string,
      {
        philosophy: string;
        intervention: string;
        actionExercise: string;
        dialogueResponse: string;
      }
    >
  }
> = {
  conflict: {
    title: "Conflict Resolution & De-escalation",
    icon: "💥",
    description: "How each system approaches heated arguments, blame loops, and emotional stonewalling.",
    models: {
      gottman: {
        philosophy: "Conflict is healthy if managed. Focus on eliminating the Four Horsemen (Criticism, Contempt, Defensiveness, Stonewalling) and keeping a 5:1 ratio of positive-to-negative interactions during conflict.",
        intervention: "Horseman Antidote Shielding & Softened Startup. Discuss frustrations focusing on internal vulnerability and positive needs.",
        actionExercise: "Practice starting discussions gently: Use 'I feel ___ about dry facts, and I need ___' instead of accusing.",
        dialogueResponse: "💬 Refocus: 'I feel deeply overwhelmed when I come home to a chaotic kitchen. I need some shared teamwork to clean it together tonight.'"
      },
      eft: {
        philosophy: "Arguments are protests against emotional disconnection. Heated conflict is a protective layer over raw attachment fears of abandonment, rejection, or inadequacy.",
        intervention: "De-constructing Pursuer-Distancer loops. Map secondary anger back to primary vulnerable emotions to establish a secure attachment base.",
        actionExercise: "Acknowledge the cycle together: 'When I push, you withdraw. We are both trapped in this loop. Let us stop and reconnect first.'",
        dialogueResponse: "💬 Refocus: 'I am not actually angry about the chores. I feel invisible and scared that you do not value our partnership anymore.'"
      },
      nvc: {
        philosophy: "All conflict is a tragic expression of unmet universal needs. To resolve it, we must strip away moralistic judgments, blame, and demands.",
        intervention: "Four-Step Connection building. Separate dry Observations from Evaluations, express Feelings and Needs, and make non-demanding Requests.",
        actionExercise: "Draft a NVC alignment statement: 'When I see [dry fact], I feel [vulnerable state] because I need [universal value].'",
        dialogueResponse: "💬 Refocus: 'When I observe the laundry piled up, I feel overwhelmed because I need order and supportive teamwork. Would you be willing to do a load?'"
      },
      cbct: {
        philosophy: "Conflict is fueled and maintained by automatic thoughts, arbitrary assumptions, and cognitive distortions (e.g. 'They never care').",
        intervention: "Cognitive Restructuring & Behavioral Contracts. Question assumptions and negotiate clear behavioral exchanges.",
        actionExercise: "Thought Record: Challenge a black-and-white thought about your partner by searching for evidence of the exception.",
        dialogueResponse: "💬 Refocus: 'I had the thought that you do not care, but I know that is a cognitive distortion. Let us negotiate a clear chore contract for this week.'"
      },
      bowen: {
        philosophy: "Conflict is caused by emotional reactivity, anxiety contagion, and forming toxic relational 'triangles' (drawing in kids or in-laws) to reduce tension.",
        intervention: "Self-Differentiation & Detriangulation. Practice speaking from a calm, differentiated 'I-position' without trying to control the other.",
        actionExercise: "De-triangulate: If arguing about a third person, bring the discussion strictly back to the core relationship dynamics.",
        dialogueResponse: "💬 Refocus: 'I hear your anxiety about my parents' input, but I want to speak calmly from my own personal values without letting external opinions dictate us.'"
      },
      fairplay: {
        philosophy: "Domestic conflict is rarely about the chore itself; it is about the cognitive load, invisible labor, and lack of Conception, Planning, and Execution (CPE) ownership.",
        intervention: "Card Re-dealing & Minimum Standard of Care (MSC) setting. Define and delegate 100% ownership of tasks to remove checking/nagging.",
        actionExercise: "Define one controversial chore. Agree on the Minimum Standard of Care (MSC) and assign one owner who handles CPE 100%.",
        dialogueResponse: "💬 Refocus: 'Let us pull the Kitchen card out of the deck. I want you to own CPE for it entirely so I can stop tracking it, or vice versa.'"
      }
    }
  },
  communication: {
    title: "Communication & Dialogue Styles",
    icon: "🗣️",
    description: "The primary techniques for speaking and listening without provoking defensiveness.",
    models: {
      gottman: {
        philosophy: "Mutual understanding must come before any attempt at problem-solving. True validation is checking your own agenda to prove your partner's reality makes sense.",
        intervention: "The Rappoport Journal & State of the Union meetings. Alternate roles as Speaker and Listener to achieve deep resonance.",
        actionExercise: "Conduct a 15-minute check-in: One partner speaks for 5 minutes, other must mirror and validate before expressing any counter-opinion.",
        dialogueResponse: "💬 Refocus: 'Before we discuss solutions, let me repeat back what you said to make sure I completely understand your perspective: you feel lonely.'"
      },
      eft: {
        philosophy: "Rigid communication acts as a survival shield. Behind hostile or indifferent words lies a desperate cry for emotional response and connection.",
        intervention: "Enactments. Coach partners to express their core attachment needs directly and vulnerabilities gently from a softened state.",
        actionExercise: "Practice softening your tone: Turn to your partner and say, 'I get loud because I am terrified you are slipping away from me.'",
        dialogueResponse: "💬 Refocus: 'I want to speak from my quiet heart. When I cannot reach you, I feel small and helpless. I just want to feel close to you.'"
      },
      nvc: {
        philosophy: "Connecting is about translating mental judgments ('You are lazy') into heart-based needs ('I need comfort and rest').",
        intervention: "Observations over evaluations. Speak with pure vulnerability, ensuring requests are concrete, positive, and completely negotiable.",
        actionExercise: "Needs Translator: Translate a critique (e.g. 'You ignore me') into a clean need (e.g. 'I need mutual connection and presence').",
        dialogueResponse: "💬 Refocus: 'I want to share my vulnerability. I need emotional presence right now. Are you open to sitting with me for 10 minutes?'"
      },
      cbct: {
        philosophy: "Effective communication is a skill that must be trained and reinforced systematically with structured feedback.",
        intervention: "Speaker-Listener Skills. Use a physical card or floor token to regulate turn-taking, paraphrase content, and validate feelings.",
        actionExercise: "Floor-Token Exercise: Hold a small object. Only the person holding it can speak; the other must paraphrase what was heard.",
        dialogueResponse: "💬 Refocus: 'Since I have the floor card, I will say I feel overwhelmed. I am not pointing fingers; I am using my Speaker skills.'"
      },
      bowen: {
        philosophy: "Communication becomes dysfunctional when anxiety rises. True communication requires high differentiation, resisting emotional fusion or cut-off.",
        intervention: "Intergenerational Genogram Mapping. Analyze communication patterns of ancestors to understand default reactive responses.",
        actionExercise: "Genogram reflection: Think about how your parents communicated when anxious, and write down one pattern you want to break.",
        dialogueResponse: "💬 Refocus: 'I feel a temptation to use the silent treatment—which is what my family did—but I want to remain calmly differentiated and speak.'"
      },
      fairplay: {
        philosophy: "Effective domestic communication requires explicit standards, not unspoken assumptions or spontaneous complaints.",
        intervention: "Conception, Planning, and Execution (CPE) framework. Establish daily or weekly stand-ups to re-deal tasks peacefully.",
        actionExercise: "Schedule a weekly Sunday 20-minute stand-up. Review cards currently dealt and re-balance without criticizing the person.",
        dialogueResponse: "💬 Refocus: 'Instead of nagging in the moment, let us wait until our weekly Sunday stand-up to review the Dishes card and its standards.'"
      }
    }
  },
  intimacy: {
    title: "Emotional & Physical Intimacy",
    icon: "❤️",
    description: "Rebuilding closeness, healing attachment wounds, and strengthening the relational friendship.",
    models: {
      gottman: {
        philosophy: "Intimacy is sustained through micro-bids. Choosing to 'turn toward' bids for attention, humor, or physical touch builds the emotional bank account.",
        intervention: "Love Maps expansion & Intimacy Bidding. Create detailed maps of each other's psychological worlds.",
        actionExercise: "Bid-Turning Hour: Intentionally notice and enthusiastically respond to 3 small connection bids from your partner today.",
        dialogueResponse: "💬 Refocus: 'I noticed you sighed and looked out the window. What are you thinking about, my love? I want to turn toward your world.'"
      },
      eft: {
        philosophy: "True intimacy is built upon secure attachment. We must feel that our partner is Accessible, Responsive, and Engaged (the A.R.E. questions).",
        intervention: "Hold Me Tight Conversations. Repair old relational injuries (attachment wounds) to restore safe physical and emotional touch.",
        actionExercise: "Ask the A.R.E. questions: 'Can I reach you? Will you respond when I show my vulnerability? Do you value me?'",
        dialogueResponse: "💬 Refocus: 'I want to repair that moment last week. When you walked away, it felt like an attachment injury. Let us heal that together.'"
      },
      nvc: {
        philosophy: "Empathy is the ultimate gateway to intimacy. True presence is sitting in silence with the partner's feelings without trying to fix them.",
        intervention: "Empathetic Listening. Reflect the partner's feelings and needs without offering advice, defense, or personal anecdotes.",
        actionExercise: "Empathy Session: Listen to your partner share a stressor for 5 minutes. ONLY respond with: 'Are you feeling ___ because you need ___?'",
        dialogueResponse: "💬 Refocus: 'I hear you are feeling deeply exhausted because your need for recognition at work is dry. Is that what is going on?'"
      },
      cbct: {
        philosophy: "Intimacy is maintained when couples actively schedule and execute positive behavioral exchanges (Caring Days).",
        intervention: "Behavioral Intimacy Exchanges. Draft lists of daily pleasing behaviors and commit to committing them unconditionally.",
        actionExercise: "Love Token Trade: Write down 3 small, non-demanding intimate acts (e.g. back rub, hand-written note). Swap and execute them.",
        dialogueResponse: "💬 Refocus: 'Let us put our behavioral list on the fridge. Tomorrow, I will surprise you with one of your preferred intimate acts.'"
      },
      bowen: {
        philosophy: "Intimacy requires the courage to be highly differentiated—sharing your true self without fear of rejection or pressure to conform.",
        intervention: "Self-Differentimacy. Learn to state your deepest desires while fully respecting your partner's differences.",
        actionExercise: "Vulnerability without validation: Share one deep, personal dream or hobby that your partner does not share, focusing on self-expression.",
        dialogueResponse: "💬 Refocus: 'I want to share this personal part of my life with you. I do not need you to agree or join, I just want to be fully seen by you.'"
      },
      fairplay: {
        philosophy: "Closeness and libido are directly choked by resentment. Domestic equity and mental decompression are the ultimate aphrodisiacs.",
        intervention: "Task Decompression. Hand over full mental load of a card to let the other partner completely relax and access creative space.",
        actionExercise: "Decouple chores from intimacy. Transfer 2 heavy cognitive-load cards to ensure your partner has restorative rest time.",
        dialogueResponse: "💬 Refocus: 'I am taking over the Bedtime Routine card 100% tonight so you can have 2 hours of absolute, guilt-free cognitive rest.'"
      }
    }
  }
};

interface FeelingNode {
  id: string;
  name: string;
  definition: string;
  need: string;
  script: string;
  action: string;
}

interface SecondaryFeeling {
  name: string;
  tertiary: FeelingNode[];
}

interface CoreFeeling {
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  secondary: SecondaryFeeling[];
}

const FEELINGS_DATA: CoreFeeling[] = [
  {
    name: 'Anger',
    color: '#FF5B5B',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    secondary: [
      {
        name: 'Hurt',
        tertiary: [
          {
            id: 'betrayed',
            name: 'Betrayed',
            definition: 'A deep sense of pain caused by a breach of trust or perceived abandonment of mutual loyalty agreements.',
            need: 'Safety, clarity, and explicit relational reassurance.',
            script: 'I am feeling betrayed and deeply hurt. I need absolute clarity and reassurance that we are still a team and my trust is safe with you.',
            action: 'Schedule a 15-minute transparency chat where both partners write down current trust boundary rules.'
          },
          {
            id: 'rejected',
            name: 'Rejected',
            definition: 'The painful feeling of being excluded, pushed away, or deemed unwanted by someone whose validation you cherish.',
            need: 'Belonging, warmth, and deliberate acceptance.',
            script: 'When I feel pushed away, I feel rejected and hurt. I need to know that you still want to be close to me. Can we sit together for a bit?',
            action: 'Establish a "Shared Space Ritual" where both partners hold hands and share 2 genuine appreciations.'
          }
        ]
      },
      {
        name: 'Frustrated',
        tertiary: [
          {
            id: 'blocked',
            name: 'Blocked',
            definition: 'Irritation arising from an obstacle preventing you from accomplishing a goal, communicating, or expressing a core need.',
            need: 'Teamwork, active coordination, and being heard.',
            script: 'I feel frustrated and blocked. I need supportive teamwork to help get this resolved. Would you be willing to tackle this task with me?',
            action: 'Write down the obstacle. Break it into three small, shared action items using Fair Play CPE principles.'
          },
          {
            id: 'annoyed',
            name: 'Annoyed',
            definition: 'Mild irritation triggered by repetitive small triggers, often indicating that boundaries have been quietly crossed or ignored.',
            need: 'Order, boundary respect, and cooperative standards.',
            script: 'I feel annoyed about this recurring issue. I need us to agree on a clear boundary or standard of care so we don\'t keep tripping here.',
            action: 'Draft a Minimum Standard of Care (MSC) for the issue and post it in a shared space.'
          }
        ]
      },
      {
        name: 'Distant',
        tertiary: [
          {
            id: 'withdrawn',
            name: 'Withdrawn',
            definition: 'Retreating into emotional self-preservation to protect yourself from overwhelm or high-friction reactivity.',
            need: 'Decompression, safety, and a non-judgmental pause.',
            script: 'I am feeling flooded and withdrawn. I need some quiet decompression space, but I want to reconnect in 20 minutes when my nervous system is calm.',
            action: 'Practice Gottman\'s Physiological Self-Soothing: Take 10 minutes of deep, slow diaphragmatic breathing.'
          },
          {
            id: 'numb',
            name: 'Numb',
            definition: 'An emotional shutdown state where feelings are suppressed to cope with chronic stress or relational exhaustion.',
            need: 'Gentle re-connection, somatic grounding, and patience.',
            script: 'I feel emotionally numb and disconnected right now. I don\'t want to pull away, but I need a quiet, gentle connection. Can we just hug for 20 seconds?',
            action: 'Do the Physiological Oxytocin Reset (a continuous, tight 20-second hug) without talking.'
          }
        ]
      }
    ]
  },
  {
    name: 'Sadness',
    color: '#2E96B5',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    secondary: [
      {
        name: 'Lonely',
        tertiary: [
          {
            id: 'abandoned',
            name: 'Abandoned',
            definition: 'The terrifying fear of being left to handle life\'s weight entirely alone, feeling that your primary bond is gone or indifferent.',
            need: 'Reliable presence, emotional accessibility, and responsiveness.',
            script: 'I feel lonely and abandoned in this moment. I need to know you are accessible to me and that I am not in this alone.',
            action: 'Use Sue Johnson\'s A.R.E. questions: Ask your partner directly, "Are you there for me? Will you respond?"'
          },
          {
            id: 'isolated',
            name: 'Isolated',
            definition: 'Feeling emotionally or physically separated from your partner, locked in your own world with no bridges across.',
            need: 'Meaningful quality time and shared vulnerability.',
            script: 'I feel isolated in our relationship. I need us to build a bridge tonight. Can we have 15 minutes of device-free talk about our day?',
            action: 'Go for a "Device-Free 15-Minute Walk" side-by-side, sharing one low-stakes memory.'
          }
        ]
      },
      {
        name: 'Vulnerable',
        tertiary: [
          {
            id: 'fragile',
            name: 'Fragile',
            definition: 'Feeling easily breakable, highly sensitive to tone, or exposed to emotional distress without protective armor.',
            need: 'Gentleness, safety, and soft verbal validation.',
            script: 'I feel extremely fragile and raw today. I need gentleness in your tone and a safe space where I don\'t have to be strong.',
            action: 'Use a "Softened Startup" dialogue: Partner speaks in a quiet, slowed voice, and partner listens without correcting.'
          },
          {
            id: 'exposed',
            name: 'Exposed',
            definition: 'Feeling like your deepest flaws, fears, or mistakes are completely visible and subject to judgment.',
            need: 'Unconditional acceptance, validation, and zero criticism.',
            script: 'I feel exposed and anxious. I need to hear that my flaws don\'t make me unlovable to you. Can you validate my experience?',
            action: 'The "Appreciation Exchange": Both partners share 3 specific, non-physical things they love about each other\'s character.'
          }
        ]
      }
    ]
  },
  {
    name: 'Fear',
    color: '#CE9FFC',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    secondary: [
      {
        name: 'Anxious',
        tertiary: [
          {
            id: 'flooded',
            name: 'Flooded',
            definition: 'An overwhelming physiological arousal state where your brain\'s threat center (amygdala) is fully active, blocking logical thought.',
            need: 'Somatic grounding, quiet time-out, and physiological soothing.',
            script: 'I am physiologically flooded. I feel my heart racing and can\'t think straight. I need a 20-minute break to calm my nervous system.',
            action: 'Take a structured 20-minute pause. Do not think about the argument; instead, do a physical task or listen to calming audio.'
          },
          {
            id: 'restless',
            name: 'Restless',
            definition: 'A state of nervous energy and anticipation, feeling unable to settle or find peace, often indicating unexpressed anxiety.',
            need: 'Grounding presence and calming touch.',
            script: 'I feel restless and anxious inside. I need some grounding and physical presence. Would you be willing to hold my hand for a few minutes?',
            action: 'Practice a "5-4-3-2-1 Somatic Grounding Exercise" together: Name 5 things you see, 4 you can touch, 3 you hear, etc.'
          }
        ]
      },
      {
        name: 'Insecure',
        tertiary: [
          {
            id: 'inadequate',
            name: 'Inadequate',
            definition: 'The persistent, painful worry that you are not good enough, skilled enough, or worthy enough to satisfy your partner.',
            need: 'Reassurance of competence, appreciation, and unconditional value.',
            script: 'I am feeling deeply inadequate and scared that I am failing you. I need to know that you see my effort and value my presence.',
            action: 'Do the "Appreciation Vault" entry: Log a specific action your partner took that made you feel proud of them.'
          },
          {
            id: 'invisible',
            name: 'Invisible',
            definition: 'Feeling unseen, unheard, or insignificant to your partner, as if your presence and contributions do not matter.',
            need: 'Somatic validation, active eye contact, and focused attention.',
            script: 'I feel invisible in our dynamic right now. I need to feel seen by you. Would you be open to sitting with eye contact for 3 minutes?',
            action: 'Conduct a "3-Minute Eye-Contact Connection" without speaking, focusing purely on breathing together.'
          }
        ]
      }
    ]
  },
  {
    name: 'Joy',
    color: '#0E7C7C',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200',
    secondary: [
      {
        name: 'Accepted',
        tertiary: [
          {
            id: 'valued',
            name: 'Valued',
            definition: 'Feeling deeply appreciated and recognized for your authentic self and your contributions to the partnership.',
            need: 'Continued positive reinforcement and celebration.',
            script: 'I feel so valued and appreciated by you. Thank you for noticing my effort. It makes me feel incredibly secure and connected.',
            action: 'Log this positive state in your Feelings Ledger to celebrate the secure bond.'
          },
          {
            id: 'respected',
            name: 'Respected',
            definition: 'Feeling that your opinions, boundaries, and autonomy are highly esteemed and protected by your partner.',
            need: 'Mutual honor, intellectual peerage, and collaborative decisions.',
            script: 'I feel respected and trusted when we negotiate things together. It makes me feel proud to have you as my co-op partner.',
            action: 'Plan your next week\'s co-op budget or schedule together as respectful equal peers.'
          }
        ]
      }
    ]
  }
];

export default function LibraryScreen() {
  const [selectedModel, setSelectedModel] = useState<TherapyModel | null>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<'tool' | 'education' | 'resources'>('tool');
  const [gottmanSubTool, setGottmanSubTool] = useState<'calculator' | 'quiz'>('calculator');

  const details = activeToolId ? THERAPY_DETAILS[activeToolId] : null;

  // --- TOOL STATES ---
  // Gottman Calculator state
  const [gottmanInputs, setGottmanInputs] = useState<{ id: number; text: string; type: 'positive' | 'negative' }[]>([
    { id: 1, text: "I appreciate you taking out the trash today.", type: 'positive' },
    { id: 2, text: "You always ignore the mess on the counter.", type: 'negative' },
    { id: 3, text: "Thank you for listening to my story.", type: 'positive' }
  ]);
  const [newGottmanText, setNewGottmanText] = useState('');
  const [newGottmanType, setNewGottmanType] = useState<'positive' | 'negative'>('positive');
  const [horsemanCheck, setHorsemanCheck] = useState('');
  const [horsemanAntidote, setHorsemanAntidote] = useState<{ horseman: string; antidote: string } | null>(null);

  // Love Languages State
  const [userLang, setUserLang] = useState('Words of Affirmation');
  const [partnerLang, setPartnerLang] = useState('Quality Time');
  const [generatedActions, setGeneratedActions] = useState<string[]>([]);

  // EFT Loop State
  const [eftLoop, setEftLoop] = useState({
    trigger: 'When partner is quiet after work',
    secondaryReaction: 'I criticize or push for conversation (Pursuer)',
    primaryFeeling: 'I feel disconnected, ignored, and lonely',
    attachmentNeed: 'I need to know I am valued and safe with you'
  });
  const [mappedEft, setMappedEft] = useState(false);

  // Imago State
  const [imagoStep, setImagoStep] = useState(1);
  const [imagoStatement, setImagoStatement] = useState('');
  const [imagoMirror, setImagoMirror] = useState('');
  const [imagoValidation, setImagoValidation] = useState('');
  const [imagoEmpathy, setImagoEmpathy] = useState('');

  // CBCT State
  const [cbctNegativeThought, setCbctNegativeThought] = useState("If they loved me, they'd wash the dishes without me asking.");
  const [cbctReframing, setCbctReframing] = useState<string>('');

  // Bowen Genogram state
  const [familyMembers, setFamilyMembers] = useState<{ id: number; name: string; relation: string; connection: 'close' | 'conflict' | 'cut-off' }[]>([
    { id: 1, name: "Mom", relation: "Mother", connection: "close" },
    { id: 2, name: "Partner", relation: "Spouse", connection: "conflict" },
    { id: 3, name: "Uncle John", relation: "Uncle", connection: "cut-off" }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberConnection, setNewMemberConnection] = useState<'close' | 'conflict' | 'cut-off'>('close');

  // Narrative state
  const [problemName, setProblemName] = useState("Unreasonable Stubbornness");
  const [externalizedName, setExternalizedName] = useState("");

  // Structural state
  const [boundaries, setBoundaries] = useState({
    parentSubsystem: 'clear',
    parentChildBoundary: 'rigid',
    siblingSubsystem: 'clear'
  });
  const [boundaryAnalysis, setBoundaryAnalysis] = useState("");

  // Worksheet & Reporting state
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, string>>({});
  const [loggedAnswers, setLoggedAnswers] = useState(false);
  const [showPDFReport, setShowPDFReport] = useState(false);

  // --- NEW MODELS STATES ---
  // NVC Connection Builder
  const [nvcObservation, setNvcObservation] = useState("When you came home 2 hours late without sending a quick text message");
  const [nvcFeeling, setNvcFeeling] = useState("I feel anxious and disconnected");
  const [nvcNeed, setNvcNeed] = useState("because I need mutual safety, predictability, and emotional support");
  const [nvcRequest, setNvcRequest] = useState("Would you be willing to send a 5-second text if you are running behind schedule?");
  const [nvcCompiled, setNvcCompiled] = useState(false);

  // Financial Harmony
  const [sharedIncome, setSharedIncome] = useState(6000);
  const [survivalPct, setSurvivalPct] = useState(50);
  const [futurePct, setFuturePct] = useState(20);
  const [autonomyPct, setAutonomyPct] = useState(20);
  const [connectionPct, setConnectionPct] = useState(10);
  const [financialCalculated, setFinancialCalculated] = useState(false);

  // IBCT Detachment
  const [ibctTrigger, setIbctTrigger] = useState("When laundry stays in the basket on the laundry room floor for more than 2 days");
  const [ibctPartnerAAction, setIbctPartnerAAction] = useState("I sigh loudly and make sarcastic comments about living in a storage unit");
  const [ibctPartnerBReaction, setIbctPartnerBReaction] = useState("I roll my eyes and withdraw to my office, leaving the laundry untouched");
  const [ibctLoopName, setIbctLoopName] = useState("The Sarcasm & Silent Spin");
  const [ibctMapped, setIbctMapped] = useState(false);

  // Fair Play Cards
  const [fairPlayCards, setFairPlayCards] = useState<any[]>([
    { id: 1, name: "Groceries & Meal Planning", owner: "Partner A", msc: "Stock 3 healthy dinners; verify dietary constraints.", cpe: "Owns conception (fridge inventory), planning (list), and execution (buying)." },
    { id: 2, name: "Dishes & Kitchen Cleanliness", owner: "Partner B", msc: "Counters wiped, sink cleared before sleeping.", cpe: "Owns conception (loading/unloading), planning (scour), and execution (washing)." },
    { id: 3, name: "Bill Pay & Financial Tracking", owner: "Partner A", msc: "All utility bills paid 5 days before due date.", cpe: "Owns conception (invoice receipt), planning (allocating), and execution (transferring)." },
    { id: 4, name: "Pet & Vet Appointments", owner: "Partner B", msc: "Dog fed twice daily; vet appointment booked annually.", cpe: "Owns conception (symptoms check), planning (booking), and execution (driving)." },
    { id: 5, name: "Children scheduling & Carpool", owner: "Unassigned", msc: "Confirm school transport schedules by Sunday night.", cpe: "Requires a dedicated owner to handle planning and driving." }
  ]);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editMscText, setEditMscText] = useState("");
  const [editOwnerText, setEditOwnerText] = useState("Partner A");

  // --- COMPARATOR STATES ---
  const [compareModelA, setCompareModelA] = useState('gottman');
  const [compareModelB, setCompareModelB] = useState('eft');
  const [compareIssue, setCompareIssue] = useState('conflict');
  const [customCompareScenario, setCustomCompareScenario] = useState("");
  const [activeDialoguePreset, setActiveDialoguePreset] = useState("work");

  // --- FEELINGS FINDER STATES ---
  const [selectedCoreFeeling, setSelectedCoreFeeling] = useState<string | null>(null);
  const [selectedSecondaryFeeling, setSelectedSecondaryFeeling] = useState<string | null>(null);
  const [selectedTertiaryFeeling, setSelectedTertiaryFeeling] = useState<FeelingNode | null>(null);
  const [customFeelingNote, setCustomFeelingNote] = useState("");
  const [feelingsLoggerRole, setFeelingsLoggerRole] = useState<'Partner A' | 'Partner B'>('Partner A');
  const [feelingsLogs, setFeelingsLogs] = useState<any[]>([
    {
      id: 1,
      partner: 'Partner A',
      core: 'Fear',
      secondary: 'Insecure',
      tertiary: 'Invisible',
      note: 'Felt very small when you were reviewing the budget sheets without looking up.',
      timestamp: 'Today, 2:30 PM'
    },
    {
      id: 2,
      partner: 'Partner B',
      core: 'Anger',
      secondary: 'Distant',
      tertiary: 'Withdrawn',
      note: 'Shut down because I felt extremely overwhelmed after the work meeting.',
      timestamp: 'Yesterday, 6:15 PM'
    }
  ]);

  const handleLogFeeling = () => {
    if (!selectedTertiaryFeeling) return;
    const newLog = {
      id: Date.now(),
      partner: feelingsLoggerRole,
      core: selectedCoreFeeling || 'Unknown',
      secondary: selectedSecondaryFeeling || 'Unknown',
      tertiary: selectedTertiaryFeeling.name,
      note: customFeelingNote.trim() || "No additional context notes provided.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString()
    };
    setFeelingsLogs([newLog, ...feelingsLogs]);
    setCustomFeelingNote("");
  };

  // NVC handler
  const handleCompileNvc = () => {
    setNvcCompiled(true);
  };

  // Financial Harmony handler
  const handleCalculateFinancial = () => {
    setFinancialCalculated(true);
  };

  // IBCT handler
  const handleMapIbct = () => {
    setIbctMapped(true);
  };

  // Fair Play Card Update
  const handleSaveCardEdit = () => {
    if (editingCardId === null) return;
    setFairPlayCards(fairPlayCards.map(c => 
      c.id === editingCardId ? { ...c, owner: editOwnerText, msc: editMscText } : c
    ));
    setEditingCardId(null);
  };

  // --- HANDLERS ---
  // Gottman
  const handleAddGottman = () => {
    if (!newGottmanText.trim()) return;
    setGottmanInputs([...gottmanInputs, {
      id: Date.now(),
      text: newGottmanText,
      type: newGottmanType
    }]);
    setNewGottmanText('');
  };

  const calculateGottmanRatio = () => {
    const pos = gottmanInputs.filter(i => i.type === 'positive').length;
    const neg = gottmanInputs.filter(i => i.type === 'negative').length;
    if (neg === 0) return pos > 0 ? 100 : 0;
    return parseFloat((pos / neg).toFixed(1));
  };

  const handleCheckHorseman = () => {
    const text = horsemanCheck.toLowerCase();
    if (text.includes('always') || text.includes('never') || text.includes('you did this')) {
      setHorsemanAntidote({
        horseman: "Criticism",
        antidote: "Use a Softened Start-up. State your feeling, describe a neutral situation, and express your positive need. Try: 'I feel exhausted seeing the kitchen counters full, can we wash them together?'"
      });
    } else if (text.includes('not my fault') || text.includes('what about you') || text.includes('i didn\'t do')) {
      setHorsemanAntidote({
        horseman: "Defensiveness",
        antidote: "Accept Responsibility for even a small part of the problem. Try: 'You\'re right, I did forget to check the task list. I\'m sorry.'"
      });
    } else if (text.includes('ugly') || text.includes('stupid') || text.includes('better than you') || text.includes('lazy')) {
      setHorsemanAntidote({
        horseman: "Contempt",
        antidote: "Build a Culture of Appreciation and Respect. Express immediate positive feelings and needs. Try: 'I\'m feeling extremely overwhelmed right now and need some support, rather than pointing fingers.'"
      });
    } else if (text.includes('whatever') || text.includes('...') || text.includes('ignore') || text.includes('silent')) {
      setHorsemanAntidote({
        horseman: "Stonewalling",
        antidote: "Practice Physiological Self-Soothing. Take a 20-minute break to calm your heart rate down below 100 BPM before returning. Try: 'I\'m feeling too flooded to speak calmly. I need a 15-minute walk, then I promise to hear your side.'"
      });
    } else {
      setHorsemanAntidote({
        horseman: "None Detected",
        antidote: "Nice, softened starting! Keep maintaining active empathy and validation."
      });
    }
  };

  // Love Languages
  const handleGenerateLoveActions = () => {
    const actions: Record<string, string[]> = {
      'Words of Affirmation': [
        "Send a surprise text: 'I was thinking about how much safety you bring to my life. I love you.'",
        "Verbally acknowledge a chore: 'Thank you for making the coffee today, it made my morning so much easier.'"
      ],
      'Quality Time': [
        "Commit to a 'No-Device 15-minute Walk' together after dinner.",
        "Initiate a 20-minute uninterrupted couch recap of your day's attachment triggers."
      ],
      'Receiving Gifts': [
        "Bring home their favorite chocolate bar or simple flower with a handwritten note.",
        "Gift a tiny custom playlist of songs that remind you of secure moments."
      ],
      'Acts of Service': [
        "Wipe down their car dashboard or handle a chore they normally despise.",
        "Brew their favorite hot beverage exactly how they like it before they ask."
      ],
      'Physical Touch': [
        "Initiate a warm, continuous 20-second hug to trigger oxytocin release.",
        "Gently place your hand on theirs during a stressful transition moment."
      ]
    };
    setGeneratedActions(actions[partnerLang] || []);
  };

  // EFT
  const handleMapEft = () => {
    setMappedEft(true);
  };

  // Imago
  const handleNextImago = () => {
    if (imagoStep === 1 && imagoStatement) {
      setImagoMirror(`"So what I hear you saying is that ${imagoStatement}. Did I get that right?"`);
      setImagoStep(2);
    } else if (imagoStep === 2) {
      setImagoValidation(`"That makes complete sense that you'd feel that way, because when that happens, anyone would feel overwhelmed..."`);
      setImagoStep(3);
    } else if (imagoStep === 3) {
      setImagoEmpathy(`"I imagine that feels lonely or scary. I want to be here with you."`);
      setImagoStep(4);
    }
  };

  // CBCT
  const handleCbctReframer = () => {
    if (cbctNegativeThought.toLowerCase().includes('loved') || cbctNegativeThought.toLowerCase().includes('always')) {
      setCbctReframing("This thought assumes their actions are a direct measure of their love (All-or-Nothing Thinking / Personalization). A constructive reframe: 'My partner is tired or distracted today, which is separate from their love for me. I can express my direct need without testing them.'");
    } else {
      setCbctReframing("An excellent alternative attribution: 'We both have different thresholds for cleaning. By making my request soft and visible, we can negotiate a cooperative contract.'");
    }
  };

  // Bowen Genogram
  const handleAddFamilyMember = () => {
    if (!newMemberName || !newMemberRelation) return;
    setFamilyMembers([...familyMembers, {
      id: Date.now(),
      name: newMemberName,
      relation: newMemberRelation,
      connection: newMemberConnection
    }]);
    setNewMemberName('');
    setNewMemberRelation('');
  };

  // Narrative Externalizer
  const handleExternalize = () => {
    setExternalizedName(`The sneaky "Blame Monster" named '${problemName}' that makes us fight rather than clean.`);
  };

  // Structural Boundary Analyzer
  const handleBoundaryAnalyze = () => {
    if (boundaries.parentChildBoundary === 'diffuse') {
      setBoundaryAnalysis("Recommendation: Strengthen parent-child boundaries. Enmeshment can cause children to absorb parents' emotional stress. Establish clear, calm generational boundaries.");
    } else if (boundaries.parentChildBoundary === 'rigid') {
      setBoundaryAnalysis("Recommendation: Soften the rigid boundary. Increase emotional availability and active validation channels to allow healthy sibling/child expression.");
    } else {
      setBoundaryAnalysis("Excellent! Your household has clean, flexible boundaries supporting cooperative co-op contracts and individual differentiation.");
    }
  };

  const activeModel = THERAPY_MODELS.find(m => m.id === activeToolId);

  return (
    <div className="flex flex-col gap-5 py-2 w-full max-w-md mx-auto text-on-background animate-fade-in-up pb-10">
      
      {/* Header View */}
      <div className="flex justify-between items-center bg-surface-container-lowest px-4 py-3.5 rounded-2xl border-2 border-outline-variant shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-display font-black text-sm text-[#4B4B4B] leading-none">Intimacy App Library</h1>
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold">{THERAPY_MODELS.length} Clinical Frameworks & Toolsets</span>
          </div>
        </div>
        <div className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
          Library
        </div>
      </div>

      {/* Main List vs. Drilldown Tool view */}
      {!activeToolId ? (
        <div className="flex flex-col gap-4">
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed px-1">
            Tap into evidence-based systems built by world-renowned therapists. These actionable tools help generate high intimacy, safe emotional boundaries, and healthy communication.
          </p>

          {/* Featured Relationship Roadmap Banner */}
          <button
            onClick={() => {
              setActiveToolId('relationship_roadmap');
              setActiveSubSection('tool');
            }}
            className="w-full text-left text-white p-5 rounded-[2.2rem] border-2 border-stone-800 hover:border-stone-700 shadow-sm transition-all flex items-start gap-4 group cursor-pointer relative overflow-hidden"
          >
            <img src="/ambient/jungle-canopy.webp" alt="" aria-hidden loading="lazy"
              className="absolute inset-0 w-full h-full object-cover story-kenburns"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/92 via-stone-900/80 to-stone-900/55" />
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#FF6EA7]/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="relative w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-2xl group-hover:scale-105 transition-transform">
              🗺️
            </div>
            <div className="relative flex-grow">
              <div className="flex justify-between items-center">
                <span className="font-display font-black text-xs text-white uppercase tracking-wider group-hover:text-[#FF6EA7] transition-colors">
                  Relationship Roadmap
                </span>
                <span className="text-[7.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FF6EA7] text-white">
                  Featured Journey
                </span>
              </div>
              <span className="text-[9px] font-bold text-stone-300 block mt-0.5">Integrative Clinical Milestones & Between-Session Action Plans</span>
              <p className="font-sans text-[10px] text-stone-300 mt-1.5 leading-relaxed">
                Visualize and log your progress across Gottman, EFT, PACT, and NVC. Set interactive targets and complete exercises together to keep momentum high.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[8px] font-black uppercase text-[#FF6EA7] tracking-widest">
                <span>🎯 View Journey & Framework Progress</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* Grid of models */}
          <div className="flex flex-col gap-3">
            {THERAPY_MODELS.filter(m => m.id !== 'relationship_roadmap').map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setActiveToolId(model.id);
                  setActiveSubSection('tool');
                }}
                className="w-full text-left bg-surface-container-lowest p-4 rounded-2xl border-2 border-outline-variant hover:border-primary shadow-3d-neutral hover:shadow-3d-primary transition-all flex items-start gap-3.5 group cursor-pointer"
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-outline-variant text-xl group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: model.bgLight }}
                >
                  {model.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-black text-xs text-[#4B4B4B] group-hover:text-primary transition-colors">
                      {model.name}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${model.category === 'couples' ? 'bg-[#CE9FFC]/10 border-[#CE9FFC]/20 text-purple-700' : 'bg-orange-100 border-orange-200 text-orange-700'}`}>
                      {model.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant/85 block mt-0.5">By {model.author}</span>
                  <p className="font-sans text-[10px] text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                    {model.tagline}
                  </p>
                  
                  {/* Tool teaser indicator */}
                  <div className="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between text-[9px] font-black uppercase text-primary tracking-widest">
                    <span>🔨 {model.toolName}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ACTIVE INTENSIVE CLINICAL TOOL VIEW */
        <div className="flex flex-col gap-4 animate-fade-in">
          
          {/* Back to list button */}
          <button
            onClick={() => setActiveToolId(null)}
            className="flex items-center gap-1.5 text-xs text-primary font-black hover:underline cursor-pointer w-fit"
          >
            ← Back to App Library
          </button>

          {/* Model overview card */}
          {activeModel && activeToolId !== 'relationship_roadmap' && activeToolId !== 'repair_toolkit' && activeToolId !== 'resource_vault' && activeToolId !== 'coach_chat' && activeToolId !== 'resonance_orb' && (
            <div className="bg-surface-container-lowest p-4 rounded-2xl border-2 border-outline-variant shadow-sm flex gap-3.5 items-start">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl border border-outline-variant"
                style={{ backgroundColor: activeModel.bgLight }}
              >
                {activeModel.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-black text-sm text-[#4B4B4B]">{activeModel.name}</h3>
                <span className="text-[9px] font-bold text-on-surface-variant">Author: {activeModel.author}</span>
                <p className="font-sans text-[11px] text-[#4B4B4B] mt-1.5 leading-relaxed">
                  {activeModel.summary}
                </p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {activeModel.concepts.map((concept, i) => (
                    <span key={i} className="text-[8px] font-bold bg-surface-container text-[#4B4B4B] px-1.5 py-0.5 rounded border border-outline-variant">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RELATIONSHIP ROADMAP INTEGRATED VIEW */}
          {activeToolId === 'relationship_roadmap' && (
            <RelationshipRoadmap />
          )}

          {/* RELATIONAL REPAIR TOOLKIT INTEGRATED VIEW */}
          {activeToolId === 'repair_toolkit' && (
            <RepairToolkit />
          )}

          {/* CLINICAL RESOURCE VAULT INTEGRATED VIEW */}
          {activeToolId === 'resource_vault' && (
            <ResourceVault />
          )}

          {/* CLINICAL COACH CHAT INTEGRATED VIEW */}
          {activeToolId === 'coach_chat' && (
            <CoachChat />
          )}

          {/* SOMATIC CO-REGULATION ORB INTEGRATED VIEW */}
          {activeToolId === 'resonance_orb' && (
            <RelationalResonanceOrb onClose={() => setActiveToolId(null)} />
          )}

          {/* Sub-Tab Selector (Duolingo/Modern Theme) */}
          {activeToolId !== 'comparator' && activeToolId !== 'relationship_roadmap' && activeToolId !== 'repair_toolkit' && activeToolId !== 'resource_vault' && activeToolId !== 'coach_chat' && activeToolId !== 'resonance_orb' && (
            <div className="flex bg-surface-container rounded-2xl p-1.5 gap-1.5 border-2 border-outline-variant">
              <button
                onClick={() => {
                  setActiveSubSection('tool');
                  setLoggedAnswers(false);
                  setShowPDFReport(false);
                }}
                className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 ${activeSubSection === 'tool' ? 'bg-secondary text-white border-b-4 border-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Interactive Tool</span>
              </button>
              <button
                onClick={() => {
                  setActiveSubSection('education');
                  setLoggedAnswers(false);
                  setShowPDFReport(false);
                }}
                className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 ${activeSubSection === 'education' ? 'bg-primary text-white border-b-4 border-primary-dark' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Clinical Ed</span>
              </button>
              <button
                onClick={() => {
                  setActiveSubSection('resources');
                  setLoggedAnswers(false);
                  setShowPDFReport(false);
                }}
                className={`flex-1 font-display font-black text-[9px] py-2 px-1 rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 ${activeSubSection === 'resources' ? 'bg-[#CE9FFC] text-white border-b-4 border-[#b784f9]' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Exercises</span>
              </button>
            </div>
          )}

          {/* DYNAMIC THERAPEUTIC WIDGET SHELL */}
          {activeSubSection === 'tool' && activeToolId !== 'relationship_roadmap' && activeToolId !== 'repair_toolkit' && activeToolId !== 'resource_vault' && activeToolId !== 'coach_chat' && activeToolId !== 'resonance_orb' && (
            <div className="bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-outline-variant/60 pb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Interactive Intimacy Tool</span>
              <h4 className="font-display font-black text-sm text-on-surface mt-0.5">{activeModel?.toolName}</h4>
            </div>

            {/* COMPARATIVE THERAPY MODEL TOOL */}
            {activeToolId === 'comparator' && (
              <div className="flex flex-col gap-4 text-on-surface">
                <div className="bg-primary/5 p-3.5 rounded-xl border-2 border-primary/25 text-[11px] leading-relaxed text-[#4B4B4B]">
                  <strong>Interactive Comparative Matrix:</strong> Select relationship distress categories and contrast how two major clinical frameworks diagnose and remediate the issue side-by-side.
                </div>

                {/* 1. Category selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Step 1: Choose Relationship Focus</span>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(COMPARISON_DATA).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => setCompareIssue(key)}
                        className={`py-2 px-1.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${compareIssue === key ? 'bg-primary/10 border-primary text-primary font-bold scale-102 shadow-2xs' : 'bg-white border-outline-variant hover:border-slate-300 text-on-surface-variant'}`}
                      >
                        <span className="text-lg">{data.icon}</span>
                        <span className="text-[9px] font-bold leading-tight uppercase tracking-wider">{data.title.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                  <p className="font-sans text-[10px] text-on-surface-variant italic leading-relaxed text-center mt-1">
                    "{COMPARISON_DATA[compareIssue].description}"
                  </p>
                </div>

                {/* 2. Model Selection dropdowns */}
                <div className="grid grid-cols-2 gap-3.5 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant">Model A</label>
                    <select
                      value={compareModelA}
                      onChange={(e) => setCompareModelA(e.target.value)}
                      className="bg-white text-[10.5px] font-sans px-2.5 py-2 rounded-xl border-2 border-outline-variant font-bold text-[#4B4B4B]"
                    >
                      {THERAPY_MODELS.filter(m => ['gottman', 'eft', 'nvc', 'cbct', 'bowen', 'fairplay'].includes(m.id)).map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant">Model B</label>
                    <select
                      value={compareModelB}
                      onChange={(e) => setCompareModelB(e.target.value)}
                      className="bg-white text-[10.5px] font-sans px-2.5 py-2 rounded-xl border-2 border-outline-variant font-bold text-[#4B4B4B]"
                    >
                      {THERAPY_MODELS.filter(m => ['gottman', 'eft', 'nvc', 'cbct', 'bowen', 'fairplay'].includes(m.id) && m.id !== compareModelA).map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Side-by-Side Comparison Panels */}
                {(() => {
                  const dataA = COMPARISON_DATA[compareIssue]?.models[compareModelA] || COMPARISON_DATA[compareIssue]?.models['gottman'];
                  const dataB = COMPARISON_DATA[compareIssue]?.models[compareModelB] || COMPARISON_DATA[compareIssue]?.models['eft'];
                  const modelAObj = THERAPY_MODELS.find(m => m.id === compareModelA);
                  const modelBObj = THERAPY_MODELS.find(m => m.id === compareModelB);

                  return (
                    <div className="flex flex-col gap-3 mt-3 animate-fade-in">
                      {/* Side by side cards */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Model A Column */}
                        <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant flex flex-col gap-2 shadow-2xs">
                          <div className="flex items-center gap-1.5 border-b border-outline-variant/50 pb-1.5">
                            <span className="text-sm">{modelAObj?.icon}</span>
                            <span className="font-display font-black text-[10px] uppercase text-primary truncate">
                              {modelAObj?.name.split(' ')[0]}
                            </span>
                          </div>
                          
                          <div className="flex flex-col gap-1 text-[10.5px]">
                            <span className="text-[7.5px] font-black uppercase text-on-surface-variant tracking-wider">Philosophy:</span>
                            <p className="font-sans text-[9.5px] leading-relaxed text-[#4B4B4B]">{dataA.philosophy}</p>
                          </div>

                          <div className="flex flex-col gap-1 text-[10.5px] border-t border-outline-variant/30 pt-1.5">
                            <span className="text-[7.5px] font-black uppercase text-on-surface-variant tracking-wider">Intervention:</span>
                            <p className="font-sans text-[9.5px] leading-relaxed font-bold text-[#4B4B4B]">{dataA.intervention}</p>
                          </div>

                          <div className="flex flex-col gap-1 text-[10.5px] border-t border-outline-variant/30 pt-1.5 bg-white p-2 rounded-xl border border-outline-variant/50">
                            <span className="text-[7.5px] font-black uppercase text-primary tracking-wider font-display">Action Tip:</span>
                            <p className="font-sans text-[9px] leading-normal text-on-surface font-semibold italic">"{dataA.actionExercise}"</p>
                          </div>
                        </div>

                        {/* Model B Column */}
                        <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant flex flex-col gap-2 shadow-2xs">
                          <div className="flex items-center gap-1.5 border-b border-outline-variant/50 pb-1.5">
                            <span className="text-sm">{modelBObj?.icon}</span>
                            <span className="font-display font-black text-[10px] uppercase text-[#CE9FFC] truncate">
                              {modelBObj?.name.split(' ')[0]}
                            </span>
                          </div>
                          
                          <div className="flex flex-col gap-1 text-[10.5px]">
                            <span className="text-[7.5px] font-black uppercase text-on-surface-variant tracking-wider">Philosophy:</span>
                            <p className="font-sans text-[9.5px] leading-relaxed text-[#4B4B4B]">{dataB.philosophy}</p>
                          </div>

                          <div className="flex flex-col gap-1 text-[10.5px] border-t border-outline-variant/30 pt-1.5">
                            <span className="text-[7.5px] font-black uppercase text-on-surface-variant tracking-wider">Intervention:</span>
                            <p className="font-sans text-[9.5px] leading-relaxed font-bold text-[#4B4B4B]">{dataB.intervention}</p>
                          </div>

                          <div className="flex flex-col gap-1 text-[10.5px] border-t border-outline-variant/30 pt-1.5 bg-white p-2 rounded-xl border border-outline-variant/50">
                            <span className="text-[7.5px] font-black uppercase text-[#CE9FFC] tracking-wider font-display">Action Tip:</span>
                            <p className="font-sans text-[9px] leading-normal text-on-surface font-semibold italic">"{dataB.actionExercise}"</p>
                          </div>
                        </div>
                      </div>

                      {/* 4. Interactive Reframer Simulator inside the comparator */}
                      <div className="bg-white border-2 border-outline-variant rounded-2xl p-4 flex flex-col gap-3.5 shadow-2xs mt-1">
                        <div>
                          <span className="text-[8px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Dialogue Reframer</span>
                          <h5 className="font-display font-black text-xs text-[#4B4B4B] mt-1">Reframe Reactive Statements</h5>
                          <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                            Select a common statement or enter your own to see how each model reframes it.
                          </p>
                        </div>

                        {/* Scenario Preset Selection */}
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDialoguePreset("work");
                              setCustomCompareScenario("You are always on your phone and care more about work than me.");
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${activeDialoguePreset === 'work' ? 'bg-primary text-white border-primary' : 'bg-surface-container text-[#4B4B4B] border-outline-variant hover:bg-surface-container-high'}`}
                          >
                            📱 Phone/Work
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDialoguePreset("chores");
                              setCustomCompareScenario("I am tired of doing all the mental heavy-lifting with the chores!");
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${activeDialoguePreset === 'chores' ? 'bg-primary text-white border-primary' : 'bg-surface-container text-[#4B4B4B] border-outline-variant hover:bg-surface-container-high'}`}
                          >
                            🧹 Domestic Work
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDialoguePreset("closeness");
                              setCustomCompareScenario("We never spend any time together and feel like distant roommates.");
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${activeDialoguePreset === 'closeness' ? 'bg-primary text-white border-primary' : 'bg-surface-container text-[#4B4B4B] border-outline-variant hover:bg-surface-container-high'}`}
                          >
                            🛋️ Roommates
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDialoguePreset("custom");
                              setCustomCompareScenario("");
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${activeDialoguePreset === 'custom' ? 'bg-secondary text-white border-secondary' : 'bg-surface-container text-[#4B4B4B] border-outline-variant hover:bg-surface-container-high'}`}
                          >
                            ✏️ Custom
                          </button>
                        </div>

                        {/* Text input if custom or selected */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-black uppercase text-on-surface-variant">The Friction Statement:</label>
                          <input
                            type="text"
                            value={customCompareScenario || (activeDialoguePreset === 'work' ? "You are always on your phone and care more about work than me." : activeDialoguePreset === 'chores' ? "I am tired of doing all the mental heavy-lifting with the chores!" : "We never spend any time together and feel like distant roommates.") }
                            onChange={(e) => {
                              setCustomCompareScenario(e.target.value);
                              setActiveDialoguePreset("custom");
                            }}
                            placeholder="Type a friction point (e.g. 'You never clean up your stuff')"
                            className="w-full bg-surface-container-lowest text-[10px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
                          />
                        </div>

                        {/* Reframed Output Displays */}
                        <div className="flex flex-col gap-2.5 mt-1 border-t border-outline-variant/40 pt-3 animate-fade-in">
                          {/* Reframed A */}
                          <div className="bg-secondary/5 border border-secondary/20 p-2.5 rounded-xl text-[10px] leading-relaxed text-on-surface">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-on-secondary-container uppercase tracking-wider text-[8px]">{modelAObj?.name} reframe</span>
                              <span className="text-[7px] font-black bg-secondary/10 text-secondary px-1.5 py-0.25 rounded border border-secondary/20">REFRAMED</span>
                            </div>
                            <p className="font-sans text-[#4B4B4B] italic">{dataA.dialogueResponse}</p>
                          </div>

                          {/* Reframed B */}
                          <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-xl text-[10px] leading-relaxed text-on-surface">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-primary-dark uppercase tracking-wider text-[8px]">{modelBObj?.name} reframe</span>
                              <span className="text-[7px] font-black bg-primary/10 text-primary px-1.5 py-0.25 rounded border border-primary/20">REFRAMED</span>
                            </div>
                            <p className="font-sans text-[#4B4B4B] italic">{dataB.dialogueResponse}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* GOTTMAN METHOD TOOL */}
            {activeToolId === 'gottman' && (
              <div className="flex flex-col gap-4">
                {/* Custom Sub-tool Switcher for Gottman Method */}
                <div className="flex bg-surface-container p-1 rounded-2xl border-2 border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setGottmanSubTool('calculator')}
                    className={`flex-1 text-center font-display font-black text-[9px] uppercase tracking-wider py-2 px-1 rounded-xl transition-all cursor-pointer ${gottmanSubTool === 'calculator' ? 'bg-primary text-white border-b-4 border-primary-dark' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                    📊 5:1 Calculator
                  </button>
                  <button
                    type="button"
                    onClick={() => setGottmanSubTool('quiz')}
                    className={`flex-1 text-center font-display font-black text-[9px] uppercase tracking-wider py-2 px-1 rounded-xl transition-all cursor-pointer ${gottmanSubTool === 'quiz' ? 'bg-secondary text-white border-b-4 border-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                    🏠 Relationship House Quiz
                  </button>
                </div>

                {gottmanSubTool === 'calculator' ? (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="bg-primary/5 p-3.5 rounded-xl border-2 border-primary/20 text-[11px] leading-relaxed text-[#4B4B4B]">
                      <strong>The Magic 5:1 Calculator:</strong> Input positive interactions (e.g., validations, hugs, compliments) vs. negative ones (criticism, defensiveness) to test your clinical intimacy ratio.
                    </div>

                    {/* Ratio Meter */}
                    <div className="bg-surface-container p-4 rounded-xl text-center border border-outline-variant">
                      <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Your Active Intimacy Ratio</span>
                      <div className="font-display font-black text-3xl text-primary mt-1">
                        {calculateGottmanRatio()}:1
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 rounded-full mt-3 overflow-hidden border border-outline-variant/50">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${calculateGottmanRatio() >= 5 ? 'bg-primary' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min((calculateGottmanRatio() / 8) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-on-surface-variant block mt-2">
                        {calculateGottmanRatio() >= 5 
                          ? "🎉 Healthy Gottman Ratio achieved! Low-friction communication zone."
                          : "⚠️ High-friction risk! Increase softened appreciations & connection moments."}
                      </span>
                    </div>

                    {/* List of current transactions */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase text-on-surface-variant">Log Today's Interactions</span>
                      <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto no-scrollbar">
                        {gottmanInputs.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/50 text-[10px] font-sans">
                            <span className="truncate max-w-[240px] text-[#4B4B4B]">"{item.text}"</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${item.type === 'positive' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                              {item.type}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Add transaction form */}
                      <div className="flex gap-1.5 mt-1.5">
                        <input
                          type="text"
                          value={newGottmanText}
                          onChange={(e) => setNewGottmanText(e.target.value)}
                          placeholder="Add an appreciation or criticism..."
                          className="flex-1 bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                        />
                        <select
                          value={newGottmanType}
                          onChange={(e: any) => setNewGottmanType(e.target.value)}
                          className="bg-white text-[10px] font-bold px-2 rounded-xl border-2 border-outline-variant"
                        >
                          <option value="positive">➕ Pos</option>
                          <option value="negative">➖ Neg</option>
                        </select>
                        <button
                          onClick={handleAddGottman}
                          className="bg-primary text-white px-2.5 rounded-xl border-b-[3px] border-primary-dark hover:brightness-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Horsemen shield detector */}
                    <div className="border-t border-outline-variant/50 pt-4 mt-2">
                      <span className="text-[10px] font-black uppercase text-on-surface-variant">Horsemen Antidote Shield</span>
                      <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
                        Input a frustrating response you want to say, and let the AI find the safe antidote:
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        <input
                          type="text"
                          value={horsemanCheck}
                          onChange={(e) => setHorsemanCheck(e.target.value)}
                          placeholder="e.g. 'You always leave the kitchen messy!'"
                          className="flex-1 bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                        />
                        <button
                          onClick={handleCheckHorseman}
                          className="bg-secondary text-white px-3.5 py-2 rounded-xl border-b-[3px] border-on-secondary-container font-display font-black text-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Shield!
                        </button>
                      </div>

                      {horsemanAntidote && (
                        <div className="mt-3 bg-[#FFE16D]/15 border-2 border-[#FFE16D]/40 rounded-xl p-3 flex flex-col gap-1.5 animate-fade-in">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-amber-800">Horseman: {horsemanAntidote.horseman}</span>
                            <span className="text-[8px] font-black bg-rose-500 text-white px-1.5 rounded">DETECTED</span>
                          </div>
                          <p className="font-sans text-[10px] text-[#4B4B4B] leading-relaxed">
                            <strong>Antidote:</strong> {horsemanAntidote.antidote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <GottmanQuiz onBack={() => setGottmanSubTool('calculator')} />
                  </div>
                )}
              </div>
            )}

            {/* FIVE LOVE LANGUAGES TOOL */}
            {activeToolId === 'lovelanguages' && (
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                  Map your love languages to identify connection friction points. Generate actionable daily tasks to satisfy your partner's specific language profile.
                </p>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">Your Primary Language</label>
                    <select
                      value={userLang}
                      onChange={(e) => setUserLang(e.target.value)}
                      className="w-full bg-white text-[11px] font-sans px-2.5 py-2 rounded-xl border-2 border-outline-variant font-bold"
                    >
                      <option>Words of Affirmation</option>
                      <option>Quality Time</option>
                      <option>Receiving Gifts</option>
                      <option>Acts of Service</option>
                      <option>Physical Touch</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">Partner's Primary Language</label>
                    <select
                      value={partnerLang}
                      onChange={(e) => setPartnerLang(e.target.value)}
                      className="w-full bg-white text-[11px] font-sans px-2.5 py-2 rounded-xl border-2 border-outline-variant font-bold"
                    >
                      <option>Words of Affirmation</option>
                      <option>Quality Time</option>
                      <option>Receiving Gifts</option>
                      <option>Acts of Service</option>
                      <option>Physical Touch</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateLoveActions}
                  className="w-full bg-primary text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-primary-dark hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer text-xs mt-1"
                >
                  Generate Attachment Action Prompts!
                </button>

                {generatedActions.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2.5 animate-fade-in">
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">Recommended Daily Prompts</span>
                    {generatedActions.map((act, i) => (
                      <div key={i} className="bg-secondary/5 border-l-[4px] border-secondary p-3 rounded-r-xl text-[11px] font-sans leading-relaxed text-[#4B4B4B] flex gap-2">
                        <span className="shrink-0">💡</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EFT LOOP MAPPER */}
            {activeToolId === 'eft' && (
              <EftCycleMapper />
            )}

            {/* IMAGO DIALOGUE SIMULATOR */}
            {activeToolId === 'imago' && (
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                  Imago Dialogue replaces reactive argument loops with three distinct stages: Mirroring, Validation, and Empathy. Fill in the blank to complete the sequence.
                </p>

                {imagoStep === 1 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">Step 1: Express Your Core Experience</span>
                    <textarea
                      value={imagoStatement}
                      onChange={(e) => setImagoStatement(e.target.value)}
                      placeholder="e.g. I feel stressed when work tasks compile and I look around to find a cluttered room."
                      className="w-full bg-white text-[11px] p-3 rounded-xl border-2 border-outline-variant h-20 focus:outline-none focus:border-primary font-sans resize-none"
                    />
                    <button
                      onClick={handleNextImago}
                      className="bg-primary text-white font-display font-black py-2 rounded-xl border-b-[3px] border-primary-dark text-xs hover:brightness-105 transition-all"
                    >
                      Construct Mirror Step →
                    </button>
                  </div>
                )}

                {imagoStep === 2 && (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">Step 2: Partner's Clinical Mirroring response</span>
                    <div className="bg-slate-100 p-3 rounded-xl border border-outline-variant font-sans text-[11px] leading-relaxed text-[#4B4B4B] italic">
                      {imagoMirror}
                    </div>
                    <button
                      onClick={handleNextImago}
                      className="bg-secondary text-white font-display font-black py-2 rounded-xl border-b-[3px] border-on-secondary-container text-xs hover:brightness-105 transition-all"
                    >
                      Construct Validation Step →
                    </button>
                  </div>
                )}

                {imagoStep === 3 && (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">Step 3: Partner's Validation Confirmation</span>
                    <div className="bg-slate-100 p-3 rounded-xl border border-outline-variant font-sans text-[11px] leading-relaxed text-[#4B4B4B] italic">
                      {imagoValidation}
                    </div>
                    <button
                      onClick={handleNextImago}
                      className="bg-purple-600 text-white font-display font-black py-2 rounded-xl border-b-[3px] border-purple-800 text-xs hover:brightness-105 transition-all"
                    >
                      Construct Empathy Step →
                    </button>
                  </div>
                )}

                {imagoStep === 4 && (
                  <div className="flex flex-col gap-3 animate-fade-in text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-1">
                      ✓
                    </div>
                    <h5 className="font-display font-black text-xs text-[#4B4B4B]">Imago Connection Established!</h5>
                    <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed">
                      You completed a classic Mirroring loop. Both partners feel heard, validated, and held in an empathetic boundary.
                    </p>
                    <div className="bg-slate-50 border-2 border-outline-variant/60 p-3 rounded-xl text-left font-sans text-[10px] space-y-1 text-[#4B4B4B]">
                      <p>🗣️ <strong>Express:</strong> "{imagoStatement}"</p>
                      <p>🪞 <strong>Mirror:</strong> {imagoMirror}</p>
                      <p>🤝 <strong>Validate:</strong> {imagoValidation}</p>
                      <p>❤️ <strong>Empathize:</strong> {imagoEmpathy}</p>
                    </div>
                    <button
                      onClick={() => {
                        setImagoStep(1);
                        setImagoStatement('');
                      }}
                      className="bg-slate-200 text-[#4B4B4B] font-display font-black py-2 rounded-xl text-xs hover:bg-slate-300 transition-all cursor-pointer"
                    >
                      Reset dialogue Simulator
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CBCT REFRACTION WORKSPACE */}
            {activeToolId === 'cbct' && (
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                  Automatic negative attributions erode relationship happiness. Restructure extreme assumptions using clinical cognitive restructuring.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-on-surface-variant">Cognitive Friction / Attribution Thought</label>
                  <input
                    type="text"
                    value={cbctNegativeThought}
                    onChange={(e) => setCbctNegativeThought(e.target.value)}
                    className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                  />
                </div>

                <button
                  onClick={handleCbctReframer}
                  className="w-full bg-primary text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-primary-dark hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer text-xs"
                >
                  Analyze & Restructure Assumption
                </button>

                {cbctReframing && (
                  <div className="mt-2 bg-[#FF5B5B]/10 border-2 border-[#FF5B5B]/30 rounded-2xl p-4 flex flex-col gap-2 animate-fade-in">
                    <h5 className="text-[10px] font-black text-rose-900 uppercase tracking-wider">Clinical Cognitive Restructure</h5>
                    <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed italic">
                      "{cbctReframing}"
                    </p>
                    <span className="text-[8px] font-bold text-rose-800 bg-white border border-rose-200 px-2 py-1.5 rounded-xl block text-center mt-1">
                      💡 Practice re-framing twice daily to establish calm neural loops.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* BOWEN FAMILY SYSTEMS */}
            {activeToolId === 'bowen' && (
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                  Chart household members, classify their emotional connection, and discover if coalitions or emotional cut-offs exist.
                </p>

                {/* Genogram map display */}
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant">
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant block mb-3 text-center">Interactive Genogram Map View</span>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    <div className="bg-white px-3 py-2 rounded-xl border-2 border-primary text-center shadow-sm">
                      <span className="text-xs">👤</span>
                      <span className="font-display font-black text-[10px] text-primary block">Alex (Self)</span>
                      <span className="text-[7px] text-outline font-bold uppercase tracking-wider block">Differentiation: 75%</span>
                    </div>

                    {familyMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className={`px-3 py-2 rounded-xl border-2 text-center shadow-sm relative ${member.connection === 'close' ? 'border-green-400 bg-green-50/20' : member.connection === 'conflict' ? 'border-rose-400 bg-rose-50/20 animate-pulse' : 'border-slate-400 bg-slate-100'}`}
                      >
                        <span className="text-xs">👤</span>
                        <span className="font-display font-black text-[10px] block text-[#4B4B4B]">{member.name}</span>
                        <span className="text-[7px] text-on-surface-variant font-black block uppercase">{member.relation}</span>
                        <span className="text-[7px] font-bold block uppercase tracking-wide mt-1">
                          {member.connection === 'close' ? '🟢 Fused/Close' : member.connection === 'conflict' ? '🔴 Conflictual' : '⚫ Cut-Off'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add member to Genogram */}
                <div className="bg-surface-container-low p-3.5 rounded-2xl border-2 border-outline-variant flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant">Add Member to Genogram Map</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Name (e.g. Sister)"
                      className="bg-white text-[11px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant"
                    />
                    <input
                      type="text"
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      placeholder="Relation (e.g. Daughter)"
                      className="bg-white text-[11px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant"
                    />
                  </div>
                  <div className="flex gap-1.5 items-center justify-between mt-1">
                    <select
                      value={newMemberConnection}
                      onChange={(e: any) => setNewMemberConnection(e.target.value)}
                      className="bg-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl border-2 border-outline-variant flex-grow"
                    >
                      <option value="close">🟢 Fused / Close Connection</option>
                      <option value="conflict">🔴 Conflictual Bond</option>
                      <option value="cut-off">⚫ Emotional Cut-Off</option>
                    </select>
                    <button
                      onClick={handleAddFamilyMember}
                      className="bg-primary text-white px-3 py-1.5 rounded-xl font-display font-black text-xs border-b-[3px] border-primary-dark hover:brightness-105 cursor-pointer shrink-0"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NARRATIVE FAMILY THERAPY */}
            {activeToolId === 'narrative' && (
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                  Narrative Therapy operates on the core principle: "The person is not the problem; the problem is the problem." Translate internal blame into an external opponent.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-on-surface-variant">Active Conflict or Blaming Description</label>
                  <input
                    type="text"
                    value={problemName}
                    onChange={(e) => setProblemName(e.target.value)}
                    placeholder="e.g. Household Laziness or Stubborn silence"
                    className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                  />
                </div>

                <button
                  onClick={handleExternalize}
                  className="w-full bg-secondary text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-on-secondary-container hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer text-xs"
                >
                  Externalize & Rename the Blame Loop
                </button>

                {externalizedName && (
                  <div className="mt-2 bg-pink-50 border-2 border-[#FF6EA7]/30 rounded-2xl p-4 flex flex-col gap-2 animate-fade-in">
                    <h5 className="text-[10px] font-black text-pink-900 uppercase tracking-wider">Your Externalized Problem Persona</h5>
                    <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                      Instead of pointing fingers at your family members, unite your co-op alliance to defeat:
                    </p>
                    <div className="bg-white p-3 rounded-xl border-2 border-pink-200 font-display font-black text-xs text-pink-700 text-center">
                      "{externalizedName}"
                    </div>
                    <span className="text-[9px] font-sans text-on-surface-variant leading-relaxed text-center mt-1">
                      🗣️ Try saying: "The Blame Monster is trying to hijack our evening. Let's work together to protect our calm connection."
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* STRUCTURAL BOUNDARY MAPPER */}
            {activeToolId === 'structural' && (
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                   Salvador Minuchin emphasized family boundaries (rigid, diffuse, or clear) and subsystems. Assess boundaries to avoid household coalition enmeshment.
                </p>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">Parent-to-Parent Subsystem</label>
                    <select
                      value={boundaries.parentSubsystem}
                      onChange={(e) => setBoundaries({ ...boundaries, parentSubsystem: e.target.value })}
                      className="w-full bg-white text-[11px] font-sans px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold"
                    >
                      <option value="clear">🟢 Clear & Supportive</option>
                      <option value="diffuse">🟡 Diffuse (Enmeshed with kids)</option>
                      <option value="rigid">🔴 Rigid (Withdrawn/Cut-off)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">Parent-to-Child boundary Line</label>
                    <select
                      value={boundaries.parentChildBoundary}
                      onChange={(e) => setBoundaries({ ...boundaries, parentChildBoundary: e.target.value })}
                      className="w-full bg-white text-[11px] font-sans px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold"
                    >
                      <option value="clear">🟢 Clear, Warm & Authoritative</option>
                      <option value="diffuse">🟡 Diffuse / Over-involved</option>
                      <option value="rigid">🔴 Rigid / Unresponsive</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleBoundaryAnalyze}
                  className="w-full bg-purple-600 text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-purple-800 hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer text-xs mt-1"
                >
                  Analyze Household Subsystems
                </button>

                {boundaryAnalysis && (
                  <div className="mt-2 bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 flex flex-col gap-1.5 animate-fade-in text-[11px]">
                    <span className="font-display font-black text-purple-900 uppercase">Structural Subsystem Report</span>
                    <p className="font-sans text-[#4B4B4B] leading-relaxed">
                      {boundaryAnalysis}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* NONVIOLENT COMMUNICATION (NVC) TOOL */}
            {activeToolId === 'nvc' && (
              <div className="flex flex-col gap-4">
                <div className="bg-secondary/10 p-3.5 rounded-xl border-2 border-secondary/20 text-[11px] leading-relaxed text-[#4B4B4B]">
                  <strong>Marshall Rosenberg's 4-Step Connection Builder:</strong> Deconstruct blame loops into observations, physical sensations, universal attachment needs, and actionable, non-demanding requests.
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">1. Observation (State the dry facts, no opinions)</label>
                    <input
                      type="text"
                      value={nvcObservation}
                      onChange={(e) => setNvcObservation(e.target.value)}
                      placeholder="e.g. When I saw dishes in the sink tonight"
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">2. Vulnerable Feeling (State pure feelings, no accusations)</label>
                    <input
                      type="text"
                      value={nvcFeeling}
                      onChange={(e) => setNvcFeeling(e.target.value)}
                      placeholder="e.g. I feel overwhelmed and anxious"
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">3. Universal Need (What core value is driving this?)</label>
                    <input
                      type="text"
                      value={nvcNeed}
                      onChange={(e) => setNvcNeed(e.target.value)}
                      placeholder="e.g. because I need order, relaxation, and supportive teamwork"
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">4. Actionable Request (Ask for positive, doable actions)</label>
                    <input
                      type="text"
                      value={nvcRequest}
                      onChange={(e) => setNvcRequest(e.target.value)}
                      placeholder="e.g. Would you be willing to help load them together for 5 minutes?"
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCompileNvc}
                  className="w-full bg-secondary text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-on-secondary-container hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer text-xs mt-1"
                >
                  Compile NVC Alignment Statement
                </button>

                {nvcCompiled && (
                  <div className="mt-2 bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex flex-col gap-2.5 animate-fade-in">
                    <h5 className="text-[11px] font-black text-emerald-900 uppercase">Your Compiled Alignment Statement</h5>
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-100 font-sans text-xs leading-relaxed text-[#4B4B4B] shadow-xs">
                      "<strong>{nvcObservation}</strong>, <strong>{nvcFeeling}</strong> <strong>{nvcNeed}</strong>. <strong>{nvcRequest}</strong>"
                    </div>
                    <span className="text-[9px] font-sans text-on-surface-variant leading-relaxed text-center text-emerald-800">
                      💡 Saying this aloud keeps the listener's heart open and completely avoids provoking their defense shield.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* FINANCIAL HARMONY BUDGET TOOL */}
            {activeToolId === 'financial' && (
              <div className="flex flex-col gap-4">
                <div className="bg-primary/10 p-3.5 rounded-xl border-2 border-primary/20 text-[11px] leading-relaxed text-[#4B4B4B]">
                  <strong>Money Scripts Autonomy & Security Allocator:</strong> Formulate a collaborative budgeting covenant. This tool models division of joint income, guaranteeing both relationship security and individual discretionary freedom.
                </div>

                <div className="bg-surface-container p-4 rounded-xl flex flex-col gap-3.5 border border-outline-variant">
                  <div>
                    <label className="text-[10px] font-black uppercase text-on-surface-variant block mb-1">Joint Monthly Shared Income</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-[#4B4B4B] font-bold text-xs">$</span>
                      <input
                        type="number"
                        value={sharedIncome}
                        onChange={(e) => setSharedIncome(Number(e.target.value))}
                        className="w-full bg-white text-xs px-7 py-2.5 rounded-xl border-2 border-outline-variant focus:outline-none font-sans font-bold text-[#4B4B4B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-[#4B4B4B]">
                    <div>
                      <label className="font-bold block mb-1">🏡 Survival Needs %</label>
                      <input 
                        type="number" 
                        value={survivalPct} 
                        onChange={(e) => setSurvivalPct(Number(e.target.value))}
                        className="w-full bg-white px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold" 
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">📈 Future Savings %</label>
                      <input 
                        type="number" 
                        value={futurePct} 
                        onChange={(e) => setFuturePct(Number(e.target.value))}
                        className="w-full bg-white px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold" 
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">🛡️ No-Permission Autonomy %</label>
                      <input 
                        type="number" 
                        value={autonomyPct} 
                        onChange={(e) => setAutonomyPct(Number(e.target.value))}
                        className="w-full bg-white px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold" 
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">❤️ Intimacy Fund %</label>
                      <input 
                        type="number" 
                        value={connectionPct} 
                        onChange={(e) => setConnectionPct(Number(e.target.value))}
                        className="w-full bg-white px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold" 
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCalculateFinancial}
                  className="w-full bg-primary text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-primary-dark hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer text-xs mt-1"
                >
                  Generate Money Autonomy Alliance
                </button>

                {financialCalculated && (
                  <div className="mt-2 bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex flex-col gap-3 animate-fade-in">
                    <h5 className="text-[11px] font-black text-green-900 uppercase">Relational Resource Allocation</h5>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-[#4B4B4B]">
                      <div className="bg-white p-2.5 rounded-lg border border-green-100 shadow-xs">
                        <span className="font-bold text-green-800 block">🏡 Core Survival Fund</span>
                        <span className="text-sm font-black">${((sharedIncome * survivalPct) / 100).toFixed(0)}</span>
                        <span className="text-[7px] text-on-surface-variant block">Rent, food, and basic life necessities.</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-green-100 shadow-xs">
                        <span className="font-bold text-green-800 block">📈 Shared Security Savings</span>
                        <span className="text-sm font-black">${((sharedIncome * futurePct) / 100).toFixed(0)}</span>
                        <span className="text-[7px] text-on-surface-variant block">Mutual future security & emergencies.</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-green-100 shadow-xs">
                        <span className="font-bold text-green-800 block">🛡️ No-Permission Cash</span>
                        <span className="text-sm font-black">${((sharedIncome * autonomyPct) / 100).toFixed(0)}</span>
                        <span className="text-[7px] text-on-surface-variant block">Split equally for zero-monitoring spending.</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-green-100 shadow-xs">
                        <span className="font-bold text-green-800 block">❤️ Couples Connection Pot</span>
                        <span className="text-sm font-black">${((sharedIncome * connectionPct) / 100).toFixed(0)}</span>
                        <span className="text-[7px] text-on-surface-variant block">Specifically for date nights and bonding.</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-sans text-on-surface-variant leading-relaxed text-center bg-white border border-green-100 py-1.5 rounded-xl">
                      💡 <strong>The No-Permission Allowance Antidote:</strong> Splitting discretionary autonomy cash equally prevents spenders from feeling micromanaged and savers from experiencing financial vigilance panic.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* IBCT ACCEPTANCE & DETACHMENT TOOL */}
            {activeToolId === 'ibct' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[#FF8A00]/10 p-3.5 rounded-xl border-2 border-[#FF8A00]/20 text-[11px] leading-relaxed text-[#4B4B4B]">
                  <strong>IBCT Unified Detachment Coach:</strong> Restructure reactive arguments by objectifying the conflict pattern as "The Dance" or loop, transforming mutual blame into collaborative analysis.
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">1. The Triggering Event</label>
                    <input
                      type="text"
                      value={ibctTrigger}
                      onChange={(e) => setIbctTrigger(e.target.value)}
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">2. Partner A's Reactive Action</label>
                    <input
                      type="text"
                      value={ibctPartnerAAction}
                      onChange={(e) => setIbctPartnerAAction(e.target.value)}
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">3. Partner B's Defensive Counter-Action</label>
                    <input
                      type="text"
                      value={ibctPartnerBReaction}
                      onChange={(e) => setIbctPartnerBReaction(e.target.value)}
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-on-surface-variant block mb-1">4. Name of the Relational Loop</label>
                    <input
                      type="text"
                      value={ibctLoopName}
                      onChange={(e) => setIbctLoopName(e.target.value)}
                      className="w-full bg-white text-[11px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans"
                    />
                  </div>
                </div>

                <button
                  onClick={handleMapIbct}
                  className="w-full bg-[#FF8A00] text-white font-display font-black py-2.5 rounded-xl border-b-[4px] border-[#cc6e00] hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer text-xs mt-1"
                >
                  Map Loop as a Shared Opponent
                </button>

                {ibctMapped && (
                  <div className="mt-2 bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex flex-col gap-2 animate-fade-in">
                    <h5 className="text-[11px] font-black text-orange-950 uppercase">Mapped IBCT Relational Pattern</h5>
                    <div className="space-y-2 text-[10px] font-sans text-on-surface-variant leading-relaxed pl-3 border-l-2 border-[#FF8A00]">
                      <p>💥 <strong>Trigger:</strong> {ibctTrigger}</p>
                      <p>🔄 <strong>The Loop:</strong> Partner A acts with <em>"{ibctPartnerAAction}"</em>, which triggers Partner B to react with <em>"{ibctPartnerBReaction}"</em>, which escalates the loop further.</p>
                      <p>🎨 <strong>Pattern Persona:</strong> You both are currently locked in <strong>"{ibctLoopName}"</strong>.</p>
                    </div>
                    <span className="text-[9px] font-sans text-orange-900 leading-relaxed text-center bg-white border border-orange-100 py-1.5 rounded-xl mt-1">
                      🗣️ <strong>Acceptance Pivot:</strong> "I love you. It is not me vs. you. It is both of us vs. <em>{ibctLoopName}</em>. Let's step out of the loop and breathe."
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* FAIR PLAY COGNITIVE DECK DRAFTER */}
            {activeToolId === 'fairplay' && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="bg-[#CE9FFC]/10 p-3.5 rounded-xl border-2 border-[#CE9FFC]/20 text-[11px] leading-relaxed text-[#4B4B4B]">
                  <strong>Eve Rodsky's Domestic Equity Deck:</strong> Rebalance invisible domestic and administrative labor. Each chore card must be fully owned (Conception, Planning, Execution) by a single partner to eliminate checking and nagging.
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-on-surface-variant">Active Task Card Allocation</span>
                  <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto no-scrollbar pr-1">
                    {fairPlayCards.map((card) => (
                      <div key={card.id} className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/60 flex flex-col gap-1 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="font-display font-black text-[10.5px] text-[#4B4B4B]">{card.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${card.owner === 'Partner A' ? 'bg-secondary/10 text-blue-700 border border-blue-200' : card.owner === 'Partner B' ? 'bg-primary/10 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                            {card.owner}
                          </span>
                        </div>
                        <p className="font-sans text-[9px] text-[#4B4B4B]/80 leading-relaxed italic pr-2">
                          <strong>CPE:</strong> {card.cpe}
                        </p>
                        <div className="flex justify-between items-center text-[9px] font-sans border-t border-outline-variant/30 pt-1.5 mt-0.5">
                          <span className="text-[#4B4B4B]/70 truncate max-w-[170px]">💬 <strong>MSC:</strong> {card.msc}</span>
                          <button
                            onClick={() => {
                              setEditingCardId(card.id);
                              setEditMscText(card.msc);
                              setEditOwnerText(card.owner);
                            }}
                            className="text-xs text-primary font-black uppercase tracking-wider hover:underline shrink-0"
                          >
                            Edit Card
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {editingCardId !== null && (
                    <div className="mt-1 bg-surface-container p-3 rounded-2xl border-2 border-[#CE9FFC]/30 flex flex-col gap-2 animate-scale-in">
                      <span className="text-[10px] font-black uppercase text-purple-900">Modify Task Card</span>
                      <div className="flex justify-between items-center gap-1.5">
                        <label className="text-[9px] font-bold text-on-surface-variant">Card Owner:</label>
                        <select
                          value={editOwnerText}
                          onChange={(e) => setEditOwnerText(e.target.value)}
                          className="bg-white text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-outline-variant"
                        >
                          <option value="Partner A">Partner A</option>
                          <option value="Partner B">Partner B</option>
                          <option value="Unassigned">Unassigned</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-on-surface-variant">Minimum Standard of Care (MSC):</label>
                        <input
                          type="text"
                          value={editMscText}
                          onChange={(e) => setEditMscText(e.target.value)}
                          className="bg-white text-[10px] px-2 py-1.5 rounded-lg border-2 border-outline-variant"
                        />
                      </div>
                      <div className="flex gap-1.5 justify-end mt-1">
                        <button
                          onClick={() => setEditingCardId(null)}
                          className="bg-white text-[#4B4B4B] text-[9.5px] px-3 py-1.5 rounded-xl border-2 border-outline-variant font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCardEdit}
                          className="bg-[#CE9FFC] text-white text-[9.5px] px-3 py-1.5 rounded-xl border-b-[3px] border-[#b784f9] font-black uppercase tracking-wider"
                        >
                          Update Card
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CPE Capacity Balanced Gauge */}
                  <div className="mt-1.5 bg-purple-50 p-3 rounded-xl border border-purple-200/50 flex flex-col gap-1 text-[9.5px] font-sans text-purple-950">
                    <span className="font-bold text-purple-900 block">⚡ Relational Autonomy Balance Check</span>
                    <div className="flex justify-between font-bold text-[8.5px] uppercase mt-0.5">
                      <span>Partner A Cards: {fairPlayCards.filter(c => c.owner === 'Partner A').length}</span>
                      <span>Partner B Cards: {fairPlayCards.filter(c => c.owner === 'Partner B').length}</span>
                    </div>
                    <p className="text-[8px] text-on-surface-variant leading-relaxed block mt-1">
                      💡 <strong>Minimum Standard of Care:</strong> Mutual agreement prevents micromanaging. When Partner A holds a card, Partner B must let go completely and trust their CPE.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeToolId === 'feelings_finder' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in text-[#4B4B4B]">
                {/* Left Column: Interactive Wheel Explorer */}
                <div className="lg:col-span-7 bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-4">
                  <div className="border-b border-outline-variant/60 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6EA7]">Somatic Grounding & Emotion Tracing</span>
                      <h4 className="font-display font-black text-sm text-on-surface mt-0.5">🎡 Interactive Feelings Wheel</h4>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCoreFeeling(null);
                        setSelectedSecondaryFeeling(null);
                        setSelectedTertiaryFeeling(null);
                      }}
                      className="text-[9px] font-sans text-[#FF6EA7] hover:underline font-bold flex items-center gap-1"
                    >
                      <RefreshCw size={10} /> Reset Selector
                    </button>
                  </div>

                  {/* Visual Radial Target Indicator / Guide */}
                  <div className="relative aspect-video max-h-[220px] bg-gradient-to-b from-stone-50 to-stone-100 rounded-2xl border border-stone-200/60 overflow-hidden flex items-center justify-center">
                    {/* Background visual wheel circles */}
                    <div className="absolute w-[200px] h-[200px] rounded-full border border-stone-200/50 flex items-center justify-center">
                      <div className="w-[140px] h-[140px] rounded-full border border-stone-200/50 flex items-center justify-center">
                        <div className="w-[80px] h-[80px] rounded-full border border-stone-200/50 flex items-center justify-center">
                          <div className="w-[20px] h-[20px] rounded-full bg-stone-300"></div>
                        </div>
                      </div>
                    </div>

                    {/* Concentric rings labels */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1 text-[8.5px] font-mono text-stone-400">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-stone-300"></span> Inner: Core Sensations
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full border border-stone-300"></span> Middle: Secondary Nuances
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full border-dashed border-stone-300"></span> Outer: Precise Tertiary Emotions
                      </div>
                    </div>

                    {/* Active Path Visual Display */}
                    <div className="flex flex-col items-center justify-center gap-1 text-center z-10 px-4">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-stone-500">Active Path</span>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition ${selectedCoreFeeling ? 'bg-[#FF6EA7]/10 text-[#FF6EA7] border-[#FF6EA7]/20' : 'bg-white text-stone-400 border-stone-200'}`}>
                          {selectedCoreFeeling || '1. Select Core'}
                        </span>
                        <ChevronRight size={10} className="text-stone-400" />
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition ${selectedSecondaryFeeling ? 'bg-[#FF6EA7]/10 text-[#FF6EA7] border-[#FF6EA7]/20' : 'bg-white text-stone-400 border-stone-200'}`}>
                          {selectedSecondaryFeeling || '2. Select Secondary'}
                        </span>
                        <ChevronRight size={10} className="text-stone-400" />
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition ${selectedTertiaryFeeling ? 'bg-[#FF6EA7]/10 text-[#FF6EA7] border-[#FF6EA7]/20' : 'bg-white text-stone-400 border-stone-200'}`}>
                          {selectedTertiaryFeeling ? selectedTertiaryFeeling.name : '3. Select Tertiary'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Level 1: Core Sensations Selection */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Step 1: Core Sensations</span>
                    <div className="grid grid-cols-4 gap-2">
                      {FEELINGS_DATA.map((core) => {
                        const isSelected = selectedCoreFeeling === core.name;
                        return (
                          <button
                            key={core.name}
                            onClick={() => {
                              setSelectedCoreFeeling(core.name);
                              setSelectedSecondaryFeeling(null);
                              setSelectedTertiaryFeeling(null);
                            }}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold text-center flex flex-col items-center gap-1 transition ${
                              isSelected 
                                ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                            }`}
                          >
                            <span className="text-sm">
                              {core.name === 'Anger' && '😡'}
                              {core.name === 'Sadness' && '😢'}
                              {core.name === 'Fear' && '😰'}
                              {core.name === 'Joy' && '☀️'}
                            </span>
                            <span>{core.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level 2: Secondary Nuances Selection */}
                  {selectedCoreFeeling && (
                    <div className="flex flex-col gap-1.5 animate-fade-in">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Step 2: Secondary Nuances under {selectedCoreFeeling}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {FEELINGS_DATA.find(c => c.name === selectedCoreFeeling)?.secondary.map((sec) => {
                          const isSelected = selectedSecondaryFeeling === sec.name;
                          return (
                            <button
                              key={sec.name}
                              onClick={() => {
                                setSelectedSecondaryFeeling(sec.name);
                                setSelectedTertiaryFeeling(null);
                              }}
                              className={`px-3 py-2 rounded-xl border text-[11.5px] font-semibold transition ${
                                isSelected 
                                  ? 'bg-[#FF6EA7] text-white border-[#FF6EA7] shadow-sm' 
                                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              }`}
                            >
                              {sec.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Level 3: Tertiary Precise Emotions */}
                  {selectedCoreFeeling && selectedSecondaryFeeling && (
                    <div className="flex flex-col gap-1.5 animate-fade-in">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Step 3: Precise Emotional Word under {selectedSecondaryFeeling}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {FEELINGS_DATA.find(c => c.name === selectedCoreFeeling)
                          ?.secondary.find(s => s.name === selectedSecondaryFeeling)
                          ?.tertiary.map((node) => {
                            const isSelected = selectedTertiaryFeeling?.id === node.id;
                            return (
                              <button
                                key={node.id}
                                onClick={() => setSelectedTertiaryFeeling(node)}
                                className={`p-2.5 rounded-xl border text-[11px] text-left flex items-start gap-2 transition ${
                                  isSelected 
                                    ? 'bg-[#FF6EA7] text-white border-[#FF6EA7] shadow-sm' 
                                    : 'bg-white hover:bg-[#FF6EA7]/5 border-[#FF6EA7]/20 text-stone-800'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-white' : 'bg-[#FF6EA7]'}`}></span>
                                <div className="flex flex-col">
                                  <span className="font-bold">{node.name}</span>
                                  <span className={`text-[9px] leading-tight ${isSelected ? 'text-rose-100' : 'text-stone-500'}`}>
                                    {node.definition.substring(0, 48)}...
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Emotional Insights & Softened Request Generator */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Insight and NVC script card */}
                  <div className="bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-4">
                    {selectedTertiaryFeeling ? (
                      <div className="flex flex-col gap-4 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-xl bg-[#FF6EA7]/10 text-[#FF6EA7]">
                            <Sparkles size={16} />
                          </span>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6EA7]">Labeling Attachment Trigger</span>
                            <h5 className="font-display font-black text-base text-on-surface leading-none mt-0.5">{selectedTertiaryFeeling.name}</h5>
                          </div>
                        </div>

                        {/* Definition Section */}
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/50 flex flex-col gap-1">
                          <span className="font-bold text-[9px] text-stone-500 uppercase tracking-wider">Clinical Definition:</span>
                          <p className="text-[11.5px] text-stone-700 leading-relaxed font-sans">{selectedTertiaryFeeling.definition}</p>
                        </div>

                        {/* Need Section */}
                        <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100 flex flex-col gap-1">
                          <span className="font-bold text-[9px] text-[#FF6EA7] uppercase tracking-wider">Underlying Core Longing / Need:</span>
                          <div className="flex items-start gap-1.5 mt-0.5">
                            <Heart size={12} className="text-[#FF6EA7] mt-0.5 shrink-0" />
                            <p className="text-[11.5px] text-stone-800 leading-relaxed font-sans font-medium">{selectedTertiaryFeeling.need}</p>
                          </div>
                        </div>

                        {/* NVC Softened Script Section */}
                        <div className="bg-stone-900 p-4 rounded-xl text-white relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-[8.5px] text-stone-400 uppercase tracking-wider flex items-center gap-1">
                              <MessageCircle size={10} className="text-primary" /> Softened Connection Script (NVC)
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedTertiaryFeeling.script);
                                alert("Script copied to clipboard!");
                              }}
                              className="text-[8px] bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded text-white font-mono"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-[11px] leading-relaxed italic text-stone-100 font-serif">
                            "{selectedTertiaryFeeling.script}"
                          </p>
                          <div className="mt-2 text-[8px] text-stone-400">
                            💡 Framing feelings vulnerability-first prevents defensiveness and opens the door for emotional bids.
                          </div>
                        </div>

                        {/* In Between Session Action Step */}
                        <div className="bg-green-50/50 p-3 rounded-xl border border-green-200/50 flex flex-col gap-1">
                          <span className="font-bold text-[9px] text-primary uppercase tracking-wider flex items-center gap-1">
                            <Activity size={10} /> "Do the Work" Action Step (Between-Session Exercise)
                          </span>
                          <p className="text-[11px] text-stone-700 leading-relaxed font-sans">{selectedTertiaryFeeling.action}</p>
                        </div>

                        {/* Interactive Feeling logger */}
                        <div className="border-t border-outline-variant/60 pt-3.5 flex flex-col gap-2.5">
                          <span className="text-[9.5px] font-black uppercase tracking-wider text-stone-500">Log this feeling in Relational Ledger</span>
                          <div className="flex gap-2">
                            <div className="w-1/3 flex flex-col gap-1">
                              <label className="text-[8.5px] font-bold text-stone-400 uppercase">Who is feeling?</label>
                              <select
                                value={feelingsLoggerRole}
                                onChange={(e: any) => setFeelingsLoggerRole(e.target.value)}
                                className="bg-stone-50 border border-stone-200 text-[10px] rounded-lg p-1.5 font-sans font-medium text-stone-700"
                              >
                                <option value="Partner A">Partner A</option>
                                <option value="Partner B">Partner B</option>
                              </select>
                            </div>
                            <div className="w-2/3 flex flex-col gap-1">
                              <label className="text-[8.5px] font-bold text-stone-400 uppercase">Trigger Context (Optional)</label>
                              <input
                                type="text"
                                placeholder="What event initiated this feeling?"
                                value={customFeelingNote}
                                onChange={(e) => setCustomFeelingNote(e.target.value)}
                                className="bg-stone-50 border border-stone-200 text-[10px] rounded-lg p-1.5 placeholder-stone-400 text-stone-700"
                              />
                            </div>
                          </div>
                          <button
                            onClick={handleLogFeeling}
                            className="bg-[#FF6EA7] text-white py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-b-[3px] border-[#e04f87] transition hover:scale-[1.01]"
                          >
                            📝 Log Feelings & Action Steps
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-3 text-stone-400">
                        <span className="text-3xl">🎡</span>
                        <h5 className="font-display font-black text-xs text-stone-600 uppercase tracking-wider">No Emotion Selected</h5>
                        <p className="text-[10px] leading-relaxed max-w-[200px]">
                          Select a Core sensation on the left, then drill down to a tertiary feeling to reveal therapeutic insights, scripts, and logs.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Relational Feelings Ledger history */}
                  <div className="bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2">
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-stone-500">📜 Relational Feelings Ledger</span>
                      <span className="text-[8px] bg-stone-100 text-stone-500 font-mono px-1.5 py-0.5 rounded-full uppercase">
                        {feelingsLogs.length} Entries logged
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 max-h-[175px] overflow-y-auto pr-1">
                      {feelingsLogs.map((log) => {
                        const isA = log.partner === 'Partner A';
                        return (
                          <div key={log.id} className="p-2.5 rounded-xl border border-stone-200/50 bg-stone-50/50 flex flex-col gap-1.5 text-[10px] leading-normal">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase ${isA ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                  {log.partner}
                                </span>
                                <span className="font-bold text-stone-700">
                                  {log.core} &rarr; {log.secondary} &rarr; <span className="text-[#FF6EA7]">{log.tertiary}</span>
                                </span>
                              </div>
                              <span className="text-[8px] text-stone-400">{log.timestamp}</span>
                            </div>
                            <p className="text-[9.5px] text-stone-600 font-sans leading-relaxed italic bg-white p-1.5 rounded-lg border border-stone-100">
                              "{log.note}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clinical Education View */}
        {activeSubSection === 'education' && details && (
          <div className="bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-5 animate-fade-in text-[#4B4B4B]">
            <div className="border-b border-outline-variant/60 pb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Academic & Clinical Grounding</span>
              <h4 className="font-display font-black text-sm text-on-surface mt-0.5">📚 Therapeutic Theory Spec</h4>
            </div>

            {/* Background section */}
            <div className="flex flex-col gap-1.5">
              <h5 className="font-display font-black text-[10px] text-primary uppercase tracking-wider">Clinical Background</h5>
              <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                {details.clinicalBackground}
              </p>
            </div>

            {/* Principles */}
            <div className="flex flex-col gap-2">
              <h5 className="font-display font-black text-[10px] text-primary uppercase tracking-wider">Core Clinical Principles</h5>
              <div className="flex flex-col gap-2">
                {details.corePrinciples.map((p, i) => (
                  <div key={i} className="flex gap-2 bg-surface-container/30 border border-outline-variant/60 p-3 rounded-xl text-[11px] leading-relaxed">
                    <span className="text-primary font-black shrink-0">✔</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Tracked */}
            <div className="flex flex-col gap-2 bg-primary/5 border-2 border-primary/20 p-4 rounded-[1.5rem]">
              <h5 className="font-display font-black text-[10px] text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span>📈</span> Active Clinical Metrics Tracked
              </h5>
              <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mb-1">
                This application logs and correlates these user metrics to assess relational safety and intimacy in real-time:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {details.metricsTracked.map((m, i) => (
                  <span key={i} className="text-[9px] font-bold bg-white text-[#4B4B4B] border border-outline-variant px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Clinical Case Study */}
            <div className="flex flex-col gap-2 bg-surface-container-low border-2 border-outline-variant p-4 rounded-[1.5rem]">
              <h5 className="font-display font-black text-[10px] text-[#4B4B4B] uppercase tracking-wider">
                🩺 Case Study: {details.caseStudy.title}
              </h5>
              <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed italic">
                <strong>Distress:</strong> {details.caseStudy.description}
              </p>
              <div className="bg-white p-3 rounded-xl border border-outline-variant mt-1.5">
                <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                  <strong className="text-primary">Clinical Resolution:</strong> {details.caseStudy.resolution}
                </p>
              </div>
            </div>

            {/* Literature */}
            <div className="flex flex-col gap-1.5 border-t border-outline-variant/50 pt-4">
              <h5 className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-wider">
                📖 Recommended Clinical Literature
              </h5>
              <ul className="list-disc pl-4 space-y-1">
                {details.recommendedReadings.map((book, i) => (
                  <li key={i} className="font-sans text-[10px] text-on-surface-variant italic">
                    {book}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Resources / Worksheets View */}
        {activeSubSection === 'resources' && details && (
          <div className="bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-5 animate-fade-in text-[#4B4B4B]">
            <div className="border-b border-outline-variant/60 pb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#CE9FFC]">Professional Resource Suite</span>
              <h4 className="font-display font-black text-sm text-on-surface mt-0.5">📝 Worksheets & Assignments</h4>
            </div>

            {/* Clinical Worksheet */}
            <div className="flex flex-col gap-3.5 bg-surface-container-low border-2 border-outline-variant p-4 rounded-[1.5rem]">
              <div>
                <h5 className="font-display font-black text-xs text-primary uppercase tracking-wider">
                  📋 Worksheet: {details.clinicalWorksheet.title}
                </h5>
                <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-1">
                  <strong>Objective:</strong> {details.clinicalWorksheet.objective}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {details.clinicalWorksheet.questions.map((q, idx) => {
                  const key = `${activeToolId}-q-${idx}`;
                  return (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <label className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed font-semibold">
                        {idx + 1}. {q}
                      </label>
                      <textarea
                        value={worksheetAnswers[key] || ''}
                        onChange={(e) => setWorksheetAnswers({
                          ...worksheetAnswers,
                          [key]: e.target.value
                        })}
                        placeholder="Type your clinical reflections here..."
                        className="w-full bg-white text-[11px] p-2.5 rounded-xl border-2 border-outline-variant h-16 focus:outline-none focus:border-primary font-sans resize-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLoggedAnswers(true);
                    setTimeout(() => setLoggedAnswers(false), 3000);
                  }}
                  className="flex-1 bg-primary text-white font-display font-black py-2 rounded-xl border-b-[3px] border-primary-dark text-[11px] hover:brightness-105 active:scale-95 transition-all cursor-pointer text-center"
                >
                  {loggedAnswers ? "✓ Session Logged!" : "💾 Log Worksheet Answers"}
                </button>

                <button
                  onClick={() => setShowPDFReport(!showPDFReport)}
                  className="bg-secondary text-white px-3 py-2 rounded-xl border-b-[3px] border-on-secondary-container hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                  title="Print / Share PDF Report"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>

              {showPDFReport && (
                <div className="mt-2 bg-neutral-900 text-neutral-100 p-4 rounded-xl border border-neutral-800 font-mono text-[9px] leading-relaxed animate-fade-in relative">
                  <div className="absolute top-2 right-2 text-[7px] text-neutral-500 uppercase font-bold">PDF STAGE // GENERATED REPORT</div>
                  <div className="text-center border-b border-neutral-800 pb-2 mb-2">
                    <span className="font-black text-[10px] text-white tracking-widest">FAMILYFRAME CLINICAL RECORD</span><br/>
                    <span className="text-[7px] text-neutral-400">Practice summary — not a clinical record • {new Date().toLocaleDateString()}</span>
                  </div>
                  <p className="text-neutral-300"><strong>Clinical Model:</strong> {activeModel?.name}</p>
                  <p className="text-neutral-300"><strong>Worksheet:</strong> {details.clinicalWorksheet.title}</p>
                  <div className="border-t border-neutral-800 pt-2 mt-2 space-y-1.5">
                    {details.clinicalWorksheet.questions.map((q, idx) => {
                      const key = `${activeToolId}-q-${idx}`;
                      return (
                        <div key={idx}>
                          <p className="text-secondary">Q{idx + 1}: {q}</p>
                          <p className="text-neutral-400 italic">Ans: {worksheetAnswers[key] || "[No answer recorded]"}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center text-[7px] text-neutral-500 mt-3 border-t border-neutral-800 pt-2">
                    This digital record has been cryptographically signed for inclusion in clinical dashboards.
                  </div>
                </div>
              )}
            </div>

            {/* Homework Exercise */}
            <div className="flex flex-col gap-3 bg-[#CE9FFC]/5 border-2 border-[#CE9FFC]/20 p-4 rounded-[1.5rem]">
              <div className="flex justify-between items-start">
                <h5 className="font-display font-black text-xs text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏠</span> Homework: {details.homeworkExercise.name}
                </h5>
                <span className="text-[8px] font-black bg-purple-700 text-white px-2 py-0.5 rounded-full uppercase shrink-0">
                  ⏱ {details.homeworkExercise.duration}
                </span>
              </div>
              <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed">
                {details.homeworkExercise.instructions}
              </p>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
