

import React, { useState, useRef, useEffect } from 'react';
import { analyzeProductImage } from '../services/productAnalysisService';
import ResultsView from './ResultsView';

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

interface SustainabilityScannerProps {
  onScanComplete?: (result: ScanResult) => void;
  userHistory?: {
    recentCategories: string[];
    sustainabilityScore: number;
    completedChallenges: string[];
  };
}

const generateLifestyleChallenges = (
  productCategory: string,
  userHistory?: SustainabilityScannerProps['userHistory']
): LifestyleChallenge[] => {
  const challenges: LifestyleChallenge[] = [];
  
  // Zero Plastic Challenge for packaging-heavy products
  if (productCategory.includes('packaged') || productCategory.includes('beverage')) {
    challenges.push({
      type: 'zero-plastic',
      title: '30-Day Zero Plastic Challenge',
      description: 'Eliminate single-use plastics from your daily routine',
      duration: '30 days',
      potentialImpact: 'Prevent ~5kg of plastic waste',
      weeklyGoals: [
        'Replace plastic bottles with reusable water bottle',
        'Use cloth bags for grocery shopping',
        'Choose products with minimal packaging',
        'Bring your own containers for takeout'
      ]
    });
  }

  // Green Diet Challenge for food products
  if (productCategory.includes('food') || productCategory.includes('beverage')) {
    challenges.push({
      type: 'green-diet',
      title: 'Plant-Based Diet Transition',
      description: 'Gradually increase plant-based meals in your diet',
      duration: '6 weeks',
      potentialImpact: 'Reduce CO2 emissions by ~200kg',
      weeklyGoals: [
        'Try 2 new plant-based recipes',
        'Replace dairy milk with plant alternatives',
        'Have 3 meatless days per week',
        'Learn about plant-based proteins'
      ]
    });
  }

  // Minimalist Challenge for clothing/accessories
  if (productCategory.includes('clothing') || productCategory.includes('accessories')) {
    challenges.push({
      type: 'minimalist',
      title: 'Minimalist Wardrobe Challenge',
      description: 'Create a sustainable capsule wardrobe',
      duration: '8 weeks',
      potentialImpact: 'Save ~4000L water from fast fashion',
      weeklyGoals: [
        'Audit your current wardrobe',
        'Identify versatile essential pieces',
        'Learn clothing repair basics',
        'Create outfit combinations with fewer items'
      ]
    });
  }

  // Energy Challenge for electronics/appliances
  if (productCategory.includes('electronic') || productCategory.includes('appliance')) {
    challenges.push({
      type: 'energy-saving',
      title: 'Smart Energy Usage Challenge',
      description: 'Optimize your home energy consumption',
      duration: '4 weeks',
      potentialImpact: 'Reduce energy usage by ~15%',
      weeklyGoals: [
        'Track appliance energy usage',
        'Optimize device settings for efficiency',
        'Establish energy-saving routines',
        'Switch to LED lighting'
      ]
    });
  }

  // Filter out challenges user has already completed
  if (userHistory?.completedChallenges) {
    return challenges.filter(
      challenge => !userHistory.completedChallenges.includes(challenge.type)
    );
  }

  return challenges;
};

const SustainabilityScanner: React.FC<SustainabilityScannerProps> = ({ onScanComplete, userHistory }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup function for camera
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (result.state === 'denied') {
        // Show instructions for enabling camera in browser settings
        const isConfirmed = window.confirm(
          'Camera access is blocked. Would you like to learn how to enable it?\n\n' +
          'To enable camera access:\n' +
          '1. Click the lock/info icon (🔒) in your browser\'s address bar\n' +
          '2. Click "Site Settings" or "Permissions"\n' +
          '3. Allow camera access\n' +
          '4. Refresh the page'
        );
        if (isConfirmed) {
          // This will open browser settings in most browsers
          const url = window.location.href;
          window.open('https://support.google.com/chrome/answer/2693767', '_blank');
        }
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Permission API not supported, will try direct camera access');
      return true;
    }
  };

  const startCamera = async () => {
    setError(null);
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        setError('Camera permission denied');
        return;
      }

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      console.log('Initializing camera...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available cameras:', videoDevices.length);

      // Try to get the environment-facing camera first
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (err) {
        // If environment camera fails, try any available camera
        console.log('Failed to get environment camera, trying default...');
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }
      
      // Store stream reference for cleanup
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (!videoRef.current) return;
          videoRef.current.onloadedmetadata = () => {
            resolve(true);
          };
        });

        await videoRef.current.play();
        setCameraActive(true);
        
        const videoTrack = stream.getVideoTracks()[0];
        console.log('Camera activated:', videoTrack.label);
        console.log('Video settings:', videoTrack.getSettings());
        
        // Log video dimensions
        console.log('Video dimensions:', {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Permission denied')) {
        setError('Camera permission was denied. Please enable camera access and try again.');
      } else if (errorMessage.includes('not found') || errorMessage.includes('not available')) {
        setError('No camera was found on your device. Please make sure you have a working camera.');
      } else {
        setError('Failed to initialize camera. Please make sure you have a working camera and have granted permission.');
      }
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleStartChallenge = (type: string) => {
    // Temporary action: in a full implementation this would create or enroll the user in the challenge
    console.log('Starting challenge:', type);
    // Provide immediate feedback and close results view
    window.alert(`You've started the "${type}" challenge. Check your profile for progress.`);
    setScanResult(null);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      // Capture frame from video
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(video, 0, 0);
      const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

      // Analyze the image and get base result
      const baseResult = await analyzeProductImage(imageBase64);
      
      // Generate personalized lifestyle challenges
      const challenges = generateLifestyleChallenges(
        baseResult.productCategory,
        userHistory
      );
      
      // Combine results
      const result: ScanResult = {
        ...baseResult,
        lifestyleChallenges: challenges,
        environmentalImpact: {
          carbonFootprint: calculateCarbonFootprint(baseResult),
          waterUsage: calculateWaterUsage(baseResult),
          wasteGenerated: calculateWasteGenerated(baseResult)
        }
      };

      // store locally to display results UI
      setScanResult(result);
      onScanComplete?.(result);
      stopCamera();
    } catch (error) {
      console.error('Error during analysis:', error);
      setError('Failed to analyze the product. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

// Helper functions for environmental impact calculations
const calculateCarbonFootprint = (result: Partial<ScanResult>): string => {
  // Simplified calculation - would be more complex in production
  return result.isEcoFriendly ? 'Low - 0.5kg CO2e' : 'High - 2.5kg CO2e';
};

const calculateWaterUsage = (result: Partial<ScanResult>): string => {
  return result.isEcoFriendly ? 'Low - 50L' : 'High - 200L';
};

const calculateWasteGenerated = (result: Partial<ScanResult>): string => {
  return result.isEcoFriendly ? 'Minimal - Recyclable' : 'High - Mixed Materials';
};
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {scanResult && (
        <ResultsView result={scanResult} onClose={() => setScanResult(null)} onStartChallenge={handleStartChallenge} />
      )}
      {!cameraActive ? (
        <div className="max-w-md w-full mx-auto p-4">
          {error ? (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-sm underline mt-2 hover:text-red-300"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 mb-4">
                Click below to activate your camera for product analysis.
                You'll need to allow camera access when prompted.
              </p>
              <button
                onClick={startCamera}
                className="bg-brand-green/20 text-brand-green-light px-6 py-3 rounded-lg hover:bg-brand-green/40 hover:text-white transition flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Start Camera</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-contain"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-brand-green w-64 h-64 rounded-lg shadow-lg"></div>
              </div>
            </div>
          </div>
          
          {cameraActive && !videoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white">Initializing camera...</div>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={captureAndAnalyze}
                  disabled={isAnalyzing}
                  className="bg-brand-green text-white px-6 py-2 rounded-lg hover:bg-brand-green/90 transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                      <span>Analyze Product</span>
                    </>
                  )}
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
              </div>
              <p className="text-white text-sm">
                Center the product in the frame and tap Analyze
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SustainabilityScanner;