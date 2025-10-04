import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  SpeakerWaveIcon,
  CurrencyDollarIcon,
  MusicalNoteIcon
} from './Icons';

const Navigation = ({ activeTab, setActiveTab, onShowAuth }) => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
    {/* Mobile menu button */}
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>

    {/* Overlay */}
    {isOpen && (
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsOpen(false)}
      />
    )}

    <nav className={`bg-white shadow-sm border-r border-gray-200 w-64 flex flex-col fixed lg:relative h-full z-40 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <SpeakerWaveIcon className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TrueFans NEWSLETTERS™</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-2">
        {[
          { id: 'home', label: 'Home', icon: HomeIcon },
          { id: 'pricing', label: 'Pricing', icon: CurrencyDollarIcon },
          { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, requiresAuth: true },
          { id: 'artist-dashboard', label: 'Artist Hub', icon: MusicalNoteIcon, requiresAuth: true, artistOnly: true },
          { id: 'newsletters', label: 'Newsletters', icon: DocumentTextIcon, requiresAuth: true },
          { id: 'automation', label: 'Automation', icon: CogIcon, requiresAuth: true },
          { id: 'analytics', label: 'Analytics', icon: ChartBarIcon, requiresAuth: true },
          { id: 'artists', label: 'Artist Intel', icon: UserGroupIcon, requiresAuth: true },
          { id: 'discovery', label: 'Discovery', icon: MagnifyingGlassIcon, requiresAuth: true },
          { id: 'admin', label: 'Admin Portal', icon: ShieldCheckIcon, requiresAuth: true }
        ].filter(item => {
          if (item.artistOnly) {
            return profile?.role === 'artist';
          }
          return true;
        }).map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === item.id
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon />
            <span className="font-medium">{item.label}</span>
            {item.requiresAuth && !user && (
              <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pro</span>
            )}
          </button>
        )).map((element, index) => (
          <div key={index} onClick={() => setIsOpen(false)}>
            {element}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || user.email}
              </div>
              <div className="text-xs text-gray-600 truncate">{user.email}</div>
              {profile && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 capitalize">
                    {profile.role}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={signOut}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => onShowAuth('signin')}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onShowAuth('signup')}
              className="w-full px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 border border-orange-300 rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navigation;
