/**
 * Modal
 * Dependencies:
 * - @gorhom/bottom-sheet.
 *
 * Props:
 * - All `BottomSheetModalProps` props.
 * - `title` (string | undefined): Optional title for the modal header.
 *
 * Usage Example:
 * import { Modal, useModal } from '@gorhom/bottom-sheet';
 *
 * function DisplayModal() {
 *   const { ref, present, dismiss } = useModal();
 *
 *   return (
 *     <View>
 *       <Modal
 *         snapPoints={['60%']} // optional
 *         title="Modal Title"
 *         ref={ref}
 *       >
 *         Modal Content
 *       </Modal>
 *     </View>
 *   );
 * }
 *
 */

import type {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
  SNAP_POINT_TYPE,
} from '@gorhom/bottom-sheet';
import { BottomSheetModal, useBottomSheet } from '@gorhom/bottom-sheet';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { useBottomSheetBackHandler } from '../../lib/hooks/use-bottom-sheet-back';
import { IconButton } from './icon-button';
import { Text } from './text';

type ModalProps = BottomSheetModalProps & {
  dismissible?: boolean;
  onLeftActionPress?: () => void;
  showCloseButton?: boolean;
  title?: string;
};

type ModalRef = React.ForwardedRef<BottomSheetModal>;

type ModalHeaderProps = {
  dismiss: () => void;
  dismissible?: boolean;
  onLeftActionPress?: () => void;
  showCloseButton?: boolean;
  title?: string;
};

export const useModal = () => {
  const ref = React.useRef<BottomSheetModal>(null);
  const present = React.useCallback((data?: any) => {
    ref.current?.present(data);
  }, []);
  const dismiss = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  return { ref, present, dismiss };
};

export const Modal = React.forwardRef(
  // eslint-disable-next-line max-lines-per-function
  (
    {
      snapPoints: _snapPoints = ['60%'],
      title,
      detached = false,
      dismissible = true,
      ...props
    }: ModalProps,
    ref: ModalRef
  ) => {
    const detachedProps = React.useMemo(
      () => getDetachedProps(detached),
      [detached]
    );
    const modal = useModal();
    const snapPoints = React.useMemo(() => _snapPoints, [_snapPoints]);
    const insets = useSafeAreaInsets();

    const { handleSheetPositionChange } = useBottomSheetBackHandler(modal.ref);

    React.useImperativeHandle(
      ref,
      () => (modal.ref.current as BottomSheetModal) || null
    );

    const renderHandleComponent = React.useCallback(
      () => (
        <>
          <View
            className={`${!title ? 'mb-8' : ''} mt-2 h-1 w-12 self-center rounded-lg bg-gray-400 dark:bg-gray-700`}
          />

          <ModalHeader
            title={title}
            onLeftActionPress={props.onLeftActionPress}
            dismiss={modal.dismiss}
            dismissible={dismissible}
            showCloseButton={props.showCloseButton}
          />
        </>
      ),
      [title, modal.dismiss, dismissible, props.showCloseButton]
    );

    // @TODO: Fix
    const handleChange = (
      index: number,
      position: number,
      type: SNAP_POINT_TYPE
    ) => {
      if (dismissible) {
        handleSheetPositionChange(index, position, type);
      }
    };

    return (
      <BottomSheetModal
        {...props}
        {...detachedProps}
        ref={modal.ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={props.backdropComponent || renderBackdrop}
        enableDynamicSizing={false}
        enablePanDownToClose={dismissible}
        handleComponent={renderHandleComponent}
        bottomInset={insets.bottom}
        // onChange={handleChange}
      />
    );
  }
);

/**
 * Custom Backdrop
 */

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomBackdrop = ({ style }: BottomSheetBackdropProps) => {
  const { close } = useBottomSheet();
  return (
    <AnimatedPressable
      // onPress={() => close()}
      entering={FadeIn.duration(50)}
      exiting={FadeOut.duration(20)}
      style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]}
    />
  );
};

export const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <CustomBackdrop {...props} />
);

/**
 *
 * @param detached
 * @returns
 *
 * @description
 * In case the modal is detached, we need to add some extra props to the modal to make it look like a detached modal.
 */

const getDetachedProps = (detached: boolean) => {
  if (detached) {
    return {
      detached: true,
      bottomInset: 46,
      style: { marginHorizontal: 16, overflow: 'hidden' },
    } as Partial<BottomSheetModalProps>;
  }
  return {} as Partial<BottomSheetModalProps>;
};

/**
 * ModalHeader
 */

const ModalHeader = React.memo(
  ({
    dismiss,
    dismissible = true,
    onLeftActionPress,
    showCloseButton = true,
    title,
  }: ModalHeaderProps) => {
    return (
      <>
        {!!title && (
          <View
            className={`flex-row ${Platform.select({
              ios: 'p-6 pb-4',
              android: 'px-3 pt-6 pb-0',
            })}`}
          >
            <View className="flex-1 flex-row items-center justify-between">
              {onLeftActionPress ? (
                <IconButton
                  icon="chevron.left"
                  size={Platform.select({ ios: 28, android: 40 })}
                  onPress={onLeftActionPress}
                />
              ) : (
                <View className="size-[24px]" />
              )}
              <Text className="text-center text-[20px] font-bold text-[#26313D] dark:text-white">
                {title}
              </Text>
              <View className="size-[24px]" />
            </View>
          </View>
        )}
        {showCloseButton && dismissible && <CloseButton close={dismiss} />}
      </>
    );
  }
);

const CloseButton = ({ close }: { close: () => void }) => {
  return (
    <Pressable
      onPress={close}
      className="absolute right-3 top-3 size-[24px] items-center justify-center "
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      accessibilityLabel="close modal"
      accessibilityRole="button"
      accessibilityHint="closes the modal"
    >
      <Svg
        className="fill-neutral-300 dark:fill-white"
        width={24}
        height={24}
        fill="none"
        viewBox="0 0 24 24"
      >
        <Path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293Z" />
      </Svg>
    </Pressable>
  );
};
