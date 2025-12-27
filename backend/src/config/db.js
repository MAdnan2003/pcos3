import mongoose from "mongoose";

const DEFAULT_OPTIONS = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let isConnected = false;

export const connectDB = async (uri = process.env.MONGO_URI) => {
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment");
  }

  if (isConnected) {
    console.log("MongoDB: already connected.");
    return;
  }

  try {
    await mongoose.connect(uri, DEFAULT_OPTIONS);
    isConnected = true;
    console.log("MongoDB connected to:", uri);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// graceful shutdown helper
export const closeDB = async () => {
  if (!isConnected) return;
  try {
    await mongoose.connection.close(false);
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
  }
};
