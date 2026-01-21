import { type PropsWithChildren } from 'react';

import { SafeAreaView, View } from '../ui';
import { Header } from './header';

interface ScreenProps extends PropsWithChildren {
  headerProps?: React.ComponentProps<typeof Header>;
}

export const Screen = ({ children, headerProps }: ScreenProps) => (
  <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <Header {...headerProps} />
    <View style={{ flex: 1 }}>{children}</View>
  </SafeAreaView>
);
