import { useEffect, useState } from 'react';
import { StyleSheet, type TextInputProps } from 'react-native';

import { colors, IconButton, IconSymbol, Input, View } from '../ui';

interface SearchInputProps {
  onBlur?: TextInputProps['onBlur'];
  onChangeText: (text: string) => void;
  onFocus?: TextInputProps['onFocus'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  value: string;
}

export const SearchInput = ({
  onBlur,
  onChangeText,
  onFocus,
  onSubmitEditing,
  value,
}: SearchInputProps) => {
  const [showClear, setShowClear] = useState(false);
  const color = colors.white;

  useEffect(() => {
    setShowClear(!!value);
  }, [value]);

  const handleChangeText = (text: string) => {
    if (!showClear && text) {
      setShowClear(true);
    } else if (showClear && !text) {
      setShowClear(false);
    }
    onChangeText(text);
  };

  return (
    <View style={styles.container}>
      <IconSymbol
        name="magnifyingglass"
        style={styles.searchIcon}
        color={color}
        size={22}
      />
      <Input
        style={styles.input}
        value={value}
        onBlur={onBlur}
        onChangeText={handleChangeText}
        onFocus={onFocus}
        onSubmitEditing={onSubmitEditing}
        autoFocus
        enterKeyHint="search"
        placeholder="Search for shows by name"
      />
      <IconButton
        iconName="xmark.circle"
        size={24}
        color={color}
        iconType="community"
        onPress={() => onChangeText('')}
        style={StyleSheet.flatten([
          styles.clearIcon,
          !showClear ? styles.hide : {},
        ])}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  hide: {
    display: 'none',
  },
  searchIcon: {
    left: 10,
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  input: {
    paddingLeft: 40,
  },
});
