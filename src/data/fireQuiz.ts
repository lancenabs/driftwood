// ═════════════════════════════════════════════════════════════════════════════
//  THE FIRE QUIZ — the couples & family knowing-game (Lance's vision, 2026-07-11).
//
//  "Build a shared fire by answering questions about each other. Every right
//   answer lays a log. Whoever knows more doesn't win — the couple beats the
//   COLD, together, never each other. The kids see the fire burning because
//   mom and dad reconnected." — the thesis made playable.
//
//  THE UNDERTOW LAW (bible): the game NEVER becomes scorekeeping. There is no
//  "you got 7, I got 4." There is ONE fire, ONE warmth meter, and it climbs
//  when EITHER partner guesses right. You are on the same team against the night.
//
//  THE ARC (early intervention → advanced, exactly as Lance asked): questions
//  are tiered. A couple in crisis starts at EMBERS (safe, warm, funny — rebuild
//  the habit of curiosity) and only reaches DEEP WATER (fears, needs, the hard
//  honest ones) after the easy logs have rebuilt some safety. The tier is the
//  clinical dosage.
// ═════════════════════════════════════════════════════════════════════════════

export type QuizTier = 'embers' | 'kindling' | 'steady' | 'deep';
export type QuizAudience = 'couple' | 'family' | 'both';

export interface QuizQuestion {
  id: string;
  tier: QuizTier;
  audience: QuizAudience;
  // The asker is shown this; they GUESS the answerer's answer, then the
  // answerer reveals theirs. A "log is laid" when they agree it matched.
  prompt: string;         // "What's their comfort food after a hard day?"
  hint?: string;          // gentle framing shown small
}

export interface TierMeta {
  id: QuizTier;
  label: string;
  blurb: string;          // what this round rebuilds, honestly
  logColor: string;       // the log/flame tint as the fire climbs through tiers
  minWarmthToUnlock: number; // logs needed before this tier opens (the dosage gate)
}

export const FIRE_TIERS: TierMeta[] = [
  { id: 'embers',   label: 'Embers',      blurb: 'small warm sparks — rebuild the habit of being curious about each other', logColor: '#FFC978', minWarmthToUnlock: 0 },
  { id: 'kindling', label: 'Kindling',    blurb: 'the little true things — what actually delights and bothers them', logColor: '#FFA64D', minWarmthToUnlock: 4 },
  { id: 'steady',   label: 'Steady Flame',blurb: 'the shape of a life together — hopes, history, what home means', logColor: '#FF8A3D', minWarmthToUnlock: 10 },
  { id: 'deep',     label: 'Deep Water',  blurb: 'the honest ones — fears, needs, and how they most want to be loved', logColor: '#F2683A', minWarmthToUnlock: 18 },
];

// ── THE BANK — 40 questions, tiered early → advanced ─────────────────────────
export const FIRE_QUESTIONS: QuizQuestion[] = [
  // ── EMBERS (safe, warm, funny — the ice breakers) ──
  { id: 'q_comfort_food', tier: 'embers', audience: 'both', prompt: "What's their comfort food after a hard day?" },
  { id: 'q_song_loud', tier: 'embers', audience: 'both', prompt: "What song do they turn up loud when it comes on?" },
  { id: 'q_perfect_saturday', tier: 'embers', audience: 'both', prompt: "What does their perfect lazy Saturday look like?" },
  { id: 'q_useless_talent', tier: 'embers', audience: 'both', prompt: "What's a small, useless thing they're weirdly good at?" },
  { id: 'q_makes_laugh', tier: 'embers', audience: 'both', prompt: "What always makes them laugh, even on a bad day?" },
  { id: 'q_drink_order', tier: 'embers', audience: 'couple', prompt: "What's their go-to coffee or drink order?" },
  { id: 'q_childhood_show', tier: 'embers', audience: 'both', prompt: "What show or movie did they love as a kid?" },
  { id: 'q_pet_name', tier: 'embers', audience: 'family', prompt: "If they could have any pet, what would they pick?" },
  { id: 'q_ideal_vacation', tier: 'embers', audience: 'both', prompt: "Beach, mountains, or city — where do they most want to go?" },
  { id: 'q_snack_secret', tier: 'embers', audience: 'both', prompt: "What snack do they secretly hope nobody else eats?" },

  // ── KINDLING (the little true things — delights and irritations) ──
  { id: 'q_feels_seen', tier: 'kindling', audience: 'couple', prompt: "What small thing makes them feel noticed and appreciated?" },
  { id: 'q_pet_peeve', tier: 'kindling', audience: 'both', prompt: "What tiny thing genuinely gets under their skin?" },
  { id: 'q_recharge', tier: 'kindling', audience: 'both', prompt: "After a draining day, do they recharge with people or alone?" },
  { id: 'q_proud_recent', tier: 'kindling', audience: 'both', prompt: "What's something they did recently that they're quietly proud of?" },
  { id: 'q_stress_tell', tier: 'kindling', audience: 'couple', prompt: "What's the first sign they're stressed, before they say a word?" },
  { id: 'q_kind_gesture', tier: 'kindling', audience: 'both', prompt: "What kind gesture means the most to them — words, help, a hug, time, or a little gift?", hint: 'the five love languages, gently' },
  { id: 'q_morning_mood', tier: 'kindling', audience: 'family', prompt: "Are they a bright morning person or do they need a slow start?" },
  { id: 'q_worry_lately', tier: 'kindling', audience: 'both', prompt: "What's something small they've been worried about lately?" },
  { id: 'q_favorite_memory_year', tier: 'kindling', audience: 'both', prompt: "What's a favorite memory they've made in the last year?" },
  { id: 'q_cheer_up', tier: 'kindling', audience: 'both', prompt: "When they're down, what actually helps them feel better?" },

  // ── STEADY FLAME (the shape of a shared life) ──
  { id: 'q_home_means', tier: 'steady', audience: 'couple', prompt: "What does 'home' feel like to them — what makes a place feel safe?" },
  { id: 'q_proud_family', tier: 'steady', audience: 'family', prompt: "What are they most proud of about this family?" },
  { id: 'q_dream_someday', tier: 'steady', audience: 'both', prompt: "What's a 'someday' dream they haven't let go of?" },
  { id: 'q_role_model', tier: 'steady', audience: 'both', prompt: "Who shaped them most growing up, for better or worse?" },
  { id: 'q_hard_season', tier: 'steady', audience: 'couple', prompt: "What was a hard season they came through, that made them who they are?" },
  { id: 'q_feel_respected', tier: 'steady', audience: 'both', prompt: "What makes them feel respected by the people they love?" },
  { id: 'q_tradition_keep', tier: 'steady', audience: 'family', prompt: "What family tradition do they never want to lose?" },
  { id: 'q_success_looks', tier: 'steady', audience: 'both', prompt: "Five years out, what would make them feel their life is going well?" },
  { id: 'q_first_impression', tier: 'steady', audience: 'couple', prompt: "What did they first notice about you, way back at the start?" },
  { id: 'q_recharge_together', tier: 'steady', audience: 'couple', prompt: "What's something you two used to do together that they miss?" },

  // ── DEEP WATER (the honest ones — fears, needs, being loved) ──
  { id: 'q_biggest_fear', tier: 'deep', audience: 'couple', prompt: "What's a fear they carry that they don't say out loud often?", hint: 'go gently — this is deep water' },
  { id: 'q_feel_alone', tier: 'deep', audience: 'couple', prompt: "When do they feel most alone, even when people are around?" },
  { id: 'q_need_when_hurt', tier: 'deep', audience: 'both', prompt: "When they're hurting, what do they most need from you — closeness, space, or to be heard?" },
  { id: 'q_hardest_admit', tier: 'deep', audience: 'both', prompt: "What's something hard for them to admit they need?" },
  { id: 'q_want_forgiven', tier: 'deep', audience: 'couple', prompt: "What do they most wish you understood about them?" },
  { id: 'q_love_shows', tier: 'deep', audience: 'both', prompt: "How do they show love when they're too tired or scared to say it?" },
  { id: 'q_child_wish', tier: 'deep', audience: 'family', prompt: "What did they most want to hear from a grown-up when they were small?" },
  { id: 'q_pressure_carry', tier: 'deep', audience: 'both', prompt: "What pressure or weight are they carrying that others don't see?" },
  { id: 'q_repair_reach', tier: 'deep', audience: 'couple', prompt: "After a fight, what helps them feel reached — what makes it safe to come back?" },
  { id: 'q_most_loved', tier: 'deep', audience: 'both', prompt: "When in their whole life have they felt most deeply loved?" },
];

export function questionsFor(tier: QuizTier, audience: 'couple' | 'family'): QuizQuestion[] {
  return FIRE_QUESTIONS.filter(q => q.tier === tier && (q.audience === 'both' || q.audience === audience));
}

// The gentle, unmissable law shown before Deep Water opens.
export const DEEP_WATER_CARE =
  "These next questions go deeper — fears, needs, the tender things. There are no wrong guesses here, only two people learning each other. Take your time. If a question is too much tonight, skip it and lay a log anyway; showing up is the point.";
