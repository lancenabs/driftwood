import React from 'react';
import { ChevronLeft } from 'lucide-react';

// The one consistent, large, colorful "leave this app" control used across every
// tool screen (library-opened or challenge-hosted). Sized well above the ~44px
// minimum touch target so it stays easy to hit on small phones, not just desktop.
export default function BigBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      aria-label="Back"
      className="flex items-center gap-1.5 pl-2.5 pr-4 py-2.5 rounded-2xl font-black text-sm active:scale-95 transition-transform shrink-0"
      style={{
        background: 'linear-gradient(135deg,#7FD98C,#3ECFCF)',
        color: '#FFFFFF',
        textShadow: '0 1px 2px rgba(0,0,0,0.18)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 3px 0 rgba(46,150,140,0.55), 0 6px 16px rgba(62,207,207,0.35), inset 0 1px 0 rgba(255,255,255,0.45)',
      }}
    >
      <ChevronLeft className="w-6 h-6" strokeWidth={3} />
      Back
    </button>
  );
}
