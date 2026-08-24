export type UserRole =
  | "COMMANDER"
  | "WELFARE_OFFICER"
  | "PERSONNEL";

export interface AuthUser {
  loginId: string;
  personnelId?: string;
  name: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  designation?: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}
