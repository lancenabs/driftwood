import React from 'react';
import { Award, Flame, Lightbulb, RotateCcw, CheckCircle, Heart, Shield, Sparkles, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DebriefScreenProps {
  empathyScore: number;
  safetyScore: number;
  xpEarned: number;
  sessionHistory: { session: number; empathy: number; safety: number }[];
  onDone: () => void;
  onRetry: () => void;
}

export default function DebriefScreen({ empathyScore, safetyScore, xpEarned, sessionHistory, onDone, onRetry }: DebriefScreenProps) {
  // Safe feedback message based on results
  const coachInsights = empathyScore >= 80 
    ? "Outstanding work! You consistently prioritized Softened Start-ups and validated your partner's emotional state before introducing logical requests. This approach lowers defenses, allowing you to reach compromise smoothly while maintaining relationship safety."
    : "Good attempt! You demonstrated solid repair attempts. To score even higher, focus on replacing direct accusations ('criticism') with 'I feel' statements, and validate your partner's perspective early in the dialogue before seeking action.";

  return (
    <div className="flex flex-col gap-6 py-2 w-full max-w-md mx-auto text-on-background animate-fade-in-up">
      {/* Transactional success header */}
      <div className="text-center px-4 mt-2 flex flex-col items-center">
        {/* Playful celebrate icon container */}
        <div className="w-20 h-20 bg-[#CE9FFC] rounded-full flex items-center justify-center border-2 border-purple-400 shadow-sm mb-4 animate-bounce">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display font-black text-3xl text-on-background tracking-tight leading-none mb-1">Session Complete!</h1>
        <p className="font-sans text-xs text-on-surface-variant">You successfully de-escalated the Dirty Dish Dilemma.</p>
      </div>

      {/* Rewards Badges */}
      <div className="flex justify-center gap-3">
        <div className="group relative flex items-center gap-1.5 bg-white text-[#4B4B4B] px-4 py-1.5 rounded-full text-xs font-black font-display shadow-sm border-2 border-outline-variant cursor-help">
          <Award className="w-4 h-4 text-primary" />
          <span>+{xpEarned} XP</span>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[10px] font-sans font-medium rounded-xl p-2.5 shadow-lg w-56 text-center pointer-events-none z-50 border border-neutral-800 leading-normal">
            <strong>Experience Points (XP)</strong><br />
            Earned for executing successful active listening, validation, and de-escalation statements.
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
          </div>
        </div>
        <div className="group relative flex items-center gap-1.5 bg-white text-[#4B4B4B] px-4 py-1.5 rounded-full text-xs font-black font-display shadow-sm border-2 border-outline-variant cursor-help">
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          <span>5 Day Streak</span>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[10px] font-sans font-medium rounded-xl p-2.5 shadow-lg w-56 text-center pointer-events-none z-50 border border-neutral-800 leading-normal">
            <strong>Daily Habit Streak</strong><br />
            Consistency builds powerful connection. Practice 5 minutes daily to sustain emotional gains.
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
          </div>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Empathy Index Card */}
        <div className="group relative bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-3 transition-all hover:border-primary">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-black text-sm text-[#4B4B4B] flex items-center gap-1.5">
              <Heart className="w-4.5 h-4.5 text-primary fill-primary/10" />
              <span>Empathy Index</span>
              <Info className="w-3.5 h-3.5 text-on-surface-variant/40 hover:text-primary transition-colors cursor-help" />
            </h3>
            <span className="font-display font-black text-xl text-primary">{empathyScore}%</span>
          </div>
          {/* Thick progress track */}
          <div className="h-3.5 bg-surface-container rounded-full overflow-hidden shadow-inner border border-outline-variant/50">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${empathyScore}%` }}
            />
          </div>
          <p className="font-sans text-[11px] text-on-surface-variant">
            Reflects your usage of softened start-ups and validation of feelings.
          </p>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[11px] font-sans font-normal rounded-2xl p-3 shadow-xl w-[280px] z-50 border border-neutral-800 leading-relaxed pointer-events-none">
            <div className="font-display font-black text-xs text-primary uppercase tracking-wider mb-1">❤️ Gottman Empathy Index</div>
            <p className="text-[10px] text-neutral-300">
              Evaluates emotional attunement and the clinical practice of <strong>Softened Start-ups</strong>. It monitors validation of your partner's emotional reality before presenting collaborative requests, aiming to preserve a positive 5:1 sentiment ratio.
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
          </div>
        </div>

        {/* Safety Score Card */}
        <div className="group relative bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-3 transition-all hover:border-secondary">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-black text-sm text-[#4B4B4B] flex items-center gap-1.5">
              <Shield className="w-4.5 h-4.5 text-secondary" />
              <span>Relationship Safety</span>
              <Info className="w-3.5 h-3.5 text-on-surface-variant/40 hover:text-secondary transition-colors cursor-help" />
            </h3>
            <span className="font-display font-black text-xl text-secondary">{safetyScore}%</span>
          </div>
          {/* Thick progress track */}
          <div className="h-3.5 bg-surface-container rounded-full overflow-hidden shadow-inner border border-outline-variant/50">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out delay-150" 
              style={{ width: `${safetyScore}%` }}
            />
          </div>
          <p className="font-sans text-[11px] text-on-surface-variant">
            Measures your success in preventing defensiveness and criticism.
          </p>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[11px] font-sans font-normal rounded-2xl p-3 shadow-xl w-[280px] z-50 border border-neutral-800 leading-relaxed pointer-events-none">
            <div className="font-display font-black text-xs text-secondary uppercase tracking-wider mb-1">🛡️ Relationship Safety</div>
            <p className="text-[10px] text-neutral-300">
              Measures containment of <strong>The Four Horsemen</strong> (Criticism, Contempt, Defensiveness, Stonewalling). Higher safety scores indicate avoidance of blame loops, leading to lower physiological arousal during conflict.
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
          </div>
        </div>
      </div>

      {/* Simulation Progress Line Chart (Recharts) */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-3">
        <div>
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-[#4B4B4B] flex items-center gap-1.5">
            📈 Clinical Progress Tracker
          </h4>
          <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
            Real-time telemetry showing your Gottman Empathy Index and Relationship Safety trajectory over the last 10 sessions.
          </p>
        </div>

        <div className="h-44 w-full mt-1.5 pr-1.5 text-[8px] font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sessionHistory}
              margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="session" 
                tick={{ fill: '#4b5563', fontSize: 9 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(val) => `S${val}`}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#4b5563', fontSize: 9 }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '12px', 
                  border: '2px solid #e2e8f0',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  color: '#4B4B4B'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={20}
                wrapperStyle={{ 
                  fontSize: '8px', 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              />
              <Line 
                type="monotone" 
                name="Empathy" 
                dataKey="empathy" 
                stroke="var(--color-primary)" 
                strokeWidth={3} 
                activeDot={{ r: 6 }} 
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                name="Safety" 
                dataKey="safety" 
                stroke="var(--color-secondary)" 
                strokeWidth={3} 
                activeDot={{ r: 6 }} 
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Therapist Coach Insights */}
      <div className="bg-secondary/10 rounded-[2rem] p-5 border-2 border-secondary/20 shadow-sm flex gap-3 items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none" />
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-sm">
          <Lightbulb className="w-5 h-5 text-white fill-white/20" />
        </div>
        <div className="flex-1 pt-0.5">
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-secondary mb-1">Coach Insights</h4>
          <p className="font-sans text-xs text-[#4B4B4B] leading-relaxed italic">
            "{coachInsights}"
          </p>
        </div>
      </div>

      {/* Recommended Homework Block */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-5 border-2 border-outline-variant shadow-sm flex flex-col gap-2">
        <h4 className="font-display font-black text-xs uppercase tracking-widest text-on-surface-variant mb-1">Recommended Homework</h4>
        <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border-2 border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer group">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform border border-primary/20">
            🧠
          </div>
          <div>
            <h5 className="font-display font-black text-xs text-[#4B4B4B]">Micro-Lesson: De-escalation Core</h5>
            <p className="font-sans text-[10px] text-on-surface-variant mt-0.5">5 mins • Practice emotional regulation under stress</p>
          </div>
        </div>
      </div>

      {/* Double 3D Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {/* Primary Done */}
        <button
          onClick={onDone}
          className="flex-1 bg-primary text-white font-display font-black py-3.5 px-6 rounded-xl border-b-[4px] border-primary-dark shadow-3d-primary hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all flex justify-center items-center gap-2 cursor-pointer"
        >
          <span>Done</span>
          <CheckCircle className="w-5 h-5" />
        </button>

        {/* Secondary Retry */}
        <button
          onClick={onRetry}
          className="flex-1 bg-secondary text-white font-display font-black py-3.5 px-6 rounded-xl border-b-[4px] border-on-secondary-container shadow-3d-secondary hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all flex justify-center items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4.5 h-4.5" />
          <span>Retry Session</span>
        </button>
      </div>
    </div>
  );
}
