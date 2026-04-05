import { AppError } from "../utils/appError.js";
import { Common as CommonErrors, ChildProfileImage } from "../constants/errors.js";
import { Role } from "../constants/role.js";
import { Gender } from "../constants/gender.js";
import {
  updateCurrentChildProfileByParentId,
  updateChildProfileImgByParentId,
} from "../dal/parent.dal.js";
import { notifyParent } from "./notification.service.js";
import { NotificationType } from "../constants/notificationType.js";
import { NotificationSeverity } from "../constants/severity.js";
export function validateAndBuildChildDoc(body = {}) {
  const { name, birthDate, gender, interests } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new AppError(CommonErrors.VALIDATION_NAME_REQUIRED);
  }


  if (name.trim().length > 30) {
    throw new AppError(CommonErrors.VALIDATION_NAME_TOO_LONG);
  }

  let bday;

  if (birthDate !== undefined) {
    bday = new Date(birthDate);
    if (Number.isNaN(bday.getTime())) {
      throw new AppError(CommonErrors.VALIDATION_BIRTHDATE_INVALID);
    }
  }

  if (gender && !Object.values(Gender).includes(gender)) {
    throw new AppError(CommonErrors.VALIDATION_GENDER_INVALID);
  }

  return {
    name: typeof name === "string" ? name : undefined,
    birthDate: bday,
    gender: gender || undefined,
    interests: Array.isArray(interests) ? interests : [],
    coins: 0,
    isActive: true,
    role: Role.CHILD,
    achievementIds: [],
    img: "",
    avatar: { level: 1, currentXp: 0, nextLevelXp: 100 },
  };
}


export async function updateCurrentChildProfile(parentId, childId, birthDate, gender) {
  const updated = await updateCurrentChildProfileByParentId(parentId, childId, birthDate, gender);

  if (!updated) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  try {
    await notifyParent({
      parentId,
      childId,
      type: NotificationType.CHILD_PROFILE_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Child Profile Updated",
      description: "Child profile details were updated"
    });
  } catch (err) {
    console.error("notifyParent failed in updateCurrentChildProfile:", err.message);
  }

  return { child: updated };
}

export async function updateChildProfileImageByParent(parentId, childId, img) {
  // Maximum allowed characters for Base64 profile image string (approx. 2.8MB).
  const MAX_PROFILE_IMAGE_CHARS = 2_800_000;

  if (typeof img !== "string" || !img.trim()) {
    throw new AppError(ChildProfileImage.REQUIRED);
  }
  if (img.length > MAX_PROFILE_IMAGE_CHARS) {
    throw new AppError(ChildProfileImage.TOO_LARGE);
  }
  const trimmed = img.trim();
  if (!trimmed.startsWith("data:image/")) {
    throw new AppError(ChildProfileImage.INVALID);
  }

  const updated = await updateChildProfileImgByParentId(parentId, childId, trimmed);

  if (!updated) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  try {
    await notifyParent({
      parentId,
      childId,
      type: NotificationType.CHILD_PROFILE_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Child Profile Updated",
      description: "Child profile image was updated",
    });
  } catch (err) {
    console.error("notifyParent failed in updateChildProfileImageByParent:", err.message);
  }

  return { child: updated };
}