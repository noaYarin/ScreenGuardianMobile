import { ParentModel } from "../models/parent.model.js";
import { AppError } from "../utils/appError.js";

export async function createParent(parentDoc) {
  return ParentModel.create(parentDoc);
}

export async function findParentByEmail(email) {
  // פה עדיף לא lean אם תרצי להשתמש ב-parent._id בצורה מלאה,
  // אבל גם עם lean זה עובד כי _id נשאר
  return ParentModel.findOne({ email });
}



export async function pushChildToParent(parentId, childDoc) {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new AppError({ status: 400, code: "INVALID_ID", message: "Invalid parentId" });
  }

  const updated = await ParentModel.findByIdAndUpdate(
    parentId,
    { $push: { children: childDoc } },
    { new: true }
  );

  if (!updated) {
    throw new AppError({ status: 404, code: "PARENT_NOT_FOUND", message: "Parent not found" });
  }

  return updated;
}

export async function getChildrenByParentId(parentId) {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new AppError({ status: 400, code: "INVALID_ID", message: "Invalid parentId" });
  }

  const parent = await ParentModel.findById(parentId, { children: 1 });
  if (!parent) {
    throw new AppError({ status: 404, code: "PARENT_NOT_FOUND", message: "Parent not found" });
  }

  return parent.children || [];
}