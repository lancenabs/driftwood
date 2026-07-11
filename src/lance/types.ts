export type TabType = 'checkin' | 'learning' | 'practice' | 'activity' | 'analyze';

export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  items: string[]; // exactly 3 things
  emotionalSummary?: string;
  sentimentLabel?: string;
  sentimentScore?: number;
  wasVoiceUsed?: boolean;
}

export interface MoodLog {
  date: string; // YYYY-MM-DD
  score: number; // 1 (Low) to 5 (Great)
  label: string; // 'Low' | 'Down' | 'Okay' | 'Good' | 'Great'
  note?: string;
  emotionalSummary?: string;
  sentimentLabel?: string;
  sentimentScore?: number;
  wasVoiceUsed?: boolean;
  voiceNote?: string; // base64 encoded audio note
}

export interface DreamAnalysis {
  interpretation: string;
  archetypes: string[];
  emotionalTone: string;
  actionableTip: string;
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  duration: number; // sleep duration in hours (e.g. 7.5)
  qualityScore: number; // 1 to 10
  dreamLog?: string; // dream notes
  notes?: string;
  dreamAnalysis?: DreamAnalysis;
}

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  sleep: 'low' | 'medium' | 'high' | null; // represented as negative/neutral/positive emojis
  exercise: boolean;
  social: boolean;
  medication: boolean;
  mealsCompleted: number; // 0 to 3
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  category: string;
  duration?: string;
  countInfo?: string;
  contentMarkdown?: string;
  audioUrl?: string;
  practiceTab?: string;
  practiceSubTab?: string;
}

export interface ActivityReminder {
  id: string;
  activity: string;
  time: string;
  enabled: boolean;
}

export interface CouplesLogEntry {
  id: string;
  date: string; // YYYY-MM-DD or Date
  type: 'activity' | 'checkin' | 'milestone' | 'appreciation';
  title: string;
  description: string;
  partnerNames?: string[]; // e.g. ["Alex", "Jamie"]
  metadata?: Record<string, any>;
}

export interface SobrietyCheckin {
  date: string; // YYYY-MM-DD
  cravingLevel: number; // 0 to 10
  triggers: string[]; // e.g. ["Stress", "Social Pressures", "Fatigue", "Anxiety"]
  supportContactSought: boolean;
  notes: string;
}

export interface RelapsePreventionPlan {
  sobrietyDate: string; // YYYY-MM-DD or empty
  reasonsForSobriety: string[];
  mainTriggers: string[];
  copingStrategies: string[];
  safeContacts: string[];
}

export interface NutritionMealLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: string; // Description of meals eaten
  moodRating: number; // 1 to 5 post-meal mood
  energyLevel: number; // 1 to 5 post-meal energy
  anxietyLevel: number; // 1 to 5 post-meal anxiety
  tags: string[]; // e.g., ["Caffeine", "Sugar", "Heavy Carbs", "Lean Protein", "Veggies", "Fermented", "Processed"]
  notes?: string;
}

export interface EscapeLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  entryText: string;
  lanceSpeech?: string;
  internSpeech?: string;
  lanceAcronym?: string;
  activeActName?: string;
}

export interface MorningActivationEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dailyGoal: string;
  selfKindness: string;
  completedGoal: boolean;
  completedKindness: boolean;
  timestamp: string;
}



