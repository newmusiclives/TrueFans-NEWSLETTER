import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import PricingPage from './components/PricingPage';
import DashboardContent from './components/DashboardContent';
import ArtistDashboard from './components/ArtistDashboard';
import NewslettersSection from './components/NewslettersSection';
import AutomationSection from './components/AutomationSection';
import AnalyticsSection from './components/AnalyticsSection';
import ArtistIntelSection from './components/ArtistIntelSection';
import DiscoverySection from './components/DiscoverySection';
import AdminSection from './components/AdminSection';
import StorytellerDemo from './components/StorytellerDemo';
import CreateModal from './components/CreateModal';
import AuthModal from './components/AuthModal';
import { useGenreData } from './hooks/useGenreData';

const TrueFansNewsletterPlatform = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [newsletters, setNewsletters] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStorytellerDemo, setShowStorytellerDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const { user, loading: authLoading, isPremiumOrHigher } = useAuth();
  const genres = useGenreData();

  const handleShowAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const protectedTabs = ['dashboard', 'newsletters', 'automation', 'analytics', 'artists', 'discovery', 'admin'];

  const handleTabChange = (tab) => {
    if (protectedTabs.includes(tab) && !user) {
      handleShowAuth('signin');
      return;
    }
    setActiveTab(tab);
  };

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
    if (authLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomePage genres={genres} setActiveTab={handleTabChange} onShowAuth={handleShowAuth} />;
      case 'pricing':
        return <PricingPage onShowAuth={handleShowAuth} />;
      case 'dashboard':
        return (
          <DashboardContent
            dashboardStats={dashboardStats}
            genres={genres}
            setShowCreateModal={setShowCreateModal}
            setShowStorytellerDemo={setShowStorytellerDemo}
          />
        );
      case 'artist-dashboard':
        return <ArtistDashboard />;
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
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onShowAuth={handleShowAuth}
      />

      <main className="flex-1 p-8">
        {renderTabContent()}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

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
