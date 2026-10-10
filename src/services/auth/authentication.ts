import { Toast } from "@/utils/toast";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const getErrorMessage = (errorCode: string | undefined): string => {
  console.log(errorCode, 'err');
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'This email address is not registered. Please sign up first.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered.';
    case 'auth/invalid-email':
      return 'The email address is invalid. Please enter a valid email.';
    case 'auth/invalid-credential':
      return 'Invalid credential. Please enter a valid credential.';
    case 'auth/weak-password':
      return 'The password is too weak. Please choose a stronger password.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const updateFirebaseDoc = async (uid: string, records: Record<string, any>) => {
  try {
    await firestore().collection('users').doc(uid).set(
      records,
      { merge: true },
    )
    return true;
  } catch (error) {
    console.error(error);
    Toast(error as string)
    return false;
  }
}

export const emailSignUp = async (displayName: string, email: string, password: string) : Promise<{success: boolean, message: string, userCred?: FirebaseAuthTypes.UserCredential}> => {
  try {
    const userCred = await auth().createUserWithEmailAndPassword(email, password)

    await userCred.user.sendEmailVerification()

    await userCred.user.updateProfile({
      displayName: displayName
    })

    await firestore().collection('users').doc(userCred.user.uid).set({
      uid: userCred.user.uid,
      isSyncEnabled: false,
      paymentStatus: false,
      isNewUser: true,
    });

    await auth().signOut();

    return {
      success: true, 
      userCred: userCred,
      message: `We've sent a verification email to your inbox. Please open your email and click on the verification link to complete your registration.`
    }
  } catch (error: any) {
    return {success: false, message: getErrorMessage(error.code)}
  }
}
export const emailLogin = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const userDoc = await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .get();

    if (userCredential.user.emailVerified) {
      const userData: Record<string | number, any> = {
        ...userCredential.user,
        ...userDoc.data(),
      };

      return {
        success: true,
        user: userCredential,
        otherInfo: userData,  
        message: 'Login successful!',
        is_new_user: userData.isNewUser ?? true,
      };
    } else {
      await auth().signOut();
      return {
        success: false,
        message: 'Please verify your email before logging in.',
      };
    }
  } catch (error: any) {
    const userFriendlyMessage = getErrorMessage(error.code);
    return { success: false, message: userFriendlyMessage };
  }
}

export const checkUserPassword = async (password: string): Promise<boolean> => {
  const user = auth().currentUser;

  if (!user || !user.email) {
    console.warn('User not logged in or missing email.');
    return false;
  }

  const credential = auth.EmailAuthProvider.credential(user.email, password);

  try {
    await user.reauthenticateWithCredential(credential);
    return true;
  } catch (error) {
    console.error(error)
    return false;
  }
};

export const updateUserProfile = async (
  {displayName, photoURL}: {displayName?: string, photoURL?: string}
): Promise<boolean> => {
  const user = auth().currentUser;

  if (!user) {
    console.warn('No user is signed in');
    return false;
  }

  try {
    if(displayName){
      await user.updateProfile({
        displayName
      })
    }
    if(photoURL){
      await user.updateProfile({
        photoURL
      })
    }
    console.log('User profile updated successfully');
    Toast('User profile updated successfully');
    return true;
  } catch (error) {
    Toast(`Failed to update user profile: ${error}`)
    console.error('Failed to update user profile:', error);
    return false;
  }
};

export const updateUserEmail = async (
  newEmail: string,
  currentPassword: string
): Promise<boolean> => {
  const user = auth().currentUser;

  if (!user || !user.email) {
    console.warn('No signed-in user or missing current email');
    return false;
  }

  try {
    // Step 1: Re-authenticate user
    const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(credential);

    // Step 2: Update email
    await user.updateEmail(newEmail);
    console.log('Email updated successfully');
    Toast('Email updated successfully');
    return true;
  } catch (error) {
    Toast(`Failed to update email: ${error}`)
    console.error('Failed to update email:', error);
    return false;
  }
};

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  const user = auth().currentUser;

  if (!user || !user.email) {
    console.warn('User not signed in');
    return false;
  }

  try {
    const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(credential);

    await user.updatePassword(newPassword);
    console.log('Password updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update password:', error);
    return false;
  }
};
