import { Text, View } from 'react-native';
import { Env } from '../lib/env';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>{Env.VERSION} - Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
