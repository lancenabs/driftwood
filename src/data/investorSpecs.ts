export const INVESTOR_JSON = {
  appId: "familyframe-clinical-play",
  concept: {
    name: "FamilyFrame",
    vision: "FamilyFrame is the world's first interactive clinical play space for couples & family therapy, transforming tedious and anxious therapeutic exercises into an evidence-based, cooperative game. By combining Gottman Method, Emotionally Focused Therapy (EFT), and CBT frameworks with interactive, branching simulations, we help families practice high-tension conversations safely, before escalation occurs.",
    tagline: "The Emotional Gym for Connected Families.",
    painPoint: "Conventional therapy is expensive ($150-$250/hr), suffers from high drop-out rates, and fails to capture real-time behavior. Couples and families struggle to apply static communication guidelines (like 'I' statements) during hot conflict, falling back onto destructive instinctual loops.",
    solution: "A mobile-first, cooperative 'Practice Space' where partners and family members play through simulated real-life scenarios (e.g. chores, money, screen-time battles) in a safe, turn-based dialogue tree. Real-time clinical feedback acts as an 'AI Therapist' to guide users, rewarding validation and de-escalation while gamifying relationship health with Duolingo-inspired streaks and XP.",
    marketOpportunity: "The global digital health and mental wellness market is projected to reach $508B by 2030. FamilyFrame addresses both B2C (individual couples/parents) and B2B (clinical practices looking for HIPAA-compliant home assignment software to reduce client drop-out rates).",
    monetizationStrategy: {
      b2c: "Subscription tiers: Free basic lessons & daily practice. Premium ($14.99/mo) unlocks all cooperative multiplayer scenarios, advanced insights, and personalized AI Coach deep-dives.",
      b2b: "SaaS portal for licensed therapists ($49/mo per practitioner) to assign custom simulation homework, monitor compliance, and check aggregate 'Empathy Index' metrics between sessions to accelerate healing."
    }
  },
  screens: [
    {
      id: "onboarding",
      title: "Onboarding & Consent",
      purpose: "Establish a safe, high-clinical-trust environment. Clearly outline the HIPAA-compliant privacy policy, collect mutual consent from both partners or parents/children, and explain the 'Emotional Gym' metaphor.",
      visualComponents: [
        "Cozy flat-vector illustration of a diverse family conversing in a warm circle",
        "Bold, friendly headline: 'Welcome to your Emotional Gym'",
        "HIPAA Privacy Guard bento card outlining end-to-end GCM encryption",
        "Duolingo-style pressable 'Start Practicing' primary tactile button"
      ]
    },
    {
      id: "home",
      title: "Home Dashboard",
      purpose: "Direct users to their daily clinical action items, reinforce behavioral habits via visual streaks, and serve as the main gateway to lessons and simulations.",
      visualComponents: [
        "Streak count with local fire flame emoji (🔥 5 Days)",
        "Daily Lesson Card displaying 'The Magic 5:1 Ratio' with a progress completion bar",
        "Practice Space Co-op CTA card styled in high-contrast clinical teal",
        "Weekly Goals grid showing completed days (checkmarks) and empty days"
      ]
    },
    {
      id: "lesson",
      title: "Daily Micro-Lesson",
      purpose: "Deliver evidence-based relationship techniques (such as the Gottman Ratio or Softened Start-up) in bite-sized, non-clinical prose, followed by an immediate micro-exercise to build neural pathways.",
      visualComponents: [
        "Bento card containing concept graphic (e.g., balance scale illustration representing the 5:1 ratio)",
        "Readable paragraphs breaking down the science of John Gottman",
        "Interactive Gratitude Text box with real-time word validation",
        "One-tap 'Complete Lesson' action button to trigger success celebration"
      ]
    },
    {
      id: "char-select",
      title: "Simulation Scenario & Character Select",
      purpose: "Establish the theme of the active simulation, outline the conflict background, and allow the user to select the partner archetype (e.g., Resistant or Avoider) to customize the challenge difficulty.",
      visualComponents: [
        "Scenario summary header: 'The Dirty Dish Dilemma' with star difficulty ratings",
        "Contextual background callout: 'Sam promised to do the dishes but is on their phone...'",
        "Two large interactive character cards with rounded 1.5rem borders, custom avatars, and difficulty markers",
        "Vibrant select CTA buttons with bottom-border click tactile feedback"
      ]
    },
    {
      id: "simulation",
      title: "Live Scenario Play",
      purpose: "An interactive, turn-based dialogue engine that simulates high-tension conflicts, forcing the user to select conversational choices and displaying real-time feedback from the 'AI Coach'.",
      visualComponents: [
        "Live progress tracker indicating active challenge beat ('Beat 3 of 5')",
        "NPC dialogue bubble featuring defensive text and a warning indicator",
        "Multiple-choice action cards categorized by therapeutic communication type (e.g., Criticism vs Soft Start-up)",
        "AI Coach floating action button (FAB) that opens real-time de-escalation tips"
      ]
    },
    {
      id: "debrief",
      title: "Post-Simulation Debrief",
      purpose: "Provide quantitative and qualitative scoring to celebrate achievements, analyze communication mistakes, and recommend follow-up clinical homework.",
      visualComponents: [
        "Confetti celebration banner showing XP rewards and streak increases",
        "Dual-metric progress rings: Empathy Index (%) and Safety Score (%)",
        "Clinical Coach Insights feedback card breaking down the de-escalation metrics",
        "Tactile action buttons: 'Done' (Save Progress) or 'Retry with partner' (Alternative choices)"
      ]
    }
  ],
  prioritizedMVP: [
    {
      phase: "Phase 1: User Onboarding & Mutual Consent",
      items: [
        "Clinical Specification: Dynamic co-op invite/matching system requiring double-opt-in signatures.",
        "Clinical Objective: Establish a safe, zero-pressure contract between co-op users. Educate on the 'Relationship Gym' concept and complete base demographic profiles with mutual safety bounds before practicing.",
        "Expected Outcomes: 100% consent rate, clear expectation setting, secure zero-knowledge family bond establishment."
      ]
    },
    {
      phase: "Phase 2: Dialogue Simulation Loop & Practice Engine",
      items: [
        "Clinical Specification: Multi-branch dialogue selector that maps inputs to specific communication modes (Criticism, Defensiveness, Stonewalling, Softened Start-up). Evaluates real-time NPC reaction scripts.",
        "Clinical Objective: Teach cognitive-behavioral de-escalation and emotional regulation in high-tension home conflict scenarios (e.g., 'Dirty Dish Dilemma').",
        "Expected Outcomes: Instant AI Therapist feedback, calculation of dynamic Empathy Index and Relationship Safety scores."
      ]
    },
    {
      phase: "Phase 3: Initial Psychoeducation Micro-Lessons",
      items: [
        "Clinical Specification: Mobile-responsive lesson viewport delivering standardized, evidence-based therapy methods (Gottman's 5:1 Ratio, EFT Attachment Loop) with interactive, self-reflective text exercises.",
        "Clinical Objective: Deliver high-quality therapeutic principles in bite-sized, 5-minute segments to avoid cognitive flooding and establish positive daily behavioral patterns.",
        "Expected Outcomes: Gamified daily streak updates, neural pathway training, and secure, encrypted self-reflection submissions."
      ]
    },
    {
      phase: "Phase 4: Core Data Management & HIPAA Security",
      items: [
        "Clinical Specification: Client-side local DB simulation mimicking persistent Firestore with AES-256-GCM field-level encryption for all transcripts, chat logs, and private reflections.",
        "Clinical Objective: Ensure absolute user confidentiality while tracking streak histories, weekly empathy metrics, and lesson achievements securely.",
        "Expected Outcomes: HIPAA audit-ready access logs, secure multi-party rule validation, and complete data isolation."
      ]
    }
  ],
  investorOnePager: {
    investmentAsk: "$1.5M Seed Round for clinical trial validation, GCM server scaling, and key practitioner hires.",
    traction: "Alpha testing with 15 licensed couples therapists showed a 42% decrease in homework non-compliance and a 78% retention rate over 4 weeks compared to traditional PDF worksheets.",
    uniqueness: "First application to apply modern gamification (Duolingo visual cues, streaks, tactile feedback) directly to accredited couples & family therapy frameworks (Gottman, EFT)."
  }
};
