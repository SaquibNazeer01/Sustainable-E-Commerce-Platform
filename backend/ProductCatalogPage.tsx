import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import type { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { ShoppingCartIcon } from '../components/Icons';
import SustainabilityScanner from '../components/SustainabilityScanner';

type SortOption = 'eco-score' | 'price-asc' | 'price-desc' | 'name-az';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useAppContext();

  const ecoScoreColors: { [key: string]: string } = {
    'A': 'text-green-400 border-green-400',
    'B': 'text-lime-400 border-lime-400',
    'C': 'text-yellow-400 border-yellow-400',
    'D': 'text-orange-400 border-orange-400',
    'E': 'text-red-400 border-red-400',
  };

  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-brand-green/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white flex-1 pr-2">{product.name}</h3>
            <span className={`text-xl font-orbitron font-bold ${ecoScoreColors[product.ecoScore]}`}>{product.ecoScore}</span>
        </div>
        <p className="text-gray-400 text-sm mt-2 flex-grow">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-brand-green-light">₹{product.price}</p>
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center space-x-2 bg-brand-green/20 text-brand-green-light px-4 py-2 rounded-md hover:bg-brand-green/40 hover:text-white transition"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCatalogPage: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>('eco-score');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  const sortedProducts = useMemo(() => {
    const sorted = [...PRODUCTS];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'eco-score':
      default:
        sorted.sort((a, b) => a.ecoScore.localeCompare(b.ecoScore));
        break;
    }
    return sorted;
  }, [sortOption]);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-orbitron">Our Eco-Friendly Collection</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Thoughtfully curated products to help you live a more sustainable lifestyle.</p>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={() => setShowScanner(prev => !prev)}
          className="bg-brand-green/20 text-brand-green-light px-6 py-2 rounded-md hover:bg-brand-green/40 hover:text-white transition flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{showScanner ? 'Hide Scanner' : 'Scan Product'}</span>
        </button>
        
        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">Sort products by</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="appearance-none bg-gray-800/50 border border-gray-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green transition"
          >
            <option value="eco-score">Sort by Eco Score</option>
            <option value="price-asc">Sort by Price: Low to High</option>
            <option value="price-desc">Sort by Price: High to Low</option>
            <option value="name-az">Sort by Name: A-Z</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {showScanner && (
        <div className="mb-8">
          <SustainabilityScanner
            onScanComplete={(result) => {
              // Create a virtual product from the scan result
              const scannedProduct: Product = {
                id: -1, // temporary ID for scanned products
                name: "Scanned Product",
                image: "", // We could save the captured image here if needed
                price: 0,
                ecoScore: result.ecoScore,
                description: result.explanation,
                carbonFootprint: 0,
                material: result.isEcoFriendly ? "Recyclable" : "Mixed"
              };
              setScannedProduct(scannedProduct);
              setShowScanner(false);
            }}
          />
        </div>
      )}

      {scannedProduct && (
        <div className="mb-8 p-6 bg-gray-800/50 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Scanned Product</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ProductCard product={scannedProduct} />
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-green-light">Eco-Score Details</h3>
              <p className="text-gray-300">This product has an eco-score of {scannedProduct.ecoScore} based on:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Sustainable packaging</li>
                <li>Carbon footprint during production</li>
                <li>Recyclability of materials</li>
                <li>Energy efficiency in use</li>
              </ul>
              <button
                onClick={() => setScannedProduct(null)}
                className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Clear Scanned Product
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalogPage;