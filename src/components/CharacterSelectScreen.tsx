import React from 'react';
import { ArrowLeft, Star, Heart, Flame, Shield, ArrowRight } from 'lucide-react';
import { CHARACTERS } from '../data/simulationScript';
import { Character } from '../types';

interface CharacterSelectScreenProps {
  onBack: () => void;
  onSelectCharacter: (char: Character) => void;
}

export default function CharacterSelectScreen({ onBack, onSelectCharacter }: CharacterSelectScreenProps) {
  return (
    <div className="flex flex-col gap-5 py-2 w-full max-w-md mx-auto text-on-background animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center bg-surface-container-lowest px-4 py-3 rounded-2xl border-2 border-outline-variant shadow-sm">
        <button 
          onClick={onBack}
          className="p-1.5 -ml-1 text-primary hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
        </button>
        <span className="font-display font-black text-sm text-[#4B4B4B]">Practice Space</span>
        <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Scenario header and context */}
      <div className="px-2 mt-2 flex flex-col gap-2">
        <h1 className="font-display font-black text-2xl text-on-surface tracking-tight leading-tight">The Dirty Dish Dilemma</h1>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-black uppercase tracking-wider">
          <div className="flex text-tertiary">
            <Star className="w-4.5 h-4.5 fill-tertiary text-tertiary" />
            <Star className="w-4.5 h-4.5 fill-tertiary text-tertiary" />
            <Star className="w-4.5 h-4.5 fill-tertiary text-tertiary" />
          </div>
          <span>• Level 3 Simulation</span>
        </div>
      </div>

      {/* Scenario Context Card */}
      <div className="bg-[#1CB0F6]/10 rounded-[2rem] p-4 border-2 border-[#1CB0F6]/20 shadow-sm flex gap-3 items-start">
        <span className="text-2xl mt-0.5">ℹ️</span>
        <p className="font-sans text-xs text-[#4B4B4B] leading-relaxed">
          Sam promised to do the dishes but is on their phone. It's getting late, and the kitchen is still a mess. How will you approach this without triggering a major escalation?
        </p>
      </div>

      {/* Character Selector Section */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="font-display font-black text-xs text-on-surface-variant uppercase tracking-widest px-2">Choose the pattern the robot will stage</h3>
        
        <div className="flex flex-col gap-4">
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className="bg-surface-container-lowest rounded-[2rem] border-2 border-outline-variant p-5 shadow-sm flex flex-col gap-3 hover:border-primary hover:shadow-md active:translate-y-[2px] transition-all text-left relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {/* Character Header / Avatar / Badges */}
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-surface-container overflow-hidden border-2 border-outline-variant shadow-sm flex-shrink-0">
                  <img 
                    src={char.avatarUrl} 
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-black text-lg text-[#4B4B4B] leading-none mb-1">{char.name}</h4>
                    <span className={`text-[10px] font-black font-display px-2.5 py-1 rounded-full border-2 uppercase ${char.archetypeColor}`}>
                      {char.archetype}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[11px] text-on-surface-variant font-semibold">Difficulty:</span>
                    <span className="text-[11px] text-primary font-black">{'★'.repeat(char.difficulty)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {char.description}
              </p>

              {/* Action trigger button */}
              <div className="w-full bg-[#1CB0F6] text-white font-display font-black py-2.5 px-4 rounded-xl border-b-[4px] border-[#1899D6] group-hover:brightness-105 transition-all mt-1 flex justify-center items-center gap-1.5 shadow-3d-secondary">
                <span>Select {char.name}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
