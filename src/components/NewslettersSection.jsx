import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { MusicalNoteIcon, CalendarIcon, CheckIcon } from './Icons';

const NewslettersSection = () => {
  const [issues, setIssues] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsletter, setSelectedNewsletter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newslettersRes, issuesRes] = await Promise.all([
        supabase.from('newsletters').select('*').order('name'),
        supabase
          .from('newsletter_issues')
          .select(`
            *,
            newsletter:newsletters(name, emoji, color),
            analytics:newsletter_analytics(opens, clicks, shares)
          `)
          .order('created_at', { ascending: false })
      ]);

      if (newslettersRes.data) setNewsletters(newslettersRes.data);
      if (issuesRes.data) setIssues(issuesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (selectedNewsletter !== 'all' && issue.newsletter_id !== selectedNewsletter) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return '✓';
      case 'scheduled': return '⏰';
      case 'draft': return '📝';
      default: return '•';
    }
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
          <h2 className="text-3xl font-bold text-gray-900">Newsletters</h2>
          <p className="text-gray-600 mt-1">Manage your newsletter content and performance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Type</label>
            <select
              value={selectedNewsletter}
              onChange={(e) => setSelectedNewsletter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Newsletters</option>
              {newsletters.map(newsletter => (
                <option key={newsletter.id} value={newsletter.id}>
                  {newsletter.emoji} {newsletter.name}
                </option>
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
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Total Issues</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{issues.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Sent</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {issues.filter(i => i.status === 'sent').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Scheduled</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {issues.filter(i => i.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm font-medium text-gray-600">Drafts</div>
          <div className="text-3xl font-bold text-gray-600 mt-2">
            {issues.filter(i => i.status === 'draft').length}
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Newsletter Issues ({filteredIssues.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredIssues.length === 0 ? (
            <div className="p-12 text-center">
              <MusicalNoteIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Issues Found</h3>
              <p className="text-gray-600">
                {selectedNewsletter !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start creating newsletter issues to see them here'}
              </p>
            </div>
          ) : (
            filteredIssues.map(issue => (
              <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{issue.newsletter?.emoji}</span>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{issue.title}</h4>
                        <p className="text-sm text-gray-600">{issue.newsletter?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {issue.status === 'sent' && issue.sent_at
                            ? `Sent ${new Date(issue.sent_at).toLocaleDateString()}`
                            : issue.status === 'scheduled' && issue.scheduled_for
                            ? `Scheduled for ${new Date(issue.scheduled_for).toLocaleDateString()}`
                            : `Created ${new Date(issue.created_at).toLocaleDateString()}`}
                        </span>
                      </div>

                      {issue.analytics && issue.status === 'sent' && (
                        <div className="flex items-center space-x-3">
                          <span>👁 {issue.analytics.opens || 0} opens</span>
                          <span>🖱 {issue.analytics.clicks || 0} clicks</span>
                          <span>📤 {issue.analytics.shares || 0} shares</span>
                        </div>
                      )}

                      {issue.ai_confidence && (
                        <span className="text-blue-600">
                          AI: {issue.ai_confidence}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      <span className="mr-1">{getStatusIcon(issue.status)}</span>
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </span>
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

export default NewslettersSection;
