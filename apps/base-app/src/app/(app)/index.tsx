import { Text, useAppColors } from '@base-app/ui';

import { Screen } from '@/components';

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
