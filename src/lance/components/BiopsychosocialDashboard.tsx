import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { motion } from 'motion/react';
import { 
  Brain, Users, Activity, HelpCircle, Sparkles, AlertCircle, TrendingUp, Info, 
  Moon, Calendar, Heart, ShieldAlert, Award, BookOpen, Tag, Plus, Trash2, Check
} from 'lucide-react';

interface MoodLog {
  date: string;
  score: number;
  label: string;
}

interface SleepLog {
  date: string;
  duration: number;
  qualityScore: number;
}

interface ActivityLog {
  date: string;
  social: boolean;
}

interface BiopsychosocialLog {
  id: string;
  date: string;
  time: string;
  bioScore: number;
  psychoScore: number;
  socialScore: number;
  overallScore: number;
  notes: string;
}

interface BiopsychosocialJournal {
  id: string;
  date: string;
  time: string;
  entryText: string;
  bioTags: string[];
  psychoTags: string[];
  socialTags: string[];
  reflectionPrompt: string;
}

const MotionDot = (props: any) => {
  const { cx, cy, stroke, index } = props;
  if (cx === undefined || cy === undefined) return null;
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={4.5}
      fill="#ffffff"
      stroke={stroke}
      strokeWidth={2}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: (index ?? 0) * 0.06, 
        duration: 0.4, 
        type: "spring", 
        stiffness: 220, 
        damping: 14 
      }}
    />
  );
};

export default function BiopsychosocialDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [biopsychosocialLogs, setBiopsychosocialLogs] = useState<BiopsychosocialLog[]>([]);
  const [journals, setJournals] = useState<BiopsychosocialJournal[]>([]);

  // Tagging + Journaling state
  const [journalText, setJournalText] = useState<string>('');
  const [selectedBioTags, setSelectedBioTags] = useState<string[]>([]);
  const [selectedPsychoTags, setSelectedPsychoTags] = useState<string[]>([]);
  const [selectedSocialTags, setSelectedSocialTags] = useState<string[]>([]);
  const [activePromptIndex, setActivePromptIndex] = useState<number>(0);

  const prompts = [
    "What physical sensations (tension, heartbeat, rest level) matched your psychological/emotional state today?",
    "In what ways did your social environment or academic/work pressures impact your cognitive focus?",
    "Where did you notice supportive relationships acting as an emotional shield against stress today?",
    "Reflect on a moment where a biological factor (sleep fatigue or high vitality) colored your decisions.",
  ];

  const [timeRange, setTimeRange] = useState<'7days' | '14days' | 'all'>('7days');
  const [mode, setMode] = useState<'live' | 'sandbox'>('live');

  // Load all logs on mount or storage events
  const loadLogs = () => {
    try {
      const savedMoods = localStorage.getItem('therapy_mood_logs');
      const savedSleep = localStorage.getItem('therapy_sleep_logs');
      const savedActivities = localStorage.getItem('therapy_activity_logs');
      const savedBps = localStorage.getItem('therapy_biopsychosocial_logs');
      const savedJournals = localStorage.getItem('therapy_bps_journals');

      if (savedMoods) setMoodLogs(JSON.parse(savedMoods));
      if (savedSleep) setSleepLogs(JSON.parse(savedSleep));
      if (savedActivities) setActivityLogs(JSON.parse(savedActivities));
      if (savedBps) setBiopsychosocialLogs(JSON.parse(savedBps));
      if (savedJournals) {
        setJournals(JSON.parse(savedJournals));
      } else {
        // Seed default sandbox logs if empty just for rich demonstration
        const defaultSeeds: BiopsychosocialJournal[] = [
          {
            id: 'seed-1',
            date: new Date(Date.now() - 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: '08:30 PM',
            entryText: "Highly energetic day. Felt light tension in shoulders during focus sprints at work, but regular walk breaks with friends kept me highly supported. My sleep quality of 8.0 last night definitely buffered my emotional adaptability.",
            bioTags: ["Fully Rested", "High Vitality"],
            psychoTags: ["Cognitive Clarity", "Self-Compassionate"],
            socialTags: ["Warm Interaction", "Supportive Peer"],
            reflectionPrompt: "What physical sensations (tension, heartbeat, rest level) matched your psychological/emotional state today?"
          },
          {
            id: 'seed-2',
            date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: '09:12 PM',
            entryText: "Tired and sluggish body after fragmented rest. This physical depletion triggered minor cognitive irritability and a tendency to feel isolated. Setting a firm gentle boundary to rest early.",
            bioTags: ["Restless Sleep", "Body Fatigue"],
            psychoTags: ["Emotional Flare", "Anxious Overhead"],
            socialTags: ["Boundary Strain", "Quiet Solitude"],
            reflectionPrompt: "Reflect on a moment where a biological factor (sleep fatigue or high vitality) colored your decisions."
          }
        ];
        setJournals(defaultSeeds);
        localStorage.setItem('therapy_bps_journals', JSON.stringify(defaultSeeds));
      }
    } catch (e) {
      console.error('Error parsing localStorage logs in dashboard:', e);
    }
  };

  useEffect(() => {
    loadLogs();
    
    // Listen for storage updates (e.g., when saving logs or resetting state)
    window.addEventListener('storage', loadLogs);
    return () => {
      window.removeEventListener('storage', loadLogs);
    };
  }, []);

  // Sandbox fallback dummy data for beautiful illustration
  const sandboxData = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Custom simulated values with authentic therapeutic correlation structures
    // E.g., high sleep quality correlates beautifully with improved mood and high social activity
    const simulatedSleep = [6.5, 7.0, 5.5, 8.0, 7.5, 6.0, 7.2, 8.5, 5.0, 7.5, 8.2, 6.8, 7.8, 8.0];
    const simulatedSleepQuality = [5, 7, 4, 9, 8, 5, 7, 9, 3, 8, 9, 6, 8, 9];
    const simulatedMood = [3, 3, 2, 4, 4, 3, 4, 5, 2, 4, 5, 3, 4, 5];
    const simulatedSocial = [false, true, false, true, true, false, true, true, false, true, true, false, true, true];
    
    // Biopsychosocial factors
    const simulatedBio = [2.5, 3.2, 2.0, 4.2, 3.8, 2.8, 3.5, 4.5, 1.8, 3.9, 4.6, 3.0, 4.0, 4.2];
    const simulatedPsy = [3.0, 3.2, 2.5, 4.0, 4.2, 3.5, 4.0, 4.8, 2.2, 4.1, 4.9, 3.2, 4.2, 4.5];
    const simulatedSoc = [2.0, 3.8, 2.2, 4.5, 4.0, 2.8, 3.9, 4.8, 1.5, 4.2, 4.7, 3.0, 4.1, 4.6];

    const simulatedNotes = [
      "Felt tired and restless after fragmented sleep. Low threshold for irritations, but simple rest breaks helped.",
      "Vibrant recovery. Interactive peer discussion was validating. Mental clarity restored.",
      "High somatic head/neck tension and low rest indices triggered mild emotional fatigue today.",
      "Perfect bio-restoration from deep continuous sleep. Active engagement with friends.",
      "Pleasant social connections within family circle. Stable mood and active concentration.",
      "A bit depleted. Kept to a calm personal routine to restore boundaries.",
      "Restorative nature walk. Strong social connectedness and stable cardiovascular rest.",
      "Superb overall integration today. Felt immense physical vitality, emotional stability, and high support.",
      "Frustrated with minor schedule friction, but took physical breathing pauses. Rest levels were shallow.",
      "Active collaboration session at the coffee shop. High psychological focus and warmth.",
      "Outstanding physiological vitality! Seamless cognitive flow and high social receptivity.",
      "Felt slightly tired but kept expectations self-compassionate.",
      "Highly creative flow today. Peer interactions were profoundly supportive.",
      "Felt fully present and equanimous. Outstanding triadic alignment."
    ];

    const simulatedLabels = [
      "Heavy/Anxious", "Balanced/Neutral", "Heavy/Tired", "Refreshed/Clear", "Resilient", 
      "Balanced/Calm", "Connected/Engaged", "Exceptional Coherence", "Vulnerable/Shallow", "Focused/Clear", 
      "Exceptional/Thriving", "Self-Compassionate", "Creative Flow", "Equanimous/Peaceful"
    ];

    return dates.map((date, index) => {
      const monthDay = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        date,
        monthDay,
        sleepQuality: simulatedSleepQuality[index],
        sleepDuration: simulatedSleep[index],
        moodScore: simulatedMood[index],
        moodLabel: simulatedLabels[index],
        socialActivity: simulatedSocial[index] ? 10 : 2, // scale 1-10 indicator
        socialScoreDisplay: simulatedSocial[index] ? 'Active Connections' : 'Isolated/Boundaries Off',
        bioScore: simulatedBio[index],
        psychoScore: simulatedPsy[index],
        socialScore: simulatedSoc[index],
        overallScore: parseFloat(((simulatedBio[index] + simulatedPsy[index] + simulatedSoc[index]) / 3).toFixed(1)),
        notes: simulatedNotes[index]
      };
    });
  }, []);

  // Merge realistic live user logs on date mapping
  const liveCorrelatedData = useMemo(() => {
    // Collect all unique dates across sources inside current range
    const allUniqueDatesMap: Record<string, { mood?: MoodLog; sleep?: SleepLog; activity?: ActivityLog; bps?: BiopsychosocialLog }> = {};

    // Helper to extract clean dates
    const normalizeDateStr = (dateStr: string) => {
      if (dateStr.includes('/')) {
        // MM/DD/YYYY to YYYY-MM-DD
        const [month, day, year] = dateStr.split(' ')[0].split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return dateStr.split(' ')[0]; // YYYY-MM-DD
    };

    moodLogs.forEach(l => {
      const dk = normalizeDateStr(l.date);
      if (!allUniqueDatesMap[dk]) allUniqueDatesMap[dk] = {};
      allUniqueDatesMap[dk].mood = l;
    });

    sleepLogs.forEach(l => {
      const dk = normalizeDateStr(l.date);
      if (!allUniqueDatesMap[dk]) allUniqueDatesMap[dk] = {};
      allUniqueDatesMap[dk].sleep = l;
    });

    activityLogs.forEach(l => {
      const dk = normalizeDateStr(l.date);
      if (!allUniqueDatesMap[dk]) allUniqueDatesMap[dk] = {};
      allUniqueDatesMap[dk].activity = l;
    });

    biopsychosocialLogs.forEach(l => {
      const dk = normalizeDateStr(l.date);
      if (!allUniqueDatesMap[dk]) allUniqueDatesMap[dk] = {};
      allUniqueDatesMap[dk].bps = l;
    });

    // Create aggregated chronological sequence
    const sortedDates = Object.keys(allUniqueDatesMap).sort();

    return sortedDates.map(date => {
      const bundle = allUniqueDatesMap[date];
      const monthDay = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const moodLabel = bundle.mood ? bundle.mood.label : (bundle.bps ? "Tracked Balance" : "Baseline State");
      const bpsNotes = bundle.bps?.notes || "";
      const moodNotes = bundle.mood ? `Mood context: ${bundle.mood.label}` : "";
      const mergedNotes = [bpsNotes, moodNotes].filter(Boolean).join(" | ") || "Baseline stability logged.";

      // Map structures with appropriate relative weights on standard 1-10 scales
      return {
        date,
        monthDay,
        sleepQuality: bundle.sleep ? bundle.sleep.qualityScore : null,
        sleepDuration: bundle.sleep ? bundle.sleep.duration : null,
        moodScore: bundle.mood ? bundle.mood.score : null,
        moodLabel,
        socialActivity: bundle.activity ? (bundle.activity.social ? 10 : 2) : (bundle.bps ? bundle.bps.socialScore * 2 : null),
        socialScoreDisplay: bundle.activity 
          ? (bundle.activity.social ? 'Connected' : 'Strained/Solo') 
          : (bundle.bps ? `Radar Social Level: ${bundle.bps.socialScore}` : 'No Track'),
        bioScore: bundle.bps ? bundle.bps.bioScore : (bundle.sleep ? bundle.sleep.qualityScore / 2 : null),
        psychoScore: bundle.bps ? bundle.bps.psychoScore : (bundle.mood ? bundle.mood.score : null),
        socialScore: bundle.bps ? bundle.bps.socialScore : (bundle.activity ? (bundle.activity.social ? 4.5 : 2) : null),
        overallScore: bundle.bps ? bundle.bps.overallScore : null,
        notes: mergedNotes
      };
    });
  }, [moodLogs, sleepLogs, activityLogs, biopsychosocialLogs]);

  // Determine current active rendering dataset
  const activeDataset = useMemo(() => {
    const rawData = mode === 'sandbox' ? sandboxData : liveCorrelatedData;
    
    // Slice by timeframe filters
    if (timeRange === '7days') {
      return rawData.slice(-7);
    } else if (timeRange === '14days') {
      return rawData.slice(-14);
    }
    return rawData;
  }, [mode, timeRange, sandboxData, liveCorrelatedData]);

  // Check if live data is empty to prompt sandbox default
  const isLiveDataEmpty = liveCorrelatedData.length < 3;

  // Auto-switch to sandbox on load to avoid displaying blank layouts if first time
  useEffect(() => {
    if (isLiveDataEmpty) {
      setMode('sandbox');
    } else {
      setMode('live');
    }
  }, [isLiveDataEmpty]);

  // Generate quantitative insight calculations
  const diagnosticCalculations = useMemo(() => {
    const dataToInspect = activeDataset.filter(d => d.sleepQuality !== null && d.moodScore !== null);
    if (dataToInspect.length === 0) return { sleepMoodRelation: 0, socialMoodRelation: 0 };

    // Simply calculate direct correlation metrics between sleep quality and mood
    let totalSleep = 0;
    let totalMood = 0;
    dataToInspect.forEach(d => {
      totalSleep += d.sleepQuality || 0;
      totalMood += d.moodScore || 0;
    });

    const avgSleep = totalSleep / dataToInspect.length;
    const avgMood = totalMood / dataToInspect.length;

    // Days with optimal sleep (> 7 sleep quality) vs low sleep (< 5 sleep quality)
    const highSleepDays = dataToInspect.filter(d => (d.sleepQuality || 0) >= 7);
    const lowSleepDays = dataToInspect.filter(d => (d.sleepQuality || 0) < 6);

    const avgMoodHighSleep = highSleepDays.length > 0 
      ? highSleepDays.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) / highSleepDays.length 
      : null;

    const avgMoodLowSleep = lowSleepDays.length > 0 
      ? lowSleepDays.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) / lowSleepDays.length 
      : null;

    // Social interactions count vs non-interacted days affecting mood score
    const socialDays = dataToInspect.filter(d => (d.socialActivity || 0) >= 6);
    const soloDays = dataToInspect.filter(d => (d.socialActivity || 0) < 6);

    const avgMoodSocial = socialDays.length > 0
      ? socialDays.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) / socialDays.length
      : null;

    const avgMoodSolo = soloDays.length > 0
      ? soloDays.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) / soloDays.length
      : null;

    return {
      avgSleep: parseFloat(avgSleep.toFixed(1)),
      avgMood: parseFloat(avgMood.toFixed(1)),
      avgMoodHighSleep: avgMoodHighSleep ? parseFloat(avgMoodHighSleep.toFixed(1)) : null,
      avgMoodLowSleep: avgMoodLowSleep ? parseFloat(avgMoodLowSleep.toFixed(1)) : null,
      avgMoodSocial: avgMoodSocial ? parseFloat(avgMoodSocial.toFixed(1)) : null,
      avgMoodSolo: avgMoodSolo ? parseFloat(avgMoodSolo.toFixed(1)) : null,
      sampleSize: dataToInspect.length
    };
  }, [activeDataset]);

  // Polar/radar vector display averaging current subset settings
  const radarAggregateData = useMemo(() => {
    let sumBio = 0, sumPsy = 0, sumSoc = 0, count = 0;
    
    activeDataset.forEach(d => {
      if (d.bioScore !== null && d.psychoScore !== null && d.socialScore !== null) {
        sumBio += d.bioScore || 0;
        sumPsy += d.psychoScore || 0;
        sumSoc += d.socialScore || 0;
        count++;
      }
    });

    if (count === 0) {
      return [
        { subject: 'Physiological (Bio)', value: 3.5, fullMark: 5 },
        { subject: 'Emotional (Psycho)', value: 3.8, fullMark: 5 },
        { subject: 'Environmental (Social)', value: 3.2, fullMark: 5 },
      ];
    }

    return [
      { subject: 'Physiological (Bio)', value: parseFloat((sumBio / count).toFixed(2)), fullMark: 5 },
      { subject: 'Emotional (Psycho)', value: parseFloat((sumPsy / count).toFixed(2)), fullMark: 5 },
      { subject: 'Environmental (Social)', value: parseFloat((sumSoc / count).toFixed(2)), fullMark: 5 },
    ];
  }, [activeDataset]);

  const bioTagOptions = ["Restless Sleep", "Fully Rested", "Muscle Tension", "High Vitality", "Brain Fog", "Healthy Nutrition", "Physical Pain", "Highly Relaxed"];
  const psychoTagOptions = ["Calm & Centered", "Anxious Overhead", "Cognitive Clarity", "Low Mood Heavy", "Emotional Flare", "Self-Compassionate", "Creative Flow", "Unmotivated"];
  const socialTagOptions = ["Warm Interaction", "Supportive Peer", "Boundary Strain", "Workplace Static", "Quiet Solitude", "Felt Alienated", "Team Collaboration", "Family Connection"];

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    const newJournal: BiopsychosocialJournal = {
      id: "jrn-" + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      entryText: journalText,
      bioTags: selectedBioTags,
      psychoTags: selectedPsychoTags,
      socialTags: selectedSocialTags,
      reflectionPrompt: prompts[activePromptIndex]
    };

    const updated = [newJournal, ...journals];
    setJournals(updated);
    localStorage.setItem('therapy_bps_journals', JSON.stringify(updated));

    // Reset form states
    setJournalText('');
    setSelectedBioTags([]);
    setSelectedPsychoTags([]);
    setSelectedSocialTags([]);
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journals.filter(j => j.id !== id);
    setJournals(updated);
    localStorage.setItem('therapy_bps_journals', JSON.stringify(updated));
  };

  const handleToggleBioTag = (tag: string) => {
    setSelectedBioTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleTogglePsychoTag = (tag: string) => {
    setSelectedPsychoTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleSocialTag = (tag: string) => {
    setSelectedSocialTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white rounded-[28px] border border-[#F0F0F0] overflow-hidden transition-all duration-300"
      style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)', background: '#F9FAFB' }}
    >

      {/* Header Banner */}
      <div className="p-5 bg-white border-b border-[#F0F0F0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Identity Title */}
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#14B8A618' }}>
              <Sparkles className="w-5 h-5" style={{ color: '#0D9488' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-white font-black uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ background: '#14B8A6' }}>
                  Biopsychosocial Dashboard
                </span>
                {mode === 'sandbox' && (
                  <span className="text-[10px] bg-amber-500 text-white font-extrabold uppercase px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Sandbox Preview
                  </span>
                )}
              </div>
              <h3 className="text-base font-black tracking-tight mt-0.5" style={{ color: '#3C3C3C' }}>
                Clinical Multi-Vector Wellness Overview
              </h3>
            </div>
          </div>

          {/* Action Filters and Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            {isLiveDataEmpty && (
              <div className="text-[11px] text-amber-800 font-bold bg-amber-50 border border-amber-200 py-1 px-2.5 rounded-lg mr-1 max-w-xs leading-tight">
                ⚠️ Empty actual data! Showing realistic sandbox trends.
              </div>
            )}

            {/* Mode switch */}
            <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('live')}
                disabled={isLiveDataEmpty}
                className={`px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-200 min-h-[32px] ${
                  mode === 'live'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                Actual Tracker
              </button>
              <button
                type="button"
                onClick={() => setMode('sandbox')}
                className={`px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[32px] ${
                  mode === 'sandbox'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Sandbox Preview
              </button>
            </div>

            {/* Time period filter */}
            <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setTimeRange('7days')}
                className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all min-h-[32px] ${
                  timeRange === '7days' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700 cursor-pointer'
                }`}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('14days')}
                className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all min-h-[32px] ${
                  timeRange === '14days' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700 cursor-pointer'
                }`}
              >
                14D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('all')}
                className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all min-h-[32px] ${
                  timeRange === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700 cursor-pointer'
                }`}
              >
                ALL
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">

        {/* Central Correlation Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main LineChart - Physio, Psy, and Social mapping */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-700" />
                  Somatic & Emotional Coherence Curves
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Tracks Sleep Quality (1-10) vs Mental Mood Level (1-5) and Social Connections
                </p>
              </div>

              {/* Minimalist Legend Indicators */}
              <div className="flex items-center gap-3 text-[9px] font-bold">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2.5 h-1 bg-emerald-500 rounded-full block" />
                  Sleep Quality (1-10)
                </span>
                <span className="flex items-center gap-1 text-indigo-600">
                  <span className="w-2.5 h-1 bg-indigo-500 rounded-full block" />
                  Mental Mood (1-5)
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <span className="w-2.5 h-2.5 bg-rose-200 rounded-xs block opacity-50" />
                  Social Activity indicator
                </span>
              </div>
            </div>

            <div className="w-full h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeDataset}
                  margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="monthDay" 
                    tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748B' }}
                    stroke="#CBD5E1"
                  />
                  {/* Left YAxis scaled for Sleep (1 to 10) */}
                  <YAxis 
                    yAxisId="left"
                    domain={[0, 10]}
                    tickCount={6}
                    tick={{ fontSize: 9, fontWeight: 'bold', fill: '#059669' }}
                    stroke="#A7F3D0"
                  />
                  {/* Right YAxis scaled for Mood (1 to 5) */}
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 5]}
                    tickCount={6}
                    tick={{ fontSize: 9, fontWeight: 'bold', fill: '#4f46e5' }}
                    stroke="#C7D2FE"
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white backdrop-blur-md border border-slate-200 text-[#3C3C3C] p-4 rounded-2xl text-left text-xs shadow-2xl space-y-2.5 max-w-[320px] select-none">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                              <p className="font-extrabold text-[11px] text-teal-700 tracking-wider uppercase flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {data.monthDay}
                              </p>
                              {data.overallScore && (
                                <span className="text-[10px] font-black bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-200">
                                  Coherence: {data.overallScore}/5.0
                                </span>
                              )}
                            </div>

                            {/* Triadic Grid */}
                            <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                              {/* Somatic */}
                              <div className="flex items-center justify-between bg-white p-1.5 px-2.5 rounded-lg border border-slate-200">
                                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                                  <span>🌙</span> Biological
                                </span>
                                <div className="text-right font-mono text-[11px]">
                                  <span className="font-bold text-[#3C3C3C]">Qty: {data.sleepQuality !== null ? `${data.sleepQuality}/10` : 'N/A'}</span>
                                  {data.sleepDuration !== null && (
                                    <span className="text-[10px] text-slate-500 ml-1.5">({data.sleepDuration}h)</span>
                                  )}
                                </div>
                              </div>

                              {/* Psychological */}
                              <div className="flex items-center justify-between bg-white p-1.5 px-2.5 rounded-lg border border-slate-200">
                                <span className="text-[11px] text-indigo-700 font-bold flex items-center gap-1.5">
                                  <span>🧠</span> Psychological
                                </span>
                                <div className="text-right font-mono text-[11px]">
                                  <span className="font-bold text-[#3C3C3C]">Mood: {data.moodScore !== null ? `${data.moodScore}/5` : 'N/A'}</span>
                                  {data.moodLabel && (
                                    <span className="text-[9.5px] text-indigo-700 block font-sans font-semibold text-right">{data.moodLabel}</span>
                                  )}
                                </div>
                              </div>

                              {/* Social */}
                              <div className="flex items-center justify-between bg-white p-1.5 px-2.5 rounded-lg border border-slate-200">
                                <span className="text-[11px] text-rose-700 font-bold flex items-center gap-1.5">
                                  <span>👥</span> Social
                                </span>
                                <span className="text-[10.5px] font-semibold text-slate-600">{data.socialScoreDisplay}</span>
                              </div>
                            </div>

                            {/* Qualitative Narrative Commentary */}
                            {data.notes && (
                              <div className="border-t border-slate-200 pt-2 space-y-1">
                                <span className="text-[9.5px] font-black text-amber-500 uppercase tracking-widest block">
                                  📖 Triadic Reflexive Notes
                                </span>
                                <p className="text-[10.5px] text-slate-500 italic font-medium leading-relaxed bg-white p-2 rounded-lg border border-slate-200 max-h-24 overflow-y-auto">
                                  "{data.notes}"
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Colored area representing social connection presence */}
                  <Area
                    yAxisId="left"
                    type="step"
                    dataKey="socialActivity"
                    stroke="#fb7185"
                    strokeWidth={0.8}
                    fillOpacity={1}
                    fill="url(#colorSocial)"
                    legendType="none"
                  />
                  {/* Sleep line quality score */}
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sleepQuality" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={<MotionDot />}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                  {/* Mood line score */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="moodScore" 
                    stroke="#4f46e5" 
                    strokeWidth={2.5} 
                    dot={<MotionDot />}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Triadic Pillars Polar Area / Radar */}
          <motion.div variants={itemVariants} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 flex flex-col items-center justify-between">
            <div className="w-full text-left">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-violet-600" />
                Biopsychosocial Coherence Balance
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Displays the systemic averages of biological, psychological, and social spheres
              </p>
            </div>

            {/* Radar layout */}
            <div className="w-full h-44 flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarAggregateData}>
                  <PolarGrid stroke="#CBD5E1" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 9, fontWeight: 'bold', fill: '#475569' }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 5]} 
                    tick={{ fontSize: 8, fill: '#94A3B8' }}
                  />
                  <Radar 
                    name="Aggregate Health" 
                    dataKey="value" 
                    stroke="#14b8a6" 
                    fill="#14b8a6" 
                    fillOpacity={0.25} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Micro pill status values breakdown inside Radar card */}
            <div className="w-full space-y-1.5 pt-2 border-t border-slate-200/70">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500 flex items-center gap-1 text-[9.5px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Biological Level:
                </span>
                <span className="font-extrabold text-slate-800">{radarAggregateData[0].value} / 5.0</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500 flex items-center gap-1 text-[9.5px]">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Psychological Level:
                </span>
                <span className="font-extrabold text-slate-800">{radarAggregateData[1].value} / 5.0</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500 flex items-center gap-1 text-[9.5px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Social Level:
                </span>
                <span className="font-extrabold text-slate-800">{radarAggregateData[2].value} / 5.0</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Analytics & Biopsychosocial Inference Insights */}
        <motion.div variants={itemVariants} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5 text-left">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Dynamic Biopsychosocial Insights
            </h4>
            <span className="text-[10px] font-bold text-slate-400">
              Correlating {diagnosticCalculations.sampleSize || 0} track record dates in selected frame
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stat box left: Biological -> Psychological Correlation */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs space-y-2">
              <span className="text-[9.5px] font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-sm line-clamp-1 w-fit">
                <Moon className="w-3.5 h-3.5 text-emerald-500" />
                Biological ➔ Psychological impact
              </span>

              {diagnosticCalculations.avgMoodHighSleep !== null && diagnosticCalculations.avgMoodLowSleep !== null ? (
                <p className="text-[11px] font-semibold text-slate-700 leading-relaxed">
                  On days with <span className="text-emerald-600 font-extrabold">optimal sleep quality</span> (score ≥ 7.0), your avg mental mood levels settled at <span className="text-indigo-600 font-extrabold">{diagnosticCalculations.avgMoodHighSleep} / 5</span>, compared to <span className="text-rose-500 font-extrabold">{diagnosticCalculations.avgMoodLowSleep} / 5</span> on poor sleep days. That maps to a <span className="text-emerald-600 font-extrabold">{Math.round(((diagnosticCalculations.avgMoodHighSleep - diagnosticCalculations.avgMoodLowSleep) / (diagnosticCalculations.avgMoodLowSleep || 1)) * 100)}% mood surge</span> under somatic rest.
                </p>
              ) : (
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                  Logging consistent restful sleep durations and filling out the daily Mood Diary on corresponding dates will formulate precise cellular rest-to-emotion swing ratios here.
                </p>
              )}
            </div>

            {/* Stat box right: Social/Environmental -> Psychological Correlation */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs space-y-2">
              <span className="text-[9.5px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-sm line-clamp-1 w-fit">
                <Users className="w-3.5 h-3.5 text-rose-500" />
                Social Connectivity ➔ Affect Alignment
              </span>

              {diagnosticCalculations.avgMoodSocial !== null && diagnosticCalculations.avgMoodSolo !== null ? (
                <p className="text-[11px] font-semibold text-slate-700 leading-relaxed">
                  During intervals of <span className="text-rose-600 font-extrabold">active social connection & support warmth</span>, your mental mood maintained at <span className="text-indigo-600 font-extrabold">{diagnosticCalculations.avgMoodSocial} / 5</span>, compared to an average of <span className="text-slate-500 font-extrabold">{diagnosticCalculations.avgMoodSolo} / 5</span> on solo/isolated days. Close connections reinforce nervous system buffers!
                </p>
              ) : (
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                  Record daily self-care activities (with social engagement flags enabled) to calculate how external social feedback limits loneliness or boosts mood levels.
                </p>
              )}
            </div>
          </div>

          <div className="bg-teal-50/40 p-3 rounded-xl border border-teal-100 text-[10.5px] font-semibold text-slate-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-teal-950 block">About the Biopsychosocial Model:</span>
              <span>This psychological system posits that biological processes (somatic health), psychological factors (thinking state), and social environments (harmony with peer/academic containers) act as interconnected partners in wellness. Tracking these variables on a unified timescale helps identify underlying fatigue triggers or relational distress early.</span>
            </div>
          </div>
        </motion.div>

        {/* Biopsychosocial Structured Reflective Journaling Section */}
        <motion.div 
          variants={itemVariants} 
          className="p-5 rounded-2xl border border-slate-200 bg-white space-y-5 text-left shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-rose-100/70 pb-3 gap-2">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Biopsychosocial Reflective Journal & Factor Tagging
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Practice daily contextual integration. Write a structured log and tag precise co-occurring factors.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>{journals.length} Logs Saved</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Form Column */}
            <form onSubmit={handleAddJournal} className="xl:col-span-12 lg:xl:col-span-5 space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-indigo-600 tracking-wider">
                    Step 1: Choose Reflection Focus
                  </span>
                  <div className="flex gap-1">
                    {prompts.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePromptIndex(idx)}
                        className={`w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                          activePromptIndex === idx 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100 text-[11.5px] font-semibold text-slate-700 italic shadow-3xs">
                  "{prompts[activePromptIndex]}"
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-teal-700 tracking-wider">
                  Step 2: Micro-Tag Daily Triadic Factors
                </span>
                
                {/* Bio factors list */}
                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-3xs">
                  <span className="text-[9.5px] font-black text-emerald-600 uppercase tracking-widest block mb-1">
                    🔬 Physiological (Somatic & Bio sleep/tension)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {bioTagOptions.map(tag => {
                      const isSelected = selectedBioTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleBioTag(tag)}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-all flex items-center gap-0.5 ${
                            isSelected 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-3xs' 
                              : 'bg-emerald-50/50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/50'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 shrink-0" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Psycho factors lists */}
                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-3xs mt-2">
                  <span className="text-[9.5px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
                    🧠 Psychological (Cognitive & Emotional triggers)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {psychoTagOptions.map(tag => {
                      const isSelected = selectedPsychoTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTogglePsychoTag(tag)}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-all flex items-center gap-0.5 ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
                              : 'bg-indigo-50/50 text-indigo-800 border-indigo-100 hover:bg-indigo-100/50'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 shrink-0" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Social factors lists */}
                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-3xs mt-2">
                  <span className="text-[9.5px] font-black text-amber-700 uppercase tracking-widest block mb-1">
                    👥 Social (Environmental peer/family alignment)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {socialTagOptions.map(tag => {
                      const isSelected = selectedSocialTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleSocialTag(tag)}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-all flex items-center gap-0.5 ${
                            isSelected 
                              ? 'bg-amber-600 text-white border-amber-600 shadow-3xs' 
                              : 'bg-amber-50/50 text-amber-800 border-amber-100 hover:bg-amber-100/50'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 shrink-0" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  Step 3: Reflective Commentary
                </span>
                <textarea
                  rows={3}
                  value={journalText}
                  onChange={e => setJournalText(e.target.value)}
                  placeholder="Record how these factors interacted today... (e.g., 'A restless night directly lowered my focus threshold, but a supportive teammate buffered the stress.')"
                  className="w-full text-xs font-semibold p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/35 focus:border-teal-500 placeholder:text-slate-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] uppercase tracking-widest py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
                <Plus className="w-4 h-4" /> Save Structured Reflection
              </button>
            </form>

            {/* List Column */}
            <div className="xl:col-span-12 lg:xl:col-span-7 space-y-3.5 max-h-[580px] overflow-y-auto pr-1 text-left">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                Reflective Timeline
              </span>

              {journals.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                  <BookOpen className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
                  <p className="text-xs font-bold font-sans text-slate-500">No structured journal sessions stored yet.</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-sm">Use the left contextual panel to draft reflection commentary and monitor co-occurring bio-psycho-social influences over active cycles.</p>
                </div>
              ) : (
                journals.map(j => (
                  <motion.div
                    key={j.id}
                    layoutId={j.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all shadow-3xs space-y-2.5 relative group"
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-extrabold text-slate-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-500" />
                          {j.date}
                        </span>
                        <span className="text-slate-400 font-bold">{j.time}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteJournal(j.id)}
                        className="p-1.5 rounded-md bg-white border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Delete journal record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Interactive Prompt banner */}
                    <div className="bg-white/80 px-3 py-1.5 rounded-lg border border-indigo-50 text-[10.5px] font-semibold text-slate-500 italic">
                      "{j.reflectionPrompt}"
                    </div>

                    {/* Entry Text */}
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {j.entryText}
                    </p>

                    {/* Rendered Factor Tags Categories */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-200">
                      
                      {j.bioTags && j.bioTags.length > 0 && (
                        <div className="flex items-center gap-1 mr-2 mt-1">
                          <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm shrink-0">Bio:</span>
                          <div className="flex flex-wrap gap-1">
                            {j.bioTags.map(t => (
                              <span key={t} className="text-[8.5px] font-bold text-emerald-800 px-1.5 py-0.2 bg-emerald-100/60 rounded-full border border-emerald-200/50">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {j.psychoTags && j.psychoTags.length > 0 && (
                        <div className="flex items-center gap-1 mr-2 mt-1">
                          <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm shrink-0">Psycho:</span>
                          <div className="flex flex-wrap gap-1">
                            {j.psychoTags.map(t => (
                              <span key={t} className="text-[8.5px] font-bold text-indigo-800 px-1.5 py-0.2 bg-indigo-100/60 rounded-full border border-indigo-200/50">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {j.socialTags && j.socialTags.length > 0 && (
                        <div className="flex items-center gap-1 mr-2 mt-1">
                          <span className="text-[8px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm shrink-0">Social:</span>
                          <div className="flex flex-wrap gap-1">
                            {j.socialTags.map(t => (
                              <span key={t} className="text-[8.5px] font-bold text-amber-800 px-1.5 py-0.2 bg-amber-100/65 rounded-full border border-amber-200/50">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!j.bioTags?.length && !j.psychoTags?.length && !j.socialTags?.length) && (
                        <span className="text-[9px] font-semibold text-slate-400 italic">No factors tagged</span>
                      )}

                    </div>
                  </motion.div>
                ))
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
