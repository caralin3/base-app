import React from 'react';

import { Title } from './title';
import { Button, colors, IconButton, View } from './ui';

export const Buttons = () => {
  return (
    <>
      <Title text="Buttons" />
      <View>
        <View className="flex-row  flex-wrap">
          <Button label="small" size="sm" className="mr-2" />
          <Button
            label="small"
            loading
            size="sm"
            className="mr-2 min-w-[60px]"
          />
          <Button
            label="small"
            size="sm"
            variant="secondary"
            className="mr-2"
          />
          <Button label="small" size="sm" variant="outline" className="mr-2" />
          <Button
            label="small"
            size="sm"
            variant="destructive"
            className="mr-2"
          />
          <Button label="small" size="sm" variant="ghost" className="mr-2" />
          <Button label="small" size="sm" disabled className="mr-2" />
          <Button label="medium" className="mr-2" />
          <Button label="large" size="lg" disabled className="mr-2" />
        </View>
        <Button label="Default Button" />
        <Button label="Secondary Button" variant="secondary" />
        <Button label="Outline Button" variant="outline" />
        <Button label="Destructive Button" variant="destructive" />
        <Button label="Ghost Button" variant="ghost" />
        <Button label="Button" loading={true} />
        <Button label="Button" loading={true} variant="outline" />
        <Button label="Default Button Disabled" disabled />
        <Button
          label="Secondary Button Disabled"
          disabled
          variant="secondary"
        />
        <Title text="Icon Buttons" />
        <IconButton
          iconName="xmark.circle"
          size={24}
          color={colors.white}
          iconType="community"
        />
        <IconButton
          iconName="chevron.right"
          size={24}
          color={colors.white}
          label="View All"
        />
      </View>
    </>
  );
};
