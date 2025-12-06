import React from 'react';

interface LifestyleChallenge {
  type: 'zero-plastic' | 'green-diet' | 'minimalist' | 'energy-saving';
  title: string;
  description: string;
  duration: string;
  potentialImpact: string;
  weeklyGoals: string[];
}

interface ScanResult {
  isEcoFriendly: boolean;
  ecoScore: string;
  explanation: string;
  suggestions: string[];
  lifestyleChallenges: LifestyleChallenge[];
  productCategory: string;
  environmentalImpact: {
    carbonFootprint: string;
    waterUsage: string;
    wasteGenerated: string;
  };
}

interface ResultsViewProps {
  result: ScanResult;
  onClose: () => void;
  onStartChallenge?: (challengeType: string) => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onClose, onStartChallenge }) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-lg overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Product Sustainability</h2>
              <p className="text-sm text-gray-500 mt-1">Category: {result.productCategory}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{result.ecoScore}</div>
              <div className="text-sm text-gray-500">{result.isEcoFriendly ? 'Eco-friendly' : 'Needs improvement'}</div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="mb-4">
            <h3 className="font-semibold">Environmental impact</h3>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Carbon: {result.environmentalImpact.carbonFootprint}</li>
              <li>Water: {result.environmentalImpact.waterUsage}</li>
              <li>Waste: {result.environmentalImpact.wasteGenerated}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Why this rating?</h3>
            <p className="text-sm text-gray-700 mt-2">{result.explanation}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Suggestions</h3>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {result.lifestyleChallenges?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Recommended Challenges</h3>
              <div className="mt-2 space-y-3">
                {result.lifestyleChallenges.map(ch => (
                  <div key={ch.type} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{ch.title}</div>
                        <div className="text-sm text-gray-600">{ch.duration} • {ch.potentialImpact}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onStartChallenge?.(ch.type)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                        >Start</button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">{ch.description}</div>
                    <div className="mt-2 text-xs text-gray-600">Weekly goals: {ch.weeklyGoals.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
