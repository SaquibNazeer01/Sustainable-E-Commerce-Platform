
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/30 mt-12">
      <div className="container mx-auto py-4 px-4 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} EcoShop. All Rights Reserved.</p>
        <p className="mt-1">Developed by Team MKCE-A.</p>
      </div>
    </footer>
  );
};

export default Footer;
