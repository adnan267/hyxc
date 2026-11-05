// Vercel serverless entry: the whole Express API runs as one function.
// vercel.json rewrites /api/* and /sitemap.xml to this file.
import app from '../server/src/app.js';

export default app;
