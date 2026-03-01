import mongoose from "mongoose";
import { Role } from "../constants/role.js";

export const ChildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String },
    interests: { type: [String], default: [] },
    coins: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: Role, default: Role.CHILD },
    achievementIds: { type: [String], default: [] },
    avatar: { type: Object, default: { level: 1, img: "default.png", currentXp: 0, nextLevelXp: 100 } },
  },
  { timestamps: true }
);
