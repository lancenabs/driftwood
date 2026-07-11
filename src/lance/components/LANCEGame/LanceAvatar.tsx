import React from 'react';
import { NARRATOR } from './narrator';

// ─── The narrator's face (narrator seam) ─────────────────────────────────────
// On the island this was L.A.N.C.E.'s animated cyan console face. On this ship
// the voice inside the tools is the Workshop shipmate, so the face is his —
// warm brass in lantern light. The props interface is unchanged so all ~15
// tool interiors that render an avatar keep working untouched; the emotion
// prop is accepted (and ignored) until posed shipmate art lands.

export type LanceEmotion =
  | 'neutral'
  | 'smug'
  | 'superior'
  | 'annoyed'
  | 'reluctant_approval'
  | 'processing'
  | 'vulnerable'
  | 'warm';

interface Props {
  emotion?: LanceEmotion;
  size?: 'sm' | 'md' | 'lg';
  speaking?: boolean;
  className?: string;
}

const SIZE_MAP = { sm: 48, md: 112, lg: 160 };

export default function LanceAvatar({
  size = 'md',
  className = '',
}: Props) {
  const px = SIZE_MAP[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: px, height: px }}
    >
      <img
        src={NARRATOR.portrait}
        alt=""
        draggable={false}
        className="rounded-2xl object-cover"
        style={{
          width: px,
          height: px,
          border: '1px solid rgba(176,141,87,0.45)',
          boxShadow: '0 0 14px rgba(255,196,110,0.25), 0 2px 8px rgba(0,0,0,0.25)',
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>
  );
}
