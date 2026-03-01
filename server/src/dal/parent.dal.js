import mongoose from "mongoose";
import ParentModel from "../models/parent.model.js";  
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";

export async function createParent(parentDoc) {
  return ParentModel.create(parentDoc);
}

export async function findParentByEmail(email) {
  return ParentModel.findOne({ email });
}

export async function findParentByGoogleId(googleId) {
  return ParentModel.findOne({ googleId });
}

export async function pushChildToParent(parentId, childDoc) {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new AppError(CommonErrors.INVALID_PARENT_ID);
  }

  const updated = await ParentModel.findByIdAndUpdate(
    parentId,
    { $push: { childs: childDoc } },
    { new: true }
  );

  if (!updated) {
    throw new AppError(CommonErrors.PARENT_NOT_FOUND);
  }

  return updated;
}

export async function getChildByParentId(parentId) {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new AppError(CommonErrors.INVALID_PARENT_ID);
  }

  const parent = await ParentModel.findById(parentId, { childs: 1 }).lean();
  if (!parent) {
    throw new AppError(CommonErrors.PARENT_NOT_FOUND);
  }

  return parent.childs || [];
}

export async function updateChildActiveByParentId(parentId, childId, isActive) {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new AppError(CommonErrors.INVALID_PARENT_ID);
  }
  if (!mongoose.Types.ObjectId.isValid(childId)) {
    throw new AppError(CommonErrors.INVALID_CHILD_ID);
  }

  const updated = await ParentModel.findOneAndUpdate(
    { _id: parentId, "childs._id": childId },
    { $set: { "childs.$.isActive": isActive } },
    { new: true, projection: { childs: 1 } }
  ).lean();

  
  if (!updated) {
    return null;
  }

  return updated;
}