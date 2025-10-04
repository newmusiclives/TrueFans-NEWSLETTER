import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setSubscription(null);
        }
      })();
    });

    return () => subscription?.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId) => {
    try {
      const [profileRes, subscriptionRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('user_subscriptions')
          .select('*, plan:subscription_plans(*)')
          .eq('user_id', userId)
          .eq('status', 'active')
          .maybeSingle()
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (subscriptionRes.data) setSubscription(subscriptionRes.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setSubscription(null);
  };

  const hasAccess = (requiredRole) => {
    if (!profile) return false;

    const roleHierarchy = {
      subscriber: 0,
      premium: 1,
      enterprise: 2,
      admin: 3
    };

    const userLevel = roleHierarchy[profile.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  const isPremiumOrHigher = () => hasAccess('premium');
  const isEnterpriseOrHigher = () => hasAccess('enterprise');
  const isAdmin = () => profile?.role === 'admin';

  const value = {
    user,
    profile,
    subscription,
    loading,
    signUp,
    signIn,
    signOut,
    hasAccess,
    isPremiumOrHigher,
    isEnterpriseOrHigher,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
