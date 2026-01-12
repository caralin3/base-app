import { useRouter } from 'expo-router';

import {
  FocusAwareStatusBar,
  Item,
  ItemsContainer,
  ScrollView,
  ThemeItem,
  View,
} from '../../../components';
import { Env, useAuth } from '../../../lib';

export default function Settings() {
  const router = useRouter();
  const signOut = useAuth.use.signOut();
  const user = useAuth.use.user();

  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView className="flex-1 px-4 pt-8">
        {!!user && (
          <ItemsContainer title="Profile">
            <Item text="Email" value={user.email ?? 'No email'} />
            <Item text="Display Name" value={user.displayName ?? ''} />
          </ItemsContainer>
        )}

        <ItemsContainer title="General">
          <ThemeItem />
        </ItemsContainer>

        <ItemsContainer title="About">
          <Item text="App Name" value={Env.NAME} />
          <Item text="Version" value={Env.VERSION} />
        </ItemsContainer>

        <ItemsContainer title="Links">
          <Item text="Privacy" onPress={() => {}} />
          <Item text="Terms" onPress={() => {}} />
          <Item
            text="Style"
            onPress={() => router.navigate('/(app)/(home)/style')}
          />
        </ItemsContainer>

        <View className="my-8">
          <ItemsContainer>
            <Item text="Logout" onPress={signOut} />
          </ItemsContainer>
        </View>
      </ScrollView>
    </>
  );
}
