import Colors, {lightTheme} from '@/constants/colors';
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/Ionicons';

interface ActionContainerProps {
  img?: any;
  icon?: React.ReactNode;
  title?: string;
  bgColor?: string;
  isCounter?: boolean;
  handlePress?: any;
  isMarked?: boolean;
}

const ActionContainer = ({
  img,
  icon,
  title,
  bgColor,
  handlePress,
  isMarked,
}: ActionContainerProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: bgColor}]}
        onPress={handlePress}>
        {icon ? (
          icon
        ) : (
          <Image
            source={img}
            style={styles.image}
            tintColor={lightTheme.gradientMiddle}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {isMarked && (
        <FontAwesome5
          style={styles.badge}
          name="checkmark-circle"
          size={25}
          color={'#03992b'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    minWidth: '30%',
    padding: 10,
    position: 'relative',
  },
  button: {
    height: Platform.OS === 'android' ? 90 : 80,
    width: Platform.OS === 'android' ? 90 : 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    height: '70%',
    width: '70%',
  },
  title: {
    color: Colors.black,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    right: Platform.OS === 'android' ? 15 : 22,
    top: -5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ActionContainer;
