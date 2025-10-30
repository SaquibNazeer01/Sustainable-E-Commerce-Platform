import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CloseIcon, TrashIcon, PlusIcon, MinusIcon, LeafIcon } from './Icons';
import type { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'cart' | 'payment' | 'processing' | 'confirmation';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, processOrder } = useAppContext();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'eco'>('standard');
  const [offsetCarbon, setOffsetCarbon] = useState(false);
  const [pointsFromLastOrder, setPointsFromLastOrder] = useState(0);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const totalCarbonFootprint = useMemo(() => cart.reduce((sum, item) => sum + item.carbonFootprint * item.quantity, 0) / 1000, [cart]); // in kg
  const carbonOffsetCost = useMemo(() => Math.ceil(totalCarbonFootprint * 10), [totalCarbonFootprint]); // Mock price: ₹10 per kg CO2

  const totalToPay = subtotal + (offsetCarbon ? carbonOffsetCost : 0);

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setTimeout(() => {
        setStep('cart');
        setDeliveryOption('standard');
        setOffsetCarbon(false);
        setPointsFromLastOrder(0);
      }, 300); // Wait for closing animation
    }
  }, [isOpen]);
  
  const handleProcessOrder = () => {
    setStep('processing');
    setTimeout(() => {
        const pointsEarned = processOrder({
            cart,
            deliveryOption,
            carbonOffsetAmount: offsetCarbon ? totalCarbonFootprint : 0
        });
        setPointsFromLastOrder(pointsEarned);
        setStep('confirmation');
    }, 2000); // Simulate processing time
  };

  const CartView = () => (
    <>
      <div className="flex-1 p-6 overflow-y-auto">
        {cart.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Your cart is empty. Let's go shopping! 🛍️</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="flex items-center space-x-4 bg-gray-800/50 p-3 rounded-lg">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-grow">
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-sm text-brand-green-light">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-3">
                   <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition">
                      <MinusIcon className="h-4 w-4" />
                   </button>
                   <span className="font-bold w-6 text-center">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition">
                      <PlusIcon className="h-4 w-4" />
                   </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {cart.length > 0 && (
          <footer className="p-6 border-t border-brand-green/20 bg-gray-900/50 rounded-b-xl">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-gray-300">Subtotal:</span>
                  <span className="text-2xl font-bold font-orbitron text-brand-green-light">₹{subtotal.toFixed(2)}</span>
              </div>
              <button 
                  onClick={() => setStep('payment')}
                  className="w-full py-4 bg-brand-green text-dark-green font-bold rounded-full text-lg hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40"
              >
                  Proceed to Payment
              </button>
          </footer>
      )}
    </>
  );

  const PaymentView = () => (
    <>
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 font-orbitron">Shipping & Payment</h3>
        {/* Mock form fields */}
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full bg-gray-800/50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"/>
          <input type="text" placeholder="Shipping Address" className="w-full bg-gray-800/50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"/>
          <input type="text" placeholder="Card Number" className="w-full bg-gray-800/50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"/>
        </div>

        <h3 className="text-xl font-bold mt-6 mb-4 font-orbitron">Delivery Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setDeliveryOption('standard')} className={`p-4 rounded-lg border-2 transition ${deliveryOption === 'standard' ? 'border-brand-green bg-brand-green/10' : 'border-gray-700 bg-gray-800/50'}`}>
            <p className="font-bold">Standard Delivery</p>
            <p className="text-sm text-gray-400">5-7 Business Days</p>
          </button>
          <button onClick={() => setDeliveryOption('eco')} className={`p-4 rounded-lg border-2 transition ${deliveryOption === 'eco' ? 'border-brand-green bg-brand-green/10' : 'border-gray-700 bg-gray-800/50'}`}>
            <p className="font-bold">Eco Delivery (+100 Points)</p>
            <p className="text-sm text-gray-400">Local vendors, low emissions</p>
          </button>
        </div>

        <h3 className="text-xl font-bold mt-6 mb-4 font-orbitron">Make an Impact</h3>
        <label htmlFor="carbon-offset" className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/80 transition">
          <input id="carbon-offset" type="checkbox" checked={offsetCarbon} onChange={e => setOffsetCarbon(e.target.checked)} className="h-6 w-6 rounded text-brand-green bg-gray-700 border-gray-600 focus:ring-brand-green"/>
          <div>
            <p className="font-bold text-white">Make this order Carbon Neutral</p>
            <p className="text-sm text-gray-400">Offset {totalCarbonFootprint.toFixed(2)} kg of CO₂ for just ₹{carbonOffsetCost.toFixed(2)}</p>
          </div>
        </label>
      </div>
      <footer className="p-6 border-t border-brand-green/20 bg-gray-900/50 rounded-b-xl">
          <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Subtotal:</span>
              <span className="font-semibold text-white">₹{subtotal.toFixed(2)}</span>
          </div>
          {offsetCarbon && (
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Carbon Offset:</span>
                <span className="font-semibold text-white">₹{carbonOffsetCost.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-4 border-t border-gray-700 pt-4">
              <span className="text-lg text-white">Total to Pay:</span>
              <span className="text-2xl font-bold font-orbitron text-brand-green-light">₹{totalToPay.toFixed(2)}</span>
          </div>
          <button 
              onClick={handleProcessOrder}
              className="w-full py-4 bg-brand-green text-dark-green font-bold rounded-full text-lg hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40"
          >
              Pay Now
          </button>
      </footer>
    </>
  );

  const ProcessingView = () => (
    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-2xl font-bold mt-6 font-orbitron">Processing Your Order...</h3>
        <p className="text-gray-400 mt-2">Finalizing your sustainable purchase!</p>
    </div>
  );

  const ConfirmationView = () => (
    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center mb-6">
            <LeafIcon className="h-16 w-16 text-brand-green" />
        </div>
        <h3 className="text-3xl font-bold font-orbitron text-white">Thank You!</h3>
        <p className="text-lg text-gray-300 mt-2">Your order has been placed successfully.</p>
        <div className="my-8 bg-gray-800/50 p-6 rounded-lg">
            <p className="text-gray-400">You've earned</p>
            <p className="text-5xl font-bold font-orbitron text-brand-green-light my-2">{pointsFromLastOrder}</p>
            <p className="text-gray-400">EcoPoints on this order!</p>
            { deliveryOption === 'eco' && <p className="text-sm text-brand-green-light mt-2">+100 bonus for Eco Delivery!</p> }
        </div>
        <button onClick={onClose} className="w-full max-w-xs py-3 bg-brand-green text-dark-green font-bold rounded-full text-lg hover:bg-brand-green-light transition-all duration-300">
            Continue Shopping
        </button>
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 'payment': return <PaymentView />;
      case 'processing': return <ProcessingView />;
      case 'confirmation': return <ConfirmationView />;
      case 'cart':
      default: return <CartView />;
    }
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-dark-green border border-brand-green/20 rounded-xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-brand-green/20 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-orbitron">
            {step === 'cart' && 'Your Cart'}
            {step === 'payment' && 'Checkout'}
            {step === 'processing' && 'Processing'}
            {step === 'confirmation' && 'Order Confirmed'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutModal;
