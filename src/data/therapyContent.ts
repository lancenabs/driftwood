export interface TherapyDetails {
  clinicalBackground: string;
  corePrinciples: string[];
  metricsTracked: string[];
  caseStudy: {
    title: string;
    description: string;
    resolution: string;
  };
  recommendedReadings: string[];
  clinicalWorksheet: {
    title: string;
    objective: string;
    questions: string[];
  };
  homeworkExercise: {
    name: string;
    instructions: string;
    duration: string;
  };
}

export const THERAPY_DETAILS: Record<string, TherapyDetails> = {
  gottman: {
    clinicalBackground: "Derived from Dr. John Gottman's legendary 'Love Lab' (longitudinal observation of over 3,000 couples), the Gottman Method is heavily grounded in empirical data. It predicts divorce with over 90% accuracy by studying physiological arousal (heart rate, cortisol) and emotional interaction ratios during conflict. The core philosophy centers on the Sound Relationship House Theory, which asserts that positive interactions must outnumber negative ones by 5:1 during conflicts to sustain long-term relationship success.",
    corePrinciples: [
      "The Sound Relationship House: Building Love Maps, nurturing fondness and admiration, and turning towards bids for connection.",
      "The Magic 5:1 Positivity Ratio: Ensuring that even in the midst of conflict, five warm, validating, or positive statements are traded for every negative one.",
      "The Four Horsemen Antidotes: Actively neutralizing Criticism, Contempt, Defensiveness, and Stonewalling.",
      "Softened Start-ups: Starting a difficult conversation by describing oneself and expressing an immediate soft need, rather than evaluating or attacking."
    ],
    metricsTracked: [
      "Gottman Empathy Index",
      "Defensiveness and Criticism Quotient",
      "Active Appreciation Frequency"
    ],
    caseStudy: {
      title: "Moving Beyond Stonewalling and Criticism",
      description: "Sarah and Mark suffered from a critical-defensive cycle. Sarah felt ignored and criticized Mark's habits, which triggered physiological flooding in Mark, leading him to stone-wall (physically and emotionally withdraw). This in turn escalated Sarah's distress.",
      resolution: "By utilizing Gottman's Physiological Self-Soothing breaks (20 minutes of complete distraction to drop the heart rate below 100 BPM) and training Sarah in Softened Start-ups ('I feel overwhelmed when the kitchen is cluttered, could we wash it together?'), they broke the cycle and established a safe communication harbor."
    },
    recommendedReadings: [
      "The Seven Principles for Making Marriage Work (Drs. John & Julie Gottman)",
      "What Makes Love Last? (Dr. John Gottman)",
      "The Relationship Cure (Dr. John Gottman)"
    ],
    clinicalWorksheet: {
      title: "Build Your Partner's Love Map",
      objective: "Update your cognitive map of your partner's current world to prevent relational drift and enhance emotional intimacy.",
      questions: [
        "What are your partner's top three current life worries or sources of stress?",
        "Who is currently your partner's primary support system outside of you?",
        "What is one long-term dream or goal your partner feels is currently unfulfilled?"
      ]
    },
    homeworkExercise: {
      name: "The Weekly State of the Union Meeting",
      instructions: "Set aside 1 hour with no devices. Start by trading 5 specific appreciations from the past week. Then, discuss one area of relationship friction utilizing softened 'I' statements. Actively validate each other's perspectives without defending. Conclude by checking in on upcoming schedules and giving each other a warm, continuous 20-second hug.",
      duration: "60 minutes, weekly"
    }
  },
  lovelanguages: {
    clinicalBackground: "Formulated by marriage counselor Dr. Gary Chapman, the 5 Love Languages model asserts that relationship dissatisfaction frequently stems from emotional translation errors rather than a lack of affection. Partners express and receive love in distinct 'dialects.' Relationship healing begins by mapping these primary triggers and learning to intentionally communicate in your partner's exact language to fill their emotional 'love tank.'",
    corePrinciples: [
      "The Emotional Love Tank: An emotional reservoir that must be kept full to prevent relational burnout, defensiveness, and withdrawal.",
      "The Five Dialects: Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, and Physical Touch.",
      "Intentional Expression: Moving beyond your natural comfort language to speak the language your partner actually understands and values."
    ],
    metricsTracked: [
      "Language Translation Accuracy",
      "Intimacy Reservoir Level",
      "Fulfillment Alignment Index"
    ],
    caseStudy: {
      title: "Fueling Elena's Emotional Reservoir",
      description: "James felt exhausted from doing yardwork and cleaning the car (Acts of Service) to show love, yet Elena felt completely isolated and unloved because her primary language was Words of Affirmation and James rarely offered compliments or emotional validation.",
      resolution: "James learned to translate his actions into verbal affirmations and left written appreciation notes. Elena's love tank filled, which gave her the capacity to enthusiastically support James's projects."
    },
    recommendedReadings: [
      "The 5 Love Languages: The Secret to Love That Lasts (Dr. Gary Chapman)",
      "The 5 Languages of Appreciation in the Workplace (Gary Chapman & Paul White)"
    ],
    clinicalWorksheet: {
      title: "The Emotional Dialect Mapper",
      objective: "Identify language disparities and establish actionable daily tasks to keep each other's emotional love tank fully supplied.",
      questions: [
        "What is a specific action your partner took recently that made you feel completely secure and adored?",
        "Which of the five love languages feels the most unnatural for you to express, and why?",
        "How can your partner help you practice receiving love in your non-primary languages?"
      ]
    },
    homeworkExercise: {
      name: "The Daily Dialect Rotation",
      instructions: "For 5 consecutive days, designate one specific Love Language to practice. Create a tiny, 5-minute gesture matching that language (e.g., writing an affirmation text, holding hands for 3 minutes, taking a device-free walk, doing a chore, or presenting a small treat). Record how your partner reacts.",
      duration: "5 minutes daily, for 5 days"
    }
  },
  eft: {
    clinicalBackground: "Rooted in Attachment Theory and pioneered by Dr. Sue Johnson, Emotionally Focused Therapy (EFT) views relationship distress not as a lack of communication skills, but as an attachment panic trigger. When emotional safety is threatened, couples fall into highly predictable negative cycles (the 'Pursuer-Distancer' loop). EFT guides partners to deconstruct secondary defensive reactions (anger, blaming) and voice primary, vulnerable attachment needs (fear of abandonment, longing for safety).",
    corePrinciples: [
      "Attachment Security: Relationships are primary survival bonds. True security is built when partners are accessible, responsive, and emotionally engaged (A.R.E.).",
      "Secondary vs. Primary Emotions: Anger, criticism, and withdrawal are protective secondary emotions. Fear, shame, and loneliness are primary vulnerable emotions.",
      "Deconstructing the Cycle: Separating the couple from the negative interaction loop, treating the loop itself as the common opponent."
    ],
    metricsTracked: [
      "Vulnerability Expression Level",
      "Attachment Security Index",
      "Conflict De-escalation Velocity"
    ],
    caseStudy: {
      title: "Stepping Out of the Protest Polka",
      description: "Maria reacted with intense criticism when David came home silent. David withdrew further, isolating himself in his workshop. Maria felt abandoned; David felt deeply inadequate and defective. They were trapped in a classic Pursuer-Distancer loop.",
      resolution: "In session, Maria was supported to access her primary emotion ('I feel so small and terrified of losing you when you're quiet'). This vulnerability allowed David to step forward and reassure Maria, breaking their cycle of panic and defense."
    },
    recommendedReadings: [
      "Hold Me Tight: Seven Conversations for a Lifetime of Love (Dr. Sue Johnson)",
      "Love Sense: The Revolutionary New Science of Romantic Relationships (Dr. Sue Johnson)",
      "The Practice of Emotionally Focused Couple Therapy (Dr. Sue Johnson)"
    ],
    clinicalWorksheet: {
      title: "Mapping Your Relational Protest Loop",
      objective: "Map the secondary defensive behaviors of your conflict cycle to discover the soft, vulnerable attachment fears driving them.",
      questions: [
        "When you notice your partner withdrawing or criticizing, what is the raw, scary story you tell yourself about your worth or your relationship's survival?",
        "What secondary defense do you immediately use to protect yourself (e.g. yelling, lecturing, leaving, shutting down)?",
        "What soft primary feeling (e.g., fear of rejection, shame of inadequacy, absolute loneliness) is actually hidden underneath your defense?"
      ]
    },
    homeworkExercise: {
      name: "The 'Hold Me Tight' Vulnerability Dialogue",
      instructions: "Set a peaceful environment. Partner A shares one primary fear regarding their connection ('I get scared that I'm not doing a good job as your partner') without accusing Partner B. Partner B listens with deep, quiet presence and validates the fear. Swap roles. Do not attempt to fix or solve the fear—simply hold space.",
      duration: "30 minutes"
    }
  },
  imago: {
    clinicalBackground: "Created by Drs. Harville Hendrix and Helen LaKelly Hunt, Imago Relationship Therapy blends behavioral principles with psychoanalytic theory. It asserts that we select partners who possess both the positive and negative traits of our childhood caretakers (our 'Imago'). Conflict is not a sign of incompatibility, but a subconscious attempt to heal childhood attachment wounds. Relational growth is achieved through the structured, safe practice of the Imago Dialogue.",
    corePrinciples: [
      "The Imago Grid: Recognizing that our partner is a mirror of our early caretakers, selected to trigger and ultimately heal unresolved developmental wounds.",
      "The Three-Step Dialogue: A highly structured communication sequence consisting of Mirroring, Validation, and Empathy.",
      "The Conscious Marriage: Shifting from reactive, automatic defenses to intentional, caring interactions that foster mutual emotional healing."
    ],
    metricsTracked: [
      "Mirroring Precision Index",
      "Validation Consistency",
      "Active Relational Empathy"
    ],
    caseStudy: {
      title: "Healing Childhood Neglect Through Active Mirroring",
      description: "Karen's childhood neglect left her sensitive to ignored requests. When Leo forgot to respond to her texts, Karen reacted with aggressive blaming. Leo felt trapped and controlled, mimicking his overbearing mother.",
      resolution: "They utilized the structured Imago Dialogue. Leo learned to mirror Karen's statements without interrupting, validating her ('It makes sense that you feel forgotten when I don't reply, because your childhood was full of ignored needs'). Karen felt seen, and her defensive aggression dissolved."
    },
    recommendedReadings: [
      "Getting the Love You Want: A Guide for Couples (Drs. Harville Hendrix & Helen LaKelly Hunt)",
      "Receiving Love: Transform Your Relationship by Letting Yourself Be Loved (Harville Hendrix)",
      "Making Marriage Simple: 10 Relationship Saving Truths (Harville Hendrix & Helen LaKelly Hunt)"
    ],
    clinicalWorksheet: {
      title: "Structured Dialogue Prompt Book",
      objective: "Practice the rigid three steps of Imago communication to establish complete emotional safety on sensitive topics.",
      questions: [
        "Mirroring: Can you repeat back your partner's exact core statement to verify you heard them correctly, without inserting your own commentary?",
        "Validation: How does your partner's emotional response make logical sense when you look at their history or their day-to-day stressors?",
        "Empathy: What physical or emotional feeling do you imagine is happening inside your partner's body right now (e.g. a heavy chest, a racing heart)?"
      ]
    },
    homeworkExercise: {
      name: "The 15-Minute Imago Dialogue",
      instructions: "Select a low-friction topic. Partner A acts as the sender, speaking for 4 minutes in 'I' statements. Partner B acts as the receiver, strictly executing Mirroring ('If I got that right, you are saying... Is there more?'), Validation ('That makes sense because...'), and Empathy ('I imagine that feels...'). Swap roles.",
      duration: "15 minutes"
    }
  },
  cbct: {
    clinicalBackground: "Pioneered by Dr. Donald Baucom and others, Cognitive Behavioral Couples Therapy (CBCT) applies cognitive-behavioral principles to relational dynamics. It posits that marital distress is maintained by cognitive distortions (all-or-nothing thinking, attribution biases, mind-reading) and poor behavioral exchanges. Therapy targets cognitive restructuring (shifting blame attributions) paired with structured communication training and positive behavior contracts.",
    corePrinciples: [
      "Attribution Restructuring: Shifting from toxic, internal attributions ('They forgot because they are selfish') to benign, situational attributions ('They forgot because they had a stressful workday').",
      "Behavioral Exchange Contracts: Explicitly negotiating cooperative agreements to increase positive reinforcement and shared equity in household routines.",
      "Cognitive Reframing: Uncovering and shifting deeply held core schemas about relationships and what a partner 'should' always do."
    ],
    metricsTracked: [
      "Attribution Accuracy Gauge",
      "Behavioral Contract Adherence",
      "Cognitive Flexibility Index"
    ],
    caseStudy: {
      title: "Negotiating the Clean Kitchen Contract",
      description: "Ken held a cognitive distortion that 'if his partner cared about him, they would always wash the dishes without being asked.' When chores were missed, Ken assumed his partner was intentionally disrespectful, creating chronic anger.",
      resolution: "Through cognitive restructuring, Ken learned to separate chores from emotional valuation. They wrote an explicit 'Behavioral Exchange Contract' dividing tasks clearly, which removed the cognitive test and restored peaceful cleanliness."
    },
    recommendedReadings: [
      "Cognitive-Behavioral Couples Therapy (Drs. Donald K. Baucom & Norman Epstein)",
      "Helping Couples Change: A Social Learning Approach to Marital Therapy (Dr. Richard Stuart)"
    ],
    clinicalWorksheet: {
      title: "Attribution Distorted Thought Record",
      objective: "Identify and deconstruct automatic negative attributions before they trigger defensive relationship conflicts.",
      questions: [
        "What is the automatic negative explanation you are giving for your partner's frustrating behavior?",
        "What objective, non-emotional evidence exists that supports or contradicts this explanation?",
        "What is a highly realistic, compassionate, and situational alternative explanation?"
      ]
    },
    homeworkExercise: {
      name: "The Positive Behavior Exchange Swap",
      instructions: "Both partners write down 3 small, highly specific actions that make them feel appreciated (e.g., brewing coffee, taking out recycling, sending a midday text). For the next week, commit to performing at least two of your partner's requested actions daily, tracking overall relationship satisfaction.",
      duration: "10 minutes daily"
    }
  },
  bowen: {
    clinicalBackground: "Developed by Dr. Murray Bowen, Bowen Family Systems Theory views the family not as a collection of individuals, but as an emotional unit. Relational issues are intergenerational and highly systemic. Relational health is determined by 'Differentiation of Self'—the ability to maintain your own intellectual beliefs and calm boundaries while staying emotionally connected to highly anxious family systems. It maps anxiety transmission using Genograms and identifies defensive Triangulation.",
    corePrinciples: [
      "Differentiation of Self: The capacity to remain objective, separate, and calm, resisting the pull of family emotional reactivity.",
      "Triangulation: The process where a two-person system under stress pulls in a third party (a child, an in-law, work) to relieve anxiety, which ultimately solidifies conflict.",
      "Multigenerational Transmission: Understanding that emotional patterns and coping strategies are passed down through family trees."
    ],
    metricsTracked: [
      "Differentiation of Self Level",
      "Triangulation Tendency Tracker",
      "Systemic Intergenerational Awareness"
    ],
    caseStudy: {
      title: "Detriangulating the Parent-Child Axis",
      description: "Linda suffered from marriage tension. Instead of addressing it with her husband Arthur, Linda 'triangulated' her adolescent daughter Amy, complaining to her and venting. Amy absorbed the marital anxiety, developing severe school-avoidance behavior.",
      resolution: "Linda worked on her Differentiation of Self. She consciously detriangulated Amy, refusing to discuss Arthur with her. Linda addressed Arthur directly, which immediately relieved Amy's school anxiety and forced Arthur and Linda to engage in direct marital resolution."
    },
    recommendedReadings: [
      "Family Evaluation: An Approach Based on Bowen Theory (Michael Kerr & Murray Bowen)",
      "Genograms: Assessment and Intervention (Monica McGoldrick)",
      "The Bowen Family Theory and Its Uses (C. Margaret Hall)"
    ],
    clinicalWorksheet: {
      title: "Family Systemic Triangulation Audit",
      objective: "Identify where you are participating in triangles that block direct conflict resolution and cause systemic family anxiety.",
      questions: [
        "When tension rises between you and your partner, whom do you immediately complain to or focus on (e.g., a child, a parent, a close friend)?",
        "How does pulling this third party in prevent you from addressing the primary relational issue directly?",
        "What is one direct, calm statement you can make to your partner to address the tension without bringing up third-party alliances?"
      ]
    },
    homeworkExercise: {
      name: "The Differentiation Neutral Observer Practice",
      instructions: "At your next family gathering or tense conversation, practice being an 'emotional detective.' Stand back and quietly observe the emotional flows. When someone tries to pull you into a gossip loop or complaint triangle, calmly say: 'I hope you can discuss that directly with them.' Focus on keeping your heart rate relaxed.",
      duration: "Varies, during family events"
    }
  },
  narrative: {
    clinicalBackground: "Formulated by Michael White and David Epston, Narrative Therapy is built on the tenet: 'The person is not the problem; the problem is the problem.' It asserts that families construct dominant, self-limiting stories ('Liam is lazy,' 'This family is broken'). Narrative therapists help family members externalize their persistent conflicts as external entities, allowing family coalitions to unite and rewrite their shared narratives.",
    corePrinciples: [
      "Externalization: Translating internal blames ('You are stubborn') into external opponents ('The Silence Monster is trying to block our connection').",
      "Deconstruction of Dominant Stories: Questioning destructive, rigid family labels and uncovering times when the problem failed to take over.",
      "Re-authoring and Unique Outcomes: Discovering and celebrating historical moments of successful cooperation and mutual support."
    ],
    metricsTracked: [
      "Externalization Frequency",
      "Co-op Agency Alignment",
      "Relational Reclamation Index"
    ],
    caseStudy: {
      title: "Defeating the Homework Dragon",
      description: "The Mitchell family was torn apart by nightly battles over 10-year-old Toby's homework. Toby's parents labeled Toby 'disobedient and lazy,' while Toby labeled his parents 'cruel dictators.'",
      resolution: "The therapist externalized the conflict as 'The Homework Dragon' that sneaks into the kitchen at 7 PM to steal the family's joy. The parents and Toby united as a co-op team, strategizing together to defeat the Dragon. This dissolved the personal blame and restored a supportive parent-child alliance."
    },
    recommendedReadings: [
      "Narrative Means to Therapeutic Ends (Michael White & David Epston)",
      "Maps of Narrative Practice (Michael White)",
      "What is Narrative Therapy? (Alice Morgan)"
    ],
    clinicalWorksheet: {
      title: "Deconstructing the Dominant Blame Narrative",
      objective: "Rename a chronic, frustrating family dispute as an external enemy so you can coordinate a unified team defense.",
      questions: [
        "If the repetitive conflict in your home was a physical creature, character, or force, what would its name be (e.g. 'The Blame Goblin', 'The Hurry Hurricane')?",
        "What dirty tricks does this externalized problem use to turn family members against each other?",
        "Describe a specific moment when your family successfully resisted this problem's tricks. How did you do it?"
      ]
    },
    homeworkExercise: {
      name: "The Family Story Reclamation Campaign",
      instructions: "Conduct a 20-minute family meeting. Together, create a list of 'Unique Outcomes'—times when your family successfully overcame the externalized problem. Post this list on the refrigerator. When the problem attempts to return, have any member point to the list and declare: 'We know how to defeat you!'",
      duration: "20 minutes"
    }
  },
  structural: {
    clinicalBackground: "Developed by Salvador Minuchin, Structural Family Therapy (SFT) focuses on the invisible rules, boundary permeability, and hierarchical structures that govern family interactions. SFT asserts that emotional symptoms in individuals are indicators of dysfunctional household structural arrangements (e.g., parenting subsystems enmeshed with child subsystems, rigid boundaries causing cut-offs). Relational health is restored by realigning boundaries and strengthening parental hierarchies.",
    corePrinciples: [
      "Family Subsystems: Recognizing distinct functional units within the family (marital, parental, sibling), each requiring its own unique boundaries.",
      "Boundary Permeability: Restoring clear boundaries that are neither rigid (leading to emotional disconnection/isolation) nor diffuse (leading to enmeshment).",
      "Household Hierarchies: Establishing a strong, cooperative parental coalition that provides warm, authoritative leadership for the children."
    ],
    metricsTracked: [
      "Boundary Clarity Index",
      "Subsystem Integrity Score",
      "Generational Hierarchy Health"
    ],
    caseStudy: {
      title: "Realigning the Household Subsystems",
      description: "Following a divorce, Sandra became heavily enmeshed with her teenage son Greg, discussing financial worries and venting about her ex-husband. Sandra's new partner Alan felt completely isolated, and Greg developed behavior problems to escape Sandra's anxiety.",
      resolution: "SFT exercises established a clear parent-child boundary. Sandra stopped discussing adult stresses with Greg. Alan and Sandra formed a unified parental coalition, restoring Greg's position in the sibling subsystem and resolving his behavior issues.",
    },
    recommendedReadings: [
      "Families and Family Therapy (Dr. Salvador Minuchin)",
      "Structural Family Therapy (Harry Aponte & John VanDeusen)",
      "Family Healing: Tales of Hope and Renewal from Family Therapy (Salvador Minuchin)"
    ],
    clinicalWorksheet: {
      title: "Family Subsystem Boundary Diagnostic",
      objective: "Map the boundaries in your household to identify where lines are too rigid (disengaged) or too diffuse (enmeshed).",
      questions: [
        "Are adult issues or relationship friction regularly discussed in front of, or with, your children?",
        "Does one family member feel teamed up against by an alliance of two other members?",
        "What is one specific boundary rule you can implement today to protect the privacy of the adult subsystem?"
      ]
    },
    homeworkExercise: {
      name: "The Parental Executive Session",
      instructions: "Parents hold a closed-door alignment meeting for 15 minutes to coordinate schedules and parenting rules. The children are given a clear, affectionate boundary ('This is parent planning time') and are expected to play independently. This practice reinforces parental subsystem integrity and child subsystem self-reliance.",
      duration: "15 minutes weekly"
    }
  },
  nvc: {
    clinicalBackground: "Developed by Dr. Marshall Rosenberg, Nonviolent Communication (NVC) is a world-class 'communication lab' framework built on the premise that all human conflict arises from tragic expressions of unmet needs. By removing moralistic judgments, diagnoses, and demands from our dialogue, NVC structures a clinical communication pathway of four distinct steps: Observation, Feeling, Need, and Request. This technique bypasses defensive reflexes and builds deep emotional alignment.",
    corePrinciples: [
      "Observations over Evaluations: Stating concrete, neutral facts of what occurred without layering in blame, labels, or interpretations.",
      "Primary Feelings: Identifying and taking responsibility for pure physical and emotional sensations, separate from mental assessments of partner behavior (e.g., 'I feel lonely' vs 'I feel ignored').",
      "Universal Human Needs: Recognizing that all actions are attempts to meet fundamental, non-threatening human needs (e.g., safety, autonomy, connection).",
      "Actionable Requests: Expressing what we want in concrete, positive, doable action language, completely free of hidden demands or ultimatums."
    ],
    metricsTracked: [
      "Evaluation-Free Observation Quotient",
      "Vulnerable Feeling Identification Score",
      "Request Actionability Index"
    ],
    caseStudy: {
      title: "De-escalating the 'Always Busy' Accusation",
      description: "Leo frequently criticized his partner Maya, saying: 'You are a workaholic and you care more about your job than our relationship.' Maya responded with rigid defensiveness, pointing out Leo's own lack of domestic organization, sparking an escalating cycle of mutual resentment.",
      resolution: "Through the NVC Communication Lab, Leo reframed his attack into a four-step NVC alignment statement: 'When I see you work late four nights this week [Observation], I feel lonely and disconnected [Feeling], because I need a sense of belonging and quality time with you [Need]. Would you be willing to block off Thursday evening after 7 PM for a device-free dinner with me? [Request]'. Maya instantly agreed, feeling called into connection rather than blamed."
    },
    recommendedReadings: [
      "Nonviolent Communication: A Language of Life (Dr. Marshall Rosenberg)",
      "Living Nonviolent Communication (Dr. Marshall Rosenberg)",
      "Speak Peace in a World of Conflict (Dr. Marshall Rosenberg)"
    ],
    clinicalWorksheet: {
      title: "The 4-Step Communication Lab Worksheet",
      objective: "Translate a hot relationship friction point into a non-blaming, highly validating NVC statement.",
      questions: [
        "What is the exact, camera-verifiable fact of what happened, free of any interpretations or adjectives?",
        "When this fact occurs, what pure emotional feeling arises inside your body (avoid words like 'betrayed', 'ignored', or 'underappreciated' which are evaluations)?",
        "What is the deep, universal human need (e.g., support, safety, collaboration) driving that feeling?"
      ]
    },
    homeworkExercise: {
      name: "The Observation & Feeling Swap",
      instructions: "Sit together for 15 minutes. One partner describes a household event using only camera-verifiable facts. The second partner identifies three potential feelings that event could trigger. Swap roles. This exercise builds a muscular habit of decoupling dry observations from personal attachment interpretations.",
      duration: "15 minutes"
    }
  },
  financial: {
    clinicalBackground: "Formulated by pioneer financial therapists including Dr. Bradley Klontz, Couples Financial Harmony tackles the intersection of financial stress, money management, and attachment styles. Financial issues are rarely about numbers; they are expressions of subconscious beliefs called 'Money Scripts' (Money Avoidance, Money Worship, Money Status, Money Vigilance) formed in early childhood. This model helps couples unpack financial narratives, establish emotional safety around resource pooling, and align their financial habits with shared values.",
    corePrinciples: [
      "Deconstruction of Money Scripts: Unearthing subconscious, inherited childhood beliefs about money to defuse shame and defensiveness.",
      "Financial Intimacy: Creating transparent, judgment-free communication regarding cash flow, debts, and savings goals.",
      "The Shared Worth Contract: Aligning financial expenditures with joint relational values rather than individual emotional coping mechanisms.",
      "Resource Co-op Rules: Moving from competitive individual resource tracking to collaborative, secure resource pooling structures."
    ],
    metricsTracked: [
      "Financial Shame Reduction Index",
      "Money Script Divergence Margin",
      "Expenditure Value Alignment"
    ],
    caseStudy: {
      title: "Overcoming the Saver-Spender Polarization",
      description: "Chloe (high Money Vigilance / Saver) felt severe anxiety when her partner Marcus (high Money Worship / Spender) bought a coffee or went out with friends, accusing him of ruining their future. Marcus felt suffocated and began hiding receipts, creating a critical breach of financial trust.",
      resolution: "They mapped their scripts: Chloe's saver behavior was driven by childhood housing insecurity; Marcus's spending was an attempt to feel worthy. They established 'No-Permission Budgets' (individual discretionary cash allowances) and a monthly values check-in, reducing financial panic and rebuilding transparent trust."
    },
    recommendedReadings: [
      "Mind Over Money: Overcoming the Money Disorders That Threaten Our Wealth and Health (Drs. Brad & Ted Klontz)",
      "The Financial Therapy Association Journals & Resources (FTA)",
      "Financial Recovery (Karen McCall)"
    ],
    clinicalWorksheet: {
      title: "Money Narrative & Script Diagnostic",
      objective: "Unpack ancestral money stories to understand your partner's financial anxieties and spending patterns.",
      questions: [
        "What was the overall emotional atmosphere regarding money in your home growing up (e.g., silence, fighting, lavishness)?",
        "What is the single biggest fear you hold about your financial future, and how does it affect your partner?",
        "What is one value-based financial goal you both share that you can actively fund this month?"
      ]
    },
    homeworkExercise: {
      name: "The Monthly Financial Date",
      instructions: "Schedule a monthly date at a favorite cafe. Spend the first 10 minutes discussing non-financial appreciations. Then, review bank balances with 100% transparency. Dedicate a specific 'Joy Budget' category for shared intimacy building. Treat all discussions with active empathy, realizing that money anxiety is a cry for physical safety.",
      duration: "45 minutes monthly"
    }
  },
  ibct: {
    clinicalBackground: "Developed by Drs. Neil Jacobson and Andrew Christensen, Integrative Behavioral Couple Therapy (IBCT) is a premier modern, empirically supported clinical approach to conflict resolution. While traditional models focus heavily on changing behavior, IBCT recognizes that enduring change is only possible when built on a solid foundation of emotional acceptance. IBCT guides couples through Empathic Joining (experiencing pain together without blame), Unified Detachment (analyzing the conflict from a neutral intellectual perspective), and Tolerance Building.",
    corePrinciples: [
      "Acceptance-First Dynamics: Recognizing that demanding behavioral changes often triggers resentment; authentic acceptance organically fosters compromise.",
      "Empathic Joining: Vulnerably expressing pain or soft feelings without blame, inviting the partner to co-experience the emotional climate.",
      "Unified Detachment: Stepping back together to view conflict loops as an objective third party, analyzing triggers as 'the pattern' rather than personal failures.",
      "Tolerance Exercises: Desensitizing partners to minor irritants by highlighting their harmless nature and role in individual diversity."
    ],
    metricsTracked: [
      "Vulnerability-to-Blame Ratio",
      "Unified Detachment Alignment",
      "Emotional Toleration Coefficient"
    ],
    caseStudy: {
      title: "Detaching from the 'Right vs. Wrong' Cleanliness Trap",
      description: "Gabe and Sophie fought constantly about housekeeping. Gabe felt Sophie was excessively chaotic; Sophie felt Gabe was controlling and obsessive. They both spent years trying to force the other to change, leading to cold domestic distance.",
      resolution: "Through IBCT, they stopped trying to change each other. Gabe practiced Empathic Joining, expressing the deep physical anxiety he felt when disorganized, and Sophie validated this without feeling attacked. They practiced Unified Detachment, mapping 'The Dance of the Broom' as a systemic loop they both fell into. This acceptance allowed them to hire a bi-weekly cleaner and divide the rest peacefully."
    },
    recommendedReadings: [
      "Reconcilable Differences (Drs. Andrew Christensen & Neil S. Jacobson)",
      "Acceptance and Change in Couple Therapy (Neil S. Jacobson & Andrew Christensen)",
      "The Heart of Couple Therapy (Drs. Andrew Christensen & Patricia Noller)"
    ],
    clinicalWorksheet: {
      title: "The Unified Detachment Loop Mapper",
      objective: "Identify your repetitive conflict cycle as an objective, external systemic pattern rather than an individual character flaw.",
      questions: [
        "What is the typical trigger that initiates 'The Dance' or cycle in your relationship?",
        "When the cycle is active, what does Partner A do, and how does Partner B react? Write this as a neutral loop description.",
        "What is one positive, warm aspect of your partner's personality that is actually the flip-side of the trait that irritates you?"
      ]
    },
    homeworkExercise: {
      name: "The Conflict De-Brief Exercise",
      instructions: "After an argument has fully cooled, sit down with a timer. For 5 minutes, Partner A describes the argument from a neutral, intellectual perspective as if they were a nature documentarian observing two birds in a forest ('Partner A felt tired, Partner B reacted to the tone...'). Swap. This builds unified cognitive detachment from reactive emotional triggers.",
      duration: "20 minutes"
    }
  },
  fairplay: {
    clinicalBackground: "Formulated by Eve Rodsky, the Fair Play Method is a highly practical, therapeutic resource equity system designed to solve the cognitive load crisis in modern partnerships. Relationship friction is frequently triggered by unequal division of domestic labor and the mental exhaustion of tracking household operations. Fair Play introduces a clear system where tasks are treated as a deck of cards. One partner must own a card 100%—covering Conception, Planning, and Execution (CPE)—eliminating 'nagging' and restoring cognitive space.",
    corePrinciples: [
      "Full CPE Ownership: Rejecting the 'helping out' mental model. One partner is fully responsible for a task from Conception and Planning to actual Execution.",
      "Minimum Standard of Care (MSC): Mutually defining the baseline quality standard for a task to eliminate critical monitoring, nagging, and micromanaging.",
      "Mental/Cognitive Load Visibility: Translating invisible administrative work (scheduling, planning, stocking) into visible relational resources.",
      "Wild Card Re-dealing: Intentionally redealing task cards on a weekly basis to accommodate personal capacity, professional stress, or health shifts."
    ],
    metricsTracked: [
      "Cognitive Load Distribution Index",
      "CPE Execution Integrity",
      "Domestic Peace Indicator"
    ],
    caseStudy: {
      title: "Bypassing the 'Nag and Wait' Loop",
      description: "Tariq felt he was 'helping out' by picking up kids from soccer, but expected his wife Priya to arrange schedules, pack bags, coordinate carpools, and remind him. Priya felt mentally shattered by this cognitive load and often snapped at Tariq, who labeled her 'angry.'",
      resolution: "They played Fair Play. Priya handed Tariq the 'Afterschool Activities' card 100%. Tariq learned to conceive, plan, and execute soccer. No reminders were allowed. Priya freed up 4 hours of mental space weekly, and Tariq felt proud of his total autonomy and competent domestic leadership."
    },
    recommendedReadings: [
      "Fair Play: A Game-Changing Solution for When You Have Too Much to Do (Eve Rodsky)",
      "Find Your Unicorn Space (Eve Rodsky)",
      "The Mental Load: A Feminist Comic (Emma)"
    ],
    clinicalWorksheet: {
      title: "Cognitive Load Deck Alignment Worksheet",
      objective: "Clarify task CPE boundaries and establish Minimum Standards of Care for shared household tasks.",
      questions: [
        "What is one task you currently feel you 'help out' with, but do not actually conceive or plan yourself?",
        "What is a mutually acceptable 'Minimum Standard of Care' for that task (e.g., 'dishes are loaded and sink wiped before sleeping')?",
        "What is one administrative task that is completely invisible to your partner but takes up your mental space?"
      ]
    },
    homeworkExercise: {
      name: "Task Card Draft & Deal Session",
      instructions: "Write down 10 major household chores on separate index cards (e.g., Groceries, Dinner, Garbage, Bill Pay, Laundry). Sit together and deal the cards. Each person gets total autonomy (CPE) over their cards for 7 days. Agree on the MSC first. The other partner is forbidden from commenting, suggesting, or nagging about how the cards are played.",
      duration: "30 minutes"
    }
  },
  feelings_finder: {
    clinicalBackground: "The Feelings Wheel (originally adapted by Gloria Willcox) is a cornerstone clinical tool used across many modern therapies including Emotionally Focused Therapy (EFT) and Nonviolent Communication (NVC). Relational conflict often occurs because partners communicate using general 'secondary' reactive states (e.g., Anger, Frustration, Sarcasm) which trigger immediate defensiveness in the listener. By tracing feelings from these general outer domains down to specific primary emotions (e.g., Hurt, Disregarded, Inadequate), partners build deep emotional granularity. This lets them express what is truly happening inside them, bypassing mutual defense mechanisms.",
    corePrinciples: [
      "Emotional Granularity: Moving beyond simple binaries like 'fine' or 'bad' to pinpoint precise emotional words, which scientifically lowers nervous system arousal.",
      "Primary vs. Secondary Emotions: Recognizing that anger and defensive withdrawal are often secondary shields over primary, vulnerable emotions (like hurt, fear, or grief).",
      "Actionable Needs-Alignment: Translating vulnerable feelings directly into positive, universal human needs, then framing them as clear requests."
    ],
    metricsTracked: [
      "Emotional Granularity Index",
      "Vulnerability Expression Rate",
      "Defensive Reaction Reduction"
    ],
    caseStudy: {
      title: "Translating Sarcasm into Vulnerable Longings",
      description: "Leo and Chloe found themselves in a toxic spiral of sarcasm and passive-aggression. When Chloe worked late, Leo made sarcastic remarks like 'Nice of you to join us!' Chloe felt criticized and withdrew, deepening the distance.",
      resolution: "By using the Feelings Finder wheel, Leo realized his secondary anger masked a primary feeling of being 'Forgotten' and 'Lonely.' In their next session, instead of sarcasm, he said: 'I feel forgotten and lonely when you stay late without telling me, because I need connection.' Chloe immediately softened and hugged him."
    },
    recommendedReadings: [
      "The Feelings Wheel (Dr. Gloria Willcox)",
      "Nonviolent Communication: A Language of Life (Dr. Marshall Rosenberg)",
      "Hold Me Tight: Seven Conversations for a Lifetime of Love (Dr. Sue Johnson)"
    ],
    clinicalWorksheet: {
      title: "Vulnerable Emotion Mapper",
      objective: "Map a recent tense interaction, identify the underlying core feelings using the Feelings Wheel, and translate them into a non-defensive request.",
      questions: [
        "What was the dry, objective event that triggered a reaction in you? (Observe facts only, no evaluations)",
        "Look at the Feelings Wheel. What secondary emotion did you show initially, and what primary/tertiary emotions were actually hidden underneath?",
        "What universal attachment need (e.g., safety, presence, connection) was unmet in that moment, and what positive request can you make now?"
      ]
    },
    homeworkExercise: {
      name: "The 3-Step Feelings Check-In",
      instructions: "Twice this week when a minor friction arises, pause immediately. Take 3 deep breaths. Sit together and open the Feelings Wheel. Each partner takes turns picking: 1 Core sensation, 1 Secondary feeling, and 1 Tertiary feeling. Share these with your partner using the phrase: 'Underneath my reaction, I am feeling [tertiary feeling].' The receiving partner must repeat it back exactly without correcting or defending.",
      duration: "15 minutes, twice weekly"
    }
  }
};

