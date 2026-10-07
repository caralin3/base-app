import { LoginForm, type LoginFormProps, useAuth } from '@base-app/core';
import { Redirect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';

import { Env } from '@/lib';

export default function Login() {
  type LoginFormData = Parameters<NonNullable<LoginFormProps['onSubmit']>>[0];

  const { colorScheme } = useColorScheme();

  const status = useAuth.use.status();
  const signIn = useAuth.use.signIn();
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (status === 'signIn') {
    return <Redirect href="/(app)" />;
  }

  const onSubmit: LoginFormProps['onSubmit'] = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setFormError(null);
      await signIn(data.email, data.password);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to sign in. Please try again.';
      setFormError(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
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
