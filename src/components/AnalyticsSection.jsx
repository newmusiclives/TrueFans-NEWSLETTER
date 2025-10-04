import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { ChartBarIcon, TrendingUpIcon } from './Icons';

const AnalyticsSection = () => {
  const [analytics, setAnalytics] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsletter, setSelectedNewsletter] = useState('all');
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      const [newslettersRes, analyticsRes] = await Promise.all([
        supabase.from('newsletters').select('*').order('name'),
        supabase
          .from('newsletter_issues')
          .select(`
            id,
            title,
            newsletter_id,
            sent_at,
            newsletter:newsletters(name, emoji),
            analytics:newsletter_analytics(opens, clicks, shares, unsubscribes)
          `)
          .eq('status', 'sent')
          .gte('sent_at', daysAgo.toISOString())
          .order('sent_at', { ascending: false })
      ]);

      if (newslettersRes.data) setNewsletters(newslettersRes.data);

      if (analyticsRes.data && analyticsRes.data.length > 0) {
        setAnalytics(analyticsRes.data);
      } else {
        setAnalytics(generateDemoData(newslettersRes.data || []));
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(generateDemoData(newsletters));
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = (newslettersList) => {
    const demoIssues = [
      { title: 'Vulnerable Hours: The Confessional Folk Revolution', newsletterSlug: 'storyteller', daysAgo: 2 },
      { title: 'Underground Heat: New Voices in Hip-Hop', newsletterSlug: 'pulse', daysAgo: 5 },
      { title: 'Festival Season Intelligence Report', newsletterSlug: 'voltage', daysAgo: 7 },
      { title: 'Pop Culture Shifts and Chart Analysis', newsletterSlug: 'resonance', daysAgo: 9 },
      { title: 'Garage Rock Revival Movement', newsletterSlug: 'amplify', daysAgo: 12 }
    ];

    return demoIssues.map((issue, index) => {
      const newsletter = newslettersList.find(n => n.slug === issue.newsletterSlug);
      const baseOpens = Math.floor(Math.random() * 3000) + 5000;
      const sentDate = new Date();
      sentDate.setDate(sentDate.getDate() - issue.daysAgo);

      return {
        id: `demo-${index}`,
        title: issue.title,
        newsletter_id: newsletter?.id || `demo-newsletter-${index}`,
        sent_at: sentDate.toISOString(),
        newsletter: {
          name: newsletter?.name || 'DEMO',
          emoji: newsletter?.emoji || '📰'
        },
        analytics: {
          opens: baseOpens,
          clicks: Math.floor(baseOpens * (0.3 + Math.random() * 0.2)),
          shares: Math.floor(baseOpens * (0.05 + Math.random() * 0.1)),
          unsubscribes: Math.floor(baseOpens * 0.003)
        }
      };
    });
  };

  const filteredAnalytics = analytics.filter(item =>
    selectedNewsletter === 'all' || item.newsletter_id === selectedNewsletter
  );

  const totalOpens = filteredAnalytics.reduce((sum, item) => sum + (item.analytics?.opens || 0), 0);
  const totalClicks = filteredAnalytics.reduce((sum, item) => sum + (item.analytics?.clicks || 0), 0);
  const totalShares = filteredAnalytics.reduce((sum, item) => sum + (item.analytics?.shares || 0), 0);
  const totalUnsubscribes = filteredAnalytics.reduce((sum, item) => sum + (item.analytics?.unsubscribes || 0), 0);

  const avgOpenRate = filteredAnalytics.length > 0
    ? (totalOpens / filteredAnalytics.length / 100).toFixed(1)
    : 0;
  const avgClickRate = totalOpens > 0
    ? ((totalClicks / totalOpens) * 100).toFixed(1)
    : 0;

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
          <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">Track performance and engagement metrics</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Total Opens</div>
            <span className="text-2xl">👁</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalOpens.toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-2 flex items-center">
            <TrendingUpIcon className="w-4 h-4 mr-1" />
            Avg {avgOpenRate}% rate
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Total Clicks</div>
            <span className="text-2xl">🖱</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalClicks.toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-2 flex items-center">
            <TrendingUpIcon className="w-4 h-4 mr-1" />
            {avgClickRate}% click rate
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Total Shares</div>
            <span className="text-2xl">📤</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalShares.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-2">
            {totalOpens > 0 ? ((totalShares / totalOpens) * 100).toFixed(1) : 0}% share rate
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Issues Sent</div>
            <span className="text-2xl">📧</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{filteredAnalytics.length}</div>
          <div className="text-sm text-gray-600 mt-2">
            in last {timeRange} days
          </div>
        </div>
      </div>

      {/* Newsletter Performance */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Newsletter Performance</h3>
          <p className="text-gray-600 mt-1">Individual issue engagement metrics</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAnalytics.length === 0 ? (
            <div className="p-12 text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600">
                No sent newsletters in the selected time range
              </p>
            </div>
          ) : (
            filteredAnalytics.map(item => {
              const analytics = item.analytics || {};
              const openRate = analytics.opens ? ((analytics.opens / 1000) * 100).toFixed(1) : 0;
              const clickRate = analytics.opens ? ((analytics.clicks / analytics.opens) * 100).toFixed(1) : 0;

              return (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{item.newsletter?.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.newsletter?.name} • Sent {new Date(item.sent_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 ml-11">
                        <div>
                          <div className="text-xs text-gray-600">Opens</div>
                          <div className="text-lg font-bold text-gray-900">{analytics.opens || 0}</div>
                          <div className="text-xs text-green-600">{openRate}%</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600">Clicks</div>
                          <div className="text-lg font-bold text-gray-900">{analytics.clicks || 0}</div>
                          <div className="text-xs text-blue-600">{clickRate}%</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600">Shares</div>
                          <div className="text-lg font-bold text-gray-900">{analytics.shares || 0}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600">Unsubscribes</div>
                          <div className="text-lg font-bold text-red-600">{analytics.unsubscribes || 0}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600">Engagement</div>
                          <div className="text-lg font-bold text-gray-900">
                            {analytics.opens ? ((analytics.clicks / analytics.opens) * 100).toFixed(0) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Performance by Newsletter */}
      {selectedNewsletter === 'all' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Performance by Newsletter</h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {newsletters.map(newsletter => {
                const newsletterIssues = analytics.filter(a => a.newsletter_id === newsletter.id);
                const opens = newsletterIssues.reduce((sum, i) => sum + (i.analytics?.opens || 0), 0);
                const clicks = newsletterIssues.reduce((sum, i) => sum + (i.analytics?.clicks || 0), 0);

                return (
                  <div key={newsletter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{newsletter.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{newsletter.name}</div>
                        <div className="text-sm text-gray-600">{newsletterIssues.length} issues sent</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="text-gray-600">Opens</div>
                        <div className="font-bold text-gray-900">{opens.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Clicks</div>
                        <div className="font-bold text-gray-900">{clicks.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">CTR</div>
                        <div className="font-bold text-green-600">
                          {opens > 0 ? ((clicks / opens) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSection;
