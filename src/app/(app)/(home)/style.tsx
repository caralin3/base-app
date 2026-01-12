import {
  Buttons,
  Colors,
  FocusAwareStatusBar,
  Inputs,
  ScrollView,
  Typography,
} from '../../../components';

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
