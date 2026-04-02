export interface SignupPayload {
  fullName: string;
  email: string;
  organizationName: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}