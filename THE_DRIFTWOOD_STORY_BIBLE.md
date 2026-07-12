# THE DRIFTWOOD STORY BIBLE — the Undertow rewrite (v1, prep)
*Commissioned in the same 2026-07-12 order as Rehabit's THE_MYSTERY_BIBLE.md:
"The Driftwood app will need a rewrite like this too. All these stories should
connect." This document stages the rewrite; the engine it needs is ALREADY
SHIPPED (choice beats + when filters + flags in `driftwood_story_choices_v1`,
ported from the Voyager's season engine into `data/milestones.ts` and
`MilestoneLog.tsx`). Build on DRIFTWOOD_BIBLE.md — deepen, never replace.*

## THE ONE VILLAIN, THIS WORLD'S CLOTHES

The universe's villain is always the same and always beaten the same way
(together, never by exile): L.A.N.C.E.'s island voice → the Voyager's REGISTRY
(shame with a wax seal) → **Driftwood's UNDERTOW — the current that pulls a
family apart by pulling each member separately.** The Undertow never appears.
It has no face. It is only ever visible by its EFFECTS: the phone that eats an
evening, the silence that calcifies, the two huts drifting apart on one beach.
The rewrite's job: give the Undertow a fair-play mystery structure — not
whodunit but **WHAT-is-doing-it** — a family that slowly discovers their
island's strange tides are a pattern, charts the pattern together, names it
(ms_naming_undertow, already the Tier-4 crown), and answers it the way the
Registry was answered: with a written page of their own (the family's charter,
Season 5).

## THE MYSTERY FRAME (adapted from the Voyager's craft laws)

1. **Fair play** — every tide-mark the family sees goes on a chart they can
   revisit (THE TIDE CHART, this world's Chart Room; build spec below).
2. **The clue ladder**: each season's milestones earn TIDE-MARKS (clue
   records): S1 the wreck's oddities · S2 the camp's frictions have a rhythm ·
   S3 the joy-tide flows when together, ebbs alone · S4 the pattern named —
   the Undertow moves through PEOPLE (who chases, who hides) · S5 the charter.
3. **Every family member "suspected"**: the S4 cases already stage this
   (who chases, who hides; the speaker's shell) — the rewrite makes it
   explicit and always resolves into compassion (the Voyager's law).
4. **The Jumble as the ensemble**: Skip opens (guard down), Hollow closes
   (truth lands), Echo-2 relays between feuding members (the Echo pattern),
   Bailer's counting is comic until it isn't, the Collier holds the forge
   scenes. Every robot speaks in every milestone (ensemble law).
5. **Chip's thread**: the bottle from the Voyager's finale (two letters,
   Chip's + the captain's) WASHES ASHORE on Driftwood's beach in Season 3 —
   the traveling object connecting worlds (gift, never homework). A family
   that reads it learns another crew crossed their own water once.

## THE FOUR STAGES, MAPPED (Lance's staging order, family edition)

- **S1 THE WRECK** (safety & co-regulation) = stage 1: stay ashore, accept
  the island, commit to the fire.
- **S2 THE CAMP** (structure) = stage 2: know your own hull — each member's
  needs, tells, gauges (the boiler-gauge pattern for families).
- **S3 THE HEARTH** (joy & connection) = stage 3: passions, play, the
  joy-tide; the bottle washes ashore; game night is canon.
- **S4 THE STORM** (conflict & repair) = the descent: the Undertow named,
  the repair rope, the apology forge — the reveal equivalent: the family
  sees the pattern is not a PERSON. Nobody is the villain. The current is.
- **S5 THE LAUNCH** = stage 4 + the finale run (Lance's last-7-10 law):
  the charter written (the Registry-answer), every plank named, the letter
  in the bottle ANSWERED (the family writes back to the crew — the universe's
  next thread), the naming of the boat, and the vote this world earns:
  stay, or sail — and like the crew, they keep the island AND the boat.

## THE TIDE CHART (this world's Chart Room — build next)

One component (`TideChart.tsx`), four boards, reading existing state:
1. **THE TIDE-MARKS** — every clue beat seen (fair play; port `recordClue`
   from the Voyager's investigation.ts with `driftwood_tide_marks_v1`).
2. **THE FAMILY BOARD** — the Seven's cards: each member's tells, needs,
   love-language (from the games' real data), their chase/hide pattern —
   compassion-framed, never diagnostic.
3. **THE ISLAND CHART** — the real island map (the 3D world's geography):
   camp, forge, cove, ridge — milestones pinned where they happened.
4. **THE WEEK'S WATER** — the TOGETHER meter's history as tides (world.ts
   events), the fire's height over time. The Undertow made visible.

## BUILD ORDER (next iterations / sessions)

1. ✅ Engine (choice/when/flags) — shipped 2026-07-12.
2. THE TIDE CHART component + tide-mark recording in MilestoneLog.
3. S1–S2 milestones rewritten at novel density (craft beats exist in
   milestoneCraft.ts — deepen with ensemble dialogue + choices per the
   Voyager's density: 10–14 beats, one texture choice per milestone).
4. S3 (the bottle ashore) + S4 (the naming, the who-chases reveal frame).
5. S5 finale run + epilogue mirror (Buddy's pattern: Skip reads the family's
   season back) + qa-story-integrity gate (port from the Voyager).
6. ASSET_PROMPTS v2 regeneration (Lance's batch policy).

*The island only yields to together. The Undertow only loses to named.
— C., for L., 2026-07-12*
