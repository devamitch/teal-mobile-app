import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '@/constants/colors';

interface CompleteButtonProps {
  onPress: () => void;
  isCompleted?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

const CompleteButton: React.FC<CompleteButtonProps> = ({
  onPress,
  isCompleted = false,
  disabled = false,
  style,
  textStyle,
  size = 'medium',
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [
      styles.button,
      styles[`button_${size}`] as ViewStyle,
    ];

    if (isCompleted) {
      baseStyle.push(styles.completedButton);
    } else if (disabled) {
      baseStyle.push(styles.disabledButton);
    } else {
      baseStyle.push(styles.activeButton);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [
      styles.buttonText,
      styles[`buttonText_${size}`] as TextStyle,
    ];

    if (isCompleted) {
      baseStyle.push(styles.completedText);
    } else if (disabled) {
      baseStyle.push(styles.disabledText);
    } else {
      baseStyle.push(styles.activeText);
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const getIconName = () => {
    if (isCompleted) {
      return 'check-circle';
    }
    return 'check';
  };

  const getIconColor = () => {
    if (isCompleted) {
      return Colors.white;
    } else if (disabled) {
      return '#999';
    }
    return Colors.white;
  };

  const getButtonText = () => {
    if (isCompleted) {
      return 'Completed';
    }
    return 'Complete';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <MaterialIcons
        name={getIconName()}
        size={getIconSize()}
        color={getIconColor()}
        style={styles.icon}
      />
      <Text style={getTextStyle()}>{getButtonText()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button_small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  button_medium: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  button_large: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#2D7D7A',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontWeight: '600',
    marginLeft: 6,
  },
  buttonText_small: {
    fontSize: 12,
  },
  buttonText_medium: {
    fontSize: 14,
  },
  buttonText_large: {
    fontSize: 16,
  },
  activeText: {
    color: Colors.white,
  },
  completedText: {
    color: Colors.white,
  },
  disabledText: {
    color: '#999',
  },
  icon: {
    marginRight: 2,
  },
});

export default CompleteButton;
