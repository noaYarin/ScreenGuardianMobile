import { ParentModel } from "../models/parent.model.js";

export async function createParent(parentDoc) {
  return ParentModel.create(parentDoc);
}

export async function findParentByEmail(email) {
  // פה עדיף לא lean אם תרצי להשתמש ב-parent._id בצורה מלאה,
  // אבל גם עם lean זה עובד כי _id נשאר
  return ParentModel.findOne({ email });
}