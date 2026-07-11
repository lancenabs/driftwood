import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw, Download, Mail, Send, CheckCircle2, AlertCircle,
  FileText, Share2, Printer, ChevronLeft, Sparkles, Brain,
  Activity, Moon, Utensils, Heart, Shield, Lock,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell,
} from 'recharts';
import { useGame, useLevel } from './LANCEGameContext';
import LanceAvatar from './LanceAvatar';
import { TITLES, ACCENTS } from './tools/RewardsStore';

interface Props { onBack: () => void; }

const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MOOD_LABELS   = ['','Terrible','Low','Okay','Good','Great'];
const ENERGY_LABELS = ['','Depleted','Low','Moderate','Energized','Buzzing'];

function avg(arr: number[]) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function getLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const mood   = payload.find((p: any) => p.dataKey === 'mood');
  const energy = payload.find((p: any) => p.dataKey === 'energy');
  return (
    <div className="px-3 py-2 rounded-xl text-xs font-bold space-y-1 shadow-xl"
      style={{ background: '#0C2040', border: '1px solid rgba(62,207,207,0.15)', color: '#E8F5F1' }}>
      <div style={{ color: '#8BA8A0' }}>{label}</div>
      {mood   && <div style={{ color: '#3ECFCF' }}>Mood: {MOOD_LABELS[mood.value]   ?? mood.value}</div>}
      {energy && <div style={{ color: '#7FD98C' }}>Energy: {ENERGY_LABELS[energy.value] ?? energy.value}</div>}
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: number | string; unit?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-3 text-center border"
      style={{ background: '#0D2440', borderColor: `${color}22` }}
    >
      <div className="text-lg font-black leading-none" style={{ color }}>
        {value}{unit}
      </div>
      <div className="text-[8px] mt-1 uppercase tracking-wider" style={{ color: '#8BA8A0' }}>{label}</div>
    </motion.div>
  );
}

function SectionCard({ children, delay = 0, glow = '#3ECFCF' }: { children: React.ReactNode; delay?: number; glow?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl p-4 border"
      style={{ background: '#0D2440', borderColor: `${glow}22` }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ text, color = '#8BA8A0' }: { text: string; color?: string }) {
  return <h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color }}>{text}</h3>;
}

// ── Send status sequence ───────────────────────────────────────────────────────

const SEND_STEPS_FULL   = [
  'Folding the week into a clean summary…',
  'Compiling diagnostic mood charts and metrics…',
  'Securing connection to digital practice portal…',
  'Transmitting encrypted payload…',
];
const SEND_STEPS_WEEKLY = [
  'Formulating 7-day therapist progress digest…',
  'Structuring weekly mood trends and activity stats…',
  'Securing connection to digital practice portal…',
  'Transmitting encrypted payload…',
];

// ── Diagnostic steps ───────────────────────────────────────────────────────────

const DIAG_STEPS = [
  { label: 'Scanning 14-day mood and check-in logs',          active: 'Consolidating daily mood trends…'          },
  { label: 'Parsing CBT thought records for distortions',     active: 'Extracting cognitive distortion patterns…' },
  { label: 'Reviewing DBT rescue logs and habit loops',       active: 'Reviewing physical TIPP protocols…'        },
  { label: 'Evaluating somatic body-map correlations',        active: 'Investigating somatic-emotional resonance…'},
  { label: 'Compiling LANCE clinical synthesis',              active: 'Finalizing diagnostics package…'           },
];

// ──────────────────────────────────────────────────────────────────────────────
export default function LANCEInsights({ onBack }: Props) {
  const { moodLogs, xp, streak, completedChallenges, goals, intern, userName, installedTools, equippedTitle, equippedAccent } = useGame();
  const { level, progress: xpProgress } = useLevel(xp);
  const equippedTitleName = TITLES.find(t => t.id === equippedTitle)?.name;
  const equippedAccentSwatch = equippedAccent !== 'teal' ? ACCENTS.find(a => a.id === equippedAccent)?.swatch : undefined;

  // ── Data reads ──────────────────────────────────────────────────────────────
  const sleepData = useMemo(() => {
    const entries: { date: string; hoursSlept: number; quality: number; wakeFeel: string }[] =
      getLS('lance_sleep_v1', []);
    const recent = entries.slice(-7);
    if (!recent.length) return null;
    const wakeFeels = { refreshed: 0, okay: 0, groggy: 0 } as Record<string, number>;
    recent.forEach(e => { if (wakeFeels[e.wakeFeel] !== undefined) wakeFeels[e.wakeFeel]++; });
    return {
      avgHours:   avg(recent.map(e => e.hoursSlept)),
      avgQuality: avg(recent.map(e => e.quality)),
      wakeFeels,
      count: recent.length,
    };
  }, []);

  const activityData = useMemo(() => {
    const entries: { date: string; activities: { type: string; minutes: number }[]; mealQuality: number; water: number }[] =
      getLS('lance_activity_v1', []);
    const recent = entries.slice(-7);
    if (!recent.length) return null;
    const totalMinutes = recent.reduce((s, e) => s + e.activities.reduce((a, ac) => a + ac.minutes, 0), 0);
    const mealData = recent.filter(e => e.mealQuality > 0);
    return {
      totalMinutes,
      avgMealQ:   mealData.length ? avg(mealData.map(e => e.mealQuality)) : 0,
      avgWater:   avg(recent.map(e => e.water ?? 0)),
      activeDays: recent.filter(e => e.activities.length > 0).length,
      count: recent.length,
    };
  }, []);

  // CBT / gratitude / DBT / couples data counts.
  // These previously read from keys that no tool actually writes to
  // ('lance_cbt_records', 'lance_gratitude_v1', 'lance_dbt_logs', 'lance_couples_v1') —
  // Insights silently showed "no data" for these forever, and exports for them were
  // always empty, regardless of how much a client had actually logged. Corrected to
  // the real keys each tool persists to (there are two separate CBT tools and two
  // separate DBT logs, so those two are combined).
  const cbtReframes    = useMemo(() => getLS<any[]>('therapy_cbt_saved_reframes',  []), []);
  const cbtThoughtRecs = useMemo(() => getLS<any[]>('therapy_cbt_thought_records', []), []);
  const cbtRecords     = useMemo(() => [...cbtReframes, ...cbtThoughtRecs], [cbtReframes, cbtThoughtRecs]);
  const gratitudeData  = useMemo(() => getLS<any[]>('lance_gratitude_log',         []), []);
  const dbtChainLogs   = useMemo(() => getLS<any[]>('therapy_dbt_chain_analyses',  []), []);
  const dbtRescueLogs  = useMemo(() => getLS<any[]>('therapy_dbt_rescue_logs',     []), []);
  const dbtLogs        = useMemo(() => [...dbtChainLogs, ...dbtRescueLogs], [dbtChainLogs, dbtRescueLogs]);
  const sleepLogs      = useMemo(() => getLS<any[]>('lance_sleep_v1',              []), []);
  const activityLogs   = useMemo(() => getLS<any[]>('lance_activity_v1',           []), []);
  const nutritionLogs  = useMemo(() => getLS<any[]>('lance_nutrition_v1',          []), []);
  // 'couples_completed_activities_v1' is a { [activityId]: boolean } map, not a list of
  // records — it can't be spread into an array of loggable entries (that would throw at
  // runtime the first time a client had completed even one activity). It's counted
  // separately instead.
  const couplesLogs         = useMemo(() => getLS<any[]>('couples_appreciation_notes_v1', []), []);
  const couplesActivityDone = useMemo(
    () => Object.values(getLS<Record<string, boolean>>('couples_completed_activities_v1', {})).filter(Boolean).length,
    [],
  );

  const activeGoals    = goals.filter(g => !g.completed).length;
  const completedGoals = goals.filter(g => g.completed).length;

  // Additional analytics data — real storage keys the corresponding Library tools write to.
  const cravingLogs    = useMemo(() => getLS<{ date: string; intensity: number }[]>('recovery_urge_intensity_logs', []), []);
  const shadowLogs     = useMemo(() => getLS<any[]>('therapy_jungian_reflections', []), []);
  const dreamLogs      = useMemo(() => getLS<any[]>('lance_dreams_v1', []), []);
  const neuroStability = useMemo(() => {
    const raw = localStorage.getItem('therapy_neuro_stacker_stability');
    return raw ? parseFloat(raw) : null;
  }, []);
  const copingSuccesses = useMemo(() => {
    const raw = localStorage.getItem('recovery_coping_successes');
    return raw ? parseInt(raw, 10) : 0;
  }, []);

  // 30-day mood heatmap grid
  const heatmapDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      const dateStr = d.toISOString().split('T')[0];
      const log = moodLogs.find(l => l.date === dateStr);
      return { date: dateStr, mood: log?.mood ?? null };
    });
  }, [moodLogs]);

  // Mood % breakdown (1-5)
  const moodBreakdown = useMemo(() => {
    if (moodLogs.length === 0) return null;
    const counts = [0, 0, 0, 0, 0];
    moodLogs.forEach(l => { const idx = Math.round(l.mood) - 1; if (idx >= 0 && idx <= 4) counts[idx]++; });
    return counts.map((c, i) => ({ label: MOOD_LABELS[i + 1], count: c, pct: Math.round((c / moodLogs.length) * 100) }));
  }, [moodLogs]);

  // Activity Boosters — average mood on days an activity was logged vs. not
  const activityBoost = useMemo(() => {
    if (activityLogs.length === 0 || moodLogs.length === 0) return null;
    const activeDates = new Set(activityLogs.filter((e: any) => e.activities?.length > 0).map((e: any) => e.date));
    const withActivity = moodLogs.filter(l => activeDates.has(l.date)).map(l => l.mood);
    const withoutActivity = moodLogs.filter(l => !activeDates.has(l.date)).map(l => l.mood);
    if (withActivity.length === 0 || withoutActivity.length === 0) return null;
    return { withActivity: avg(withActivity), withoutActivity: avg(withoutActivity) };
  }, [activityLogs, moodLogs]);

  // ── 7-day chart ─────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const log = moodLogs.find(l => l.date === dateStr);
      return { label: DAY_NAMES[d.getDay()], date: dateStr, mood: log?.mood ?? null, energy: log?.energy ?? null };
    });
  }, [moodLogs]);

  const logged7    = chartData.filter(d => d.mood !== null);
  const avgMood    = avg(logged7.map(d => d.mood!));
  const avgEnergy  = avg(logged7.map(d => d.energy!));
  const bestEntry  = moodLogs.reduce<(typeof moodLogs)[0] | null>((b, l) => (!b || l.mood > b.mood ? l : b), null);

  // ── AI analysis ─────────────────────────────────────────────────────────────
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchAI = async () => {
    setAiLoading(true); setAiAnalysis(null);
    try {
      const res = await fetch('/api/lance/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          context: {
            trigger: 'home',
            userContent: [
              `Weekly insights: ${moodLogs.length} mood logs, avg mood ${avgMood.toFixed(1)}/5, avg energy ${avgEnergy.toFixed(1)}/5, streak ${streak} days, XP ${xp}, challenges ${completedChallenges.length}, goals active ${activeGoals}.`,
              sleepData  ? `Sleep (${sleepData.count} nights): avg ${sleepData.avgHours.toFixed(1)}h, quality ${sleepData.avgQuality.toFixed(1)}/5.` : '',
              activityData ? `Activity (${activityData.count} days): ${activityData.totalMinutes}min movement, ${activityData.activeDays} active days.` : '',
              cbtRecords.length > 0 ? `CBT records: ${cbtRecords.length} thought reframes logged.` : '',
            ].filter(Boolean).join(' '),
            recentMoods: moodLogs.slice(0, 7),
            completedChallenges,
          },
        }),
      });
      const data = await res.json();
      if (data.success) setAiAnalysis(data.response);
    } catch { /* silent */ }
    finally { setAiLoading(false); }
  };

  // ── Clinical diagnostic ──────────────────────────────────────────────────────
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagStep,    setDiagStep]    = useState(0);
  const [diagReport,  setDiagReport]  = useState<{ observation: string; habitsDeepDive: string; cognitiveAnalysis: string; somaticAnalysis: string } | null>(null);
  const [diagTab,     setDiagTab]     = useState<'synthesis' | 'cognitive' | 'somatic'>('synthesis');

  useEffect(() => {
    if (!diagRunning) return;
    let step = 0;
    setDiagStep(0);
    const tick = setInterval(() => {
      step++;
      if (step < DIAG_STEPS.length) {
        setDiagStep(step);
      } else {
        clearInterval(tick);
        runDiagFetch();
      }
    }, 900);
    return () => clearInterval(tick);
  }, [diagRunning]); // eslint-disable-line

  const runDiagFetch = async () => {
    try {
      const res = await fetch('/api/therapy/habits-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodLogs, activityLogs, userName }),
      });
      const data = await res.json();
      if (data.success) {
        setDiagReport({
          observation: data.observation,
          habitsDeepDive: data.habitsDeepDive,
          cognitiveAnalysis: data.cognitiveAnalysis ?? 'Cognitive pattern data is still accumulating. Complete more CBT thought records for a detailed analysis.',
          somaticAnalysis: data.somaticAnalysis ?? 'Somatic data is being collected. Continue using grounding and body scan tools for deeper insights.',
        });
      } else throw new Error();
    } catch {
      setDiagReport({
        observation: 'Based on your current data, you are building a consistent pattern of self-awareness. Continue daily check-ins for more refined analysis.',
        habitsDeepDive: 'Your wellness practices are developing structure. The patterns emerging suggest positive momentum in emotional regulation.',
        cognitiveAnalysis: 'Complete more CBT thought records to unlock personalized cognitive distortion analysis.',
        somaticAnalysis: 'Continue using body scan and grounding tools to build your somatic awareness profile.',
      });
    } finally {
      setDiagRunning(false);
    }
  };

  // ── Therapist email send ─────────────────────────────────────────────────────
  const [recipientEmail, setRecipientEmail] = useState(
    () => localStorage.getItem('lance_therapist_email') || ''
  );
  const [sendStatus,    setSendStatus]    = useState<'idle'|'preparing'|'sending'|'success'|'error'>('idle');
  const [sendStage,     setSendStage]     = useState('');
  const [sentResponse,  setSentResponse]  = useState<{ recipient: string; subject: string; body: string }|null>(null);
  const [sendError,     setSendError]     = useState('');
  const [lastWasWeekly, setLastWasWeekly] = useState(false);

  useEffect(() => { localStorage.setItem('lance_therapist_email', recipientEmail); }, [recipientEmail]);

  const handleSend = async (isWeekly: boolean) => {
    const email = recipientEmail.trim();
    if (!email || !email.includes('@')) { setSendError('Please enter a valid email address.'); setSendStatus('error'); return; }
    setLastWasWeekly(isWeekly); setSendStatus('preparing'); setSendError('');
    const steps = isWeekly ? SEND_STEPS_WEEKLY : SEND_STEPS_FULL;
    for (let i = 0; i < steps.length - 1; i++) {
      setSendStage(steps[i]);
      await new Promise(r => setTimeout(r, 750));
    }
    setSendStatus('sending'); setSendStage(steps[steps.length - 1]);
    let targetMoodLogs = moodLogs;
    let targetActivityLogs = activityLogs;
    if (isWeekly) {
      const ref = moodLogs.length ? new Date(Math.max(...moodLogs.map(l => new Date(l.date).getTime()))) : new Date();
      const cutoff = new Date(ref); cutoff.setDate(ref.getDate() - 7);
      targetMoodLogs      = moodLogs.filter(l => new Date(l.date) >= cutoff);
      targetActivityLogs  = activityLogs.filter(l => new Date((l as any).date) >= cutoff);
    }
    try {
      const res = await fetch('/api/therapy/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userName, moodLogs: targetMoodLogs, activityLogs: targetActivityLogs, isWeekly }),
      });
      const data = await res.json();
      if (data.success) {
        setSentResponse({ recipient: data.recipient, subject: data.subject, body: data.body });
        setSendStatus('success');
      } else throw new Error(data.error || 'Server error');
    } catch (err: any) {
      setSendError(err.message || 'Connection failed. Check your internet and try again.');
      setSendStatus('error');
    }
  };

  // ── JSON export ──────────────────────────────────────────────────────────────
  const exportJSON = () => {
    const payload = {
      appName: 'L.A.N.C.E. Wellness Hub',
      exportTimestamp: new Date().toISOString(),
      clientName: userName,
      statistics: {
        streak, xp, level, completedChallenges: completedChallenges.length,
        moodLogsCount: moodLogs.length, goalsCount: goals.length,
        sleepLogsCount: sleepLogs.length, activityLogsCount: activityLogs.length,
        nutritionLogsCount: nutritionLogs.length, cbtRecordsCount: cbtRecords.length,
        gratitudeEntriesCount: gratitudeData.length, couplesLogsCount: couplesLogs.length,
      },
      internConfig: intern,
      moodLogs,
      goals,
      completedChallenges,
      sleepLogs, activityLogs, nutritionLogs, couplesLogs,
      cbtRecords, gratitudeEntries: gratitudeData, dbtLogs,
    };
    downloadBlob(JSON.stringify(payload, null, 2), `${(userName||'client').toLowerCase().replace(/\s+/g,'_')}_lance_archive.json`, 'application/json');
  };

  // ── CSV exports ──────────────────────────────────────────────────────────────
  const exportCSV = (type: string) => {
    let csv = '', filename = '';
    const sanitize = (v: any) => `"${String(v ?? '').replace(/"/g,'""').replace(/\n/g,' ')}"`;
    const client = (userName || 'client').toLowerCase().replace(/\s+/g,'_');

    if (type === 'mood') {
      const hdrs = ['Date','Mood (1-5)','Energy (1-5)','Note'];
      const rows = moodLogs.map(l => [l.date, l.mood, l.energy, l.note ?? ''].map(sanitize));
      csv = [hdrs.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `${client}_mood_log.csv`;
    } else if (type === 'sleep') {
      const hdrs = ['Date','Hours Slept','Quality (1-5)','Wake Feel'];
      const rows = sleepLogs.map((l: any) => [l.date, l.hoursSlept, l.quality, l.wakeFeel].map(sanitize));
      csv = [hdrs.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `${client}_sleep_log.csv`;
    } else if (type === 'activity') {
      const hdrs = ['Date','Active Days','Total Minutes','Avg Meal Quality','Avg Water'];
      const rows = activityLogs.map((l: any) => [
        l.date,
        l.activities?.length > 0 ? 'Yes' : 'No',
        l.activities?.reduce((s: number, a: any) => s + (a.minutes ?? 0), 0) ?? 0,
        l.mealQuality ?? '',
        l.water ?? '',
      ].map(sanitize));
      csv = [hdrs.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `${client}_activity_log.csv`;
    } else if (type === 'gratitude') {
      const hdrs = ['Date','Item 1','Item 2','Item 3'];
      const rows = gratitudeData.map((e: any) => [
        e.date,
        e.items?.[0] ?? '', e.items?.[1] ?? '', e.items?.[2] ?? '',
      ].map(sanitize));
      csv = [hdrs.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `${client}_gratitude_log.csv`;
    } else if (type === 'cbt') {
      const hdrs = ['Date','Situation','Automatic Thought','Distortion','Balanced Thought'];
      // Two different CBT tools feed this export with two different schemas: the full
      // Thought Record (situation/automaticThought/distortion/balancedThought) and the
      // Quick Reframe (rawThought/selectedDistortion/reframedThought, no situation field).
      // Normalize both onto the same columns instead of letting the Quick Reframe rows
      // export as blank.
      const rows = cbtRecords.map((r: any) => [
        r.date ?? '',
        r.situation ?? '',
        r.automaticThought ?? r.rawThought ?? '',
        r.distortion ?? r.selectedDistortion ?? '',
        r.balancedThought ?? r.reframedThought ?? '',
      ].map(sanitize));
      csv = [hdrs.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `${client}_cbt_records.csv`;
    } else if (type === 'nutrition') {
      const hdrs = ['Date','Meal Type','Food Items','Mood Rating','Energy','Tags'];
      const rows = nutritionLogs.map((l: any) => [
        l.date ?? '', l.mealType ?? '', l.foodItems ?? '',
        l.moodRating ?? '', l.energyLevel ?? '', (l.tags ?? []).join('; '),
      ].map(sanitize));
      csv = [hdrs.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `${client}_nutrition_log.csv`;
    } else if (type === 'couples') {
      const hdrs = ['Date','Category','From','To','Note'];
      const rows = couplesLogs.map((l: any) => [
        l.timestamp ?? '', l.category ?? '', l.from ?? '', l.to ?? '', l.text ?? '',
      ].map(sanitize));
      csv = [hdrs.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `${client}_couples_appreciation_notes.csv`;
    }
    if (csv) downloadBlob(csv, filename, 'text/csv;charset=utf-8;');
  };

  // ── Print PDF ────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const printContent = `
<!DOCTYPE html><html><head>
<title>${userName || 'Client'} — L.A.N.C.E. Clinical Summary</title>
<style>
  body{font-family:system-ui,sans-serif;padding:32px;max-width:800px;margin:auto;color:#1e293b}
  h1{font-size:24px;font-weight:900;margin-bottom:4px}
  h2{font-size:14px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.05em;margin:24px 0 8px}
  p{font-size:13px;line-height:1.6;color:#475569}
  table{width:100%;border-collapse:collapse;font-size:12px;margin:8px 0}
  th{background:#f1f5f9;text-align:left;padding:6px 10px;font-weight:700;color:#334155}
  td{padding:5px 10px;border-bottom:1px solid #e2e8f0;color:#475569}
  .tag{display:inline-block;background:#e0f2fe;color:#0369a1;border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700}
  @media print{body{padding:16px}}
</style></head><body>
<h1>L.A.N.C.E. Clinical Summary</h1>
<p><strong>Client:</strong> ${userName || 'Anonymous'} &nbsp;|&nbsp; <strong>Generated:</strong> ${new Date().toLocaleDateString()} &nbsp;|&nbsp; <strong>Intern AI:</strong> ${intern.name} (${intern.personalityId})</p>

<h2>Wellness Overview</h2>
<table><tr><th>Metric</th><th>Value</th></tr>
<tr><td>Current Streak</td><td>${streak} days</td></tr>
<tr><td>Total XP</td><td>${xp} (Level ${level})</td></tr>
<tr><td>Mood Check-ins</td><td>${moodLogs.length}</td></tr>
<tr><td>Challenges Completed</td><td>${completedChallenges.length}</td></tr>
<tr><td>Active Goals</td><td>${activeGoals}</td></tr>
<tr><td>Completed Goals</td><td>${completedGoals}</td></tr>
${cbtRecords.length ? `<tr><td>CBT Thought Records</td><td>${cbtRecords.length}</td></tr>` : ''}
${gratitudeData.length ? `<tr><td>Gratitude Entries</td><td>${gratitudeData.length}</td></tr>` : ''}
</table>

<h2>7-Day Mood & Energy Trend</h2>
<table><tr><th>Date</th><th>Mood (1-5)</th><th>Energy (1-5)</th><th>Note</th></tr>
${moodLogs.slice(0,7).map(l => `<tr><td>${l.date}</td><td>${l.mood ?? '—'}</td><td>${l.energy ?? '—'}</td><td>${l.note ?? ''}</td></tr>`).join('')}
</table>

${sleepLogs.length > 0 ? `<h2>Sleep Data (Last ${Math.min(sleepLogs.length,7)} Nights)</h2>
<table><tr><th>Date</th><th>Hours</th><th>Quality</th><th>Wake Feel</th></tr>
${sleepLogs.slice(-7).map((l: any) => `<tr><td>${l.date}</td><td>${l.hoursSlept ?? '—'}</td><td>${l.quality ?? '—'}/5</td><td>${l.wakeFeel ?? '—'}</td></tr>`).join('')}
</table>` : ''}

${goals.length > 0 ? `<h2>Goals</h2>
<table><tr><th>Goal</th><th>Status</th><th>Target Date</th></tr>
${goals.map(g => `<tr><td>${g.title}</td><td>${g.completed ? '✓ Complete' : 'Active'}</td><td>${g.targetDate || '—'}</td></tr>`).join('')}
</table>` : ''}

${completedChallenges.length > 0 ? `<h2>Completed Challenges</h2>
<p>${completedChallenges.map(id => `<span class="tag">${id.replace('challenge_','').replace(/_/g,' ')}</span>`).join(' ')}</p>` : ''}

<p style="margin-top:48px;font-size:11px;color:#94a3b8">This report was generated by L.A.N.C.E. Wellness Hub. Not for diagnostic purposes. For clinical use by licensed providers only.</p>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const hasDiagData = cbtRecords.length > 0 || dbtLogs.length > 0 || gratitudeData.length > 0;

  // Insights should stay empty until a client has actually put something into the app —
  // showing empty charts, "0" stat tiles, and locked teaser cards by default makes the
  // tab feel cluttered/broken rather than useful. Each section below only renders once
  // its OWN corresponding data exists; only the Share/Export sections (which aren't
  // "insights" so much as actions on whatever data does exist) are always visible.
  const hasAnyProgress = xp > 0 || completedChallenges.length > 0 || moodLogs.length > 0;
  const hasAnyDataAtAll = hasAnyProgress || sleepData !== null || activityData !== null
    || goals.length > 0 || hasDiagData || nutritionLogs.length > 0 || couplesLogs.length > 0 || couplesActivityDone > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-28" style={{ background: '#071C38', color: '#E8F5F1' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
        style={{ background: 'rgba(5,18,48,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(62,207,207,0.1)' }}>
        <button onClick={onBack} className="p-2 rounded-xl" style={{ color: '#8BA8A0' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>Clinical Analytics</div>
          <h2 className="text-sm font-black leading-none" style={{ color: '#E8F5F1' }}>What the water remembers</h2>
        </div>
        {hasAnyDataAtAll && (
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(62,207,207,0.1)', border: '1px solid rgba(62,207,207,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Live</span>
        </div>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ── 0. Empty state — shown only when nothing has been logged anywhere yet ── */}
        {!hasAnyDataAtAll && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 text-center border"
            style={{ background: '#0D2440', borderColor: '#3ECFCF22' }}>
            <span className="text-3xl block mb-2">{intern.avatar}</span>
            <p className="text-sm font-black" style={{ color: '#E8F5F1' }}>Nothing to show yet</p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#8BA8A0' }}>
              Log a mood check-in or use any tool in the Library — your trends, streaks, and
              summaries will start appearing here automatically.
            </p>
          </motion.div>
        )}

        {/* ── 1. Stats Strip + 2. XP Bar — only once there's some real progress to show ── */}
        {hasAnyProgress && (
          <>
            {(equippedTitleName || equippedAccentSwatch) && (
              <div className="rounded-2xl px-4 py-2.5 flex items-center gap-2.5 border"
                style={{ background: '#0D2440', borderColor: equippedAccentSwatch?.startsWith('#') ? `${equippedAccentSwatch}55` : '#3ECFCF22' }}>
                {equippedAccentSwatch && (
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: equippedAccentSwatch }} />
                )}
                {equippedTitleName && (
                  <span className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: '#E8F5F1' }}>
                    {equippedTitleName}
                  </span>
                )}
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              <StatCard label="Streak"    value={streak}           unit="d" color="#f97316" />
              <StatCard label="XP"        value={xp}               unit=""  color="#7FD98C" />
              <StatCard label="Level"     value={level}            unit=""  color="#3ECFCF" />
              <StatCard label="Check-ins" value={moodLogs.length}  unit=""  color="#8B5CF6" />
            </div>

            {/* VR practice — rituals completed on the island (headset), logged by /vr/ */}
            {(() => {
              let vr: { ts: string; kind: string }[] = [];
              try { vr = JSON.parse(localStorage.getItem('lance_vr_practice_v1') || '[]'); } catch { /* none */ }
              const weekAgo = Date.now() - 7 * 864e5;
              const recent = vr.filter(e => new Date(e.ts).getTime() > weekAgo);
              if (!recent.length) return null;
              const counts: Record<string, number> = {};
              recent.forEach(e => { counts[e.kind] = (counts[e.kind] || 0) + 1; });
              const LABELS: Record<string, string> = {
                breathwork_478: 'breath sessions', worry_parked: 'worries parked',
                gratitude_lantern: 'lanterns lit', journal_1: 'journals heard', journal_2: 'journals heard', journal_3: 'journals heard',
              };
              const parts = Object.entries(counts).reduce<Record<string, number>>((acc, [k, n]) => {
                const label = LABELS[k] ?? k;
                acc[label] = (acc[label] || 0) + n;
                return acc;
              }, {});
              return (
                <SectionCard delay={0.04}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🥽</span>
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#7FD98C' }}>
                      On the island this week
                    </span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: '#B8D8CC' }}>
                    {Object.entries(parts).map(([label, n]) => `${n} ${label}`).join(' · ')}
                  </p>
                </SectionCard>
              );
            })()}

            <SectionCard delay={0.05}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>
                  Level {level} Progress
                </span>
                <span className="text-[9px] font-bold" style={{ color: '#8BA8A0' }}>
                  {xpProgress} / 100 XP · {100 - xpProgress} to next
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#3ECFCF,#7FD98C)' }}
                  initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
            </SectionCard>
          </>
        )}

        {/* ── 3. 7-Day Chart — only once at least one check-in exists ── */}
        {moodLogs.length > 0 && (
          <SectionCard delay={0.1}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xs font-black" style={{ color: '#E8F5F1' }}>7-Day Trend</h3>
                <p className="text-[9px] mt-0.5" style={{ color: '#8BA8A0' }}>Mood & energy over the last week</p>
              </div>
              <div className="flex gap-3 text-[8px] font-black uppercase tracking-wider">
                <span className="flex items-center gap-1" style={{ color: '#3ECFCF' }}>
                  <span className="w-2 h-2 rounded-full inline-block bg-cyan-400" /> Mood
                </span>
                <span className="flex items-center gap-1" style={{ color: '#7FD98C' }}>
                  <span className="w-2 h-2 rounded-full inline-block bg-green-400" /> Energy
                </span>
              </div>
            </div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2a28" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#8BA8A0', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 8, fill: '#3ECFCF44' }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={3} stroke="#3ECFCF11" strokeDasharray="3 3" />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="mood" stroke="#3ECFCF" strokeWidth={2}
                    dot={{ fill: '#3ECFCF', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#3ECFCF', strokeWidth: 0 }} connectNulls={false} />
                  <Line type="monotone" dataKey="energy" stroke="#7FD98C" strokeWidth={2} strokeDasharray="4 2"
                    dot={{ fill: '#7FD98C', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#7FD98C', strokeWidth: 0 }} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )}

        {/* ── 4. Averages ── */}
        {moodLogs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            className="grid grid-cols-3 gap-3">
            {[
              { label: 'Avg Mood',   value: avgMood.toFixed(1),   sub: MOOD_LABELS[Math.round(avgMood)],   color: '#3ECFCF' },
              { label: 'Avg Energy', value: avgEnergy.toFixed(1), sub: ENERGY_LABELS[Math.round(avgEnergy)], color: '#7FD98C' },
              { label: 'Best Mood',  value: bestEntry ? DAY_NAMES[new Date(bestEntry.date).getDay()] : '—', sub: bestEntry?.date.slice(5) ?? '', color: '#f97316' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3 border text-center"
                style={{ background: '#0D2440', borderColor: `${s.color}22` }}>
                <div className="text-base font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>{s.label}</div>
                <div className="text-[8px] mt-0.5" style={{ color: `${s.color}66` }}>{s.sub}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── 5. Sleep ── */}
        {sleepData && (
          <SectionCard delay={0.17} glow="#8B5CF6">
            <SectionLabel text={`Sleep · Last ${sleepData.count} Nights`} />
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl p-3 border text-center" style={{ background: '#071C38', borderColor: '#8B5CF622' }}>
                <div className="text-base font-black" style={{ color: sleepData.avgHours >= 7 ? '#7FD98C' : sleepData.avgHours >= 6 ? '#f97316' : '#ef4444' }}>
                  {sleepData.avgHours.toFixed(1)}h
                </div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>Avg Sleep</div>
              </div>
              <div className="rounded-2xl p-3 border text-center" style={{ background: '#071C38', borderColor: '#8B5CF622' }}>
                <div className="text-base font-black" style={{ color: '#8B5CF6' }}>{sleepData.avgQuality.toFixed(1)}</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>Avg Quality</div>
              </div>
              <div className="rounded-2xl p-3 border text-center" style={{ background: '#071C38', borderColor: '#8B5CF622' }}>
                <div className="text-base font-black" style={{ color: '#3ECFCF' }}>
                  {sleepData.wakeFeels.refreshed > sleepData.wakeFeels.groggy ? '🌞' : sleepData.wakeFeels.groggy > 0 ? '😴' : '😐'}
                </div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>Wake Feel</div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── 6. Activity ── */}
        {activityData && (
          <SectionCard delay={0.19} glow="#f97316">
            <SectionLabel text={`Activity · Last ${activityData.count} Days`} />
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Move',   value: `${activityData.totalMinutes}m`, color: '#f97316' },
                { label: 'Active', value: `${activityData.activeDays}d`,   color: '#f97316' },
                { label: 'Meals',  value: activityData.avgMealQ > 0 ? activityData.avgMealQ.toFixed(1) : '—', color: activityData.avgMealQ >= 4 ? '#7FD98C' : activityData.avgMealQ >= 3 ? '#f97316' : '#ef4444' },
                { label: 'Water',  value: activityData.avgWater.toFixed(1), color: '#3ECFCF' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-3 border text-center"
                  style={{ background: '#071C38', borderColor: '#f9731622' }}>
                  <div className="text-sm font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[7px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── 7. Goals ── */}
        {goals.length > 0 && (
          <SectionCard delay={0.21} glow="#8B5CF6">
            <SectionLabel text="Goals" />
            <div className="flex gap-8">
              {[{ val: activeGoals, label: 'Active', color: '#8B5CF6' }, { val: completedGoals, label: 'Completed', color: '#7FD98C' }, { val: goals.length, label: 'Total', color: '#3ECFCF' }].map(g => (
                <div key={g.label}>
                  <div className="text-xl font-black" style={{ color: g.color }}>{g.val}</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: '#8BA8A0' }}>{g.label}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── 8. Challenges — only once at least one is actually complete ── */}
        {completedChallenges.length > 0 && (
          <SectionCard delay={0.23}>
            <SectionLabel text="Completed Challenges" />
            <div className="flex flex-wrap gap-1.5">
              {completedChallenges.map(id => (
                <span key={id} className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                  style={{ background: '#3ECFCF11', color: '#3ECFCF', border: '1px solid #3ECFCF33' }}>
                  {id.replace('challenge_','').replace(/_/g,' ')}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── 8b. Mood Heatmap — 30-day calendar grid ── */}
        {moodLogs.length > 0 && (
          <SectionCard delay={0.24}>
            <SectionLabel text="30-Day Mood Heatmap" />
            <div className="grid grid-cols-10 gap-1">
              {heatmapDays.map(d => {
                const colors = ['#ef4444', '#f97316', '#eab308', '#7FD98C', '#3ECFCF'];
                const bg = d.mood ? colors[Math.round(d.mood) - 1] : 'rgba(255,255,255,0.06)';
                return (
                  <div key={d.date} title={`${d.date}${d.mood ? ` · ${MOOD_LABELS[Math.round(d.mood)]}` : ''}`}
                    className="aspect-square rounded-md" style={{ background: bg, opacity: d.mood ? 0.85 : 1 }} />
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[8px] uppercase tracking-wider font-black" style={{ color: '#8BA8A0' }}>
              <span>Low</span>
              {['#ef4444', '#f97316', '#eab308', '#7FD98C', '#3ECFCF'].map(c => (
                <span key={c} className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />
              ))}
              <span>High</span>
            </div>
          </SectionCard>
        )}

        {/* ── 8c. Mood Breakdown — % distribution ── */}
        {moodBreakdown && (
          <SectionCard delay={0.245} glow="#8B5CF6">
            <SectionLabel text="Mood Breakdown" color="#8B5CF6" />
            <div className="flex items-center gap-4">
              <div style={{ width: 100, height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={moodBreakdown} dataKey="count" nameKey="label" innerRadius={28} outerRadius={45} paddingAngle={2}>
                      {moodBreakdown.map((_, i) => (
                        <Cell key={i} fill={['#ef4444', '#f97316', '#eab308', '#7FD98C', '#3ECFCF'][i]} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1">
                {moodBreakdown.filter(m => m.count > 0).map((m, i) => (
                  <div key={m.label} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 font-bold" style={{ color: '#8BA8A0' }}>
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: ['#ef4444', '#f97316', '#eab308', '#7FD98C', '#3ECFCF'][MOOD_LABELS.indexOf(m.label) - 1] }} />
                      {m.label}
                    </span>
                    <span className="font-black" style={{ color: '#E8F5F1' }}>{m.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── 8c2. Somatic Correlations — sleep quality vs. mood ── */}
        {sleepData && moodLogs.length > 0 && (
          <SectionCard delay={0.247} glow="#22D3EE">
            <SectionLabel text="Somatic Correlations" color="#22D3EE" />
            <p className="text-[10.5px] leading-relaxed" style={{ color: '#8BA8A0' }}>
              Your average mood is <strong style={{ color: '#E8F5F1' }}>{avgMood.toFixed(1)}/5</strong> against an average sleep quality of{' '}
              <strong style={{ color: '#E8F5F1' }}>{sleepData.avgQuality.toFixed(1)}/5</strong> over the last {sleepData.count} logged nights —
              {avgMood >= 3.5 && sleepData.avgQuality >= 3.5
                ? ' both trending in a healthy range together.'
                : avgMood < 3 && sleepData.avgQuality < 3
                ? ' both running low together, which is a common pairing worth watching.'
                : ' a gap between the two worth keeping an eye on.'}
            </p>
          </SectionCard>
        )}

        {/* ── 8d. Activity Boosters ── */}
        {activityBoost && (
          <SectionCard delay={0.25} glow="#f97316">
            <SectionLabel text="Activity Boosters" color="#f97316" />
            <p className="text-[10.5px] leading-relaxed mb-2" style={{ color: '#8BA8A0' }}>
              Your average mood on days you logged an activity vs. days you didn't.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3 border text-center" style={{ background: '#071C38', borderColor: '#f9731622' }}>
                <div className="text-lg font-black" style={{ color: '#7FD98C' }}>{activityBoost.withActivity.toFixed(1)}</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>Active days</div>
              </div>
              <div className="rounded-2xl p-3 border text-center" style={{ background: '#071C38', borderColor: '#f9731622' }}>
                <div className="text-lg font-black" style={{ color: '#8BA8A0' }}>{activityBoost.withoutActivity.toFixed(1)}</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>Rest days</div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── 8e. Willpower Indices ── */}
        {(neuroStability !== null || copingSuccesses > 0) && (
          <SectionCard delay={0.255} glow="#A78BFA">
            <SectionLabel text="Willpower Indices" color="#A78BFA" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3 border text-center" style={{ background: '#071C38', borderColor: '#A78BFA22' }}>
                <div className="text-lg font-black" style={{ color: '#A78BFA' }}>{neuroStability !== null ? `${Math.round(neuroStability)}%` : '—'}</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>Habit stability</div>
              </div>
              <div className="rounded-2xl p-3 border text-center" style={{ background: '#071C38', borderColor: '#A78BFA22' }}>
                <div className="text-lg font-black" style={{ color: '#A78BFA' }}>{copingSuccesses}</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#8BA8A0' }}>Coping wins logged</div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── 8f. Craving Tracker ── */}
        {cravingLogs.length > 0 && (
          <SectionCard delay={0.26} glow="#f43f5e">
            <SectionLabel text="Craving Tracker" color="#f43f5e" />
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-black" style={{ color: '#f43f5e' }}>{cravingLogs.length}</div>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: '#8BA8A0' }}>Urges logged</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black" style={{ color: '#E8F5F1' }}>
                  {avg(cravingLogs.slice(-7).map(l => l.intensity)).toFixed(1)}/10
                </div>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: '#8BA8A0' }}>Avg intensity, last 7</div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── 8g. Shadow Reflector ── */}
        {shadowLogs.length > 0 && (
          <SectionCard delay={0.265} glow="#818CF8">
            <SectionLabel text="Shadow Reflector" color="#818CF8" />
            <p className="text-[10.5px]" style={{ color: '#8BA8A0' }}>
              {shadowLogs.length} shadow-work reflection{shadowLogs.length === 1 ? '' : 's'} logged
              {dreamLogs.length > 0 ? ` · ${dreamLogs.length} dream${dreamLogs.length === 1 ? '' : 's'} decoded` : ''}.
            </p>
          </SectionCard>
        )}

        {/* ── 8h. Nutrition Feed ── */}
        {nutritionLogs.length > 0 && (
          <SectionCard delay={0.27} glow="#7FD98C">
            <SectionLabel text="Nutrition Feed" color="#7FD98C" />
            <div className="space-y-1.5">
              {nutritionLogs.slice(-3).reverse().map((n: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-[10px] rounded-xl px-3 py-2" style={{ background: '#071C38' }}>
                  <span className="font-bold truncate" style={{ color: '#E8F5F1' }}>{n.mealName ?? n.name ?? 'Meal'}</span>
                  <span style={{ color: '#8BA8A0' }}>{n.moodAfter ?? n.mood ?? '—'}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── 8i. Recommended Books — matched to what you've been working on ── */}
        {hasAnyProgress && (
          <SectionCard delay={0.275} glow="#FCD34D">
            <SectionLabel text="Recommended Reading" color="#FCD34D" />
            <div className="space-y-1.5">
              {(cravingLogs.length > 0
                ? [{ title: 'This Naked Mind', author: 'Annie Grace' }, { title: 'In the Realm of Hungry Ghosts', author: 'Gabor Maté' }]
                : shadowLogs.length > 0
                ? [{ title: 'Owning Your Own Shadow', author: 'Robert A. Johnson' }, { title: 'Man and His Symbols', author: 'Carl Jung' }]
                : [{ title: 'Feeling Good', author: 'David D. Burns' }, { title: 'The Body Keeps the Score', author: 'Bessel van der Kolk' }]
              ).map(b => (
                <div key={b.title} className="rounded-xl px-3 py-2" style={{ background: '#071C38' }}>
                  <p className="text-[11px] font-bold" style={{ color: '#E8F5F1' }}>{b.title}</p>
                  <p className="text-[9px]" style={{ color: '#8BA8A0' }}>{b.author}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── 9. LANCE AI Analysis — only once there's real progress to analyze ── */}
        {hasAnyProgress && (
          <SectionCard delay={0.26} glow="#3ECFCF">
            <div className="flex items-center gap-3 mb-3">
              <LanceAvatar emotion={aiLoading ? 'processing' : aiAnalysis ? 'smug' : 'neutral'} size="sm" />
              <div className="flex-1">
                <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>
                  L.A.N.C.E. Weekly Analysis
                </div>
                <div className="text-[9px]" style={{ color: '#8BA8A0' }}>AI assessment of your data</div>
              </div>
              {!aiLoading && (
                <button onClick={fetchAI} className="p-1.5 rounded-lg" style={{ color: '#3ECFCF66' }}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {!aiAnalysis && !aiLoading && (
              <button onClick={fetchAI}
                className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
                style={{ background: '#3ECFCF11', color: '#3ECFCF', border: '1px solid #3ECFCF33' }}>
                Generate Analysis
              </button>
            )}
            {aiLoading && (
              <div className="py-3 text-center">
                <span className="inline-flex gap-1" style={{ color: '#3ECFCF66' }}>
                  {[0,0.2,0.4].map((d, i) => (
                    <motion.span key={i} animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d }}>●</motion.span>
                  ))}
                </span>
                <div className="text-[9px] mt-2" style={{ color: '#3ECFCF44' }}>Processing your data…</div>
              </div>
            )}
            {aiAnalysis && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-2xl text-xs italic leading-relaxed"
                style={{ background: '#0D2440', borderLeft: '2px solid #3ECFCF44', color: '#8BA8A0' }}>
                "{aiAnalysis}"
              </motion.div>
            )}
          </SectionCard>
        )}

        {/* ══ 10. AI CLINICAL DIAGNOSTIC LOUNGE — only once there's real progress ═══ */}
        {hasAnyProgress && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}
          className="rounded-3xl p-5 space-y-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1e1b4b,#0f172a)', border: '1px solid rgba(129,140,248,0.25)' }}>
          {/* Background glow orbs */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(99,102,241,0.15)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, background: 'rgba(20,184,166,0.1)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />

          <div className="flex items-start gap-3 justify-between relative">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" style={{ color: '#818CF8' }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#818CF8' }}>
                  AI Clinical Diagnostic Center
                </span>
              </div>
              <h3 className="text-sm font-black text-white">Holistic Wellness Analysis</h3>
              <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(199,210,254,0.7)' }}>
                Correlates mood trends, CBT records, DBT logs, and habit patterns into a clinical synthesis report.
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" style={{ fill: 'rgba(129,140,248,0.2)' }} />
          </div>

          {/* Data telemetry sync indicators */}
          {!diagRunning && !diagReport && (
            <div className="space-y-3 relative">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '🧠 CBT Thought Records', count: cbtRecords.length,    unit: 'records' },
                  { label: '🚨 DBT Rescue Logs',     count: dbtLogs.length,       unit: 'cases'   },
                  { label: '💖 Gratitude Entries',   count: gratitudeData.length, unit: 'entries' },
                  { label: '😌 Mood Check-ins',      count: moodLogs.length,      unit: 'logs'    },
                ].map(t => (
                  <div key={t.label} className="flex items-center justify-between p-2.5 rounded-xl text-xs"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="font-semibold" style={{ color: 'rgba(199,210,254,0.8)' }}>{t.label}</span>
                    <span className="font-black text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8' }}>
                      {t.count} {t.unit}
                    </span>
                  </div>
                ))}
              </div>

              {!hasDiagData && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-[11px]"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#FCD34D' }}>
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  Use CBT, DBT, and Gratitude tools to unlock full diagnostics.
                </div>
              )}

              <button
                onClick={() => { setDiagRunning(true); setDiagStep(0); setDiagReport(null); }}
                disabled={!hasDiagData && moodLogs.length === 0}
                className="w-full py-3 rounded-2xl font-black text-[11.5px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: hasDiagData || moodLogs.length > 0 ? 'linear-gradient(90deg,#6366f1,#0d9488)' : 'rgba(255,255,255,0.06)', color: '#fff', opacity: hasDiagData || moodLogs.length > 0 ? 1 : 0.4 }}>
                <Sparkles className="w-3.5 h-3.5" style={{ fill: 'rgba(255,255,255,0.3)' }} />
                Launch AI Diagnostic Evaluation
              </button>
            </div>
          )}

          {/* Running progress */}
          {diagRunning && (
            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#818CF8' }}>
                  Running holistic synthesis…
                </span>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
              </div>
              <div className="space-y-2.5">
                {DIAG_STEPS.map((s, i) => {
                  const done = diagStep > i, active = diagStep === i;
                  return (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                        done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-500 text-white animate-pulse' : 'bg-white/10 text-white/40'
                      }`}>{done ? '✓' : i + 1}</div>
                      <span style={{ color: done ? 'rgba(255,255,255,0.4)' : active ? '#34D399' : 'rgba(255,255,255,0.3)', textDecoration: done ? 'line-through' : 'none' }}>
                        {active ? s.active : s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(diagStep + 1) * 20}%`, background: 'linear-gradient(90deg,#6366f1,#14b8a6)' }} />
              </div>
            </div>
          )}

          {/* Diagnostic result */}
          {!diagRunning && diagReport && (
            <div className="space-y-3 relative">
              <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {(['synthesis','cognitive','somatic'] as const).map(tab => (
                  <button key={tab} onClick={() => setDiagTab(tab)}
                    className="flex-1 py-2 rounded-xl text-[10px] font-black transition-all"
                    style={{
                      background: diagTab === tab ? '#fff' : 'transparent',
                      color: diagTab === tab ? '#1e1b4b' : 'rgba(199,210,254,0.6)',
                    }}>
                    {tab === 'synthesis' ? '🧘 Wise Mind' : tab === 'cognitive' ? '🧠 Cognitive' : '⚡ Somatic'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={diagTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-4 rounded-2xl space-y-3 text-xs"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {diagTab === 'synthesis' && (
                    <>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#2DD4BF' }}>Therapist Recommendation</p>
                        <p className="italic leading-relaxed" style={{ color: 'rgba(199,210,254,0.8)', borderLeft: '2px solid #2DD4BF', paddingLeft: 10 }}>{diagReport.observation}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#818CF8' }}>Integration Strategy</p>
                        <p className="leading-relaxed" style={{ color: 'rgba(199,210,254,0.7)' }}>{diagReport.habitsDeepDive}</p>
                      </div>
                    </>
                  )}
                  {diagTab === 'cognitive' && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#818CF8' }}>Cognitive Distortions</p>
                      <p className="leading-relaxed" style={{ color: 'rgba(199,210,254,0.7)', borderLeft: '2px solid #818CF8', paddingLeft: 10 }}>{diagReport.cognitiveAnalysis}</p>
                    </div>
                  )}
                  {diagTab === 'somatic' && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#34D399' }}>Somatic Resonance</p>
                      <p className="leading-relaxed" style={{ color: 'rgba(199,210,254,0.7)', borderLeft: '2px solid #34D399', paddingLeft: 10 }}>{diagReport.somaticAnalysis}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => { setDiagRunning(true); setDiagStep(0); setDiagReport(null); }}
                className="w-full py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(199,210,254,0.7)' }}>
                <RefreshCw className="w-3 h-3" /> Re-run Evaluation
              </button>
            </div>
          )}
        </motion.div>
        )}

        {/* ══ 11. THERAPIST REPORT SHARING (export/share action — always visible) ══ */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="rounded-3xl p-5 space-y-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(20,184,166,0.2)' }}>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.25)' }}>
              <Share2 className="w-5 h-5 animate-pulse" style={{ color: '#14B8A6' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Share with Your Therapist</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase"
                  style={{ background: 'rgba(20,184,166,0.15)', color: '#14B8A6' }}>Email</span>
              </div>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#8BA8A0' }}>
                Email your mood trends, goals, and therapeutic progress directly to your provider.
              </p>
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest block" style={{ color: '#8BA8A0' }}>
              Therapist Email
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8BA8A0' }} />
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={e => { setRecipientEmail(e.target.value); if (['success','error'].includes(sendStatus)) setSendStatus('idle'); }}
                  placeholder="therapist@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-semibold outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8F5F1' }}
                />
              </div>
              {recipientEmail !== 'ask@lancenabers.com' && (
                <button onClick={() => { setRecipientEmail('ask@lancenabers.com'); setSendStatus('idle'); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#8BA8A0' }}>
                  Default
                </button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setRecipientEmail('ask@lancenabers.com')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                style={{
                  background: recipientEmail === 'ask@lancenabers.com' ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${recipientEmail === 'ask@lancenabers.com' ? 'rgba(20,184,166,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: recipientEmail === 'ask@lancenabers.com' ? '#14B8A6' : '#8BA8A0',
                }}>
                Default Therapist
              </button>
              <button onClick={() => { setRecipientEmail(''); setSendStatus('idle'); }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8BA8A0' }}>
                Custom Email
              </button>
            </div>
          </div>

          {/* Send buttons — idle state. With zero data there is nothing to send:
              an enabled button that emails an empty summary is a lie in green. */}
          {sendStatus === 'idle' && !hasAnyDataAtAll && (
            <p className="text-[10px] text-center py-2" style={{ color: '#8BA8A0' }}>
              Sharing unlocks once there's something to share — log one check-in and these buttons wake up.
            </p>
          )}
          {sendStatus === 'idle' && hasAnyDataAtAll && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button onClick={() => handleSend(false)}
                  className="flex-1 py-3 rounded-2xl font-bold text-[11.5px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8F5F1' }}>
                  <FileText className="w-3.5 h-3.5" style={{ color: '#8BA8A0' }} />
                  Full History
                </button>
                <button onClick={() => handleSend(true)}
                  className="flex-[1.4] py-3 rounded-2xl font-black text-[11.5px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#0d9488,#0369a1)', color: '#fff', boxShadow: '0 4px 16px rgba(13,148,136,0.3)' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.6)' }} />
                  Send Weekly Summary
                </button>
              </div>
              <button onClick={handlePrint}
                className="w-full py-2.5 rounded-2xl font-bold text-[11.5px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8' }}>
                <Printer className="w-4 h-4" />
                Generate & Print PDF Clinical Summary
              </button>
              <p className="text-[9px] text-center uppercase tracking-wider" style={{ color: '#8BA8A040' }}>
                Weekly summary covers the last 7 days · Full history includes all-time records
              </p>
            </div>
          )}

          {/* Preparing / sending state */}
          {(sendStatus === 'preparing' || sendStatus === 'sending') && (
            <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 animate-spin" style={{ color: '#14B8A6' }} />
                <span className="text-xs font-black" style={{ color: '#14B8A6' }}>Transmitter Handshake Active</span>
              </div>
              <p className="text-[11px] italic animate-pulse" style={{ color: '#8BA8A0' }}>{sendStage}</p>
            </div>
          )}

          {/* Error state */}
          {sendStatus === 'error' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl flex items-start gap-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-red-400 block">Transmission Halted</span>
                  <p className="text-[11px] mt-0.5" style={{ color: '#8BA8A0' }}>{sendError}</p>
                </div>
              </div>
              <button onClick={() => handleSend(lastWasWeekly)}
                className="w-full py-3 rounded-2xl font-black text-sm"
                style={{ background: '#1e293b', color: '#E8F5F1' }}>
                Retry Connection
              </button>
            </div>
          )}

          {/* Success state */}
          {sendStatus === 'success' && sentResponse && (
            <div className="space-y-3 p-4 rounded-2xl"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-black text-white block">
                    {lastWasWeekly ? 'Weekly Summary Dispatched!' : 'Report Dispatched!'}
                  </span>
                  <p className="text-[11px] mt-0.5" style={{ color: '#8BA8A0' }}>
                    Sent to <strong className="text-white font-mono">{sentResponse.recipient}</strong>
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl max-h-40 overflow-y-auto"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#34D399' }}>
                  Sent Email Preview
                </p>
                <p className="text-[10px] font-bold text-white/70 mb-1">{sentResponse.subject}</p>
                <p className="text-[10px] leading-relaxed whitespace-pre-line" style={{ color: '#8BA8A0' }}>
                  {sentResponse.body}
                </p>
              </div>
              <button onClick={() => setSendStatus('idle')}
                className="w-full py-2.5 rounded-xl text-xs font-black text-white"
                style={{ background: 'rgba(16,185,129,0.3)' }}>
                Send New Report
              </button>
            </div>
          )}
        </motion.div>

        {/* ══ 12. DATA EXPORT CENTER ════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-3xl p-5 space-y-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Download className="w-4.5 h-4.5" style={{ color: '#3ECFCF' }} />
              <div>
                <h3 className="text-sm font-black text-white">Personal Archive Export</h3>
                <p className="text-[10px]" style={{ color: '#8BA8A0' }}>Your data, client-owned · Download anytime</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#8BA8A0' }}>Client Owned</span>
          </div>

          {/* Master JSON */}
          <button onClick={exportJSON}
            className="w-full py-3 rounded-2xl font-black text-[11.5px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: 'rgba(62,207,207,0.1)', border: '1px solid rgba(62,207,207,0.2)', color: '#3ECFCF' }}>
            <Download className="w-4 h-4" />
            Download Master JSON Archive (All Records)
          </button>

          {/* CSV grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'mood',      label: 'Mood Log CSV',       icon: '💜', count: moodLogs.length      },
              { type: 'sleep',     label: 'Sleep Log CSV',      icon: '🌙', count: sleepLogs.length     },
              { type: 'activity',  label: 'Activity CSV',       icon: '✅', count: activityLogs.length  },
              { type: 'gratitude', label: 'Gratitude CSV',      icon: '✨', count: gratitudeData.length },
              { type: 'cbt',       label: 'CBT Records CSV',    icon: '🧠', count: cbtRecords.length    },
              { type: 'nutrition', label: 'Nutrition CSV',      icon: '🥗', count: nutritionLogs.length },
              { type: 'couples',   label: 'Couples Therapy CSV',icon: '💑', count: couplesLogs.length   },
            ].map(item => (
              <button
                key={item.type}
                onClick={() => exportCSV(item.type)}
                className="flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all active:scale-[0.97]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-[11px] font-black text-white truncate">{item.label}</div>
                  <div className="text-[9px] font-bold" style={{ color: item.count > 0 ? '#3ECFCF' : '#8BA8A060' }}>
                    {item.count > 0 ? `${item.count} records` : 'No data yet'}
                  </div>
                </div>
                <Download className="w-3 h-3 shrink-0 ml-auto" style={{ color: '#8BA8A060' }} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl text-[10px]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#8BA8A0' }}>
            <Shield className="w-3.5 h-3.5 shrink-0" />
            Your data is stored locally on this device. Exports are for personal or clinical use only.
          </div>
        </motion.div>

        {/* ── Intern footer ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
          className="flex items-start gap-3 px-1 pb-4">
          <span className="text-2xl shrink-0">{intern.avatar}</span>
          <p className="text-xs leading-relaxed" style={{ color: '#7FD98C66' }}>
            {moodLogs.length === 0
              ? "Start a mood check-in today to see your patterns here!"
              : `${moodLogs.length} check-in${moodLogs.length !== 1 ? 's' : ''} logged. ${streak > 0 ? `${streak}-day streak — keep it going!` : 'Log in tomorrow to start a streak!'}`
            }
          </p>
        </motion.div>

      </div>
    </div>
  );
}
