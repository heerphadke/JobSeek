import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("Please add your MongoDB URI to .env");
}

export const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGO_URI);
};
