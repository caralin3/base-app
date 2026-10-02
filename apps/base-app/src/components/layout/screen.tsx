import { type PropsWithChildren } from 'react';

import { View } from '../ui';
import { Header } from './header';

interface ScreenProps extends PropsWithChildren {
  headerProps?: React.ComponentProps<typeof Header>;
  showHeader?: boolean;
}

export const Screen = ({
  children,
  headerProps,
  showHeader = true,
}: ScreenProps) => (
  <View
    style={{
      flex: 1,
    }}
  >
    {showHeader && <Header {...headerProps} />}
    <View className="flex-1 bg-background dark:bg-background-dark">
      {children}
    </View>
  </View>
);
