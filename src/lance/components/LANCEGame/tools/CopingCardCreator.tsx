import React, { useState } from 'react';
import { Clipboard, Download } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { exportWorksheetPdf } from '../../../utils/exportWorksheetPdf';

interface CopingCard { id: number; title: string; message: string; }

const STORAGE_KEY = 'SURVIVAL_COPING_CARDS';

function load(): CopingCard[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

const MAX_LEN = 110;

interface Props { onBack: () => void; }

export default function CopingCardCreator({ onBack }: Props) {
  const { addXp } = useGame();
  const [cards, setCards] = useState<CopingCard[]>(load);
  const [title, setTitle] = useState('');
  const [anchor, setAnchor] = useState('');
  const [approval, setApproval] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const requestAudit = () => {
    if (!title.trim() || !anchor.trim()) return;
    setApproval(anchor.length > MAX_LEN ? 'rejected' : 'approved');
  };

  const save = () => {
    const card: CopingCard = { id: Date.now(), title: title.trim(), message: anchor.trim() };
    const next = [card, ...cards];
    setCards(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    addXp(20);
    setTitle('');
    setAnchor('');
    setApproval('pending');
  };

  const remove = (id: number) => {
    const next = cards.filter(c => c.id !== id);
    setCards(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const downloadCardsPdf = () => {
    exportWorksheetPdf({
      title: 'Coping Cards',
      subtitle: 'Portable coping statements — keep somewhere easy to find',
      sections: cards.map(c => ({ label: c.title, body: c.message })),
    });
  };

  const bannerStyle = approval === 'approved'
    ? { background: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46' }
    : approval === 'rejected'
    ? { background: '#FFF1F2', borderColor: '#FECDD3', color: '#9F1239' }
    : { background: '#F9FAFB', borderColor: '#F0F0F0', color: '#6B7280' };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/cbt.webp)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.35,
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div aria-hidden className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(247,248,250,0.9) 0%, rgba(247,248,250,0.94) 100%)',
        zIndex: -1, pointerEvents: 'none',
      }} />
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.85)' }}>
        <BigBackButton onBack={onBack} />
        <img src="/icons/coping_card_creator.webp" alt="" draggable={false}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{ width: 34, height: 34, borderRadius: 10, boxShadow: '0 4px 10px rgba(244,63,94,0.35)' }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black truncate" style={{ color: '#3C3C3C' }}>Coping Card Creator</h2>
          <p className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>Cards you carry · find them in seconds</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border space-y-3.5" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <p className="text-[11.5px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>
            Build a short, portable coping statement you can find in seconds during a crisis moment. Short beats thorough — a card you can't read under stress doesn't help.
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-[8.5px] uppercase tracking-wider font-extrabold block mb-1" style={{ color: '#9CA3AF' }}>Card title / focus area</label>
              <input
                type="text" value={title}
                onChange={(e) => { setTitle(e.target.value); setApproval('pending'); }}
                placeholder="e.g., Panic Spike Anchor"
                className="w-full px-3 py-2 rounded-xl text-[11px] font-semibold outline-none border"
                style={{ background: '#F9FAFB', color: '#3C3C3C', borderColor: '#F0F0F0' }}
              />
            </div>
            <div>
              <label className="text-[8.5px] uppercase tracking-wider font-extrabold block mb-1" style={{ color: '#9CA3AF' }}>Coping message</label>
              <textarea
                value={anchor}
                onChange={(e) => { setAnchor(e.target.value); setApproval('pending'); }}
                placeholder="e.g., My thoughts are temporary signals, not facts. This feeling will pass."
                className="w-full h-16 p-2.5 rounded-xl text-[11px] font-semibold outline-none resize-none border"
                style={{ background: '#F9FAFB', color: '#3C3C3C', borderColor: '#F0F0F0' }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl border flex justify-between items-center gap-2" style={bannerStyle}>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[8px] font-mono font-black uppercase tracking-wider block">Length check</span>
              <p className="text-[10.5px] font-bold leading-relaxed">
                {approval === 'approved' && '🟢 Short enough to read under stress'}
                {approval === 'rejected' && `🔴 Too long — ${anchor.length}/${MAX_LEN} characters`}
                {approval === 'pending' && '⚪ Waiting for a length check'}
              </p>
            </div>
            <button
              type="button" onClick={requestAudit} disabled={!title.trim() || !anchor.trim()}
              className="px-2.5 py-1.5 text-[9px] font-mono font-black uppercase rounded-lg text-white disabled:opacity-40 cursor-pointer shrink-0"
              style={{ background: '#1F2937' }}
            >
              Check Length
            </button>
          </div>

          {approval === 'approved' && (
            <button
              type="button" onClick={save}
              className="w-full py-2.5 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
              style={{ background: '#059669' }}
            >
              Save Coping Card
            </button>
          )}

          {cards.length > 0 && (
            <div className="space-y-1.5 pt-1.5 border-t text-left" style={{ borderColor: '#F0F0F0' }}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[8.5px] font-mono uppercase font-black" style={{ color: '#9CA3AF' }}>Active coping cards ({cards.length})</span>
                <button
                  type="button" onClick={downloadCardsPdf}
                  className="px-2.5 py-1.5 text-[9px] font-mono font-black uppercase rounded-lg flex items-center gap-1 cursor-pointer shrink-0 border"
                  style={{ borderColor: '#F0F0F0', color: '#6B7280' }}
                >
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
              {/* The card shelf — each coping card is a carry-able glass chip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cards.map((card, i) => {
                  const PALETTE = ['#F43F5E', '#3ECFCF', '#f59e0b', '#8B5CF6', '#7FD98C'];
                  const c = PALETTE[i % PALETTE.length];
                  return (
                    <div key={card.id} className="relative p-3.5 rounded-2xl space-y-1 overflow-hidden" style={{
                      background: `linear-gradient(140deg, ${c}14, ${c}26), rgba(255,255,255,0.85)`,
                      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                      border: `1.5px solid ${c}44`,
                      boxShadow: `0 6px 16px ${c}30, inset 0 1px 0 rgba(255,255,255,0.8)`,
                    }}>
                      <span aria-hidden className="absolute -top-1 -left-0.5 text-4xl font-serif select-none" style={{ color: `${c}2A` }}>"</span>
                      <button
                        type="button" onClick={() => remove(card.id)}
                        aria-label={`Delete card ${card.title}`}
                        className="absolute top-1.5 right-2 font-bold text-sm"
                        style={{ color: `${c}88` }}
                      >×</button>
                      <h5 className="text-[11px] font-black leading-tight pr-4 relative" style={{ color: c }}>{card.title}</h5>
                      <p className="text-[10.5px] leading-relaxed font-semibold relative" style={{ color: '#4B5563' }}>"{card.message}"</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
