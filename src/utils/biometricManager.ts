import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_KEY = 'biometric_enabled';

export class BiometricManager {
  static async isBiometricSupported(): Promise<boolean> {
    try {
      const biometryType = await TouchID.isSupported();
      return true;
    } catch (error) {
      return false;
    }
  }

  static async authenticate(reason: string): Promise<boolean> {
    try {
      await TouchID.authenticate(reason, {
        imageColor: '#e00606',
        imageErrorColor: '#ff0000',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(BIOMETRIC_KEY, enabled.toString());
  }

  static async isBiometricEnabled(): Promise<boolean> {
    const enabled = await AsyncStorage.getItem(BIOMETRIC_KEY);
    return enabled === 'true';
  }

  static async clearBiometricData(): Promise<void> {
    await AsyncStorage.removeItem(BIOMETRIC_KEY);
  }
}