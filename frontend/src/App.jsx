import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SalesPage from './pages/SalesPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<SalesPage />} />
      </Routes>
    </div>
  );
}

export default App;
