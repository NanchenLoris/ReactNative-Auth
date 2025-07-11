import { PermissionsAndroid, Platform } from 'react-native';

export class PermissionManager {
  static async requestSMSPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'SMS Permission',
            message: 'This app needs access to SMS to automatically read OTP codes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS doesn't need explicit SMS permission for OTP
  }

  static async requestBiometricPermission(): Promise<boolean> {
    // Biometric permissions are handled automatically by the system
    return true;
  }
}