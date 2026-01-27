import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  MaterialTabBar,
  MaterialTabItem,
  type TabBarProps,
  Tabs,
} from 'react-native-collapsible-tab-view';

import { colors } from './ui';

interface Tab {
  name: string;
  content: React.ReactElement;
}

interface TabsViewProps {
  header: ((props: TabBarProps) => React.ReactElement | null) | undefined;
  tabs: Tab[];
}

export const TabsView = ({ header, tabs }: TabsViewProps) => {
  const TabBar = (props: TabBarProps) => (
    <MaterialTabBar
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{ backgroundColor: colors.black }}
      labelStyle={styles.labelStyle}
      indicatorStyle={{ backgroundColor: colors.primary[600] }}
      activeColor={colors.white}
      inactiveColor={colors.neutral[500]}
      // remove auto uppercase
      getLabelText={(name) => name}
      TabItemComponent={(itemProps) => {
        return (
          <MaterialTabItem
            {...itemProps}
            labelStyle={[
              styles.labelStyle,
              {
                width: Dimensions.get('window').width / tabs.length,
              },
            ]}
          />
        );
      }}
    />
  );

  return (
    <Tabs.Container renderHeader={header} renderTabBar={TabBar}>
      {tabs.map((tab) => (
        <Tabs.Tab key={tab.name} name={tab.name}>
          {tab.content}
        </Tabs.Tab>
      ))}
    </Tabs.Container>
  );
};

export const TabsScrollView = Tabs.ScrollView;
export const TabsFlatList = Tabs.FlatList;

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    margin: 0,
    paddingVertical: 16,
    textAlign: 'center',
  },
});
