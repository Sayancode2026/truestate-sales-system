import { useQuery } from '@tanstack/react-query';
import { salesAPI } from '../services/api';

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => salesAPI.getFilterOptions(),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });
}
