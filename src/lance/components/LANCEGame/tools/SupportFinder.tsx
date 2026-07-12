import React, { useState } from 'react';
import { Compass, MapPin, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface ResourceItem {
  name: string;
  type: string;
  description: string;
  locationDetails?: string;
  scheduleOrVibe?: string;
  focusArea?: string;
  link?: string;
}

interface ExplorerResults {
  activities: ResourceItem[];
  groups: ResourceItem[];
  insightText: string;
  isFallback?: boolean;
}

const LOCATION_KEY = 'lance_support_finder_location_v1';
const RESULTS_KEY = 'lance_support_finder_results_v1';

interface Props { onBack: () => void; }

export default function SupportFinder({ onBack }: Props) {
  const { userName, addXp } = useGame();
  const [location, setLocation] = useState(() => localStorage.getItem(LOCATION_KEY) || '');
  const [focus, setFocus] = useState('General Wellness');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ExplorerResults | null>(() => {
    try {
      const raw = localStorage.getItem(RESULTS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem(LOCATION_KEY, location);
      const res = await fetch('/api/therapy/local-explorer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, focus, userName }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data);
        localStorage.setItem(RESULTS_KEY, JSON.stringify(data));
        addXp(15);
      } else {
        setError(data.error || 'Could not fetch local resources.');
      }
    } catch {
      setError('Could not connect. Showing you the fallback resources below if any were cached.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/relational.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Support Finder</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Local resources &amp; groups</p>
        </div>
        <Compass className="w-5 h-5" style={{ color: '#0D9488' }} />
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        {/* Crisis lines live in Settings → Safety & Crisis (therapist-configured
            per state, 2026-07-12 law) — no hotline block on tool surfaces. */}
        <form onSubmit={search} className="rounded-3xl p-5 border space-y-3" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <p className="text-[11px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>
            Find nearby nature spaces and peer support groups matched to what you're working on.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[8px] uppercase tracking-wider font-extrabold block mb-1" style={{ color: '#9CA3AF' }}>Your area</label>
              <input
                type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Seattle, WA"
                className="w-full px-3 py-2 rounded-xl text-[11px] font-semibold outline-none border"
                style={{ background: '#F9FAFB', color: '#3C3C3C', borderColor: '#F0F0F0' }}
              />
            </div>
            <div>
              <label className="text-[8px] uppercase tracking-wider font-extrabold block mb-1" style={{ color: '#9CA3AF' }}>Focus</label>
              <select
                value={focus} onChange={(e) => setFocus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-[11px] font-semibold outline-none border"
                style={{ background: '#F9FAFB', color: '#3C3C3C', borderColor: '#F0F0F0' }}
              >
                <option>General Wellness</option>
                <option>Anxiety & Panic</option>
                <option>Grief & Loss</option>
                <option>Recovery & Sobriety</option>
                <option>Relationship Support</option>
              </select>
            </div>
          </div>
          <button
            type="submit" disabled={loading || !location.trim()}
            className="w-full py-2.5 rounded-xl text-white text-xs font-black transition cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
            style={{ background: '#0D9488' }}
          >
            {loading ? (<><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Searching...</>) : 'Find Local Support'}
          </button>
          {error && <p className="text-[10.5px] font-semibold" style={{ color: '#DC2626' }}>{error}</p>}
        </form>

        {results && (
          <div className="space-y-4">
            {results.isFallback && (
              <p className="text-[10px] italic text-center" style={{ color: '#9CA3AF' }}>Showing general resources — live lookup is temporarily unavailable.</p>
            )}
            <div className="rounded-2xl p-4" style={{ background: '#F0FDFA', border: '1px solid #99F6E4' }}>
              <p className="text-[11px] leading-relaxed font-semibold" style={{ color: '#134E4A' }}>{results.insightText}</p>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Nature &amp; activity spaces</p>
              {results.activities.map((item, idx) => (
                <div key={idx}><ResourceCard item={item} /></div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Support groups</p>
              {results.groups.map((item, idx) => (
                <div key={idx}><ResourceCard item={item} /></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceCard({ item }: { item: ResourceItem }) {
  return (
    <div className="p-3.5 rounded-2xl border space-y-1" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11.5px] font-bold" style={{ color: '#3C3C3C' }}>{item.name}</p>
          <p className="text-[9.5px] font-semibold" style={{ color: '#0D9488' }}>{item.type}</p>
        </div>
        {item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1.5 rounded-lg" style={{ color: '#0D9488', background: '#F0FDFA' }}>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      <p className="text-[10.5px] leading-relaxed" style={{ color: '#6B7280' }}>{item.description}</p>
      {(item.locationDetails || item.scheduleOrVibe) && (
        <p className="text-[9.5px] flex items-center gap-1" style={{ color: '#9CA3AF' }}>
          <MapPin className="w-3 h-3" /> {item.locationDetails || item.scheduleOrVibe}
        </p>
      )}
    </div>
  );
}
