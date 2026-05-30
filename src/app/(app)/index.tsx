import { colors, Screen, Text } from '@/components';

export default function Home() {
  return (
    <Screen
      headerProps={{
        brand: true,
        title: 'App Home',
        showBackButton: false,
        titleColor: colors.primary[600],
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </Screen>
  );
}
