import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import MenuPage from './pages/MenuPage';
import OrderStatusPage from './pages/OrderStatusPage';
import BillPage from './pages/BillPage';

// Main layout component
const AppContent: React.FC = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/status" element={<OrderStatusPage />} />
        <Route path="/bill" element={<BillPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;
