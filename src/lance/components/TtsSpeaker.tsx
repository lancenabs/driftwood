import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, subscribeTts, stopSpeech } from '../utils/tts';

interface TtsSpeakerProps {
  text: string;
  className?: string;
  buttonText?: string;
  size?: 'xs' | 'sm' | 'md';
}

export default function TtsSpeaker({ 
  text, 
  className = "", 
  buttonText, 
  size = "xs" 
}: TtsSpeakerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Unsubscribe listener to set isPlaying properly if another speaker takes over or stops
    const unsubscribe = subscribeTts((activeText) => {
      setIsPlaying(activeText === text);
    });
    return () => {
      unsubscribe();
    };
  }, [text]);

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeech();
    } else {
      speakText(text);
    }
  };

  const getSizing = () => {
    switch(size) {
      case 'xs': return 'p-1 text-[9.5px]';
      case 'md': return 'p-2 text-xs';
      case 'sm':
      default:
        return 'p-1.5 text-[10px]';
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      title={isPlaying ? "Stop reading aloud" : "Read this aloud (Text-to-Speech)"}
      className={`inline-flex items-center gap-1 border rounded-lg transition-all duration-200 cursor-pointer ${getSizing()} ${
        isPlaying 
          ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold scale-[1.02] shadow-3xs animate-pulse' 
          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-500 hover:text-slate-800'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
          {buttonText && <span>Stop reading</span>}
          <span className="flex gap-0.5 items-end h-2.5 ml-1 select-none">
            <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.8s_infinite_100ms] h-1.5"></span>
            <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.8s_infinite_300ms] h-2.5"></span>
            <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.8s_infinite_200ms] h-1.5"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
          {buttonText ? <span>{buttonText}</span> : null}
        </>
      )}
    </button>
  );
}
