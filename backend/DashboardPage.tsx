import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BADGES } from '../constants';
import { LeafIcon, TrashIcon, ZapIcon, ShieldIcon } from '../components/Icons';
import Marketplace from '../components/Marketplace';
import AccountSection from '../components/AccountSection';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ icon: React.ReactNode, value: string, label: string, color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-brand-green/10 transition-shadow">
        <div className={`text-3xl ${color}`}>{icon}</div>
        <div>
            <p className="text-2xl font-bold font-orbitron text-white">{value}</p>
            <p className="text-gray-400">{label}</p>
        </div>
    </div>
);

const BadgeCard: React.FC<{ badge: typeof BADGES[0], earned: boolean }> = ({ badge, earned }) => (
    <div className={`bg-gray-800/50 p-6 rounded-xl shadow-lg text-center transition-all duration-300 ${earned ? 'opacity-100 border border-brand-green/30' : 'opacity-40 grayscale'}`}>
        <div className={`mx-auto mb-4 ${earned ? 'text-brand-green' : 'text-gray-500'}`}>{badge.icon}</div>
        <h3 className="text-xl font-bold text-white">{badge.name}</h3>
        <p className="text-gray-400 text-sm mt-2">{badge.description}</p>
        {!earned && <p className="text-xs text-gray-500 mt-2">({badge.pointsRequired.toLocaleString()} points required)</p>}
    </div>
);


const DashboardPage: React.FC = () => {
    const { currentUser } = useAppContext();
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleLogoutClick = () => {
        logout();
    };

    if (!currentUser) {
        return <div className="text-center p-8">Loading user data...</div>;
    }

    return (
        <div className="animate-fade-in">
            <header className="flex items-center justify-between mb-12 px-4">
                <div className="text-center flex-1">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-green shadow-lg" />
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron">Welcome back, Saquib Nazeer!</h1>
                    <p className="mt-4 text-lg text-gray-300">Here's a summary of your green journey.</p>
                </div>
                <div className="ml-4 flex gap-2">
                    {!user ? (
                        <>
                            <button
                                onClick={handleLoginClick}
                                className="bg-white text-green-700 font-semibold px-4 py-2 rounded shadow hover:bg-green-100 transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogoutClick}
                            className="bg-white text-green-700 font-semibold px-4 py-2 rounded shadow hover:bg-red-100 transition"
                        >
                            Logout ({user.username})
                        </button>
                    )}
                </div>
            </header>

            <section className="mb-12">
                <h2 className="text-3xl font-bold font-orbitron mb-6 text-center">Your Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard 
                        icon={<LeafIcon />} 
                        value={`${currentUser.impact.co2Saved.toFixed(1)} kg`} 
                        label="CO₂ Saved by Products"
                        color="text-green-400"
                    />
                     <StatCard 
                        icon={<ShieldIcon />} 
                        value={`${currentUser.impact.co2Offset.toFixed(1)} kg`} 
                        label="CO₂ Offset by You"
                        color="text-teal-400"
                    />
                     <StatCard 
                        icon={<TrashIcon />} 
                        value={`${currentUser.impact.wasteReduced.toFixed(1)} kg`} 
                        label="Waste Reduced"
                        color="text-yellow-400"
                    />
                     <StatCard 
                        icon={<ZapIcon />} 
                        value={`${currentUser.impact.energyConserved.toFixed(0)} kWh`}
                        label="Energy Conserved"
                        color="text-blue-400"
                    />
                </div>
            </section>
            
            <section>
                <h2 className="text-3xl font-bold font-orbitron mb-6 text-center">Your Badges</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BADGES.map(badge => (
                        <BadgeCard 
                            key={badge.name} 
                            badge={badge} 
                            earned={currentUser.ecoPoints >= badge.pointsRequired} 
                        />
                    ))}
                 </div>
            </section>
            <section>
                <h2 className="text-3xl font-bold font-orbitron mb-6 text-center">My Account (Login Required)</h2>
                <AccountSection />
            </section>

        </div>
    );
};

export default DashboardPage;
