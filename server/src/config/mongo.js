import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectMongo() {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is missing");
  await mongoose.connect(env.MONGO_URI);
  console.log("✅ Mongo connected");
}