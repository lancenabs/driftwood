import React, { useState } from 'react';
import { THE_SEVEN, claimSlot, setActiveCastaway } from '../lib/castaways';
import { ShieldAlert, Heart, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OnboardingScreenProps {
  onStart: () => void;
}

export default function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  // The private page — shown once per boarding, per adult, pass-the-device.
  // NOTHING about the answer is stored (no flag, no branch in saved state);
  // showing resources leaves no trace. Conjoint work is contraindicated in
  // active intimate-partner violence — this page is why the app can exist.
  const [step, setStep] = useState<'welcome' | 'private' | 'claim'>('welcome');
  const [claimName, setClaimName] = useState('');
  const [claimSlotId, setClaimSlotId] = useState(THE_SEVEN[0].id);

  if (step === 'private') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] py-6 px-5 w-full max-w-md mx-auto text-on-background">
        <div className="w-full bg-surface-container-lowest rounded-[2rem] p-6 border-2 border-outline-variant flex flex-col gap-4">
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Pass the device — this page is for one adult at a time</p>
          <h2 className="font-display font-black text-xl text-on-surface leading-snug">Just for you, before the island:</h2>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Does conflict at home ever leave you feeling afraid, or unsafe?
            If it does — even sometimes — togetherness exercises can wait.
            Your safety comes first, and it comes alone if it needs to.
          </p>
          <a
            href="https://www.thehotline.org"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-surface-container border-2 border-outline-variant rounded-xl py-3 px-4 font-sans text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Private support options — the Hotline (1-800-799-7233 · text START to 88788)
          </a>
          <p className="font-sans text-[10px] text-on-surface-variant/80 leading-relaxed">
            Nothing you do on this page is saved or shown to anyone — not which button
            you press, not whether you paused here. When you're ready, pass the device
            to the next adult, or continue.
          </p>
          <button
            onClick={() => setStep('claim')}
            className="w-full bg-[#1CB0F6] text-white font-display font-black py-3 px-6 rounded-xl border-b-[4px] border-[#1899D6] hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all duration-100 text-sm cursor-pointer"
          >
            Continue to the shore
          </button>
        </div>
      </div>
    );
  }

  // THE CLAIM — each real person takes a castaway slot; the rest wake as AI
  // hands (the honest roster). One claim is enough to make landfall.
  if (step === 'claim') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] py-6 px-5 w-full max-w-md mx-auto text-on-background">
        <div className="w-full bg-surface-container-lowest rounded-[2rem] p-6 border-2 border-outline-variant flex flex-col gap-4">
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface-variant">The tide line · seven castaways washed ashore</p>
          <h2 className="font-display font-black text-xl text-on-surface leading-snug">Claim your castaway</h2>
          <input
            value={claimName}
            onChange={e => setClaimName(e.target.value)}
            placeholder="Your first name or nickname"
            maxLength={24}
            className="w-full px-4 py-3 bg-white border-2 border-outline-variant rounded-xl text-sm font-bold focus:outline-none focus:border-primary"
          />
          <div className="grid grid-cols-1 gap-1.5 max-h-[240px] overflow-y-auto pr-1">
            {THE_SEVEN.map(slot => (
              <button
                key={slot.id}
                onClick={() => setClaimSlotId(slot.id)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${claimSlotId === slot.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'}`}
              >
                <span className="font-display font-black text-xs text-on-surface">{slot.emoji} {slot.role}</span>
                <span className="block font-sans text-[10px] text-on-surface-variant mt-0.5">{slot.blurb}</span>
              </button>
            ))}
          </div>
          <p className="font-sans text-[10px] text-on-surface-variant/80 leading-relaxed">
            Unclaimed castaways wake up as robot hands from the Jumble — they keep camp
            honestly and never pretend to be family. Real people can claim them anytime.
          </p>
          <button
            onClick={() => {
              claimSlot(claimSlotId, claimName);
              setActiveCastaway(claimSlotId);
              onStart();
            }}
            className="w-full bg-[#58CC02] text-white font-display font-black py-3 px-6 rounded-xl border-b-[4px] border-[#46A302] hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all duration-100 text-sm cursor-pointer"
          >
            Make landfall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-[550px] py-4 px-4 w-full max-w-md mx-auto text-on-background">
      {/* Brand Header */}
      <div className="text-center w-full mb-6 mt-2">
        <div className="inline-flex items-center gap-2 bg-[#58CC02]/10 text-[#58CC02] px-4 py-1.5 rounded-full border border-[#58CC02]/20 mb-3 animate-bounce">
          <Heart className="w-4 h-4 fill-[#58CC02]" />
          <span className="font-label-bold text-xs uppercase tracking-wider">Clinical Co-op Play</span>
        </div>
        <h1 className="font-display font-black text-4xl text-on-background tracking-tight">Driftwood</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">the island that only yields to together</p>
      </div>

      {/* Hero Illustration */}
      <div className="w-full relative aspect-square bg-surface-container-lowest rounded-[2rem] p-6 border-2 border-outline-variant mb-6 flex flex-col justify-center items-center">
        {/* Playful, inviting flat-vector design mimicking a physical board game or a supportive family circle */}
        <div className="relative w-40 h-40 flex items-center justify-center bg-[#CE9FFC] rounded-full shadow-inner animate-pulse">
          <Heart className="w-20 h-20 text-white fill-white/15" />
          <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center shadow-md border border-tertiary">
            <span className="text-lg">🔥</span>
          </div>
          <div className="absolute bottom-4 left-0 w-12 h-12 rounded-xl bg-surface-container-lowest shadow-md border-2 border-outline-variant flex items-center justify-center">
            <span className="text-xl">💬</span>
          </div>
        </div>
        
        <p className="font-display font-black text-lg text-on-background mt-6 text-center">Practice Safe Emotional Repair</p>
        <p className="font-sans text-xs text-on-surface-variant text-center max-w-xs mt-1">
          Learn, simulate, and resolve family tension in real-time, side-by-side or asynchronously.
        </p>
      </div>

      {/* The honest card — sandbox truth, no borrowed trust badges. */}
      <div className="w-full bg-surface-container-lowest rounded-[2rem] p-4 border-2 border-outline-variant mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-on-background">
          <ShieldCheck className="w-5 h-5 text-secondary" />
          <h2 className="font-display font-black text-sm text-on-surface">Honest, from the first plank</h2>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Your entries live on this device — no accounts, no recordings, no cloud copies.
          This is practice alongside real care, never a replacement for it. And it never
          handles an emergency: the real lines stay at the top of every screen, always.
        </p>
      </div>

      {/* Duolingo style 3D button */}
      <div className="w-full mt-auto">
        <button
          onClick={() => setStep('private')}
          className="w-full bg-[#1CB0F6] text-white font-display font-black py-3.5 px-6 rounded-xl border-b-[4px] border-[#1899D6] shadow-3d-secondary hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all duration-100 flex justify-center items-center gap-2 text-base cursor-pointer"
        >
          <span>Start Practicing</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
