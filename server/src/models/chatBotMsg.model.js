import mongoose from "mongoose";

export const ChatBotMsgSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatTemplate", required: true },
  });
  export default mongoose.model("ChatBotMsg", ChatBotMsgSchema);