export { api } from "./client";
export type { ApiError, ApiResponse } from "./client";

// Auth
export {
  registerParent,
  loginParent,
  googleAuthParent, 
} from "./auth";
export type {
  AuthDataFromServer,
  RegisterParentParams,
  LoginParentParams,
} from "./auth";

// Parent
export { addChild, getMyChild, setChildActive } from "./parent";
export type {
  Child,
  AddChildParams,
  AddChildDataFromServer,
  GetMyChildDataFromServer,
  SetChildActiveDataFromServer,
} from "./parent";

// Pairing
export { generateCode, linkDevice } from "./pairing";
export type {
  GenerateCodeParams,
  GenerateCodeDataFromServer,
  LinkDeviceParams,
  LinkDeviceDataFromServer, 
} from "./pairing";
