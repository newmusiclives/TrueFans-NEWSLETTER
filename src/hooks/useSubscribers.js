import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSubscribers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSubscriber = async (email) => {
    try {
      const { data, error: createError } = await supabase
        .from('subscribers')
        .insert([{ email, status: 'active' }])
        .select()
        .single();

      if (createError) throw createError;
      setSubscribers((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const updateSubscriberStatus = async (id, status) => {
    try {
      const { data, error: updateError } = await supabase
        .from('subscribers')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? data : s))
      );
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const getStats = () => {
    const active = subscribers.filter(s => s.status === 'active').length;
    const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length;
    const bounced = subscribers.filter(s => s.status === 'bounced').length;

    return {
      total: subscribers.length,
      active,
      unsubscribed,
      bounced
    };
  };

  return {
    subscribers,
    loading,
    error,
    refresh: fetchSubscribers,
    createSubscriber,
    updateSubscriberStatus,
    stats: getStats(),
  };
};
