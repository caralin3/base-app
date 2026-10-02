import { useAuth } from '@base-app/core';
import { Redirect } from 'expo-router';

export default function Index() {
  const status = useAuth.use.status();

  if (status === 'idle') {
    return null;
  }

  return <Redirect href={status === 'signIn' ? '/(app)' : '/login'} />;
}
