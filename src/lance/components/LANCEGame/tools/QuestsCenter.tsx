import React from 'react';
import { Trophy, Star, Lock, Flame, Gem } from 'lucide-react';
import { useGame, useLevel } from '../LANCEGameContext';
import { GAME_CHALLENGES, CHALLENGE_MILESTONES } from '../lanceGameData';
import BigBackButton from '../BigBackButton';
import { TITLES, ACCENTS } from './RewardsStore';

interface Props { onBack: () => void; onOpenTool?: (toolId: string) => void; }

export default function QuestsCenter({ onBack, onOpenTool }: Props) {
  const { xp, gems, completedChallenges, streak, equippedTitle, equippedAccent } = useGame();
  const { level, progress: xpIntoLevel } = useLevel(xp);
  const total = GAME_CHALLENGES.length;
  const done = completedChallenges.length;
  const nextChallenge = GAME_CHALLENGES.find(c => !completedChallenges.includes(c.id));
  const equippedTitleName = TITLES.find(t => t.id === equippedTitle)?.name;
  const equippedAccentSwatch = equippedAccent !== 'teal' ? ACCENTS.find(a => a.id === equippedAccent)?.swatch : undefined;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#F9FAFB', color: '#3C3C3C' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F0F0F0' }}>
        <BigBackButton onBack={onBack} />
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Quests Center</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Your progress, milestones &amp; next step</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                <Star className="w-5 h-5" style={{ color: '#D97706' }} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Level</p>
                <p className="text-lg font-black" style={{ color: '#3C3C3C' }}>{level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Total XP</p>
              <p className="text-lg font-black font-mono" style={{ color: '#D97706' }}>{xp}</p>
            </div>
          </div>
          {(equippedTitleName || equippedAccentSwatch) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit mb-3"
              style={{ background: '#F3F4F6' }}>
              {equippedAccentSwatch && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: equippedAccentSwatch }} />}
              {equippedTitleName && <span className="text-[9.5px] font-black uppercase tracking-wide" style={{ color: '#3C3C3C' }}>{equippedTitleName}</span>}
            </div>
          )}
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
            <div className="h-full transition-all" style={{ width: `${xpIntoLevel}%`, background: 'linear-gradient(90deg, #FBBF24, #D97706)' }} />
          </div>
          <p className="text-[9.5px] mt-1" style={{ color: '#9CA3AF' }}>{xpIntoLevel}/100 XP to level {level + 1}</p>
        </div>

        <button
          onClick={() => onOpenTool?.('rewards_store')}
          className="w-full rounded-3xl p-4 border flex items-center gap-3 cursor-pointer text-left"
          style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#D1FAE5' }}>
            <Gem className="w-5 h-5" style={{ color: '#059669' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#059669' }}>{gems} Gems</p>
            <p className="text-[11px] font-bold" style={{ color: '#065F46' }}>Visit the Rewards Store</p>
          </div>
        </button>

        {streak > 0 && (
          <div className="rounded-3xl p-4 border flex items-center gap-3" style={{ background: '#FFF7ED', borderColor: '#FED7AA' }}>
            <Flame className="w-8 h-8 shrink-0" style={{ color: '#F97316' }} />
            <div>
              <p className="text-sm font-black" style={{ color: '#9A3412' }}>{streak}-day streak</p>
              <p className="text-[10px]" style={{ color: '#C2410C' }}>Challenges give a bonus the longer your streak runs.</p>
            </div>
          </div>
        )}

        <div className="rounded-3xl p-5 border" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5" style={{ color: '#F97316' }} />
            <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>Challenges: {done}/{total}</p>
          </div>
          {nextChallenge ? (
            <button
              onClick={() => onOpenTool?.('__challenges__')}
              className="w-full py-3 rounded-2xl text-white text-xs font-black cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              Continue: {nextChallenge.title}
            </button>
          ) : (
            <p className="text-[11px] font-semibold" style={{ color: '#059669' }}>All challenges complete. 🎉</p>
          )}
        </div>

        <div className="rounded-3xl p-5 border space-y-3" style={{ background: '#FFFFFF', borderColor: '#F0F0F0' }}>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: '#7C3AED' }} />
            <p className="text-sm font-black" style={{ color: '#3C3C3C' }}>Milestones</p>
          </div>
          <div className="space-y-2">
            {CHALLENGE_MILESTONES.map(m => {
              const unlocked = done >= m.count;
              return (
                <div key={m.count} className="flex items-center gap-3 p-3 rounded-2xl border"
                  style={unlocked ? { background: '#F5F3FF', borderColor: '#DDD6FE' } : { background: '#F9FAFB', borderColor: '#F0F0F0' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={unlocked ? { background: '#7C3AED' } : { background: '#E5E7EB' }}>
                    {unlocked ? <Trophy className="w-4 h-4 text-white" /> : <Lock className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black" style={{ color: unlocked ? '#5B21B6' : '#6B7280' }}>{m.title}</p>
                    <p className="text-[9.5px]" style={{ color: '#9CA3AF' }}>{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" style={{ color: unlocked ? '#059669' : '#9CA3AF' }}>
                    <Gem className="w-3 h-3" />
                    <span className="text-[10px] font-black">{m.gems}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
