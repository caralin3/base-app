import { Link } from 'expo-router';

import { Text, View } from '@/components';

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/show/1" className="mt-4">
        <Text className="text-blue-500 underline">Show 1</Text>
      </Link>
      <Link href="/(groups)/favorites" className="mt-4">
        <Text className="text-blue-500 underline">Favorites</Text>
      </Link>
      <Link href="/(groups)/currently-watching" className="mt-4">
        <Text className="text-blue-500 underline">Currently Watching</Text>
      </Link>
    </View>
  );
}
