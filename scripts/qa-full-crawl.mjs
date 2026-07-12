#!/usr/bin/env node
// ═════════════════════════════════════════════════════════════════════════════
//  DRIFTWOOD FULL CRAWL — every room, every family-deck tool, console-clean.
//  Expect FINDINGS: 0. (Asset 404s for art that hasn't landed are filtered —
//  the components hide missing art honestly by design.)
// ═════════════════════════════════════════════════════════════════════════════
import { chromium } from 'playwright';

const BASE = process.env.CRAWL_BASE || 'http://localhost:3300';
const findings = [];
let current = 'boot';

const DECK = ['undertow_chart','mooring_lines','soundings','family_map','tide_table','bottle_post','mending_bench','barometer','passage_chart','family_manifest','daily_rigging','ships_calendar','sea_chest','ask_the_jumble'];
const ISLAND_SAMPLE = ['gratitude_log','box_breathing','worry_parking','assertiveness','life_vision'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
const noise = /WebSocket|\[vite\]|robots\/|region-heroes|icons\/|shore\/|Failed to load resource/i;
page.on('pageerror', e => { if (!noise.test(String(e))) findings.push({ where: current, kind: 'pageerror', msg: String(e).slice(0, 160) }); });
page.on('console', m => { if (m.type() === 'error' && !noise.test(m.text())) findings.push({ where: current, kind: 'console', msg: m.text().slice(0, 160) }); });

await page.addInitScript(() => {
  localStorage.setItem('driftwood_boarded_v1', '1');
  localStorage.setItem('driftwood_castaways_v1', JSON.stringify([{ slotId: 'castaway-1', name: 'Crawl', claimedAt: new Date().toISOString(), kind: 'human' }]));
});
await page.goto(BASE + '/', { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(1600);

// ── The five rooms (island-only law, 2026-07-12: the fourth is "Island" now,
//    not "Challenges" — the 3D world itself, not a list about it) ────────────
for (const room of ['Check-in', 'Island', 'Library', 'Insights', 'Home']) {
  current = `room:${room}`;
  await page.locator('nav:visible').getByText(room, { exact: true }).click()
    .catch(() => findings.push({ where: current, kind: 'nav-fail', msg: 'room not clickable' }));
  await page.waitForTimeout(900);
}

// ── No crisis info on any room (the 2026-07-12 law: Settings-only) ───────────
current = 'law:clean-surfaces';
for (const room of ['Check-in', 'Island', 'Library', 'Insights', 'Home']) {
  await page.locator('nav:visible').getByText(room, { exact: true }).click().catch(() => {});
  await page.waitForTimeout(500);
  const body = await page.evaluate(() => document.body.innerText);
  if (/988|1-800-799-7233|1-800-662-4357/.test(body))
    findings.push({ where: `clean:${room}`, kind: 'CRISIS-ON-SURFACE', msg: 'hotline info on a general surface (belongs in Settings → Safety & Crisis)' });
}

// ── Every family-deck tool + island sample via the treaty ────────────────────
for (const id of [...DECK, ...ISLAND_SAMPLE]) {
  current = `tool:${id}`;
  await page.evaluate(t => window.dispatchEvent(new CustomEvent('driftwood:open-tool', { detail: { toolId: t } })), id);
  await page.waitForTimeout(1100);
  const up = await page.getByRole('button', { name: /Back/i }).last().isVisible().catch(() => false);
  if (!up) findings.push({ where: current, kind: 'tool-fail', msg: 'tool did not render an exit' });
  await page.getByRole('button', { name: /Back/i }).last().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(350);
}

// ── The Island tab IS the 3D world — island-only law (2026-07-12): no
//    off-island list of milestones exists to check for anymore. The Milestone
//    Log mounts invisibly (hideShelf) and only proves itself when a story
//    circle triggers it — the crawl instead asserts the room's real content:
//    the world renders, and the read-only Trail stays reachable. ────────────
current = 'room:island';
await page.locator('nav:visible').getByText('Island', { exact: true }).click().catch(() => {});
await page.waitForTimeout(1200);
if (!(await page.locator('iframe[title="The Island in three dimensions"]').first().isVisible().catch(() => false)))
  findings.push({ where: current, kind: 'island-fail', msg: 'the 3D island did not mount in the Island tab' });
if (!(await page.locator('[data-testid="challenges-tidechart"]').first().isVisible().catch(() => false)))
  findings.push({ where: current, kind: 'trail-fail', msg: 'the Trail (read-only progress) button is missing from the island' });
// the shelf must NOT be browsable off the island — the law's other half
if (await page.getByText('The Milestone Log').first().isVisible().catch(() => false))
  findings.push({ where: current, kind: 'law-violation', msg: 'a browsable milestone shelf rendered on the Island tab — challenges must only open by walking to them' });
// ── The swap card stays on the shore ─────────────────────────────────────────
current = 'room:swap';
await page.locator('nav:visible').getByText('Home', { exact: true }).click().catch(() => {});
await page.locator('nav:visible').getByText('Home', { exact: true }).click().catch(() => {});
await page.waitForTimeout(700);
if (!(await page.getByText('Walk a Day in Their Boots').first().isVisible().catch(() => false)))
  findings.push({ where: current, kind: 'swap-fail', msg: 'perspective swap card missing' });

await browser.close();

console.log('');
for (const f of findings) console.log(`  ✗ [${f.where}] ${f.kind}: ${f.msg}`);
console.log(`\nFINDINGS: ${findings.length}`);
process.exit(findings.length ? 1 : 0);
