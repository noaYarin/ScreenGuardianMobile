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
  const updated = await pushChildToParent(parentId, childDoc);
  const addedChild = updated.children[updated.children.length - 1];
  return { child: addedChild };
}

export async function getMyChild(parentId, options = {}) {
  const includeInactive = options.includeInactive === true;
  const childList = await getChildByParentId(parentId);
  const filtered = includeInactive ? childList : childList.filter((c) => c.isActive === true);
  return { children: filtered };
}

export async function setChildActive(parentId, childId, isActive) {
  const updatedParent = await updateChildActiveByParentId(parentId, childId, isActive);

  if (!updatedParent) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  const list = updatedParent.children || [];
  const updatedChild = list.find((c) => String(c._id) === String(childId));
  return { child: updatedChild };
}