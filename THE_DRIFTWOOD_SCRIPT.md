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
2. **THE FRAME IS 1954 — the player family IS a Halcyon family** (Lance's
   correction 2026-07-16, restoring his Jul-14 dictation: "the whole story
   starts 1950s"). Period language, period dress, period world. No phones, no
   brochures, no present day anywhere a player can read. (The therapist
   bridge, invites, and check-ins are real-world features OUTSIDE the fiction.)
3. **There is NO GUIDE CHARACTER.** The "Mr. Bauer, 81 now, runs tours" frame
   was a bundled recommendation Lance overrode. The maker is ELIAS; the
   **middle Brennan boy** (a fellow castaway child, nine) is who the cave
   saved this same season — T. BRENNAN 1954 is HIS mark on the wall. The
   compass, the boy's knife, the sea chest are Elias-and-wreck relics, never
   a guide's.
4. **The ending is MALAKOR'S ARRIVAL — the invasion** (milestone 31, 1955): a
   kind, capable doctor with a sick boy on his back saves everyone — and
   stands a long time at the treeline, looking inland. What he takes, LANCE
   players learn. Never a villain; a father with a dying son.
5. The 31 milestones are the Jumble's initiation — *"prove you're not a storm"*
   — and their arc is S1 GUARDED → S2 RULES → S3 JOY → S4 TRUTH → S5 LETTING GO.
6. Silhouette law, wooden-robot law, crisis law §0.0, no scorekeeping — all
   standing; this script never overrides a fleet law.

## FORBIDDEN PHRASES (must appear in NO player-facing source — qa:script enforces)
- "brochure" · "ISLAND ADVENTURE" (the tour-company frame)
- "lost in shipping" · "shelved at almost" · "cousins of the Wayward Crew"
  (the old robot origin)
- **"Bauer" — any use.** The guide character is cut entire.
- "twelfth family" · "tour boat" · "island tours" (the present-day frame)

## REQUIRED CANON MARKS (must exist in the app's player-facing sources)
- **Elias** — named in the cave reveal (milestones.ts)
- **the Halcyon · 1954** — the crossing (BoardingStory)
- **the Brennan boy** — the cave's other saved child (milestones.ts);
  **T. BRENNAN** on the wall (island3d workshop / milestone art)
- **"why we practice"** — Elias's notebooks close the reveal
- **Malakor** — the arrival at 31
- **THE DRIFTWOOD** — a nameable boat (the word said with love)
- **THE TOOLS WILL ANSWER** — over the workshop door (island3d + VR)
- **Gullhaven** — the prologue (BoardingStory) and the workshop crate

---

## ACT 0 · THE PROLOGUE (BoardingStory.tsx · beats 1–2)
| beat | source | art |
|---|---|---|
| BEFORE · Gullhaven 1929 — kept like a stone in a pocket; chosen twice, returned twice; the name DRIFTWOOD | Book One ch. 1 | act0/p1_gullhaven.jpg |
| BEFORE · the empty island — fourteen boards; "the island you are about to visit is somebody's whole heart, still running" | Book One ch. 2–6 | act0/p2_lamplight.jpg |

## ACT 0.5 · THE CROSSING (BoardingStory.tsx · beats 3–9 — Book Two, PLAYED)
| beat | source | art |
|---|---|---|
| THE HALCYON — New York, autumn 1954; everything and quietly not all right | Book Two ch. 16, near-verbatim | act1/01_the_halcyon.jpg |
| THE SEPARATE ROOMS — your family comes apart politely; the argument in nicer clothes | ch. 16 (the families aboard); the Undertow unnamed | act1/01b_separate_rooms.jpg |
| THE REEF — on no chart, because the only man who found the island had nobody to tell | ch. 17, the wreck's cause verbatim | act1/03_storm_wall.jpg |
| THE LINE — weathered hands lash the family's hands to one rope: HOLD EACH OTHER | ch. 17–18 (the wreck; the line) | act1/04_hold_the_line.jpg |
| (the dark beat) | — | — |
| THE TIDE LINE — Nov 5, 1954; the count is right; other saved shapes down the beach | ch. 18 ("They stood on the sand at dawn on the fifth of November") | act1/05_tide_line.jpg |
| THE COMPASS — hand-worked brass; the needle points INLAND; wooden eyes at the treeline | Elias's compass (pays off at 31: "it points HOME"); ch. 19 watching | act1/06_compass_ashore.jpg |

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
| 25 | ms_flooded_camp | **THE CAVE: Barnacle + the Collier + T. BRENNAN 1954 (the Brennan boy, saved weeks earlier this same season); Hollow tells Elias's story; the notebooks — "give them everything, they're why we practice"** (ch. 25 + the 1954 frame) |
| 26 | ms_riding_it_out | the morning after; the trials announced |

**S5 · THE LAUNCH (letting go)** — ch. 26 → the ending
| 27 | ms_every_plank | every plank has a name (the origin's S5, verbatim) |
| 28 | ms_load_test | rehearse the hard thing in the shallows |
| 29 | ms_letter_bottle | the letter goes BACK to the sea (the ring) |
| 30 | ms_launch_council | the totem; "who vouches?" |
| 31 | ms_naming_boat | **"Was I a good boy?" — this family knew him; the answer lands. THE DRIFTWOOD nameable. The city's lamps come on. The compass points HOME. And then MALAKOR walks up the beach — kind, grateful, a sick boy on his back — and stands a long time at the treeline** (ch. 26 → ch. 29, the invasion) |

## THE CONNECTIVE TISSUE (already placed — do not move)
- **THE TOOLS WILL ANSWER** over the workshop door → what Malakor took
  (LANCE, THE_STORY_PLAN.md, the ch. 29 "invasion")
- **The bottle at milestone 16** → THE_WAYWARD_CREW_BOOK_THREE's last page
- **Driftwood City dark→lit** → ch. 18 ("hundreds of lamps that had never
  been lit") → the 31 → the finale sweep
