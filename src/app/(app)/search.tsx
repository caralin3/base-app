import { useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import {
  Header,
  PosterList,
  PosterListSkeleton,
  Screen,
  SearchInput,
  Text,
  View,
} from '@/components';
import { SEARCH_TV_QUERY_KEY, searchTv } from '@/lib/api';
import {
  addRecentSearch,
  editRecentSearch,
  resetRecentSearches,
  useRecentSearchesStore,
} from '@/lib/store';
import { type Show } from '@/lib/types';
import { formatTvShow, getShowPosterData } from '@/lib/utils';

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

export default function Search() {
  const queryClient = useQueryClient();
  const recentSearches = useRecentSearchesStore.use.recentSearches();

  const [searchTerm, setSearchTerm] = useState('');
  const [showTrending, setShowTrending] = useState(true);
  const [searchResults, setSearchResults] = useState<Show[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchResultsPosters = useMemo(
    () => getShowPosterData(searchResults, 'search'),
    [searchResults]
  );

  const handleSearch = async (text: string) => {
    try {
      const res = await queryClient.fetchQuery({
        queryKey: [SEARCH_TV_QUERY_KEY, text],
        queryFn: ({ queryKey }) => searchTv({ query: queryKey[1] }),
      });
      const results = res.results.map((tvShow) => formatTvShow(tvShow));
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
      addRecentSearch(searchTerm);
    }
  };

  const handleRecentSearchPress = (item: RecentSearch) => {
    setLoading(true);
    setShowTrending(false);
    setSearchTerm(item.query);
    debouncedSearch(item.query);
    editRecentSearch(item.id);
  };

  const handlePosterPress = () => {
    const alreadySearched = recentSearches.find(
      (search) => search.query.toLowerCase() === searchTerm.toLowerCase()
    );
    if (!alreadySearched) {
      addRecentSearch(searchTerm);
    }
  };

  const handleClearRecentSearches = () => {
    resetRecentSearches();
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
      <View style={styles.content}>
        {searchResultsPosters.length > 0 ? (
          <PosterList
            isLoading={loading}
            data={loading ? [] : searchResultsPosters}
            horizontal={false}
            horizontalItem={true}
            onPress={handlePosterPress}
          />
        ) : !loading ? (
          <FlatList
            style={styles.recentList}
            data={searched && !!searchTerm ? [] : recentSearches}
            keyExtractor={(item) => item.timestamp}
            ListEmptyComponent={
              !!searchTerm ? null : (
                <Text className="px-3" align="center">
                  There are no recent searches. Start searching for shows by
                  name above.
                </Text>
              )
            }
            ListHeaderComponent={
              <View>
                {searched && !!searchTerm ? (
                  <View>
                    <Text style={styles.emptySearchResults}>
                      No search results found from &quot;{searchTerm}&quot;.
                    </Text>
                    <Text style={styles.emptySearchResults}>
                      Try searching again with a different term.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.recentListHeader}>
                    <Text size="lg" weight="bold">
                      Recent Searches
                    </Text>
                    {recentSearches.length > 0 && (
                      <TouchableOpacity onPress={handleClearRecentSearches}>
                        <Text weight="bold">Clear</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleRecentSearchPress(item)}>
                <Text style={styles.recentItemText}>{item.query}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <PosterListSkeleton horizontal={false} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  recentList: {
    // flex: 1,
  },
  recentListHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  recentItemText: {
    fontSize: 18,
    paddingBottom: 16,
  },
  section: {
    gap: 8,
    marginBottom: 8,
  },
  emptySearchResults: {
    paddingTop: 8,
    textAlign: 'center',
  },
});
