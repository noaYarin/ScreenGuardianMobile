import type {
  AuthDataFromServer,
  LoginParentParams,
  RegisterParentParams,
} from "../../api";
import type { ChildrenDataFromServer } from "../../api/auth.types";

export interface AuthState {
  parentId: string | null;
  token: string | null;
  childrenIds: string[];
  activeChildId: string | null;
  isLoading: boolean;
  error: string | null;
}

export type LoginParentPayload = {
  auth: AuthDataFromServer;
  children: ChildrenDataFromServer;
};

export type LoginParentArgs = LoginParentParams;

export type RegisterParentArgs = RegisterParentParams;

export type GoogleAuthParentArgs = {
  idToken: string;
};

export type FetchChildrenFulfilledPayload = {
  childrenIds: string[];
  activeChildId: string | null;
};