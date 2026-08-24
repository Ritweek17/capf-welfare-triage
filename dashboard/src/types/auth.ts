export type UserRole =
  | "COMMANDER"
  | "WELFARE_OFFICER"
  | "PERSONNEL";

export interface LoginRequest {
  service_id: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role: string;
  person_id: string;
}

export interface AuthSession {
  accessToken: string;
  serviceId: string;
  personId: string;
  role: UserRole;
}
