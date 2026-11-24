import mongoose from 'mongoose';
import { config } from '../config/env.js';

let isConnected = false;

mongoose.set('bufferCommands', false);

export async function connectDB(): Promise<typeof mongoose | null> {
  if (isConnected) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err: any) {
    console.warn(`[Database] Warning: MongoDB connection failed (${err.message}). Running in mock/development resilience mode.`);
    return null;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}
