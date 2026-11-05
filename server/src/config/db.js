import mongoose from 'mongoose';

// The connection is cached on the module (and on globalThis) so that serverless
// invocations on Vercel reuse one connection instead of opening a new one per request.
let cached = globalThis.__hyxcMongo;
if (!cached) cached = globalThis.__hyxcMongo = { promise: null };

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to server/.env (local) or the Vercel environment variables.');
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5 })
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.host}/${m.connection.name}`);
        return m.connection;
      })
      .catch((err) => {
        cached.promise = null; // allow a retry on the next request
        throw err;
      });
  }
  return cached.promise;
}
