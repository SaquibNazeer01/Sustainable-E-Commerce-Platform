import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Product, CartItem, User, UserImpact } from '../types';
import { MOCK_CURRENT_USER, USERS, INITIAL_COMMUNITY_IMPACT } from '../constants';

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  currentUser: User | null;
  users: User[];
  communityImpact: UserImpact;
  processOrder: (order: {
    cart: CartItem[];
    deliveryOption: 'standard' | 'eco';
    carbonOffsetAmount: number; // in kg
  }) => number; // Returns total points earned
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_CURRENT_USER);
  const [users, setUsers] = useState<User[]>(USERS);
  const [communityImpact, setCommunityImpact] = useState<UserImpact>(INITIAL_COMMUNITY_IMPACT);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const processOrder = (order: { cart: CartItem[], deliveryOption: 'standard' | 'eco', carbonOffsetAmount: number }) => {
    let pointsEarned = 0;
    let co2SavedFromProducts = 0;

    // Calculate points and impact from products
    order.cart.forEach(item => {
      pointsEarned += item.price * item.quantity * 0.1; // 10% of price as points
      co2SavedFromProducts += (item.carbonFootprint * item.quantity) / 1000; // g to kg
    });

    // Add delivery bonus
    if (order.deliveryOption === 'eco') {
      pointsEarned += 100; // Eco delivery bonus
      co2SavedFromProducts += 0.5; // Eco delivery CO2 saving
    }

    // Add random bonus
    const randomBonus = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    pointsEarned += randomBonus;

    const totalPointsAwarded = Math.floor(pointsEarned);

    // Update user stats
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        ecoPoints: currentUser.ecoPoints + totalPointsAwarded,
        impact: {
          ...currentUser.impact,
          co2Saved: currentUser.impact.co2Saved + co2SavedFromProducts,
          co2Offset: currentUser.impact.co2Offset + order.carbonOffsetAmount,
        }
      };
      setCurrentUser(updatedUser);

      // Update the user in the main users list for the leaderboard
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
    
    // Update community stats
    setCommunityImpact(prevImpact => ({
        ...prevImpact,
        co2Saved: prevImpact.co2Saved + co2SavedFromProducts,
        co2Offset: prevImpact.co2Offset + order.carbonOffsetAmount,
    }));
    
    clearCart();

    return totalPointsAwarded;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    currentUser,
    users,
    communityImpact,
    processOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
