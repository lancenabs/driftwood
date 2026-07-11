# 👨‍👩‍👦‍👦 THE FAMILY IN 3D — the mesh casting recipe
### From Lance's Higgsfield family videos → rigged GLB meshes → the island
*Written 2026-07-11. The character sheets are DONE (step 1); the 3D cast (step 2)
needs Higgsfield — via the reconnected MCP or Lance's hand in the web app.
The island AUTO-LIGHTS each mesh the moment it lands (step 3 is zero-effort).*

---

## ✅ Step 1 — DONE: the character sheets
Six clean A-pose, full-body, single-character sheets, cast by the Foundry
(Nano Banana Pro + reference image = character-consistent with the videos):

| Character | File (also in the Foundry library) |
|---|---|
| Dad | `~/Downloads/driftwood-family-sheets/dad.jpeg` |
| Mom | `~/Downloads/driftwood-family-sheets/mom.jpeg` |
| Oldest boy (blue) | `~/Downloads/driftwood-family-sheets/boy-oldest.jpeg` |
| Middle boy (green) | `~/Downloads/driftwood-family-sheets/boy-middle.jpeg` |
| Youngest boy (yellow) | `~/Downloads/driftwood-family-sheets/boy-youngest.jpeg` |
| Buddy-bot | `~/Downloads/driftwood-family-sheets/robot.jpeg` |

## 🎲 Step 2 — the 3D cast (Higgsfield, per character)
**Settings that matter (either in the web app's 3D tool or via MCP `generate_3d`):**
- Mode: **image_to_3d**, input = the character sheet
- **Rigging: ON** (the sheets are A-pose specifically so auto-rig works)
- **Animation: ON — pick a WALK clip** from the animation library (a plain
  relaxed walk; the island also plays its own procedural stride on the bones,
  so idle/walk clips both work)
- Quality/polycount: standard is fine (phone budget — the island targets
  ≤5MB/character; the Quest-proven pattern)
- Output: **GLB**
- 💰 Cost gate: ~15–20 credits/character → ~90–120 for all six. **Cast the DAD
  first, alone, judge the quality** (the D4 law), then batch the rest.

## 🏝 Step 3 — landing them (auto-light)
Save each GLB at exactly:
```
~/driftwood-app/public/island3d/family-dad.glb
~/driftwood-app/public/island3d/family-mom.glb
~/driftwood-app/public/island3d/family-boy-oldest.glb
~/driftwood-app/public/island3d/family-boy-middle.glb
~/driftwood-app/public/island3d/family-boy-youngest.glb
~/driftwood-app/public/island3d/family-robot.glb
```
That's it. The island probes those six names at load: each mesh that exists
joins the **Avatar picker** automatically (👨 Dad · 👩 Mom · 🧒×3 · 🤖
Buddy-bot), grounded by its foot bone, driven by the walk system. Missing =
simply absent — nothing breaks while the family is being cast.

## 🆕 FAMILY #2 (2026-07-11 late — the diversity line begins)
Four A-pose sheets cast from Lance's african_american_family.jpg, staged at
`~/Downloads/driftwood-family2-sheets/` (dad2 · mom2 · boy2-older · boy2-younger).
Same cast recipe; land as `family2-<id>.glb` (FAMILY_SLOTS entries added at
wiring). AND: the dad of family #1 now has a 3-VIEW TURNAROUND uploaded +
confirmed at Higgsfield — cast HIM via multi_image_to_3d (38cr, rigged +
Casual_Walk id 30) for the best geometry; the single-image path is the
fallback for the rest until they get turnarounds.

*Then tell Claude "the family is in" — a verification walk + commit follows,
and the Seven's slot-claiming maps each family member to their real mesh.*
