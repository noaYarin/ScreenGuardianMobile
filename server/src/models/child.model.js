import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      birthDate: { type: Date, required: true },
      gender: { type: String },
      interests: { type: [String], default: [] },
      coins: { type: Number, default: 0 },
      img: { type: String },
      isActive: { type: Boolean, default: true },
      achievementIds: { type: [String], default: [] },
      avatar: {
        level: { type: Number, default: 1 },
        img: { type: String, default: "default.png" },
        currentXp: { type: Number, default: 0 },
        nextLevelXp: { type: Number, default: 100 },
      },
    },
  );
  export default mongoose.model("Child", ChildSchema);