import { Stack } from 'expo-router';

import { IconButton } from '../../../components';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: 'Home',
          headerRight: () => (
            <IconButton
              icon="gearshape"
              size={26}
              onPress={() => navigation.navigate('settings')}
            />
          ),
        })}
      />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="style" options={{ title: 'Style' }} />
    </Stack>
  );
}
