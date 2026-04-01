import { Stack } from 'expo-router';

export type ShowNavigatorParamList = {
  index: { id: string; name: string };
  'set-production-order': { id: string };
};

export default function ShowLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="set-production-order"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
