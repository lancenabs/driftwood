import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Play, 
  Pause, 
  Download, 
  CheckCircle, 
  Search, 
  Volume2, 
  Compass, 
  Flame, 
  Heart, 
  BookOpen, 
  Clock, 
  ExternalLink, 
  FileDown, 
  Wifi, 
  WifiOff, 
  X, 
  Maximize2, 
  Bookmark, 
  BookmarkCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface VaultResource {
  id: string;
  title: string;
  type: 'audio' | 'pdf';
  framework: 'Gottman' | 'EFT' | 'PACT' | 'NVC' | 'General';
  durationOrPages: string; // e.g. "12:30 mins" or "14 pages"
  fileSize: string; // e.g. "4.2 MB"
  description: string;
  author: string;
  downloadUrl?: string;
  audioUrl?: string; // Mock audio play trigger
  contentMarkdown?: string; // Preloaded mock reading material
}

const VAULT_RESOURCES: VaultResource[] = [
  // AUDIO MEDITATIONS
  {
    id: 'vault-aud-1',
    title: 'The Couple Bubble Co-Regulation Breathing',
    type: 'audio',
    framework: 'PACT',
    durationOrPages: '10:15 mins',
    fileSize: '9.8 MB',
    author: 'Dr. Stan Tatkin (Inspired)',
    description: 'A synchronizing, dual-breathing guided meditation designed to calm down hyper-aroused nervous systems during deep tension.',
    contentMarkdown: `### PACT Co-Regulation Audio Guide
This audio guide is designed to be played together. Sit face-to-face, knees nearly touching. 

**Instructions:**
1. Place one hand on your partner's chest, and let your partner place their hand on yours.
2. Maintain soft, relaxed eye-contact throughout the breathing beats.
3. Inhale together for 4 seconds, hold for 4 seconds, exhale for 6 seconds.
4. Synchronize your breathing patterns until you feel an organic release of physical shoulder tension.`
  },
  {
    id: 'vault-aud-2',
    title: 'De-escalating the Pursuer Attack Cycle',
    type: 'audio',
    framework: 'EFT',
    durationOrPages: '14:20 mins',
    fileSize: '13.5 MB',
    author: 'Dr. Sue Johnson (Inspired)',
    description: 'An immersive vocal meditation for pursuers to de-escalate anxiety, touch primary attachment fears, and access vulnerability.',
    contentMarkdown: `### EFT Pursuer De-escalation Audio
A guide to help highly active partners step down from fight/flight anger and locate the vulnerable longings underneath.

**Key Prompts:**
- "What is happening inside me before I push for a response?"
- "Can I notice the fear of abandonment without turning it into a complaint?"
- "Taking a slow breath, I can say: I miss you, and I am scared we are drifting."`
  },
  {
    id: 'vault-aud-3',
    title: 'Somatic Soothing for the Flooded Mind',
    type: 'audio',
    framework: 'Gottman',
    durationOrPages: '12:00 mins',
    fileSize: '11.0 MB',
    author: 'Dr. John Gottman (Inspired)',
    description: 'A step-by-step physiological relaxation script to lower heart rate below 100 bpm when flooded.',
    contentMarkdown: `### Gottman Somatic Soothe Audio
To be used during a formal 20-minute discussion timeout. Do not think about the argument during this exercise.

**Steps:**
1. Breathe deeply into the abdomen.
2. Relax your jaw, drop your shoulders, and loosen your fists.
3. Visualize a calm, safe sanctuary. Your body must recover before your brain can solve relational problems.`
  },

  // PDF RESOURCES / GUIDES
  {
    id: 'vault-pdf-1',
    title: 'The EFT Cycle Mapping Workbook',
    type: 'pdf',
    framework: 'EFT',
    durationOrPages: '16 pages',
    fileSize: '2.4 MB',
    author: 'Clinical Attachment Advisory',
    description: 'A step-by-step interactive worksheet to map raw triggers, reactive loops, and vulnerable soft underbellies.',
    contentMarkdown: `# The EFT Cycle Mapping Guide
*A FamilyFrame Clinical Companion Document*

## Section 1: Exposing the Loop
Relational conflict is almost never about the surface topic (such as dishes or finances). It is driven by structured cycles of protection and emotional protest.

### Phase 1: Action-Reaction Loop
1. **Trigger Event:** Partner withdraws, stays quiet, or works late.
2. **Internal Secondary Emotion:** Immediate frustration, annoyance, or judgment ("They do not care").
3. **Outward Defensive Move:** Push, criticize, ask repeated questions, or use sarcasm.
4. **Partner's Reaction:** Feels criticized and overwhelmed, leading to silent retreat.

## Section 2: Locating Primary Needs
Underneath the secondary anger is a core attachment need:
* "I need to know I matter to you."
* "I need to feel safe from rejection."
* "I need to know you are proud of me."`
  },
  {
    id: 'vault-pdf-2',
    title: 'PACT Couple Bubble Agreements Draft',
    type: 'pdf',
    framework: 'PACT',
    durationOrPages: '8 pages',
    fileSize: '1.2 MB',
    author: 'PACT Institute Guidelines',
    description: 'Essential covenants for couples to protect their shared container against digital distractions and external stressors.',
    contentMarkdown: `# PACT Couple Bubble Covenant
*A safe protective shield for secure couples.*

## Core Principles
1. **Absolute Safety:** We pledge never to threaten the relationship during fights.
2. **Mutual Protection:** We protect each other in public and in private. We do not let third parties (even children or family) compromise our bubble.
3. **Primary Consolation:** We go to each other first for soothing and regulation, rather than external escape channels.

## Sample Weekly Agreements
- **Digital Sanctuary:** No screens in bed after 10:30 PM.
- **The 5-Minute Reunion:** Spend 5 dedicated minutes co-regulating physically when returning home from work before tackling operational chores.`
  },
  {
    id: 'vault-pdf-3',
    title: 'Gottman 4 Horsemen & Antidotes Cheat Sheet',
    type: 'pdf',
    framework: 'Gottman',
    durationOrPages: '4 pages',
    fileSize: '0.8 MB',
    author: 'The Gottman Institute (Concept)',
    description: 'A concise rapid-access cheat sheet with critical examples of soft start-ups, accountability, and self-soothing scripts.',
    contentMarkdown: `# Gottman Antidotes Cheat Sheet
*FamilyFrame Pocket Guide*

## 1. Criticism vs. Soft Start-up
* **Criticism:** "You always forget the groceries! You're completely self-centered."
* **Antidote:** "I feel frustrated that the ingredients aren't here for dinner. Would you be willing to double-check the list before heading back?"

## 2. Contempt vs. Culture of Appreciation
* **Contempt:** "Oh, look who decided to show up! Did you finally finish your very important hobbies?"
* **Antidote:** "I really appreciate how hard you work, and I'm glad you got some rest today. I would love some support with dinner now."

## 3. Defensiveness vs. Accept Responsibility
* **Defensiveness:** "I wouldn't have forgotten if you didn't micromanage everything I do!"
* **Antidote:** "You're right. I did forget to check the message. I apologize. Let me fix it."`
  },
  {
    id: 'vault-pdf-4',
    title: 'NVC Compassionate Communication Matrix',
    type: 'pdf',
    framework: 'NVC',
    durationOrPages: '12 pages',
    fileSize: '1.9 MB',
    author: 'Nonviolent Communication Circle',
    description: 'A structural framework translating high-conflict emotional outbursts into factual observations and clear requests.',
    contentMarkdown: `# NVC Compassionate Matrix
*Separating Evaluations from Observations*

## Step 1: Clean Observation
Describe what occurred without analysis, labels, or diagnostics. Only what a video camera could capture.

* **Diagnostic:** "You are trying to control my schedules."
* **Observation:** "You requested to view my calendar invitation three times today."

## Step 2: Unmet Universal Human Needs
Locate the universal need that is active:
* Respect, autonomy, consideration, safety, predictability, support, reassurance.`
  }
];

export default function ResourceVault() {
  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('driftwood_seachest_kept_v1');
    return saved ? JSON.parse(saved) : ['vault-pdf-3']; // Default cached one
  });

  const [favoritedIds, setFavoritedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('driftwood_seachest_starred_v1');
    return saved ? JSON.parse(saved) : ['vault-aud-1'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFramework, setFilterFramework] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  
  // Audio Player State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioVolume, setAudioVolume] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // PDF Reader State
  const [activePdfId, setActivePdfId] = useState<string | null>(null);
  const [readingHighlightText, setReadingHighlightText] = useState<string[]>([]);

  // Offline Simulation State
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    // Save favorites and downloads on change
    localStorage.setItem('driftwood_seachest_kept_v1', JSON.stringify(downloadedIds));
  }, [downloadedIds]);

  useEffect(() => {
    localStorage.setItem('driftwood_seachest_starred_v1', JSON.stringify(favoritedIds));
  }, [favoritedIds]);

  // Audio Playback Simulation
  useEffect(() => {
    if (isPlaying && playingId) {
      timerRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setPlayingId(null);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playingId]);

  const toggleFavorite = (id: string) => {
    if (favoritedIds.includes(id)) {
      setFavoritedIds(favoritedIds.filter(fid => fid !== id));
    } else {
      setFavoritedIds([...favoritedIds, id]);
    }
  };

  const startDownload = (id: string) => {
    if (downloadedIds.includes(id)) return;
    
    // Simulate a brief progress download
    setDownloadedIds([...downloadedIds, id]);
  };

  const removeDownload = (id: string) => {
    setDownloadedIds(downloadedIds.filter(did => did !== id));
  };

  const handlePlayAudio = (resource: VaultResource) => {
    if (playingId === resource.id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingId(resource.id);
      setAudioProgress(0);
      setIsPlaying(true);
    }
  };

  // Filtering Resources
  const filteredResources = VAULT_RESOURCES.filter(res => {
    // If offline mode is ON, only show downloaded resources
    if (isOfflineMode && !downloadedIds.includes(res.id)) {
      return false;
    }

    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFramework = filterFramework === 'All' || res.framework.toLowerCase() === filterFramework.toLowerCase();
    const matchesType = filterType === 'All' || res.type === filterType;

    return matchesSearch && matchesFramework && matchesType;
  });

  const activePlayingResource = VAULT_RESOURCES.find(r => r.id === playingId);
  const activeReadingResource = VAULT_RESOURCES.find(r => r.id === activePdfId);

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] animate-fade-in" id="resource-vault-parent">
      
      {/* Immersive Top Hero Panel */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 rounded-[2.2rem] shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-[#FF6EA7]/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-secondary">FamilyFrame Clinical Cloud</span>
            <h4 className="font-display font-black text-base text-white leading-tight mt-0.5">Clinical Resource Vault</h4>
            <p className="text-[10px] text-stone-300 font-sans mt-1 leading-relaxed max-w-[320px]">
              Access structured worksheets, cheat-sheets, audio meditations, and co-regulation scripts. Download items to keep them fully accessible offline.
            </p>
          </div>

          {/* Interactive Offline Simulator Toggle */}
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[9px] font-black uppercase border transition cursor-pointer ${
              isOfflineMode 
                ? 'bg-[#FF8A00] text-white border-[#FF8A00] animate-pulse' 
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
            }`}
            title="Simulate offline state to verify offline accessibility."
          >
            {isOfflineMode ? (
              <>
                <WifiOff size={11} /> Simulated Offline Mode
              </>
            ) : (
              <>
                <Wifi size={11} className="text-primary" /> Online Cloud Enabled
              </>
            )}
          </button>
        </div>

        {/* Offline Warning Banner */}
        {isOfflineMode && (
          <div className="mt-3 bg-[#FF8A00]/25 text-[#FF8A00] border border-[#FF8A00]/30 px-3 py-2 rounded-xl text-[10px] leading-relaxed flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>Currently simulating <strong>offline mode</strong>. Showing only previously downloaded resources cached in local storage. Toggle button to connect back to clinical cloud.</span>
          </div>
        )}

        {/* Mini stats dashboard */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-400 uppercase">Available</span>
            <span className="text-xs font-black text-white">{VAULT_RESOURCES.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-400 uppercase">Offline Cached</span>
            <span className="text-xs font-black text-primary">{downloadedIds.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-400 uppercase">Bookmarked</span>
            <span className="text-xs font-black text-[#FF6EA7]">{favoritedIds.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-stone-400 uppercase">Storage Used</span>
            <span className="text-xs font-black text-white">{(downloadedIds.length * 1.8).toFixed(1)} MB</span>
          </div>
        </div>
      </div>

      {/* Embedded Active Audio Meditation Player */}
      {activePlayingResource && (
        <div className="bg-stone-50 border-2 border-stone-900 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm animate-fade-in relative">
          <div className="absolute right-3 top-3">
            <button 
              onClick={() => {
                setIsPlaying(false);
                setPlayingId(null);
              }}
              className="text-stone-400 hover:text-stone-900"
            >
              <X size={14} />
            </button>
          </div>

          <div className="w-10 h-10 rounded-xl bg-stone-900 text-secondary flex items-center justify-center shrink-0 text-lg">
            🔊
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center gap-1.5 justify-center md:justify-start">
              <span className="text-[8px] font-mono bg-secondary/15 text-secondary border border-secondary/20 px-2 py-0.5 rounded font-black uppercase">
                {activePlayingResource.framework} AUDIO
              </span>
              <span className="text-[9px] text-stone-400 font-mono">{activePlayingResource.durationOrPages}</span>
            </div>
            <h5 className="font-display font-black text-xs text-stone-800 leading-tight mt-1 truncate">
              {activePlayingResource.title}
            </h5>
            <p className="text-[10px] text-stone-500 font-sans truncate">{activePlayingResource.author}</p>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" className="translate-x-[1px]" />}
            </button>

            {/* Slider progress track */}
            <div className="flex flex-col w-32 md:w-40 gap-1">
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-stone-900 rounded-full transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-stone-400">
                <span>0:{(Math.floor(audioProgress * 0.1)).toFixed(0)}</span>
                <span>{activePlayingResource.durationOrPages}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1.5 text-stone-400">
              <Volume2 size={12} />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={audioVolume} 
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="w-12 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main layout deck split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Search Filters & Resource Deck List (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          {/* Integrated search and filters bar */}
          <div className="bg-white p-3 rounded-2xl border-2 border-stone-200/80 flex flex-col gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources, authors, or key terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-700 placeholder-stone-400 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t border-stone-100">
              <div className="flex gap-2 items-center text-[10px]">
                <span className="font-bold text-stone-400">Model:</span>
                <div className="flex gap-1">
                  {['All', 'Gottman', 'EFT', 'PACT', 'NVC'].map((fw) => (
                    <button
                      key={fw}
                      onClick={() => setFilterFramework(fw)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        filterFramework === fw 
                          ? 'bg-stone-900 text-white' 
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-500'
                      }`}
                    >
                      {fw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 items-center text-[10px]">
                <span className="font-bold text-stone-400">Type:</span>
                <div className="flex gap-1">
                  {['All', 'audio', 'pdf'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        filterType === t 
                          ? 'bg-stone-900 text-white' 
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-500'
                      }`}
                    >
                      {t === 'All' ? 'All Types' : t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable grid card index */}
          <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredResources.map((resource) => {
              const isDownloaded = downloadedIds.includes(resource.id);
              const isFavorited = favoritedIds.includes(resource.id);

              const badgeColor = 
                resource.framework === 'Gottman' ? 'bg-primary/15 text-primary border-primary/20' :
                resource.framework === 'EFT' ? 'bg-secondary/15 text-secondary border-secondary/20' :
                resource.framework === 'PACT' ? 'bg-[#FF8A00]/15 text-[#FF8A00] border-[#FF8A00]/20' :
                'bg-[#FF6EA7]/15 text-[#FF6EA7] border-[#FF6EA7]/20';

              return (
                <div 
                  key={resource.id}
                  className="bg-white rounded-2xl border-2 border-stone-200/80 p-3.5 hover:border-stone-300 transition shadow-sm flex gap-3 items-start relative"
                >
                  {/* Left Side Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-lg ${
                    resource.type === 'audio' ? 'bg-stone-50 border-stone-100' : 'bg-red-50/50 border-red-100'
                  }`}>
                    {resource.type === 'audio' ? '🎵' : '📄'}
                  </div>

                  {/* Middle Area Content */}
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display font-black text-xs text-stone-800 leading-tight">
                        {resource.title}
                      </span>
                      <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                        {resource.framework}
                      </span>
                    </div>

                    <p className="text-[9.5px] text-stone-400 font-mono mt-0.5">
                      By {resource.author} • {resource.durationOrPages} ({resource.fileSize})
                    </p>

                    <p className="text-[10px] text-stone-500 font-sans mt-1 leading-relaxed line-clamp-2">
                      {resource.description}
                    </p>

                    {/* Footer buttons row */}
                    <div className="flex gap-2 items-center mt-3">
                      {resource.type === 'audio' ? (
                        <button
                          onClick={() => handlePlayAudio(resource)}
                          className="bg-stone-900 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1"
                        >
                          {playingId === resource.id && isPlaying ? <Pause size={9} /> : <Play size={9} />}
                          {playingId === resource.id ? 'Active Player' : 'Play Audio'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setActivePdfId(resource.id)}
                          className="bg-stone-950 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1"
                        >
                          <BookOpen size={9} /> Open Preview
                        </button>
                      )}

                      {/* Download Toggle button */}
                      {isDownloaded ? (
                        <button
                          onClick={() => removeDownload(resource.id)}
                          className="bg-stone-50 hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200/80 text-[8.5px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition"
                          title="Click to delete resource from offline cache"
                        >
                          <CheckCircle size={9} className="text-primary" /> Offline Cached
                        </button>
                      ) : (
                        <button
                          onClick={() => startDownload(resource.id)}
                          disabled={isOfflineMode}
                          className={`border text-[8.5px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition ${
                            isOfflineMode 
                              ? 'bg-stone-100 text-stone-400 border-stone-200/50 cursor-not-allowed'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <Download size={9} /> Make Offline
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bookmark Right Floater */}
                  <div className="absolute right-3.5 top-3.5">
                    <button
                      onClick={() => toggleFavorite(resource.id)}
                      className={`p-1.5 rounded-full transition ${
                        isFavorited ? 'text-[#FF6EA7] bg-[#FF6EA7]/10' : 'text-stone-300 hover:text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      <Bookmark size={14} fill={isFavorited ? '#FF6EA7' : 'none'} />
                    </button>
                  </div>

                </div>
              );
            })}

            {filteredResources.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-12 text-stone-400 bg-white border-2 border-stone-200/50 rounded-2xl">
                <Compass size={32} className="text-stone-300 mb-2" />
                <h5 className="font-display font-black text-xs text-stone-600 uppercase tracking-wider">No matching resources found</h5>
                <p className="text-[10px] leading-relaxed max-w-[200px] mt-1">
                  Try adjusting your search queries or clearing your framework filter chips.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: PDF Preview Interactive Reader / Offline Sync Instructions (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Active PDF Reader View */}
          {activeReadingResource ? (
            <div className="bg-surface-container-lowest p-5 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col gap-3.5 animate-fade-in relative max-h-[580px] overflow-y-auto">
              
              <div className="flex justify-between items-start border-b border-outline-variant pb-2.5">
                <div>
                  <span className="text-[8px] font-mono font-black uppercase text-[#FF6EA7] tracking-wider">Interactive PDF Reader</span>
                  <h5 className="font-display font-black text-xs text-stone-800 leading-tight mt-0.5 truncate max-w-[200px]">
                    {activeReadingResource.title}
                  </h5>
                </div>
                <button
                  onClick={() => setActivePdfId(null)}
                  className="text-stone-400 hover:text-stone-800 p-1"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Reader body */}
              <div className="bg-stone-50/50 border border-stone-200 p-4 rounded-xl text-[10.5px] leading-relaxed font-sans text-stone-700 select-text">
                <pre className="whitespace-pre-wrap font-sans">
                  {activeReadingResource.contentMarkdown}
                </pre>
              </div>

              {/* Interactive document highlights capability */}
              <div className="flex flex-col gap-2 bg-stone-50/50 border border-stone-100 p-3 rounded-xl text-[10px]">
                <div className="flex justify-between items-center font-bold text-stone-600">
                  <span className="flex items-center gap-1">✍️ Session Study Highlights</span>
                  <button 
                    onClick={() => setReadingHighlightText([])}
                    className="text-[8px] text-stone-400 hover:text-stone-600 uppercase"
                  >
                    Clear Notes
                  </button>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Record your highlights or key takeaways here..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      setReadingHighlightText([...readingHighlightText, e.currentTarget.value.trim()]);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full bg-white border border-stone-200 rounded p-1.5 text-[9.5px]"
                />

                <div className="flex flex-col gap-1.5 max-h-[100px] overflow-y-auto">
                  {readingHighlightText.map((hl, idx) => (
                    <div key={idx} className="bg-[#FF8A00]/10 text-stone-700 p-1.5 rounded border border-[#FF8A00]/20 italic">
                      "{hl}"
                    </div>
                  ))}
                  {readingHighlightText.length === 0 && (
                    <span className="text-stone-400 italic text-[9px]">No clinical highlights entered for this reading yet. Press Enter to submit.</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-[8.5px] text-stone-400 font-mono">
                <span>Total pages: {activeReadingResource.durationOrPages}</span>
                <span>By {activeReadingResource.author}</span>
              </div>

            </div>
          ) : (
            <div className="bg-surface-container-lowest p-6 rounded-[2rem] border-2 border-outline-variant shadow-sm flex flex-col items-center justify-center text-center gap-3.5 text-stone-400 min-h-[300px]">
              <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center text-xl">
                📖
              </div>
              <div>
                <h5 className="font-display font-black text-xs text-stone-600 uppercase tracking-wider">Clinical Doc Reader</h5>
                <p className="text-[10px] leading-relaxed max-w-[200px] mt-1">
                  Select any resource sheet card on the left and tap **"Open Preview"** to load the structured reading file right inside your dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Secure Co-Regulation Framework Explanation */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/60 p-4.5 rounded-[2rem] flex flex-col gap-2">
            <span className="text-[8.5px] font-black uppercase tracking-wider text-indigo-700">Offline Framework Sync</span>
            <h5 className="font-display font-black text-xs text-stone-800 uppercase tracking-tight flex items-center gap-1">
              <Compass size={11} className="text-indigo-600" /> Secure Clinical Delivery
            </h5>
            <p className="text-[10px] text-stone-600 leading-relaxed font-sans">
              All downloaded assets are stored safely within your device's offline web container (`localStorage` cache), ensuring continuous access during clinical timeouts, flights, or rural therapy excursions.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
