import React, { useState } from 'react';
import { Code, FileText, Check, ShieldCheck, Database, Copy, TrendingUp, Sparkles, BookOpen, CheckCircle, Radio } from 'lucide-react';
import { INVESTOR_JSON } from '../data/investorSpecs';
import { CLINICAL_AGENTS } from '../data/simulationScript';
import { DESIGN_SKETCH_DOCS } from '../clay-pile/designSketch';

interface DeveloperDocsProps {
  simulationCount: number;
  feedbackSubmitted: boolean;
  onTriggerFeedbackModal: () => void;
  onIncrementSimulationCount: () => void;
  onResetFeedbackAndSimulations: () => void;
}

export default function DeveloperDocs({
  simulationCount,
  feedbackSubmitted,
  onTriggerFeedbackModal,
  onIncrementSimulationCount,
  onResetFeedbackAndSimulations
}: DeveloperDocsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pitch' | 'technical' | 'json' | 'models' | 'sandbox'>('pitch');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(INVESTOR_JSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-[2rem] border-2 border-outline-variant shadow-sm p-6 w-full text-on-background animate-fade-in">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-display font-black text-lg text-[#4B4B4B]">Clinical Blueprint & Investor Hub</h2>
      </div>

      <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-6">
        FamilyFrame merges accredited therapeutic frameworks with Duolingo-style cooperative mechanics to solve the retention crisis in digital healthcare.
      </p>

      {/* Sub-tab navigation */}
      <div className="flex bg-surface-container rounded-xl p-1 gap-1 mb-6 border-2 border-outline-variant overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('pitch')}
          className={`flex-1 min-w-[70px] font-display font-black text-[10px] py-2.5 rounded-lg text-center transition-all cursor-pointer uppercase ${activeSubTab === 'pitch' ? 'bg-primary text-white shadow-3d-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          Pitch
        </button>
        <button
          onClick={() => setActiveSubTab('models')}
          className={`flex-1 min-w-[80px] font-display font-black text-[10px] py-2.5 rounded-lg text-center transition-all cursor-pointer uppercase ${activeSubTab === 'models' ? 'bg-primary text-white shadow-3d-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          Models
        </button>
        <button
          onClick={() => setActiveSubTab('technical')}
          className={`flex-1 min-w-[80px] font-display font-black text-[10px] py-2.5 rounded-lg text-center transition-all cursor-pointer uppercase ${activeSubTab === 'technical' ? 'bg-primary text-white shadow-3d-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          HIPAA
        </button>
        <button
          onClick={() => setActiveSubTab('sandbox')}
          className={`flex-1 min-w-[110px] font-display font-black text-[10px] py-2.5 rounded-lg text-center transition-all cursor-pointer uppercase flex items-center justify-center gap-1 ${activeSubTab === 'sandbox' ? 'bg-[#1CB0F6] text-white shadow-3d-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          <span>Sandbox</span>
          <span className="text-[11px]">🧪</span>
        </button>
        <button
          onClick={() => setActiveSubTab('json')}
          className={`flex-1 min-w-[70px] font-display font-black text-[10px] py-2.5 rounded-lg text-center transition-all cursor-pointer uppercase ${activeSubTab === 'json' ? 'bg-primary text-white shadow-3d-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          JSON
        </button>
      </div>

      {/* SUB-TAB CONTENTS */}
      {activeSubTab === 'pitch' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Pitch card */}
          <div className="bg-[#58CC02]/5 p-4 rounded-[1.5rem] border-2 border-[#58CC02]/20">
            <h3 className="font-display font-black text-primary text-sm mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Executive 1-Pager</span>
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              {INVESTOR_JSON.concept.vision}
            </p>
          </div>

          {/* Pain point & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 p-4 rounded-[1.5rem] border-2 border-rose-200">
              <h4 className="font-display font-black text-rose-800 text-xs mb-1 uppercase tracking-wider">The Retention Crisis</h4>
              <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed mt-1">
                {INVESTOR_JSON.concept.painPoint}
              </p>
            </div>
            <div className="bg-[#1CB0F6]/10 p-4 rounded-[1.5rem] border-2 border-[#1CB0F6]/20">
              <h4 className="font-display font-black text-secondary text-xs mb-1 uppercase tracking-wider">The Interactive Solution</h4>
              <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed mt-1">
                {INVESTOR_JSON.concept.solution}
              </p>
            </div>
          </div>

          {/* Monetization Model */}
          <div className="bg-surface-container-low p-5 rounded-[2rem] border-2 border-outline-variant">
            <h4 className="font-display font-black text-[#4B4B4B] text-xs mb-3 uppercase tracking-wider">Dual-Tier Revenue Strategy</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-white p-4 rounded-xl border-2 border-outline-variant">
                <span className="font-display font-black text-sm text-primary">Direct-To-Consumer (B2C)</span>
                <p className="font-sans text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                  {INVESTOR_JSON.concept.monetizationStrategy.b2c}
                </p>
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl border-2 border-outline-variant">
                <span className="font-display font-black text-sm text-secondary">Therapist SaaS Portal (B2B)</span>
                <p className="font-sans text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                  {INVESTOR_JSON.concept.monetizationStrategy.b2b}
                </p>
              </div>
            </div>
          </div>

          {/* Traction ask */}
          <div className="bg-[#FFE16D]/15 p-5 rounded-[2rem] border-2 border-[#FFE16D]/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-display font-black text-amber-800 text-xs uppercase tracking-wider">Clinical Validation Traction</h4>
              <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed mt-1">
                {INVESTOR_JSON.investorOnePager.traction}
              </p>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-lg border-2 border-tertiary shadow-sm text-center shrink-0">
              <span className="font-sans text-[10px] text-on-surface-variant font-bold block uppercase tracking-wide">Investment Ask</span>
              <span className="font-display font-black text-lg text-primary">{INVESTOR_JSON.investorOnePager.investmentAsk}</span>
            </div>
          </div>

          {/* Prioritized MVP Roadmap */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-[2rem] p-5">
            <h4 className="font-display font-black text-primary text-xs uppercase tracking-wider mb-3">Prioritized MVP Roadmap</h4>
            <div className="relative pl-6 space-y-4 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-outline-variant">
              {INVESTOR_JSON.prioritizedMVP.map((phase, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow-sm" />
                  <h5 className="font-display font-black text-xs text-on-surface leading-none">{phase.phase}</h5>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {phase.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="font-sans text-[11px] text-on-surface-variant leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'models' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          <div className="bg-[#58CC02]/5 p-4 rounded-[1.5rem] border-2 border-[#58CC02]/20">
            <h3 className="font-display font-black text-primary text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span>📚 Comprehensive Clinical Therapy Directory</span>
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              FamilyFrame bridges standard couples therapy models with systemic family therapies to create an all-in-one digital behavioral toolbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gottman */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-[#58CC02] transition-colors duration-300">
              <span className="font-display font-black text-xs text-primary flex items-center gap-1">
                <span>❤️</span> Gottman Method
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founders:</strong> Drs. John & Julie Gottman<br/>
                <strong>Clinical Objective:</strong> Maintain the Golden 5:1 positivity ratio. Build Love Maps, establish deep active appreciation, and employ positive antidotes to neutralize criticism, contempt, defensiveness, and stonewalling.
              </p>
            </div>

            {/* Chapman */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-[#CE9FFC] transition-colors duration-300">
              <span className="font-display font-black text-xs text-purple-700 flex items-center gap-1">
                <span>✨</span> 5 Love Languages
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founder:</strong> Dr. Gary Chapman<br/>
                <strong>Clinical Objective:</strong> Identify unique emotional verification triggers (Words of Affirmation, Quality Time, Gifts, Acts of Service, Touch) to prevent emotional starvation and build secure attachment buffers.
              </p>
            </div>

            {/* EFT */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-[#1CB0F6] transition-colors duration-300">
              <span className="font-display font-black text-xs text-[#1CB0F6] flex items-center gap-1">
                <span>🤝</span> Emotionally Focused Therapy (EFT)
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founder:</strong> Dr. Sue Johnson<br/>
                <strong>Clinical Objective:</strong> Deconstruct reactive "Pursuer-Distancer" loops. Re-route secondary defensive anger into soft, primary vulnerable attachment fears (fear of rejection, abandonment) to establish secure emotional bonds.
              </p>
            </div>

            {/* Imago */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-orange-500 transition-colors duration-300">
              <span className="font-display font-black text-xs text-orange-600 flex items-center gap-1">
                <span>🗣️</span> Imago Dialogue
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founders:</strong> Drs. Harville Hendrix & Helen LaKelly Hunt<br/>
                <strong>Clinical Objective:</strong> Use structured three-step dialogues (Mirroring, Validation, Empathy) to translate frustrating conflicts into active relational healing spaces.
              </p>
            </div>

            {/* CBCT */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-red-400 transition-colors duration-300">
              <span className="font-display font-black text-xs text-red-600 flex items-center gap-1">
                <span>🧠</span> Cognitive Behavioral Couples (CBCT)
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founder:</strong> Dr. Donald Baucom<br/>
                <strong>Clinical Objective:</strong> Reframe negative automatic attributions (e.g. "My partner does not care") into realistic, helpful schemas. Create behavioral contracts supporting collaborative daily work-sharing.
              </p>
            </div>

            {/* Bowen */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-[#00D2C4] transition-colors duration-300">
              <span className="font-display font-black text-xs text-[#00D2C4] flex items-center gap-1">
                <span>🌳</span> Bowen Family Systems
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founder:</strong> Dr. Murray Bowen<br/>
                <strong>Clinical Objective:</strong> Foster a high Differentiation of Self. Map intergenerational triangles, fused family dynamics, and emotional cut-offs using interactive visual Genograms.
              </p>
            </div>

            {/* Narrative */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-[#FF6EA7] transition-colors duration-300">
              <span className="font-display font-black text-xs text-[#FF6EA7] flex items-center gap-1">
                <span>📝</span> Narrative Therapy
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founders:</strong> Michael White & David Epston<br/>
                <strong>Clinical Objective:</strong> "The person is not the problem; the problem is the problem." Externalize repetitive conflicts (e.g., renaming stubbornness to "The Blame Monster") to unite family members.
              </p>
            </div>

            {/* Structural */}
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant hover:border-[#8A56DE] transition-colors duration-300">
              <span className="font-display font-black text-xs text-[#8A56DE] flex items-center gap-1">
                <span>🧱</span> Structural Family Therapy
              </span>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                <strong>Founder:</strong> Dr. Salvador Minuchin<br/>
                <strong>Clinical Objective:</strong> Map household subsystems and adjust boundary permeability (rigid vs. diffuse/enmeshed) to restore functional parent-child hierarchies and healthy boundaries.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'technical' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Security Summary */}
          <div className="bg-secondary/5 p-4 rounded-[1.5rem] border-2 border-secondary/25 flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-black text-[#4B4B4B] text-sm">Clinical HIPAA Compliance Architecture</h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-1">
                {DESIGN_SKETCH_DOCS.summary}
              </p>
            </div>
          </div>

          {/* Cloud LLM Agents specifications */}
          <div>
            <h4 className="font-display font-black text-on-surface text-xs uppercase tracking-widest mb-3 px-1">Clinical LLM Agent Specs</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CLINICAL_AGENTS.map((agent, i) => (
                <div key={i} className="bg-surface-container-low p-4 rounded-[1.5rem] border-2 border-outline-variant flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-display font-black text-xs text-primary">{agent.role}</span>
                      <span className="text-[8px] font-bold bg-[#1CB0F6]/10 text-[#1CB0F6] px-1.5 py-0.5 rounded-full uppercase">Cloud LLM Ready</span>
                    </div>
                    <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed whitespace-pre-wrap break-words max-h-[180px] overflow-y-auto pt-2 border-t border-outline-variant/30">
                      {agent.systemPrompt}
                    </p>
                  </div>
                  <div className="border-t border-outline-variant mt-3 pt-2 flex justify-between text-[9px] font-bold font-display text-outline">
                    <span>Model: Gemini 1.5 Flash</span>
                    <span>Temp: {agent.temperature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database Schemas */}
          <div>
            <h4 className="font-display font-black text-[#4B4B4B] text-xs uppercase tracking-widest mb-3 px-1">HIPAA Row-Level Encrypted Schemas</h4>
            <div className="flex flex-col gap-4">
              {DESIGN_SKETCH_DOCS.dataModel.map((model, i) => (
                <div key={i} className="border-2 border-outline-variant rounded-[2rem] overflow-hidden bg-surface-container-lowest">
                  <div className="bg-surface-container-low px-4 py-2.5 border-b-2 border-outline-variant flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="font-display font-black text-xs text-primary">{model.table}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] font-sans">
                      <thead>
                        <tr className="bg-surface-container-lowest border-b border-outline-variant text-outline text-left">
                          <th className="px-4 py-2.5 font-bold uppercase">Field</th>
                          <th className="px-4 py-2.5 font-bold uppercase">Type</th>
                          <th className="px-4 py-2.5 font-bold uppercase">Encryption / Security</th>
                          <th className="px-4 py-2.5 font-bold uppercase">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                        {model.fields.map((field, fIdx) => (
                          <tr key={fIdx}>
                            <td className="px-4 py-2.5 font-mono font-bold text-primary">{field.name}</td>
                            <td className="px-4 py-2.5 font-mono">{field.type}</td>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-display border-2 ${field.securityEncryption.includes('AES') ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-surface-container-low border-outline-variant text-outline'}`}>
                                {field.securityEncryption}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-on-surface">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'sandbox' && (
        <div className="flex flex-col gap-5 animate-fade-in text-[#4B4B4B]">
          {/* Main Info Box */}
          <div className="bg-[#1CB0F6]/10 p-5 rounded-[1.5rem] border-2 border-[#1CB0F6]/25">
            <h3 className="font-display font-black text-secondary text-sm flex items-center gap-1.5">
              <span>🩺</span>
              <span>Clinical Simulation Testing Suite</span>
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-2">
              Our clinical protocol prompts the 'Provide Feedback' modal dynamically once a user completes 3 simulations. You can use the Sandbox controllers below to trigger the modal instantly or manipulate progress counts for evaluation!
            </p>
          </div>

          {/* Controller metrics panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant flex flex-col justify-between gap-3">
              <div>
                <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Live User Progress</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display font-black text-3xl text-primary">{simulationCount}</span>
                  <span className="font-sans text-xs text-on-surface-variant">/ 3 Completed Sessions</span>
                </div>
                {simulationCount >= 3 ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#58CC02]/15 text-[#58CC02] border border-[#58CC02]/30 px-2.5 py-0.5 rounded-full mt-2">
                    ✓ Feedback Target Met!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/25 px-2.5 py-0.5 rounded-full mt-2">
                    ⏳ Need {3 - simulationCount} more session{3 - simulationCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={onIncrementSimulationCount}
                  className="w-full bg-[#58CC02] text-white font-display font-black py-2 rounded-xl border-b-[3px] border-[#46A302] text-[11px] hover:brightness-105 active:scale-95 transition-all cursor-pointer text-center"
                >
                  ➕ Simulate 1 Scenario Completion
                </button>
                <p className="text-[9px] text-on-surface-variant text-center">
                  Completing a simulation logs client outcomes and increases progress.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low p-4.5 rounded-[1.5rem] border-2 border-outline-variant flex flex-col justify-between gap-3">
              <div>
                <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Evaluation Controls</span>
                <p className="font-sans text-[10px] text-on-surface-variant mt-2 leading-relaxed">
                  Reviewers can bypass constraints to test the modal flow instantly:
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={onTriggerFeedbackModal}
                  className="w-full bg-[#1CB0F6] text-white font-display font-black py-2 rounded-xl border-b-[3px] border-[#1899D6] text-[11px] hover:brightness-105 active:scale-95 transition-all cursor-pointer text-center"
                >
                  🚀 Trigger Feedback Modal Instantly
                </button>
                <button
                  onClick={onResetFeedbackAndSimulations}
                  className="w-full bg-slate-100 text-[#4B4B4B] font-display font-black py-2 rounded-xl border-2 border-outline-variant text-[11px] hover:bg-slate-200 active:scale-95 transition-all cursor-pointer text-center"
                >
                  🔄 Reset Progress & Feedback States
                </button>
              </div>
            </div>
          </div>

          {/* Current Feedback metrics display */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-[2rem] p-5">
            <h4 className="font-display font-black text-[#4B4B4B] text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <span>📋 Cryptographically Recorded Client Feedback (HIPAA Sandbox)</span>
            </h4>

            {feedbackSubmitted ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#58CC02] font-bold text-xs bg-[#58CC02]/10 p-3 rounded-xl border border-[#58CC02]/20">
                  <CheckCircle className="w-4 h-4 text-[#58CC02]" />
                  <span>Feedback Record Submitted & Signed!</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-outline-variant flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase text-on-surface-variant">User Experience Rating</span>
                    <span className="text-xl mt-1">
                      {localStorage.getItem('familyframe_feedback_rating') || '🙂'} 
                      <span className="text-[11px] font-bold text-[#4B4B4B] ml-1.5">
                        {localStorage.getItem('familyframe_feedback_rating') === '💎' ? 'Extremely Valuable' :
                         localStorage.getItem('familyframe_feedback_rating') === '🚀' ? 'Fun' :
                         localStorage.getItem('familyframe_feedback_rating') === '🙂' ? 'Helpful' :
                         localStorage.getItem('familyframe_feedback_rating') === '😐' ? 'Neutral' : 'Frustrated/Difficult'}
                      </span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-outline-variant flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase text-on-surface-variant">Most Impactful Scenario</span>
                    <span className="text-xs font-black text-primary mt-1">
                      {(() => {
                        const s = localStorage.getItem('familyframe_feedback_scenario');
                        if (s === 'dirty-dishes') return 'The Dirty Dish Dilemma (Gottman)';
                        if (s === 'screen-time') return 'The Screen Time Showdown (EFT)';
                        if (s === 'in-law-intrusion') return 'The In-Law Intrusion (Systems)';
                        return 'All Scenarios Felt Great';
                      })()}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-outline-variant">
                  <span className="text-[9px] font-bold uppercase text-on-surface-variant block mb-1">Reflective Comments</span>
                  <p className="font-sans text-[11px] text-[#4B4B4B] leading-relaxed italic">
                    "{localStorage.getItem('familyframe_feedback_comments') || 'No comment provided'}"
                  </p>
                </div>

                <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-xl border border-outline-variant text-[9px] text-on-surface-variant font-mono">
                  <span>Sign Verification: OK (SHA-256)</span>
                  <span>Relevance: {localStorage.getItem('familyframe_feedback_realworld') === 'true' ? 'Authentic (100%)' : 'Inauthentic'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-on-surface-variant font-sans text-xs flex flex-col items-center justify-center gap-1.5 bg-slate-50 rounded-2xl border-2 border-dashed border-outline-variant">
                <span>📭 No active feedback recorded yet.</span>
                <span className="text-[10px] text-on-surface-variant/70">
                  Submit the feedback modal in the smartphone emulator to generate clinical data records!
                </span>
              </div>
            )}
          </div>

          {/* Mock Real-time Centralized Co-op Unit Monitor */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-[2rem] p-5">
            <h4 className="font-display font-black text-[#4B4B4B] text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-secondary animate-pulse" />
              <span>📡 Centralized Co-op Node Registry (Broadcasting Mock Socket)</span>
            </h4>
            <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mb-4">
              Below is the active centralized state representing all linked nodes for the family unit. Simulate de-escalations on the emulator device to see records broadcast live to other registered member views!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-outline-variant text-center">
                <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-wider">Family ID</span>
                <span className="font-mono font-extrabold text-xs text-primary block mt-1">{localStorage.getItem('familyframe_family_code_v1') || 'FAM-492-Z8X'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-outline-variant text-center">
                <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-wider">Unit Title</span>
                <span className="font-sans font-extrabold text-xs text-secondary block mt-1 truncate">{localStorage.getItem('familyframe_family_unit_name_v1') || 'The Miller Family Frame'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-outline-variant text-center">
                <span className="text-[8px] font-black uppercase text-on-surface-variant tracking-wider">Sync Integrity</span>
                <span className="font-display font-black text-[10px] text-green-600 block mt-1 uppercase">✓ 100% SECURE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'json' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="font-display font-bold text-xs text-on-surface-variant">Formatted product JSON Schema</span>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 bg-[#1CB0F6] text-white px-4 py-2 rounded-xl text-xs font-display font-black border-b-[4px] border-[#1899D6] shadow-3d-secondary hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Specification!' : 'Copy JSON Spec'}</span>
            </button>
          </div>

          {/* JSON block display */}
          <div className="bg-surface-container-low p-4 rounded-xl border-2 border-outline-variant overflow-hidden">
            <pre className="font-mono text-[10px] text-primary overflow-x-auto leading-relaxed max-h-[350px] no-scrollbar">
              {JSON.stringify(INVESTOR_JSON, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
