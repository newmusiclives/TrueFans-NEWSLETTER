import React, { useState, useEffect, useMemo } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import DashboardContent from './components/DashboardContent';
import NewslettersSection from './components/NewslettersSection';
import AutomationSection from './components/AutomationSection';
import AnalyticsSection from './components/AnalyticsSection';
import ArtistIntelSection from './components/ArtistIntelSection';
import DiscoverySection from './components/DiscoverySection';
import AdminSection from './components/AdminSection';
import StorytellerDemo from './components/StorytellerDemo';
import CreateModal from './components/CreateModal';
import { useGenreData } from './hooks/useGenreData';

const TrueFansNewsletterPlatform = () => {
  const [activeTab, setActiveTab] = useState('home');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage genres={genres} setActiveTab={setActiveTab} />;
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
        return <NewslettersSection />;
      case 'automation':
        return <AutomationSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'artists':
        return <ArtistIntelSection />;
      case 'discovery':
        return <DiscoverySection />;
      case 'admin':
        return <AdminSection />;
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
