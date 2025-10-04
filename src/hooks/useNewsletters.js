import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useNewsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('newsletters')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setNewsletters(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewsletter = async (newsletter) => {
    try {
      const { data, error: createError } = await supabase
        .from('newsletters')
        .insert([newsletter])
        .select()
        .single();

      if (createError) throw createError;
      setNewsletters((prev) => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const updateNewsletter = async (id, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('newsletters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setNewsletters((prev) =>
        prev.map((n) => (n.id === id ? data : n))
      );
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteNewsletter = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setNewsletters((prev) => prev.filter((n) => n.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  return {
    newsletters,
    loading,
    error,
    refresh: fetchNewsletters,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
  };
};
