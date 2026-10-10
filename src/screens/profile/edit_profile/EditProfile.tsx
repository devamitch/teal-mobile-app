import {lightTheme} from '@/constants/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import {RootStackParamList} from '../../../navigations/MainNavigation';
import styles from './EditProfileStyles';
import BackButton from '@/components/ui/buttons/back-button';
import useAppStore from '@/core/stores';
import {useShallow} from 'zustand/react/shallow';

const Colors = lightTheme;

type EditProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditProfile' // The name of this route in your RootStackParamList
>;

const EditProfile = (props: EditProfileScreenProps) => {
  const {navigation} = props;
  const {userData} = useAppStore(useShallow(state => state.user));

  // Check if user has a profile photo
  const hasProfilePhoto = useMemo(() => {
    return !!userData?.photoURL;
  }, [userData?.photoURL]);

  // Format email to truncate if longer than 25 characters
  // Removed unused formatEmail logic

  const [formData, setFormData] = useState({
    username: userData?.displayName || 'Jane',
    email: userData?.email || 'janewillison@gmail.com',
    profileImage: userData?.photoURL ?? undefined,
  });

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

      {/* Header with lightGreen background */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <BackButton
            borderColor="black"
            iconColor="black"
            style={{zIndex: 5}}
          />
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{width: 24}} />
        </View>
      </View>

      <View style={styles.profileContainer}>
        {hasProfilePhoto ? (
          <Image
            source={
              formData.profileImage ? {uri: formData.profileImage} : undefined
            }
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.profileIconContainer]}>
            <Feather name="user" size={50} color={'black'} />
          </View>
        )}
      </View>

      <ScrollView style={{flex: 1}}>
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>User Name</Text>
          <Text style={styles.inputValue}>{formData.username}</Text>

          <Text style={styles.inputLabel}>Email</Text>
          <Text
            style={styles.inputValue}
            numberOfLines={1}
            ellipsizeMode="tail">
            {formData.email}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.changePasswordBtn}
          onPress={navigateToChangePassword}>
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;
