export type AuthDataFromServer = {
  token: string;
  parentId: string;
};

export type ChildrenDataFromServer = {
  childrenIds: string[];
  activeChildId: string;
};

export type RegisterParentParams = {
  email: string;
  password: string;
};

export type LoginParentParams = {
  email: string;
  password: string;
};
