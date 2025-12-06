
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LeafIcon } from '../components/Icons';

const WalletPage: React.FC = () => {
    const { currentUser } = useAppContext();
    const [donationAmount, setDonationAmount] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (!currentUser) {
        return <p>Loading user data...</p>;
    }

    const handleDonate = () => {
        if (donationAmount > 0 && donationAmount <= currentUser.ecoPoints) {
            // In a real app, this would trigger a backend process
            // For now, we just show a confirmation message
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 4000);
        } else {
            alert("Please enter a valid amount to donate.");
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-bold font-orbitron mb-4">My Carbon Wallet</h1>
            <p className="text-gray-300 mb-8">Your EcoPoints are more than just points. They represent your positive impact and can be used to support global sustainability projects.</p>

            <div className="bg-gradient-to-br from-brand-green/20 to-gray-800/20 p-8 rounded-2xl shadow-2xl shadow-brand-green/10 border border-brand-green/20">
                <p className="text-gray-400 text-lg">Current Balance</p>
                <div className="flex items-center justify-center my-4">
                    <LeafIcon className="h-12 w-12 text-brand-green mr-4" />
                    <p className="text-6xl font-bold font-orbitron text-white">{currentUser.ecoPoints.toLocaleString()}</p>
                </div>
                <p className="text-brand-green-light font-semibold">EcoPoints</p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-2xl mt-12 shadow-lg">
                <h2 className="text-2xl font-bold font-orbitron mb-2">Support a Greener Future</h2>
                <p className="text-gray-400 mb-6">Donate your EcoPoints to our Tree Plantation Fund. Every 100 points plants one tree!</p>
                
                {showConfirmation ? (
                    <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg animate-fade-in">
                        <p className="font-bold">Thank you for your donation!</p>
                        <p>You've contributed {donationAmount} points to planting {Math.floor(donationAmount / 100)} trees. 🌳</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input
                            type="number"
                            value={donationAmount || ''}
                            onChange={(e) => setDonationAmount(Math.min(parseInt(e.target.value) || 0, currentUser.ecoPoints))}
                            placeholder="Enter points to donate"
                            max={currentUser.ecoPoints}
                            className="w-full bg-gray-900/50 p-4 rounded-lg text-white text-center text-xl font-orbitron focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                        <button 
                            onClick={handleDonate}
                            className="w-full px-8 py-4 bg-brand-green text-dark-green font-bold rounded-full text-lg hover:bg-brand-green-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!donationAmount || donationAmount <= 0}
                        >
                            Donate {donationAmount > 0 ? donationAmount.toLocaleString() : ''} Points
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletPage;
