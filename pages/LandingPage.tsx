import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 opacity-80" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-green/30 blur-3xl rounded-full animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 blur-3xl rounded-full animate-pulse-slow" />

      <section className="container mx-auto px-6 pt-24 pb-16 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold font-orbitron leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Shop Sustainably,</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-green-light to-brand-green">Live Responsibly.</span>
            </h1>
            <p className="mt-6 text-gray-300 text-lg max-w-xl">
              Discover eco‑friendly products, measure your impact, and join a community committed to protecting our planet.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="px-8 py-4 bg-brand-green text-dark-green font-bold rounded-full text-lg hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-green/30"
              >
                Start Exploring
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full text-lg hover:bg-white/20 transition-all"
              >
                View Dashboard
              </button>
            </div>
            {/* Impact counters */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center md:text-left">
              <div className="p-4 bg-black/20 rounded-xl backdrop-blur-sm">
                <p className="text-3xl font-bold text-brand-green-light animate-fade-in">12.5k</p>
                <p className="text-gray-300 text-sm">kg CO₂ saved</p>
              </div>
              <div className="p-4 bg-black/20 rounded-xl backdrop-blur-sm">
                <p className="text-3xl font-bold text-teal-300 animate-fade-in">3.1k</p>
                <p className="text-gray-300 text-sm">kg waste reduced</p>
              </div>
              <div className="p-4 bg-black/20 rounded-xl backdrop-blur-sm">
                <p className="text-3xl font-bold text-sky-300 animate-fade-in">8.5k</p>
                <p className="text-gray-300 text-sm">kWh conserved</p>
              </div>
            </div>
          </div>
          {/* Hero image with subtle parallax */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-green to-teal-500 rounded-3xl blur-3xl opacity-30 animate-pulse-slow" />
            <img
              src="/images/reusable-shopping-bags.png"
              alt="Eco products"
              className="relative w-full max-w-md mx-auto rounded-3xl object-cover shadow-2xl shadow-brand-green/30 transform hover:scale-[1.02] transition-transform"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x600?text=EcoShop'; }}
            />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="container mx-auto px-6 pb-24 relative">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">Why EcoShop?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg hover:shadow-brand-green/20 transition">
            <div className="text-brand-green text-3xl mb-3">♻️</div>
            <h3 className="text-xl font-semibold">AI‑Assisted Choices</h3>
            <p className="text-gray-300 mt-2">Get sustainability insights and recommendations powered by Gemini to shop smarter.</p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg hover:shadow-brand-green/20 transition">
            <div className="text-teal-300 text-3xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold">Curated Eco Products</h3>
            <p className="text-gray-300 mt-2">Explore verified products with recyclable, compostable, and low‑impact materials.</p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg hover:shadow-brand-green/20 transition">
            <div className="text-sky-300 text-3xl mb-3">🌍</div>
            <h3 className="text-xl font-semibold">Measure Your Impact</h3>
            <p className="text-gray-300 mt-2">Track CO₂ savings, waste reduction, and energy conservation on your dashboard.</p>
          </div>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/shop')}
            className="px-10 py-4 bg-brand-green text-dark-green font-bold rounded-full text-lg hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Enter EcoShop
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;