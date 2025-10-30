import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LeafIcon, ShoppingCartIcon, XIcon, MenuIcon } from './Icons';

interface HeaderProps {
  onCartClick: () => void;
}

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-brand-green/20 text-brand-green-light shadow-[0_0_10px_rgba(74,222,128,0.5)]'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { cart, currentUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = (
    <>
      <NavLink to="/shop">Shop</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/leaderboard">Leaderboard</NavLink>
      <NavLink to="/community">Community</NavLink>
      <NavLink to="/wallet">Wallet</NavLink>
      <NavLink to="/ai-plans">AI Lifestyle Plans</NavLink>
      {currentUser && <NavLink to="/marketplace">Marketplace</NavLink>}
    </>
  );

  return (
    <header className="bg-dark-green/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <LeafIcon className="h-8 w-8 text-brand-green" />
            <h1 className="text-2xl font-bold font-orbitron text-white">EcoShop</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">{navLinks}</nav>
          <div className="flex items-center space-x-4">
            <button onClick={onCartClick} className="relative group">
              <ShoppingCartIcon className="h-6 w-6 text-gray-300 group-hover:text-brand-green transition" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-green text-dark-green text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cartItemCount}
                </span>
              )}
            </button>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <XIcon className="h-6 w-6"/> : <MenuIcon className="h-6 w-6"/>}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-dark-green/95 animate-fade-in pb-4">
          <nav className="flex flex-col items-center space-y-2">{navLinks}</nav>
        </div>
      )}
    </header>
  );
};

export default Header;