import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { Role } from "../constants/role.js";

export function validateAndBuildChildDoc(body) {
  const { name, birthDate, gender, interests } = body;

  if (!name || !birthDate) {
    throw new AppError(CommonErrors.VALIDATION_NAME_BIRTHDATE);
  }

  const bday = new Date(birthDate);
  if (Number.isNaN(bday.getTime())) {
    throw new AppError(CommonErrors.VALIDATION_BIRTHDATE_INVALID);
  }

  return {
    name, 
    birthDate: bday,
    gender: gender || undefined,
    interests: Array.isArray(interests) ? interests : [],
    coins: 0,
    isActive: true,
    role: Role.CHILD,
    achievementIds: [],
    avatar: { level: 1, img: "default.png", currentXp: 0, nextLevelXp: 100 },
  };
}
