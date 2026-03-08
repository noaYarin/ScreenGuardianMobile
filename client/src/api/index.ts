export { api } from "./request";
export type { ApiError, ApiResponse } from "./request";

// Auth
export { apiRegisterParent, apiLoginParent, apiGoogleAuthParent } from "./auth/auth";
export type {
  AuthDataFromServer,
  RegisterParentParams,
  LoginParentParams,
  ChildrenDataFromServer,
} from "./auth/auth.types";

// Parent
export { addChild, getMyChild, setChildActive } from "./parent/parent";
export type {
  Child,
  AddChildParams,
  AddChildDataFromServer,
  GetMyChildDataFromServer,
  SetChildActiveDataFromServer,
} from "./parent/parent.types";

// Pairing
export { generateCode, linkDevice } from "./pairing/pairing";
export type {
  GenerateCodeParams,
  GenerateCodeDataFromServer,
  LinkDeviceParams,
  LinkDeviceDataFromServer,
} from "./pairing/pairing.types";
