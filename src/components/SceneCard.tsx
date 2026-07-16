import React, { useEffect, useRef, useState } from 'react';

// ═════════════════════════════════════════════════════════════════════════════
//  SCENE CARD — the 1.5–2s cinematic cut (Lance's 2026-07-16 commission).
//  A commissioned still fills the screen and slow-zooms toward the scene's
//  focus, then hands the screen to whatever is underneath. Used between
//  scenes, on tool/game entry, and at the ending — the short sibling of the
//  9s .story-kenburns hold that boarding and milestone openings keep.
//
//  Honest degradation: if the still 404s the card ends immediately — nothing
//  fakes it, no black hole, the tool just opens. Reduced-motion gets a short
//  static hold (the CSS stands the zoom down).
// ═════════════════════════════════════════════════════════════════════════════

export default function SceneCard({ src, video, focus, caption, onDone, durationMs = 2100 }: {
  src: string;
  /** Optional motion version — plays over the still when present and loadable.
   *  (2026-07-16: the cuts learn to move.) The still stays underneath as the
   *  poster, so a failed video degrades to the Ken Burns zoom, never black. */
  video?: string;
  /** transform-origin for the zoom, e.g. '62% 38%' — where the scene's focus lives. */
  focus?: string;
  caption?: string;
  onDone: () => void;
  durationMs?: number;
}) {
  const [dead, setDead] = useState(false);
  const [videoLive, setVideoLive] = useState(false);
  const done = useRef(false);
  const finish = () => { if (!done.current) { done.current = true; onDone(); } };

  useEffect(() => {
    const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    // a moving cut earns a longer hold — long enough to register, never linger
    const hold = reduced ? 800 : video ? Math.max(durationMs, 3400) : durationMs;
    const t = setTimeout(finish, hold);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dead) { finish(); return null; }
  return (
    <div className="fixed inset-0 z-[95] bg-black overflow-hidden scene-card-fade" onClick={finish}>
      <img
        src={src} alt="" aria-hidden
        className="w-full h-full object-cover story-kenburns-card"
        style={focus ? ({ ['--kb-origin' as any]: focus }) : undefined}
        onError={() => setDead(true)}
      />
      {video && (
        <video
          src={video} autoPlay muted playsInline aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoLive ? 1 : 0, transition: 'opacity 0.6s ease' }}
          onPlaying={() => setVideoLive(true)}
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        />
      )}
      {caption && (
        <p className="absolute bottom-6 inset-x-0 text-center text-white/85 text-[11px] font-black uppercase tracking-[0.2em] drop-shadow z-10">
          {caption}
        </p>
      )}
    </div>
  );
}
