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
