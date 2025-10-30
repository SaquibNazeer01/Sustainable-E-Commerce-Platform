import React from 'react';

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  ecoScore: 'A' | 'B' | 'C' | 'D' | 'E';
  carbonFootprint: number; // in grams
  material: 'Compostable' | 'Recyclable' | 'Mixed';
  description: string;
}

export interface UserImpact {
  co2Saved: number; // in kg
  wasteReduced: number; // in kg
  energyConserved: number; // in kWh
  co2Offset: number; // in kg
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  ecoPoints: number;
  impact: UserImpact;
}

export interface Badge {
  name: string;
  icon: React.ReactElement;
  pointsRequired: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
