// types/auth.ts
export interface UserRegistration {
  name: string;
  username: string;
  password_hash: string;
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  userId?: number;
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password_hash: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface AuthPluginOptions {
  secret: string;
  cookieName?: string;
}
interface JwtPayload {
  id: number;
  username: string;
  name: string;
}
