import axios, { AxiosInstance } from 'axios';
import { AuthAdapter, LoginCredentials, RegisterData, AuthResult, TokenResult, VerificationResult, User } from '../utils/auth.types';
import { TokenManager } from '../utils/tokenManager';

export class RestApiAdapter implements AuthAdapter {
  private httpClient: AxiosInstance;

  constructor(baseURL: string) {
    this.httpClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.httpClient.interceptors.request.use(
      async (config) => {
        const token = await TokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = await TokenManager.getRefreshToken();
            if (refreshToken) {
              const response = await this.httpClient.post('/auth/refresh', {
                refreshToken,
              });
              
              const { accessToken } = response.data;
              await TokenManager.setAccessToken(accessToken);
              
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.httpClient(originalRequest);
            }
          } catch (refreshError) {
            await TokenManager.clearTokens();
            throw refreshError;
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await this.httpClient.post('/auth/login', credentials);
      return this.normalizeAuthResult(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const response = await this.httpClient.post('/auth/register', data);
      return this.normalizeAuthResult(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.httpClient.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    }
  }

  async refreshToken(): Promise<TokenResult> {
    try {
      const refreshToken = await TokenManager.getRefreshToken();
      const response = await this.httpClient.post('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async verify2FA(code: string): Promise<VerificationResult> {
    try {
      const response = await this.httpClient.post('/auth/verify-2fa', { code });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || '2FA verification failed' 
      };
    }
  }

  async sendOTP(method: 'sms' | 'email'): Promise<void> {
    try {
      await this.httpClient.post('/auth/send-otp', { method });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  async enable2FA(): Promise<{ qrCode: string; backupCodes: string[] }> {
    try {
      const response = await this.httpClient.post('/auth/enable-2fa');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enable 2FA');
    }
  }

  async disable2FA(code: string): Promise<void> {
    try {
      await this.httpClient.post('/auth/disable-2fa', { code });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to disable 2FA');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.httpClient.get('/auth/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  private normalizeAuthResult(data: any): AuthResult {
    return {
      user: data.user,
      accessToken: data.accessToken || data.access_token,
      refreshToken: data.refreshToken || data.refresh_token,
      expiresIn: data.expiresIn || data.expires_in || 3600,
    };
  }
}