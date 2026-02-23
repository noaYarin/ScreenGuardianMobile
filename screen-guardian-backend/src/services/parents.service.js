import { AppError } from "../utils/appError.js";
import { pushChildToParent, getChildrenByParentId } from "../dal/parent.dal.js";

function generateChildId() {
  // יוצר מזהה קצר ויחודי מספיק לראוטים (ללא ObjectId)
  return `child_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function addChild(parentId, body) {
  const { name, birthDate, gender, interests, img } = body;

  if (!name || !birthDate) {
    throw new AppError({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "name and birthDate are required",
    });
  }

  const bd = new Date(birthDate);
  if (Number.isNaN(bd.getTime())) {
    throw new AppError({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "birthDate must be a valid date",
    });
  }

  const childId = generateChildId();

  const childDoc = {
    childId,
    name,
    birthDate: bd,
    gender: gender || undefined,
    interests: Array.isArray(interests) ? interests : [],
    coins: 0,
    img: img || undefined,
    status: "Active",
    achievementIds: [],
    avatar: {
      level: 1,
      img: "default.png",
      currentXp: 0,
      nextLevelXp: 100,
    },
  };

  const updatedParent = await pushChildToParent(parentId, childDoc);

  // נחזיר את הילד שנוסף (נמצא אותו לפי childId)
  const added = updatedParent.children.find((c) => c.childId === childId);

  return { child: added };
}

export async function getMyChildren(parentId) {
  const children = await getChildrenByParentId(parentId);
  return { children };
}