import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const FeatureGate = ({ children, requiredRole = 'premium', fallback }) => {
  const { hasAccess, user } = useAuth();

  if (!user) {
    return fallback || (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h3>
        <p className="text-gray-600 mb-6">
          Please sign in to access this feature.
        </p>
      </div>
    );
  }

  if (!hasAccess(requiredRole)) {
    return fallback || (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⭐</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Feature</h3>
        <p className="text-gray-600 mb-6">
          This feature requires a {requiredRole === 'enterprise' ? 'Enterprise' : 'Premium'} subscription.
          Upgrade your plan to unlock advanced analytics, automation, and more.
        </p>
        <button
          onClick={() => window.location.hash = '#pricing'}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
        >
          View Pricing
        </button>
      </div>
    );
  }

  return children;
};

export default FeatureGate;
