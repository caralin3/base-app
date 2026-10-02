import { Env } from '@env';
import { useRouter } from 'expo-router';

import {
  Button,
  Item,
  ItemsContainer,
  Screen,
  ThemeItem,
  View,
} from '@/components';
import { useAuth } from '@/lib/hooks';

export default function Profile() {
  const router = useRouter();
  const signOut = useAuth.use.signOut();
  const user = useAuth.use.user();

  return (
    <Screen
      headerProps={{
        title: 'Profile Settings',
        showBackButton: false,
      }}
    >
      <View className="flex-1">
        <ItemsContainer title="About">
          {!!user && (
            <Item
              icon={{ name: 'envelope', type: 'community' }}
              text="Email"
              value={user.email ?? 'No email'}
            />
          )}
          <Item
            text="App Version"
            icon={{ name: 'iphone' }}
            value={Env.VERSION}
          />
        </ItemsContainer>

        <ItemsContainer title="Appearance">
          <ThemeItem />
        </ItemsContainer>

        {Env.APP_ENV === 'development' && (
          <ItemsContainer title="Development">
            <Item
              text="Style"
              icon={{ name: 'paintbrush' }}
              onPress={() => router.navigate('/(app)/profile/style')}
            />
          </ItemsContainer>
        )}

        <View className="px-4 pt-8">
          <Button label="Logout" variant="outline" onPress={signOut} />
        </View>
      </View>
    </Screen>
  );
}
