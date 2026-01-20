import React from 'react';

import { RegisterForm, type RegisterFormProps } from '@/components';
import { useAuth } from '@/lib';

export default function Register() {
  const register = useAuth.use.register();

  const onSubmit: RegisterFormProps['onSubmit'] = async (data) => {
    await register(data.email, data.password);
  };

  return <RegisterForm onSubmit={onSubmit} />;
}
