import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { INTERN_PERSONALITIES } from './lanceGameData';
import { InternConfig, useGame } from './LANCEGameContext';

interface Props {
  onComplete?: (config: InternConfig) => void;
  isOnboarding?: boolean;
}

// He is Chip — half-boy, half-machine, all clipboard. The name and the face
// are canon; the only thing you tune is how he talks to you.
export default function InternCustomizer({ onComplete, isOnboarding = false }: Props) {
  const { intern, completeInternSetup } = useGame();
  const [personalityId, setPersonalityId] = useState(intern.personalityId || 'hype');

  const selectedPersonality = INTERN_PERSONALITIES.find(p => p.id === personalityId);

  const handleSave = () => {
    const config: InternConfig = { name: 'Chip', personalityId, avatar: intern.avatar || '⚡' };
    completeInternSetup(config);
    onComplete?.(config);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Intro: during onboarding Chip is already on screen (the hallway walk),
          so the sheet stays low and out of his way — header text only. In
          Settings there's no stage, so the full card with his art shows. */}
      {isOnboarding ? (
        <div className="text-center space-y-1.5">
          <h2 className="text-lg font-black" style={{ color: '#7FD98C' }}>
            That's Chip.
          </h2>
          <p className="text-xs font-medium" style={{ color: '#8BA8A0' }}>
            "LANCE assigned me to observe you. Technically true! But I'm really here for YOU. One question: how should I talk to you?"
          </p>
        </div>
      ) : (
        <div
          className="rounded-3xl p-5 text-center space-y-2 border"
          style={{ background: '#0D2440', borderColor: 'rgba(80,232,152,0.22)' }}
        >
          <motion.img
            src="/new_intern/intern_base.webp"
            alt="Chip"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-24 h-24 object-contain mx-auto"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <h2 className="text-xl font-black" style={{ color: '#7FD98C' }}>
            Chip
          </h2>
          <p className="text-xs font-medium" style={{ color: '#8BA8A0' }}>
            How should Chip talk to you?
          </p>
          {selectedPersonality && (
            <div
              className="mt-3 px-4 py-2 rounded-2xl text-xs font-semibold italic"
              style={{ background: '#071C38', color: '#7FD98C' }}
            >
              "{selectedPersonality.sampleMessages[0]}"
            </div>
          )}
        </div>
      )}

      {/* Personality */}
      <div className="grid grid-cols-1 gap-2">
        {INTERN_PERSONALITIES.map(p => (
          <button
            key={p.id}
            onClick={() => setPersonalityId(p.id)}
            className="text-left px-4 py-3 rounded-2xl border-2 transition-all active:scale-[0.98]"
            style={{
              background: personalityId === p.id ? '#7FD98C11' : '#0D2440',
              borderColor: personalityId === p.id ? '#7FD98C' : 'rgba(80,232,152,0.15)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-black" style={{ color: '#E8F5F1' }}>
                  {p.label}
                </div>
                <div className="text-xs mt-0.5 font-medium" style={{ color: '#8BA8A0' }}>
                  {p.tagline}
                </div>
              </div>
              {personalityId === p.id && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#7FD98C' }}
                >
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #7FD98C, #3ECFCF)',
          color: '#071C38',
        }}
      >
        {isOnboarding ? "Let's Go, Chip! →" : 'Save Changes'}
      </button>

      {isOnboarding && (
        <p className="text-center text-[10px] font-medium" style={{ color: '#3ECFCF44' }}>
          LANCE has noted this interaction with "mild disapproval."
        </p>
      )}
    </div>
  );
}
