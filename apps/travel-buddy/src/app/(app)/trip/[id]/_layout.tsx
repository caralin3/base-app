import { Stack } from 'expo-router';

export type TripNavigatorParamList = {
  index: { id: string; name: string };
};

export default function TripLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
