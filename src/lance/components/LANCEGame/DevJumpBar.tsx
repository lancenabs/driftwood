// Dev-only floating jump bar — only renders on localhost / dev mode
// Lets you skip onboarding and jump directly to any tool or challenge for testing.
import React, { useState } from 'react';
import { GAME_TOOLS, GAME_CHALLENGES, CHALLENGE_ORDER } from './lanceGameData';

interface Props {
  onOpenTool: (toolId: string) => void;
  onGoToChallenges: () => void;
}

const IS_DEV = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  localStorage.getItem('lance_dev_bar') === '1'; // opt-in: demos happen on localhost too

const ALL_TOOLS = GAME_TOOLS.map(t => ({ id: t.id, name: t.name, emoji: t.emoji }));
const ALL_CHALLENGES = CHALLENGE_ORDER.map(id => {
  const ch = GAME_CHALLENGES.find(c => c.id === id);
  return { id, title: ch?.title ?? id, act: ch?.actNumber ?? 1 };
});

export default function DevJumpBar({ onOpenTool, onGoToChallenges }: Props) {
  const [open, setOpen] = useState(false);
  const [toolQuery, setToolQuery] = useState('');
  const [section, setSection] = useState<'tools' | 'challenges'>('tools');

  if (!IS_DEV) return null;

  const filteredTools = toolQuery
    ? ALL_TOOLS.filter(t => t.name.toLowerCase().includes(toolQuery.toLowerCase()) || t.id.includes(toolQuery.toLowerCase()))
    : ALL_TOOLS;

  const byAct = ALL_CHALLENGES.reduce<Record<number, typeof ALL_CHALLENGES>>((acc, ch) => {
    (acc[ch.act] = acc[ch.act] || []).push(ch);
    return acc;
  }, {});

  return (
    <>
      {/* Floating pill button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          top: 106,
          right: 10,
          zIndex: 9999,
          background: open ? '#1a1a2e' : 'linear-gradient(135deg,#7C3AED,#3ECFCF)',
          color: 'white',
          border: 'none',
          borderRadius: 20,
          padding: '8px 14px',
          fontSize: 11,
          fontWeight: 900,
          fontFamily: 'monospace',
          cursor: 'pointer',
          letterSpacing: 1,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span>⚡</span>
        <span>DEV</span>
        <span style={{ opacity: 0.7, fontWeight: 400 }}>{open ? '✕' : '↑'}</span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 140,
            right: 12,
            zIndex: 9998,
            width: 320,
            maxHeight: '60vh',
            background: '#0f1117',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(62,207,207,0.1)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 16px 10px',
            background: 'rgba(124,58,237,0.15)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#7C3AED', letterSpacing: 2, fontFamily: 'monospace', marginBottom: 4 }}>
              ⚡ DEV JUMP BAR
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              Jump to any tool or challenge. Only visible on localhost.
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {(['tools', 'challenges'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSection(s)}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  background: section === s ? 'rgba(124,58,237,0.2)' : 'transparent',
                  border: 'none',
                  borderBottom: section === s ? '2px solid #7C3AED' : '2px solid transparent',
                  color: section === s ? '#CE82FF' : 'rgba(255,255,255,0.4)',
                  fontSize: 11,
                  fontWeight: 900,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {s === 'tools' ? `🧰 Tools (${ALL_TOOLS.length})` : `⚡ Challenges (${ALL_CHALLENGES.length})`}
              </button>
            ))}
          </div>

          {/* Tools section */}
          {section === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '8px 12px', flexShrink: 0 }}>
                <input
                  value={toolQuery}
                  onChange={e => setToolQuery(e.target.value)}
                  placeholder="Search tools…"
                  autoFocus
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    padding: '7px 10px',
                    color: 'white',
                    fontSize: 12,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {filteredTools.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { onOpenTool(t.id); setOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '9px 14px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{t.emoji}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{t.id}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 14, color: '#3ECFCF', opacity: 0.7 }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Challenges section */}
          {section === 'challenges' && (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {/* Go to challenges tab button */}
              <button
                onClick={() => { onGoToChallenges(); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,150,0,0.12)',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  color: '#FF9600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                <span>⚡</span>
                <span>Open Challenges Tab</span>
                <span style={{ marginLeft: 'auto' }}>→</span>
              </button>

              {Object.entries(byAct).map(([act, challenges]) => (
                <div key={act}>
                  <div style={{
                    padding: '6px 14px 4px',
                    fontSize: 9,
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    fontFamily: 'monospace',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    Act {act}
                  </div>
                  {challenges.map((ch, i) => (
                    <div
                      key={ch.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 14px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 11,
                      }}
                    >
                      <span style={{
                        width: 20, height: 20, borderRadius: 6,
                        background: 'rgba(124,58,237,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 900, color: '#CE82FF', flexShrink: 0,
                      }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.title}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{ch.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: '10px 14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: 8,
            flexShrink: 0,
          }}>
            <a
              href="http://localhost:8765"
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                padding: '7px 10px',
                background: 'rgba(62,207,207,0.1)',
                border: '1px solid rgba(62,207,207,0.25)',
                borderRadius: 10,
                color: '#3ECFCF',
                fontSize: 10,
                fontWeight: 900,
                textDecoration: 'none',
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
            >
              🤖 Open The Intern
            </a>
            <button
              onClick={() => window.open('http://localhost:3001', '_blank')}
              style={{
                flex: 1,
                padding: '7px 10px',
                background: 'rgba(88,204,2,0.1)',
                border: '1px solid rgba(88,204,2,0.25)',
                borderRadius: 10,
                color: '#58CC02',
                fontSize: 10,
                fontWeight: 900,
                cursor: 'pointer',
                letterSpacing: 0.5,
              }}
            >
              📱 Pop Out App
            </button>
          </div>
        </div>
      )}
    </>
  );
}
