import React, { useState } from 'react';
import { ArrowLeft, Users, VolumeX, Volume2, RotateCcw, Shield, Zap, Heart } from 'lucide-react';
import { THE_SEVEN, readCrew, claimSlot, setActiveCastaway, activeCastaway } from '../lib/castaways';
import { loadCartridge } from '../lib/cartridge';

// ═════════════════════════════════════════════════════════════════════════════
//  THE SHIP'S FITTINGS — settings with only REAL switches.
//
//  The scaffold's screen was fake theater wall to wall: a "SYNCHRONIZATION
//  ENGINE · ONLINE" with an invented firestore socket, "3 Devices Linked", a
//  "Therapist Live Portal Access" toggle wired to nothing, the ghost Miller
//  family, and a dead family code. All of it violated the honest-data law and
//  two of it violated worse (fake sync = fake safety; fake therapist telemetry
//  = fake surveillance). This screen holds exactly what is true: the crew
//  roster (real), the quiet toggle (real — shoreSounds reads it), the
//  cartridge slot (real), the sandbox truth, and the boarding reset (real).
//  Multi-device Gatherings arrive with the v2 transport — and will say so
//  HERE, honestly, when they do.
// ═════════════════════════════════════════════════════════════════════════════

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [, force] = useState(0);
  const [claimingSlot, setClaimingSlot] = useState<string | null>(null);
  const [claimName, setClaimName] = useState('');
  const [quiet, setQuiet] = useState<boolean>(() => {
    try { return localStorage.getItem('driftwood_quiet_v1') === '1'; } catch { return false; }
  });
  const crew = readCrew();
  const me = activeCastaway();
  const cart = loadCartridge();

  const toggleQuiet = () => {
    const next = !quiet;
    setQuiet(next);
    try { localStorage.setItem('driftwood_quiet_v1', next ? '1' : '0'); } catch { /* ignore */ }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} aria-label="Back"
          className="w-9 h-9 rounded-full bg-slate-100 border border-outline-variant hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <div>
          <h2 className="font-display font-black text-base text-on-surface">The Ship's Fittings</h2>
          <p className="text-[10px] text-on-surface-variant">only real switches — nothing here pretends</p>
        </div>
      </div>

      {/* THE CREW ROSTER — real claims, honest AI hands */}
      <section className="bg-white rounded-[2rem] border-2 border-outline-variant p-4">
        <h3 className="font-display font-black text-xs text-on-surface flex items-center gap-1.5 mb-2">
          <Users className="w-3.5 h-3.5 text-primary" /> The Crew
        </h3>
        <div className="flex flex-col gap-1.5">
          {THE_SEVEN.map(slot => {
            const claimed = crew.find(c => c.slotId === slot.id);
            const isMe = me.id === slot.id;
            return (
              <div key={slot.id} className={`p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 ${isMe ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-700">
                    {slot.emoji} {claimed ? claimed.name : `${slot.role} (robot hands)`}
                    {isMe && <span className="text-[8px] font-black text-primary uppercase ml-1.5">this device</span>}
                  </p>
                  <p className="text-[9px] text-slate-400">{slot.role}{!claimed && ' — unclaimed; the Jumble keeps its camp honestly'}</p>
                </div>
                {claimed ? (
                  !isMe && (
                    <button onClick={() => { setActiveCastaway(slot.id); force(x => x + 1); }}
                      className="shrink-0 text-[9px] font-black text-primary uppercase px-2 py-1 rounded-lg border border-primary/40 cursor-pointer">
                      Play as
                    </button>
                  )
                ) : claimingSlot === slot.id ? (
                  <span className="flex items-center gap-1 shrink-0">
                    <input value={claimName} onChange={e => setClaimName(e.target.value)} placeholder="name"
                      maxLength={24}
                      className="w-20 px-2 py-1 text-[10px] border-2 border-outline-variant rounded-lg focus:outline-none focus:border-primary" />
                    <button
                      onClick={() => { claimSlot(slot.id, claimName); setClaimingSlot(null); setClaimName(''); force(x => x + 1); }}
                      className="text-[9px] font-black text-white bg-primary px-2 py-1 rounded-lg cursor-pointer">
                      Claim
                    </button>
                  </span>
                ) : (
                  <button onClick={() => setClaimingSlot(slot.id)}
                    className="shrink-0 text-[9px] font-black text-slate-500 uppercase px-2 py-1 rounded-lg border border-outline-variant cursor-pointer">
                    Claim
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-slate-400 italic mt-2">
          Family Gatherings today are pass-the-phone (the phone is the conch). Same-map
          multi-device Gatherings arrive with the bridge transport — this page will say so
          plainly when that is real.
        </p>
      </section>

      {/* THE MODE SWITCH — the boarding's promise, kept (the Bible's law) */}
      <section className="bg-white rounded-[2rem] border-2 border-outline-variant p-4">
        <h3 className="font-display font-black text-xs text-on-surface mb-2">How you begin each day</h3>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'story', label: 'Story Mode', desc: 'the 31 milestones lead', icon: Zap, grad: 'linear-gradient(135deg,#F2683A,#D14545)' },
            { id: 'checkin', label: 'Check-In Mode', desc: 'daily check-in leads', icon: Heart, grad: 'linear-gradient(135deg,#0E7C7C,#2E96B5)' },
          ] as const).map(m => {
            const current = (() => { try { return localStorage.getItem('driftwood_mode') === 'checkin' ? 'checkin' : 'story'; } catch { return 'story'; } })();
            const active = current === m.id;
            const Icon = m.icon;
            return (
              <button key={m.id}
                onClick={() => { try { localStorage.setItem('driftwood_mode', m.id); } catch { /* session */ } force(x => x + 1); }}
                className={`text-left rounded-2xl p-3 border-2 transition-all cursor-pointer ${active ? 'border-transparent text-white' : 'border-outline-variant bg-slate-50 text-slate-600'}`}
                style={active ? { background: m.grad } : undefined}>
                <Icon className={`w-4 h-4 mb-1 ${active ? 'text-white' : 'text-slate-400'}`} />
                <p className="text-[11px] font-black leading-tight">{m.label}</p>
                <p className={`text-[8.5px] mt-0.5 ${active ? 'text-white/80' : 'text-slate-400'}`}>{m.desc}</p>
              </button>
            );
          })}
        </div>
        <p className="text-[9px] text-slate-400 italic mt-2">Either mode keeps every tool open — this only picks which room greets you.</p>
      </section>

      {/* THE QUIET TOGGLE — real (shoreSounds reads it) */}
      <section className="bg-white rounded-[2rem] border-2 border-outline-variant p-4 flex items-center justify-between">
        <div>
          <h3 className="font-display font-black text-xs text-on-surface flex items-center gap-1.5">
            {quiet ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-primary" />}
            The quiet shore
          </h3>
          <p className="text-[9px] text-slate-400 mt-0.5">silences the bell, the creak, and the ember pop — never hides a tool or a safety line</p>
        </div>
        <button onClick={toggleQuiet}
          className={`shrink-0 w-12 h-7 rounded-full border-2 transition-colors cursor-pointer relative ${quiet ? 'bg-slate-200 border-slate-300' : 'bg-primary/20 border-primary'}`}
          role="switch" aria-checked={!quiet} aria-label="Shore sounds">
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 shadow transition-all ${quiet ? 'left-0.5' : 'left-[22px]'}`} />
        </button>
      </section>

      {/* THE CARTRIDGE SLOT — real state */}
      <section className="bg-white rounded-[2rem] border-2 border-outline-variant p-4">
        <h3 className="font-display font-black text-xs text-on-surface mb-1">🧠 The Practice Cartridge</h3>
        <p className="text-[11px] font-bold text-slate-600">{cart.practiceName}{cart.id === 'house-family-curriculum' ? ' (the default)' : ''}</p>
        <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
          {cart.authorNote} A therapist's own cartridge arrives through the companion bridge in a
          future build; the base layer never varies — no cartridge touches the crisis lines, the
          private boarding page, or plays a real person.
        </p>
      </section>

      {/* THE HONEST POSTURE + the boarding reset */}
      <section className="bg-white rounded-[2rem] border-2 border-outline-variant p-4">
        <h3 className="font-display font-black text-xs text-on-surface flex items-center gap-1.5 mb-1">
          <Shield className="w-3.5 h-3.5 text-secondary" /> Where your entries live
        </h3>
        <p className="text-[9px] text-slate-400 leading-relaxed">
          On this device, and only here — no accounts, no recordings, no cloud copies, no
          analytics. Practice alongside real care, never a replacement. The crisis lines at the
          top of every screen never need a login and never will.
        </p>
        <button
          onClick={() => {
            try { localStorage.removeItem('driftwood_boarded_v1'); } catch { /* ignore */ }
            window.location.reload();
          }}
          className="mt-3 w-full py-2 rounded-xl border-2 border-outline-variant text-[10px] font-black text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3 h-3" /> Run the boarding again (incl. the private page)
        </button>
      </section>
    </div>
  );
}
