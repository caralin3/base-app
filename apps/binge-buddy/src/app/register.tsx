import { RegisterForm, type RegisterFormProps, useAuth } from '@base-app/core';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import { Env } from '@/lib';

export default function Register() {
  const register = useAuth.use.register();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: RegisterFormProps['onSubmit'] = async (data) => {
    try {
      setIsLoading(true);
      await register(data.email, data.password);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to register. Please try again.';
      Alert.alert('Registration Error', errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm
      appName={Env.NAME}
      logo={require('@/assets/images/splash-icon.png')}
      onSubmit={onSubmit}
    />
  );
}
