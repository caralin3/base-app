import { Redirect } from 'expo-router';
import React, { useState } from 'react';

import { RegisterForm, type RegisterFormProps } from '@/components';
import { useAuth } from '@/lib/hooks';

export default function Register() {
  type RegisterFormData = Parameters<
    NonNullable<RegisterFormProps['onSubmit']>
  >[0];

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

  return <RegisterForm onSubmit={onSubmit} authError={formError} />;
}
