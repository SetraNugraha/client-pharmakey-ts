export enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export interface IRegisterCustomer {
  username: string;
  email: string;
  role: Role;
  password: string;
  confirmPassword: string;
}
