import React, { useState, useEffect, useMemo } from 'react';
import Navigation from './components/Navigation';
import DashboardContent from './components/DashboardContent';
import StorytellerDemo from './components/StorytellerDemo';
import CreateModal from './components/CreateModal';
import { useGenreData } from './hooks/useGenreData';

const TrueFansNewsletterPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newsletters, setNewsletters] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStorytellerDemo, setShowStorytellerDemo] = useState(false);

  const genres = useGenreData();

  // Dashboard Stats
  const dashboardStats = useMemo(() => ({
    totalSubscribers: genres.reduce((sum, genre) => sum + genre.subscribers, 0),
    weeklyGrowth: genres.reduce((sum, genre) => sum + genre.growth, 0) / genres.length,
    avgEngagement: genres.reduce((sum, genre) => sum + genre.engagement, 0) / genres.length,
    totalRevenue: genres.reduce((sum, genre) => sum + genre.revenue, 0),
    aiConfidence: 89.7
  }), [genres]);

  // Initialize Data
  useEffect(() => {
    setNewsletters([
      {
        id: 1,
        genre: 'storyteller',
        title: 'Vulnerable Hours: The Confessional Folk Revolution',
        date: '2025-07-30',
        status: 'published',
        engagement: { opens: 6274, clicks: 2847, shares: 456 },
        featuredArtist: 'Luna Sawyer',
        aiConfidence: 94,
        isDemoContent: true
      },
      {
        id: 2,
        genre: 'voltage',
        title: 'Underground Beats Rising to the Surface',
        date: '2025-07-29',
        status: 'scheduled',
        engagement: { opens: 0, clicks: 0, shares: 0 },
        featuredArtist: 'Crystal Synth',
        aiConfidence: 87
      }
    ]);
  }, []);

  // Placeholder content for other tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardContent 
            dashboardStats={dashboardStats}
            genres={genres}
            setShowCreateModal={setShowCreateModal}
            setShowStorytellerDemo={setShowStorytellerDemo}
          />
        );
      case 'newsletters':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Newsletters</h2>
                <p className="text-gray-600 mt-1">Manage your newsletter content and performance</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Newsletter Management</h3>
              <p className="text-gray-600">View and manage all your published and scheduled newsletters</p>
            </div>
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Automation</h2>
                <p className="text-gray-600 mt-1">Configure AI-powered newsletter automation</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automation Settings</h3>
              <p className="text-gray-600">Set up automated newsletter generation and scheduling</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
                <p className="text-gray-600 mt-1">Track performance and engagement metrics</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Detailed insights into newsletter performance and subscriber engagement</p>
            </div>
          </div>
        );
      case 'artists':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Artist Intel</h2>
                <p className="text-gray-600 mt-1">AI-powered artist discovery and intelligence</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Artist Intelligence</h3>
              <p className="text-gray-600">Discover emerging artists and track industry trends</p>
            </div>
          </div>
        );
      case 'discovery':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Discovery</h2>
                <p className="text-gray-600 mt-1">Explore new music and trending content</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Music Discovery</h3>
              <p className="text-gray-600">Find new artists and tracks across all genres</p>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
                <p className="text-gray-600 mt-1">Platform administration and settings</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Administration</h3>
              <p className="text-gray-600">Manage platform settings, users, and configurations</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8">
        {renderTabContent()}
      </main>

      <CreateModal 
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        genres={genres}
      />

      <StorytellerDemo 
        showStorytellerDemo={showStorytellerDemo}
        setShowStorytellerDemo={setShowStorytellerDemo}
      />
    </div>
  );
};

export default TrueFansNewsletterPlatform;
