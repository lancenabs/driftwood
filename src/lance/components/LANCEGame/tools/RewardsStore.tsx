import React, { useState } from 'react';
import { Gem, Check, Lock, Sparkles } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';

interface TitleItem { id: string; name: string; cost: number; icon: string; }
interface AccentItem { id: string; name: string; cost: number; swatch: string; }

const BADGE_BASE = '/rewards-badges/';

export const TITLES: TitleItem[] = [
  { id: 'steady_breather', name: 'Steady Breather', cost: 15, icon: `${BADGE_BASE}steady_breather.webp` },
  { id: 'anchor_point', name: 'Anchor Point', cost: 20, icon: `${BADGE_BASE}anchor_point.webp` },
  { id: 'wave_rider', name: 'Wave Rider', cost: 20, icon: `${BADGE_BASE}wave_rider.webp` },
  { id: 'still_waters', name: 'Still Waters', cost: 25, icon: `${BADGE_BASE}still_waters.webp` },
  { id: 'night_owl', name: 'Night Owl', cost: 25, icon: `${BADGE_BASE}night_owl.webp` },
  { id: 'quiet_storm', name: 'Quiet Storm', cost: 30, icon: `${BADGE_BASE}quiet_storm.webp` },
  { id: 'deep_diver', name: 'Deep Diver', cost: 35, icon: `${BADGE_BASE}deep_diver.webp` },
  { id: 'dawn_chaser', name: 'Dawn Chaser', cost: 40, icon: `${BADGE_BASE}dawn_chaser.webp` },
  { id: 'storm_rider', name: 'Storm Rider', cost: 45, icon: `${BADGE_BASE}storm_rider.webp` },
  { id: 'the_grounded_one', name: 'The Grounded One', cost: 60, icon: `${BADGE_BASE}the_grounded_one.webp` },
];

export const ACCENTS: AccentItem[] = [
  { id: 'teal', name: 'Teal (Default)', cost: 0, swatch: '#0D9488' },
  { id: 'violet', name: 'Violet', cost: 20, swatch: '#7C3AED' },
  { id: 'amber', name: 'Amber', cost: 20, swatch: '#F59E0B' },
  { id: 'rose', name: 'Rose', cost: 25, swatch: '#EC4899' },
  { id: 'emerald', name: 'Emerald', cost: 25, swatch: '#10B981' },
  { id: 'sky', name: 'Sky', cost: 30, swatch: '#0EA5E9' },
  { id: 'indigo', name: 'Indigo', cost: 35, swatch: '#4F46E5' },
  { id: 'sunset', name: 'Sunset', cost: 50, swatch: 'linear-gradient(135deg,#F97316,#EC4899)' },
];

interface Props { onBack: () => void; }

export default function RewardsStore({ onBack }: Props) {
  const { gems, purchasedRewards, equippedTitle, equippedAccent, purchaseReward, equipReward } = useGame();
  const [tab, setTab] = useState<'titles' | 'accents'>('titles');
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  const buy = (id: string, name: string, cost: number) => {
    const ok = purchaseReward(id, cost);
    flash(ok ? `Unlocked "${name}"!` : 'Not enough Gems yet.');
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ color: '#E7ECF2' }}>
      {/* The Vault — LANCE's trophy room. This tool goes fully dark-immersive. */}
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/gamification.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(6px) brightness(0.75)', transform: 'scale(1.06)',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(6,12,16,0.72) 0%, rgba(6,12,16,0.82) 100%)',
      }} />
      <div className="relative sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(8,14,18,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(127,217,140,0.2)' }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/rewards_store.webp" alt="" draggable={false}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 12px rgba(62,207,207,0.4)' }} />
        <div className="flex-1">
          <h2 className="text-sm font-black text-white">The Vault</h2>
          <p className="text-[10px]" style={{ color: 'rgba(231,236,242,0.65)' }}>Spend Gems earned from challenges</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(110,231,183,0.4)' }}>
          <Gem className="w-3.5 h-3.5" style={{ color: '#6EE7B7' }} />
          <span className="text-sm font-black font-mono" style={{ color: '#6EE7B7' }}>{gems}</span>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(231,236,242,0.7)' }}>
          Earn Gems by completing challenges — a small amount for every one, more for finishing an Act. Spend them here on cosmetic titles and profile colors. Gems never affect your XP or level.
        </p>

        <div className="flex p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <button
            onClick={() => setTab('titles')}
            className="flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition"
            style={tab === 'titles' ? { background: 'linear-gradient(135deg,#7FD98C,#3ECFCF)', color: '#06282A', boxShadow: '0 2px 10px rgba(62,207,207,0.4)' } : { color: 'rgba(231,236,242,0.55)' }}
          >
            🏷️ Titles
          </button>
          <button
            onClick={() => setTab('accents')}
            className="flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition"
            style={tab === 'accents' ? { background: 'linear-gradient(135deg,#7FD98C,#3ECFCF)', color: '#06282A', boxShadow: '0 2px 10px rgba(62,207,207,0.4)' } : { color: 'rgba(231,236,242,0.55)' }}
          >
            🎨 Accent Colors
          </button>
        </div>

        {tab === 'titles' && (
          <div className="space-y-2">
            {TITLES.map(item => {
              const owned = purchasedRewards.includes(item.id);
              const equipped = equippedTitle === item.id;
              return (
                <div key={item.id} className="p-3.5 rounded-2xl flex items-center gap-3" style={{
                  background: equipped ? 'rgba(110,231,183,0.1)' : 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${equipped ? 'rgba(110,231,183,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  boxShadow: owned ? '0 4px 18px rgba(62,207,207,0.15)' : 'none',
                }}>
                  {/* Badge on its pedestal — glass case glow when owned */}
                  <div className="relative shrink-0">
                    <img
                      src={item.icon}
                      alt=""
                      className="w-11 h-11 rounded-full"
                      style={{
                        opacity: owned ? 1 : 0.3,
                        filter: owned ? 'drop-shadow(0 0 10px rgba(62,207,207,0.55))' : 'grayscale(1)',
                      }}
                    />
                    <div aria-hidden className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full" style={{
                      background: owned ? 'linear-gradient(90deg,#7FD98C88,#3ECFCF88)' : 'rgba(255,255,255,0.1)',
                      filter: owned ? 'blur(1px)' : 'none',
                    }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-bold truncate text-white">{item.name}</p>
                    {!owned && (
                      <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: 'rgba(231,236,242,0.55)' }}>
                        <Gem className="w-3 h-3" /> {item.cost} Gems
                      </p>
                    )}
                  </div>
                  {owned ? (
                    <button
                      onClick={() => equipReward('title', equipped ? '' : item.id)}
                      className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1"
                      style={equipped ? { background: 'rgba(110,231,183,0.2)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.4)' } : { background: 'rgba(255,255,255,0.1)', color: 'rgba(231,236,242,0.75)' }}
                    >
                      {equipped ? <><Check className="w-3 h-3" /> Equipped</> : 'Equip'}
                    </button>
                  ) : (
                    <button
                      onClick={() => buy(item.id, item.name, item.cost)}
                      disabled={gems < item.cost}
                      className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg,#7FD98C,#3ECFCF)', color: '#06282A', boxShadow: '0 2px 10px rgba(62,207,207,0.35)' }}
                    >
                      {gems < item.cost ? <Lock className="w-3 h-3" /> : 'Unlock'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'accents' && (
          <div className="grid grid-cols-2 gap-2.5">
            {ACCENTS.map(item => {
              const owned = item.cost === 0 || purchasedRewards.includes(item.id);
              const equipped = equippedAccent === item.id;
              return (
                <div key={item.id} className="p-3 rounded-2xl space-y-2" style={{
                  background: equipped ? 'rgba(110,231,183,0.1)' : 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${equipped ? 'rgba(110,231,183,0.5)' : 'rgba(255,255,255,0.12)'}`,
                }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full shrink-0" style={{ background: item.swatch, boxShadow: '0 0 8px rgba(255,255,255,0.2)' }} />
                    <p className="text-[11.5px] font-bold truncate text-white">{item.name}</p>
                  </div>
                  {owned ? (
                    <button
                      onClick={() => equipReward('accent', item.id)}
                      className="w-full py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
                      style={equipped ? { background: 'rgba(110,231,183,0.2)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.4)' } : { background: 'rgba(255,255,255,0.1)', color: 'rgba(231,236,242,0.75)' }}
                    >
                      {equipped ? <><Check className="w-3 h-3" /> Equipped</> : 'Equip'}
                    </button>
                  ) : (
                    <button
                      onClick={() => buy(item.id, item.name, item.cost)}
                      disabled={gems < item.cost}
                      className="w-full py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1"
                      style={{ background: 'linear-gradient(135deg,#7FD98C,#3ECFCF)', color: '#06282A', boxShadow: '0 2px 10px rgba(62,207,207,0.35)' }}
                    >
                      <Gem className="w-3 h-3" /> {item.cost}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-lg flex items-center gap-1.5 z-20" style={{ background: '#1F2937' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#FBBF24' }} /> {toast}
          </div>
        )}
      </div>
    </div>
  );
}
