import {lightTheme} from '@/constants';
import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export interface ConfirmationAlertBoxProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onModalHide?: () => void;
}

const ConfirmationAlertBox: React.FC<ConfirmationAlertBoxProps> = ({
  visible,
  message,
  onConfirm,
  onCancel,
  title,
  confirmText = 'OK',
  cancelText = 'Undo',
  onModalHide,
}) => (
  <Modal
    isVisible={visible}
    onBackdropPress={onCancel}
    onBackButtonPress={onCancel}
    useNativeDriver
    useNativeDriverForBackdrop
    animationInTiming={300}
    animationOutTiming={300}
    onModalHide={onModalHide}
    style={styles.modalStyle}
    deviceHeight={deviceHeight}
    deviceWidth={deviceWidth}
    hasBackdrop={false}>
    <>
      <BlurView
        style={styles.blurBackground}
        blurType="light"
        blurAmount={10}
      />

      <GestureHandlerRootView style={styles.container}>
        <Animated.View
          entering={FadeInUp.duration(500)}
          exiting={FadeOutDown.duration(500)}
          style={styles.modal}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <View style={styles.divider} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonDivider} />
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.7}>
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </>
  </Modal>
);

export default ConfirmationAlertBox;

const styles = StyleSheet.create({
  modalStyle: {
    padding: 0,
    flex: 1,
    margin: 0,
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  modal: {
    width: 320,
    borderRadius: 16,
    paddingTop: 24,
    paddingBottom: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 10,
    zIndex: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#383838',
  },
  message: {
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#dedede',
    width: '100%',
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderBottomLeftRadius: 16,
  },
  confirmButton: {
    borderBottomRightRadius: 16,
  },
  buttonDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#dedede',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#666',
  },
  confirmButtonText: {
    color: lightTheme.gradientMiddle,
  },
});
