import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/hooks';

export default function Index() {
  const status = useAuth.use.status();

  if (status === 'idle') {
    return null;
  }

  return <Redirect href={status === 'signIn' ? '/(app)' : '/login'} />;
}
