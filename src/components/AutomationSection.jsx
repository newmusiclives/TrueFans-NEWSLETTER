import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon, CheckIcon } from './Icons';

const AutomationSection = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const { data } = await supabase
        .from('newsletters')
        .select('*')
        .order('name');

      if (data) setNewsletters(data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (newsletterId, currentStatus) => {
    setSaving(true);
    try {
      await supabase
        .from('newsletters')
        .update({ is_active: !currentStatus })
        .eq('id', newsletterId);

      setNewsletters(prev =>
        prev.map(n =>
          n.id === newsletterId ? { ...n, is_active: !currentStatus } : n
        )
      );
    } catch (error) {
      console.error('Error updating automation:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeCount = newsletters.filter(n => n.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Automation</h2>
          <p className="text-gray-600 mt-1">Configure AI-powered newsletter automation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Active Newsletters</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{activeCount}</div>
          <div className="text-sm text-gray-500 mt-1">of {newsletters.length} total</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Automation Status</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {activeCount > 0 ? 'Active' : 'Paused'}
          </div>
          <div className="text-sm text-gray-500 mt-1">AI generation enabled</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Weekly Sends</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{activeCount * 1}</div>
          <div className="text-sm text-gray-500 mt-1">estimated per week</div>
        </div>
      </div>

      {/* Automation Info */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">How Automation Works</h3>
            <p className="text-blue-800 text-sm mb-3">
              Our AI system automatically generates newsletter content based on real-time data from music platforms,
              social media, and industry sources. Each newsletter runs on its configured schedule.
            </p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• AI scans 50,000+ sources daily for trending content</li>
              <li>• Pattern recognition identifies emerging artists and trends</li>
              <li>• Content is auto-generated and scheduled for delivery</li>
              <li>• Quality assurance checks ensure high confidence scores</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Automation Controls */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Newsletter Automation</h3>
          <p className="text-gray-600 mt-1">Enable or disable automated content generation per newsletter</p>
        </div>

        <div className="divide-y divide-gray-200">
          {newsletters.map(newsletter => (
            <div key={newsletter.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{newsletter.emoji}</span>
                  <div>
                    <h4 className="font-bold text-gray-900">{newsletter.name}</h4>
                    <p className="text-sm text-gray-600">{newsletter.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled: {newsletter.schedule_day}s at {newsletter.schedule_time}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleAutomation(newsletter.id, newsletter.is_active)}
                  disabled={saving}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    newsletter.is_active ? 'bg-green-600' : 'bg-gray-300'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      newsletter.is_active ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {newsletter.is_active && (
                <div className="mt-4 ml-16 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-sm text-green-800">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Active:</span>
                    <span>AI will generate and schedule content automatically</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Global Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="font-medium text-gray-900">AI Confidence Threshold</div>
              <div className="text-sm text-gray-600">Minimum confidence score to auto-publish</div>
            </div>
            <div className="text-lg font-bold text-gray-900">85%</div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="font-medium text-gray-900">Content Generation Window</div>
              <div className="text-sm text-gray-600">Hours before scheduled send time</div>
            </div>
            <div className="text-lg font-bold text-gray-900">24h</div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-900">Quality Review</div>
              <div className="text-sm text-gray-600">Human review before sending</div>
            </div>
            <div className="text-lg font-bold text-green-600">Enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationSection;
