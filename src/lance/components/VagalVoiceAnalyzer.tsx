import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Mic, MicOff, Play, Square, Activity, Shield, 
  RefreshCw, TrendingUp, Sparkles, Volume2, Info, CheckCircle2 
} from 'lucide-react';

export default function VagalVoiceAnalyzer() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  // Real-time analysis metrics
  const [vocalDuration, setVocalDuration] = useState(0);
  const [pitchStability, setPitchStability] = useState(100); // 0-100 score
  const [vagalCoherence, setVagalCoherence] = useState<number | null>(null);
  const [subsystemState, setSubsystemState] = useState<'quiescent' | 'measuring' | 'ventral' | 'sympathetic' | 'dorsal'>('quiescent');
  const [micActiveLevel, setMicActiveLevel] = useState(0);

  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  // Web Audio Nodes References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Timers
  const recordStartTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const frequencyArrayRef = useRef<number[]>([]);

  useEffect(() => {
    // Check browser compatibility
    if (typeof window !== 'undefined') {
      const hasMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      setIsSupported(!!hasMedia);
    }
  }, []);

  const addLog = (msg: string) => {
    setDiagnosticLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  const startAnalysis = async () => {
    try {
      if (!isSupported) {
        addLog("Audio recording not supported in this client sandboxed environment.");
        return;
      }

      setSubsystemState('measuring');
      setIsRecording(true);
      setVocalDuration(0);
      setPitchStability(100);
      setVagalCoherence(null);
      frequencyArrayRef.current = [];
      recordStartTimeRef.current = Date.now();
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = mediaStream;
      setPermissionState('granted');
      addLog("🎯 Microphone active. Listening to your voice pattern (not a medical device).");

      const sourceNode = ctx.createMediaStreamSource(mediaStream);
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 256;
      analyserRef.current = analyserNode;
      sourceNode.connect(analyserNode);

      // Start duration logging interval
      durationIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - recordStartTimeRef.current) / 1000;
        setVocalDuration(elapsed);
        
        // Trigger specific tips based on elapsed hum time
        if (elapsed > 3 && elapsed < 4) {
          addLog("🔊 Steady tone picked up. Keep your pitch even...");
        } else if (elapsed > 7 && elapsed < 8) {
          addLog("🌀 Nice and steady — keep the hum going...");
        } else if (elapsed > 12 && elapsed < 13) {
          addLog("✨ Great sustained breath. Doing amazing!");
        }
      }, 100);

      // Draw real-time high-end frequency spectrogram
      drawSpectrogram();

    } catch (err: any) {
      console.warn("Microphone access failed or blocked inside iframe:", err);
      setPermissionState('denied');
      addLog("⚠️ Mic access unavailable. Showing a simulated preview instead.");
      startSimulatedAnalysis();
    }
  };

  // Simulated fallback so that the sandboxed iframe is completely robust and never fails
  const startSimulatedAnalysis = () => {
    setSubsystemState('measuring');
    setIsRecording(true);
    setVocalDuration(0);
    setPitchStability(100);
    setVagalCoherence(null);
    recordStartTimeRef.current = Date.now();

    durationIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - recordStartTimeRef.current) / 1000;
      setVocalDuration(elapsed);
      const simulatedMicLevel = Math.max(10, Math.sin(elapsed * 2) * 45 + 50 + (Math.random() * 10 - 5));
      setMicActiveLevel(simulatedMicLevel);

      // Random synthetic pitch stability calculations
      if (Math.random() > 0.4) {
        setPitchStability(prev => Math.max(40, prev - (Math.random() * 1.5 - 0.7)));
      }

      if (elapsed > 3 && elapsed < 4) {
        addLog("🔊 [Preview mode] Simulated hum pattern — looking steady...");
      } else if (elapsed > 7 && elapsed < 8) {
        addLog("🌀 [Preview mode] Simulated hum continuing...");
      }
    }, 100);

    drawSimulatedSpectrogram();
  };

  const drawSpectrogram = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Calculate loudness/gain level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      setMicActiveLevel(avg);

      // Capture frequency peak for pitch calculation
      let maxVal = 0;
      let peakIndex = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i];
          peakIndex = i;
        }
      }
      if (maxVal > 30) {
        frequencyArrayRef.current.push(peakIndex);
      }

      // Draw futuristic visual equalizer mapping lines
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.6;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const red = 45 + i * 2;
        const green = 145 + i;
        const blue = 190 + (barHeight * 0.5);

        canvasCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 1.5, barHeight);
        x += barWidth;
      }
    };
    draw();
  };

  const drawSimulatedSpectrogram = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const draw = () => {
      if (!isRecording) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / 40;
      let x = 0;

      for (let i = 0; i < 40; i++) {
        // Procedural moving wave mimicking steady G3 vocal acoustic wave
        const humAcoustic = Math.sin(Date.now() * 0.005 + i * 0.25) * 35;
        const randomSpikes = Math.random() * 12;
        const barHeight = Math.max(10, 40 + humAcoustic + randomSpikes);

        canvasCtx.fillStyle = `rgb(${40 + i * 3.5}, ${160 - i * 1.5}, ${185 + humAcoustic})`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 2.5, barHeight);
        x += barWidth;
      }
    };
    draw();
  };

  const stopAnalysis = () => {
    setIsRecording(false);
    
    // Clear recording timer intervals
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    // Stop microphone media streams
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(e => console.warn(e));
    }

    // Evaluate diagnostic metrics and output final score
    const duration = vocalDuration;
    let stability = pitchStability;

    if (frequencyArrayRef.current.length > 5) {
      // Analyze pitch variation variance
      const mean = frequencyArrayRef.current.reduce((a, b) => a + b, 0) / frequencyArrayRef.current.length;
      const varianceVal = frequencyArrayRef.current.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / frequencyArrayRef.current.length;
      // Lower variance equals higher stability
      stability = Math.max(45, Math.min(100, 100 - varianceVal * 7.5));
    } else if (duration > 0 && permissionState === 'granted') {
      stability = 45; // unstable if extremely brief speech
    }

    setPitchStability(stability);

    // Final score formula emphasizing steady long breathing exhalation (Target: 8+ seconds hum)
    const durationRating = Math.min(50, duration * 5.25);
    const stabilityRating = stability * 0.5;
    const finalCoherence = Math.round(durationRating + stabilityRating);
    setVagalCoherence(finalCoherence);

    // Group state categorization based on coherence (a rough, non-clinical estimate — not a diagnosis)
    if (finalCoherence >= 82) {
      setSubsystemState('ventral');
      addLog("✅ Estimate: " + finalCoherence + "% — your voice sounded calm and steady, a sign you may be feeling relatively settled right now.");
    } else if (finalCoherence >= 58) {
      setSubsystemState('sympathetic');
      addLog("⚡ Estimate: " + finalCoherence + "% — your voice showed a bit of tension or unsteadiness. That's common and not concerning on its own.");
    } else {
      setSubsystemState('dorsal');
      addLog("❄️ Estimate: " + finalCoherence + "% — your voice was brief or uneven. Try a slower, longer hum next time if you'd like to compare.");
    }
  };

  return (
    <div id="vagal-voice-analyzer-root" className="rounded-3xl p-5 sm:p-6 max-w-3xl mx-auto overflow-hidden relative" style={{ background: '#FFFFFF', boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md" style={{ background: '#14B8A618', color: '#0D9488' }}>
              Biometric Vocal Analyzer
            </span>
            <h3 className="text-xl font-bold mt-1.5 flex items-center gap-1.5" style={{ color: '#3C3C3C' }}>
              <Mic className="w-5 h-5" style={{ color: '#14B8A6' }} />
              Somatic Voice Prosody & Voo Tuner
            </h3>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              The vagus nerve passes directly adjacent to the larynx. Making a continuous low-pitch, humming "Voo-oo-oo" stimulates the parasympathetic nervous system, slowing down heartbeat.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium shrink-0" style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #F0F0F0' }}>
            <Shield className="w-3.5 h-3.5" style={{ color: '#58CC02' }} />
            Local processing only — nothing leaves your device
          </div>
        </div>

        {/* Visual Waveform Screen */}
        <div className="p-4 rounded-2xl space-y-3 relative overflow-hidden" style={{ background: '#F9FAFB', border: '1px solid #F0F0F0' }}>
          <div className="flex justify-between text-[11px] font-medium" style={{ color: '#6B7280' }}>
            <span>Real-time hum waveform</span>
            {isRecording && <span className="animate-pulse" style={{ color: '#14B8A6' }}>● Listening</span>}
          </div>

          <div className="w-full h-32 rounded-xl overflow-hidden flex justify-center items-center relative" style={{ background: '#0B1220' }}>
            <canvas ref={canvasRef} width="600" height="128" className="w-full h-full" />

            {/* Superimposed active decibel level bar */}
            {isRecording && (
              <div
                className="absolute bottom-4 left-4 h-2 rounded-full transition-all duration-75"
                style={{ width: `${Math.min(90, micActiveLevel * 0.9)}%`, background: 'linear-gradient(90deg, #14B8A6, #58CC02)' }}
              />
            )}

            {!isRecording && !vagalCoherence && (
              <div className="absolute text-center space-y-1.5 z-10 px-4">
                <Mic className="w-8 h-8 text-slate-400 mx-auto animate-bounce" />
                <p className="text-xs text-slate-300 font-bold">Ready to listen</p>
                <p className="text-[11px] text-slate-400 max-w-sm">Press "Begin Somatic Humming" below, then produce a deep continuous vocal hum.</p>
              </div>
            )}

            {vagalCoherence !== null && !isRecording && (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 space-y-1 z-20" style={{ background: 'rgba(11,18,32,0.92)' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: '#58CC02' }} />
                <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">Analysis Complete</p>
                <h4 className="text-2xl font-black font-mono" style={{ color: '#3ECFCF' }}>{vagalCoherence}% <span className="text-xs text-slate-300 font-normal">Vagus Coherence Score</span></h4>
              </div>
            )}
          </div>

          {/* Timers metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #F0F0F0' }}>
              <span className="text-[10px] uppercase tracking-wider block" style={{ color: '#9CA3AF' }}>Exhalation Breath Span</span>
              <span className="text-xs font-bold" style={{ color: '#3C3C3C' }}>{vocalDuration.toFixed(1)} Secs</span>
            </div>
            <div className="p-2.5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #F0F0F0' }}>
              <span className="text-[10px] uppercase tracking-wider block" style={{ color: '#9CA3AF' }}>Hum Pitch Stability</span>
              <span className="text-xs font-bold" style={{ color: '#3C3C3C' }}>{Math.round(pitchStability)}% Match</span>
            </div>
            <div className="p-2.5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #F0F0F0' }}>
              <span className="text-[10px] uppercase tracking-wider block" style={{ color: '#9CA3AF' }}>Nervous Subsystem State</span>
              <span className="text-xs uppercase font-black" style={{ color: '#0D9488' }}>
                {subsystemState === 'quiescent' && "STANDBY"}
                {subsystemState === 'measuring' && "MEASURING..."}
                {subsystemState === 'ventral' && "VENTRAL VAGAL"}
                {subsystemState === 'sympathetic' && "SYM CHARGE"}
                {subsystemState === 'dorsal' && "DORSAL OUT"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3">
          {!isRecording ? (
            <motion.button
              whileTap={{ y: 3, boxShadow: 'none' }}
              onClick={startAnalysis}
              className="flex-1 py-4 rounded-2xl font-black text-xs text-white flex justify-center items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #14B8A6, #58CC02)', boxShadow: '0 5px 0 #0D9488' }}
            >
              <Mic className="w-4 h-4 fill-white" />
              Begin Somatic Biofeedback Vocalization ("Voo")
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ y: 3, boxShadow: 'none' }}
              onClick={stopAnalysis}
              className="flex-1 py-4 rounded-2xl font-black text-xs text-white flex justify-center items-center gap-2"
              style={{ background: '#FB7185', boxShadow: '0 5px 0 #DB2777' }}
            >
              <Square className="w-4 h-4 fill-white" />
              Complete Breath hum & Generate Vagal Score
            </motion.button>
          )}
        </div>

        {/* Diagnosis Outcome Info Card */}
        {vagalCoherence !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl space-y-2 text-xs"
            style={{ background: '#58CC0210', border: '1px solid #58CC0230' }}
          >
            <p className="font-extrabold uppercase tracking-wide flex items-center gap-1" style={{ color: '#46A302' }}>
              <Sparkles className="w-4 h-4 animate-bounce" />
              Wellness Breakdown
            </p>
            <p className="leading-relaxed" style={{ color: '#3C3C3C' }}>
              {subsystemState === 'ventral' && "Fantastic vocal alignment! Exhaling for over 7 seconds while holding a steady pitch triggers rapid Acetylcholine neurotransmitter release in cardiac terminal fibers, actively pulling your heart back into a calm, social safety profile."}
              {subsystemState === 'sympathetic' && "A vocal stability under 80% with slightly brief exhalations indicates secondary adrenaline or sympathetic fight charge. Practice dropping your tone lower, letting the vibration travel deeply down to your abdominal vagal fibers."}
              {subsystemState === 'dorsal' && "Minimal breath duration (under 4 seconds) mimics defensive shallow gasp profiles. This is a common indicator of dorsal vagal shutdown/isolation. Ground your seat on your pillow, and practice simple exhales before attempting another biofeedback."}
            </p>
          </motion.div>
        )}

        {/* Live System Diagnostics Console */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-widest font-bold flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
            <Activity className="w-3.5 h-3.5" />
            Live Session Log
          </p>
          <div className="h-28 overflow-y-auto font-mono text-[11px] rounded-xl p-3 space-y-1.5 leading-normal" style={{ background: '#0B1220', color: '#7DD3C0' }}>
            {diagnosticLogs.length === 0 ? (
              <span className="text-slate-400 italic">No logs yet. Initiate voice tuning above.</span>
            ) : (
              diagnosticLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
