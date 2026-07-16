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
9. ✅ FIXED **VR island lacks the landmarks** — the seven named places now
   stand in the headset at canonical coordinates: waterfall (rock + falling
   water + rimmed pool), totem (carved bands from the real log), workshop
   (THE TOOLS WILL ANSWER), cairns for the rest. VR Heart moved to island3d's
   coords. Remaining: extend qa:island-mirror to assert the VR list too.
10. ✅ FIXED **The castaway avatar defaulted to the suited LANCE figure** —
    unchosen players now wash ashore as an age-matched family castaway once
    the family meshes load; the body-neutral picker still rules.
11. **mr/city.html is still signposts-on-discs** — superseded by the unified
    wayward-robots board in lance-app, but it's still linked from Driftwood's
    MR door. Either point Driftwood's MR at the unified board or rebuild the
    disc board with the real structures.
12. ✅ FIXED **The island3d spawn camera looked at the ground** — THE ARRIVAL:
    a four-second ease-out sweep down over the water onto the camp; any input
    cuts straight to gameplay.
13. ✅ FIXED (differently) **Game interiors were chrome-only** — every
    GameShell now hangs its own story still, dimmed with a slow zoom, behind
    the play surface. No generation spend needed.

## P2 · POLISH THAT EARNS ITS KEEP

14. ✅ FIXED **Grass tile read neon at distance** — toned in the terrain
    shader on both islands (cGrass *= vec3(0.80, 0.84, 0.74)).
15. ✅ FIXED **Fire was a flat orange cone** — crossed additive teardrop
    planes with live flicker, island3d and VR.
16. **The 23 unaddressed milestones meander** (MILESTONE_PLACE names 8).
    The story put 8 places first; consider giving the rest addresses in the
    city (places already exist; it's a data edit in milestoneCraft.ts).
17. ✅ FIXED **Boot 404s** — empty video slots render no <video>; slots are
    documented for when on-canon clips land.
18. ✅ FIXED **Repo hygiene** — `undefined/` PNGs moved to assets/reference/,
    the story-file duplicate removed.
19. ✅ (was already fine) **server.log** — covered by `*.log` in .gitignore.

## ENH · VISUAL ENHANCEMENTS WORTH DOING

20. **City ambient life**: 2–3 wooden robots on idle paths in the city
    (island3d has robots3d/ meshes already), a lamplighter that walks at dusk.
21. **Water**: the flat opacity plane could take the new normal-mapped look —
    even just scrolling the water tile two directions at different speeds.
22. **Weather beats**: milestone 20/25 could dim the sky + rain particles on
    the island for the storm season — the island telling the story.
23. ✅ BUILT **City dark→lit transition moment** — closing the 31st earns a
    six-second camera arc over the lit streets; a tap ends it early.
24. **Higgsfield videos for the five hero cold-opens** (waterfall, city
    dark→lit, flume, cave glow) when credits allow (~10 credits remain).
25. ✅ BUILT **The Heart's hum** — a generated 30s held-note drone
    (`public/ambient/heart-hum.mp3`), volume by distance to the Heart,
    starts on the first gesture, fails silent if the file is gone.

---

## THE LAWS, VERIFIED STANDING (2026-07-16)
- qa:all green ×4 this run (tsc · crisis ALL CLEAR · mirror · invite · crawl 0
  · gathering 12/12 · bridge). Companion tsc clean. Foundry gate 13/13.
- Crisis law §0.0 (Settings-only) · silhouette law (boot video retired) ·
  wooden-robot law (no metal robots on any Driftwood surface we ship) ·
  no scorekeeping between partners (deferral panel shows grey facts only) ·
  never-delete (retired media archived, not rm'd).
