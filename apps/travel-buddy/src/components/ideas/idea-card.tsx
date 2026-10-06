import { Button, IconSymbol, Text, useAppColors, View } from '@base-app/ui';
import { Pressable } from 'react-native';

import { itineraryCategories } from '@/lib/static-data';
import type { Vote } from '@/lib/types/plans';
import type { Traveler } from '@/lib/types/trips';
import {
  displayUrl,
  formatFullAddress,
  type Idea,
  isRejected,
  openDirections,
  openInMaps,
  openWebsite,
  tallyVotes,
} from '@/lib/utils';

const voteStyles: Record<Vote, { className: string; label: string }> = {
  maybe: {
    className: 'border-warning-500 bg-warning-100 dark:bg-warning-900',
    label: 'Maybe',
  },
  want: {
    className: 'border-success-500 bg-success-100 dark:bg-success-900',
    label: 'Want',
  },
  wont: {
    className: 'border-danger-500 bg-danger-100 dark:bg-danger-900',
    label: "Won't",
  },
};

type IdeaCardProps = {
  idea: Idea;
  onEdit?: (idea: Idea) => void;
  onSchedule: (idea: Idea) => void;
  onVote: (idea: Idea, traveler: Traveler) => void;
  /** Address of where the group is staying, for "Directions from stay". */
  stayAddress?: string;
  travelers: Traveler[];
};

export const IdeaCard = ({
  idea,
  onEdit,
  onSchedule,
  onVote,
  stayAddress,
  travelers,
}: IdeaCardProps) => {
  const appColors = useAppColors();
  const category = itineraryCategories[idea.placeType];
  const address = formatFullAddress(idea.address);
  const tally = tallyVotes(idea, travelers);
  const rejected = isRejected(idea, travelers);
  const summary = [
    tally.want && `${tally.want} want`,
    tally.maybe && `${tally.maybe} maybe`,
    tally.wont && `${tally.wont} won't`,
  ]
    .filter(Boolean)
    .join(' · ');
  const mapsQuery = address ? `${idea.name}, ${address}` : idea.name;

  return (
    <View
      className={`gap-3 rounded-xl bg-background p-4 dark:bg-background-dark ${
        rejected ? 'opacity-50' : ''
      }`}
    >
      <View className="flex-row items-start gap-3">
        <IconSymbol color={category.color} name={category.icon} size={20} />
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold">{idea.name}</Text>
          {!!summary && (
            <Text className="text-sm text-muted dark:text-muted-dark">
              {summary}
            </Text>
          )}
        </View>
        {idea.cost !== undefined && (
          <Text className="text-base font-semibold">${idea.cost}</Text>
        )}
      </View>

      {!!idea.notes && <Text className="text-sm">{idea.notes}</Text>}

      <View className="gap-2">
        {!!idea.website && (
          <Pressable
            accessibilityRole="link"
            className="flex-row items-center gap-2"
            onPress={() => openWebsite(idea.website as string)}
          >
            <IconSymbol color={appColors.primary} name="link" size={16} />
            <Text className="flex-1 text-sm text-primary dark:text-primary-dark">
              {displayUrl(idea.website)}
            </Text>
          </Pressable>
        )}
        {!!address && (
          <Pressable
            accessibilityRole="link"
            className="flex-row items-center gap-2"
            onPress={() => openInMaps(mapsQuery)}
          >
            <IconSymbol
              color={appColors.primary}
              name="mappin.and.ellipse"
              size={16}
            />
            <Text className="flex-1 text-sm text-primary dark:text-primary-dark">
              {address}
            </Text>
          </Pressable>
        )}
        {!!stayAddress && (
          <Pressable
            accessibilityRole="link"
            className="flex-row items-center gap-2"
            onPress={() => openDirections(mapsQuery, stayAddress)}
          >
            <IconSymbol
              color={appColors.primary}
              name="arrow.triangle.turn.up.right.diamond"
              size={16}
            />
            <Text className="text-sm text-primary dark:text-primary-dark">
              Directions from stay
            </Text>
          </Pressable>
        )}
      </View>

      {travelers.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {travelers.map((traveler) => {
            const vote = idea.votes?.[traveler.id];
            const style = vote ? voteStyles[vote] : undefined;
            return (
              <Pressable
                key={traveler.id}
                accessibilityHint="Cycles want, maybe, won't, no vote"
                accessibilityLabel={`${traveler.name}: ${style?.label ?? 'no vote'}`}
                accessibilityRole="button"
                className={`rounded-full border px-3 py-1 ${
                  style?.className ??
                  'border-border bg-surface dark:border-border-dark dark:bg-surface-dark'
                }`}
                onPress={() => onVote(idea, traveler)}
              >
                <Text className="text-sm font-medium">
                  {traveler.name}
                  {style ? ` · ${style.label}` : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View className="flex-row gap-2">
        {onEdit && (
          <View className="flex-1">
            <Button
              label="Edit"
              onPress={() => onEdit(idea)}
              size="sm"
              variant="outline"
            />
          </View>
        )}
        <View className="flex-1">
          <Button
            label="Schedule it"
            onPress={() => onSchedule(idea)}
            size="sm"
            variant="outline"
          />
        </View>
      </View>
    </View>
  );
};
