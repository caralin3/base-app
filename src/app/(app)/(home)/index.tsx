import { Button, Text, View } from '../../../components';
import { Env } from '../../../lib';

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
      <Button label="small" size="sm" className="mr-2" />
    </View>
  );
}
