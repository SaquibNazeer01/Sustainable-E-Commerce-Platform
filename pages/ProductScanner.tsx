import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { PRODUCTS } from '../constants';

interface ProductScannerProps {
  onScanSuccess?: (product: any) => void;
  onScanError?: (error: string) => void;
}

const ProductScanner: React.FC<ProductScannerProps> = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Create scanner instance
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "scanner",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScannerSuccess = (decodedText: string) => {
      setIsScanning(false);
      
      // Try to find product by barcode
      const product = PRODUCTS.find(p => p.id === parseInt(decodedText));
      
      if (product) {
        onScanSuccess?.(product);
      } else {
        onScanError?.("Product not found in database");
      }
      
      html5QrcodeScanner.clear();
    };

    const onScannerError = (errorMessage: string) => {
      // Ignore errors while scanning is active
      if (isScanning) {
        console.warn(`QR Error: ${errorMessage}`);
      }
    };

    if (!isScanning) {
      setIsScanning(true);
      html5QrcodeScanner.render(onScannerSuccess, onScannerError);
    }

    // Cleanup on unmount
    return () => {
      html5QrcodeScanner.clear().catch(console.error);
    };
  }, [onScanSuccess, onScanError, isScanning]);

  return (
    <div className="product-scanner">
      <div className="mb-4 text-center text-gray-300">
        <p>Camera Status: {isScanning ? 'Active' : 'Initializing...'}</p>
        <p className="text-sm mt-2">Hold a product barcode steady in front of the camera</p>
      </div>
      <div id="scanner"></div>
      <style jsx>{`
        .product-scanner {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default ProductScanner;