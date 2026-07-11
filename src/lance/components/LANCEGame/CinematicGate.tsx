import React, { useMemo, useState } from 'react';
import { getCinematicSrc } from './lanceVideos';

// ─────────────────────────────────────────────────────────────────────────────
//  <CinematicGate slot="act2"> … </CinematicGate>
//
//  Plays the clip mapped to `slot` (skippable), then reveals `children`.
//
//  ABSENT BY DEFAULT — the whole point:
//   • Slot dormant, no clip, or kill-switch on  → renders children immediately.
//   • Clip missing / fails to load (onError)    → renders children immediately.
//  So a half-finished clip set never blocks testing or future building: empty
//  slots simply behave as if the gate isn't there.
//
//  Re-gates when `slot` changes (new act / new challenge), so one mounted gate
//  can serve a sequence of different cold-opens.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  slot: string | null; // null = no cinematic for this content (e.g. crisis tools)
  children: React.ReactNode;
}

export default function CinematicGate({ slot, children }: Props) {
  // Resolve once per slot (stable random pick across re-renders).
  const src = useMemo(() => (slot ? getCinematicSrc(slot) : null), [slot]);
  const [doneSlot, setDoneSlot] = useState<string | null>(null);

  const done = src === null || doneSlot === slot;
  if (done) return <>{children}</>;

  const finish = () => setDoneSlot(slot);

  return (
    <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center">
      <video
        key={src}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', background: '#000' }}
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        onError={finish} // never let a broken/missing clip block the content
      />
      <button
        onClick={finish}
        className="absolute z-10 px-4 py-2 rounded-full text-xs font-black text-white/90"
        style={{
          bottom: 'max(2rem, env(safe-area-inset-bottom))',
          right: '1.5rem',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
        }}
      >
        Skip ›
      </button>
    </div>
  );
}
