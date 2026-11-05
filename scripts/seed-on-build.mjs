// Optional: seeds the database during a Vercel build when SEED_ON_BUILD=true.
// Safe to re-run: content is only inserted when empty. A failure never breaks the build.
import { spawnSync } from 'node:child_process';

if (process.env.SEED_ON_BUILD !== 'true') {
  console.log('[seed-on-build] SEED_ON_BUILD is not "true": skipping.');
} else {
  console.log('[seed-on-build] Seeding database...');
  const r = spawnSync(process.execPath, ['server/src/seed.js'], { stdio: 'inherit' });
  console.log(r.status === 0 ? '[seed-on-build] Done.' : '[seed-on-build] Seed failed (see message above). Build continues.');
}
