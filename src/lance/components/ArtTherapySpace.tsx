import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StickFigureAnimator from './StickFigureAnimator';
import { useGame } from './LANCEGame/LANCEGameContext';
import { 
  Sparkles, 
  Trash2, 
  RotateCcw, 
  Save, 
  Palette, 
  Upload, 
  PenTool, 
  Info, 
  BookOpen, 
  Compass, 
  Check, 
  FileImage,
  Sparkle
} from 'lucide-react';

interface StrokePoint {
  x: number;
  y: number;
}

interface Stroke {
  points: StrokePoint[];
  color: string;
  width: number;
}

interface InterpretationResult {
  interpretation: string;
  dominantVibe: string;
  colorTherapyReview: string;
  reflectivePrompt: string;
}

const FEELING_COLORS = [
  { label: '🌸 Warm Joy', hex: '#f59e0b', description: 'Glow, energy, connection' },
  { label: '💧 Calm Tide', hex: '#0284c7', description: 'Sadness, depth, cooling' },
  { label: '🔥 Raw Tension', hex: '#ef4444', description: 'Anger, passion, impulse' },
  { label: '🌿 Healing Growth', hex: '#10b981', description: 'Safety, hope, breathing' },
  { label: '🌑 Shadow Self', hex: '#312e81', description: 'Subconscious, fear, mystery' },
  { label: '☁️ Daydream', hex: '#8b5cf6', description: 'Intuition, peace, escape' },
];

export default function ArtTherapySpace() {
  const { userName } = useGame();
  const [mode, setMode] = useState<'canvas' | 'upload'>('canvas');
  const [selectedColor, setSelectedColor] = useState('#0284c7');
  const [brushWidth, setBrushWidth] = useState(5);
  const [artNotes, setArtNotes] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undoHistory, setUndoHistory] = useState<Stroke[][]>([]);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Redraw canvas from strokes
  useEffect(() => {
    if (mode === 'canvas' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid patterns
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 20; i < canvas.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let j = 20; j < canvas.height; j += 20) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(canvas.width, j);
          ctx.stroke();
        }

        // Draw strokes
        strokes.forEach((stroke) => {
          if (stroke.points.length === 0) return;
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
          ctx.stroke();
        });
      }
    }
  }, [strokes, mode]);

  // Set initial white background for canvas
  const handleCanvasInit = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    handleCanvasInit();
  }, [mode]);

  // Painting handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinates correctly matching actual high-DPI canvas scales
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setIsDrawing(true);
    
    // Save current strokes to undo history before editing
    setUndoHistory(prev => [...prev, [...strokes]]);

    const newStroke: Stroke = {
      points: [{ x, y }],
      color: selectedColor,
      width: brushWidth
    };
    setStrokes([...strokes, newStroke]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || strokes.length === 0 || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setStrokes((prevStrokes) => {
      const updated = [...prevStrokes];
      const activeIdx = updated.length - 1;
      updated[activeIdx] = {
        ...updated[activeIdx],
        points: [...updated[activeIdx].points, { x, y }]
      };
      return updated;
    });
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const previousState = undoHistory[undoHistory.length - 1];
      setStrokes(previousState);
      setUndoHistory(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (confirm('Clear your painting canvas and start fresh?')) {
      setUndoHistory(prev => [...prev, [...strokes]]);
      setStrokes([]);
      setResult(null);
    }
  };

  // Upload Handlers
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please make sure you upload an image file (PNG, JPG).');
      return;
    }
    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Seek AI Interpretation
  const handleSeekInterpretation = async () => {
    setIsAnalyzing(true);
    setErrorMessage('');
    setResult(null);

    let base64Image = '';

    if (mode === 'canvas') {
      if (strokes.length === 0) {
        setErrorMessage('Draw something on the canvas first to express how you are feeling!');
        setIsAnalyzing(false);
        return;
      }
      if (canvasRef.current) {
        base64Image = canvasRef.current.toDataURL('image/png');
      }
    } else {
      if (!uploadPreview) {
        setErrorMessage('Please upload or drag-and-drop an artwork image first.');
        setIsAnalyzing(false);
        return;
      }
      base64Image = uploadPreview;
    }

    try {
      const response = await fetch('/api/therapy/analyze-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          textNotes: artNotes,
          userName: userName || 'Friend'
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          interpretation: data.interpretation,
          dominantVibe: data.dominantVibe,
          colorTherapyReview: data.colorTherapyReview,
          reflectivePrompt: data.reflectivePrompt
        });
      } else {
        setErrorMessage(data.error || 'Failed to analyze your art piece. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Could not connect to the therapy analysis server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="art-therapy-container" className="bg-white rounded-3xl p-5 md:p-6 space-y-6 text-left" style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#F0F0F0] pb-4">
        <div className="flex gap-4 items-start flex-1">
          <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center relative" id="art-studio-stick-fig-header" style={{ background: '#6366F114', border: '1px solid #6366F133' }}>
            <StickFigureAnimator type="painting" className="w-11 h-11" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5" style={{ color: '#4338CA' }}>
              <Palette className="w-4.5 h-4.5 animate-pulse" style={{ color: '#6366F1' }} />
              <span className="text-[10px] uppercase tracking-widest font-extrabold font-sans">Art Therapy Studio</span>
            </div>
            <h3 className="font-display text-base font-bold tracking-tight" style={{ color: '#3C3C3C' }}>Expressive Art Therapy Canvas</h3>
            <p className="text-[11.5px] text-[#6B7280] font-medium leading-relaxed">
              Giving visual shape to wordless feelings, hidden stresses, or subconscious hopes. Draw directly inside the canvas, or upload a photo of your traditional art for an advanced AI clinical analysis.
            </p>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="flex gap-1 bg-[#F9FAFB] p-1 rounded-xl self-start">
          <button
            onClick={() => {
              setMode('canvas');
              setErrorMessage('');
            }}
            className={`min-h-10 px-3 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'canvas' ? 'bg-white' : 'text-[#6B7280]'
            }`}
            style={mode === 'canvas' ? { color: '#4338CA', boxShadow: '0 3px 14px rgba(0,0,0,0.05)' } : undefined}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Digital Canvas</span>
          </button>
          <button
            onClick={() => {
              setMode('upload');
              setErrorMessage('');
            }}
            className={`min-h-10 px-3 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'upload' ? 'bg-white' : 'text-[#6B7280]'
            }`}
            style={mode === 'upload' ? { color: '#4338CA', boxShadow: '0 3px 14px rgba(0,0,0,0.05)' } : undefined}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Artwork</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Creative Stage */}
        <div className="md:col-span-8 space-y-4">
          
          {mode === 'canvas' ? (
            /* Canvas Area */
            <div className="space-y-3">
              <div className="border-4 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-inner relative group">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={450}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="w-full aspect-[4/3] bg-white cursor-crosshair touch-none select-none block"
                />
                
                {strokes.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2 pointer-events-none z-10 bg-slate-50/20 backdrop-blur-xs">
                    <PenTool className="w-8 h-8 text-indigo-400/60 animate-bounce" />
                    <h4 className="text-xs font-black text-slate-700">Your Canvas is Open</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                      Select feeling colors below and paint out how your core self feels right now. Don't worry about being perfect—express the raw energy.
                    </p>
                  </div>
                )}
              </div>

              {/* Canvas controls - palettes, size */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                  {/* Feeling Palette selection */}
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      SELECT CORE FEELING SHADES
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {FEELING_COLORS.map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setSelectedColor(col.hex)}
                          className={`w-7 h-7 rounded-full border-2 transition-all relative cursor-pointer active:scale-90 ${
                            selectedColor === col.hex ? 'border-indigo-600 scale-110 shadow-3xs' : 'border-white hover:border-slate-300'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={`${col.label}: ${col.description}`}
                        >
                          {selectedColor === col.hex && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                      {/* Advanced color picker */}
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-7 h-7 rounded-full border border-slate-300 cursor-pointer overflow-hidden outline-none hover:scale-105 active:scale-95 duration-150"
                        title="Advanced color shades"
                      />
                    </div>
                  </div>

                  {/* Brush width brush size */}
                  <div className="space-y-1 shrink-0">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      BRUSH WIDTH ({brushWidth}px)
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={25}
                      value={brushWidth}
                      onChange={(e) => setBrushWidth(Number(e.target.value))}
                      className="w-36 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2 block"
                    />
                  </div>
                </div>

                {/* Subactions: Clear/Undo */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
                  <div className="flex items-center gap-1 pt-1.5">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 border border-indigo-100 rounded px-1.5">
                      {strokes.length} Brush strokes
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSeekInterpretation}
                      disabled={isAnalyzing || strokes.length === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-black rounded-lg transition disabled:opacity-40 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer shadow-3xs"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Drawing'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={undoHistory.length === 0}
                      className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[10.5px] font-black rounded-lg transition disabled:opacity-40 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="flex items-center gap-1 px-2.5 py-1.5 border border-red-200 hover:bg-rose-50 hover:border-rose-400 text-red-600 text-[10.5px] font-black rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset Canvas</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Stage Area */
            <div className="space-y-3">
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-3xl p-8 text-center cursor-pointer transition relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] bg-slate-50/50 group ${
                  isDragOver 
                    ? 'border-indigo-500 bg-indigo-50/30' 
                    : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {uploadPreview ? (
                  <div className="space-y-4 w-full" onClick={(e) => e.stopPropagation()}>
                    <img 
                      src={uploadPreview} 
                      alt="Uploaded user art therapy piece" 
                      className="max-h-[280px] mx-auto rounded-xl object-contain shadow-md border border-slate-100"
                    />
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10.5px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-3xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        <span>Change File</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSeekInterpretation}
                        disabled={isAnalyzing}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-black rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-3xs"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-sm">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto text-lg border border-indigo-200">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800">Drag & Drop Your Artwork</h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Drag the photo here, or <span className="text-indigo-600 font-bold underline">click to browse</span>. Handles drawing photos, sketches, or journal artwork.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Notes and Analysis trigger */}
        <div className="md:col-span-4 space-y-4">
          
          <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-2xl space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-200/50 pb-2.5">
              <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
              <span className="text-xs font-black text-slate-800">Expressive Reflections</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9.2px] uppercase tracking-wider font-extrabold text-slate-400 block font-sans">
                DESCRIBE WHAT YOU DREW / FEELING NOTES
              </label>
              <textarea
                value={artNotes}
                onChange={(e) => setArtNotes(e.target.value)}
                placeholder="What feelings stood out to you? What do the shapes, lines, or colors mean to your heart? (e.g. 'I used crimson to release sudden, burning pressure...')"
                className="w-full h-[120px] text-xs font-semibold p-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/10 resize-none leading-normal"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-xl text-[11px] font-bold">
                ✕ {errorMessage}
              </div>
            )}

            <button
              onClick={handleSeekInterpretation}
              disabled={isAnalyzing || (mode === 'canvas' && strokes.length === 0) || (mode === 'upload' && !uploadPreview)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-45 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer relative group overflow-hidden"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Seeking Clinical Reading...</span>
                </>
              ) : (
                <>
                  <Sparkle className="w-4 h-4 text-indigo-200 fill-indigo-200 group-hover:scale-110 transition shrink-0" />
                  <span>Interpret Art with Therapy AI</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex gap-2.5 items-start">
            <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-[10.5px] font-bold text-indigo-900">Why Art Therapy?</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                Drawing allows expression when words feel blocked or inaccessible. Placing deep internal pressures onto a page creates cognitive distance and instant emotional containment.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* AI INTERPRETATION WORKVIEW BOX */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="bg-indigo-50/40 border border-indigo-100/60 rounded-3xl p-5 md:p-6 space-y-5"
          >
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wide">Art Therapists Subconscious Interpretation</h4>
                <p className="text-[9px] text-[#3d627f] font-mono leading-none font-bold uppercase">SECURE CLINICAL RESPONSE COMPLETED</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
              
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9.5px] font-extrabold uppercase text-indigo-600 block tracking-widest font-sans">
                    NARRATIVE READOUT
                  </span>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line bg-white/90 p-4 rounded-2xl border border-indigo-100/40 shadow-3xs italic">
                    {result.interpretation}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] font-extrabold uppercase text-indigo-600 block tracking-widest font-sans">
                    COLOR HARMONY EVALUATION
                  </span>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed bg-white/60 p-3.5 rounded-2xl border border-indigo-100/30">
                    {result.colorTherapyReview}
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 space-y-4">
                <div className="bg-white/90 border border-indigo-100/40 rounded-2xl p-4 shadow-3xs space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      DOMINANT EMOTION VIBE
                    </span>
                    <span className="inline-block text-[11px] font-black bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full">
                      🌀 {result.dominantVibe}
                    </span>
                  </div>

                  <hr className="border-indigo-100/40" />

                  <div className="space-y-1">
                    <span className="text-[9.2px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      THERAPEUTIC REFLECTIVE PROMPT
                    </span>
                    <p className="text-xs font-semibold text-slate-700 leading-normal italic">
                      "{result.reflectivePrompt}"
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
