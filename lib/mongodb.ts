import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose as { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB.
 * Returns the connection on success, or null if unavailable.
 * Never throws — callers fall back to local JSON.
 */
export async function connectDB(): Promise<mongoose.Mongoose | null> {
  // Already connected — reuse immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Cached successful connection
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn('[connectDB] MONGODB_URI not set — using local JSON fallback');
    return null;
  }

  // Start a new connection attempt (deduplicated via cached.promise)
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "platinumhostels",
        bufferCommands: false,
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      })
      .then((m) => {
        console.log('[connectDB] Connected to MongoDB');
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null; // allow retry next time
    console.warn('[connectDB] MongoDB unavailable:', err instanceof Error ? err.message : String(err));
    return null;
  }
}
