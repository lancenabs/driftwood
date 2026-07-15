# DRIFTWOOD — THE HIGGSFIELD SHOT LIST
*The last layer. Written 2026-07-14, after the app/challenges/dialogue were made
to follow the story end to end. Lance's plan: "at the end we can go back to
higgsfield and get anything you're needing for the 2d or 3d islands or the app
designs, in and outside the tools." This is that list — generate, don't decide.*

---

## THE ONE RULE THAT GOVERNS EVERY PROMPT
**The maker is ELIAS, the wayward boy. Bauer is the '54 child the robots saved,
grown into the 81-year-old tour guide.** (Blessed 2026-07-14; the app was
reconciled in `0f4cf19`.) Any art that shows a grieving *man* building the robots
is the OLD canon and must not be reproduced. See `THE_WAYWARD_BOY.md` and the
memory `the-wayward-boy-origin-canon`.

**Style:** match the existing `public/story/act*/*.jpg` — the painterly storybook
look already established. Wooden robots with green bottle-glass eyes. Warm, hand-
built, a little melancholy. The Driftwood robots are WOODEN (the metal ones live
on Voyager/Rehabit).

---

## PRIORITY 0 · THE ENDING HAS NO ART (`public/story/act5/` is empty)
These three are *referenced by the milestones right now* and 404 on disk. The
climax of the whole crossing renders with broken image links.

| slot | milestone | prompt |
|---|---|---|
| `act5/29_plank_names.jpg` | 27 · Every Plank Has a Name | A family and wooden robots lashing a raft on the tide line at dawn, each plank being named aloud; the Collier (furnace-bodied, anvil hands) overseeing. From *Elias's* plans — a boy's drawings, pinned to a post. Hopeful, deliberate. |
| `act5/30_totem.jpg` | 30 · The Launch Council | The camp totem at dusk, ringed by lanterns, a family and ten wooden robots in a last council. Warm, valedictory. |
| `act5/31_compass_hands.jpg` | 31 · The Naming of the Boat | Dawn. A signal fire climbing a cliff-top; a boat appearing on the horizon; the family's hands together on the raft's prow. The reveal the whole crossing built to. |

---

## PRIORITY 1 · CANON-CORRECTED REGENERATIONS
Existing art made under the old "Bauer built them" canon. Reissue to match Elias.

| slot | why it must change | new prompt |
|---|---|---|
| `act4/28_workshop.jpg` | THE climax reveal (milestone 25). The cave behind the waterfall. Must read as a *boy's* life's work, not a grieving man's. | A chapel-sized cave behind a waterfall: a cot, a workbench worn to a boy's hands, shelves of carved driftwood limbs "in rows like a choir," a fire-pit laid ready years ago. A child asleep by it, wrapped in an oversized oilskin. On the wall, scratched: **T. BRENNAN · 1954**. The loneliest, safest room on the island. |
| `act1/02_bauer_wheel.jpg` | Shows Bauer at a ship's wheel — fine as the *guide* (the tour boat), but confirm it doesn't imply he's the island's origin. | Mr. Bauer, ~81, weathered and kind, at the wheel of a small tour boat, bringing a family toward an island he loves. He was saved here as a boy; it shows. |

---

## PRIORITY 2 · THE NEW LOCATIONS (built in 3D, no 2D plates or cold-opens)
Everything below is now walkable in `island3d`. Lance wanted "cinematic openings."
These are **hero stills + optional cold-open videos** — establishing plates that
can play before a session or head a tool. Reference frames can be pulled straight
from the 3D island (`scripts/shot-*.mjs` already screenshot every one).

| subject | type | prompt / note |
|---|---|---|
| **The Waterfall** | still + 6s video | The falls down a grey outcrop into a rimmed plunge pool, turquoise, mist rising, a stream running off downhill. "Meet me at the waterfall." The video: the water actually falling. |
| **The Cave, from inside** | still | Looking OUT through the falling water from within the cave, the Collier's fire in the foreground. (See PRIORITY 1 for the reveal interior.) |
| **The Workshop, interior** | still | Elias's shed: a workbench with one clean rectangle in the dust where a roll of plans was lifted and never returned; notebooks going back to 1930; carved limbs on shelves; a lamp still burning; **THE TOOLS WILL ANSWER** over the door; **ELIAS** cut low on the back wall. The scene of the theft, told without a word. |
| **The Totem** | still | A driftwood totem in the camp, one carved band per milestone a family finished together, capped, lantern-lit. It never shrinks. |
| **Driftwood City — DARK** | still + cold-open | The wooden city on the island's central plain at dusk: streets, benches, a park, **hundreds of lamps that have never been lit**, one ember burning at the Heart. "There's people here," and there are no people there. |
| **Driftwood City — LIT** | still + cold-open | The same city, every lamp burning warm, the night a family finished all thirty-one. The reward. Pair it with the DARK plate — the before/after is the whole feeling. |
| **The Heart of Driftwood** | still | Stacked driftwood totem at the city's core, a breathing ember on top, four wooden waterwheels turning in a moat. "Humming very faintly with running water, like a held note." |
| **The Flume / aqueduct** | still | A wooden channel on trestles carrying water from the waterfall down to the city — a boy's engineering, kept running seventy years. Follow it either way and you find the other half of the story. |

---

## PRIORITY 3 · CHARACTER SHEETS (for cold-opens, the boarding, the Naming Book)
| subject | prompt |
|---|---|
| **Elias, the wayward boy** | A ~12-year-old in a 1920s Maine foundling home, then alone on an island building a wooden robot by lamplight. Clever out of desperation, not talent. Twice given back; it's in his face. He is the maker. |
| **Skip** | The first and smallest robot, built LAST from leftover scraps, "the most love per splinter." Green bottle-glass knot-eyes, a bandaged hand, narrates everything. The soul. |
| **The Jumble ×10** | Hollow (tall, quiet), the Collier (furnace body, anvil hands, the only one awake at night), Bailer (counts everything), Echo-2 (says back what was meant), Barnacle (sticks to whoever's having the worst day). All wooden, all green-eyed. |
| **Mr. Bauer, the child (1954)** | The nine-year-old middle Brennan boy, lost in a storm, found in the cave by Barnacle and the Collier's fire. The night the island saved his family. |
| **The SS Halcyon, 1954** | A liner breaking up on a reef that's on no chart — because the only man who ever found the island had nobody to tell. |

---

## HOW THESE WIRE IN (so the art has somewhere to land)
- **Milestone stills** → `public/story/act*/NN_name.jpg`, already read by the
  `art:` field on each milestone beat. Drop-in, no code.
- **City place art** → `public/city/<place-id>.webp`; `CityScene.tsx` prefers a
  real image when the `art` field is filled (today it draws generative SVG).
- **Cold-open / ambient video** → `public/ambient/` (exists). The Companion's
  Watch scene can play any video to both screens, synced.
- **3D reference frames** → already produced by `scripts/shot-waterfall.mjs`,
  `shot-city.mjs`, `shot-invite.mjs`. Use them as img2img seeds so the 2D plates
  match the built geometry.

*Nothing here is required for the app to run — every surface degrades honestly to
generative art or the 3D view. This is the polish layer, and it's last on purpose.*
