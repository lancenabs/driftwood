import React from 'react';
import { motion } from 'motion/react';

interface InternAvatarProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  isSpeaking?: boolean;
  expression?: 'smiling' | 'neutral' | 'concerned' | 'surprised';
  dayNightMode?: 'day' | 'night';
}

export default function InternAvatar({
  id,
  size = 'md',
  className = '',
  isSpeaking = false,
  expression = 'smiling',
  dayNightMode
}: InternAvatarProps) {
  // Option C: Mascot responsive accessories state (defaults to localStorage so it works automatically)
  const activeMode = dayNightMode || (typeof window !== 'undefined' ? localStorage.getItem('therapy_day_night_mode') as 'day' | 'night' : 'day') || 'day';
  
  // Custom uploaded portrait from local storage
  const [customImage, setCustomImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadImage = () => {
      if (typeof window !== 'undefined') {
        setCustomImage(localStorage.getItem('custom_intern_avatar_image'));
      }
    };
    loadImage();
    
    // Listen for storage events to update avatar immediately when uploaded
    window.addEventListener('storage', loadImage);
    return () => window.removeEventListener('storage', loadImage);
  }, []);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Determine motion animation variants based on talking or resting states
  const avatarAnimation = isSpeaking
    ? {
        y: [-1, 2, -2, 1, 0],
        scale: [1, 1.05, 0.98, 1.03, 1],
        rotate: [-1.5, 1.5, -1, 1, 0],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    : {
        y: [-4, 4, -4],
        transition: {
          duration: id === 'sparky' ? 1.8 : id === 'cute_heart' ? 2.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      };

  const renderSvgContent = () => {
    // If a custom uploaded image of the Intern is available, use it to replace placeholder symbols
    if (customImage) {
      return (
        <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.3)] bg-slate-950">
          {/* Outer dual-color split aura border */}
          <div className="absolute inset-0 rounded-full border border-transparent bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-500 opacity-70 z-10 pointer-events-none" style={{ margin: '-1px' }} />
          <img 
            src={customImage} 
            alt="Intern Portrait" 
            className="w-full h-full object-cover relative z-0" 
            referrerPolicy="no-referrer" 
          />
        </div>
      );
    }

    switch (id) {
      case 'smiling_drone':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_8px_rgba(20,184,166,0.25)]"
            fill="none"
          >
            {/* Ambient Back Glow Ring */}
            <circle cx="50" cy="50" r="42" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite]" />
            
            {/* Winglets (Oscillating) */}
            <g className="origin-center animate-[pulse_1.5s_ease-in-out_infinite]">
              {/* Left Thruster wing */}
              <path d="M 8 45 C 8 40, 22 36, 24 46 C 26 56, 12 58, 8 45 Z" fill="#115e59" stroke="#14b8a6" strokeWidth="2" />
              <ellipse cx="16" cy="46" rx="3" ry="5" fill="#5eead4" className="animate-pulse" />
              {/* Right Thruster wing */}
              <path d="M 92 45 C 92 40, 78 36, 76 46 C 74 56, 88 58, 92 45 Z" fill="#115e59" stroke="#14b8a6" strokeWidth="2" />
              <ellipse cx="84" cy="46" rx="3" ry="5" fill="#5eead4" className="animate-pulse" />
            </g>

            {/* Drone Metallic Body chassis */}
            <circle cx="50" cy="50" r="28" fill="url(#droneBodyGrad)" stroke="#14b8a6" strokeWidth="3" />
            
            {/* Screen Visor */}
            <rect x="30" y="38" width="40" height="24" rx="10" fill="#0f172a" stroke="#0d9488" strokeWidth="2" />
            
            {/* Glowing Led Visor grid dots */}
            <line x1="33" y1="50" x2="67" y2="50" stroke="rgba(20, 184, 166, 0.1)" strokeWidth="18" strokeLinecap="round" />

            {/* Dynamic Digital Led Eyes based on expression */}
            {expression === 'smiling' && (
              <>
                <path
                  d="M 37 53 Q 41 46 45 53"
                  stroke="#5eead4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  className={isSpeaking ? "animate-[bounce_0.5s_infinite]" : ""}
                />
                <path
                  d="M 55 53 Q 59 46 63 53"
                  stroke="#5eead4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  className={isSpeaking ? "animate-[bounce_0.5s_infinite_0.1s]" : ""}
                />
              </>
            )}
            {expression === 'neutral' && (
              <>
                <line
                  x1="36" y1="50" x2="46" y2="50"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="54" y1="50" x2="64" y2="50"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </>
            )}
            {expression === 'concerned' && (
              <>
                <path
                  d="M 38 48 L 45 51.5"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 62 48 L 55 51.5"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}
            {expression === 'surprised' && (
              <>
                <circle cx="41" cy="49" r="3" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                <circle cx="59" cy="49" r="3" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
              </>
            )}

            {/* Status antenna light on top */}
            <line x1="50" y1="22" x2="50" y2="10" stroke="#14b8a6" strokeWidth="2.5" />
            <circle cx="50" cy="10" r="4.5" fill="#22d3ee" className="animate-ping" />
            <circle cx="50" cy="10" r="3.5" fill="#22d3ee" />

            {/* Gradients */}
            <defs>
              <linearGradient id="droneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#134e4a" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'helper_bot':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_8px_rgba(59,130,246,0.25)]"
            fill="none"
          >
            {/* Rotating Gear Halo */}
            <circle cx="50" cy="50" r="44" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_20s_linear_infinite]" />
            
            {/* Robot Neck joint */}
            <rect x="42" y="70" width="16" height="12" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <line x1="46" y1="76" x2="54" y2="76" stroke="#60a5fa" strokeWidth="2" />

            {/* Main CRT Head Frame */}
            <rect x="22" y="24" width="56" height="50" rx="14" fill="url(#botBodyGrad)" stroke="#3b82f6" strokeWidth="3" />
            
            {/* Side Bolt Ears */}
            <rect x="15" y="42" width="7" height="14" rx="2" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx="11" cy="49" r="2.5" fill="#60a5fa" className="animate-pulse" />
            <rect x="78" y="42" width="7" height="14" rx="2" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx="89" cy="49" r="2.5" fill="#60a5fa" className="animate-pulse" />

            {/* Visor Screen */}
            <rect x="28" y="32" width="44" height="34" rx="8" fill="#020617" stroke="#2563eb" strokeWidth="2" />
            
            {/* Grid scanlines overlay layout */}
            <path d="M 30 38 L 70 38 M 30 44 L 70 44 M 30 50 L 70 50 M 30 56 L 70 56 Q 30 62 70 62" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1" />

            {/* Cyber Visor Eyes (Square Pixelated style) */}
            {expression === 'smiling' && (
              <g fill="#60a5fa">
                <rect x="36" y="42" width="6" height="6" rx="1.5" className={isSpeaking ? "animate-[pulse_0.4s_infinite]" : "animate-pulse"} />
                <rect x="40" y="40" width="4" height="2" />
                <rect x="58" y="42" width="6" height="6" rx="1.5" className={isSpeaking ? "animate-[pulse_0.4s_infinite_0.1s]" : "animate-pulse"} />
                <rect x="56" y="40" width="4" height="2" />
              </g>
            )}
            {expression === 'neutral' && (
              <g fill="#38bdf8">
                <rect x="36" y="44" width="6" height="3" rx="1" />
                <rect x="58" y="44" width="6" height="3" rx="1" />
              </g>
            )}
            {expression === 'concerned' && (
              <g fill="#f59e0b">
                <polygon points="36,44 42,40 42,42" />
                <polygon points="64,44 58,40 58,42" />
                <rect x="36" y="45" width="6" height="3" rx="1" />
                <rect x="58" y="45" width="6" height="3" rx="1" />
              </g>
            )}
            {expression === 'surprised' && (
              <g fill="#ec4899">
                <rect x="36" y="41" width="6" height="6" rx="3" className="animate-ping" />
                <rect x="36" y="41" width="6" height="6" rx="3" />
                <rect x="58" y="41" width="6" height="6" rx="3" className="animate-ping" />
                <rect x="58" y="41" width="6" height="6" rx="3" />
              </g>
            )}

            {/* Glowing neon heart mic receiver or smile line */}
            {expression === 'smiling' ? (
              isSpeaking ? (
                <path d="M 44 56 Q 50 63 56 56" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <line x1="45" y1="58" x2="55" y2="58" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              )
            ) : expression === 'concerned' ? (
              <path d="M 44 59 Q 50 54 56 59" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <line x1="45" y1="58" x2="55" y2="58" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Antenna bolt */}
            <path d="M 50 24 L 50 12 L 46 14 Q 50 10 50 8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="8" r="3" fill="#2563eb" className="animate-ping" />
            <circle cx="50" cy="8" r="2" fill="#60a5fa" />

            {/* Gradients */}
            <defs>
              <linearGradient id="botBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="70%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'cute_heart':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_10px_rgba(236,72,153,0.3)]"
            fill="none"
          >
            {/* Concentric Magnetic Ring Orbits */}
            <ellipse cx="50" cy="50" rx="38" ry="14" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-[spin_6s_linear_infinite]" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1.5" strokeDasharray="5 3" className="animate-[spin_8s_linear_infinite_reverse]" />

            {/* Little orbit particles */}
            <circle cx="88" cy="50" r="2.5" fill="#ec4899" className="animate-pulse" />
            <circle cx="12" cy="50" r="2" fill="#a855f7" className="animate-pulse" />

            {/* Glowing Therapeutic Pulse Heart Visor */}
            <path
              d="M 50 78 C 50 78, 14 55, 14 34 C 14 18, 30 14, 50 31 C 70 14, 86 18, 86 34 C 86 55, 50 78, 50 78 Z"
              fill="url(#heartBodyGrad)"
              stroke="#ec4899"
              strokeWidth="3.5"
              className="origin-center animate-[pulse_2s_ease-in-out_infinite]"
            />

            {/* Internal Core Node */}
            <circle cx="50" cy="46" r="15" fill="#0f172a" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="2" />

            {/* Glowing Cute LED Eyes based on expression */}
            {expression === 'smiling' && (
              <>
                <g fill="#f472b6" className={isSpeaking ? "animate-[bounce_0.6s_infinite]" : ""}>
                  <circle cx="43" cy="45" r="3" />
                  <circle cx="57" cy="45" r="3" />
                </g>
                <path d="M 46 51.5 Q 50 54.5 54 51.5" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
            {expression === 'neutral' && (
              <>
                <g fill="#d8b4fe">
                  <rect x="40" y="44" width="6" height="2" rx="1" />
                  <rect x="54" y="44" width="6" height="2" rx="1" />
                </g>
                <line x1="46" y1="51.5" x2="54" y2="51.5" stroke="#d8b4fe" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
            {expression === 'concerned' && (
              <>
                <g fill="#fbbf24">
                  <path d="M 39 44 L 45 42" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 61 44 L 55 42" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="42" cy="48" r="2.5" />
                  <circle cx="58" cy="48" r="2.5" />
                </g>
                <path d="M 46 53 Q 50 50 54 53" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
            {expression === 'surprised' && (
              <>
                <g fill="#c084fc">
                  <ellipse cx="42" cy="45" rx="3" ry="4" stroke="#e9d5ff" strokeWidth="1" />
                  <ellipse cx="58" cy="45" rx="3" ry="4" stroke="#e9d5ff" strokeWidth="1" />
                </g>
                <circle cx="50" cy="52" r="2.5" fill="#c084fc" />
              </>
            )}

            {/* High-tech electrical mesh overlays */}
            <path
              d="M 50 24 L 50 31 M 23 38 L 32 40 M 77 38 L 68 40 M 50 68 L 50 74"
              stroke="rgba(236, 72, 153, 0.4)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Sparkle details floating */}
            <g fill="#fdf2f8" className="animate-pulse">
              <polygon points="50,15 52,20 57,20 53,23 55,28 50,25 45,28 47,23 43,20 48,20" transform="translate(18, -3) scale(0.6)" />
              <polygon points="50,15 52,20 57,20 53,23 55,28 50,25 45,28 47,23 43,20 48,20" transform="translate(-25, 30) scale(0.5)" />
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="heartBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1823" />
                <stop offset="50%" stopColor="#4c1d35" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'real_portrait':
        if (customImage) {
          return (
            <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-indigo-500 shadow-md">
              {/* Dual-color neon split aura border */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-amber-500 to-cyan-500 opacity-80 z-10 pointer-events-none" style={{ margin: '-2px' }} />
              <img 
                src={customImage} 
                alt="Intern Portrait" 
                className="w-full h-full object-cover relative z-0" 
                referrerPolicy="no-referrer" 
              />
            </div>
          );
        }
        
        // Return a gorgeous procedural SVG split human/robot portrait
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_12px_rgba(6,182,212,0.3)]"
            fill="none"
          >
            {/* Ambient Background Aura */}
            <circle cx="50" cy="50" r="46" fill="url(#splitAuraGrad)" />

            <g>
              {/* === LEFT SIDE: HUMAN BOY === */}
              <g>
                {/* Hair Left (Brown, Messy, Pixar-style) */}
                <path d="M 50 14 C 28 14, 20 28, 24 45 C 24 48, 28 50, 30 45 C 32 38, 40 28, 50 28 Z" fill="#451a03" />
                <path d="M 50 8 C 30 8, 14 18, 18 36 C 24 22, 38 18, 50 18 Z" fill="#78350f" />
                
                {/* Face Skin Left (Warm Peach) */}
                <path d="M 50 28 C 30 28, 24 42, 30 68 C 34 82, 44 85, 50 86 Z" fill="#fdba74" />
                
                {/* Freckles (Cute warm dots) */}
                <circle cx="34" cy="54" r="1" fill="#c2410c" opacity="0.6" />
                <circle cx="38" cy="56" r="0.8" fill="#c2410c" opacity="0.5" />
                <circle cx="32" cy="57" r="1" fill="#c2410c" opacity="0.6" />
                
                {/* Hazel/Green Eye */}
                <circle cx="38" cy="44" r="8" fill="#1e293b" />
                <circle cx="38" cy="44" r="5" fill="#15803d" />
                <circle cx="38" cy="44" r="2.5" fill="#022c22" />
                <circle cx="36" cy="42" r="1.5" fill="#ffffff" /> {/* Eye reflection */}

                {/* Left Ear */}
                <path d="M 24 42 Q 18 42, 22 52 Q 26 54, 25 45 Z" fill="#fdbaf4" opacity="0.15" />
                <path d="M 24 42 Q 18 42, 22 52 Q 26 54, 25 45 Z" fill="#fca5a5" />

                {/* Left Shirt (Beige Brown) */}
                <path d="M 50 86 C 36 86, 26 94, 22 100 L 50 100 Z" fill="#d6c3b0" stroke="#7c2d12" strokeWidth="0.5" />
                <circle cx="45" cy="94" r="1.5" fill="#fdf4ff" stroke="#78350f" strokeWidth="0.5" />
              </g>

              {/* === RIGHT SIDE: CYBORG ROBOT === */}
              <g>
                {/* Metallic Chrome Skull Right */}
                <path d="M 50 18 C 68 18, 82 22, 78 36 C 74 48, 70 54, 72 68 C 74 78, 62 84, 50 86 Z" fill="url(#chromeBodyGrad)" stroke="#06b6d4" strokeWidth="1" />
                
                {/* Cyber Hair Right (Darker/Sleeker with neon accents) */}
                <path d="M 50 8 C 65 8, 80 18, 76 36 C 70 24, 60 18, 50 18 Z" fill="#1e293b" />
                <path d="M 50 14 C 60 14, 70 20, 68 30 C 60 22, 54 28, 50 28 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="0.5" />

                {/* Glowing Circuit Lines on Face */}
                <path d="M 52 32 L 68 34 L 72 48 L 60 52" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 2" className="animate-pulse" />
                <path d="M 55 72 L 64 74 L 68 84" stroke="#22d3ee" strokeWidth="0.75" />

                {/* Glowing Cybernetic Eye (Blue) */}
                <circle cx="62" cy="44" r="9" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <circle cx="62" cy="44" r="6" fill="#083344" />
                <circle cx="62" cy="44" r="3.5" fill="#22d3ee" className="animate-pulse" />
                <circle cx="62" cy="44" r="2" fill="#ffffff" />
                {/* Outer concentric cyber target reticle */}
                <circle cx="62" cy="44" r="12" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="0.75" strokeDasharray="2 2" className="animate-[spin_8s_linear_infinite]" />

                {/* Robot Body Right with metallic plates & wiring */}
                <path d="M 50 86 C 62 86, 76 94, 80 100 L 50 100 Z" fill="#475569" stroke="#334155" strokeWidth="0.5" />
                {/* Red & Blue exposed wires */}
                <path d="M 64 88 Q 62 94, 66 100" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M 70 89 Q 68 96, 72 100" stroke="#3b82f6" strokeWidth="1" />
                {/* Golden Matrix Smile Plate */}
                <rect x="54" y="91" width="16" height="7" rx="1.5" fill="#090d16" stroke="#ca8a04" strokeWidth="0.75" />
                <circle cx="58" cy="94" r="0.75" fill="#fbbf24" className="animate-pulse" />
                <circle cx="62" cy="94" r="0.75" fill="#fbbf24" className="animate-pulse" />
                <circle cx="66" cy="94" r="0.75" fill="#fbbf24" className="animate-pulse" />
              </g>

              {/* === SHARED SPLIT DETAILS === */}
              {/* Sliding glowing center partition line */}
              <line x1="50" y1="6" x2="50" y2="94" stroke="url(#centerGlowGrad)" strokeWidth="1.5" />
              
              {/* Glowing Volt Mouth Strap across the bottom jaw */}
              <g>
                <path d="M 32 60 Q 50 68, 68 60 Q 50 72, 32 60 Z" fill="#0f172a" opacity="0.9" stroke="#06b6d4" strokeWidth="1" />
                {/* Lightning/electricity zap */}
                <path d="M 35 63 L 42 65 L 48 62 L 53 66 L 59 62 L 65 64" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
              </g>
            </g>

            {/* Definitions / Gradients */}
            <defs>
              <linearGradient id="splitAuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.08)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.02)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0.08)" />
              </linearGradient>
              <linearGradient id="chromeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="centerGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'sparky':
      default:
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_10px_rgba(234,179,8,0.3)]"
            fill="none"
          >
            {/* Concentric Hex Shield */}
            <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" stroke="rgba(234, 179, 8, 0.15)" strokeWidth="1.5" strokeDasharray="6 4" className="animate-[spin_15s_linear_infinite]" />
            
            {/* Sparky Bolt core body capsule (Angled Electric lightning rod) */}
            <g transform="translate(0, 0)">
              {/* Lightning Outer aura */}
              <polygon
                points="54,12 28,52 48,52 38,88 72,42 50,42"
                fill="url(#sparkBodyGrad)"
                stroke="#eab308"
                strokeWidth="3"
                className="origin-center animate-[pulse_0.8s_ease-in-out_infinite]"
              />

              {/* Visor window nested directly inside the bolt */}
              <polygon points="46,38 38,50 54,50" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" />
              
              {/* Sparky visors eyes based on expression */}
              {expression === 'smiling' && (
                <g fill="#fef08a" className={isSpeaking ? "animate-pulse" : ""}>
                  <polygon points="45,43 42,47 48,47" />
                  <polygon points="51,43 48,47 54,47" />
                </g>
              )}
              {expression === 'neutral' && (
                <g fill="#fef08a">
                  <line x1="42" y1="45" x2="45" y2="45" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="49" y1="45" x2="52" y2="45" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              )}
              {expression === 'concerned' && (
                <g fill="#fb923c">
                  <path d="M 41 43 L 44 46" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 51 43 L 48 46" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
              {expression === 'surprised' && (
                <g fill="#eab308">
                  <ellipse cx="43" cy="45" rx="1.5" ry="2.5" />
                  <ellipse cx="49" cy="45" rx="1.5" ry="2.5" />
                </g>
              )}
            </g>

            {/* Lightning electrostatic particles popping around */}
            <g stroke="#fef08a" strokeWidth="2" strokeLinecap="round" className="animate-pulse">
              {/* Random zap links */}
              <path d="M 18,22 L 24,26 L 22,30" className="animate-[pulse_1s_infinite]" />
              <path d="M 82,22 L 76,26 L 78,30" className="animate-[pulse_1.2s_infinite]" />
              <path d="M 85,62 L 78,66 L 80,72" className="animate-[pulse_0.7s_infinite_0.1s]" />
              <path d="M 15,62 L 22,66 L 20,72" className="animate-[pulse_0.9s_infinite_0.2s]" />
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="sparkBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b15" />
                <stop offset="50%" stopColor="#452a0a" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
          </svg>
        );
    }
  };

  return (
    <motion.div
      animate={avatarAnimation as any}
      whileHover={{ scale: 1.15, rotate: 5, y: -4, transition: { duration: 0.2 } }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer ${currentSize} ${className}`}
    >
      {/* High-tech pulsing radial glow when the Intern is assisting/speaking */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-500 opacity-45 blur-md animate-[pulse_1.2s_ease-in-out_infinite] scale-115 pointer-events-none z-0" />
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-ping opacity-25 pointer-events-none scale-135 z-0" />
        </>
      )}
      
      <div className="relative w-full h-full z-10 flex items-center justify-center">
        {renderSvgContent()}
      </div>
      
      {/* 🕶️ Option C: Mascot Sunglasses Overlay in Day (Light) Mode */}
      {activeMode === 'day' && (
        <motion.div 
          initial={{ scale: 0, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 11, delay: 0.05 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          {/* Custom Duolingo Playful cool yellow sunglasses */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
            {/* Sunglasses Frame */}
            <path d="M 24 43 L 76 43 L 71 54 C 67 60, 53 60, 51 54 L 49 54 C 47 60, 33 60, 29 54 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Glowing yellow reflection lens sheen */}
            <path d="M 28 45 C 28 45, 41 45, 41 46 C 41 51, 32 52, 29 48 Z" fill="rgba(245, 158, 11, 0.85)" />
            <path d="M 59 45 C 59 45, 72 45, 72 46 C 72 51, 63 52, 60 48 Z" fill="rgba(245, 158, 11, 0.85)" />
            {/* High reflection white shine line */}
            <line x1="28.5" y1="47" x2="33.5" y2="45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="59.5" y1="47" x2="64.5" y2="45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}

      {/* 💤 Option C: Mascot Floating Sleeping Bubbles in Night (Dark) Mode */}
      {activeMode === 'night' && (
        <div className="absolute -top-3.5 -right-3 pointer-events-none flex flex-col items-center">
          {/* Animated float up Zzz bubbles */}
          <span className="text-[12px] font-black font-mono text-cyan-400 select-none animate-[bounce_1.5s_ease-in-out_infinite] block drop-shadow-[0_2px_4px_rgba(34,211,238,0.5)]">Z</span>
          <span className="text-[9px] font-black font-mono text-cyan-500 select-none animate-[bounce_1.9s_ease-in-out_infinite_0.35s] block -mt-1 opacity-90">z</span>
          <span className="text-[7px] font-black font-mono text-cyan-600 select-none animate-[bounce_2.3s_ease-in-out_infinite_0.7s] block -mt-1 opacity-70">z</span>
        </div>
      )}
    </motion.div>
  );
}
