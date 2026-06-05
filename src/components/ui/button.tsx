import React from 'react';
import type { PressableProps, View } from 'react-native';
import { ActivityIndicator, Pressable } from 'react-native';
import { tv } from 'tailwind-variants';

import { Text } from './text';

const button = tv({
  slots: {
    container:
      'my-2 flex flex-row items-center justify-center rounded-3xl px-4',
    label: 'font-inter text-base font-semibold',
    indicator: 'h-6 text-foreground dark:text-foreground-dark',
  },
  variants: {
    variant: {
      default: {
        container: 'bg-primary dark:bg-primary-dark',
        label: 'text-background dark:text-background-dark',
        indicator: 'text-background dark:text-background-dark',
      },
      secondary: {
        container: 'bg-foreground dark:bg-foreground-dark',
        label: 'text-background dark:text-background-dark',
        indicator: 'text-background dark:text-background-dark',
      },
      outline: {
        container: 'border border-border dark:border-border-dark',
        label: 'text-foreground dark:text-foreground-dark',
        indicator: 'text-foreground dark:text-foreground-dark',
      },
      destructive: {
        container: 'bg-danger dark:bg-danger-dark',
        label: 'text-background dark:text-background-dark',
        indicator: 'text-background dark:text-background-dark',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-foreground underline dark:text-foreground-dark',
        indicator: 'text-foreground dark:text-foreground-dark',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-primary dark:text-primary-dark',
        indicator: 'text-primary dark:text-primary-dark',
      },
    },
    size: {
      default: {
        container: 'h-12 px-4 py-1',
        label: 'text-base font-bold',
      },
      lg: {
        container: 'h-15 px-8 py-2',
        label: 'text-xl font-bold',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
      },
      icon: { container: 'size-9' },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-300',
        label: 'text-neutral-600 dark:text-neutral-600',
        indicator: 'text-neutral-400 dark:text-neutral-400',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = Omit<
  NonNullable<Parameters<typeof button>[0]>,
  'class' | 'className'
>;
interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size]
    );

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {loading ? (
              <ActivityIndicator
                size="small"
                className={styles.indicator()}
                testID={testID ? `${testID}-activity-indicator` : undefined}
              />
            ) : (
              <Text
                testID={testID ? `${testID}-label` : undefined}
                className={styles.label({ className: textClassName })}
              >
                {text}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  }
);
