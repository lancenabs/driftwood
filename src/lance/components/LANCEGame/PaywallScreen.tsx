import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Lock, Zap, Star } from 'lucide-react';
import { useGame } from './LANCEGameContext';
import LanceAvatar from './LanceAvatar';
import { GAME_TOOLS, GAME_CHALLENGES } from './lanceGameData';

interface Props {
  toolId: string;
  toolName: string;
  toolEmoji: string;
  onBack: () => void;
}

const LANCE_PAYWALL_LINES = [
  "You've unlocked the foundation. What lies ahead requires commitment. I accept payment as a proxy for that.",
  "The Tier 1 and 2 tools are free because I wanted to assess your potential. Verdict: promising. Now pay.",
  "Everything beyond this point took years of clinical research to design. $9.99 is generous. You're welcome.",
  "Pro access. One purchase. All tiers. I've been told to mention this is 'a great deal.' I find that framing beneath me but here we are.",
];

const PRO_FEATURES = [
  { emoji: '🎡', label: 'Emotion Wheel' },
  { emoji: '✨', label: 'Gratitude Log' },
  { emoji: '🌙', label: 'Sleep Log' },
  { emoji: '🅿️', label: 'Worry Parking Lot' },
  { emoji: '🦉', label: 'Wise Mind (DBT)' },
  { emoji: '🚨', label: 'TIPP Crisis Skills' },
  { emoji: '🧭', label: 'Values Clarification' },
  { emoji: '🌑', label: 'Shadow Journal' },
  { emoji: '+ more', label: 'Tiers 5–7 unlocked' },
];

export default function PaywallScreen({ toolId, toolName, toolEmoji, onBack }: Props) {
  const { setPaidAccess } = useGame();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lanceLine] = useState(
    () => LANCE_PAYWALL_LINES[Math.floor(Math.random() * LANCE_PAYWALL_LINES.length)]
  );

  const tool = GAME_TOOLS.find(t => t.id === toolId);
  const unlockChallenge = tool?.challengeToUnlock
    ? GAME_CHALLENGES.find(c => c.id === tool.challengeToUnlock)
    : null;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/?lance_paid=1`,
          cancelUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else if (data.error === 'stripe_not_configured') {
        // Dev mode — grant access directly so you can test the tools
        setPaidAccess(true);
        onBack();
      } else {
        setError('Checkout failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24" style={{ background: '#071C38', color: '#E8F5F1' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
        style={{ background: 'rgba(5,18,48,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(62,207,207,0.1)' }}
      >
        <button onClick={onBack} className="p-2 rounded-xl" style={{ color: '#8BA8A0' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#3ECFCF' }}>Upgrade</div>
          <h2 className="text-sm font-black leading-none" style={{ color: '#E8F5F1' }}>L.A.N.C.E. Pro</h2>
        </div>
      </div>

      <div className="px-4 py-6 space-y-5">

        {/* Locked tool callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-5 border text-center space-y-3"
          style={{ background: '#0D2440', borderColor: '#3ECFCF22' }}
        >
          <div className="text-5xl">{toolEmoji}</div>
          <div>
            <div className="text-base font-black" style={{ color: '#E8F5F1' }}>{toolName}</div>
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
              style={{ background: '#3ECFCF11', color: '#3ECFCF66', border: '1px solid #3ECFCF22' }}
            >
              <Lock className="w-2.5 h-2.5" />
              Pro Tool — Tier 3+
            </div>
          </div>
        </motion.div>

        {/* LANCE speech */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3"
        >
          <LanceAvatar emotion="superior" size="sm" className="shrink-0" />
          <div className="flex-1">
            <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#3ECFCF66' }}>
              L.A.N.C.E.
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm text-xs italic font-medium leading-relaxed"
              style={{ background: '#0D2440', borderLeft: '2px solid #3ECFCF33', color: '#8BA8A0' }}
            >
              "{lanceLine}"
            </div>
          </div>
        </motion.div>

        {/* Challenge unlock path */}
        {unlockChallenge && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="rounded-2xl border px-4 py-3.5 flex items-start gap-3"
            style={{ background: '#0B2234', borderColor: '#7FD98C33' }}
          >
            <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#7FD98C' }} />
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#7FD98C' }}>
                Free path available
              </div>
              <p className="text-xs leading-snug" style={{ color: '#8BA8A0' }}>
                Complete{' '}
                <span className="font-black" style={{ color: '#E8F5F1' }}>"{unlockChallenge.title}"</span>
                {' '}in the Challenge tab to unlock this tool at no cost.
              </p>
            </div>
          </motion.div>
        )}

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl border overflow-hidden"
          style={{ borderColor: '#3ECFCF44', background: 'linear-gradient(135deg, #0E2850, #162C58)' }}
        >
          <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: '#3ECFCF11' }}>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-black" style={{ color: '#E8F5F1' }}>$9.99</div>
              <div className="text-xs mb-1 font-bold" style={{ color: '#8BA8A0' }}>one-time · lifetime access</div>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" style={{ color: '#f97316' }} />
              ))}
              <span className="text-[9px] font-bold" style={{ color: '#8BA8A0' }}>All future tools included</span>
            </div>
          </div>

          {/* Feature grid */}
          <div className="px-5 py-4">
            <div className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: '#3ECFCF' }}>
              Unlocks Everything ↓
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRO_FEATURES.map(f => (
                <div
                  key={f.label}
                  className="rounded-xl px-2 py-2 text-center text-[9px] font-bold"
                  style={{ background: '#071C38', color: '#8BA8A0' }}
                >
                  <div className="text-base mb-0.5">{f.emoji}</div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Value props */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          {[
            { icon: Zap, text: 'Instant access after payment — no subscriptions', color: '#3ECFCF' },
            { icon: Lock, text: 'Your data stays on your device, always', color: '#7FD98C' },
            { icon: Star, text: 'Built by an LPC — evidence-based tools only', color: '#f97316' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-3 px-1">
              <Icon className="w-4 h-4 shrink-0" style={{ color }} />
              <span className="text-xs font-medium" style={{ color: '#8BA8A0' }}>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        {error && (
          <p className="text-xs text-center font-bold" style={{ color: '#ef4444' }}>{error}</p>
        )}

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #3ECFCF, #7FD98C)', color: '#071C38' }}
        >
          {loading ? 'Opening checkout...' : 'Unlock Pro — $9.99'}
        </motion.button>

        <p className="text-center text-[9px] font-medium" style={{ color: '#3ECFCF33' }}>
          Secured by Stripe. No subscription. Cancel within 24h for a full refund.
        </p>
      </div>
    </div>
  );
}
