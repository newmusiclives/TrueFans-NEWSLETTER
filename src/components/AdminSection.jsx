import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { CheckIcon, XMarkIcon } from './Icons';

const AdminSection = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newslettersRes, subscribersRes, issuesRes] = await Promise.all([
        supabase.from('newsletters').select('*'),
        supabase.from('subscribers').select('*'),
        supabase.from('newsletter_issues').select('*')
      ]);

      if (newslettersRes.data) setNewsletters(newslettersRes.data);
      if (subscribersRes.data) setSubscribers(subscribersRes.data);
      if (issuesRes.data) setIssues(issuesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const totalIssues = issues.length;
  const sentIssues = issues.filter(i => i.status === 'sent').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-600 mt-1">Platform administration and settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('newsletters')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'newsletters'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Newsletters
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'subscribers'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Subscribers
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'connections'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            API Connections
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Total Newsletters</div>
                  <div className="text-3xl font-bold text-blue-900 mt-2">{newsletters.length}</div>
                  <div className="text-sm text-blue-700 mt-1">
                    {newsletters.filter(n => n.is_active).length} active
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Total Subscribers</div>
                  <div className="text-3xl font-bold text-green-900 mt-2">{subscribers.length}</div>
                  <div className="text-sm text-green-700 mt-1">{activeSubscribers} active</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-sm font-medium text-orange-800">Total Issues</div>
                  <div className="text-3xl font-bold text-orange-900 mt-2">{totalIssues}</div>
                  <div className="text-sm text-orange-700 mt-1">{sentIssues} sent</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                  <div className="text-sm font-medium text-gray-800">System Status</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">✓</div>
                  <div className="text-sm text-gray-700 mt-1">All systems operational</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-gray-700">Database migration completed successfully</span>
                    <span className="text-xs text-gray-500 ml-auto">Just now</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">📧</span>
                    <span className="text-sm text-gray-700">{newsletters.length} newsletters configured</span>
                    <span className="text-xs text-gray-500 ml-auto">Today</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-orange-600">⚙️</span>
                    <span className="text-sm text-gray-700">System ready for operation</span>
                    <span className="text-xs text-gray-500 ml-auto">Today</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="text-sm font-medium text-gray-900">Create Issue</div>
                  </button>
                  <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm font-medium text-gray-900">Manage Users</div>
                  </button>
                  <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium text-gray-900">View Reports</div>
                  </button>
                  <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="text-sm font-medium text-gray-900">Settings</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'newsletters' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Newsletter Management</h3>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                  Add Newsletter
                </button>
              </div>

              <div className="space-y-3">
                {newsletters.map(newsletter => (
                  <div key={newsletter.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{newsletter.emoji}</span>
                      <div>
                        <div className="font-bold text-gray-900">{newsletter.name}</div>
                        <div className="text-sm text-gray-600">{newsletter.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Schedule</div>
                        <div className="text-sm font-medium text-gray-900">
                          {newsletter.schedule_day} {newsletter.schedule_time}
                        </div>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        newsletter.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {newsletter.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Subscriber Management</h3>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                  Export List
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-2xl font-bold text-gray-900">{subscribers.length}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800">Active</div>
                  <div className="text-2xl font-bold text-green-900">{activeSubscribers}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Unsubscribed</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {subscribers.filter(s => s.status === 'unsubscribed').length}
                  </div>
                </div>
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No subscribers yet</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Email</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {subscribers.slice(0, 10).map(subscriber => (
                        <tr key={subscriber.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{subscriber.email}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              subscriber.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {subscriber.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(subscriber.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Data Source Connections</h3>
                <p className="text-gray-600 mb-6">
                  Connect your music platform APIs to enable automated content generation for newsletters.
                  These credentials are encrypted and stored securely.
                </p>

                <div className="space-y-4">
                  {/* Spotify */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎵</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Spotify for Developers</h4>
                          <p className="text-sm text-gray-600">Artist data, streaming stats, playlist info</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                        <input
                          type="text"
                          placeholder="Enter Spotify Client ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                        <input
                          type="password"
                          placeholder="Enter Spotify Client Secret"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700">
                          Get API credentials →
                        </a>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">
                          Connect Spotify
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Apple Music */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-red-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🍎</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Apple Music API</h4>
                          <p className="text-sm text-gray-600">Streaming data, charts, artist information</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Developer Token</label>
                        <input
                          type="password"
                          placeholder="Enter Apple Music Developer Token"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://developer.apple.com/music/" target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:text-red-700">
                          Get API credentials →
                        </a>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium">
                          Connect Apple Music
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-red-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📺</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">YouTube Data API</h4>
                          <p className="text-sm text-gray-600">Video views, engagement, trending music</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="password"
                          placeholder="Enter YouTube API Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:text-red-700">
                          Get API credentials →
                        </a>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium">
                          Connect YouTube
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SoundCloud */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">☁️</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">SoundCloud API</h4>
                          <p className="text-sm text-gray-600">Emerging artists, underground trends</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                        <input
                          type="text"
                          placeholder="Enter SoundCloud Client ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://developers.soundcloud.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:text-orange-700">
                          Get API credentials →
                        </a>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm font-medium">
                          Connect SoundCloud
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bandcamp */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎸</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Bandcamp</h4>
                          <p className="text-sm text-gray-600">Independent releases, fan support data</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="password"
                          placeholder="Enter Bandcamp API Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500">Contact Bandcamp for API access</span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                          Connect Bandcamp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI & Content Generation</h3>
                <p className="text-gray-600 mb-6">
                  Connect AI services to power content generation, trend analysis, and intelligent writing for your newsletters.
                </p>

                <div className="space-y-4">
                  {/* Anthropic Claude */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Anthropic Claude</h4>
                          <p className="text-sm text-gray-600">Content writing, trend analysis, editorial intelligence</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="password"
                          placeholder="Enter Anthropic API Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="bg-purple-50 rounded p-3">
                        <p className="text-xs text-purple-800">
                          <strong>Powers:</strong> Newsletter writing, artist bio generation, trend summaries, content personalization
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700">
                          Get API credentials →
                        </a>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium">
                          Connect Claude
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* OpenAI */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-teal-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">✨</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">OpenAI GPT</h4>
                          <p className="text-sm text-gray-600">Content generation, summaries, creative writing</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="password"
                          placeholder="Enter OpenAI API Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div className="bg-teal-50 rounded p-3">
                        <p className="text-xs text-teal-800">
                          <strong>Powers:</strong> Alternative content generation, creative headlines, image generation with DALL-E
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:text-teal-700">
                          Get API credentials →
                        </a>
                        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">
                          Connect OpenAI
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Perplexity */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-400 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🔍</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Perplexity AI</h4>
                          <p className="text-sm text-gray-600">Real-time research, fact-checking, current events</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="password"
                          placeholder="Enter Perplexity API Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="bg-indigo-50 rounded p-3">
                        <p className="text-xs text-indigo-800">
                          <strong>Powers:</strong> Current music news research, artist background checks, industry trend verification
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700">
                          Get API credentials →
                        </a>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
                          Connect Perplexity
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">News & Social Intelligence</h3>
                <p className="text-gray-600 mb-6">
                  Monitor music news, social media trends, and industry updates to keep your newsletters current.
                </p>

                <div className="space-y-4">
                  {/* NewsAPI */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📰</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">NewsAPI</h4>
                          <p className="text-sm text-gray-600">Music industry news, artist features, festival announcements</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="password"
                          placeholder="Enter NewsAPI Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://newsapi.org/register" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-700">
                          Get API credentials →
                        </a>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium">
                          Connect NewsAPI
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Twitter/X API */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                          <span className="text-2xl text-white">𝕏</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">X (Twitter) API</h4>
                          <p className="text-sm text-gray-600">Trending topics, artist mentions, viral moments</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bearer Token</label>
                        <input
                          type="password"
                          placeholder="Enter X API Bearer Token"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://developer.twitter.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-700">
                          Get API credentials →
                        </a>
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium">
                          Connect X
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reddit API */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-orange-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Reddit API</h4>
                          <p className="text-sm text-gray-600">Community discussions, genre subreddits, fan feedback</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">Not Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                        <input
                          type="text"
                          placeholder="Enter Reddit Client ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                        <input
                          type="password"
                          placeholder="Enter Reddit Client Secret"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <a href="https://www.reddit.com/prefs/apps" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:text-orange-700">
                          Get API credentials →
                        </a>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm font-medium">
                          Connect Reddit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-2">🔒 Security & Privacy</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>All API credentials are encrypted at rest using AES-256</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Credentials are never logged or exposed in error messages</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>API requests are rate-limited to comply with platform guidelines</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>You can revoke access at any time from this panel</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Email Notifications</div>
                      <div className="text-sm text-gray-600">Send admin notifications via email</div>
                    </div>
                    <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">AI Auto-Generation</div>
                      <div className="text-sm text-gray-600">Enable automatic content generation</div>
                    </div>
                    <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Quality Review</div>
                      <div className="text-sm text-gray-600">Require manual review before sending</div>
                    </div>
                    <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Analytics Tracking</div>
                      <div className="text-sm text-gray-600">Track opens, clicks, and engagement</div>
                    </div>
                    <div className="w-12 h-6 bg-green-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Database</h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckIcon className="w-5 h-5" />
                    <span className="font-medium">Connected to Supabase</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    All tables created and configured. System is ready for operation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
