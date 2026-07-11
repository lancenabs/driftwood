import React, { useState, useEffect } from 'react';
import { 
  Brain, Users, Activity, Check, Plus, Trash2, Heart, 
  HelpCircle, ChevronDown, ChevronUp, History, Sparkles, Info, TrendingUp
} from 'lucide-react';

interface BiopsychosocialLog {
  id: string;
  date: string;
  time: string;
  bioScore: number;
  psychoScore: number;
  socialScore: number;
  overallScore: number;
  notes: string;
  subFactors: {
    sleep: number;
    energy: number;
    tension: number;
    clarity: number;
    tensionMind: number;
    coping: number;
    connection: number;
    load: number;
    support: number;
  };
}

export default function BiopsychosocialAssessment() {
  // Assessment sub-states
  const [bioSleep, setBioSleep] = useState<number>(3); // 1-5
  const [bioEnergy, setBioEnergy] = useState<number>(3);
  const [bioTension, setBioTension] = useState<number>(3);

  const [psyClarity, setPsyClarity] = useState<number>(3);
  const [psyRegulation, setPsyRegulation] = useState<number>(3);
  const [psyCoping, setPsyCoping] = useState<number>(3);

  const [socConnection, setSocConnection] = useState<number>(3);
  const [socLoad, setSocLoad] = useState<number>(3);
  const [socSupport, setSocSupport] = useState<number>(3);

  const [assessmentNotes, setAssessmentNotes] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [assessmentLoggedToday, setAssessmentLoggedToday] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Archive and history logs
  const [logs, setLogs] = useState<BiopsychosocialLog[]>([]);

  // Load logs on mount
  useEffect(() => {
    const saved = localStorage.getItem('therapy_biopsychosocial_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLogs(parsed);

        // Check if there's an entry logged today
        const todayStr = new Date().toDateString();
        const hasToday = parsed.some((log: BiopsychosocialLog) => new Date(log.date).toDateString() === todayStr);
        setAssessmentLoggedToday(hasToday);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Compute live average scores for the three primary spheres
  const computedBio = parseFloat(((bioSleep + bioEnergy + (6 - bioTension)) / 3).toFixed(1)); // (tension range is invert: higher tension, lower wellness score)
  const computedPsy = parseFloat(((psyClarity + psyRegulation + psyCoping) / 3).toFixed(1));
  const computedSoc = parseFloat(((socConnection + (6 - socLoad) + socSupport) / 3).toFixed(1)); // (load range is invert: higher external load/pressure, lower social score)
  
  const overallHolisticScore = parseFloat(((computedBio + computedPsy + computedSoc) / 3).toFixed(1));

  // Clinical analysis matching therapeutic advice based on patterns
  const getClinicalFeedback = () => {
    if (computedBio < 2.5 && computedPsy >= 3.5 && computedSoc >= 3.5) {
      return {
        title: "Your Body Could Use Some Rest",
        description: "Your mental resilience and relationships are strong, but physical symptoms show severe drain. Prioritize immediate sensory downtime, hydration, and stretching.",
        advice: "Recommend adding a 5-minute deep diaphragmatic breathing loop in the Practice tab.",
        gradient: "from-amber-500 to-orange-500"
      };
    }
    if (computedPsy < 2.5 && computedBio >= 3.5 && computedSoc >= 3.5) {
      return {
        title: "Your Mind Feels Overloaded",
        description: "Your physical baseline is steady and you have safe social contact, but emotional stress or self-criticism is running hot. Be gentle on your inner voice.",
        advice: "Try using the CBT Reframer Gym to identify and transform cognitive distortion patterns.",
        gradient: "from-violet-500 to-indigo-500"
      };
    }
    if (computedSoc < 2.5 && computedBio >= 3.5 && computedPsy >= 3.5) {
      return {
        title: "Feeling Disconnected From Others",
        description: "You are somatically and emotionally holding your own, but your external social container is strained. Reach out to one trusted individual or set firm, kind boundaries.",
        advice: "Head to the Couples / Relational space to journal supportive community dynamics.",
        gradient: "from-rose-500 to-pink-500"
      };
    }
    if (overallHolisticScore < 2.5) {
      return {
        title: "Feeling Stretched Thin",
        description: "All three pillars (biological, psychological, and social) are running heavily depleted. This is a crucial signal to slow down, drop optional tasks, and practice grounding.",
        advice: "Tap the floating 'Sparkles Therapy Buddy' below to chat securely with your assistant companion.",
        gradient: "from-orange-500 to-amber-600"
      };
    }
    if (overallHolisticScore >= 4.0) {
      return {
        title: "Everything Feels Balanced",
        description: "Excellent somatic presence, mental clarity, and supportive external containment! Your biological, psychological, and social spheres are coordinating beautifully to build resilience.",
        advice: "Lock in this feeling! Scroll to the Plant Growth widget to water your consistent wellness garden.",
        gradient: "from-emerald-500 to-teal-600"
      };
    }
    return {
      title: "Finding Your Balance",
      description: "You are maintaining self-care buffers, but minor systemic friction exists across your body, mental state, or relationships. Small mindful pivots will help restore balance.",
      advice: "Try reviewing your daily activity logs or complete a quick morning routine check.",
      gradient: "from-sky-500 to-teal-500"
    };
  };

  const feedback = getClinicalFeedback();

  // Save assessment to local archive
  const handleSaveAssessment = () => {
    const today = new Date();
    const newLog: BiopsychosocialLog = {
      id: Date.now().toString(),
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      bioScore: computedBio,
      psychoScore: computedPsy,
      socialScore: computedSoc,
      overallScore: overallHolisticScore,
      notes: assessmentNotes.trim(),
      subFactors: {
        sleep: bioSleep,
        energy: bioEnergy,
        tension: bioTension,
        clarity: psyClarity,
        tensionMind: psyRegulation,
        coping: psyCoping,
        connection: socConnection,
        load: socLoad,
        support: socSupport
      }
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('therapy_biopsychosocial_logs', JSON.stringify(updatedLogs));
    setAssessmentLoggedToday(true);
    setAssessmentNotes('');
  };

  // Remove assessment log
  const handleDeleteLog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = logs.filter(log => log.id !== id);
    setLogs(updated);
    localStorage.setItem('therapy_biopsychosocial_logs', JSON.stringify(updated));
    
    // Recalculate today status
    const todayStr = new Date().toDateString();
    const hasToday = updated.some(log => new Date(log.date).toDateString() === todayStr);
    setAssessmentLoggedToday(hasToday);
  };

  // Render score bar
  const renderMiniBar = (val: number, colorClass: string) => {
    return (
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass}`} 
          style={{ width: `${(val / 5) * 100}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#F0F0F0] overflow-hidden transition-all duration-300" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
      {/* Widget Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between border-b border-[#F0F0F0] cursor-pointer hover:bg-[#F9FAFB] transition duration-200 select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#14B8A618' }}>
            <Activity className="w-5 h-5" style={{ color: '#0D9488' }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest whitespace-nowrap" style={{ background: '#14B8A618', color: '#0D9488' }}>
                Holistic Health Model
              </span>
              {assessmentLoggedToday && (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md text-white whitespace-nowrap" style={{ background: '#58CC02' }}>
                  ✓ Today Saved
                </span>
              )}
            </div>
            <h3 className="text-sm font-black tracking-tight mt-0.5" style={{ color: '#3C3C3C' }}>
              Biopsychosocial Assessment
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowHistory(!showHistory);
            }}
            className="h-10 px-3 rounded-xl border bg-white text-[11px] font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
            style={{ borderColor: '#F0F0F0', color: '#6B7280' }}
            title="View historical trends"
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({logs.length})</span>
          </button>
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            {isExpanded ? <ChevronUp className="w-5 h-5" style={{ color: '#9CA3AF' }} /> : <ChevronDown className="w-5 h-5" style={{ color: '#9CA3AF' }} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-5">
          {showHistory ? (
            /* Historical Log View */
            <div className="space-y-4 animate-fade-in" style={{ color: '#3C3C3C' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: '#0D9488' }} />
                  Your Well-being Timeline
                </span>
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className="text-xs hover:underline font-bold"
                  style={{ color: '#0D9488' }}
                >
                  ← Return to Assessment
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border border-dashed border-[#F0F0F0]" style={{ background: '#F9FAFB' }}>
                  <HelpCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#9CA3AF' }} />
                  <p className="text-xs font-bold" style={{ color: '#6B7280' }}>No Biopsychosocial logs saved yet.</p>
                  <p className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>Complete your first wellness radar rating to track history.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl border transition-all duration-200 relative text-left"
                      style={{ borderColor: '#F0F0F0', background: '#F9FAFB' }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[11px] font-extrabold tracking-wide" style={{ color: '#6B7280' }}>
                            {log.date} @ {log.time}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-black" style={{ color: '#3C3C3C' }}>
                              Overall Balance: {log.overallScore}/5.0
                            </span>
                            <span
                              className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                              style={
                                log.overallScore >= 4.0
                                  ? { background: '#58CC0218', color: '#46A302' }
                                  : log.overallScore >= 2.5
                                  ? { background: '#6366F118', color: '#4338CA' }
                                  : { background: '#F59E0B18', color: '#D97706' }
                              }
                            >
                              {log.overallScore >= 4.0 ? 'Feeling Great' :
                               log.overallScore >= 2.5 ? 'Steady' : 'Running Low'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteLog(log.id, e)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg transition cursor-pointer shrink-0"
                          style={{ color: '#9CA3AF' }}
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Radar stats grid breakdown */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center" style={{ borderColor: '#F0F0F0' }}>
                        <div className="space-y-0.5 bg-white p-1.5 rounded-xl border" style={{ borderColor: '#F0F0F0' }}>
                          <span className="text-[10px] font-black uppercase block leading-none" style={{ color: '#46A302' }}>Biological</span>
                          <span className="text-xs font-black" style={{ color: '#3C3C3C' }}>{log.bioScore} / 5</span>
                          {renderMiniBar(log.bioScore, 'bg-emerald-500')}
                        </div>
                        <div className="space-y-0.5 bg-white p-1.5 rounded-xl border" style={{ borderColor: '#F0F0F0' }}>
                          <span className="text-[10px] font-black uppercase block leading-none" style={{ color: '#7C3AED' }}>Psychological</span>
                          <span className="text-xs font-black" style={{ color: '#3C3C3C' }}>{log.psychoScore} / 5</span>
                          {renderMiniBar(log.psychoScore, 'bg-violet-500')}
                        </div>
                        <div className="space-y-0.5 bg-white p-1.5 rounded-xl border" style={{ borderColor: '#F0F0F0' }}>
                          <span className="text-[10px] font-black uppercase block leading-none" style={{ color: '#DB2777' }}>Social</span>
                          <span className="text-xs font-black" style={{ color: '#3C3C3C' }}>{log.socialScore} / 5</span>
                          {renderMiniBar(log.socialScore, 'bg-rose-500')}
                        </div>
                      </div>

                      {log.notes && (
                        <div className="mt-2.5 p-2 bg-white rounded-lg border text-[11px] italic" style={{ borderColor: '#F0F0F0', color: '#6B7280' }}>
                          "{log.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Active Interactive Assessment */
            <div className="space-y-6 animate-fade-in text-slate-800">
              
              {/* Dynamic Radar Graphic / Triadic Triangle Balanced Display */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 rounded-2xl border border-slate-200/30 flex flex-col items-center justify-center relative">
                
                {/* 3-Sphere visual overlay showing current alignment */}
                <div className="relative w-40 h-32 flex items-center justify-center mt-2.5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Concentric radar guides */}
                    <div className="w-24 h-24 rounded-full border border-slate-200/80 border-dashed" />
                    <div className="w-16 h-16 rounded-full border border-slate-200/50 border-dashed" />
                    <div className="w-8 h-8 rounded-full border border-slate-200/30 border-dashed" />
                  </div>

                  {/* Connecting tension cords */}
                  <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 160 128">
                    {/* Define coordinate bounds for bio (top), psycho (bottom-right), social (bottom-left) */}
                    {/* Top Apex (Bio) */}
                    {/* Bottom Right (Psycho) */}
                    {/* Bottom Left (Social) */}
                    {/* Base values: center is (80, 64) */}
                    {/* Plot coordinates based on current computed values (1.0 - 5.0) */}
                    {(() => {
                      const maxLen = 45;
                      // Bio is pointing up (0 deg)
                      const bx = 80;
                      const by = 64 - (computedBio / 5) * maxLen;
                      // Psycho is pointing bottom right (120 deg)
                      const px = 80 + Math.cos(30 * Math.PI / 180) * ((computedPsy / 5) * maxLen);
                      const py = 64 + Math.sin(30 * Math.PI / 180) * ((computedPsy / 5) * maxLen);
                      // Social is pointing bottom left (240 deg)
                      const sx = 80 - Math.cos(30 * Math.PI / 180) * ((computedSoc / 5) * maxLen);
                      const sy = 64 + Math.sin(30 * Math.PI / 180) * ((computedSoc / 5) * maxLen);

                      return (
                        <>
                          <polygon 
                            points={`${bx},${by} ${px},${py} ${sx},${sy}`}
                            fill="rgba(20, 184, 166, 0.15)"
                            stroke="rgba(20, 184, 166, 0.4)"
                            strokeWidth="1.5"
                          />
                          {/* Anchor point dots */}
                          <circle cx={bx} cy={by} r="4" fill="#10b981" />
                          <circle cx={px} cy={py} r="4" fill="#8b5cf6" />
                          <circle cx={sx} cy={sy} r="4" fill="#f43f5e" />
                          <circle cx="80" cy="64" r="2.5" fill="#64748b" />
                        </>
                      );
                    })()}
                  </svg>

                  {/* Text labels on outer boundaries */}
                  <div className="absolute top-1 text-[8.5px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-emerald-100 shadow-3xs">
                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span>BIO: {computedBio}</span>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[8.5px] font-black uppercase text-violet-600 tracking-widest flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-violet-100 shadow-3xs">
                    <Brain className="w-3 h-3" />
                    <span>PSY: {computedPsy}</span>
                  </div>
                  <div className="absolute bottom-1 left-2 text-[8.5px] font-black uppercase text-rose-600 tracking-widest flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-rose-100 shadow-3xs">
                    <Users className="w-3 h-3" />
                    <span>SOC: {computedSoc}</span>
                  </div>
                </div>

                <div className="w-full text-center mt-3 text-[11px] font-semibold text-slate-500">
                  Core Holistic Resilience Score: <span className="font-extrabold text-slate-800">{overallHolisticScore} / 5.0</span>
                </div>
              </div>

              {/* Vector 1: Physiological / Biological Health */}
              <div className="space-y-3.5 p-4.5 rounded-2xl border border-emerald-100 bg-emerald-50/10">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    BI
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1">
                      <span>Biological & Physical Domain</span>
                    </h4>
                    <p className="text-[10px] text-emerald-800/60 font-semibold leading-none mt-0.5">
                      Somatic baseline, physical recovery, somatic burden
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Slider A: Sleep Restorativeness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Sleep Restoration & Depth</span>
                      <span className="font-mono font-black text-emerald-700">{bioSleep} ↔ {
                        bioSleep === 5 ? 'Fully restorative' : bioSleep === 4 ? 'Deep sleep' : bioSleep === 3 ? 'Average rest' : bioSleep === 2 ? 'Fragmented rest' : 'Severely poor'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={bioSleep}
                      onChange={(e) => setBioSleep(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>

                  {/* Slider B: Cellular Energy & Fuel */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Physical Vitality & Hydration</span>
                      <span className="font-mono font-black text-emerald-700">{bioEnergy} ↔ {
                        bioEnergy === 5 ? 'High energy' : bioEnergy === 4 ? 'Steady energy' : bioEnergy === 3 ? 'Moderate' : bioEnergy === 2 ? 'Lethargic/Sluggish' : 'Completely drained'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={bioEnergy}
                      onChange={(e) => setBioEnergy(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>

                  {/* Slider C: Somatic Load / Muscle Tension */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Somatic Burden / Body Tension (Inverted)</span>
                      <span className="font-mono font-black text-emerald-700">{bioTension} ↔ {
                        bioTension === 5 ? 'Heavy pain/spasm' : bioTension === 4 ? 'Moderate tightness' : bioTension === 3 ? 'Mild stiffness' : bioTension === 2 ? 'A bit loose' : 'Completely loose'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={bioTension}
                      onChange={(e) => setBioTension(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Vector 2: Psychological State */}
              <div className="space-y-3.5 p-4.5 rounded-2xl border border-violet-100 bg-violet-50/10">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                    PS
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-violet-700 flex items-center gap-1">
                      <span>Psychological & Cognitive Domain</span>
                    </h4>
                    <p className="text-[10px] text-violet-800/60 font-semibold leading-none mt-0.5">
                      Emotional capacity, focus density, coping reserves
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Slider A: Thoughts/Cognitive Clutter */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Mental Clarity & Focus</span>
                      <span className="font-mono font-black text-violet-700">{psyClarity} ↔ {
                        psyClarity === 5 ? 'Crystal clear' : psyClarity === 4 ? 'Light focus' : psyClarity === 3 ? 'Average' : psyClarity === 2 ? 'Scattered/Distracted' : 'Severe static/brain fog'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={psyClarity}
                      onChange={(e) => setPsyClarity(parseInt(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>

                  {/* Slider B: Affective Regulation */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Emotional Balance & Stability</span>
                      <span className="font-mono font-black text-violet-700">{psyRegulation} ↔ {
                        psyRegulation === 5 ? 'Steady/Calm' : psyRegulation === 4 ? 'Comfortable' : psyRegulation === 3 ? 'Mild swing' : psyRegulation === 2 ? 'Highly reactive/Irritable' : 'Overwhelmed flare'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={psyRegulation}
                      onChange={(e) => setPsyRegulation(parseInt(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>

                  {/* Slider C: Coping Efficacy */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Coping confidence & Resilience</span>
                      <span className="font-mono font-black text-violet-700">{psyCoping} ↔ {
                        psyCoping === 5 ? 'Extremely capable' : psyCoping === 4 ? 'Assured' : psyCoping === 3 ? 'Managing' : psyCoping === 2 ? 'Frenzied coping' : 'Paralyzed/Tapped out'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={psyCoping}
                      onChange={(e) => setPsyCoping(parseInt(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Vector 3: Social Environment */}
              <div className="space-y-3.5 p-4.5 rounded-2xl border border-rose-100 bg-rose-50/10">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    SO
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1">
                      <span>Social & Environmental Domain</span>
                    </h4>
                    <p className="text-[10px] text-rose-800/60 font-semibold leading-none mt-0.5">
                      Relational harmony, safe workspace, support network warmth
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Slider A: Relational Connectedness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Felt Connection vs Isolation</span>
                      <span className="font-mono font-black text-rose-600">{socConnection} ↔ {
                        socConnection === 5 ? 'Deeply connected' : socConnection === 4 ? 'Warm relationships' : socConnection === 3 ? 'Mild superficial' : socConnection === 2 ? 'Isolated/Lonely' : 'Alienated/Hostile environment'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={socConnection}
                      onChange={(e) => setSocConnection(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>

                  {/* Slider B: External load pressure */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Environmental Pressures / Academic Load (Inverted)</span>
                      <span className="font-mono font-black text-rose-600">{socLoad} ↔ {
                        socLoad === 5 ? 'Chaotic crunch-time' : socLoad === 4 ? 'High demand' : socLoad === 3 ? 'Manageable load' : socLoad === 2 ? 'Peaceful pacing' : 'Sovereign autonomy/Quiet'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={socLoad}
                      onChange={(e) => setSocLoad(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>

                  {/* Slider C: Support Network Availability */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[10.5px]">
                      <span className="font-bold text-slate-700">Safety & Support Network Accessibility</span>
                      <span className="font-mono font-black text-rose-600">{socSupport} ↔ {
                        socSupport === 5 ? 'Immediate shelter/safety' : socSupport === 4 ? 'Dependable friends' : socSupport === 3 ? 'Some help' : socSupport === 2 ? 'Unreliable safety' : 'Hostile/No safety buffer'
                      }</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5"
                      value={socSupport}
                      onChange={(e) => setSocSupport(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-100 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Holistic clinical summary output box */}
              <div className="bg-gradient-to-tr from-slate-50 to-slate-100 p-4.5 rounded-2xl border border-slate-200 space-y-2 text-left shadow-3xs">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Dynamic Clinical Insight</span>
                </div>
                <h5 className="text-xs font-black text-indigo-950">
                  {feedback.title}
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                  {feedback.description}
                </p>
                <div className="text-[9.5px] font-black text-teal-700 bg-teal-50 border border-teal-100 p-2 rounded-xl mt-1 leading-relaxed">
                  💡 recommendation: {feedback.advice}
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Contextual Notes & Realization (Optional)
                </label>
                <textarea
                  value={assessmentNotes}
                  onChange={(e) => setAssessmentNotes(e.target.value)}
                  placeholder="E.g., Felt tension due to work pressure but regular breaks and supportive talk with family kept me anchored..."
                  className="w-full min-h-[60px] p-3 text-xs bg-white text-slate-800 border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-hidden rounded-xl resize-none font-semibold placeholder:text-slate-400"
                />
              </div>

              {/* Action Button: Save Assessment */}
              <button
                type="button"
                onClick={handleSaveAssessment}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{assessmentLoggedToday ? 'Update Today\'s Holistic Balance' : 'Archive Biopsychosocial Rating'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
