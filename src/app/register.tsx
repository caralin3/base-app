import React, { useState } from 'react';

import { RegisterForm, type RegisterFormProps } from '@/components';
import { useAuth } from '@/lib/hooks';

export default function Register() {
  const register = useAuth.use.register();
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: RegisterFormProps['onSubmit'] = async (data) => {
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
