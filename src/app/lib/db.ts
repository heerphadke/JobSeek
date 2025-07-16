import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" }); // Load environment variables from .env.local

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MongoDB connection string is missing in environment variables.");
} 

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "JobTinder",
    });
    isConnected = true;
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    throw error;
  }
};
