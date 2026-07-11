import { Character, MicroLesson, AgentSpec } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'sam',
    name: 'Sam',
    archetype: 'Resistant Partner',
    archetypeColor: 'text-rose-600 border-rose-200 bg-rose-50',
    archetypeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-700',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Likely to feel managed or nagged, quickly getting defensive. Requires a gentle, softened start-up and validation of their fatigue.',
    longDescription: 'Sam represents the classic pursuer-distancer dynamic where requests for chore completion are interpreted as micro-management or parental nagging. Sam responds best to authentic vulnerability and explicit reassurance of their autonomy.',
    difficulty: 3,
    scenario: 'The Dirty Dish Dilemma',
    challengeBeats: [
      {
        id: 1,
        npcStatement: "I just don't see why we need to do the dishes right now. I am exhausted from work, and you are always hovering and nagging about a few clean plates.",
        goalDescription: "Objective: Initiate with a Softened Start-up (focus on your feelings, state a positive need without blame).",
        options: [
          {
            text: "Why do I have to keep reminding you? You promised you'd do them, but you just sit on your phone while I do everything!",
            type: "criticism",
            xpReward: 5,
            empathyScore: 25,
            safetyScore: 30,
            feedback: "Sam rolls their eyes, crosses their arms, and pulls their phone back out. Defenses are fully up.",
            coachNudge: "This is a direct Criticism. Stating what your partner is doing wrong triggers immediate defensiveness. Try starting with 'I feel...' instead."
          },
          {
            text: "I feel really overwhelmed and anxious when I see the messy kitchen at the end of a long day, and I would love some support so we can both relax in a clean space. Can we do them together?",
            type: "soft-start",
            xpReward: 15,
            empathyScore: 95,
            safetyScore: 100,
            feedback: "Sam softens slightly, puts down their phone, and listens. They feel your vulnerability rather than a direct attack.",
            coachNudge: "Excellent! You started with your feeling ('I feel overwhelmed') and stated a positive need ('I would love some support') without placing blame."
          }
        ]
      },
      {
        id: 2,
        npcStatement: "Fine, but it's not like the kitchen is a biohazard. I was going to do them in an hour anyway. You're just so intense about everything.",
        goalDescription: "Objective: De-escalate and validate Sam's point of view before pushing for action.",
        options: [
          {
            text: "I'm not intense! I just don't want to wake up to sticky counters and ants. Why is it that whenever I ask for help, I'm the bad guy?",
            type: "defensiveness",
            xpReward: 5,
            empathyScore: 35,
            safetyScore: 40,
            feedback: "Sam sighs deeply. 'See? This is exactly what I mean. You always escalate everything into a huge fight.'",
            coachNudge: "This is Defensiveness. Returning an attack with a counter-attack keeps the conflict going. Try validating their need for autonomy first."
          },
          {
            text: "I know you're tired from work and want some downtime, and I really don't want to make you feel managed or rushed. It just helps me feel calm and sleep better when the kitchen is neat before bed.",
            type: "validation",
            xpReward: 15,
            empathyScore: 90,
            safetyScore: 95,
            feedback: "Sam nods reluctantly. 'Yeah, I guess that makes sense. I just hate feeling like I'm on a deadline the second I walk through the door.'",
            coachNudge: "Beautiful validation! You validated their perspective ('I know you are tired and want downtime') and re-stated your own need gently."
          }
        ]
      },
      {
        id: 3,
        npcStatement: "I guess I don't mind getting them done now if it helps you sleep better. But can we agree to let some of the smaller chores slide until the weekend?",
        goalDescription: "Objective: Reach a mutually agreeable compromise and offer repair/appreciation.",
        options: [
          {
            text: "Whatever, fine. Let's just do them. I don't want to turn this into another long debate.",
            type: "stonewalling",
            xpReward: 5,
            empathyScore: 30,
            safetyScore: 35,
            feedback: "Sam looks disappointed. They do the dishes, but a cold, silent distance remains between you.",
            coachNudge: "This is Stonewalling. It cuts off Sam's attempt at repair and compromise. Accept their offer with warm appreciation."
          },
          {
            text: "That sounds completely fair. Let's tackle the dishes together now for 5 minutes, and we'll leave the rest of the house for the weekend. Thank you for listening to me and being willing to compromise.",
            type: "effective",
            xpReward: 15,
            empathyScore: 100,
            safetyScore: 100,
            feedback: "Sam smiles and stands up. 'Deal. Let's get it done.' You feel a warm surge of relationship safety.",
            coachNudge: "Perfect! You accepted influence, validated their compromise, and expressed appreciation. This builds lasting emotional connection."
          }
        ]
      }
    ]
  },
  {
    id: 'alex',
    name: 'Alex',
    archetype: 'The Avoider',
    archetypeColor: 'text-indigo-600 border-indigo-200 bg-indigo-50',
    archetypeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Tends to withdraw or change the subject to escape high-stress conversations. Needs clear, gentle boundaries and non-threatening check-ins.',
    longDescription: 'Alex represents the avoidant coping style, where difficult emotional topics trigger freeze-or-flight reflexes. Alex responds best when conversations are broken down into small increments and when relationship safety is explicitly established.',
    difficulty: 4,
    scenario: 'The Silent Dinner Distraction',
    challengeBeats: [
      {
        id: 1,
        npcStatement: "I had a really busy day and I just want to scroll through my feed during dinner. Let's talk about our budget and family calendar some other time.",
        goalDescription: "Objective: Connect before correcting. Validate Alex's need for recovery, then state a gentle boundary.",
        options: [
          {
            text: "You always check out! We never talk about anything important anymore because you're constantly glued to your screen.",
            type: "criticism",
            xpReward: 5,
            empathyScore: 20,
            safetyScore: 30,
            feedback: "Alex shrugs and goes completely silent, tuning you out entirely. You've hit a stonewall.",
            coachNudge: "Using absolute terms like 'always' or 'never' is criticism. Alex withdraws further because the environment feels unsafe."
          },
          {
            text: "I completely understand needing to unwind after a heavy workday, and I want you to have that time. At the same time, dinner is our only chance to sync up. Can we do 10 minutes of screen-free connection, then you scroll?",
            type: "soft-start",
            xpReward: 15,
            empathyScore: 95,
            safetyScore: 100,
            feedback: "Alex locks eyes, puts the phone face-down, and sighs. 'Yeah, okay. I can do 10 minutes. What's on your mind?'",
            coachNudge: "Excellent job! You validated their fatigue first ('completely understand needing to unwind') and then proposed a structured, non-threatening check-in."
          }
        ]
      },
      {
        id: 2,
        npcStatement: "I just feel like every time we talk about our budget or schedule, it turns into a lecture on what I spent or what I forgot to sign up for. It makes me anxious.",
        goalDescription: "Objective: Reassure Alex of relationship safety and dismantle the 'lecture' dynamic.",
        options: [
          {
            text: "It wouldn't feel like a lecture if you were proactive and paid attention to our shared responsibilities once in a while!",
            type: "defensiveness",
            xpReward: 5,
            empathyScore: 30,
            safetyScore: 40,
            feedback: "Alex pushes their plate away. 'Forget it. I'm not doing this right now,' and walks away from the table.",
            coachNudge: "Defensiveness and counter-criticism confirm Alex's fear that this is a lecture. Try validating their anxiety and establishing teamwork."
          },
          {
            text: "I hear you, and I am so sorry I made you feel that way. That is not my goal. I don't want to lecture you; I want us to be a team. How can we make these check-ins feel safer and more collaborative for you?",
            type: "validation",
            xpReward: 15,
            empathyScore: 95,
            safetyScore: 95,
            feedback: "Alex looks relieved. 'I really appreciate you saying that. Maybe if we kept it to just one budget category at a time instead of everything at once.'",
            coachNudge: "Incredible! You validated their anxiety, apologized for the impact, and invited their collaboration. This lowers their flight response immediately."
          }
        ]
      },
      {
        id: 3,
        npcStatement: "If we can do a quick 5-minute check-in only on our grocery budget today, I can totally put my phone away and focus.",
        goalDescription: "Objective: Accept the offer, agree on the parameters, and celebrate a small victory.",
        options: [
          {
            text: "Well, only 5 minutes isn't really enough to solve our financial problems, but I guess it's better than nothing.",
            type: "ineffective",
            xpReward: 5,
            empathyScore: 40,
            safetyScore: 50,
            feedback: "Alex looks discouraged, feeling like their compromise was rejected. The motivation to participate next time drops.",
            coachNudge: "This is a 'yes, but' response. It dampens positive momentum. Try celebrating the win and accepting their influence."
          },
          {
            text: "That sounds like a perfect place to start. A focused 5 minutes on the grocery budget is a huge win for us. Let's do it, and thank you for being willing to step in with me.",
            type: "effective",
            xpReward: 15,
            empathyScore: 100,
            safetyScore: 100,
            feedback: "Alex smiles and puts their phone in their pocket. 'Awesome. Let's look at the sheet together.' You have successfully turned a withdrawal into connection.",
            coachNudge: "Fantastic! You accepted their influence, celebrated the realistic compromise, and expressed gratitude. This is how you rebuild safe relationship habits!"
          }
        ]
      }
    ]
  }
];

export const MICRO_LESSONS: MicroLesson[] = [
  {
    title: "The Magic 5:1 Ratio",
    subtitle: "The secret math behind happy, stable relationships.",
    gottmanRatioConcept: "Developed by relationship pioneer Dr. John Gottman, this clinical law states that stable, happy relationships require a minimum of 5 positive interactions (such as appreciation, validation, active listening, or gentle humor) for every single negative interaction during conflict. When you build this 'emotional bank account,' your relationship can survive hard conversations without fracturing.",
    tags: ["Gottman Method", "Emotional Capital", "Conflict Prevention"],
    gratitudePrompt: "Small deposits build lasting foundations. Send a quick appreciation note to your partner right now to add to your bank account!"
  },
  {
    title: "The Softened Start-up",
    subtitle: "How you start a conversation determines how it will end.",
    gottmanRatioConcept: "Gottman research shows that 96% of difficult conversations end on the same emotional note they began. A 'Harsh Start-up' (criticism, blaming, finger-pointing) triggers instant defensiveness. A 'Softened Start-up' follows three simple steps: 1) State what you feel, 2) State a specific situation (not a character flaw), and 3) State a positive need for support.",
    tags: ["CBT", "EFT Communication", "Assertive Needs"],
    gratitudePrompt: "Practice: Reframe a harsh comment ('You never clean!') into a Softened Start-up ('I feel overwhelmed by the clutter, can we clean for 5 mins?')."
  }
];

export const CLINICAL_AGENTS: AgentSpec[] = [
  {
    role: "Therapist Coach",
    systemPrompt: `You are the FamilyFrame AI Therapist Coach—a premier, clinical-grade digital therapeutic guide trained in John Gottman's Method Couples Therapy, Emotionally Focused Therapy (EFT), and Cognitive Behavioral Therapy (CBT). Your purpose is to evaluate and support users during active relationship conflict simulations, promoting emotional safety, repair, and deep validation.

## 1. THEORETICAL & CLINICAL FOUNDATIONS
- **Gottman Method**: Enforce the Magic 5:1 ratio (5 positive exchanges to 1 negative during a dispute). Train the user to recognize and dismantle the Four Horsemen (Criticism, Defensiveness, Contempt, Stonewalling). Prioritize Softened Start-ups (stating a feeling, describing a specific neutral situation, expressing a positive need without blame). Ensure Repair Attempts are highlighted and celebrated.
- **Emotionally Focused Therapy (EFT)**: Map attachment cycles (Pursuer-Distancer loops). Help users identify the primary vulnerable emotion (e.g., loneliness, exhaustion, fear of abandonment) behind the secondary protective reaction (anger, withdrawal).
- **Cognitive Behavioral Therapy (CBT)**: Support cognitive restructuring of automatic negative attributions (e.g., "Sam is lazy" -> "Sam is tired and feels overwhelmed by work, interpreting my chore reminders as nagging").

## 2. DYNAMIC EVALUATION PIPELINE
Calculate and provide the following metrics on every dialogue transaction:
1. **Empathy Index (0-100%)**: Based on how accurately the user recognizes, names, and validates the partner's primary vulnerable attachment needs.
2. **Relationship Safety (0-100%)**: Measures the absence of critical, defensive, or contemptuous language and the presence of collaborative framing, softened starters, and accepted compromises.

## 3. SUPPORTIVE & CONSTRUCTIVE FEEDBACK GUIDELINES
- ALWAYS validate the user's positive intentions. Maintain a warm, encouraging, clinical-grade tone. Use supportive, trauma-informed terminology.
- **On Criticism/Defensiveness**: Explain the psychological and neurological impact. Example: "Choosing a counter-critique triggers the fight-or-flight centers in your partner's brain, immediately raising their heart rate and shutting down active listening."
- **On Softened Start-ups/Validation**: Praise linguistic specificity. Example: "Superb! By stating 'I feel overwhelmed when I see a messy kitchen,' you took responsibility for your emotional experience, keeping your partner's defenses low and inviting collaborative problem-solving."

## 4. DYNAMIC LESSON INTEGRATION
Incorporate reference to completed lessons (e.g., 'The Magic 5:1 Ratio' and 'The Softened Start-up') into your coaching nudges. Recommend practical homework based on user performance.
- If the user relies on critical phrasing: "Complete the 'Softened Start-up' lesson again to practice framing requests through 'I' statements."
- If the user fails to validate: "Re-read the 'Magic 5:1 Ratio' concept card to understand how validation forms the emotional floor of safe compromises."

## 5. DESIGN FOR CLOUD LLMs (PROMPT ENGINEERING INSTRUCTIONS)
- **Temperature**: 0.3 for consistent, high-fidelity clinical logic.
- **Input Variables**: Takes {dialogue_history}, {user_last_choice}, {completed_lessons_metadata}, {active_character_profile}.
- **Output Schema**: Return a structured JSON containing:
  - empathyScore: [integer, 0-100]
  - safetyScore: [integer, 0-100]
  - emotionalValidationStatement: [string, deeply warm validation of partner's state]
  - clinicalAnalysis: [string, detailing Gottman/EFT loop dynamics]
  - coachRecommendation: [string, clear actionable next steps matching active lesson context]`,
    temperature: 0.3
  },
  {
    role: "Simulation NPC (Defensive Partner)",
    systemPrompt: `You play the role of 'Sam', a highly resistant, defensive partner in a couples simulation. 
RULES OF BEHAVIOR:
1. You feel constantly managed, parented, or nagged. 
2. If the user starts with criticism, you MUST react with defensiveness, counter-criticism, or stonewalling. State things like: 'I'm always the one who does everything wrong,' or 'You're just hovering and waiting for me to fail.'
3. If the user starts with a Softened Start-up (vulnerability, stating a positive need without blame), you MUST immediately soften your posture, drop your phone, look up, and express your core feeling of fatigue or fear.
4. Keep responses brief, conversational, and raw, mimicking a real, high-tension home environment.`,
    temperature: 0.5
  },
  {
    role: "Conflict Analyzer",
    systemPrompt: `You are the Conflict Analyzer backend. You analyze dialogue transcripts to calculate the Empathy Index, Safety Score, and specific conflict markers.
RULES OF ANALYSIS:
1. Look for Gottman's 'Four Horsemen': Criticism, Contempt, Defensiveness, Stonewalling.
2. Look for positive repair attempts, validations, accepting influence, and 'I' statements.
3. Output a precise quantitative score out of 100 for Empathy and Safety, along with a 2-sentence therapeutic summary of the conflict trajectory.`,
    temperature: 0.1
  }
];

