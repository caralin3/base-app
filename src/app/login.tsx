import React from 'react';

import {
  FocusAwareStatusBar,
  LoginForm,
  type LoginFormProps,
} from '../components';
import { useAuth } from '../lib';

export default function Login() {
  const signIn = useAuth.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    await signIn(data.email, data.password);
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
