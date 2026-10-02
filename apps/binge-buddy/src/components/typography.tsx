import React from 'react';

import { Title } from './title';
import { Text, View } from './ui';

export const Typography = () => {
  return (
    <>
      <Title text="Typography" />
      <View className="mb-4 flex-col">
        <Text size="3xl" weight="bold" className="tracking-tight">
          H1: Lorem ipsum dolor sit
        </Text>
        <Text size="2xl" weight="semibold">
          H2: Lorem ipsum dolor sit
        </Text>
        <Text size="xl" weight="semibold">
          H3: Lorem ipsum dolor sit
        </Text>
        <Text size="lg" weight="medium">
          H4: Lorem ipsum dolor sit
        </Text>
        <Text size="base">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque quasi
          aut, expedita tempore ratione quidem in, corporis quia minus et
          dolorem sunt temporibus iusto consequatur culpa. Omnis sequi debitis
          recusandae?
        </Text>

        <Text variant="muted" size="sm" className="mt-4">
          This is muted text for less important information
        </Text>

        <Text variant="accent" size="lg" weight="semibold" className="mt-2">
          This is accent text highlighting important content
        </Text>

        <Text variant="destructive" size="sm" className="mt-2">
          This is destructive text for error messages
        </Text>

        <Text variant="link" size="base" className="mt-2">
          This is link text with underline styling
        </Text>

        <Text align="center" size="lg" weight="medium" className="mt-4">
          This text is center aligned
        </Text>

        <Text align="right" variant="muted" size="sm" className="mt-2">
          This text is right aligned
        </Text>

        <Text size="xs" variant="muted" className="mt-4">
          Extra small text for fine print or metadata
        </Text>

        <Text numberOfLines={2} className="mt-4">
          This is ellipsized text: Lorem ipsum dolor sit amet consectetur,
          adipisicing elit. Cumque quasi aut, expedita tempore ratione quidem
          in, corporis quia minus et dolorem sunt temporibus iusto consequatur
          culpa. Omnis sequi debitis recusandae?
        </Text>

        <Text clipText className="mt-4">
          This is clipped text: Lorem ipsum dolor sit amet consectetur,
          adipisicing elit. Cumque quasi aut, e xpedita tempore ratione qu in,
          corporis quia minus et dolorem sunt t emporibus iusto consequatur
          adipisicing elit. Cumque quasi aut, e xpedita tempore ratione qu in,
          corporis quia minus et dolorem sunt t emporibus iusto consequatur
          culpa. Omnis sequi debitis recusandae?
        </Text>
      </View>
    </>
  );
};
