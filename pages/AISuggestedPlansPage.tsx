import React from 'react';
import { useAppContext } from '../context/AppContext';

const lifestylePlans = [
  {
    title: 'Zero-Plastic Challenge',
    description: 'Eliminate single-use plastics from your daily routine. Get weekly tips and track your progress.'
  },
  {
    title: 'Green Diet Transition',
    description: 'Shift towards a plant-based, low-carbon diet. Receive recipes and meal plans personalized to your habits.'
  },
  {
    title: 'Minimalist Wardrobe',
    description: 'Reduce clothing waste by curating a sustainable, minimalist wardrobe. Get suggestions based on your purchases.'
  }
];

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
    <div
      className="bg-brand-green h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const AISuggestedPlansPage: React.FC = () => {
  // In a real app, these would be calculated from user data
  const weeklyProgress = [70, 40, 55];
  const { currentUser } = useAppContext();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-brand-green-light">AI-Suggested Sustainable Lifestyle Plans</h2>
      <p className="mb-8 text-gray-700 dark:text-gray-200">
        Based on your purchase behavior, we recommend personalized sustainability challenges and track your weekly progress.
      </p>
      <div className="space-y-8">
        {lifestylePlans.map((plan, idx) => (
          <div key={plan.title} className="bg-white/80 dark:bg-dark-green/80 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-brand-green mb-2">{plan.title}</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">{plan.description}</p>
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-500 mr-2">Weekly Progress</span>
              <span className="text-xs text-brand-green font-bold">{weeklyProgress[idx]}%</span>
            </div>
            <ProgressBar progress={weeklyProgress[idx]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestedPlansPage;
