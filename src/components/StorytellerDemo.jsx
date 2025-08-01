import React, { useState, useCallback } from 'react';
import { XMarkIcon, PlayIcon, CheckIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';
import { storytellerData } from '../data/storytellerData';

const StorytellerDemo = ({ showStorytellerDemo, setShowStorytellerDemo }) => {
  const [storytellerDemoStep, setStorytellerDemoStep] = useState('landing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const storytellerSteps = [
    {
      id: 1,
      title: '🎵 Data Harvesting',
      description: 'Scanning 50,000+ Singer-Songwriter tracks across platforms...',
      duration: 1500
    },
    {
      id: 2,
      title: '🤖 AI Pattern Recognition',
      description: 'Processing indie folk trends and emotional patterns...',
      duration: 2000
    },
    {
      id: 3,
      title: '✍️ Content Generation',
      description: 'Generating authentic storytelling content...',
      duration: 1800
    },
    {
      id: 4,
      title: '🔍 Quality Assurance',
      description: 'Cross-referencing with industry databases...',
      duration: 1200
    },
    {
      id: 5,
      title: '✅ Editorial Review',
      description: 'Final review complete! Newsletter ready.',
      duration: 1000
    }
  ];

  const startStorytellerDemo = useCallback(async () => {
    setIsGenerating(true);
    setStorytellerDemoStep('generating');
    setGenerationProgress(0);

    for (let i = 0; i < storytellerSteps.length; i++) {
      const step = storytellerSteps[i];
      setGenerationStep(step.description);
      setGenerationProgress(((i + 1) / storytellerSteps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    setIsGenerating(false);
    setStorytellerDemoStep('newsletter');
  }, [storytellerSteps]);

  if (!showStorytellerDemo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🎸</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">STORYTELLER Demo</h2>
              <p className="text-sm text-gray-600">Singer-Songwriter Intelligence</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowStorytellerDemo(false);
              setStorytellerDemoStep('landing');
              setIsGenerating(false);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {storytellerDemoStep === 'landing' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">🎸</span>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Experience STORYTELLER</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Watch our AI discover emerging singer-songwriters, analyze confessional folk trends, 
                  and generate authentic music intelligence in real-time.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 max-w-2xl mx-auto">
                <h4 className="font-bold text-green-900 mb-3">What You'll See:</h4>
                <ul className="text-left space-y-2 text-green-800">
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>AI-powered artist discovery process</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>Real-time trend analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>Complete newsletter generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>Industry intelligence insights</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={startStorytellerDemo}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto text-lg font-semibold"
              >
                <PlayIcon />
                <span>Start Demo</span>
              </button>
            </div>
          )}

          {storytellerDemoStep === 'generating' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <LoadingSpinner size="lg" className="text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Generating Newsletter</h3>
                <p className="text-gray-600">{generationStep}</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{Math.round(generationProgress)}% Complete</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {storytellerSteps.map((step, index) => (
                    <div key={step.id} className={`flex items-center space-x-2 ${
                      index < (generationProgress / 20) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {index < (generationProgress / 20) ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-current rounded-full"></div>
                      )}
                      <span>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {storytellerDemoStep === 'newsletter' && (
            <div className="space-y-6">
              {/* Newsletter Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🎸</span>
                    <div>
                      <h3 className="text-xl font-bold">STORYTELLER</h3>
                      <p className="text-green-100">Issue {storytellerData.issue} • {storytellerData.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-100">AI Confidence</div>
                    <div className="text-2xl font-bold">{storytellerData.aiConfidence}%</div>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{storytellerData.title}</h1>
                <p className="text-xl text-green-100">{storytellerData.subtitle}</p>
              </div>

              {/* Featured Artist */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">🎯 Featured Discovery</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xl font-bold text-gray-900">{storytellerData.featuredArtist.name}</h5>
                    <p className="text-gray-600 mb-2">{storytellerData.featuredArtist.location} • Age {storytellerData.featuredArtist.age}</p>
                    <p className="text-gray-700 mb-4">{storytellerData.featuredArtist.bio}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Key Track:</span>
                        <span className="text-sm font-medium">"{storytellerData.featuredArtist.keyTrack}"</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monthly Listeners:</span>
                        <span className="text-sm font-medium">{storytellerData.featuredArtist.spotifyMonthlyListeners.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth:</span>
                        <span className="text-sm font-medium text-green-600">+{storytellerData.featuredArtist.streamingGrowth}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="font-semibold text-gray-900 mb-3">Recent Activity</h6>
                    <ul className="space-y-2">
                      {storytellerData.featuredArtist.recentActivity.map((activity, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Radar Discoveries */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">📡 On Our Radar</h4>
                <div className="space-y-4">
                  {storytellerData.radarDiscoveries.map((artist, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h6 className="font-semibold text-gray-900">{artist.name}</h6>
                          <p className="text-sm text-gray-600">{artist.location} • "{artist.track}"</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {artist.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{artist.description}</p>
                      <p className="text-sm font-medium text-green-700">Prediction: {artist.prediction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Generation Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{storytellerData.metrics.estimatedReach.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Estimated Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{storytellerData.metrics.aiProcessingTime}</div>
                    <div className="text-sm text-gray-600">Processing Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{storytellerData.metrics.confidenceScore}%</div>
                    <div className="text-sm text-gray-600">Confidence Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{storytellerData.metrics.sourcesAnalyzed.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Sources Analyzed</div>
                  </div>
                </div>
              </div>

              {/* Demo Complete */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h4 className="text-lg font-bold text-green-900 mb-2">🎉 Demo Complete!</h4>
                <p className="text-green-800 mb-4">
                  This newsletter was generated in real-time using our AI-powered music intelligence platform.
                </p>
                <button 
                  onClick={() => {
                    setShowStorytellerDemo(false);
                    setStorytellerDemoStep('landing');
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Close Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorytellerDemo;
