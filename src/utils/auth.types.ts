export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenResult {
  accessToken: string;
  expiresIn: number;
}

export interface VerificationResult {
  success: boolean;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requires2FA: boolean;
  pendingVerification: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  sendOTP: (method: 'sms' | 'email') => Promise<void>;
  enable2FA: () => Promise<string>; // Returns QR code or setup key
  disable2FA: (code: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export type AuthActionType =
  | 'LOGIN_START'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGIN_REQUIRES_2FA'
  | 'REGISTER_START'
  | 'REGISTER_SUCCESS'
  | 'REGISTER_FAILURE'
  | 'LOGOUT'
  | 'VERIFY_2FA_SUCCESS'
  | 'VERIFY_2FA_FAILURE'
  | 'REFRESH_TOKEN_SUCCESS'
  | 'CLEAR_ERROR'
  | 'SET_LOADING';

export interface AuthAction {
  type: AuthActionType;
  payload?: any;
}

export interface AuthAdapter {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<TokenResult>;
  verify2FA(code: string): Promise<VerificationResult>;
  sendOTP(method: 'sms' | 'email'): Promise<void>;
  enable2FA(): Promise<{ qrCode: string; backupCodes: string[] }>;
  disable2FA(code: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
