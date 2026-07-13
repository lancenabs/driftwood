# CINEMATIC ASSET RUN — both apps, fire-ready
### Lance's 2026-07-12 commission: "awesome videos for the beginning · lots of dramatic fade-ins · a cinematic experience on both." Coins provided.

**Status when written:** all code + wiring for both apps is DONE and gated; every slot below is live and falls back to a painting when empty (the auto-light law), so dropping a file in lights it up with zero code change. The only blocker to executing this run was the Higgsfield MCP connection being down — the moment it's back, this is mechanical.

**Global style (one shared reference across a whole app):** painterly storybook realism, cinematic depth, slow drifting camera made for a fade-in. Driftwood = warm golden-amber over teal sea, WOODEN robots only. Rehabit "Voyager" = cooler dusk-harbor blues/brass, METAL robots only. **Never cross the robots between apps.** Humans are silhouettes / rear / backlit (THE SILHOUETTE LAW, ASSET_PROMPTS_V3) so every family sees themselves.

**Workflow per video:** `models_explore(action:'recommend')` → `generate_video` (5–8s, loopable, subtle motion — these autoplay muted+loop under text) → `job_status`/`reveal_generation` → download → place at the path. Check `balance` before big batches. **Browse Lance's existing library FIRST** (`show_medias` / `show_generations`) — he already made storms, island, jungle, mountains, faceless images, and robots; pull-and-place beats generate every time it fits.

---

## DRIFTWOOD — boarding cinematic (3 video slots, 8 beats reuse them)
Wired in `src/components/BoardingStory.tsx` (VIDEO map); fallback painting `/shore/boarding_hero.jpg`.
| path | beats it plays under | prompt |
|---|---|---|
| `public/shore/onboard_ship.mp4` | THE DOCK · THE ARGUMENT · MR. BAUER | Slow push toward a small wooden tour-boat at a weathered pier, golden hour, family silhouettes boarding (number/gender ambiguous), a broad old guide's shape at the gangway. Gentle, foreboding calm. |
| `public/shore/onboard_storm.mp4` | THE STORM · HIS LAST ORDER · (black beat) | A small boat swallowed by a towering green-black storm wall, one shaft of gold on churning water, rain-lash, a single swinging lantern. Dramatic, dark, building. |
| `public/shore/onboard_shore.mp4` | THE TIDE LINE · THE COMPASS | Dawn on an empty beach, driftwood and rope in the wash, family silhouettes stirring alive on wet sand, a brass compass glinting in the tide-junk. Tender, hushed, hopeful. |

## DRIFTWOOD — the 32 Ken Burns story stills
Full prompt list + exact paths already in **`ASSET_PROMPTS_V3_KENBURNS.md`** (act1–5, mapped to milestone/boarding beats, silhouette law applied). Paths: `public/story/act{1-5}/NN_slug.jpg`. Keep the existing opening image (`boarding_hero.jpg`) — these are additive.
- Season curtains `public/shore/curtain{1-5}.mp4` already exist ✓.

## DRIFTWOOD — optional depth (nice-to-have, pull from library if present)
- `public/shore/beach_{dawn,day,dusk,night}.jpg` exist ✓ (the live-clock shore backdrop). Regenerate only if Lance wants them refreshed.

---

## REHABIT "THE VOYAGER" — boarding cinematic (3 video slots)
Wired in `src/components/Boarding.tsx` (cine `video:` slots); fallback `/horizons/leaving-port.webp`. METAL robots, dusk-harbor palette.
| path | beat | prompt |
|---|---|---|
| `public/casebook/onboard_harbor.mp4` | THE HARBOR | Slow drift over a dark 19th-c. harbor before first light, lamplit windows, a moored ship, gulls, the sea after the island — melancholy, cinematic, the "sea after" mood. |
| `public/casebook/onboard_crew.mp4` | meeting the crew | A lantern-lit ship's cabin, brass and worn wood, small METAL clockwork robots (the Wayward Crew) stirring at their posts — warm, characterful, a family assembling. |
| `public/casebook/onboard_wheel.mp4` | taking the wheel | Hands (silhouette) on a ship's wheel at dawn, compass swinging, open water ahead, brass gleaming — resolve, a crossing beginning. |
- Casebook season curtains `public/casebook/curtain{1-5}.mp4` already exist ✓.
- Crew portraits `public/crew/*.webp` exist ✓ (metal robots).

## REHABIT — case-open / case-closed interstitials (from the earlier mystery commission)
If generating extra: a "case opens" and "case closes" pair, lantern-lit evidence-board style, metal-robot world. Slot these into the Casebook interstitial pattern (confirm exact path in `Casebook.tsx` before placing).

---

## EXECUTION ORDER (when the MCP is back)
1. `balance` → confirm coins.
2. `show_medias` / `show_generations` → inventory Lance's storms/island/jungle/mountains/faceless/robots; map any that fit the slots above → download & place (no spend).
3. Generate the 6 boarding videos first (3 per app) — the headline "cinematic beginning."
4. Generate the 32 Driftwood story stills (or pull faceless matches from library).
5. Per app: `npm run qa:all` (crawl tolerates missing art, so it stays green throughout), then commit in batches.
