import { defaultAuthConfig } from '../config/auth.config';

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string, config = defaultAuthConfig.validation): string | null => {
  if (!password) return 'Password is required';
  if (password.length < config.passwordMinLength) {
    return `Password must be at least ${config.passwordMinLength} characters long`;
  }
  if (config.requireNumbers && !/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validate2FACode = (code: string): string | null => {
  if (!code) return 'Code is required';
  if (code.length !== 6) return 'Code must be 6 digits';
  if (!/^\d+$/.test(code)) return 'Code must contain only numbers';
  return null;
};