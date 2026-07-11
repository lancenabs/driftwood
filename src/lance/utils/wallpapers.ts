export interface Wallpaper {
  id: string;
  name: string;
  category: 'Gradients' | 'Solids' | 'Designs';
  themeMode: 'light' | 'dark';
  style: {
    background: string;
    backgroundImage?: string;
    backgroundSize?: string;
  };
  previewClass: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'original',
    name: 'Original Classic',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 20%, #1e3a8a 40%, #0369a1 60%, #0284c7 80%, #bae6fd 100%)',
    },
    previewClass: 'bg-gradient-to-b from-slate-900 via-indigo-900 to-sky-400'
  },
  {
    id: 'deep_nebula',
    name: '🌌 Deep Nebula',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 35%, #581c87 70%, #09090b 100%)',
    },
    previewClass: 'bg-gradient-to-br from-slate-950 via-purple-950 to-zinc-950'
  },
  {
    id: 'morning_aurora',
    name: '🟢 Morning Aurora',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(180deg, #020617 0%, #064e3b 40%, #0d9488 80%, #14b8a6 100%)',
    },
    previewClass: 'bg-gradient-to-b from-slate-950 via-emerald-950 to-teal-500'
  },
  {
    id: 'sunset_twilight',
    name: '🌆 Twilight Rose',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #701a75 70%, #f43f5e 100%)',
    },
    previewClass: 'bg-gradient-to-br from-slate-900 via-fuchsia-950 to-rose-500'
  },
  {
    id: 'cosmic_ocean',
    name: '🌊 Cosmic Ocean',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(180deg, #0b152d 0%, #1e3a8a 50%, #0284c7 100%)',
    },
    previewClass: 'bg-gradient-to-b from-slate-950 via-blue-900 to-sky-600'
  },
  {
    id: 'solar_flare',
    name: '☀️ Solar Flare',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(135deg, #180505 0%, #450a0a 40%, #991b1b 75%, #f97316 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#180505] via-red-950 to-orange-500'
  },
  {
    id: 'lavender_mist',
    name: '🪻 Lavender Mist',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(135deg, #2e1065 0%, #3b0764 40%, #1e1b4b 75%, #a78bfa 100%)',
    },
    previewClass: 'bg-gradient-to-br from-purple-950 via-indigo-950 to-violet-400'
  },
  {
    id: 'obsidian',
    name: '🐦‍⬛ Obsidian Black',
    category: 'Solids',
    themeMode: 'dark',
    style: {
      background: '#09090b',
    },
    previewClass: 'bg-zinc-950'
  },
  {
    id: 'slate_dark',
    name: '🩶 Slate Charcoal',
    category: 'Solids',
    themeMode: 'dark',
    style: {
      background: '#1e293b',
    },
    previewClass: 'bg-slate-800'
  },
  {
    id: 'forest_dark',
    name: '🌲 Forest Moss',
    category: 'Solids',
    themeMode: 'dark',
    style: {
      background: '#022c22',
    },
    previewClass: 'bg-emerald-950'
  },
  {
    id: 'royal_indigo',
    name: '🔮 Royal Indigo',
    category: 'Solids',
    themeMode: 'dark',
    style: {
      background: '#1e1b4b',
    },
    previewClass: 'bg-indigo-950'
  },
  {
    id: 'deep_burgundy',
    name: '🍷 Deep Burgundy',
    category: 'Solids',
    themeMode: 'dark',
    style: {
      background: '#3f0c1f',
    },
    previewClass: 'bg-rose-950'
  },
  
  // LIGHT MODE SOLIDS AND GRADIENS
  {
    id: 'pristine_cream',
    name: '🥛 Milky Cream',
    category: 'Solids',
    themeMode: 'light',
    style: {
      background: '#faf8f5',
    },
    previewClass: 'bg-[#faf8f5] border border-stone-200'
  },
  {
    id: 'pure_white',
    name: '🤍 Pure Pearl White',
    category: 'Solids',
    themeMode: 'light',
    style: {
      background: '#ffffff',
    },
    previewClass: 'bg-white border border-slate-200'
  },
  {
    id: 'pastel_sky',
    name: '🩵 Whisper Sky Blue',
    category: 'Gradients',
    themeMode: 'light',
    style: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border border-sky-100'
  },
  {
    id: 'pastel_mint',
    name: '🍃 Breath Whisper Sage',
    category: 'Gradients',
    themeMode: 'light',
    style: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-emerald-100'
  },
  {
    id: 'pastel_rose',
    name: '🪻 Whisper Lavender',
    category: 'Gradients',
    themeMode: 'light',
    style: {
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] border border-purple-100'
  },
  {
    id: 'clean_slate_light',
    name: '🩶 Clean Slate Light',
    category: 'Solids',
    themeMode: 'light',
    style: {
      background: '#f1f5f9',
    },
    previewClass: 'bg-slate-100 border border-slate-200'
  },

  {
    id: 'celestial_grids',
    name: '🌌 Starry Blueprint',
    category: 'Designs',
    themeMode: 'dark',
    style: {
      background: '#090d1a',
      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0), linear-gradient(180deg, #090d1a 0%, #030712 100%)',
      backgroundSize: '24px 24px, auto'
    },
    previewClass: 'bg-[#090d1a] border border-blue-900/30'
  },
  {
    id: 'cyberpunk_matrix',
    name: '👾 Matrix Tech Grid',
    category: 'Designs',
    themeMode: 'dark',
    style: {
      background: '#020617',
      backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.08) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1.5px, transparent 1.5px)',
      backgroundSize: '30px 30px'
    },
    previewClass: 'bg-[#020617] border border-emerald-900/40'
  },
  {
    id: 'sauble_dunes',
    name: '🏜️ Sandy Dunes',
    category: 'Designs',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(180deg, #2d1602 0%, #854d0e 50%, #eab308 100%)',
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(253, 224, 71, 0.15) 0%, transparent 60%), linear-gradient(180deg, #2d1602 0%, #854d0e 50%, #eab308 100%)'
    },
    previewClass: 'bg-gradient-to-b from-amber-950 via-yellow-800 to-yellow-500'
  },
  {
    id: 'aurora_borealis',
    name: '🧩 Polar Borealis',
    category: 'Designs',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(135deg, #050515 0%, #032b30 40%, #0d9488 75%, #a7f3d0 100%)',
    },
    previewClass: 'bg-gradient-to-br from-indigo-950 via-cyan-950 to-emerald-300'
  },

  // ── L.A.N.C.E. Brand Wallpapers ────────────────────────────────────────────
  {
    id: 'lance_signature',
    name: '✦ L.A.N.C.E. Signature',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(160deg, #0d3d35 0%, #0a5a52 35%, #3ECFCF 75%, #7FD98C 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#0d3d35] via-[#0a5a52] to-[#3ECFCF]'
  },
  {
    id: 'lance_midnight',
    name: '🌑 L.A.N.C.E. Midnight',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(180deg, #050f0d 0%, #0d3d35 50%, #1a6b5e 100%)',
    },
    previewClass: 'bg-gradient-to-b from-[#050f0d] via-[#0d3d35] to-[#1a6b5e]'
  },
  {
    id: 'lance_mint_glow',
    name: '🌿 Mint Glow',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(135deg, #071a12 0%, #0d3d20 45%, #2a8a50 80%, #7FD98C 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#071a12] via-[#0d3d20] to-[#7FD98C]'
  },
  {
    id: 'lance_teal_depth',
    name: '🌊 Teal Depth',
    category: 'Gradients',
    themeMode: 'dark',
    style: {
      background: 'linear-gradient(180deg, #020e0e 0%, #0a3535 40%, #1a7a7a 75%, #3ECFCF 100%)',
    },
    previewClass: 'bg-gradient-to-b from-[#020e0e] via-[#0a3535] to-[#3ECFCF]'
  },
  {
    id: 'lance_aurora',
    name: '🌌 L.A.N.C.E. Aurora',
    category: 'Designs',
    themeMode: 'dark',
    style: {
      background: '#050f0d',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(63, 207, 207, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(127, 217, 140, 0.14) 0%, transparent 50%), linear-gradient(180deg, #050f0d 0%, #0d3d35 100%)',
    },
    previewClass: 'bg-[#050f0d] border border-teal-900/40'
  },
  {
    id: 'lance_grid',
    name: '⬡ L.A.N.C.E. Neural Grid',
    category: 'Designs',
    themeMode: 'dark',
    style: {
      background: '#060f0c',
      backgroundImage: 'linear-gradient(rgba(63, 207, 207, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 207, 207, 0.07) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    },
    previewClass: 'bg-[#060f0c] border border-teal-900/30'
  },
  {
    id: 'lance_soft_mint',
    name: '🍃 Soft Mint (Light)',
    category: 'Gradients',
    themeMode: 'light',
    style: {
      background: 'linear-gradient(135deg, #f0fdf8 0%, #ccfbef 60%, #a7f3d0 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#f0fdf8] to-[#a7f3d0] border border-emerald-100'
  },
  {
    id: 'lance_soft_teal',
    name: '🩵 Soft Teal (Light)',
    category: 'Gradients',
    themeMode: 'light',
    style: {
      background: 'linear-gradient(135deg, #f0fdfd 0%, #cdfafa 60%, #99f6f6 100%)',
    },
    previewClass: 'bg-gradient-to-br from-[#f0fdfd] to-[#99f6f6] border border-cyan-100'
  },
];
