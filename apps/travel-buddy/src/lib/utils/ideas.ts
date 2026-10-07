import type { PlaceType } from '@/lib/static-data';
import type { Activity, Vote } from '@/lib/types/plans';
import type { Traveler } from '@/lib/types/trips';

export type Idea = Activity & { placeType: PlaceType };

/** Tapping a traveler's vote cycles through these, then back to no vote. */
const voteCycle: (Vote | undefined)[] = ['want', 'maybe', 'wont', undefined];

export const nextVote = (current?: Vote) =>
  voteCycle[(voteCycle.indexOf(current) + 1) % voteCycle.length];

export const setVote = (
  votes: Record<string, Vote> | undefined,
  travelerId: string,
  vote: Vote | undefined
) => {
  const { [travelerId]: _previous, ...rest } = votes ?? {};
  return vote ? { ...rest, [travelerId]: vote } : rest;
};

export type VoteTally = Record<Vote, number>;

/** Only counts votes from current travelers, in case someone was removed. */
export const tallyVotes = (idea: Idea, travelers: Traveler[]): VoteTally => {
  const tally: VoteTally = { maybe: 0, want: 0, wont: 0 };
  travelers.forEach((traveler) => {
    const vote = idea.votes?.[traveler.id];
    if (vote) tally[vote] += 1;
  });
  return tally;
};

/** True when every traveler has voted "won't do". */
export const isRejected = (idea: Idea, travelers: Traveler[]) =>
  travelers.length > 0 && tallyVotes(idea, travelers).wont === travelers.length;

/** Most wanted first; ideas everyone rejected sink to the bottom. */
export const rankIdeas = (ideas: Idea[], travelers: Traveler[]) =>
  [...ideas].sort((a, b) => {
    const rejectedDiff =
      Number(isRejected(a, travelers)) - Number(isRejected(b, travelers));
    if (rejectedDiff) return rejectedDiff;
    const ta = tallyVotes(a, travelers);
    const tb = tallyVotes(b, travelers);
    return (
      tb.want - ta.want ||
      tb.maybe - ta.maybe ||
      ta.wont - tb.wont ||
      a.name.localeCompare(b.name)
    );
  });
