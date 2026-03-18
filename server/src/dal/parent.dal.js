import ParentModel from "../models/parent.model.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { MAX_CHILDREN_PER_PARENT } from "../constants/childNumLimit.js";
import { assertValidObjectId } from "../utils/validators.js";

export async function createParent(parentDoc) {
  return ParentModel.create(parentDoc);
}

export async function findParentByEmail(email) {
  return ParentModel.findOne({ email });
}


// Forgot password - search for parent by email and set OTP code
export async function setPasswordResetCodeByEmail(email, code, expiresAt) {
  return ParentModel.findOneAndUpdate(
    { email },
    {
      $set: {
        passwordResetCode: code,
        passwordResetCodeExpires: expiresAt,
      },
    },
    { new: true }
  );
}

// Forgot password - find parent by valid email + OTP code
export async function findParentByEmailAndValidResetCode(email, code, now = new Date()) {
  return ParentModel.findOne({
    email,
    passwordResetCode: code,
    passwordResetCodeExpires: { $gt: now },
  });
}

// Forgot password - update password and clear reset fields
export async function updateParentPasswordAndClearReset(parentId, passwordHash) {
  return ParentModel.findByIdAndUpdate(
    parentId,
    {
      $set: { password: passwordHash },
      $unset: { passwordResetCode: "", passwordResetCodeExpires: "" },
    },
    { new: true }
  );
}

export async function pushChildToParent(parentId, childDoc) {

  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);

  const indexKey = `children.${MAX_CHILDREN_PER_PARENT - 1}`;

  const updated = await ParentModel.findOneAndUpdate(
    { _id: parentId, [indexKey]: { $exists: false } },
    { $push: { children: childDoc } },
    { new: true }
  );

  if (updated) {
    return updated;
  }

  const parentExists = await ParentModel.exists({ _id: parentId });

  if (!parentExists) {
    throw new AppError(CommonErrors.PARENT_NOT_FOUND);
  }

  throw new AppError(CommonErrors.LIMIT_MAX_CHILDREN_REACHED);
}

export async function getChildrenByParentId(parentId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);


  const parent = await ParentModel.findById(parentId, { children: 1 }).lean();

  if (!parent) {
    throw new AppError(CommonErrors.PARENT_NOT_FOUND);
  }

  return parent.children || [];
}

export async function updateChildActiveByParentId(parentId, childId, isActive) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);


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


export async function updateChildInterestsByParentId(parentId, childId, interests) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);

  const updated = await ParentModel.findOneAndUpdate(
    { _id: parentId, "children._id": childId },
    { $set: { "children.$.interests": interests } },
    { new: true, projection: { children: 1 } }
  ).lean();

  if (!updated) {
    return null;
  }

  return updated;
}



export async function updateSelectedDeviceByParentId(parentId, childId, selectedDeviceId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);
  assertValidObjectId(selectedDeviceId, CommonErrors.INVALID_DEVICE_ID);

  return ParentModel.findOneAndUpdate(
    { _id: parentId, "children._id": childId },
    { $set: { "children.$.selectedDeviceId": selectedDeviceId } },
    { new: true }
  ).lean();
}