import { Buttons } from '../components/buttons';
import { Colors } from '../components/colors';
import { Inputs } from '../components/inputs';
import { Typography } from '../components/typography';
import { FocusAwareStatusBar, ScrollView } from '../components/ui';

export default function Style() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <Typography />
        <Colors />
        <Buttons />
        <Inputs />
      </ScrollView>
    </>
  );
}
