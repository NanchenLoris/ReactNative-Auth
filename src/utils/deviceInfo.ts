import { Platform, Dimensions } from 'react-native';

export class DeviceInfo {
  static isIOS(): boolean {
    return Platform.OS === 'ios';
  }

  static isAndroid(): boolean {
    return Platform.OS === 'android';
  }

  static getScreenDimensions() {
    return Dimensions.get('window');
  }

  static isTablet(): boolean {
    return false
  }
}