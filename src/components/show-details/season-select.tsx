import {
  BottomSheetFlatList,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { colors, Modal, Text, useModal, View } from '../ui';
import { CaretDown, Check } from '../ui/icons';

export type OptionType = { label: string; value: string | number };

type OptionsProps = {
  options: OptionType[];
  onSelect: (option: OptionType) => void;
  testID?: string;
  title?: string;
  value?: string | number;
};

function keyExtractor(item: OptionType) {
  return `select-item-${item.value}`;
}

const Options = forwardRef<BottomSheetModal, OptionsProps>(
  ({ options, onSelect, value, testID, title }, ref) => {
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
        snapPoints={['90%']}
        backgroundStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.67)',
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
      <Pressable style={optionStyles.container} {...props}>
        <Text size="lg" style={optionStyles.label}>
          {label}
        </Text>
        {selected && <Check />}
      </Pressable>
    );
  }
);

export interface SeasonSelectProps {
  keyValue?: 'label' | 'value';
  label?: string;
  options?: OptionType[];
  optionsTitle?: string;
  onSelect?: (value: string | number) => void;
  placeholder?: string;
  testID?: string;
  value?: string | number;
}

export const SeasonSelect = (props: SeasonSelectProps) => {
  const {
    keyValue = 'label',
    label,
    onSelect,
    options = [],
    optionsTitle,
    placeholder = 'Select...',
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

  const textValue = useMemo(() => {
    const selectedOption = options?.find((t) => t.value === value);
    return selectedOption ? selectedOption[keyValue] : placeholder;
  }, [value, options, placeholder, keyValue]);

  return (
    <>
      <View style={selectStyles.container}>
        {label && (
          <Text
            testID={testID ? `${testID}-label` : undefined}
            style={selectStyles.label}
          >
            {label}
          </Text>
        )}
        <Pressable
          style={selectStyles.input}
          onPress={modal.present}
          testID={testID ? `${testID}-trigger` : undefined}
        >
          <View style={selectStyles.inputValueContainer}>
            <Text style={selectStyles.inputValue}>{textValue}</Text>
          </View>
          <CaretDown />
        </Pressable>
      </View>
      <Options
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

const optionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  label: {
    color: colors.white,
  },
});

const selectStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 4,
  },
  input: {
    alignItems: 'center',
    backgroundColor: colors.charcoal[300],
    borderRadius: 6,
    color: colors.white,
    flexDirection: 'row',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '500',
    justifyContent: 'center',
    lineHeight: 20,
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputValueContainer: {
    flex: 1,
  },
  inputValue: {
    color: colors.white,
  },
});
