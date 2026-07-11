// ─────────────────────────────────────────────────────────────────────────────
// Challenge completion signals
//
// A challenge is only "complete" when the user genuinely DOES the task — never by
// self-checking boxes. Every challenge tool either:
//   • 'save'    — persists a real entry to localStorage when the user saves their
//                 work. Completion unlocks when that store GROWS vs. the snapshot
//                 taken when the tool opened.
//   • 'count'   — an experiential tool that reports REAL repetitions through the
//                 challenge progress bus (e.g. breathwork emits one event per
//                 completed breath cycle). Completion unlocks only once the user
//                 has genuinely done `target` reps — it cannot be skipped or
//                 self-checked. This is the strongest gate for non-persisting tools.
//   • 'session' — an experiential tool that neither persists nor emits reps yet.
//                 Completion unlocks after the user genuinely stays engaged for
//                 `minSeconds` (the session naturally takes that long), so it
//                 can't be skipped instantly. Candidates to upgrade to 'count'.
// ─────────────────────────────────────────────────────────────────────────────

export type CompletionSignal =
  | { kind: 'save'; keys: string[]; actionLabel: string }
  | { kind: 'count'; channel: string; target: number; unit: string; actionLabel: string }
  | { kind: 'session'; minSeconds: number; actionLabel: string };

export const TOOL_COMPLETION: Record<string, CompletionSignal> = {
  // ── Save-gated tools (real entry persisted) ──
  cbt_reframe:        { kind: 'save', keys: ['therapy_cbt_saved_reframes'], actionLabel: 'Save a reframe to complete' },
  emotion_wheel:      { kind: 'save', keys: ['lance_emotion_log_v1'], actionLabel: 'Save your emotions to complete' },
  wise_mind:          { kind: 'save', keys: ['therapy_dbt_chain_analyses', 'therapy_dbt_rescue_logs'], actionLabel: 'Save a DBT entry to complete' },
  tipp_skills:        { kind: 'save', keys: ['therapy_dbt_chain_analyses', 'therapy_dbt_rescue_logs'], actionLabel: 'Save a DBT entry to complete' },
  values_act:         { kind: 'save', keys: ['therapy_act_matrix'], actionLabel: 'Save your matrix to complete' },
  shadow_journal:     { kind: 'save', keys: ['therapy_jungian_reflections'], actionLabel: 'Save a reflection to complete' },
  ifs_parts:          { kind: 'save', keys: ['therapy_ifs_parts'], actionLabel: 'Save a part to complete' },
  emdr_pacer:         { kind: 'save', keys: ['therapy_emdr_sessions'], actionLabel: 'Finish a set to complete' },
  recovery_space:     { kind: 'save', keys: ['recovery_reflection_logs_v1', 'recovery_coping_successes', 'recovery_urge_intensity_logs', 'recovery_problem_solving_plans_v1'], actionLabel: 'Save an entry to complete' },
  couples_alignment:  { kind: 'save', keys: ['couples_appreciation_notes_v1', 'couples_completed_activities_v1'], actionLabel: 'Save an entry to complete' },
  gratitude_log:      { kind: 'save', keys: ['lance_gratitude_log'], actionLabel: 'Save a gratitude to complete' },
  sleep_log:          { kind: 'save', keys: ['circadian_sleep_logs'], actionLabel: 'Log your sleep to complete' },
  activity_tracker:   { kind: 'save', keys: ['lance_activity_v1'], actionLabel: 'Log an activity to complete' },
  worry_parking:      { kind: 'save', keys: ['lance_worries_v1'], actionLabel: 'Park a worry to complete' },
  fear_ladder:        { kind: 'save', keys: ['lance_fears_v1'], actionLabel: 'Build a ladder to complete' },
  inner_child:        { kind: 'save', keys: ['lance_innerchild_v1'], actionLabel: 'Save a letter to complete' },
  behavioral_activation: { kind: 'save', keys: ['lance_ba_v1'], actionLabel: 'Schedule an activity to complete' },
  future_letter:      { kind: 'save', keys: ['lance_future_letter_v1'], actionLabel: 'Seal a letter to complete' },
  integration_statement: { kind: 'save', keys: ['lance_integration_v1'], actionLabel: 'Write your statement to complete' },
  positive_data:      { kind: 'save', keys: ['lance_posdata_v1'], actionLabel: 'Log evidence to complete' },
  assertiveness:      { kind: 'save', keys: ['lance_dearman_v1'], actionLabel: 'Save a script to complete' },
  dream_decoder:      { kind: 'save', keys: ['lance_dreams_v1'], actionLabel: 'Save a dream to complete' },
  grief_space:        { kind: 'save', keys: ['lance_grief_v1'], actionLabel: 'Save an entry to complete' },
  resilience_map:     { kind: 'save', keys: ['lance_resilience_v1'], actionLabel: 'Save your map to complete' },
  life_vision:        { kind: 'save', keys: ['lance_vision_v1'], actionLabel: 'Save your vision to complete' },
  progressive_muscle_relaxation: { kind: 'save', keys: ['lance_pmr_sessions_v1'], actionLabel: 'Finish a session to complete' },
  anger_thermometer:  { kind: 'save', keys: ['lance_anger_log_v1'], actionLabel: 'Log an entry to complete' },
  window_of_tolerance: { kind: 'save', keys: ['lance_window_logs_v1'], actionLabel: 'Log your window to complete' },
  crisis_safety_plan: { kind: 'save', keys: ['lance_safety_plan_v1'], actionLabel: 'Save your plan to complete' },
  communication_lab:  { kind: 'save', keys: ['lance_commlab_v1'], actionLabel: 'Save an entry to complete' },

  // ── Count-gated tools (real repetitions emitted via the progress bus) ──
  cranial_nerve_gym:  { kind: 'count', channel: 'cranial_nerve_gym', target: 2, unit: 'exercise', actionLabel: 'Complete 2 cranial nerve exercises' },
  breathwork_478:     { kind: 'count', channel: 'breathwork_478', target: 3, unit: 'cycle', actionLabel: 'Complete 3 full breath cycles' },
  box_breathing:      { kind: 'count', channel: 'box_breathing',  target: 3, unit: 'cycle', actionLabel: 'Complete 3 full breath cycles' },

  grounding_54321:    { kind: 'count', channel: 'grounding_54321', target: 5,  unit: 'sense',    actionLabel: 'Work through all five senses' },
  body_scan:          { kind: 'count', channel: 'body_scan',       target: 10, unit: 'zone',     actionLabel: 'Scan every body zone' },
  compassion_space:   { kind: 'session', minSeconds: 180, actionLabel: 'Spend 3 minutes in compassion practice' },
  art_therapy:        { kind: 'session', minSeconds: 120, actionLabel: 'Create your artwork for 2 minutes' },
  binaural_lab:       { kind: 'session', minSeconds: 60,  actionLabel: 'Listen for at least 1 minute' },
};

// Sum of persisted entries across a save-signal's keys. Arrays count by length;
// non-array objects count by serialized length (e.g. the crisis safety plan grows
// as fields are filled). Returns 0 when nothing is stored yet.
export function readSaveProgress(keys: string[]): number {
  let total = 0;
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      total += Array.isArray(parsed) ? parsed.length : raw.length;
    } catch {
      /* ignore malformed entry */
    }
  }
  return total;
}

// Raw content across a save-signal's keys, concatenated. Some tools (Gratitude Log,
// Activity Tracker, ...) UPSERT one entry per calendar day rather than appending a new
// array element each save — so if today's entry already exists when the challenge
// screen mounts, a fresh save changes the CONTENT but not the array LENGTH, and
// readSaveProgress()'s growth check never fires, leaving the challenge permanently
// "stuck" until the next calendar day. Comparing raw content instead of just length
// catches upserts too, without needing every tool's data model to be append-only.
export function readSaveSignature(keys: string[]): string {
  return keys.map(key => {
    try {
      return localStorage.getItem(key) ?? '';
    } catch {
      return '';
    }
  }).join(' ');
}
