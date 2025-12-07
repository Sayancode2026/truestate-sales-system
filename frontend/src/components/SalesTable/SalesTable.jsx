import React from 'react';

function SalesTable({ sales, onExpandClick }) {
  if (!sales || sales.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No sales records found
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Expand Button */}
      <button
        onClick={onExpandClick}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        Expand
      </button>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale, index) => (
              <tr key={`${sale.transaction_id}-${index}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">{sale.transaction_id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.customer_id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale.customer_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.phone_number}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.gender}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.age}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.product_category}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesTable;
