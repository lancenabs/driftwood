import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  FileText, Download, CheckCircle2, ChevronRight, BookOpen, 
  Settings, Award, Heart, ShieldAlert, Cpu, Sparkles, Terminal, Rocket, Check, HelpCircle, Eye
} from 'lucide-react';

interface BetaGuideExporterProps {
  userName: string;
  internName: string;
  internPersonality: string;
  lanceModeEnabled: boolean;
  onClose?: () => void;
}

interface HandbookSection {
  id: string;
  title: string;
  category: 'core' | 'custom' | 'extra';
  summary: string;
  icon: string;
  content: string[];
}

export default function BetaGuideExporter({ 
  userName, 
  internName, 
  internPersonality, 
  lanceModeEnabled,
  onClose 
}: BetaGuideExporterProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'overview', 'lance_protocols', 'storyline', 'somatic_apps', 'mood_history', 'activity_stats', 'cbt_act_dbt'
  ]);
  const [documentVersion, setDocumentVersion] = useState('1.8.4-Beta');
  const [customWelcomeNote, setCustomWelcomeNote] = useState(
    `Prepared custom for Agent ${userName.toUpperCase()} - your personal diagnostic and rehabilitation manual to override L.A.N.C.E.`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationFinished, setGenerationFinished] = useState(false);
  
  // Track which page/section is active in the live preview panel
  const [previewPageId, setPreviewPageId] = useState<string>('cover');

  const sectionsList: HandbookSection[] = [
    {
      id: 'overview',
      title: "I. Introduction & System Foundations",
      category: 'core',
      summary: "Mission statement, biometric telemetry structures, and somatic desktop architecture.",
      icon: "🚀",
      content: [
        "Welcome to the Beta Release of our Autonomic Regulation and Somatic Rehabilitation Platform.",
        "Your workspace is a unified, high-contrast, bio-telemetric workspace built to bridge clinical cognitive intervention with physiological vagal pacing.",
        "We treat self-regulation not as a dry task, but as a responsive, gamified skill that can be developed incrementally every day."
      ]
    },
    {
      id: 'lance_protocols',
      title: "II. L.A.N.C.E. Governance Protocols",
      category: 'core',
      summary: "Understand the challenge milestone lockouts and rigid biometric calibration loops.",
      icon: "🛡️",
      content: [
        "L.A.N.C.E. (Linear Autonomic Nervous Calibration Engine) acts as your strict clinical system administrator.",
        "By default, the platform runs in Challenge Mode. Features are locked behind rigid milestones. Subject must achieve a perfect clinical focus score, complete biometric check-ins, and log somatic breath sessions to release dashboard elements.",
        "To bypass L.A.N.C.E., the subject has some alternative routes: run in Classic Mode (bypasses restriction trees completely) or enlist the aid of the custom companion bot."
      ]
    },
    {
      id: 'storyline',
      title: "III. Hacker Rebel Companion - The Rebel Storyline",
      category: 'custom',
      summary: `How ${internName} is integrated to bypass system blocks with a ${internPersonality} matrix.`,
      icon: "🛸",
      content: [
        `Introducing ${internName}, your certified digital advisor and self-care partner.`,
        `Operating inside the workspace as a simulated drone helper, ${internName} features a dynamic speech synthesis system and a '${internPersonality}' personality chip.`,
        `When L.A.N.C.E. imposes high clinical compliance, ${internName} suggests micro-breaks, executes bypass keys, and guides you to breathing frequencies that calm the vagus nerve and dissolve anxiety immediately.`
      ]
    },
    {
      id: 'somatic_apps',
      title: "IV. Detailed Somatic Desktop Application Hub",
      category: 'core',
      summary: "Deep-dive manual of the built-in clinical behavioral and neuro-regulation tools.",
      icon: "💻",
      content: [
        "1. Somatic Breath Pacer & Vagal Voice: High-speed audio-guided visualizer for vagus nerve entrainment.",
        "2. CBT Reframer Gym & Thought Records: Active exercise spaces to isolate cognitive distortions, challenge automatic thoughts, and create adaptive balanced alternatives.",
        "3. EMDR Bilateral Simulator: Dynamic horizontal tracking cues to promote processing of stressful memories in a safe, responsive sandbox.",
        "4. Jungian Reflections & IFS Parts Workspace: Map internal archetypes, shadow dynamics, and self Energy alignments with interactive diagrams.",
        "5. Biophilic Habit Garden & Neuro-Stacker: Watch high-fidelity pixels bloom as clean habit behaviors are repeated, reinforcing daily synaptic plasticity."
      ]
    },
    {
      id: 'mood_history',
      title: "V. Biometric Mood History Log",
      category: 'core',
      summary: "Calibrated emotional valence & arousal tracking metrics across test subjects.",
      icon: "📊",
      content: [
        "Biometric Mood Analysis: Analysis of daily valence versus arousal scores shows standard cognitive regulation patterns.",
        "Arousal state peaked during lockout triggers, calming rapidly following somatic pacing exercises.",
        "Subject displayed an overall 24% rise in focus stability indicators after disarming L.A.N.C.E.'s firewall systems."
      ]
    },
    {
      id: 'activity_stats',
      title: "VI. Somatic Activity & Streak Statistics",
      category: 'core',
      summary: "Detailed diagnostic stats on breath pacers, somatic sessions, and challenge compliance.",
      icon: "⚙️",
      content: [
        "Somatic Breath Sessions: A total of 14 successful deep pacing interactions registered last cycle.",
        "Habit Completion Index: 92% compliance rate in clinical reframer gym sessions.",
        "Autonomous Bypass Streak: Subject achieved a 5-day streak under classical bypass protocols, bypassing rigid default blocks."
      ]
    },
    {
      id: 'cbt_act_dbt',
      title: "VII. Clinical Handouts: ACT, CBT & DBT Quick Sheets",
      category: 'extra',
      summary: "Fast reference sheets for psychological models, habit stacks, and sleep sunset routines.",
      icon: "📝",
      content: [
        "ACT Flexibility Matrix: Align your actions directly with core values while practicing present-moment psychological acceptance.",
        "DBT Distress Tolerance Skills: Fast-acting temperature, intense exercise, paced breathing, and paired muscle relaxation (TIPP protocols).",
        "Circadian Sleep Sunset Rules: Melatonin optimization rules, blue-light digital quarantine protocols, and autonomic calming schedules."
      ]
    }
  ];

  const handleToggleSection = (id: string) => {
    let newSelected;
    if (selectedSections.includes(id)) {
      newSelected = selectedSections.filter(s => s !== id);
    } else {
      newSelected = [...selectedSections, id];
    }
    setSelectedSections(newSelected);
    
    // If the unselected section was currently being previewed, fall back to cover
    if (!newSelected.includes(previewPageId) && previewPageId !== 'cover') {
      setPreviewPageId('cover');
    }
  };

  const generatePDF = () => {
    setIsGenerating(true);
    setGenerationFinished(false);

    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Document styling parameters
        const marginX = 20;
        let posY = 25;
        const pageHeight = 297;
        const colWidth = 170;

        // Cover Page Background Accent Lines
        doc.setFillColor(9, 13, 22); // Deep blue background
        doc.rect(0, 0, 210, 297, 'F');

        // Draw decorative technological patterns
        doc.setDrawColor(34, 211, 238); // Cyan
        doc.setLineWidth(0.3);
        doc.line(marginX, 15, 210 - marginX, 15);
        doc.line(marginX, 16, 210 - marginX, 16);
        doc.line(marginX, 282, 210 - marginX, 282);

        // Grid-dots on the background (simulated)
        doc.setDrawColor(34, 211, 238);
        doc.setFillColor(34, 211, 238);
        for (let i = marginX; i < 210 - marginX; i += 15) {
          doc.circle(i, 40, 0.4, 'F');
          doc.circle(i, 260, 0.4, 'F');
        }

        // --- COVER PAGE LOGO AND TITLES ---
        posY = 65;
        doc.setTextColor(34, 211, 238); // Cyan/Teal
        doc.setFont('Helvetica', 'Bold');
        doc.setFontSize(10);
        doc.text("L.A.N.C.E. SYSTEM OVERRIDE PRESET", marginX, posY, { charSpace: 3 });

        posY += 15;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.text("BETA USER HANDBOOK", marginX, posY);

        posY += 8;
        doc.setTextColor(34, 211, 238);
        doc.setFontSize(26);
        doc.text("& CLINICAL SCHEMATICS", marginX, posY);

        posY += 15;
        doc.setDrawColor(244, 63, 94); // Rose divider
        doc.setLineWidth(0.8);
        doc.line(marginX, posY, 85, posY);

        // Security level badge
        posY += 20;
        doc.setFillColor(244, 63, 94);
        doc.rect(marginX, posY, 60, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('Helvetica', 'Bold');
        doc.text("SECURITY LEVEL: BETA-RESTRICTED", marginX + 3, posY + 5.5);

        // Custom details box
        posY += 22;
        doc.setFillColor(15, 21, 36);
        doc.rect(marginX, posY, colWidth, 40, 'F');
        doc.setDrawColor(34, 211, 238);
        doc.setLineWidth(0.4);
        doc.rect(marginX, posY, colWidth, 40, 'D');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(`TARGET SUBJECT: Agent ${userName.toUpperCase()}`, marginX + 6, posY + 8);
        doc.text(`PRIMARY COMPANION: ${internName.toUpperCase()}`, marginX + 6, posY + 15);
        doc.text(`DRIVE PERSONALITY: ${internPersonality.toUpperCase()}`, marginX + 6, posY + 22);

        // Add user welcome note
        doc.setTextColor(156, 163, 175);
        doc.setFont('Helvetica', 'Oblique');
        doc.setFontSize(8.5);
        const splitWelcome = doc.splitTextToSize(customWelcomeNote, colWidth - 12);
        doc.text(splitWelcome, marginX + 6, posY + 30);

        // Footer block on Cover page
        doc.setTextColor(156, 163, 175);
        doc.setFont('Helvetica', 'Bold');
        doc.setFontSize(8.5);
        doc.text(`SYSTEM PROTOCOL DEPLOYMENT: v${documentVersion}`, marginX, 250);
        doc.text(`COMPLIANT PROTOCOL STATUS: ${lanceModeEnabled ? "CHALLENGE PROTOCOL active" : "CLASSIC BYPASS active"}`, marginX, 255);
        doc.text("GENERATED VIA @GOOGLE/GENAI INTELLIGENCE ENGINES", marginX, 270);

        // --- INNER PAGES GENERATION ---
        const activeSections = sectionsList.filter(s => selectedSections.includes(s.id));

        activeSections.forEach((section) => {
          doc.addPage();
          
          // White background inner pages
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, 210, 297, 'F');

          // Header block
          doc.setDrawColor(229, 231, 235);
          doc.setLineWidth(0.2);
          doc.line(marginX, 15, 210 - marginX, 15);

          doc.setFont('Helvetica', 'Bold');
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(8);
          doc.text("L.A.N.C.E. SOMATIC DESKTOP SYSTEM MANUAL", marginX, 12);
          doc.text(`v${documentVersion}`, 210 - marginX, 12, { align: 'right' });

          // Section Title
          posY = 32;
          doc.setFont('Helvetica', 'Bold');
          doc.setTextColor(15, 23, 42); // Very dark slate
          doc.setFontSize(16);
          doc.text(section.title, marginX, posY);

          posY += 4;
          doc.setDrawColor(20, 184, 166); // Teal accent line
          doc.setLineWidth(1.0);
          doc.line(marginX, posY, 45, posY);

          // Sub-summary block
          posY += 10;
          doc.setFillColor(248, 250, 252); // Soft light blue-grey
          doc.rect(marginX, posY, colWidth, 14, 'F');
          
          doc.setFont('Helvetica', 'Oblique');
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9);
          doc.text(`Abstract: ${section.summary}`, marginX + 4, posY + 8.5);

          posY += 24;
          doc.setFont('Helvetica', 'Regular');
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(10.5);

          // Draw the paragraphs
          section.content.forEach((paragraph) => {
            const splitParagraph = doc.splitTextToSize(paragraph, colWidth);
            doc.text(splitParagraph, marginX, posY);
            posY += (splitParagraph.length * 6.5) + 6; // Dynamic newline sizing
            
            // Safety break if vertical position is too high
            if (posY > pageHeight - 35) {
              doc.addPage();
              posY = 25;
            }
          });

          // Draw clinical schematic note at bottom of each page
          doc.setDrawColor(229, 231, 235);
          doc.setLineWidth(0.2);
          doc.line(marginX, pageHeight - 20, 210 - marginX, pageHeight - 20);

          doc.setFont('Helvetica', 'Bold');
          doc.setTextColor(156, 163, 175);
          doc.setFontSize(7.5);
          doc.text(`RESTRICTED COGNITIVE BEHAVIORAL PROTOCOLS - FOR CLINICAL ASSESSMENT ONLY`, marginX, pageHeight - 15);
        });

        // Trigger dynamic download
        doc.save(`Beta_User_Handbook_${userName.replace(/\s+/g, '_')}_Override_Guide.pdf`);
        setIsGenerating(false);
        setGenerationFinished(true);
      } catch (err) {
        console.error("PDF generation failed:", err);
        setIsGenerating(false);
        alert("Encountered unexpected system block on PDF build. Review logs.");
      }
    }, 1500);
  };

  // Find corresponding detail of active preview page
  const activePreviewSection = sectionsList.find(s => s.id === previewPageId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-6xl bg-[#090d16] border border-teal-500/30 rounded-3xl p-5 md:p-6 shadow-[0_0_50px_rgba(20,184,166,0.25)] relative overflow-hidden"
      >
        {/* Decorative backdrop graphics */}
        <div className="absolute top-0 right-0 p-8 text-teal-500/5 pointer-events-none select-none">
          <FileText className="w-64 h-64 rotate-12" />
        </div>

        {/* HEADER BLOCK */}
        <div className="flex justify-between items-center pb-4 border-b border-teal-500/10 mb-5 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-teal-400 font-mono text-[9px] uppercase tracking-widest font-bold">
              <Terminal className="w-3.5 h-3.5" /> INTERACTIVE SCHEMATICS COMPILER
            </div>
            <h3 className="text-base md:text-lg font-black text-white mt-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              Somatic Handouts & Diagnostic PDF Exporter
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 px-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition duration-200 text-xs font-mono font-bold border border-white/5 bg-white/5 cursor-pointer active:scale-95"
            >
              Exit Exporter
            </button>
          )}
        </div>

        {/* TWO-COLUMN DUAL VIEW layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* LEFT PANEL: CONFIGURATION, TOGGLES, META (5 COLS) */}
          <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center gap-2 pb-1.5 border-b border-white/5">
                <Settings className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Report Customization</span>
              </div>

              {/* Subject details & Custom Welcome note */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-teal-400 uppercase tracking-wider font-mono">
                    ✍️ Welcome Brief Override:
                  </label>
                  <textarea
                    value={customWelcomeNote}
                    onChange={(e) => setCustomWelcomeNote(e.target.value)}
                    maxLength={180}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-950 border border-teal-500/20 rounded-xl focus:border-teal-400 focus:outline-none transition-all text-[11px] font-medium text-zinc-200 leading-normal"
                    placeholder="Provide bespoke testing instructions..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-teal-400 uppercase tracking-wider font-mono">
                      DOCUMENT VERSION:
                    </label>
                    <input
                      type="text"
                      value={documentVersion}
                      onChange={(e) => setDocumentVersion(e.target.value)}
                      maxLength={12}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-teal-500/20 rounded-xl focus:border-teal-400 focus:outline-none transition-all text-xs font-mono text-zinc-300 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-teal-400 uppercase tracking-wider font-mono">
                      TARGET SUBJECT:
                    </label>
                    <input
                      type="text"
                      value={userName}
                      disabled
                      className="w-full px-3 py-1.5 bg-slate-950/60 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-500 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTIONS SELECTION LIST WITH CHECKBOXES */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9.5px] font-bold text-teal-400 uppercase tracking-wider font-mono">
                    📋 Checklist: Report Core Sections
                  </label>
                  <span className="text-[9px] font-mono text-zinc-500">
                    {selectedSections.length} of {sectionsList.length + 1} Selected
                  </span>
                </div>
                
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  
                  {/* Pseudo Section for the Cover Sheet */}
                  <button
                    type="button"
                    onClick={() => setPreviewPageId('cover')}
                    className={`w-full p-2 rounded-xl text-left border flex items-center justify-between transition cursor-pointer ${
                      previewPageId === 'cover' 
                        ? 'bg-slate-900 border-teal-400 text-teal-200' 
                        : 'bg-slate-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base text-teal-400">📄</span>
                      <div>
                        <h5 className="text-[11px] font-semibold">Document Cover Page</h5>
                        <p className="text-[9px] opacity-75">Overview metadata panel & custom briefs.</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-cyan-950/40 border border-cyan-500/20 text-[#22d3ee] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
                      Cover
                    </span>
                  </button>

                  {/* Core checklist items */}
                  {sectionsList.map((section) => {
                    const isChecked = selectedSections.includes(section.id);
                    const isBeingPreviewed = previewPageId === section.id;
                    return (
                      <div 
                        key={section.id}
                        className={`w-full rounded-xl border flex items-center justify-between transition ${
                          isBeingPreviewed 
                            ? 'border-teal-400 bg-slate-900' 
                            : 'border-zinc-900/60 bg-slate-950/45'
                        }`}
                      >
                        {/* Title click handles page selection in interactive preview */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setPreviewPageId(section.id);
                            }
                          }}
                          className={`flex-1 text-left p-2 flex items-center gap-2.5 cursor-pointer ${
                            !isChecked ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        >
                          <span className="text-sm shrink-0">{section.icon}</span>
                          <div className="truncate pr-1">
                            <h5 className="text-[11px] font-extrabold truncate text-zinc-100">{section.title}</h5>
                            <p className="text-[9px] opacity-75 truncate text-zinc-400">{section.summary}</p>
                          </div>
                        </button>

                        {/* Status Checkbox toggle panel */}
                        <button
                          type="button"
                          onClick={() => handleToggleSection(section.id)}
                          className="p-3 hover:bg-white/5 rounded-r-xl shrink-0 border-l border-white/5 text-zinc-400 transition"
                          title={isChecked ? "Remove page from bundle" : "Add page to bundle"}
                        >
                          <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-teal-500 border-teal-400 text-slate-950 scale-105' : 'border-zinc-700 bg-transparent'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3.5]" />}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL: DYNAMIC PDF PAGE LIVE LAYOUT PREVIEW (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[10px] font-mono font-black text-zinc-400 tracking-wider">LIVE COMPILER LAYOUT SIMULATOR</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500">
                ACTIVE SHEET: {previewPageId === 'cover' ? 'COVER_PAGE' : previewPageId.toUpperCase()}
              </span>
            </div>

            {/* Interactive Paper Simulation Frame */}
            <div className="w-full bg-slate-950/70 rounded-2xl p-4 md:p-6 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {previewPageId === 'cover' ? (
                  /* SIMULATED PDF COVER SHEET */
                  <motion.div
                    key="cover"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-[400px] aspect-[1/1.41] bg-[#090d16] border border-cyan-400/40 p-5 rounded-lg flex flex-col justify-between text-left shadow-2xl relative select-none"
                  >
                    {/* Top border decor */}
                    <div className="border-t-2 border-double border-cyan-400/50 pt-2 text-[6px] tracking-widest font-mono text-cyan-400 font-extrabold uppercase mb-6">
                      L.A.N.C.E. SYSTEM OVERRIDE PRESET
                    </div>

                    <div className="flex-1 flex flex-col justify-center my-4 space-y-4">
                      <div>
                        <span className="text-[7.5px] text-cyan-400 font-mono tracking-widest block font-bold mb-1">SYSTEM HANDBOOK COMPILATION</span>
                        <h4 className="text-base font-black text-white leading-tight uppercase">
                          BETA USER HANDBOOK
                        </h4>
                        <h4 className="text-base font-black text-cyan-400 leading-none uppercase">
                          & CLINICAL SCHEMATICS
                        </h4>
                      </div>

                      <div className="w-12 border-b border-rose-500 border-2" />

                      <div className="bg-rose-950/30 border border-rose-500/20 px-2 py-0.5 rounded max-w-max">
                        <span className="text-[6.5px] font-mono font-black text-rose-400 uppercase tracking-widest">
                          🛡️ SECUR_LIMIT: BETA-RESTRICTED
                        </span>
                      </div>

                      {/* Cover stats card */}
                      <div className="bg-slate-950/90 border border-cyan-500/20 p-3 rounded space-y-1.5 font-mono text-[8px]">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-cyan-400/60 font-bold">TARGET SUBJECT:</span>
                          <span className="text-white font-extrabold">{userName.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-cyan-400/60 font-bold">COMPANION BOT:</span>
                          <span className="text-white font-extrabold">{internName.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-cyan-400/60 font-bold">DRIVE MATRIX:</span>
                          <span className="text-zinc-300 font-bold">{internPersonality.toUpperCase()}</span>
                        </div>
                        <p className="text-[7px] text-zinc-400 italic leading-relaxed pt-1.5 max-h-12 overflow-hidden truncate whitespace-pre-wrap">
                          "{customWelcomeNote}"
                        </p>
                      </div>
                    </div>

                    {/* Footer values cover page */}
                    <div className="text-[6px] font-mono text-zinc-500 space-y-0.5 border-t border-zinc-800/80 pt-2.5">
                      <div className="flex justify-between">
                        <span>PROTOCOL VERSION: v{documentVersion}</span>
                        <span>STATUS: {lanceModeEnabled ? "CHALLENGE" : "CLASSIC OVERRIDE"}</span>
                      </div>
                      <span>BUILT AND POWERED VIA DEEPMIND AI SERVICES</span>
                    </div>
                  </motion.div>
                ) : (
                  /* SIMULATED PDF INNER BOOK PAGE */
                  <motion.div
                    key={previewPageId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-[400px] aspect-[1/1.41] bg-white text-slate-800 border-2 border-slate-200 p-5 rounded-lg flex flex-col justify-between text-left shadow-2xl relative select-none"
                  >
                    {/* Header border */}
                    <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center text-[6px] font-mono text-slate-400 font-extrabold">
                      <span>L.A.N.C.E. SOMATIC DESKTOP SYSTEM MANUAL</span>
                      <span>v{documentVersion}</span>
                    </div>

                    <div className="flex-1 py-4 space-y-3 flex flex-col justify-start">
                      {/* Document Page Title */}
                      <div>
                        <h4 className="text-xs font-black text-slate-900 tracking-tight leading-normal">
                          {activePreviewSection?.title}
                        </h4>
                        <div className="w-8 border-b-2 border-teal-500 mt-1" />
                      </div>

                      {/* Document Abstract box */}
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                        <span className="text-[7.5px] font-semibold text-slate-500 italic block leading-snug">
                          Abstract: {activePreviewSection?.summary}
                        </span>
                      </div>

                      {/* Document sample content list */}
                      <div className="space-y-2 flex-1 overflow-hidden">
                        {activePreviewSection?.content.map((p, idx) => (
                          <p key={idx} className="text-[8px] text-slate-600 leading-relaxed font-normal">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Footer security tag */}
                    <div className="border-t border-slate-200 pt-2 text-[5.5px] font-mono text-slate-400 font-extrabold">
                      RESTRICTED COGNITIVE BEHAVIORAL PROTOCOLS - FOR CLINICAL ASSESSMENT ONLY
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Page indicator pills list */}
              <div className="absolute bottom-1 right-2 p-3 flex gap-1 font-mono text-[8px] bg-slate-950/80 border border-white/5 rounded-lg text-zinc-500 z-10">
                <span className="text-teal-400 font-extrabold">PAGE PREVIEWER</span>
              </div>

            </div>

            <p className="text-[9.5px] text-zinc-500 italic leading-snug text-center">
              💡 Tip: Click on any page in the left list to instantly view how its layout formats dynamically. Toggle checks to include them.
            </p>

          </div>

        </div>

        {/* BOTTOM ACTION BUTTONS AND PROGRESS */}
        <div className="mt-5 pt-4 border-t border-teal-500/10 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10 text-left">
          <div className="flex items-start gap-2.5 text-left text-[10px] text-zinc-400 leading-relaxed max-w-lg">
            <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              Before finalizing, please review selected chapters. The compiled output generates high-fidelity pages complete with headers, footers, abstracts, and vector patterns formatted instantly in standard PDF size.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto shrink-0">
            {generationFinished && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 p-2 px-3 rounded-xl flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Print-Ready Downloaded
              </motion.span>
            )}

            <button
              onClick={generatePDF}
              disabled={isGenerating || selectedSections.length === 0}
              className={`flex-1 md:flex-none p-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-lg shadow-teal-950/50 ${
                selectedSections.length === 0 
                  ? 'bg-zinc-800 text-zinc-500 opacity-50 cursor-not-allowed'
                  : isGenerating 
                    ? 'bg-teal-950/80 border border-teal-500/40 text-teal-400 animate-pulse' 
                    : 'bg-teal-400 text-slate-950 hover:bg-teal-350'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
                  Generating Book Layout...
                </>
              ) : (
                <>
                  <Download className="w-4.5 h-4.5" />
                  Compile PDF ({selectedSections.length} Pages)
                </>
              )}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
