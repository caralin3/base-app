import React from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { StyleSheet, Text as NNText } from 'react-native';
import { tv } from 'tailwind-variants';

const text = tv({
  base: 'font-inter',
  variants: {
    variant: {
      default: 'text-white',
      muted: 'text-neutral-500',
      accent: 'text-primary-600',
      destructive: 'text-red-500',
      link: 'text-blue-600 underline',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
    weight: 'normal',
    align: 'left',
  },
});

type TextVariants = Omit<
  NonNullable<Parameters<typeof text>[0]>,
  'class' | 'className'
>;

interface Props extends TextVariants, TextProps {
  className?: string;
  tx?: string;
}

export const Text = ({
  variant,
  size,
  weight,
  align,
  className,
  style,
  tx,
  children,
  ...props
}: Props) => {
  const textStyle = React.useMemo(
    () => text({ variant, size, weight, align, className }),
    [variant, size, weight, align, className]
  );

  const nStyle = React.useMemo(
    () => StyleSheet.flatten([style]) as TextStyle,
    [style]
  );

  return (
    <NNText className={textStyle} style={nStyle} {...props}>
      {tx ? tx : children}
    </NNText>
  );
};
