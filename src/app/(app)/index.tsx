import { Screen, Text } from '@/components';
import { useAppColors } from '@/theme/use-app-colors';

export default function Home() {
  const colors = useAppColors();

  return (
    <Screen
      headerProps={{
        brand: true,
        title: 'App Home',
        showBackButton: false,
        titleColor: colors.primary,
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </Screen>
  );
}
