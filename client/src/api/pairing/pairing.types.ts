export type GenerateCodeParams = {
  childId?: string | null;
};

export type GenerateCodeDataFromServer = {
  code: string;
  barcodeToken: string;
  expiresAt: string;
};

export type LinkDeviceParams = {
  code?: string;
  barcodeToken?: string;
};

export type LinkDeviceDataFromServer = {
  token: string;
  parentId: string;
  childId: string;
};
