import { AppError } from "../utils/appError.js";
import {
  pushChildToParent,
  getChildrenByParentId,
  updateChildActiveByParentId,
} from "../dal/parent.dal.js";


export async function addChild(parentId, body) {
  const { name, birthDate, gender, interests } = body;

  if (!name || !birthDate) throw new AppError({ status: 400, code: "VALIDATION_ERROR", message: "name and birthDate are required" });

  const bd = new Date(birthDate);
  if (Number.isNaN(bd.getTime())) throw new AppError({ status: 400, code: "VALIDATION_ERROR", message: "birthDate must be a valid date" });

  const childDoc = {
    name,
    birthDate: bd,
    gender: gender || undefined,
    interests: Array.isArray(interests) ? interests : [],
    coins: 0,
    isActive: true,
    achievementIds: [],
    avatar: { level: 1, img: "default.png", currentXp: 0, nextLevelXp: 100 },
  };

  const updatedParent = await pushChildToParent(parentId, childDoc);

  const added = updatedParent.children[updatedParent.children.length - 1];
  return { child: added };
}


export async function getMyChildren(parentId, options = {}) {
  const includeInactive = options.includeInactive === true;

  const children = await getChildrenByParentId(parentId);

  const filtered = includeInactive ? children : children.filter((c) => c.isActive === true);

  return { children: filtered };
}

export async function setChildActive(parentId, childId, isActive) {
  const updatedParent = await updateChildActiveByParentId(parentId, childId, isActive);

  if (!updatedParent) {
    throw new AppError({
      status: 404,
      code: "NOT_FOUND",
      message: "Child not found",
    });
  }

  const updatedChild = updatedParent.children.find((c) => String(c._id) === String(childId));

  return { child: updatedChild };
}