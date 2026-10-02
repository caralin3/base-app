import { Text, View } from '@base-app/ui';
import React from 'react';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export const ItemsContainer = ({ children, title }: Props) => {
  return (
    <>
      {!!title && <Text className="p-4 pt-8 text-xl font-bold" tx={title} />}
      {<View>{children}</View>}
    </>
  );
};
