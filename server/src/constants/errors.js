export const Pairing = {
  CHILD_NOT_FOUND: { status: 400, code: "CHILD_NOT_FOUND", message: "Child does not belong to this parent" },
  SHORT_CODE_COLLISION: { status: 503, code: "SHORT_CODE_COLLISION", message: "Could not generate unique code, try again" },
  LINK_NEED_ONE: { status: 400, code: "VALIDATION_ERROR", message: "Provide either code or barcodeToken" },
  LINK_ONLY_ONE: { status: 400, code: "VALIDATION_ERROR", message: "Provide only one of code or barcodeToken" },
  SESSION_NOT_FOUND: { status: 404, code: "SESSION_NOT_FOUND", message: "Pairing session not found" },
  SESSION_ALREADY_USED: { status: 410, code: "SESSION_ALREADY_USED", message: "This pairing code has already been used" },
  SESSION_EXPIRED: { status: 410, code: "SESSION_EXPIRED", message: "Pairing code has expired" },
  NO_CHILD: { status: 400, code: "NO_CHILD", message: "Parent has no active child" },
  CHILD_SELECTION_REQUIRED: { status: 400, code: "CHILD_SELECTION_REQUIRED", message: "Parent has more than one child; childId must be specified when generating the pairing code" },
  DEVICE_TYPE_REQUIRED: { status: 400, code: "VALIDATION_ERROR", message: "deviceType is required" },
INVALID_DEVICE_TYPE: { status: 400, code: "VALIDATION_ERROR", message: "deviceType is invalid" },
};


export const Auth = {
  MISSING_TOKEN: { status: 400, code: "MISSING_TOKEN", message: "idToken is required" },
  GOOGLE_AUTH_DISABLED: { status: 503, code: "GOOGLE_AUTH_DISABLED", message: "Google sign-in is not configured" },
  INVALID_GOOGLE_TOKEN: { status: 401, code: "INVALID_GOOGLE_TOKEN", message: "Invalid or expired Google token" },
  NO_EMAIL: { status: 400, code: "NO_EMAIL", message: "Google account has no email" },
  EMAIL_EXISTS: { status: 409, code: "EMAIL_EXISTS", message: "Email already registered" },
  INVALID_CREDENTIALS: { status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
  USE_GOOGLE: { status: 400, code: "USE_GOOGLE", message: "This account uses Google sign-in" },
  NO_AUTH: { status: 401, code: "NO_AUTH", message: "Not authenticated" },
  FORBIDDEN: { status: 403, code: "FORBIDDEN", message: "Parents only" },
  NO_TOKEN: { status: 401, code: "NO_TOKEN", message: "Missing token" },
  INVALID_TOKEN: { status: 401, code: "INVALID_TOKEN", message: "Invalid token" },
};

export const Common = {
  INVALID_PARENT_ID: { status: 400, code: "INVALID_ID", message: "Invalid parentId" },
  INVALID_CHILD_ID: { status: 400, code: "INVALID_ID", message: "Invalid childId" },
  INVALID_SESSION_ID: { status: 400, code: "INVALID_ID", message: "Invalid session id" },
  INVALID_DEVICE_ID: { status: 400, code: "INVALID_ID", message: "Invalid deviceId" },
  PARENT_NOT_FOUND: { status: 404, code: "PARENT_NOT_FOUND", message: "Parent not found" },
  NOT_FOUND: { status: 404, code: "NOT_FOUND", message: "Child not found" },
  VALIDATION_NAME_BIRTHDATE: { status: 400, code: "VALIDATION_ERROR", message: "name and birthDate are required" },
  VALIDATION_BIRTHDATE_INVALID: { status: 400, code: "VALIDATION_ERROR", message: "birthDate must be a valid date" },
  VALIDATION_CHILD_ID: { status: 400, code: "VALIDATION", message: "childId must be a valid ObjectId" },
  VALIDATION_IS_ACTIVE: { status: 400, code: "VALIDATION", message: "isActive must be boolean" },
  LIMIT_MAX_CHILDREN_REACHED: {status: 409,code: "LIMIT_MAX_CHILDREN_REACHED", message: "Maximum of 8 children per account.",}
};
