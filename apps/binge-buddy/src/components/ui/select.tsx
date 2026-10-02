import {
  BottomSheetFlatList,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Pressable, type PressableProps, View } from 'react-native';
import { tv } from 'tailwind-variants';

import colors from './colors';
import { CaretDown, Check } from './icons';
import type { InputControllerType } from './input';
import { Modal, useModal } from './modal';
import { Text } from './text';

const selectTv = tv({
  slots: {
    container: 'mb-4 flex-1',
    label: 'mb-1 text-lg text-white',
    input:
      'mt-0 flex-row items-center justify-center rounded-md bg-charcoal-300 p-4 font-inter text-lg font-medium leading-5 text-white',
    inputValue: 'text-white',
  },
  variants: {
    focused: {
      true: {
        input: 'border-neutral-300 dark:border-neutral-700',
      },
    },
    error: {
      true: {
        input: 'border-danger-600',
        label: 'text-danger-600 dark:text-danger-600',
        inputValue: 'text-danger-600',
      },
    },
    disabled: {
      true: {
        input: 'bg-neutral-100 opacity-50 dark:bg-neutral-700',
      },
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
    background: 'default',
  },
});

export type OptionType = { label: string; value: string | number };

type OptionsProps = {
  background?: 'default' | 'neutral' | 'dark' | 'transparent';
  defaultSnapPoints?: string[];
  options: OptionType[];
  onSelect: (option: OptionType) => void;
  testID?: string;
  title?: string;
  value?: string | number;
};

function keyExtractor(item: OptionType) {
  return `select-item-${item.value}`;
}

export const Options = forwardRef<BottomSheetModal, OptionsProps>(
  (
    {
      background = 'default',
      defaultSnapPoints,
      options,
      onSelect,
      value,
      testID,
      title,
    },
    ref
  ) => {
    const maxHeight = 400;
    const height = Math.min(options.length * 70 + 100, maxHeight);
    const snapPoints = useMemo(() => [height], [height]);

    const backgroundColor = useMemo(() => {
      switch (background) {
        case 'neutral':
          return colors.neutral[800];
        case 'dark':
          return colors.neutral[900];
        case 'transparent':
          return 'rgba(0, 0, 0, 0.67)';
        default:
          return colors.charcoal[300];
      }
    }, [background]);

    const renderSelectItem = useCallback(
      ({ item }: { item: OptionType }) => (
        <Option
          key={`select-item-${item.value}`}
          label={item.label}
          selected={value === item.value}
          onPress={() => onSelect(item)}
          testID={testID ? `${testID}-item-${item.value}` : undefined}
        />
      ),
      [onSelect, value, testID]
    );

    return (
      <Modal
        ref={ref}
        index={0}
        snapPoints={defaultSnapPoints ?? snapPoints}
        backgroundStyle={{
          backgroundColor,
        }}
        title={title}
      >
        <BottomSheetFlatList
          data={options}
          keyExtractor={keyExtractor}
          renderItem={renderSelectItem}
          testID={testID ? `${testID}-modal` : undefined}
          estimatedItemSize={52}
        />
      </Modal>
    );
  }
);

const Option = memo(
  ({
    label,
    selected = false,
    ...props
  }: PressableProps & {
    selected?: boolean;
    label: string;
  }) => {
    return (
      <Pressable className="flex-row items-center gap-2 p-4" {...props}>
        <Text className="text-white">{label}</Text>
        {selected && <Check />}
      </Pressable>
    );
  }
);

export interface SelectProps {
  background?: 'default' | 'neutral' | 'dark' | 'transparent';
  keyValue?: 'label' | 'value';
  defaultSnapPoints?: string[];
  disabled?: boolean;
  error?: string;
  helpText?: string;
  label?: string;
  options?: OptionType[];
  optionsTitle?: string;
  onSelect?: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  testID?: string;
  value?: string | number;
}
interface ControlledSelectProps<T extends FieldValues>
  extends SelectProps, InputControllerType<T> {}

export const Select = (props: SelectProps) => {
  const {
    background = 'default',
    defaultSnapPoints,
    disabled = false,
    error,
    helpText,
    keyValue = 'label',
    label,
    onSelect,
    options = [],
    optionsTitle,
    placeholder = 'Select...',
    required = false,
    testID,
    value,
  } = props;
  const modal = useModal();

  const onSelectOption = useCallback(
    (option: OptionType) => {
      onSelect?.(option.value);
      modal.dismiss();
    },
    [modal, onSelect]
  );

  const styles = useMemo(
    () =>
      selectTv({
        error: Boolean(error),
        disabled,
      }),
    [error, disabled]
  );

  const textValue = useMemo(() => {
    const selectedOption = options?.find((t) => t.value === value);
    return selectedOption ? selectedOption[keyValue] : placeholder;
  }, [value, options, placeholder, keyValue]);

  return (
    <>
      <View className={styles.container()}>
        {label && (
          <Text
            testID={testID ? `${testID}-label` : undefined}
            className={styles.label()}
          >
            {label}
            {required && (
              <Text className="text-[16px] text-danger-600 dark:text-danger-600">
                *
              </Text>
            )}
          </Text>
        )}
        <Pressable
          className={styles.input()}
          disabled={disabled}
          onPress={modal.present}
          testID={testID ? `${testID}-trigger` : undefined}
        >
          <View className="flex-1">
            <Text className={styles.inputValue()}>{textValue}</Text>
          </View>
          <CaretDown />
        </Pressable>
        {error ? (
          <Text
            testID={`${testID}-error`}
            className="mt-1 text-sm text-danger-300 dark:text-danger-600"
          >
            {error}
          </Text>
        ) : (
          !!helpText && (
            <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {helpText}
            </Text>
          )
        )}
      </View>
      <Options
        background={background}
        defaultSnapPoints={defaultSnapPoints}
        testID={testID}
        ref={modal.ref}
        options={options}
        onSelect={onSelectOption}
        value={value}
        title={optionsTitle}
      />
    </>
  );
};

// only used with react-hook-form
export function ControlledSelect<T extends FieldValues>(
  props: ControlledSelectProps<T>
) {
  const { name, control, rules, onSelect: onNSelect, ...selectProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  const onSelect = useCallback(
    (value: string | number) => {
      field.onChange(value);
      onNSelect?.(value);
    },
    [field, onNSelect]
  );
  return (
    <Select
      onSelect={onSelect}
      value={field.value}
      error={fieldState.error?.message}
      {...selectProps}
    />
  );
}
