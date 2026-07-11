import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Trash2, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  Save, 
  Trash, 
  BookOpen, 
  Layers, 
  Heart, 
  Wind, 
  Compass, 
  Lock, 
  Eye, 
  Anchor, 
  Flame, 
  CloudRain, 
  Key, 
  User, 
  FolderOpen,
  Info,
  Baby,
  Users,
  Smile,
  TreePine,
  Sprout,
  Mountain,
  Gift,
  Car,
  Gem,
  Crown,
  Fish,
  Cat,
  Dog,
  Bird
} from 'lucide-react';

interface FigurineType {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultColor: string;
}

const FIGURINES: FigurineType[] = [
  // Archetypes
  { id: 'inner_child', name: 'Inner Child', category: 'Archetypes', icon: Heart, description: 'Represents vulnerability, emotional authenticity, and core play.', defaultColor: 'text-rose-500 bg-rose-50 border-rose-200' },
  { id: 'shadow', name: 'The Shadow', category: 'Archetypes', icon: Eye, description: 'Houses disowned traits, repressed needs, and hidden aspects of the self (the parts of us we tend to hide or avoid).', defaultColor: 'text-slate-800 bg-slate-100 border-slate-300' },
  { id: 'mentor', name: 'Wise Mentor', category: 'Archetypes', icon: Sparkles, description: 'Symbolizes wisdom, inner guidance, and the higher self.', defaultColor: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'guardian', name: 'The Guardian', category: 'Archetypes', icon: User, description: 'Stands for boundaries, self-protection, and resilience.', defaultColor: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  
  // Dolls & Characters
  { id: 'little_boy', name: 'Little Boy', category: 'Dolls/People', icon: Smile, description: 'Represents the male child, innocence, sibling, or young masculine energy.', defaultColor: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'little_girl', name: 'Little Girl', category: 'Dolls/People', icon: Smile, description: 'Represents the female child, purity, sister, or young feminine energy.', defaultColor: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'mother', name: 'Mother/Woman', category: 'Dolls/People', icon: User, description: 'Nurturing force, maternal expectations, caregiver, or maternal guide.', defaultColor: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'father', name: 'Father/Man', category: 'Dolls/People', icon: User, description: 'Structure, paternal protection, authority, or strict expectations.', defaultColor: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'baby', name: 'The Baby', category: 'Dolls/People', icon: Baby, description: 'Newborn beginnings, ultimate vulnerability, or a fresh starting point.', defaultColor: 'text-pink-500 bg-pink-50/50 border-pink-200' },
  { id: 'crowd', name: 'The Crowd', category: 'Dolls/People', icon: Users, description: 'Societal noise, peer pressure, external eyes, or the community.', defaultColor: 'text-slate-500 bg-slate-50 border-slate-200' },

  // Small Animals & Marine Life
  { id: 'dog', name: 'Loyal Dog', category: 'Animals & Sea', icon: Dog, description: 'Loyalty, companionship, unconditional support, or protective instincts.', defaultColor: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'cat', name: 'Guarded Cat', category: 'Animals & Sea', icon: Cat, description: 'Independence, boundaries, curiosity, or detached observation.', defaultColor: 'text-violet-600 bg-violet-50 border-violet-200' },
  { id: 'bird', name: 'Messenger Bird', category: 'Animals & Sea', icon: Bird, description: 'Freedom, soaring perspectives, hopes, or communication from afar.', defaultColor: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { id: 'fish', name: 'Depths Fish', category: 'Animals & Sea', icon: Fish, description: 'Swimming through deep emotional waters of the unconscious mind.', defaultColor: 'text-emerald-600 bg-emerald-50 border-emerald-200' },

  // Elements & Nature
  { id: 'tall_tree', name: 'Wise Pine Tree', category: 'Nature/Environment', icon: TreePine, description: 'Long-term growth, deep stability, patience, or generational roots.', defaultColor: 'text-green-700 bg-green-50 border-green-200' },
  { id: 'new_sprout', name: 'Fresh Sprout', category: 'Nature/Environment', icon: Sprout, description: 'Delicate new hopes, ideas, vulnerability, or a newly planted habit.', defaultColor: 'text-lime-600 bg-lime-50 border-lime-200' },
  { id: 'mountain', name: 'The Mountain', category: 'Nature/Environment', icon: Mountain, description: 'A massive hurdle to climb or an elevated spiritual goal.', defaultColor: 'text-stone-700 bg-stone-100 border-stone-200' },
  { id: 'storm', name: 'Raging Storm', category: 'Nature/Environment', icon: CloudRain, description: 'Symbol of current emotional turbulence, anxiety, or grief.', defaultColor: 'text-sky-700 bg-sky-50 border-sky-200' },
  { id: 'fire', name: 'Wild Fire', category: 'Nature/Environment', icon: Flame, description: 'Fuel of passion, transformative anger, or burning desire.', defaultColor: 'text-orange-500 bg-orange-50 border-orange-200' },
  { id: 'breeze', name: 'Calming Breeze', category: 'Nature/Environment', icon: Wind, description: 'Breathwork, presence, clarity, and mental freshness.', defaultColor: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'anchor', name: 'The Anchor', category: 'Nature/Environment', icon: Anchor, description: 'Grounding forces, security, stable relationships, or family.', defaultColor: 'text-blue-600 bg-blue-50 border-blue-200' },
  
  // Structures
  { id: 'key', name: 'Ancient Key', category: 'Structures', icon: Key, description: 'Potential answers, sudden breakthroughs, or locked secrets.', defaultColor: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'cage', name: 'The Cage', category: 'Structures', icon: Lock, description: 'Feelings of entrapment, limiting beliefs, or structural safety.', defaultColor: 'text-neutral-500 bg-neutral-50 border-neutral-200' },
  { id: 'compass', name: 'The Compass', category: 'Structures', icon: Compass, description: 'Future alignment, navigating choices, and personal quest.', defaultColor: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'barrier', name: 'The Barrier', category: 'Structures', icon: Layers, description: 'Unresolved blockages, obstacles, or protective walls.', defaultColor: 'text-stone-600 bg-stone-50 border-stone-200' },

  // Toys & Items of Meaning
  { id: 'toy_car', name: 'Toy Car', category: 'Toys & Objects', icon: Car, description: 'Movement, travel, transitions, fast change, or childhood toys.', defaultColor: 'text-[#3ECFCF] bg-slate-50 border-slate-200' },
  { id: 'treasure', name: 'Hidden Gem', category: 'Toys & Objects', icon: Gem, description: 'Inner core values, undiscovered gifts, or personal treasure.', defaultColor: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200' },
  { id: 'gift_box', name: 'Surprise Gift', category: 'Toys & Objects', icon: Gift, description: 'Unsolicited blessings, surprise, gratitude, or unopened feelings.', defaultColor: 'text-rose-500 bg-rose-50 border-rose-200' },
  { id: 'crown', name: 'Golden Crown', category: 'Toys & Objects', icon: Crown, description: 'Power, achievement, perfectionism, responsibility, or triumph.', defaultColor: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
];

interface EnvironmentConfig {
  id: 'sand' | 'forest' | 'beach' | 'desert';
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultColor: string;
}

const ENVIRONMENTS: EnvironmentConfig[] = [
  { id: 'sand', name: 'Classic Sand', category: 'Environment', description: 'Traditional dry sandbox. Grounding, containment and neutral safe space.', icon: Compass, defaultColor: 'text-amber-800 bg-amber-50 border-amber-200' },
  { id: 'forest', name: 'Forest Moss', category: 'Environment', description: 'Deep moss emerald. Organic growth, ancestry reconnection, and soft quietude.', icon: TreePine, defaultColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'beach', name: 'Beach Oasis', category: 'Environment', description: 'Sands meeting therapeutic tides. Fluidity, clearing thoughts, and transition.', icon: Anchor, defaultColor: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  { id: 'desert', name: 'Desert Clay', category: 'Environment', description: 'Warm crimson arid terrain. Spiritual clarity, endurance, silence, and truth.', icon: Mountain, defaultColor: 'text-orange-700 bg-orange-50 border-orange-200' },
];

interface PlacedFigurine {
  uniqueId: string;
  figurineId: string;
  name: string;
  x: number; // percentage width (0 - 100)
  y: number; // percentage height (0 - 100)
  rotation: number; // degrees (0 - 360)
  scale: number; // multiplier (0.6 - 1.8)
  personalMeaning: string;
}

interface SavedTray {
  id: string;
  date: string;
  time: string;
  title: string;
  synthesisNote: string;
  figurines: PlacedFigurine[];
  environment?: 'sand' | 'forest' | 'beach' | 'desert';
}

export default function SandTray() {
  const [placedFigurines, setPlacedFigurines] = useState<PlacedFigurine[]>([]);
  const [environment, setEnvironment] = useState<'sand' | 'forest' | 'beach' | 'desert'>('sand');
  const [selectedUniqueId, setSelectedUniqueId] = useState<string | null>(null);
  const [synthesisNote, setSynthesisNote] = useState<string>('');
  const [trayTitle, setTrayTitle] = useState<string>('');
  const [showTimelineOverlay, setShowTimelineOverlay] = useState<boolean>(true);
  const [savedTrays, setSavedTrays] = useState<SavedTray[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const trayContainerRef = useRef<HTMLDivElement>(null);
  const draggingIdRef = useRef<string | null>(null);

  // Load Saved Trays
  useEffect(() => {
    const saved = localStorage.getItem('therapy_sandtrays');
    if (saved) {
      try {
        setSavedTrays(JSON.parse(saved));
      } catch (e) {
        setSavedTrays([]);
      }
    }
  }, []);

  // Sync back to local storage
  const saveToLocalStorage = (trays: SavedTray[]) => {
    localStorage.setItem('therapy_sandtrays', JSON.stringify(trays));
    setSavedTrays(trays);
  };

  // Add a figurine into the tray
  const handleAddFigurine = (fig: FigurineType) => {
    const newPlaced: PlacedFigurine = {
      uniqueId: `placed_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      figurineId: fig.id,
      name: fig.name,
      x: 35 + Math.random() * 30, // center-ish random placement
      y: 35 + Math.random() * 30,
      rotation: 0,
      scale: 1.0,
      personalMeaning: ''
    };
    setPlacedFigurines([...placedFigurines, newPlaced]);
    setSelectedUniqueId(newPlaced.uniqueId);
  };

  // Remove selected figurine
  const handleRemoveSelected = (uniqueId: string) => {
    setPlacedFigurines(placedFigurines.filter(item => item.uniqueId !== uniqueId));
    if (selectedUniqueId === uniqueId) {
      setSelectedUniqueId(null);
    }
  };

  // Rotation adjust
  const handleRotateSelected = () => {
    if (!selectedUniqueId) return;
    setPlacedFigurines(placedFigurines.map(item => {
      if (item.uniqueId === selectedUniqueId) {
        return { ...item, rotation: (item.rotation + 45) % 360 };
      }
      return item;
    }));
  };

  // Scale adjustment (discrete increments between 0.7 - 1.6)
  const handleScaleSelected = (increment: boolean) => {
    if (!selectedUniqueId) return;
    setPlacedFigurines(placedFigurines.map(item => {
      if (item.uniqueId === selectedUniqueId) {
        const nextScale = increment ? Math.min(1.6, item.scale + 0.15) : Math.max(0.7, item.scale - 0.15);
        return { ...item, scale: parseFloat(nextScale.toFixed(2)) };
      }
      return item;
    }));
  };

  // Handle pointer down on a placed figurine starting the drag
  const handlePointerDown = (e: React.PointerEvent, uniqueId: string) => {
    e.stopPropagation();
    setSelectedUniqueId(uniqueId);
    draggingIdRef.current = uniqueId;
    
    // Set pointer capture to lock mouse moves directly with elements
    const element = e.currentTarget as HTMLElement;
    element.setPointerCapture(e.pointerId);
  };

  // Dragging event over the sandbox region
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingIdRef.current || !trayContainerRef.current) return;
    
    const rect = trayContainerRef.current.getBoundingClientRect();
    
    // Get absolute mouse position relative to container
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Convert to percentage boundary checks
    let percentageX = (relativeX / rect.width) * 100;
    let percentageY = (relativeY / rect.height) * 100;
    
    // Contain boundary check safely within visual sand limits
    percentageX = Math.max(4, Math.min(96, percentageX));
    percentageY = Math.max(4, Math.min(96, percentageY));

    setPlacedFigurines(prev => prev.map(item => {
      if (item.uniqueId === draggingIdRef.current) {
        return { ...item, x: percentageX, y: percentageY };
      }
      return item;
    }));
  };

  // Release pointer drag
  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingIdRef.current) {
      const element = e.currentTarget as HTMLElement;
      try {
        element.releasePointerCapture(e.pointerId);
      } catch (err) {}
      draggingIdRef.current = null;
    }
  };

  // Edit explanation note per figurine
  const handleUpdateMeaning = (uniqueId: string, text: string) => {
    setPlacedFigurines(placedFigurines.map(item => {
      if (item.uniqueId === uniqueId) {
        return { ...item, personalMeaning: text };
      }
      return item;
    }));
  };

  // Save Tray
  const handleSaveTray = () => {
    if (placedFigurines.length === 0) {
      alert("Please place at least one figurine in the sand before saving.");
      return;
    }
    
    const now = new Date();
    const newTray: SavedTray = {
      id: `tray_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: trayTitle.trim() || `My Sacred Tray (${now.toLocaleDateString()})`,
      synthesisNote,
      figurines: [...placedFigurines],
      environment // Save the active environment background
    };

    const updated = [newTray, ...savedTrays];
    saveToLocalStorage(updated);
    setSuccessMsg('Tray Saved! You recorded this state securely.');
    setTrayTitle('');
    setSynthesisNote('');
    setPlacedFigurines([]);
    setSelectedUniqueId(null);
    setEnvironment('sand');
    
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Load a historical tray
  const handleLoadTray = (tray: SavedTray) => {
    setPlacedFigurines(tray.figurines);
    setSynthesisNote(tray.synthesisNote);
    setTrayTitle(tray.title);
    setEnvironment(tray.environment || 'sand');
    setSelectedUniqueId(null);
    setActiveTab('create');
  };

  // Delete a historical tray record
  const handleDeleteHistoricalTray = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this historical sand tray save permanently?')) {
      const updated = savedTrays.filter(t => t.id !== id);
      saveToLocalStorage(updated);
    }
  };

  // Clear current active sandbox
  const handleClearSandbox = () => {
    if (confirm('Clear the current sand tray and starting fresh?')) {
      setPlacedFigurines([]);
      setSelectedUniqueId(null);
      setSynthesisNote('');
      setTrayTitle('');
      setEnvironment('sand');
    }
  };

  const activeSelectedFigurine = placedFigurines.find(x => x.uniqueId === selectedUniqueId);

  const getEnvironmentStyle = () => {
    switch (environment) {
      case 'forest':
        return {
          frameBg: 'bg-[#5c4033] border-emerald-950/40',
          canvasClass: 'bg-gradient-to-tr from-[#1b2b1d] via-[#2a452a] to-[#3a5d3b] text-emerald-200',
          canvasStyle: { 
            backgroundImage: 'radial-gradient(circle, rgba(167,243,208,0.06) 1.5px, transparent 1.5px)', 
            backgroundSize: '20px 20px' 
          },
          labelColor: 'text-emerald-100/50',
          timelineColor: 'border-emerald-600/30 text-emerald-100/50',
          timelineLine: 'bg-[#1b2b1d]/40',
          rippleStyle: 'radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(52,211,153,0.03)_80%)'
        };
      case 'beach':
        return {
          frameBg: 'bg-[#dcd4c4] border-cyan-950/20',
          canvasClass: 'bg-gradient-to-tr from-[#113a47] via-[#205e6b] to-[#dfd4be] text-[#ebdcb6]',
          canvasStyle: { 
            backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0) 80%)' 
          },
          labelColor: 'text-cyan-100/50',
          timelineColor: 'border-cyan-600/30 text-cyan-100/50',
          timelineLine: 'bg-cyan-600/20',
          rippleStyle: 'radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(34,211,238,0.03)_80%)'
        };
      case 'desert':
        return {
          frameBg: 'bg-[#8c3d25] border-stone-900/30',
          canvasClass: 'bg-gradient-to-tr from-[#7c3015] via-[#a3512c] to-[#c77a50] text-amber-100',
          canvasStyle: { 
            backgroundImage: 'radial-gradient(circle, rgba(253,230,138,0.05) 1px, transparent 1px)', 
            backgroundSize: '16px 16px' 
          },
          labelColor: 'text-orange-200/50',
          timelineColor: 'border-orange-700/30 text-orange-200/50',
          timelineLine: 'bg-[#b65a31]/30',
          rippleStyle: 'radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(245,158,11,0.03)_80%)'
        };
      case 'sand':
      default:
        return {
          frameBg: 'bg-[#ccbfa3] border-amber-900/40',
          canvasClass: 'bg-gradient-to-tr from-[#dfd4be] via-[#e5dcbf] to-[#ebdcb6] text-[#dfd4be]',
          canvasStyle: { 
            backgroundImage: 'radial-gradient(circle, rgba(230,220,195,0.8), rgba(215,200,165,0.7) 1px, transparent 1px)', 
            backgroundSize: '16px 16px' 
          },
          labelColor: 'text-[#93815c]/60',
          timelineColor: 'border-[#beaf8f]/35 text-[#93815c]/60',
          timelineLine: 'bg-[#beaf8f]/30',
          rippleStyle: 'radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.02)_80%)'
        };
    }
  };

  const envStyles = getEnvironmentStyle();

  return (
    <div
      id="jungian-sandplay-suite"
      className="bg-white border border-[#F0F0F0] rounded-3xl p-5 md:p-6 space-y-6 text-left"
      style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
    >

      {/* Tab/Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-teal-700">
            <Compass className="w-4 h-4 text-[#3ECFCF] animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold font-sans">Jungian Sandplay Therapy</span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 tracking-tight">Interactive Visual Sand Tray Canvas</h3>
          <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed">
            Sandplay provides a non-verbal channel to express deep internal blocks, unconscious memories, and hopes. Choose symbols from the shelf, position them along the Past-Present-Future timeline, and capture your reflection.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('create')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sandbox Maker
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Saved Trays ({savedTrays.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        // HISTORY VIEW SCREEN
        <div className="space-y-4">
          {savedTrays.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <span className="text-2xl block">⏳</span>
              <p className="text-xs text-slate-500 font-bold">No saved sand trays found yet.</p>
              <p className="text-[11px] text-slate-400">Design a custom arrangement on the Sandbox tab and save it securely.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTrays.map((tray) => (
                <div 
                  key={tray.id}
                  onClick={() => handleLoadTray(tray)}
                  className="bg-white hover:bg-slate-50/60 border border-slate-200 hover:border-slate-300 transition-all rounded-2xl p-4 cursor-pointer flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400">{tray.date} • {tray.time}</span>
                        <h4 className="text-xs font-black text-slate-800">{tray.title}</h4>
                      </div>
                      <button
                        onClick={(e) => handleDeleteHistoricalTray(tray.id, e)}
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-600 transition"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed italic">
                      {tray.synthesisNote ? `"${tray.synthesisNote}"` : "No synthesis notes recorded."}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap border-t border-slate-100 pt-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mr-1">PLACED OBJECTS:</span>
                    {tray.figurines.map((f, i) => {
                      const baseFig = FIGURINES.find(b => b.id === f.figurineId);
                      const FigIcon = baseFig?.icon || HelpCircle;
                      return (
                        <div key={i} className="flex items-center gap-0.5 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded-md text-[10px] text-slate-600 font-medium">
                          <FigIcon className="w-2.5 h-2.5" />
                          <span>{f.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // SANDBOX WORKSPACE VIEW
        <div className="space-y-5">
          
          {successMsg && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            
            {/* SIDEBAR: MINIATURES SHELF (xl:span-3) */}
            <div className="xl:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 self-stretch flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    FIGURINES SHELF
                  </span>
                  <Info className="w-3.5 h-3.5 text-slate-400" title="Click an item to place in your sand tray" />
                </div>

                {/* Figurine shelf list organized by Category */}
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {['Environment', 'Archetypes', 'Dolls/People', 'Animals & Sea', 'Nature/Environment', 'Structures', 'Toys & Objects'].map((cat) => (
                    <div key={cat} className="space-y-1.5">
                      <span className="text-[9px] font-extrabold uppercase text-[#3ECFCF]/80 block font-sans tracking-widest">{cat}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {cat === 'Environment' ? (
                          ENVIRONMENTS.map((env) => {
                            const Icon = env.icon;
                            const isActive = environment === env.id;
                            return (
                              <button
                                key={env.id}
                                type="button"
                                onClick={() => setEnvironment(env.id)}
                                className={`min-h-[52px] p-2.5 border text-left rounded-xl transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer relative group ${
                                  isActive
                                    ? 'ring-2 ring-[#3ECFCF] border-[#3ECFCF] bg-slate-100 shadow-sm'
                                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-95'
                                }`}
                                title={env.description}
                              >
                                <Icon className={`w-5 h-5 transition ${isActive ? 'text-[#3ECFCF] scale-110' : 'text-slate-700 group-hover:scale-110'}`} />
                                <span className={`text-[10px] font-black tracking-tight leading-tight ${isActive ? 'text-[#3ECFCF]' : 'text-slate-800'}`}>
                                  {env.name}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          FIGURINES.filter(f => f.category === cat).map((fig) => {
                            const Icon = fig.icon;
                            return (
                              <button
                                key={fig.id}
                                type="button"
                                onClick={() => handleAddFigurine(fig)}
                                className="min-h-[52px] p-2.5 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-95 text-left rounded-xl transition flex flex-col items-center justify-center gap-1 text-center cursor-pointer relative group"
                                title={fig.description}
                              >
                                <Icon className="w-5 h-5 text-slate-700 group-hover:scale-110 transition" />
                                <span className="text-[10px] font-black tracking-tight text-slate-800 leading-tight">
                                  {fig.name}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset sand buttons */}
              <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between text-xs font-bold text-slate-400">
                <button
                  type="button"
                  onClick={() => setShowTimelineOverlay(!showTimelineOverlay)}
                  className="min-h-[40px] px-2 -ml-2 hover:text-slate-700 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>{showTimelineOverlay ? 'Hide Timeline' : 'Show Timeline'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearSandbox}
                  className="min-h-[40px] px-2 -mr-2 hover:text-rose-600 transition cursor-pointer text-[10px] flex items-center"
                >
                  Reset Tray
                </button>
              </div>
            </div>

            {/* CANVAS: SANDBOX Bounding Container (xl:span-9) */}
            <div className="xl:col-span-9 space-y-4">
              
              {/* Interactive Virtual Sandbox Frame */}
              <div className={`border-[10px] rounded-3xl p-1 shadow-inner relative select-none transition-all duration-500 ${envStyles.frameBg}`}>
                
                <div 
                  ref={trayContainerRef}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className={`w-full aspect-[16/10] md:aspect-[16/9] min-h-[300px] rounded-2xl relative overflow-hidden transition-all duration-500 shadow-inner p-4 ${envStyles.canvasClass}`}
                  style={envStyles.canvasStyle}
                >
                  
                  {/* Subtle waves/ripples design across sandbox */}
                  <div 
                    className="absolute inset-0 pointer-events-none" 
                    style={{ backgroundImage: envStyles.rippleStyle }}
                  />
                  
                  {/* Timeline overlay indicators */}
                  {showTimelineOverlay && (
                    <div className="absolute inset-x-0 inset-y-0 flex pointer-events-none z-0">
                      <div className={`flex-1 border-r ${envStyles.timelineColor} p-3 flex flex-col justify-between`}>
                        <span className={`text-[10px] font-extrabold tracking-widest font-sans ${envStyles.labelColor}`}>PAST (REPRESENTATION)</span>
                        <div className={`h-0.5 w-4 ${envStyles.timelineLine}`} />
                      </div>
                      <div className={`flex-1 border-r ${envStyles.timelineColor} p-3 flex flex-col justify-between items-center text-center`}>
                        <span className={`text-[10px] font-extrabold tracking-widest font-sans ${envStyles.labelColor}`}>PRESENT MOMENT</span>
                        <div className={`h-2 w-2 rounded-full ${envStyles.timelineLine}`} />
                      </div>
                      <div className={`flex-1 p-3 flex flex-col justify-between items-end text-right`}>
                        <span className={`text-[10px] font-extrabold tracking-widest font-sans ${envStyles.labelColor}`}>FUTURE ORIENTATION</span>
                        <div className={`h-0.5 w-4 ${envStyles.timelineLine}`} />
                      </div>
                    </div>
                  )}

                  {/* Empty State Instruction */}
                  <AnimatePresence>
                    {placedFigurines.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2 pointer-events-none z-10"
                      >
                        <Compass className="w-10 h-10 text-[#93815c]/50 animate-bounce" />
                        <h4 className="text-xs font-black text-[#5d5138]">Your Sand Tray is Clean</h4>
                        <p className="text-[11px] text-[#7d6e4f] max-w-sm leading-relaxed">
                          Click any miniature object from the left shelf to place it in the sand, then grab it to slide it across the timeline fields. Highlight figures to add context reviews.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Placed Figures Rendering inside sandbox */}
                  {placedFigurines.map((item) => {
                    const baseFig = FIGURINES.find(f => f.id === item.figurineId);
                    const FigIcon = baseFig?.icon || HelpCircle;
                    const isSelected = item.uniqueId === selectedUniqueId;
                    
                    return (
                      <div
                        key={item.uniqueId}
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                        }}
                        onPointerDown={(e) => handlePointerDown(e, item.uniqueId)}
                        className={`absolute z-20 transition-transform duration-200 touch-none cursor-grab active:cursor-grabbing p-2 rounded-2xl flex flex-col items-center border shadow-sm ${
                          isSelected 
                            ? 'ring-2 ring-[#3ECFCF] border-[#3ECFCF] bg-white scale-110 z-30' 
                            : baseFig?.defaultColor || 'text-slate-800 bg-white/90 border-slate-200'
                        }`}
                      >
                        <FigIcon className="w-5 h-5 shrink-0" />
                        <span className="text-[9px] font-extrabold tracking-tight select-none mt-0.5 leading-none">
                          {item.name}
                        </span>

                        {/* Miniature indicators of meanings added */}
                        {item.personalMeaning.trim().length > 0 && !isSelected && (
                          <div className="absolute top-0 right-0 -mr-1 -mt-1 bg-teal-500 rounded-full w-2 h-2 border border-white" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FIGURE FOCUS CONTROL BAR (Displays when secondary figure highlighted) */}
              {activeSelectedFigurine ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-extrabold tracking-wider bg-slate-100 rounded-md px-2 py-0.5">
                        Selected: {activeSelectedFigurine.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">•</span>
                      <span className="text-[10px] font-bold text-slate-400">Scale: {activeSelectedFigurine.scale}x</span>
                      <span className="text-[10px] font-bold text-slate-400">•</span>
                      <span className="text-[10px] font-bold text-slate-400">Rotated: {activeSelectedFigurine.rotation}°</span>
                    </div>

                    <input
                      type="text"
                      value={activeSelectedFigurine.personalMeaning}
                      onChange={(e) => handleUpdateMeaning(activeSelectedFigurine.uniqueId, e.target.value)}
                      placeholder={`Assign personal meaning (e.g. "Represents my past struggles at school.")`}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#3ECFCF]"
                    />
                  </div>

                  {/* Operational controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleScaleSelected(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 transition"
                      title="Shrink Object"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScaleSelected(true)}
                      className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 transition"
                      title="Enlarge Object"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRotateSelected}
                      className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 transition"
                      title="Rotate Object"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(activeSelectedFigurine.uniqueId)}
                      className="p-2 hover:bg-rose-50 hover:border-rose-300 text-rose-600 rounded-lg border border-slate-200 transition"
                      title="Delete Object"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <span className="text-[10.5px] text-slate-400 font-bold">💡 Tip: Highlight/click characters inside the sandbox to assign meanings, scale, or delete them.</span>
                </div>
              )}

              {/* SAVING / JOURNAL SYNTHESIS BAR */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-200/50 pb-3">
                  <BookOpen className="w-4.5 h-4.5 text-[#3ECFCF]" />
                  <span className="text-xs font-black text-slate-800">Sandplay Clinical Synthesis Diary</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#3ECFCF] font-sans">
                      TRAY VIEW NAME / TITLE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Past Fears & Future Light"
                      value={trayTitle}
                      onChange={(e) => setTrayTitle(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#3ECFCF] focus:outline-none focus:ring-1 focus:ring-[#3ECFCF]/10"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#3ECFCF] font-sans">
                      WHAT DOES THIS MAP TELL YOU? RECORD CLINICAL CORE REVELATIONS
                    </label>
                    <textarea
                      placeholder="What observations stand out? How do distances or barriers between figurines map to feelings from past, present or future?"
                      value={synthesisNote}
                      onChange={(e) => setSynthesisNote(e.target.value)}
                      className="w-full h-[60px] md:h-[40px] text-xs font-semibold p-2 bg-white border border-slate-200 rounded-xl focus:border-[#3ECFCF] focus:outline-none focus:ring-1 focus:ring-[#3ECFCF]/10 resize-none leading-normal"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveTray}
                  disabled={placedFigurines.length === 0}
                  className="w-full py-2.5 bg-[#3ECFCF] hover:bg-[#3ECFCF]/95 text-white disabled:opacity-50 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lock In & Save Sand Tray Configuration</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
