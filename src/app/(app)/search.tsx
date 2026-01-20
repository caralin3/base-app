import { Button, Text, View } from '@/components';

export default function Search() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Search</Text>
      <Button label="small" size="sm" className="mr-2" />
    </View>
  );
}
