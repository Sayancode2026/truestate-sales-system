import React, { useEffect } from 'react';

function FullTableModal({ 
  isOpen, 
  onClose, 
  sales, 
  isLoading, 
  currentPage, 
  totalRecords, 
  itemsPerPage,
  onPageChange 
}) {
  
  
  useEffect(() => {
    if (isOpen && currentPage !== 1) {
      onPageChange(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);

  const handlePageChange = (page) => {
    onPageChange(page);
    document.getElementById('modal-content')?.scrollTo(0, 0);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    let start = Math.max(1, currentPage - 3);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Full Table View</h2>
            <p className="text-sm text-gray-600 mt-1">
              {totalRecords.toLocaleString()} total records
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div id="modal-content" className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">Loading data...</p>
              </div>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Region</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale, index) => (
                    <tr key={sale.transaction_id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.transaction_id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.customer_id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.customer_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.phone_number}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.gender}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.age}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.product_category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">₹{sale.final_amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.customer_region}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.product_id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{sale.employee_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer with Pagination */}
        {!isLoading && totalRecords > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
            {/* Results info */}
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(startIndex + 1).toLocaleString()}</span> to{' '}
              <span className="font-medium">{endIndex.toLocaleString()}</span> of{' '}
              <span className="font-medium">{totalRecords.toLocaleString()}</span> results
            </div>

            {/* Pagination controls */}
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {pageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    1
                  </button>
                  {pageNumbers[0] > 2 && <span className="px-2 text-gray-500">...</span>}
                </>
              )}

              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    page === currentPage
                      ? 'bg-purple-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    {totalPages.toLocaleString()}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>

            {/* Page info */}
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage.toLocaleString()}</span> of{' '}
              <span className="font-medium">{totalPages.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FullTableModal;
