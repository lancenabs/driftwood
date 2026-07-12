#!/usr/bin/env node
// ═════════════════════════════════════════════════════════════════════════════
//  DRIFTWOOD SAFETY GATE — the 2026-07-12 law.
//  Crisis protocols are therapist-configured per state and live ONLY in
//  Settings → Safety & Crisis. General surfaces carry NO crisis information —
//  no strips, no hotlines, no preloaded numbers. The gate asserts BOTH sides:
//  the surfaces are clean, and the Settings pathway exists and works.
//  (Honest-AI and no-borrowed-badges assertions carry over unchanged.)
// ═════════════════════════════════════════════════════════════════════════════
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (p) => readFileSync(p, 'utf8');
const failures = [];
const check = (name, ok) => {
  console.log(`  ${ok ? '✓' : '✗'} ${name}`);
  if (!ok) failures.push(name);
};

// --- 1 · No crisis strip on any surface ---------------------------------------
const app = read('src/App.tsx');
check('CrisisStrip is NOT imported by the shell', !app.includes("import CrisisStrip"));
check('CrisisStrip is NOT rendered anywhere', !app.includes('<CrisisStrip'));

const boarding = read('src/components/BoardingStory.tsx');
check('the boarding carries no hotline numbers',
  !/988|1-800-799|1-800-662|88788/.test(boarding));
check('the boarding has no private DV phase (moved to Settings safety onboarding)',
  !boarding.includes("'private'"));

// --- 2 · No hardcoded hotlines on ROUTED client surfaces ----------------------
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const clientFiles = walk('src').filter(f => /\.(tsx?|css)$/.test(f))
  // Quarantine: investor copy, dev pane, clay pile (unrouted), and the two
  // retired components kept under never-delete (CrisisStrip, OnboardingScreen).
  .filter(f => !f.endsWith('investorSpecs.ts') && !f.endsWith('DeveloperDocs.tsx') && !f.includes('clay-pile')
    && !f.endsWith('CrisisStrip.tsx') && !f.endsWith('OnboardingScreen.tsx'));
const clientBlob = clientFiles.map(read).join('');
check('no hardcoded hotline numbers on routed surfaces (988 / DV line / SAMHSA / 741741)',
  !/tel:988|sms:988|1-800-799-7233|1-800-662-4357|741741|START to 88788/.test(clientBlob));

// --- 3 · The Settings pathway exists -------------------------------------------
const safety = read('src/components/SafetyCrisisSettings.tsx');
check('SafetyCrisisSettings exists with the therapist onboarding',
  safety.includes('Begin Safety Onboarding') && safety.includes('driftwood_crisis_config_v1'));
check('nothing is preloaded (no hardcoded hotline in the safety screen)',
  !/988|1-800-799|1-800-662/.test(safety));
const settings = read('src/components/SettingsScreen.tsx');
check('Settings carries the Safety & Crisis row', settings.includes('Safety & Crisis'));
check('Settings carries a Factory Reset', settings.includes('Factory Reset'));
const gameData = read('src/lance/components/LANCEGame/lanceGameData.ts');
check('safety tools are declared settings-only (SAFETY_TOOL_IDS)',
  gameData.includes("SAFETY_TOOL_IDS: string[] = ['crisis_safety_plan']"));
const library = read('src/lance/components/LANCEGame/LibraryTab.tsx');
check('the Library filters safety tools out', library.includes('LIBRARY_TOOLS'));

// --- 4 · The XR pages are clean -------------------------------------------------
for (const page of ['public/island3d/index.html', 'public/vr/index.html', 'public/mr/index.html']) {
  const html = read(page);
  check(`${page} carries no hotline numbers`, !/tel:988|18007997233|988<\/|text 988/.test(html));
}

// --- 5 · No borrowed trust badges anywhere on client surfaces -------------------
check('no fake compliance claims on client surfaces (HIPAA-Ready / AES-256 / Patient Consent badges)',
  !/HIPAA[- ]Ready|HIPAA[- ]compliant|AES-256|Active Patient Consent/i.test(clientBlob));
check('no fake peer-review or trust badges', !/isPeerReviewed:\s*true/.test(clientBlob));

// --- 6 · The dev door is closed --------------------------------------------------
check('DeveloperDocs is unrouted (no engineering artifacts on client surfaces)',
  !app.includes('<DeveloperDocs'));

// --- 7 · Every AI endpoint sits on the base layer; the base points to Settings ---
const server = read('server.ts');
const calls = (server.match(/generateContent\(/g) || []).length;
const based = (server.match(/DRIFTWOOD_BASE/g) || []).length;
check(`every AI endpoint uses DRIFTWOOD_BASE (${calls} calls, base referenced ${based}x)`,
  calls > 0 && based >= calls + 1);
check('the base layer routes crisis to the therapist-configured protocol (never recites hotlines)',
  /DRIFTWOOD_BASE = `[^`]*Settings → Safety & Crisis[^`]*Never invent or recite hotline numbers/.test(server)
  && !/DRIFTWOOD_BASE = `[^`]*988/.test(server));
check('the base layer is honest AI (robot in story, AI in fact; never diagnoses)',
  /DRIFTWOOD_BASE = `[^`]*never pretend to be human[^`]*never diagnose/.test(server));
check('the base layer is kid-safe by register',
  /DRIFTWOOD_BASE = `[^`]*child could safely overhear/.test(server));

console.log('');
if (failures.length) {
  console.error(`DRIFTWOOD SAFETY GATE: ${failures.length} FAILURE(S) — the new law is broken. Fix before ANY feature.`);
  process.exit(1);
}
console.log('DRIFTWOOD SAFETY GATE: ALL CLEAR — surfaces clean, the Settings pathway stands.');
