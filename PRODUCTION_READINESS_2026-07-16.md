# DRIFTWOOD — PRODUCTION READINESS AUDIT · 2026-07-16
*Everything found wrong, missing, or inconsistent on the road to production,
severity-ranked, plus the visual-enhancement list. Written after two full
evaluation passes (gates + real-browser drives of every surface). Items marked
✅ FIXED were fixed in this run; the rest are the honest to-do.*

---

## HOW TO READ THIS
- **P0** — blocks production. **P1** — ship-embarrassing, fix before families see it.
- **P2** — polish that earns its keep. **ENH** — visual enhancement, optional but worth it.
- Every ✅ FIXED item names its commit so claims are checkable.

---

## P0 · BLOCKS PRODUCTION

1. **The Jumble has no voices (P5).** All 31 milestones + 10 robots are
   voice-ready; the ElevenLabs tier upgrade + casting is Lance's action.
   Degrades honestly (text) but the product sells "told by the robots."
2. **No deployment target.** Driftwood runs at :3300 locally; lance-app is on
   Netlify, companion on Render — Driftwood has no production URL, no deploy
   pipeline, no uptime watch. Decide host (Netlify like lance-app; `npm run
   build` already produces dist/server.cjs for a node host).
3. **Companion changes are committed but not deployed** (d726ec4). The dyad,
   deferral eyes, and the 65-entry Driftwood registry only exist locally until
   Lance pushes to Render at day's end. The bridge is only whole once both
   sides are live.
4. **No error telemetry.** When a family's island breaks in the wild, nothing
   phones home. Even a window.onerror → server.log endpoint would do for trial.

## P1 · FIX BEFORE FAMILIES SEE IT

5. ✅ FIXED **Boot video broke the silhouette law** — onboard_ship.mp4 (fixed
   Pixar faces) retired to assets/retired/; boarding rides the stills.
6. ✅ FIXED **The old sand/rock textures were cartoon-grade** (sand carried an
   actual "AI" watermark). Photoreal seamless replacements generated in-house.
7. ✅ FIXED **Palm crowns were flat green cones; canopy flat green spheres** —
   real keyed frond planes + photographed foliage tile, island3d AND VR.
8. ✅ FIXED **VR city ignored the canonical geography** (decorative ring) —
   now stands at driftwood-city.json x/z, same ground as app + board.
9. **VR island lacks the landmarks** — no Waterfall, Totem, Workshop, Wreck
   Beach in the headset. "Meet me at the waterfall" has no address in VR.
   Fix plan: port the three BUILT_LANDMARKS groups from island3d (they're
   self-contained THREE.Group builds against groundY) + the LANDMARKS ring;
   extend qa:island-mirror to assert VR contains every landmark id.
10. **The castaway avatar is a suited figure with a diving-helmet head**
    (vendored LANCE mesh). A family-therapy island deserves the family meshes
    that already exist (`island3d/family-*.glb` — wired for the invite flow
    but the default solo avatar is still the suit).
11. **mr/city.html is still signposts-on-discs** — superseded by the unified
    wayward-robots board in lance-app, but it's still linked from Driftwood's
    MR door. Either point Driftwood's MR at the unified board or rebuild the
    disc board with the real structures.
12. **The island3d spawn camera looks at the ground.** First impression of the
    flagship surface is sand + a cobble slab. Aim the intro camera at the
    totem/camp with a slow settle.
13. **20 game/tool interior plates missing** — game ENTRY is covered (each
    reuses its story still via SceneCard) but interiors are chrome-only.
    Foundry can batch these now that Gemini is topped up (~20 images, free).

## P2 · POLISH THAT EARNS ITS KEEP

14. **Grass tile reads neon at distance** (island3d + VR midband). Tone the
    terrain grass color multiply (~0xDDE8D0) or regenerate a duller tile.
15. **Fire is a flat orange cone** on both islands. Two crossed alpha-flame
    planes + the existing point light would sell it.
16. **The 23 unaddressed milestones meander** (MILESTONE_PLACE names 8).
    The story put 8 places first; consider giving the rest addresses in the
    city (places already exist; it's a data edit in milestoneCraft.ts).
17. **Boot 404s**: VIDEO.storm/.shore never existed; the code degrades
    gracefully but the network tab shows three failed requests on every
    boarding. Cheap to silence (skip <video> when src is known-absent).
18. **`undefined/` directory in repo root** (created by a path bug long ago)
    and `THE_WAYWARD_BOY copy.txt` duplicate — repo hygiene before open house.
19. **server.log is committed and growing** — .gitignore it.

## ENH · VISUAL ENHANCEMENTS WORTH DOING

20. **City ambient life**: 2–3 wooden robots on idle paths in the city
    (island3d has robots3d/ meshes already), a lamplighter that walks at dusk.
21. **Water**: the flat opacity plane could take the new normal-mapped look —
    even just scrolling the water tile two directions at different speeds.
22. **Weather beats**: milestone 20/25 could dim the sky + rain particles on
    the island for the storm season — the island telling the story.
23. **City dark→lit transition moment**: when the 31st closes, a 4-second
    camera sweep as the lamps come up (the payoff deserves a camera).
24. **Higgsfield videos for the five hero cold-opens** (waterfall, city
    dark→lit, flume, cave glow) when credits allow (~10 credits remain).
25. **The Heart's hum**: a soft looping held-note audio near the Heart
    (Foundry music door can generate it; shoreSounds.ts already has the
    ambient audio pattern).

---

## THE LAWS, VERIFIED STANDING (2026-07-16)
- qa:all green ×4 this run (tsc · crisis ALL CLEAR · mirror · invite · crawl 0
  · gathering 12/12 · bridge). Companion tsc clean. Foundry gate 13/13.
- Crisis law §0.0 (Settings-only) · silhouette law (boot video retired) ·
  wooden-robot law (no metal robots on any Driftwood surface we ship) ·
  no scorekeeping between partners (deferral panel shows grey facts only) ·
  never-delete (retired media archived, not rm'd).
