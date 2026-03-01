import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import {
  pushChildToParent,
  getChildByParentId,
  updateChildActiveByParentId,
} from "../dal/parent.dal.js";
import { validateAndBuildChildDoc } from "./child.service.js";

export async function addChild(parentId, body) {
  const childDoc = validateAndBuildChildDoc(body);
  await pushChildToParent(parentId, childDoc);
  return { child: childDoc };
}

export async function getMyChild(parentId, options = {}) {
  const includeInactive = options.includeInactive === true;
  const childList = await getChildByParentId(parentId);
  const filtered = includeInactive ? childList : childList.filter((c) => c.isActive === true);
  return { child: filtered };
}

export async function setChildActive(parentId, childId, isActive) {
  const updatedParent = await updateChildActiveByParentId(parentId, childId, isActive);

  if (!updatedParent) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  const list = updatedParent.child || [];
  const updatedChild = list.find((c) => String(c._id) === String(childId));
  return { child: updatedChild };
}