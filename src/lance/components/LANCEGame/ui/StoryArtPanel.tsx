import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
//  StoryArtPanel — a full-bleed illustrated panel from /story-art/ with a
//  bottom gradient caption. Degrades to nothing if the art file is missing,
//  so tools never show a broken frame.
// ─────────────────────────────────────────────────────────────────────────────

export default function StoryArtPanel({
  src, eyebrow, caption, aspect = '16/9', rounded = 24,
}: {
  src: string;
  eyebrow?: string;
  caption?: string;
  aspect?: string;
  rounded?: number;
}) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: aspect, borderRadius: rounded, boxShadow: '0 10px 28px rgba(0,0,0,0.18)' }}>
      <img
        src={src} alt="" draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setBroken(true)}
      />
      {(eyebrow || caption) && (
        <>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 px-4 py-3">
            {eyebrow && (
              <p className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: '#7FD98C', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
                {eyebrow}
              </p>
            )}
            {caption && (
              <p className="text-xs font-black text-white leading-snug" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                {caption}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
