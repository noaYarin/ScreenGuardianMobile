import mongoose from "mongoose";

export const ChatTemplateSchema = new mongoose.Schema({
    isMenu: { type: Boolean, default: false },
    menuOptionNumber: { type: Number },
    content: { type: String, required: true },
    category: { type: String }
  }, { timestamps: true });
export default mongoose.model("ChatTemplate", ChatTemplateSchema);