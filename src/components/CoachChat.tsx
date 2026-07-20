import React, { useState, useEffect, useRef } from 'react';
import LiquidOrb from './LiquidOrb';
import { aiHeaders } from '../lib/aiKey';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  Heart, 
  ShieldAlert, 
  User, 
  Compass, 
  BookOpen,
  WifiOff,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  {
    topic: "Four Horsemen",
    question: "My partner gets defensive when I bring up chores. How do I use a soft start-up?",
    icon: "🩹"
  },
  {
    topic: "EFT Attachment Loop",
    question: "We are stuck in a pursuer-withdrawer cycle. How do we slow down the reaction?",
    icon: "🔄"
  },
  {
    topic: "Gottman Flooding",
    question: "I get overwhelmed and shut down during conflicts. How can we practice physiological self-soothing?",
    icon: "🧘"
  },
  {
    topic: "PACT Couple Bubble",
    question: "How do we draft our first Couple Bubble agreements to protect relationship safety?",
    icon: "🫧"
  }
];

const OFFLINE_CLINICAL_GUIDES: Record<string, string> = {
  "Four Horsemen": `### Gottman Antidote: The Gentle Start-up
When you are offline, remember these three core components to formulate a soft start-up:
1. **Share how you feel:** Describe your internal state rather than analyzing your partner ("I feel overwhelmed/anxious/sad").
2. **About what specific situation:** Describe the concrete facts, not general characters ("about the dishes in the sink").
3. **State a positive need:** Ask for what you *do* want, rather than what you *don't* want ("Would you be willing to help clear them tonight?").

*Anti-pattern to avoid:* "You always leave the kitchen a disaster." (Criticism - triggers defensiveness).`,
  
  "EFT Attachment Loop": `### Emotionally Focused Therapy: Slowing the Cycle
In EFT, conflict is viewed as a protest against disconnection. When stuck in a loop offline, try these steps:
1. **Acknowledge the cycle itself:** "We are getting caught in our pattern where I push and you step away."
2. **Identify primary vulnerability:** Look beneath the anger. Are you feeling lonely, scared of drifting, or feeling inadequate?
3. **Share the trigger safely:** "When I don't hear back, I start to worry that I don't matter to you. I miss you."`,

  "Gottman Flooding": `### physiological Self-Soothing (Flooding Antidote)
If your heart rate exceeds 100 BPM, constructive conversation is biologically impossible:
1. **Declare a formal timeout:** "I am feeling flooded. I need a 20-minute break to calm down, but I promise we will finish this conversation when I return."
2. **Physically separate:** Sit in separate rooms. Do NOT rehearse the argument in your head.
3. **Active soothing:** Practice slow diaphragmatic breathing (inhale 4s, hold 4s, exhale 6s), read a book, or listen to calming music.`,

  "PACT Couple Bubble": `### PACT: Constructing the Couple Bubble
The PACT model stresses that the couple must operate as a secure-functioning team:
1. **Primary Alliance:** Make a pact that you come first to each other. No secrets or triangulation with friends/family.
2. **Public Alignment:** Present a unified front. Never criticize your partner in front of others.
3. **Soothing Covenants:** Commit to eye-contact reunions, physical hugs when returning home, and keeping bedrooms a sacred digital-free sanctuary.`
};

export default function CoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('driftwood_jumble_chat_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        // Fall back to default greeting
      }
    }
    return [
      {
        id: 'greet-1',
        role: 'model',
        content: `Welcome to **CoachChat**. I am your relationship counselor assistant, trained in evidence-based Gottman Method, Emotionally Focused Therapy (EFT), and PACT models.

Ask me about communication blocks, repair scripts, attachment styles, or how to de-escalate tension. What relational question is on your mind today?`,
        timestamp: new Date()
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync offline mode with parent state if available in localStorage
  useEffect(() => {
    const checkOffline = () => {
      // We can check if parent simulated offline mode is set
      const savedOffline = localStorage.getItem('driftwood_seachest_kept_v1'); // just dummy check or we can monitor a specific storage key
      // Let's also listen to standard navigator offline state
      setIsOfflineMode(!navigator.onLine);
    };
    checkOffline();
    window.addEventListener('online', checkOffline);
    window.addEventListener('offline', checkOffline);
    return () => {
      window.removeEventListener('online', checkOffline);
      window.removeEventListener('offline', checkOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('driftwood_jumble_chat_v1', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Check if offline to use clinical offline guide matching
    if (isOfflineMode) {
      setTimeout(() => {
        let matchingAnswer = `It looks like you are currently **offline**. 

While offline, I cannot connect to the clinical cloud to generate custom responses. However, here is some expert offline relationship guidance related to communication:

### Tactical Compassionate Tips:
* **The 20-Minute Rule:** If you are in high conflict, pause for 20 minutes to self-soothe. Your pulse needs to descend to think clearly.
* **Use "I" Statements:** Frame issues around your internal feelings rather than placing blame ("I feel worried about our budget" vs. "You are spending too much").
* **Seek Core Needs:** Underneath criticism is a cry for attachment safety. Try to ask: "What does my partner need to feel safe right now?"`;

        // See if query matches any keywords
        const lowerText = textToSend.toLowerCase();
        if (lowerText.includes('horsemen') || lowerText.includes('critic') || lowerText.includes('defens')) {
          matchingAnswer = OFFLINE_CLINICAL_GUIDES["Four Horsemen"];
        } else if (lowerText.includes('eft') || lowerText.includes('cycle') || lowerText.includes('pursu') || lowerText.includes('withdraw')) {
          matchingAnswer = OFFLINE_CLINICAL_GUIDES["EFT Attachment Loop"];
        } else if (lowerText.includes('flood') || lowerText.includes('shut down') || lowerText.includes('sooth')) {
          matchingAnswer = OFFLINE_CLINICAL_GUIDES["Gottman Flooding"];
        } else if (lowerText.includes('bubble') || lowerText.includes('pact') || lowerText.includes('agreement')) {
          matchingAnswer = OFFLINE_CLINICAL_GUIDES["PACT Couple Bubble"];
        }

        const modelMsg: ChatMessage = {
          id: `msg-${Date.now()}-m`,
          role: 'model',
          content: matchingAnswer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);
        setIsLoading(false);
      }, 900);
      return;
    }

    try {
      // Call our secure server endpoint
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: aiHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-10) // Send last 10 messages for conversational context
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with our clinical chat server.");
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        id: `msg-${Date.now()}-m`,
        role: 'model',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error: any) {
      console.error("CoachChat Client Error:", error);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        content: `⚠️ **Clinical Network Interrupted**: I experienced an issue talking with the advisor service. Please check your internet connection or try again shortly.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Would you like to clear your conversation history with CoachChat?")) {
      const defaultGreet: ChatMessage = {
        id: 'greet-1',
        role: 'model',
        content: `Welcome to **CoachChat**. I am your relationship counselor assistant, trained in evidence-based Gottman Method, Emotionally Focused Therapy (EFT), and PACT models.

Ask me about communication blocks, repair scripts, attachment styles, or how to de-escalate tension. What relational question is on your mind today?`,
        timestamp: new Date()
      };
      setMessages([defaultGreet]);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-[#4B4B4B] animate-fade-in" id="coach-chat-container">
      
      {/* Immersive Chat Header — the Jumble's village behind the glass */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 rounded-[2.2rem] shadow-sm flex justify-between items-center relative overflow-hidden">
        <img src="/shore/jumble_village.jpg" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF6EA7]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3 relative">
          {/* The guide's face — the ecosystem's shared orb, in Driftwood's warm-wood
              alloy. It churns while the coach is thinking. */}
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md border border-white/20 grid place-items-center bg-[#2a1a0e]">
            <LiquidOrb size={40} tint="wood" busy={isLoading} />
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[#FF6EA7]">Evidence-Based Advisory</span>
            <h4 className="font-display font-black text-sm text-white leading-tight mt-0.5">Clinical CoachChat</h4>
            <p className="text-[10px] text-stone-300 font-sans mt-0.5 max-w-[280px]">
              Instant, non-judgmental guidance rooted in Gottman & EFT methodologies.
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {isOfflineMode && (
            <span className="bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/30 px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 animate-pulse">
              <WifiOff size={10} /> Local Mode
            </span>
          )}
          <button
            onClick={clearChat}
            className="p-2 hover:bg-stone-800 rounded-full text-stone-300 hover:text-white transition cursor-pointer"
            title="Reset Chat Session"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left column: Chat History messages area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white border-2 border-stone-200/80 rounded-[2rem] overflow-hidden min-h-[480px] max-h-[550px]">
          
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 select-text">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-[11px] ${
                    isUser 
                      ? 'bg-stone-100 border-stone-200 text-stone-600' 
                      : 'bg-stone-900 border-stone-800 text-white'
                  }`}>
                    {isUser ? <User size={12} /> : '🩺'}
                  </div>

                  {/* Message bubble */}
                  <div className={`rounded-2xl p-3 text-[11px] leading-relaxed font-sans ${
                    isUser 
                      ? 'bg-stone-900 text-white rounded-tr-none' 
                      : 'bg-stone-50 text-stone-800 border border-stone-100 rounded-tl-none shadow-sm'
                  }`}>
                    {/* Render basic markdown tags for headers and bold text */}
                    <div className="whitespace-pre-wrap">
                      {msg.content.split('\n').map((paragraph, pIdx) => {
                        let text = paragraph;
                        
                        // Parse simple bold markdown **text**
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        const boldParts = [];
                        let lastIndex = 0;
                        let match;
                        
                        while ((match = boldRegex.exec(text)) !== null) {
                          if (match.index > lastIndex) {
                            boldParts.push(text.substring(lastIndex, match.index));
                          }
                          boldParts.push(<strong key={match.index} className="font-bold">{match[1]}</strong>);
                          lastIndex = boldRegex.lastIndex;
                        }
                        if (lastIndex < text.length) {
                          boldParts.push(text.substring(lastIndex));
                        }

                        // Determine if it is a markdown header
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h5 key={pIdx} className="font-display font-black text-xs text-stone-900 mt-3 mb-1.5 first:mt-0 uppercase tracking-tight flex items-center gap-1">
                              <Sparkles size={11} className="text-[#FF6EA7]" /> {paragraph.replace('### ', '')}
                            </h5>
                          );
                        } else if (paragraph.startsWith('## ')) {
                          return (
                            <h4 key={pIdx} className="font-display font-black text-xs text-stone-900 mt-4 mb-2 first:mt-0 border-b border-stone-100 pb-1 uppercase tracking-wider">
                              {paragraph.replace('## ', '')}
                            </h4>
                          );
                        } else if (paragraph.startsWith('* ')) {
                          return (
                            <li key={pIdx} className="ml-3 pl-1 list-disc text-stone-700 my-1">
                              {boldParts.length > 0 ? boldParts : text.substring(2)}
                            </li>
                          );
                        }

                        return (
                          <p key={pIdx} className="mb-2 last:mb-0">
                            {boldParts.length > 0 ? boldParts : text}
                          </p>
                        );
                      })}
                    </div>
                    
                    {/* Subtle micro timestamp */}
                    <div className={`text-[8px] mt-1.5 font-mono ${isUser ? 'text-stone-400 text-right' : 'text-stone-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] self-start animate-pulse">
                <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-[11px] shrink-0">
                  🩺
                </div>
                <div className="bg-stone-50 text-stone-500 border border-stone-100 rounded-2xl rounded-tl-none p-3 text-[11px] font-sans flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-stone-400 italic font-mono text-[9px]">Synthesizing Gottman & EFT methodologies...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input footer */}
          <div className="p-3 bg-stone-50/50 border-t border-stone-200 flex gap-2 items-center">
            <input
              type="text"
              placeholder={isOfflineMode ? "Ask keyword 'Horsemen', 'EFT', 'Flooding', or 'Bubble' for offline tips..." : "Describe a relationship tension, communication block, or ask a question..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputMessage);
                }
              }}
              className="flex-1 bg-white border border-stone-200 focus:border-stone-400 focus:outline-none rounded-xl px-3 py-2 text-[11px] text-stone-700 placeholder-stone-400"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-2 rounded-xl text-white transition shrink-0 cursor-pointer ${
                !inputMessage.trim() || isLoading 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              <Send size={13} />
            </button>
          </div>

        </div>

        {/* Right column: Seeded/Suggested clinical questions & disclaimers (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Preset templates list card */}
          <div className="bg-white p-4 rounded-[2rem] border-2 border-stone-200/80 shadow-sm flex flex-col gap-3">
            <h5 className="font-display font-black text-xs text-stone-800 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle size={13} className="text-[#FF6EA7]" /> Practice Starters
            </h5>
            <p className="text-[10px] text-stone-500 leading-relaxed font-sans mt-0.5">
              Select one of these evidence-based relational prompts to immediately seek advice from CoachChat:
            </p>

            <div className="flex flex-col gap-2 mt-1">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(q.question);
                    handleSendMessage(q.question);
                  }}
                  disabled={isLoading}
                  className="bg-stone-50 hover:bg-stone-100/80 border border-stone-200/60 hover:border-stone-300 text-left p-2.5 rounded-xl transition flex gap-2.5 items-start cursor-pointer group disabled:opacity-55"
                >
                  <span className="text-xs shrink-0 bg-white border border-stone-100 p-1 rounded-lg shadow-sm">
                    {q.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8.5px] font-mono font-black uppercase text-stone-400 tracking-wider">
                      {q.topic}
                    </span>
                    <p className="text-[10px] text-stone-600 font-sans font-medium line-clamp-2 mt-0.5 leading-snug group-hover:text-stone-900">
                      {q.question}
                    </p>
                  </div>
                  <ChevronRight size={12} className="text-stone-300 group-hover:text-stone-500 self-center shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer Warning Panel */}
          <div className="bg-[#FFF9E6] border border-[#FFE899] p-4 rounded-[2rem] flex flex-col gap-2">
            <h5 className="font-display font-black text-[10px] text-[#B28200] uppercase tracking-tight flex items-center gap-1.5">
              <ShieldAlert size={12} /> CLINICAL BOUNDS DISCLAIMER
            </h5>
            <p className="text-[10px] text-[#805E00] leading-relaxed font-sans">
              CoachChat provides automated educational resources based on clinical methodologies to enhance relational mindfulness. It is not an alternative to professional medical advice, diagnosing emotional disorders, or in-person couples therapy.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
