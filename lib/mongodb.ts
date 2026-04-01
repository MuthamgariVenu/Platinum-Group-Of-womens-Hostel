import mongoose from 'mongoose';

// Cached connection for Next.js hot-reload (dev) and serverless (prod)
const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose._mongoose;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Return existing live connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If we have a stale conn or disconnected state, reset
  if (mongoose.connection.readyState === 0 || !cached.conn) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
      })
      .catch((err) => {
        // Reset cache so the next call retries instead of re-throwing stale promise
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
