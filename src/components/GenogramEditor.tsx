import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  GitCommit, 
  GitMerge, 
  Trash2, 
  UserPlus, 
  HelpCircle, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Info,
  Layers,
  Heart,
  AlertTriangle,
  Minus,
  Check,
  Plus,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

// Family Node Interface
interface GenogramNode {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'nonbinary';
  generation: 'grandparent' | 'parent' | 'child';
  birthYear: string;
  x: number;
  y: number;
  isIndexPatient?: boolean;
  traits: string[];
}

// Relationship Connection Interface
interface GenogramConnection {
  id: string;
  fromId: string;
  toId: string;
  type: 'married' | 'conflictual' | 'distant' | 'harmonious' | 'estranged';
}

interface GenogramEditorProps {
  onBack: () => void;
}

export default function GenogramEditor({ onBack }: GenogramEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Try loading saved state or default to a beautiful three-generation clinical baseline
  const [nodes, setNodes] = useState<GenogramNode[]>(() => {
    try {
      const saved = localStorage.getItem('driftwood_genogram_nodes_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      // Grandparents Generation (y: 60)
      { id: 'n1', name: 'Charles', gender: 'male', generation: 'grandparent', birthYear: '1948', x: 80, y: 50, traits: ['Anxious', 'Hardworking'] },
      { id: 'n2', name: 'Eleanor', gender: 'female', generation: 'grandparent', birthYear: '1952', x: 220, y: 50, traits: ['Depressed', 'Nurturing'] },
      
      // Parents Generation (y: 160)
      { id: 'n3', name: 'Mark (Dad)', gender: 'male', generation: 'parent', birthYear: '1979', x: 100, y: 150, traits: ['Workaholic', 'Anxious'], isIndexPatient: true },
      { id: 'n4', name: 'Sarah (Mom)', gender: 'female', generation: 'parent', birthYear: '1982', x: 260, y: 150, traits: ['Resilient', 'Overwhelmed'] },
      
      // Kids Generation (y: 260)
      { id: 'n5', name: 'Jamie', gender: 'female', generation: 'child', birthYear: '2012', x: 120, y: 250, traits: ['Anxious', 'Creative'] },
      { id: 'n6', name: 'Charlie', gender: 'nonbinary', generation: 'child', birthYear: '2015', x: 240, y: 250, traits: ['Impulsive', 'Energetic'] }
    ];
  });

  const [connections, setConnections] = useState<GenogramConnection[]>(() => {
    try {
      const saved = localStorage.getItem('driftwood_genogram_connections_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'c1', fromId: 'n1', toId: 'n2', type: 'married' },
      { id: 'c2', fromId: 'n3', toId: 'n4', type: 'conflictual' },
      { id: 'c3', fromId: 'n3', toId: 'n5', type: 'distant' },
      { id: 'c4', fromId: 'n4', toId: 'n6', type: 'harmonious' }
    ];
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // New Node Quick Creator Sidebar
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeGender, setNewNodeGender] = useState<'male' | 'female' | 'nonbinary'>('male');
  const [newNodeGen, setNewNodeGen] = useState<'grandparent' | 'parent' | 'child'>('parent');
  const [newNodeBirth, setNewNodeBirth] = useState('1985');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('driftwood_genogram_nodes_v1', JSON.stringify(nodes));
      localStorage.setItem('driftwood_genogram_connections_v1', JSON.stringify(connections));
    } catch {}
  }, [nodes, connections]);

  // Handle Dragging Logic manually to guarantee cross-device touch and iframe support
  const handlePointerDown = (nodeId: string, e: React.PointerEvent) => {
    // Avoid dragging when connecting or when clicking buttons
    if (connectingFromId) return;
    setDraggedNodeId(nodeId);
    setSelectedNodeId(nodeId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Calculate relative coordinates inside the bounds of the sandbox canvas
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Constrain inside bounds of the viewport
    x = Math.max(20, Math.min(rect.width - 20, x));
    y = Math.max(20, Math.min(rect.height - 20, y));

    setNodes(prev => prev.map(n => {
      if (n.id === draggedNodeId) {
        return { ...n, x: Math.round(x), y: Math.round(y) };
      }
      return n;
    }));
  };

  const handlePointerUp = () => {
    setDraggedNodeId(null);
  };

  // Add new family node
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    // Place new nodes relative to their generation tier for visual structure
    let initialY = 150;
    if (newNodeGen === 'grandparent') initialY = 50;
    if (newNodeGen === 'child') initialY = 250;

    const newNode: GenogramNode = {
      id: 'n-' + Date.now(),
      name: newNodeName.trim(),
      gender: newNodeGender,
      generation: newNodeGen,
      birthYear: newNodeBirth.trim() || '1990',
      x: 150 + (Math.random() * 60 - 30),
      y: initialY + (Math.random() * 20 - 10),
      traits: []
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setNewNodeName('');
  };

  // Delete family node and clean up dangling connections
  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.fromId !== id && c.toId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  // Initiate Relationship Connector
  const handleStartConnection = (id: string) => {
    setConnectingFromId(id);
  };

  // Finalize connection mapping
  const handleSelectToConnect = (toId: string, type: 'married' | 'conflictual' | 'distant' | 'harmonious' | 'estranged') => {
    if (!connectingFromId || connectingFromId === toId) {
      setConnectingFromId(null);
      return;
    }

    // Avoid duplication
    const exists = connections.some(c => 
      (c.fromId === connectingFromId && c.toId === toId) || 
      (c.fromId === toId && c.toId === connectingFromId)
    );

    if (!exists) {
      const newConn: GenogramConnection = {
        id: 'c-' + Date.now(),
        fromId: connectingFromId,
        toId,
        type
      };
      setConnections(prev => [...prev, newConn]);
    }

    setConnectingFromId(null);
  };

  // Delete a relationship line
  const handleDeleteConnection = (connId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connId));
  };

  // Reset workspace
  const handleResetWorkspace = () => {
    setNodes([
      { id: 'n1', name: 'Charles', gender: 'male', generation: 'grandparent', birthYear: '1948', x: 80, y: 50, traits: ['Anxious', 'Hardworking'] },
      { id: 'n2', name: 'Eleanor', gender: 'female', generation: 'grandparent', birthYear: '1952', x: 220, y: 50, traits: ['Depressed', 'Nurturing'] },
      { id: 'n3', name: 'Mark (Dad)', gender: 'male', generation: 'parent', birthYear: '1979', x: 100, y: 150, traits: ['Workaholic', 'Anxious'], isIndexPatient: true },
      { id: 'n4', name: 'Sarah (Mom)', gender: 'female', generation: 'parent', birthYear: '1982', x: 260, y: 150, traits: ['Resilient', 'Overwhelmed'] },
      { id: 'n5', name: 'Jamie', gender: 'female', generation: 'child', birthYear: '2012', x: 120, y: 250, traits: ['Anxious', 'Creative'] },
      { id: 'n6', name: 'Charlie', gender: 'nonbinary', generation: 'child', birthYear: '2015', x: 240, y: 250, traits: ['Impulsive', 'Energetic'] }
    ]);
    setConnections([
      { id: 'c1', fromId: 'n1', toId: 'n2', type: 'married' },
      { id: 'c2', fromId: 'n3', toId: 'n4', type: 'conflictual' },
      { id: 'c3', fromId: 'n3', toId: 'n5', type: 'distant' },
      { id: 'c4', fromId: 'n4', toId: 'n6', type: 'harmonious' }
    ]);
    setSelectedNodeId(null);
    setConnectingFromId(null);
  };

  // Render Relationship connection lines with proper styles
  const renderConnectionLine = (conn: GenogramConnection) => {
    const fromNode = nodes.find(n => n.id === conn.fromId);
    const toNode = nodes.find(n => n.id === conn.toId);
    if (!fromNode || !toNode) return null;

    // Color/dash settings based on Bowen mapping models
    let strokeColor = '#94A3B8'; // default gray
    let strokeDasharray = undefined;
    let strokeWidth = '3';
    let lineTypeLabel = 'Married';

    if (conn.type === 'conflictual') {
      strokeColor = '#EF4444'; // Red
      strokeWidth = '4';
      lineTypeLabel = 'Conflict';
    } else if (conn.type === 'distant') {
      strokeColor = '#3B82F6'; // Blue
      strokeDasharray = '5,5';
      lineTypeLabel = 'Distant';
    } else if (conn.type === 'harmonious') {
      strokeColor = '#10B981'; // Emerald
      strokeWidth = '5';
      lineTypeLabel = 'Harmonious';
    } else if (conn.type === 'estranged') {
      strokeColor = '#64748B'; // Slate
      strokeDasharray = '10,5,2,5';
      lineTypeLabel = 'Estranged';
    }

    return (
      <g key={conn.id}>
        {/* Connection path line */}
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          className="transition-all"
        />
        {/* Interaction trigger overlay dot to easily delete lines */}
        <foreignObject
          x={(fromNode.x + toNode.x) / 2 - 12}
          y={(fromNode.y + toNode.y) / 2 - 12}
          width="24"
          height="24"
        >
          <button
            onClick={() => handleDeleteConnection(conn.id)}
            className="w-5 h-5 bg-white border border-slate-300 rounded-full flex items-center justify-center text-[8px] text-red-500 hover:bg-red-50 hover:border-red-400 font-bold transition-all cursor-pointer shadow-sm"
            title={`Delete ${lineTypeLabel} connection`}
          >
            ✕
          </button>
        </foreignObject>
      </g>
    );
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-4 py-2 w-full max-w-3xl mx-auto text-on-background animate-fade-in-up">
      
      {/* Top Navigation Row */}
      <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-[2rem] border-2 border-outline-variant shadow-sm relative overflow-hidden">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-slate-100 border border-outline-variant hover:bg-slate-200 transition-colors flex items-center justify-center text-on-surface cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <div className="flex-grow">
          <h2 className="font-display font-black text-sm text-on-surface flex items-center gap-1.5">
            <GitMerge className="w-4.5 h-4.5 text-primary rotate-90" />
            <span>Genogram Builder</span>
          </h2>
          <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Multi-Generational Diagnostic Tree</p>
        </div>
        
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 w-8.5 h-8.5 rounded-xl border border-amber-500/20 flex items-center justify-center cursor-pointer shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Bowen Clinical Insight Box */}
      {showHelp ? (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-4 flex flex-col gap-2 text-[10.5px] leading-relaxed text-[#4B4B4B] animate-fade-in">
          <div className="flex gap-2 items-center">
            <span className="text-xl">📚</span>
            <strong className="text-amber-800 font-display font-black text-[11px] uppercase tracking-wider">Bowen Family Systems Standard</strong>
          </div>
          <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed">
            A <strong>Genogram</strong> maps relational patterns and clinical traits (such as anxiety, depression, and resilience) across at least three generations. Use this interactive sandbox to identify repeating behavioral cycles.
          </p>
          <ul className="list-disc pl-4 text-[9.5px] font-sans flex flex-col gap-1 text-on-surface-variant">
            <li><strong>Square 🟦:</strong> Male member</li>
            <li><strong>Circle 🟢:</strong> Female member</li>
            <li><strong>Diamond 🔶:</strong> Non-binary member</li>
            <li><strong>Lines:</strong> Gray (Married), Red (Conflict), Green (Harmonious), Blue (Distant)</li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="text-[9px] uppercase tracking-wider font-bold text-amber-700 hover:underline text-left mt-1"
          >
            ✕ Dismiss clinical guide
          </button>
        </div>
      ) : (
        <div className="bg-primary/5 border-2 border-primary/10 rounded-[2rem] p-3.5 flex gap-3 items-start text-[10.5px] leading-relaxed text-[#4B4B4B]">
          <span className="text-xl shrink-0 mt-0.5">🧬</span>
          <div>
            <strong className="text-[11px] text-primary">Intergenerational Blueprint:</strong> 
            <p className="font-sans mt-0.5 text-[10px] text-on-surface-variant leading-relaxed">
              Drag symbols around the canvas. Click any member to edit details, add clinical traits, or create relationship lines to connect family ties!
            </p>
          </div>
        </div>
      )}

      {/* Main Sandbox Interactive Canvas */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-on-surface-variant px-1">
          <span>Relational Sandbox Workspace</span>
          <span className="text-primary font-mono font-bold">Grid Scale: 320x300</span>
        </div>

        {/* The Grid Canvas Container */}
        <div 
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="h-[380px] w-full bg-slate-50 border-2 border-outline-variant rounded-[2.5rem] relative overflow-hidden shadow-inner cursor-crosshair select-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
        >
          {/* SVG layer for relationship lines */}
          <svg className="absolute inset-0 pointer-events-auto w-full h-full">
            {connections.map(renderConnectionLine)}
          </svg>

          {/* Interactive Draggable Node Elements */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isConnectingTarget = connectingFromId && connectingFromId !== node.id;
            
            // Choose symbol shape style
            let shapeClass = "w-10 h-10 rounded-lg"; // Male Square
            if (node.gender === 'female') shapeClass = "w-10 h-10 rounded-full"; // Female Circle
            if (node.gender === 'nonbinary') shapeClass = "w-10 h-10 rotate-45 rounded-md"; // Nonbinary Diamond

            // Highlighting based on status
            const borderStyle = isSelected 
              ? 'border-4 border-secondary scale-110 shadow-lg z-20' 
              : node.isIndexPatient 
                ? 'border-3 border-amber-500 shadow-md' 
                : 'border-2 border-slate-700 hover:scale-105';

            return (
              <div
                key={node.id}
                onPointerDown={(e) => handlePointerDown(node.id, e)}
                style={{ 
                  left: node.x - 20, 
                  top: node.y - 20,
                  touchAction: 'none' 
                }}
                className="absolute flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-shadow select-none"
              >
                {/* Visual shape symbol */}
                <div 
                  className={`flex items-center justify-center bg-white text-[10px] font-black text-slate-800 transition-all ${shapeClass} ${borderStyle}`}
                  title={`${node.name} (${node.birthYear})`}
                >
                  <span className={node.gender === 'nonbinary' ? '-rotate-45' : ''}>
                    {node.birthYear.slice(-2)}
                  </span>
                </div>

                {/* Name Label */}
                <span className="text-[9px] font-sans font-black text-[#4B4B4B] bg-white/95 px-1 py-0.5 rounded border border-slate-200 mt-1 shadow-xs max-w-[65px] truncate text-center leading-none">
                  {node.name}
                </span>

                {/* Index Patient Star Indicator */}
                {node.isIndexPatient && (
                  <span className="absolute -top-2.5 -right-2 text-xs" title="Index Patient">⭐️</span>
                )}

                {/* Connector overlay during relation state */}
                {isConnectingTarget && (
                  <div className="absolute inset-0 bg-primary/25 rounded-full flex flex-col gap-0.5 items-center justify-center pointer-events-auto z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectToConnect(node.id, 'married');
                      }}
                      className="bg-slate-700 text-white text-[7px] font-black px-1 rounded hover:bg-slate-800"
                    >
                      💍 Wed
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectToConnect(node.id, 'conflictual');
                      }}
                      className="bg-red-500 text-white text-[7px] font-black px-1 rounded hover:bg-red-600"
                    >
                      ⚡ Jolt
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectToConnect(node.id, 'harmonious');
                      }}
                      className="bg-emerald-500 text-white text-[7px] font-black px-1 rounded hover:bg-emerald-600"
                    >
                      💚 Calm
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor & Parameter Modification Panel */}
      <div className="flex flex-col gap-3">
        {selectedNode ? (
          /* Parameter panel for chosen family member */
          <div className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] flex flex-col gap-3 shadow-sm text-[#4B4B4B] animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⚙️</span>
                <h4 className="font-display font-black text-xs text-[#4B4B4B]">Configure member: {selectedNode.name}</h4>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-[9px] font-black uppercase text-on-surface-variant hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Full Name</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, name: val } : n));
                  }}
                  className="w-full bg-slate-50 text-[10.5px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Birth Year</label>
                <input
                  type="text"
                  value={selectedNode.birthYear}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, birthYear: val } : n));
                  }}
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Gender Symbol</label>
                <select
                  value={selectedNode.gender}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, gender: val } : n));
                  }}
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold appearance-none"
                >
                  <option value="male">🟦 Male (Square)</option>
                  <option value="female">🟢 Female (Circle)</option>
                  <option value="nonbinary">🔶 Non-Binary (Diamond)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Generation Layer</label>
                <select
                  value={selectedNode.generation}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, generation: val } : n));
                  }}
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold appearance-none"
                >
                  <option value="grandparent">Grandparents (Top)</option>
                  <option value="parent">Parents (Middle)</option>
                  <option value="child">Children (Bottom)</option>
                </select>
              </div>
            </div>

            {/* Quick Behavioral/Clinical Traits */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Diagnostic Traits / Behavioral Indicators</span>
              <div className="flex flex-wrap gap-1">
                {['Anxious', 'Depressed', 'Resilient', 'Workaholic', 'Nurturing', 'Impulsive', 'Warm', 'Distanced'].map((trait) => {
                  const hasTrait = selectedNode.traits.includes(trait);
                  return (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => {
                        setNodes(prev => prev.map(n => {
                          if (n.id === selectedNode.id) {
                            const nextTraits = hasTrait 
                              ? n.traits.filter(t => t !== trait)
                              : [...n.traits, trait];
                            return { ...n, traits: nextTraits };
                          }
                          return n;
                        }));
                      }}
                      className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        hasTrait
                          ? 'bg-amber-500 border-amber-600 text-white font-bold'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#4B4B4B]'
                      }`}
                    >
                      {trait} {hasTrait ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clinical Action buttons for Node */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={() => handleStartConnection(selectedNode.id)}
                className="bg-primary hover:bg-primary-dark text-white font-display font-black py-2 rounded-xl text-[8px] uppercase tracking-wider border-b-[3px] border-primary-dark transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>🔗 Connect</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, isIndexPatient: !n.isIndexPatient } : n));
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-display font-black py-2 rounded-xl text-[8px] uppercase tracking-wider border-b-[3px] border-amber-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>⭐️ Index Pt</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-display font-black py-2 rounded-xl text-[8px] uppercase tracking-wider border-b-[3px] border-red-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-2.5 h-2.5" />
                <span>Delete</span>
              </button>
            </div>

            {connectingFromId === selectedNode.id && (
              <div className="text-[9px] text-primary font-black bg-primary/5 border border-primary/10 rounded-xl p-2 text-center animate-pulse leading-snug">
                ⚠️ Click on another family member node in the visual sandbox above to finalize the emotional connection!
              </div>
            )}
          </div>
        ) : (
          /* Default: Add new Family Member Node */
          <form
            onSubmit={handleAddNode}
            className="bg-white border-2 border-outline-variant p-4 rounded-[2rem] flex flex-col gap-3 shadow-3d-neutral text-[#4B4B4B]"
          >
            <div className="flex items-center gap-1">
              <UserPlus className="w-4 h-4 text-primary" />
              <h4 className="font-display font-black text-[9.5px] uppercase tracking-wider text-on-surface-variant">Quick Add Family Node</h4>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="e.g. Richard (Uncle)"
                className="flex-grow bg-slate-50 text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold"
              />

              <input
                type="text"
                required
                value={newNodeBirth}
                onChange={(e) => setNewNodeBirth(e.target.value)}
                placeholder="Birth Year"
                className="w-20 bg-slate-50 text-[10.5px] px-2 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-mono font-bold text-center"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Gender Shape</label>
                <select
                  value={newNodeGender}
                  onChange={(e) => setNewNodeGender(e.target.value as any)}
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold appearance-none"
                >
                  <option value="male">🟦 Male (Square)</option>
                  <option value="female">🟢 Female (Circle)</option>
                  <option value="nonbinary">🔶 Non-Binary (Diamond)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant block">Generation Layer</label>
                <select
                  value={newNodeGen}
                  onChange={(e) => setNewNodeGen(e.target.value as any)}
                  className="w-full bg-slate-50 text-[10px] px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold appearance-none"
                >
                  <option value="grandparent">Grandparents</option>
                  <option value="parent">Parents</option>
                  <option value="child">Children</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary text-white font-display font-black py-2 rounded-xl text-[9px] uppercase tracking-wider border-b-[3.5px] border-primary-dark hover:brightness-105 active:translate-y-[1.5px] active:border-b-[1.5px] transition-all cursor-pointer text-center mt-1"
            >
              Add Member Node
            </button>
          </form>
        )}
      </div>

      {/* Reset options */}
      <div className="flex gap-2 justify-between items-center bg-surface-container-lowest p-3 rounded-[2rem] border-2 border-outline-variant">
        <span className="text-[9.5px] font-sans font-bold text-on-surface-variant">
          Total Nodes: <span className="font-mono text-[#4B4B4B]">{nodes.length}</span> • Connections: <span className="font-mono text-[#4B4B4B]">{connections.length}</span>
        </span>
        
        <button
          type="button"
          onClick={handleResetWorkspace}
          className="text-[8.5px] font-black uppercase text-on-surface-variant hover:text-red-500 flex items-center gap-1.5 cursor-pointer bg-surface-container px-3 py-2 rounded-xl border border-outline-variant transition-all hover:scale-105"
        >
          <span>🔄 Reset Tree</span>
        </button>
      </div>

    </div>
  );
}
