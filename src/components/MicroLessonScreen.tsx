import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Copy, Send, CheckCircle2, Heart, Award, Sparkles } from 'lucide-react';
import { MICRO_LESSONS } from '../data/simulationScript';

interface MicroLessonScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function MicroLessonScreen({ onBack, onComplete }: MicroLessonScreenProps) {
  const lesson = MICRO_LESSONS[0]; // The Magic 5:1 Ratio
  const [gratitudeText, setGratitudeText] = useState("I really appreciated when you ");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(gratitudeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5 py-2 w-full max-w-md mx-auto text-on-background animate-fade-in-up">
      {/* Header Close Escape Hatch */}
      <div className="flex justify-between items-center bg-surface-container-lowest px-4 py-3 rounded-2xl border-2 border-outline-variant shadow-sm">
        <button 
          onClick={onBack}
          className="p-1.5 -ml-1 text-primary hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
        </button>
        <span className="font-display font-black text-sm text-[#4B4B4B]">Daily Micro-Lesson</span>
        <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Lesson Title & Concept Tag */}
      <div className="text-center px-2 mt-2">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#CE9FFC]/10 text-purple-700 font-display font-black text-[11px] uppercase tracking-wider mb-2 border-2 border-[#CE9FFC]/30">
          Gottman Framework
        </span>
        <h1 className="font-display font-black text-2xl text-on-background leading-tight">{lesson.title}</h1>
        <p className="font-sans text-xs text-on-surface-variant mt-1.5">{lesson.subtitle}</p>
      </div>

      {/* Concept Image / Balance Scale Card */}
      <div className="rounded-[2rem] bg-surface-container-lowest border-2 border-outline-variant shadow-sm overflow-hidden">
        {/* Playful scale concept layout with detailed graphic representation */}
        <div className="h-44 w-full bg-gradient-to-br from-secondary-container/10 to-primary/5 flex items-center justify-center p-4 relative border-b-2 border-outline-variant">
          <div className="flex items-center gap-6 z-10">
            {/* Positive pile */}
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 gap-1 bg-white p-3 rounded-xl shadow-3d-neutral border-2 border-outline-variant transform -rotate-6">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                <div className="w-6 h-6 rounded-full bg-tertiary-fixed flex items-center justify-center text-xs font-bold font-display border border-tertiary">
                  +2
                </div>
              </div>
              <span className="font-display font-black text-[10px] text-primary mt-3 uppercase tracking-wider">5 Positive</span>
            </div>

            {/* Scale pivot */}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">⚖️</span>
            </div>

            {/* Negative pile */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl shadow-3d-neutral border-2 border-rose-300 transform rotate-6">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="font-display font-black text-[10px] text-rose-600 mt-3 uppercase tracking-wider">1 Negative</span>
            </div>
          </div>

          <div className="absolute inset-0 bg-radial-gradient from-transparent to-surface-container-lowest/30 pointer-events-none" />
        </div>

        <div className="p-5 flex flex-col gap-3">
          <p className="font-sans text-xs text-[#4B4B4B] leading-relaxed">
            {lesson.gottmanRatioConcept}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {lesson.tags.map((t, i) => (
              <span key={i} className="text-[10px] font-black font-display px-2.5 py-1 rounded-full bg-surface-container-low text-primary border border-outline-variant">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Exercise Bento Box */}
      <div className="rounded-[2rem] bg-surface-container-lowest border-2 border-outline-variant shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5 text-primary">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
            <Heart className="w-4.5 h-4.5 fill-rose-500 text-rose-500" />
          </div>
          <h3 className="font-display font-black text-sm text-[#4B4B4B]">Gratitude Text Exercise</h3>
        </div>
        
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          {lesson.gratitudePrompt}
        </p>

        {/* Text Area Card */}
        <div className="bg-surface-container-low rounded-xl p-3 border-2 border-outline-variant relative transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <textarea
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-[#4B4B4B] focus:outline-none focus:ring-0 resize-none font-sans p-0 leading-relaxed placeholder:text-outline"
            rows={3}
            placeholder="I really appreciated when you..."
          />
          
          <div className="absolute bottom-2 right-2 flex gap-1.5 z-20">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${copied ? 'bg-secondary text-white' : 'bg-white text-on-surface-variant shadow-sm border border-outline-variant hover:bg-surface-container-high'}`}
              title="Copy to Clipboard"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {/* Send button */}
            <button
              onClick={handleSend}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${sent ? 'bg-primary text-white' : 'bg-secondary-container text-on-secondary-container shadow-sm border border-[#CE9FFC] hover:bg-secondary'}`}
              title="Send to Partner"
            >
              {sent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Copy/Sent toast simulation inside card */}
        {copied && (
          <p className="text-[10px] text-secondary font-bold text-center animate-fade-in">✓ Copied to clipboard! Ready to paste into your chat.</p>
        )}
        {sent && (
          <p className="text-[10px] text-primary font-bold text-center animate-fade-in">✓ Simulation: Appreciation deposited to Alex's bank!</p>
        )}
      </div>

      {/* Tactile primary complete button */}
      <div className="mt-2">
        <button
          onClick={onComplete}
          className="w-full bg-primary text-white font-display font-black py-3.5 px-6 rounded-xl border-b-[4px] border-primary-dark shadow-3d-primary hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all duration-100 flex justify-center items-center gap-2 text-base cursor-pointer"
        >
          <span>Complete Lesson</span>
          <Award className="w-5 h-5 fill-white/10 text-white" />
        </button>
      </div>
    </div>
  );
}
