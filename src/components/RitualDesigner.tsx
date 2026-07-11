import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  Download,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  isSelected: boolean;
  isCustom?: boolean;
}

const PRESET_TOPICS: AgendaItem[] = [
  {
    id: 'p1',
    title: '💖 Affirmations & Appreciation',
    description: 'Share at least 2 explicit things your partner did this week that you deeply appreciated. (Secures the Gottman 5:1 positive sentiment ratio).',
    category: 'Intimacy',
    durationMinutes: 10,
    isSelected: true
  },
  {
    id: 'p2',
    title: '🌟 Share 1 High/Low Point (Rose, Thorn, Bud)',
    description: 'Discuss the highlights, the low moments, and hopes for the upcoming week. (Builds Love Maps and tracks vulnerability).',
    category: 'Vulnerability',
    durationMinutes: 15,
    isSelected: true
  },
  {
    id: 'p3',
    title: '🧹 Review Domestic Division of Labor',
    description: 'Check in on chores, childcare, and mental loads. Adjust ownership cards transparently. (Adheres to the Fair Play Method).',
    category: 'Logistics',
    durationMinutes: 10,
    isSelected: true
  },
  {
    id: 'p4',
    title: '💰 Financial Check-in & Align Scripts',
    description: 'Review shared expenses, budgeting goals, and prevent security-vs-autonomy anxieties. (Ensures couples financial harmony).',
    category: 'Logistics',
    durationMinutes: 10,
    isSelected: false
  },
  {
    id: 'p5',
    title: '🩹 Conflict Repair & Trigger Review',
    description: 'Talk gently about any friction points from the week. Ensure no resentment is swept under the rug. (EFT loop de-escalation check).',
    category: 'Repair',
    durationMinutes: 15,
    isSelected: false
  },
  {
    id: 'p6',
    title: '📅 Co-ordinate Upcoming Calendar & Dates',
    description: 'Lock in at least one dedicated, distraction-free quality-time Date Night for next week. (Pillar of Shared Meaning).',
    category: 'Intimacy',
    durationMinutes: 10,
    isSelected: true
  }
];

export default function RitualDesigner() {
  const [agenda, setAgenda] = useState<AgendaItem[]>(() => {
    const saved = localStorage.getItem('couples_weekly_checkin_agenda');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return PRESET_TOPICS;
  });

  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customDuration, setCustomDuration] = useState<number>(10);
  const [customCategory, setCustomCategory] = useState<string>('Custom');

  const [reminderDay, setReminderDay] = useState<string>('Sunday');
  const [reminderTime, setReminderTime] = useState<string>('18:00');

  const [currentStep, setCurrentStep] = useState<'design' | 'run'>('design');
  const [activeRunIndex, setActiveRunIndex] = useState<number>(0);
  const [runCompleted, setRunCompleted] = useState<boolean>(false);

  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('couples_weekly_checkin_agenda', JSON.stringify(agenda));
  }, [agenda]);

  const handleToggleSelect = (id: string) => {
    setAgenda(prev => prev.map(item => 
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newItem: AgendaItem = {
      id: 'c_' + Date.now(),
      title: '✏️ ' + customTitle.trim(),
      description: customDesc.trim() || 'Custom discussion point.',
      category: customCategory,
      durationMinutes: customDuration,
      isSelected: true,
      isCustom: true
    };

    setAgenda(prev => [...prev, newItem]);
    setCustomTitle('');
    setCustomDesc('');
    setCustomDuration(10);
  };

  const handleDeleteItem = (id: string) => {
    setAgenda(prev => prev.filter(item => item.id !== id));
  };

  const selectedItems = agenda.filter(item => item.isSelected);
  const totalDuration = selectedItems.reduce((sum, item) => sum + item.durationMinutes, 0);

  // DOWNLOAD CALENDAR Reminders (.ics file)
  const handleDownloadICS = () => {
    try {
      const now = new Date();
      const formattedStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      // Set DTSTART to the next Sunday (or chosen day) at the chosen time
      const daysOfWeek: Record<string, number> = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
      };
      const targetDayNum = daysOfWeek[reminderDay];
      const todayNum = now.getDay();
      const daysToAdd = (targetDayNum + 7 - todayNum) % 7 || 7;
      
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + daysToAdd);
      
      const [hour, minute] = reminderTime.split(':');
      targetDate.setHours(Number(hour), Number(minute), 0, 0);
      
      const formattedStart = targetDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      // Outline the topics in description
      const topicsText = selectedItems.map((item, idx) => `${idx + 1}. ${item.title} (${item.durationMinutes} mins)`).join('\\n');
      const detailsText = selectedItems.map((item, idx) => `\\n-- ${item.title} --\\n${item.description}`).join('\\n');

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Couple Harmony App//Shared Weekly Ritual//EN',
        'BEGIN:VEVENT',
        `UID:couples_weekly_checkin_${Date.now()}@harmony.app`,
        `DTSTAMP:${formattedStamp}`,
        `DTSTART:${formattedStart}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${reminderDay.substring(0, 2).toUpperCase()}`,
        'SUMMARY:💑 Weekly Couples Relationship Check-in Agenda',
        `DESCRIPTION:Your custom agenda collaboratively co-designed in Couple Harmony App:\\n\\nDuration: ${totalDuration} minutes\\n\\nTOPICS:${topicsText}\\n\\nCLINICAL DETAILS:${detailsText}`,
        `DURATION:PT${totalDuration}M`,
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Weekly Relationship Check-in starts in 15 minutes!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'weekly_relationship_checkin_agenda.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // GOOGLE CALENDAR WEB GENERATION
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("💑 Weekly Relationship Check-In");
    const details = encodeURIComponent(
      `Your custom designed Check-in Agenda:\n\n` +
      selectedItems.map((item, idx) => `${idx + 1}. ${item.title} (${item.durationMinutes} mins)\n   ${item.description}`).join('\n\n') +
      `\n\nSynchronized from Couple Harmony App.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=RRULE:FREQ=WEEKLY`;
  };

  return (
    <div className="flex flex-col gap-5 text-[#4B4B4B]" id="ritual-designer-tool-container">
      
      {/* TOOL NAVIGATION ROW */}
      <div className="flex bg-surface-container p-1 rounded-2xl border-2 border-outline-variant">
        <button
          type="button"
          onClick={() => {
            setCurrentStep('design');
            setRunCompleted(false);
          }}
          className={`flex-1 text-center font-display font-black text-[10px] uppercase tracking-wider py-2.5 px-2 rounded-xl transition-all cursor-pointer ${currentStep === 'design' ? 'bg-[#FF8A00] text-white border-b-4 border-[#cc6e00]' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          🛠️ Agenda Builder
        </button>
        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={() => {
            setCurrentStep('run');
            setActiveRunIndex(0);
            setRunCompleted(false);
          }}
          className={`flex-1 text-center font-display font-black text-[10px] uppercase tracking-wider py-2.5 px-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${currentStep === 'run' ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302]' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          🚀 Run Agenda Session ({selectedItems.length} steps)
        </button>
      </div>

      {currentStep === 'design' ? (
        <div className="flex flex-col gap-5 animate-fade-in">
          
          <div className="bg-primary/5 p-4 rounded-3xl border-2 border-[#FF8A00]/20 text-[11px] leading-relaxed text-stone-700 flex gap-2">
            <span className="text-lg">📅</span>
            <div>
              <p>
                <strong>The Shared Meaning Ritual Builder:</strong> Designed collaboratively to secure routine check-ins. According to Gottman's "Shared Meaning" pillar, scheduling ritual check-ins is the single most effective way to intercept chronic distance.
              </p>
            </div>
          </div>

          {/* ACTIVE AGENDA CARD LIST */}
          <div className="bg-white border-2 border-outline-variant rounded-[2rem] p-5 shadow-sm flex flex-col gap-3.5">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2.5">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                <ListOrdered size={12} className="text-[#FF8A00]" /> Select Check-In Topics
              </span>
              <span className="text-[10px] font-mono font-black text-[#FF8A00] bg-[#FF8A00]/5 border border-[#FF8A00]/20 px-2.5 py-0.5 rounded-full">
                {totalDuration} minutes total
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {agenda.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                    item.isSelected 
                      ? 'bg-[#FF8A00]/5 border-[#FF8A00] shadow-sm' 
                      : 'bg-stone-50/50 border-outline-variant hover:border-stone-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(item.id)}
                    className={`w-5.5 h-5.5 rounded-full border-2 cursor-pointer shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      item.isSelected 
                        ? 'bg-[#FF8A00] border-[#FF8A00] text-white' 
                        : 'bg-white border-outline-variant hover:border-stone-400 text-transparent'
                    }`}
                  >
                    <Check size={12} className="stroke-[3.5px]" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1.5 flex-wrap">
                      <h5 className={`font-sans text-[11px] font-black text-stone-700 leading-none ${!item.isSelected && 'text-stone-400'}`}>
                        {item.title}
                      </h5>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono font-black uppercase bg-stone-100 border border-stone-200 text-stone-500 px-1.5 py-0.25 rounded-md">
                          {item.durationMinutes} min
                        </span>
                        <span className="text-[8px] font-sans font-extrabold uppercase bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.25 rounded-md">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <p className={`font-sans text-[10px] leading-relaxed text-stone-500 mt-1.5 ${!item.isSelected && 'text-stone-400/80'}`}>
                      {item.description}
                    </p>
                  </div>

                  {item.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-stone-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ADD CUSTOM AGENDA ITEM FORM */}
          <form 
            onSubmit={handleAddCustomItem}
            className="bg-stone-50 border-2 border-outline-variant p-4 rounded-[2rem] flex flex-col gap-3"
          >
            <span className="text-[9.5px] font-black uppercase text-stone-500 tracking-wider flex items-center gap-1">
              ➕ Add Custom Agenda Topic
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-stone-400">Topic Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Summer Trip Ideas"
                  className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-[#FF8A00] font-sans font-semibold text-stone-700"
                />
              </div>
              
              <div className="flex grid-cols-2 gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-wider text-stone-400">Duration</label>
                  <select
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full bg-white text-[10.5px] px-2 py-2 rounded-xl border-2 border-outline-variant font-bold text-stone-700 font-sans"
                  >
                    {[5, 10, 15, 20, 30].map(m => (
                      <option key={m} value={m}>{m} Mins</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-wider text-stone-400">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-white text-[10.5px] px-2 py-2 rounded-xl border-2 border-outline-variant font-bold text-stone-700 font-sans"
                  >
                    {['Intimacy', 'Vulnerability', 'Logistics', 'Repair', 'Custom'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-stone-400">Description / Intimacy Prompts</label>
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="e.g., Share specific places we want to explore together this June."
                className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-[#FF8A00] font-sans font-semibold text-stone-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/25 font-display font-black py-2 rounded-xl text-[9px] uppercase tracking-wider text-center cursor-pointer transition-all"
            >
              Add Topic to Agenda Builder
            </button>
          </form>

          {/* CALENDAR REMINDER & ICS EXPORT SYNC PANEL */}
          <div className="bg-white border-2 border-outline-variant rounded-[2rem] p-5 shadow-sm flex flex-col gap-4">
            <div>
              <span className="text-[9.5px] font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                <Calendar size={12} className="text-[#FF8A00]" /> Set Check-In Device Calendar Reminder
              </span>
              <p className="font-sans text-[10px] text-stone-500 leading-relaxed mt-0.5">
                Configure a recurring weekly placeholder to protect this relational intimacy boundary on your actual calendars.
              </p>
            </div>

            {/* Set Time & Day selectors */}
            <div className="grid grid-cols-2 gap-3.5 bg-stone-50 p-4 rounded-2xl border border-outline-variant/60">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-stone-400">Weekly Reminder Day</label>
                <select
                  value={reminderDay}
                  onChange={(e) => setReminderDay(e.target.value)}
                  className="w-full bg-white text-[10.5px] font-sans px-2.5 py-2 rounded-xl border-2 border-outline-variant font-bold text-stone-700"
                >
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <option key={day} value={day}>{day}s</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-stone-400">Check-In Start Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-white text-[10.5px] font-sans px-2.5 py-1.5 rounded-xl border-2 border-outline-variant font-bold text-stone-700"
                />
              </div>
            </div>

            {/* SYNC/DOWNLOAD BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleDownloadICS}
                className="flex-1 bg-neutral-900 hover:brightness-110 active:translate-y-[1px] text-white font-display font-black py-3 px-4 rounded-xl text-[9.5px] uppercase tracking-widest cursor-pointer shadow-sm text-center flex items-center justify-center gap-2 transition-all border-b-[4px] border-neutral-950"
              >
                <Download size={13} className="text-white" />
                <span>Export ICS Calendar File</span>
              </button>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white hover:bg-stone-50 border-2 border-outline-variant text-stone-700 font-display font-black py-2.5 px-4 rounded-xl text-[9.5px] uppercase tracking-widest cursor-pointer shadow-sm text-center flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink size={13} className="text-blue-500" />
                <span>Sync with Google Calendar</span>
              </a>
            </div>

            {/* Success export prompt */}
            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-[9.5px] text-emerald-800 font-bold flex items-center gap-2"
              >
                <span>📅</span>
                <p>ICS File downloaded! Simply double-click the file to sync this custom relationship check-in agenda to your Apple, Google, or Outlook calendar.</p>
              </motion.div>
            )}

            {/* Methodology check-in explanation */}
            <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl text-[9px] leading-relaxed text-stone-500">
              💡 <strong>Weekly check-in guidelines:</strong> Sit face-to-face with open, soft body posture, secure at least one beverage each, and make sure all devices (phones/tablets) are in "Do Not Disturb" mode. Do not jump straight to logistics—always spend the first 10 minutes on appreciations!
            </div>
          </div>

        </div>
      ) : (
        /* RUN SESSION PRESENTATION MODE */
        <div className="animate-fade-in flex flex-col gap-4">
          
          {runCompleted ? (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white border-2 border-outline-variant rounded-[2rem] p-6 text-center flex flex-col items-center gap-4 shadow-sm text-[#4B4B4B]"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-stone-800 uppercase tracking-wider">
                  Check-In Complete! Excellent Teamwork
                </h4>
                <p className="font-sans text-[10.5px] text-stone-500 leading-relaxed mt-1 max-w-[280px] mx-auto">
                  You co-navigated all check-in modules. Your relationship's shared sentiment reservoirs have been replenished.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-[9.5px] text-stone-700 text-left leading-relaxed">
                <strong>📝 Gottman Milestone achieved:</strong> Weekly Shared Ritual of Connection completed! This active practice builds emotional credit that cushions against next week's micro-frustrations.
              </div>

              <button
                type="button"
                onClick={() => {
                  setRunCompleted(false);
                  setCurrentStep('design');
                }}
                className="bg-[#FF8A00] hover:brightness-105 text-white font-display font-black py-2.5 px-6 rounded-xl border-b-[3px] border-[#cc6e00] text-[9.5px] uppercase tracking-wider cursor-pointer"
              >
                Return to Agenda Builder
              </button>
            </motion.div>
          ) : (
            <div className="bg-white border-2 border-outline-variant rounded-[2rem] p-5 shadow-sm flex flex-col gap-4">
              
              {/* Header status bar */}
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">
                  Agenda Step {activeRunIndex + 1} of {selectedItems.length}
                </span>
                <span className="text-[9px] font-mono font-bold text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={10} /> {selectedItems[activeRunIndex].durationMinutes} mins
                </span>
              </div>

              {/* Active topic card */}
              <div className="bg-[#FF8A00]/5 border-2 border-[#FF8A00]/40 rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-[8px] font-black uppercase text-[#FF8A00] tracking-wider font-display">
                  Active Discussion Focus
                </span>
                <h4 className="font-display font-black text-sm text-stone-800">
                  {selectedItems[activeRunIndex].title}
                </h4>
                <p className="font-sans text-[10.5px] text-stone-600 leading-relaxed italic bg-white p-3 rounded-xl border border-outline-variant">
                  {selectedItems[activeRunIndex].description}
                </p>
              </div>

              {/* Clinical safe dialogue coaching tips */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-2 items-start text-[9.5px] leading-relaxed text-indigo-900">
                <Info size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Co-op Safe Space Tip:</strong> Make soft observations, not statements of global critique. Speak from the first person ("I feel...") rather than pointing blames ("You always..."). Listen to understand, not to debate.
                </div>
              </div>

              {/* Progress dots bar */}
              <div className="flex justify-center gap-1 px-4 mt-1">
                {selectedItems.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeRunIndex 
                        ? 'w-6 bg-[#FF8A00]' 
                        : idx < activeRunIndex 
                          ? 'w-2 bg-emerald-500' 
                          : 'w-2 bg-stone-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step Navigation controls */}
              <div className="flex gap-2.5 pt-2 border-t border-outline-variant/50">
                <button
                  type="button"
                  disabled={activeRunIndex === 0}
                  onClick={() => setActiveRunIndex(prev => prev - 1)}
                  className="bg-white hover:bg-stone-50 text-stone-600 border-2 border-outline-variant p-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                {activeRunIndex < selectedItems.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveRunIndex(prev => prev + 1)}
                    className="flex-1 bg-[#FF8A00] hover:brightness-105 text-white font-display font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer border-b-4 border-[#cc6e00]"
                  >
                    <span>Next Topic</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRunCompleted(true)}
                    className="flex-1 bg-emerald-500 hover:brightness-105 text-white font-display font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer border-b-4 border-emerald-700"
                  >
                    <CheckCircle2 size={14} />
                    <span>Finish Agenda Session</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
