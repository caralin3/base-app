import { Link, type LinkProps } from 'expo-router';
import React from 'react';

import { Pressable, Text, View } from './ui';

interface CardProps {
  children: React.ReactNode;
  href: LinkProps['href'];
  title?: string;
}

export const Card = ({ children, href, title }: CardProps) => {
  return (
    <Link href={href} asChild>
      <Pressable>
        <View className="m-2 overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900">
          {/* <Image
            className="h-56 w-full overflow-hidden rounded-t-xl"
            contentFit="cover"
            source={{
              uri: images[Math.floor(Math.random() * images.length)],
            }}
          /> */}

          <View className={`p-4 ${title ? 'pt-1' : ''}`}>
            {!!title && <Text className="py-3 text-2xl ">{title}</Text>}
            <View>{children}</View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
