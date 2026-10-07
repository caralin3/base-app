import type * as DateTimePickerModule from '@react-native-community/datetimepicker';
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Platform, Pressable, View } from 'react-native';

import { IconSymbol } from './icon-symbol';
import { Input, type InputControllerType } from './input';
import { Text } from './text';
import { useAppColors } from './theme';

export type DateTimeInputMode = 'date' | 'time' | 'datetime';

type PickerModule = typeof DateTimePickerModule;

/**
 * Loaded lazily so apps (or dev-client binaries) without the native module
 * still run; the input falls back to typing the value instead.
 */
let pickerModule: PickerModule | null | undefined;
const getPicker = () => {
  if (pickerModule === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      pickerModule = require('@react-native-community/datetimepicker');
    } catch {
      console.warn(
        'DateTimeInput: @react-native-community/datetimepicker is not available in this build. Rebuild the native app to enable the picker.'
      );
      pickerModule = null;
    }
  }
  return pickerModule;
};

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Values are stored as "floating" local wall-clock strings (no timezone offset)
 * so a 7:00 PM plan always reads 7:00 PM, wherever the device currently is.
 * - date: yyyy-MM-dd
 * - time / datetime: yyyy-MM-ddTHH:mm
 */
export const toDateTimeValue = (date: Date, mode: DateTimeInputMode) => {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (mode === 'date') return day;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const fromDateTimeValue = (value?: string) => {
  if (!value) return undefined;
  // Date-only strings are parsed as UTC by `new Date`, so build them locally.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3])
      )
    : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatDisplay = (date: Date, mode: DateTimeInputMode) => {
  const dateLabel = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
    year: 'numeric',
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  if (mode === 'date') return dateLabel;
  if (mode === 'time') return timeLabel;
  return `${dateLabel} · ${timeLabel}`;
};

export interface DateTimeInputProps {
  /** Date used when the picker opens with no value set. */
  defaultPickerDate?: Date;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  label?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  minuteInterval?: 1 | 5 | 10 | 15 | 30;
  mode?: DateTimeInputMode;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  testID?: string;
  value?: string;
}

export const DateTimeInput = ({
  defaultPickerDate,
  disabled = false,
  error,
  helpText,
  label,
  maximumDate,
  minimumDate,
  minuteInterval = 5,
  mode = 'datetime',
  onChange,
  placeholder = 'Not set',
  required = false,
  testID,
  value,
}: DateTimeInputProps) => {
  const colors = useAppColors();
  const picker = Platform.OS === 'web' ? null : getPicker();
  const date = fromDateTimeValue(value);
  const initialDate = date ?? defaultPickerDate ?? minimumDate ?? new Date();

  const emit = (next: Date) => onChange(toDateTimeValue(next, mode));

  const openAndroidPicker = () => {
    if (!picker) return;
    const { DateTimePickerAndroid } = picker;
    const openTime = (base: Date) =>
      DateTimePickerAndroid.open({
        is24Hour: false,
        mode: 'time',
        onValueChange: (_event, selected) => emit(selected),
        value: base,
      });

    if (mode === 'time') {
      openTime(initialDate);
      return;
    }

    DateTimePickerAndroid.open({
      maximumDate,
      minimumDate,
      mode: 'date',
      onValueChange: (_event, selected) => {
        if (mode === 'datetime') {
          const withTime = new Date(selected);
          withTime.setHours(initialDate.getHours(), initialDate.getMinutes());
          openTime(withTime);
        } else {
          emit(selected);
        }
      },
      value: initialDate,
    });
  };

  if (!picker) {
    return (
      <Input
        disabled={disabled}
        error={error}
        helpText={helpText}
        label={label}
        onChangeText={onChange}
        placeholder={mode === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'}
        required={required}
        testID={testID}
        value={value ?? ''}
      />
    );
  }

  return (
    <View className="mb-2">
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={
            error
              ? 'mb-1 text-lg text-danger dark:text-danger-dark'
              : 'mb-1 text-lg text-foreground dark:text-foreground-dark'
          }
        >
          {label}
          {required && (
            <Text className="text-[16px] text-danger dark:text-danger-dark">
              *
            </Text>
          )}
        </Text>
      )}
      <View
        className={`min-h-[54px] flex-row items-center gap-2 rounded-xl border-[0.5px] bg-white px-4 py-2 dark:bg-surface-dark ${
          error
            ? 'border-danger dark:border-danger-dark'
            : 'border-border dark:border-border-dark'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <IconSymbol color={colors.muted} name="calendar" size={20} />
        {Platform.OS === 'ios' && date ? (
          <View className="flex-1 flex-row">
            <picker.default
              accentColor={colors.primary}
              disabled={disabled}
              display="compact"
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              minuteInterval={minuteInterval}
              mode={mode}
              onValueChange={(_event, selected) => emit(selected)}
              testID={testID}
              value={date}
            />
          </View>
        ) : (
          <Pressable
            className="flex-1 py-2"
            disabled={disabled}
            onPress={() =>
              Platform.OS === 'ios' ? emit(initialDate) : openAndroidPicker()
            }
            testID={testID ? `${testID}-trigger` : undefined}
          >
            <Text
              className={
                date
                  ? 'text-base font-medium text-foreground dark:text-foreground-dark'
                  : 'text-base text-muted dark:text-muted-dark'
              }
            >
              {date ? formatDisplay(date, mode) : placeholder}
            </Text>
          </Pressable>
        )}
        {date && !disabled && !required ? (
          <Pressable
            accessibilityLabel={`Clear ${label ?? 'date'}`}
            hitSlop={8}
            onPress={() => onChange('')}
            testID={testID ? `${testID}-clear` : undefined}
          >
            <IconSymbol color={colors.muted} name="xmark" size={18} />
          </Pressable>
        ) : null}
      </View>
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
};

interface ControlledDateTimeInputProps<T extends FieldValues>
  extends
    Omit<DateTimeInputProps, 'onChange' | 'value'>,
    InputControllerType<T> {}

// only used with react-hook-form
export function ControlledDateTimeInput<T extends FieldValues>(
  props: ControlledDateTimeInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;
  const { field, fieldState } = useController({ control, name, rules });

  return (
    <DateTimeInput
      {...inputProps}
      error={fieldState.error?.message}
      onChange={field.onChange}
      value={(field.value as string) || ''}
    />
  );
}
