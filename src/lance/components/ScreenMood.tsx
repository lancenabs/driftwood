import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Trash2, CheckCircle2, Mic, MicOff, AlertCircle, ArrowRight, ArrowLeft, Heart, Check, Play, Pause, Square, Volume2 } from 'lucide-react';
import { MoodLog } from '../types';
import StickFigureAnimator from './StickFigureAnimator';
import PlutchikWheel from './PlutchikWheel';
import TtsSpeaker from './TtsSpeaker';

interface ScreenMoodProps {
  moodLogs: MoodLog[];
  onAddMoodLog: (log: MoodLog) => void;
  onClearLogs: () => void;
  // Challenge tracking callbacks (optional — only wired during challenge mode)
  onQuadrantSelected?: () => void;
  onBubblesProceeded?: () => void;
  onReflectionTyped?: () => void;
  onPlutchikProceeded?: () => void;
}

interface MoodBubble {
  word: string;
  description: string;
  left: number; // percentage coordinate
  top: number;  // percentage coordinate
  size: number; // size in pixels
}

// Coordinate setups to make a beautiful organic layout in a 640x640 canvas
const HIGH_GOOD_BUBBLES: MoodBubble[] = [
  { word: "Alive", description: "Filled with vibrant physical energy, safety, and core vitality.", left: 50, top: 50, size: 104 },
  { word: "Excited", description: "Charged with joyful and eager anticipation of good things.", left: 22, top: 22, size: 85 },
  { word: "Determined", description: "Feeling solid, resolved, and completely focused.", left: 34, top: 15, size: 85 },
  { word: "Inspired", description: "Filled with creative warmth and internal motivation.", left: 82, top: 22, size: 85 },
  { word: "Joyful", description: "Experiencing clear, radiant happiness in your soul.", left: 68, top: 38, size: 92 },
  { word: "Focused", description: "Attentive, centered, and physically aligned.", left: 22, top: 48, size: 90 },
  { word: "Delighted", description: "Filled with absolute pleasure, charm, and light satisfaction.", left: 48, top: 72, size: 94 },
  { word: "Amazed", description: "Awestruck, wonderfully surprised, and filled with wonder.", left: 68, top: 18, size: 85 },
  { word: "Confident", description: "Securely aligned with your personal capabilities.", left: 78, top: 52, size: 92 },
  { word: "Eager", description: "Keenly interested and enthusiastically ready.", left: 28, top: 33, size: 84 },
  { word: "Successful", description: "Savoring positive efforts and peaceful validation.", left: 50, top: 26, size: 90 },
  { word: "Playful", description: "Full of sparkling fun, humor, and easy laughter.", left: 24, top: 66, size: 88 },
  { word: "Upbeat", description: "Cheerful, optimistic, and anticipating beautiful moments.", left: 50, top: 38, size: 84 }
];

const HIGH_DOWN_BUBBLES: MoodBubble[] = [
  { word: "Overwhelmed", description: "Overloaded with complex thoughts, emotions, or responsibilities.", left: 50, top: 50, size: 104 },
  { word: "Anxious", description: "Apprehensive, uneasy, or experiencing core physical worry.", left: 22, top: 24, size: 90 },
  { word: "Frustrated", description: "Restless or blocked from being heard, loved, or understood.", left: 78, top: 28, size: 90 },
  { word: "Angry", description: "Surged with active displeasure, irritation, or resentment.", left: 50, top: 25, size: 90 },
  { word: "Restless", description: "Struggling to find physical calm or mental quiet.", left: 22, top: 48, size: 90 },
  { word: "Stressed", description: "Carrying elevated emotional pressure or tight tension.", left: 78, top: 52, size: 92 },
  { word: "Irritated", description: "Annoyed, easily vexed, and struggling with patience.", left: 50, top: 72, size: 92 },
  { word: "Panicked", description: "Feeling an immediate surge of tight, elevated alarm.", left: 22, top: 14, size: 82 },
  { word: "Defensive", description: "Guarding against perceived threats or critical comments.", left: 78, top: 14, size: 84 },
  { word: "Turbulent", description: "Experiencing conflicting, rolling, high feelings.", left: 24, top: 66, size: 86 },
  { word: "Jittery", description: "Highly alert, physically tense, or hyper-stimulated.", left: 50, top: 10, size: 80 }
];

const LOW_GOOD_BUBBLES: MoodBubble[] = [
  { word: "Calm", description: "Aligned, serene, and entirely peaceful in body and heart.", left: 50, top: 50, size: 104 },
  { word: "At Ease", description: "Free from urgent worries or physical discomfort.", left: 22, top: 24, size: 90 },
  { word: "Understood", description: "Feeling recognized, supported, and emotionally seen.", left: 78, top: 28, size: 92 },
  { word: "Loved", description: "Encased in soft warmth, care, and secure connection.", left: 50, top: 25, size: 92 },
  { word: "Relaxed", description: "Experiencing quiet muscles and calm, drifting thoughts.", left: 22, top: 48, size: 90 },
  { word: "Chill", description: "Easygoing, unhurried, and pleasantly content.", left: 78, top: 52, size: 90 },
  { word: "Content", description: "Savoring what is here without needing extra items.", left: 50, top: 72, size: 92 },
  { word: "Grateful", description: "Warmly appreciating life's small advantages and blessings.", left: 22, top: 14, size: 84 },
  { word: "Peaceful", description: "Quiet, stable, and untroubled in your thoughts.", left: 78, top: 14, size: 85 },
  { word: "Safe", description: "Feeling completely sheltered, supported, and secure.", left: 24, top: 66, size: 86 },
  { word: "Serene", description: "Tranquil, clear, and enjoying emotional silence.", left: 50, top: 10, size: 80 }
];

const LOW_DOWN_BUBBLES: MoodBubble[] = [
  { word: "Drained", description: "Completely depleted of emotional and adaptive energy.", left: 50, top: 50, size: 104 },
  { word: "Tired", description: "Feeling core physical or mental exhaustion.", left: 22, top: 24, size: 90 },
  { word: "Sad", description: "Sorrowful, soft, or mourning an expectation or event.", left: 78, top: 28, size: 90 },
  { word: "Lonely", description: "Craving gentle connection, warmth, or human presence.", left: 50, top: 25, size: 92 },
  { word: "Burned Out", description: "Chronically fatigued by extended effort or stress.", left: 22, top: 48, size: 92 },
  { word: "Disappointed", description: "Feeling let down by people, outcomes, or ourselves.", left: 78, top: 52, size: 90 },
  { word: "Numb", description: "Disconnected, listless, or emotionally flat query.", left: 50, top: 72, size: 92 },
  { word: "Heavy", description: "Weighed down by dense thoughts or grief in the heart.", left: 22, top: 14, size: 84 },
  { word: "Bored", description: "Struggling to find stimulation, focus, or interest.", left: 78, top: 14, size: 85 },
  { word: "Hopeless", description: "Struggling to see positive outcomes in the road ahead.", left: 24, top: 66, size: 86 },
  { word: "Left Out", description: "Feeling excluded, forgotten, or quietly isolated.", left: 50, top: 10, size: 80 }
];

const CATEGORIES = [
  {
    id: 'high-good',
    title: 'High Energy • Feeling Good',
    description: 'Feeling vibrant, enthusiastic, and confident. Alert and ready to enjoy life.',
    emoji: '🔥',
    bg: 'from-amber-100 via-amber-50 to-orange-50 border-amber-200 text-amber-900',
    bubbleColor: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 text-slate-900 border-yellow-200',
    selectedBubbleColor: 'bg-gradient-to-br from-yellow-300 to-amber-400 text-slate-950 font-black shadow-[0_0_20px_rgba(250,204,21,0.7)]',
    score: 5,
    label: 'Great',
    bubbles: HIGH_GOOD_BUBBLES,
    accent: '#f59e0b',
    // Vibrant card system: a rich two-tone gradient + matching glow/ring per quadrant,
    // so Step 1's cards read as alive rather than flat pastel tint.
    gradient: 'linear-gradient(150deg, #FDE68A 0%, #FBBF24 45%, #F97316 100%)',
    glow: 'rgba(249,115,22,0.45)',
    ring: '#F97316',
  },
  {
    id: 'high-down',
    title: 'High Energy • Feeling Down',
    description: 'Feeling tense, restless, anxious, or stressed. Charged with nervous energy.',
    emoji: '⚡',
    bg: 'from-rose-100 via-rose-50 to-orange-50 border-rose-200 text-rose-900',
    bubbleColor: 'bg-gradient-to-br from-red-400 via-rose-500 to-orange-500 text-white border-rose-300',
    selectedBubbleColor: 'bg-gradient-to-br from-rose-400 to-orange-600 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.7)]',
    score: 2,
    label: 'Down',
    bubbles: HIGH_DOWN_BUBBLES,
    accent: '#f43f5e',
    gradient: 'linear-gradient(150deg, #FDA4AF 0%, #FB7185 45%, #E11D48 100%)',
    glow: 'rgba(225,29,72,0.45)',
    ring: '#E11D48',
  },
  {
    id: 'low-good',
    title: 'Low Energy • Feeling Good',
    description: 'Feeling calm, relaxed, peaceful, and satisfied. Enjoying quiet comfort.',
    emoji: '🍃',
    bg: 'from-emerald-100 via-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
    bubbleColor: 'bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-400 text-neutral-900 border-emerald-200',
    selectedBubbleColor: 'bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 font-black shadow-[0_0_20px_rgba(52,211,153,0.7)]',
    score: 4,
    label: 'Good',
    bubbles: LOW_GOOD_BUBBLES,
    accent: '#10b981',
    gradient: 'linear-gradient(150deg, #6EE7B7 0%, #34D399 45%, #0D9488 100%)',
    glow: 'rgba(13,148,136,0.45)',
    ring: '#0D9488',
  },
  {
    id: 'low-down',
    title: 'Low Energy • Feeling Down',
    description: 'Feeling heavy, tired, lonely, or drained. Seeking rest or comfort.',
    emoji: '🌧️',
    bg: 'from-slate-200 via-indigo-50/70 to-indigo-50 border-indigo-200 text-indigo-900',
    bubbleColor: 'bg-gradient-to-br from-slate-400 via-indigo-500 to-indigo-800 text-white border-indigo-400',
    selectedBubbleColor: 'bg-gradient-to-br from-indigo-400 to-indigo-950 text-white font-black shadow-[0_0_20px_rgba(99,102,241,0.73)]',
    score: 1,
    label: 'Low',
    bubbles: LOW_DOWN_BUBBLES,
    accent: '#6366f1',
    gradient: 'linear-gradient(150deg, #A5B4FC 0%, #818CF8 45%, #4F46E5 100%)',
    glow: 'rgba(79,70,229,0.45)',
    ring: '#4F46E5',
  }
];

// Utility to parse tagged descriptors from historical log notes
const parseNoteTags = (noteContent?: string) => {
  if (!noteContent) return { tags: [], text: '' };
  const match = noteContent.match(/^\[Tags:\s*([^\]]+)\]\s*(.*)/s);
  if (match) {
    return {
      tags: match[1].split(',').map(t => t.trim()),
      text: match[2],
    };
  }
  return { tags: [], text: noteContent };
};

export default function ScreenMood({ moodLogs, onAddMoodLog, onClearLogs, onQuadrantSelected, onBubblesProceeded, onReflectionTyped, onPlutchikProceeded }: ScreenMoodProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [lastClickedBubble, setLastClickedBubble] = useState<MoodBubble | null>(null);
  // Transient "just selected" word — drives a one-shot sparkle-burst reward animation
  // on the chip that was just tapped, then clears itself.
  const [burstWord, setBurstWord] = useState<string | null>(null);
  const [journalNote, setJournalNote] = useState<string>('');
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // Step 1: Category, Step 2: Bubble field, Step 3: reflection & voice
  const [recentSaved, setRecentSaved] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [wasVoiceUsed, setWasVoiceUsed] = useState(false);
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const [speechError, setSpeechError] = useState<string>('');
  const recognitionRef = React.useRef<any>(null);

  // Audio Note Recording States/Refs
  const [audioMediaRecorder, setAudioMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioRecognitionRef = useRef<any>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(null);
  const [audioPlaybackUrl, setAudioPlaybackUrl] = useState<string | null>(null);
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState(false);
  
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  // History Log active playback state & ref
  const [playingLogVoiceIdx, setPlayingLogVoiceIdx] = useState<number | null>(null);
  const historyAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Search/Filter for easily accessible entries
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState<number | 'all'>('all');

  const [checkInMode, setCheckInMode] = useState<'traditional' | 'plutchik'>('traditional');
  const reflectionNotifiedRef = useRef(false);

  useEffect(() => {
    if (journalNote.length > 0 && !reflectionNotifiedRef.current) {
      reflectionNotifiedRef.current = true;
      onReflectionTyped?.();
    }
  }, [journalNote]);

  const getSynthesizedPlutchikScoreAndCategory = (words: string[]) => {
    if (words.length === 0) {
      return { score: 3, label: 'Okay', emoji: '⚖️', bg: 'from-slate-200 via-indigo-50/70 to-indigo-50 border-indigo-200 text-indigo-900', bubbleColor: '', selectedBubbleColor: '', accent: '#0f766e', title: 'Plutchik Balanced State', gradient: 'linear-gradient(150deg, #6EE7B7 0%, #34D399 45%, #0D9488 100%)', glow: 'rgba(13,148,136,0.45)', ring: '#0D9488' };
    }
    
    let scoreSum = 3.0;
    let totalWeight = 0;
    
    words.forEach(word => {
      if (['Ecstasy', 'Joy', 'Serenity', 'Admiration', 'Trust', 'Acceptance', 'Amazement', 'Surprise', 'Interest', 'Anticipation', 'Vigilance'].includes(word)) {
        if (['Ecstasy', 'Admiration', 'Vigilance'].includes(word)) { scoreSum += 1.8; totalWeight++; }
        else if (['Joy', 'Trust', 'Surprise', 'Anticipation'].includes(word)) { scoreSum += 1.2; totalWeight++; }
        else { scoreSum += 0.6; totalWeight++; }
      } else {
        if (['Terror', 'Grief', 'Rage', 'Loathing'].includes(word)) { scoreSum -= 1.8; totalWeight++; }
        else if (['Fear', 'Sadness', 'Anger', 'Disgust'].includes(word)) { scoreSum -= 1.2; totalWeight++; }
        else { scoreSum -= 0.6; totalWeight++; }
      }
    });

    let finalScore = scoreSum;
    if (totalWeight > 0) {
      finalScore = 3.0 + (scoreSum - 3.0) / totalWeight;
    }
    
    finalScore = Math.max(1.0, Math.min(5.0, Math.round(finalScore * 10) / 10));

    if (finalScore >= 4.0) {
      return {
        score: Math.round(finalScore),
        label: 'Great',
        emoji: '🌿',
        bg: 'from-emerald-100 via-emerald-50 to-teal-50 border-emerald-200 text-emerald-950',
        bubbleColor: '',
        selectedBubbleColor: '',
        accent: '#10b981',
        title: 'Plutchik Synthesis • Harmonious Calm',
        gradient: 'linear-gradient(150deg, #6EE7B7 0%, #34D399 45%, #0D9488 100%)',
        glow: 'rgba(13,148,136,0.45)',
        ring: '#0D9488'
      };
    } else if (finalScore >= 3.0) {
      return {
        score: Math.round(finalScore),
        label: 'Good',
        emoji: '🌿',
        bg: 'from-amber-100 via-amber-50 to-orange-50 border-amber-200 text-amber-950',
        bubbleColor: '',
        selectedBubbleColor: '',
        accent: '#f59e0b',
        title: 'Plutchik Synthesis • Balanced State',
        gradient: 'linear-gradient(150deg, #FDE68A 0%, #FBBF24 45%, #F97316 100%)',
        glow: 'rgba(249,115,22,0.45)',
        ring: '#F97316'
      };
    } else if (finalScore >= 2.0) {
      return {
        score: Math.round(finalScore),
        label: 'Down',
        emoji: '🌩️',
        bg: 'from-rose-100 via-rose-50 to-orange-50 border-rose-200 text-rose-950',
        bubbleColor: '',
        selectedBubbleColor: '',
        accent: '#f43f5e',
        title: 'Plutchik Synthesis • Emotional Surge',
        gradient: 'linear-gradient(150deg, #FDA4AF 0%, #FB7185 45%, #E11D48 100%)',
        glow: 'rgba(225,29,72,0.45)',
        ring: '#E11D48'
      };
    } else {
      return {
        score: Math.round(finalScore),
        label: 'Low',
        emoji: '🌧️',
        bg: 'from-slate-200 via-indigo-50/70 to-indigo-50 border-indigo-200 text-indigo-950',
        bubbleColor: '',
        selectedBubbleColor: '',
        accent: '#6366f1',
        title: 'Plutchik Synthesis • Low Resonance',
        gradient: 'linear-gradient(150deg, #A5B4FC 0%, #818CF8 45%, #4F46E5 100%)',
        glow: 'rgba(79,70,229,0.45)',
        ring: '#4F46E5'
      };
    }
  };

  const handleProceedFromPlutchik = () => {
    if (selectedWords.length === 0) return;
    const virtualCategory = getSynthesizedPlutchikScoreAndCategory(selectedWords);
    setSelectedCategory(virtualCategory as any);
    onPlutchikProceeded?.();
    setStep(3);
  };

  const handleTogglePlutchikWord = (word: string) => {
    setSelectedWords((prev) => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      } else {
        if (prev.length >= 5) {
          return prev;
        }
        return [...prev, word];
      }
    });
  };

  const startSpeechRecognition = () => {
    setSpeechError('');
    const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechLib) {
      setSpeechError("Speech recognition is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    try {
      const recognition = new SpeechLib();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setWasVoiceUsed(true);
      };

      recognition.onresult = (event: any) => {
        const currentResultIndex = event.resultIndex;
        const transcript = event.results[currentResultIndex][0].transcript;
        if (transcript) {
          setJournalNote((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error in Mood tab', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access was denied. Please allow microphone permissions or try opening the app in a new tab.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech was detected. Speak clearly close to your microphone.');
        } else {
          setSpeechError(`Speech notice: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      setSpeechError('Failed to access microphone or speech services.');
      setIsRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Start high-fidelity audio diary entry recording using browser MediaRecorder
  const startRecordingAudio = async () => {
    try {
      setSpeechError('');
      setRecordedAudioBase64(null);
      setAudioPlaybackUrl(null);
      setAudioSeconds(0);
      setIsPlayingAudioPreview(false);
      chunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let recorder: MediaRecorder;
      // Setup options with safeties for browser support
      const options = { mimeType: 'audio/webm' };
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const collectedBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        
        // Convert Blob to Base64
        const fileReader = new FileReader();
        fileReader.readAsDataURL(collectedBlob);
        fileReader.onloadend = () => {
          const b64 = fileReader.result as string;
          setRecordedAudioBase64(b64);
        };

        // Create preview URL
        const previewUrl = URL.createObjectURL(collectedBlob);
        setAudioPlaybackUrl(previewUrl);
        setIsRecordingAudio(false);
      };

      // 🎙️ Integrate basic Web Speech API listener to automatically generate a text transcription
      const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechLib) {
        try {
          const rec = new SpeechLib();
          rec.continuous = true;
          rec.interimResults = false;
          rec.lang = 'en-US';

          rec.onresult = (event: any) => {
            const currentResultIndex = event.resultIndex;
            const transcript = event.results[currentResultIndex][0].transcript;
            if (transcript) {
              setJournalNote((prev) => {
                const trimmed = prev.trim();
                return trimmed ? `${trimmed} ${transcript}` : transcript;
              });
              setWasVoiceUsed(true);
            }
          };

          rec.onerror = (event: any) => {
            console.warn('Voice note browser speech recognition error:', event.error);
          };

          audioRecognitionRef.current = rec;
          rec.start();
        } catch (recognitionErr) {
          console.warn('Could not initialize SpeechRecognition for voice note:', recognitionErr);
        }
      }

      recorder.start();
      setAudioMediaRecorder(recorder);
      setIsRecordingAudio(true);

      // Start 30-second cap countdown
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setAudioSeconds(elapsed);
        if (elapsed >= 30) {
          // Stop automatically at 30 seconds
          clearInterval(timerRef.current);
          if (recorder && recorder.state !== 'inactive') {
            recorder.stop();
          }
          if (audioRecognitionRef.current) {
            try { audioRecognitionRef.current.stop(); } catch (e) {}
            audioRecognitionRef.current = null;
          }
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        }
      }, 1000);

    } catch (err: any) {
      console.error('Failed to record audio:', err);
      setSpeechError('Microphone authorization denied or missing. Please ensure popups/access have been granted or click "Open in a new tab".');
    }
  };

  const stopRecordingAudio = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioRecognitionRef.current) {
      try {
        audioRecognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      audioRecognitionRef.current = null;
    }
    if (audioMediaRecorder && audioMediaRecorder.state !== 'inactive') {
      try {
        audioMediaRecorder.stop();
      } catch (e) {
        console.error(e);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecordingAudio(false);
  };

  const toggleRecordingAudio = () => {
    if (isRecordingAudio) {
      stopRecordingAudio();
    } else {
      startRecordingAudio();
    }
  };

  const handleToggleAudioPreview = () => {
    if (!audioPlaybackUrl) return;

    if (isPlayingAudioPreview) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setIsPlayingAudioPreview(false);
    } else {
      const audio = new Audio(audioPlaybackUrl);
      audioPreviewRef.current = audio;
      setIsPlayingAudioPreview(true);
      
      audio.onended = () => {
        setIsPlayingAudioPreview(false);
      };
      
      audio.onerror = () => {
        setIsPlayingAudioPreview(false);
      };
      
      audio.play().catch(e => {
        console.error(e);
        setIsPlayingAudioPreview(false);
      });
    }
  };

  // Playback helper for existing loaded base64 voice notes in History List
  const handleToggleHistoryVoicePlay = (idx: number, base64Audio: string) => {
    if (playingLogVoiceIdx === idx) {
      if (historyAudioPlayerRef.current) {
        historyAudioPlayerRef.current.pause();
      }
      setPlayingLogVoiceIdx(null);
      return;
    }

    if (historyAudioPlayerRef.current) {
      historyAudioPlayerRef.current.pause();
    }

    const audioObj = new Audio(base64Audio);
    historyAudioPlayerRef.current = audioObj;
    setPlayingLogVoiceIdx(idx);

    audioObj.onended = () => {
      setPlayingLogVoiceIdx(null);
    };

    audioObj.onerror = (e) => {
      console.error('History Audio playback failed', e);
      setPlayingLogVoiceIdx(null);
    };

    audioObj.play().catch(err => {
      console.error('History Audio play promise error', err);
      setPlayingLogVoiceIdx(null);
    });
  };

  // Stop recording and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (audioRecognitionRef.current) {
        try { audioRecognitionRef.current.stop(); } catch (e) {}
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (historyAudioPlayerRef.current) {
        try { historyAudioPlayerRef.current.pause(); } catch (e) {}
      }
    };
  }, []);

  // Stop recognition and audios when switching steps
  useEffect(() => {
    if (step !== 3) {
      stopSpeechRecognition();
      stopRecordingAudio();
      setSpeechError('');
    }
  }, [step]);

  const handleSelectCategory = (cat: typeof CATEGORIES[0]) => {
    setSelectedCategory(cat);
    setSelectedWords([]);
    const centerBubble = cat.bubbles.find(b => b.word === "Alive" || b.word === "Overwhelmed" || b.word == "Calm" || b.word === "Drained") || cat.bubbles[0];
    setLastClickedBubble(centerBubble);
    setStep(2);
    onQuadrantSelected?.();
  };

  const handleBubbleTap = (bubble: MoodBubble) => {
    setLastClickedBubble(bubble);
    setSelectedWords((prev) => {
      if (prev.includes(bubble.word)) {
        return prev.filter(w => w !== bubble.word);
      } else {
        if (prev.length >= 5) {
          return prev; // max 5 Constraint
        }
        setBurstWord(bubble.word);
        setTimeout(() => setBurstWord(w => (w === bubble.word ? null : w)), 650);
        return [...prev, bubble.word];
      }
    });
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleProceedToNotes = () => {
    setStep(3);
    onBubblesProceeded?.();
  };

  const handleSaveLogs = async () => {
    if (!selectedCategory) return;
    
    // Prep formatted tags in note body to dynamically read back in UI history
    const tagsString = selectedWords.length > 0 ? `[Tags: ${selectedWords.join(', ')}] ` : '';
    const formattedNote = `${tagsString}${journalNote.trim()}`;

    let emotionalSummary: string | undefined;
    let sentimentLabel: string | undefined;
    let sentimentScore: number | undefined;

    // Call the server-side analysis if voice was used to transcribe note
    if (wasVoiceUsed && journalNote.trim().length > 0) {
      setIsAnalyzingSentiment(true);
      try {
        const response = await fetch('/api/therapy/analyze-sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: journalNote.trim() }),
        });
        const data = await response.json();
        if (data.success) {
          emotionalSummary = data.emotionalSummary;
          sentimentLabel = data.sentimentLabel;
          sentimentScore = data.sentimentScore;
        }
      } catch (err) {
        console.error('Error analyzing written spoken sentiment:', err);
      } finally {
        setIsAnalyzingSentiment(false);
      }
    }

    const newLog: MoodLog = {
      date: new Date().toISOString().split('T')[0],
      score: selectedCategory.score,
      label: selectedCategory.label,
      note: formattedNote || undefined,
      wasVoiceUsed: (wasVoiceUsed || !!recordedAudioBase64) || undefined,
      emotionalSummary,
      sentimentLabel,
      sentimentScore,
      voiceNote: recordedAudioBase64 || undefined
    };

    onAddMoodLog(newLog);
    
    // Reset state variables
    setJournalNote('');
    setSelectedWords([]);
    setSelectedCategory(null);
    setLastClickedBubble(null);
    setWasVoiceUsed(false);
    setRecordedAudioBase64(null);
    setAudioPlaybackUrl(null);
    setIsPlayingAudioPreview(false);
    setStep(1);
    reflectionNotifiedRef.current = false;
    
    setRecentSaved(true);
    setTimeout(() => setRecentSaved(false), 4000);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Step 1: Category Check-In Grid selection */}
      {step === 1 && (
        <div className="space-y-7 animate-fade-in py-3 px-1">
          <div className="space-y-3 text-center max-w-lg mx-auto">
            <div className="flex justify-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(140deg, #FDBA74, #FB7185 50%, #818CF8)', boxShadow: '0 6px 20px rgba(129,140,248,0.35)' }}
              >
                💗
              </motion.div>
            </div>
            <h2 className="text-2xl sm:text-[28px] font-black text-neutral-900 tracking-tight font-sans">
              Energy & Feeling Check-In
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-semibold leading-relaxed max-w-md mx-auto">
              Emotions can be mapped by physical energy ranges or classified using Plutchik's cohesive 3-level intensity spectrum. Select your check-in style below:
            </p>
          </div>

          {/* Mode Selector — sliding capsule control */}
          <div className="relative flex p-1 bg-slate-100 border border-slate-200/60 rounded-2xl max-w-sm mx-auto shadow-inner">
            {(['traditional', 'plutchik'] as const).map((mode) => {
              const active = checkInMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setCheckInMode(mode);
                    setSelectedWords([]);
                    setSelectedCategory(null);
                  }}
                  className="relative flex-1 py-2 px-3 rounded-xl text-[10.5px] uppercase tracking-wider font-black transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer z-10"
                  style={{ color: active ? (mode === 'traditional' ? '#9A3412' : '#3730A3') : '#64748B' }}
                >
                  {active && (
                    <motion.div
                      layoutId="mood-mode-pill"
                      className="absolute inset-0 rounded-xl bg-white shadow-md"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative">{mode === 'traditional' ? '🛋️ Energy Quadrants' : '🏵️ Plutchik Wheel'}</span>
                </button>
              );
            })}
          </div>

          {checkInMode === 'traditional' ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto pt-1">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  id={`cat-btn-${cat.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative rounded-[1.75rem] text-left cursor-pointer flex flex-col justify-between min-h-[168px] sm:min-h-[180px] p-4 sm:p-5 overflow-hidden"
                  style={{ background: cat.gradient, boxShadow: `0 10px 28px -6px ${cat.glow}` }}
                >
                  {/* Ambient decorative orb for depth/motion */}
                  <motion.div
                    className="absolute -right-6 -top-6 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: 'rgba(255,255,255,0.22)', filter: 'blur(6px)' }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <div className="relative flex justify-between items-start">
                    <span className="text-2xl sm:text-3xl filter drop-shadow-sm p-2 bg-white/25 backdrop-blur-md rounded-2xl border border-white/40">
                      {cat.emoji}
                    </span>
                    <span
                      className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm"
                      style={{ color: cat.ring }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div className="relative mt-3 space-y-1">
                    <h4 className="font-display text-sm font-black tracking-tight text-white drop-shadow-sm">
                      {cat.title}
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] font-semibold text-white/90 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              <PlutchikWheel
                selectedWords={selectedWords}
                onToggleWord={handleTogglePlutchikWord}
                maxSelections={5}
              />
              
              {selectedWords.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-4"
                >
                  <button
                    type="button"
                    onClick={handleProceedFromPlutchik}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
                  >
                    <span>Next: Write Diary Reflection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Fast-tap emotion chip cloud — no drag/pan required, everything visible at once */}
      {step === 2 && selectedCategory && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBackToStep1}
                className="p-1 px-3 bg-neutral-100 hover:bg-neutral-200 hover:text-black transition rounded-xl text-[11px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-xs text-neutral-400 font-bold bg-neutral-100 uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                Step 2 of 3
              </span>
            </div>
            <motion.div
              key={selectedWords.length}
              initial={{ scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="text-right flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-black text-white"
              style={{ background: selectedCategory.ring ?? '#111827' }}
            >
              <Sparkles className="w-4 h-4 text-white/90" />
              <span>{selectedWords.length}/5 Feelings</span>
            </motion.div>
          </div>

          <div className="text-left space-y-1 px-1">
            <h3 className="text-base font-bold text-neutral-900 font-sans">
              Explore {selectedCategory.label} Describers
            </h3>
            <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
              Tap any words that fit — up to 5. Everything's visible at once, so you can move fast.
            </p>
          </div>

          {/* Chip cloud — fully visible, no drag/scroll required, sized by how central each feeling is */}
          <div
            className="w-full rounded-[1.75rem] relative shadow-inner border p-5 sm:p-6 flex flex-wrap justify-center items-center gap-2.5 sm:gap-3"
            style={{
              background: `radial-gradient(circle at 50% 15%, ${selectedCategory.glow ?? 'rgba(0,0,0,0.08)'} 0%, transparent 60%), #FAFAFA`,
              borderColor: '#F0F0F0',
            }}
          >
            {selectedCategory.bubbles.map((bubble, index) => {
              const isSelected = selectedWords.includes(bubble.word);
              const isFocused = lastClickedBubble?.word === bubble.word;
              const isBursting = burstWord === bubble.word;
              const scale = 0.72 + (bubble.size / 104) * 0.28; // 0.72 – 1.0 relative importance scale

              return (
                <div key={bubble.word} className="relative">
                  {/* Sparkle-burst reward animation on fresh selection */}
                  <AnimatePresence>
                    {isBursting && (
                      <>
                        {[...Array(6)].map((_, s) => {
                          const angle = (s / 6) * 2 * Math.PI;
                          return (
                            <motion.span
                              key={s}
                              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                              style={{ background: selectedCategory.ring }}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                              animate={{ x: Math.cos(angle) * 42, y: Math.sin(angle) * 42, opacity: 0, scale: 0.4 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.55, ease: 'easeOut' }}
                            />
                          );
                        })}
                      </>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    onClick={() => handleBubbleTap(bubble)}
                    whileHover={{ scale: scale * 1.06 }}
                    whileTap={{ scale: scale * 0.92 }}
                    animate={isBursting ? { scale: [scale, scale * 1.25, scale] } : { scale }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      transformOrigin: 'center',
                      background: isSelected ? selectedCategory.gradient : '#FFFFFF',
                      border: isSelected ? `2px solid ${selectedCategory.ring}` : '1.5px solid #E5E7EB',
                      boxShadow: isSelected ? `0 6px 18px -4px ${selectedCategory.glow}` : 'none',
                    }}
                    className={`px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer select-none ${isFocused ? 'ring-2 ring-offset-2' : ''}`}
                  >
                    <span
                      className="text-[12px] font-black tracking-tight whitespace-nowrap"
                      style={{ color: isSelected ? '#FFFFFF' : '#374151' }}
                    >
                      {bubble.word}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-white shrink-0" strokeWidth={3} />}
                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Compact caption — quick context without blocking momentum, plus an always-ready Next button */}
          {lastClickedBubble && (
            <motion.div
              key={lastClickedBubble.word}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-4 border shadow-sm flex items-center gap-4"
              style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}
            >
              <div className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center" style={{ background: selectedCategory.gradient }}>
                <StickFigureAnimator type={selectedCategory.id} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-xs font-black tracking-tight" style={{ color: selectedCategory.ring }}>
                  {lastClickedBubble.word}
                </h4>
                <p className="text-[10.5px] font-semibold text-slate-500 leading-snug truncate">
                  {lastClickedBubble.description}
                </p>
              </div>
              <button
                type="button"
                id="bubble-checkin-next-btn"
                onClick={handleProceedToNotes}
                disabled={selectedWords.length === 0}
                className="w-12 h-12 rounded-full text-white flex items-center justify-center shrink-0 transition active:scale-90 cursor-pointer shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: selectedWords.length > 0 ? selectedCategory.ring : '#9CA3AF' }}
                aria-label="Next step"
              >
                <ArrowRight className="w-5 h-5 stroke-[3px]" />
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 3: reflection writing & speech assistant notes */}
      {step === 3 && selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 bg-white p-6 rounded-[1.75rem] shadow-sm border border-slate-100 relative overflow-hidden"
        >
          {/* Soft ambient wash tying this step back to the category picked in Step 1/2 */}
          <div
            className="absolute inset-x-0 top-0 h-28 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, ${selectedCategory.glow ?? 'rgba(0,0,0,0.06)'} 0%, transparent 70%)` }}
          />

          <div className="relative text-center space-y-2.5">
            <span
              className="text-3xl p-3 rounded-2xl inline-block shadow-md"
              style={{ background: selectedCategory.gradient ?? '#F1F5F9' }}
            >
              {selectedCategory.emoji}
            </span>
            <div className="space-y-1">
              <h3 className="font-display font-black text-lg text-slate-800">
                Reflection Note • {selectedCategory.title}
              </h3>
              <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto">
                Finish your diary check-in with any thoughts, feelings, or notes of context.
              </p>
            </div>
          </div>

          {/* Selected Badges indicator */}
          {selectedWords.length > 0 && (
            <div className="relative space-y-2 text-left bg-slate-50 p-4 border border-slate-100 rounded-2xl">
              <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: selectedCategory.ring ?? '#3d627f' }}>Identified Feelings:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedWords.map((word) => (
                  <span
                    key={word}
                    style={{ backgroundColor: `${selectedCategory.accent}20`, borderColor: `${selectedCategory.accent}40`, color: selectedCategory.accent }}
                    className="text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 hover:brightness-95 select-none"
                  >
                    <Heart className="w-2.5 h-2.5 fill-current shrink-0" />
                    <span>{word}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Voice to text note card integrated directly from earlier features */}
          <div className="relative space-y-2 text-left">
            <label htmlFor="mood-reflection-note" className="text-[9px] uppercase tracking-widest font-black text-slate-500">Your Diary Note:</label>
            <div className="relative">
              <textarea
                id="mood-reflection-note"
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Talk about what created these feelings or write down a simple thought, if you wish..."
                style={{ borderColor: journalNote ? (selectedCategory.ring ?? '#3d627f') : undefined }}
                className="w-full h-34 pl-4 pr-12 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-300 focus:outline-none transition-all text-sm font-semibold resize-none shadow-inner"
                onFocus={(e) => { e.currentTarget.style.borderColor = selectedCategory.ring ?? '#3d627f'; }}
                onBlur={(e) => { if (!journalNote) e.currentTarget.style.borderColor = 'transparent'; }}
              />
              <motion.button
                type="button"
                id="mood-voice-dictate-btn"
                onClick={toggleRecording}
                whileTap={{ scale: 0.9 }}
                title={isRecording ? "Stop dictating" : "Dictate your note"}
                className="absolute right-3.5 bottom-4.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm"
                style={isRecording ? { background: '#F43F5E' } : { background: '#EEF2F6', color: '#475569' }}
                animate={isRecording ? { boxShadow: ['0 0 0 0 rgba(244,63,94,0.5)', '0 0 0 8px rgba(244,63,94,0)'] } : {}}
                transition={isRecording ? { duration: 1.2, repeat: Infinity } : {}}
              >
                <Mic className="w-4 h-4" style={{ color: isRecording ? '#FFFFFF' : '#475569' }} />
              </motion.button>
            </div>

            {/* Dictating Live Feedback and Alert Warning */}
            {(isRecording || speechError) && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                {isRecording && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold" style={{ color: selectedCategory.ring ?? '#3d627f' }}>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                      <span>Dictating live...</span>
                    </div>
                    {/* Visual equalization spikes */}
                    <div className="flex gap-0.5 items-end h-2.5">
                      {[1.5, 2.5, 1, 2].map((h, i) => (
                        <span key={i} className="w-0.5 rounded-full animate-[bounce_1s_infinite]" style={{ height: `${h * 4}px`, animationDelay: `${i * 100}ms`, background: selectedCategory.ring ?? '#3d627f' }} />
                      ))}
                    </div>
                  </div>
                )}
                {isRecording && (
                  <div className="space-y-1.5">
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Speak clearly into your microphone. Tap the glowing button when you are done.
                    </p>
                    <p className="text-[10px] text-teal-600 font-bold bg-teal-50/50 p-2 rounded-xl">
                      💡 <strong>Tip:</strong> If the browser blocks microphone access in the interactive preview, click <strong>"Open in a new tab"</strong> at the top right of the screen to grant normal permission!
                    </p>
                  </div>
                )}
                {speechError && (
                  <div className="flex items-start gap-1.5 text-rose-600 font-medium leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{speechError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🎙️ 30s High-Fi Mood Recorder Panel */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-4.5 space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: selectedCategory.ring ?? '#3d627f' }}>🎙️ Mood Voice Note</span>
                <span className="text-[10px] text-slate-500 font-bold block leading-normal">
                  Record up to a 30-second audio clip describing your mood, saved inside this entry.
                </span>
              </div>
              {isRecordingAudio && (
                <div className="px-2.5 py-1 bg-rose-500/10 border border-rose-200 text-rose-600 rounded-lg text-[10px] font-bold animate-pulse font-mono shrink-0">
                  {audioSeconds}s / 30s
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Record Action Button */}
              <button
                type="button"
                onClick={toggleRecordingAudio}
                className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 text-white w-full sm:w-auto ${
                  isRecordingAudio ? 'bg-rose-500 hover:bg-rose-600 animate-pulse shadow-md' : 'shadow-sm'
                }`}
                style={!isRecordingAudio ? { background: selectedCategory.ring ?? '#3d627f' } : undefined}
              >
                {isRecordingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current shrink-0 animate-ping" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 shrink-0" />
                    <span>{recordedAudioBase64 ? 'Re-record Voice Note' : 'Record Voice Note'}</span>
                  </>
                )}
              </button>

              {/* Playback Preview / Delete Panel if recorded */}
              {recordedAudioBase64 && !isRecordingAudio && (
                <div className="flex-1 flex items-center justify-between bg-white p-1.5 px-3 rounded-xl border border-slate-200/80 shadow-3xs animate-fade-in gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={handleToggleAudioPreview}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-emerald-700 transition cursor-pointer shrink-0"
                      title={isPlayingAudioPreview ? "Pause" : "Play preview"}
                    >
                      {isPlayingAudioPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] font-bold text-slate-600 truncate">Saved audio snippet ready</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRecordedAudioBase64(null);
                      setAudioPlaybackUrl(null);
                      setIsPlayingAudioPreview(false);
                    }}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
                    title="Delete audio note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* EQ Animation when recording */}
            {isRecordingAudio && (
              <div className="bg-white rounded-xl p-3.5 border border-slate-100 flex flex-col items-center gap-2.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  Microphone Recording Active
                </span>
                
                {/* Simulated visual soundwave waves */}
                <div className="flex items-end justify-center gap-1 h-8 px-8 select-none w-full">
                  {[2, 5, 8, 4, 7, 3, 6, 8, 5, 7, 3, 4, 6, 8, 2, 5, 3].map((val, i) => (
                    <span
                      key={i}
                      style={{
                        height: `${val * 10}%`,
                        animationDelay: `${i * 65}ms`,
                        background: selectedCategory.ring ?? '#3d627f',
                      }}
                      className="w-1 rounded-full animate-[bounce_0.8s_infinite] min-h-[4px]"
                    ></span>
                  ))}
                </div>
                <span className="text-[9.5px] font-semibold text-slate-400 font-mono">Capturing direct audio ({audioSeconds}s / 30s)</span>
                <span className="text-[9.5px] font-bold text-indigo-600 animate-pulse">✍️ Streaming text translation to your Reflection Note below...</span>
              </div>
            )}
          </div>

          {/* Action row */}
          <div className="relative flex gap-3 pt-2">
            <button
              type="button"
              disabled={isAnalyzingSentiment}
              onClick={() => setStep(checkInMode === 'plutchik' ? 1 : 2)}
              className="flex-1 py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer border border-neutral-200 disabled:opacity-50"
            >
              Go Back
            </button>
            <motion.button
              type="button"
              disabled={isAnalyzingSentiment}
              onClick={handleSaveLogs}
              whileTap={{ scale: 0.96 }}
              className="flex-grow-[1.3] py-3 text-white rounded-full text-xs font-black shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              style={{ background: selectedCategory.gradient ?? '#111827', boxShadow: `0 6px 20px -4px ${selectedCategory.glow ?? 'rgba(0,0,0,0.3)'}` }}
            >
              {isAnalyzingSentiment ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                  <span>Analyzing Spoken Sentiment...</span>
                </>
              ) : (
                <span>Save Mood Diary</span>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Action Toast alert confirmation */}
      <AnimatePresence>
        {recentSaved && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center gap-3 shadow-md text-xs font-bold max-w-sm mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.1 }}
              className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
            </motion.div>
            <span>Beautifully logged! Your energy dynamics and feelings were secure.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary history logs display area */}
      <div className="space-y-4 pt-6">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-neutral-800" />
            <h3 className="text-sm font-bold text-neutral-900">Your Diary History</h3>
          </div>
          {moodLogs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear history
            </button>
          )}
        </div>

        {/* Search & Accessibility Filters */}
        {moodLogs.length > 0 && (
          <div className="bg-slate-50 p-4 border border-slate-200/70 rounded-3xl space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search diary notes, tags, or feelings..."
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-[#3d627f]/15 focus:outline-none focus:border-[#3d627f]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 text-[10px] font-extrabold uppercase tracking-wide cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 mr-1">Filter Energy:</span>
              <button
                type="button"
                onClick={() => setFilterScore('all')}
                className={`py-1 px-2.5 rounded-xl text-[10px] font-extrabold transition cursor-pointer border ${
                  filterScore === 'all'
                    ? 'bg-[#3d627f] text-white border-[#3d627f]'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All States
              </button>
              {[5, 4, 3, 2, 1].map((score) => {
                const labelMap: Record<number, string> = { 5: 'Great', 4: 'Good', 3: 'Okay', 2: 'Down', 1: 'Low' };
                const count = moodLogs.filter(l => l.score === score).length;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setFilterScore(score)}
                    className={`py-1 px-2.5 rounded-xl text-[10px] font-extrabold transition cursor-pointer border ${
                      filterScore === score
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {labelMap[score]} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {moodLogs.length === 0 ? (
          <div className="bg-gradient-to-b from-teal-50/30 via-white to-white rounded-3xl p-8 border border-teal-100 shadow-[0_12px_24px_rgba(13,148,136,0.02)] text-center flex flex-col items-center relative overflow-hidden">
            {/* Ambient visual decorations */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-[#3fc9c0]" />
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-teal-50/70 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[#3fc9c0]/10 rounded-full blur-xl pointer-events-none" />
            
            {/* Elegant Illustration */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center animate-pulse" style={{ animationDuration: '5s' }} />
              <div className="absolute w-12 h-12 rounded-full bg-teal-100/50 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-teal-600 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <span className="absolute bottom-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            </div>

            <h4 className="font-display text-sm font-extrabold text-neutral-800 tracking-tight">Your Mood Chronicle Ledger is Empty</h4>
            <p className="text-[11px] text-zinc-500 font-semibold max-w-[320px] mt-1.5 leading-relaxed">
              Recording your emotional peaks and physical energy levels helps you visualize invisible correlations and master somatic self-regulation.
            </p>

            {/* Beginner Guide Cards */}
            <div className="w-full max-w-[340px] mt-6 bg-slate-50/75 border border-slate-100 rounded-2xl p-4 text-left space-y-3">
              <h5 className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Follow these steps to log:</h5>
              <div className="space-y-2.5 text-[10.5px]">
                <div className="flex gap-2.5">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">1</div>
                  <p className="text-slate-600 font-semibold leading-normal">
                    <strong className="text-neutral-800">Tap your primary state</strong> (e.g., Joy, Energetic, Sad, Calm) on the color spectrum list above.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">2</div>
                  <p className="text-slate-600 font-semibold leading-normal">
                    <strong className="text-neutral-800">Add context tags or voice notes</strong> to details about situations, thoughts, or bodily sensations.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[8.5px] font-extrabold shrink-0">3</div>
                  <p className="text-slate-600 font-semibold leading-normal">
                    <strong className="text-neutral-800">Click "Add to Chronicle"</strong> to persist your mood state. Watch your biometric correlations grow!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          (() => {
            const resultLogs = moodLogs.filter(log => {
              const parsed = parseNoteTags(log.note);
              const query = searchQuery.toLowerCase();
              const matchesSearch = !searchQuery || 
                log.label.toLowerCase().includes(query) ||
                (parsed.text && parsed.text.toLowerCase().includes(query)) ||
                parsed.tags.some(t => t.toLowerCase().includes(query));

              const matchesScore = filterScore === 'all' || log.score === filterScore;
              return matchesSearch && matchesScore;
            });

            if (resultLogs.length === 0) {
              return (
                <div className="p-6 text-center bg-white border border-slate-100 rounded-3xl">
                  <p className="text-xs text-slate-400 font-bold">No results match your filters.</p>
                  <button 
                    type="button" 
                    onClick={() => { setSearchQuery(''); setFilterScore('all'); }} 
                    className="mt-2 text-xs text-[#3d627f] hover:underline font-extrabold block mx-auto cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {resultLogs.map((log, origIdx) => {
                  const parsed = parseNoteTags(log.note);
                  
                  // Map score back to find the correct theme accent and category background/emoji
                  const matchedCat = CATEGORIES.find(c => c.score === log.score) || CATEGORIES[2];
                  const idxIdx = moodLogs.indexOf(log);
                  const isVoicePlaying = playingLogVoiceIdx === idxIdx;
                  
                  return (
                    <div 
                      key={origIdx}
                      className="bg-white p-4.5 rounded-3xl shadow-xs border border-slate-100 flex gap-3.5 items-start transition hover:shadow-md hover:border-slate-100"
                    >
                      <span className="p-3 bg-slate-50 leading-none rounded-2xl text-2xl shrink-0 border border-slate-100">
                        {matchedCat.emoji}
                      </span>
                      <div className="flex-1 space-y-2 min-w-0 text-left">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-xs font-black text-slate-800">
                            {matchedCat.title}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400 font-mono flex-shrink-0">
                            {log.date}
                          </span>
                        </div>

                        {/* Parsed emotional badges displayed clean inside history card */}
                        {parsed.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {parsed.tags.map((tag) => (
                              <span 
                                key={tag}
                                style={{ backgroundColor: `${matchedCat.accent}12`, color: matchedCat.accent, borderColor: `${matchedCat.accent}25` }}
                                className="text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actual commentary/diary reflections */}
                        {parsed.text && (
                          <div className="space-y-2">
                            <div className="relative group">
                              <p className="text-xs font-medium text-slate-500 leading-relaxed bg-slate-50/70 p-3 pr-11 rounded-2xl italic border border-slate-100 font-sans">
                                "{parsed.text}"
                              </p>
                              <div className="absolute right-2.5 top-2.5">
                                <TtsSpeaker text={parsed.text} />
                              </div>
                            </div>
                            
                            {log.emotionalSummary && (
                              <div className="p-3 bg-gradient-to-br from-teal-500/[0.04] to-emerald-500/[0.04] rounded-2xl border border-teal-500/10 space-y-1.5 relative">
                                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-teal-800 pr-10">
                                  <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded text-[8px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-600"></span>
                                    </span>
                                    AI Voice Analysis
                                  </span>
                                  <span>Feeling: <strong className="text-teal-700">{log.sentimentLabel || 'Reflective'}</strong></span>
                                  <span className="text-[8px] uppercase text-emerald-600 tracking-wider">Tone: {log.sentimentScore || 3}/5</span>
                                </div>
                                <p className="text-[11px] font-medium text-teal-900 leading-relaxed italic border-l-2 border-teal-400/40 pl-2 pr-10">
                                  "{log.emotionalSummary}"
                                </p>
                                <div className="absolute right-2.5 top-3">
                                  <TtsSpeaker text={log.emotionalSummary} />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 🎙️ High-Fi Voice Note Playback Controller - Accessible entry of info */}
                        {log.voiceNote && (
                          <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 animate-fade-in mt-1.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <button
                                type="button"
                                onClick={() => handleToggleHistoryVoicePlay(idxIdx, log.voiceNote!)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                  isVoicePlaying 
                                    ? 'bg-rose-500 text-white border-rose-400' 
                                    : 'bg-white hover:bg-slate-100 text-[#3d627f] border-slate-200 shadow-3xs'
                                }`}
                                title={isVoicePlaying ? "Pause Audio Note" : "Play Audio Note"}
                              >
                                {isVoicePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                              </button>
                              
                              <div className="min-w-0">
                                <span className="block text-[9.5px] font-black text-slate-700 leading-tight">🎙️ Saved Voice Diary note</span>
                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                                  {isVoicePlaying ? 'Playing speech...' : 'Tap play to hear recording'}
                                </span>
                              </div>
                            </div>

                            {isVoicePlaying && (
                              <div className="flex gap-0.5 items-end h-4 pr-1.5 select-none shrink-0">
                                <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.6s_infinite_100ms] h-1.5"></span>
                                <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.6s_infinite_300ms] h-3.5"></span>
                                <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.6s_infinite_200ms] h-2"></span>
                                <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.6s_infinite_400ms] h-2.5"></span>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
