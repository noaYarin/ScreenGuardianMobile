export type Child = {
  _id: string;
  name: string;
  birthDate: string;
  gender?: string;
  interests?: string[];
  coins: number;
  isActive: boolean;
  role: string;
  achievementIds?: string[];
  avatar?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type AddChildParams = {
  name: string;
  birthDate: string;
  gender?: string;
  interests?: string[];
};

export type AddChildDataFromServer = {
  child: Child;
};

export type GetMyChildDataFromServer = {
  children: Child[];
};

export type SetChildActiveDataFromServer = {
  [key: string]: unknown;
};

