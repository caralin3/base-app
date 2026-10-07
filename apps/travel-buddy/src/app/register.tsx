import { RegisterForm, type RegisterFormProps, useAuth } from '@base-app/core';
import { Redirect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';

import { Env } from '@/lib';

export default function Register() {
  type RegisterFormData = Parameters<
    NonNullable<RegisterFormProps['onSubmit']>
  >[0];

  const { colorScheme } = useColorScheme();

  const status = useAuth.use.status();
  const register = useAuth.use.register();
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (status === 'signIn') {
    return <Redirect href="/(app)" />;
  }

  const onSubmit: RegisterFormProps['onSubmit'] = async (
    data: RegisterFormData
  ) => {
    try {
      setIsLoading(true);
      setFormError(null);
      await register(data.email, data.password);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to register. Please try again.';
      setFormError(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm
      appName={Env.NAME}
      onSubmit={onSubmit}
      authError={formError}
      logo={
        colorScheme === 'dark'
          ? require('../../assets/images/header-logo-dark.png')
          : require('../../assets/images/header-logo-light.png')
      }
      logoStyle={{ width: 256, height: 50 }}
    />
  );
}
