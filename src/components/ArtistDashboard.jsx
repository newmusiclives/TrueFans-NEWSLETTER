import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { PlusIcon, CheckIcon } from './Icons';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [artistProfile, setArtistProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContentForm, setShowContentForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'track_release',
    target_newsletters: []
  });

  useEffect(() => {
    loadArtistData();
  }, [user]);

  const loadArtistData = async () => {
    if (!user) return;

    try {
      const [profileRes, contentRes, subscribersRes, revenueRes] = await Promise.all([
        supabase
          .from('artist_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('artist_content')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('artist_subscribers')
          .select('*')
          .eq('status', 'active'),
        supabase
          .from('artist_revenue')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (profileRes.data) setArtistProfile(profileRes.data);
      if (contentRes.data) setContent(contentRes.data);
      if (subscribersRes.data) setSubscribers(subscribersRes.data);
      if (revenueRes.data) setRevenue(revenueRes.data);
    } catch (error) {
      console.error('Error loading artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContent = async (e) => {
    e.preventDefault();
    if (!artistProfile) return;

    try {
      const { error } = await supabase.from('artist_content').insert({
        artist_id: artistProfile.id,
        ...formData
      });

      if (error) throw error;

      setShowContentForm(false);
      setFormData({ title: '', content: '', content_type: 'track_release', target_newsletters: [] });
      loadArtistData();
    } catch (error) {
      console.error('Error submitting content:', error);
      alert('Error submitting content. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!artistProfile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Artist Profile</h3>
        <p className="text-gray-600 mb-6">
          Set up your artist profile to start submitting content to newsletters.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Create Profile
        </button>
      </div>
    );
  }

  const totalSubscribers = subscribers.length;
  const paidSubscribers = subscribers.filter(s => s.subscription_tier === 'paid').length;
  const monthlyRevenue = paidSubscribers * 10 * 0.8;
  const pendingContent = content.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Artist Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your content and grow your fanbase</p>
        </div>
        <button
          onClick={() => setShowContentForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon />
          <span>Submit Content</span>
        </button>
      </div>

      {artistProfile && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-bold">{artistProfile.artist_name}</h3>
                {artistProfile.is_verified && (
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">VERIFIED</span>
                )}
              </div>
              <p className="text-blue-100">{artistProfile.genre}</p>
              <p className="text-blue-200 text-sm mt-2">
                {artistProfile.subscription_price === 0 ? 'Free' : '$10/month'} fan subscriptions
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Total Fans</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{totalSubscribers}</div>
          <div className="text-xs text-gray-500 mt-1">{paidSubscribers} paid</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Monthly Revenue</div>
          <div className="text-3xl font-bold text-green-600 mt-2">${monthlyRevenue.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">80% of subscription fees</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Content Submitted</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{content.length}</div>
          <div className="text-xs text-gray-500 mt-1">{pendingContent} pending review</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Newsletter Reach</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">12K+</div>
          <div className="text-xs text-gray-500 mt-1">potential subscribers</div>
        </div>
      </div>

      {showContentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit Content</h3>
            <form onSubmit={handleSubmitContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="track_release">Track Release</option>
                  <option value="show_announcement">Show Announcement</option>
                  <option value="behind_the_scenes">Behind the Scenes</option>
                  <option value="exclusive">Exclusive Content</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContentForm(false)}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Your Content</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {content.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No content submitted yet. Start by submitting your first piece!</p>
            </div>
          ) : (
            content.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.content_type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'published'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
