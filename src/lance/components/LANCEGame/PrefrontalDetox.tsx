import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';

interface Thought {
  id: string;
  text: string;
  bucket: 'unsorted' | 'control' | 'dissolve';
}

const SEED_THOUGHTS = [
  'What people think of me',
  'Whether I said the right thing',
  'My breathing right now',
  'The economy',
  'Whether I choose to respond',
  'My past mistakes',
  'Setting a boundary today',
  'Other people\'s moods',
  'My effort today',
  'The weather',
];

const BUCKET_CONFIG = {
  control: {
    label: 'Variables I Can Control',
    sub: 'Actions, responses, effort, boundaries',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.08)',
    border: 'rgba(13,148,136,0.25)',
    emoji: '✊',
  },
  dissolve: {
    label: 'Static to Dissolve',
    sub: 'Things outside your influence',
    color: '#6B7280',
    bg: 'rgba(107,114,128,0.08)',
    border: 'rgba(107,114,128,0.2)',
    emoji: '🌫️',
  },
};

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function PrefrontalDetox() {
  const [thoughts, setThoughts] = useState<Thought[]>(
    () => SEED_THOUGHTS.map(text => ({ id: makeId(), text, bucket: 'unsorted' }))
  );
  const [newText, setNewText] = useState('');
  const [phase, setPhase] = useState<'sort' | 'reflect'>('sort');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const unsorted = thoughts.filter(t => t.bucket === 'unsorted');
  const controlled = thoughts.filter(t => t.bucket === 'control');
  const dissolved = thoughts.filter(t => t.bucket === 'dissolve');
  const allSorted = unsorted.length === 0;

  const addThought = () => {
    const text = newText.trim();
    if (!text) return;
    setThoughts(prev => [...prev, { id: makeId(), text, bucket: 'unsorted' }]);
    setNewText('');
    inputRef.current?.focus();
  };

  const assignBucket = (id: string, bucket: 'control' | 'dissolve') => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, bucket } : t));
  };

  const removeThought = (id: string) => {
    setThoughts(prev => prev.filter(t => t.id !== id));
  };

  const reset = () => {
    setThoughts(SEED_THOUGHTS.map(text => ({ id: makeId(), text, bucket: 'unsorted' })));
    setPhase('sort');
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData('thoughtId', id);
  };

  const handleDrop = (e: React.DragEvent, bucket: 'control' | 'dissolve') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('thoughtId');
    if (id) assignBucket(id, bucket);
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: '#F9FAFB' }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3"
          style={{ background: '#A78BFA18', border: '1px solid #A78BFA33', color: '#7C3AED' }}
        >
          Prefrontal Detox
        </div>
        <h1 className="text-2xl font-black leading-tight" style={{ color: '#3C3C3C' }}>
          Thought Sorting<br />
          <span style={{ color: '#7C3AED' }}>Lab</span>
        </h1>
        <p className="text-[12px] mt-2 leading-relaxed" style={{ color: '#9CA3AF' }}>
          Drag each thought into its bucket. What you can control belongs to you. What you can't — let it dissolve.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'sort' && (
          <motion.div
            key="sort"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 px-4 pb-6 flex flex-col gap-4"
          >
            {/* Add thought */}
            <div
              className="flex gap-2 items-center p-3 rounded-2xl"
              style={{ background: '#FFFFFF', border: '1px solid #F0F0F0' }}
            >
              <input
                ref={inputRef}
                value={newText}
                onChange={e => setNewText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addThought()}
                placeholder="Add a thought on your mind..."
                className="flex-1 bg-transparent text-sm font-bold outline-none"
                style={{ color: '#3C3C3C' }}
              />
              <button
                onClick={addThought}
                disabled={!newText.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: newText.trim() ? '#A78BFA' : '#F3F4F6' }}
              >
                <Plus className="w-4 h-4" style={{ color: newText.trim() ? '#FFFFFF' : '#9CA3AF' }} />
              </button>
            </div>

            {/* Unsorted pile */}
            {unsorted.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
                  Sort these ({unsorted.length} left)
                </p>
                <div className="space-y-2">
                  <AnimatePresence>
                    {unsorted.map(t => (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0 }}
                        draggable
                        onDragStart={e => handleDragStart(e, t.id)}
                        className="p-3 rounded-xl flex items-center gap-2"
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #F0F0F0',
                          cursor: 'grab',
                          opacity: draggingId === t.id ? 0.5 : 1,
                        }}
                      >
                        <span className="text-sm font-medium flex-1" style={{ color: '#3C3C3C' }}>{t.text}</span>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => assignBucket(t.id, 'control')}
                            className="px-2 py-1 rounded-lg text-[11px] font-black transition-all active:scale-90"
                            style={{ background: 'rgba(13,148,136,0.1)', color: '#0D9488', border: '1px solid rgba(13,148,136,0.25)' }}
                          >
                            ✊ Mine
                          </button>
                          <button
                            onClick={() => assignBucket(t.id, 'dissolve')}
                            className="px-2 py-1 rounded-lg text-[11px] font-black transition-all active:scale-90"
                            style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: '1px solid rgba(107,114,128,0.2)' }}
                          >
                            🌫️ Let go
                          </button>
                          <button onClick={() => removeThought(t.id)} className="p-1">
                            <Trash2 className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Drop zones — shown when dragging */}
            {draggingId && (
              <div className="flex gap-3">
                {(['control', 'dissolve'] as const).map(bucket => {
                  const cfg = BUCKET_CONFIG[bucket];
                  return (
                    <div
                      key={bucket}
                      onDrop={e => handleDrop(e, bucket)}
                      onDragOver={handleDragOver}
                      className="flex-1 py-8 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all"
                      style={{ background: cfg.bg, border: `2px dashed ${cfg.color}`, color: cfg.color }}
                    >
                      <span className="text-2xl">{cfg.emoji}</span>
                      <span className="text-[11px] font-black uppercase tracking-wider">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sorted buckets preview */}
            {(controlled.length > 0 || dissolved.length > 0) && (
              <div className="flex gap-3">
                {(['control', 'dissolve'] as const).map(bucket => {
                  const cfg = BUCKET_CONFIG[bucket];
                  const items = bucket === 'control' ? controlled : dissolved;
                  if (items.length === 0) return null;
                  return (
                    <div
                      key={bucket}
                      className="flex-1 p-3 rounded-2xl"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span>{cfg.emoji}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: cfg.color }}>
                          {items.length}
                        </span>
                      </div>
                      {items.slice(0, 3).map(t => (
                        <div key={t.id} className="text-[11px] truncate mb-0.5" style={{ color: '#4B5563' }}>{t.text}</div>
                      ))}
                      {items.length > 3 && (
                        <div className="text-[10px]" style={{ color: '#9CA3AF' }}>+{items.length - 3} more</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {allSorted && thoughts.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setPhase('reflect')}
                className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#A78BFA,#0D9488)' }}
              >
                See My Reflection <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'reflect' && (
          <motion.div
            key="reflect"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 px-5 pb-8"
          >
            <div className="py-4 text-center mb-4">
              <div className="text-4xl mb-2">🧠</div>
              <h2 className="text-xl font-black" style={{ color: '#3C3C3C' }}>Your Prefrontal Map</h2>
              <p className="text-[12px] mt-1" style={{ color: '#9CA3AF' }}>Your mind just organized itself.</p>
            </div>

            {(['control', 'dissolve'] as const).map(bucket => {
              const cfg = BUCKET_CONFIG[bucket];
              const items = bucket === 'control' ? controlled : dissolved;
              return (
                <div key={bucket} className="mb-4 p-4 rounded-2xl" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{cfg.emoji}</span>
                    <div>
                      <p className="text-sm font-black" style={{ color: cfg.color }}>{cfg.label}</p>
                      <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{cfg.sub}</p>
                    </div>
                    <span className="ml-auto text-lg font-black" style={{ color: '#3C3C3C' }}>{items.length}</span>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-[11px] italic" style={{ color: '#9CA3AF' }}>Nothing here.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {items.map(t => (
                        <div
                          key={t.id}
                          className="text-[12px] font-medium px-3 py-2 rounded-xl"
                          style={{ background: '#FFFFFF', color: '#3C3C3C', border: '1px solid #F0F0F0' }}
                        >
                          {t.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div
              className="p-4 rounded-2xl mb-5"
              style={{ background: '#A78BFA10', border: '1px solid #A78BFA33' }}
            >
              <p className="text-[12px] leading-relaxed font-medium" style={{ color: '#6D28D9' }}>
                <span className="font-black">The prefrontal cortex's job</span> is to distinguish what's yours from what's noise.
                You have <span style={{ color: '#0D9488' }}>{controlled.length} things in your hands</span> today.
                The other {dissolved.length} — let the static dissolve.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-1.5"
                style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#4B5563' }}
              >
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
              <button
                onClick={() => setPhase('sort')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)' }}
              >
                Edit Sorting
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
