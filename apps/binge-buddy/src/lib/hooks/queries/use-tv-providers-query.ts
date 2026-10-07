import { useQuery } from '@tanstack/react-query';

import { getTvProviders, TV_PROVIDERS_QUERY_KEY } from '@/lib/api';

export function useTvProvidersQuery() {
  return useQuery({
    queryKey: [TV_PROVIDERS_QUERY_KEY],
    queryFn: () => getTvProviders(),
    select: (data) =>
      data.results
        ?.map((provider) => ({
          display_priority:
            provider.display_priorities?.US ?? provider.display_priority,
          logo_path: provider.logo_path,
          provider_id: provider.provider_id,
          provider_name: provider.provider_name,
        }))
        .sort((a, b) => a.display_priority - b.display_priority) ?? [],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
