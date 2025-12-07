import React, { useState } from 'react';
import { useSalesData } from '../hooks/useSalesData';
import { useFilterOptions } from '../hooks/useFilterOptions';
import { useURLState } from '../hooks/useURLState';
import SearchBar from '../components/SearchBar/SearchBar';
import SalesTable from '../components/SalesTable/SalesTable';
import Pagination from '../components/Pagination/Pagination';
import FullTableModal from '../components/FullTableModal/FullTableModal';

function SalesPage() {
  const [urlState, updateURLState] = useURLState();
  const { data, isLoading, error } = useSalesData(urlState);
  const { data: filterOptionsResponse } = useFilterOptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [modalPage, setModalPage] = useState(1);
  const [modalTotalRecords, setModalTotalRecords] = useState(0);

  const filterOptions = filterOptionsResponse?.data || {};
  const regions = filterOptions?.regions || [];
  const categories = filterOptions?.categories || [];
  const tags = filterOptions?.tags || [];
  const paymentMethods = filterOptions?.paymentMethods || [];

  const handleSearchChange = (value) => {
    updateURLState({ search: value, page: 1 });
  };

  const handleFilterChange = (updates) => {
    updateURLState({ ...updates, page: 1 });
  };

  const handleSortChange = (sortBy) => {
    updateURLState({ sortBy, page: 1 });
  };

  const handlePageChange = (page) => {
    updateURLState({ page });
  };

  const clearFilters = () => {
    updateURLState({
      search: '',
      customerRegion: '',
      gender: '',
      ageMin: '',
      ageMax: '',
      productCategory: '',
      tags: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date_desc',
      page: 1
    });
  };

  
  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setModalPage(1);
    await fetchModalPage(1);
  };

  
  const fetchModalPage = async (page) => {
    setIsLoadingModal(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const params = new URLSearchParams();
      if (urlState.search) params.set('search', urlState.search);
      if (urlState.customerRegion) params.set('customerRegion', urlState.customerRegion);
      if (urlState.gender) params.set('gender', urlState.gender);
      if (urlState.ageMin) params.set('ageMin', urlState.ageMin);
      if (urlState.ageMax) params.set('ageMax', urlState.ageMax);
      if (urlState.productCategory) params.set('productCategory', urlState.productCategory);
      if (urlState.tags) params.set('tags', urlState.tags);
      if (urlState.paymentMethod) params.set('paymentMethod', urlState.paymentMethod);
      if (urlState.dateFrom) params.set('dateFrom', urlState.dateFrom);
      if (urlState.dateTo) params.set('dateTo', urlState.dateTo);
      if (urlState.sortBy) params.set('sortBy', urlState.sortBy);
      
      
      params.set('page', page.toString());
      params.set('limit', '10');
      
      const response = await fetch(`${API_URL}/sales?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setModalData(result.data || []);
        setModalTotalRecords(result.pagination?.total || 0);
        console.log(`📊 Loaded page ${page} (${result.data?.length} records of ${result.pagination?.total} total)`);
      }
    } catch (error) {
      console.error('Error fetching modal data:', error);
      setModalData([]);
    } finally {
      setIsLoadingModal(false);
    }
  };

  
  const handleModalPageChange = (page) => {
    setModalPage(page);
    fetchModalPage(page);
  };

  const summaryStats = data?.summary || {
    totalUnitsSold: 0,
    totalAmount: 0,
    totalDiscount: 0
  };

  const hasActiveFilters = urlState.search || urlState.customerRegion || urlState.gender || 
                          urlState.productCategory || urlState.tags || urlState.paymentMethod ||
                          urlState.dateFrom || urlState.dateTo;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo Header */}
        <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 text-sm truncate">Vault</h2>
                <p className="text-xs text-gray-500 truncate">Sayan Bardhan</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItem icon="" label="Dashboard" collapsed={isSidebarCollapsed} />
          <NavItem icon="" label="Nexus" collapsed={isSidebarCollapsed} />
          <NavItem icon="" label="Intake" collapsed={isSidebarCollapsed} />
          
          <div className="pt-1">
            <NavItem icon="" label="Services" collapsed={isSidebarCollapsed} hasSubmenu />
            {!isSidebarCollapsed && (
              <div className="ml-8 mt-1 space-y-1">
                <NavItem label="Pre-Active" small collapsed={false} />
                <NavItem label="Active" small active collapsed={false} />
                <NavItem label="Declined" small collapsed={false} />
                <NavItem label="Closed" small collapsed={false} />
              </div>
            )}
          </div>
          
          <NavItem icon="" label="Invoices" collapsed={isSidebarCollapsed} hasSubmenu />
          <NavItem icon="" label="Preferred Invoices" collapsed={isSidebarCollapsed} />
          <NavItem icon="" label="Final Invoices" collapsed={isSidebarCollapsed} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">Sales Management System</h1>
          <SearchBar value={urlState.search} onChange={handleSearchChange} />
        </header>

        {/* Filters Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Refresh */}
            <button 
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Refresh"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Customer Region */}
            <select
              value={urlState.customerRegion}
              onChange={(e) => handleFilterChange({ customerRegion: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white min-w-[140px]"
            >
              <option value="">Customer Region</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            {/* Gender */}
            <select
              value={urlState.gender}
              onChange={(e) => handleFilterChange({ gender: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white min-w-[100px]"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            {/* Age Range */}
            <div className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md bg-white">
              <input
                type="number"
                placeholder="Min"
                value={urlState.ageMin}
                onChange={(e) => handleFilterChange({ ageMin: e.target.value })}
                className="w-14 text-sm focus:outline-none"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={urlState.ageMax}
                onChange={(e) => handleFilterChange({ ageMax: e.target.value })}
                className="w-14 text-sm focus:outline-none"
              />
            </div>

            {/* Product Category */}
            <select
              value={urlState.productCategory}
              onChange={(e) => handleFilterChange({ productCategory: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white min-w-[150px]"
            >
              <option value="">Product Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Tags */}
            <select
              value={urlState.tags}
              onChange={(e) => handleFilterChange({ tags: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white min-w-[100px]"
            >
              <option value="">Tags</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Payment Method */}
            <select
              value={urlState.paymentMethod}
              onChange={(e) => handleFilterChange({ paymentMethod: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white min-w-[140px]"
            >
              <option value="">Payment Method</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>

            {/* Date From */}
            <input
              type="date"
              value={urlState.dateFrom}
              onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />

            {/* Date To */}
            <input
              type="date"
              value={urlState.dateTo}
              onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />

            {/* Sort By */}
            <select
              value={urlState.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="ml-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white min-w-[180px]"
            >
              <option value="date_desc">Sort by: Date (Newest First)</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="customer_name_asc">Customer Name (A-Z)</option>
              <option value="customer_name_desc">Customer Name (Z-A)</option>
              <option value="amount_desc">Amount (Highest First)</option>
              <option value="amount_asc">Amount (Lowest First)</option>
              <option value="quantity_desc">Quantity (Highest First)</option>
              <option value="quantity_asc">Quantity (Lowest First)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="bg-gray-50 px-6 py-4 flex-shrink-0">
          <div className="flex gap-4">
            <SummaryCard
              label="Total units sold"
              value={summaryStats.totalUnitsSold?.toLocaleString() || '0'}
              icon="info"
            />
            <SummaryCard
              label="Total Amount"
              value={`₹${(summaryStats.totalAmount / 1000).toFixed(2)}K`}
              icon="info"
            />
            <SummaryCard
              label="Total Discount"
              value={`₹${(summaryStats.totalDiscount / 1000).toFixed(2)}K`}
              icon="info"
            />
          </div>
        </div>

        {/* Content Area with Table */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center text-red-600">
                Error loading data. Please try again.
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto">
                  <SalesTable 
                    sales={data?.data || []} 
                    onExpandClick={handleOpenModal}
                  />
                </div>
                <Pagination
                  pagination={data?.pagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <FullTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sales={modalData}
        isLoading={isLoadingModal}
        currentPage={modalPage}
        totalRecords={modalTotalRecords}
        itemsPerPage={10}
        onPageChange={handleModalPageChange}
      />
    </div>
  );
}

function NavItem({ icon, label, collapsed, small, active, hasSubmenu }) {
  if (collapsed && !small) {
    return (
      <button
        className={`w-full flex items-center justify-center p-2 rounded-md transition-colors ${
          active ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'
        }`}
        title={label}
      >
        <span className="text-base">{icon}</span>
      </button>
    );
  }

  return (
    <button
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-left ${
        active ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-100'
      } ${small ? 'text-xs' : 'text-sm'}`}
    >
      {icon && !small && <span className="text-base flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {hasSubmenu && (
        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </button>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600 font-medium">{label}</span>
        {icon && (
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default SalesPage;
