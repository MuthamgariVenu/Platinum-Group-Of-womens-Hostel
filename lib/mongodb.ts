import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  console.log('[connectDB] MONGODB_URI present:', !!MONGODB_URI);
  if (MONGODB_URI) {
    console.log('[connectDB] MONGODB_URI prefix:', MONGODB_URI.substring(0, 30) + '...');
  }

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI environment variable is not set. ' +
      'Add it in Vercel Dashboard → Project Settings → Environment Variables.'
    );
  }

  if (cached.conn) {
    console.log('[connectDB] Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('[connectDB] Creating new connection...');
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "platinumhostels",
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .then((m) => {
        console.log('[connectDB] Connected successfully to MongoDB');
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error('[connectDB] Connection FAILED:', err instanceof Error ? err.message : String(err));
    console.error('[connectDB] Full error:', err);
    throw err;
  }

  return cached.conn;
}
