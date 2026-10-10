import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Platform} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';

interface ProfileMenuItemProps {
  title: string;
  icon: string;
  iconType?: 'Feather' | 'AntDesign';
  color?: string;
  onPress?: () => void;
  isLast?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  title,
  icon,
  iconType = 'Feather',
  color = Colors.black,
  onPress,
  isLast = false,
}) => {
  const IconComponent = iconType === 'Feather' ? Feather : AntDesign;

  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.menuItem}>
        <IconComponent
          name={icon}
          color={color}
          size={Platform.OS === 'android' ? 30 : 24}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuText, {color}]}>{title}</Text>
        <Feather
          name="chevron-right"
          color={Colors.black}
          size={25}
          style={styles.chevron}
        />
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  menuIcon: {
    paddingRight: 20,
  },
  menuText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  chevron: {
    marginLeft: 'auto',
  },
  divider: {
    backgroundColor: '#888',
    height: 1,
    width: '90%',
    alignSelf: 'center',
  },
});

export default ProfileMenuItem;
