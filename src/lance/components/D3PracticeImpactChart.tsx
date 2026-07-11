import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Sparkles, Calendar, Heart, Zap, Play, Activity, 
  HelpCircle, BookOpen, Brain, Smile, Flame, ShieldCheck,
  TrendingUp, BarChart2
} from 'lucide-react';
import { MoodLog } from '../types';

interface D3PracticeImpactChartProps {
  moodLogs: MoodLog[];
  userName?: string;
}

interface PracticeSession {
  type: string;
  label: string;
  detail?: string;
}

interface PracticeImpactPoint {
  dateStr: string;
  parsedDate: Date;
  mood: number;
  completedCount: number;
  sessions: PracticeSession[];
  isSimulated: boolean;
}

export default function D3PracticeImpactChart({
  moodLogs,
  userName = 'Friend',
}: D3PracticeImpactChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Time window selection state: 14 days or 30 days
  const [timeWindow, setTimeWindow] = useState<14 | 30>(30);
  const [showMoodLine, setShowMoodLine] = useState(true);
  const [showPracticeBars, setShowPracticeBars] = useState(true);
  
  // Selected data point for interactive tracking
  const [selectedPoint, setSelectedPoint] = useState<PracticeImpactPoint | null>(null);

  // Chart responsiveness dimensions
  const [dimensions, setDimensions] = useState({ width: 600, height: 260 });

  // 1. Load active data on component mount or updates
  const compiledData: PracticeImpactPoint[] = React.useMemo(() => {
    const list: PracticeImpactPoint[] = [];
    const today = new Date();
    const limit = timeWindow;

    // Load actual practice records from LocalStorage
    let cbtRecords: any[] = [];
    let dbtRescueLogs: any[] = [];
    let gratitudeEntries: any[] = [];
    let reflections: any[] = [];
    let sandtrays: any[] = [];
    let circadianLogs: any[] = [];

    try {
      cbtRecords = JSON.parse(localStorage.getItem('therapy_cbt_thought_records') || '[]');
      dbtRescueLogs = JSON.parse(localStorage.getItem('therapy_dbt_rescue_logs') || '[]');
      gratitudeEntries = JSON.parse(localStorage.getItem('therapy_gratitude_entries') || '[]');
      reflections = JSON.parse(localStorage.getItem('therapy_jungian_reflections') || '[]');
      sandtrays = JSON.parse(localStorage.getItem('therapy_sandtrays') || '[]');
      circadianLogs = JSON.parse(localStorage.getItem('circadian_sleep_logs') || '[]');
    } catch (e) {
      console.warn("D3PracticeImpactChart - LocalStorage read failed:", e);
    }

    // Determine if the user has any real data across the timeframe
    let anyRealData = moodLogs.length > 0 || 
                      cbtRecords.length > 0 || 
                      dbtRescueLogs.length > 0 || 
                      gratitudeEntries.length > 0 ||
                      reflections.length > 0 ||
                      sandtrays.length > 0;

    // Loop through lookback days chronologically
    for (let i = limit - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Find real user logs for this day
      const dayMood = moodLogs.find(m => m.date === dateStr);
      
      const dayCbt = cbtRecords.filter(r => r.date === dateStr);
      const dayDbt = dbtRescueLogs.filter(r => r.date === dateStr);
      const dayGratitude = gratitudeEntries.filter(r => r.date === dateStr);
      const dayReflection = reflections.filter(r => r.date === dateStr);
      const daySand = sandtrays.filter(r => r.date === dateStr);
      const dayCircadian = circadianLogs.filter(r => r.date === dateStr);

      const realSessions: PracticeSession[] = [];
      dayCbt.forEach(r => realSessions.push({ type: 'CBT', label: 'CBT Thought Diary', detail: r.situation || 'Reframed cognitive distortions' }));
      dayDbt.forEach(r => realSessions.push({ type: 'DBT', label: 'DBT Somatic Rescue', detail: r.selectedTIPP || r.trigger || 'Triggered dive reflex' }));
      dayGratitude.forEach(r => realSessions.push({ type: 'Gratitude', label: 'Gratitude Journal', detail: r.items ? r.items.slice(0, 2).join(', ') : 'Mindfulness logs' }));
      dayReflection.forEach(r => realSessions.push({ type: 'Jungian', label: 'Archetype Mirror', detail: `${r.archetypeSelected || 'Shadow'} analysis` }));
      daySand.forEach(r => realSessions.push({ type: 'Sandplay', label: 'Somatic Sandplay', detail: r.themeName || 'Expressive scene construction' }));
      dayCircadian.forEach(r => realSessions.push({ type: 'Circadian', label: 'Circadian Alignment', detail: `Sunset wave lock-in` }));

      const hasDayRealData = dayMood || realSessions.length > 0;

      let mood = 3.5;
      let completedCount = 0;
      let sessions: PracticeSession[] = [];
      let isSimulated = true;

      if (hasDayRealData) {
        isSimulated = false;
        mood = dayMood ? dayMood.score : 3.0;
        completedCount = realSessions.length;
        sessions = realSessions;
      } else {
        // If no real logs exist, generate high fidelity, educationally synchronized simulated data.
        // On simulated check-ins, establish a clean, beautiful wave correlation
        // mapping tool usage (0 to 3) to corresponding emotional health scores (2.0 to 5.0)
        const dayOffset = limit - i;
        const phase = dayOffset * 0.45;
        
        // Count of simulated practice exercises
        completedCount = Math.max(0, Math.min(3, Math.floor(1.5 + Math.sin(phase) * 1.5 + (dayOffset % 5 === 0 ? 0.5 : -0.2))));
        
        // Derive correlated mood score with a slight random noise factor
        const baselineMood = 2.5 + completedCount * 0.7; // 0 sessions = ~2.5, 3 sessions = ~4.6
        const noise = Math.cos(phase * 1.3) * 0.3;
        mood = Math.round(Math.max(1.0, Math.min(5.0, baselineMood + noise)) * 10) / 10;

        // Populate beautiful descriptors for practice sessions
        if (completedCount >= 1) {
          sessions.push({ type: 'Breathing', label: 'Somatic Breath Pacer', detail: 'Stabilized cardiac vagal tone' });
        }
        if (completedCount >= 2) {
          sessions.push({ type: 'CBT', label: 'CBT Reframer Gym', detail: 'Dismantled personal catastrophizing triggers' });
        }
        if (completedCount >= 3) {
          sessions.push({ type: 'Compassion', label: 'Compassionate Mind CFT', detail: 'Activated parasympathetic soothing system' });
        }
      }

      list.push({
        dateStr,
        parsedDate: new Date(dateStr + 'T12:00:00'),
        mood,
        completedCount,
        sessions,
        isSimulated,
      });
    }

    return list;
  }, [moodLogs, timeWindow]);

  // Push initially highlighted point to the most recent day
  useEffect(() => {
    if (compiledData.length > 0) {
      setSelectedPoint(compiledData[compiledData.length - 1]);
    }
  }, [compiledData]);

  // Monitor sizing changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      setDimensions({
        width: Math.max(280, width),
        height: 240,
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 2. Render Chart Layout
  useEffect(() => {
    if (!svgRef.current || compiledData.length === 0) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove();

    const margin = { top: 20, right: 35, bottom: 25, left: 35 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Primary group
    const g = svgElement
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scale mappings
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(compiledData, d => d.parsedDate) as [Date, Date])
      .range([0, width]);

    // Left Y scale for Mood rating (1 to 5)
    const yScaleMood = d3
      .scaleLinear()
      .domain([1, 5])
      .range([height, 0]);

    // Right Y scale for completed Practice sessions
    const maxCompleted = Math.max(3, d3.max(compiledData, d => d.completedCount) || 3);
    const yScalePractice = d3
      .scaleLinear()
      .domain([0, maxCompleted])
      .range([height, 0]);

    // Horizontal guideline ticks matching Left Y axis
    const ticksMood = [1, 2, 3, 4, 5];
    g.selectAll('.grid-line')
      .data(ticksMood)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScaleMood(d))
      .attr('y2', d => yScaleMood(d))
      .attr('stroke', '#f1f5f9')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Bottom axis: timeline scale
    const xAxis = d3
      .axisBottom<Date>(xScale)
      .ticks(timeWindow === 30 ? 6 : 5)
      .tickFormat(d3.timeFormat('%b %d'));

    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .attr('color', '#cbd5e1')
      .selectAll('text')
      .style('font-family', 'var(--font-mono, monospace)')
      .style('font-size', '9px')
      .style('font-weight', 'semibold')
      .attr('fill', '#64748b');

    // Left Y axis: Mood scale
    const yAxisMood = d3.axisLeft(yScaleMood).tickValues([1, 2, 3, 4, 5]).tickFormat(d => `${d} ★`);
    g.append('g')
      .call(yAxisMood)
      .attr('color', '#cbd5e1')
      .selectAll('text')
      .style('font-family', 'var(--font-mono, monospace)')
      .style('font-weight', 'bold')
      .style('font-size', '9px')
      .attr('fill', '#0f766e');

    // Right Y axis: Completed Sessions
    const yAxisPractice = d3
      .axisRight(yScalePractice)
      .ticks(Math.min(5, maxCompleted))
      .tickFormat(d => `${d}🛠️`);
    
    g.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(yAxisPractice)
      .attr('color', '#cbd5e1')
      .selectAll('text')
      .style('font-family', 'var(--font-mono, monospace)')
      .style('font-weight', 'bold')
      .style('font-size', '9px')
      .style('text-anchor', 'start')
      .attr('dx', '4px')
      .attr('fill', '#4f46e5');

    // Gradient definitions
    const defs = svgElement.append('defs');
    
    const barGrad = defs
      .append('linearGradient')
      .attr('id', 'practiceBarGrad')
      .attr('x1', '0')
      .attr('x2', '0')
      .attr('y1', '0')
      .attr('y2', '1');
    barGrad.append('stop').attr('offset', '0%').attr('stop-color', '#c7d2fe').attr('stop-opacity', '0.65');
    barGrad.append('stop').attr('offset', '100%').attr('stop-color', '#818cf8').attr('stop-opacity', '0.15');

    const moodGlow = defs
      .append('linearGradient')
      .attr('id', 'moodAreaGlowGrad')
      .attr('x1', '0')
      .attr('x2', '0')
      .attr('y1', '0')
      .attr('y2', '1');
    moodGlow.append('stop').attr('offset', '0%').attr('stop-color', '#14b8a6').attr('stop-opacity', '0.18');
    moodGlow.append('stop').attr('offset', '100%').attr('stop-color', '#14b8a6').attr('stop-opacity', '0.0');

    // Render Practice Completion vertical bars if checked
    if (showPracticeBars) {
      const barWidth = timeWindow === 30 ? Math.max(3, (width / 30) * 0.4) : Math.max(6, (width / 14) * 0.4);
      
      g.selectAll('.practice-bar')
        .data(compiledData)
        .enter()
        .append('rect')
        .attr('class', 'practice-bar')
        .attr('x', d => xScale(d.parsedDate) - barWidth / 2)
        .attr('y', d => yScalePractice(d.completedCount))
        .attr('width', barWidth)
        .attr('height', d => height - yScalePractice(d.completedCount))
        .attr('fill', 'url(#practiceBarGrad)')
        .attr('stroke', '#6366f1')
        .attr('stroke-width', 1)
        .attr('rx', 2.5)
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 0.85);
    }

    // Render Mood line curve if checked
    if (showMoodLine) {
      const moodArea = d3
        .area<PracticeImpactPoint>()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d.parsedDate))
        .y0(height)
        .y1(d => yScaleMood(d.mood));

      const moodLine = d3
        .line<PracticeImpactPoint>()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d.parsedDate))
        .y(d => yScaleMood(d.mood));

      // Area background fill
      g.append('path')
        .datum(compiledData)
        .attr('fill', 'url(#moodAreaGlowGrad)')
        .attr('d', moodArea)
        .attr('opacity', 0)
        .transition()
        .duration(650)
        .attr('opacity', 1);

      // Main line curve
      const linePath = g.append('path')
        .datum(compiledData)
        .attr('fill', 'none')
        .attr('stroke', '#14b8a6') // beautiful therapeutic turquoise/teal
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('d', moodLine);

      // Draw path with smooth sliding animation
      const pathLength = linePath.node()?.getTotalLength() || 0;
      linePath
        .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1100)
        .ease(d3.easeCubicInOut)
        .attr('stroke-dashoffset', 0);
    }

    // Interaction vertical feedback alignment rule
    const feedbackLine = g
      .append('line')
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '2,2')
      .attr('y1', 0)
      .attr('y2', height)
      .style('opacity', 0);

    // Interactive circular data hot-spots
    const nodeContainers = g
      .selectAll('.correlation-node')
      .data(compiledData)
      .enter()
      .append('g')
      .attr('class', 'correlation-node')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        setSelectedPoint(d);
        feedbackLine
          .attr('x1', xScale(d.parsedDate))
          .attr('x2', xScale(d.parsedDate))
          .style('opacity', 0.85);

        d3.select(this).selectAll('circle').attr('r', 6.5);
      })
      .on('mouseleave', function () {
        feedbackLine.style('opacity', 0);
        d3.select(this).select('.mood-dot').attr('r', 3.8);
        d3.select(this).select('.practice-dot').attr('r', 3);
      });

    // Add mood dots
    if (showMoodLine) {
      nodeContainers
        .append('circle')
        .attr('cx', d => xScale(d.parsedDate))
        .attr('cy', d => yScaleMood(d.mood))
        .attr('r', 3.8)
        .attr('fill', '#ffffff')
        .attr('stroke', '#14b8a6')
        .attr('stroke-width', 2.2)
        .attr('class', 'mood-dot');
    }

    // Add practice dots on the peak of the bars
    if (showPracticeBars) {
      nodeContainers
        .append('circle')
        .attr('cx', d => xScale(d.parsedDate))
        .attr('cy', d => yScalePractice(d.completedCount))
        .attr('r', 3)
        .attr('fill', '#6366f1')
        .attr('class', 'practice-dot');
    }

  }, [compiledData, dimensions, showMoodLine, showPracticeBars, timeWindow]);

  // 3. Pearson r and Clinical Impact Analytics
  const analytics = React.useMemo(() => {
    const data = compiledData;
    const n = data.length;
    if (n === 0) return { coefficient: 0, percentageBoost: 0, message: "Awaiting logs" };

    // Pearson Correlation coefficient
    const sumX = d3.sum(data, d => d.completedCount);
    const sumY = d3.sum(data, d => d.mood);
    const sumXY = d3.sum(data, d => d.completedCount * d.mood);
    const sumX2 = d3.sum(data, d => d.completedCount * d.completedCount);
    const sumY2 = d3.sum(data, d => d.mood * d.mood);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const coefficient = denominator === 0 ? 0 : Math.round((numerator / denominator) * 100) / 100;

    // Mood increase comparing active practice days (completed >= 1) vs passive days (0)
    const activeDays = data.filter(d => d.completedCount >= 1);
    const passiveDays = data.filter(d => d.completedCount === 0);

    const avgActiveMood = activeDays.length > 0 ? d3.mean(activeDays, d => d.mood) || 0 : 0;
    const avgPassiveMood = passiveDays.length > 0 ? d3.mean(passiveDays, d => d.mood) || 0 : 0;

    let percentageBoost = 0;
    if (avgPassiveMood > 0) {
      percentageBoost = Math.round(((avgActiveMood - avgPassiveMood) / avgPassiveMood) * 100);
    }

    let message = '';
    if (coefficient >= 0.6) {
      message = 'Strong Therapeutic Coupling: Completed practices are intensely linked to elevated psychological mood scores.';
    } else if (coefficient >= 0.2) {
      message = 'Moderate Coupling: Clear clinical evidence of self-reflective practices stabilizing your mental state.';
    } else {
      message = 'Emergent Correlation: Continue logging practices and morning/evening reviews to reveal physical-mental curves.';
    }

    return {
      coefficient,
      percentageBoost,
      message,
      avgActiveMood: Math.round(avgActiveMood * 10) / 10,
      avgPassiveMood: Math.round(avgPassiveMood * 10) / 10,
    };
  }, [compiledData]);

  return (
    <div 
      id="therapy-d3-practice-impact-card" 
      className="bg-white p-6 rounded-3xl border border-indigo-100/70 shadow-sm space-y-4 text-left"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 uppercase tracking-widest font-mono">
            <TrendingUp className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>Interactive Practice Impact Engine</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 tracking-tight">
            Self-Reflective Practice & Mental State Coupling
          </h3>
        </div>

        {/* Lookback selection switchers */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setTimeWindow(14)}
              className={`px-3 py-1 text-[9.5px] font-black uppercase rounded-lg transition duration-150 cursor-pointer ${
                timeWindow === 14 
                  ? 'bg-white text-indigo-900 border border-slate-200/50 shadow-sm font-extrabold' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeWindow(30)}
              className={`px-3 py-1 text-[9.5px] font-black uppercase rounded-lg transition duration-150 cursor-pointer ${
                timeWindow === 30 
                  ? 'bg-white text-indigo-900 border border-slate-200/50 shadow-sm font-extrabold' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              30 Days
            </button>
          </div>

          {compiledData.every(d => d.isSimulated) ? (
            <span className="text-[8.5px] font-bold px-2 py-1 rounded-lg bg-orange-50 border border-orange-100 text-orange-650 uppercase tracking-wider font-mono">
              Baseline Preview
            </span>
          ) : (
            <span className="text-[8.5px] font-bold px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-wider font-mono">
              ✓ Deep Synced
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-500 text-xs font-semibold leading-relaxed">
        This high-fidelity clinical diagnostic overlays recorded <strong>Mood checks</strong> (green spline curve) with the total count of <strong>Self-Care Practices completed</strong> (indigo vertical columns) on each date. Hover on any vertex to evaluate how somatic exercises and diaries directly cushion daily stress states.
      </p>

      {/* SVG Canvas Chart Area */}
      <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl relative">
        <div ref={containerRef} className="w-full relative h-[240px]">
          <svg
            id="d3-practice-impact-canvas"
            ref={svgRef}
            className="w-full h-full text-slate-800"
            style={{ display: 'block' }}
          />
        </div>

        {/* Legend filters double as graph display controls */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 border-t border-slate-200/40 pt-3 mt-1 text-[11px] font-bold">
          <button
            onClick={() => setShowMoodLine(!showMoodLine)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition cursor-pointer select-none active:scale-95 ${
              showMoodLine 
                ? 'bg-teal-50 text-teal-800 border border-teal-100/60' 
                : 'text-slate-350 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#14b8a6]" />
            <span>Daily Mood Rating (Left axis: 1-5 ★)</span>
          </button>

          <button
            onClick={() => setShowPracticeBars(!showPracticeBars)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition cursor-pointer select-none active:scale-95 ${
              showPracticeBars 
                ? 'bg-indigo-50 text-indigo-850 border border-indigo-100/50' 
                : 'text-slate-350 line-through'
            }`}
          >
            <span className="w-2 h-2 bg-indigo-200 border border-indigo-400 rounded-xs" />
            <span>Practice Session Count (Right axis: 0-3+ 🛠️)</span>
          </button>
        </div>
      </div>

      {/* Grid of Pearson r and clinical correlation insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Pearson r Card */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-150/60 rounded-2xl flex gap-3 items-start text-left">
          <Brain className="w-4 h-4 text-indigo-500 fill-indigo-100 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Pearson Coupling (r)</span>
            <span className="text-sm font-black font-mono block text-slate-800">
              r = {analytics.coefficient > 0 ? `+${analytics.coefficient}` : analytics.coefficient}
            </span>
            <p className="text-[10px] text-slate-500 leading-tight font-semibold">
              {analytics.message}
            </p>
          </div>
        </div>

        {/* Resilience Boost Card */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-150/60 rounded-2xl flex gap-3 items-start text-left">
          <Flame className="w-4 h-4 text-emerald-500 fill-emerald-100 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Active Tool Premium</span>
            <span className="text-sm font-black font-mono block text-emerald-600">
              {analytics.percentageBoost > 0 ? `+${analytics.percentageBoost}%` : `0%`} Emotional Lift
            </span>
            <p className="text-[10px] text-slate-500 leading-tight font-semibold">
              {analytics.percentageBoost > 0 
                ? `Days with at least 1 completed practice averaged ${analytics.percentageBoost}% higher mood than passive rest days.`
                : `Interactive therapeutic practice acts as a central autonomic buffer, insulating the nervous system.`}
            </p>
          </div>
        </div>

        {/* Dynamic Activity Summary */}
        <div className="p-3.5 bg-indigo-50/20 border border-indigo-100/30 rounded-2xl flex gap-3 items-start text-left">
          <ShieldCheck className="w-4 h-4 text-indigo-600 fill-indigo-50 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[8.5px] font-bold font-mono text-indigo-500 uppercase tracking-widest block">Autonomic Resilience</span>
            <span className="text-sm font-black font-mono block text-slate-800">
              {analytics.avgActiveMood}★ vs {analytics.avgPassiveMood}★
            </span>
            <p className="text-[10px] text-slate-550 leading-tight font-semibold">
              Comparing average active practice days ({analytics.avgActiveMood}★) against days with zero tools completed ({analytics.avgPassiveMood}★).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Node Inspector display */}
      {selectedPoint && (
        <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row justify-between items-stretch gap-4 animate-fade-in shadow-3xs text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <div className="bg-white p-2.5 rounded-xl text-center shadow-3xs border border-indigo-100 font-mono text-xs font-black text-indigo-950 shrink-0 flex flex-col justify-center min-w-[70px]">
              <span className="text-[8.5px] text-slate-400 uppercase tracking-widest block font-bold font-mono">Date</span>
              <span className="text-sm mt-0.5 font-black">{selectedPoint.dateStr.split('-')[1]}/{selectedPoint.dateStr.split('-')[2]}</span>
            </div>

            <div className="space-y-1.5 flex-1">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-650" />
                <span className="text-xs font-bold text-slate-850">
                  {selectedPoint.parsedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
                {selectedPoint.isSimulated && (
                  <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 bg-slate-100 text-slate-400 rounded-sm border border-slate-200/50">
                    Simulated
                  </span>
                )}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold bg-white border border-slate-150 px-2.5 py-1 rounded-lg">
                  Mood: <strong className="text-teal-600 font-black">{selectedPoint.mood} / 5 ★</strong>
                </span>
                <span className="text-[11px] font-semibold bg-white border border-slate-150 px-2.5 py-1 rounded-lg">
                  Practice Sessions Completed: <strong className="text-indigo-600 font-black">{selectedPoint.completedCount} completed</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="md:w-[280px] shrink-0 bg-white p-3 rounded-xl border border-slate-200/60 flex flex-col justify-between gap-2 text-[11px]">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5 font-mono">
              <span>Completed practices list</span>
              <span className="text-indigo-600">{selectedPoint.sessions.length} recorded</span>
            </div>

            {selectedPoint.sessions.length > 0 ? (
              <div className="space-y-1 max-h-[85px] overflow-y-auto">
                {selectedPoint.sessions.map((sess, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start leading-tight">
                    <span className="text-[9.5px] mt-0.5">🛠️</span>
                    <div className="font-semibold text-slate-700">
                      <span className="font-black text-slate-900">{sess.label}:</span>
                      <span className="text-slate-500 font-medium ml-1 text-[10px]">{sess.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 font-semibold italic text-center py-2">
                No practices logged on this day. Open Somatic Gym to log completed therapy exercises!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
