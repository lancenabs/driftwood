export interface OrbState {
  speaking?: boolean;
  listening?: boolean;
  busy?: boolean;
}

export interface OrbHandle {
  setState(next: OrbState): void;
  resize(px: number): void;
  destroy(): void;
  webgl: boolean;
}

export type OrbTint = 'blue' | 'wood' | 'steel' | (string & {}) | [number, number, number];
// Named world tint, a '#rrggbb' hex (any per-agent colour), or an [r,g,b] alloy.

export function createLiquidOrb(
  canvas: HTMLCanvasElement,
  opts?: { size?: number; dpr?: number; tint?: OrbTint },
): OrbHandle;
