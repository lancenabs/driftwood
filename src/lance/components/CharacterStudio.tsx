import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Smile, Heart, ShieldAlert, Upload, Compass, Play, Pause, 
  HelpCircle, RefreshCw, MessageSquare, Image as ImageIcon, Check, Info, ArrowRight, Layers, Sliders,
  Mic, MicOff, Trash2, Volume2, VolumeX
} from 'lucide-react';

type SceneId = 'nature' | 'nebula' | 'therapy-room' | 'minimal';
const SCENE_LABELS: Record<SceneId, string> = {
  'therapy-room': 'Therapy Room',
  nature: 'Nature',
  nebula: 'Nebula',
  minimal: 'Minimal',
};

interface CharacterTemplate {
  id: string;
  name: string;
  sub: string;
  description: string;
  baseColor: string;
  particleColor: string;
  eyesType: 'happy' | 'calm' | 'concerned';
  faceSvg: string;
  defaultAnimation: 'float' | 'pulse' | 'vibrate' | 'still';
  defaultEmotion: 'happy' | 'calm' | 'concerned';
}

interface SentimentLog {
  id: string;
  text: string;
  detectedEmotion: 'happy' | 'calm' | 'concerned';
  timestamp: string;
}

const CHARACTER_TEMPLATES: CharacterTemplate[] = [
  {
    id: 'wise-elder',
    name: 'Wise Anchor (The Self)',
    sub: 'Golden Guardian of Congruence',
    description: 'A deeply integrated, calm archetype representing your ultimate self-regulatory capacity. Glows with golden, warm energy.',
    baseColor: 'bg-amber-100 border-amber-400 text-amber-950',
    particleColor: '#F59E0B',
    eyesType: 'calm',
    faceSvg: 'calm',
    defaultAnimation: 'pulse',
    defaultEmotion: 'calm'
  },
  {
    id: 'inner-child',
    name: 'The Playful Inner Child',
    sub: 'Spontaneous Joy & Wonder',
    description: 'The creative, raw emotional part of the psyche that thrives on safety, exploration, and aesthetic nourishment.',
    baseColor: 'bg-sky-100 border-sky-400 text-sky-950',
    particleColor: '#38BDF8',
    eyesType: 'happy',
    faceSvg: 'happy',
    defaultAnimation: 'float',
    defaultEmotion: 'happy'
  },
  {
    id: 'anxious-protector',
    name: 'Anxious Protector',
    sub: 'Hyper-vigilant Critic Block',
    description: 'Internalized coping mechanism that sounds alarm bells to shield your vulnerability. Shivers and moves rapidly under stress.',
    baseColor: 'bg-rose-100 border-rose-400 text-rose-950',
    particleColor: '#FB7185',
    eyesType: 'concerned',
    faceSvg: 'concerned',
    defaultAnimation: 'vibrate',
    defaultEmotion: 'concerned'
  },
  {
    id: 'somatic-peacefinder',
    name: 'The Somatic Peacekeeper',
    sub: 'Enteric & Vagal Center',
    description: 'Represents the autonomic nervous system when resting in a safe, social engagement state. Soft breathing movements.',
    baseColor: 'bg-emerald-100 border-emerald-400 text-emerald-950',
    particleColor: '#34D399',
    eyesType: 'calm',
    faceSvg: 'calm',
    defaultAnimation: 'pulse',
    defaultEmotion: 'calm'
  }
];

const PRESET_ARCHETYPES = [
  'The Zen Sage',
  'The Creative Dreamer',
  'The Vigilant Protector',
  'The Somatic Peacekeeper',
  'The Melancholic Poet',
  'The Perfectionist Critic',
  'The Playful Explorer',
  'The Wise Mentor',
  'The Compassionate Inner Healer'
];

export default function CharacterStudio() {
  const [activeCharId, setActiveCharId] = useState<string>('wise-elder');
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'calm' | 'concerned'>('calm');
  const [activeAnim, setActiveAnim] = useState<'float' | 'pulse' | 'vibrate' | 'still'>('pulse');
  
  // Custom characters support (file upload simulation)
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('');
  
  // Audio state (Enable voice triggers by default)
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Character Voice Profile state
  const [characterVoiceProfiles, setCharacterVoiceProfiles] = useState<Record<string, Record<'happy' | 'calm' | 'concerned', string>>>(() => {
    try {
      const saved = localStorage.getItem('character_voice_profiles');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [voiceTargetEmotion, setVoiceTargetEmotion] = useState<'happy' | 'calm' | 'concerned'>('calm');
  const [isRecordingProfile, setIsRecordingProfile] = useState(false);
  const [calibratorTab, setCalibratorTab] = useState<'profiles' | 'logs'>('profiles');

  useEffect(() => {
    localStorage.setItem('character_voice_profiles', JSON.stringify(characterVoiceProfiles));
  }, [characterVoiceProfiles]);
  
  // Dialogue state
  const [dialogueText, setDialogueText] = useState('Welcome back. Let us calibrate our somatic alignment together.');
  const [balloonVisible, setBalloonVisible] = useState(true);
  
  // Personality Archetypes
  const [assignedArchetypes, setAssignedArchetypes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('character_assigned_archetypes');
    if (saved) return JSON.parse(saved);
    return {
      'wise-elder': 'The Zen Sage',
      'inner-child': 'The Creative Dreamer',
      'anxious-protector': 'The Vigilant Protector',
      'somatic-peacefinder': 'The Somatic Peacekeeper',
      'custom': 'The Unbound Companion'
    };
  });

  useEffect(() => {
    localStorage.setItem('character_assigned_archetypes', JSON.stringify(assignedArchetypes));
  }, [assignedArchetypes]);

  const currentKey = customImageSrc ? 'custom' : activeCharId;
  const currentArchetype = assignedArchetypes[currentKey] || 'The Unbound Companion';
  
  // Sentiment Analyzing Logger
  const [journalInput, setJournalInput] = useState('');
  const [sentimentLogs, setSentimentLogs] = useState<SentimentLog[]>(() => {
    const saved = localStorage.getItem('character_sentiment_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'seed-1',
        text: 'Woke up feeling deeply well-rested and looking forward to painting the study canvas.',
        detectedEmotion: 'happy',
        timestamp: '10:00 AM'
      },
      {
        id: 'seed-2',
        text: 'Got slightly overwhelmed by the sudden server alert, but took 3 biological sigh breaths to drop my heart rate.',
        detectedEmotion: 'calm',
        timestamp: '1:45 PM'
      }
    ];
  });

  const [activeSceneTab, setActiveSceneTab] = useState<SceneId>('therapy-room');
  const [showCanvaTutorial, setShowCanvaTutorial] = useState(false);

  // Microphone & Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVoiceNotes, setRecordedVoiceNotes] = useState<Array<{ id: string; url: string; duration: number; timestamp: string }>>(() => {
    try {
      const saved = localStorage.getItem('character_voice_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const recordingCharKeyRef = useRef<string>('');
  const recordingEmotionRef = useRef<'happy' | 'calm' | 'concerned'>('calm');

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startRecording = async (isProfile: boolean = false) => {
    try {
      recordingCharKeyRef.current = currentKey;
      recordingEmotionRef.current = voiceTargetEmotion;
      setIsRecordingProfile(isProfile);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      voiceChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          voiceChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          if (isProfile) {
            setCharacterVoiceProfiles(prev => {
              const charKey = recordingCharKeyRef.current;
              const emotionKey = recordingEmotionRef.current;
              const charProfiles = prev[charKey] || {};
              const updated = {
                ...prev,
                [charKey]: {
                  ...charProfiles,
                  [emotionKey]: base64Audio
                }
              };
              return updated;
            });
            const charName = customImageSrc ? 'Custom Canva Character' : activeChar.name;
            setDialogueText(`Assigned new vocal snippet to ${charName} under ${recordingEmotionRef.current} triggers!`);
            setBalloonVisible(true);
          } else {
            const newVoiceNote = {
              id: Date.now().toString(),
              url: base64Audio,
              duration: recordingTime,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setRecordedVoiceNotes(prev => {
              const updated = [newVoiceNote, ...prev];
              localStorage.setItem('character_voice_notes', JSON.stringify(updated));
              return updated;
            });
            setDialogueText("Logged your somatic soundscape! Play it back or record a new note.");
            setBalloonVisible(true);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      setIsRecording(true);
      setRecordingTime(0);
      mediaRecorder.start();

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const scaledVol = Math.min(average / 90, 1.2);
        setMicVolume(scaledVol);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      animationFrameRef.current = requestAnimationFrame(updateVolume);
      setDialogueText("Listening closely to your voice... Watch me react to the sound level!");
      setBalloonVisible(true);

    } catch (err) {
      console.error("Microphone access failed", err);
      setDialogueText("Microphone access is required to capture somatic audio feedback.");
      setBalloonVisible(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }

    setIsRecording(false);
    setMicVolume(0);
  };

  const deleteVoiceNote = (id: string) => {
    setRecordedVoiceNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('character_voice_notes', JSON.stringify(updated));
      return updated;
    });
  };

  const playVoiceSnippet = (base64Audio: string) => {
    if (!base64Audio) return;
    try {
      const audio = new Audio(base64Audio);
      audio.volume = 1.0;
      audio.play().catch(err => {
        console.warn("Autoplay was blocked or execution error:", err);
      });
    } catch (e) {
      console.error("Failed to play voice snippet", e);
    }
  };

  const isInitialVoiceTrigger = useRef(true);
  useEffect(() => {
    if (isInitialVoiceTrigger.current) {
      isInitialVoiceTrigger.current = false;
      return;
    }
    if (soundEnabled) {
      const snippet = characterVoiceProfiles[currentKey]?.[currentEmotion];
      if (snippet) {
         playVoiceSnippet(snippet);
      }
    }
  }, [currentEmotion, currentKey, soundEnabled, characterVoiceProfiles]);

  useEffect(() => {
    localStorage.setItem('character_sentiment_logs', JSON.stringify(sentimentLogs));
  }, [sentimentLogs]);

  // Synchronize base template transitions
  const activeChar = CHARACTER_TEMPLATES.find(c => c.id === activeCharId) || CHARACTER_TEMPLATES[0];

  useEffect(() => {
    if (!customImageSrc) {
      setCurrentEmotion(activeChar.defaultEmotion);
      setActiveAnim(activeChar.defaultAnimation);
    }
  }, [activeCharId, customImageSrc]);

  // Analyze simple keyword-based sentiment rules
  const handleAnalyzeSentiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalInput.trim()) return;

    const lower = journalInput.toLowerCase();
    let detected: 'happy' | 'calm' | 'concerned' = 'calm';

    // Sentiment logic
    const happyKeywords = ['joy', 'happy', 'excited', 'wonderful', 'yay', 'celebrate', 'art', 'love', 'accomplised', 'victory', 'great', 'fun', 'nice'];
    const concernedKeywords = ['fear', 'anxious', 'concerned', 'worry', 'scared', 'shaking', 'overwhelmed', 'frustrate', 'irritated', 'bad', 'panic', 'deadline', 'critical', 'tired', 'stuck'];
    const calmKeywords = ['peace', 'calm', 'rest', 'breathe', 'sigh', 'mindful', 'nature', 'still', 'quiet', 'meditate', 'zen', 'congruence'];

    const countMatches = (list: string[]) => list.filter(word => lower.includes(word)).length;

    const happyCount = countMatches(happyKeywords);
    const concernedCount = countMatches(concernedKeywords);
    const calmCount = countMatches(calmKeywords);

    if (concernedCount > happyCount && concernedCount > calmCount) {
      detected = 'concerned';
    } else if (happyCount > concernedCount && happyCount > calmCount) {
      detected = 'happy';
    } else if (calmCount >= happyCount && calmCount >= concernedCount) {
      detected = 'calm';
    } else {
      // Fallback depending on length or content
      detected = lower.length % 3 === 0 ? 'calm' : (lower.length % 3 === 1 ? 'happy' : 'concerned');
    }

    const newLog: SentimentLog = {
      id: Date.now().toString(),
      text: journalInput.trim(),
      detectedEmotion: detected,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSentimentLogs([newLog, ...sentimentLogs]);
    setCurrentEmotion(detected);
    
    // Automatically match suitable kinetic loop
    if (detected === 'concerned') {
      setActiveAnim('vibrate');
      setDialogueText("I notice a rise in somatic tension and defensive alarm. Let us ground together...");
    } else if (detected === 'happy') {
      setActiveAnim('float');
      setDialogueText("This energy of joy is beautiful! Feel the chest and breathing expand in solidarity.");
    } else {
      setActiveAnim('pulse');
      setDialogueText("Resting in stable homeostasis. You are perfectly unified and congruent here.");
    }

    setJournalInput('');
    setBalloonVisible(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageSrc(event.target.result as string);
          setCustomImageName(file.name);
          setDialogueText(`Successfully rigged Canva character: ${file.name}! Try changing emotions and animations below.`);
          setBalloonVisible(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCustomCharacter = () => {
    setCustomImageSrc(null);
    setCustomImageName('');
    setDialogueText("Returned to vector system templates. How are we aligning today?");
  };

  // Determine motion animation configurations
  const getAnimationProps = () => {
    if (isRecording) {
      return {
        animate: {
          scale: 1 + (micVolume * 0.35),
          y: [-2, 2, -2],
          rotate: [0, (micVolume * 6), 0]
        },
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      };
    }

    switch (activeAnim) {
      case 'float':
        return {
          animate: {
            y: [-12, 12, -12],
            rotate: [-2, 2, -2]
          },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'pulse':
        return {
          animate: {
            scale: [1, 1.05, 1],
            y: [-3, 3, -3]
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'vibrate':
        return {
          animate: {
            x: [-1.5, 1.5, -1, 1, 0],
            y: [-1, 1, -1.5, 1.5, 0],
            rotate: [-0.5, 0.5, -0.5, 0.5, 0]
          },
          transition: {
            duration: 0.25,
            repeat: Infinity,
            ease: "linear"
          }
        };
      case 'still':
      default:
        return {
          animate: {
            scale: [1, 1.02, 1],
            y: [-1, 1, -1]
          },
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
    }
  };

  // Scene gradients
  const getSceneStyle = () => {
    switch (activeSceneTab) {
      case 'nature':
        return 'bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 text-slate-800 border-emerald-950/20';
      case 'nebula':
        return 'bg-gradient-to-b from-white via-indigo-950 to-slate-50 text-white border-indigo-950/50';
      case 'therapy-room':
        return 'bg-gradient-to-b from-slate-100 via-indigo-50/20 to-slate-50 text-slate-900 border-slate-200 border';
      case 'minimal':
      default:
        return 'bg-white text-slate-900 border border-slate-200';
    }
  };

  return (
    <div id="character-studio-root" className="bg-white text-slate-900 border-2 border-slate-200 p-6 md:p-8 rounded-3xl max-w-5xl mx-auto space-y-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      
      {/* Top Brand Block */}
      <div className="border-b-2 border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-950 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-700" />
            </div>
            <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight">Inner Parts Studio</h2>
          </div>
          <p className="text-xs text-slate-600 font-bold mt-1">
            Give a face and a voice to the different parts of you — the Protector, the Critic,
            the Inner Healer — so you can hear what each one is actually trying to say.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCanvaTutorial(!showCanvaTutorial)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-black rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-slate-700" />
            Canva Secrets
          </button>
        </div>
      </div>

      {/* Canva secrets tutorial banner */}
      <AnimatePresence>
        {showCanvaTutorial && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white text-[#3C3C3C] border-2 border-slate-200 p-4 rounded-2xl text-[11.5px] leading-relaxed space-y-3 font-medium shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-black uppercase">Guide</span>
                <span className="font-bold text-slate-800 text-xs">How to Prepare & Rig Canva Characters</span>
              </div>
              <button
                onClick={() => setShowCanvaTutorial(false)}
                className="text-slate-400 hover:text-slate-700 font-black text-xs cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-indigo-600 font-black">1. Export Transparent PNG</span>
                <p className="text-slate-600">
                  Build your companion or stress character in Canva. When downloading, choose <strong>PNG</strong> format and check the **"Transparent Background"** box (requires Canva premium/education, or use a free background eraser tool).
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-indigo-600 font-black">2. Center Your Canvas</span>
                <p className="text-slate-600">
                  Make sure your character occupies the center 75% of the frame in Canva, so the pivot point of float and hover scales looks perfectly balanced.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-indigo-600 font-black">3. Rig with Sentiment & Motion</span>
                <p className="text-slate-600">
                  Use the upload section here to load your transparent PNG. Our studio will automatically inject pre-calculated float frequencies, physical shivers, and sentiment glows!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: ANIMATION STAGE (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Main Stage Panel */}
          <div className={`relative h-[380px] rounded-3xl border-2 border-slate-200 p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 ${getSceneStyle()}`}>
            
            {/* Stage controls & Scene labels */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 bg-white/95 text-slate-900 px-2.5 py-1 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-2xs shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span>{SCENE_LABELS[activeSceneTab]}</span>
              </div>
              
              {/* Scene toggles */}
              <div className="flex items-center gap-1 bg-white/90 p-1 border border-slate-200 rounded-lg shrink-0">
                {(['therapy-room', 'nature', 'nebula', 'minimal'] as const).map((scene) => (
                  <button
                    key={scene}
                    onClick={() => setActiveSceneTab(scene)}
                    className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-tight transition cursor-pointer ${
                      activeSceneTab === scene
                        ? 'bg-white text-[#3C3C3C]'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {scene === 'therapy-room' ? '🛋️' : scene === 'nature' ? '🌿' : scene === 'nebula' ? '🌌' : '⚖️'}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Render Container */}
            <div className="flex-1 flex items-center justify-center relative my-4">
              
              {/* Particle glow ring (Framer Motion) */}
              <motion.div
                animate={{
                  scale: currentEmotion === 'happy' ? [0.9, 1.25, 0.9] : (currentEmotion === 'concerned' ? [1, 1.05, 1] : [0.95, 1.1, 0.95]),
                  rotate: [0, 360],
                  opacity: currentEmotion === 'concerned' ? 0.35 : 0.7
                }}
                transition={{
                  scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 25, repeat: Infinity, ease: 'linear' }
                }}
                className="absolute w-44 h-44 rounded-full blur-xl pointer-events-none"
                style={{
                  backgroundColor: customImageSrc ? '#4F46E5' : activeChar.particleColor,
                  opacity: 0.4
                }}
              />

              {/* Character Avatar Wrapper */}
              <motion.div
                {...getAnimationProps()}
                className="relative z-10 select-none flex flex-col items-center cursor-pointer"
              >
                {/* Dialogue Balloon */}
                <AnimatePresence>
                  {balloonVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.9 }}
                      className="absolute bottom-full mb-4 max-w-[200px] bg-white text-[#3C3C3C] px-3.5 py-2.5 rounded-2xl text-[10.5px] font-bold text-center leading-normal shadow-lg border border-slate-200"
                    >
                      <p className="text-[#3C3C3C]">{dialogueText}</p>
                      {/* Triangle tail — matches the white bubble body (was near-black, mismatched) */}
                      <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Character visual rendering */}
                {customImageSrc ? (
                  /* Render user-uploaded Canva character transparent image */
                  <div className="relative">
                    <img
                      src={customImageSrc}
                      alt={customImageName}
                      referrerPolicy="no-referrer"
                      className="w-40 h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
                    />
                    
                    {/* Emotion Overlay (Simulated emotion eyes indicators floating above image to rig it!) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute top-12 flex gap-6 mt-1.5 opacity-80">
                        {currentEmotion === 'happy' && (
                          <>
                            <span className="text-xl">✨</span>
                            <span className="text-xl">✨</span>
                          </>
                        )}
                        {currentEmotion === 'concerned' && (
                          <>
                            <span className="text-lg">💧</span>
                            <span className="text-lg">💧</span>
                          </>
                        )}
                        {currentEmotion === 'calm' && (
                          <>
                            <span className="text-lg">⭐</span>
                            <span className="text-lg">⭐</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard high-contrast vector template character block */
                  <div className={`w-36 h-36 rounded-[2.5rem] border-3 border-slate-200 flex flex-col justify-between p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${activeChar.baseColor}`}>
                    
                    {/* Top accessory */}
                    <div className="flex justify-between items-center text-[10px] font-mono font-black uppercase">
                      <span>lvl 1</span>
                      <span className="px-1.5 bg-white rounded text-[8px] tracking-wide">archetype</span>
                    </div>

                    {/* Facial expression SVG rig */}
                    <div className="flex-1 flex flex-col items-center justify-center my-3 select-none">
                      
                      {/* Interactive face rig */}
                      <svg viewBox="0 0 100 60" className="w-16 h-12 fill-none stroke-current stroke-[7] stroke-linecap-round">
                        
                        {/* Eyes */}
                        {currentEmotion === 'happy' && (
                          <>
                            {/* Curved laughing eyes ^ ^ */}
                            <path d="M 20,25 Q 30,15 40,25" />
                            <path d="M 60,25 Q 70,15 80,25" />
                          </>
                        )}

                        {currentEmotion === 'calm' && (
                          <>
                            {/* Soft straight relaxed eyes - - */}
                            <line x1="20" y1="22" x2="40" y2="22" />
                            <line x1="60" y1="22" x2="80" y2="22" />
                          </>
                        )}

                        {currentEmotion === 'concerned' && (
                          <>
                            {/* Sad slight downwards curves \_ _/ or diagonal slants */}
                            <path d="M 22,20 L 38,28" />
                            <path d="M 78,20 L 62,28" />
                          </>
                        )}

                        {/* Smile / Mouth */}
                        {currentEmotion === 'happy' && (
                          <path d="M 30,42 Q 50,56 70,42" fill="none" className="stroke-[8]" />
                        )}
                        {currentEmotion === 'calm' && (
                          <line x1="38" y1="45" x2="62" y2="45" className="stroke-[6]" />
                        )}
                        {currentEmotion === 'concerned' && (
                          <path d="M 38,48 Q 50,40 62,48" fill="none" className="stroke-[6]" />
                        )}
                      </svg>

                    </div>

                    {/* Bottom identity tag */}
                    <p className="text-[9.5px] font-black text-center truncate uppercase tracking-tight">{activeChar.name.split(' (')[0]}</p>
                  </div>
                )}

                {/* Personality Archetype Text Overlay with Morphing Transition */}
                <div className="mt-4 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentArchetype}
                      initial={{ opacity: 0, scale: 0.8, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -12 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      <motion.div
                        animate={
                          currentEmotion === 'happy'
                            ? {
                                scale: [1, 1.07, 1],
                                opacity: [0.85, 1, 0.85],
                                y: [-2, 1, -2]
                              }
                            : currentEmotion === 'concerned'
                            ? {
                                x: [-1, 1, -1, 1, 0],
                                opacity: [0.35, 0.95, 0.35],
                                scale: [0.97, 1.03, 0.97]
                              }
                            : {
                                scale: [0.99, 1.02, 0.99],
                                opacity: [0.6, 0.9, 0.6]
                              }
                        }
                        transition={
                          currentEmotion === 'happy'
                            ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                            : currentEmotion === 'concerned'
                            ? { duration: 0.85, repeat: Infinity, ease: 'easeInOut' }
                            : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                        }
                        className={`px-3 py-1 text-[10.5px] font-black uppercase tracking-wider rounded-md border border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          currentEmotion === 'happy'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : currentEmotion === 'concerned'
                            ? 'bg-rose-100 text-rose-950 border-rose-400'
                            : 'bg-white text-slate-900 border-slate-200'
                        }`}
                      >
                        🎭 {currentArchetype}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Bottom mini-dashboard inside stage */}
            <div className="flex items-end justify-between z-10">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 bg-white/70 px-1 py-0.5 rounded inline-block">Active companion</p>
                <h4 className="text-xs font-black text-slate-950 mt-1">
                  {customImageSrc ? `Canva: ${customImageName}` : activeChar.name}
                </h4>
                <p className="text-[9.5px] font-semibold text-slate-700 mt-0.5 leading-none max-w-sm truncate">
                  {customImageSrc ? 'Armed transparent frame' : activeChar.sub}
                </p>
              </div>

              {/* Click to expand speech balloon triggers */}
              <button
                type="button"
                onClick={() => setBalloonVisible(!balloonVisible)}
                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shadow-3xs"
                title="Toggle Speech"
              >
                <MessageSquare className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Canva transparent file uploader zone */}
          <div className="border-2 border-dashed border-slate-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Rig Your Custom Canva Image</span>
              <p className="text-[10.5px] text-slate-600 font-semibold leading-tight">
                Upload a transparent PNG character from Canva to test interactive animations.
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {customImageSrc && (
                <button
                  type="button"
                  onClick={clearCustomCharacter}
                  className="px-3 py-1.5 border border-red-200 text-red-600 font-bold text-xs rounded-lg hover:bg-red-50/50 cursor-pointer"
                >
                  Clear Custom
                </button>
              )}

              <label className="px-3.5 py-1.5 bg-white hover:bg-white text-[#3C3C3C] border border-slate-200 text-xs font-black rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PNG</span>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Somatic Voice Calibrator Section */}
          <div className="border-2 border-slate-200 p-5 rounded-2xl space-y-4 bg-gradient-to-br from-indigo-50/40 via-white to-pink-50/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-950">Somatic Voice Calibrator</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Voice Feedback sound toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg border flex items-center gap-1 transition-all text-[10px] font-black uppercase cursor-pointer ${
                    soundEnabled 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                  title={soundEnabled ? "Mute automatic voice playback" : "Unmute automatic voice playback"}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Sound On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Muted</span>
                    </>
                  )}
                </button>

                {isRecording && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-300 text-[9px] font-black rounded-lg animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>REC {recordingTime}s</span>
                  </span>
                )}
              </div>
            </div>

            {/* Segment Tab Selector */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => setCalibratorTab('profiles')}
                className={`py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer text-center ${
                  calibratorTab === 'profiles'
                    ? 'bg-white text-slate-950 shadow-3xs hover:bg-white'
                    : 'text-slate-500 hover:text-slate-800 bg-transparent'
                }`}
              >
                🎙️ Voice Profiles
              </button>
              <button
                type="button"
                onClick={() => setCalibratorTab('logs')}
                className={`py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer text-center ${
                  calibratorTab === 'logs'
                    ? 'bg-white text-slate-950 shadow-3xs hover:bg-white'
                    : 'text-slate-500 hover:text-slate-800 bg-transparent'
                }`}
              >
                🌊 Somatic Wave Logs
              </button>
            </div>

            {calibratorTab === 'profiles' ? (
              <div className="space-y-4">
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-900 block">Voice Profile for: {customImageSrc ? 'Custom Companion' : activeChar.name}</span>
                  <p className="text-[10.5px] text-slate-600 font-semibold leading-tight">
                    Record voice clips for specific emotional triggers. The character will instantly voice these snippets whenever their emotion changes!
                  </p>
                </div>

                {/* Target Emotion selector state for profile */}
                <div className="space-y-1.5">
                  <span className="text-[9.5px] font-black text-slate-500 uppercase block">1. Select Target Trigger Emotion</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['happy', 'calm', 'concerned'] as const).map((emo) => {
                      const isSelected = voiceTargetEmotion === emo;
                      const hasVoice = !!characterVoiceProfiles[currentKey]?.[emo];
                      return (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setVoiceTargetEmotion(emo)}
                          className={`p-1.5 rounded-lg border text-[10px] font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="capitalize">{emo === 'concerned' ? 'Concerned' : emo === 'happy' ? 'Happy' : 'Calm'}</span>
                          <span className={`text-[8.5px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {hasVoice ? '🔊 Saved' : '🔇 Empty'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recording interface specific to profiles */}
                <div className="space-y-2">
                  <span className="text-[9.5px] font-black text-slate-500 uppercase block">2. Record and Map Snippet</span>
                  
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={() => startRecording(true)}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white border border-slate-200 text-xs font-black rounded-xl transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs text-[11px]"
                    >
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>Record {voiceTargetEmotion === 'happy' ? '😊 Happy Trigger' : voiceTargetEmotion === 'concerned' ? '🥺 Concerned Trigger' : '🧘 Calm Trigger'}</span>
                    </button>
                  ) : isRecordingProfile ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white border border-slate-200 text-xs font-black rounded-xl transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer animate-pulse text-[11px]"
                    >
                      <MicOff className="w-4 h-4 text-white" />
                      <span>Stop & Connect to {voiceTargetEmotion.toUpperCase()}</span>
                    </button>
                  ) : (
                    <div className="text-center p-2 text-[10px] text-slate-500 font-bold bg-slate-100 border border-dashed rounded-lg">
                      Currently busy recording somatic log...
                    </div>
                  )}
                </div>

                {/* Status Matrix mapping of Profiles */}
                <div className="space-y-2 border-t border-slate-200/60 pt-3">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Character Voice Profile Status</span>
                  
                  <div className="space-y-1.5">
                    {(['happy', 'calm', 'concerned'] as const).map((emo) => {
                      const base64Audio = characterVoiceProfiles[currentKey]?.[emo];
                      return (
                        <div 
                          key={emo} 
                          className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs transition hover:border-slate-400"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {emo === 'happy' ? '😊' : emo === 'calm' ? '🧘' : '🥺'}
                            </span>
                            <div>
                              <p className="font-bold text-slate-950 leading-none capitalize text-[11px]">{emo} state voice</p>
                              <p className="text-[9px] text-slate-400 mt-1 leading-none">
                                {base64Audio ? 'Frequency sample saved' : 'No sound mapped yet'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {base64Audio ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => playVoiceSnippet(base64Audio)}
                                  className="p-1 px-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[9.5px] rounded-lg hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition active:scale-95"
                                  title="Test play snippet"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Test Play</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCharacterVoiceProfiles(prev => {
                                      const charProfiles = { ...(prev[currentKey] || {}) };
                                      delete charProfiles[emo];
                                      const updated = {
                                        ...prev,
                                        [currentKey]: charProfiles
                                      };
                                      return updated;
                                    });
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition"
                                  title="Clear snippet"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setVoiceTargetEmotion(emo);
                                  setCalibratorTab('profiles');
                                }}
                                className="p-1 px-2 border border-dashed border-slate-300 text-slate-500 text-[9px] font-bold rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition cursor-pointer"
                              >
                                Record Snippet
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  Capture your real-time voice frequencies. Speaking drives the companion's biological scaling pulse live.
                </p>

                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={() => startRecording(false)}
                      className="flex-1 py-2 bg-white hover:bg-white text-[#3C3C3C] border-2 border-slate-200 text-xs font-black rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
                    >
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>Start Voice Capture</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white border-2 border-slate-200 text-xs font-black rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-3xs animate-pulse"
                    >
                      <MicOff className="w-4 h-4 text-white" />
                      <span>Stop & Save Note</span>
                    </button>
                  )}
                </div>

                {/* Live Reactivity Indicator (Fidelity feedback bar) */}
                <div className="bg-white text-[#3C3C3C] p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[9.5px] font-mono uppercase font-bold text-slate-400 font-black">
                    <span>Vocal Amplitude Feed</span>
                    <span>{(micVolume * 100).toFixed(0)}% db</span>
                  </div>

                  <div className="flex items-end justify-center gap-1 h-12 bg-white rounded-lg p-2 overflow-hidden border border-slate-200">
                    {isRecording ? (
                      Array.from({ length: 16 }).map((_, i) => {
                        const factor = Math.sin((i / 15) * Math.PI) * 0.5 + 0.5;
                        const barHeight = Math.max(4, Math.round(micVolume * 36 * factor + Math.random() * 6));
                        return (
                          <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-indigo-500 to-pink-400 rounded-sm"
                            style={{ height: `${barHeight}px` }}
                            animate={{ height: `${barHeight}px` }}
                            transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                          />
                        );
                      })
                    ) : (
                      <div className="text-[10px] text-slate-500 font-bold self-center">
                        Microphone Idle - Waveform will render here
                      </div>
                    )}
                  </div>
                </div>

                {/* Recorded sound tracks stream list */}
                {recordedVoiceNotes.length > 0 && (
                  <div className="space-y-2 border-t border-slate-200/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">Somatic Sound Logs ({recordedVoiceNotes.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRecordedVoiceNotes([]);
                          localStorage.removeItem('character_voice_notes');
                        }}
                        className="text-[9.5px] font-bold text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
                      {recordedVoiceNotes.map((note) => (
                        <div key={note.id} className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
                              <Volume2 className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-900 text-[11px] leading-tight">Somatic Note • {note.duration}s</p>
                              <p className="text-[9px] text-slate-400 leading-none">{note.timestamp}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <audio src={note.url} controls className="h-6 max-w-[120px] scale-90 origin-right text-[10px]" />
                            <button
                              type="button"
                              onClick={() => deleteVoiceNote(note.id)}
                              className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: RIGGING INTERFACE & SENTIMENT (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="border-2 border-slate-200 p-5 rounded-2xl space-y-5">
            
            {/* Rigging Controls (Emotions & Kinetics) */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-500 block">I. Kinetic & Emotion Rig</span>
              
              <div className="space-y-2">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Choose State Override</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentEmotion('happy');
                      setDialogueText("Spontaneous growth energy is rising! Absolute gratitude state.");
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer text-center ${
                      currentEmotion === 'happy'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-3xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">happy 😊</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentEmotion('calm');
                      setDialogueText("Quiet alignment stable. The prefrontal-cardiac balance is steady.");
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer text-center ${
                      currentEmotion === 'calm'
                        ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-3xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">calm 🧘</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentEmotion('concerned');
                      setDialogueText("Hypervigilant safeguarding mode active. Deep sigh breaths required.");
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer text-center ${
                      currentEmotion === 'concerned'
                        ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-3xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">concerned 🥺</span>
                  </button>
                </div>
              </div>

              {/* Kinetic Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Loop Motions</span>
                <div className="grid grid-cols-4 gap-1">
                  {(['float', 'pulse', 'vibrate', 'still'] as const).map((anim) => (
                    <button
                      key={anim}
                      onClick={() => setActiveAnim(anim)}
                      className={`py-1.5 rounded-lg border text-[9.5px] font-black uppercase text-center transition cursor-pointer ${
                        activeAnim === anim
                          ? 'bg-white text-[#3C3C3C] border-slate-200 shadow-3xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {anim === 'still' ? 'breathe' : anim}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Template selection */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-black uppercase text-slate-500 block">II. Companion Core Archetypes</span>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight mb-2">
                Switch psychodynamic model baselines (automatically resets vector colors & faces).
              </p>
              
              <div className="space-y-1.5">
                {CHARACTER_TEMPLATES.map((char) => {
                  const isCur = activeCharId === char.id && !customImageSrc;
                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        setActiveCharId(char.id);
                        setCustomImageSrc(null); // Clear custom upload
                      }}
                      className={`p-2.5 rounded-xl border text-left w-full transition flex items-center justify-between gap-2.5 cursor-pointer ${
                        isCur 
                          ? 'bg-white text-[#3C3C3C] border-slate-200 scale-102 z-10 shadow-3xs' 
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider block">{char.name}</span>
                        <span className={`text-[8.5px] font-medium leading-none truncate block mt-0.5 ${isCur ? 'text-slate-300' : 'text-slate-500'}`}>
                          {char.sub}
                        </span>
                      </div>
                      
                      <span className="text-[11px] font-mono font-bold shrink-0">
                        {char.defaultAnimation}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Dialogue Rigging input */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <label className="text-[10px] font-black uppercase text-slate-500 block">III. Companion Dialogue Puppeteering</label>
              <input
                type="text"
                value={dialogueText}
                onChange={(e) => {
                  setDialogueText(e.target.value);
                  setBalloonVisible(true);
                }}
                className="w-full p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-200 focus:bg-white text-slate-900 outline-none"
                placeholder="Rig a customized statement balloon..."
              />
            </div>

            {/* Personality Archetype Assignment */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-[10px] font-black uppercase text-slate-500 block">IV. Personality Archetype Assignment</label>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                Assign a custom clinical, spiritual, or playful role to this companion avatar.
              </p>
              
              {/* Preset buttons */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {PRESET_ARCHETYPES.map((arch) => {
                  const isActive = currentArchetype === arch;
                  return (
                    <button
                      key={arch}
                      type="button"
                      onClick={() => {
                        setAssignedArchetypes(prev => ({
                          ...prev,
                          [currentKey]: arch
                        }));
                      }}
                      className={`px-2 py-1 rounded-md border text-[9px] font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#3C3C3C] border-slate-200 shadow-3xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {arch}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="flex gap-1.5 mt-1">
                <input
                  type="text"
                  value={currentArchetype}
                  onChange={(e) => {
                    setAssignedArchetypes(prev => ({
                      ...prev,
                      [currentKey]: e.target.value
                    }));
                  }}
                  className="flex-1 p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-200 focus:bg-white text-slate-900 outline-none"
                  placeholder="Or enter a bespoke archetype name..."
                />
              </div>
            </div>

          </div>

          {/* Sentiment Tracker & Logger Form */}
          <div className="border-2 border-slate-200 p-4 rounded-2xl space-y-3 bg-indigo-50/30">
            <span className="text-[9.5px] font-black uppercase text-indigo-800 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded-md inline-block">
              V. Sentiment Analyzer Rig
            </span>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              Express your feelings/thoughts. Our analyzer processes keywords to adapt your character's posture automatically.
            </p>

            <form onSubmit={handleAnalyzeSentiment} className="flex gap-1.5">
              <input
                type="text"
                value={journalInput}
                onChange={(e) => setJournalInput(e.target.value)}
                placeholder="e.g., I feel tranquil and deeply rest, listening to calm rivers..."
                className="flex-1 p-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:border-slate-200 text-slate-800 outline-none"
              />
              <button
                type="submit"
                className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-950 font-black text-xs rounded-xl border border-slate-200 cursor-pointer transition shrink-0"
              >
                Analyze
              </button>
            </form>

            {/* Mini Log of detections */}
            <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
              {sentimentLogs.map((log) => {
                const getEmoBadge = (emo: 'happy' | 'calm' | 'concerned') => {
                  if (emo === 'happy') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (emo === 'concerned') return 'bg-rose-50 text-rose-800 border-rose-200';
                  return 'bg-sky-50 text-sky-800 border-sky-200';
                };

                return (
                  <div key={log.id} className="p-2 bg-white/85 border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-[10.5px]">
                    <div className="min-w-0 flex-1 leading-snug font-semibold text-slate-800">
                      "{log.text}"
                    </div>
                    <span className={`px-1.5 py-0.5 rounded uppercase font-black text-[8px] tracking-wider shrink-0 mr-1 ${getEmoBadge(log.detectedEmotion)}`}>
                      {log.detectedEmotion}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
