import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Users, Sparkles, Trash2, Heart, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './SwitchUserBar';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  type: 'dinner' | 'one-on-one' | 'date-night' | 'meeting' | 'therapy' | 'chore' | 'other';
  organizer: string;
  attendees: string[];
  notes?: string;
  ritualPrompt?: string;
}

const EVENT_TYPE_INFO = {
  dinner: { label: 'Family Dinner', icon: '🍳', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'one-on-one': { label: 'One on One Time', icon: '🌳', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'date-night': { label: 'Date Night', icon: '🕯️', color: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' },
  meeting: { label: 'Parent Alignment', icon: '⚖️', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  therapy: { label: 'Therapy Check-in', icon: '🩺', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  chore: { label: 'Domestic Chores', icon: '🧹', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  other: { label: 'Other Shared Event', icon: '📅', color: 'bg-slate-50 text-slate-700 border-slate-200' }
};

interface CalendarSectionProps {
  currentUser: UserProfile;
}

export default function CalendarSection({ currentUser }: CalendarSectionProps) {
  // Calendar state July 2026
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('driftwood_calendar_events_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'e1',
        title: 'Weekly Romantic Date Night 🕯️',
        date: '2026-07-10',
        time: '19:00',
        type: 'date-night',
        organizer: 'Alex',
        attendees: ['Alex', 'Taylor'],
        notes: 'Secured sitter for 6:30 PM. Focus: Avoid work talk, ask Love Map open-ended questions!',
        ritualPrompt: 'Gottman Date Ritual: Express 3 specific appreciations before ordering entrees.'
      },
      {
        id: 'e2',
        title: 'Sunday Roast Family Dinner 🍳',
        date: '2026-07-12',
        time: '18:00',
        type: 'dinner',
        organizer: 'Taylor',
        attendees: ['Alex', 'Taylor', 'Jamie'],
        notes: 'Taylor preparing the roast chicken. Jamie in charge of setting table nicely.',
        ritualPrompt: 'High/Low/Buffalo Ritual: Everyone shares their best moment, hardest moment, and most surprising event of the week.'
      },
      {
        id: 'e3',
        title: 'Parent-Teen One on One Walk 🌳',
        date: '2026-07-13',
        time: '16:30',
        type: 'one-on-one',
        organizer: 'Alex',
        attendees: ['Alex', 'Jamie'],
        notes: 'Walking around the lake. Active listening check. No parental advice-giving unless requested!',
        ritualPrompt: 'Validation Ritual: Reflect Jamie\'s frustrations about school without correcting.'
      },
      {
        id: 'e4',
        title: 'Dr. Evelyn Joint Therapy Check-in 🩺',
        date: '2026-07-15',
        time: '15:00',
        type: 'therapy',
        organizer: 'Dr. Evelyn',
        attendees: ['Alex', 'Taylor', 'Dr. Evelyn'],
        notes: 'Reviewing our de-escalation practice logs and dialogue reframes.',
        ritualPrompt: 'Clinical Spec: Softened Startups homework check-in review.'
      },
      {
        id: 'e5',
        title: 'FairPlay Domestic Chore Re-Dealing 🧹',
        date: '2026-07-16',
        time: '20:30',
        type: 'chore',
        organizer: 'Taylor',
        attendees: ['Alex', 'Taylor'],
        notes: 'Redefining the cognitive load of cleaning, kitchen cleanup, and grocery management.',
        ritualPrompt: 'Mental Load Shield: Swap 2 high-mental-load cards without scoring points.'
      }
    ];
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-07-10'); // Defaults to today
  const [showAddForm, setShowAddForm] = useState(false);

  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('18:00');
  const [newType, setNewType] = useState<keyof typeof EVENT_TYPE_INFO>('date-night');
  const [newAttendees, setNewAttendees] = useState<string[]>(['Alex', 'Taylor']);
  const [newNotes, setNewNotes] = useState('');
  const [customNotification, setCustomNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('driftwood_calendar_events_v1', JSON.stringify(events));
    } catch {}
  }, [events]);

  // Simulate cross-device updates for date-night
  useEffect(() => {
    // Show a simulated remote edit after 15 seconds to make the "collaborative" feel highly obvious!
    const timer = setTimeout(() => {
      setCustomNotification("Taylor just added a note to 'Weekly Romantic Date Night': 'Got table outside! 🌅'");
      setEvents(prev => prev.map(ev => {
        if (ev.id === 'e1' && !ev.notes?.includes('Got table outside')) {
          return {
            ...ev,
            notes: ev.notes + " (Taylor added: Got table outside! 🌅)"
          };
        }
        return ev;
      }));
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleDayClick = (dayNum: number) => {
    const formattedDate = `2026-07-${dayNum.toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Map a clinical ritual prompt based on selection
    let ritualPrompt = '';
    if (newType === 'date-night') {
      ritualPrompt = 'Gottman Date Ritual: Focus on positive sentiment override. No administrative talk allowed!';
    } else if (newType === 'dinner') {
      ritualPrompt = 'Appreciation Round: Each person shares one specific gratitude from their week.';
    } else if (newType === 'therapy') {
      ritualPrompt = 'Dr. Evelyn Tip: Remember to take 3 deep breaths if heart rate exceeds 100bpm.';
    } else if (newType === 'one-on-one') {
      ritualPrompt = 'Active Listening: Maintain eye contact, summarize before speaking.';
    } else {
      ritualPrompt = 'Establish a soft-startup baseline before starting domestic chore feedback.';
    }

    const newEv: CalendarEvent = {
      id: 'e-' + Date.now(),
      title: newTitle.trim(),
      date: selectedDate,
      time: newTime,
      type: newType,
      organizer: currentUser.name,
      attendees: newAttendees,
      notes: newNotes.trim(),
      ritualPrompt
    };

    setEvents(prev => [...prev, newEv]);
    setNewTitle('');
    setNewNotes('');
    setShowAddForm(false);

    // Trigger feedback notification
    setCustomNotification(`Successfully scheduled: ${newEv.title} on behalf of ${currentUser.name}!`);
    setTimeout(() => setCustomNotification(null), 3500);
  };

  const handleDeleteEvent = (id: string) => {
    const toDelete = events.find(ev => ev.id === id);
    setEvents(prev => prev.filter(ev => ev.id !== id));
    if (toDelete) {
      setCustomNotification(`Deleted event: '${toDelete.title}'`);
      setTimeout(() => setCustomNotification(null), 2500);
    }
  };

  const toggleAttendee = (name: string) => {
    setNewAttendees(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Build grid calendar for July 2026
  // July 2026 starts on a Wednesday.
  // We need empty cells for Sun, Mon, Tue (if starting week on Sunday) or Mon, Tue (if starting on Monday)
  // Let's standard start week on Sunday: Sun (0), Mon (1), Tue (2), Wed (3).
  // So we need 3 padding cells.
  const totalDays = 31;
  const startOffset = 3; // Sun, Mon, Tue are blank
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= totalDays; i++) calendarCells.push(i);

  const activeDayNum = parseInt(selectedDate.split('-')[2], 10);
  const selectedDayEvents = events.filter(ev => ev.date === selectedDate);

  return (
    <div className="flex flex-col gap-4 text-on-surface">
      {/* Simulated real-time sync notify banner */}
      <AnimatePresence>
        {customNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-secondary text-white p-3 rounded-2xl text-[9.5px] font-sans font-black uppercase tracking-wider flex items-center justify-between shadow-md border border-sky-400 gap-1.5 z-40"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{customNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setCustomNotification(null)}
              className="text-[10px] bg-white/20 px-2 py-0.5 rounded-lg hover:bg-white/30"
            >
              Okay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-primary/5 p-3 rounded-2xl border-2 border-primary/20 text-[10.5px] leading-relaxed text-[#4B4B4B] flex items-start gap-1.5">
        <span className="text-base shrink-0">📅</span>
        <p className="font-sans">
          <strong>Big Family Couples Calendar:</strong> Plan intentional connection spaces. Events are collaborative, simulated across all devices, and embed clinical connection rituals.
        </p>
      </div>

      {/* Grid Calendar Layout */}
      <div className="bg-white border-2 border-outline-variant p-3.5 rounded-[2rem] shadow-2xs flex flex-col gap-2.5">
        <div className="flex justify-between items-center px-1.5">
          <span className="font-display font-black text-sm text-[#4B4B4B] uppercase tracking-wider">July 2026</span>
          <span className="text-[9px] font-mono font-bold text-on-surface-variant bg-slate-100 px-2 py-0.5 rounded-full border border-outline-variant">
            31 Days Shared Grid
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[8.5px] font-black uppercase text-on-surface-variant/80 border-b border-outline-variant/50 pb-1.5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/50 rounded-lg opacity-40 border border-transparent" />;
            }

            const isToday = day === 10;
            const formatted = `2026-07-${day.toString().padStart(2, '0')}`;
            const isSelected = selectedDate === formatted;
            const dayEvents = events.filter(ev => ev.date === formatted);

            return (
              <button
                key={`day-${day}`}
                type="button"
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-xl border flex flex-col justify-between p-1 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary font-black scale-102 shadow-2xs'
                    : isToday
                    ? 'border-secondary bg-secondary/5 text-secondary font-bold'
                    : 'border-outline-variant bg-white text-on-surface hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[9.5px] font-mono leading-none ${isToday ? 'font-black underline' : ''}`}>{day}</span>
                  {dayEvents.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>

                {/* Micro visual bar representation of events */}
                <div className="flex gap-0.5 w-full overflow-hidden mt-0.5 h-1 items-end">
                  {dayEvents.map((ev, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full ${
                        ev.type === 'date-night' ? 'bg-rose-500' :
                        ev.type === 'dinner' ? 'bg-emerald-500' :
                        ev.type === 'therapy' ? 'bg-blue-500' : 'bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day View and Event creation */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Scheduled events for</span>
            <span className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-[9px] font-black bg-primary text-white border-b-4 border-primary-dark hover:brightness-105 active:translate-y-[2px] active:border-b-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Schedule Event</span>
            </button>
          )}
        </div>

        {/* Add Event Form Overlay/Box */}
        {showAddForm && (
          <form
            onSubmit={handleAddEvent}
            className="bg-surface-container p-4 rounded-2xl border-2 border-outline-variant flex flex-col gap-3 animate-fade-in text-on-surface"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-display font-black text-[10px] uppercase tracking-wider text-on-surface-variant">New Shared Event</h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[9px] font-black uppercase text-on-surface-variant hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Event Name</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Candlelit date night in kitchen"
                className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Time</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Activity Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as keyof typeof EVENT_TYPE_INFO)}
                  className="w-full bg-white text-[10.5px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B]"
                >
                  <option value="date-night">Date Night 🕯️</option>
                  <option value="dinner">Family Dinner 🍳</option>
                  <option value="one-on-one">One on One Time 🌳</option>
                  <option value="meeting">Parenting Meeting ⚖️</option>
                  <option value="therapy">Therapy Session 🩺</option>
                  <option value="chore">Shared Chore Deal 🧹</option>
                  <option value="other">Other Event 📅</option>
                </select>
              </div>
            </div>

            {/* Attendees Multiselect */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Attending Participants</label>
              <div className="flex flex-wrap gap-1.5">
                {['Alex', 'Taylor', 'Jamie', 'Dr. Evelyn'].map((name) => {
                  const isChecked = newAttendees.includes(name);
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => toggleAttendee(name)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-[#4B4B4B] border-outline-variant hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? '✓ ' : ''}{name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Shared Notes / Collaborative details</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. Sitter secured, what conversation prompt from Gottman method are we doing?"
                className="w-full bg-white text-[10px] px-3 py-2 rounded-xl border-2 border-outline-variant focus:outline-none focus:border-primary font-sans font-bold text-[#4B4B4B] h-14 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border-b-4 border-primary-dark hover:brightness-105 active:translate-y-[2px] active:border-b-2 transition-all mt-1 cursor-pointer text-center"
            >
              Add to Shared Calendar
            </button>
          </form>
        )}

        {/* List of day events */}
        <div className="flex flex-col gap-3">
          {selectedDayEvents.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-outline-variant rounded-2xl p-6 text-center text-[10.5px] italic text-on-surface-variant/80">
              No shared activities scheduled for this day. Click "Schedule Event" to plan a date night or family dinner!
            </div>
          ) : (
            selectedDayEvents.map((ev) => {
              const info = EVENT_TYPE_INFO[ev.type] || EVENT_TYPE_INFO.other;
              return (
                <div
                  key={ev.id}
                  className="bg-white border-2 border-outline-variant rounded-2xl p-4 flex flex-col gap-3.5 shadow-3d-neutral hover:shadow-xs transition-all animate-fade-in text-on-surface"
                >
                  <div className="flex justify-between items-start gap-2 border-b border-outline-variant/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{info.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-sans text-[11.5px] font-black text-on-surface">{ev.title}</h4>
                          <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.25 rounded border ${info.color}`}>
                            {info.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-on-surface-variant/90 mt-0.5">
                          <span className="flex items-center gap-0.5 font-bold">
                            <Clock className="w-2.5 h-2.5" />
                            {ev.time}
                          </span>
                          <span>•</span>
                          <span className="font-bold">Scheduled by {ev.organizer}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="text-on-surface-variant hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                      title="Cancel Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Shared Notes details */}
                  {ev.notes && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Shared Notes:</span>
                      <p className="font-sans text-[10px] leading-relaxed text-[#4B4B4B] bg-slate-50 p-2.5 rounded-xl border border-outline-variant/65 italic">
                        "{ev.notes}"
                      </p>
                    </div>
                  )}

                  {/* Structured Clinical Ritual connection details */}
                  {ev.ritualPrompt && (
                    <div className="bg-primary/5 p-2.5 rounded-xl border border-primary/20 flex flex-col gap-1.5">
                      <span className="text-[8px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5 fill-primary" />
                        <span>Interactive Clinical Ritual Embedded</span>
                      </span>
                      <p className="font-sans text-[9.5px] leading-relaxed text-on-surface font-semibold">
                        {ev.ritualPrompt}
                      </p>
                    </div>
                  )}

                  {/* Attendees listed */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant">Attendees:</span>
                    <div className="flex gap-1.5">
                      {ev.attendees.map((at) => (
                        <span key={at} className="text-[7.5px] font-bold bg-slate-100 text-[#4B4B4B] px-2 py-0.5 rounded border border-outline-variant">
                          {at}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
