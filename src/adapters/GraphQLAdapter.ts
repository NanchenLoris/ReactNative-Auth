import auth from '@react-native-firebase/auth';
import { AuthAdapter, LoginCredentials, RegisterData, AuthResult, TokenResult, VerificationResult, User } from '../utils/auth.types';

export class FirebaseAdapter implements AuthAdapter {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      
      const token = await userCredential.user.getIdToken();
      const user = this.normalizeUser(userCredential.user);
      
      return {
        user,
        accessToken: token,
        refreshToken: userCredential.user.refreshToken || '',
        expiresIn: 3600,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      
      // Update profile with additional info
      await userCredential.user.updateProfile({
        displayName: `${data.firstName} ${data.lastName}`.trim(),
      });
      
      const token = await userCredential.user.getIdToken();
      const user = this.normalizeUser(userCredential.user);
      
      return {
        user,
        accessToken: token,
        refreshToken: userCredential.user.refreshToken || '',
        expiresIn: 3600,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    await auth().signOut();
  }

  async refreshToken(): Promise<TokenResult> {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('No current user');
      
      const token = await user.getIdToken(true);
      return {
        accessToken: token,
        expiresIn: 3600,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Token refresh failed');
    }
  }

  async verify2FA(code: string): Promise<VerificationResult> {
    // Firebase handles 2FA differently, implement based on your setup
    return { success: true };
  }

  async sendOTP(method: 'sms' | 'email'): Promise<void> {
    // Implement OTP sending logic for Firebase
  }

  async enable2FA(): Promise<{ qrCode: string; backupCodes: string[] }> {
    // Implement 2FA enabling logic for Firebase
    return { qrCode: '', backupCodes: [] };
  }

  async disable2FA(code: string): Promise<void> {
    // Implement 2FA disabling logic for Firebase
  }

  async getCurrentUser(): Promise<User | null> {
    const user = auth().currentUser;
    return user ? this.normalizeUser(user) : null;
  }

  private normalizeUser(firebaseUser: any): User {
    const [firstName, lastName] = (firebaseUser.displayName || '').split(' ');
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      firstName,
      lastName,
      avatar: firebaseUser.photoURL,
      isEmailVerified: firebaseUser.emailVerified,
      is2FAEnabled: false, // Implement based on your Firebase setup
    };
  }
}