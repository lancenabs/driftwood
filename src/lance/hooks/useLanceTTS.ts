import { useCallback, useRef, useState, useEffect } from 'react';

export type TTSVoice = 'Kore' | 'Charon' | 'Fenrir' | 'Puck' | 'Zephyr';

const LANCE_VOICE: TTSVoice = 'Kore';         // Cold, precise — LANCE
const INTERN_VOICE: TTSVoice = 'Zephyr';       // Warm, gentle — Intern

const audioCache = new Map<string, string>();  // text → object URL

function getCacheKey(text: string, voice: TTSVoice) {
  return `${voice}::${text.slice(0, 120)}`;
}

export function useLanceTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try { return localStorage.getItem('lance_tts_muted') === '1'; } catch { return false; }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try { localStorage.setItem('lance_tts_muted', isMuted ? '1' : '0'); } catch {}
  }, [isMuted]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Plays a pre-rendered cast recording (the ElevenLabs clips under
  // /lance-audio/ and /lance-videos/). Resolves true if playback started,
  // false if the file is missing/broken — the caller then falls back to
  // live TTS, so a half-generated clip set degrades invisibly.
  const playClip = useCallback((clipSrc: string): Promise<boolean> => {
    return new Promise(resolve => {
      const audio = new Audio(clipSrc);
      const fail = () => { if (audioRef.current === audio) { audioRef.current = null; setIsSpeaking(false); } resolve(false); };
      audio.onerror = fail;
      audio.onended = () => { if (audioRef.current === audio) { audioRef.current = null; setIsSpeaking(false); } };
      audioRef.current = audio;
      setIsSpeaking(true);
      audio.play().then(() => resolve(true)).catch(fail);
    });
  }, []);

  const speak = useCallback(async (text: string, voice: TTSVoice = LANCE_VOICE, clipSrc?: string) => {
    if (isMuted || !text.trim()) return;
    stop();

    // Cast recording first; live TTS is the fallback.
    if (clipSrc && await playClip(clipSrc)) return;

    const key = getCacheKey(text, voice);
    let audioUrl = audioCache.get(key);

    if (!audioUrl) {
      try {
        const res = await fetch('/api/lance/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice }),
        });
        if (!res.ok) return;
        const blob = await res.blob();
        audioUrl = URL.createObjectURL(blob);
        audioCache.set(key, audioUrl);
      } catch {
        return;
      }
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setIsSpeaking(true);
    audio.onended = () => { audioRef.current = null; setIsSpeaking(false); };
    audio.onerror = () => { audioRef.current = null; setIsSpeaking(false); };
    audio.play().catch(() => { audioRef.current = null; setIsSpeaking(false); });
  }, [isMuted, stop, playClip]);

  const speakLance = useCallback((text: string, clipSrc?: string) => speak(text, LANCE_VOICE, clipSrc), [speak]);
  const speakIntern = useCallback((text: string, clipSrc?: string) => speak(text, INTERN_VOICE, clipSrc), [speak]);

  // Clip-or-silence: plays the cast recording if it exists, and says nothing
  // otherwise (used for Chip, whose character has no acceptable live-TTS voice
  // — a wrong voice is worse than a quiet line).
  const speakClipOnly = useCallback((clipSrc: string) => {
    if (isMuted) return;
    stop();
    void playClip(clipSrc);
  }, [isMuted, stop, playClip]);

  const toggleMute = useCallback(() => {
    stop();
    setIsMuted(m => !m);
  }, [stop]);

  return { speak, speakLance, speakIntern, speakClipOnly, stop, isSpeaking, isMuted, toggleMute };
}
