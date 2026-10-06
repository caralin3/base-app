import {
  Button,
  DateTimeInput,
  ModalForm,
  Text,
  useModal,
  View,
} from '@base-app/ui';
import { useMemo, useState } from 'react';

import { nowIso } from '@/components/plans/form-utils';
import {
  type useTripPlans,
  useUpdateActivityMutation,
  useUpdateEntertainmentMutation,
  useUpdateFoodMutation,
  useUpdateShoppingMutation,
} from '@/lib/hooks';
import { placeTypeOptions } from '@/lib/static-data';
import type { Traveler, Trip } from '@/lib/types/trips';
import {
  formatFullAddress,
  type Idea,
  nextVote,
  rankIdeas,
  setVote,
} from '@/lib/utils';

import { IdeaCard } from './idea-card';

type TripPlans = ReturnType<typeof useTripPlans>['plans'];

type IdeasListProps = {
  isLoading?: boolean;
  onAddIdea: () => void;
  plans: TripPlans;
  trip: Trip;
  userId?: string;
};

export const IdeasList = ({
  isLoading = false,
  onAddIdea,
  plans,
  trip,
  userId,
}: IdeasListProps) => {
  const travelers = useMemo(() => trip.travelers ?? [], [trip.travelers]);
  const updateMutations = {
    activity: useUpdateActivityMutation(userId),
    entertainment: useUpdateEntertainmentMutation(userId),
    food: useUpdateFoodMutation(userId),
    shopping: useUpdateShoppingMutation(userId),
  };
  const scheduleModal = useModal();
  const [scheduling, setScheduling] = useState<Idea>();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const ideasByType = useMemo(() => {
    const byType = {
      activity: plans.activities,
      entertainment: plans.entertainment,
      food: plans.food,
      shopping: plans.shopping,
    };
    return placeTypeOptions
      .map(({ label, value }) => ({
        ideas: rankIdeas(
          byType[value]
            .filter((place) => place.status === 'idea')
            .map((place) => ({ ...place, placeType: value })),
          travelers
        ),
        label,
        value,
      }))
      .filter((group) => group.ideas.length);
  }, [plans, travelers]);

  const stay = plans.lodging[0];
  const stayAddress = stay ? formatFullAddress(stay.address) : undefined;

  const vote = (idea: Idea, traveler: Traveler) =>
    updateMutations[idea.placeType].mutate({
      data: {
        updatedAt: nowIso(),
        votes: setVote(
          idea.votes,
          traveler.id,
          nextVote(idea.votes?.[traveler.id])
        ),
      },
      id: idea.id,
    });

  const openSchedule = (idea: Idea) => {
    setScheduling(idea);
    setStart(`${trip.startDate}T10:00`);
    setEnd('');
    scheduleModal.present();
  };

  const saveSchedule = async () => {
    if (!scheduling || !start) return;
    await updateMutations[scheduling.placeType].mutateAsync({
      data: {
        datetime: start,
        endDatetime: end,
        status: 'planned',
        updatedAt: nowIso(),
      },
      id: scheduling.id,
    });
    scheduleModal.dismiss();
    setScheduling(undefined);
  };

  const endIsBeforeStart =
    Boolean(start && end) &&
    new Date(end).getTime() <= new Date(start).getTime();

  return (
    <View className="gap-6">
      <View className="gap-3 rounded-lg bg-surface p-4 dark:bg-surface-dark">
        <Text className="text-lg font-bold">Things to do</Text>
        <Text className="text-sm text-muted dark:text-muted-dark">
          {travelers.length
            ? 'Tap a name to vote: want, maybe, or won’t. Schedule an idea to add it to the plan.'
            : 'Add travelers on the Overview tab so everyone can vote on ideas.'}
        </Text>
        <Button label="Add Idea" onPress={onAddIdea} variant="outline" />
      </View>

      {isLoading ? (
        <Text className="text-muted dark:text-muted-dark">
          Loading ideas...
        </Text>
      ) : !ideasByType.length ? (
        <Text className="text-muted dark:text-muted-dark">
          No ideas yet. Add places you might want to go.
        </Text>
      ) : (
        ideasByType.map((group) => (
          <View key={group.value} className="gap-3">
            <Text className="text-lg font-bold">{group.label}</Text>
            {group.ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onSchedule={openSchedule}
                onVote={vote}
                stayAddress={stayAddress}
                travelers={travelers}
              />
            ))}
          </View>
        ))
      )}

      <ModalForm
        ref={scheduleModal.ref}
        snapPoints={['60%']}
        title={scheduling ? `Schedule ${scheduling.name}` : 'Schedule'}
      >
        <View className="gap-3">
          <DateTimeInput
            label="Starts"
            onChange={setStart}
            required
            value={start}
          />
          <DateTimeInput
            defaultPickerDate={start ? new Date(start) : undefined}
            error={endIsBeforeStart ? 'End must be after start' : undefined}
            label="Ends"
            onChange={setEnd}
            value={end}
          />
          <Button
            disabled={!start || endIsBeforeStart}
            label="Add to Plan"
            loading={
              scheduling
                ? updateMutations[scheduling.placeType].isPending
                : false
            }
            onPress={saveSchedule}
            size="lg"
            variant="secondary"
          />
        </View>
      </ModalForm>
    </View>
  );
};
