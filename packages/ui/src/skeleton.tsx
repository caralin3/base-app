import { useEffect } from 'react';
import {
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

const skeleton = tv({
  base: 'bg-neutral-400',
  variants: {
    variant: {
      rectangular: '',
      rounded: 'rounded-md',
      circular: 'rounded-full',
      text: 'h-5 rounded-full',
    },
  },
  defaultVariants: {
    variant: 'rounded',
  },
});

type SkeletonVariants = Omit<
  NonNullable<Parameters<typeof skeleton>[0]>,
  'class' | 'className'
>;

interface SkeletonProps extends SkeletonVariants {
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  width?: DimensionValue;
  className?: string;
}

export const Skeleton = ({
  height,
  style,
  variant,
  width,
  className,
}: SkeletonProps) => {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  return (
    <Animated.View
      className={skeleton({ variant, className })}
      style={[
        animatedStyle,
        {
          height: variant === 'text' ? undefined : (height ?? 40),
          width: variant === 'circular' ? (width ?? 40) : (width ?? '100%'),
        },
        style,
      ]}
    />
  );
};
