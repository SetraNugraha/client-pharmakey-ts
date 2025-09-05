import { Errors } from "../types/common.type";

export const getErrorField = (hasErrors: Errors[], field: string) => {
  return hasErrors?.find((err) => err?.field === field);
};
