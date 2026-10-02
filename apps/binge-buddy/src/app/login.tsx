import { LoginForm, type LoginFormProps, useAuth } from '@base-app/core';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import { Env } from '@/lib';

export default function Login() {
  const signIn = useAuth.use.signIn();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to sign in. Please try again.';
      Alert.alert('Login Error', errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      appName={Env.NAME}
      logo={require('@/assets/images/splash-icon.png')}
      onSubmit={onSubmit}
    />
  );
}
