import { Stack } from 'expo-router';

export type ShowNavigatorParamList = {
  index: { id: string; name: string };
};

export default function ShowLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
