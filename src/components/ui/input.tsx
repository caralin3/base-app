import React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput as NTextInput, View } from 'react-native';
import { tv } from 'tailwind-variants';

import { useAppColors } from '@/theme/use-app-colors';

import { Text } from './text';

const inputTv = tv({
  slots: {
    container: 'mb-2',
    label: 'mb-1 text-lg text-foreground dark:text-foreground-dark',
    input:
      'mt-0 rounded-xl border-[0.5px] border-border bg-white p-4 font-inter text-base font-medium leading-5 text-foreground dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark',
  },
  variants: {
    focused: {
      true: {
        input: 'border-primary dark:border-primary-dark',
      },
    },
    error: {
      true: {
        input: 'border-danger dark:border-danger-dark',
        label: 'text-danger dark:text-danger-dark',
      },
    },
    disabled: {
      true: {
        input: 'bg-surface opacity-50 dark:bg-surface-dark',
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface NInputProps extends TextInputProps {
  containerStyles?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  label?: string;
  required?: boolean;
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps, InputControllerType<T> {}

export const Input = React.forwardRef<NTextInput, NInputProps>((props, ref) => {
  const {
    containerStyles,
    label,
    error,
    helpText,
    required = false,
    testID,
    ...inputProps
  } = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const styles = React.useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocussed,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocussed, props.disabled]
  );
  const colors = useAppColors();

  return (
    <View className={containerStyles ?? styles.container()}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
        >
          {label}
          {required && (
            <Text className="text-[16px] text-danger dark:text-danger-dark">
              *
            </Text>
          )}
        </Text>
      )}
      <NTextInput
        testID={testID}
        ref={ref}
        placeholderTextColor={colors.muted}
        className={styles.input()}
        onBlur={onBlur}
        onFocus={onFocus}
        {...inputProps}
        style={StyleSheet.flatten([{ textAlign: 'left' }, inputProps.style])}
      />
      {error ? (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="mt-1 text-sm text-danger dark:text-danger-dark"
        >
          {error}
        </Text>
      ) : (
        !!helpText && (
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {helpText}
          </Text>
        )
      )}
    </View>
  );
});

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
