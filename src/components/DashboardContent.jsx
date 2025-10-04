import React from 'react';
import { 
  PlusIcon, 
  UserGroupIcon, 
  MusicalNoteIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  TrendingUpIcon, 
  SparklesIcon,
  PlayIcon 
} from './Icons';

const DashboardContent = ({ 
  dashboardStats, 
  genres, 
  setShowCreateModal, 
  setShowStorytellerDemo 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">12 specialized newsletters covering music genres, songwriting, and business</p>
      </div>
      <button 
        onClick={() => setShowCreateModal(true)}
        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
      >
        <PlusIcon />
        <span>Create Newsletter</span>
      </button>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalSubscribers.toLocaleString()}</p>
          </div>
          <UserGroupIcon className="h-8 w-8 text-orange-600" />
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-green-600 text-sm font-medium">+{dashboardStats.weeklyGrowth.toFixed(1)}%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Newsletter Types</p>
            <p className="text-3xl font-bold text-gray-900">{genres.length}</p>
          </div>
          <MusicalNoteIcon className="h-8 w-8 text-orange-600" />
        </div>
        <div className="mt-4">
          <span className="text-blue-600 text-sm font-medium">Daily + Weekend</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
            <p className="text-3xl font-bold text-gray-900">${(dashboardStats.totalRevenue / 1000).toFixed(0)}K</p>
          </div>
          <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-green-600 text-sm font-medium">+23.4%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">AI Confidence</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.aiConfidence}%</p>
          </div>
          <ChartBarIcon className="h-8 w-8 text-orange-600" />
        </div>
        <div className="mt-4">
          <span className="text-blue-600 text-sm font-medium">High Quality</span>
        </div>
      </div>
    </div>

    {/* Newsletter Grid */}
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Newsletter Network</h3>
        <p className="text-gray-600 mt-1">Specialized music intelligence newsletters</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map(genre => (
            <div key={genre.id} className="relative group">
              <div className={`${genre.color} rounded-lg p-4 text-white cursor-pointer transition-all hover:scale-105 ${
                genre.featured ? 'ring-2 ring-yellow-400' : ''
              }`}>
                {genre.featured && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-3 h-3 text-yellow-800" />
                  </div>
                )}
                
                {genre.demoAvailable && (
                  <div className="absolute top-2 right-2 bg-white/20 rounded-full px-2 py-1">
                    <span className="text-xs font-bold">DEMO</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{genre.emoji}</span>
                  <div className="text-right">
                    <div className="text-xs opacity-75">{genre.day}</div>
                    <div className="text-xs opacity-75">{genre.time}</div>
                  </div>
                </div>
                
                <h4 className="font-bold text-lg mb-1">{genre.name}</h4>
                <p className="text-xs opacity-90 mb-2">{genre.label}</p>
                <p className="text-xs opacity-75 mb-3 line-clamp-2">{genre.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{genre.subscribers.toLocaleString()}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {genre.engagement.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-white h-1 rounded-full" 
                      style={{ width: `${Math.min(genre.engagement, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span>+{genre.growth.toFixed(1)}%</span>
                    <span>${(genre.revenue / 1000).toFixed(0)}K</span>
                  </div>
                </div>

                {genre.demoAvailable && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <button 
                      onClick={() => setShowStorytellerDemo(true)}
                      className="w-full bg-white/20 hover:bg-white/30 rounded px-3 py-2 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                    >
                      <PlayIcon className="w-3 h-3" />
                      <span>Try Demo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardContent;
