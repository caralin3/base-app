import { Screen, Text, useAppColors } from '@base-app/ui';

export default function Home() {
  const colors = useAppColors();

  return (
    <Screen
      headerProps={{
        title: 'App Home',
        showBackButton: false,
        titleColor: colors.primary,
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </Screen>
  );
}
