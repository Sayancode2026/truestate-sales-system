import React, { useState } from 'react';
import { useFilterOptions } from '../../hooks/useFilterOptions';

function FilterPanel({ filters, onChange }) {
  const { data: options, isLoading } = useFilterOptions();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleMultiSelect = (filterKey, value) => {
    const currentValues = filters[filterKey] ? filters[filterKey].split(',') : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange({ [filterKey]: newValues.filter(Boolean).join(',') });
  };

  const handleRangeChange = (key, value) => {
    onChange({ [key]: value });
  };

  const clearFilters = () => {
    onChange({
      customerRegion: '', gender: '', ageMin: '', ageMax: '',
      productCategory: '', tags: '', paymentMethod: '', dateFrom: '', dateTo: ''
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    return value && value !== '' && !['search', 'sortBy', 'page', 'limit'].includes(key);
  }).length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-xs rounded-full px-2 py-1 font-medium">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <svg 
              className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && options && (
        <div className="p-4 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {options.customerRegion?.length > 0 && (
            <FilterSection title="Customer Region">
              {options.customerRegion.map(region => (
                <CheckboxItem
                  key={region}
                  label={region}
                  checked={(filters.customerRegion || '').split(',').includes(region)}
                  onChange={() => handleMultiSelect('customerRegion', region)}
                />
              ))}
            </FilterSection>
          )}

          {options.gender?.length > 0 && (
            <FilterSection title="Gender">
              {options.gender.map(gender => (
                <CheckboxItem
                  key={gender}
                  label={gender}
                  checked={(filters.gender || '').split(',').includes(gender)}
                  onChange={() => handleMultiSelect('gender', gender)}
                />
              ))}
            </FilterSection>
          )}

          {options.ageRange && (
            <FilterSection title="Age Range">
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder={`Min (${options.ageRange.min})`}
                  value={filters.ageMin || ''}
                  onChange={(e) => handleRangeChange('ageMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  min={options.ageRange.min}
                  max={options.ageRange.max}
                />
                <input
                  type="number"
                  placeholder={`Max (${options.ageRange.max})`}
                  value={filters.ageMax || ''}
                  onChange={(e) => handleRangeChange('ageMax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  min={options.ageRange.min}
                  max={options.ageRange.max}
                />
              </div>
            </FilterSection>
          )}

          {options.productCategory?.length > 0 && (
            <FilterSection title="Product Category">
              {options.productCategory.map(category => (
                <CheckboxItem
                  key={category}
                  label={category}
                  checked={(filters.productCategory || '').split(',').includes(category)}
                  onChange={() => handleMultiSelect('productCategory', category)}
                />
              ))}
            </FilterSection>
          )}

          {options.tags?.length > 0 && (
            <FilterSection title="Tags">
              <div className="max-h-48 overflow-y-auto">
                {options.tags.slice(0, 30).map(tag => (
                  <CheckboxItem
                    key={tag}
                    label={tag}
                    checked={(filters.tags || '').split(',').includes(tag)}
                    onChange={() => handleMultiSelect('tags', tag)}
                  />
                ))}
              </div>
            </FilterSection>
          )}

          {options.paymentMethod?.length > 0 && (
            <FilterSection title="Payment Method">
              {options.paymentMethod.map(method => (
                <CheckboxItem
                  key={method}
                  label={method}
                  checked={(filters.paymentMethod || '').split(',').includes(method)}
                  onChange={() => handleMultiSelect('paymentMethod', method)}
                />
              ))}
            </FilterSection>
          )}

          {options.dateRange && (
            <FilterSection title="Date Range">
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleRangeChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  min={options.dateRange.min}
                  max={options.dateRange.max}
                />
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleRangeChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  min={options.dateRange.min}
                  max={options.dateRange.max}
                />
              </div>
            </FilterSection>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
      />
      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

export default FilterPanel;
