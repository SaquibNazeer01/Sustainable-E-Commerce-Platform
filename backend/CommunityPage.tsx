
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LeafIcon, TrashIcon, ZapIcon } from '../components/Icons';

const GOAL_CO2_SAVED = 5000; // 5 tons

const CommunityPage: React.FC = () => {
    const { communityImpact } = useAppContext();

    const progress = Math.min((communityImpact.co2Saved / GOAL_CO2_SAVED) * 100, 100);

    const StatDisplay: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
        <div className="bg-gray-800/50 rounded-xl p-6 text-center flex flex-col items-center shadow-lg hover:shadow-brand-green/10 transition-shadow">
            <div className={`text-4xl mb-4 text-${color}-400`}>{icon}</div>
            <p className="text-4xl font-bold font-orbitron text-white">{value}</p>
            <p className="text-gray-400 mt-1">{label}</p>
        </div>
    );

    return (
        <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-orbitron mb-4">Our Collective Impact</h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-12">
                Together, our community is making a massive difference. Here's a look at what we've achieved so far. Every small action contributes to this global green wave.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatDisplay
                    icon={<LeafIcon />}
                    label="Total CO₂ Saved"
                    value={`${communityImpact.co2Saved.toLocaleString('en-US', { maximumFractionDigits: 0 })} kg`}
                    color="green"
                />
                <StatDisplay
                    icon={<TrashIcon />}
                    label="Total Waste Reduced"
                    value={`${communityImpact.wasteReduced.toLocaleString('en-US', { maximumFractionDigits: 0 })} kg`}
                    color="yellow"
                />
                <StatDisplay
                    icon={<ZapIcon />}
                    label="Total Energy Conserved"
                    value={`${communityImpact.energyConserved.toLocaleString('en-US', { maximumFractionDigits: 0 })} kWh`}
                    color="blue"
                />
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold font-orbitron mb-4">Community Goal: Save {GOAL_CO2_SAVED.toLocaleString()} kg of CO₂</h2>
                <p className="text-gray-400 mb-6">We're on a mission to save {GOAL_CO2_SAVED / 1000} tons of CO₂. Let's reach our goal together!</p>
                <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-brand-green-dark to-brand-green h-8 rounded-full flex items-center justify-center text-dark-green font-bold transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    >
                       {progress.toFixed(1)}%
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>0 kg</span>
                    <span>{GOAL_CO2_SAVED.toLocaleString()} kg</span>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
