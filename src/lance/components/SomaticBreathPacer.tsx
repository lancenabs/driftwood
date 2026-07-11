import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Wind, Volume2, Info, RefreshCw, Layers, CheckCircle2, Sliders, Sparkles, Maximize2, Minimize2,
  Heart, Users, Share2, Link2, UserCheck, Trophy, Globe, Wifi, Check, Zap, Target, Plus
} from 'lucide-react';
import { db, auth, isFirebaseInitialized } from '../lib/firebase';
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { useGame } from './LANCEGame/LANCEGameContext';

interface BreathProfile {
  name: string;
  inhaleSecs: number;
  holdSecs: number;
  exhaleSecs: number;
  restSecs: number;
  purpose: string;
  color: string;
}

const BREATH_PROFILES: BreathProfile[] = [
  {
    name: 'Box Breathing (Grounding)',
    inhaleSecs: 4,
    holdSecs: 4,
    exhaleSecs: 4,
    restSecs: 4,
    purpose: 'Autonomic nervous-system centering and cognitive stress-clearing.',
    color: '#0d9488' // teal
  },
  {
    name: 'Resonant Breathing (Maximize HRV)',
    inhaleSecs: 5,
    holdSecs: 0,
    exhaleSecs: 5,
    restSecs: 0,
    purpose: 'Boosts Heart Rate Variability (HRV) and expands arterial elasticity.',
    color: '#3b82f6' // blue
  },
  {
    name: '4-7-8 Somatic Deep Sleep',
    inhaleSecs: 4,
    holdSecs: 7,
    exhaleSecs: 8,
    restSecs: 0,
    purpose: 'Powerful sedative downregulator of sympathetic fight-or-flight energy.',
    color: '#6366f1' // indigo
  },
  {
    name: 'Thermostatic Vagal-Cooling Sigh',
    inhaleSecs: 4,
    holdSecs: 2,
    exhaleSecs: 8,
    restSecs: 2,
    purpose: 'Extended double-exhale sigh protocol forcing swift vagal cooling to reclaim self-regulating baseline temperature.',
    color: '#10b981' // emerald
  }
];

export default function SomaticBreathPacer({ initialProfileIdx = 0, onCycleComplete }: { initialProfileIdx?: number; onCycleComplete?: () => void }) {
  const { userName } = useGame();
  const onCycleCompleteRef = useRef(onCycleComplete);
  useEffect(() => { onCycleCompleteRef.current = onCycleComplete; }, [onCycleComplete]);

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundPreset, setSoundPreset] = useState<'ocean' | 'forest' | 'white_noise'>('ocean');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const soundGainRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);

  // Breath pacing state
  const [activeProfileIdx, setActiveProfileIdx] = useState<number>(initialProfileIdx);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [totalMinutesPracticed, setTotalMinutesPracticed] = useState<number>(() => {
    return parseInt(localStorage.getItem('therapy_somatic_breath_pacer_minutes') || '0', 10);
  });

  // Distraction-free Immersive Mode
  const [isImmersive, setIsImmersive] = useState<boolean>(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * -12
    }));
    setParticles(generated);
  }, []);

  useEffect(() => {
    localStorage.setItem('therapy_somatic_breath_pacer_minutes', totalMinutesPracticed.toString());
  }, [totalMinutesPracticed]);
  const [practiceSuccess, setPracticeSuccess] = useState<boolean>(false);

  const activeProfile = BREATH_PROFILES[activeProfileIdx];

  // ==================== CO-REGULATION CHALLENGE STATE & HOOKS ====================
  const [sessionMode, setSessionMode] = useState<'solo' | 'coreg'>('solo');
  const [coregSubMode, setCoregSubMode] = useState<'couch' | 'online' | 'ai'>('couch');
  
  // Participant Identity
  const [localParticipantName, setLocalParticipantName] = useState<string>(() => {
    return userName || 'Friend';
  });

  // Couch Mode (Same Screen Joint Hold) Controls
  const [couchIsActive, setCouchIsActive] = useState<boolean>(false);
  const [couchTimeLeft, setCouchTimeLeft] = useState<number>(45);
  const [couchP1Phase, setCouchP1Phase] = useState<'inhale' | 'exhale' | 'hold' | 'rest'>('exhale');
  const [couchP2Phase, setCouchP2Phase] = useState<'inhale' | 'exhale' | 'hold' | 'rest'>('exhale');
  const [couchSyncScore, setCouchSyncScore] = useState<number>(80);
  const [couchScoreProgress, setCouchScoreProgress] = useState<number[]>([]);

  // AI Virtual Partner Mode Controls
  const [aiPartnerId, setAiPartnerId] = useState<string>('maya');
  const [aiPhase, setAiPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [aiSecondsLeft, setAiSecondsLeft] = useState<number>(5);
  const [aiSyncScore, setAiSyncScore] = useState<number>(75);

  // Online Cloud Real-Time Mode Controls
  const [onlineRoomId, setOnlineRoomId] = useState<string>('');
  const [inputRoomId, setInputRoomId] = useState<string>('');
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [partnerJoined, setPartnerJoined] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerPhase, setPartnerPhase] = useState<string>('inhale');
  const [partnerProgress, setPartnerProgress] = useState<number>(0);
  const [onlineSyncScore, setOnlineSyncScore] = useState<number>(85);
  const [onlineIsActive, setOnlineIsActive] = useState<boolean>(false);
  const [onlineScores, setOnlineScores] = useState<number[]>([]);
  const [onlineTimeLeft, setOnlineTimeLeft] = useState<number>(60);
  const [isConnectingOnline, setIsConnectingOnline] = useState<boolean>(false);

  // Session Logging & History
  const [coregLogs, setCoregLogs] = useState<{ id: string; date: string; partner: string; score: number; mode: string }[]>(() => {
    return JSON.parse(localStorage.getItem('therapy_coreg_challenge_logs') || '[]');
  });

  // Highlight modal/screen for Completed Challenges
  const [challengeResult, setChallengeResult] = useState<{ show: boolean; mode: string; partnerName: string; avgScore: number } | null>(null);

  // Firestore subscription reference
  const unsubRef = useRef<(() => void) | null>(null);

  // Clean subscription on unmount
  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  // Couch Mode Challenge Active Loop
  useEffect(() => {
    if (!couchIsActive) return;
    const interval = setInterval(() => {
      setCouchTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCouchIsActive(false);
          const finalAvg = couchScoreProgress.length > 0
            ? Math.round(couchScoreProgress.reduce((a, b) => a + b, 0) / couchScoreProgress.length)
            : couchSyncScore;
          
          // Log challenge
          const newLog = {
            id: 'couch-' + Date.now(),
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            partner: 'Partner (Shared Screen)',
            score: finalAvg,
            mode: 'Couch Mode'
          };
          const updated = [newLog, ...coregLogs].slice(0, 10);
          setCoregLogs(updated);
          localStorage.setItem('therapy_coreg_challenge_logs', JSON.stringify(updated));
          
          setChallengeResult({
            show: true,
            mode: 'Shared Screen Couch Mode',
            partnerName: 'Your Partner',
            avgScore: finalAvg
          });
          return 45;
        }
        return prev - 1;
      });

      // Compute mutual sync
      setCouchSyncScore(prev => {
        let delta = 0;
        if (couchP1Phase === couchP2Phase) {
          delta = 3.5;
        } else {
          delta = -4.5;
        }
        const next = Math.max(15, Math.min(100, Math.round(prev + delta)));
        setCouchScoreProgress(s => [...s, next]);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [couchIsActive, couchP1Phase, couchP2Phase, couchScoreProgress, coregLogs]);

  const startCouchChallenge = () => {
    setCouchTimeLeft(45);
    setCouchSyncScore(80);
    setCouchScoreProgress([]);
    setCouchP1Phase('exhale');
    setCouchP2Phase('exhale');
    setCouchIsActive(true);
  };

  // AI Partner Active Session Loop
  useEffect(() => {
    if (sessionMode !== 'coreg' || coregSubMode !== 'ai' || !isPlaying) return;
    
    const timer = setInterval(() => {
      setAiSecondsLeft(prev => {
        if (prev <= 1) {
          let nextPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'inhale';
          let duration = 5;
          if (aiPartnerId === 'maya') {
            nextPhase = aiPhase === 'inhale' ? 'exhale' : 'inhale';
            duration = 5;
          } else { // Zack Box
            if (aiPhase === 'inhale') { nextPhase = 'hold'; duration = 4; }
            else if (aiPhase === 'hold') { nextPhase = 'exhale'; duration = 4; }
            else if (aiPhase === 'exhale') { nextPhase = 'rest'; duration = 4; }
            else { nextPhase = 'inhale'; duration = 4; }
          }
          setAiPhase(nextPhase);
          return duration;
        }
        return prev - 1;
      });

      // Update AI coherence score with current user phase
      setAiSyncScore(prev => {
        let diff = 0;
        if (currentPhase === aiPhase) {
          diff = 2.5;
        } else {
          diff = -3;
        }
        return Math.max(15, Math.min(100, prev + diff));
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, sessionMode, coregSubMode, aiPhase, aiPartnerId, currentPhase]);

  // Create Online Sync Room
  const createOnlineRoom = async () => {
    setIsConnectingOnline(true);
    const code = 'CORE-' + Math.floor(100 + Math.random() * 900);
    setOnlineRoomId(code);
    setIsCreator(true);
    setPartnerJoined(false);
    setPartnerName('');
    setOnlineSyncScore(85);
    setOnlineTimeLeft(60);
    setOnlineScores([]);

    try {
      if (isFirebaseInitialized) {
        const docRef = doc(db, 'co_regulation_sessions', code);
        await setDoc(docRef, {
          roomId: code,
          hostId: auth.currentUser?.uid || 'auth-anon-' + Date.now().toString(36),
          hostName: localParticipantName,
          hostPhase: currentPhase,
          hostProgress: phaseSecondsLeft,
          guestId: '',
          guestName: '',
          guestPhase: 'idle',
          guestProgress: 0,
          activeProfileIdx: activeProfileIdx,
          syncScore: 85,
          updatedAt: new Date().toISOString()
        });

        unsubRef.current = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.guestId && data.guestId !== '') {
              setPartnerJoined(true);
              setPartnerName(data.guestName || 'Partner');
              setPartnerPhase(data.guestPhase || 'idle');
              setPartnerProgress(data.guestProgress || 0);
              setOnlineIsActive(true);
            }
          }
        });
      } else {
        // High fidelity sandbox simulation fallback
        setTimeout(() => {
          setPartnerJoined(true);
          setPartnerName('Alex (Somatic Friend)');
          setPartnerPhase('inhale');
          setPartnerProgress(5);
          setOnlineIsActive(true);
        }, 2200);
      }
    } catch (e) {
      console.error("Error creating real-time sync document:", e);
    } finally {
      setIsConnectingOnline(false);
    }
  };

  // Join Online Sync Room
  const joinOnlineRoom = async () => {
    if (!inputRoomId || !inputRoomId.trim()) return;
    setIsConnectingOnline(true);
    const targetRoom = inputRoomId.trim().toUpperCase();

    try {
      if (isFirebaseInitialized) {
        const docRef = doc(db, 'co_regulation_sessions', targetRoom);
        await setDoc(docRef, {
          guestId: auth.currentUser?.uid || 'auth-guest-' + Date.now().toString(36),
          guestName: localParticipantName,
          guestPhase: currentPhase,
          guestProgress: phaseSecondsLeft,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        setIsCreator(false);
        setOnlineRoomId(targetRoom);
        setPartnerJoined(true);
        setOnlineSyncScore(85);
        setOnlineTimeLeft(60);
        setOnlineScores([]);
        setOnlineIsActive(true);

        unsubRef.current = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setPartnerName(data.hostName || 'Host');
            setPartnerPhase(data.hostPhase || 'idle');
            setPartnerProgress(data.hostProgress || 0);
          }
        });
      } else {
        setIsCreator(false);
        setOnlineRoomId(targetRoom);
        setPartnerJoined(true);
        setPartnerName('Practice Partner (Demo — not a real connection)');
        setOnlineSyncScore(85);
        setOnlineTimeLeft(60);
        setOnlineScores([]);
        setOnlineIsActive(true);
      }
    } catch (e) {
      console.error("Error joining session:", e);
    } finally {
      setIsConnectingOnline(false);
    }
  };

  // Sync Paced Breath phase to Online Firestore
  useEffect(() => {
    if (!onlineRoomId || !partnerJoined) return;
    
    const syncLocalPhase = async () => {
      try {
        if (isFirebaseInitialized) {
          const docRef = doc(db, 'co_regulation_sessions', onlineRoomId);
          if (isCreator) {
            await setDoc(docRef, {
              hostPhase: currentPhase,
              hostProgress: phaseSecondsLeft,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } else {
            await setDoc(docRef, {
              guestPhase: currentPhase,
              guestProgress: phaseSecondsLeft,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        }
      } catch (e) {
        console.warn("Failed pushing local state sync step:", e);
      }
    };
    syncLocalPhase();
  }, [currentPhase, phaseSecondsLeft, onlineRoomId, partnerJoined, isCreator]);

  // Online active sync calculation ticking
  useEffect(() => {
    if (!onlineRoomId || !partnerJoined || !onlineIsActive) return;

    const interval = setInterval(() => {
      setOnlineTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setOnlineIsActive(false);
          const finalAvg = onlineScores.length > 0
            ? Math.round(onlineScores.reduce((a, b) => a + b, 0) / onlineScores.length)
            : onlineSyncScore;

          // Save log
          const newLog = {
            id: 'online-' + Date.now(),
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            partner: partnerName,
            score: finalAvg,
            mode: 'Online Sync'
          };
          const updated = [newLog, ...coregLogs].slice(0, 10);
          setCoregLogs(updated);
          localStorage.setItem('therapy_coreg_challenge_logs', JSON.stringify(updated));

          setChallengeResult({
            show: true,
            mode: 'Online Cloud Bridge',
            partnerName: partnerName,
            avgScore: finalAvg
          });
          return 60;
        }
        return prev - 1;
      });

      // Update sync score
      setOnlineSyncScore(prev => {
        let delta = 0;
        if (currentPhase === partnerPhase) {
          delta = 3.5;
        } else {
          delta = -4.5;
        }
        const next = Math.max(10, Math.min(100, Math.round(prev + delta)));
        setOnlineScores(s => [...s, next]);
        return next;
      });

      // Simulation fallback ticking for guest phase in design simulation
      if (!isFirebaseInitialized) {
        setPartnerPhase(prev => {
          const phases: ('inhale' | 'hold' | 'exhale' | 'rest')[] = ['inhale', 'hold', 'exhale', 'rest'];
          if (Math.random() < 0.75) {
            return currentPhase;
          } else {
            return phases[Math.floor(Math.random() * phases.length)];
          }
        });
        setPartnerProgress(Math.floor(Math.random() * 5));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onlineRoomId, partnerJoined, onlineIsActive, currentPhase, partnerPhase, onlineScores, coregLogs, partnerName]);

  const disconnectOnlineSession = () => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
    setOnlineRoomId('');
    setPartnerJoined(false);
    setPartnerName('');
    setOnlineIsActive(false);
  };
  // ==================== END CO-REGULATION MODULE ====================

  // Helper inside forest preset to trigger a gentle musical chime sequence
  const triggerForestChime = (ctx: AudioContext, destination: AudioNode) => {
    const chimes = [880, 1100, 1320, 1650, 1980];
    const count = 2 + Math.floor(Math.random() * 3); // 2 to 4 random chimes
    
    for (let i = 0; i < count; i++) {
      const delay = i * 0.4 + Math.random() * 0.2;
      const freq = chimes[Math.floor(Math.random() * chimes.length)];
      
      const osc = ctx.createOscillator();
      const envelope = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      // Beautiful ringing bell curve amplitude envelope
      envelope.gain.setValueAtTime(0, ctx.currentTime + delay);
      envelope.gain.linearRampToValueAtTime(0.015, ctx.currentTime + delay + 0.1);
      envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 1.5);
      
      osc.connect(envelope);
      envelope.connect(destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.6);
    }
  };

  // Safely stop and disconnect all active nodes
  const stopAudioNodes = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch (e) {}
      noiseSourceRef.current = null;
    }
    if (filterNodeRef.current) {
      filterNodeRef.current.disconnect();
      filterNodeRef.current = null;
    }
    if (soundGainRef.current) {
      soundGainRef.current.disconnect();
      soundGainRef.current = null;
    }
    if (pannerRef.current) {
      pannerRef.current.disconnect();
      pannerRef.current = null;
    }
  };

  // Web Audio initialization
  const startAudioEngine = (presetId: 'ocean' | 'forest' | 'white_noise', phase: 'inhale' | 'hold' | 'exhale' | 'rest') => {
    try {
      let ctx = audioCtxRef.current;
      if (!ctx) {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
      }
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      stopAudioNodes();

      // Create comfortable looping noise generator on the fly
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const channelData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Comfortably shaved random white noise samples
        channelData[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      
      if (presetId === 'ocean') {
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(1.0, ctx.currentTime);
        filter.frequency.setValueAtTime(180, ctx.currentTime);
      } else if (presetId === 'forest') {
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(3.8, ctx.currentTime);
        filter.frequency.setValueAtTime(550, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(0.5, ctx.currentTime);
        filter.frequency.setValueAtTime(2200, ctx.currentTime);
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);

      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      source.connect(filter);
      if (panner) {
        filter.connect(masterGain);
        masterGain.connect(panner);
        panner.connect(ctx.destination);
        pannerRef.current = panner;
      } else {
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
      }

      source.start();

      noiseSourceRef.current = source;
      filterNodeRef.current = filter;
      soundGainRef.current = masterGain;

      rampAudioParameters(presetId, phase, true);

    } catch (e) {
      console.warn('Could not launch Web Audio acoustic pacer:', e);
    }
  };

  // Harmonized auditory ramping parameters synced with current breath cycle
  const rampAudioParameters = (
    presetId: 'ocean' | 'forest' | 'white_noise',
    phase: 'inhale' | 'hold' | 'exhale' | 'rest',
    isInitial = false
  ) => {
    const ctx = audioCtxRef.current;
    const gainNode = soundGainRef.current;
    const filterNode = filterNodeRef.current;

    if (!ctx || !gainNode || !filterNode) return;

    const now = ctx.currentTime;
    const duration = 
      phase === 'inhale' ? activeProfile.inhaleSecs :
      phase === 'hold' ? activeProfile.holdSecs :
      phase === 'exhale' ? activeProfile.exhaleSecs :
      activeProfile.restSecs;

    const rampTime = isInitial ? 0.35 : Math.max(0.4, duration);

    gainNode.gain.cancelScheduledValues(now);
    filterNode.frequency.cancelScheduledValues(now);

    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    filterNode.frequency.setValueAtTime(filterNode.frequency.value, now);

    if (presetId === 'ocean') {
      if (phase === 'inhale') {
        gainNode.gain.linearRampToValueAtTime(0.30, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(680, now + rampTime);
      } else if (phase === 'hold') {
        gainNode.gain.linearRampToValueAtTime(0.30, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(680, now + rampTime);
      } else if (phase === 'exhale') {
        gainNode.gain.linearRampToValueAtTime(0.012, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(140, now + rampTime);
      } else { // rest
        gainNode.gain.linearRampToValueAtTime(0.005, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(120, now + rampTime);
      }
    } else if (presetId === 'forest') {
      if (phase === 'inhale') {
        gainNode.gain.linearRampToValueAtTime(0.18, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(1150, now + rampTime);
        // Trigger a gorgeous, random Forest Chime chime sequence!
        triggerForestChime(ctx, ctx.destination);
      } else if (phase === 'hold') {
        gainNode.gain.linearRampToValueAtTime(0.18, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(1050, now + rampTime);
      } else if (phase === 'exhale') {
        gainNode.gain.linearRampToValueAtTime(0.02, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(420, now + rampTime);
      } else { // rest
        gainNode.gain.linearRampToValueAtTime(0.007, now + rampTime);
        filterNode.frequency.exponentialRampToValueAtTime(320, now + rampTime);
      }
    } else { // white_noise
      if (phase === 'inhale') {
        gainNode.gain.linearRampToValueAtTime(0.24, now + rampTime);
      } else if (phase === 'hold') {
        gainNode.gain.linearRampToValueAtTime(0.24, now + rampTime);
      } else if (phase === 'exhale') {
        gainNode.gain.linearRampToValueAtTime(0.015, now + rampTime);
      } else { // rest
        gainNode.gain.linearRampToValueAtTime(0.005, now + rampTime);
      }
    }

    // Dynamic spatial panning shifts left-to-right to encourage hemispheric calibration!
    const panner = pannerRef.current;
    if (panner) {
      panner.pan.cancelScheduledValues(now);
      panner.pan.setValueAtTime(panner.pan.value, now);
      if (phase === 'inhale') {
        panner.pan.linearRampToValueAtTime(-0.85, now + rampTime); // sweep left
      } else if (phase === 'exhale') {
        panner.pan.linearRampToValueAtTime(0.85, now + rampTime); // sweep right
      } else {
        panner.pan.linearRampToValueAtTime(0.0, now + rampTime); // center balance
      }
    }
  };

  // Play/Pause toggle
  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setPhaseSecondsLeft(activeProfile.inhaleSecs);
      setCurrentPhase('inhale');
      setPracticeSuccess(false);
    } else {
      setIsPlaying(false);
      stopAudioNodes();
    }
  };

  // Track Audio triggers and cleanups in React side effect loop
  useEffect(() => {
    if (isPlaying && soundEnabled) {
      startAudioEngine(soundPreset, currentPhase);
    } else {
      stopAudioNodes();
    }
    return () => {
      stopAudioNodes();
    };
  }, [isPlaying, soundPreset, soundEnabled]);

  // Handle phase progression parameter ramps smoothly without glitching audio sources
  useEffect(() => {
    if (isPlaying && soundEnabled) {
      rampAudioParameters(soundPreset, currentPhase);
    }
  }, [currentPhase]);

  // Breath cycle tick logic (1s interval resolution)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next breathing stage
          let nextPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'inhale';
          let duration = activeProfile.inhaleSecs;

          if (currentPhase === 'inhale') {
            if (activeProfile.holdSecs > 0) {
              nextPhase = 'hold';
              duration = activeProfile.holdSecs;
            } else {
              nextPhase = 'exhale';
              duration = activeProfile.exhaleSecs;
            }
          } else if (currentPhase === 'hold') {
            nextPhase = 'exhale';
            duration = activeProfile.exhaleSecs;
          } else if (currentPhase === 'exhale') {
            if (activeProfile.restSecs > 0) {
              nextPhase = 'rest';
              duration = activeProfile.restSecs;
            } else {
              nextPhase = 'inhale';
              duration = activeProfile.inhaleSecs;
            }
          } else if (currentPhase === 'rest') {
            nextPhase = 'inhale';
            duration = activeProfile.inhaleSecs;
          }

          setCurrentPhase(nextPhase);
          if (nextPhase === 'inhale') {
            setTimeout(() => onCycleCompleteRef.current?.(), 0);
          }
          return duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentPhase, activeProfileIdx]);

  // Ensure fully clean unmounts
  useEffect(() => {
    return () => {
      stopAudioNodes();
    };
  }, []);

  // Framer Motion variants mapping for the breathing spheres
  const currentTotalSeconds = 
    currentPhase === 'inhale' ? activeProfile.inhaleSecs :
    currentPhase === 'hold' ? activeProfile.holdSecs :
    currentPhase === 'exhale' ? activeProfile.exhaleSecs :
    activeProfile.restSecs;

  const outerRingVariants = {
    inhale: (duration: number) => ({
      scale: 1.6,
      opacity: 0.45,
      transition: { duration: duration, ease: 'easeInOut' }
    }),
    hold: (duration: number) => ({
      scale: [1.6, 1.7, 1.6],
      opacity: 0.6,
      transition: {
        scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        duration: duration
      }
    }),
    exhale: (duration: number) => ({
      scale: 1.0,
      opacity: 0.2,
      transition: { duration: duration, ease: 'easeInOut' }
    }),
    rest: (duration: number) => ({
      scale: 0.9,
      opacity: 0.1,
      transition: { duration: duration, ease: 'easeInOut' }
    }),
    idle: {
      scale: 1.12,
      opacity: 0.25,
      transition: {
        scale: { repeat: Infinity, repeatType: 'reverse' as const, duration: 3, ease: 'easeInOut' }
      }
    }
  };

  const breathingSphereVariants = {
    inhale: (duration: number) => ({
      scale: 1.45,
      background: 'radial-gradient(circle, rgba(20,184,166,0.65) 0%, rgba(13,148,136,0.95) 100%)',
      boxShadow: '0 0 40px rgba(13,148,136,0.55)',
      transition: { duration: duration, ease: 'easeInOut' }
    }),
    hold: (duration: number) => ({
      scale: [1.45, 1.49, 1.45],
      background: 'radial-gradient(circle, rgba(245,158,11,0.65) 0%, rgba(217,119,6,0.95) 100%)',
      boxShadow: '0 0 50px rgba(217,119,6,0.65)',
      transition: {
        scale: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
        duration: duration
      }
    }),
    exhale: (duration: number) => ({
      scale: 1.05,
      background: 'radial-gradient(circle, rgba(99,102,241,0.65) 0%, rgba(79,70,229,0.95) 100%)',
      boxShadow: '0 0 30px rgba(79,70,229,0.45)',
      transition: { duration: duration, ease: 'easeInOut' }
    }),
    rest: (duration: number) => ({
      scale: 0.92,
      background: 'radial-gradient(circle, rgba(148,163,184,0.45) 0%, rgba(100,116,139,0.90) 100%)',
      boxShadow: '0 0 20px rgba(100,116,139,0.3)',
      transition: { duration: duration, ease: 'easeInOut' }
    }),
    idle: {
      scale: 1.12,
      background: 'radial-gradient(circle, rgba(13,148,136,0.35) 0%, rgba(99,102,241,0.75) 100%)',
      boxShadow: '0 0 30px rgba(99,102,241,0.4)',
      transition: {
        scale: { repeat: Infinity, repeatType: 'reverse' as const, duration: 3, ease: 'easeInOut' }
      }
    }
  };

  return (
    <div id="breath-pacer-module" className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-6 text-left relative">
      
      {/* Header and Sync Mode Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#789dbc] font-mono">
            <Wind className="w-4 h-4 text-teal-500 animate-pulse" />
            <span>HEMISPHERIC SOMATIC BALANCE</span>
          </div>
          <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight">
            Acoustic Somatic Breath-Pacer
          </h3>
          <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed max-w-xl">
            Respiration directly guides sympathetic and parasympathetic states. Use solo audio environments or invite a partner to a shared co-regulation session to practice and compute synchronization.
          </p>
        </div>

        {/* Practice Mode Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0 w-full sm:w-auto border border-slate-200">
          <button
            id="solo-practice-selector"
            type="button"
            onClick={() => setSessionMode('solo')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold tracking-wide uppercase rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 ${
              sessionMode === 'solo' 
                ? 'bg-white text-[#3C3C3C] shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>Solo Practice</span>
          </button>
          <button
            id="coreg-challenge-selector"
            type="button"
            onClick={() => {
              setSessionMode('coreg');
              setIsPlaying(false);
              stopAudioNodes();
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold tracking-wide uppercase rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 ${
              sessionMode === 'coreg' 
                ? 'bg-white text-[#3C3C3C] shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Co-Regulation</span>
          </button>
        </div>
      </div>

      {sessionMode === 'solo' ? (

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: THE GLOWING BREATHING MANDALA WINDOW (lg:span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <div className="bg-[#0b0f14] border border-slate-950 rounded-2xl relative overflow-hidden h-[310px] p-4 flex flex-col justify-between items-stretch">
            
            {/* Top active status indicators */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-white/[0.04] text-[9.5px] font-mono font-black text-slate-500">
                <span>PACING CYCLE:</span>
                <span className={`uppercase font-black px-2 py-0.5 rounded transition-all duration-300 ${
                  currentPhase === 'inhale' ? 'bg-teal-600 text-white' :
                  currentPhase === 'hold' ? 'bg-amber-600 text-white' :
                  currentPhase === 'exhale' ? 'bg-indigo-600 text-white' :
                  'bg-white text-[#3C3C3C]'
                }`}>
                  {isPlaying ? currentPhase : 'AWAITING START'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isPlaying && (
                  <div className="font-mono text-xs font-black text-white bg-white/10 px-2.5 py-1 rounded-lg">
                    {phaseSecondsLeft}s Left
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsImmersive(true)}
                  className="bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/20 hover:border-indigo-500/40 text-teal-400 font-mono text-[9px] font-black px-2.5 py-1 rounded-lg tracking-widest uppercase transition-all flex items-center gap-1.5 select-none cursor-pointer"
                  title="Fullscreen Immersive Mode"
                >
                  <Maximize2 className="w-3.2 h-3.2 text-teal-400" />
                  <span>Immersive Mode</span>
                </button>
              </div>
            </div>

            {/* Glowing Custom Framer Motion Sphere in center of visual stage */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
              <div className="relative flex items-center justify-center w-64 h-64">
                
                {/* Layer 1: Ambient outer aura */}
                <motion.div
                  animate={isPlaying ? currentPhase : 'idle'}
                  variants={outerRingVariants}
                  custom={currentTotalSeconds}
                  className="absolute w-44 h-44 rounded-full filter blur-xl opacity-20"
                  style={{ backgroundColor: activeProfile.color }}
                />

                {/* Layer 2: Concentric expanding ripples on transition */}
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div
                      key={`${currentPhase}-${phaseSecondsLeft}`}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1.9, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 3.5, ease: 'easeOut' }}
                      className="absolute w-40 h-40 rounded-full border border-dashed text-white/5"
                      style={{ borderColor: activeProfile.color }}
                    />
                  )}
                </AnimatePresence>

                {/* Layer 3: Glowing Middle Resonating Centerpiece */}
                <motion.div
                  animate={isPlaying ? currentPhase : 'idle'}
                  variants={breathingSphereVariants}
                  custom={currentTotalSeconds}
                  className="absolute w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-xl border border-white/5"
                >
                  <div className="text-center text-white px-3 z-10 select-none">
                    <motion.span 
                      key={currentPhase}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] tracking-widest font-mono uppercase bg-white px-2 py-0.5 rounded-full text-slate-500 block mb-1 font-black"
                    >
                      {isPlaying ? currentPhase : 'IDLE'}
                    </motion.span>
                    
                    <div className="font-mono text-3xl font-black tracking-tight leading-none text-white text-center">
                      {isPlaying ? phaseSecondsLeft : '00'}
                      <span className="text-xs font-mono text-slate-300 ml-0.5 font-bold">s</span>
                    </div>

                    <p className="text-[9px] text-[#e2e8f0] leading-snug mt-1 opacity-90 uppercase font-black tracking-wide">
                      {isPlaying ? (
                        currentPhase === 'inhale' ? 'Inhale 🌾' :
                        currentPhase === 'hold' ? 'Suspend ✋' :
                        currentPhase === 'exhale' ? 'Release 🌬️' :
                        'Rest 🛌'
                      ) : 'Acoustic Rest'}
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Central responsive text guides */}
            <div className="text-center z-10 bg-transparent py-1 rounded-xl max-w-[80%] mx-auto relative">
              {isPlaying ? (
                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-black">
                  {currentPhase === 'inhale' && '🗣️ Fill the lungs with air...'}
                  {currentPhase === 'hold' && '🧘 Relax the neck and observe...'}
                  {currentPhase === 'exhale' && '🌬️ Release physical contraction...'}
                  {currentPhase === 'rest' && '🛌 Integrate neural response...'}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                  Select a Sound Preset &amp; press Start Session
                </span>
              )}
            </div>

            {/* Bottom Play Trigger buttons */}
            <div className="flex items-center justify-center z-10 pt-1">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`py-2 px-6 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer select-none ${
                  isPlaying 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10' 
                    : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current animate-pulse" />
                    <span>Halt Acoustic Pacer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-900" />
                    <span>Begin Breathing Session</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200/40 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              Web Audio oscillators calculate the difference frequency between left and right channels to produce a <strong>subtle 10Hz brain stem synchronization frequency</strong>. For maximum absorption, we recommend headphones.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CALIBRATION CONTROL INTERFACES (lg:span-5) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100/40 p-4 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            {/* Select Sound Presets (Ocean, Forest, White Noise) */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <span>Select Sonic environment</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ocean', name: 'Ocean Swell', emoji: '🌊', desc: 'Waves filter' },
                  { id: 'forest', name: 'Forest Breeze', emoji: '🌲', desc: 'Chimes & birds' },
                  { id: 'white_noise', name: 'Atmospheric', emoji: '🌌', desc: 'Soft slate' }
                ].map(item => {
                  const isSelected = soundPreset === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSoundPreset(item.id as any);
                        if (!soundEnabled) setSoundEnabled(true);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center cursor-pointer select-none ${
                        isSelected && soundEnabled
                          ? 'bg-white border-slate-200 text-[#3C3C3C] shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-base mb-0.5">{item.emoji}</span>
                      <strong className="text-[9px] uppercase font-black font-sans leading-none block">{item.name.split(' ')[0]}</strong>
                      <span className="text-[7.5px] text-slate-400 leading-none mt-1">{item.desc}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-full py-1.8 border rounded-xl text-[10.5px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                  soundEnabled 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-800' 
                    : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Binaural Synthesizer: {soundEnabled ? 'Enabled ' : 'Muted'}</span>
              </button>
            </div>

            {/* Select Respiratory Ratios */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Select respiration profile</span>
              </h4>

              <div className="space-y-1.5">
                {BREATH_PROFILES.map((profile, idx) => (
                  <button
                    key={profile.name}
                    type="button"
                    onClick={() => {
                      setActiveProfileIdx(idx);
                      setIsPlaying(false);
                      stopAudioNodes();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold leading-normal transition-all duration-150 flex flex-col gap-0.5 cursor-pointer ${
                      activeProfileIdx === idx 
                        ? 'bg-white border-slate-200 text-[#3C3C3C] shadow-3xs' 
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-extrabold uppercase text-[10px] tracking-wide">{profile.name.split(' (')[0]}</span>
                      <span className="font-mono text-[8.5px] font-black bg-white/10 px-1.5 py-0.2 rounded border border-white/5 uppercase">
                        {profile.inhaleSecs}-{profile.holdSecs}-{profile.exhaleSecs}
                      </span>
                    </div>
                    <p className={`text-[9.5px] font-medium leading-normal ${activeProfileIdx === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                      {profile.purpose}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          </div>
        </div>
      ) : (
        <div id="co-regulation-panel" className="space-y-6 animate-fade-in text-slate-700">
          
          {/* Science Overview Banner */}
          <div className="bg-gradient-to-br from-rose-50/70 to-pink-50/20 border border-rose-100/55 rounded-2xl p-4.5 flex gap-3 text-left">
            <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-800 font-mono">The Science of Autonomic Co-Regulation</h4>
              <p className="text-xs font-medium text-rose-900/85 leading-relaxed">
                Co-regulation is a mutual neural feedback process where two people synchronize their respiration and heart rhythms. This builds deep cardiac resonance, down-regulates amygdala arousal, and dramatically improves physical stress recovery.
              </p>
            </div>
          </div>

          {/* Sub Tab Navigation Selection Bar */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs bg-slate-100">
            <button
              id="co-reg-couch-btn"
              type="button"
              onClick={() => {
                setCoregSubMode('couch');
                setCouchIsActive(false);
              }}
              className={`py-2 px-1 rounded-lg font-bold uppercase transition text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                coregSubMode === 'couch'
                  ? 'bg-white text-[#3C3C3C] shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Couch Mode</span>
            </button>

            <button
              id="co-reg-online-btn"
              type="button"
              onClick={() => {
                setCoregSubMode('online');
                disconnectOnlineSession();
              }}
              className={`py-2 px-1 rounded-lg font-bold uppercase transition text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                coregSubMode === 'online'
                  ? 'bg-white text-[#3C3C3C] shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 text-teal-400" />
              <span>Online Sync</span>
            </button>

            <button
              id="co-reg-ai-btn"
              type="button"
              onClick={() => {
                setCoregSubMode('ai');
              }}
              className={`py-2 px-1 rounded-lg font-bold uppercase transition text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                coregSubMode === 'ai'
                  ? 'bg-white text-[#3C3C3C] shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Somatic AI</span>
            </button>
          </div>

          {/* -------------------- VIEW 1: COUCH MULTIPLAYER -------------------- */}
          {coregSubMode === 'couch' && (
            <div id="couch-mode-panel" className="border border-slate-200 rounded-2xl p-5 bg-white space-y-6 text-slate-700 animate-fade-in">
              {!couchIsActive ? (
                <div className="space-y-4 max-w-xl mx-auto text-center py-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-sans text-base font-bold text-slate-900">Same-Screen Joint Resonance Challenge</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sit close with your partner face-to-face. You can play directly on a single mobile touch screen or laptop:
                    </p>
                    <div className="text-left bg-slate-50 p-3.5 rounded-xl text-slate-600 text-xs border border-slate-100 space-y-2.5 mt-4 font-sans font-medium">
                      <div className="flex gap-2 items-start">
                        <span className="bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">Partner A [Left]</span>
                        <span className="text-slate-700 leading-relaxed">Press & Hold the Left Pad or hold down <kbd className="bg-white border text-slate-800 rounded px-1.5 py-0.5 text-[9.5px] font-mono font-black shadow-sm">Spacebar</kbd> when inhaling. Release to exhale.</span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className="bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">Partner B [Right]</span>
                        <span className="text-slate-700 leading-relaxed">Press & Hold the Right Pad or hold down <kbd className="bg-white border text-slate-800 rounded px-1.5 py-0.5 text-[9.5px] font-mono font-black shadow-sm">Enter</kbd> when inhaling. Release to exhale.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      id="start-couch-challenge"
                      type="button"
                      onClick={startCouchChallenge}
                      className="py-3 px-6 bg-white text-[#3C3C3C] rounded-xl text-xs font-bold uppercase hover:bg-white transition flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md select-none"
                    >
                      <Play className="w-4 h-4 fill-current text-rose-400" />
                      <span>Start 45s Sync Challenge</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Top Stats Ring */}
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3.5 rounded-2xl px-5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-mono text-[10px] font-black tracking-wider text-slate-500 uppercase">CHALLENGE ACTIVE</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">TIME LEFT</span>
                        <span className="font-mono text-base font-black text-slate-800 leading-none">{couchTimeLeft}s</span>
                      </div>
                      <div className="border-l border-slate-200 h-8" />
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">MUTUAL COHERENCE</span>
                        <span className="font-mono text-base font-black text-rose-600 leading-none flex items-center justify-end gap-1">
                          <Heart className="w-4 h-4 fill-current text-rose-500 animate-pulse text-rose-500 animate-bounce" />
                          <span>{couchSyncScore}%</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Resonant Sinus Waveform Drawing */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">Live Respiration Synchronicity Trace</span>
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 p-2 shadow-inner">
                      <svg className="w-full h-16" viewBox="0 0 100 40">
                        <path
                          d={`M 0 20 Q 25 ${20 + (couchP1Phase === 'inhale' ? -12 : 12) * Math.sin(Date.now() / 250)} 50 20 T 100 ${20 + (couchP1Phase === 'inhale' ? -12 : 12) * Math.sin(Date.now() / 250)}`}
                          fill="transparent"
                          stroke="#6366f1"
                          strokeWidth="2"
                          className="transition-all duration-300"
                          strokeDasharray="4 2"
                        />
                        <path
                          d={`M 0 20 Q 25 ${20 + (couchP2Phase === 'inhale' ? -12 : 12) * Math.cos(Date.now() / 250)} 50 20 T 100 ${20 + (couchP2Phase === 'inhale' ? -12 : 12) * Math.cos(Date.now() / 250)}`}
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          className="transition-all duration-300"
                        />
                      </svg>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> P1 Wave</span>
                      <span className="font-extrabold uppercase">{couchP1Phase === couchP2Phase ? '🎯 SYNCED RESONANCE' : '⚡ PHASE DISPARITY'}</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> P2 Wave</span>
                    </div>
                  </div>

                  {/* Split Dual-Touch Click Pads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* LEFT PLAYER: P1 */}
                    <div 
                      className={`border-2 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] transition select-none cursor-pointer ${
                        couchP1Phase === 'inhale'
                          ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-100'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/30'
                      }`}
                      onMouseDown={() => setCouchP1Phase('inhale')}
                      onMouseUp={() => setCouchP1Phase('exhale')}
                      onTouchStart={(e) => { e.preventDefault(); setCouchP1Phase('inhale'); }}
                      onTouchEnd={(e) => { e.preventDefault(); setCouchP1Phase('exhale'); }}
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase border border-indigo-100 font-extrabold">Partner A [Left]</span>
                        <h5 className="font-mono text-sm font-black text-slate-800 uppercase mt-2">
                          {couchP1Phase === 'inhale' ? '🌾 INHALING' : '🌬️ EXHALING'}
                        </h5>
                      </div>

                      {/* Expanding sphere */}
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: couchP1Phase === 'inhale' ? 1.5 : 1.0 }}
                          className="absolute w-14 h-14 rounded-full bg-indigo-500/80 shadow-lg border border-white/10"
                        />
                        <span className="relative z-10 text-[9.5px] text-white font-mono font-bold uppercase tracking-wider">Sphere A</span>
                      </div>

                      <button
                        type="button"
                        className="py-1.5 px-4 bg-white hover:bg-white text-[#3C3C3C] rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                        onMouseDown={(e) => { e.stopPropagation(); setCouchP1Phase('inhale'); }}
                        onMouseUp={(e) => { e.stopPropagation(); setCouchP1Phase('exhale'); }}
                      >
                        Press / Release Pad
                      </button>
                    </div>

                    {/* RIGHT PLAYER: P2 */}
                    <div 
                      className={`border-2 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] transition select-none cursor-pointer ${
                        couchP2Phase === 'inhale'
                          ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-100'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/30'
                      }`}
                      onMouseDown={() => setCouchP2Phase('inhale')}
                      onMouseUp={() => setCouchP2Phase('exhale')}
                      onTouchStart={(e) => { e.preventDefault(); setCouchP2Phase('inhale'); }}
                      onTouchEnd={(e) => { e.preventDefault(); setCouchP2Phase('exhale'); }}
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-100 font-extrabold">Partner B [Right]</span>
                        <h5 className="font-mono text-sm font-black text-slate-800 uppercase mt-2">
                          {couchP2Phase === 'inhale' ? '🌾 INHALING' : '🌬️ EXHALING'}
                        </h5>
                      </div>

                      {/* Expanding sphere */}
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: couchP2Phase === 'inhale' ? 1.5 : 1.0 }}
                          className="absolute w-14 h-14 rounded-full bg-emerald-500/80 shadow-lg border border-white/10"
                        />
                        <span className="relative z-10 text-[9.5px] text-white font-mono font-bold uppercase tracking-wider">Sphere B</span>
                      </div>

                      <button
                        type="button"
                        className="py-1.5 px-4 bg-white hover:bg-white text-[#3C3C3C] rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                        onMouseDown={(e) => { e.stopPropagation(); setCouchP2Phase('inhale'); }}
                        onMouseUp={(e) => { e.stopPropagation(); setCouchP2Phase('exhale'); }}
                      >
                        Press / Release Pad
                      </button>
                    </div>

                  </div>

                  {/* Operational Controls panel */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setCouchIsActive(false)}
                      className="text-xs font-bold text-slate-500 hover:text-rose-500 underline transition cursor-pointer"
                    >
                      Abort Active Challenge
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------- VIEW 2: ONLINE CLOUD SYNC -------------------- */}
          {coregSubMode === 'online' && (
            <div id="online-mode-panel" className="border border-slate-200 rounded-2xl p-5 bg-white space-y-6 text-slate-700 animate-fade-in">
              {onlineRoomId === '' ? (
                <div className="space-y-5 max-w-xl mx-auto py-4">
                  <div className="space-y-2 text-center">
                    <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100">
                      <Globe className="w-6 h-6 text-teal-600" />
                    </div>
                    <h4 className="font-sans text-base font-bold text-slate-900">Online Real-Time Empathy Bridge</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Establish a remote biometric breathing connection with another active player using secure Firestore channels. As they breathe, their connected pacing sphere updates live on your screen.
                    </p>
                  </div>

                  {/* Name field */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-left">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">My Display Name Identifier</label>
                    <input
                      type="text"
                      maxLength={18}
                      value={localParticipantName}
                      onChange={(e) => {
                        setLocalParticipantName(e.target.value);
                        localStorage.setItem('therapy_user_name', e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Create Room Block */}
                    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white text-left shadow-sm">
                      <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-slate-800">
                        <span className="w-2 h-2 rounded bg-indigo-500 animate-pulse" />
                        <span>Establish Host Terminal</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Generate a unique challenge token code and wait for your friend or relative to bridge into your session.
                      </p>
                      <button
                        id="btn-create-sync-room"
                        type="button"
                        onClick={createOnlineRoom}
                        disabled={isConnectingOnline}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold uppercase transition cursor-pointer select-none text-center flex items-center justify-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isConnectingOnline ? 'Constructing...' : 'Launch Sync Room'}</span>
                      </button>
                    </div>

                    {/* Join Room Block */}
                    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white text-left shadow-sm">
                      <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-slate-800">
                        <span className="w-2 h-2 rounded bg-emerald-500 animate-pulse" />
                        <span>Join Companion Room</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Enter an active 8-character synchronization token provided by your host partner to match.
                      </p>
                      
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="SYNC-901"
                          maxLength={8}
                          value={inputRoomId}
                          onChange={(e) => setInputRoomId(e.target.value)}
                          className="font-mono bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-center font-black text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-slate-400 flex-1"
                        />
                        <button
                          id="btn-join-sync-room"
                          type="button"
                          onClick={joinOnlineRoom}
                          disabled={isConnectingOnline || !inputRoomId.trim()}
                          className="py-1.5 px-3 bg-white text-[#3C3C3C] hover:bg-white disabled:bg-slate-300 rounded-lg text-xs font-bold uppercase transition cursor-pointer select-none text-center whitespace-nowrap"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>

                  {!isFirebaseInitialized && (
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100 text-[10.5px] font-sans font-medium line-relaxed text-left">
                      ⚠️ Firebase offline or sandboxed. Initializing room will automatically connect you to a virtual simulated companion after 2.5 seconds to permit complete responsive testing.
                    </div>
                  )}

                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Active Cloud Room Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white border border-slate-200 p-4 rounded-2xl gap-3 text-[#3C3C3C]">
                    <div className="text-left space-y-0.5">
                      <span className="text-[9px] font-mono font-black text-indigo-400 tracking-wider uppercase">ACTIVE BIOMETRIC EMBED BRIDGE</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black tracking-wide text-white">{onlineRoomId}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/25 px-2 py-0.5 rounded-full uppercase font-bold animate-pulse">Connected</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-left">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">My Profile</span>
                        <span className="font-sans text-xs font-extrabold text-white">{localParticipantName}</span>
                      </div>
                      <div className="h-6 border-l border-slate-800" />
                      <div className="text-left">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Companion</span>
                        <span className="font-sans text-xs font-extrabold text-teal-300">
                          {partnerJoined ? partnerName : 'Awaiting Guest...'}
                        </span>
                      </div>
                      <div className="h-6 border-l border-slate-800" />
                      <button
                        type="button"
                        onClick={disconnectOnlineSession}
                        className="py-1.5 px-3 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/25 rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer transition"
                      >
                        Leave
                      </button>
                    </div>
                  </div>

                  {!partnerJoined ? (
                    <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-10 text-center space-y-4 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
                      <div className="space-y-1">
                        <h5 className="font-sans text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">PENDING HOST BRIDGING</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Provide this token code: <strong className="font-mono text-slate-900 font-extrabold bg-white border px-1.5 py-0.5 rounded tracking-wide">{onlineRoomId}</strong> to your partner on another system.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Active online game area */}
                      {!onlineIsActive ? (
                        <div className="p-8 text-center max-w-sm mx-auto space-y-4">
                          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                          <div className="space-y-1">
                            <h5 className="font-sans text-sm font-extrabold text-slate-900">{partnerName} Joined Connected Space!</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Your respiratory frequencies are successfully linked. Complete synchronous pacing.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setOnlineIsActive(true);
                              if (!isPlaying) handleTogglePlay();
                            }}
                            className="py-2.5 px-5 bg-white text-[#3C3C3C] rounded-xl text-xs font-extrabold uppercase hover:bg-white transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                          >
                            <Play className="w-4 h-4 text-teal-400 fill-current" />
                            <span>Establish Sync Stream (60s)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          
                          {/* Live Ticks */}
                          <div className="flex justify-between items-center bg-slate-50 rounded-2xl border border-slate-200 p-3.5 px-5 text-xs text-slate-600">
                            <span className="font-mono text-[9px] font-black uppercase text-slate-400">Stream Code Tracker: {onlineRoomId}</span>
                            <div className="flex items-center gap-6">
                              <span className="font-mono text-slate-800">Time: <strong className="text-slate-900 font-black">{onlineTimeLeft}s</strong></span>
                              <span className="border-l border-slate-200 h-4" />
                              <span className="font-mono text-rose-600 font-extrabold flex items-center gap-1 animate-bounce">
                                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                                <span>Coherence: {onlineSyncScore}%</span>
                              </span>
                            </div>
                          </div>

                          {/* Dynamic split view */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* MY VISUAL PACER */}
                            <div className="bg-white rounded-2xl p-6 min-h-[200px] flex flex-col items-center justify-between text-[#3C3C3C] border border-slate-200 select-none">
                              <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 font-mono uppercase tracking-wider text-slate-300 font-bold">
                                Me [{localParticipantName}]
                              </span>
                              
                              <div className="relative w-24 h-24 flex items-center justify-center">
                                <motion.div
                                  animate={isPlaying ? currentPhase : 'idle'}
                                  variants={{
                                    ...breathingSphereVariants,
                                    inhale: () => ({ scale: 1.5, transition: { duration: 4 } }),
                                    hold: () => ({ scale: 1.5, transition: { duration: 4 } }),
                                    exhale: () => ({ scale: 1.0, transition: { duration: 4 } }),
                                    rest: () => ({ scale: 1.0, transition: { duration: 4 } }),
                                    idle: { scale: 1.15 }
                                  }}
                                  className="absolute w-14 h-14 rounded-full bg-cyan-500/80 shadow-[0_0_35px_rgba(34,211,238,0.5)] border border-white/5"
                                />
                                <span className="relative z-10 text-[9px] font-mono uppercase text-slate-100 font-extrabold">
                                  {isPlaying ? currentPhase : 'Standby'}
                                </span>
                              </div>

                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                Action Pacing: {isPlaying ? `${phaseSecondsLeft}s` : 'Wired'}
                              </span>
                            </div>

                            {/* PARTNER VISUAL PACER */}
                            <div className="bg-white rounded-2xl p-6 min-h-[200px] flex flex-col items-center justify-between text-[#3C3C3C] border border-slate-200 select-none">
                              <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 font-mono uppercase tracking-wider text-teal-300 font-bold flex items-center gap-1">
                                <Wifi className="w-3 h-3 animate-pulse text-teal-400" />
                                <span>Companion [{partnerName}]</span>
                              </span>
                              
                              <div className="relative w-24 h-24 flex items-center justify-center">
                                <motion.div
                                  animate={partnerPhase}
                                  variants={{
                                    inhale: { scale: 1.5 },
                                    hold: { scale: 1.5 },
                                    exhale: { scale: 1.0 },
                                    rest: { scale: 1.0 },
                                    idle: { scale: 1.15 }
                                  }}
                                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                                  className="absolute w-14 h-14 rounded-full bg-teal-500/80 shadow-[0_0_35px_rgba(20,184,166,0.5)] border border-white/5"
                                />
                                <span className="relative z-10 text-[9px] font-mono uppercase text-slate-100 font-extrabold">
                                  {partnerPhase}
                                </span>
                              </div>

                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                Remote status sync: Stream Live
                              </span>
                            </div>

                          </div>

                          {/* HRV Bio Waveform chart */}
                          <div className="space-y-1.5 text-left bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
                            <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Bridged Heart-Rate Resonance (Vagal Frequency)</span>
                            <svg className="w-full h-12 overflow-hidden opacity-90" viewBox="0 0 100 40">
                              <path
                                d={`M 0 20 Q 25 ${20 + (currentPhase === 'inhale' ? -12 : 12) * Math.sin(Date.now() / 250)} 50 20 T 100 ${20 + (currentPhase === 'inhale' ? -12 : 12) * Math.sin(Date.now() / 250)}`}
                                fill="transparent"
                                stroke="#10b981"
                                strokeWidth="2.0"
                                className="transition-all duration-300"
                              />
                            </svg>
                            <span className="text-[8.5px] font-mono text-slate-500 uppercase block select-none text-slate-400">
                              🌿 Both systems running adaptive vagal oscillations. Match cycles to amplify resonance.
                            </span>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* -------------------- VIEW 3: SOMATIC AI PARTNER -------------------- */}
          {coregSubMode === 'ai' && (
            <div id="ai-mode-panel" className="border border-slate-200 rounded-2xl p-5 bg-white space-y-6 text-slate-700 animate-fade-in">
              
              {/* Partner grid selectors */}
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-mono font-black text-slate-400 tracking-wider uppercase block text-slate-500">Select AI Somatic Co-Regulation Coach</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Maya */}
                  <div 
                    onClick={() => {
                      setAiPartnerId('maya');
                      setIsPlaying(false);
                      setAiPhase('inhale');
                      setAiSecondsLeft(5);
                    }}
                    className={`border rounded-xl p-4 cursor-pointer transition flex items-start gap-3 text-left ${
                      aiPartnerId === 'maya'
                        ? 'border-indigo-500 bg-indigo-50/10 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 mt-0.5 font-bold text-indigo-700 shrink-0">M</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <h5 className="font-sans text-xs font-black text-slate-800 uppercase">Maya - Resonant Breath Yogi</h5>
                        <span className="text-[9px] bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-mono font-bold text-indigo-600 shrink-0">Resonant</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                        Breathes at a steady 5s Inhale / 5s Exhale resonance ratio. Perfect for steady somatic calibration training.
                      </p>
                    </div>
                  </div>

                  {/* Zack */}
                  <div 
                    onClick={() => {
                      setAiPartnerId('zack');
                      setIsPlaying(false);
                      setAiPhase('inhale');
                      setAiSecondsLeft(4);
                    }}
                    className={`border rounded-xl p-4 cursor-pointer transition flex items-start gap-3 text-left ${
                      aiPartnerId === 'zack'
                        ? 'border-amber-500 bg-amber-50/10 ring-2 ring-amber-200'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 mt-0.5 font-bold text-amber-700 shrink-0">Z</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <h5 className="font-sans text-xs font-black text-slate-800 uppercase">Zack - Zen Box Master</h5>
                        <span className="text-[9px] bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-amber-700 shrink-0 font-extrabold">Box Style</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                        Breathes at a precise 4-4-4-4 Box breathing ratio. Ideal for building extreme mental focus and grounding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Interactive Panel */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 text-center space-y-5">
                {!isPlaying ? (
                  <div className="py-8 max-w-sm mx-auto space-y-4">
                    <Target className="w-10 h-10 text-indigo-600 mx-auto" />
                    <div>
                      <h5 className="font-sans text-xs font-extrabold uppercase tracking-widest text-slate-800 font-mono">READY FOR RES_SYNC</h5>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Turn on the pacer. Match your breath in step with your active {aiPartnerId === 'maya' ? 'Resonant' : 'Box'} Coach.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaying(true);
                        setAiSecondsLeft(aiPartnerId === 'maya' ? 5 : 4);
                      }}
                      className="py-2.5 px-6 bg-white text-[#3C3C3C] hover:bg-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Breathe with Coach
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Synchronicity Display */}
                    <div className="flex justify-between items-center bg-white border border-slate-200 p-3.5 rounded-xl px-5 text-xs text-slate-600 shadow-sm">
                      <span className="font-mono text-[9px] font-bold text-slate-400 block uppercase">Bio-Rhythm Trainer</span>
                      
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-xs">Coach: <strong className="text-slate-900 font-black uppercase">{aiPartnerId}</strong> • Phase left: <strong className="text-slate-900 font-black">{aiSecondsLeft}s</strong></span>
                        <span className="border-l border-slate-200 h-4" />
                        <span className="font-mono text-rose-600 font-extrabold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse text-rose-500" />
                          <span>Alignment: {aiSyncScore}%</span>
                        </span>
                      </div>
                    </div>

                    {/* Left/Right Spheres */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Coach Sphere */}
                      <div className="bg-[#0c0f14] border border-slate-900 rounded-xl p-5 text-white flex flex-col items-center justify-between min-h-[180px]">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Coach Sphere [{aiPartnerId === 'maya' ? 'Maya' : 'Zack'}]</span>
                        
                        <div className="relative w-22 h-22 flex items-center justify-center">
                          <motion.div
                            animate={aiPhase}
                            variants={{
                              inhale: { scale: 1.5, background: 'radial-gradient(circle, rgba(99,102,241,0.85) 0%, rgba(79,70,229,0.98) 100%)' },
                              hold: { scale: 1.5, background: 'radial-gradient(circle, rgba(245,158,11,0.85) 0%, rgba(217,119,6,0.98) 100%)' },
                              exhale: { scale: 1.0, background: 'radial-gradient(circle, rgba(148,163,184,0.6) 0%, rgba(100,116,139,0.95) 100%)' },
                              rest: { scale: 1.0, background: 'radial-gradient(circle, rgba(148,163,184,0.4) 0%, rgba(100,116,139,0.8) 100%)' }
                            }}
                            className="absolute w-12 h-12 rounded-full shadow-lg"
                          />
                          <span className="relative z-10 text-[9px] font-mono font-bold uppercase text-white">{aiPhase}</span>
                        </div>

                        <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase bg-white/5 py-1 px-3.5 rounded border border-white/[0.05]">
                          {aiPartnerId === 'maya' ? 'Aura Resonate' : 'Deep Box Limit'}
                        </span>
                      </div>

                      {/* My Sphere (Linked to active Solo) */}
                      <div className="bg-[#0c0f14] border border-slate-900 rounded-xl p-5 text-white flex flex-col items-center justify-between min-h-[180px]">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">My Sphere</span>
                        
                        <div className="relative w-22 h-22 flex items-center justify-center">
                          <motion.div
                            animate={currentPhase}
                            variants={{
                              inhale: { scale: 1.5, background: 'radial-gradient(circle, rgba(20,184,166,0.85) 0%, rgba(13,148,136,0.98) 100%)' },
                              hold: { scale: 1.5, background: 'radial-gradient(circle, rgba(245,158,11,0.85) 0%, rgba(217,119,6,0.98) 100%)' },
                              exhale: { scale: 1.0, background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(79,70,229,0.95) 100%)' },
                              rest: { scale: 1.0, background: 'radial-gradient(circle, rgba(148,163,184,0.5) 0%, rgba(100,116,139,0.9) 100%)' }
                            }}
                            className="absolute w-12 h-12 rounded-full shadow-lg"
                          />
                          <span className="relative z-10 text-[9px] font-mono font-bold uppercase text-white">{currentPhase}</span>
                        </div>

                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="py-1 px-4 border border-teal-500/35 bg-teal-500/10 text-teal-300 rounded text-[10px] font-bold uppercase hover:bg-teal-500/20 cursor-pointer"
                        >
                          Halt practice
                        </button>
                      </div>

                    </div>

                    <div className="text-left bg-white rounded-xl p-3 border border-slate-200">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">AI Coaching Guidance</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1 font-medium select-none">
                        {currentPhase === aiPhase ? (
                          <span className="text-emerald-700 font-bold">🎯 Excellent synchronicity! Both your somatic system and Zack/Maya are in physical Phase lock.</span>
                        ) : (
                          <span className="text-indigo-700 font-bold">🌾 Adjust your rhythm. Your coach is currently in ({aiPhase}) phase; transition or alter your speed to match.</span>
                        )}
                      </p>
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}

          {/* Leaderboard & Historic Sync Logs */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-3.5 text-left border-slate-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h4 className="font-sans text-xs font-black text-slate-800 uppercase tracking-widest">
                Co-Regulation History Leaderboard
              </h4>
            </div>

            {coregLogs.length === 0 ? (
              <div className="bg-white border text-center text-xs text-slate-500 font-medium py-6 px-4 rounded-xl border-slate-200">
                No co-regulation sessions logged yet. Sit with a friend, or spin up an online cloud bridge to track synchronicity scores!
              </div>
            ) : (
              <div className="bg-white border rounded-xl overflow-hidden shadow-sm border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-mono text-[9px] text-slate-500 uppercase font-black">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Sync Mode</th>
                      <th className="py-2.5 px-3 font-semibold">Partner Designation</th>
                      <th className="py-2.5 px-3 text-right">Avg Coherence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coregLogs.map((log) => {
                      const isExcellent = log.score >= 90;
                      const isGood = log.score >= 70;
                      return (
                        <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono text-slate-500 leading-none">{log.date.split(' ')[0]}</td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-700">{log.mode}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-bold">{log.partner}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-black">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              isExcellent ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              isGood ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {log.score}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==================== HIGH SCORE CELEBRATION MODAL dialog ==================== */}
      <AnimatePresence>
        {challengeResult && challengeResult.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in text-left select-none leading-normal">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-5 text-center relative"
            >
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 mb-2">
                <Heart className="w-8 h-8 text-rose-500 fill-current animate-pulse text-rose-500 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-widest block">SESSION COMPLETE</span>
                <h4 className="font-sans text-lg font-black text-slate-900 tracking-tight">Vagal Synchronicity Breakthrough!</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                  You completed your <strong>{challengeResult.mode}</strong> with <strong>{challengeResult.partnerName}</strong>.
                </p>
              </div>

              {/* Radial Sync score representation */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-slate-50 rounded-full border border-slate-100 shadow-inner">
                <div className="text-center">
                  <span className="block font-mono text-4xl font-black text-indigo-700 leading-none">{challengeResult.avgScore}%</span>
                  <span className="text-[9px] font-mono uppercase font-black tracking-wider text-slate-400 block mt-1">COHERENCE</span>
                </div>
              </div>

              <div className="bg-slate-100 p-3.5 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-sans font-medium text-left space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Somatic Resonance Analysis:</span>
                </div>
                <span>
                  {challengeResult.avgScore >= 85 
                    ? "Exceptional parasympathetic entrainment! Your breathing cycles achieved rich cardiac lock-step, increasing biological security." 
                    : "Stable synchronization. Steady somatic focus continues to lower mutual muscle bracing and restore vagal homeostasis."
                  }
                </span>
              </div>

              <button
                type="button"
                className="w-full py-2.5 bg-white text-[#3C3C3C] hover:bg-white rounded-xl text-xs font-bold uppercase transition scale-x-100 select-none text-center cursor-pointer"
                onClick={() => setChallengeResult(null)}
              >
                Return to practice
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isImmersive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#06080c] z-[999] flex flex-col justify-between p-6 md:p-10 overflow-hidden select-none text-left"
          >
            {/* Dynamic Ambient Glow Backing */}
            <div 
              className="absolute inset-0 opacity-20 filter blur-3xl transition-all duration-[2000ms] ease-in-out pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${activeProfile.color} 0%, transparent 65%)`
              }}
            />

            {/* Subtle floating particle background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {particles.map((p) => {
                let speedFactor = 1;
                if (currentPhase === 'inhale') speedFactor = 2.0;
                if (currentPhase === 'exhale') speedFactor = 0.5;
                return (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-cyan-400/25 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                    style={{
                      width: p.size,
                      height: p.size,
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                    }}
                    animate={{
                      y: currentPhase === 'inhale' ? [-20, -120] : currentPhase === 'exhale' ? [-5, -15] : [-10, -50],
                      opacity: currentPhase === 'inhale' ? [0.2, 0.8, 0.2] : currentPhase === 'exhale' ? [0.05, 0.3, 0.05] : [0.1, 0.5, 0.1],
                      scale: currentPhase === 'hold' ? [1, 1.5, 1] : [1, 1.1, 1]
                    }}
                    transition={{
                      duration: p.duration / speedFactor,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "linear"
                    }}
                  />
                );
              })}
            </div>

            {/* IMMERSIVE HEADER */}
            <div className="relative z-10 flex justify-between items-start w-full">
              <div>
                <span className="text-[10px] font-mono font-black text-teal-400/80 tracking-widest block uppercase">
                  Acoustic Somatic Breath-Pacer • Immersive Mode
                </span>
                <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                  {activeProfile.name}
                </h2>
                <p className="text-xs text-slate-400 max-w-md hidden sm:block font-medium mt-1">
                  Obscuring all interface alerts to deliver a distraction-free, deeply stabilizing bio-pacing environment. Focus on the central sphere.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsImmersive(false)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md active:scale-95"
              >
                <Minimize2 className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Exit Fullscreen</span>
              </button>
            </div>

            {/* IMMERSIVE CENTER BREATHING SPHERE */}
            <div className="relative flex flex-col items-center justify-center flex-grow p-4">
              <div className="relative flex items-center justify-center w-80 h-80 md:w-[420px] md:h-[420px]">
                
                {/* Outer Ring Ripple */}
                <motion.div
                  animate={isPlaying ? currentPhase : 'idle'}
                  variants={{
                    ...outerRingVariants,
                    inhale: (duration: number) => ({
                      scale: 1.9,
                      opacity: 0.55,
                      transition: { duration: duration, ease: 'easeInOut' }
                    }),
                    hold: (duration: number) => ({
                      scale: [1.9, 2.05, 1.9],
                      opacity: 0.7,
                      transition: {
                        scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                        duration: duration
                      }
                    }),
                    exhale: (duration: number) => ({
                      scale: 1.15,
                      opacity: 0.25,
                      transition: { duration: duration, ease: 'easeInOut' }
                    }),
                    rest: (duration: number) => ({
                      scale: 1.0,
                      opacity: 0.15,
                      transition: { duration: duration, ease: 'easeInOut' }
                    }),
                    idle: {
                      scale: 1.25,
                      opacity: 0.3,
                      transition: {
                        scale: { repeat: Infinity, repeatType: 'reverse' as const, duration: 3, ease: 'easeInOut' }
                      }
                    }
                  }}
                  custom={currentTotalSeconds}
                  className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full filter blur-2xl opacity-20"
                  style={{ backgroundColor: activeProfile.color }}
                />

                {/* Expanding Concentric Pulsing Wave */}
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div
                      key={`${currentPhase}-${phaseSecondsLeft}-imm`}
                      initial={{ scale: 0.9, opacity: 0.65 }}
                      animate={{ scale: 2.3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 4.0, ease: 'easeOut' }}
                      className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full border border-teal-500/10 border-dashed"
                    />
                  )}
                </AnimatePresence>

                {/* Massive Breathing Mandala core */}
                <motion.div
                  animate={isPlaying ? currentPhase : 'idle'}
                  variants={{
                    ...breathingSphereVariants,
                    inhale: (duration: number) => ({
                      scale: 1.7,
                      background: 'radial-gradient(circle, rgba(20,184,166,0.75) 0%, rgba(13,148,136,0.98) 100%)',
                      boxShadow: '0 0 70px rgba(13,148,136,0.75)',
                      transition: { duration: duration, ease: 'easeInOut' }
                    }),
                    hold: (duration: number) => ({
                      scale: [1.7, 1.76, 1.7],
                      background: 'radial-gradient(circle, rgba(245,158,11,0.75) 0%, rgba(217,119,6,0.98) 100%)',
                      boxShadow: '0 0 85px rgba(217,119,6,0.85)',
                      transition: {
                        scale: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
                        duration: duration
                      }
                    }),
                    exhale: (duration: number) => ({
                      scale: 1.2,
                      background: 'radial-gradient(circle, rgba(99,102,241,0.75) 0%, rgba(79,70,229,0.98) 100%)',
                      boxShadow: '0 0 55px rgba(79,70,229,0.6)',
                      transition: { duration: duration, ease: 'easeInOut' }
                    }),
                    rest: (duration: number) => ({
                      scale: 1.05,
                      background: 'radial-gradient(circle, rgba(148,163,184,0.55) 0%, rgba(100,116,139,0.95) 100%)',
                      boxShadow: '0 0 35px rgba(100,116,139,0.4)',
                      transition: { duration: duration, ease: 'easeInOut' }
                    }),
                    idle: {
                      scale: 1.3,
                      background: 'radial-gradient(circle, rgba(13,148,136,0.45) 0%, rgba(99,102,241,0.85) 100%)',
                      boxShadow: '0 0 45px rgba(99,102,241,0.5)',
                      transition: {
                        scale: { repeat: Infinity, repeatType: 'reverse' as const, duration: 3, ease: 'easeInOut' }
                      }
                    }
                  }}
                  custom={currentTotalSeconds}
                  className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center border border-white/10 shadow-2xl relative z-10 cursor-pointer"
                  onClick={handleTogglePlay}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center text-white px-4 select-none">
                    <motion.span 
                      key={currentPhase}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] tracking-[0.15em] font-mono uppercase bg-white px-3.5 py-1 rounded-full text-slate-100 block mb-2 font-bold border border-white/5"
                    >
                      {isPlaying ? currentPhase : 'STANDBY'}
                    </motion.span>
                    
                    <div className="font-mono text-5xl md:text-6xl font-black tracking-tight leading-none text-white text-center">
                      {isPlaying ? phaseSecondsLeft : '00'}
                      <span className="text-sm font-mono text-slate-300 ml-0.5 font-bold">s</span>
                    </div>

                    <p className="text-[10px] text-slate-200 mt-1.5 uppercase font-mono font-black tracking-widest">
                      {isPlaying ? (
                        currentPhase === 'inhale' ? 'Inhale 🌾' :
                        currentPhase === 'hold' ? 'Suspend ✋' :
                        currentPhase === 'exhale' ? 'Release 🌬️' :
                        'Rest 🛌'
                      ) : 'Tap Core to Begin'}
                    </p>
                  </div>
                </motion.div>

                {/* Circular Percentage Tracker arc */}
                <svg className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px] -rotate-90 pointer-events-none w-full h-full">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="47%"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  {isPlaying && (
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="47%"
                      stroke={activeProfile.color}
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray="295"
                      initial={{ strokeDashoffset: 295 }}
                      animate={{ strokeDashoffset: 295 * (1 - phaseSecondsLeft / currentTotalSeconds) }}
                      transition={{ duration: 1.0, ease: 'linear' }}
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* IMMERSIVE COMPASSIONATE FOCUS WORDS */}
            <div className="relative z-10 text-center max-w-xl mx-auto mb-4 min-h-[40px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPhase + isPlaying.toString()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6 }}
                  className="text-sm md:text-base font-serif font-medium tracking-wide text-slate-300 italic px-4 leading-relaxed"
                >
                  {isPlaying ? (
                    currentPhase === 'inhale' ? '“Inhale deeply, breathing in peaceful calm, filling the logs...”' :
                    currentPhase === 'hold' ? '“Gently hold the breath, feeling a sense of absolute suspension...”' :
                    currentPhase === 'exhale' ? '“Release the breath slowly, letting go of any physical tension...”' :
                    '“Integrate the calm, resetting your nervous system equilibrium...”'
                  ) : (
                    '“Synchronizing auditory cues side-to-side. Tap anywhere to begin your silent journey.”'
                  )}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* MINIMALIST IMMERSIVE CONTROLS BAR */}
            <div className="relative z-10 border-t border-white/5 pt-5 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
              
              {/* Profile swapper */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1 w-full md:w-auto overflow-x-auto">
                {BREATH_PROFILES.map((p, idx) => {
                  const isCurrent = activeProfileIdx === idx;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setActiveProfileIdx(idx);
                        setIsPlaying(false);
                        stopAudioNodes();
                      }}
                      className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-tight uppercase transition shrink-0 cursor-pointer ${
                        isCurrent 
                          ? 'bg-white text-slate-950 font-black shadow-md' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {p.name.split(' (')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Central control strip */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`py-2 px-6 rounded-xl text-xs font-black tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-xl cursor-pointer select-none border ${
                    isPlaying 
                      ? 'bg-rose-500 hover:bg-rose-400 border-rose-500 text-white' 
                      : 'bg-teal-500 hover:bg-teal-400 border-teal-500 text-slate-950 font-black'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current animate-pulse" />
                      <span>Halt Pacer</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Pacer</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                    soundEnabled 
                      ? 'bg-white/10 border-white/20 text-teal-400' 
                      : 'bg-rose-500/10 border-white/5 text-rose-400'
                  }`}
                  title={soundEnabled ? "Mute Acoustic Synthesizer" : "Unmute Acoustic Synthesizer"}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Ambient picker */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="font-mono text-[9.5px] text-slate-500">Theme Ambient:</span>
                <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 gap-0.5">
                  {['ocean', 'forest', 'white_noise'].map((env) => {
                    const isSelected = soundPreset === env;
                    return (
                      <button
                        key={env}
                        type="button"
                        onClick={() => {
                          setSoundPreset(env as any);
                          if (!soundEnabled) setSoundEnabled(true);
                        }}
                        className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition cursor-pointer ${
                          isSelected 
                            ? 'bg-white/10 text-teal-300 font-extrabold' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {env.split('_')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
