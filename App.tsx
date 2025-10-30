import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import DashboardPage from './pages/DashboardPage';
import AISuggestedPlansPage from './pages/AISuggestedPlansPage';
import CommunityPage from './pages/CommunityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import EcoBot from './components/EcoBot';
import { AppProvider } from './context/AppContext';
import CheckoutModal from './components/CheckoutModal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Marketplace from './components/Marketplace';


const App: React.FC = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-dark-green font-sans">
          <Header onCartClick={() => setIsCheckoutOpen(true)} />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<LandingPage setPage={() => {}} />} />
              <Route path="/shop" element={<ProductCatalogPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/ai-plans" element={<AISuggestedPlansPage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
          <EcoBot />
          <Footer />
          <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;