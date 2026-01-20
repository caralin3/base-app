import { SafeAreaView } from '../ui';
import { Header } from './header';

interface ScreenProps {
  children: React.ReactNode;
  headerProps?: React.ComponentProps<typeof Header>;
}

export const Screen = ({ children, headerProps }: ScreenProps) => (
  <SafeAreaView style={{ flex: 1 }}>
    <Header {...headerProps} />
    {children}
  </SafeAreaView>
);
