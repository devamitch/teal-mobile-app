import React from 'react';
import {TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface BackButtonProps {
  style?: ViewStyle;
  iconSize?: number;
  iconColor?: string;
  borderColor?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  style,
  iconSize = 24,
  iconColor = '#414142',
  onPress,
  disabled = false,
  borderColor = '#414142',
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        style,
        {borderColor: disabled ? '#CCCCCC' : borderColor},
      ]}
      disabled={disabled}>
      <Icon
        name="chevron-back"
        size={iconSize}
        color={disabled ? '#CCCCCC' : iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.7,
    // borderColor removed here, handled inline
  },
});

export default BackButton;
