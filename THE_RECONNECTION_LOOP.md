# 🔥 THE RECONNECTION LOOP — Driftwood's north star & the mini-game roadmap
### Lance's vision, captured verbatim 2026-07-11 — the WHY behind every build
*"When people say phones and devices divide family, we will turn that around and
strengthen a family." Every design decision serves this. — Lance*

---

## THE THESIS (say it before every design choice)

**Phones divide families. Driftwood turns the phone into the conch.** The
shipwreck IS the family's divide; getting back to civilization requires working
TOGETHER. We draw dopamine INTO the relationship — toward love, play, and being
together — rather than letting it leak out to work and unimportant things. We are
responsible, through the visuals and the type of app we make, for pointing that
pull the right way.

## THE LIVED EXAMPLE (Lance's own words, the design target)

> A man and wife about to divorce, breaking a family up. They use the app. Each
> completes individual tasks from their own devices all week — "complete the
> relationship quiz," then a challenge where the couple answers questions about
> each other using their avatars on the beach. Each right answer, a log goes on
> the virtual fire they build. Whoever gets the fire built... and there's an
> option to SHARE the fire with the family or couple so they can stay warm at
> night. Then they come into session and laugh about it, using avatars, asking
> questions. Saturday night they pull the desktop up, use their phones in co-op
> mode to travel the island together, laughing, completing challenges — and boom,
> we just saved their family.

**The loop, named:** solo async week (each phone) → shared fire-building (learn
each other) → laughter in session (the debrief) → Saturday co-op island travel →
reconnection. The phone is the campfire the family gathers around.

## THE ONE LAW THAT PROTECTS IT (the Undertow, bible §1)

The game NEVER becomes scorekeeping. Not "whoever knows more wins" — the couple
beats the COLD, together, never each other. One fire, one warmth meter, climbs
when EITHER partner knows the other. The Undertow feeds on scorekeeping; the game
must never become it. (This is why the Fire Quiz has no partner-vs-partner score.)

## THE DOSAGE (early intervention → advanced, exactly as ordered)

Every mini-game and the 31 milestones follow ONE arc — easy, warm ice-breakers
first (rebuild the habit of curiosity, safely), deepening only as safety is
rebuilt. The Fire Quiz tiers (Embers → Kindling → Steady → Deep Water, gated on
warmth) are the template: **you earn the hard questions by laying the easy logs
first.** Season I (safety) → V (integration) in the Milestone Log does the same
at the story scale. The tier IS the clinical dose.

---

## ✅ SHIPPED (the loop is already half-built)
- **The 31-milestone arc** (`src/data/milestones.ts`) — Season I safety/
  co-regulation → V integration; each a conjoint tool, save-signature complete.
- **The Gathering** — camp codes, same map every device, events feed the needs.
- **The 3D island** — hikable, third-person real avatars, the Jumble spread wide.
- **🔥 THE FIRE QUIZ** (`FireQuiz.tsx` + `data/fireQuiz.ts`) — the couples/family
  knowing-game, 40 tiered questions, pass-the-phone, grows a shared fire, feeds
  TOGETHER so the kids see it lit. **This is mini-game #1 of the 30–40.**

## 🎯 THE MINI-GAME ROADMAP (the 30–40 games — build order, all zero-credit)
*Each is an interactive game (not just a tool-launch), tiered easy→deep, feeding
the fire/needs/lanterns via the event law. The Fire Quiz is the proven pattern to
clone. Build them as `src/components/games/*.tsx` + a `src/data/*.ts` bank.*

**Tier 1 · ICE-BREAKERS (early intervention — build these next):**
1. ✅ The Fire Quiz — know-each-other, logs on the fire
2. **Two Truths & a Tide** — each shares two true + one false about their week; partner guesses; a lantern lights per catch
3. **The Appreciation Volley** (milestone 14 as a live game) — lob specific appreciations across the fire, keep the rally alive, count the volley not the people
4. **Sand Drawings** — co-op: one describes a memory, the other "draws" it on the beach canvas; compare — the gap is the laugh
5. **Bid & Turn** — a Gottman micro-game: a bid appears, tap to "turn toward" in time; the signal fire brightens

**Tier 2 · KINDLING (the little true things):**
6. **The Love-Language Sort** — sort what makes them feel loved; reveal & compare
7. **Weather Report** — each logs their day's inner weather; the sky over the shared island reflects the crew's average
8. **The Repair Rope Builder** — draft the exact phrases that reach each other mid-storm (milestone 23 as a craft-game)
9. **Chore Swap Challenge** — trade one invisible task this week; the lantern lights when the OTHER person's task gets done
10. **Memory Match** — flip shells, each pair is a shared family memory to retell

**Tier 3 · STEADY FLAME (the shape of a life):**
11. **The Genogram Hunt** — walk the island finding "pattern stones," place them on the family map
12. **The Ridgepole Vote** — each nominates a family value; build the shelter beam from the shared ones
13. **Ritual Designer** — invent a family ceremony together; it enters the tide table and recurs
14. **The Story Circle** — turn-based: each adds a chapter to the family's told history
15. **Two Huts or One** — place everyone's sleeping spot on the camp map; the honest closeness chart

**Tier 4 · DEEP WATER (earned, gated on warmth — the advanced work):**
16. **Naming the Undertow** (milestone 20 as the crown co-op game) — map your cycle together on the current-chart, live
17. **The Empty Chair / Perspective Swap** (already built — surface it as a game)
18. **The Load Test** — rehearse the hard conversation in the shallows, scaffolded
19. **The Letter in the Bottle** — write to the family a year out, launch it
20. **The Apology Forge** — walk a real repair through the kintsugi forge

**…and 10–20 more** filling each tier (kid-specific games for family mode, solo
grounding mini-games for the week, seasonal event games). The framework: one
`GameShell` (fire/needs/no-shame/tier-gate) that every game plugs into — extract
it from FireQuiz once game #2 or #3 confirms the shape.

---

## 👨‍👩‍👦‍👦 THE CO-OP FIELD TEST (the Saturday night Lance described)
Desktop + two phones on the tailnet → Light the fire → both Enter the Island →
walk together, play a mini-game, laugh. This is the acceptance test for the whole
vision. Run it with a real couple (the captain has one aboard).

*We are not competing with the phone for the family's attention. We are aiming the
phone's pull back at each other. That's the whole company. — C., for the captain.*
