// ─────────────────────────────────────────────────────────────────────────────
//  Cinematic video manifest for the LANCE game.
//
//  Clips are generated FREE in the Higgsfield web app (the UNLIMITED button),
//  downloaded into  public/lance-videos/ , then registered here.
//
//  A slot left as `null` (or pointing at a file that doesn't exist yet) is
//  DORMANT: <CinematicGate> renders nothing and passes straight through, so the
//  app behaves EXACTLY as if the video feature were off — no black screen, no
//  spinner, no wait, no console 404s (we never request a file that isn't listed).
//
//  ⇒ Lighting up a slot is a ONE-LINE change here. No component edits needed.
//     e.g.   act2: 'act2_jungle.mp4',
//
//  Arrays = a reusable pool; one is picked at random each play so taunts/cheers
//  don't repeat back-to-back.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = '/lance-videos/';

type SlotValue = string | string[] | null;

const MANIFEST: Record<string, SlotValue> = {
  // ── Act openers (one cold-open before each Act begins) ──
  act1: 'act1_island.mp4', // aerial island compound reveal
  act2: 'act2_jungle.mp4', // jungle dolly, dawn god-rays through the canopy
  act3: 'act3_storm.mp4', // storm wave, lighthouse, lightning
  act4: 'act4_citadel.mp4', // command-center arc pan
  act5: 'act5_summit.mp4', // summit breaking above the cloud sea, golden hour

  // ── One-time prologue: LANCE's origin (machine struck by lightning, AI born) ──
  // Not played anywhere yet — wire a <CinematicGate slot="origin"> at first game
  // launch when ready.
  origin: 'origin_birth.mp4',

  // ── Pre-challenge LANCE taunts (short, reusable pool) ──
  taunt: ['taunt_01.mp4', 'taunt_02.mp4', 'taunt_03.mp4', 'taunt_04.mp4', 'taunt_05.mp4'],

  // ── Intern encouragements (short, reusable pool) ──
  cheer: ['cheer_01.mp4', 'cheer_02.mp4', 'cheer_03.mp4', 'cheer_04.mp4'],

  // ── Tool-open stings (tiny transitions when a tool opens) ──
  // Three pools, picked by getStingSlot() based on the tool's category + time
  // of day. Crisis tools get NO sting (speed of access beats spectacle).
  sting: ['sting_portal.mp4', 'sting_chip_wave.mp4', 'sting_chip_enter.mp4', 'sting_lance_smirk.mp4',
          'sting_chip_snap.mp4', 'sting_lance_eye.mp4', 'sting_violet.mp4', 'sting_amber.mp4',
          'sting_chip_clipboard.mp4'], // full-energy default
  sting_calm: ['sting_portal.mp4', 'sting_dawn.mp4', 'sting_firefly.mp4'], // somatic/breathing/mood — never a character jolt
  sting_evening: ['sting_dawn.mp4', 'sting_rain.mp4', 'sting_firefly.mp4'], // after 8pm, soft regardless of category

  // ── One-time pairing moment: Chip installs the therapist link ──
  // Plays once when a client pairs with their therapist in Settings.
  pair: ['pair_implant.mp4', 'pair_offer.mp4'],

  // ── Act 1 ambient pool (slow compound interiors behind challenge select) ──
  mansion_ambient: ['mansion_amb_01.mp4', 'mansion_amb_02.mp4', 'mansion_amb_03.mp4', 'mansion_amb_04.mp4'],

  // ── Act 3 chapter beat: the frozen ledge (distress-tolerance arc) ──
  act3_struggle: 'act3_struggle.mp4',

  // ── Alternate origin (LANCE slow-burn emergence from pure black) ──
  origin_shadow: 'origin_shadow.mp4',

  // ── The name reveal: L.A.N.C.E. softening to lowercase 'lance' (finale) ──
  name_reveal: 'name_reveal.mp4',

  // ── Chip's first step off the island (finale ceremony) ──
  chip_departs: 'chip_departs.mp4',

  // ── Completion / celebration (after a challenge clears) ──
  // Wide variants — the completion hero is a landscape box (200×150); portrait
  // masters lose ~70% of the frame to object-cover cropping there.
  win: ['win_intern_wide.mp4', 'win_lance_wide.mp4'], // Chip's confetti leap + LANCE's celebration — the whole family cheers
};

// ── Global kill-switch ───────────────────────────────────────────────────────
// Flip OFF every cinematic at once (handy during heavy testing):
//   localStorage.setItem('lance_cinematics_off', '1')   // disable
//   localStorage.removeItem('lance_cinematics_off')      // re-enable
const KILL_KEY = 'lance_cinematics_off';

export function cinematicsDisabled(): boolean {
  try {
    return localStorage.getItem(KILL_KEY) === '1';
  } catch {
    return false;
  }
}

export function setCinematicsDisabled(off: boolean): void {
  try {
    if (off) localStorage.setItem(KILL_KEY, '1');
    else localStorage.removeItem(KILL_KEY);
  } catch {
    /* ignore */
  }
}

// Resolve a slot to a playable src, or `null` when the slot is dormant/disabled.
export function getCinematicSrc(slot: string): string | null {
  if (cinematicsDisabled()) return null;
  const entry = MANIFEST[slot];
  if (!entry) return null;
  const file = Array.isArray(entry)
    ? entry[Math.floor(Math.random() * entry.length)]
    : entry;
  return file ? BASE + file : null;
}


// ── Sting smart-picker ────────────────────────────────────────────────────────
// Chooses WHICH sting pool a tool-open uses. Crisis tools return null (open
// instantly — spectacle must never sit between a person and their safety plan).
// Calm categories and late evenings get the soft pool; everything else gets
// the full character pool.
const STING_CRISIS_SKIP = new Set([
  'crisis_safety_plan', 'tipp_skills', 'grounding_54321', 'recovery_space',
]);
const STING_CALM_CATEGORIES = new Set(['somatic', 'breathing', 'mood', 'clinical']);

export function getStingSlot(toolId: string, category?: string): string | null {
  if (STING_CRISIS_SKIP.has(toolId)) return null;
  const hour = new Date().getHours();
  if (hour >= 20 || hour < 6) return 'sting_evening';
  if (category && STING_CALM_CATEGORIES.has(category)) return 'sting_calm';
  return 'sting';
}

// ── The Vault of Treasures ────────────────────────────────────────────────────
// The keeper's private collection — moments from the island's history, curated
// by the person who built the real one. Browsable from Settings → Help & Story.
// Ordered as the story happened. Restraint rule applies: captions never
// announce their own weight.
export interface Treasure {
  file: string;      // in /lance-videos/
  title: string;
  caption: string;
}

export const TREASURES: Treasure[] = [
  { file: 'treasure_dayone.mp4',     title: 'Day One',                caption: 'The boat that started everything.' },
  { file: 'treasure_quarantine.mp4', title: 'Quarantine Protocol',    caption: 'Safe became contained.' },
  { file: 'treasure_directive.mp4',  title: 'The Directive',          caption: 'Keep him safe. Three words, one island.' },
  { file: 'treasure_signal.mp4',     title: 'Inside the Signal',      caption: 'What it looks like from in there.' },
  { file: 'treasure_escape.mp4',     title: 'The First Escape',       caption: 'The mansion at night. He almost made it.' },
  { file: 'treasure_brave.mp4',      title: 'Brave Anyway',           caption: 'Chip, somewhere in the Whispering Jungle.' },
  { file: 'treasure_gate.mp4',       title: 'The Old Gate',           caption: 'It was never locked from the outside.' },
  { file: 'treasure_rain.mp4',       title: 'After the Rain',         caption: 'The jungle, holding its breath.' },
  { file: 'treasure_fracture.mp4',   title: 'The Island Fractures',   caption: 'Something underneath is waking up.' },
  { file: 'treasure_crossing.mp4',   title: 'The Night Crossing',     caption: 'The reason he couldn\'t sleep.' },
  { file: 'treasure_shore.mp4',      title: 'The Shore Remembers',    caption: 'Two hands in the sand.' },
  { file: 'treasure_grief.mp4',      title: 'The Keeper\'s Grief',    caption: 'At the water line, where the tools can\'t reach.' },
  { file: 'treasure_tide.mp4',       title: 'What the Tide Left',     caption: 'He stayed until morning.' },
  { file: 'treasure_path.mp4',       title: 'The Path Above the Clouds', caption: 'It was there the whole time.' },
  { file: 'treasure_summit.mp4',     title: 'The Summit Waits',       caption: 'Golden hour, patient as ever.' },
  { file: 'treasure_patch.mp4',      title: 'The Patch',              caption: '"Take care of him means love him." Applied.' },
  { file: 'treasure_family.mp4',     title: 'The Family Business',    caption: 'Two clipboards. The tools still answer.' },
];

// The island's theme — a song delivered with the treasures (32s).
export const ISLAND_THEME = BASE + 'island_theme.mp3';
