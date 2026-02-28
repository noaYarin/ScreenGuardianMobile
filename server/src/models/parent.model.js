import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // hash
    name: { type: String, required: true },
    phoneNumber: { type: String },
    children: { type: [mongoose.Schema.Types.ObjectId], ref: "Child", default: [] },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Parent", ParentSchema);