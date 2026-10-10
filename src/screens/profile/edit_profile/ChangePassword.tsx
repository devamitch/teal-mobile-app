import BackButton from '@/components/ui/buttons/back-button';
import {lightTheme} from '@/constants/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {RootStackParamList} from '../../../navigations/MainNavigation';
import styles from './ChangePasswordStyles';
import {
  PasswordInput,
  PrimaryButton,
} from '@/components/ui';
import { Toast } from '@/utils/toast';
import { changeUserPassword } from '@/services/auth/authentication';

type ChangePasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ChangePassword'
>;

const ChangePassword = (props: ChangePasswordScreenProps) => {
  const {navigation} = props;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    oldPassword: '',
  });

  const handleFormEdit = (key: 'newPassword' | 'confirmPassword' | 'oldPassword', value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }))
  };

  const handleSave = async () => {
    try {
      if(formData.oldPassword === ''){
        throw new Error("Old password is empty");
      } else if(formData.newPassword === ''){
        throw new Error("New password is empty");
      } else if(formData.confirmPassword === ''){
        throw new Error("Confirm password is empty");
      } else if(formData.newPassword !== formData.confirmPassword){
        throw new Error("Password Doesn't match");
      } else if(formData.newPassword.length < 8){
        throw new Error("New Password is too small");
      }

      const changePassword = await changeUserPassword(formData.oldPassword, formData.newPassword);
      
      if(changePassword){
        Toast('Password updated successfully')
      } else{
        Toast('Password not changed. Please try again.')
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Toast(`${error}`);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        backgroundColor={lightTheme.background}
        barStyle="dark-content"
      />
      <BackButton style={{left: '8%', top: '-5%'}} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Create new password</Text>
      </View>

      <Text style={styles.subtitle}>
        Your new password must be unique from those previously used.
      </Text>

      <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
        <PasswordInput
          placeholder='Old password'
          value={formData.oldPassword}
          onChangeText={(val) => handleFormEdit('oldPassword', val)}
        />
        <PasswordInput
          placeholder='New password'
          value={formData.newPassword}
          onChangeText={(val) => handleFormEdit('newPassword', val)}
        />
        <PasswordInput
          placeholder='Confirm password'
          value={formData.confirmPassword}
          onChangeText={(val) => handleFormEdit('confirmPassword', val)}
        />
        <PrimaryButton
          text='Change Password'
          onPress={handleSave}
          textStyle={styles.changePasswordText}
          style={{marginTop: 50}}
        />
      </ScrollView>
    </View>
  );
};

export default ChangePassword;
