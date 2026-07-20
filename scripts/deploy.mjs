#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  deploy.mjs — Driftwood's one-command, self-verifying trial deploy.
//  The LANCE pattern: build with the Navigator endpoint BAKED IN, verify the
//  bundle BEFORE publishing, deploy, confirm live.
//  Netlify = the front door (driftwood1) · the Navigator answers on Render.
// ─────────────────────────────────────────────────────────────────────────────
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ENDPOINT   = (process.env.VITE_COMPANION_ENDPOINT || 'https://clinical-companion.onrender.com').replace(/\/$/, '');
const SITE_ID    = process.env.NETLIFY_SITE_ID || 'f692168c-e4dc-414b-a3e6-f910a32f7f2e'; // driftwood1
const CLIENT_URL = (process.env.CLIENT_URL || 'https://driftwood1.netlify.app').replace(/\/$/, '');
const RENDER_HOST = new URL(ENDPOINT).host;

const step = t => console.log(`\n\x1b[1m▸ ${t}\x1b[0m`);
const die  = m => { console.error(`\n\x1b[31m✗ DEPLOY ABORTED: ${m}\x1b[0m`); process.exit(1); };
const run  = (cmd, env) => { console.log(`  $ ${cmd}`); execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } }); };

step(`Building the shore (VITE_COMPANION_ENDPOINT=${ENDPOINT})`);
try { run('npm run build', { VITE_COMPANION_ENDPOINT: ENDPOINT }); } catch { die('build failed'); }

step('Verifying the built bundle before publishing');
const assetsDir = path.join('dist', 'assets');
if (!fs.existsSync(assetsDir)) die('dist/assets missing');
let blob = '';
for (const f of fs.readdirSync(assetsDir)) if (f.endsWith('.js')) blob += fs.readFileSync(path.join(assetsDir, f), 'utf8');
if (!blob.includes(RENDER_HOST)) die(`Navigator host ${RENDER_HOST} not baked into the bundle`);
console.log(`  ✓ ${RENDER_HOST} baked in`);
// the masterpiece must ship
for (const probe of ['opening/still/poster_p.jpg', 'opening/audio/skip_n1.mp3', 'opening/video/b4_stone_p.mp4']) {
  if (!fs.existsSync(path.join('dist', probe))) die(`film asset missing from dist: ${probe}`);
}
console.log('  ✓ THE WAYWARD BOY film assets present');

step('Deploying to Netlify (prod)');
try { run(`netlify deploy --prod --no-build --dir=dist --site ${SITE_ID}`); }
catch { die('netlify deploy failed (netlify login?)'); }

step('Confirming the live deploy');
const res = await fetch(`${CLIENT_URL}/`, { redirect: 'manual' }).catch(() => null);
if (!res || res.status !== 200) die(`live client did not return 200 (${res?.status ?? 'no response'})`);
const film = await fetch(`${CLIENT_URL}/opening/still/poster_p.jpg`).catch(() => null);
if (!film || film.status !== 200) die('the film poster is not live');
console.log(`  ✓ ${CLIENT_URL} live · the city of unlit lamps waits offshore`);
console.log('\n\x1b[32m✓ DRIFTWOOD DEPLOY COMPLETE & VERIFIED\x1b[0m');
