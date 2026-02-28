import mongoose from "mongoose";
import { ParentModel } from "../models/parent.model.js";
import { AppError } from "../utils/appError.js";

export async function createParent(parentDoc) {
  return ParentModel.create(parentDoc);
}

export async function findParentByEmail(email) {
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

  const parent = await ParentModel.findById(parentId, { children: 1 }).lean();
  if (!parent) {
    throw new AppError({ status: 404, code: "PARENT_NOT_FOUND", message: "Parent not found" });
  }

  return parent.children || [];
}

export async function updateChildActiveByParentId(parentId, childId, isActive) {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new AppError({ status: 400, code: "INVALID_ID", message: "Invalid parentId" });
  }
  if (!mongoose.Types.ObjectId.isValid(childId)) {
    throw new AppError({ status: 400, code: "INVALID_ID", message: "Invalid childId" });
  }

  const updated = await ParentModel.findOneAndUpdate(
    { _id: parentId, "children._id": childId },
    { $set: { "children.$.isActive": isActive } },
    { new: true, projection: { children: 1 } }
  ).lean();

  
  if (!updated) {
    return null;
  }

  return updated;
}