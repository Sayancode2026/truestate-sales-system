import React from 'react';

function Pagination({ pagination = {}, onPageChange }) {
  const {
    currentPage = 1,
    totalPages = 1,
    total = 0,
    hasNext = false,
    hasPrev = false,
    pageSize = 10
  } = pagination || {};

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = window.innerWidth < 640 ? 3 : 5; 
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
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
    <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
      {/* Results info */}
      <div className="text-sm text-gray-700 order-2 sm:order-1">
        <span className="hidden sm:inline">
          Showing <span className="font-medium">{Math.max(1, (currentPage - 1) * pageSize + 1)}</span>
          {' '}-{' '}
          <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span>
          {' '}of{' '}
        </span>
        <span className="font-medium">{total.toLocaleString()}</span>
        <span className="hidden sm:inline"> results</span>
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* First page (if not visible) */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="hidden sm:block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="hidden sm:inline px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              page === currentPage
                ? 'bg-purple-600 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last page (if not visible) */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="hidden sm:inline px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="hidden sm:block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Page size (mobile: icon button, desktop: dropdown) */}
      <div className="hidden sm:flex items-center gap-2 order-3">
        <span className="text-sm text-gray-700">Per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageChange && onPageChange(1)}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
}

export default Pagination;
