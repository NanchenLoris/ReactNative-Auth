export interface AuthConfig {
  backend: 'rest' | 'firebase' | 'graphql';
  baseURL?: string;
  endpoints?: {
    login: string;
    register: string;
    logout: string;
    refresh: string;
    verify2FA: string;
    sendOTP: string;
    enable2FA: string;
    disable2FA: string;
    currentUser: string;
  };
  features: {
    biometric: boolean;
    social: string[];
    twoFactor: ('totp' | 'sms' | 'email')[];
    passwordReset: boolean;
  };
  validation: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
}

export const defaultAuthConfig: AuthConfig = {
  backend: 'rest',
  baseURL: 'https://api.example.com',
  endpoints: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify2FA: '/auth/verify-2fa',
    sendOTP: '/auth/send-otp',
    enable2FA: '/auth/enable-2fa',
    disable2FA: '/auth/disable-2fa',
    currentUser: '/auth/me',
  },
  features: {
    biometric: true,
    social: ['google', 'facebook', 'apple'],
    twoFactor: ['totp', 'sms', 'email'],
    passwordReset: true,
  },
  validation: {
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
  },
};