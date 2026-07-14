# DRIFTWOOD — the plan, start to finish
*Written by C. for Lance, 2026-07-14, from the origin story and the waterfall scene.
Every claim below verified against the repo, not inherited from a doc.*

---

# PART 0 — THE SPEC IS ONE SCENE

Lance described what this app is for, and it's the whole specification:

> A couple call each other mid-week: *"let's meet at the waterfall and finish
> challenge 10 together."* **The wife, at work,** opens her phone, picks the
> avatar she made, and walks across the island. **The husband, at home with the
> kids,** walks his. They meet. They chat. **They laugh that they're doing this.**
> They finish the homework. They come to session, they laugh about it — **and
> then the real problems come out.** And Lance already knew, because their data
> reached his Companion **before** the session: *did they do the homework, or did
> they put it off?*

And the bar: *"if there's no reward — 'I'm feeling better, this is working for me'
— then we have not done our job."*

**Six things that scene requires. Measure everything against them:**

1. The island **is** the app — that's where everything happens.
2. **Phone-first, two minutes, stolen time.** She's at work. He's got kids. VR is
   the bonus, never the requirement.
3. **Place is the unit.** "Meet me at the waterfall" only works if places have
   names, and challenges have addresses.
4. **Presence is light.** Text, not voice. Late-tolerant.
5. **The laugh is a feature**, not decoration.
6. **The therapist sees it before the session.**

---

# PART 1 — WHAT'S ACTUALLY THERE (verified today)

**Real and working:**
- The **3D island** (`public/island3d/`) — 110m hikable world on the VR island's
  terrain law, Lance's own textures/sky/foliage, 13 rigged avatars, deep
  customization, terrain-following, phone controls. **It genuinely runs on a phone.**
- **The Gathering** (`src/lib/gathering.ts` + the SSE relay) — camp codes, live
  presence, family avatars on the same ground over an ephemeral position channel.
- **Story circles ON the island** — `ms_*` milestones anchored in 3D and VR;
  walking in opens the milestone. **The place→challenge mechanic already exists.**
- **20 campfire games**, 31 milestones, the fire that burns the week's warmth,
  Build Mode, the shell run, 10 robots, VR + MR.
- **36 named places** in `src/data/driftwoodCity.ts` (one source of truth,
  app + board + VR).

**The gaps, in the order the scene hits them:**

| # | Gap | Verified |
|---|---|---|
| **1** | **NO BRIDGE.** `src/lib/` has cartridge, castaways, gathering, world, voice — **no companionLink.** Nothing POSTs to the Companion. | The only bridge code is in the inert vendored `src/lance/` copy. Rehabit got `companionLink.ts`; **Driftwood never did.** |
| **2** | **No waterfall.** Zero hits in `island3d/index.html` and `vr/index.html`. | Also missing: the cave, the totem, the workshop — **every location the origin's climax needs.** |
| **3** | **No way to say "meet me at X."** The Gathering shares a camp; it can't carry an intention. | No invite, no place-pointer, no time. |
| **4** | **No deferral signal.** Nothing records *when* work happened relative to when it was assigned. | This is the most clinically valuable signal in the product and it doesn't exist. |
| **5** | **No accumulation.** The island doesn't remember that they were there together. | The fire burns the week's warmth, then the week ends. |

**The finding that matters most: the last beat of Lance's own thesis is unbuilt.**
The couple can meet, walk, chat, and finish challenge 10 today — **and the data
never reaches him.** Everything else here is second.

---

# PART 2 — THE BUILD ORDER

## P0 · THE BRIDGE — "I received their data before the session"

Port `companionLink.ts` from Rehabit (which was ported from lance-app — the
contract is proven twice: `pairWithCode` → `syncNow` → directive pull → cloud
backup, fail-silent, never block the app, `CRISIS_TOOLS` filtered defensively).

**But Driftwood is not a single-client app, and that's the real work.** The others
sync one person. This syncs *a relationship.* Three things the existing contract
has never had to answer:

- **Who is this about?** Each partner pairs their own device with their own code,
  and the Companion needs to know they're a **dyad** — two clients, one shared
  island. The therapist's cockpit should show the couple, not two strangers who
  happen to be assigned the same homework.
- **Whose data is whose?** A joint act (they met at the waterfall) belongs to
  both. A solo act (she lit her lantern Tuesday, alone) belongs to her. **The
  Undertow law says no scorekeeping between partners** — so the app must record
  the difference without ever *showing them* a comparison. The therapist sees it.
  The couple never does.
- **What crosses?** Homework state, presence, timing. **Not the chat.** What they
  say to each other at the waterfall is theirs. That's a bright line and it should
  be written down before a line of code.

**→ DECISION NEEDED FROM LANCE:** the dyad model. My recommendation: each pairs
separately (two codes, two consents — either can leave), and the Companion links
them with a `partnerOf` field. Consent-first, exactly like the Perspective Swap.

**Companion side** (hand-work per §0.4): `world` enum gains `shore`; a
Driftwood tool registry so the directive dropdown offers *this* app's 20 games and
31 milestones; the dyad link.

## P0.5 · THE DEFERRAL SIGNAL — the tell every therapist knows

Not a metric. **A clinical instrument.** When a milestone completes, record:

```
assigned:   Mon 4:12pm   (by Lance, in session)
opened:     Thu 8:41pm   (3 days later)
completed:  Thu 8:53pm   (12 minutes)
together:   yes — both present, 11 of 12 minutes
first to arrive: her
session:    Fri 10:00am  ← THIRTEEN HOURS
```

**That last line is the product.** "They did it the night before" is a sentence
Lance can walk into a room already holding — and the couple will laugh, and then
the real thing comes out. That's his scene, and it needs exactly one timestamp
comparison to exist.

**Law: the deferral signal is for the therapist's eyes only, and it is never
scored, never shown to the couple, never colored red.** It's information for a
clinician, not a verdict for a client. Shame is a relapse engine in every world.

## P1 · PLACES — give the island an address book

The waterfall doesn't exist and Lance named it first. That's not a coincidence —
**it's what a place-based app feels like from the inside**, and his instinct went
straight there.

- **Build the waterfall + the cave behind it.** The origin's climax happens there
  (S4: the youngest goes missing; the family search ends at the cave; the truth
  about the maker). It is the single most load-bearing location in the story and
  it is not on the island.
- **Name ~8–10 places** and put them in `driftwoodCity.ts` (the existing one
  source of truth, so board + app + VR never drift): **the Waterfall · the Cave ·
  the Camp · the Forge · the Ridge · the Cove · the Tide Line · the Totem · the
  Workshop · the Lantern Dock.**
- **Every milestone gets an address.** Story circles already anchor milestones in
  3D — this is extending a working mechanic, not inventing one. Challenge 10 lives
  at the waterfall, permanently, so "meet me at the waterfall" is a real sentence.

## P2 · "MEET ME AT THE WATERFALL" — the invite

**The insight: the text message is the product surface.** Real couples text. She's
at work. She isn't opening an app to schedule something — she's texting him.

So: pick place + challenge + rough time → **a link.** He taps it in his messages,
the app opens, his avatar is on the island, and there's a soft beacon on the
waterfall. No account setup, no lobby, no scheduling UI.

- **Late-tolerant by design.** If he's four minutes late she is *not* standing in
  an empty clearing feeling stupid. The place holds the invite; the fire's glow
  marks it; whoever arrives first can potter, skip stones, look at the water.
  **The Skipping is already one of the boy's 97 tools — do the useless thing on
  purpose.** Put it where the waiting happens.
- **Presence is light**: text chat only. No voice, no camera. Two thumbs.

## P3 · THE REWARD — "this is working for me"

Lance's bar, and the one that decides whether any of this matters.

**The island accumulates their marriage.** Not points. Not streaks. Not badges.

They met at the waterfall on a Thursday. **So now the waterfall is theirs.** A
small mark — a lantern on the rock, their two names, the date. Next month they
walk past it on the way somewhere else and *see it,* and neither says anything,
and that's the whole feature.

That's not a mechanic I'm inventing. **It's the last image of the origin:**

> *The totem on the island, one new carving added at the bottom, childish
> letters: "MR. BAUER'S FAMILY — ALL OF US."*

**Build the totem.** Every milestone a family finishes together carves a name into
it. It stands in the camp. It never resets, it never shrinks, it cannot be lost —
*a slip can becalm the ship; it cannot un-cross the wake*, in wood.

The couple's reward is that **the island remembers them when they don't remember
each other.** That's the thesis of every world we've written, and Driftwood is
where it becomes a place you can walk to.

## P4 · THE STORY'S WORLD — what the origin now demands

Additive only. No existing loop breaks.

- **The Waterfall + the Cave** (P1) — the climax.
- **The Totem** (P3) — the reward.
- **The Workshop** — the boy's shed. The cot, the bench, the crate stencilled
  GULLHAVEN, the boat's mast-stub with a word cut into it, the notebooks. And over
  the door, an inch deep: **THE TOOLS WILL ANSWER.** A player who has played
  L.A.N.C.E. walks in and understands what Malakor did, and nobody says a word.
  **That is the best moment available to this ecosystem and it costs one room.**
- **The Lookout's post** on the northwest ridge, worn smooth. Twenty-four years.
- **Mr. Bauer is retired.** The boy absorbs him — same beat (man alone, driftwood,
  robots replacing the lost), but Bauer's version generates *grief* and the boy's
  version generates *the 97 tools.* Move Bauer's material into the boy; keep the
  compass pointing inland.
- **The Jumble get their voices** — gated on the ElevenLabs tier (see
  `docs/THE_VOICE_LEDGER.md`). Driftwood has **zero audio of any kind** today. Ten
  robots who speak across 31 milestones and 20 games have never made a sound.
  **Skip's "Was I a good boy?" has no voice.**

---

# PART 3 — WHAT I'D DO FIRST, AND WHY

**Order: P0 (bridge) → P1 (waterfall + places) → P2 (invite) → P0.5 (deferral) →
P3 (totem).**

The bridge is first because **it's the only gap that makes the product not exist.**
Everything else makes it better; that one makes it real. Without it, a couple can
do everything Lance described and he learns nothing, and the loop that closes in
his office never closes.

The waterfall is second because it's the address in his own sentence.

**And then the field test.** Two phones, the waterfall, one challenge — Lance and
his wife, twenty minutes. Not because the code needs proving. Because **20 games
and a 110m island have never met a family**, and the first true sentence anybody
writes about this app is worth more than the next feature.

---

# PART 4 — VERIFICATION

- **P0:** two real browsers, two pairing codes → both sync → the Companion shows
  one dyad, both partners, the joint act attributed to both. **Assert the deny:**
  an unpaired device gets 401; the chat never appears in any payload.
- **P0.5:** complete a milestone; confirm assigned/opened/completed/together land
  as real timestamps. Assert it is **invisible to the couple** in every surface.
- **P1:** walk to the waterfall on a phone at 390px. `qa:crawl` 0 findings.
  `qa:gathering` 12/12.
- **P2:** send an invite from device A; tap the link on device B; land on the
  island with the beacon lit. **Arrive four minutes late on purpose** and confirm
  it's fine.
- **P3:** finish a milestone together → a mark lands → **reload → it's still
  there.** Then leave it a week and walk past it.
- **Always:** `npm run qa:all` (tsc · crisis · crawl · gathering) green at every
  waypoint. Crisis law §0.0 holds — Settings-only, therapist-configured, no
  hardcoded lines anywhere, in every new surface including the waterfall.

---

# THE OPEN DECISIONS (Lance's, not mine)

1. **The dyad model.** Two codes with `partnerOf`, or one couple-unit? *(My rec:
   two codes, consent-first — either can leave.)*
2. **What never crosses the bridge.** I'm asserting the chat at the waterfall is
   theirs and never syncs. Confirm.
3. **The ElevenLabs tier** — the gate on the Jumble's voices, and on everything
   else with a mouth in this ecosystem.
4. **Mr. Bauer's retirement** — confirm the boy absorbs him.

---

*"The island only yields to together." — the bible, 2026-07-12*
*"That app is for being on that island. That is where everything happens." — Lance, 2026-07-14*
