#!/usr/bin/env node
// ═════════════════════════════════════════════════════════════════════════════
//  DRIFTWOOD CRISIS GATE — the DV bright line, enforced from commit #1.
//  Static assertions (the browser crawl joins when the LANCE bones land).
//  Conjoint work is contraindicated in active IPV: this world carries BOTH
//  lines, ungated, every surface — and no borrowed trust badges, ever.
// ═════════════════════════════════════════════════════════════════════════════
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (p) => readFileSync(p, 'utf8');
const failures = [];
const check = (name, ok) => {
  console.log(`  ${ok ? '✓' : '✗'} ${name}`);
  if (!ok) failures.push(name);
};

// --- 1 · The strip carries both lines + SAMHSA -------------------------------
const strip = read('src/components/CrisisStrip.tsx');
check('988 on the strip', /988/.test(strip));
check('the DV Hotline on the strip (1-800-799-7233 + START to 88788)',
  strip.includes('1-800-799-7233') && strip.includes('START to 88788'));
check('SAMHSA on the strip', strip.includes('1-800-662-4357'));
check('the lines are tappable (tel: hrefs)', (strip.match(/tel:/g) || []).length >= 3);

// --- 2 · The strip rides every screen ----------------------------------------
const app = read('src/App.tsx');
check('CrisisStrip imported by the shell', app.includes("import CrisisStrip"));
check('CrisisStrip rendered globally (inside the viewport, above the screens)',
  app.includes('<CrisisStrip />'));

// --- 3 · The private check exists and stores nothing --------------------------
const boarding = read('src/components/OnboardingScreen.tsx');
check('the private page exists (pass-the-device, one adult at a time)',
  boarding.includes('Pass the device') && boarding.includes('one adult at a time'));
check('the private page carries the Hotline', boarding.includes('1-800-799-7233'));
check('the private page promises tracelessness — and keeps it (no storage calls)',
  boarding.includes('Nothing you do on this page is saved') &&
  !/localStorage|sessionStorage|fetch\(/.test(boarding));
check('boarding routes THROUGH the private page (welcome → private → start)',
  boarding.includes("setStep('private')"));

// --- 4 · No borrowed trust badges anywhere on client surfaces -----------------
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const clientFiles = walk('src').filter(f => /\.(tsx?|css)$/.test(f))
  // Quarantine: investor copy, the unrouted dev pane, and the clay pile —
  // dev fiction that renders nowhere (gate #5 proves the door is closed).
  .filter(f => !f.endsWith('investorSpecs.ts') && !f.endsWith('DeveloperDocs.tsx') && !f.includes('clay-pile'));
const clientBlob = clientFiles.map(read).join('');
check('no fake compliance claims on client surfaces (HIPAA-Ready / AES-256 / Patient Consent badges)',
  !/HIPAA[- ]Ready|HIPAA[- ]compliant|AES-256|Active Patient Consent/i.test(clientBlob));
check('no fake peer-review or trust badges', !/isPeerReviewed:\s*true/.test(clientBlob));

// --- 5 · The dev door is closed ------------------------------------------------
check('DeveloperDocs is unrouted (no engineering artifacts on client surfaces)',
  !app.includes('<DeveloperDocs'));

// --- 6 · Every AI endpoint sits on the base layer ------------------------------
const server = read('server.ts');
const calls = (server.match(/generateContent\(/g) || []).length;
const based = (server.match(/DRIFTWOOD_BASE/g) || []).length;
check(`every AI endpoint uses DRIFTWOOD_BASE (${calls} calls, base referenced ${based}x)`,
  calls > 0 && based >= calls + 1);
check('the base layer carries BOTH crisis lines',
  /DRIFTWOOD_BASE = `[^`]*988[^`]*1-800-799-7233/.test(server));
check('the base layer is honest AI (robot in story, AI in fact; never diagnoses)',
  /DRIFTWOOD_BASE = `[^`]*never pretend to be human[^`]*never diagnose/.test(server));
check('the base layer is kid-safe by register',
  /DRIFTWOOD_BASE = `[^`]*child could safely overhear/.test(server));

console.log('');
if (failures.length) {
  console.error(`DRIFTWOOD CRISIS GATE: ${failures.length} FAILURE(S) — the bright line is broken. Fix before ANY feature.`);
  process.exit(1);
}
console.log('DRIFTWOOD CRISIS GATE: ALL CLEAR — both lines lit, the keel is honest.');
