import React from 'react';
import {useSocialAuth} from '@/hooks/use-social-auth';
import useAppStore from '../stores';

export const AuthBootstrap: React.FC = () => {
  // Fix: Use individual selectors instead of spreading the entire user object
  const setUser = useAppStore(state => state.user.setUser);
  const setIsLogin = useAppStore(state => state.user.setIsLogin);
  const setAccessToken = useAppStore(state => state.user.setAccessToken);

  const {isInitializing} = useSocialAuth({
    onAuthStateChanged: (authUser, token) => {
      if (authUser && token) {
        // Update store with user data
        if(authUser.emailVerified)
          setUser({
            displayName: authUser.displayName,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            phoneNumber: authUser.phoneNumber,
            photoURL: authUser.photoURL,
            providerId: authUser.providerId,
            uid: authUser.uid,
          });
        setIsLogin(true);
        setAccessToken(token);
      }
    },
    enableDebugLogs: true,
  });

  return null; // This component doesn't render anything
};
