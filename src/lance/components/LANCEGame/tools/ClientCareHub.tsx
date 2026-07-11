import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, FileText, Download } from 'lucide-react';
import { useGame } from '../LANCEGameContext';
import BigBackButton from '../BigBackButton';
import { exportWorksheetPdf } from '../../../utils/exportWorksheetPdf';

const CHECK_LABELS: Record<string, string> = {
  sleepFragmented: 'Fragmented Sleep',
  panicSpikes: 'Panic Spikes',
  anhedonia: 'Emotional Numbness',
  boundaryIssues: 'Boundary Fragility',
  cravingWaves: 'Craving Waves',
  metabolicFatigue: 'Metabolic Fatigue',
};

const STORAGE_KEY = 'lance_client_care_hub_v1';

interface SavedState {
  checks: Record<string, boolean>;
  homework: string;
}

function load(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    checks: { sleepFragmented: false, panicSpikes: false, anhedonia: false, boundaryIssues: false, cravingWaves: false, metabolicFatigue: false },
    homework: 'Focus on 5 minutes of coherent breathwork twice daily, and log 3 gratitude micro-successes.',
  };
}

interface Props { onBack: () => void; }

export default function ClientCareHub({ onBack }: Props) {
  const { userName, completedChallenges, addXp } = useGame();
  const saved = load();
  const [checks, setChecks] = useState<Record<string, boolean>>(saved.checks);
  const [homework, setHomework] = useState(saved.homework);
  const [copied, setCopied] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ checks, homework })); }, [checks, homework]);

  const summary = `===========================================
WELLNESS CLINICAL SUMMARY CLIPBOARD
Client Name: ${userName || 'Client'}
Challenges Completed: ${completedChallenges.length}
===========================================
RECENT SELF-REPORTED WELLNESS CHECKS:
${Object.entries(CHECK_LABELS).map(([key, label]) => `- ${label}: ${checks[key] ? 'ACTIVE' : 'STABLE'}`).join('\n')}

CLIENT-DRAFTED SESSION HOMEWORK COMMITS:
"${homework}"`;

  const copy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    addXp(20);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPdf = () => {
    exportWorksheetPdf({
      title: 'Wellness Clinical Summary',
      subtitle: `Client: ${userName || 'Client'} · Challenges completed: ${completedChallenges.length}`,
      sections: [
        {
          label: 'Recent Self-Reported Wellness Checks',
          body: Object.entries(CHECK_LABELS).map(([key, label]) => `${label}: ${checks[key] ? 'ACTIVE' : 'STABLE'}`).join('\n'),
        },
        { label: 'Client-Drafted Session Homework Commits', body: homework },
      ],
    });
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: 'transparent', color: '#3C3C3C' }}>
      <div aria-hidden className="absolute inset-0" style={{
        backgroundImage: 'url(/region-heroes/clinical.webp)',
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
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: '#3C3C3C' }}>Client Care Hub</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Physician cooperative tools</p>
        </div>
        <HelpCircle className="w-5 h-5" style={{ color: '#A78BFA' }} />
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="rounded-3xl p-5 border space-y-4" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0' }}>
          <p className="text-[11px] leading-relaxed font-semibold" style={{ color: '#6B7280' }}>
            Check off what's active right now, jot your session homework, and copy the compiled summary to share with your therapist.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CHECK_LABELS).map(([key, label]) => {
              const value = checks[key];
              return (
                <button
                  key={key} type="button"
                  onClick={() => setChecks(p => ({ ...p, [key]: !value }))}
                  className="p-3 rounded-xl border text-left font-bold text-[10.5px] transition flex items-center justify-between cursor-pointer"
                  style={value ? { background: '#F5F3FF', borderColor: '#C4B5FD', color: '#5B21B6' } : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }}
                >
                  <span className="truncate">{label}</span>
                  <div className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0"
                    style={value ? { background: '#7C3AED', borderColor: '#7C3AED' } : { borderColor: '#C4B5FD' }}>
                    {value && <Check className="w-2.5 h-2.5 stroke-[3.5] text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[8.5px] uppercase font-mono font-black block tracking-wider" style={{ color: '#9CA3AF' }}>Session commits &amp; homework</label>
            <textarea
              value={homework} onChange={(e) => setHomework(e.target.value)} rows={2}
              className="w-full p-3 rounded-xl text-[11px] font-semibold outline-none resize-none leading-relaxed border"
              style={{ background: '#F9FAFB', color: '#3C3C3C', borderColor: '#F0F0F0' }}
            />
          </div>

          <div className="p-4 rounded-2xl border text-left space-y-2.5" style={{ background: '#F9FAFB', borderColor: '#F0F0F0' }}>
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black uppercase tracking-wider font-mono flex items-center gap-1" style={{ color: '#7C3AED' }}>
                <FileText className="w-3 h-3" /> Compiled clinician clipboard
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={downloadPdf}
                  className="p-1 px-2.5 rounded-lg text-[9px] font-black transition cursor-pointer flex items-center gap-1"
                  style={{ background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}
                >
                  <Download className="w-3 h-3" /> PDF
                </button>
                <button
                  onClick={copy}
                  className="p-1 px-2.5 rounded-lg text-[9px] font-black transition cursor-pointer flex items-center gap-1"
                  style={{ background: '#EDE9FE', color: '#5B21B6' }}
                >
                  {copied ? 'Copied! ✅' : 'Copy Text'}
                </button>
              </div>
            </div>
            <pre className="text-[9.5px] font-mono leading-relaxed rounded-lg p-3 max-h-[160px] overflow-y-auto whitespace-pre-wrap border"
              style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: '#F0F0F0', color: '#4B5563' }}>
              {summary}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
