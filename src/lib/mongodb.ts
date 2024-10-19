/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const MONGODB_URI: string = "mongodb://localhost:27017/local";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: Cached = (global as any).mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  (global as any).mongoose = cached;
}

const dbConnect = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
