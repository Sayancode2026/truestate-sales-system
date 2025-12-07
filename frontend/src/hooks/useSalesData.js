import { useQuery } from '@tanstack/react-query';
import { salesAPI } from '../services/api';

export function useSalesData(filters) {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesAPI.getSales(filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
