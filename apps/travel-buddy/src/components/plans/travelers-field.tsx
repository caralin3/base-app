import {
  Button,
  IconSymbol,
  Input,
  Text,
  useAppColors,
  View,
} from '@base-app/ui';
import { useState } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';
import { Pressable } from 'react-native';
import uuid from 'react-native-uuid';

import type { Traveler } from '@/lib/types/trips';

type TravelersInputProps = {
  label?: string;
  onChange: (travelers: Traveler[]) => void;
  value?: Traveler[];
};

export const TravelersInput = ({
  label = 'Travelers',
  onChange,
  value = [],
}: TravelersInputProps) => {
  const appColors = useAppColors();
  const [draft, setDraft] = useState('');

  const addTraveler = () => {
    const travelerName = draft.trim();
    if (!travelerName) return;
    onChange([...value, { id: uuid.v4() as string, name: travelerName }]);
    setDraft('');
  };

  const removeTraveler = (id: string) =>
    onChange(value.filter((traveler) => traveler.id !== id));

  return (
    <View className="gap-2">
      <View className="flex-row items-end gap-2">
        <View className="flex-1">
          <Input
            autoCapitalize="words"
            helpText="Who's coming? Used for voting on ideas."
            label={label}
            onChangeText={setDraft}
            onSubmitEditing={addTraveler}
            placeholder="Add a name"
            returnKeyType="done"
            value={draft}
          />
        </View>
        <View className="mb-8">
          <Button
            disabled={!draft.trim()}
            label="Add"
            onPress={addTraveler}
            variant="outline"
          />
        </View>
      </View>
      {value.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {value.map((traveler) => (
            <View
              key={traveler.id}
              className="flex-row items-center gap-2 rounded-full border border-border bg-background py-1 pl-3 pr-2 dark:border-border-dark dark:bg-background-dark"
            >
              <Text className="text-sm font-medium">{traveler.name}</Text>
              <Pressable
                accessibilityLabel={`Remove ${traveler.name}`}
                hitSlop={8}
                onPress={() => removeTraveler(traveler.id)}
              >
                <IconSymbol color={appColors.muted} name="xmark" size={14} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

type ControlledTravelersFieldProps<T extends FieldValues> = {
  control: Control<T>;
  label?: string;
  name: Path<T>;
};

// only used with react-hook-form
export function ControlledTravelersField<T extends FieldValues>({
  control,
  label,
  name,
}: ControlledTravelersFieldProps<T>) {
  const { field } = useController({ control, name });
  return (
    <TravelersInput
      label={label}
      onChange={field.onChange}
      value={field.value as Traveler[] | undefined}
    />
  );
}
