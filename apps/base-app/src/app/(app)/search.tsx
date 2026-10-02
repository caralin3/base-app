import { Button, Text } from '@base-app/ui';

import { Screen } from '@/components';

export default function Search() {
  return (
    <Screen
      headerProps={{
        title: 'Search',
        showBackButton: false,
      }}
    >
      <Text>Search</Text>
      <Button label="small" size="sm" className="mr-2" />
    </Screen>
  );
}
