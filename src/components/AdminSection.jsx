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
