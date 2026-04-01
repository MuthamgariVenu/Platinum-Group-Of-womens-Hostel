import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Cached connection for Next.js hot-reload (dev) and serverless (prod)
const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose._mongoose;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
