export type ScreenType = 'onboarding' | 'home' | 'lesson' | 'char-select' | 'simulation' | 'debrief' | 'docs' | 'library' | 'settings' | 'goals' | 'genogram';

export interface Choice {
  text: string;
  type: 'criticism' | 'defensiveness' | 'contempt' | 'stonewalling' | 'soft-start' | 'validation' | 'effective' | 'ineffective';
  xpReward: number;
  empathyScore: number;
  safetyScore: number;
  feedback: string;
  coachNudge: string;
}

export interface SimulationBeat {
  id: number;
  npcStatement: string;
  goalDescription: string;
  options: Choice[];
}

export interface Character {
  id: 'sam' | 'alex';
  name: string;
  archetype: string;
  archetypeColor: string;
  archetypeBg: string;
  avatarUrl: string;
  description: string;
  longDescription: string;
  difficulty: number;
  scenario: string;
  challengeBeats: SimulationBeat[];
}

export interface MicroLesson {
  title: string;
  subtitle: string;
  gottmanRatioConcept: string;
  tags: string[];
  gratitudePrompt: string;
}

export interface AgentSpec {
  role: string;
  systemPrompt: string;
  temperature: number;
}

export interface DataModelSketch { // dev sketch — makes no compliance claim
  table: string;
  fields: { name: string; type: string; securityEncryption: string; description: string }[];
}
