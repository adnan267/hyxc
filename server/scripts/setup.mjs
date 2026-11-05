// One-time setup helper:  npm run setup   (run inside the server folder)
//  1. asks for your MongoDB Atlas + Cloudinary values and an admin login,
//  2. generates a strong JWT_SECRET for you,
//  3. writes server/.env (local use) and server/vercel-env.txt (paste into Vercel),
//  4. optionally seeds the database.
// Everything stays on your computer. Both files are git-ignored.
import { createInterface } from 'node:readline';
import { randomBytes } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(serverDir, '.env');
const vercelPath = path.join(serverDir, 'vercel-env.txt');

// Line-queue prompt: works for interactive typing and for piped input.
const rl = createInterface({ input: process.stdin });
const queue = [];
const waiters = [];
let closed = false;
rl.on('line', (line) => (waiters.length ? waiters.shift()(line) : queue.push(line)));
rl.on('close', () => { closed = true; waiters.splice(0).forEach((w) => w('')); });
rl.question = (q) => {
  process.stdout.write(q);
  if (queue.length) return Promise.resolve(queue.shift());
  if (closed) return Promise.resolve('');
  return new Promise((resolve) => waiters.push(resolve));
};
const ask = async (q, { required = true, validate } = {}) => {
  for (;;) {
    const v = (await rl.question(q)).trim();
    if (!v && required) { if (closed && !queue.length) { console.log('\nInput ended before all values were given.'); process.exit(1); } console.log('  This value is required.'); continue; }
    const problem = validate?.(v);
    if (problem) { console.log(`  ${problem}`); continue; }
    return v;
  }
};

console.log('\nHYXC setup: paste each value and press Enter.\n');

if (existsSync(envPath)) {
  const ok = (await rl.question('server/.env already exists. Overwrite it? (y/N) ')).trim().toLowerCase();
  if (ok !== 'y') { console.log('Cancelled. Nothing was changed.'); rl.close(); process.exit(0); }
}

const mongo = await ask('MongoDB connection string (mongodb+srv://...): ', {
  validate: (v) => (/^mongodb(\+srv)?:\/\//.test(v) ? '' : 'It must start with mongodb:// or mongodb+srv://')
    || (v.includes('<password>') ? 'Replace <password> with your real database password first.' : ''),
});
const cloud = await ask('Cloudinary Cloud name: ');
const key = await ask('Cloudinary API Key: ');
const secret = await ask('Cloudinary API Secret: ');
const email = await ask('Admin email (for logging in to /admin): ', { validate: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter a valid email.') });
const password = await ask('Admin password (min 10 characters): ', { validate: (v) => (v.length >= 10 ? '' : 'Use at least 10 characters.') });
const site = await ask('Website URL [https://hyxc.vercel.app]: ', { required: false }) || 'https://hyxc.vercel.app';

const jwt = randomBytes(48).toString('hex');
const common = [
  `MONGODB_URI=${mongo}`,
  `JWT_SECRET=${jwt}`,
  `CLOUDINARY_CLOUD_NAME=${cloud}`,
  `CLOUDINARY_API_KEY=${key}`,
  `CLOUDINARY_API_SECRET=${secret}`,
  `SITE_URL=${site.replace(/\/$/, '')}`,
];

writeFileSync(envPath, ['PORT=5000', 'NODE_ENV=development', 'CLIENT_URL=http://localhost:5173', ...common, `ADMIN_EMAIL=${email}`, `ADMIN_PASSWORD=${password}`, ''].join('\n'));
writeFileSync(vercelPath, [...common, 'NODE_ENV=production', ''].join('\n'));

console.log('\nWritten: server/.env  and  server/vercel-env.txt');

const seed = (await rl.question('\nSeed the database now (creates admin + starter content)? (Y/n) ')).trim().toLowerCase();
rl.close();
if (seed !== 'n') {
  const r = spawnSync('npm', ['run', 'seed'], { cwd: serverDir, stdio: 'inherit', shell: true });
  if (r.status !== 0) console.log('\nSeed failed. Check the message above (usually the connection string or Atlas Network Access).');
}

console.log(`
Next: add the variables to Vercel
  1. Open server/vercel-env.txt and copy ALL of its text.
  2. Vercel > your project > Settings > Environment Variables.
  3. Click into the first "Key" box and paste: Vercel fills every variable automatically.
  4. Save, then Deployments > latest > Redeploy.
Keep both files private. Do not commit or share them.
`);
