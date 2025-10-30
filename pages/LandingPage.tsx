import React from 'react';
import type { Page } from '../App';

interface LandingPageProps {
  setPage: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in py-16">
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-brand-green to-teal-500 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=compress&w=600&q=80"
          alt="Green trees representing a sustainable environment"
          className="relative w-72 h-72 rounded-full object-cover shadow-2xl shadow-brand-green/20"
        />
      </div>
      
      <h1 className="mt-12 text-5xl md:text-7xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        Shop Sustainably.
      </h1>
      <h2 className="mt-2 text-5xl md:text-7xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-brand-green-light to-brand-green">
        Live Responsibly.
      </h2>
      
      <p className="mt-8 max-w-2xl text-lg text-gray-300">
        Discover high-quality, eco-friendly products that are good for you and great for our planet. Join our community and make a positive impact with every purchase.
      </p>
      
      <button 
        onClick={() => setPage('shop')}
        className="mt-12 px-10 py-5 bg-brand-green text-dark-green font-bold rounded-full text-xl hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-green/30 hover:shadow-brand-green/50"
      >
        Explore Products
      </button>
    </div>
  );
};

export default LandingPage;