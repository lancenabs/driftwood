# THE DRIFTWOOD SCRIPT — the canonical player-facing beat map
*Established 2026-07-16 after the generation-2 opening was found still shipping
(see THE_STORY_FIT_PLAN_2026-07-16.md). This is the ONE document that maps every
player-facing beat to its source in `THE_WAYWARD_BOY.md` (the blessed canon,
2026-07-14). The `qa:script` gate asserts this file stays honest: every
milestone id appears here, the canon marks live in the app, and the forbidden
generation-2 phrases appear nowhere a player can read.*

## THE LAWS OF THE SCRIPT
1. **THE_WAYWARD_BOY.md guides everything.** If a line contradicts it, the line
   is wrong, not the book.
2. **The frame is present-day; the island is period (1929–1955).** Bauer is 81
   NOW (Lance's binding decision, 2026-07-14). The family arrives today,
   walking into a story that finished before they were born.
3. **The maker is ELIAS. Bauer is the saved child** (the middle Brennan boy,
   nine in 1954). Any line where Bauer *built* anything is old canon leaking.
4. The 31 milestones are the Jumble's initiation — *"prove you're not a storm"*
   — and their arc is S1 GUARDED → S2 RULES → S3 JOY → S4 TRUTH → S5 LETTING GO.
5. Silhouette law, wooden-robot law, crisis law §0.0, no scorekeeping — all
   standing; this script never overrides a fleet law.

## FORBIDDEN PHRASES (generation-2 script — must appear in NO player-facing source)
- "brochure" · "ISLAND ADVENTURE" (the tour-company frame)
- "lost in shipping" · "shelved at almost" · "cousins of the Wayward Crew"
  (the old robot origin)
- "Bauer built" / "he built us" said OF BAUER (the pre-blessed maker)

## REQUIRED CANON MARKS (must exist in the app's player-facing sources)
- **Elias** — named in the cave reveal (milestones.ts)
- **T. BRENNAN** — the wall in the cave (island3d workshop / milestone art)
- **the twelfth family** / Bauer's ledger — the reveal's frame
- **THE TOOLS WILL ANSWER** — over the workshop door (island3d + VR)
- **Gullhaven** — the prologue (BoardingStory) and the workshop crate

---

## ACT 0 · THE PROLOGUE (BoardingStory.tsx · beats 1–2)
| beat | source | art |
|---|---|---|
| BEFORE · Gullhaven 1929 — kept like a stone in a pocket; chosen twice, returned twice; the name DRIFTWOOD | Book One ch. 1 | act0/p1_gullhaven.jpg |
| BEFORE · the empty island — fourteen boards; "the island you are about to visit is somebody's whole heart, still running" | Book One ch. 2–6 | act0/p2_lamplight.jpg |

## ACT 0.5 · THE ARRIVAL (BoardingStory.tsx · beats 3–9)
| beat | source | art |
|---|---|---|
| THE DOCK — no sign, no ticket window; one kept boat; the family in separate rooms | Book Two frame; DRIFTWOOD_BIBLE thesis | act1/01_the_dock.jpg |
| THE ARGUMENT — four voices, one knot | (the family's own Undertow, unnamed) | act1/01_the_dock.jpg |
| MR. BAUER — "It only works on families"; the canvas ledger, one line before the bags | Book Two ch. 16→; the ledger pays off at milestone 25 | act1/02_bauer_wheel.jpg |
| THE STORM — the sky decides | Book Two ch. 17 (the Halcyon's storm, rhymed) | act1/03_storm_wall.jpg |
| THE MAST LINE — his last order: hold EACH OTHER | Bauer re-enacting the line that saved the Brennans | act1/04_hold_the_line.jpg |
| (the dark beat) | — | — |
| THE TIDE LINE — all heads but one | Book Two ch. 18 rhyme (they stood on the sand at dawn) | act1/05_tide_line.jpg |
| THE COMPASS — TO M.B. — COME HOME; the needle points inland; small wooden eyes at the treeline | the Jumble watching (ch. 19: "We don't help storms") | act1/06_compass_ashore.jpg |

## THE 31 · SEASONS (milestones.ts — all beats live in-code; sources below)
*Seasons 7·7·6·7·5. The Jumble's arc per THE_DRIFTWOOD_OUTLINE PART 1.*

**S1 · THE WRECK (guarded)** — ch. 19 "we don't help storms"; ch. 20 the burned hand
| n | id | canon anchor |
|---|---|---|
| 1 | ms_count_heads | the castaways' first count (ch. 18) |
| 2 | ms_high_ground | survival-first; the island's honesty law |
| 3 | ms_first_fire | **ch. 20 — Skip's hand catches; nobody gives him back** |
| 4 | ms_fresh_water | the stream → the falls (the geography of ch. 5) |
| 5 | ms_salvage | Bauer's tackle box; the photograph marked "us" |
| 6 | ms_night_watch | Bailer's counting (ch. 8, ch. 11 The Counting) |
| 7 | ms_who_builds_what | the village opens; the Wright/Hoist (ch. 8) |

**S2 · THE CAMP (rules)** — robot culture = the ninety-seven made domestic
| 8 | ms_walls_door | ch. 11 the tools as portraits |
| 9 | ms_larder_rules | Bailer's shelves ("MISC. DREAD (4)") |
| 10 | ms_two_huts | the Undertow made architectural |
| 11 | ms_second_language | the Five Oils; Echo-2's Asking Back (ch. 11) |
| 12 | ms_storm_proofing | Bauer's knife found — M. BAUER, years old |
| 13 | ms_map_of_us | **the Remembering House — the walls carve BOOK ONE (the boy, ten times over)** |

**S3 · THE HEARTH (joy, first crack)** — ch. 15 "they were still sad; they kept going"
| 14 | ms_appreciation_volley | play arrives; the Jumble laughs (frightened by it) |
| 15 | ms_game_night | the Collier's game box |
| 16 | ms_story_circle | **the bottle — Book Three's ending washing ashore (Rehabit crossover)** |
| 17 | ms_signal_fire | ch. 23 — twenty-four years at the post, kept and never lit |
| 18 | ms_feast_small_things | Kettle's warm thing (ch. 8) |
| 19 | ms_quiet_cove | rest is allowed |

**S4 · THE STORM (the truth)** — ch. 24–26
| 20 | ms_naming_undertow | the Tier-4 crown; the current, not the person |
| 21 | ms_who_chases | pursue/withdraw made visible |
| 22 | ms_speakers_shell | the conch law: heard to the end |
| 23 | ms_repair_rope | one rope, only ever repaired |
| 24 | ms_apology_forge | the Collier's forge; repairs before verdicts |
| 25 | ms_flooded_camp | **THE CAVE: Barnacle + the Collier + T. BRENNAN 1954; Hollow tells Elias's story; Bauer's ledger — "yours is the twelfth"** (ch. 25 + Lance's decisions) |
| 26 | ms_riding_it_out | the morning after; the trials announced |

**S5 · THE LAUNCH (letting go)** — ch. 26 → the ending
| 27 | ms_every_plank | every plank has a name (the origin's S5, verbatim) |
| 28 | ms_load_test | rehearse the hard thing in the shallows |
| 29 | ms_letter_bottle | the letter goes BACK to the sea (the ring) |
| 30 | ms_launch_council | the totem; "who vouches?" |
| 31 | ms_naming_boat | **"Was I a good boy?" — this family knew him; the answer lands. The city's lamps come on. The compass points HOME.** (ch. 26 + the finale) |

## THE CONNECTIVE TISSUE (already placed — do not move)
- **THE TOOLS WILL ANSWER** over the workshop door → what Malakor took
  (LANCE, THE_STORY_PLAN.md, the ch. 29 "invasion")
- **The bottle at milestone 16** → THE_WAYWARD_CREW_BOOK_THREE's last page
- **Driftwood City dark→lit** → ch. 18 ("hundreds of lamps that had never
  been lit") → the 31 → the finale sweep
