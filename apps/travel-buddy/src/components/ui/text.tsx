import React, { useMemo, useState } from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { tv } from 'tailwind-variants';

const text = tv({
  base: 'font-inter',
  variants: {
    variant: {
      default: 'text-foreground dark:text-foreground-dark',
      muted: 'text-muted dark:text-muted-dark',
      accent: 'text-primary dark:text-primary-dark',
      destructive: 'text-danger dark:text-danger-dark',
      link: 'text-primary underline dark:text-primary-dark',
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
    transform: {
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
      none: 'normal-case',
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
const MAX_NUMBER_OF_LINES = 3;

interface Props extends TextVariants, TextProps {
  className?: string;
  clipText?: boolean;
  tx?: string;
}

export const Text = ({
  align,
  children,
  className,
  clipText,
  size,
  style,
  transform,
  tx,
  variant,
  weight,
  ...props
}: Props) => {
  const textStyle = useMemo(
    () => text({ variant, size, weight, align, transform, className }),
    [variant, size, weight, align, transform, className]
  );

  const nStyle = useMemo(
    () => StyleSheet.flatten([style]) as TextStyle,
    [style]
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [actualLineCount, setActualLineCount] = useState(0);
  const [isMeasured, setIsMeasured] = useState(false);

  const shouldShowToggle = actualLineCount > MAX_NUMBER_OF_LINES;
  const numberOfLines = isExpanded ? undefined : MAX_NUMBER_OF_LINES;

  if (clipText) {
    return (
      <View>
        {/* Hidden text to measure actual line count */}
        {!isMeasured && (
          <RNText
            className={textStyle}
            style={[nStyle, styles.hiddenText]}
            onTextLayout={(e) => {
              setActualLineCount(e.nativeEvent.lines.length);
              setIsMeasured(true);
            }}
            {...props}
          >
            {tx ? tx : children}
          </RNText>
        )}
        <RNText
          className={textStyle}
          style={nStyle}
          numberOfLines={numberOfLines}
          onPress={() => (shouldShowToggle ? setIsExpanded(!isExpanded) : null)}
          {...props}
        >
          {tx ? tx : children}
        </RNText>
        {shouldShowToggle && (
          <RNText
            className="text-primary dark:text-primary-dark"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </RNText>
        )}
      </View>
    );
  }

  return (
    <RNText className={textStyle} style={nStyle} {...props}>
      {tx ? tx : children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  hiddenText: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
});
