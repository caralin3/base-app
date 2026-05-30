import React from 'react';

import { LoginForm, type LoginFormProps } from '@/components';
import { useAuth } from '@/lib/hooks';

export default function Login() {
  const signIn = useAuth.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    await signIn(data.email, data.password);
  };

  return <LoginForm onSubmit={onSubmit} />;
}
