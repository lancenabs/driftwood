import React from 'react';
import { GlassPanel } from '../lance/components/LANCEGame/ui/GlassKit';

// The First Mate's coach card — Rehabit's voice inside library tools.
// No character art borrowed from the island; the Mate is his own crew.
export default function MateCard({ children }: { children: React.ReactNode }) {
  return (
    <GlassPanel className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 shadow-md shadow-teal-900/20 bg-teal-700">
          <img src="/mate/emblem.webp" alt="" loading="lazy" className="w-full h-full object-cover"
            onError={e => { const t = e.target as HTMLImageElement; t.style.display = 'none'; }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-black uppercase tracking-widest mb-1 text-teal-700">The First Mate</div>
          <div className="text-xs leading-relaxed text-slate-600">{children}</div>
        </div>
      </div>
    </GlassPanel>
  );
}
