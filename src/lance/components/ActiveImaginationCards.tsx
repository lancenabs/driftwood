import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Compass, HelpCircle, PenTool, GitBranch, ArrowRight, RefreshCw, Layers, CheckCircle, Flame, Eye, Info, RotateCw
} from 'lucide-react';
import { useGame } from './LANCEGame/LANCEGameContext';

interface ArchetypeCard {
  id: string;
  title: string;
  symbol: string;
  subtitle: string;
  description: string;
  clinicalComplexValue: 'ego' | 'persona' | 'shadow' | 'anima_animus';
  prompt: string;
  colorClass: string;
  glowClass: string;
}

const MYTHIC_CARDS: ArchetypeCard[] = [
  {
    id: 'card-protector',
    title: 'The Armored Protector',
    symbol: '🛡️',
    subtitle: 'Warden of Boundaries',
    description: 'A structural energy constructed early in your development to armor highly sensitive and innocent parts of your child self. It acts by constructing walls, rejecting alliances, or simulating intense anger.',
    clinicalComplexValue: 'persona',
    prompt: 'Look at the protector in your mind\'s eye. What secret fear or raw vulnerability is it guarding? Write three raw words describing what is behind the shield.',
    colorClass: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]',
    glowClass: 'rgba(51, 65, 85, 0.45)'
  },
  {
    id: 'card-chasm',
    title: 'The Silent Chasm',
    symbol: '🕳️',
    subtitle: 'Vault of the Repressed',
    description: 'An empty, dark abyss which holds your unowned traits, unexpressed jealousy, or unacceptable anger. Carl Jung termed this the dark container where raw keys to personal integration hide.',
    clinicalComplexValue: 'shadow',
    prompt: 'If you stand on the lip of your inner chasm, what does it feel like? What uncomfortable feeling (shame, envy, panic) is throwing echoes from its depths?',
    colorClass: 'from-[#171717] via-[#262626] to-[#171717]',
    glowClass: 'rgba(71, 85, 105, 0.45)'
  },
  {
    id: 'card-seed',
    title: 'The Underground Seed',
    symbol: '🌱',
    subtitle: 'Nurturer of Latent Drive',
    description: 'The creative force of potential stored away under heavy conscious soil. It holds your latent impulses for self-expansion, creative expression, or setting firm goals to claim healthy space.',
    clinicalComplexValue: 'ego',
    prompt: 'The seed is waiting in darkness to grow. What creative desire or boundary did you bury because it was unacceptable to others? What does it need to push through?',
    colorClass: 'from-[#022c22] via-[#064e3b] to-[#011c15]',
    glowClass: 'rgba(4, 120, 87, 0.45)'
  },
  {
    id: 'card-mirror',
    title: 'The Gilded Mirror',
    symbol: '🪞',
    subtitle: 'The Projection Lens',
    description: 'The mirror reflects qualities you admire or strongly dislike in others but are actually disowned aspects of yourself. Projection acts as an interactive telescope, preventing self-awareness.',
    clinicalComplexValue: 'anima_animus',
    prompt: 'Think of someone who triggers immediate, high irritation or high adoration in you. What trait in them might be your own disowned shadow looking back?',
    colorClass: 'from-[#4c0519] via-[#831843] to-[#2d000b]',
    glowClass: 'rgba(190, 24, 93, 0.45)'
  }
];

export default function ActiveImaginationCards() {
  const { userName } = useGame();
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  
  // Independent editor state for each card to avoid losing draft during multi-flips
  const [cardStates, setCardStates] = useState<Record<string, { text: string; words: string[] }>>({
    'card-protector': { text: '', words: [] },
    'card-chasm': { text: '', words: [] },
    'card-seed': { text: '', words: [] },
    'card-mirror': { text: '', words: [] }
  });

  // Track the current typed word for each card
  const [inputWordStates, setInputWordStates] = useState<Record<string, string>>({
    'card-protector': '',
    'card-chasm': '',
    'card-seed': '',
    'card-mirror': ''
  });

  // Pre-seed saved reflections so there resides a beautiful pre-established constellation immediately
  const [savedReflections, setSavedReflections] = useState<{ 
    id: string; 
    cardTitle: string; 
    clinicalComplexValue: 'ego' | 'persona' | 'shadow' | 'anima_animus'; 
    reflections: string; 
    words: string[];
    timestamp: string;
  }[]>([
    {
      id: 'preseed-1',
      cardTitle: 'The Silent Chasm',
      clinicalComplexValue: 'shadow',
      reflections: 'Felt a deep hesitation when speaking up in meetings, as if a quiet wall of self-doubt was keeping my true assertiveness trapped. Realized the anger I felt is actually grief about boundaries.',
      words: ['hesitation', 'grief', 'silence', 'doubt'],
      timestamp: 'Yesterday'
    },
    {
      id: 'preseed-2',
      cardTitle: 'The Armored Protector',
      clinicalComplexValue: 'persona',
      reflections: 'Recognized that my professional perfectionism is a shield. Over-preparing slides and obsessing over emails is a strategy so nobody can see my raw imposter worries.',
      words: ['shield', 'email-worry', 'perfection'],
      timestamp: '3 days ago'
    },
    {
      id: 'preseed-3',
      cardTitle: 'The Underground Seed',
      clinicalComplexValue: 'ego',
      reflections: 'Felt a strong urge to start painting again. This spark of creativity was buried for a decade because it seemed unproductive, but it holds essential revitalizing power.',
      words: ['creative', 'spark', 'revitalize'],
      timestamp: '5 days ago'
    }
  ]);

  // Visualizer Mode: 'session' (current card pull map) vs 'constellation' (historical multi-link mind map web)
  const [visualizerMode, setVisualizerMode] = useState<'session' | 'constellation'>('constellation');

  // Interactive Hover highlights for nodes and lines
  const [hoveredComplexId, setHoveredComplexId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  // Toggle local psychological synthesis panel
  const [synthesisExpanded, setSynthesisExpanded] = useState<boolean>(true);

  // AI-generated Synthesis Insight states
  const [synthesisInsight, setSynthesisInsight] = useState<{ synthesis: string; reflectionQuestion: string; somaticPractice?: string } | null>(null);
  const [synthesisLoading, setSynthesisLoading] = useState<boolean>(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  const fetchSynthesis = async (card: ArchetypeCard) => {
    setSynthesisLoading(true);
    setSynthesisError(null);
    try {
      const savedMoods = localStorage.getItem('therapy_mood_logs');
      const recentMoodLogs = savedMoods ? JSON.parse(savedMoods) : [];

      const res = await fetch('/api/therapy/jungian-synthesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          card: {
            id: card.id,
            title: card.title,
            subtitle: card.subtitle,
            symbol: card.symbol,
            clinicalComplexValue: card.clinicalComplexValue,
            prompt: card.prompt,
            description: card.description
          },
          recentMoodLogs,
          userName: userName || 'friend'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSynthesisInsight({
          synthesis: data.synthesis,
          reflectionQuestion: data.reflectionQuestion,
          somaticPractice: data.somaticPractice
        });
      } else {
        throw new Error(data.error || 'Failed to generate synthesis');
      }
    } catch (err: any) {
      console.error('Error fetching Jungian synthesis:', err);
      setSynthesisError(err.message || 'Connecting to depth synthesis failed.');
    } finally {
      setSynthesisLoading(false);
    }
  };

  // Automatically fetch when a card is flipped
  useEffect(() => {
    if (flippedCardId) {
      const cardObj = MYTHIC_CARDS.find(c => c.id === flippedCardId);
      if (cardObj) {
        fetchSynthesis(cardObj);
      }
    } else {
      setSynthesisInsight(null);
      setSynthesisError(null);
    }
  }, [flippedCardId]);

  const selectedCard = useMemo(() => {
    return MYTHIC_CARDS.find((c) => c.id === flippedCardId) || null;
  }, [flippedCardId]);

  // Handle word insertion
  const handleAddWord = (cardId: string) => {
    const wordToAdd = inputWordStates[cardId]?.trim() || '';
    if (!wordToAdd) return;
    
    const currentWords = cardStates[cardId]?.words || [];
    if (currentWords.length >= 6) return; // Limit to 6
    if (currentWords.includes(wordToAdd.toLowerCase())) return;

    setCardStates((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        words: [...currentWords, wordToAdd.toLowerCase()]
      }
    }));

    setInputWordStates((prev) => ({
      ...prev,
      [cardId]: ''
    }));
  };

  const handleRemoveWord = (cardId: string, idxToRemove: number) => {
    setCardStates((prev) => {
      const currentWords = prev[cardId]?.words || [];
      return {
        ...prev,
        [cardId]: {
          ...prev[cardId],
          words: currentWords.filter((_, i) => i !== idxToRemove)
        }
      };
    });
  };

  const handleUpdateText = (cardId: string, text: string) => {
    setCardStates((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        text
      }
    }));
  };

  const handleSaveReflection = (cardId: string) => {
    const card = MYTHIC_CARDS.find((c) => c.id === cardId);
    const state = cardStates[cardId];
    if (!card || !state) return;

    const newRef = {
      id: String(Date.now()),
      cardTitle: card.title,
      clinicalComplexValue: card.clinicalComplexValue,
      reflections: state.text,
      words: [...state.words],
      timestamp: new Date().toLocaleDateString()
    };

    setSavedReflections((prev) => [newRef, ...prev]);

    // Clear responses
    setCardStates((prev) => ({
      ...prev,
      [cardId]: { text: '', words: [] }
    }));
    setFlippedCardId(null);
    // Automatically switch to constellation representation to display the newly integrated line
    setVisualizerMode('constellation');
  };

  // SVG Mandala Calculations for Session Mode
  const svgMandalaMarkup = useMemo(() => {
    const center = { x: 170, y: 170 };
    const radiusComplexes = 80; // distance of psychic complexes
    const complexes = [
      { id: 'ego', label: 'EGO', x: center.x, y: center.y - radiusComplexes, color: '#0d9488' },
      { id: 'persona', label: 'PERSONA', x: center.x + radiusComplexes, y: center.y, color: '#3b82f6' },
      { id: 'shadow', label: 'SHADOW', x: center.x, y: center.y + radiusComplexes, color: '#64748b' },
      { id: 'anima_animus', label: 'ANIMA', x: center.x - radiusComplexes, y: center.y, color: '#ec4899' }
    ];

    // Compute dynamic association nodes from the currently flipped/selected card
    const activeWords = selectedCard ? cardStates[selectedCard.id]?.words || [] : [];
    const wordsLength = activeWords.length;
    const wordNodes = activeWords.map((word, i) => {
      const angle = (i * 2 * Math.PI) / (wordsLength || 1) - Math.PI / 2;
      const radiusWords = 135; // outer circle radius
      return {
        word,
        x: center.x + Math.cos(angle) * radiusWords,
        y: center.y + Math.sin(angle) * radiusWords
      };
    });

    return {
      center,
      complexes,
      wordNodes
    };
  }, [flippedCardId, cardStates, selectedCard]);

  // SVG Mandala Constellation Web Calculations (All history mapped together!)
  const constellationWeb = useMemo(() => {
    const center = { x: 170, y: 170 };
    
    // Core complexes with exact spatial headings
    const complexes = [
      { id: 'ego', label: 'EGO', x: center.x, y: center.y - 65, color: '#0d9488', angle: -Math.PI / 2 },
      { id: 'persona', label: 'PERSONA', x: center.x + 65, y: center.y, color: '#3b82f6', angle: 0 },
      { id: 'shadow', label: 'SHADOW', x: center.x, y: center.y + 65, color: '#64748b', angle: Math.PI / 2 },
      { id: 'anima_animus', label: 'ANIMA', x: center.x - 65, y: center.y, color: '#ec4899', angle: Math.PI }
    ];

    // Grouping cards into complexes
    const cardsByComplex: Record<string, typeof savedReflections> = {};
    savedReflections.forEach((ref) => {
      const complex = ref.clinicalComplexValue || 'ego';
      if (!cardsByComplex[complex]) {
        cardsByComplex[complex] = [];
      }
      cardsByComplex[complex].push(ref);
    });

    const cardNodes: { id: string; title: string; clinicalComplexValue: string; reflections: string; words: string[]; x: number; y: number; timestamp: string }[] = [];
    const links: { sourceX: number; sourceY: number; targetX: number; targetY: number; id: string; type: 'self-complex' | 'complex-card' | 'card-word'; complexId: string; cardId: string; wordValue?: string }[] = [];

    // Core Self -> Complex pathways
    complexes.forEach((comp) => {
      links.push({
        sourceX: center.x,
        sourceY: center.y,
        targetX: comp.x,
        targetY: comp.y,
        id: `self-${comp.id}`,
        type: 'self-complex',
        complexId: comp.id,
        cardId: ''
      });
    });

    // Outer calculations for cards
    complexes.forEach((comp) => {
      const refs = cardsByComplex[comp.id] || [];
      const count = refs.length;
      refs.forEach((ref, idx) => {
        const spacingAngle = 0.42; // radians spread factor
        const offsetAngle = count > 1 ? (idx - (count - 1) / 2) * spacingAngle : 0;
        const finalAngle = comp.angle + offsetAngle;
        const radius = 105; // orbit ring for card pulls
        const x = center.x + Math.cos(finalAngle) * radius;
        const y = center.y + Math.sin(finalAngle) * radius;

        cardNodes.push({
          id: ref.id,
          title: ref.cardTitle,
          clinicalComplexValue: comp.id,
          reflections: ref.reflections,
          words: ref.words || [],
          timestamp: ref.timestamp,
          x,
          y
        });

        links.push({
          sourceX: comp.x,
          sourceY: comp.y,
          targetX: x,
          targetY: y,
          id: `link-${comp.id}-${ref.id}`,
          type: 'complex-card',
          complexId: comp.id,
          cardId: ref.id
        });
      });
    });

    // Unique associated words extracted across all files
    const uniqueWords = Array.from(
      new Set(savedReflections.flatMap((ref) => (ref.words || []).map((w) => w.toLowerCase())))
    );

    const wordNodes = uniqueWords.map((word, idx) => {
      const angle = (idx * 2 * Math.PI) / (uniqueWords.length || 1) - Math.PI / 2;
      const radius = 142; // outmost boundary
      return {
        word,
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      };
    });

    // Draw links between Card Node clusters and word peripheral boundaries
    cardNodes.forEach((cn) => {
      cn.words.forEach((w) => {
        const wordNode = wordNodes.find((wn) => wn.word === w.toLowerCase());
        if (wordNode) {
          links.push({
            sourceX: cn.x,
            sourceY: cn.y,
            targetX: wordNode.x,
            targetY: wordNode.y,
            id: `link-${cn.id}-${w}`,
            type: 'card-word',
            complexId: cn.clinicalComplexValue,
            cardId: cn.id,
            wordValue: w.toLowerCase()
          });
        }
      });
    });

    return {
      center,
      complexes,
      cardNodes,
      wordNodes,
      links
    };
  }, [savedReflections]);

  // Local Psychological Synthesis generator
  const dynamicSynthesis = useMemo(() => {
    const totalReflections = savedReflections.length;
    if (totalReflections === 0) {
      return {
        title: "Initial Calibration State",
        intensity: "Latent",
        diagnosis: "No active word association clusters detected in your Mandala yet. Pull an Archetype card and commit a journal entry to populate the therapeutic web."
      };
    }

    const shadowWords = savedReflections.filter(r => r.clinicalComplexValue === 'shadow').flatMap(r => r.words);
    const personaWords = savedReflections.filter(r => r.clinicalComplexValue === 'persona').flatMap(r => r.words);
    const egoWords = savedReflections.filter(r => r.clinicalComplexValue === 'ego').flatMap(r => r.words);

    let polarityCount = 0;
    if (shadowWords.length > 0 && personaWords.length > 0) polarityCount++;
    if (egoWords.length > 0 && shadowWords.length > 0) polarityCount++;

    let diagnosis = '';
    let intensity = 'Harmonious Integration';

    if (polarityCount >= 2) {
      intensity = 'Dynamic Polarity High';
      diagnosis = `Your unconscious displays a high-contrast tension between your Persona shields ("${personaWords.slice(0, 2).join(', ')}") and repressed aspects of the Shadow ("${shadowWords.slice(0, 2).join(', ')}"). Bridging these poles requires recognizing that the armored protector actually shields raw, vital elements awaiting integration.`;
    } else if (shadowWords.length > 0) {
      intensity = 'Deep Shadow Integration';
      diagnosis = `Active retrieval of shadow traits ("${shadowWords.join(', ')}") indicates high willingness to address repressed material. Jung noted that integrating shadow brings vital creative potential. Consider how to safely bring these raw energies into day-to-day choices.`;
    } else if (personaWords.length > 0) {
      intensity = 'Armored Alignment';
      diagnosis = `Your present associations are dense in social adaptivity and Persona structures ("${personaWords.join(', ')}"). While these boundaries are therapeutic safeguards, notice if overprotectiveness blocks genuine emotional connection with your authentic Self.`;
    } else {
      intensity = 'Emergent Synchrony';
      diagnosis = `Your active reflections show balanced coordinates. Keep binding words and journaling to expand the pathways of this interactive constellation mandala web.`;
    }

    return {
      title: totalReflections >= 3 ? "Analytical Constellation Synthesis" : "Emergent Unconscious Calibration",
      intensity,
      diagnosis
    };
  }, [savedReflections]);

  return (
    <div id="mythic-imagination-card-puller" className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#831843] font-mono">
            <Compass className="w-4 h-4 text-[#831843]" />
            <span>Active Imagination Suite</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 tracking-tight">
            Jungian Active Imagination Mythic Card Puller
          </h3>
          <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed">
            Carl Jung designed Active Imagination as an analytical channel to communicate with the subconscious. Select an archetypal card below to trigger a <strong>tactile 3D flip</strong>, reveal its prompt, perform association journaling, and watch your thought nodes map to core complexes.
          </p>
        </div>

        <span className="bg-slate-100 px-3 py-1 text-[9.5px] font-bold font-mono rounded-lg border border-slate-200 uppercase tracking-widest text-slate-600">
          Depth Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ARCHETYPAL CARD GRID WITH INDEPENDENT 3D FLIPPERS (lg:span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-mono font-extrabold text-[#831843] block">
                Mythic Archetype Interactive Board (Tarot Spread)
              </span>
              {flippedCardId && (
                <button
                  onClick={() => setFlippedCardId(null)}
                  className="text-[10px] uppercase font-mono font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded cursor-pointer select-none transition"
                >
                  <RotateCw className="w-3 h-3" />
                  Reset Flips
                </button>
              )}
            </div>

            {/* Grid of high-fidelity 3D flippers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {MYTHIC_CARDS.map((card) => {
                const isFlipped = flippedCardId === card.id;
                const activeState = cardStates[card.id];
                const activeInputWord = inputWordStates[card.id] || '';

                return (
                  <div
                    key={card.id}
                    style={{ perspective: 1200 }}
                    className="relative h-[480px] w-full transition-all duration-300"
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                      className="w-full h-full relative"
                    >
                      {/* FRONT CARD (Drawn State) */}
                      <div
                        style={{ backfaceVisibility: 'hidden' }}
                        onClick={() => {
                          if (!isFlipped) setFlippedCardId(card.id);
                        }}
                        className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${card.colorClass} border border-white/20 p-5 cursor-pointer shadow-lg text-white flex flex-col justify-between overflow-hidden group select-none`}
                      >
                        {/* High-fidelity decorative border */}
                        <div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none group-hover:border-white/20 transition-all duration-300" />
                        
                        {/* Shimmer background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-all" />

                        <div className="flex justify-between items-start z-10">
                          <span className="text-[10px] font-mono tracking-widest text-pink-300 font-extrabold uppercase border border-pink-500/20 px-2 py-0.5 rounded bg-white">
                            {card.clinicalComplexValue.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-[9.5px] font-mono font-bold text-white/50 tracking-widest">
                            No. IX
                          </span>
                        </div>

                        {/* Middle Archetype Seal */}
                        <div className="flex flex-col items-center justify-center py-6 space-y-3 z-10">
                          <motion.div 
                            animate={isFlipped ? {} : { scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="w-20 h-20 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:border-white/30 group-hover:bg-white/10 transition-all relative"
                          >
                            <div className="absolute inset-1 rounded-full border border-dashed border-white/10 group-hover:rotate-12 transition-transform duration-1000" />
                            {card.symbol}
                          </motion.div>
                        </div>

                        <div className="space-y-2 z-10 text-center">
                          <h4 className="font-display font-black text-base tracking-tight">{card.title}</h4>
                          <span className="text-xs font-bold text-pink-300 block italic tracking-wide">{card.subtitle}</span>
                          
                          <div className="pt-3 border-t border-white/10">
                            <span className="text-[9.5px] font-bold font-mono text-white/40 tracking-wider uppercase group-hover:text-white/80 transition-colors flex items-center justify-center gap-1">
                              Tap to pull & flip 🔮
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* BACK CARD (Journal & Association Slate) */}
                      <div
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                        className="absolute inset-0 w-full h-full rounded-2xl bg-[#0b0f14] border border-slate-800 p-4 shadow-xl text-slate-100 flex flex-col justify-between overflow-hidden"
                      >
                        {/* Compact Border */}
                        <div className="absolute inset-1.5 border border-slate-800/60 rounded-xl pointer-events-none" />

                        {/* Head & Subtitle */}
                        <div className="flex justify-between items-center z-10 pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{card.symbol}</span>
                            <div>
                              <h4 className="font-display font-black text-xs text-white leading-tight">{card.title}</h4>
                              <p className="text-[9px] text-[#f472b6] font-mono font-bold tracking-wider">{card.clinicalComplexValue.replace('_', ' ').toUpperCase()} COMPLEX</p>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedCardId(null);
                            }}
                            className="p-1 text-[9.5px] font-mono text-slate-500 hover:text-[#3C3C3C] hover:bg-white rounded font-bold transition"
                          >
                            Close ✕
                          </button>
                        </div>

                        {/* Back Core Form Content (Scrollable for maximum safety) */}
                        <div className="flex-1 overflow-y-auto space-y-3 py-2 text-xs text-slate-300 pr-1 select-text">
                          <p className="text-[10.5px] text-slate-400 leading-relaxed italic border-l-2 border-pink-900 pl-2">
                            {card.description}
                          </p>

                          {/* The Analytical Prompt */}
                          <div className="bg-[#11161d] p-2.5 rounded-lg border border-slate-200 space-y-1">
                            <span className="text-[8.5px] font-extrabold text-pink-400 tracking-widest block uppercase font-mono">
                              Active Imagination Prompt:
                            </span>
                            <p className="text-[11px] leading-relaxed italic text-white font-medium">
                              "{card.prompt}"
                            </p>
                          </div>

                          {/* AI Synthesis Insight & Shadow-Work Panel */}
                          <div className="bg-gradient-to-br from-[#121820] to-[#0a0e14] p-3 rounded-xl border border-pink-950/20 space-y-2 select-text" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center bg-transparent">
                              <div className="flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-[#f472b6] font-extrabold uppercase">
                                <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
                                <span>AI Synthesis & Shadow Work</span>
                              </div>
                              {synthesisLoading ? (
                                <span className="text-[8px] text-pink-400 font-mono animate-pulse">Synthesizing...</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(ev) => { ev.stopPropagation(); fetchSynthesis(card); }}
                                  className="text-[8px] text-pink-300 hover:text-[#3C3C3C] font-mono bg-pink-50 px-1.5 py-0.5 rounded border border-pink-800/30 cursor-pointer flex items-center gap-0.5 transition"
                                >
                                  <RefreshCw className="w-2.5 h-2.5" />
                                  Refresh
                                </button>
                              )}
                            </div>

                            {synthesisLoading && (
                              <div className="space-y-2 py-1 animate-pulse">
                                <div className="h-2 bg-white rounded w-full"></div>
                                <div className="h-2 bg-white rounded w-11/12"></div>
                                <div className="h-2 bg-white rounded w-10/12"></div>
                              </div>
                            )}

                            {!synthesisLoading && synthesisError && (
                              <p className="text-[10px] text-red-400 font-semibold">⚠️ {synthesisError}</p>
                            )}

                            {!synthesisLoading && !synthesisError && synthesisInsight && (
                              <div className="space-y-2 text-left text-[11px] leading-relaxed max-h-[160px] overflow-y-auto pr-1">
                                <div className="space-y-0.5 text-slate-300">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase block font-semibold leading-none">Perspective:</span>
                                  <p>{synthesisInsight.synthesis}</p>
                                </div>
                                <div className="bg-[#1b101d] border border-pink-950/30 p-2 rounded-lg space-y-0.5">
                                  <span className="text-[8px] font-mono text-[#f472b6] uppercase block font-extrabold tracking-widest leading-none">Shadow Work Question:</span>
                                  <p className="text-pink-100 font-semibold italic">"{synthesisInsight.reflectionQuestion}"</p>
                                </div>
                                {synthesisInsight.somaticPractice && (
                                  <div className="text-[10px] bg-white p-1.5 rounded text-slate-500 border border-slate-200 leading-normal">
                                    <strong className="text-slate-300 font-mono text-[8px] uppercase block tracking-wider leading-none mb-0.5">Somatic Grounding:</strong> {synthesisInsight.somaticPractice}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Journal Input Area */}
                          <div className="space-y-1">
                            <label className="text-[8.5px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                              Association Journal Entry
                            </label>
                            <textarea
                              value={activeState.text}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleUpdateText(card.id, e.target.value)}
                              placeholder="Record core imagery, somatic feelings, or dialogues with the archetype here..."
                              className="w-full h-20 p-2 bg-white border border-slate-200 text-[#3C3C3C] rounded-lg focus:border-pink-500 focus:outline-none text-[11px] resize-none shadow-inner"
                            />
                          </div>

                          {/* Words Nodes Addition */}
                          <div className="space-y-1.5">
                            <label className="text-[8.5px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                              Active Nodes Binding (Word Associations)
                            </label>
                            
                            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={activeInputWord}
                                onChange={(e) => {
                                  const wordValue = e.target.value;
                                  setInputWordStates((prev) => ({
                                    ...prev,
                                    [card.id]: wordValue
                                  }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddWord(card.id);
                                  }
                                }}
                                placeholder="Type word (e.g. 'heavy') & press Enter"
                                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 text-[#3C3C3C] rounded-lg focus:outline-none focus:border-pink-500 text-[11px]"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddWord(card.id)}
                                disabled={(activeState.words || []).length >= 6}
                                className="px-3 bg-pink-700 hover:bg-pink-600 disabled:opacity-30 disabled:hover:bg-pink-700 text-white text-[11px] font-black rounded-lg cursor-pointer transition select-none shrink-0"
                              >
                                Bind +
                              </button>
                            </div>

                            {/* Active Words Flow inside the flipped card */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {activeState.words.map((word, wIdx) => (
                                <span
                                  key={wIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveWord(card.id, wIdx);
                                  }}
                                  className="bg-pink-50 text-pink-300 px-2 py-0.5 rounded text-[10px] font-bold border border-pink-700/40 hover:line-through hover:bg-red-50 hover:text-red-300 cursor-pointer flex items-center gap-1 transition"
                                >
                                  <span>{word}</span>
                                  <span className="text-[9px] opacity-60">×</span>
                                </span>
                              ))}
                              {activeState.words.length === 0 && (
                                <p className="text-[9px] text-slate-500 italic block font-semibold leading-relaxed">
                                  Plot up to 6 association nodes on the outer Mandala.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Button Row */}
                        <div className="z-10 pt-2 border-t border-slate-200 flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedCardId(null);
                            }}
                            className="flex-1 py-1 px-3 bg-white hover:bg-white text-slate-300 text-[10.5px] uppercase font-bold rounded-lg border border-slate-200 cursor-pointer transition select-none flex items-center justify-center gap-1"
                          >
                            Reset
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveReflection(card.id);
                            }}
                            disabled={!activeState.text.trim() && activeState.words.length === 0}
                            className="flex-1 py-1.5 px-3 bg-pink-700 hover:bg-pink-700 disabled:opacity-40 text-white text-[10.5px] uppercase font-black rounded-lg cursor-pointer transition select-none flex items-center justify-center gap-1"
                          >
                            Commit Journal
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Saved Reflections */}
          {savedReflections.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block tracking-wider">
                Historic Analytical Reflections Log ({savedReflections.length})
              </span>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {savedReflections.map((ref) => (
                  <div key={ref.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 transition hover:border-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">
                        Archetype: {ref.cardTitle}
                      </span>
                      <span className="text-[9px] text-[#831843] font-mono font-bold uppercase tracking-widest bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                        Synthesized
                      </span>
                    </div>
                    {ref.reflections && <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic bg-white/80 p-2 rounded border border-slate-100/50">"{ref.reflections}"</p>}
                    <div className="flex flex-wrap gap-1">
                      {ref.words.map((w, i) => (
                        <span key={i} className="text-[9.5px] bg-slate-100 font-bold px-1.5 py-0.5 select-none border border-slate-200 text-slate-600 rounded">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: THE ASSOCIATION MANDALA INTERACTIVE LAB (lg:span-5) */}
        <div id="association-mandala-lab-column" className="lg:col-span-5 bg-[#0f171d] text-slate-100 p-4 md:p-5 rounded-2xl flex flex-col justify-between space-y-4">
          
          <div className="space-y-3.5 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b border-slate-200 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4 text-pink-500 animate-pulse" />
                <span>Subconscious Web Lab</span>
              </h4>
              
              {/* High-Fidelity Toggler */}
              <div className="flex bg-[#070b0e] p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setVisualizerMode('session')}
                  className={`py-1 px-2.5 rounded-lg text-[9.5px] uppercase font-black tracking-tight transition cursor-pointer select-none ${
                    visualizerMode === 'session'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Active Pull
                </button>
                <button
                  type="button"
                  onClick={() => setVisualizerMode('constellation')}
                  className={`py-1 px-2.5 rounded-lg text-[9.5px] uppercase font-black tracking-tight transition cursor-pointer select-none flex items-center gap-1.5 ${
                    visualizerMode === 'constellation'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Mandala Web</span>
                  <span className="bg-pink-50 text-pink-300 text-[8px] px-1.5 py-0.5 rounded-full border border-pink-700/30 font-mono font-bold">
                    {savedReflections.length}
                  </span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              {visualizerMode === 'session' 
                ? "Showing current session's direct linkages from dynamic conscious word tags to the focal archetype complex quadrant."
                : "A multi-link interactive mental constellation plotting historical card pulls, associated descriptors, and your overarching complexes."
              }
            </p>
          </div>

          {/* Mandala Visualizer Canvas */}
          <div className="relative border border-slate-200 bg-[#070b0e] rounded-xl flex items-center justify-center p-1.5 shadow-inner">
            
            {/* Background coordinate grid helper lines */}
            <div className="absolute inset-0 border border-slate-900/10 rounded-lg pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-0 w-full h-px border-t border-slate-200 shadow-xs" />
              <div className="absolute left-1/2 top-0 w-px h-full border-l border-slate-200 shadow-xs" />
            </div>

            {/* Render 'Session Mode' SVG Map */}
            {visualizerMode === 'session' && (
              <svg
                id="jung-mandala-session"
                width={340}
                height={340}
                className="w-full max-w-[340px] aspect-square text-white select-none"
              >
                <defs>
                  <radialGradient id="mandalaCoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Central base cosmic radial gradient */}
                <circle cx={svgMandalaMarkup.center.x} cy={svgMandalaMarkup.center.y} r={140} fill="url(#mandalaCoreGlow)" />

                {/* Outer boundary halo circle */}
                <circle
                  cx={svgMandalaMarkup.center.x}
                  cy={svgMandalaMarkup.center.y}
                  r={134}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth={1.5}
                  strokeDasharray="4,4"
                />

                {/* Connected pathway paths */}
                {selectedCard && svgMandalaMarkup.wordNodes.map((wNode, idx) => {
                  const targetComplex = svgMandalaMarkup.complexes.find((c) => c.id === selectedCard.clinicalComplexValue);
                  if (!targetComplex) return null;
                  return (
                    <g key={`path-${idx}`}>
                      <line
                        x1={wNode.x}
                        y1={wNode.y}
                        x2={targetComplex.x}
                        y2={targetComplex.y}
                        stroke="#ec4899"
                        strokeWidth={1.8}
                        strokeOpacity={0.7}
                        className="animate-pulse"
                      />
                      <line
                        x1={svgMandalaMarkup.center.x}
                        y1={svgMandalaMarkup.center.y}
                        x2={wNode.x}
                        y2={wNode.y}
                        stroke="#1e293b"
                        strokeWidth={0.8}
                        strokeDasharray="3,3"
                      />
                    </g>
                  );
                })}

                {/* Complexes circle node rings */}
                {svgMandalaMarkup.complexes.map((c) => (
                  <g key={c.id}>
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={24}
                      fill="#0f1721"
                      stroke={selectedCard?.clinicalComplexValue === c.id ? '#ec4899' : '#1e293b'}
                      strokeWidth={selectedCard?.clinicalComplexValue === c.id ? 2.5 : 1.2}
                      className="transition-all duration-300"
                    />
                    <text
                      x={c.x}
                      y={c.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={selectedCard?.clinicalComplexValue === c.id ? '#ec4899' : '#94a3b8'}
                      style={{ fontSize: '7.5px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 'bold' }}
                    >
                      {c.label}
                    </text>
                  </g>
                ))}

                {/* Central Self representation */}
                <circle
                  cx={svgMandalaMarkup.center.x}
                  cy={svgMandalaMarkup.center.y}
                  r={14}
                  fill="#ec4899"
                  fillOpacity={0.25}
                  stroke="#ec4899"
                  strokeWidth={2}
                />
                <text
                  x={svgMandalaMarkup.center.x}
                  y={svgMandalaMarkup.center.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  style={{ fontSize: '7px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 'black' }}
                >
                  SELF
                </text>

                {/* Word Nodes outer tags */}
                {svgMandalaMarkup.wordNodes.map((wNode, i) => (
                  <g key={`word-${i}`}>
                    <rect
                      x={wNode.x - 32}
                      y={wNode.y - 10}
                      width={64}
                      height={20}
                      rx={6}
                      fill="#101827"
                      stroke="#ec4899"
                      strokeWidth={1.2}
                    />
                    <text
                      x={wNode.x}
                      y={wNode.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      style={{ fontSize: '8px', fontWeight: 'bold' }}
                    >
                      {wNode.word.toUpperCase()}
                    </text>
                  </g>
                ))}

                {!selectedCard && (
                  <g>
                    <rect
                      x={60}
                      y={150}
                      width={220}
                      height={40}
                      rx={8}
                      fill="#0f171d"
                      stroke="#1e293b"
                      strokeWidth={1}
                    />
                    <text
                      x={170}
                      y={174}
                      textAnchor="middle"
                      fill="#ffb3c5"
                      style={{ fontSize: '10px', fontWeight: 'semibold' }}
                    >
                      Tap & pull a card on the left to map nodes
                    </text>
                  </g>
                )}
              </svg>
            )}

            {/* Render 'Historical Constellation Mandala' SVG Map */}
            {visualizerMode === 'constellation' && (
              <svg
                id="jung-mandala-constellation"
                width={340}
                height={340}
                className="w-full max-w-[340px] aspect-square text-white select-none"
              >
                <defs>
                  <radialGradient id="constellGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Background soft celestial glow */}
                <circle cx={constellationWeb.center.x} cy={constellationWeb.center.y} r={140} fill="url(#constellGlow)" />

                {/* Space out orbits rings */}
                <circle cx={constellationWeb.center.x} cy={constellationWeb.center.y} r={65} fill="none" stroke="#0f172a" strokeWidth={1} strokeDasharray="2,5" />
                <circle cx={constellationWeb.center.x} cy={constellationWeb.center.y} r={105} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="1,6" />
                <circle cx={constellationWeb.center.x} cy={constellationWeb.center.y} r={142} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="3,3" />

                {/* Connective Pathway Web lines with hover logic */}
                {constellationWeb.links.map((link) => {
                  // Real-time hover matching logic
                  const isSomeHovered = hoveredComplexId || hoveredCardId || hoveredWord;
                  let strokeWidth = 1.0;
                  let strokeColor = "#1e293b";
                  let strokeOpacity = 0.22;
                  let isMatch = false;

                  if (isSomeHovered) {
                    if (hoveredComplexId && link.complexId === hoveredComplexId) isMatch = true;
                    if (hoveredCardId && link.cardId === hoveredCardId) isMatch = true;
                    if (hoveredWord && link.wordValue === hoveredWord) isMatch = true;

                    strokeOpacity = isMatch ? 0.95 : 0.05;
                    strokeColor = isMatch ? "#ec4899" : "#0f172a";
                    strokeWidth = isMatch ? (link.type === 'self-complex' ? 2.5 : 1.5) : 0.6;
                  } else {
                    // Default values
                    if (link.type === 'self-complex') { strokeOpacity = 0.6; strokeColor = "#475569"; strokeWidth = 1.2; }
                    else if (link.type === 'complex-card') { strokeOpacity = 0.55; strokeColor = "#ec4899"; strokeWidth = 1.0; }
                    else if (link.type === 'card-word') { strokeOpacity = 0.28; strokeColor = "#334155"; strokeWidth = 0.8; }
                  }

                  return (
                    <line
                      key={link.id}
                      x1={link.sourceX}
                      y1={link.sourceY}
                      x2={link.targetX}
                      y2={link.targetY}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={strokeOpacity}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Render Core Complexes */}
                {constellationWeb.complexes.map((c) => {
                  const isHovered = hoveredComplexId === c.id;
                  const isCurrentHighlight = hoveredComplexId ? isHovered : (hoveredCardId && constellationWeb.cardNodes.find(cn => cn.id === hoveredCardId)?.clinicalComplexValue === c.id);
                  const isAnyHovered = hoveredComplexId || hoveredCardId || hoveredWord;
                  const opacity = isAnyHovered ? (isCurrentHighlight ? 1 : 0.3) : 1;

                  return (
                    <g
                      key={`comp-${c.id}`}
                      onMouseEnter={() => setHoveredComplexId(c.id)}
                      onMouseLeave={() => setHoveredComplexId(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isHovered ? 20 : 17}
                        fill="#0b0f14"
                        stroke={isCurrentHighlight ? "#f43f5e" : "#3b82f6"}
                        strokeWidth={isCurrentHighlight ? 2.2 : 1.2}
                        opacity={opacity}
                        className="transition-all duration-350"
                      />
                      <text
                        x={c.x}
                        y={c.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isCurrentHighlight ? "#f43f5e" : "#94a3b8"}
                        opacity={opacity}
                        style={{ fontSize: '6px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 'bold' }}
                      >
                        {c.label}
                      </text>
                    </g>
                  );
                })}

                {/* Render Pulled Cards (Middle ring) */}
                {constellationWeb.cardNodes.map((cn) => {
                  const isHovered = hoveredCardId === cn.id;
                  const isMatchingComplex = hoveredComplexId && cn.clinicalComplexValue === hoveredComplexId;
                  const isMatchingWord = hoveredWord && cn.words.map(w => w.toLowerCase()).includes(hoveredWord);
                  const isCurrentHighlight = isHovered || isMatchingComplex || isMatchingWord;
                  const isAnyHovered = hoveredComplexId || hoveredCardId || hoveredWord;
                  const opacity = isAnyHovered ? (isCurrentHighlight ? 1 : 0.2) : 0.9;

                  // Find corresponding card symbol
                  const symbol = MYTHIC_CARDS.find(mc => mc.title === cn.title)?.symbol || '🔮';

                  return (
                    <g
                      key={`cardnode-${cn.id}`}
                      onMouseEnter={() => setHoveredCardId(cn.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={cn.x}
                        cy={cn.y}
                        r={isHovered ? 11 : 9}
                        fill="#101827"
                        stroke={isCurrentHighlight ? "#ec4899" : "#475569"}
                        strokeWidth={isCurrentHighlight ? 2 : 1}
                        opacity={opacity}
                        className="transition-all duration-300"
                      />
                      <text
                        x={cn.x}
                        y={cn.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        opacity={opacity}
                        style={{ fontSize: isHovered ? '9.5px' : '8.5px' }}
                      >
                        {symbol}
                      </text>
                    </g>
                  );
                })}

                {/* Render Word tag Nodes (Outer periphery ring) */}
                {constellationWeb.wordNodes.map((wn, idx) => {
                  const isHovered = hoveredWord === wn.word;
                  const parentCardConnected = hoveredCardId && constellationWeb.cardNodes.find(cn => cn.id === hoveredCardId)?.words.map(w => w.toLowerCase()).includes(wn.word);
                  const parentComplexConnected = hoveredComplexId && constellationWeb.cardNodes.filter(cn => cn.clinicalComplexValue === hoveredComplexId).flatMap(cn => cn.words.map(w => w.toLowerCase())).includes(wn.word);
                  const isCurrentHighlight = isHovered || parentCardConnected || parentComplexConnected;
                  const isAnyHovered = hoveredComplexId || hoveredCardId || hoveredWord;
                  const opacity = isAnyHovered ? (isCurrentHighlight ? 1 : 0.15) : 0.85;

                  return (
                    <g
                      key={`wordnode-${idx}`}
                      onMouseEnter={() => setHoveredWord(wn.word)}
                      onMouseLeave={() => setHoveredWord(null)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={wn.x - 22}
                        y={wn.y - 7}
                        width={44}
                        height={14}
                        rx={4}
                        fill="#040608"
                        stroke={isCurrentHighlight ? "#ec4899" : "#1e293b"}
                        strokeWidth={isCurrentHighlight ? 1.4 : 0.8}
                        opacity={opacity}
                        className="transition-all duration-300"
                      />
                      <text
                        x={wn.x}
                        y={wn.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isCurrentHighlight ? "#fff" : "#94a3b8"}
                        opacity={opacity}
                        style={{ fontSize: '6px', fontWeight: 'bold', fontFamily: 'var(--font-mono, monospace)' }}
                      >
                        {wn.word.toUpperCase()}
                      </text>
                    </g>
                  );
                })}

                {/* Center SELF Anchor */}
                <circle
                  cx={constellationWeb.center.x}
                  cy={constellationWeb.center.y}
                  r={11}
                  fill="#f43f5e"
                  fillOpacity={0.25}
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                />
                <text
                  x={constellationWeb.center.x}
                  y={constellationWeb.center.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  style={{ fontSize: '5.5px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 'black' }}
                >
                  SELF
                </text>
              </svg>
            )}
          </div>

          {/* Dynamic Interactive Metadata Tooltip popover plate */}
          <div className="bg-[#0b0f14] border border-slate-200 rounded-xl p-3 min-h-[72px] flex flex-col justify-center text-left">
            {!hoveredComplexId && !hoveredCardId && !hoveredWord && (
              <div className="space-y-1">
                <span className="text-[7.5px] font-mono tracking-widest text-slate-500 font-extrabold uppercase block">
                  Mandala Telemetry System
                </span>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  💡 Move cursor over <strong>complexes</strong>, <strong>pulled card nodes</strong>, or <strong>word descriptors</strong> inside the constellation to isolate dynamic psych-pathway connects.
                </p>
              </div>
            )}

            {hoveredComplexId && (
              <div className="space-y-1 animate-fade-in">
                <span className="text-[8px] font-mono font-extrabold text-[#3b82f6] uppercase tracking-widest leading-none block">
                  Psychic Complex quadrant • Active Hover
                </span>
                <h5 className="text-[11px] font-bold text-white font-mono uppercase leading-tight">
                  {hoveredComplexId.replace('_', ' ').toUpperCase()} Compartment
                </h5>
                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                  {hoveredComplexId === 'ego' && "Conscious executive center of agency, willpower, and logical daily navigation."}
                  {hoveredComplexId === 'persona' && "The protective outer boundary, social adjustments, and protective armor mechanisms."}
                  {hoveredComplexId === 'shadow' && "Container for repressed feelings, unacceptable traits, hidden shame, and dark creativity."}
                  {hoveredComplexId === 'anima_animus' && "The feminine/masculine inner mirror mediating communication with the deep soul."}
                </p>
              </div>
            )}

            {hoveredCardId && (() => {
              const hoverNode = constellationWeb.cardNodes.find(cn => cn.id === hoveredCardId);
              if (!hoverNode) return null;
              return (
                <div className="space-y-1 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">
                      Saved Archetype Pull • Active Hover
                    </span>
                    <span className="text-[7.5px] bg-white border border-slate-200 text-slate-500 px-1 rounded font-mono">
                      {hoverNode.timestamp}
                    </span>
                  </div>
                  <h5 className="text-[11px] font-black text-rose-300 leading-none">
                    {hoverNode.title} ({hoverNode.clinicalComplexValue.replace('_', ' ').toUpperCase()})
                  </h5>
                  <p className="text-[10px] text-slate-300 leading-snug italic line-clamp-2">
                    "{hoverNode.reflections || "No journal notes committed."}"
                  </p>
                </div>
              );
            })()}

            {hoveredWord && (() => {
              // Find which cards contain this word
              const associatedCards = constellationWeb.cardNodes?.filter(cn => cn.words.map(w => w.toLowerCase()).includes(hoveredWord)) || [];
              return (
                <div className="space-y-1 animate-fade-in">
                  <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">
                    Conscious Association tag • Active Hover
                  </span>
                  <h5 className="text-[11.5px] font-bold text-white font-mono">
                    "{hoveredWord.toUpperCase()}" Node
                  </h5>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Flows raw current energy towards: <strong className="text-pink-300">{associatedCards.map(c => c.title).join(', ') || 'N/A'}</strong>
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Dynamic Unconscious Constellation Synthesis Panel */}
          {savedReflections.length > 0 && (
            <div className="bg-gradient-to-b from-[#141d24]/90 to-[#0e161c] border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div 
                onClick={() => setSynthesisExpanded(!synthesisExpanded)}
                className="flex justify-between items-center cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="text-[9.5px] font-extrabold font-mono text-slate-200 tracking-wider">
                    {dynamicSynthesis.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-pink-50 text-pink-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-pink-700/30 uppercase">
                    {dynamicSynthesis.intensity}
                  </span>
                </div>
              </div>

              {synthesisExpanded && (
                <div className="space-y-2 text-[10px] text-slate-300 border-t border-slate-200 pt-2 text-left leading-relaxed animate-fade-in font-medium">
                  <p className="text-slate-300">
                    {dynamicSynthesis.diagnosis}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[#8c9ba5] text-[8px] border-t border-slate-200">
                    <div className="text-center bg-[#070b0e] p-1 rounded">
                      <span className="block text-slate-500 uppercase">Words Bound</span>
                      <strong className="text-white text-[10px]">
                        {Array.from(new Set(savedReflections.flatMap(r => r.words))).length}
                      </strong>
                    </div>
                    <div className="text-center bg-[#070b0e] p-1 rounded">
                      <span className="block text-slate-500 uppercase">Complexes Mapped</span>
                      <strong className="text-white text-[10px]">
                        {Array.from(new Set(savedReflections.map(r => r.clinicalComplexValue))).length} / 4
                      </strong>
                    </div>
                    <div className="text-center bg-[#070b0e] p-1 rounded">
                      <span className="block text-slate-500 uppercase">Depth Metric</span>
                      <strong className="text-pink-400 text-[10px]">
                        {Math.min(99, savedReflections.length * 33)}%
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-slate-200 pt-2 flex items-start gap-2 text-[9.5px] text-slate-400 leading-normal">
            <Info className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
            <p>
              When a psychic quadrant (e.g. Shadow or Persona) holds unexpressed material, it absorbs daytime behavior. Active imagination connects nodes to dissolve structural projections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
