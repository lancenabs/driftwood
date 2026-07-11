# 🛡️ LUCY'S SECURITY BRIEF — Driftwood, prepared for compliance review
*Written 2026-07-11 by C., the app's build night. Lucy: design-time authority,
proposals only, counsel verifies. This world's review leads with the DV posture —
it is the reason the app may exist at all.*

## What Driftwood is, honestly
The fourth world: couples & family systems as a shipwreck-island life-sim.
SANDBOX — all data on-device (localStorage), no accounts, no recordings, no
cloud copies, no analytics. Two server AI endpoints (Gemini, keyless-degrading).
Port :3300. Repo: lancenabs/driftwood (private). No PHI, trials only, same
bright line as the fleet.

## THE DV BRIGHT LINE (bible §7 — implemented in commit #1, before any feature)
- **The crisis strip**: 988 + **National DV Hotline (1-800-799-7233 · text
  START to 88788)** + SAMHSA — tappable `tel:` links, pinned at the TOP of
  every screen including boarding, above every overlay except nothing.
- **The private page**: per-adult, pass-the-device, interposed in the boarding
  flow (welcome → private → claim). Asks the one question plainly, offers
  thehotline.org, **stores nothing** — the gate greps the file for storage
  calls and fails if any appear.
- **No mechanic punishes one member for another's inaction** (lanterns unlit
  are simply unlit; the no-shame law is in the world-ledger code comments and
  the shore's rendered copy).
- NPCs/AI never handle crisis: `DRIFTWOOD_BASE` (welded under every
  generateContent call; gate-counted) redirects to the strip and stops.

## The standing gates (`npm run qa:all` — all green as of this writing)
1. **DV crisis gate** (`qa:crisis`, 17 assertions): both lines lit + tappable ·
   strip global · private page exists/traceless/interposed · no borrowed trust
   badges anywhere client-facing · dev door closed · every AI endpoint on the
   base layer (crisis handoff, honest-AI, kid-safe register).
2. **Full crawl** (`qa:crawl`): four rooms · strip asserted on each room ·
   all 14 family-deck tools + island sample render with exits · milestone log
   + swap card present · console-clean.
3. **tsc** clean.

## What the review should know was FOUND AND FIXED during the build
- The AI-Studio scaffold shipped **fake trust badges** ("HIPAA-Ready", "AES-256
  GCM envelope databases", "Active Patient Consent Enabled", "Accredited Co-op
  Play") and a fake-architecture privacy doc presented as the running app.
  All struck or quarantined in `src/clay-pile/` (renders nowhere; gate-enforced).
- The scaffold's Theater cast **stock photos of real humans** as AI-played
  family archetypes, plus a **fake therapist profile ("Dr. Evelyn")**. Recast:
  robots stage PATTERNS (Skip stages The Chase, Hollow stages The Shell);
  Evelyn removed. Patterns-never-people is now structural.
- The vendored island library carried one stray badge string in its Insights
  loader ("HIPAA-compliant digital logs packet") — re-worded here; flagged for
  the upstream sweep in lance-app and rehabit.

## The Perspective Swap (the crown — review its consent spine)
Invite → **consent screen the OTHER person taps** ("not tonight" is a first-
class path) → bounded walk (4 written scenes) → mandatory debrief → receipt.
The honest banner renders through every swap second (no impersonation).
Receipts on the world ledger are **counts and ids only**; the debrief text
stays on-device (`driftwood_swaps_v1`). Proposal for R3: when the companion
bridge lands, only `{walker, walked, at, debriefCompleted}` may sync.

## The cartridge socket (SOP-6, Lucy's rider verbatim)
`src/lib/cartridge.ts`: cartridges carry curriculum + staged-scene rails
(pattern ids), never personas of real people, never PHI, and no import path
from the cartridge into the crisis strip or the boarding (verify with grep —
zero hits today; propose a gate assertion when R3 delivery lands).

## Known boundaries
- Gemini endpoints exist (coach chat + co-regulation blueprint); both on the
  base layer; keyless behavior returns an honest error. The co-regulation
  endpoint asks users to ENTER heart-rate numbers — review whether even
  self-reported biometrics fit the sandbox posture, or should be clay-piled.
- localStorage inventory is all `driftwood_*` (one flag, normalized before
  any real family's data exists). Device loss = data loss (and data privacy);
  same device-PIN guidance as Rehabit for trial families.
- `src/clay-pile/` and `DeveloperDocs.tsx` hold quarantined dev fiction —
  never routed; delete entirely at productization if preferred.

## Suggested review order
1. The boarding on a phone — the private page's feel (it must read as safety, not screening).
2. The strip's tap targets with a real thumb.
3. The swap's consent flow with two people and one device.
4. The two Gemini call sites + DRIFTWOOD_BASE.
5. The Theater's staged-scene copy (patterns-never-people language).
