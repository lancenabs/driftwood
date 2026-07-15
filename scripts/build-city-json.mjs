// Emit the canonical Driftwood City as a flat JSON the standalone board object
// (public/mr/city.html) fetches. ONE source of truth: src/data/driftwoodCity.ts.
// Run:  npx tsx scripts/build-city-json.mjs
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { CITY_REGIONS, CITY_PLACES, cityStats } from '../src/data/driftwoodCity.ts';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../public/city');
mkdirSync(out, { recursive: true });

const payload = {
  generatedFrom: 'src/data/driftwoodCity.ts',
  stats: cityStats,
  regions: CITY_REGIONS,
  // x/z are the ONE geography — island3d, VR and the board all read these.
  // Lance's call 2026-07-14: one island. Before this each world placed the city
  // itself and they had already drifted to sharing almost nothing.
  places: CITY_PLACES.map(p => ({
    id: p.id, name: p.name, glyph: p.glyph, region: p.region,
    x: p.x, z: p.z,
    audience: p.audience, purpose: p.purpose, mystery: !!p.mystery,
    lightsAt: p.lightsAt,
  })),
};

writeFileSync(resolve(out, 'driftwood-city.json'), JSON.stringify(payload, null, 2));
console.log(`wrote public/city/driftwood-city.json — ${payload.places.length} places, ${payload.regions.length} regions`);
