import { useState } from 'react';

import {
  Buttons,
  Colors,
  IconPopupMenu,
  Inputs,
  ProgressBar,
  Screen,
  ScrollView,
  Skeleton,
  Text,
  Title,
  Typography,
  View,
} from '@/components';

export default function Style() {
  const [menuAction, setMenuAction] = useState('No action selected');

  return (
    <Screen headerProps={{ title: 'Style' }}>
      <ScrollView className="px-4">
        <Typography />
        <Colors />
        <Buttons />
        <Title text="Progress bar" />
        <ProgressBar initialProgress={50} />
        <Title text="Icon Popup Menu" />
        <View className="p-4">
          <View className="flex-row items-center justify-between rounded-lg border border-charcoal-400 bg-charcoal-500 p-4">
            <View className="flex-1 pr-3">
              <Text size="lg" weight="semibold">
                Menu Trigger Example
              </Text>
              <Text>{menuAction}</Text>
            </View>
            <IconPopupMenu
              iconName="gearshape"
              items={[
                {
                  iconName: 'pencil',
                  label: 'Edit',
                  onPress: () => setMenuAction('Edit tapped'),
                },
                {
                  iconName: 'square.and.arrow.up',
                  label: 'Share',
                  onPress: () => setMenuAction('Share tapped'),
                },
                {
                  destructive: true,
                  iconName: 'trash',
                  label: 'Delete',
                  onPress: () => setMenuAction('Delete tapped'),
                },
              ]}
            />
          </View>
        </View>
        <Inputs />
        <Title text="Skeletons" />
        <View className="p-4">
          <Skeleton />
          <Skeleton variant="circular" className="mt-4 size-16" />
        </View>
      </ScrollView>
    </Screen>
  );
}
