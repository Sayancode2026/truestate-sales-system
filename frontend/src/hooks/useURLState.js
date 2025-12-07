import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export function useURLState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState = useMemo(() => ({
    search: searchParams.get('search') || '',
    customerRegion: searchParams.get('customerRegion') || '',
    gender: searchParams.get('gender') || '',
    ageMin: searchParams.get('ageMin') || '',
    ageMax: searchParams.get('ageMax') || '',
    productCategory: searchParams.get('productCategory') || '',
    tags: searchParams.get('tags') || '',
    paymentMethod: searchParams.get('paymentMethod') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    sortBy: searchParams.get('sortBy') || 'date_desc',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
  }), [searchParams]);

  const updateURLState = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    setSearchParams(newParams, { replace: true });
  };

  return [urlState, updateURLState];
}
