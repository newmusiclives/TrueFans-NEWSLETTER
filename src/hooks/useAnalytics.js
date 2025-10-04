import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAnalytics = (timeRange = 30) => {
  const [analytics, setAnalytics] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

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

      if (newslettersRes.error) throw newslettersRes.error;
      if (analyticsRes.error) throw analyticsRes.error;

      setNewsletters(newslettersRes.data || []);
      setAnalytics(analyticsRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMetrics = () => {
    const totalOpens = analytics.reduce((sum, item) => sum + (item.analytics?.opens || 0), 0);
    const totalClicks = analytics.reduce((sum, item) => sum + (item.analytics?.clicks || 0), 0);
    const totalShares = analytics.reduce((sum, item) => sum + (item.analytics?.shares || 0), 0);
    const totalUnsubscribes = analytics.reduce((sum, item) => sum + (item.analytics?.unsubscribes || 0), 0);

    const avgOpenRate = analytics.length > 0
      ? (totalOpens / analytics.length / 100).toFixed(1)
      : 0;
    const avgClickRate = totalOpens > 0
      ? ((totalClicks / totalOpens) * 100).toFixed(1)
      : 0;

    return {
      totalOpens,
      totalClicks,
      totalShares,
      totalUnsubscribes,
      avgOpenRate,
      avgClickRate,
      issuesSent: analytics.length
    };
  };

  return {
    analytics,
    newsletters,
    loading,
    error,
    refresh: fetchAnalytics,
    metrics: getMetrics(),
  };
};
