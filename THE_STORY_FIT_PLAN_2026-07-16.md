# FITTING DRIFTWOOD TO THE WAYWARD BOY — the plan, with the history that demands it
*Written 2026-07-16 after Lance found old dialogue in the opening and asked:
"research what happened… verify there is a script… maybe we have 2 different
versions." He was right. Here is the full account, then the fit plan.*

---

## PART 1 · WHAT HAPPENED (the research)

### The three story generations, in order

| # | Document | Where | Date | What it says |
|---|---|---|---|---|
| 1 | `DRIFTWOOD_BIBLE.md` (v3) | command center docs | **Jul 10** | The world bible: modern family charters a boat, storm, island, five needs, the Undertow. Robots barely sketched. |
| 2 | `THE_TIDE_LINE.md` | driftwood-app | **Jul 11** | The story seed: "Ship of Separate Rooms" cold open, robots = "cousins of the Wayward Crew… lost in shipping." **The boarding script was written FROM THIS** (commit `119d864`, Jul 12). |
| 2b | `THE_DRIFTWOOD_STORY_BIBLE.md` | driftwood-app | Jul 12 | The Undertow-mystery structure layer (tide-marks, clue ladder). Mechanism doc, not canon-changing. |
| 3 | **`THE_WAYWARD_BOY.md`** | driftwood-app | **Jul 14** (`ce74a59`) | **THE BLESSED CANON.** Book One: Elias, Gullhaven, 1929–1951. Book Two: SS Halcyon castaways, 1954–55. Registered in the command-center Library as "the origin story the whole ecosystem now traces back to" (`CORE_STORY_IDS`). |

### What was and wasn't reconciled after the rewrite

- ✅ **The climax** — commit `0f4cf19` (Jul 14) rewrote milestone 25/26: Elias
  the maker, Bauer the nine-year-old Brennan boy the cave saved in '54, the
  ledger, "yours is the twelfth family." The 31 milestones are LARGELY on new
  canon already.
- ✅ **Rehabit** — `THE_WAYWARD_CREW_BOOK_THREE.md` was written THE SAME NIGHT
  to reconcile the Voyage ("Malakor became the orphanage"; the bottle at Book
  Three's end washes onto Driftwood's beach = milestone 16).
- ✅ **LANCE** — `THE_STORY_PLAN.md` (His Father's Name) connects via ch. 29
  "the invasion": Malakor found Elias's island, took the tools and the
  sentence. THE TOOLS WILL ANSWER over the workshop door is the hinge.
- ❌ **THE BOARDING WAS NEVER TOUCHED.** Written Jul 12 from THE_TIDE_LINE
  (its header still says "THE_TIDE_LINE.md canon"); the Jul 14 reconciliation
  targeted the climax only. So the first seven beats a family ever reads are
  generation-2 script: "The brochure said ISLAND ADVENTURE," phones out, a
  commercial day-tour — which contradicts generation-3 canon where Bauer runs
  a private, almost liturgical crossing ("every season… yours is the twelfth").
- ❌ **Milestone 13 (Remembering House)** still says the carved walls show
  generic "robot history" — under canon those walls carve BOOK ONE (the boy).
  (The act2/17 image was already regenerated to show the boy; the words lag.)
- ❌ **No canonical SCRIPT existed** — the novella is prose, the dialogue is
  code, and nothing mapped one to the other. That's the hole the opening fell
  through, and the answer to "verify there is a script": there wasn't one.
  Now there is: **`THE_DRIFTWOOD_SCRIPT.md`** + a `qa:script` gate.

### Why the timeline reads "early 1900s" — CORRECTED SAME DAY
Book One is 1929–1951; Book Two is 1954–55. The first version of this plan
said the player family arrives in the present ("Bauer, 81 now") — but the
transcript research proved that frame was a bundled recommendation, not
Lance's dictation, which always said **"the whole story starts 1950s."**
Lance confirmed 2026-07-16: **the player family IS a 1954 Halcyon family;
there is no guide character; milestone 31 ends with Malakor's arrival (the
invasion).** The app was rewritten accordingly the same day — the crossing is
the Halcyon's, the relics are Elias's, T. BRENNAN is the fellow-castaway
child, and qa:script now bans "Bauer" from every player-facing source.

---

## PART 2 · THE FIT PLAN (executed same day — receipts below)

1. **Rewrite the boarding cold open** (`BoardingStory.tsx`) in Wayward Boy
   voice: a 1929 Gullhaven prologue (two beats — the boy, given back twice,
   who sailed for an empty island), then the modern arrival rewritten — no
   brochure, no tour company; Bauer's private crossing, "It only works on
   families," the twelfth family; storm; tide line; compass. Same beat count
   ±2, same art slots, same skippability.
2. **Fix milestone 13** — the Remembering House walls carve Book One.
3. **Sweep every player-facing string** for generation-2 phrases (brochure,
   ISLAND ADVENTURE, lost-in-shipping, Wayward-Crew-cousins). Fix on sight.
4. **Write `THE_DRIFTWOOD_SCRIPT.md`** — the canonical beat-by-beat script:
   every boarding beat and all 31 milestones mapped to their Wayward Boy
   chapter, with the forbidden-phrase list.
5. **Add `qa:script`** to the gate suite: asserts the script doc exists, maps
   every milestone id, that required canon marks exist in the app (Elias,
   T. BRENNAN, the twelfth family), and that forbidden generation-2 phrases
   appear nowhere in player-facing sources. Drift like this can never again
   be silent.
6. **Regenerate opening art where the words changed** (Foundry, style-anchored)
   — the dock beat no longer shows a brochure-tour mood.

## PART 3 · WHAT THIS DOES NOT TOUCH
- The 31 milestones' structure, games, rewards, bridge, crisis law — the
  outline's law stands: "the 31 stay exactly where they are."
- The climax (already canon), the city, the islands.
- Rehabit and LANCE scripts (already reconciled by their own docs); their
  connective tissue into Driftwood (the bottle, THE TOOLS WILL ANSWER) already
  lands in the right places.
