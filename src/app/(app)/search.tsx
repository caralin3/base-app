import { useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

import { Header, Screen, SearchInput, View } from '@/components';
import { SEARCH_TV_QUERY_KEY, searchTv } from '@/lib/api';
import { type Show } from '@/lib/types';
import { formatTvShow } from '@/lib/utils';

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

export default function Search() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [showTrending, setShowTrending] = useState(true);
  const [searchResults, setSearchResults] = useState<Show[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    try {
      const res = await queryClient.fetchQuery({
        queryKey: [SEARCH_TV_QUERY_KEY, text],
        queryFn: ({ queryKey }) => searchTv({ query: queryKey[1] }),
      });
      const results = res.results.map((tvShow) => formatTvShow(tvShow));
      console.log('Search response:', results);
      setSearchResults(results);
      setSearched(true);
      setLoading(false);
    } catch (error) {
      console.error('Error searching', error);
      setSearched(false);
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-compiler/react-compiler
  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleChangeText = (text: string) => {
    setSearched(false);
    setSearchTerm(text);
    if (text !== '') {
      setLoading(true);
    } else {
      setShowTrending(true);
    }
    debouncedSearch(text);
  };

  const handleSubmitEditing = () => {
    debouncedSearch(searchTerm);

    if (!!searchTerm) {
      // dispatch(
      //   addRecentSearch({
      //     id: uuid.v4(),
      //     query: searchTerm,
      //     timestamp: new Date().toISOString(),
      //   }),
      // );
    }
  };

  const handleRecentSearchPress = (item: RecentSearch) => {
    setLoading(true);
    setShowTrending(false);
    setSearchTerm(item.query);
    debouncedSearch(item.query);
    // dispatch(
    //   editRecentSearch({
    //     changes: { timestamp: new Date().toISOString() },
    //     id: item.id,
    //   }),
    // );
  };

  const handlePosterPress = () => {
    // const alreadySearched = recentSearches.find(
    //   (search) => search.query.toLowerCase() === searchTerm.toLowerCase(),
    // );
    // if (!alreadySearched) {
    // dispatch(
    //   addRecentSearch({
    //     id: uuid.v4(),
    //     query: searchTerm,
    //     timestamp: new Date().toISOString(),
    //   }),
    // );
    // }
  };

  const handleClearRecentSearches = () => {
    // dispatch(resetRecentSearches());
    setSearched(false);
  };

  return (
    <Screen showHeader={false}>
      <Header showBackButton={false}>
        <SearchInput
          value={searchTerm}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
        />
      </Header>
      <View className="p-4"></View>
    </Screen>
  );
}
