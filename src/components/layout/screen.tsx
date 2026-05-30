import { type PropsWithChildren } from 'react';

import { colors, View } from '../ui';
import { Header } from './header';

interface ScreenProps extends PropsWithChildren {
  headerProps?: React.ComponentProps<typeof Header>;
}

export const Screen = ({ children, headerProps }: ScreenProps) => (
  <View
    style={{
      flex: 1,
    }}
  >
    <Header {...headerProps} />
    <View style={{ flex: 1, backgroundColor: colors.black }}>{children}</View>
  </View>
);
