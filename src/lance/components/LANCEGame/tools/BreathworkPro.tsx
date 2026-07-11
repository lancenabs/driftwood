import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import { reportChallengeCycle } from '../challengeProgressBus';
import SomaticBreathPacer from '../../../components/SomaticBreathPacer';
import BigBackButton from '../BigBackButton';

// Narrated pacing tracks (Sterling voice, assembled to the real breath rhythm):
// channel 'breathwork_478' → 3 rounds of 4-7-8; anything else → box breathing.
const GUIDE_TRACKS: Record<string, string> = {
  breathwork_478: '/breathwork-audio/breathwork_478_guide.m4a',
  box_breathing: '/breathwork-audio/box_breathing_guide.m4a',
};

interface Props {
  onBack: () => void;
  initialProfileIdx?: number;
  channel?: string;
}

export default function BreathworkPro({ onBack, initialProfileIdx = 0, channel }: Props) {
  const { addXp } = useGame();
  const xpAwardedRef = useRef(false);
  const [xpBanner, setXpBanner] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!xpAwardedRef.current) {
        addXp(30);
        xpAwardedRef.current = true;
        setXpBanner(true);
        setTimeout(() => setXpBanner(false), 3000);
      }
    }, 3 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [addXp]);

  const handleCycleComplete = () => {
    setCycleCount(c => c + 1);
    if (channel) reportChallengeCycle(channel);
  };

  // Voice guide — additive, manual toggle; the audio itself carries the pacing
  // so it works with eyes closed, independent of the visual pacer.
  const guideSrc = GUIDE_TRACKS[channel ?? ''] ?? GUIDE_TRACKS.box_breathing;
  const guideRef = useRef<HTMLAudioElement | null>(null);
  const [voicePlaying, setVoicePlaying] = useState(false);
  useEffect(() => () => guideRef.current?.pause(), []);
  const toggleVoice = () => {
    const el = guideRef.current;
    if (!el) return;
    if (voicePlaying) {
      el.pause();
      setVoicePlaying(false);
    } else {
      el.currentTime = 0;
      el.play();
      setVoicePlaying(true);
    }
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: '#F9FAFB' }}>
      {/* Updrafts region — sea cliffs and wind, softly present behind the pacer */}
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/breathing.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(14px)', transform: 'scale(1.08)', opacity: 0.4,
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(244,248,250,0.86) 0%, rgba(244,248,250,0.92) 100%)',
      }} />

      <div className="relative sticky top-0 z-10 px-4 py-3 flex items-center gap-3" style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.85)',
      }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/breathwork_478.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(56,189,248,0.35)' }} />
        <div>
          <h2 className="text-sm font-black leading-tight" style={{ color: '#1C1C1E' }}>Breathwork Pro</h2>
          <div className="text-[10px] font-semibold" style={{ color: '#6B7280' }}>Tier 2 · Breathwork</div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleVoice}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider"
            style={{
              background: voicePlaying ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.75)',
              color: voicePlaying ? '#0EA5E9' : '#6B7280',
              border: `1px solid ${voicePlaying ? 'rgba(56,189,248,0.5)' : 'rgba(0,0,0,0.08)'}`,
              backdropFilter: 'blur(8px)',
            }}
            aria-label={voicePlaying ? 'Stop voice guide' : 'Play voice guide'}
          >
            {voicePlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            {voicePlaying ? 'Stop' : 'Voice'}
          </button>
          <audio ref={guideRef} src={guideSrc} onEnded={() => setVoicePlaying(false)} className="hidden" />
          {cycleCount > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
              style={{ background: 'rgba(255,255,255,0.75)', color: '#0EA5E9', border: '1px solid rgba(56,189,248,0.4)', backdropFilter: 'blur(8px)' }}
            >
              <span>🌬️</span>
              <span>{cycleCount} {cycleCount === 1 ? 'cycle' : 'cycles'}</span>
            </div>
          )}
          {xpBanner && (
            <div className="text-sm font-black animate-pulse" style={{ color: '#58CC02' }}>+30 XP ⚡</div>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto">
        <SomaticBreathPacer initialProfileIdx={initialProfileIdx} onCycleComplete={handleCycleComplete} />
      </div>
    </div>
  );
}
