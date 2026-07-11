let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentOnEndCallback: (() => void) | null = null;

type TtsListener = (activeText: string | null) => void;
const listeners = new Set<TtsListener>();

export const subscribeTts = (listener: TtsListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (text: string | null) => {
  listeners.forEach(l => {
    try { l(text); } catch (e) { console.error('Tts listener error', e); }
  });
};

export const speakText = (
  text: string, 
  onStart?: () => void, 
  onEnd?: () => void,
  options?: { rate?: number; pitch?: number; voiceURI?: string }
) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // If we are currently speaking, cancel previous
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    notifyListeners(null);
    if (currentOnEndCallback) {
      currentOnEndCallback();
      currentOnEndCallback = null;
    }
    
    // If we clicked the exact same text that is already speaking, treat it as a toggle-off
    if (currentUtterance && currentUtterance.text === text) {
      currentUtterance = null;
      return;
    }
  }

  // Clean the text from markdown or special tag structures like [Tags: Sad, Heavy]
  const cleanText = text
    .replace(/\[Tags:\s*([^\]]+)\]/gi, 'Identified feelings: $1. ')
    .replace(/[*#`_\-~>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;
  currentOnEndCallback = onEnd || null;

  // Set default modern values if undefined
  utterance.rate = options?.rate ?? 1.0;
  utterance.pitch = options?.pitch ?? 1.0;

  // Try to find a warm, natural sounding voice if available
  if (options?.voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const matched = voices.find(v => v.voiceURI === options.voiceURI);
    if (matched) utterance.voice = matched;
  } else {
    // Pick first available natural English voice as backup
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (preferredVoice) utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    notifyListeners(text);
    if (onStart) onStart();
  };

  utterance.onend = () => {
    notifyListeners(null);
    if (currentUtterance === utterance) {
      currentUtterance = null;
      currentOnEndCallback = null;
    }
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    notifyListeners(null);
    console.error('TTS execution error', e);
    if (currentUtterance === utterance) {
      currentUtterance = null;
      currentOnEndCallback = null;
    }
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    notifyListeners(null);
    if (currentOnEndCallback) {
      currentOnEndCallback();
      currentOnEndCallback = null;
    }
    currentUtterance = null;
  }
};

export const isSpeaking = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
