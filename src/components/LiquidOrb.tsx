import { useEffect, useRef } from 'react';
import { createLiquidOrb, type OrbHandle, type OrbTint } from '../lib/liquid-orb';

// The guide's face — the ecosystem's shared blue orb, in Driftwood's warm-wood
// alloy. Same engine as the command deck and the Companion; only the tint
// changes, so the guide feels like one intelligence across every world.

export default function LiquidOrb({
  size = 40,
  tint = 'wood',
  speaking = false,
  listening = false,
  busy = false,
}: {
  size?: number;
  tint?: OrbTint;
  speaking?: boolean;
  listening?: boolean;
  busy?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<OrbHandle | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const orb = createLiquidOrb(canvasRef.current, { size, tint });
    orbRef.current = orb;
    orb.setState({ speaking, listening, busy });
    return () => { orb.destroy(); orbRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, tint]);

  useEffect(() => {
    orbRef.current?.setState({ speaking, listening, busy });
  }, [speaking, listening, busy]);

  return (
    <span className="relative inline-grid place-items-center rounded-full shrink-0"
      style={{ width: size, height: size }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </span>
  );
}
