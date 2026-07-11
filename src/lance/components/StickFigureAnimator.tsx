import React from 'react';
import { motion } from 'motion/react';

interface StickFigureAnimatorProps {
  type: string; // 'thoughts' | 'behaviors' | 'emotions' | 'sensation' | 'playing' | 'running' | 'painting' | 'couple' | 'group' | 'holding_hands'
  className?: string;
}

export default function StickFigureAnimator({ type, className = "w-10 h-10" }: StickFigureAnimatorProps) {
  let normType = type.toLowerCase();
  
  if (normType === 'high-good') normType = 'playing';
  if (normType === 'high-down') normType = 'running';
  if (normType === 'low-good') normType = 'thoughts';
  if (normType === 'low-down') normType = 'sensation';

  // 1. thoughts
  if (normType === 'thoughts') {
    return (
      <svg className={`${className} text-emerald-600`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Thinker Stick Figure sitting in lotus position */}
        <g>
          {/* Head */}
          <circle cx="25" cy="18" r="3.5" stroke="currentColor" strokeWidth="2" />
          
          {/* Spine */}
          <line x1="25" y1="21.5" x2="25" y2="30" stroke="currentColor" strokeWidth="2" />
          
          {/* Crossed legs */}
          <path d="M 20 30 Q 25 33, 30 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 18 32 C 18 36, 32 36, 32 32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          
          {/* Arms resting on knees (C-shape meditation mudra) */}
          <path d="M 21.5 24 Q 16 26, 18 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 28.5 24 Q 34 26, 32 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
        
        {/* Animated rising thoughts / sparkles */}
        <motion.circle
          cx="25"
          cy="10"
          r="1.5"
          fill="currentColor"
          animate={{ y: [0, -6, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
        <motion.circle
          cx="21"
          cy="8"
          r="1"
          fill="currentColor"
          animate={{ y: [0, -4, 0], opacity: [0.1, 0.8, 0.1] }}
          transition={{ repeat: Infinity, duration: 2.2, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="29"
          cy="8"
          r="1.2"
          fill="currentColor"
          animate={{ y: [0, -5, 0], opacity: [0.1, 0.9, 0.1] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // 2. behaviors
  if (normType === 'behaviors') {
    return (
      <svg className={`${className} text-sky-600`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Active jumping jack stick figure representing behavioral vitality */}
        <motion.g
          animate={{ 
            y: [0, -3, 0],
            scaleY: [1, 0.95, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
          style={{ originX: "25px", originY: "38px" }}
        >
          {/* Head */}
          <circle cx="25" cy="14" r="3.5" stroke="currentColor" strokeWidth="2" />
          
          {/* Spine */}
          <line x1="25" y1="17.5" x2="25" y2="28" stroke="currentColor" strokeWidth="2" />
          
          {/* Active wide reaching arms */}
          <motion.path 
            d="M 25 21 L 14 15 M 25 21 L 36 15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
            style={{ originX: "25px", originY: "21px" }}
          />
          
          {/* Active wide stance legs */}
          <path d="M 25 28 L 16 38 M 25 28 L 34 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        
        {/* Dynamic velocity trails */}
        <motion.line
          x1="12" y1="36" x2="12" y2="40"
          stroke="currentColor" strokeWidth="1"
          animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeOut" }}
        />
        <motion.line
          x1="38" y1="36" x2="38" y2="40"
          stroke="currentColor" strokeWidth="1"
          animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeOut" }}
        />
      </svg>
    );
  }

  // 3. emotions
  if (normType === 'emotions') {
    return (
      <svg className={`${className} text-rose-500`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Joyful dancing stick figure for Emotions */}
        <motion.g
          animate={{ 
            rotate: [-6, 6, -6],
            y: [0, -1.5, 0]
          }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          style={{ originX: "25px", originY: "38px" }}
        >
          {/* Head */}
          <circle cx="25" cy="14" r="3.5" stroke="currentColor" strokeWidth="2" />
          
          {/* Curved spine */}
          <path d="M 25 17.5 Q 23 23, 25 28" stroke="currentColor" strokeWidth="2" fill="none" />
          
          {/* Sway expressive arms */}
          <path d="M 24 21 Q 14 18, 16 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 24 21 Q 36 18, 34 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          {/* Dancing legs */}
          <path d="M 25 28 L 19 38 M 25 28 L 30 38 L 34 37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </motion.g>
        
        {/* Floating tiny heart icons */}
        <motion.path
          d="M 12 16 C 11 14, 9 14, 9 16 C 9 18, 12 20, 12 20 C 12 20, 15 18, 15 16 C 15 14, 13 14, 12 16 Z"
          fill="currentColor"
          className="opacity-75"
          animate={{ y: [0, -8, 0], scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.95, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 38 18 C 37 16, 35 16, 35 18 C 35 20, 38 22, 38 22 C 38 22, 41 20, 41 18 C 41 16, 39 16, 38 18 Z"
          fill="currentColor"
          className="opacity-75"
          animate={{ y: [2, -6, 2], scale: [0.9, 1.2, 0.9], opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.8, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // 4. playing (New: Playing with bounding ball / juggling)
  if (normType === 'playing') {
    return (
      <svg className={`${className} text-amber-500`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
          animate={{ 
            y: [0, 1, -1, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          style={{ originX: "25px", originY: "38px" }}
        >
          {/* Head */}
          <circle cx="25" cy="15" r="3.5" stroke="currentColor" strokeWidth="2" />
          
          {/* Spine */}
          <line x1="25" y1="18.5" x2="25" y2="30" stroke="currentColor" strokeWidth="2" />
          
          {/* Playing outstretched arms ready to catch / throw */}
          <path d="M 25 21 C 18 21, 14 18, 12 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 25 21 C 32 21, 36 18, 38 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          {/* Welcoming legs */}
          <path d="M 25 30 L 18 40 Q 21 40, 20 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 25 30 L 32 40 Q 29 40, 30 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </motion.g>

        {/* Bouncing ball/toy */}
        <motion.circle
          cx="25"
          cy="8"
          r="3"
          fill="currentColor"
          animate={{ 
            y: [-2, -22, -2],
            x: [0, -4, 4, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
        />

        {/* Small sparkels from play */}
        <motion.circle
          cx="12"
          cy="20"
          r="1"
          fill="currentColor"
          animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.2, 0.8, 0.2] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        />
        <motion.circle
          cx="38"
          cy="20"
          r="1"
          fill="currentColor"
          animate={{ scale: [1.5, 0.5, 1.5], opacity: [0.8, 0.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // 5. running (New: Energetic side running figure)
  if (normType === 'running') {
    return (
      <svg className={`${className} text-teal-500`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
          animate={{ 
            x: [-1, 2, -1],
            y: [0, -1.5, 0.5, 0],
            skewX: [0, -2, 2, 0]
          }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          style={{ originX: "25px", originY: "38px" }}
        >
          {/* Head looking forward (right) */}
          <circle cx="28" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
          
          {/* Spine tilted forward */}
          <line x1="28" y1="16.5" x2="23" y2="29" stroke="currentColor" strokeWidth="2.2" />
          
          {/* Running arms */}
          {/* Left arm swung back */}
          <path d="M 26 20 L 17 21 L 13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Right arm swung forward */}
          <path d="M 26 20 L 33 24 L 37 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          {/* Running legs */}
          {/* Left leg back */}
          <path d="M 23 29 L 14 30 L 11 39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Right leg forward */}
          <path d="M 23 29 L 31 34 L 26 42" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Speed lines on left */}
        <motion.line x1="6" y1="18" x2="11" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" animate={{ x: [-4, 6, -4], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
        <motion.line x1="4" y1="26" x2="9" y2="26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" animate={{ x: [-2, 8, -2], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }} />
        <motion.line x1="6" y1="34" x2="11" y2="34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" animate={{ x: [-5, 5, -5], opacity: [0, 0.7, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.05 }} />
      </svg>
    );
  }

  // 6. painting (New: Art creation stick figure)
  if (normType === 'painting') {
    return (
      <svg className={`${className} text-fuchsia-500`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Easel */}
        <path d="M 32 36 L 36 18 L 40 36 M 31 23 L 41 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="33" y="19" width="6" height="5" rx="0.5" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />

        {/* Stick figure artist */}
        <motion.g
          animate={{ 
            y: [0, -0.5, 0],
          }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          {/* Head */}
          <circle cx="18" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
          
          {/* Spine */}
          <line x1="18" y1="19.5" x2="18" y2="31" stroke="currentColor" strokeWidth="2" />
          
          {/* Left arm resting by hip */}
          <path d="M 18 22 Q 13 24, 15 29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          
          {/* Right arm holding brush up and painting */}
          <motion.path 
            d="M 18 22 L 26 20 M 26 20 L 34 21" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            strokeLinecap="round"
            animate={{ 
              rotate: [-15, 10, -15],
              x: [0, 1.5, -0.5, 0]
            }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            style={{ originX: "18px", originY: "22px" }}
          />
          
          {/* Supporting legs */}
          <path d="M 18 31 L 13 41 M 18 31 L 23 41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* Colorful paint stars floating up from easel */}
        <motion.circle
          cx="36"
          cy="15"
          r="1.2"
          fill="currentColor"
          animate={{ y: [0, -6], scale: [0.5, 1.3, 0.4], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        <motion.circle
          cx="39"
          cy="17"
          r="1"
          fill="currentColor"
          animate={{ y: [0, -5], x: [0, 2], scale: [0.5, 1.2, 0.4], opacity: [0, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.4, ease: "linear" }}
        />
      </svg>
    );
  }

  // 7. couple or holding_hands (New: Two figures holding hands with pulsing heart)
  if (normType === 'couple' || normType === 'couples' || normType === 'holding_hands') {
    return (
      <svg className={`${className} text-rose-500`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left figure */}
        <motion.g
          animate={{ 
            y: [0, -1, 0],
            rotate: [-1.5, 1.5, -1.5]
          }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ originX: "17px", originY: "38px" }}
        >
          {/* Head */}
          <circle cx="17" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
          {/* Spine */}
          <line x1="17" y1="21" x2="17" y2="31" stroke="currentColor" strokeWidth="1.8" />
          {/* Left isolated arm */}
          <path d="M 17 23.5 C 13 25, 11 23, 9 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Right holding arm */}
          <path d="M 17 23.5 L 24 28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          {/* Legs */}
          <path d="M 17 31 L 13 41 M 17 31 L 20 41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>

        {/* Right figure */}
        <motion.g
          animate={{ 
            y: [0, -1, 0],
            rotate: [1.5, -1.5, 1.5]
          }}
          transition={{ repeat: Infinity, duration: 1.8, delay: 0.15, ease: "easeInOut" }}
          style={{ originX: "33px", originY: "38px" }}
        >
          {/* Head */}
          <circle cx="33" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
          {/* Spine */}
          <line x1="33" y1="21" x2="33" y2="31" stroke="currentColor" strokeWidth="1.8" />
          {/* Right isolated arm */}
          <path d="M 33 23.5 C 37 25, 39 23, 41 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Left holding arm */}
          <path d="M 33 23.5 L 26 28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          {/* Legs */}
          <path d="M 33 31 L 30 41 M 33 31 L 37 41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>

        {/* Held Hands point connection */}
        <circle cx="25" cy="27.5" r="1.5" fill="currentColor" />

        {/* Glowing Hearts rising in center */}
        <motion.path
          d="M 25 10 C 24.5 9, 23.5 9, 23.5 10 C 23.5 11.2, 25 12.5, 25 12.5 C 25 12.5, 26.5 11.2, 26.5 10 C 26.5 9, 25.5 9, 25 10 Z"
          fill="currentColor"
          animate={{ 
            scale: [0.9, 1.4, 0.9],
            y: [0, -4, 0]
          }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          style={{ originX: "25px", originY: "11px" }}
        />
      </svg>
    );
  }

  // 8. group or groups (New: Three cheerful dancing/holding figures)
  if (normType === 'group' || normType === 'groups') {
    return (
      <svg className={`${className} text-teal-600`} viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          {/* Figure 1 Left */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0, ease: "easeInOut" }}
          >
            <circle cx="15" cy="18" r="2.8" stroke="currentColor" strokeWidth="1.8" />
            <line x1="15" y1="21" x2="15" y2="31" stroke="currentColor" strokeWidth="1.8" />
            {/* outer arm waving */}
            <path d="M 15 23 L 7 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            {/* inner arm holding next */}
            <path d="M 15 23 L 23 27" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 15 31 L 11 40 H 9 M 15 31 L 18 40" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </motion.g>

          {/* Figure 2 Center */}
          <motion.g
            animate={{ y: [-2, 1, -2] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: 0.2, ease: "easeInOut" }}
          >
            <circle cx="30" cy="16" r="2.8" stroke="currentColor" strokeWidth="1.8" />
            <line x1="30" y1="19" x2="30" y2="29" stroke="currentColor" strokeWidth="1.8" />
            {/* Left arm holding */}
            <path d="M 30 21.5 L 22 25.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            {/* Right arm holding */}
            <path d="M 30 21.5 L 38 25.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 30 29 L 26 39 M 30 29 L 34 39" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </motion.g>

          {/* Figure 3 Right */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4, ease: "easeInOut" }}
          >
            <circle cx="45" cy="18" r="2.8" stroke="currentColor" strokeWidth="1.8" />
            <line x1="45" y1="21" x2="45" y2="31" stroke="currentColor" strokeWidth="1.8" />
            {/* inner arm holding prev */}
            <path d="M 45 23 L 37 27" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            {/* outer arm waving */}
            <path d="M 45 23 L 53 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 45 31 L 42 40 M 45 31 L 49 40 H 51" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </motion.g>
        </g>

        {/* Happy sparkles */}
        <motion.circle cx="30" cy="7" r="1.2" fill="currentColor" animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.3, 0.9, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
        <motion.circle cx="21" cy="9" r="0.8" fill="currentColor" animate={{ scale: [1.2, 0.4, 1.2], opacity: [0.8, 0.2, 0.8] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} />
        <motion.circle cx="39" cy="9" r="1" fill="currentColor" animate={{ scale: [1.5, 0.5, 1.5], opacity: [0.9, 0.1, 0.9] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} />
      </svg>
    );
  }

  // 9. Default sensation / Somatics
  return (
    <svg className={`${className} text-indigo-600`} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calm somatic breathing stick figure */}
      <g>
        {/* Head */}
        <circle cx="25" cy="15" r="3.5" stroke="currentColor" strokeWidth="2" />
        
        {/* Spine */}
        <line x1="25" y1="18.5" x2="25" y2="30" stroke="currentColor" strokeWidth="2" />
        
        {/* Open receiving arms */}
        <path d="M 25 21 C 18 21, 15 24, 13 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 25 21 C 32 21, 35 24, 37 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        
        {/* Stable solid legs */}
        <path d="M 25 30 L 19 40 M 25 30 L 31 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Somatic breathing expand wave rings */}
      <motion.circle
        cx="25"
        cy="23"
        r="4"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        fill="none"
        animate={{ r: [4, 16], opacity: [0.8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
      />
      <motion.circle
        cx="25"
        cy="23"
        r="4"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        fill="none"
        animate={{ r: [4, 16], opacity: [0.8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, delay: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}
