import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, AlertTriangle, Heart, MessageSquare, Shield, ArrowRight, Sparkles, CheckCircle2, History, Sliders } from 'lucide-react';
import { Character, Choice } from '../types';

interface LiveScenarioPlayScreenProps {
  character: Character;
  onBack: () => void;
  onFinishSimulation: (empathy: number, safety: number, xp: number) => void;
  sessionHistory?: { session: number; empathy: number; safety: number }[];
}

export default function LiveScenarioPlayScreen({ character, onBack, onFinishSimulation, sessionHistory }: LiveScenarioPlayScreenProps) {
  // Load history from props or localStorage
  const [history] = useState(() => {
    if (sessionHistory && sessionHistory.length > 0) return sessionHistory;
    try {
      const val = localStorage.getItem('driftwood_session_history');
      if (val) return JSON.parse(val);
    } catch {}
    return [];
  });

  // Calculate historical performance
  const historicalAverage = useState(() => {
    if (!history || history.length === 0) return 70; // default baseline
    const total = history.reduce((sum: number, session: any) => sum + (session.empathy + session.safety) / 2, 0);
    return Math.round(total / history.length);
  })[0];

  const priorRoundsCount = history ? history.length : 0;

  // Determine DDA tier based on historical scores
  const calculatedTier: 'Mild' | 'Moderate' | 'Intense' = useState<'Mild' | 'Moderate' | 'Intense'>(() => {
    if (historicalAverage < 65) return 'Mild';
    if (historicalAverage > 80) return 'Intense';
    return 'Moderate';
  })[0];

  // User can override the adjusted tier to practice different levels
  const [difficultyTier, setDifficultyTier] = useState<'Mild' | 'Moderate' | 'Intense'>(calculatedTier);

  const [currentBeatIdx, setCurrentBeatIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [cumulativeEmpathy, setCumulativeEmpathy] = useState(0);
  const [cumulativeSafety, setCumulativeSafety] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showNudge, setShowNudge] = useState(false);

  const adjustedBeats = getAdjustedBeats(character, difficultyTier);
  const activeBeat = adjustedBeats[currentBeatIdx];
  const totalBeats = adjustedBeats.length;

  const handleDifficultyChange = (tier: 'Mild' | 'Moderate' | 'Intense') => {
    setDifficultyTier(tier);
    setCurrentBeatIdx(0);
    setSelectedChoice(null);
    setCumulativeEmpathy(0);
    setCumulativeSafety(0);
    setTotalXp(0);
    setShowNudge(false);
  };

  const handleSelectOption = (choice: Choice) => {
    setSelectedChoice(choice);
    setShowNudge(true);
  };

  const handleNextBeat = () => {
    if (!selectedChoice) return;

    // Accumulate scores
    setCumulativeEmpathy(prev => prev + selectedChoice.empathyScore);
    setCumulativeSafety(prev => prev + selectedChoice.safetyScore);
    setTotalXp(prev => prev + selectedChoice.xpReward);

    const nextIdx = currentBeatIdx + 1;
    if (nextIdx < totalBeats) {
      setCurrentBeatIdx(nextIdx);
      setSelectedChoice(null);
      setShowNudge(false);
    } else {
      // Calculate average final scores and trigger complete callback
      const finalEmpathy = Math.round((cumulativeEmpathy + selectedChoice.empathyScore) / totalBeats);
      const finalSafety = Math.round((cumulativeSafety + selectedChoice.safetyScore) / totalBeats);
      const finalXp = totalXp + selectedChoice.xpReward;
      onFinishSimulation(finalEmpathy, finalSafety, finalXp);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2 w-full max-w-md mx-auto text-on-background animate-fade-in-up">
      {/* Simulation Header / Active tracker */}
      <div className="flex justify-between items-center bg-surface-container-lowest px-4 py-3 rounded-2xl border-2 border-outline-variant shadow-sm">
        <button 
          onClick={onBack}
          className="p-1.5 -ml-1 text-primary hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
        </button>
        <div className="text-center col-span-2">
          <span className="font-display font-black text-xs text-primary leading-none block">{character.scenario || 'Relational Simulation'}</span>
          <span className="font-sans text-[10px] text-on-surface-variant">
            Beat {currentBeatIdx + 1} of {totalBeats} • <span className={`font-black ${difficultyTier === 'Mild' ? 'text-emerald-600' : difficultyTier === 'Moderate' ? 'text-secondary' : 'text-rose-600'}`}>{difficultyTier}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-black font-display">
          <span>{totalXp} XP</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden shadow-inner border border-outline-variant/50">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentBeatIdx + (selectedChoice ? 1 : 0)) / totalBeats) * 100}%` }}
        />
      </div>

      {/* DDA Adaptive Conflict Panel */}
      <div className="bg-white rounded-[1.5rem] p-3.5 border-2 border-outline-variant flex flex-col gap-2 shadow-sm text-[11px] animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-outline-variant pb-1.5">
          <div className="flex items-center gap-1 text-[#4B4B4B]">
            <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
            <span className="font-display font-black uppercase tracking-wider text-[10px]">Adaptive Difficulty Engine (DDA)</span>
          </div>
          <span className="text-[9px] font-mono font-bold bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-md border border-secondary/20">
            Active
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-1 text-on-surface-variant font-medium leading-normal">
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-on-surface-variant/80 shrink-0" />
            <span>
              Prior Rounds: <strong className="text-[#4B4B4B]">{priorRoundsCount}</strong> | 
              Avg Score: <strong className="text-[#4B4B4B]">{historicalAverage}%</strong>
            </span>
          </div>
          <div>
            <span>
              Adapted level: <strong className="text-primary font-bold uppercase">{calculatedTier}</strong>
            </span>
          </div>
        </div>
        
        <p className="text-[10px] text-on-surface-variant/95 leading-relaxed">
          Conflict intensity has adapted to your baseline performance. Toggle below to manual override:
        </p>
        
        {/* Manual Selector overrides */}
        <div className="flex gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant">
          {(['Mild', 'Moderate', 'Intense'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => handleDifficultyChange(tier)}
              className={`flex-1 text-[8.5px] font-black py-1 px-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center ${
                difficultyTier === tier
                  ? tier === 'Mild'
                    ? 'bg-emerald-500 text-white border-b-2 border-emerald-700 shadow-sm'
                    : tier === 'Moderate'
                      ? 'bg-secondary text-white border-b-2 border-on-secondary-container shadow-sm'
                      : 'bg-rose-500 text-white border-b-2 border-rose-700 shadow-sm'
                  : 'text-[#4B4B4B] hover:bg-surface-container-high'
              }`}
            >
              {tier === 'Mild' ? '🟢 Mild' : tier === 'Moderate' ? '🔵 Moderate' : '🔴 Intense'}
            </button>
          ))}
        </div>
      </div>

      {/* Dialogue / NPC Panel */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-4 relative overflow-hidden">
        {/* Scenario Beat Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">
            <span>Goal: De-escalate & Validate</span>
          </div>
          <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Active Scene</span>
        </div>

        {/* NPC bubble group */}
        <div className="flex gap-3.5 items-start mt-1">
          <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-300 overflow-hidden shadow-sm flex-shrink-0">
            <img 
              src={character.avatarUrl} 
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <h4 className="font-display font-black text-xs text-rose-700 flex items-center gap-1">
              <span>{character.name} ({character.archetype})</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            </h4>
            <div className="bg-rose-50 border-l-[6px] border-rose-500 p-3 rounded-r-xl rounded-bl-xl text-[#4B4B4B] text-xs font-sans leading-relaxed">
              "{activeBeat.npcStatement}"
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Response Selections */}
      <div className="flex flex-col gap-3 mt-2">
        {!selectedChoice ? (
          <>
            <h3 className="font-display font-black text-xs text-center text-on-surface-variant mb-1 uppercase tracking-widest">
              How do you respond?
            </h3>
            {activeBeat.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className="w-full text-left bg-surface-container-lowest p-4 rounded-xl border-2 border-outline-variant shadow-3d-neutral hover:shadow-3d-primary hover:border-primary transition-all flex items-start gap-3 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-display font-black text-xs text-on-surface-variant group-hover:bg-primary group-hover:text-white shrink-0 border border-outline-variant">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-black font-display tracking-widest text-secondary">
                      {option.type === 'criticism' || option.type === 'defensiveness' || option.type === 'stonewalling' || option.type === 'ineffective' ? 'Ineffective' : 'Effective'}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-black">+{option.xpReward} XP</span>
                  </div>
                  <p className="font-sans text-xs text-[#4B4B4B] font-bold leading-relaxed">"{option.text}"</p>
                </div>
              </button>
            ))}
          </>
        ) : (
          /* Choice Feedback & Review Panel */
          <div className="bg-surface-container-lowest rounded-[2rem] border-2 border-outline-variant shadow-sm p-5 flex flex-col gap-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="font-display font-black text-xs text-primary uppercase tracking-widest">Dialogue Review</span>
              <span className="text-[11px] font-black text-secondary flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Checked
              </span>
            </div>

            {/* Selected dialogue quote */}
            <div className="bg-surface-container-low p-3 rounded-xl border-2 border-outline-variant text-xs italic font-sans leading-relaxed text-[#4B4B4B]">
              "{selectedChoice.text}"
            </div>

            {/* Branching Emotional Reaction */}
            <div className="flex gap-3 items-start p-3 bg-secondary-container/15 rounded-xl border-2 border-[#CE9FFC]/30">
              <div className="w-8 h-8 rounded-full bg-[#CE9FFC] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-display font-black text-xs text-purple-800">{character.name}'s Branching Reaction</h5>
                <p className="font-sans text-xs text-[#4B4B4B] leading-relaxed mt-1">
                  {selectedChoice.feedback}
                </p>
              </div>
            </div>

            {/* AI Therapist Coach Nudge Explanation */}
            <div className="flex gap-3 items-start p-3 bg-[#FFE16D]/15 rounded-xl border-2 border-[#FFE16D]/30">
              <div className="w-8 h-8 rounded-full bg-[#FFE16D] flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-amber-800 fill-amber-800" />
              </div>
              <div>
                <h5 className="font-display font-black text-xs text-amber-800">Coach Explanation</h5>
                <p className="font-sans text-xs text-[#4B4B4B] leading-relaxed mt-1">
                  {selectedChoice.coachNudge}
                </p>
              </div>
            </div>

            {/* Continue flow button */}
            <button
              onClick={handleNextBeat}
              className="w-full bg-primary text-white font-display font-black py-3 px-5 rounded-xl border-b-[4px] border-primary-dark shadow-3d-primary hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all flex justify-center items-center gap-2 cursor-pointer"
            >
              <span>{currentBeatIdx + 1 < totalBeats ? 'Continue' : 'Finish & See Debrief'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getAdjustedBeats(char: Character, tier: 'Mild' | 'Moderate' | 'Intense') {
  return char.challengeBeats.map((beat, idx) => {
    let npcStatement = beat.npcStatement;
    let goalDescription = beat.goalDescription;
    let options = beat.options.map(opt => ({ ...opt }));

    if (tier === 'Mild') {
      goalDescription += ' (Mild - Receptive Partner)';
      if (char.id === 'sam') {
        if (idx === 0) {
          npcStatement = "I'm just really tired from work tonight... Do we absolutely have to do the dishes right now? I was hoping to just relax for a little bit.";
          options[0].text = "Can you please get off your phone and do them? I'm tired too, but they need to get done.";
        } else if (idx === 1) {
          npcStatement = "Okay, I understand. I'm just feeling pretty drained. Can I do them in a little bit?";
        } else if (idx === 2) {
          npcStatement = "Thanks for understanding. I'll get them done shortly. Can we split some chores on the weekend too?";
        }
      } else { // alex
        if (idx === 0) {
          npcStatement = "Hey, I've had a busy day... I was hoping to just scroll through my phone for a bit during dinner. Is it okay if we discuss the calendar later?";
        } else if (idx === 1) {
          npcStatement = "I'm just a bit worried that discussing the calendar will turn into a long list of things I haven't done yet.";
        } else if (idx === 2) {
          npcStatement = "Okay, if we can just look at the calendar for next week and keep it under 5 minutes, I'm happy to do that.";
        }
      }
      // Forgiving scoring for Mild difficulty
      options.forEach(o => {
        if (o.type !== 'soft-start' && o.type !== 'validation' && o.type !== 'effective') {
          o.empathyScore = Math.min(100, o.empathyScore + 20);
          o.safetyScore = Math.min(100, o.safetyScore + 20);
        }
      });
    } else if (tier === 'Intense') {
      goalDescription += ' (Intense - Triggered Partner)';
      if (char.id === 'sam') {
        if (idx === 0) {
          npcStatement = "I am completely sick of your constant nagging! I've worked a 12-hour shift and the absolute last thing I need is you policing my every move the second I sit down!";
          options[0].text = "You always play the victim! I work hard too, but you just sit on your phone like a teenager while I do every single chore!";
          options[0].feedback = "[INTENSE ESCALATION] Sam stands up, slams their phone on the counter, and yells: 'I'm done with this!' and walks out.";
        } else if (idx === 1) {
          npcStatement = "You are unbelievably controlling! It's just a few plates, not a biohazard! You care more about your perfect kitchen than my actual well-being!";
          options[0].text = "I'm not controlling! You're just lazy and defensive! Why can't you just do what you promised for once?";
          options[0].feedback = "[INTENSE ESCALATION] Sam sneers. 'Lazy? That is the thanks I get for paying our bills? You are impossible.' Silence freezes the room.";
        } else if (idx === 2) {
          npcStatement = "Whatever, fine! I'll do them now just so I don't have to listen to this lecture anymore. But don't expect me to help with anything else this week!";
          options[0].text = "Good, go do them. And don't talk to me for the rest of the night.";
          options[0].feedback = "[INTENSE ESCALATION] Sam does the dishes furiously, slamming them into the cabinets. The emotional rift is severe.";
        }
      } else { // alex
        if (idx === 0) {
          npcStatement = "Do not start with me. I am completely burnt out and I am going to scroll through my phone. I have zero mental energy for your spreadsheets, budgets, or lectures tonight.";
          options[0].text = "You are completely self-centered! Every time we have to talk about anything important, you hide behind that screen and leave me to handle all the adult responsibilities!";
          options[0].feedback = "[INTENSE ESCALATION] Alex pushes their plate away, stands up, and mutters: 'I can't even eat in peace,' and locks themselves in the study.";
        } else if (idx === 1) {
          npcStatement = "You say you want to check on me, but it always ends up being a lecture on what I spent or what I forgot. I feel like a child being graded, and it makes my anxiety spike.";
          options[0].text = "Then stop acting like a child! If you were proactive with our budget, I wouldn't have to keep nagging you like a parent!";
          options[0].feedback = "[INTENSE ESCALATION] Alex shuts down completely. 'Fine. I'm a child.' They walk out, leaving a cold silence.";
        } else if (idx === 2) {
          npcStatement = "If you promise we will only talk about one single category like groceries, and stop immediately if either of us feels stressed, I can try.";
          options[0].text = "Groceries is fine, but we have five other major categories that are a mess. We are just kicking the can down the road.";
          options[0].feedback = "[INTENSE ESCALATION] Alex goes quiet. 'Well, that's all I have the strength for.' They pull their phone back out. Connection lost.";
        }
      }
      // Harsher scoring & bonus XP reward for Intense difficulty
      options.forEach(o => {
        if (o.type !== 'soft-start' && o.type !== 'validation' && o.type !== 'effective') {
          o.empathyScore = Math.max(0, o.empathyScore - 15);
          o.safetyScore = Math.max(0, o.safetyScore - 20);
          o.xpReward = Math.max(2, o.xpReward - 2);
        } else {
          o.xpReward += 5; // Reward with +5 XP bonus on successful de-escalations!
        }
      });
    }
    return { ...beat, npcStatement, goalDescription, options };
  });
}
