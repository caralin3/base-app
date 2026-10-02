import { Text } from '@base-app/ui';

import { Screen } from '@/components';

export default function MapView() {
  return (
    <Screen
      headerProps={{
        title: 'Map View',
        showBackButton: false,
      }}
    >
      <Text>Map View</Text>
    </Screen>
  );
}
