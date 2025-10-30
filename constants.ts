import React from 'react';
import type { Product, User, UserImpact, Badge } from './types';
import { AwardIcon, PlanetIcon, ShieldIcon } from './components/Icons';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Bamboo Toothbrush Set',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=compress&w=600&q=80', // direct bamboo toothbrushes product photo
    price: 499,
    ecoScore: 'A',
    carbonFootprint: 20, // g CO2
    material: 'Compostable',
    description: 'A set of 4 biodegradable bamboo toothbrushes. A perfect plastic-free alternative.',
  },
  {
    id: 2,
    name: 'Reusable Shopping Bags',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=compress&w=600&q=80', // direct product photo of reusable bags
    price: 649,
    ecoScore: 'A',
    carbonFootprint: 50,
    material: 'Recyclable',
    description: 'Durable and washable cotton mesh bags for your groceries. Set of 5 in various sizes.',
  },
  {
    id: 3,
    name: 'Stainless Steel Water Bottle',
    image: 'https://images.unsplash.com/photo-1526401485004-2c2e4e83b6b9?auto=compress&w=600&q=80', // direct product photo of steel bottle
    price: 999,
    ecoScore: 'A',
    carbonFootprint: 150,
    material: 'Recyclable',
    description: 'Keep your drinks cold or hot for hours with this insulated 500ml stainless steel bottle.',
  },
  {
    id: 4,
    name: 'Beeswax Food Wraps',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=compress&w=600&q=80', // direct product photo of beeswax wraps
    price: 799,
    ecoScore: 'B',
    carbonFootprint: 35,
    material: 'Compostable',
    description: 'Eco-friendly alternative to plastic wrap. A set of 3 wraps to keep your food fresh.',
  },
  {
    id: 5,
    name: 'Recycled Paper Notebook',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=compress&w=600&q=80', // direct product photo of recycled notebook
    price: 349,
    ecoScore: 'B',
    carbonFootprint: 80,
    material: 'Recyclable',
    description: 'A5 notebook with 100 pages of 100% recycled paper. Perfect for your notes and ideas.',
  },
  {
    id: 6,
    name: 'Solar-Powered Phone Charger',
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=compress&w=600&q=80', // direct product photo of solar charger
    price: 2499,
    ecoScore: 'A',
    carbonFootprint: 250,
    material: 'Mixed',
    description: 'Charge your devices on the go with this compact and efficient solar power bank.',
  },
   {
    id: 7,
    name: 'Compostable Phone Case',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=compress&w=600&q=80', // direct product photo of compostable phone case
    price: 899,
    ecoScore: 'B',
    carbonFootprint: 60,
    material: 'Compostable',
    description: 'Protect your phone and the planet with this stylish and fully compostable phone case.',
  },
  {
    id: 8,
    name: 'Solid Shampoo Bar',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=compress&w=600&q=80', // direct product photo of shampoo bar
    price: 599,
    ecoScore: 'A',
    carbonFootprint: 15,
    material: 'Compostable',
    description: 'Ditch the plastic bottle! This natural shampoo bar leaves your hair clean and soft.',
  },
];

const MOCK_USER_IMPACT: UserImpact = {
  co2Saved: 12.5,
  wasteReduced: 4.2,
  energyConserved: 30,
  co2Offset: 5.0,
};

export const MOCK_CURRENT_USER: User = {
  id: 1,
  name: 'Alex Green',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  ecoPoints: 1250,
  impact: MOCK_USER_IMPACT,
};

export const USERS: User[] = [
  MOCK_CURRENT_USER,
  { id: 2, name: 'Beatrice Eco', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200', ecoPoints: 2100, impact: { co2Saved: 25.1, wasteReduced: 8.5, energyConserved: 65, co2Offset: 12.1 } },
  { id: 3, name: 'Carlos Verde', avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=200', ecoPoints: 1850, impact: { co2Saved: 20.3, wasteReduced: 6.1, energyConserved: 55, co2Offset: 8.5 } },
  { id: 4, name: 'Diana Soil', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200', ecoPoints: 950, impact: { co2Saved: 9.8, wasteReduced: 3.2, energyConserved: 25, co2Offset: 2.3 } },
  { id: 5, name: 'Ethan Bloom', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200', ecoPoints: 2300, impact: { co2Saved: 28.0, wasteReduced: 9.0, energyConserved: 72, co2Offset: 15.0 } },
  { id: 6, name: 'Fiona Rivers', avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=200', ecoPoints: 1500, impact: { co2Saved: 17.5, wasteReduced: 5.5, energyConserved: 48, co2Offset: 6.7 } },
];

export const INITIAL_COMMUNITY_IMPACT: UserImpact = {
    co2Saved: 12450,
    wasteReduced: 3120,
    energyConserved: 8560,
    co2Offset: 2570,
};

export const BADGES: Badge[] = [
    {
        name: 'Eco Starter',
        icon: React.createElement(AwardIcon, { className: "h-10 w-10" }),
        pointsRequired: 100,
        description: 'Earned 100 EcoPoints. Welcome to the green side!'
    },
    {
        name: 'Planet Protector',
        icon: React.createElement(ShieldIcon, { className: "h-10 w-10" }),
        pointsRequired: 1000,
        description: "Earned 1,000 EcoPoints. You're making a real difference."
    },
    {
        name: 'Sustainability Champion',
        icon: React.createElement(PlanetIcon, { className: "h-10 w-10" }),
        pointsRequired: 5000,
        description: 'Earned 5,000 EcoPoints. A true hero for our planet!'
    },
];
