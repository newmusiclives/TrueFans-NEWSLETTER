import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon, TrendingUpIcon } from './Icons';

const ArtistIntelSection = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('confidence');

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const { data } = await supabase
        .from('discovered_artists')
        .select('*')
        .order('ai_confidence', { ascending: false });

      if (data) setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = [...new Set(artists.map(a => a.genre))];

  const filteredArtists = artists
    .filter(artist => {
      if (selectedGenre !== 'all' && artist.genre !== selectedGenre) return false;
      if (selectedStatus !== 'all' && artist.status !== selectedStatus) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return (b.ai_confidence || 0) - (a.ai_confidence || 0);
        case 'growth':
          return (b.growth_rate || 0) - (a.growth_rate || 0);
        case 'listeners':
          return (b.monthly_listeners || 0) - (a.monthly_listeners || 0);
        case 'recent':
          return new Date(b.discovery_date) - new Date(a.discovery_date);
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'featured': return 'bg-yellow-100 text-yellow-800';
      case 'tracked': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Artist Intel</h2>
          <p className="text-gray-600 mt-1">AI-powered artist discovery and intelligence</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Total Artists</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{artists.length}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Featured</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">
            {artists.filter(a => a.status === 'featured').length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Tracked</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {artists.filter(a => a.status === 'tracked').length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Avg Confidence</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {artists.length > 0
              ? (artists.reduce((sum, a) => sum + (a.ai_confidence || 0), 0) / artists.length).toFixed(1)
              : 0}%
          </div>
        </div>
      </div>

      {/* AI Discovery Info */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="w-6 h-6 text-orange-600 mt-1" />
          <div>
            <h3 className="font-bold text-orange-900 mb-2">How Artist Intel Works</h3>
            <p className="text-orange-800 text-sm mb-4">
              Our AI system scans 50,000+ sources daily across Spotify, Apple Music, YouTube, SoundCloud, TikTok,
              Instagram, Twitter/X, and Reddit to discover emerging artists before they hit mainstream. Each artist
              receives an AI confidence score based on multiple growth signals.
            </p>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-orange-900 mb-2 text-sm">Data Sources We Monitor:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-orange-700">
                <div>• Spotify streaming growth patterns</div>
                <div>• TikTok viral moment detection</div>
                <div>• Apple Music playlist additions</div>
                <div>• YouTube view velocity tracking</div>
                <div>• Instagram engagement spikes</div>
                <div>• Reddit community discussions</div>
                <div>• Twitter/X mention frequency</div>
                <div>• SoundCloud discovery trends</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2 text-sm">AI Confidence Score Breakdown:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-orange-700">90-100%</span>
                  <span className="text-green-700 font-medium">High confidence - Ready to feature</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700">80-89%</span>
                  <span className="text-blue-700 font-medium">Strong signal - Track closely</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700">70-79%</span>
                  <span className="text-yellow-700 font-medium">Promising - Monitor growth</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-700">Below 70%</span>
                  <span className="text-gray-700 font-medium">Early stage - Watch for signals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Statuses</option>
              <option value="featured">Featured</option>
              <option value="tracked">Tracked</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="confidence">AI Confidence</option>
              <option value="growth">Growth Rate</option>
              <option value="listeners">Monthly Listeners</option>
              <option value="recent">Recently Discovered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Artists List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Discovered Artists ({filteredArtists.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredArtists.length === 0 ? (
            <div className="p-12 text-center">
              <SparklesIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Artists Found</h3>
              <p className="text-gray-600">
                {selectedGenre !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'AI is discovering new artists daily'}
              </p>
            </div>
          ) : (
            filteredArtists.map(artist => (
              <div key={artist.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{artist.name}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-600">{artist.genre}</span>
                          {artist.location && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-600">📍 {artist.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(artist.status)}`}>
                        {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                      </span>
                    </div>

                    {artist.bio && (
                      <p className="text-gray-700 mb-4">{artist.bio}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Monthly Listeners</div>
                        <div className="text-lg font-bold text-gray-900">
                          {artist.monthly_listeners?.toLocaleString() || 'N/A'}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-600">Growth Rate</div>
                        <div className="text-lg font-bold text-green-600 flex items-center">
                          <TrendingUpIcon className="w-4 h-4 mr-1" />
                          {artist.growth_rate || 0}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-600">AI Confidence</div>
                        <div className={`text-lg font-bold ${getConfidenceColor(artist.ai_confidence)}`}>
                          {artist.ai_confidence || 0}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-600">Discovered</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(artist.discovery_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {artist.metadata && Object.keys(artist.metadata).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">Recent Activity</div>
                        <div className="flex flex-wrap gap-2">
                          {artist.metadata.playlists && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {artist.metadata.playlists} playlist adds
                            </span>
                          )}
                          {artist.metadata.tiktok_views && (
                            <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                              {artist.metadata.tiktok_views} TikTok views
                            </span>
                          )}
                          {artist.metadata.shows && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {artist.metadata.shows} upcoming shows
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistIntelSection;
