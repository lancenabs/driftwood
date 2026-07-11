import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Wind, Brain, Sliders, RefreshCw, Sparkles, AlertCircle, Heart, Check, Info, InfoIcon 
} from 'lucide-react';

export default function AutonomicRegulationWidget() {
  // --- REAL-TIME BIOMETRIC READS FROM LOCALSTORAGE ---
  const [breathMinutes, setBreathMinutes] = useState<number>(0);
  const [stackStability, setStackStability] = useState<number>(100);
  const [pulse, setPulse] = useState<number>(72);
  const [breaths, setBreaths] = useState<number>(14);
  const [muscleTension, setMuscleTension] = useState<number>(4);
  const [gazeEngagement, setGazeEngagement] = useState<number>(8);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Read telemetry values from localStorage
  const loadTelemetry = () => {
    const minStr = localStorage.getItem('therapy_somatic_breath_pacer_minutes') || '0';
    const stabStr = localStorage.getItem('therapy_neuro_stacker_stability') || '100';
    const pulseStr = localStorage.getItem('therapy_polyvagal_pulse') || '72';
    const breathStr = localStorage.getItem('therapy_polyvagal_breaths') || '14';
    const tensionStr = localStorage.getItem('therapy_polyvagal_muscle_tension') || '4';
    const gazeStr = localStorage.getItem('therapy_polyvagal_gaze_engagement') || '8';

    setBreathMinutes(parseInt(minStr, 10));
    setStackStability(parseInt(stabStr, 10));
    setPulse(parseInt(pulseStr, 10));
    setBreaths(parseInt(breathStr, 10));
    setMuscleTension(parseInt(tensionStr, 10));
    setGazeEngagement(parseInt(gazeStr, 10));
  };

  useEffect(() => {
    loadTelemetry();
    // Set up a fast-polling interval to keep real-time coherence responsive since user can switch tabs
    const interval = setInterval(loadTelemetry, 1500);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  // --- COMPUTE REAL-TIME LIVE AUTONOMIC COHERENCE SCORE ---
  const scores = useMemo(() => {
    // 1. Resonant breathing practice minutes (max 30 points)
    // 6 minutes of practice equals maximum credit
    const breathScore = Math.min(30, Math.round((breathMinutes / 6) * 30));

    // 2. Kinaesthetic balance - Stacker stability (max 35 points)
    const kineticScore = Math.round((stackStability / 100) * 35);

    // 3. Polyvagal homeostasis factor (max 35 points)
    // Perfect state is: pulse around 68-74, breaths 10-14, low muscle tension, high gaze engagement
    let polyvagalScore = 35;
    if (pulse > 80) polyvagalScore -= Math.min(12, (pulse - 80) * 0.4);
    if (pulse < 60) polyvagalScore -= Math.min(8, (60 - pulse) * 0.5);
    if (breaths > 15) polyvagalScore -= Math.min(8, (breaths - 15) * 0.8);
    if (muscleTension > 4) polyvagalScore -= Math.min(10, (muscleTension - 4) * 1.5);
    if (gazeEngagement < 7) polyvagalScore -= Math.min(8, (7 - gazeEngagement) * 1.5);
    const resolvedPolyvagal = Math.max(5, Math.round(polyvagalScore));

    const total = breathScore + kineticScore + resolvedPolyvagal;

    // Determine verbal coherence state label
    // Colors are hex values from the app's bright accent palette (not Tailwind
    // classes) so the status chip stays readable on the light card background.
    let statusText = "Autonomic Balance Stable";
    let statusColor = "#46A302";
    let statusBg = "#58CC0216";

    if (total >= 80) {
      statusText = "Sympathetic Quietude (High Coherence)";
      statusColor = "#0D9488";
      statusBg = "#14B8A616";
    } else if (total >= 55) {
      statusText = "Autonomic Mobilization (Moderate Equilibrium)";
      statusColor = "#CC7A00";
      statusBg = "#FF960016";
    } else {
      statusText = "Nervous System Desynchrony";
      statusColor = "#DB2777";
      statusBg = "#EC489916";
    }

    return {
      breathScore,
      kineticScore,
      polyvagalScore: resolvedPolyvagal,
      total,
      statusText,
      statusColor,
      statusBg
    };
  }, [breathMinutes, stackStability, pulse, breaths, muscleTension, gazeEngagement]);

  // --- GENERATE DETAILED 24-HOUR AUTONOMIC TIMELINE PATHS ---
  // To keep dates consistent yet reactive, we generate hourly data points
  // combining deterministic diurnal biological rhythms with active live sensor values
  const hourlyData = useMemo(() => {
    const data: { hourLabel: string; value: number }[] = [];
    const currentHour = new Date().getHours();

    for (let i = 23; i >= 0; i--) {
      const targetHourStr = `${(currentHour - i + 24) % 24}:00`;
      
      // Biological circadian rhythm simulation
      // Peak energy/vagal tone fluctuates around lunch and dip at 4 AM / afternoon slump
      const baseRhythmRad = (((currentHour - i) * Math.PI) / 12);
      const circadianFactor = Math.sin(baseRhythmRad) * 12 + Math.cos(baseRhythmRad * 2) * 5;
      
      // Calculate a base score (typically centering around 75)
      let calculatedScore = Math.round(72 + circadianFactor);

      // At the final point (current hour), we merge 85% of actual real-time calculated score
      // leading to active interactive feedback if the user adjusts anything!
      if (i === 0) {
        calculatedScore = scores.total;
      } else {
        // Blends surrounding hours with actual stats so they slide in smoothly
        const influence = Math.max(0, (4 - i) / 4); // decreases as we go past
        calculatedScore = Math.round(calculatedScore * (1 - influence) + scores.total * influence);
      }

      // Keep it within standard biological tolerances (30% shutdown limits to 100% full coherence)
      calculatedScore = Math.min(100, Math.max(30, calculatedScore));

      data.push({
        hourLabel: targetHourStr,
        value: calculatedScore
      });
    }
    return data;
  }, [scores.total]);

  // SVG Chart path calculators
  const svgWidth = 500;
  const svgHeight = 90;
  const maxVal = 100;
  const minVal = 0;

  const pointsString = useMemo(() => {
    return hourlyData.map((d, index) => {
      const x = (index / (hourlyData.length - 1)) * svgWidth;
      // Invert Y direction since 0 is top
      const y = svgHeight - ((d.value - minVal) / (maxVal - minVal)) * svgHeight;
      return `${x},${y}`;
    }).join(' ');
  }, [hourlyData]);

  // Close loops for a pretty smooth area gradient under the graph line
  const fillPointsString = useMemo(() => {
    if (hourlyData.length === 0) return '';
    const points = hourlyData.map((d, index) => {
      const x = (index / (hourlyData.length - 1)) * svgWidth;
      const y = svgHeight - ((d.value - minVal) / (maxVal - minVal)) * svgHeight;
      return `${x},${y}`;
    });
    return `0,${svgHeight} ${points.join(' ')} ${svgWidth},${svgHeight}`;
  }, [hourlyData]);

  const handleRecalibrate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div id="autonomic-regulation-core-widget" className="rounded-2xl p-4 md:p-5 relative overflow-hidden z-10 transition-all duration-300" style={{ background: '#FFFFFF', boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>

      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 mb-4" style={{ borderBottom: '1px solid #F0F0F0' }}>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest font-black uppercase" style={{ color: '#0D9488' }}>
            <Activity className="w-3.5 h-3.5 animate-pulse" style={{ color: '#14B8A6' }} />
            <span>Aggregate Vagal Coherence Deck</span>
          </div>
          <h4 className="text-sm font-black mt-0.5 tracking-tight flex items-center gap-1.5 flex-wrap" style={{ color: '#3C3C3C' }}>
            Autonomic Regulation Grid
            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold" style={{ background: scores.statusBg, color: scores.statusColor }}>
              {scores.statusText}
            </span>
          </h4>
        </div>

        <button
          type="button"
          onClick={handleRecalibrate}
          className="text-[11px] font-bold rounded-lg px-3 py-2 flex items-center gap-1 transition min-h-[36px]"
          style={{ background: '#F9FAFB', border: '1px solid #F0F0F0', color: '#6B7280' }}
        >
          <RefreshCw className="w-3 h-3" />
          <span>Polled Live</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* LEFT COLUMN: CRITICAL TELEMETRY STREAMS */}
        <div className="md:col-span-4 space-y-3">
          <div className="text-[10px] font-black tracking-widest uppercase block" style={{ color: '#9CA3AF' }}>
            Active Somatic Sensors
          </div>

          <div className="space-y-2">
            {/* Stream 1: Breath-Pacer */}
            <div className="p-2.5 rounded-xl flex items-center justify-between" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#14B8A618', color: '#0D9488' }}>
                  <Wind className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold block" style={{ color: '#3C3C3C' }}>Acoustic Breath Pace</span>
                  <span className="text-[10px] block leading-tight" style={{ color: '#9CA3AF' }}>Vagal breathing mins today</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black block" style={{ color: '#0D9488' }}>{breathMinutes} min</span>
                <span className="text-[10px] block" style={{ color: '#9CA3AF' }}>+{scores.breathScore} pts</span>
              </div>
            </div>

            {/* Stream 2: Neuro-Stacker */}
            <div className="p-2.5 rounded-xl flex items-center justify-between" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#6366F118', color: '#4338CA' }}>
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold block" style={{ color: '#3C3C3C' }}>Neuro-Stacker Equilibrium</span>
                  <span className="text-[10px] block leading-tight" style={{ color: '#9CA3AF' }}>Spatial center of mass stability</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black block" style={{ color: '#4338CA' }}>{stackStability}%</span>
                <span className="text-[10px] block" style={{ color: '#9CA3AF' }}>+{scores.kineticScore} pts</span>
              </div>
            </div>

            {/* Stream 3: Polyvagal State Harmonizer */}
            <div className="p-2.5 rounded-xl flex items-center justify-between" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#EC489918', color: '#DB2777' }}>
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold block" style={{ color: '#3C3C3C' }}>Somatic Homeostasis</span>
                  <span className="text-[10px] block leading-tight" style={{ color: '#9CA3AF' }}>Active biomarker score rating</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black block" style={{ color: '#DB2777' }}>{scores.polyvagalScore}/35</span>
                <span className="text-[10px] block" style={{ color: '#9CA3AF' }}>Pulse {pulse} bpm</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 24-HOUR VISUAL SUMMARY CHART */}
        <div className="md:col-span-8 flex flex-col justify-end">
          <div className="flex justify-between items-center px-1 mb-1.5">
            <span className="text-[10px] font-black tracking-widest uppercase block" style={{ color: '#9CA3AF' }}>
              24-Hour Timeline Coherence
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: '#14B8A6' }} />
              <span className="text-[11px] font-black tracking-tight" style={{ color: '#0D9488' }}>
                Live: {scores.total}%
              </span>
            </div>
          </div>

          <div className="rounded-xl p-2 md:p-3 relative" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>

            {/* SVG Visual Area Chart */}
            <div className="w-full h-[90px] relative">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="widgetChartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.30" />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="widgetLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="3,3" />

                {/* Filled Area */}
                <polygon points={fillPointsString} fill="url(#widgetChartFill)" />

                {/* Glowing Line */}
                <polyline
                  fill="none"
                  stroke="url(#widgetLineGrad)"
                  strokeWidth="2.5"
                  points={pointsString}
                />

                {/* Dynamic Floating Point on Last/Active sensor marker */}
                {hourlyData.length > 0 && (() => {
                  const x = svgWidth;
                  const lastVal = hourlyData[hourlyData.length - 1].value;
                  const y = svgHeight - ((lastVal - minVal) / (maxVal - minVal)) * svgHeight;
                  return (
                    <g>
                      <circle cx={x - 4} cy={y} r="5" fill="#14b8a6" className="animate-pulse" />
                      <circle cx={x - 4} cy={y} r="2" fill="#ffffff" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between items-center text-[10px] tracking-wider font-extrabold mt-1 px-1 select-none" style={{ color: '#9CA3AF' }}>
              <span>Trailing 24h</span>
              <span className="hidden sm:inline">18h ago</span>
              <span className="hidden sm:inline">12h ago</span>
              <span>6h ago</span>
              <span className="font-bold uppercase" style={{ color: '#0D9488' }}>Now</span>
            </div>
          </div>

          <div className="text-[11px] mt-2 pl-0.5 leading-snug flex items-start gap-1 justify-between select-none" style={{ color: '#9CA3AF' }}>
            <span className="flex items-center gap-1">
              <InfoIcon className="w-3 h-3 shrink-0" style={{ color: '#4338CA' }} />
              <span>Real-time calibration score recalculates as you breathe, stack, or adjust somatic sliders.</span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
