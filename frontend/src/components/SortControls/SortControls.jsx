import React from 'react';

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date (Newest First)' },
  { value: 'date_asc', label: 'Date (Oldest First)' },
  { value: 'quantity_desc', label: 'Quantity (High to Low)' },
  { value: 'quantity_asc', label: 'Quantity (Low to High)' },
  { value: 'name_asc', label: 'Customer Name (A-Z)' },
  { value: 'name_desc', label: 'Customer Name (Z-A)' }
];

function SortControls({ sortBy, onChange }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow px-4 py-3">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

export default SortControls;
