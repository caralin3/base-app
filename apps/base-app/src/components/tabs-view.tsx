import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  MaterialTabBar,
  MaterialTabItem,
  type TabBarProps,
  Tabs,
} from 'react-native-collapsible-tab-view';

import { useAppColors } from '@/theme/use-app-colors';

interface Tab {
  name: string;
  content: React.ReactElement;
}

interface TabsViewProps {
  header: ((props: TabBarProps) => React.ReactElement | null) | undefined;
  tabs: Tab[];
}

export const TabsView = ({ header, tabs }: TabsViewProps) => {
  const colors = useAppColors();

  const TabBar = (props: TabBarProps) => (
    <MaterialTabBar
      {...props}
      scrollEnabled={false}
      style={[styles.tabBar, { backgroundColor: colors.background }]}
      contentContainerStyle={{ backgroundColor: colors.background }}
      labelStyle={styles.labelStyle}
      indicatorStyle={{ backgroundColor: colors.primary }}
      activeColor={colors.foreground}
      inactiveColor={colors.muted}
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
    <Tabs.Container
      headerContainerStyle={[
        styles.headerContainer,
        { backgroundColor: 'transparent', overflow: 'visible' },
      ]}
      renderHeader={header}
      renderTabBar={TabBar}
    >
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
  headerContainer: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  tabBar: {
    marginTop: -1,
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    margin: 0,
    paddingVertical: 16,
    textAlign: 'center',
  },
});
