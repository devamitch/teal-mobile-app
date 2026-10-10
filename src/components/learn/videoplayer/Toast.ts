import {Alert, Platform, ToastAndroid} from 'react-native';

export const toast = (visible: boolean, message: string) => {
  if (visible) {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      Alert.alert(message, message);
    }
  }
};
