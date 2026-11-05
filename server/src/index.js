// Local development entry point (npm run dev). On Vercel, /api/index.js is used instead.
import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

for (const key of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing required env var ${key}. Copy server/.env.example to server/.env first.`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long.');
  process.exit(1);
}

await connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`HYXC API running on http://localhost:${port}`));
