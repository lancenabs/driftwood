import React, { useState } from 'react';
import { 
  Smile, BookOpen, Trophy, Compass, Wind, PenTool, Flame, 
  Search, ShieldCheck, HelpCircle, Activity, Music, MessageCircle, 
  Sparkles, ListTodo, BarChart3, Newspaper, FolderOpen, Heart, 
  Sparkle, Volume2, ShieldAlert, Key, Coffee, Eye, Calendar, Clock
} from 'lucide-react';
import { TabType, MoodLog } from '../types';

interface YourDayAtAGlanceProps {
  userName: string;
  moodLogs: MoodLog[];
  onNavigateToTab: (tab: any, subtab?: string) => void;
  checkinThoughts?: string;
  checkinBehaviors?: string[];
  lastCompletedPractice?: string;
  goalStatusText?: string;
}

export default function YourDayAtAGlance({
  userName,
  moodLogs = [],
  onNavigateToTab,
  checkinThoughts = '',
  checkinBehaviors = [],
  lastCompletedPractice = '',
  goalStatusText = '',
}: YourDayAtAGlanceProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(
    "👋 Explore your tools below"
  );

  // Get latest mood log
  const latestMood = moodLogs.length > 0 ? moodLogs[moodLogs.length - 1] : null;
  const moodLabel = latestMood ? latestMood.label : 'Positive';

  // Helper to determine if an app/card matches search
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div
      className="py-2 px-2 max-w-md mx-auto w-full select-none relative z-10 font-sans"
      style={{ background: '#F9FAFB', color: '#3C3C3C' }}
    >

      {/* THE APP LIBRARY SHORTCUT FOLDER GRIDS — each folder groups related tools;
          tapping an icon opens that tool elsewhere in the app. Nothing here monitors
          anything in the background. */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-7 pb-20">

        {/* FOLDER 1: Suggestions */}
        <div className="flex flex-col items-center">
          <div
            className="bg-white w-full p-3.5 aspect-square rounded-[30px] flex items-center justify-center border border-[#F0F0F0]"
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
          >
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              
              {/* APP ICON 1: Reminders / Daily Log */}
              <div 
                onClick={() => onNavigateToTab('checkin', 'mood')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Mood') || matchesSearch('Check') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <ListTodo className="w-7 h-7 text-white drop-shadow-sm" />
              </div>

              {/* APP ICON 2: Music / Coherence Beats */}
              <div 
                onClick={() => onNavigateToTab('practice', 'breathing')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Breathe') || matchesSearch('Music') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <Music className="w-7 h-7 text-white drop-shadow-sm" />
              </div>

              {/* APP ICON 3: Baseline Coherence Tracker */}
              <div 
                onClick={() => onNavigateToTab('checkin', 'mood')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Baseline') || matchesSearch('Mood') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <div className="relative">
                  <Heart className="w-7 h-7 text-white drop-shadow-md" />
                  <span className="absolute -bottom-1 -right-1 bg-white text-[8px] text-amber-600 font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-amber-100 animate-pulse">✓</span>
                </div>
              </div>

              {/* APP ICON 4: Deep Tech Lab Vault */}
              <div 
                onClick={() => onNavigateToTab('analyze', 'tech')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/20 ${
                  matchesSearch('Lab') || matchesSearch('Tech') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[16px] pointer-events-none" />
                <Key className="w-7 h-7 text-amber-300 drop-shadow-md" />
              </div>

            </div>
          </div>
          <span className="text-[11.5px] mt-1.5 text-[#6B7280] font-sans font-semibold tracking-wide">Suggestions</span>
        </div>

        {/* FOLDER 2: Active Interventions */}
        <div className="flex flex-col items-center">
          <div
            className="bg-white w-full p-3.5 aspect-square rounded-[30px] flex items-center justify-center border border-[#F0F0F0]"
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
          >
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              
              {/* APP ICON 1: Clinical Assessment Shield */}
              <div 
                onClick={() => onNavigateToTab('practice', 'assessment')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Assess') || matchesSearch('Shield') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <ShieldCheck className="w-7.5 h-7.5 text-white drop-shadow-md animate-pulse" />
              </div>

              {/* APP ICON 2: guided breathe (Pranayama) */}
              <div 
                onClick={() => onNavigateToTab('practice', 'breathing')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Breathe') || matchesSearch('Prana') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <Wind className="w-7 h-7 text-white drop-shadow-sm rotate-45 animate-spin-slow" />
              </div>

              {/* APP ICON 3: AI Vocal Biometrics */}
              <div 
                onClick={() => onNavigateToTab('checkin', 'voice')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Voice') || matchesSearch('Vocal') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <Volume2 className="w-7 h-7 text-white drop-shadow-sm" />
              </div>

              {/* APP ICON 4: Overflow Mini-Grid */}
              <div className="aspect-square rounded-[16px] bg-[#F3F4F6] p-1.5 grid grid-cols-2 gap-1.5 border border-[#E5E7EB]">
                {/* Micro Icon 1: Gratitude Jar */}
                <div 
                  onClick={() => onNavigateToTab('checkin', 'gratitude')}
                  className="rounded-md bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90 duration-200 transition"
                >
                  <Smile className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 2: CBT News */}
                <div 
                  onClick={() => onNavigateToTab('learning', 'cbt-news')}
                  className="rounded-md bg-zinc-800 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90 duration-200 transition border border-white/5"
                >
                  <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                {/* Micro Icon 3: Calendar Plan */}
                <div 
                  onClick={() => onNavigateToTab('activity', 'goals')}
                  className="rounded-md bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90 duration-200 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 4: Heart Rate */}
                <div 
                  onClick={() => onNavigateToTab('analyze', 'ble')}
                  className="rounded-md bg-teal-500 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90 duration-200 transition"
                >
                  <Activity className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

            </div>
          </div>
          <span className="text-[11.5px] mt-1.5 text-[#6B7280] font-sans font-semibold tracking-wide">Recently Added</span>
        </div>

        {/* FOLDER 3: Therapeutic Chat & Social */}
        <div className="flex flex-col items-center">
          <div
            className="bg-white w-full p-3.5 aspect-square rounded-[30px] flex items-center justify-center border border-[#F0F0F0]"
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
          >
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              
              {/* APP ICON 1: Counselor Chat (iMessage themed) */}
              <div
                onClick={() => onNavigateToTab('checkin', 'chat')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Chat') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <MessageCircle className="w-7.5 h-7.5 text-white drop-shadow-md" />
              </div>

              {/* APP ICON 2: Interactive Compass Navigation (Safari/X themed) */}
              <div 
                onClick={() => onNavigateToTab('checkin', 'explore')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/25 ${
                  matchesSearch('Explore') || matchesSearch('Compass') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[16px] pointer-events-none" />
                <Compass className="w-7 h-7 text-white drop-shadow-sm animate-pulse" />
              </div>

              {/* APP ICON 3: Attachment couples connect (Cam/FaceTime themed) */}
              <div 
                onClick={() => onNavigateToTab('practice', 'couples')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Couple') || matchesSearch('Love') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <div className="flex gap-[1px]">
                  <Heart className="w-4 h-4 text-white fill-white animate-bounce" />
                  <Heart className="w-4 h-4 text-white fill-white translate-y-1.5" />
                </div>
              </div>

              {/* APP ICON 4: Overflow Mini-Grid */}
              <div className="aspect-square rounded-[16px] bg-[#F3F4F6] p-1.5 grid grid-cols-2 gap-1.5 border border-[#E5E7EB]">
                {/* Micro Icon 1: Speak Counselor */}
                <div 
                  onClick={() => onNavigateToTab('checkin', 'chat')}
                  className="rounded-md bg-blue-500 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 2: Shared Sync */}
                <div 
                  onClick={() => onNavigateToTab('practice', 'couples')}
                  className="rounded-md bg-teal-400 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
                </div>
                {/* Micro Icon 3: Voice Feedback */}
                <div 
                  onClick={() => onNavigateToTab('checkin', 'voice')}
                  className="rounded-md bg-indigo-500 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90"
                >
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 4: Mood Grid */}
                <div 
                  onClick={() => onNavigateToTab('checkin', 'mood')}
                  className="rounded-md bg-amber-500 flex items-center justify-center cursor-pointer hover:brightness-115 active:scale-90"
                >
                  <Smile className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

            </div>
          </div>
          <span className="text-[11.5px] mt-1.5 text-[#6B7280] font-sans font-semibold tracking-wide">Social & Counsels</span>
        </div>

        {/* FOLDER 4: Guidance & Reading */}
        <div className="flex flex-col items-center">
          <div
            className="bg-white w-full p-3.5 aspect-square rounded-[30px] flex items-center justify-center border border-[#F0F0F0]"
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
          >
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              
              {/* APP ICON 1: Cognitive library (Red/White Apple News style) */}
              <div 
                onClick={() => onNavigateToTab('learning', 'cbt-news')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/20 overflow-hidden ${
                  matchesSearch('Learn') || matchesSearch('News') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-0 bg-white/5 opacity-50 z-0" />
                <div className="relative z-10 flex flex-col justify-center items-center font-black">
                  <span className="text-[12px] leading-none mb-0.5 tracking-tightest uppercase text-white scale-110">CBT</span>
                  <span className="text-[6.5px] uppercase text-zinc-200">NEWS</span>
                </div>
              </div>

              {/* APP ICON 2: Education Workbooks (White/Grey Notebook) */}
              <div 
                onClick={() => onNavigateToTab('learning', 'library')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-sky-100 to-white flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/30 ${
                  matchesSearch('Library') || matchesSearch('Work') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-blue-100 rounded-b-[16px]" />
                <BookOpen className="w-7 h-7 text-blue-600 drop-shadow-xs relative z-10" />
              </div>

              {/* APP ICON 3: Audio Podcast Guides */}
              <div 
                onClick={() => onNavigateToTab('learning', 'podcasts')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/25 ${
                  matchesSearch('Audio') || matchesSearch('Guide') || matchesSearch('Podcast') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 opacity-60 z-0" />
                <div className="w-5 h-5 rounded-full bg-violet-600/30 flex items-center justify-center border border-violet-500/20 relative z-10">
                  <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                </div>
              </div>

              {/* APP ICON 4: Overflow Mini-Grid */}
              <div className="aspect-square rounded-[16px] bg-[#F3F4F6] p-1.5 grid grid-cols-2 gap-1.5 border border-[#E5E7EB]">
                {/* Micro Icon 1: Learn */}
                <div 
                  onClick={() => onNavigateToTab('learning', 'library')}
                  className="rounded-md bg-stone-700 flex items-center justify-center hover:bg-stone-600"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-100" />
                </div>
                {/* Micro Icon 2: Help Guides */}
                <div 
                  onClick={() => onNavigateToTab('learning', 'faq')}
                  className="rounded-md bg-amber-500 flex items-center justify-center"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 3: Cognitive Alarms */}
                <div 
                  onClick={() => onNavigateToTab('activity', 'reminders')}
                  className="rounded-md bg-indigo-500 flex items-center justify-center"
                >
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 4: Mood Baselines */}
                <div 
                  onClick={() => onNavigateToTab('checkin', 'mood')}
                  className="rounded-md bg-teal-400 flex items-center justify-center"
                >
                  <Smile className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

            </div>
          </div>
          <span className="text-[11.5px] mt-1.5 text-[#6B7280] font-sans font-semibold tracking-wide">Info & Reading</span>
        </div>

        {/* FOLDER 5: Productivity & Habits */}
        <div className="flex flex-col items-center">
          <div
            className="bg-white w-full p-3.5 aspect-square rounded-[30px] flex items-center justify-center border border-[#F0F0F0]"
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
          >
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              
              {/* APP ICON 1: Goal Streaks (Orange Sunburst) */}
              <div 
                onClick={() => onNavigateToTab('activity', 'goals')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Goal') || matchesSearch('Streak') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <Trophy className="w-7 h-7 text-white drop-shadow-md animate-bounce" />
              </div>

              {/* APP ICON 2: Directory Folder (Apple Files Style) */}
              <div 
                onClick={() => onNavigateToTab('practice', 'cbt')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-sky-400 to-sky-500 flex flex-col justify-between p-2 relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('CBT') || matchesSearch('Journal') || matchesSearch('Notes') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <FolderOpen className="w-5.5 h-5.5 text-white drop-shadow-xs" />
                <span className="text-[8.5px] font-sans font-extrabold text-white bg-white/20 px-1 py-0.5 rounded-md text-center">CBT Logs</span>
              </div>

              {/* APP ICON 3: Mindful Art Therapy Canvas (Multi-color Petal) */}
              <div 
                onClick={() => onNavigateToTab('practice', 'canvas')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-indigo-900 via-indigo-950 to-black flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/25 overflow-hidden ${
                  matchesSearch('Art') || matchesSearch('Canvas') || matchesSearch('Paint') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-0 bg-radial-gradient from-teal-500 via-purple-500 to-pink-500 opacity-60 z-0 scale-110" />
                <div className="relative z-10 flex flex-wrap gap-[2px] w-6.5 h-6.5 rounded-full bg-white/10 border border-white/20 p-1 items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                </div>
              </div>

              {/* APP ICON 4: Overflow Mini-Grid */}
              <div className="aspect-square rounded-[16px] bg-[#F3F4F6] p-1.5 grid grid-cols-2 gap-1.5 border border-[#E5E7EB]">
                {/* Micro Icon 1: Goals */}
                <div 
                  onClick={() => onNavigateToTab('activity', 'goals')}
                  className="rounded-md bg-amber-500 flex items-center justify-center cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 2: Directory */}
                <div 
                  onClick={() => onNavigateToTab('practice', 'cbt')}
                  className="rounded-md bg-blue-500 flex items-center justify-center cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 3: Reminders */}
                <div 
                  onClick={() => onNavigateToTab('activity', 'reminders')}
                  className="rounded-md bg-amber-600 flex items-center justify-center cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 4: Art */}
                <div 
                  onClick={() => onNavigateToTab('practice', 'canvas')}
                  className="rounded-md bg-[#252526] flex items-center justify-center border border-white/5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                </div>
              </div>

            </div>
          </div>
          <span className="text-[11.5px] mt-1.5 text-[#6B7280] font-sans font-semibold tracking-wide">Productivity & Habits</span>
        </div>

        {/* FOLDER 6: Wellness Utilities */}
        <div className="flex flex-col items-center">
          <div
            className="bg-white w-full p-3.5 aspect-square rounded-[30px] flex items-center justify-center border border-[#F0F0F0]"
            style={{ boxShadow: '0 3px 14px rgba(0,0,0,0.05)' }}
          >
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              
              {/* APP ICON 1: Immersive Visualizer (Globe/Aether themed) */}
              <div 
                onClick={() => onNavigateToTab('practice', 'experience')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Holo') || matchesSearch('Visualizer') || matchesSearch('Aether') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <Sparkle className="w-7 h-7 text-teal-300 drop-shadow-md animate-spin-slow" />
              </div>

              {/* APP ICON 2: Bio-Coherence ECG Monitor */}
              <div 
                onClick={() => onNavigateToTab('analyze', 'ble')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Coherence') || matchesSearch('ECG') || matchesSearch('BLE') || matchesSearch('Heart') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <Activity className="w-7 h-7 text-white drop-shadow-sm animate-pulse" />
              </div>

              {/* APP ICON 3: Water/Gratitude Jar */}
              <div 
                onClick={() => onNavigateToTab('checkin', 'gratitude')}
                className={`aspect-square rounded-[16px] bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center relative cursor-pointer active:scale-95 transition shadow-md border border-white/15 ${
                  matchesSearch('Gratitude') || matchesSearch('Water') || matchesSearch('Jar') ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[16px] pointer-events-none" />
                <Smile className="w-7 h-7 text-white drop-shadow-sm" />
              </div>

              {/* APP ICON 4: Overflow Mini-Grid */}
              <div className="aspect-square rounded-[16px] bg-[#F3F4F6] p-1.5 grid grid-cols-2 gap-1.5 border border-[#E5E7EB]">
                {/* Micro Icon 1: Aether */}
                <div 
                  onClick={() => onNavigateToTab('practice', 'experience')}
                  className="rounded-md bg-purple-500 flex items-center justify-center cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 2: Coherence */}
                <div 
                  onClick={() => onNavigateToTab('analyze', 'ble')}
                  className="rounded-md bg-emerald-500 flex items-center justify-center cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 3: Grateful */}
                <div 
                  onClick={() => onNavigateToTab('checkin', 'gratitude')}
                  className="rounded-md bg-amber-400 flex items-center justify-center cursor-pointer"
                >
                  <Smile className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Micro Icon 4: Workbooks */}
                <div 
                  onClick={() => onNavigateToTab('learning', 'library')}
                  className="rounded-md bg-blue-500 flex items-center justify-center cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

            </div>
          </div>
          <span className="text-[11.5px] mt-1.5 text-[#6B7280] font-sans font-semibold tracking-wide">Wellness Utilities</span>
        </div>

      </div>

    </div>
  );
}
