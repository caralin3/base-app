import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { forwardRef } from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import colors from './colors';
import { Modal } from './modal';
import BottomSheetKeyboardAwareScrollView from './modal-keyboard-aware-scroll-view';

interface ModalFormProps {
  children: React.ReactNode;
  /** Merged into the scroll view's content container, e.g. `{ gap: 16 }`. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  dismissible?: boolean;
  onLeftActionPress?: () => void;
  snapPoints?: string[];
  title?: string;
}

/**
 * Bottom sheet for forms. Content scrolls inside the sheet and keeps the
 * focused input above the keyboard, so callers should not add their own
 * scroll view.
 */
export const ModalForm = forwardRef<BottomSheetModal, ModalFormProps>(
  (
    {
      children,
      contentContainerStyle,
      dismissible = true,
      onLeftActionPress,
      title,
      snapPoints = ['70%'],
    },
    ref
  ) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <Modal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}
        title={title}
        dismissible={dismissible}
        onLeftActionPress={onLeftActionPress}
        showCloseButton={false}
      >
        <BottomSheetKeyboardAwareScrollView
          bottomOffset={24}
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetKeyboardAwareScrollView>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});
