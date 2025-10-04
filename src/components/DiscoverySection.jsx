import React, { useState } from 'react';
import { SparklesIcon, PlayIcon, MusicalNoteIcon } from './Icons';

const DiscoverySection = () => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTracks = [
    {
      id: 1,
      title: 'Midnight Coffee Shop',
      artist: 'Luna Sawyer',
      genre: 'Singer-Songwriter',
      plays: 23847,
      trend: '+156%',
      trendColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Neon Dreams',
      artist: 'Crystal Synth',
      genre: 'Electronic',
      plays: 45632,
      trend: '+89%',
      trendColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'City Lights',
      artist: 'Metro Marcus',
      genre: 'Hip-Hop',
      plays: 67234,
      trend: '+124%',
      trendColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'Summer Breeze',
      artist: 'Indie Hearts',
      genre: 'Indie',
      plays: 19456,
      trend: '+78%',
      trendColor: 'text-green-600'
    },
    {
      id: 5,
      title: 'Electric Soul',
      artist: 'Rhythm Chase',
      genre: 'R&B',
      plays: 34129,
      trend: '+92%',
      trendColor: 'text-green-600'
    }
  ];

  const emergingPlaylists = [
    {
      id: 1,
      name: 'Bedroom Folk Rising',
      curator: 'Spotify Editorial',
      tracks: 42,
      followers: '12.3K',
      genre: 'Singer-Songwriter'
    },
    {
      id: 2,
      name: 'Underground Heat',
      curator: 'Apple Music',
      tracks: 35,
      followers: '8.7K',
      genre: 'Hip-Hop'
    },
    {
      id: 3,
      name: 'Synth Wave Future',
      curator: 'Independent',
      tracks: 28,
      followers: '15.2K',
      genre: 'Electronic'
    }
  ];

  const trendingHashtags = [
    { tag: '#BedroomPop', posts: '2.3M', growth: '+34%' },
    { tag: '#IndieDiscovery', posts: '1.8M', growth: '+28%' },
    { tag: '#NewMusicFriday', posts: '5.6M', growth: '+19%' },
    { tag: '#EmergingArtist', posts: '987K', growth: '+45%' }
  ];

  const genres = ['all', 'Singer-Songwriter', 'Hip-Hop', 'Electronic', 'R&B', 'Indie', 'Pop', 'Rock'];

  const filteredTracks = trendingTracks.filter(track => {
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    const matchesSearch = searchQuery === '' ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Discovery</h2>
          <p className="text-gray-600 mt-1">Explore new music and trending content</p>
        </div>
      </div>

      {/* AI Discovery Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex items-start space-x-4">
          <SparklesIcon className="w-8 h-8 mt-1" />
          <div>
            <h3 className="text-2xl font-bold mb-2">AI-Powered Music Discovery</h3>
            <p className="text-blue-50 mb-4">
              Real-time tracking of emerging trends across all major platforms. Our AI monitors streaming data,
              social media engagement, and playlist additions to surface the next big hits before they go mainstream.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-blue-100">Sources Monitored</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-blue-100">Real-Time Updates</div>
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-blue-100">Prediction Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks or artists..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trending Tracks */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Trending Tracks</h3>
          <p className="text-gray-600 mt-1">Most rapidly growing tracks this week</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTracks.map((track, index) => (
            <div key={track.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{track.title}</h4>
                  <p className="text-sm text-gray-600">{track.artist}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Genre</div>
                  <div className="text-sm font-medium text-gray-900">{track.genre}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Monthly Plays</div>
                  <div className="text-sm font-bold text-gray-900">{track.plays.toLocaleString()}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Growth</div>
                  <div className={`text-sm font-bold ${track.trendColor}`}>{track.trend}</div>
                </div>

                <button className="p-3 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors">
                  <PlayIcon className="w-5 h-5 text-orange-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Emerging Playlists */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Emerging Playlists</h3>
            <p className="text-gray-600 mt-1">Curated playlists gaining momentum</p>
          </div>

          <div className="divide-y divide-gray-200">
            {emergingPlaylists.map(playlist => (
              <div key={playlist.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <MusicalNoteIcon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{playlist.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{playlist.curator}</p>

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">{playlist.tracks} tracks</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600">{playlist.followers} followers</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600">{playlist.genre}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Trending Hashtags</h3>
            <p className="text-gray-600 mt-1">Popular tags across social platforms</p>
          </div>

          <div className="p-6 space-y-4">
            {trendingHashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-gray-900 text-lg">{hashtag.tag}</div>
                  <div className="text-sm text-gray-600">{hashtag.posts} posts</div>
                </div>

                <div className="text-right">
                  <div className="text-green-600 font-bold">{hashtag.growth}</div>
                  <div className="text-xs text-gray-600">growth</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Insights */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Insights</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">🎵</span>
              <div className="font-bold text-green-900">Spotify</div>
            </div>
            <p className="text-sm text-green-800">
              "Bedroom Folk" playlists seeing 78% increase in saves. Singer-songwriter genre showing strong momentum.
            </p>
          </div>

          <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">📱</span>
              <div className="font-bold text-pink-900">TikTok</div>
            </div>
            <p className="text-sm text-pink-800">
              Acoustic covers and raw vocal performances trending. #BedroomPop hashtag up 34% this week.
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">📻</span>
              <div className="font-bold text-blue-900">Apple Music</div>
            </div>
            <p className="text-sm text-blue-800">
              Editorial playlists adding more independent artists. "New Artist Spotlight" features up 42%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverySection;
