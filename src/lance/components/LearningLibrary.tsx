import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Heart, ArrowLeft, ArrowRight, Sparkles, Compass, Headphones, Phone, MessageSquare } from 'lucide-react';

interface LibraryResource {
  id: string;
  title: string;
  description: string;
  category: string;
  domain: string;
  duration: string;
  contentMarkdown: string;
  practiceToolId?: string;
  practiceLabel?: string;
}

const RESOURCES: LibraryResource[] = [
  {
    id: 'behavioral-operant',
    category: 'behavioral',
    domain: 'Behavioral Science',
    title: 'Behavioral Conditioning: Operant Reinforcements & Variables',
    description: 'Learn how to masterfully sculpt behaviors using positive/negative reinforcers and scheduling variables.',
    duration: '6 min read',
    practiceToolId: 'behavioral_lab',
    practiceLabel: 'Practice in Behavioral Lab',
    contentMarkdown: `Behavioral psychology states that all human actions are shaped, sustained, or extinguished by consequences. To cultivate highly persistent daily behaviors, clinicians utilize Operant Conditioning frameworks.

### The Four Quadrants of Behavioral Reinforcement:
• **Positive Reinforcement (🟢 ADD Stimulus):** Supplying a highly desirable reward (e.g., a warm drink, a gamified token, or social praise) immediately after executing a target action. This builds robust dopaminergic anticipation.
• **Negative Reinforcement (🔵 REMOVE Stimulus):** Removing or escaping an undesirable stimulus immediately after a behavior is completed (e.g., turning off a screaming alarm, or decluttering an inbox). This increases the repeating frequency of that behavior.
• **Positive Punishment (🟠 ADD Friction):** Introducing a challenging or unpleasant stimulus when an undesired action occurs (e.g., writing a 3-line reflection after failing a routine). This creates a protective effort barrier.
• **Negative Punishment (🔴 REMOVE Privilege):** Revoking a desirable privilege when an undesired habit is executed (e.g., limiting screen scroll time). This trains the brain to associate distraction with immediate outcome penalties.

### Schedules of Reinforcement (Variables):
The timing of your rewards governs the strength and resilience of the habit:
1. **Fixed Ratio (FR):** Reward occurs after a predictable number of completions (e.g., every 3 sessions). Builds rapid repetition pace, but is vulnerable to post-reinforcement pauses.
2. **Variable Ratio (VR):** Reward is intermittent and unpredictable (e.g., an average of 3 trials). Builds the most persistent habits and has the **highest resistance to extinction**.
3. **Fixed Interval (FI):** Reward occurs after a fixed, expected duration of time. Tends to produce a "scalloped" effort curve where the action accelerates right before the reward window.
4. **Variable Interval (VI):** Reward timing is unpredictable, occurring on random temporal intervals. This maintains a highly stable and consistent rate of positive behavior.

*Apply active conditioning plans inside the **Behavioral Lab** to simulate trials and track your patterns in real time.*`,
  },
  {
    id: 'erikson-lifespan',
    category: 'developmental',
    domain: 'Developmental Psychology',
    title: "Erikson's Psychosocial Development & Conflict Integration",
    description: "How to map developmental conflicts and synthesize Erik Erikson's 8 stages of life to unlock virtues.",
    duration: '8 min read',
    practiceToolId: 'erikson_map',
    practiceLabel: 'Practice in Erikson Development Map',
    contentMarkdown: `Erik Erikson's lifespan theory holds that psychological health is created by moving constructively through eight distinct stages of development, with each stage characterized by an essential developmental "Psychosocial Crisis."

### The 8 Lifespan Stages and Associated Crises:
1. **Infancy (0-1.5 yrs): Trust vs. Mistrust** — "Is the world safe and predictable?" Unlocks the virtue of **Hope**.
2. **Toddlerhood (1.5-3 yrs): Autonomy vs. Shame & Doubt** — "Is it okay to set personal boundaries?" Unlocks the virtue of **Will**.
3. **Preschool (3-5 yrs): Initiative vs. Guilt** — "Is it safe for me to imagine, move, and build?" Unlocks the virtue of **Purpose**.
4. **School Age (5-12 yrs): Industry vs. Inferiority** — "Can I master complex skills?" Unlocks the virtue of **Competence**.
5. **Adolescence (12-18 yrs): Identity vs. Role Confusion** — "Who am I separate from peers and caregivers?" Unlocks the virtue of **Fidelity**.
6. **Young Adulthood (18-40 yrs): Intimacy vs. Isolation** — "Can I share my vulnerabilities and love?" Unlocks the virtue of **Love**.
7. **Adulthood (40-65 yrs): Generativity vs. Stagnation** — "Can I make my efforts and legacy count?" Unlocks the virtue of **Care**.
8. **Maturity (65+ yrs): Ego Integrity vs. Despair** — "Is it okay to have been me?" Unlocks the virtue of **Wisdom**.

### Resolving Developmental Trauma & Stagnation:
When a crisis is unresolved, we carry its cognitive distortions (e.g. chronic self-doubt, shame, isolation) into adulthood. Integrating these conflicts is called **Lifespan Integration**:
• **Acknowledge the Split:** Trace present emotional triggers to their developmental root (e.g., a fear of commitment tracing back to Toddlerhood Autonomy struggles).
• **Journaling Synthesis:** Actively write memories, reframing them with compassionate adult self-talk, cultivating the stage's target virtue.
• **Re-Parenting Practices:** Commit to specific daily micro-habits that directly nurture the missing virtue. For example, to build *Will*, practice saying "no" to minor misaligned requests daily.

*Log developmental conflicts inside the **Erikson Development Map** to receive a clinical synthesis summary.*`,
  },
  {
    id: 'neuroplasticity-behavior',
    category: 'neuroscience',
    domain: 'Neurobiology',
    title: 'The Neuroscience of Neuroplasticity: Myelination & Habit Stacking',
    description: 'Understand how long-term potentiation, synaptogenesis, and myelination structurally re-wire the biological brain.',
    duration: '5 min read',
    practiceToolId: 'habit_neuro_stacker',
    practiceLabel: 'Practice in Habit Neuro Stacker',
    contentMarkdown: `Neuroplasticity is the structural alteration of the nervous system in response to repetitive behaviors or deep learning. The brain is not a static machine; it is a dynamic electrical network that constantly prunes and reinforces active signals.

### Core Cellular Mechanisms of Habit Repatterning:
• **Synaptogenesis:** When you repeatedly perform a target behavior, a pre-synaptic axon terminal releases neurotransmitters across the synaptic cleft, forming new connections with receptors. This makes the cognitive trigger transition smoother.
• **Myelination:** Repeating a behavior signals oligodendrocytes to wrap a protective lipid insulation layer called **myelin** around active axons. Higher myelination speeds up neural transmission dramatically, turning a hard behavior into an effortless autopilot routine.
• **Long-Term Potentiation (LTP):** "Neurons that fire together, wire together." Steady electrical impulses strengthen synaptic pathways, raising the threshold of the habit's resistance to extinction.

### Tactical Re-wiring of Behaviors:
To build a sustainable path, combine cellular neuroscience with behavioral psychology:
1. **Stack Your Connections:** Attach a new desired behavior to an already highly myelinated existing pathway (e.g., "Immediately after I brew my morning tea, I will spend 5 minutes checking in").
2. **Trigger Rapid Synthesis:** Use Variable Ratio reward schedules to keep dopamine spikes active, accelerating consolidation.
3. **Practice Conscious Repetition:** A single repetition does not trigger myelination — it is persistent, high-frequency focus loops that instruct the brain to grow permanent structural pathways.

*Simulate habit stacks and track stability in the **Habit Neuro Stacker**.*`,
  },
  {
    id: 'mindful-1',
    category: 'mindfulness',
    domain: 'Recommended first read',
    title: 'Morning Clarity Walk',
    description: 'A guided walking meditation script for your daily path.',
    duration: '4 min read',
    practiceToolId: 'anchor_visualization',
    practiceLabel: 'Practice in Safe Place Sanctuary',
    contentMarkdown: `Start walking at a natural, comfortable pace.

1. **Posture:** Stand tall, let your arms hang loosely. Direct your attention to your breath.
2. **Step Sensation:** Feel the exact moment the heel of your foot strikes the earth, roll forward onto your toes, and lift. Focus on that micro-sensation for 3 steps.
3. **Ambient Observation:** Now expand your field of vision. Name three colors you notice, and notice how the air touches your cheeks.
4. **Resiliency Mantra:** Whisper softly to yourself: "With each step, I ground myself in the present. I am secure."`,
  },
  {
    id: 'jung-shadow',
    category: 'jungian',
    domain: 'Jungian therapy',
    title: 'Jungian Shadow Work: Healing the Split Self',
    description: 'Learn to observe, converse with, and integrate the "Shadow" — the repressed aspects of your subconscious.',
    duration: '6 min read',
    practiceToolId: 'shadow_journal',
    practiceLabel: 'Practice in Shadow Journal',
    contentMarkdown: `Carl Jung introduced the concept of the **Shadow** to refer to the unconscious, repressed, or disowned parts of our personality. When we ignore these qualities (such as anger, desire, or vulnerability), we experience inner conflict, anxiety, and projection (attributing our own faults onto others).

### The Path to Integration:
1. **Notice Your Triggers:** Strong negative emotional reactions to someone else's behavior are usually projections of our own unacknowledged Shadow.
2. **Engage with Curiosity:** Instead of criticizing yourself for feeling anger, jealousy, or insecurity, ask: *"What unmet need or hidden part of myself does this feeling represent?"*
3. **Write It Down:** Unmasking the Shadow requires honest expressive writing. Note your secret fears and automatic critical responses without judgment.
4. **Apply CBT Reframing:** Once conscious, you can analyze these thoughts constructively and find a healthy expression for them rather than letting them run on autopilot.`,
  },
  {
    id: 'jung-archetypes',
    category: 'jungian',
    domain: 'Self-actualization',
    title: 'Archetypes & Individuation',
    description: 'Navigate your primary internal archetypes (the Sage, Hero, Shadow, Persona) to set meaningful values.',
    duration: '5 min read',
    practiceToolId: 'smart_goals',
    practiceLabel: 'Turn this into a SMART Goal',
    contentMarkdown: `**Individuation** is the lifetime journey of self-realization and psychological wholeness. In Jungian psychology, it is achieved by acknowledging and balancing the core archetypes that shape our psyche:

• **The Persona:** The social mask we wear to adapt to external society. (Over-identifying with it leads to feeling like an imposter.)
• **The Shadow:** The unexpressed, instinctual self.
• **The Anima / Animus:** The balance of receptive and assertive forces within us.
• **The Self:** The unified center of consciousness and unconsciousness.

### Application for Purpose:
To live an integrated, authentic life, your actions must align with your true Self rather than just serving the social mask of the Persona.

Convert these archetypal insights into actionable value-driven milestones. For example:
- *Sage alignment:* Set a reading or learning goal.
- *Hero alignment:* Set an assertive challenge to overcome a boundary.
- *Healer alignment:* Set goals around self-care and rest limits.`,
  },
  {
    id: 'somatic-stretches',
    category: 'somatic',
    domain: 'Physical healing',
    title: 'Somatic Posture Reset & Stretching',
    description: 'Understand the feedback loop between body posture, cortisol levels, and chronic muscle tension.',
    duration: '4 min read',
    practiceToolId: 'physical_wellness',
    practiceLabel: 'Practice in Physical Wellness',
    contentMarkdown: `Your physiological body holds stress that the executive brain cannot always talk itself out of. When you experience sustained anxiety or cognitive overwhelm, your nervous system triggers a slight "bracing posture" — elevated shoulders, contracted chest, a clenched jaw, and shallow ribcage breathing.

### The Posture-Emotion Feedback Loop:
Research shows that physical bracing sends signal feedback to the amygdala, confirming that you are in a "threat state," which perpetuates high cortisol and adrenaline levels.

By actively performing intentional, structured stretches, you physically signal safety back to your autonomic nervous system, instantly breaking the stress loop.

### How to Apply:
Run through a timed stretching routine focusing on the high-tension junctions of your neck, shoulders, spine, and wrists.`,
  },
  {
    id: 'breath-vagus',
    category: 'mindfulness',
    domain: 'Nervous system',
    title: 'Vagal Downregulation & Slower Breathing',
    description: 'The neuromuscular science of why diaphragmatic breathing stops panic attacks and acute anxiety.',
    duration: '3 min read',
    practiceToolId: 'breathwork_478',
    practiceLabel: 'Practice in Breathwork',
    contentMarkdown: `When stress triggers your sympathetic nervous system ("fight-or-flight"), your baseline respiration speeds up and chest-breathing takes over. This results in hyperventilation, compounding feelings of panic, dizziness, and somatic distress.

**Paced diaphragmatic breathwork** activates the parasympathetic nervous system ("rest-and-digest") by stimulating the **vagus nerve**. When your exhalation is longer than your inhalation, the vagus nerve secretes acetylcholine, which physically lowers your heart rate and signals safety.

### The Paced Breathwork Drill:
1. **Inhale (4s):** Expand your lower abdomen.
2. **Hold (4s):** Calmly let the gas exchange stabilize.
3. **Exhale (4s):** Slowly empty, letting your shoulders droop.
4. **Hold Empty (4s):** Induce state safety before the next breath.`,
  },
  {
    id: 'grounding-1',
    category: 'grounding',
    domain: 'Panic reduction',
    title: '5-4-3-2-1 Sensory Grounding',
    description: 'A classic, rapid exercise to reconnect with the present moment and soothe panic.',
    duration: '3 min read',
    practiceToolId: 'grounding_54321',
    practiceLabel: 'Practice 5-4-3-2-1 Grounding',
    contentMarkdown: `When you feel overwhelmed, find a comfortable seat, press both feet flat to the floor, and follow this sequence:

• **5 things you can see:** Spot five things around you. Be specific: "The green leaf," "The silver screw," "The pattern on the floor."
• **4 things you can touch:** Run your hand along your pants, touch a cool window pane, feel the grain of a wooden surface.
• **3 things you can hear:** Close your eyes. Listen for the hum of the air conditioner, birds outside, or distant tires rolling.
• **2 things you can smell:** Breathe deep. Identify the scent of coffee, soap, or paper.
• **1 thing you can taste:** Savor the lingering taste of fresh water or tea.`,
  },
  {
    id: 'cbt-1',
    category: 'cbt',
    domain: 'Cognitive reframing',
    title: 'CBT Cognitive Reframing',
    description: 'Evidence-based tools for reframing critical thoughts and negative behavioral flows.',
    duration: '5 min read',
    practiceToolId: 'cbt_reframe',
    practiceLabel: 'Practice in Quick Thought Reframe',
    contentMarkdown: `Reframing is not about happy thinking; it is about objective, balanced thinking. Use these steps next time you experience a harsh automatic thought:

1. **The Automatic Thought:** Write down the unedited thought (e.g., "I will fail this presentation and ruin my reputation entirely").
2. **Cognitive Distortion Spotting:** Is this "All-or-Nothing" thinking? "Fortune Telling"? Spot the exaggeration.
3. **Evidence Gatherer:** Write down two strong proofs that contradict the disaster scenario (e.g., "I have successfully run meetings before," "People are generally helpful").
4. **The Balanced Alternative:** Rewrite a compassionate, balanced instruction: "I may feel nervous, but I am well prepared, and one mistake does not define my capability."`,
  },
  {
    id: 'mindful-2',
    category: 'mindfulness',
    domain: 'Ambient practice',
    title: 'Forest Soundscape Visualization',
    description: 'A calming wilderness visualization script for steady focus and peaceful sleep prep.',
    duration: '3 min read',
    practiceToolId: 'sound_bath',
    practiceLabel: 'Practice in Sound Bath Studio',
    contentMarkdown: `Unpack this forest visualization to drop your stress level:

• Spend 5 minutes visualizing warm green pine branches hanging gently above you.
• Notice how the woodsy, damp smell envelops your senses.
• Breathe out in alignment with the soft wind sounds.
• Close your eyes, and allow repetitive stress thoughts to float down like falling autumn leaves.`,
  },
  {
    id: 'art-therapy-guide',
    category: 'art-therapy',
    domain: 'Expressive art',
    title: 'Art Therapy: Giving Shape to Wordless Clutter',
    description: 'Learn how visual expression triggers deep neurobiological relaxation when verbal processing is blocked.',
    duration: '5 min read',
    practiceToolId: 'art_therapy',
    practiceLabel: 'Practice in Art Therapy Studio',
    contentMarkdown: `Visual art therapy is a form of sensory expression. When we experience emotional blocks, our cerebral cortex struggles to find literal vocabulary to communicate the stress.

By choosing colors and letting your fingers or brush drift organically across the canvas, you:

• **Externalize inner shadows:** Project heavy or anxious thoughts onto a physical medium. This provides cognitive distance (the "it" is on the canvas, not "in" me).
• **Re-wire nervous system responses:** Different pigments have real, measured somatic resonance. Warm colors elicit vibrant hope and safe release, while cool strokes provide soothing rest.
• **Initiate non-verbal processing:** Engaging with shapes, patterns, and contours bypasses rational cognitive filters, unlocking experiences that traditional talking therapies might not immediately touch.`,
  },
  {
    id: 'art-colorology',
    category: 'art-therapy',
    domain: 'Color psychology',
    title: 'Therapeutic Color Choices & Subconscious Metaphor',
    description: 'Decode the psychological meaning of colors and stroke patterns in your subconscious art.',
    duration: '4 min read',
    practiceToolId: 'art_therapy',
    practiceLabel: 'Practice in Art Therapy Studio',
    contentMarkdown: `Our choice of colors is rarely accidental. It often reveals active subconscious states:

• **Deep blue/indigo:** Desire for quiet containment, somatic safety, or peaceful shelter to process sorrow and seek rest.
• **Bright crimson/orange:** Emotional release, raw energy, anger, or a sudden emergence of resilient spark.
• **Softer emerald/mint:** Bodily restoration, deep slow breathing, physical boundary healing, and safe environments.
• **Violets/daydream purples:** Unlocked intuition, a search for cognitive space, mental containment, and hope.`,
  },
  {
    id: 'sobriety-1',
    category: 'sobriety',
    domain: 'Brain chemistry',
    title: 'The Neurological Pulse of Craving',
    description: 'Understand the neurochemistry of "urge riding" and dopamine depletion recovery.',
    duration: '5 min read',
    practiceToolId: 'recovery_space',
    practiceLabel: 'Practice in Recovery Space',
    contentMarkdown: `When recovering from compulsive or addictive habits, the brain's mesolimbic dopamine pathway undergoes a phase called receptor downregulation. When triggers occur, a wave of anticipation creates intense, physical distress — commonly known as a craving.

### The Myth of White-Knuckling:
Attempting to suppress or fight a craving with sheer willpower creates resistance, elevating adrenaline and making the craving feel taller and more dangerous.

### Modern Practice (Urge Surfing):
Instead, lean into the somatic experience. Craving waves always cycle: they rise, peak at around 10-15 minutes, and naturally break and dissolve. By "surfing" on top of the physical sensations without acting on them, your brain slowly rewires the trigger-action pathway, building deep resilience.`,
  },
  {
    id: 'sobriety-2',
    category: 'sobriety',
    domain: 'Cognitive recovery',
    title: 'De-masking the "Dry Drunk" Fallacy',
    description: 'Why removing a chemical is only step one — exploring the defense mechanisms and psychological triggers underneath.',
    duration: '4 min read',
    practiceToolId: 'recovery_space',
    practiceLabel: 'Practice in Recovery Space',
    contentMarkdown: `Simply stopping a self-soothing habit (abstinence) without addressing the unresolved mental conflict or emotional pain that catalyzed it is often termed "dry" sobriety.

### Underlying Dynamics:
Addiction is usually a functional, if maladaptive, solution to emotional distress, past trauma, or social anxiety. If that solution is removed but the core triggers remain:
• Anxiety peaks
• Relationship conflicts rise
• Relapse impulses hover

### Action Plan:
Use a relapse-prevention plan to organize emotional, physical, and community-connected coping mechanisms before triggers emerge — turn raw triggers into mindful check-in opportunities.`,
  },
  {
    id: 'thermometer-vs-thermostat-guide',
    category: 'mindfulness',
    domain: 'Self-regulation',
    title: 'Thermometer vs. Thermostat Consciousness',
    description: 'Master the distinction between reactive emotional absorption and active nervous-system regulation.',
    duration: '4 min read',
    practiceToolId: 'window_of_tolerance',
    practiceLabel: 'Practice in Window of Tolerance',
    contentMarkdown: `Do you live your life as a **Thermometer** or as a **Thermostat**?

### The Thermometer Mindset 🌡️
A thermometer does only one thing: it reflects the temperature of the room. If the room is hot, it climbs. If the room is freezing, it drops. It is purely reactive and passive.
If you are a Thermometer Person, your internal mood is at the mercy of your external environment:
• A rude text message destroys your tranquility.
• A stressed manager triggers your immediate fight-or-flight response.
• Chaotic emotional weather around you sweeps you into a matching storm.

### The Thermostat Mindset 🎛️
A thermostat is entirely different. It does not just record the room's temperature — it **sets and regulates** it. If the room gets hot, the thermostat activates cooling. If the room gets cold, it warms the room back to comfort.
If you are a Thermostat Person, you become the active regulator of your internal environment:
• You establish steady boundaries that prevent other people's chaos from dictating your nervous state.
• You choose your response pathway, deploying slower, extended sigh exhalations.
• You notice stressors consciously without letting them automatically compromise your baseline stability.

### The Science of Thermostatic Self-Regulation:
1. **Notice the drift:** Recognize the micro-sensations of sympathetic arousal (tight jaw, quick breathing).
2. **De-identify with the room:** Tell yourself: "This represents the temperature of my surroundings. It is not my temperature."
3. **Engage the cooling valve:** Take 3 long sighing breaths. Double-inhale, slowly empty out. Activate your prefrontal cortex through deliberate choice.`,
  },
  {
    id: 'motivation-vs-discipline-system',
    category: 'cbt',
    domain: 'Nervous system design',
    title: 'Discipline Systems over Fleeting Motivation',
    description: 'Learn why waiting for motivation is a dopamine trap, and how to construct friction-minimizing habit systems.',
    duration: '5 min read',
    practiceToolId: 'smart_goals',
    practiceLabel: 'Build a Discipline System in SMART Goals',
    contentMarkdown: `Why does reliance on "motivation" almost always fail?

### The Cognitive Anatomy of Motivation:
Motivation is an emotional, fleeting state driven by temporary peaks in your brain's baseline dopamine reserves. It is highly volatile, sensitive to minor physiological fluctuations:
• If you slept poorly, motivation drops.
• If you feel digestive or gut fatigue, motivation vanishes.
• If social anxiety spikes, motivation dissolves under threat.

If you rely on motivation to perform supportive wellness tasks, you will only exercise, meditate, or practice CBT on days when conditions are absolutely perfect.

### The System of Discipline:
In psychological literature, **discipline** is not joyless severity or self-punishment. It is defined as **the reduction of mental friction through pre-engineered habits and self-commitments**. Discipline takes the burden off your prefrontal executive planning centers by automating healthy behaviors.

### Building Your Core Discipline Engine:
1. **Friction-mapping (rule of 2 minutes):** Make the starting action of your positive habits so effortless (under 2 minutes) that it bypasses resistance. ("I will open the log," not "I will write a perfect 500-word diary.")
2. **Behavioral stacking:** Chain your new habit directly onto an existing, permanent routine. *"After I shut down my laptop, I will immediately do one shoulder-reset stretch."*
3. **Identity-based commitment:** Shift from "I am trying to meditate" (outcome-focused) to "I am a calm, self-regulating person" (identity-focused). This provides a steady baseline compass that endures regardless of daily motivation.`,
  },
];

const CATEGORY_THEME: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  behavioral: { icon: <Compass className="w-4.5 h-4.5" />, bg: '#DBEAFE', text: '#1D4ED8' },
  developmental: { icon: <Compass className="w-4.5 h-4.5" />, bg: '#DBEAFE', text: '#1D4ED8' },
  neuroscience: { icon: <Sparkles className="w-4.5 h-4.5" />, bg: '#EDE9FE', text: '#6D28D9' },
  mindfulness: { icon: <Compass className="w-4.5 h-4.5" />, bg: '#E0F2FE', text: '#0369A1' },
  jungian: { icon: <Sparkles className="w-4.5 h-4.5" />, bg: '#E0E7FF', text: '#4338CA' },
  somatic: { icon: <Compass className="w-4.5 h-4.5" />, bg: '#FFE4E6', text: '#BE123C' },
  grounding: { icon: <Compass className="w-4.5 h-4.5" />, bg: '#D1FAE5', text: '#047857' },
  cbt: { icon: <Sparkles className="w-4.5 h-4.5" />, bg: '#F3E8FF', text: '#7E22CE' },
  'art-therapy': { icon: <Headphones className="w-4.5 h-4.5" />, bg: '#FCE7F3', text: '#BE185D' },
  sobriety: { icon: <Compass className="w-4.5 h-4.5" />, bg: '#FFEDD5', text: '#C2410C' },
};

const FAVORITES_KEY = 'lance_learning_library_favorites_v1';

function loadFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
}

interface Props {
  onOpenTool?: (toolId: string) => void;
}

export default function LearningLibrary({ onOpenTool }: Props) {
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [librarySubTab, setLibrarySubTab] = useState<'all' | 'saved'>('all');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavorites);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setFavoriteIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const matches = (r: LibraryResource) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase());

  const list = (librarySubTab === 'all' ? RESOURCES : RESOURCES.filter(r => favoriteIds.includes(r.id))).filter(matches);

  if (selectedResource) {
    const theme = CATEGORY_THEME[selectedResource.category] ?? CATEGORY_THEME.behavioral;
    return (
      <div className="p-5 space-y-5" style={{ background: '#F9FAFB' }}>
        <div className="flex justify-between items-center gap-4 border-b pb-3" style={{ borderColor: '#F0F0F0' }}>
          <button
            onClick={() => setSelectedResource(null)}
            className="flex items-center gap-1.5 text-xs font-bold"
            style={{ color: '#4338CA' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to library
          </button>
          <button
            onClick={(e) => toggleFavorite(selectedResource.id, e)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border cursor-pointer"
            style={{ background: '#FFF1F2', color: '#E11D48', borderColor: '#FECDD3' }}
          >
            <Heart className="w-3.5 h-3.5" style={{ fill: favoriteIds.includes(selectedResource.id) ? '#E11D48' : 'none' }} />
            <span>{favoriteIds.includes(selectedResource.id) ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>

        <div className="space-y-2 pt-1">
          <span
            className="text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider inline-block"
            style={{ background: theme.bg, color: theme.text }}
          >
            {selectedResource.domain}
          </span>
          <h3 className="text-xl font-bold leading-tight" style={{ color: '#3C3C3C' }}>
            {selectedResource.title}
          </h3>
          <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{selectedResource.duration}</p>
        </div>

        <div
          className="text-[13px] leading-relaxed whitespace-pre-line border-t pt-4"
          style={{ color: '#4B5563', borderColor: '#F0F0F0' }}
        >
          {selectedResource.contentMarkdown}
        </div>

        {selectedResource.practiceToolId && onOpenTool && (
          <button
            onClick={() => {
              onOpenTool(selectedResource.practiceToolId!);
              setSelectedResource(null);
            }}
            className="w-full py-3 text-white text-xs font-bold rounded-full text-center transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6D28D9)' }}
          >
            {selectedResource.practiceLabel ?? 'Go to Practice Tool'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4" style={{ background: '#F9FAFB' }}>
      <div className="space-y-1">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider w-fit"
          style={{ background: '#E0E7FF', color: '#4338CA' }}
        >
          <Sparkles className="w-3 h-3" /> Learning Library
        </div>
        <p className="text-[11.5px] leading-relaxed" style={{ color: '#9CA3AF' }}>
          17 clinical reference guides covering trauma, attachment, behavioral science, and therapeutic models — each one links straight to the tool that practices it.
        </p>
      </div>

      <div className="flex p-1 rounded-2xl" style={{ background: '#F3F4F6' }}>
        <button
          onClick={() => setLibrarySubTab('all')}
          className="flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition"
          style={librarySubTab === 'all' ? { background: '#FFFFFF', color: '#4338CA', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#9CA3AF' }}
        >
          📚 All Guides
        </button>
        <button
          onClick={() => setLibrarySubTab('saved')}
          className="flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
          style={librarySubTab === 'saved' ? { background: '#FFFFFF', color: '#E11D48', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#9CA3AF' }}
        >
          <Heart className="w-3.5 h-3.5" style={{ fill: librarySubTab === 'saved' ? '#E11D48' : 'none', color: librarySubTab === 'saved' ? '#E11D48' : '#9CA3AF' }} />
          Saved ({favoriteIds.length})
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: '#9CA3AF' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for techniques, CBT, or stress busters..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-medium outline-none border"
          style={{ background: '#FFFFFF', borderColor: '#F0F0F0', color: '#3C3C3C' }}
        />
      </div>

      <div className="space-y-3">
        {librarySubTab === 'saved' && favoriteIds.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed" style={{ borderColor: '#FECDD3', background: '#FFF9F9' }}>
            <div className="text-3xl mb-2">❤️</div>
            <p className="text-xs font-black" style={{ color: '#3C3C3C' }}>No saved guides yet</p>
            <p className="text-[10px] mt-1 leading-relaxed" style={{ color: '#9CA3AF' }}>
              Tap the heart on any guide to save it here for quick access.
            </p>
          </div>
        )}

        {librarySubTab === 'all' && list.length === 0 && (
          <div className="p-8 text-center rounded-2xl" style={{ background: '#FFFFFF', color: '#9CA3AF' }}>
            No guides match "{searchQuery}"
          </div>
        )}

        {list.map((res) => {
          const theme = CATEGORY_THEME[res.category] ?? CATEGORY_THEME.behavioral;
          const isFav = favoriteIds.includes(res.id);
          return (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedResource(res)}
              className="p-4 rounded-2xl border flex justify-between items-center gap-3 cursor-pointer transition"
              style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}
            >
              <div className="flex gap-3 items-center min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: theme.bg, color: theme.text }}
                >
                  {theme.icon}
                </div>
                <div className="space-y-0.5 text-left min-w-0">
                  <h4 className="text-xs font-bold truncate" style={{ color: '#3C3C3C' }}>{res.title}</h4>
                  <p className="text-[11px] truncate" style={{ color: '#9CA3AF' }}>{res.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => toggleFavorite(res.id, e)}
                  type="button"
                  className="p-2 rounded-full cursor-pointer"
                  style={{ color: isFav ? '#E11D48' : '#D1D5DB' }}
                >
                  <Heart className="w-3.5 h-3.5" style={{ fill: isFav ? '#E11D48' : 'none' }} />
                </button>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold block uppercase font-mono leading-none mb-0.5" style={{ color: '#9CA3AF' }}>{res.duration}</span>
                  <span className="text-[9px] font-semibold block uppercase tracking-wider" style={{ color: '#4338CA' }}>{res.domain}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Crisis lines live in Settings → Safety & Crisis (therapist-configured
          per state, 2026-07-12 law) — no hotline block on tool surfaces. */}
    </div>
  );
}
