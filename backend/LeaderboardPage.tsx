
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { User } from '../types';
import { AwardIcon } from '../components/Icons';

const LeaderboardItem: React.FC<{ user: User, rank: number }> = ({ user, rank }) => {
    const rankColors: { [key: number]: string } = {
        1: 'bg-yellow-400/80 text-yellow-900 border-yellow-400',
        2: 'bg-gray-300/80 text-gray-800 border-gray-300',
        3: 'bg-yellow-600/60 text-yellow-100 border-yellow-600',
    };
    const rankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className={`flex items-center p-4 rounded-lg bg-gray-800/50 border border-transparent hover:border-brand-green/50 transition-all duration-300 shadow-lg ${rank <= 3 ? rankColors[rank] : 'border-gray-700'}`}>
            <div className="flex-shrink-0 w-12 text-center text-xl font-bold">{rankIcon(rank)}</div>
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mx-4" />
            <div className="flex-grow">
                <p className="font-bold">{user.name}</p>
                <p className={`text-sm ${rank <= 3 ? '' : 'text-gray-400'}`}>CO₂ Saved: {user.impact.co2Saved.toFixed(1)} kg</p>
            </div>
            <div className="text-right">
                <p className={`text-xl font-orbitron font-bold ${rank <= 3 ? '' : 'text-brand-green-light'}`}>{user.ecoPoints.toLocaleString()}</p>
                <p className="text-xs">EcoPoints</p>
            </div>
        </div>
    );
};


const LeaderboardPage: React.FC = () => {
    const { users } = useAppContext();

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => b.ecoPoints - a.ecoPoints);
    }, [users]);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
                 <AwardIcon className="h-16 w-16 text-brand-green mx-auto mb-4"/>
                <h1 className="text-4xl md:text-5xl font-bold font-orbitron">Eco-Warriors Leaderboard</h1>
                <p className="mt-4 text-lg text-gray-300">See who's leading the charge in making our planet greener. Earn EcoPoints to climb the ranks!</p>
            </div>

            <div className="space-y-4">
                {sortedUsers.map((user, index) => (
                    <LeaderboardItem key={user.id} user={user} rank={index + 1} />
                ))}
            </div>
        </div>
    );
};

export default LeaderboardPage;
