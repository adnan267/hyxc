import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { initCloudinary } from './config/cloudinary.js';
import routes from './routes/index.js';
import { sitemap } from './controllers/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import { asyncHandler, HttpError } from './utils/helpers.js';

// Builds the Express app WITHOUT starting a listener, so it can run both locally
// (server/src/index.js) and as a Vercel serverless function (/api/index.js).
const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());

const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(cors({ origin: origins, credentials: false }));
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

initCloudinary();

// Health check does not need the database.
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Temporary diagnostic: reports WHICH setting is wrong, never any value. Remove once the site works.
app.get('/api/health/diagnose', async (_req, res) => {
  const e = process.env;
  const out = {
    mongoUri: !e.MONGODB_URI ? 'missing' : /^mongodb(\+srv)?:\/\//.test(e.MONGODB_URI) ? (e.MONGODB_URI.includes('<') ? 'still has <placeholder>' : 'looks ok') : 'wrong format',
    jwtSecret: !e.JWT_SECRET ? 'missing' : e.JWT_SECRET.length < 32 ? `too short (${e.JWT_SECRET.length})` : 'ok',
    cloudinary: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter((k) => !e[k]).join(', ') || 'ok',
  };
  try { await connectDB(); out.database = 'connected'; }
  catch (err) {
    const m = String(err.message || '');
    out.database = /auth/i.test(m) ? 'authentication failed (wrong user/password)'
      : /ENOTFOUND|querySrv/i.test(m) ? 'host not found (check cluster address)'
      : /whitelist|IP|timed out|ServerSelection/i.test(`${m} ${err.name}`) ? 'cannot reach server (Atlas Network Access 0.0.0.0/0?)'
      : `failed: ${err.name}`;
  }
  res.json(out);
});

// Validate config + connect (cached) before any data route.
const ensureReady = asyncHandler(async (_req, _res, next) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new HttpError(500, 'Server is misconfigured: JWT_SECRET must be set and at least 32 characters.');
  }
  await connectDB();
  next();
});

app.get('/sitemap.xml', ensureReady, sitemap);
app.use('/api', ensureReady, routes);
app.use(notFound);
app.use(errorHandler);

export default app;
