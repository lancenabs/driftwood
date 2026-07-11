import React, { useState } from 'react';
import { Smartphone, BookOpen, Code, ShieldCheck, Home, Gamepad2, Sparkles, Heart, Moon, Sun, Library, CheckCircle, MessageSquare, Check, Settings, CheckSquare, GitMerge } from 'lucide-react';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import MicroLessonScreen from './components/MicroLessonScreen';
import CharacterSelectScreen from './components/CharacterSelectScreen';
import LiveScenarioPlayScreen from './components/LiveScenarioPlayScreen';
import DebriefScreen from './components/DebriefScreen';
import LibraryScreen from './components/LibraryScreen';
import SettingsScreen from './components/SettingsScreen';
import CrisisStrip from './components/CrisisStrip';
import GoalsDashboard from './components/GoalsDashboard';
import GenogramEditor from './components/GenogramEditor';
import { ScreenType, Character } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('onboarding');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [streak, setStreak] = useState(5);
  const [empathyScore, setEmpathyScore] = useState(85);
  const [safetyScore, setSafetyScore] = useState(100);
  const [xpEarned, setXpEarned] = useState(45);
  const [activeTab, setActiveTab] = useState<'app' | 'docs'>('app');
  const [isCalmMode, setIsCalmMode] = useState(false);

  // Simulation count & feedback states
  const [simulationCount, setSimulationCount] = useState<number>(() => {
    try {
      const val = localStorage.getItem('familyframe_simulation_count');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('familyframe_feedback_submitted') === 'true';
    } catch {
      return false;
    }
  });

  // Session history state for Recharts
  const [sessionHistory, setSessionHistory] = useState<{ session: number; empathy: number; safety: number }[]>(() => {
    try {
      const val = localStorage.getItem('familyframe_session_history');
      if (val) return JSON.parse(val);
    } catch {}
    return [
      { session: 1, empathy: 55, safety: 60 },
      { session: 2, empathy: 60, safety: 58 },
      { session: 3, empathy: 65, safety: 70 },
      { session: 4, empathy: 62, safety: 68 },
      { session: 5, empathy: 75, safety: 74 },
      { session: 6, empathy: 70, safety: 80 },
      { session: 7, empathy: 85, safety: 82 }
    ];
  });

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [impactfulScenario, setImpactfulScenario] = useState<string>('dirty-dishes');
  const [comments, setComments] = useState<string>('');
  const [matchesRealWorld, setMatchesRealWorld] = useState<boolean>(true);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const handleSubmitFeedback = () => {
    setSubmittedSuccess(true);
    setFeedbackSubmitted(true);
    try {
      localStorage.setItem('familyframe_feedback_submitted', 'true');
      localStorage.setItem('familyframe_feedback_rating', selectedRating);
      localStorage.setItem('familyframe_feedback_comments', comments);
      localStorage.setItem('familyframe_feedback_scenario', impactfulScenario);
      localStorage.setItem('familyframe_feedback_realworld', String(matchesRealWorld));
    } catch (e) {
      console.error(e);
    }
    
    setTimeout(() => {
      setShowFeedbackModal(false);
      setSubmittedSuccess(false);
    }, 2200);
  };

  const handleTriggerFeedbackModal = () => {
    setShowFeedbackModal(true);
    setSubmittedSuccess(false);
  };

  const handleIncrementSimulationCount = () => {
    const nextCount = simulationCount + 1;
    setSimulationCount(nextCount);
    try {
      localStorage.setItem('familyframe_simulation_count', String(nextCount));
    } catch {}
    
    if (nextCount >= 3 && !feedbackSubmitted) {
      setShowFeedbackModal(true);
    }
  };

  const handleResetFeedbackAndSimulations = () => {
    setSimulationCount(0);
    setFeedbackSubmitted(false);
    setShowFeedbackModal(false);
    setSubmittedSuccess(false);
    setSelectedRating('');
    setComments('');
    setImpactfulScenario('dirty-dishes');
    const initialHistory = [
      { session: 1, empathy: 55, safety: 60 },
      { session: 2, empathy: 60, safety: 58 },
      { session: 3, empathy: 65, safety: 70 },
      { session: 4, empathy: 62, safety: 68 },
      { session: 5, empathy: 75, safety: 74 },
      { session: 6, empathy: 70, safety: 80 },
      { session: 7, empathy: 85, safety: 82 }
    ];
    setSessionHistory(initialHistory);
    try {
      localStorage.removeItem('familyframe_simulation_count');
      localStorage.removeItem('familyframe_feedback_submitted');
      localStorage.removeItem('familyframe_feedback_rating');
      localStorage.removeItem('familyframe_feedback_comments');
      localStorage.removeItem('familyframe_feedback_scenario');
      localStorage.removeItem('familyframe_feedback_realworld');
      localStorage.removeItem('familyframe_feedback_dismissed');
      localStorage.setItem('familyframe_session_history', JSON.stringify(initialHistory));
    } catch {}
  };

  const handleCompleteLesson = () => {
    // Increment streak on lesson complete
    setStreak(prev => prev + 1);
    setActiveScreen('home');
  };

  const handleFinishSimulation = (finalEmpathy: number, finalSafety: number, finalXp: number) => {
    setEmpathyScore(finalEmpathy);
    setSafetyScore(finalSafety);
    setXpEarned(finalXp);
    
    const nextCount = simulationCount + 1;
    setSimulationCount(nextCount);
    try {
      localStorage.setItem('familyframe_simulation_count', String(nextCount));
    } catch (e) {
      console.error(e);
    }

    setSessionHistory(prev => {
      const nextSessionNum = prev.length + 1;
      const nextHist = [...prev, { session: nextSessionNum, empathy: finalEmpathy, safety: finalSafety }];
      const slicedHist = nextHist.slice(-10);
      try {
        localStorage.setItem('familyframe_session_history', JSON.stringify(slicedHist));
      } catch {}
      return slicedHist;
    });

    if (nextCount >= 3 && !feedbackSubmitted) {
      setShowFeedbackModal(true);
    }

    setActiveScreen('debrief');
  };

  const handleRestartSimulation = () => {
    if (selectedChar) {
      setActiveScreen('simulation');
    } else {
      setActiveScreen('char-select');
    }
  };

  return (
    <div className={`min-h-screen font-sans text-on-background flex flex-col transition-colors duration-300 ${isCalmMode ? 'theme-calm bg-surface-container' : 'bg-slate-50'}`}>
      {/* Top Header Row (Web & Desktop) */}
      <header className="w-full bg-white border-b border-outline-variant/30 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg text-primary tracking-tight">FamilyFrame</span>
                <span className="text-[10px] bg-secondary-container/35 text-on-secondary-container px-2 py-0.5 rounded-full font-bold border border-secondary/20">Accredited Co-op Play</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-medium">Couples & Family Therapy Game Spec Engine</p>
            </div>
          </div>

          {/* Segment control for mobile (hidden on large displays) */}
          <div className="flex md:hidden bg-surface-container rounded-xl p-1 border border-outline-variant/20 max-w-xs w-full">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex-1 font-display font-bold text-xs py-2 rounded-lg text-center transition-all cursor-pointer ${activeTab === 'app' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
            >
              Interactive App
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex-1 font-display font-bold text-xs py-2 rounded-lg text-center transition-all cursor-pointer ${activeTab === 'docs' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
            >
              Clinical Specs
            </button>
          </div>

          {/* Settings & Status Row */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* User Settings Palette Toggle Button */}
            <button
              id="theme-toggle-button"
              onClick={() => setIsCalmMode(!isCalmMode)}
              className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full text-xs font-bold border-2 border-outline-variant cursor-pointer shadow-3d-neutral hover:shadow-sm active:translate-y-[2px] transition-all"
              title="Toggle Day/Evening Theme"
            >
              {isCalmMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-secondary animate-pulse" />
                  <span>Calm Evening Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Vibrant Day Mode</span>
                </>
              )}
            </button>

            {/* Diagnostic Status (B2B check) */}
            <div className="hidden sm:flex items-center gap-2 bg-secondary/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-secondary-container border border-secondary/15 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Sandbox — on-device entries, no accounts, no recordings</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE SMARTPHONE EMULATOR (Col-span 5) */}
        <section className={`md:col-span-5 flex flex-col items-center ${activeTab === 'app' ? 'block' : 'hidden md:block'}`}>
          <div className="relative w-full max-w-[360px] aspect-[9/19.5] bg-[#161d1f] rounded-[48px] p-3 shadow-2xl border-[6px] border-[#3d4949] ring-8 ring-slate-200 overflow-hidden flex flex-col justify-between">
            
            {/* Phone Camera Notch & Status Row */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#161d1f] w-32 h-6 rounded-b-2xl z-40 flex items-center justify-between px-4">
              <span className="text-[10px] text-white font-bold">09:41</span>
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="flex gap-1 items-center">
                <span className="text-[10px] text-white">🔋</span>
              </div>
            </div>

            {/* Viewport content */}
            <div className={`flex-1 w-full rounded-[36px] overflow-y-auto no-scrollbar pt-8 pb-16 relative transition-colors duration-300 ${isCalmMode ? 'bg-surface-container-low text-on-surface' : 'bg-[#f4fafd]'}`}>
              {/* THE DV BRIGHT LINE — on every surface, above everything, forever. */}
              <div className="sticky top-0 z-40 -mt-8 mb-2"><CrisisStrip /></div>
              {activeScreen === 'onboarding' && (
                <OnboardingScreen onStart={() => setActiveScreen('home')} />
              )}
              {activeScreen === 'home' && (
                <HomeScreen 
                  onStartLesson={() => setActiveScreen('lesson')}
                  onEnterPractice={() => setActiveScreen('char-select')}
                  onViewGoals={() => setActiveScreen('goals')}
                  onViewGenogram={() => setActiveScreen('genogram')}
                  streak={streak}
                />
              )}
              {activeScreen === 'lesson' && (
                <MicroLessonScreen 
                  onBack={() => setActiveScreen('home')}
                  onComplete={handleCompleteLesson}
                />
              )}
              {activeScreen === 'char-select' && (
                <CharacterSelectScreen 
                  onBack={() => setActiveScreen('home')}
                  onSelectCharacter={(char) => {
                    setSelectedChar(char);
                    setActiveScreen('simulation');
                  }}
                />
              )}
              {activeScreen === 'simulation' && selectedChar && (
                <LiveScenarioPlayScreen 
                  character={selectedChar}
                  onBack={() => setActiveScreen('char-select')}
                  onFinishSimulation={handleFinishSimulation}
                  sessionHistory={sessionHistory}
                />
              )}
              {activeScreen === 'debrief' && (
                <DebriefScreen 
                  empathyScore={empathyScore}
                  safetyScore={safetyScore}
                  xpEarned={xpEarned}
                  sessionHistory={sessionHistory}
                  onDone={() => setActiveScreen('home')}
                  onRetry={handleRestartSimulation}
                />
              )}
              {activeScreen === 'library' && (
                <LibraryScreen />
              )}
              {activeScreen === 'settings' && (
                <SettingsScreen onBack={() => setActiveScreen('home')} />
              )}
              {activeScreen === 'goals' && (
                <GoalsDashboard onBack={() => setActiveScreen('home')} />
              )}
              {activeScreen === 'genogram' && (
                <GenogramEditor onBack={() => setActiveScreen('home')} />
              )}

              {/* Provide Feedback Modal Overlay inside the phone */}
              {showFeedbackModal && (
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-on-surface">
                  {submittedSuccess ? (
                    <div className="bg-white rounded-3xl border-2 border-outline-variant shadow-2xl p-6 w-full max-w-[290px] flex flex-col items-center justify-center gap-4 text-center text-[#4B4B4B] animate-scale-in">
                      <div className="w-14 h-14 bg-[#58CC02] rounded-full flex items-center justify-center text-white border-2 border-[#46A302] shadow-sm animate-bounce">
                        <CheckCircle className="w-8 h-8 text-white fill-white/10" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-sm text-[#4B4B4B]">Feedback Submitted!</h3>
                        <p className="font-sans text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                          Your reflections have been compiled and signed for clinician evaluation. Thank you for contributing to relational health!
                        </p>
                      </div>
                      <div className="text-[9px] font-mono bg-slate-50 p-2 rounded-xl text-primary border border-outline-variant w-full">
                        Rating: {selectedRating} | Scenario: {impactfulScenario === 'dirty-dishes' ? 'Dirty Dishes' : impactfulScenario === 'screen-time' ? 'Screen Time' : impactfulScenario === 'in-law-intrusion' ? 'In-Laws' : 'All Scenarios'}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border-2 border-outline-variant shadow-2xl p-4.5 w-full max-w-[310px] flex flex-col gap-3.5 text-[#4B4B4B] animate-scale-in">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-lg mx-auto mb-1">
                          💬
                        </div>
                        <h3 className="font-display font-black text-xs text-[#4B4B4B] uppercase tracking-wide">Simulation Feedback</h3>
                        <p className="font-sans text-[9px] text-on-surface-variant leading-relaxed">
                          You've completed {simulationCount} simulations! Help us optimize co-op learning.
                        </p>
                      </div>

                      {/* Rating Buttons */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[8px] font-black uppercase tracking-wider text-on-surface-variant">
                          Your simulation experience
                        </label>
                        <div className="flex justify-between gap-1">
                          {[
                            { emoji: '😣', label: 'Rough' },
                            { emoji: '😐', label: 'Meh' },
                            { emoji: '🙂', label: 'Helpful' },
                            { emoji: '🚀', label: 'Fun' },
                            { emoji: '💎', label: 'Valuable' },
                          ].map((rating, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedRating(rating.emoji)}
                              className={`flex-1 flex flex-col items-center py-1 rounded-lg border-2 transition-all cursor-pointer ${
                                selectedRating === rating.emoji
                                  ? 'border-primary bg-primary/5 scale-105 shadow-sm'
                                  : 'border-outline-variant hover:border-primary/50'
                              }`}
                            >
                              <span className="text-base leading-none">{rating.emoji}</span>
                              <span className="text-[6.5px] font-bold text-on-surface-variant mt-1">{rating.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scenario Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[8px] font-black uppercase tracking-wider text-on-surface-variant">
                          Most Impactful Scenario
                        </label>
                        <select
                          value={impactfulScenario}
                          onChange={(e) => setImpactfulScenario(e.target.value)}
                          className="w-full bg-slate-50 text-[10px] p-1.5 rounded-lg border border-outline-variant text-[#4B4B4B] focus:outline-none focus:border-primary font-sans"
                        >
                          <option value="dirty-dishes">The Dirty Dish Dilemma (Gottman)</option>
                          <option value="screen-time">The Screen Time Showdown (EFT)</option>
                          <option value="in-law-intrusion">The In-Law Intrusion (Systems)</option>
                          <option value="other">All Scenarios Felt Great</option>
                        </select>
                      </div>

                      {/* Text Feedback */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[8px] font-black uppercase tracking-wider text-on-surface-variant">
                          How did the scenarios feel?
                        </label>
                        <textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="E.g., The branching dialogue felt extremely real and validated my repair attempts..."
                          className="w-full bg-slate-50 text-[10px] p-2 rounded-lg border border-outline-variant h-12 focus:outline-none focus:border-primary font-sans resize-none placeholder-slate-400"
                        />
                      </div>

                      {/* Real World Check */}
                      <label className="flex items-start gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={matchesRealWorld}
                          onChange={(e) => setMatchesRealWorld(e.target.checked)}
                          className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary w-3 h-3"
                        />
                        <span className="font-sans text-[8px] text-on-surface-variant leading-tight">
                          These interactive dialogues felt authentic to real-world relationship tensions.
                        </span>
                      </label>

                      {/* Submit & Close */}
                      <div className="flex flex-col gap-1 pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleSubmitFeedback}
                          disabled={!selectedRating}
                          className={`w-full font-display font-black py-2 rounded-lg text-center border-b-[3px] text-[10px] transition-all cursor-pointer uppercase tracking-wider ${
                            selectedRating
                              ? 'bg-[#58CC02] text-white border-[#46A302] hover:brightness-105 active:translate-y-[1px] active:border-b-[1px]'
                              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                          }`}
                        >
                          Submit Feedback
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setShowFeedbackModal(false);
                            try {
                              localStorage.setItem('familyframe_feedback_dismissed', 'true');
                            } catch {}
                          }}
                          className="w-full text-center text-[9px] font-bold text-on-surface-variant hover:text-primary py-1 transition-colors cursor-pointer"
                        >
                          Skip for Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Navigation tab-bar shell (Duolingo Style) */}
            {activeScreen !== 'onboarding' && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md border-t border-outline-variant/30 rounded-b-[36px] h-14 z-30 flex justify-around items-center px-1">
                <div className="group relative flex-1 flex justify-center">
                  <button 
                    onClick={() => setActiveScreen('home')}
                    className={`flex flex-col items-center justify-center rounded-xl p-1 transition-all cursor-pointer ${activeScreen === 'home' ? 'text-primary font-bold bg-secondary-container/20 px-2' : 'text-on-surface-variant'}`}
                  >
                    <Home className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold font-display uppercase tracking-wider mt-0.5">Home</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[9px] font-sans font-normal rounded-xl p-2 shadow-xl w-36 text-center z-50 border border-neutral-800 leading-normal pointer-events-none">
                    <strong>Connected Home</strong><br />
                    Daily dashboard, goals & streaks.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
                  </div>
                </div>

                <div className="group relative flex-1 flex justify-center">
                  <button 
                    onClick={() => setActiveScreen('lesson')}
                    className={`flex flex-col items-center justify-center rounded-xl p-1 transition-all cursor-pointer ${activeScreen === 'lesson' ? 'text-primary font-bold bg-secondary-container/20 px-2' : 'text-on-surface-variant'}`}
                  >
                    <BookOpen className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold font-display uppercase tracking-wider mt-0.5">Lesson</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[9px] font-sans font-normal rounded-xl p-2 shadow-xl w-36 text-center z-50 border border-neutral-800 leading-normal pointer-events-none">
                    <strong>Interactive CBT</strong><br />
                    Bite-sized behavioral theory lessons.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
                  </div>
                </div>

                <div className="group relative flex-1 flex justify-center">
                  <button 
                    onClick={() => setActiveScreen('library')}
                    className={`flex flex-col items-center justify-center rounded-xl p-1 transition-all cursor-pointer ${activeScreen === 'library' ? 'text-primary font-bold bg-secondary-container/20 px-2' : 'text-on-surface-variant'}`}
                  >
                    <Library className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold font-display uppercase tracking-wider mt-0.5">Library</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[9px] font-sans font-normal rounded-xl p-2 shadow-xl w-36 text-center z-50 border border-neutral-800 leading-normal pointer-events-none">
                    <strong>Theory Directory</strong><br />
                    Explore top clinical couples methods.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
                  </div>
                </div>

                <div className="group relative flex-1 flex justify-center">
                  <button 
                    onClick={() => setActiveScreen('goals')}
                    className={`flex flex-col items-center justify-center rounded-xl p-1 transition-all cursor-pointer ${activeScreen === 'goals' ? 'text-primary font-bold bg-secondary-container/20 px-2' : 'text-on-surface-variant'}`}
                  >
                    <CheckSquare className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold font-display uppercase tracking-wider mt-0.5">Goals</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[9px] font-sans font-normal rounded-xl p-2 shadow-xl w-36 text-center z-50 border border-neutral-800 leading-normal pointer-events-none">
                    <strong>Accountability Goals</strong><br />
                    Review acts of love, chores, and objectives.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
                  </div>
                </div>

                <div className="group relative flex-1 flex justify-center">
                  <button 
                    onClick={() => {
                      if (selectedChar) {
                        setActiveScreen('simulation');
                      } else {
                        setActiveScreen('char-select');
                      }
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl p-1 transition-all cursor-pointer ${activeScreen === 'simulation' || activeScreen === 'char-select' || activeScreen === 'debrief' ? 'text-primary font-bold bg-secondary-container/20 px-2' : 'text-on-surface-variant'}`}
                  >
                    <Gamepad2 className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold font-display uppercase tracking-wider mt-0.5">Co-op</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[9px] font-sans font-normal rounded-xl p-2 shadow-xl w-36 text-center z-50 border border-neutral-800 leading-normal pointer-events-none">
                    <strong>Co-op Gym</strong><br />
                    Practice de-escalation drills.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
                  </div>
                </div>

                <div className="group relative flex-1 flex justify-center">
                  <button 
                    onClick={() => setActiveScreen('settings')}
                    className={`flex flex-col items-center justify-center rounded-xl p-1 transition-all cursor-pointer ${activeScreen === 'settings' ? 'text-primary font-bold bg-secondary-container/20 px-2' : 'text-on-surface-variant'}`}
                  >
                    <Settings className="w-4.5 h-4.5" />
                    <span className="text-[8px] font-bold font-display uppercase tracking-wider mt-0.5">Sync</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-neutral-900 text-white text-[9px] font-sans font-normal rounded-xl p-2 shadow-xl w-36 text-center z-50 border border-neutral-800 leading-normal pointer-events-none">
                    <strong>Family Sync</strong><br />
                    Centralized Family sync & sharing codes.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-semibold">
            💡 Click on buttons inside the emulator to test the flow!
          </p>
        </section>

        {/* RIGHT COLUMN: CLINICAL BLUEPRINT, SYSTEM PROMPTS, & JSON (Col-span 7) */}
        <section className={`md:col-span-7 flex flex-col gap-6 ${activeTab === 'docs' ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-3xl border-2 border-outline-variant p-6 text-sm text-slate-500 leading-relaxed">
            <p className="font-display font-black text-slate-700 mb-2">The blueprint moved below decks.</p>
            <p>Engineering and investor artifacts don't ride client-facing surfaces (house law). The build plan lives in <code>DRIFTWOOD_PLAN.md</code>; the story lives in <code>THE_TIDE_LINE.md</code>.</p>
          </div>
        </section>

      </main>

      {/* Aesthetic Footer */}
      <footer className="w-full bg-white border-t border-outline-variant/30 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-primary fill-primary" />
            <span className="font-display font-extrabold text-sm text-primary">FamilyFrame Project Sandbox</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed max-w-xl">
            This prototype demonstrates a full 6-screen UI flow. Visual palette inspired by clinical modern functionalism and Duolingo. Backed by fully formatted downloadable clinical product spec configurations.
          </p>
        </div>
      </footer>
    </div>
  );
}
