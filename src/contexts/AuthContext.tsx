import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthContextType, RegisterData, LoginCredentials, AuthAdapter } from '../utils/auth.types';
import { authReducer, initialAuthState } from '../reducers/authReducer';
import { TokenManager } from '../utils/tokenManager';
import { BiometricManager } from '../utils/biometricManager';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  adapter: AuthAdapter;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, adapter }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = await TokenManager.getAccessToken();
      if (token && !TokenManager.isTokenExpired(token)) {
        const user = await adapter.getCurrentUser();
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, accessToken: token } });
        }
      } else {
        await refreshToken();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const result = await adapter.login(credentials);
      
      if (result.user.is2FAEnabled) {
        dispatch({ type: 'LOGIN_REQUIRES_2FA' });
        return;
      }
      
      await TokenManager.setTokens(result.accessToken, result.refreshToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: result });
      
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      const result = await adapter.register(data);
      await TokenManager.setTokens(result.accessToken, result.refreshToken);
      dispatch({ type: 'REGISTER_SUCCESS', payload: result });
      
    } catch (error: any) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adapter.logout();
      await TokenManager.clearTokens();
      await BiometricManager.clearBiometricData();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const verify2FA = async (code: string) => {
    try {
      const result = await adapter.verify2FA(code);
      
      if (result.success) {
        const user = await adapter.getCurrentUser();
        if (user) {
          dispatch({ type: 'VERIFY_2FA_SUCCESS', payload: { user } });
        }
      } else {
        dispatch({ type: 'VERIFY_2FA_FAILURE', payload: result.message });
      }
    } catch (error: any) {
      dispatch({ type: 'VERIFY_2FA_FAILURE', payload: error.message });
      throw error;
    }
  };

  const sendOTP = async (method: 'sms' | 'email') => {
    try {
      await adapter.sendOTP(method);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const enable2FA = async (): Promise<string> => {
    try {
      const result = await adapter.enable2FA();
      return result.qrCode;
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const disable2FA = async (code: string) => {
    try {
      await adapter.disable2FA(code);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = await TokenManager.getRefreshToken();
      if (refreshToken) {
        const result = await adapter.refreshToken();
        await TokenManager.setAccessToken(result.accessToken);
        dispatch({ type: 'REFRESH_TOKEN_SUCCESS', payload: result });
      }
    } catch (error) {
      await logout();
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    verify2FA,
    sendOTP,
    enable2FA,
    disable2FA,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
